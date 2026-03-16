const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth.middleware");
const User=require("../models/User");
const calculateMatch=require("../utils/match.util");

router.get("/",protect,async (req,res)=>{
try{
const currentUser=await User.findById(req.user.id);
if(!currentUser){
  res.status(404).json({message:"User not found."});
}
const otherUsers=await User.find({
_id:{$ne:currentUser._id},
});

const matches=[];
for(let user of otherUsers){
const {score,reasons} = calculateMatch(user,currentUser);
if(score>=40){
matches.push({
 user:{
  id:user._id,
  name:user.name,
  level:user.level,
  goal:user.goal,
  topics:user.topics,
 },
 score,
 reasons,
});
}
}

matches.sort((a,b)=>b.score-a.score);

res.status(200).json({matches});

}catch(error){
console.log("Match Error",error.message);
res.status(500).json({message:"Server Error"});
}
});

module.exports=router;