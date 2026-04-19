from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os # Import the os module for path handling
import sys

app = Flask(__name__)

# --- MODEL LOADING LOGIC ---
MODEL_PATH_RELATIVE = os.path.join("models", "models", "deepaudio_saved_model")

print(f"🚀 Attempting to load model from: {MODEL_PATH_RELATIVE}")

try:
    # 🔹 Load your TensorFlow model
    model = tf.keras.models.load_model(MODEL_PATH_RELATIVE)
    print("✅ Audio model loaded successfully.")
    
except Exception as e:
    # This is critical for debugging! If the path is wrong, 
    # the server will likely not start at all or fail immediately.
    print(f"❌ FATAL ERROR: Could not load TensorFlow model. Check path and files.")
    print(f"Error details: {e}")
    # We exit the app if the core model cannot be loaded
    sys.exit(1)


@app.route('/predict/audio', methods=['POST'])
def predict_audio():
    try:
        data = request.get_json()
        input_data = np.array(data['input'])  # expecting a list/array
        
        # Ensure model is ready (though the check above should cover this)
        if 'model' not in locals() and 'model' not in globals():
            return jsonify({'error': 'Model not initialized on server.'}), 503
            
        prediction = model.predict(input_data)
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        # This catches errors during prediction (e.g., bad input data)
        return jsonify({'error': f"Prediction failed: {str(e)}"}), 400

if __name__ == '__main__':
    # 📢 New debug message to confirm the execution reaches this point
    print("📢 Execution Reached: Starting Flask server on 127.0.0.1:5001...") 
    
    app.run(host='127.0.0.1', port=5001, debug=False)