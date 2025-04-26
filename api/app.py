from flask import Flask, request, jsonify
from tensorflow import keras
import numpy as np
import os

app = Flask(__name__)
model = keras.models.load_model('../models/md_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Add your preprocessing
    prediction = model.predict(np.array(data['input']))
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)