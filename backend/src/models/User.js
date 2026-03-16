const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
{
from:{type:String},
to:{type:String},
},
{_id:false}
);

const userSchema = new mongoose.Schema({
name: {
type: String,
required: true,
trim: true,
minlength: 2,
},
email: {
type: String,
required: true,
lowercase: true,
unique: true,
trim: true,
},
password: {
type: String,
required: true,
minlength: 6,
},

bio: {
type: String,
default: "",
},

city: {
type: String,
default: "",
},

level: {
type: String,
enum: ["Beginner", "Intermediate", "Advanced"],
default: null,
},

dailyStudyHours: {
type: Number,
default: null,
},

preferredStudyTime: {
type: String,
enum: ["Morning", "Afternoon", "Evening", "Night"],
default: null,
},

goal: {
type: String,
enum: ["Internship", "Exam", "Skill Learning", "Placement"],
default: null,
},

topics: {
type: [String],
default: [],
},

availability: {
monday: { type: availabilitySchema, default: null },
tuesday: { type: availabilitySchema, default: null },
wednesday: { type: availabilitySchema, default: null },
thursday: { type: availabilitySchema, default: null },
friday: { type: availabilitySchema, default: null },
saturday: { type: availabilitySchema, default: null },
sunday: { type: availabilitySchema, default: null },
},

streakCount: {
type: Number,
default: 0,
},

lastCheckIn: {
type: Date,
default: null,
},
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);