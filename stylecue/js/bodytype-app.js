import { supabase } from "./supabaseClient.js";
import { classifyBodyShape, BODY_TYPES } from "./bodyShape.js";

// Require login
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
    window.location.href = "index.html";
}
const userId = sessionData.session?.user?.id;

// ---- Unit toggle (label only — the math is ratio-based, so units don't matter) ----
const unitCm = document.getElementById("unit-cm");
const unitIn = document.getElementById("unit-in");
unitCm.addEventListener("click", () => {
    unitCm.classList.add("is-active");
    unitIn.classList.remove("is-active");
});
unitIn.addEventListener("click", () => {
    unitIn.classList.add("is-active");
    unitCm.classList.remove("is-active");
});

// ---- Render the five reference cards ----
const typeList = document.getElementById("type-list");

function renderTypeCards(matchedKey = null) {
    typeList.innerHTML = "";
    Object.entries(BODY_TYPES).forEach(([key, type]) => {
        const card = document.createElement("div");
        card.className = "type-card" + (key === matchedKey ? " is-match" : "");
        card.innerHTML = `
      <div class="type-card__img">
        <img src="images/${key === 'invertedTriangle' ? 'inverted-triangle' : key}.jpg" alt="${type.name} body shape" />
      </div>
      <div>
        <div class="type-card__name">
          ${type.name}
          ${key === matchedKey ? '<span class="type-card__match-badge">Your shape</span>' : ""}
        </div>
        <p class="type-card__desc">${type.desc}</p>
      </div>
    `;
        typeList.appendChild(card);
    });
}

renderTypeCards();

// ---- Handle the form ----
const form = document.getElementById("form-measure");
const resultEl = document.getElementById("result");
const resultShape = document.getElementById("result-shape");
const resultReason = document.getElementById("result-reason");
const resultDesc = document.getElementById("result-desc");
const saveMsg = document.getElementById("save-msg");
const submitBtn = document.getElementById("calc-submit");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const shoulder = parseFloat(document.getElementById("m-shoulder").value);
    const waist = parseFloat(document.getElementById("m-waist").value);
    const hip = parseFloat(document.getElementById("m-hip").value);

    if (!shoulder || !waist || !hip) return;

    const result = classifyBodyShape(shoulder, waist, hip);

    resultShape.textContent = result.name;
    resultReason.textContent = result.reason;
    resultDesc.textContent = result.desc;
    resultEl.classList.add("is-visible");
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });

    renderTypeCards(result.key);

    // Save to the profiles table so it's ready for the recommendation logic later.
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving…";

    const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, body_shape: result.key }, { onConflict: "id" });

    submitBtn.disabled = false;
    submitBtn.textContent = "Find my shape";

    if (error) {
        saveMsg.textContent =
            "Result calculated, but saving to your profile failed — you'll need a profiles table set up in Supabase first (see README).";
    } else {
        saveMsg.textContent = "Saved to your profile.";
    }
    saveMsg.classList.add("is-visible");
});