import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Onboarding(){
const navigate=useNavigate();
const[form,setForm]=useState({
bio:"",
city:"",
level:"",
dailyStudyHours:"",
preferredStudyTime:"",
goal:"",
topics:[],
customTopic:"",
availability:{
monday:{from:"",to:""},
tuesday:{from:"",to:""},
wednesday:{from:"",to:""},
thursday:{from:"",to:""},
friday:{from:"",to:""},
saturday:{from:"",to:""},
sunday:{from:"",to:""},
},
});

const fixedTopics=[
"DSA",
"React",
"Node.js",
"Express",
"MongoDB",
"PostgreSQL",
"Java",
"Python",
"System Designing",
"Machine Learning"
];

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
}
const handleTopicChange=(topic)=>{
if(form.topics.includes(topic)){
setForm({...form,
topics:form.topics.filter((t)=>t!==topic),
});
} else{
setForm({...form,
topics:[...form.topics,topic],
});
}
};

const handleAvailabilityChange=(day,field,value)=>{
setForm({...form,
availability:{
...form.availability,
[day]:{
...form.availability[day],
[field]:value,
},
},
});
};

const handleSubmit=async (e)=>{
e.preventDefault();
const token=localStorage.getItem(("token"));
const API = import.meta.env.VITE_API_URL;
const finalTopics=[...form.topics];
if(form.customTopic.trim()!==""){
finalTopics.push(form.customTopic.trim());
}
const cleanAvailability={};
for(let day in form.availability){
const {from,to}=form.availability[day];
if(from&&to){
cleanAvailability[day]={from,to};
} else{
cleanAvailability[day]=null;
}
}

try{
await axios.put(`${API}/api/users/profile`,
{
bio: form.bio,
city: form.city,
level: form.level,
dailyStudyHours: Number(form.dailyStudyHours),
preferredStudyTime: form.preferredStudyTime,
goal: form.goal,
topics:finalTopics,
availability:cleanAvailability,
},
{
headers:{
Authorization:`Bearer ${token}`,
},
});
navigate("/me");
} catch(error){
alert(error.response?.data?.message || "Error saving profile");
}
};
return(
<div className="auth-container profile-page">
<div className="glass-card wide-card">
<div className="header-section">
<h2 className="brand-title">Complete Your Study Profile</h2>
<p className="subtitle">Tell us how you study so we can find your perfect sync.</p>
</div>

<form onSubmit={handleSubmit} className="profile-form">
{/* SECTION 1: GENERAL INFO */}
<div className="form-section">
<h3 className="section-label">General Information</h3>
<textarea
name="bio"
placeholder="Tell us about your study journey..."
className="profile-input profile-textarea" 
value={form.bio}
onChange={handleChange}
/>
<div className="input-row">
<input className="profile-input" name="city" placeholder="City (optional)" value={form.city} onChange={handleChange} />
<input className="profile-input" type="number" name="dailyStudyHours" placeholder="Daily Hours" value={form.dailyStudyHours} onChange={handleChange} />
</div>
</div>

{/* SECTION 2: STUDY PREFERENCES */}
<div className="form-section">
<h3 className="section-label">Study Preferences</h3>
<div className="input-row">
<select className="profile-input" name="level" value={form.level} onChange={handleChange}>
<option value="">Select Level</option>
<option value="Beginner">Beginner</option>
<option value="Intermediate">Intermediate</option>
<option value="Advanced">Advanced</option>
</select>
<select className="profile-input" name="goal" value={form.goal} onChange={handleChange}>
<option value="">Select Goal</option>
<option value="Internship">Internship</option>
<option value="Exam">Exam</option>
<option value="Skill Learning">Skill Learning</option>
<option value="Placement">Placement</option>
</select>
</div>
<select className="profile-input" name="preferredStudyTime" value={form.preferredStudyTime} onChange={handleChange}>
<option value="">Preferred Study Time</option>
<option value="Morning">Morning</option>
<option value="Afternoon">Afternoon</option>
<option value="Evening">Evening</option>
<option value="Night">Night</option>
</select>
</div>

{/* SECTION 3: TOPICS */}
<div className="form-section">
<h3 className="section-label">Expertise & Interests</h3>
<div className="topics-grid">
{fixedTopics.map((topic) => (
<label key={topic} className={`topic-chip ${form.topics.includes(topic) ? 'active' : ''}`}>
<input
type="checkbox"
checked={form.topics.includes(topic)}
onChange={() => handleTopicChange(topic)}
/>
{topic}
</label>
))}
</div>
<input
name="customTopic"
placeholder="Add custom topic (e.g. Quantum Physics)"
className="profile-input" /* Unified class */
value={form.customTopic}
onChange={handleChange}
/>
</div>

{/* SECTION 4: AVAILABILITY */}
<div className="form-section">
<h3 className="section-label">Weekly Availability</h3>
<div className="availability-grid">
{Object.keys(form.availability).map((day) => (
<div key={day} className="day-row">
<span className="day-name">{day}</span>
<div className="time-inputs">
<input
type="time"
className="profile-input time-mini"
value={form.availability[day].from}
onChange={(e) => handleAvailabilityChange(day, "from", e.target.value)}
/>
<span className="time-divider">to</span>
<input
type="time"
className="profile-input time-mini"
value={form.availability[day].to}
onChange={(e) => handleAvailabilityChange(day, "to", e.target.value)}
/>
</div>
</div>
))}
</div>
</div>

<button type="submit" className="btn-primary submit-profile">Save Profile</button>
</form>
</div>
</div>
);
}