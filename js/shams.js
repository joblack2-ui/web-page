import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const fallbackQuotes = [
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

const fallbackCharacters = [
  "a sleepy detective","a stubborn rabbit","a librarian who hates books",
  "a time traveler with a broken watch","a chef who cannot cook",
  "a tiny astronaut","a musician carrying one mysterious key",
  "an overly confident pigeon","a programmer who talks to plants"
];

const fallbackPlaces = [
  "an empty train at midnight","a rooftop above the city","a bakery that opens only on Tuesdays",
  "a forgotten space station","a rainy village square","a hotel with one impossible room",
  "a forest where every tree has a name","a quiet café at the edge of time",
  "a supermarket two minutes before closing"
];

const fallbackSurprises = [
  "discovered that the moon had left a note",
  "found a door that was not there five minutes ago",
  "received a message from tomorrow",
  "realized the entire room was quietly listening",
  "opened a box containing exactly one warm cookie",
  "met someone who already knew how the story ended",
  "heard a voice coming from inside an ordinary spoon",
  "found a map leading to the place they were already standing"
];

const headers = {
  apikey: SUPABASE_KEY
};

function seededIndex(seed, length) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i) | 0;
  }
  return Math.abs(hash) % length;
}

function getTodayKey() {
  const d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function readTable(table, params = "") {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${params}`,
    { headers }
  );
  if (!response.ok) throw new Error(`${table}: ${response.status}`);
  return response.json();
}

function todayDateLabel() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

async function loadLab() {
  const todayKey = getTodayKey();

  document.getElementById("today-date").textContent = todayDateLabel();

  const [
    settingsResult,
    contentResult,
    storyPartsResult,
    featuresResult
  ] = await Promise.allSettled([
    readTable("shams_lab_settings", "select=*&id=eq.true&limit=1"),
    readTable("shams_lab_content", "select=*&is_published=eq.true&order=sort_order.asc"),
    readTable("shams_lab_story_parts", "select=*&is_active=eq.true&order=sort_order.asc"),
    readTable("shams_lab_features", "select=*&enabled=eq.true")
  ]);

  const settings = settingsResult.status === "fulfilled"
    ? settingsResult.value[0]
    : null;

  const content = contentResult.status === "fulfilled"
    ? contentResult.value
    : [];

  const storyParts = storyPartsResult.status === "fulfilled"
    ? storyPartsResult.value
    : [];

  const enabledFeatures = featuresResult.status === "fulfilled"
    ? new Set(featuresResult.value.map(x => x.feature_key))
    : new Set(["daily_spark", "story_machine", "horoscope", "daily_joke"]);

  if (settings) {
    document.title = settings.site_title || "Shams Little Lab";
    document.getElementById("site-title").textContent = settings.site_title || "Shams Little Lab";
    document.getElementById("site-subtitle").textContent =
      settings.site_subtitle || "Small daily sparks, tiny stories, zero external APIs.";
    document.getElementById("site-status").textContent = settings.status_text || "ONLINE";
    document.getElementById("footer-left").textContent = settings.footer_left || "BUILT BY SHAMS";
    document.getElementById("footer-middle").textContent = settings.footer_middle || "RUNS IN YOUR BROWSER";
    document.getElementById("footer-right").textContent = settings.footer_right || "SUPABASE DATA / NO AI CALL";
  }

  const sparks = content
    .filter(x => x.content_type === "spark" && x.metadata?.date === todayKey);

  document.getElementById("daily-quote").textContent =
    sparks[0]?.body || fallbackQuotes[seededIndex(todayKey, fallbackQuotes.length)];

  const horoscopes = content.filter(
    x => x.metadata?.kind === "horoscope" && x.metadata?.date === todayKey
  );
  const horoscope = horoscopes[seededIndex(todayKey, Math.max(horoscopes.length, 1))];
  document.getElementById("horoscope-output").textContent =
    horoscope?.body || "The stars are still loading their paperwork.";

  const jokes = content.filter(
    x => x.metadata?.kind === "joke" && x.metadata?.date === todayKey
  );
  document.getElementById("joke-output").textContent =
    jokes[0]?.body || "Why did the bug cross the page? To get to the other div.";

  const characters = storyParts.filter(x => x.part_type === "character").map(x => x.text);
  const places = storyParts.filter(x => x.part_type === "place").map(x => x.text);
  const surprises = storyParts.filter(x => x.part_type === "surprise").map(x => x.text);

  const storyData = {
    characters: characters.length ? characters : fallbackCharacters,
    places: places.length ? places : fallbackPlaces,
    surprises: surprises.length ? surprises : fallbackSurprises
  };

  window.__shamsStoryData = storyData;

  document.getElementById("horoscope-card").hidden = !enabledFeatures.has("horoscope");
  document.getElementById("joke-card").hidden = !enabledFeatures.has("daily_joke");
  document.querySelector(".daily-card").hidden = !enabledFeatures.has("daily_spark");
  document.getElementById("story-card").hidden = !enabledFeatures.has("story_machine");

  if (
    enabledFeatures.has("support_button") &&
    settings?.support_url
  ) {
    const slot = document.getElementById("support-slot");
    slot.innerHTML = `<a class="support-button" href="${settings.support_url}" target="_blank" rel="noopener">SUPPORT SHAMS</a>`;
  }
}

function generateStory() {
  const data = window.__shamsStoryData || {
    characters: fallbackCharacters,
    places: fallbackPlaces,
    surprises: fallbackSurprises
  };

  const character = pick(data.characters);
  const place = pick(data.places);
  const surprise = pick(data.surprises);

  const story =
    `Once upon a slightly strange evening, ${character} arrived at ${place}. ` +
    `Everything seemed normal until they ${surprise}. They stared at each other for a moment, ` +
    `decided this was probably above their pay grade, and went looking for coffee. ` +
    `By sunrise, nobody could explain what happened — but everyone agreed it had been a good story.`;

  document.getElementById("story-output").textContent = story;
}

document.getElementById("generate-story").addEventListener("click", generateStory);

loadLab().catch(() => {
  const todayKey = getTodayKey();
  document.getElementById("today-date").textContent = todayDateLabel();
  document.getElementById("daily-quote").textContent =
    fallbackQuotes[seededIndex(todayKey, fallbackQuotes.length)];
});
