from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os
import sys

app = Flask(__name__)

# --- MODEL LOADING LOGIC ---
MODEL_PATH = os.path.join("models", "deepfake_image_model.h5")

print(f"🚀 Attempting to load image model from: {MODEL_PATH}")

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Image deepfake model loaded successfully.")
except Exception as e:
    print(f"❌ FATAL ERROR: Could not load image model. Check path and files.")
    print(f"Error details: {e}")
    sys.exit(1)


@app.route('/predict/image', methods=['POST'])
def predict_image():
    try:
        data = request.get_json()
        input_data = np.array(data['input'], dtype=np.float32)

        # The image should arrive as (256, 256, 3) already normalized to 0-1
        # Add batch dimension: (1, 256, 256, 3)
        if input_data.ndim == 3:
            input_data = np.expand_dims(input_data, axis=0)

        # Run prediction
        prediction = model.predict(input_data)

        # Interpret result based on notebook convention:
        #   class 0 = Fake, class 1 = Real
        #   Model outputs a single sigmoid value for binary classification
        raw_score = float(prediction[0][0])

        if raw_score > 0.5:
            label = "Real"
            confidence = raw_score
        else:
            label = "Fake"
            confidence = 1.0 - raw_score

        return jsonify({
            "prediction": label,
            "confidence": round(confidence, 4)
        })

    except Exception as e:
        print(f"❌ Image prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 400


if __name__ == '__main__':
    print("📢 Starting Image Deepfake Detection service on 127.0.0.1:5002...")
    app.run(host='127.0.0.1', port=5002, debug=False)
