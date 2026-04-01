import {useState} from "react";
import axios from "axios";
import {Link,useNavigate} from "react-router-dom";
import "../Styles/Login.css"
import logo from "../assets/StudySync-Logo.png";

export default function Login(){
const navigate=useNavigate();

const[form,setForm]=useState({
email:"",
password:"",
});

const[msg,setMsg]=useState("");
const API = import.meta.env.VITE_API_URL;

 const handleChange=(e)=>{
  setForm((prev)=>({...prev,[e.target.name]:e.target.value}));
 };

 const handleSubmit=async (e)=>{
 e.preventDefault();
 setMsg("");
 try{
 const res=await axios.post(`${API}/api/auth/login`,form);
 const token = res.data.token;
 localStorage.setItem("token",token);
 localStorage.setItem("userId", res.data.user.id);
 
const me = await axios.get(
`${API}/api/users/me`,
{
headers: {
Authorization: `Bearer ${token}`,
},
});
if (me.data.profileComplete) {
navigate("/me");
} else {
navigate("/onboarding");
}
 setMsg("Login Success");
 } catch(error){
  setMsg(error.response?.data?.message||"Something went wrong");
 }
 };

 return(
<div className="auth-container">
<div className="glass-card">
<div className="logo-wrapper">
<img src={logo} alt="StudySync Logo" className="brand-logo" />
</div>

<h2 className="brand-title">Welcome Back</h2>
<p className="subtitle" style={{marginTop:"5px"}}>Enter your credentials to access your sync.</p>

<form onSubmit={handleSubmit} className="auth-form">
<div className="form-group">
<input
type="email"
name="email"
placeholder="Email Address"
value={form.email}
onChange={handleChange}
required
/>
</div>

<div className="form-group">
<input
type="password"
placeholder="Password"
name="password"
value={form.password}
onChange={handleChange}
required
/>
</div>

<button type="submit" className="btn-primary login-btn">
Sign In
</button>
</form>

{msg && <p className="status-msg">{msg}</p>}

<div className="divider"><span>or</span></div>

<p className="footer-text">
New here? <Link to="/register" className="text-link">Create an account</Link>
</p>
</div>
</div>
 );
}
