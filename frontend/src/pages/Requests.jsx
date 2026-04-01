import {useState,useEffect} from "react";
import axios from "axios"
import "../Styles/Requests.css"

export default function Requests(){
const[requests,setRequests]=useState([]);
const[loading,setLoading]=useState(true);

const token=localStorage.getItem("token");
const API = import.meta.env.VITE_API_URL;

const fetchRequest=async ()=>{
try{
  const res=await axios.get(`${API}/api/buddy/requests`,
{
  headers:{
    Authorization:`Bearer ${token}`,
  },
},
);
setRequests(res.data.requests);
}catch(error){
console.log("Fetching requests error",error.message)
}finally{
  setLoading(false);
}
};
useEffect(()=>{
fetchRequest();
},[]);

const handleAccept=async (requestId)=>{
try{
  await axios.put(`${API}/api/buddy/accept/${requestId}`,{},
{
  headers:{
    Authorization:`Bearer ${token}`,
  },
},
);
alert("Buddy request accepted!");
fetchRequest();
}catch(error){
alert(error.response?.data?.message || "Error accepting");
}
}

const handleReject=async (requestId)=>{
try{
  await axios.put(`${API}/api/buddy/reject/${requestId}`,{},
{
  headers:{
    Authorization:`Bearer ${token}`,
  },
},
);
alert("Buddy request rejected!");
fetchRequest();
}catch(error){
 alert(error.response?.data?.message || "Error rejecting");
}
}

if(loading) return <p>Loading Requests...</p>

return(
<div className="requests-container">
<div className="header-section">
<h2 className="brand-title">Incoming Requests</h2>
<p className="subtitle" style={{marginTop:"5px"}}>People want to sync their study sessions with you.</p>
</div>

{requests.length === 0 ? (
<div className="glass-card empty-state">
<div className="empty-icon">📩</div>
<p className="helper-text">Your inbox is clear. No pending requests.</p>
</div>
) : (
<div className="requests-list">
{requests.map((req) => (
<div key={req._id} className="request-card">
<div className="request-user-info">
<div className="request-avatar">
{req.from.name.charAt(0)}
</div>
<div className="request-details">
<h3 className="request-name">{req.from.name}</h3>
<div className="request-stats">
<span className="req-pill">Lvl {req.from.level}</span>
<span className="req-pill">Goal: {req.from.goal}</span>
</div>
</div>
</div>

<div className="request-actions">
<button 
className="btn-accept" 
onClick={() => handleAccept(req._id)}
>
Accept
</button>
<button 
className="btn-reject" 
onClick={() => handleReject(req._id)}
>
Reject
</button>
</div>
</div>
))}
</div>
)}
</div>
);
};