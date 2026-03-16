const User=require("../models/User");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

exports.register=async (req,res)=>{
try{
  const {name,email,password}=req.body;
if(!name||!email||!password){
return res.status(400).json({message:"All fields are required"});
}
const existingUser=await User.findOne({email});
if(existingUser){
return res.status(409).json({message:"Email already registered"});
}
const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt);

const user=await User.create({
name,
email,
password:hashedPassword
});

return res.status(201).json({
message:"User registered Successfully!",
user:{
id:user._id,
name:user.name,
email:user.email
},
});
} catch(error){
  console.log("Register Error",error.message);
  res.status(500).json({message:"Server Error"});
}
}

exports.login=async(req,res)=>{
try{
 const { email, password } = req.body;
if (!email || !password) {
return res.status(400).json({ message: "All fields are required" });
}
const user = await User.findOne({ email });
if (!user) {
return res.status(401).json({ message: "Invalid credentials" });
}
const isMatch=await bcrypt.compare(password,user.password);
if(!isMatch){
return res.status(401).json({ message: "Invalid credentials" });
}

const token=jwt.sign(
{id:user._id},
process.env.JWT_SECRET,
{expiresIn:process.env.JWT_EXPIRES_IN}
);

return res.status(200).json({
message:"Login Successful",
token,
user:{
id:user._id,
name:user.name,
email:user.email
},
});
} catch(error){
console.log("Login Error",error.message);
res.status(500).json({message:"Server error"});
}
};

exports.updateProfile=async (req,res)=>{
try{
const userId=req.user.id;
const{
bio,
city,
level,
dailyStudyHours,
preferredStudyTime,
goal,
topics,
availability,
}=req.body;

const user=await User.findById(userId);
if(!user){
return res.status(404).json({message:"User not found"});
}
if (level) user.level = level;
if (preferredStudyTime) user.preferredStudyTime = preferredStudyTime;
if (goal) user.goal = goal;
if (dailyStudyHours!==undefined){
  if(dailyStudyHours<=0){
    res.status(400).json({
   message:"Daily Study hours must be greater than 0",
    });
  }
  user.dailyStudyHours=dailyStudyHours;
};
if (topics) user.topics = topics;
if (availability) user.availability = availability;
if (bio !== undefined) user.bio = bio;
if (city !== undefined) user.city = city;
user.save();
res.status(200).json({
message:"Profile updated successfully",
user,
});
}catch(error){
  res.status(500).json({message:"Server Error"});
}
};