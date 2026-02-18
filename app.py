from flask import Flask, render_template, request
import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing import image

app = Flask(__name__)

IMG_SIZE = 224
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Auto-create upload folder
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load trained model
model = tf.keras.models.load_model("models/deepshield_model.h5")

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array, verbose=0)[0][0]

    # IMPORTANT: fake=0, real=1
    if prediction > 0.5:
        label = "Real Image"
        confidence = prediction * 100
        color = "green"
    else:
        label = "AI Generated Image"
        confidence = (1 - prediction) * 100
        color = "red"

    return label, round(float(confidence), 2), color


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files["image"]

        if file:
            filename = file.filename.replace(" ", "_")
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)

            label, confidence, color = predict_image(filepath)

            return render_template(
                "index.html",
                label=label,
                confidence=confidence,
                color=color,
                image_path=filepath
            )

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
