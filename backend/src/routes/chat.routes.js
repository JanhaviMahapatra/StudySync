const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth.middleware");
const User=require("../models/User")
const Message=require("../models/Message");
const BuddyRequest=require("../models/BuddyRequest");

router.post("/send",protect,async (req,res)=>{
try{
  const senderId=req.user.id;
const {receiverId,text}=req.body;

if(!receiverId||!text){
return res.status(400).json({message:"Receiver and text required "});
}

const connection=await BuddyRequest.findOne({
$or:[
  {from:senderId,to:receiverId},
  {from:receiverId,to:senderId},
],
status:"accepted",
});

if(!connection){
return  res.status(403).json({message:"You are not buddies"})
}

const message=await Message.create({
sender:senderId,
receiver:receiverId,
text:text,
});

res.status(201).json({message:"Message sent",data:message});
}catch(error){
console.log("Message sending error:",error.message);
res.status(500).json({message:"Server error"});
}
});


router.get("/:buddyId",protect,async (req,res)=>{
try{
const currentUserId=req.user.id;
const {buddyId}=req.params;

const connection=await BuddyRequest.findOne({
$or:[
  {from:currentUserId,to:buddyId},
  {from:buddyId,to:currentUserId},
],
status:"accepted",
});

if(!connection){
return res.status(403).json({message:"You are not buddies"})
}

const messages=await Message.find({
$or:[
{sender:currentUserId,receiver:buddyId},
{sender:buddyId,receiver:currentUserId},
],
}).sort({createdAt:1});

const buddy=await User.findById(buddyId).select("name level goal")

res.status(200).json({buddy,messages});
}catch(error){
console.error("Fetch conversation error:", error.message);
res.status(500).json({ message: "Server error" });
}
});

module.exports=router;