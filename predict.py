import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load model
model = tf.keras.models.load_model("models/deepshield_model.h5")

IMG_SIZE = 224

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    prediction = model.predict(img_array)[0][0]

    if prediction > 0.5:
        print("🔴 AI Generated Image")
        print("Confidence:", prediction)
    else:
        print("🟢 Real Image")
        print("Confidence:", 1 - prediction)

# Test image path
predict_image("test.jpg")
