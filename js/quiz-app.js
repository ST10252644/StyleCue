import { supabase } from "./supabaseClient.js";
import { STYLE_TYPES, styleOptionImage } from "./styleTypes.js";
import { QUIZ_QUESTIONS } from "./quizQuestions.js";
import { renderNav } from "./nav.js";
import { showToast } from "./toast.js";
import { generateStyleCard, shareOrDownloadCard } from "./shareCard.js";

renderNav("quiz");

// Require login
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session?.user?.id;

const quizPanel = document.getElementById("quiz-panel");
const promptEl = document.getElementById("quiz-prompt");
const optionsEl = document.getElementById("quiz-options");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");

const resultEl = document.getElementById("result");
const resultHeroImg = document.getElementById("result-hero-img");
const resultStyle = document.getElementById("result-style");
const resultTagline = document.getElementById("result-tagline");
const resultMood = document.getElementById("result-mood");
const resultPalette = document.getElementById("result-palette");
const resultFabrics = document.getElementById("result-fabrics");
const resultBestFor = document.getElementById("result-bestfor");
const resultGallery = document.getElementById("result-gallery");
const resultKeyPieces = document.getElementById("result-keypieces");
const resultTips = document.getElementById("result-tips");
const resultAvoid = document.getElementById("result-avoid");
const tieNote = document.getElementById("tie-note");
const calcPanel = document.getElementById("calculating-panel");
const shareBtn = document.getElementById("share-btn");
const saveMsg = document.getElementById("save-msg");

const backBtn = document.getElementById("quiz-back");
backBtn.addEventListener("click", () => {
  if (current > 0) { current--; answers.length = current; renderQuestion(); }
});
let current = 0;
const answers = []; // style key per question

function renderQuestion() {
  const q = QUIZ_QUESTIONS[current];
  promptEl.textContent = q.prompt;
  progressLabel.textContent = `Question ${current + 1} of ${QUIZ_QUESTIONS.length}`;
  progressFill.style.width = `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%`;

  backBtn.hidden = current === 0;
  quizPanel.classList.remove("q-fade");
  void quizPanel.offsetWidth;
  quizPanel.classList.add("q-fade");
  optionsEl.innerHTML = "";
  q.options.forEach((opt, optIdx) => {
    const styleData = STYLE_TYPES[opt.style];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.innerHTML = `
      <img class="quiz-option__img" src="${styleOptionImage(opt.style, current + optIdx)}" alt="${styleData.name} style example on a woman" decoding="async" />
      <span class="quiz-option__label">${opt.label}</span>
    `;
    btn.addEventListener("click", () => selectAnswer(opt.style));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(styleKey) {
  answers[current] = styleKey;
  current++;
  if (current < QUIZ_QUESTIONS.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function fillList(el, items) {
  el.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

async function finishQuiz() {
  // Tally scores
  const tally = {};
  answers.forEach((key) => {
    tally[key] = (tally[key] || 0) + 1;
  });

  const maxScore = Math.max(...Object.values(tally));
  const winners = Object.keys(tally).filter((key) => tally[key] === maxScore);
  const winnerKey = winners[0];
  const winner = STYLE_TYPES[winnerKey];

  quizPanel.style.display = "none";
  calcPanel.style.display = "block";
  await new Promise((r) => setTimeout(r, 900));
  calcPanel.style.display = "none";
  resultEl.classList.add("is-visible", "reveal-in");

  resultHeroImg.style.backgroundImage = `url('${winner.images.hero}')`;
  resultStyle.textContent = winner.name;
  resultTagline.textContent = winner.tagline;
  resultMood.textContent = winner.mood;
  resultPalette.textContent = winner.palette;
  resultFabrics.textContent = winner.fabrics;
  resultBestFor.textContent = winner.bestFor;

  resultGallery.innerHTML = `
    <div class="result__gallery-item" style="background-image:url('${winner.images.palette}')"></div>
    <div class="result__gallery-item" style="background-image:url('${winner.images.detail}')"></div>
  `;

  fillList(resultKeyPieces, winner.keyPieces);
  fillList(resultTips, winner.stylingTips);
  fillList(resultAvoid, winner.avoid);

  drawRadar(tally);

  const saveBtn = document.getElementById("save-look-btn");
  saveBtn.onclick = async () => {
    saveBtn.disabled = true;
    const { error: favErr } = await supabase.from("favorites").insert({
      user_id: userId,
      photo_id: `style-${winnerKey}`,
      image_url: winner.images.hero,
      photographer: "Unsplash photographer (see Photo credits)",
      photographer_url: "credits.html",
      query: `${winner.name} style`,
    });
    saveBtn.textContent = favErr ? "Couldn't save, try again" : "♥ Saved to My Looks";
    saveBtn.disabled = !favErr;
    showToast(favErr ? "Couldn't save" : "Saved to My Looks", favErr ? "error" : "success");
  };

  shareBtn.onclick = async () => {
    shareBtn.disabled = true;
    try {
      const canvas = await generateStyleCard(winner);
      await shareOrDownloadCard(canvas, `stylecue-${winnerKey}.png`);
      showToast("Style card ready");
    } catch (e) {
      console.error(e);
      showToast("Couldn't create the card", "error");
    }
    shareBtn.disabled = false;
  };

  if (winners.length > 1) {
    const names = winners.map((k) => STYLE_TYPES[k].name).join(", ");
    tieNote.textContent = `Your answers were evenly split between: ${names}. We've shown ${winner.name} first, but your recommendations will draw on all of them.`;
    tieNote.classList.add("is-visible");
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, style_personality: winnerKey }, { onConflict: "id" });

  saveMsg.textContent = error
    ? "Result calculated, but saving to your profile failed, check your profiles table is set up (see README)."
    : "Saved to your profile.";
  saveMsg.classList.add("is-visible");
  showToast(error ? "Save failed, see README" : "Style saved to your profile", error ? "error" : "success");
}

function drawRadar(tally) {
  if (typeof Chart === "undefined") return;
  const keys = Object.keys(STYLE_TYPES);
  new Chart(document.getElementById("style-radar"), {
    type: "radar",
    data: {
      labels: keys.map((k) => STYLE_TYPES[k].name),
      datasets: [{
        label: "Answers per style",
        data: keys.map((k) => tally[k] || 0),
        backgroundColor: "rgba(207,255,4,0.25)",
        borderColor: "#cfff04",
        pointBackgroundColor: "#cfff04",
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: "#c9c2b0", backdropColor: "transparent" },
          grid: { color: "rgba(247,242,231,0.14)" },
          angleLines: { color: "rgba(247,242,231,0.14)" },
          pointLabels: { color: "#f7f2e7", font: { size: 10 } },
        },
      },
    },
  });
}

renderQuestion();
