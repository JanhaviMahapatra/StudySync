const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();
const app=require("./app");
const http=require("http");
const {Server}=require("socket.io");
const connectDB=require("./config/db");
const jwt = require("jsonwebtoken");

const PORT=process.env.PORT||5000;

connectDB();

const server=http.createServer(app);

const io=new Server(server,
{
cors:{
origin:"https://study-sync-4ft8te2y7-janhavis-projects-3126d697.vercel.app",
methods:["GET","POST"],
},
});

app.set("io",io);

/* The map where all of our online coming users will be stored with their id as key and socket.id as value */
const onlineUsers=new Map();

io.on("connection",(socket)=>{
try{
const token=socket.handshake.auth.token;
if(!token){
return socket.disconnect();
}
const decoded=jwt.verify(token,process.env.JWT_SECRET);
const userId=decoded.id;

socket.join(userId);
/* Right after the room creation the userId will be added to the online users list */
onlineUsers.set(userId,socket.id);
/*broadcast new user online*/
io.emit("user_online",userId);
/*send current online users list to the newly connected user*/
socket.emit("online_users", Array.from(onlineUsers.keys()));

console.log("User connected:",userId);

socket.on("send_message",(data)=>{
const{receiverId,text}=data;

const message={
 senderId:userId,
 receiverId,
 text,
};

io.to(receiverId).emit("receive_message",message);
});


socket.on("disconnect", () => {
console.log("User disconnected:", userId);
/* And after the userId gets disconnected we'll remove it from the onlineusers list*/
onlineUsers.delete(userId);
io.emit("user_offline",userId);
});



//typing indicator
//typing_start
socket.on("typing_start",({receiverId})=>{
io.to(receiverId).emit("typing_start",{
senderId:userId,
});
});
//typing_stop
socket.on("typing_stop",({receiverId})=>{
io.to(receiverId).emit("typing_stop",{
senderId:userId,
});
});

}catch(error){
console.log("Socket auth error");
socket.disconnect();
}
});

server.listen(PORT,()=>{
console.log(`Server running on http://localhost:${PORT}`);
});
