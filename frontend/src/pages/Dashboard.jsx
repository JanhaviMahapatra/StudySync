import { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/DashBoard.css"

export default function Dashboard(){
 const navigate=useNavigate();
 const[data,setData]=useState("");
 const[msg,setMsg]=useState("");
 useEffect(()=>{
 const fetchMe=async ()=>{
 const token=localStorage.getItem("token");
 const res=await axios.get("http://localhost:5000/api/users/me",{
  headers:{
  authorization:`Bearer ${token}`,
  },
 });
 setData(res.data.user);
 setMsg(res.data.message);
 };
 fetchMe();
 },[]);

return(
<div className="dashboard-wrapper">
<div className="glass-card dashboard-card">
{/* Profile Section */}
<div className="profile-header">
<div className="user-avatar">
{data?.name?.charAt(0) || "U"}
</div>
<div className="user-details">
<h2 className="dashboard-title">Dashboard</h2>
{data && (
<div className="user-info">
<p className="user-name">{data.name}</p>
<p className="user-email">{data.email}</p>
</div>
)}
</div>
</div>

{msg && <p className="status-msg">{msg}</p>}

{/* Action Grid */}
<div className="action-grid">
<button 
className="action-tile primary-tile" 
onClick={() => navigate("/matches")}
>
<span className="tile-icon">🔍</span>
<span className="tile-text">Find Study Matches</span>
</button>

<button 
className="action-tile" 
onClick={() => navigate("/requests")}
>
<span className="tile-icon">📩</span>
<span className="tile-text">View Requests</span>
</button>

<button 
className="action-tile" 
onClick={() => navigate("/my-buddies")}
>
<span className="tile-icon">👥</span>
<span className="tile-text">My Buddies</span>
</button>

<button 
className="action-tile ai-tile" 
onClick={() => navigate("/chat/ai")}
>
<span className="tile-icon">✨</span>
<span className="tile-text">Chat with AI</span>
</button>
</div>
</div>
</div>
);
}