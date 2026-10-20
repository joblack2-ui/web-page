const root = document.getElementById("daily-content-root");
const dateLabel = document.getElementById("daily-content-date");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function addSources(parent, sources) {
  const safe = Array.isArray(sources) ? sources.filter(s => s && typeof s.url === "string" && /^https:\/\//i.test(s.url)) : [];
  if (!safe.length) return;
  const details = element("details", "daily-sources");
  details.appendChild(element("summary", "", "المصادر"));
  const list = element("ul");
  safe.slice(0, 4).forEach(source => {
    const item = element("li");
    const a = element("a", "", String(source.label || "المصدر"));
    a.href = source.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    item.appendChild(a);
    list.appendChild(item);
  });
  details.appendChild(list);
  parent.appendChild(details);
}

function addCard(parent, title, text, kind, sources) {
  const card = element("article", "daily-card daily-card-" + kind);
  card.appendChild(element("h3", "", title));
  card.appendChild(element("p", "daily-card-body", text));
  addSources(card, sources);
  parent.appendChild(card);
}

async function loadDailyContent() {
  if (!root) return;
  try {
    const response = await fetch("content/daily-content.json?ts=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("تعذّر تحميل المحتوى");
    const data = await response.json();
    if (!data || data.language !== "ar" || !data.date) throw new Error("صيغة المحتوى غير صالحة");
    if (dateLabel) {
      dateLabel.textContent = new Date(data.date + "T12:00:00").toLocaleDateString("ar", { dateStyle: "full" });
    }
    root.replaceChildren();
    if (data.horoscope) {
      const card = element("article", "daily-card daily-card-horoscope");
      card.appendChild(element("h3", "", "برج الدلو"));
      card.appendChild(element("p", "daily-card-body", data.horoscope.body || "لا يتوفر تحديث موثوق اليوم."));
      if (data.horoscope.astronomy_note) card.appendChild(element("p", "daily-note", data.horoscope.astronomy_note));
      if (data.horoscope.astrology_note) card.appendChild(element("p", "daily-note", data.horoscope.astrology_note));
      addSources(card, data.horoscope.sources);
      root.appendChild(card);
    }
    if (data.story) addCard(root, data.story.title || "قصة عالمية حقيقية", data.story.body || "", "story", data.story.sources);
    if (data.joke) addCard(root, "نكتة اليوم", data.joke.body || "", "joke", []);
    if (!root.children.length) throw new Error("لا يوجد محتوى منشور");
    root.appendChild(element("p", "daily-content-footnote", "تُعرض الحقائق مع مصادرها؛ والتنجيم للتسلية وليس تنبؤاً علمياً مثبتاً."));
  } catch (error) {
    root.replaceChildren(element("p", "daily-content-status", "المحتوى اليومي الموثّق قيد الإعداد. أعد المحاولة لاحقاً."));
    if (dateLabel) dateLabel.textContent = "";
    console.error("Daily content:", error);
  }
}
loadDailyContent();