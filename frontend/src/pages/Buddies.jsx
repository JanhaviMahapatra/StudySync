import {useEffect,useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Buddies.css"

export default function Buddies(){
const navigate = useNavigate(); 
const [buddies,setBuddies]=useState([]);
const [loading,setLoading]=useState(true);

const token=localStorage.getItem("token");
const API = import.meta.env.VITE_API_URL;

const fetchBuddies=async ()=>{
try{
const res=await axios.get(`${API}/api/buddy/my-buddies`,
{
headers:{
Authorization:`Bearer ${token}`,
},
}
);
setBuddies(res.data.buddies);
}catch(error){
console.error("Fetch buddies error:", error);
}finally{
setLoading(false);
}
};
useEffect(()=>{
fetchBuddies();
},[]);

const handleRemove=async (userId)=>{
try{
await axios.delete(`${API}/api/buddy/remove/${userId}`,
{
headers:{
Authorization:`Bearer ${token}`,
},
}
);
alert("Buddy Removed");
fetchBuddies();
}catch(error) {
alert(error.response?.data?.message || "Error removing buddy");
}
};

if(loading) return <p>Loading buddies...</p>;

return(
<div className="dashboard-container">
<div className="header-section">
<h2 className="brand-title">My Study Buddies</h2>
<div className="accent-line"></div>
</div>

{buddies.length === 0 ? (
<div className="glass-card empty-state">
<p className="helper-text">No buddies yet. Time to find some sync-partners!</p>
</div>
) : (
<div className="buddies-grid">
{buddies.map((buddy) => (
<div key={buddy._id} className="buddy-card">
<div className="buddy-info">
<h3 className="buddy-name">{buddy.name}</h3>
<div className="buddy-stats">
<span className="stat-badge">Level: {buddy.level}</span>
<span className="stat-badge">Goal: {buddy.goal}</span>
</div>
</div>

<div className="buddy-actions">
<button 
className="btn-chat" 
onClick={() => navigate(`/chat/${buddy._id}`)}
>
Chat
</button>
<button 
className="btn-remove" 
onClick={() => handleRemove(buddy._id)}
>
Remove
</button>
</div>
</div>
))}
</div>
)}
</div>
);
};