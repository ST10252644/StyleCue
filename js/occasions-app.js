import { supabase } from "./supabaseClient.js";
import { searchPhotos } from "./unsplashClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { BODY_TYPES } from "./bodyShape.js";
import { renderNav } from "./nav.js";
import { showToast } from "./toast.js";

renderNav("occasions");

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session.user.id;

const OCCASIONS = [
  { key: "work", label: "Work", search: "work outfit professional" },
  { key: "date", label: "Date night", search: "date night outfit" },
  { key: "wedding", label: "Wedding guest", search: "wedding guest outfit" },
  { key: "interview", label: "Interview", search: "job interview outfit professional" },
  { key: "weekend", label: "Weekend casual", search: "weekend casual outfit" },
  { key: "night-out", label: "Night out", search: "night out outfit" },
  { key: "vacation", label: "Vacation", search: "vacation travel outfit" },
];

const tagsEl = document.getElementById("occasion-tags");
const adviceEl = document.getElementById("advice-text");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

let style = null;
let bodyType = null;
let savedIds = new Set();

async function loadProfile() {
  const { data: profile } = await supabase
    .from("profiles")
    .select("body_shape, style_personality")
    .eq("id", userId)
    .single();

  style = profile?.style_personality ? STYLE_TYPES[profile.style_personality] : null;
  bodyType = profile?.body_shape ? BODY_TYPES[profile.body_shape] : null;

  const { data: favs } = await supabase.from("favorites").select("photo_id").eq("user_id", userId);
  savedIds = new Set((favs || []).map((f) => f.photo_id));
}

function renderShimmer(count = 12) {
  resultsEl.innerHTML = "";
  const heights = [220, 280, 200, 260, 240, 300];
  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "shimmer-card";
    card.style.height = `${heights[i % heights.length]}px`;
    resultsEl.appendChild(card);
  }
}

function renderGrid(photos, term) {
  resultsEl.innerHTML = "";
  photos.forEach((photo) => {
    const card = document.createElement("div");
    card.className = "library-card";
    const isSaved = savedIds.has(photo.id);
    const photographerLink = `${photo.user.links.html}?utm_source=stylecue&utm_medium=referral`;
    card.innerHTML = `
      <img src="${photo.urls.small}" alt="${photo.alt_description || "Outfit inspiration"}" loading="lazy" />
      <button class="library-card__save${isSaved ? " is-saved" : ""}" type="button">${isSaved ? "♥" : "♡"}</button>
      <div class="library-credit">
        <a href="${photographerLink}" target="_blank" rel="noopener">${photo.user.name}</a>
        <a href="https://unsplash.com/?utm_source=stylecue&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>
      </div>
    `;
    card.querySelector(".library-card__save").addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      if (savedIds.has(photo.id)) {
        await supabase.from("favorites").delete().eq("user_id", userId).eq("photo_id", photo.id);
        savedIds.delete(photo.id);
        btn.classList.remove("is-saved");
        btn.textContent = "♡";
        showToast("Removed from saved looks.");
      } else {
        await supabase.from("favorites").insert({
          user_id: userId,
          photo_id: photo.id,
          image_url: photo.urls.small,
          photographer: photo.user.name,
          photographer_url: photo.user.links.html,
          query: term,
        });
        savedIds.add(photo.id);
        btn.classList.add("is-saved");
        btn.textContent = "♥";
        showToast("Saved to your profile.");
      }
    });
    resultsEl.appendChild(card);
  });
}

async function selectOccasion(occasion) {
  tagsEl.querySelectorAll(".library-tag").forEach((b) => b.classList.toggle("is-active", b.dataset.key === occasion.key));

  const parts = [occasion.search];
  if (style) parts.push(style.keywords);
  if (bodyType) parts.push(bodyType.keywords);
  const term = parts.join(" ");

  if (style && bodyType) {
    adviceEl.textContent = `For ${occasion.label.toLowerCase()}, lean on ${style.name.toLowerCase()} pieces cut for your ${bodyType.name.toLowerCase()} shape, think ${style.keyPieces.slice(0, 2).join(" or ").toLowerCase()}.`;
  } else {
    adviceEl.innerHTML = `Complete your <a href="bodytype.html">body shape</a> and <a href="quiz.html">style quiz</a> for outfit advice tailored to you.`;
  }

  statusEl.textContent = `Searching for ${occasion.label.toLowerCase()} looks…`;
  renderShimmer();

  try {
    const data = await searchPhotos(term);
    if (!data.results || data.results.length === 0) {
      resultsEl.innerHTML = `<div class="library-empty">No results, try another occasion.</div>`;
      statusEl.textContent = "";
      return;
    }
    statusEl.textContent = `${data.results.length} looks for ${occasion.label.toLowerCase()}`;
    renderGrid(data.results, term);
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Look photos could not load. Check your connection and try again.";
    resultsEl.innerHTML = "";
  }
}

async function init() {
  await loadProfile();
  tagsEl.innerHTML = OCCASIONS.map((o) => `<button type="button" class="library-tag" data-key="${o.key}">${o.label}</button>`).join("");
  tagsEl.querySelectorAll(".library-tag").forEach((btn) => {
    btn.addEventListener("click", () => {
      const occasion = OCCASIONS.find((o) => o.key === btn.dataset.key);
      selectOccasion(occasion);
    });
  });
  selectOccasion(OCCASIONS[0]);
}

init();
