from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# 🔹 Load your TensorFlow model
MODEL_PATH = "models\models\deepaudio_saved_model"   # change if needed
model = tf.keras.models.load_model(MODEL_PATH)

@app.route('/predict/audio', methods=['POST'])
def predict_audio():
    try:
        data = request.get_json()
        input_data = np.array(data['input'])  # expecting a list/array
        prediction = model.predict(input_data)
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=False)
