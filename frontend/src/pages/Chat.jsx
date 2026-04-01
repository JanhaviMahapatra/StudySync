import { useEffect, useState,useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import socket from "../socket";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../Styles/Chat.css"


export default function Chat() {

const { buddyId } = useParams();
const bottomRef=useRef(null)
const isAIChat = buddyId === "ai";

const token = localStorage.getItem("token");
const currentUserId = localStorage.getItem("userId");

const [messages, setMessages] = useState([]);
const [text, setText] = useState("");
const [buddy, setBuddy] = useState(null);
const [loading, setLoading] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isOnline, setIsOnline] = useState(false);

const API = import.meta.env.VITE_API_URL;

/*Auto scroll dowm*/
useEffect(()=>{
bottomRef.current?.scrollIntoView(
{behavior:"smooth"});
},[messages])


/* Socket connection */
useEffect(() => {

if(isAIChat)return;
socket.auth = {
token: localStorage.getItem("token"),
};

socket.connect();

socket.on("connect", () => {
console.log("Connected:", socket.id);
});

return () => {
socket.off("connect");
};

},[isAIChat]);


/* Receive messages */
useEffect(()=> {

if(isAIChat)return;

socket.on("receive_message",(data)=>{

if(data.senderId===buddyId||data.receiverId===buddyId) {

setMessages((prev)=>[
...prev,
{
_id: Date.now(),
sender: data.senderId,
text: data.text,
},
]);
}
});

return()=>{
socket.off("receive_message");
};
},[buddyId,isAIChat]);


/* Typing indicator */
useEffect(()=>{
if(isAIChat)return;

socket.on("typing_start",({senderId})=>{
if(senderId===buddyId)
setIsTyping(true);
});

socket.on("typing_stop", ({ senderId }) => {
if (senderId === buddyId) setIsTyping(false);
});

return()=> {
socket.off("typing_start");
socket.off("typing_stop");
};
},[buddyId,isAIChat]);


/* Online status */
useEffect(() => {

if(isAIChat)return;

socket.on("user_online",(userId)=>{
if (userId===buddyId) 
setIsOnline(true);
});

socket.on("user_offline",(userId) => {
if (userId===buddyId) 
setIsOnline(false);
});

return()=>{
socket.off("user_online");
socket.off("user_offline");
};

}, [buddyId, isAIChat]);


/* Online users list */
useEffect(() => {
if(isAIChat)return;

socket.on("online_users",(users) => {
setIsOnline(users.includes(buddyId));
});

return()=>{
socket.off("online_users");
};
},[buddyId,isAIChat]);


/*Fetch chat messages*/
const fetchMessages=async()=>{
if(isAIChat){
setMessages([]);
setBuddy({ name: "StudySync AI" });
setIsOnline(true);
setLoading(false);
return;
}

try {

const res = await axios.get(
`${API}/api/chat/${buddyId}`,
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

setMessages(res.data.messages);
setBuddy(res.data.buddy);

} catch (error) {
console.log("Fetch message error", error);
} finally {
setLoading(false);
}

};


useEffect(() => {
fetchMessages();
}, [buddyId]);


/* Send message */
const handleSend = async () => {

if (!text.trim()) return;

const userMessage = text;

setMessages((prev) => [
...prev,
{
_id: Date.now(),
sender: currentUserId,
text: userMessage,
},
]);

setText("");

try {

/* AI CHAT */
if (isAIChat) {

setIsTyping(true);
const res = await axios.post(
`${API}/api/ai/chat`,
{ message: userMessage },
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

const aiReply = res.data.reply;
setIsTyping(false);

setMessages((prev) => [
...prev,
{
_id: Date.now() + 1,
sender: "ai",
text: aiReply,
},
]);

return;

}


/* USER CHAT */
await axios.post(
`${API}/api/chat/send`,
{
receiverId: buddyId,
text: userMessage,
},
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

socket.emit("send_message", {
receiverId: buddyId,
text: userMessage,
});

socket.emit("typing_stop", {
receiverId: buddyId,
});

} catch (error) {
console.log("Send error", error);
}

};


if (loading) return <p>Loading chat...</p>;

return (
<div className="chat-page-wrapper">
<div className="chat-interface">
{/* HEADER */}
<div className="chat-header">
<div className="header-info">
<div className="avatar-circle">
{buddy?.name?.charAt(0) || "S"}
</div>
<div className="header-text-group">
<h2 className="header-name">
{isAIChat ? "StudySync AI" : buddy?.name}
</h2>
<span className={`status-pill ${isOnline ? "online" : "offline"}`}>
{isOnline ? "Online" : "Offline"}
</span>
</div>
</div>
</div>

{/* MESSAGES AREA */}
<div className="message-container">
{messages.map((msg) => {
const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
const isMe = String(senderId) === String(currentUserId);
const isAI = msg.sender === "ai";

return (
<div 
key={msg._id} 
className={`message-wrapper ${isMe ? "sent" : isAI ? "ai-msg" : "received"}`}
>
<div className="message-bubble">
{!isMe && (
<span className="sender-label">
{isAI ? "✨ AI Assistant" : buddy?.name}
</span>
)}
<div className="message-text">
<ReactMarkdown remarkPlugins={[remarkGfm]}>
{msg.text}
</ReactMarkdown>
</div>
</div>
</div>
);
})}

{isTyping && (
<div className="typing-indicator">
<div className="typing-dots">
<span></span><span></span><span></span>
</div>
<p>{buddy?.name} is typing...</p>
</div>
)}
<div ref={bottomRef}></div>
</div>

{/* INPUT AREA */}
<div className="input-area">
<div className="input-wrapper">
<input
type="text"
value={text}
onChange={(e) => {
setText(e.target.value);
if (!isAIChat) {
socket.emit("typing_start", { receiverId: buddyId });
}
}}
onKeyDown={(e) => e.key === 'Enter' && handleSend()}
placeholder="Type a message..."
className="chat-input"
/>
<button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
<svg viewBox="0 0 24 24" width="24" height="24">
<path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
</svg>
</button>
</div>
</div>
</div>
</div>
);

}