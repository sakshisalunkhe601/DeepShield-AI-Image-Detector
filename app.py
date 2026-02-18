from flask import Flask, render_template, request, redirect, url_for, session, flash
import tensorflow as tf
import numpy as np
import os
import sqlite3
import uuid
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from tensorflow.keras.preprocessing import image
from datetime import datetime

# ---------------- APP CONFIG ---------------- #

app = Flask(__name__)
app.secret_key = "super_secret_key_123"

UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
IMG_SIZE = 224

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- LOAD MODEL ---------------- #

try:
    model = tf.keras.models.load_model("models/deepshield_model.h5")
    print("✅ Model Loaded Successfully")
except:
    model = None
    print("⚠️ Model NOT Found! Place it inside models folder.")

# ---------------- DATABASE ---------------- #

def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS predictions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        image TEXT,
        label TEXT,
        confidence REAL,
        explanation TEXT,
        timestamp TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------------- UTIL FUNCTIONS ---------------- #

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_image(path):
    if model is None:
        return "Model Not Loaded", 0, "Model file missing."

    img = image.load_img(path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)[0][0]

    if prediction > 0.5:
        label = "Real Image"
        confidence = float(prediction * 100)
        explanation = "Natural lighting and realistic texture distribution detected."
    else:
        label = "AI Generated Image"
        confidence = float((1 - prediction) * 100)
        explanation = "Synthetic patterns, inconsistent lighting or texture artifacts detected."

    return label, round(confidence, 2), explanation

# ---------------- ROUTES ---------------- #

@app.route("/")
def home():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))

# -------- REGISTER -------- #

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = generate_password_hash(request.form["password"])

        conn = sqlite3.connect("database.db")
        c = conn.cursor()

        try:
            c.execute("INSERT INTO users(username,password) VALUES(?,?)", (username, password))
            conn.commit()
            flash("Registration successful! Please login.")
            return redirect(url_for("login"))
        except:
            flash("Username already exists!")
        conn.close()

    return render_template("register.html")

# -------- LOGIN -------- #

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = sqlite3.connect("database.db")
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username=?", (username,))
        user = c.fetchone()
        conn.close()

        if user and check_password_hash(user[2], password):
            session["user_id"] = user[0]
            session["username"] = user[1]
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid Username or Password")

    return render_template("login.html")

# -------- LOGOUT -------- #

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# -------- DASHBOARD -------- #

@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("login"))

    result = None
    history = []

    if request.method == "POST":
        file = request.files["image"]

        if file and allowed_file(file.filename):
            filename = str(uuid.uuid4()) + "_" + secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)

            label, confidence, explanation = predict_image(filepath)
            timestamp = datetime.now().strftime("%d-%m-%Y %H:%M")

            conn = sqlite3.connect("database.db")
            c = conn.cursor()
            c.execute("""
                INSERT INTO predictions(user_id,image,label,confidence,explanation,timestamp)
                VALUES(?,?,?,?,?,?)
            """, (session["user_id"], filename, label, confidence, explanation, timestamp))
            conn.commit()
            conn.close()

            result = {
                "image": filename,
                "label": label,
                "confidence": confidence,
                "explanation": explanation
            }

    # Fetch history
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("""
        SELECT image,label,confidence,timestamp
        FROM predictions WHERE user_id=?
        ORDER BY id DESC
    """, (session["user_id"],))
    history = c.fetchall()
    conn.close()

    return render_template("dashboard.html",
                           username=session["username"],
                           result=result,
                           history=history)

# ---------------- RUN ---------------- #

if __name__ == "__main__":
    app.run(debug=True)
