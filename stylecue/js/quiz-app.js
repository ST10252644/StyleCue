import { supabase } from "./supabaseClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { QUIZ_QUESTIONS } from "./quizQuestions.js";

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
const saveMsg = document.getElementById("save-msg");

let current = 0;
const answers = []; // style key per question

function renderQuestion() {
    const q = QUIZ_QUESTIONS[current];
    promptEl.textContent = q.prompt;
    progressLabel.textContent = `Question ${current + 1} of ${QUIZ_QUESTIONS.length}`;
    progressFill.style.width = `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%`;

    optionsEl.innerHTML = "";
    q.options.forEach((opt) => {
        const styleData = STYLE_TYPES[opt.style];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        btn.innerHTML = `
      <span class="quiz-option__thumb" style="background-image:url('${styleData.images.hero}')"></span>
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
    resultEl.classList.add("is-visible");

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

    if (winners.length > 1) {
        const names = winners.map((k) => STYLE_TYPES[k].name).join(", ");
        tieNote.textContent = `Your answers were evenly split between: ${names}. We've shown ${winner.name} first, but your recommendations will draw on all of them.`;
        tieNote.classList.add("is-visible");
    }

    const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, style_personality: winnerKey }, { onConflict: "id" });

    saveMsg.textContent = error
        ? "Result calculated, but saving to your profile failed — check your profiles table is set up (see README)."
        : "Saved to your profile.";
    saveMsg.classList.add("is-visible");
}

renderQuestion();