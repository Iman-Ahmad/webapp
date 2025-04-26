from flask import Flask, render_template, request, jsonify
import os
import base64
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import joblib

# Flask app
app = Flask(__name__)

# Load model and label encoder
model = tf.keras.models.load_model('md_model.h5')  # <-- Use your trained model here
label_encoder = joblib.load('label_encoder.pkl')

# MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1)

@app.route('/')
def home():
    return render_template('index.html')  # This will render index.html from the templates folder

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_data = data['image'].split(",")[1]
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Process with MediaPipe
        results = hands.process(img_rgb)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                landmarks = []
                for lm in hand_landmarks.landmark:
                    landmarks.extend([lm.x, lm.y, lm.z])
                
                landmarks = np.array(landmarks).reshape(1, -1)

                # Predict
                prediction = model.predict(landmarks)
                predicted_class = np.argmax(prediction)
                predicted_label = label_encoder.inverse_transform([predicted_class])[0]

                return jsonify({'prediction': predicted_label})

        return jsonify({'prediction': None})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'prediction': None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
