import { cmValue } from "./ui.js";
import { supabase } from "./supabaseClient.js";
import { classifyBodyShape, BODY_TYPES } from "./bodyShape.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { quizStyleImg, quizSeasonImg } from "./photoIndex.js";
import { QUIZ_QUESTIONS } from "./quizQuestions.js";
import { SEASON_TYPES, SEASON_QUESTIONS, tallySeason } from "./seasonTypes.js";
import { showToast } from "./toast.js";
import { logEvent } from "./usage.js";
import { PHOTOS } from "./photoIndex.js";
import { banner } from "./photoStrip.js";
import { seasonHint } from "./seasonPhotos.js";

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session.user.id;

const TOTAL_STEPS = 1 + QUIZ_QUESTIONS.length + SEASON_QUESTIONS.length; // body form counts as 1 step
let stepsDone = 0;

const sectionLabel = document.getElementById("section-label");
const sectionTitle = document.getElementById("section-title");
const sectionLede = document.getElementById("section-lede");
const overallFill = document.getElementById("overall-progress-fill");
const overallLabel = document.getElementById("overall-progress-label");

const results = { bodyShape: null, style: null, season: null };

function bumpOverall(label) {
  stepsDone++;
  overallFill.style.width = `${Math.min(100, (stepsDone / TOTAL_STEPS) * 100)}%`;
  overallLabel.textContent = label;
}

// ================= Section 1: Body shape =================
const sectionBody = document.getElementById("section-bodyshape");
const sectionStyle = document.getElementById("section-style");
const sectionSeason = document.getElementById("section-season");
const sectionDone = document.getElementById("section-done");
// Photographs for each step (see the credits page)
sectionBody.insertAdjacentHTML("afterbegin", banner(PHOTOS.pages.onboarding_1_measure, "A woman with a measuring tape"));
sectionStyle.insertAdjacentHTML("afterbegin", banner(PHOTOS.pages.onboarding_2_style, "A woman choosing an outfit"));
sectionSeason.insertAdjacentHTML("afterbegin", banner(PHOTOS.pages.onboarding_3_colours, "Colour swatches"));
sectionDone.insertAdjacentHTML("afterbegin", banner(PHOTOS.pages.profile_complete, "A confident woman in a stylish outfit"));

document.getElementById("form-measure").addEventListener("submit", async (e) => {
  e.preventDefault();
  const shoulder = cmValue(document.getElementById("m-shoulder"));
  const waist = cmValue(document.getElementById("m-waist"));
  const hip = cmValue(document.getElementById("m-hip"));
  if (!shoulder || !waist || !hip) return;

  const result = classifyBodyShape(shoulder, waist, hip);
  results.bodyShape = result.key;
  await supabase.from("profiles").upsert(
    { id: userId, body_shape: result.key, shoulder_cm: shoulder, waist_cm: waist, hip_cm: hip },
    { onConflict: "id" }
  );
  bumpOverall(`Body shape: ${result.name}`);

  sectionBody.style.display = "none";
  sectionStyle.style.display = "block";
  sectionLabel.textContent = "Section 2 of 3 · Style personality";
  sectionTitle.textContent = "What's your style?";
  sectionLede.textContent = "Twelve quick questions, go with whatever you're drawn to first.";
  renderStyleQuestion();
});

// ================= Section 2: Style quiz =================
let styleCurrent = 0;
const styleAnswers = [];

function renderStyleQuestion() {
  const q = QUIZ_QUESTIONS[styleCurrent];
  document.getElementById("style-prompt").textContent = q.prompt;
  document.getElementById("style-progress-label").textContent = `Question ${styleCurrent + 1} of ${QUIZ_QUESTIONS.length}`;
  document.getElementById("style-progress-fill").style.width = `${((styleCurrent + 1) / QUIZ_QUESTIONS.length) * 100}%`;

  const optionsEl = document.getElementById("style-options");
  optionsEl.innerHTML = "";
  q.options.forEach((opt, optIdx) => {
    const styleData = STYLE_TYPES[opt.style];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.innerHTML = `
      <img class="quiz-option__img" src="${quizStyleImg(styleCurrent, optIdx)}" alt="${opt.label}" decoding="async" />
      <span class="quiz-option__label">${opt.label}</span>
    `;
    btn.addEventListener("click", () => {
      styleAnswers[styleCurrent] = opt.style;
      styleCurrent++;
      bumpOverall(`Style quiz: ${styleCurrent} of ${QUIZ_QUESTIONS.length}`);
      if (styleCurrent < QUIZ_QUESTIONS.length) {
        renderStyleQuestion();
      } else {
        finishStyle();
      }
    });
    optionsEl.appendChild(btn);
  });
}

