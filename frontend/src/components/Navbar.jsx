import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      padding: "20px 0",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h2 style={{color:"#6366f1"}}>DeepShield</h2>

        <div style={{display:"flex", gap:"20px"}}>
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/analyze-image">Analyze</Link>
        </div>
      </div>
    </nav>
  );
}
