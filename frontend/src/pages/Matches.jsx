import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Matches.css"

export default function Matches() {
const[matches, setMatches]=useState([]);
const[loading, setLoading]=useState(true);
const[sending, setSending]=useState(null);

useEffect(() => {
const fetchMatches = async () => {
try {
const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/match",
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

setMatches(res.data.matches);
} catch (error) {
console.error("Match fetch error:", error);
} finally {
setLoading(false);
}
};

fetchMatches();
}, []);

const handleSendRequest=async (userId)=>{
try{
setSending(userId);
const token=localStorage.getItem("token");
await axios.post("http://localhost:5000/api/buddy/request",
{toUserId:userId},
{headers:{
Authorization:`Bearer ${token}`,
}}
);
alert("Buddy reqest sent!");
}catch(error){
alert(error.response?.data?.message || "Error sending request")
}finally{
setSending(null);
}
};

if (loading) return <p style={{ padding: 30 }}>Loading matches...</p>;

return (
<div className="matches-wrapper">
<div className="header-section">
<h2 className="brand-title">Study Matches</h2>
</div>

{matches.length === 0 ? (
<div className="glass-card empty-state">
<p className="helper-text">No strong matches found. Try updating your profile topics!</p>
</div>
) : (
<div className="matches-grid">
{matches.map((match) => (
<div key={match.user.id} className="match-card">
{/* Score Badge */}
<div className="score-badge">
<span className="score-value">{match.score}%</span>
<span className="score-label">Match</span>
</div>

<div className="match-content">
<h3 className="user-name">{match.user.name}</h3>

<div className="stat-row">
<span className="pill-level">Lvl {match.user.level}</span>
<span className="pill-goal">{match.user.goal}</span>
</div>

<div className="topics-section">
<p className="small-label">Topics</p>
<div className="topic-tags">
{match.user.topics.map((topic, i) => (
<span key={i} className="topic-tag">{topic}</span>
))}
</div>
</div>

<div className="insights-box">
<p className="small-label">Why you matched</p>
<ul className="reasons-list">
{match.reasons.map((reason, index) => (
<li key={index}>{reason}</li>
))}
</ul>
</div>

<button 
className={`btn-primary match-btn ${sending === match.user.id ? 'loading' : ''}`}
onClick={() => handleSendRequest(match.user.id)}
disabled={sending === match.user.id}
>
{sending === match.user.id ? (
<span className="spinner"></span>
) : (
"Send Request"
)}
</button>
</div>
</div>
))}
</div>
)}
</div>
);
}