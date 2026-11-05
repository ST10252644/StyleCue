import { supabase } from "./supabaseClient.js";
import { classifyBodyShape, BODY_TYPES } from "./bodyShape.js";
import { renderNav } from "./nav.js";
import { showToast } from "./toast.js";

renderNav("bodytype");

// Require login
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session?.user?.id;

import { cmValue } from "./ui.js";

// ---- Render the five reference cards ----
const typeList = document.getElementById("type-list");

function renderTypeCards(matchedKey = null) {
  typeList.innerHTML = "";
  Object.entries(BODY_TYPES).forEach(([key, type]) => {
    const card = document.createElement("div");
    card.className = "type-card" + (key === matchedKey ? " is-match" : "");
    card.innerHTML = `
      <div class="type-card__img">
        Add your<br />${type.name}<br />image here
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

  const shoulder = cmValue(document.getElementById("m-shoulder"));
  const waist = cmValue(document.getElementById("m-waist"));
  const hip = cmValue(document.getElementById("m-hip"));

  if (!shoulder || !waist || !hip) return;

  const result = classifyBodyShape(shoulder, waist, hip);

  resultShape.textContent = result.name;
  resultReason.textContent = result.reason;
  resultDesc.textContent = result.desc;
  resultEl.classList.add("is-visible", "reveal-in");
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });

  renderTypeCards(result.key);

  // Save to the profiles table so it's ready for the recommendation logic later.
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving…";

  const { error } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, body_shape: result.key, shoulder_cm: shoulder, waist_cm: waist, hip_cm: hip },
      { onConflict: "id" }
    );

  submitBtn.disabled = false;
  submitBtn.textContent = "Find my shape";

  if (error) {
    saveMsg.textContent =
      "Result calculated, but saving to your profile failed, you'll need a profiles table set up in Supabase first (see README).";
    showToast("Couldn't save your body shape, check your profile setup.", "error");
  } else {
    saveMsg.textContent = "Saved to your profile.";
    showToast("Body shape saved to your profile.");
  }
  saveMsg.classList.add("is-visible");
});
