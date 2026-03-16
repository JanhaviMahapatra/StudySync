const express = require("express");
const axios = require("axios");

const router=express.Router();

router.post("/chat", async (req, res) => {
const {message}=req.body;
console.log(process.env.OPENROUTER_API_KEY);
try {
const response = await axios.post(
"https://openrouter.ai/api/v1/chat/completions",
{
model:"deepseek/deepseek-chat",
messages:[
{
role:"system",
content:"You are a helpful study tutor who explains concepts clearly and simply."
},  
{
role:"user",
content:message
}
]
},
{
headers:{
"Authorization":`Bearer ${process.env.OPENROUTER_API_KEY}`,
"Content-Type":"application/json"
}
}
);
const reply=response.data.choices[0].message.content;
res.json({reply});

} catch(error){
console.error(error);
res.status(500).json({ error: "AI failed" });
}
});

module.exports = router;