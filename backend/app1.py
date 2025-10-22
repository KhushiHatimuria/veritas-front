# backend/app.py
from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS 
import os

# --- All Necessary Imports ---
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS 
import secrets
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
import joblib
import pandas as pd
import re
import requests
from datetime import datetime,timedelta
from scipy.sparse import hstack
import sqlite3
from snowflake import SnowflakeGenerator
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sqlite3
import secrets  # For generating secure tokens



genai.configure(api_key="AIzaSyA-NpCrHLxZ0kdhDCfXb9PEUsJsG-3TCJU")

# ---------------------------------------------------------
# ✅ Ensure Database Exists
# ---------------------------------------------------------
def get_db_connection():
    """Establishes a connection to the SQLite database."""
    conn = sqlite3.connect('veritas.db')
    conn.row_factory = sqlite3.Row # This allows you to access columns by name
    return conn

app = Flask(__name__)
CORS(app)

# Initialize the Snowflake ID Generator
snowflake_gen = SnowflakeGenerator(1)
# -----------------------------
# Load Model & Preprocessors
# -----------------------------
print("🚀 Loading model and transformers...")
MODEL_DIR = "./models"
model = joblib.load(os.path.join(MODEL_DIR, 'frontend_model.pkl'))
vectorizer = joblib.load(os.path.join(MODEL_DIR, 'frontend_vectorizer.pkl'))
scaler = joblib.load(os.path.join(MODEL_DIR, 'frontend_scaler.pkl'))
numeric_features_list = joblib.load(os.path.join(MODEL_DIR, 'frontend_numeric_features_list.pkl'))
print("✅ Model and transformers loaded successfully.")

# -----------------------------
# Prediction Helper
# -----------------------------
def make_prediction(tweet_text, created_at_str):
    # This function is unchanged
    data = {'text': [tweet_text], 'created_at': [pd.to_datetime(created_at_str)]}
    df = pd.DataFrame(data)
    # ... (feature creation logic is unchanged) ...
    df['text_str'] = df['text'].astype(str)
    df['word_count'] = df['text_str'].apply(lambda x: len(x.split()))
    df['capital_count'] = df['text_str'].apply(lambda x: len(re.findall(r'[A-Z]', x)))
    df['digit_count'] = df['text_str'].apply(lambda x: len(re.findall(r'[0-9]', x)))
    df['hashtag_count'] = df['text_str'].apply(lambda x: len(re.findall(r'#', x)))
    df['url_count'] = df['text_str'].apply(lambda x: len(re.findall(r'http[s]?://', x)))
    df['mention_count'] = df['text_str'].apply(lambda x: len(re.findall(r'@', x)))
    df['exclamation_count'] = df['text_str'].apply(lambda x: len(re.findall(r'!', x)))
    df['question_count'] = df['text_str'].apply(lambda x: len(re.findall(r'\?', x)))
    df['hour_of_day'] = df['created_at'].dt.hour
    df['day_of_week'] = df['created_at'].dt.dayofweek
    X_text_features = vectorizer.transform(df['text'])
    df_numeric = df[numeric_features_list]
    X_numeric_features = scaler.transform(df_numeric)
    X_final = hstack([X_text_features, X_numeric_features])
    prediction = model.predict(X_final)
    proba = model.predict_proba(X_final)
    result = "Human" if prediction[0] == 1 else "Bot"
    confidence = proba[0][prediction[0]]
    return result, confidence



flash_model = genai.GenerativeModel("models/gemini-2.5-flash")
pro_model = genai.GenerativeModel("models/gemini-2.5-pro")


#send_email to email for otp
def send_email(recipient_email, subject, body):
    SMTP_SERVER = 'smtp.gmail.com'
    SMTP_PORT = 587
    EMAIL_ADDRESS ="nishasinha720@gmail.com"
    EMAIL_PASSWORD = "vmtz obdx ctnp wmir"

    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("ERROR: Email credentials are not set in the backend .env file.")
        return

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = recipient_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"Email sent successfully to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
# -----------------------------
# API Routes
# -----------------------------

