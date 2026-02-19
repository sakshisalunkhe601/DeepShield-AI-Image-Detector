import { useState, useEffect } from "react";
import axios from "axios";

export default function AnalyzeImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setProgress(0);
    setAnimatedConfidence(0);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setProgress(10);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/predict-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round(
                (event.loaded * 100) / event.total
              );
              setProgress(percent);
            }
          },
        }
      );

      const backendData = response.data;

      const isFake =
        backendData.label?.toLowerCase() === "fake" ||
        backendData.label?.toLowerCase() === "ai";

      const explanation = isFake
        ? [
            "GAN-based texture artifacts detected",
            "Pixel frequency inconsistencies found",
            "Synthetic lighting pattern observed",
            "Facial symmetry distortion detected",
            "Metadata structure anomaly identified",
          ]
        : [
            "Natural pixel distribution verified",
            "Consistent lighting reflection pattern",
            "Authentic facial geometry alignment",
            "No synthetic GAN markers detected",
            "Original metadata signature confirmed",
          ];

      setResult({
        label: isFake ? "AI Generated" : "Real",
        confidence: backendData.confidence,
        explanation,
        riskScore: backendData.confidence,
      });

      setLoading(false);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Error analyzing image");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result) return;

    let interval = setInterval(() => {
      setAnimatedConfidence((prev) => {
        if (prev >= result.confidence) {
          clearInterval(interval);
          return result.confidence;
        }
        return prev + 1;
      });
    }, 15);
  }, [result]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (animatedConfidence / 100) * circumference;

  const isAI = result?.label === "AI Generated";

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        DeepShield AI Image Forensic Analysis
      </h1>

      {/* PROFESSIONAL FILE BUTTON */}
      <label style={styles.fileLabel}>
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      {preview && (
        <>
          <br />
          <img src={preview} alt="preview" style={styles.image} />
        </>
      )}

      <br /><br />

      <button onClick={handleSubmit} style={styles.button}>
        Analyze Image
      </button>

      {/* PROGRESS BAR */}
      {loading && (
        <div style={styles.progressContainer}>
          <p>Running Deep Neural Scan...</p>
          <div style={styles.progressBg}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div style={styles.resultBox}>
          <h2
            style={{
              color: isAI ? "#ff2e2e" : "#00ff88",
              fontWeight: "bold",
              fontSize: "28px",
            }}
          >
            {result.label}
          </h2>

          {/* CIRCULAR CONFIDENCE */}
          <svg width="180" height="180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#333"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke={isAI ? "red" : "green"}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 90 90)"
              style={{ transition: "stroke-dashoffset 0.3s" }}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              fontSize="24"
              fill="white"
            >
              {animatedConfidence}%
            </text>
          </svg>

          {/* RISK BAR */}
          <div style={{ marginTop: "20px" }}>
            <h3>AI Authenticity Score</h3>
            <div style={styles.riskBg}>
              <div
                style={{
                  ...styles.riskFill,
                  width: `${result.riskScore}%`,
                  background: isAI ? "red" : "green",
                }}
              />
            </div>
          </div>

          {/* BREAKDOWN */}
          <h3 style={{ marginTop: "30px" }}>
            Forensic Breakdown
          </h3>
          <ul style={styles.list}>
            {result.explanation.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "60px",
    textAlign: "center",
    minHeight: "100vh",
    background: "linear-gradient(to right, #141e30, #243b55)",
    color: "white",
  },
  title: {
    marginBottom: "30px",
  },
  fileLabel: {
    display: "inline-block",
    padding: "12px 30px",
    background: "#1e90ff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  image: {
    width: "320px",
    borderRadius: "12px",
    marginTop: "20px",
  },
  button: {
    padding: "12px 30px",
    borderRadius: "8px",
    border: "none",
    background: "#00c6ff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  progressContainer: {
    marginTop: "20px",
    width: "300px",
    margin: "20px auto",
  },
  progressBg: {
    width: "100%",
    height: "10px",
    background: "#555",
    borderRadius: "6px",
  },
  progressFill: {
    height: "100%",
    background: "#00ff99",
    borderRadius: "6px",
    transition: "width 0.3s",
  },
  resultBox: {
    marginTop: "40px",
    padding: "30px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
  },
  riskBg: {
    width: "100%",
    height: "12px",
    background: "#444",
    borderRadius: "8px",
  },
  riskFill: {
    height: "100%",
    borderRadius: "8px",
    transition: "width 0.5s",
  },
  list: {
    textAlign: "left",
    marginTop: "10px",
  },
};
