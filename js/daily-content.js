const root = document.getElementById("daily-content-root");
const dateLabel = document.getElementById("daily-content-date");
const make = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
function sources(parent, items) {
  const safe = Array.isArray(items) ? items.filter(x => x && /^https:\/\//i.test(x.url || "")) : [];
  if (!safe.length) return;
  const details = make("details", "daily-sources");
  details.appendChild(make("summary", "", "المصادر"));
  const list = make("ul");
  safe.forEach(x => { const li = make("li"); const a = make("a", "", x.label || "المصدر"); a.href=x.url; a.target="_blank"; a.rel="noopener noreferrer"; li.appendChild(a); list.appendChild(li); });
  details.appendChild(list); parent.appendChild(details);
}
function card(title, body, cls, src) {
  const article=make("article","daily-card "+cls);
  article.appendChild(make("h3","",title));
  article.appendChild(make("p","daily-card-body",body || ""));
  sources(article,src); return article;
}
async function load() {
  if (!root) return;
  try {
    const response=await fetch("content/daily-content.json?ts="+Date.now(),{cache:"no-store"});
    if(!response.ok) throw new Error("HTTP "+response.status);
    const data=await response.json();
    if(data.language!=="ar" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error("Invalid content");
    if(dateLabel) { dateLabel.dateTime=data.date; dateLabel.textContent=new Date(data.date+"T12:00:00").toLocaleDateString("ar",{dateStyle:"full"}); }
    root.replaceChildren();
    if(data.horoscope) { const c=card("برج الدلو",data.horoscope.body,"daily-card-horoscope",data.horoscope.sources); if(data.horoscope.astronomy_note)c.appendChild(make("p","daily-note",data.horoscope.astronomy_note)); if(data.horoscope.astrology_note)c.appendChild(make("p","daily-note",data.horoscope.astrology_note)); root.appendChild(c); }
    if(data.story) root.appendChild(card(data.story.title || "قصة اليوم",data.story.body,"daily-card-story",data.story.sources));
    if(data.joke) root.appendChild(card("نكتة اليوم",data.joke.body,"daily-card-joke",[]));
    root.appendChild(make("p","daily-content-footnote","المعلومات التاريخية مرتبطة بمصادرها؛ والتنجيم للتسلية وليس تنبؤاً علمياً مثبتاً."));
  } catch(e) {
    root.replaceChildren(make("p","daily-content-status","تعذّر تحميل محتوى اليوم. تحقق من الاتصال ثم أعد تحميل الصفحة."));
    console.error("Shams daily content:",e);
  }
}
load();
