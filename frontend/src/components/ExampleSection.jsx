import { useMemo } from "react";

export default function ExampleSection() {

  // Generate random faces every refresh
  const examples = useMemo(() => {
    return Array.from({ length: 3 }).map((_, index) => {
      const randomId = Math.floor(Math.random() * 100);

      const isAI = Math.random() > 0.5;

      return {
        id: index,
        image: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${randomId}.jpg`,
        result: isAI ? "AI Generated" : "Real",
        confidence: `${Math.floor(Math.random() * 10) + 85}%`,
        color: isAI ? "#ef4444" : "#22c55e"
      };
    });
  }, []);

  return (
    <section style={{ padding: "80px 20px" }}>
      <div className="container glass" style={{ padding: "50px" }}>
        
        <h2 style={{ 
          marginBottom: "50px", 
          textAlign: "center",
          fontSize: "32px"
        }}>
          Example Face Detection Results
        </h2>

        <div style={{
          display: "flex",
          gap: "40px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          
          {examples.map((example) => (
            <div key={example.id} style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              padding: "20px",
              width: "280px",
              textAlign: "center",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              
              <img
                src={example.image}
                alt="face example"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "15px"
                }}
              />

              <h3 style={{
                color: example.color,
                marginBottom: "10px"
              }}>
                {example.result}
              </h3>

              <p style={{
                fontSize: "14px",
                opacity: 0.8
              }}>
                Confidence: <strong>{example.confidence}</strong>
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
