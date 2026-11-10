import { supabase } from "./supabaseClient.js";
import { searchPhotos } from "./unsplashClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { BODY_TYPES } from "./bodyShape.js";
import { renderNav } from "./nav.js";
import { logEvent } from "./usage.js";
import { PHOTOS } from "./photoIndex.js";
import { localPhotoObjects } from "./localPhotos.js";

renderNav("library");

// Require login
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session.user.id;

const profileChip = document.getElementById("profile-chip");
const profileChipText = document.getElementById("profile-chip-text");
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const status = document.getElementById("status");
const results = document.getElementById("results");
const quickTags = document.getElementById("quick-tags");

// Track which Unsplash photo IDs are already saved, so the heart button
// reflects saved state and toggles correctly.
let savedIds = new Set();

async function loadSavedIds() {
  const { data } = await supabase
    .from("favorites")
    .select("photo_id")
    .eq("user_id", userId);
  savedIds = new Set((data || []).map((row) => row.photo_id));
}

async function toggleSave(photo, btn) {
  if (savedIds.has(photo.id)) {
    await supabase.from("favorites").delete().eq("user_id", userId).eq("photo_id", photo.id);
    savedIds.delete(photo.id);
    btn.classList.remove("is-saved");
    btn.textContent = "♡";
  } else {
    await supabase.from("favorites").insert({
      user_id: userId,
      photo_id: photo.id,
      image_url: photo.urls.small,
      photographer: photo.user.name,
      photographer_url: photo.user.links.html,
      query: input.value || "",
    });
    logEvent(userId, "look_saved", photo.id);
    savedIds.add(photo.id);
    btn.classList.add("is-saved");
    btn.textContent = "♥";
  }
}

function renderGrid(photos) {
  results.innerHTML = "";
  photos.forEach((photo) => {
    const card = document.createElement("div");
    card.className = "library-card";

    const isSaved = savedIds.has(photo.id);
    const isPin = photo.source === "pinterest";
    const photographerLink = isPin ? photo.user.links.html : `${photo.user.links.html}?utm_source=stylecue&utm_medium=referral`;
    const unsplashLink = isPin ? photo.user.links.html : `https://unsplash.com/?utm_source=stylecue&utm_medium=referral`;

    card.innerHTML = `
      <img src="${photo.urls.small}" alt="${photo.alt_description || "Style inspiration photo"}" loading="lazy" />
      <button class="library-card__save${isSaved ? " is-saved" : ""}" type="button">${isSaved ? "♥" : "♡"}</button>
      <div class="library-credit">
        <a href="${photographerLink}" target="_blank" rel="noopener">${photo.user.name}</a>
        <a href="${unsplashLink}" target="_blank" rel="noopener">${isPin ? "Pinterest" : "Unsplash"}</a>
      </div>
    `;

    card.querySelector(".library-card__save").addEventListener("click", (e) => {
      toggleSave(photo, e.currentTarget);
    });

    results.appendChild(card);
  });
}

async function runSearch(term) {
  if (!term.trim()) return;
  input.value = term;
  status.textContent = `Searching "${term}"…`;
  results.innerHTML = "";

  try {
    const data = await searchPhotos(term);
    if (!data.results || data.results.length === 0) {
      results.innerHTML = `<div class="library-empty">No results for "${term}". Try another word.</div>`;
      status.textContent = "";
      return;
    }
    status.textContent = `${data.total.toLocaleString()} results for "${term}"`;
    renderGrid(data.results);
  } catch (err) {
    console.error(err);
    status.textContent = "Look photos could not load. Check your connection and try again.";
  }
}

const TRENDS = [
  { key: "oldmoney", label: "Old money", term: "old money outfit woman" },
  { key: "cleangirl", label: "Clean girl", term: "clean girl aesthetic outfit" },
  { key: "coquette", label: "Coquette", term: "coquette style outfit" },
  { key: "darkacademia", label: "Dark academia", term: "dark academia outfit woman" },
  { key: "y2k", label: "Y2K", term: "y2k outfit woman" },
  { key: "gorpcore", label: "Gorpcore", term: "gorpcore outfit woman" },
  { key: "cowgirl", label: "Cowgirl", term: "cowgirl outfit woman" },
  { key: "mobwife", label: "Mob wife", term: "mob wife aesthetic outfit" },
  { key: "balletcore", label: "Balletcore", term: "balletcore outfit" },
];

async function runTrend(trend) {
  input.value = trend.label;
  status.textContent = `${trend.label} looks…`;
  const local = await localPhotoObjects(PHOTOS.trends[trend.key], `trend-${trend.key}`, trend.label);
  let extra = [];
  try { extra = (await searchPhotos(trend.term)).results || []; } catch { /* offline: show the saved photos only */ }
  status.textContent = `${local.length + extra.length} ${trend.label} looks`;
  renderGrid([...local, ...extra]);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  runSearch(input.value);
});

// ---- Set up quick tags + profile-seeded default search ----
async function init() {
  await loadSavedIds();

  const { data: profile } = await supabase
    .from("profiles")
    .select("body_shape, style_personality")
    .eq("id", userId)
    .single();

  const style = profile?.style_personality ? STYLE_TYPES[profile.style_personality] : null;
  const bodyType = profile?.body_shape ? BODY_TYPES[profile.body_shape] : null;

  // Quick tags: a handful of popular styles, always available
  const tagList = ["classic", "minimalist", "bohemian", "streetwear", "cottagecore", "edgy"];
  quickTags.innerHTML = tagList
    .map((key) => `<button type="button" class="library-tag" data-term="${STYLE_TYPES[key].keywords}">${STYLE_TYPES[key].name}</button>`)
    .join("");
  quickTags.querySelectorAll(".library-tag").forEach((btn) => {
    btn.addEventListener("click", () => runSearch(btn.dataset.term));
  });

  const trendRow = document.getElementById("trend-tags");
  if (trendRow) {
    trendRow.innerHTML = TRENDS.map((t) => `<button type="button" class="library-tag" data-trend="${t.key}">${t.label}</button>`).join("");
    trendRow.querySelectorAll(".library-tag").forEach((btn) => btn.addEventListener("click", () => runTrend(TRENDS.find((t) => t.key === btn.dataset.trend))));
  }

  if (style && bodyType) {
    profileChip.style.display = "inline-flex";
    profileChipText.textContent = `Searching for your profile: ${style.name} × ${bodyType.name}`;
    const combinedQuery = `${style.keywords} ${bodyType.keywords}`;
    runSearch(combinedQuery);
  } else {
    // Profile incomplete, fall back to a default and nudge them to finish it
    status.innerHTML = `Complete your <a href="bodytype.html">body shape</a> and <a href="quiz.html">style quiz</a> to get looks matched to you, showing a general search for now.`;
    runSearch("fashion outfit inspiration");
  }
}

init();
