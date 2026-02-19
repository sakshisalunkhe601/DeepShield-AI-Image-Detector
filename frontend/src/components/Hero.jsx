import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/analyze-image");  // Change this if your route name is different
  };

  return (
    <section style={{ padding: "120px 0", textAlign: "center" }}>
      <div className="container">
        
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: "3.5rem", marginBottom: "20px" }}
        >
          AI Powered Deepfake Detection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ opacity: 0.7, maxWidth: "600px", margin: "auto" }}
        >
          Detect manipulated images & videos using advanced AI models.
          Protect digital identity with DeepShield.
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: "40px" }}
        >
          <button
            className="btn-glow"
            onClick={handleClick}
            style={{
              padding: "12px 28px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Try Detection
          </button>
        </motion.div>

      </div>
    </section>
  );
}
