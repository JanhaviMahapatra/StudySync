const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth.middleware");
const BuddyRequest=require("../models/BuddyRequest");
const User=require("../models/User");

router.post("/request",protect,async (req,res)=>{
try{
const fromUserId=req.user.id;
const {toUserId}=req.body;

if(!toUserId){
return res.status(400).json({message:"Target user required."});
}

if(fromUserId===toUserId){
return res.status(400).json({message:"You cannot send request to yourself."})
}

const targetUser=await User.findById(toUserId);
if(!targetUser){
return res.status(404).json({message:"User not found"});
}

const existingUser=await BuddyRequest.findOne({
$or:[
  {from:fromUserId,to:toUserId},
  {from:toUserId,to:fromUserId},
],
status:{$in:["pending","accepted"]}
});
if(existingUser){
return res.status(400).json({message:"Request already exists or you are already buddies"});
}

const request=await BuddyRequest.create({
from:fromUserId,
to:toUserId,
status:"pending",
});

res.status(201).json({
message:"Buddy request sent",
request,
});
}catch(error){
console.log("Send request error:",error.message)
res.status(500).json({message:"Server Error"});
}
});


router.get("/requests",protect,async (req,res)=>{
try{
const userId=req.user.id;

const requests=await BuddyRequest.find({
to:userId,
status:"pending",
}).populate("from","name level goal");

res.status(200).json({requests});

}catch(error){
console.log("Requests fetch error",error.message);
res.status(500).json({message:"Server Error"});
}
});

router.put("/accept/:requestId",protect,async (req,res)=>{
try{
const userId=req.user.id;
const {requestId}=req.params;

const request=await BuddyRequest.findById(requestId);

if(!request){
return res.status(404).json({message:"Request doesn't exists"})
}

if(request.to.toString()!==userId){
return res.status(403).json({message:"Not authorized"});
}

if(request.status!=="pending"){
return res.status(400).json({message:"Request has already been handled"});
}

request.status="accepted";
await request.save();
res.status(200).json({message:"Buddy request accepted"});
}catch(error){
console.log("Accept Error",error.message);
res.status(500).json({message:"Server Error"});
}
});


router.put("/reject/:requestId",protect,async (req,res)=>{
try{
const userId=req.user.id;
const {requestId}=req.params;

const request=await BuddyRequest.findById(requestId);

if(!request){
return res.status(404).json({message:"Request doesn't exists"})
}

if(request.to.toString()!==userId){
return res.status(403).json({message:"Not authorized"});
}

if(request.status!=="pending"){
return res.status(400).json({message:"Request has already been handled"});
}

request.status="rejected";
await request.save();

res.status(200).json({message:"Buddy request rejected"});
}catch(error){
console.log("Reject Error",error.message);
res.status(500).json({message:"Server Error"});
}
});

router.get("/my-buddies",protect,async (req,res)=>{
try{
const userId=req.user.id;
const connections=await BuddyRequest.find({
 $or:[{from:userId},{to:userId}],
 status:"accepted"
}).populate("from","name level goal")
.populate("to","name level goal");

const buddies=connections.map((connection)=>{
if(connection.from._id.toString()===userId){
  return connection.to;
} else{
  return connection.from;
}
});

res.status(200).json({buddies});
}catch(error){
console.log("Fetch buddies error:",error.message);
res.status(500).json({message:"Server error"});
}
});

router.delete("/remove/:userId",protect,async (req,res)=>{
try{
const currentUser=req.user.id;
const {userId}=req.params;

const connection=await BuddyRequest.findOne({
$or:[
  {from:currentUser,to:userId},
  {from:userId,to:currentUser},
],
status:"accepted",
});

if(!connection){
return res.status(404).json({message:"Buddy connection not found"})
}

await connection.deleteOne();
res.status(200).json({message:"Buddy removed successfully"});
}catch(error){
console.error("Remove buddy error:", error.message);
res.status(500).json({ message: "Server error" });
}
});

module.exports=router;
