export default function ExampleSection() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container glass" style={{ padding: "40px" }}>
        <h2 style={{ marginBottom: "30px", textAlign: "center" }}>
          Example Deepfake Detection
        </h2>

        <div style={{
          display: "flex",
          gap: "40px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          
          <img
            src="https://picsum.photos/300"
            alt="example"
            style={{
              width: "300px",
              borderRadius: "12px"
            }}
          />

          <div>
            <h3>Result: Fake</h3>
            <p>Confidence: 92%</p>
          </div>

        </div>
      </div>
    </section>
  );
}
