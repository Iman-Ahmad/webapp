from flask import Flask, render_template, request, jsonify
import base64
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import joblib
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load model and label encoder with validation
model = tf.keras.models.load_model('md_model.h5')
label_encoder = joblib.load('label_encoder.pkl')

# Verify model input shape
print(f"Model input shape: {model.input_shape}")
assert model.input_shape == (None, 21, 3), "Model input shape mismatch! Expected (None, 21, 3)"

# Initialize MediaPipe Hands configuration for video processing
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,  # Optimized for video
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

@app.route('/')
def home():
    """Render main interface"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Missing JSON in request'}), 400
            
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': 'Missing image data'}), 400

        # Decode base64 image
        try:
            header, encoded = data['image'].split(",", 1)
            nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            return jsonify({'error': 'Invalid image data', 'details': str(e)}), 400

        # Process image with MediaPipe
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)

        if not results.multi_hand_landmarks:
            return jsonify({'prediction': 'No hands detected'})

        # Extract and format landmarks
        hand_landmarks = results.multi_hand_landmarks[0]
        landmarks = np.array(
            [[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark],
            dtype=np.float32
        )

        # Reshape and normalize for model input
        landmarks = landmarks.reshape(1, 21, 3)
        landmarks = (landmarks - np.min(landmarks)) / (np.max(landmarks) - np.min(landmarks))

        # Make prediction
        prediction = model.predict(landmarks)
        predicted_class = np.argmax(prediction)
        predicted_label = label_encoder.inverse_transform([predicted_class])[0]

        return jsonify({'prediction': predicted_label})

    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    # Warm up model with dummy input
    dummy_input = np.zeros((1, 21, 3), dtype=np.float32)
    model.predict(dummy_input)
    
    # Start development server
    app.run(host='0.0.0.0', port=5000, threaded=True)