async function finishStyle() {
  const tally = {};
  styleAnswers.forEach((k) => (tally[k] = (tally[k] || 0) + 1));
  const max = Math.max(...Object.values(tally));
  const winnerKey = Object.keys(tally).find((k) => tally[k] === max);
  results.style = winnerKey;
  await supabase.from("profiles").upsert({ id: userId, style_personality: winnerKey }, { onConflict: "id" });

  sectionStyle.style.display = "none";
  sectionSeason.style.display = "block";
  sectionLabel.textContent = "Section 3 of 3 · Color season";
  sectionTitle.textContent = "What's your color season?";
  sectionLede.textContent = "Seven questions on undertone, skin, hair, eyes, contrast and vividness.";
  renderSeasonQuestion();
}

// ================= Section 3: Season quiz =================
let seasonCurrent = 0;
const seasonAnswers = [];

function renderSeasonQuestion() {
  const q = SEASON_QUESTIONS[seasonCurrent];
  document.getElementById("season-prompt").textContent = q.prompt;
  document.getElementById("season-progress-label").textContent = `Question ${seasonCurrent + 1} of ${SEASON_QUESTIONS.length}`;
  document.getElementById("season-progress-fill").style.width = `${((seasonCurrent + 1) / SEASON_QUESTIONS.length) * 100}%`;

  const optionsEl = document.getElementById("season-options");
  optionsEl.previousElementSibling?.classList?.contains("season-hint") && optionsEl.previousElementSibling.remove();
  optionsEl.insertAdjacentHTML("beforebegin", seasonHint(q.imgKey));
  optionsEl.innerHTML = "";
  q.options.forEach((opt, optIdx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.innerHTML = `
      <img class="quiz-option__img" src="${quizSeasonImg(q.imgKey, optIdx)}" alt="" decoding="async" onerror="this.parentElement.classList.add('quiz-option--text');this.remove()" />
      <span class="quiz-option__label">${opt.label}</span>`;
    btn.addEventListener("click", () => {
      seasonAnswers[seasonCurrent] = opt.season;
      seasonCurrent++;
      bumpOverall(`Color season: ${seasonCurrent} of ${SEASON_QUESTIONS.length}`);
      if (seasonCurrent < SEASON_QUESTIONS.length) {
        renderSeasonQuestion();
      } else {
        finishSeason();
      }
    });
    optionsEl.appendChild(btn);
  });
}

async function finishSeason() {
  const result = tallySeason(seasonAnswers);
  results.season = result.key;
  await supabase.from("profiles").upsert({ id: userId, season: result.key }, { onConflict: "id" });

  logEvent(userId, "profile_completed", `${results.bodyShape}/${results.style}/${results.season}`);
  sectionSeason.style.display = "none";
  sectionDone.style.display = "block";
  sectionDone.classList.add("is-visible", "reveal-in");
  sectionLabel.textContent = "Done";
  sectionTitle.textContent = "You're all set.";
  sectionLede.textContent = "";
  overallFill.style.width = "100%";
  overallLabel.textContent = "Profile complete";

  const bodyName = BODY_TYPES[results.bodyShape].name;
  const styleName = STYLE_TYPES[results.style].name;
  const seasonName = SEASON_TYPES[results.season].name;
  document.getElementById("done-summary").textContent =
    `${bodyName} shape, ${styleName} style, ${seasonName} coloring, your style guide is ready.`;

  showToast("Profile complete!");
}
