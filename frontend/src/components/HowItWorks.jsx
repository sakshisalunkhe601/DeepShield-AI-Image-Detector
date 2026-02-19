export default function HowItWorks() {
  return (
    <div className="container" style={{ padding: "100px 0" }}>
      <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
        How DeepShield Works
      </h1>

      <Step number="1" text="Upload image or video." />
      <Step number="2" text="AI model analyzes facial and pixel inconsistencies." />
      <Step number="3" text="System generates authenticity result." />
      <Step number="4" text="Confidence percentage is displayed." />
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="glass" style={{ padding: "30px", marginBottom: "20px" }}>
      <h2 style={{ color: "#6366f1" }}>Step {number}</h2>
      <p>{text}</p>
    </div>
  );
}
