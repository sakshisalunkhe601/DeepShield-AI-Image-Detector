from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
import cv2
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

IMG_SIZE = 224

# Load trained model
model = tf.keras.models.load_model("models/deepshield_model.h5")

@app.route("/")
def home():
    return "DeepShield Backend Running"

# ✅ STRONG ANALYSIS LOGIC
def analyze(score):
    """
    Assumption:
    Model output close to 1 → AI Generated
    Model output close to 0 → Real Image
    """

    ai_probability = score
    real_probability = 1 - score

    if ai_probability >= 0.5:
        label = "AI Generated"
        confidence = ai_probability * 100
    else:
        label = "Real"
        confidence = real_probability * 100

    return label, round(confidence, 2)

@app.route("/api/predict-image", methods=["POST"])
def predict_image():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    # Preprocessing
    img = image.load_img(path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Prediction
    prediction = float(model.predict(img_array)[0][0])

    label, confidence = analyze(prediction)

    return jsonify({
        "label": label,
        "confidence": confidence,
        "raw_score": round(prediction, 4)
    })

@app.route("/api/predict-video", methods=["POST"])
def predict_video():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    cap = cv2.VideoCapture(path)
    preds = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
        frame = frame / 255.0
        frame = np.expand_dims(frame, axis=0)

        pred = float(model.predict(frame)[0][0])
        preds.append(pred)

    cap.release()

    if len(preds) == 0:
        return jsonify({"error": "Could not process video"}), 400

    avg_score = float(np.mean(preds))
    label, confidence = analyze(avg_score)

    return jsonify({
        "label": label,
        "confidence": confidence,
        "raw_score": round(avg_score, 4)
    })

if __name__ == "__main__":
    app.run(debug=True)
