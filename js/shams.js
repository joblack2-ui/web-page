const quotes=[
  "You are allowed to be a little ridiculous today.",
  "A tiny decision can secretly change the whole afternoon.",
  "Today has excellent potential for an unnecessary adventure.",
  "If the plan feels too serious, add one spoon of chaos.",
  "Someone is thinking about you. It might even be you.",
  "Do one small thing today that future-you will find funny.",
  "Your next good idea may arrive wearing a terrible disguise.",
  "Not every mystery needs solving before dinner.",
  "Today is suspiciously good for pressing the wrong button.",
  "Keep your expectations light and your curiosity switched on."
];

const characters=[
  "a sleepy detective","a stubborn rabbit","a librarian who hates books",
  "a time traveler with a broken watch","a chef who cannot cook",
  "a tiny astronaut","a musician carrying one mysterious key",
  "an overly confident pigeon","a programmer who talks to plants"
];

const places=[
  "an empty train at midnight","a rooftop above the city","a bakery that opens only on Tuesdays",
  "a forgotten space station","a rainy village square","a hotel with one impossible room",
  "a forest where every tree has a name","a quiet café at the edge of time",
  "a supermarket two minutes before closing"
];

const surprises=[
  "discovered that the moon had left a note",
  "found a door that was not there five minutes ago",
  "received a message from tomorrow",
  "realized the entire room was quietly listening",
  "opened a box containing exactly one warm cookie",
  "met someone who already knew how the story ended",
  "heard a voice coming from inside an ordinary spoon",
  "found a map leading to the place they were already standing"
];

function seededIndex(seed, length){
  let hash=0;
  for(let i=0;i<seed.length;i++) hash=((hash<<5)-hash)+seed.charCodeAt(i)|0;
  return Math.abs(hash)%length;
}

function getTodayKey(){
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

const todayKey=getTodayKey();
document.getElementById("today-date").textContent=new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
document.getElementById("daily-quote").textContent=quotes[seededIndex(todayKey,quotes.length)];

function pick(list){
  return list[Math.floor(Math.random()*list.length)];
}

function generateStory(){
  const character=pick(characters);
  const place=pick(places);
  const surprise=pick(surprises);
  const story=`Once upon a slightly strange evening, ${character} arrived at ${place}. Everything seemed normal until they ${surprise}. They stared at each other for a moment, decided this was probably above their pay grade, and went looking for coffee. By sunrise, nobody could explain what happened — but everyone agreed it had been a good story.`;
  document.getElementById("story-output").textContent=story;
}

document.getElementById("generate-story").addEventListener("click",generateStory);
