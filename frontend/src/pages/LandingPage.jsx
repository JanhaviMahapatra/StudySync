import { Link } from "react-router-dom";
import "../Styles/LandingPage.css"
import logo from "../assets/StudySync-Logo.png";

export default function Home() {
return (
<div className="auth-container">
  <div className="glass-card">
    {/* LOGO PLACEMENT */}
    <div className="logo-wrapper">
      <img src={logo} alt="StudySync Logo" className="brand-logo" />
    </div>

    <h2 className="brand-title">Welcome to StudySync</h2>
    
    <div className="auth-option">
      <p className="helper-text">New here?</p>
      <Link to="/register" className="btn-primary">Register</Link>
    </div>

    <div className="divider">
      <span>or</span>
    </div>

    <div className="auth-option">
      <p className="helper-text">Already a user?</p>
      <Link to="/login" className="btn-secondary">Login</Link>
    </div>
  </div>
</div>
);
};