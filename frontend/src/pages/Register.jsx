import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "../Styles/Register.css"
import logo from "../assets/StudySync-Logo.png";

export default function Register() {
const [form, setForm] = useState({
name: "",
email: "",
password: "",
});

const [msg, setMsg] = useState("");

const navigate=useNavigate()
const API = import.meta.env.VITE_API_URL;

const handleChange = (e) => {
setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleSubmit = async (e) => {
e.preventDefault();
setMsg("");

try {
const res = await axios.post(`${API}/api/auth/register`, form);
setMsg(res.data.message);
setForm({name:"",email:"",password:""});
navigate("/onboarding")
} catch (error) {
setMsg(error.response?.data?.message || "Something went wrong");
}
};

return (
<div className="auth-container">
<div className="glass-card register-card">
{/* LOGO AREA */}
<div className="logo-wrapper">
<img src={logo} alt="StudySync Logo" className="brand-logo" />
</div>

<h2 className="brand-title">Join StudySync</h2>
<p className="subtitle" style={{marginTop:"5px"}}>Start your journey toward smarter learning.</p>

<form onSubmit={handleSubmit} className="auth-form">
<div className="form-group">
<input
name="name"
placeholder="Full Name"
value={form.name}
onChange={handleChange}
required
/>
</div>

<div className="form-group">
<input
name="email"
placeholder="Email Address"
type="email"
value={form.email}
onChange={handleChange}
required
/>
</div>

<div className="form-group">
<input
name="password"
placeholder="Create Password"
type="password"
value={form.password}
onChange={handleChange}
required
/>
</div>

<button type="submit" className="btn-primary register-btn">
Create Account
</button>
</form>

{msg && <p className="status-msg">{msg}</p>}

<p className="footer-text">
Already have an account? <Link to="/login" className="text-link">Login</Link>
</p>
</div>
</div>
);
};