@app.route('/')
def home():
    return {"message": "Flask API running successfully"}
# --- Predict (AI Bot Detection) ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    tweet_text = data.get('text', '')
    if not tweet_text.strip():
        return jsonify({'error': 'Text cannot be empty'}), 400
    now = datetime.now().isoformat()
    result, confidence = make_prediction(tweet_text, now)
    return jsonify({'prediction': result, 'confidence': float(confidence)})

# --- Register with reCAPTCHA ---
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    captcha_token = data.get('captcha_token')

    secret_key = "6LftQvIrAAAAAHadujBXAYQw44pYG3OMPUbbjxYo"  # <-- make sure this matches your reCAPTCHA site pair

    # --- Validate captcha ---
    if not captcha_token:
        return jsonify({'status': 'error', 'message': 'CAPTCHA token is missing.'}), 400

    verification_url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {'secret': secret_key, 'response': captcha_token}
    response = requests.post(verification_url, data=payload)
    result = response.json()
    print(f"Google reCAPTCHA response: {result}")

    if not result.get('success'):
        return jsonify({'status': 'error', 'message': 'CAPTCHA verification failed. Please try again.'}), 400

    # --- Validate inputs ---
    if not email or not password:
        return jsonify({'status': 'error', 'message': 'Email and password are required'}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'status': 'error', 'message': 'Invalid email format'}), 400

    # --- Hash password ---
    password_hash = generate_password_hash(password)
    new_user_id = next(snowflake_gen)
    conn = None
    # --- Save to DB ---
    try:
        conn = sqlite3.connect('veritas.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (user_id, email, password_hash) VALUES (?, ?, ?)',
            (new_user_id, email, password_hash)
        )
        conn.commit()
        return jsonify({'status': 'success', 'message': 'Account created successfully!', 'user_id': new_user_id}), 201
    except sqlite3.IntegrityError:
        return jsonify({'status': 'error', 'message': 'This email address is already registered'}), 409
    finally:
        if conn:
            conn.close()


# --- Login ---
@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'status': 'error', 'message': 'Email and password are required'}), 400

    conn = None
    try:
        conn = sqlite3.connect('veritas.db')
        cursor = conn.cursor()

        cursor.execute('SELECT user_id, password_hash FROM users WHERE email = ?', (email,))
        user_record = cursor.fetchone()

        if user_record and check_password_hash(user_record[1], password):
            user_id = user_record[0]
            return jsonify({
                'status': 'success',
                'message': 'Login successful!',
                'user_id': user_id
            }), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'status': 'error', 'message': 'An internal error occurred'}), 500
    finally:
        if conn:
            conn.close()


# --- Forgot Password Step 1: Request OTP ---
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'status': 'error', 'message': 'Email is required'}), 400
    conn = get_db_connection()
    user = conn.execute('SELECT user_id FROM users WHERE email = ?', (email,)).fetchone()
    if user:
        otp = str(secrets.randbelow(9000) + 1000)
        hashed_otp = generate_password_hash(otp)
        expiry_time = datetime.now() + timedelta(minutes=10)
        conn.execute(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
            (hashed_otp, expiry_time.isoformat(), email)
        )
        conn.commit()
        # This will send the actual email
        send_email(email, "Your Veritas OTP", f"Your verification code is: {otp}")
        print(f"DEV INFO: OTP for {email} is {otp}")
    conn.close()
    return jsonify({'status': 'success', 'message': 'If an account with that email exists, an OTP has been sent.'}), 200

