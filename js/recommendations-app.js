import { supabase } from "./supabaseClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { BODY_TYPES } from "./bodyShape.js";
import { PRODUCT_CATALOG } from "./productCatalog.js";
import { combineAttributes, computeMatches, explainMatch } from "./matchEngine.js";
import { add, has } from "./pause.js";
import { showToast } from "./toast.js";
import { renderNav } from "./nav.js";

renderNav("recommendations");

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session.user.id;

const badgesEl = document.getElementById("badges");
const contentEl = document.getElementById("content");

const { data: profile } = await supabase
  .from("profiles")
  .select("body_shape, style_personality")
  .eq("id", userId)
  .single();

const bodyType = profile?.body_shape ? BODY_TYPES[profile.body_shape] : null;
const style = profile?.style_personality ? STYLE_TYPES[profile.style_personality] : null;

badgesEl.innerHTML = [
  { label: "Body shape", value: bodyType?.name, href: "bodytype.html" },
  { label: "Style", value: style?.name, href: "quiz.html" },
]
  .map(
    (b) =>
      `<a href="${b.href}" class="styleguide-badge" style="text-decoration:none;">${b.label}: <span>${b.value || "Not set, tap to add"}</span></a>`
  )
  .join("");

if (!bodyType || !style) {
  contentEl.innerHTML = `
    <div class="styleguide-section">
      <div class="styleguide-nudge">
        Complete your <a href="bodytype.html">body shape</a> and <a href="quiz.html">style quiz</a> to see your matched recommendations.
      </div>
    </div>
  `;
} else {
  const userAttributes = combineAttributes(bodyType.attributes, style.attributes);
  const matches = computeMatches(userAttributes, PRODUCT_CATALOG);

  let html = `
    <div class="styleguide-section">
      <h2>Your combined attributes</h2>
      <p>From ${bodyType.name} (${bodyType.attributes.join(", ")}) and ${style.name} (${style.attributes.join(", ")}), deduplicated to ${userAttributes.length} unique attributes:</p>
      <div class="swatch-row" style="margin-top:0.75rem;">
        ${userAttributes.map((a) => `<span class="swatch-chip" style="background:rgba(21,19,14,0.06); color:var(--ink); border-color:var(--line-on-bone);">${a}</span>`).join("")}
      </div>
    </div>
  `;

  if (matches.length === 0) {
    html += `
      <div class="styleguide-section">
        <div class="styleguide-nudge">No catalogue items matched your attributes this time, this is a small, illustrative sample catalogue (${PRODUCT_CATALOG.length} items), not a full retail dataset.</div>
      </div>
    `;
  } else {
    html += `
      <div class="styleguide-section">
        <h2>Ranked matches</h2>
        <div class="rec-table">
          ${matches.map((item, i) => {
            const ex = explainMatch(item, bodyType, style);
            return `
            <article class="rec-card" data-id="${item.id}">
              <img class="rec-card__photo" src="${[style.images.hero, style.images.palette, style.images.detail][i % 3]}" alt="${style.name} style inspiration photo" loading="lazy" decoding="async" />
              <div class="rec-card__head">
                <div class="rec-row__rank">${i + 1}</div>
                <div class="rec-row__main">
                  <div class="rec-row__name">${item.name}</div>
                  <div class="rec-row__category">${item.category}</div>
                </div>
                <div class="rec-row__score" title="Matched attributes out of your ${item.total}">${item.score}/${item.total}</div>
              </div>
              <div class="swatch-row">
                ${ex.fromBody.map((t) => `<span class="chip chip--body">${t}</span>`).join("")}
                ${ex.fromStyle.map((t) => `<span class="chip chip--style">${t}</span>`).join("")}
              </div>
              <p class="rec-card__why"><strong>Why this?</strong> ${ex.text}</p>
              <button class="btn-ghost rec-card__think" type="button" data-id="${item.id}" ${has(userId, item.id) ? "disabled" : ""}>${has(userId, item.id) ? "Saved to Think it over" : "Think it over"}</button>
            </article>`;
          }).join("")}
        </div>
        <p class="rec-legend"><span class="chip chip--body">body shape</span> <span class="chip chip--style">style</span> Colours show where each match came from. Photos are style inspiration for your aesthetic, not product images (<a href="credits.html">photo credits</a>).</p>
      </div>
    `;
  }

  contentEl.innerHTML = html;
}

contentEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".rec-card__think");
  if (!btn || !bodyType || !style) return;
  const userAttributes = combineAttributes(bodyType.attributes, style.attributes);
  const item = computeMatches(userAttributes, PRODUCT_CATALOG, 99).find((m) => m.id === btn.dataset.id);
  add(userId, { id: item.id, name: item.name, category: item.category, why: explainMatch(item, bodyType, style).text });
  btn.disabled = true;
  btn.textContent = "Saved to Think it over";
  showToast("Saved. No rush to decide.");
});
