export default function Features() {
  return (
    <div className="container" style={{ padding: "100px 0" }}>
      <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
        DeepShield Features
      </h1>

      <Feature title="AI Image Deepfake Detection"
        text="Advanced CNN model trained on manipulated datasets." />

      <Feature title="Video Frame Analysis"
        text="Frame-by-frame scanning ensures high accuracy." />

      <Feature title="Confidence Score"
        text="Provides percentage-based authenticity scoring." />

      <Feature title="Real-Time Processing"
        text="Fast backend prediction system." />

      <Feature title="Secure File Handling"
        text="Uploaded files are not stored permanently." />
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="glass" style={{ padding: "30px", marginBottom: "20px" }}>
      <h3>{title}</h3>
      <p style={{ opacity: 0.7 }}>{text}</p>
    </div>
  );
}
