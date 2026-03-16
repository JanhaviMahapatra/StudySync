const calculateMatch=(userA,userB)=>{
let score=0;
const reasons=[];

if(userA.goal&&userA.goal===userB.goal){
  score+=20;
  reasons.push(`Same goal (${userA.goal})`);
}
if(userA.preferredStudyTime&&userA.preferredStudyTime===userB.preferredStudyTime){
  score+=15;
  reasons.push(`Same preferred study time (${userA.preferredStudyTime})`);
}
if(userA.dailyStudyHours&&userB.dailyStudyHours&&Math.abs(userA.dailyStudyHours-userB.dailyStudyHours<=1)){
  score+=10;
  reasons.push(`Same daily study hours (${userA.dailyStudyHours})`);
}

if(userA.topics.length&&userA.topics.length){
const commonTopics=userA.topics.filter((topic)=>{
  userB.topics.includes(topic);
});
const topicPoints=Math.min(commonTopics.length*10,30);
if(topicPoints>0){
score+=topicPoints;
reasons.push(`${commonTopics.length} Common topics (${commonTopics.join(", ")})`);
}
}
if(userA.level&&userA.level===userB.level){
  score+=10;
  reasons.push(`Same level (${userA.level})`);
}
return{
  score,
  reasons,
};
};

module.exports=calculateMatch;