# --- Forgot Password Step 2: Verify OTP ---
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    if not email or not otp:
        return jsonify({'status': 'error', 'message': 'Email and OTP are required'}), 400
    conn = get_db_connection()
    user = conn.execute(
        'SELECT reset_token, reset_token_expiry FROM users WHERE email = ?', (email,)
    ).fetchone()
    if not user or not user['reset_token']:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Invalid request or OTP already used.'}), 400
    expiry_time = datetime.fromisoformat(user['reset_token_expiry'])
    if datetime.now() > expiry_time:
        conn.close()
        return jsonify({'status': 'error', 'message': 'OTP has expired.'}), 410
    if check_password_hash(user['reset_token'], otp):
        conn.close()
        return jsonify({'status': 'success', 'message': 'OTP verified successfully.'}), 200
    else:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Invalid OTP.'}), 400

# --- Forgot Password Step 3: Reset Password ---
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')
    if not email or not new_password:
        return jsonify({'status': 'error', 'message': 'Email and new password are required'}), 400
    new_password_hash = generate_password_hash(new_password)
    conn = get_db_connection()
    conn.execute(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?',
        (new_password_hash, email)
    )
    conn.commit()
    conn.close()
    return jsonify({'status': 'success', 'message': 'Password has been reset successfully.'}), 200

# ---- Health check ----
@app.route("/api/v1/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Aegis AI Backend"})

# ---- Summarization ----
@app.route("/api/v1/summarize", methods=["POST"])
def summarize():
    try:
        text = request.json.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        prompt = f"Summarize in 3-4 sentences:\n\n{text}"
        response = flash_model.generate_content(prompt)

        return jsonify({"summary": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Sentiment ----
@app.route("/api/v1/sentiment", methods=["POST"])
def sentiment():
    try:
        text = request.json.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        prompt = f"Classify sentiment as Positive, Negative, or Neutral:\n\n{text}"
        response = flash_model.generate_content(prompt)

        return jsonify({"sentiment": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Misinformation ----
@app.route("/api/v1/misinfo", methods=["POST"])
def misinfo():
    try:
        text = request.json.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        prompt = f"""
        Detect misinformation in the following text.
        Classify as:
        - Likely True
        - Possibly Misinformation
        - Needs Verification

        Text: {text}
        """
        response = pro_model.generate_content(prompt)

        return jsonify({"misinfo_analysis": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Image Detection ----
@app.route("/api/v1/detect/image", methods=["POST"])
def detect_image():
    try:
        print("===== Debugging Image Upload =====")
        print("request.files:", request.files)
        print("request.form:", request.form)
        print("request.content_type:", request.content_type)
        print("=================================")

        # Accept either key 'image' or 'file'
        file_key = "image" if "image" in request.files else "file" if "file" in request.files else None

        if not file_key:
            return jsonify({"error": "No image file provided"}), 400

        image = request.files[file_key]
        contents = image.read()

        # Dummy AI processing (replace with your pro_model call)
        response = {
            "result": "AI-generated",  # or "Real"
            "confidence": 0.95
        }

        return jsonify({"output": response, "filename": image.filename})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---- Audio Detection ----
@app.route("/api/v1/detect/audio", methods=["POST"])
def detect_audio():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        contents = file.read()

        response = pro_model.generate_content([
            "Classify this audio as AI-generated or Real human speech. "
            "Respond only in JSON with keys: result (AI-generated or Real), confidence (0-1).",
            {"mime_type": file.mimetype, "data": contents}
        ])

        return jsonify({"output": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Video Detection ----
@app.route("/api/v1/detect/video", methods=["POST"])
def detect_video():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        contents = file.read()

        response = pro_model.generate_content([
            "Classify this video as either AI-generated or Real. "
            "Respond only in JSON with keys: result (AI-generated or Real), confidence (0-1).",
            {"mime_type": file.mimetype, "data": contents}
        ])

        return jsonify({"output": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Run app ----
if __name__ == "__main__":
    models = genai.list_models()
    for m in models:
        print(m.name, m.supported_generation_methods)
    app.run(host='0.0.0.0', port=8080, debug=True)                                                               