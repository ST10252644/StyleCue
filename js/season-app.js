import { supabase } from "./supabaseClient.js";
import { SEASON_TYPES, SEASON_QUESTIONS, tallySeason } from "./seasonTypes.js";
import { renderNav } from "./nav.js";
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

function renderQuestion() {
  const q = SEASON_QUESTIONS[current];
  promptEl.textContent = q.prompt;
  progressLabel.textContent = `Question ${current + 1} of ${SEASON_QUESTIONS.length}`;
  progressFill.style.width = `${((current + 1) / SEASON_QUESTIONS.length) * 100}%`;

  optionsEl.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.innerHTML = `<span class="quiz-option__label">${opt.label}</span>`;
    btn.addEventListener("click", () => selectAnswer(opt.season));
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
  resultReason.textContent = `Your answers leaned ${result.name.toLowerCase()} ${result.score} out of ${result.total} times. ${result.description}`;
  swatches(resultBestColors, result.bestColors);
  swatches(resultAvoidColors, result.avoidColors);
  resultMetal.textContent = result.metal;

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
