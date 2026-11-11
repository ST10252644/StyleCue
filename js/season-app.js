import { supabase } from "./supabaseClient.js";
import { SEASON_TYPES, SEASON_QUESTIONS, tallySeason, seasonBreakdown } from "./seasonTypes.js";
import { renderNav } from "./nav.js";
import { PHOTOS, quizSeasonImg } from "./photoIndex.js";
import { photoStrip } from "./photoStrip.js";
import { showToast } from "./toast.js";

renderNav("season");

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session.user.id;

const quizPanel = document.getElementById("quiz-panel");
const calculatingPanel = document.getElementById("calculating-panel");
const promptEl = document.getElementById("quiz-prompt");
const optionsEl = document.getElementById("quiz-options");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");

const resultEl = document.getElementById("result");
const resultHeroImg = document.getElementById("result-hero-img");
const resultSeason = document.getElementById("result-season");
const resultTagline = document.getElementById("result-tagline");
const resultReason = document.getElementById("result-reason");
const resultBestColors = document.getElementById("result-best-colors");
const resultAvoidColors = document.getElementById("result-avoid-colors");
const resultMetal = document.getElementById("result-metal");
const tieNote = document.getElementById("tie-note");
const saveMsg = document.getElementById("save-msg");

let current = 0;
const answers = [];
const chosen = [];

function renderQuestion() {
  const q = SEASON_QUESTIONS[current];
  promptEl.textContent = q.prompt;
  progressLabel.textContent = `Question ${current + 1} of ${SEASON_QUESTIONS.length}`;
  progressFill.style.width = `${((current + 1) / SEASON_QUESTIONS.length) * 100}%`;

  optionsEl.innerHTML = "";
  q.options.forEach((opt, optIdx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.innerHTML = `<img class="quiz-option__img" src="${quizSeasonImg(q.imgKey, optIdx)}" alt="" decoding="async" onerror="this.parentElement.classList.add('quiz-option--text');this.remove()" /><span class="quiz-option__label">${opt.label}</span>`;
    btn.addEventListener("click", () => { chosen[current] = opt; selectAnswer(opt.season); });
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(season) {
  answers[current] = season;
  current++;
  if (current < SEASON_QUESTIONS.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function swatches(container, colorNames) {
  container.innerHTML = colorNames.map((name) => `<span class="swatch-chip">${name}</span>`).join("");
}

async function finishQuiz() {
  quizPanel.style.display = "none";
  calculatingPanel.style.display = "block";

  // Brief pause for a "calculating" feel before the reveal.
  await new Promise((res) => setTimeout(res, 900));

  const result = tallySeason(answers);

  calculatingPanel.style.display = "none";
  resultEl.classList.add("is-visible", "reveal-in");

  resultHeroImg.style.backgroundImage = `url('${result.images.hero}')`;
  resultSeason.textContent = result.name;
  resultTagline.textContent = result.tagline;
  resultReason.textContent = `${result.score} of your ${result.total} scored answers pointed to ${result.name.toLowerCase()}. ${result.description}`;
  swatches(resultBestColors, result.bestColors);
  swatches(resultAvoidColors, result.avoidColors);
  resultMetal.textContent = result.metal;
  document.getElementById("season-analysis")?.remove();
  const pct = (o, a, b) => `${a} ${o[a.toLowerCase()] || 0}% · ${b} ${o[b.toLowerCase()] || 0}%`;
  const f = result.features;
  const rows = seasonBreakdown(chosen).map((r) => `<li><strong>${r.feature}:</strong> ${r.label}<span class="analysis__pts">${r.seasons.length ? "Points to " + r.seasons.join(" and ") : "Neutral, no points"} · Based on ${r.source}</span></li>`).join("");
  resultEl.insertAdjacentHTML("beforeend", `<section id="season-analysis" class="analysis">
    <h2 class="types-heading">Your colouring in detail</h2>
    <div class="analysis__axes">
      <div><span class="dash-card__label">Undertone</span><strong>${pct(result.axes.undertone, "Warm", "Cool")}</strong></div>
      <div><span class="dash-card__label">Depth</span><strong>${pct(result.axes.depth, "Light", "Deep")}</strong></div>
      <div><span class="dash-card__label">Chroma</span><strong>${pct(result.axes.chroma, "Clear", "Soft")}</strong></div>
    </div>
    <h3 class="analysis__sub">What ${result.name} usually looks like</h3>
    <ul class="analysis__list">
      <li><strong>Skin:</strong> ${f.skin}</li><li><strong>Hair:</strong> ${f.hair}</li><li><strong>Eyes:</strong> ${f.eyes}</li>
      <li><strong>Contrast:</strong> ${f.contrast}</li><li><strong>Tests:</strong> ${f.veins}</li>
    </ul>
    <h3 class="analysis__sub">How each of your answers counted</h3>
    <ul class="analysis__list">${rows}</ul>
    <p class="analysis__note">The questions use the features that published work on personal colour analysis relies on: undertone (Jackson, 1987), skin, hair and eye colour (Stacchio et al., 2025; Hong and Kim, 2019), wrist veins (Alyoubi et al., 2025), and contrast and vividness (Dinh, 2026). This is an estimate based on what you told the quiz. Lighting, hair dye, tanning and make-up can change how your colouring looks, so check the result in daylight against a few real colours.</p>
  </section>`);
  document.getElementById("season-photos")?.remove();
  resultEl.insertAdjacentHTML("beforeend", `<div id="season-photos">${photoStrip((PHOTOS.seasons[result.key] || []).slice(0, 4), { title: `${result.name} in real life`, note: "Outfit, makeup, flat-lay and mood." })}${photoStrip((PHOTOS.seasons[result.key] || []).slice(4), { title: "Colours, hair, nails and eyewear", note: "Your best colours, what to avoid, and matching details." })}</div>`);

  if (result.tied.length > 1) {
    const names = result.tied.map((k) => SEASON_TYPES[k].name).join(", ");
    tieNote.textContent = `Your answers were evenly split between: ${names}. We've shown ${result.name} first.`;
    tieNote.classList.add("is-visible");
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, season: result.key }, { onConflict: "id" });

  if (error) {
    saveMsg.textContent = "Result calculated, but saving failed, make sure your profiles table has a 'season' column (see README).";
    showToast("Couldn't save your season, check your profiles table.", "error");
  } else {
    saveMsg.textContent = "Saved to your profile.";
    showToast("Season saved to your profile.");
  }
}

renderQuestion();
