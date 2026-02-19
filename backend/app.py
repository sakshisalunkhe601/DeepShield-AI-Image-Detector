from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
import cv2
from tensorflow.keras.preprocessing import image
from datetime import datetime
import ast

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

IMG_SIZE = 224
THRESHOLD = 0.5

model = tf.keras.models.load_model("models/deepshield_model.h5")

# Load class mapping
with open("models/class_indices.txt", "r") as f:
    class_indices = ast.literal_eval(f.read())

print("✅ Class Mapping Loaded:", class_indices)

# Determine which index is AI
ai_class_index = None
for key, value in class_indices.items():
    if key.lower() in ["fake", "ai"]:
        ai_class_index = value

print("✅ AI Class Index:", ai_class_index)

def analyze(score):

    if ai_class_index == 1:
        ai_probability = score
    else:
        ai_probability = 1 - score

    if ai_probability >= THRESHOLD:
        label = "AI Generated"
        confidence = ai_probability * 100
        color = "red"
    else:
        label = "Real"
        confidence = (1 - ai_probability) * 100
        color = "green"

    return label, round(confidence, 2), color

@app.route("/api/predict-image", methods=["POST"])
def predict_image():

    file = request.files["file"]
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    img = image.load_img(path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = float(model.predict(img_array, verbose=0)[0][0])
    print("RAW OUTPUT:", prediction)

    label, confidence, color = analyze(prediction)

    return jsonify({
        "label": label,
        "confidence": confidence,
        "raw_score": round(prediction, 4),
        "color": color,
        "analysis_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

if __name__ == "__main__":
    app.run(debug=True)
