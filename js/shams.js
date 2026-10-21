const quotes = [
  "خطوة صغيرة اليوم قد تفتح باباً لم تتوقعه.",
  "اترك مساحة للفضول، فليس كل جميل مخططاً له.",
  "لا تحتاج الفكرة الجيدة إلى ضجيج كي تبدأ.",
  "بعض الأيام يكفيها سؤال جديد وقهوة دافئة.",
  "خفّف جدّيتك قليلاً؛ ربما يختبئ الحل في الضحك."
];
function todayKey() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");
}
const date = new Date();
const dateNode = document.getElementById("today-date");
if (dateNode) dateNode.textContent = date.toLocaleDateString("ar", {weekday:"long", year:"numeric", month:"long", day:"numeric"});
const quoteNode = document.getElementById("daily-quote");
if (quoteNode) {
  const key = todayKey();
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  quoteNode.textContent = quotes[hash % quotes.length];
}
