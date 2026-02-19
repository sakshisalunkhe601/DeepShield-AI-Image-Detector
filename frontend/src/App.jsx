import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import AnalyzeImage from "./pages/AnalyzeImage";
import AnalyzeVideo from "./pages/AnalyzeVideo";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/analyze-image" element={<AnalyzeImage />} />
        <Route path="/analyze-video" element={<AnalyzeVideo />} />
      </Routes>
      <Footer />
    </>
  );
}
