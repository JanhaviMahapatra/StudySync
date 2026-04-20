const express=require("express");
const cors=require("cors");

const authRoutes=require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const matchRoutes=require("./routes/match.routes");
const buddyRoutes=require("./routes/buddy.routes");
const chatRoutes=require("./routes/chat.routes");
const aiRoutes=require("./routes/ai.routes");

const app=express();

app.use(cors({
  origin: "https://study-sync-cl9hscrxa-janhavis-projects-3126d697.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.get("/",(req,res)=>{
res.json({message:"StudySync API running..."});
});

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/match",matchRoutes);
app.use("/api/buddy",buddyRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/ai",aiRoutes);

module.exports=app;
