const jwt=require("jsonwebtoken");

const protect=async(req,res,next)=>{
const authHeader=req.headers.authorization;
try{
  if(!authHeader||!authHeader.startsWith("Bearer")){
  res.status(401).json({message:"Token doesn't exists,authorization denined!"});
}
const token=authHeader.split(" ")[1];
const decoded=jwt.verify(token,process.env.JWT_SECRET);
req.user=decoded;
next();
}catch(error){
  res.status(401).json({message:"Token is not valid"});
}
};

module.exports=protect;

