const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth.middleware");
const User=require("../models/User");
const { updateProfile } = require("../controllers/auth.controller");

router.get("/me",protect,async (req,res)=>{
try{
const user=await User.findById(req.user.id).select("-password");

const profileComplete=
user.level&&
user.dailyStudyHours&&
user.goal&&
user.topics.length>0;

res.status(200).json({
message:"Protected route accessed successfully.",
user,
profileComplete,
});
}catch(error){
res.status(500).json({message:"Server error"})
}
});


router.put("/profile",protect,updateProfile);
module.exports=router;