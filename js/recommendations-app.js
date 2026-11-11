import { supabase } from "./supabaseClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { BODY_TYPES } from "./bodyShape.js";
import { PRODUCT_CATALOG } from "./productCatalog.js";
import { combineAttributes, computeMatches, explainMatch } from "./matchEngine.js";
import { add, has } from "./pause.js";
import { showToast } from "./toast.js";
import { renderNav } from "./nav.js";
import { logEvent, mountFeedback } from "./usage.js";

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
        <img class="empty-photo" src="images/pages/empty_state_4.jpg" alt="An empty wardrobe" loading="lazy" decoding="async" />
        Complete your <a href="bodytype.html">body shape</a> and <a href="quiz.html">style quiz</a> to see your matched recommendations.
      </div>
    </div>
  `;
} else {
  const userAttributes = combineAttributes(bodyType.attributes, style.attributes);
  const matches = computeMatches(userAttributes, PRODUCT_CATALOG);

  let html = `
    <div class="styleguide-section">
      <h2>What suits you</h2>
      <p>Your body shape is <strong>${bodyType.name}</strong> and your style is <strong>${style.name}</strong>. Together, these give ${userAttributes.length} things to look for in clothes (attributes), shown below. StyleCue compares every piece in the sample catalogue with this list.</p>
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
        <h2>Your best matches</h2>
        <div class="rec-howto">
          <strong>How to read this page</strong>
          <ul>
            <li><strong>Order:</strong> the best match is first (number 1) and the weakest is last.</li>
            <li><strong>Score:</strong> a piece gets one point for each of your ${userAttributes.length} things it has. "3 of ${userAttributes.length}" means it fits 3 of them. A higher score is a better fit.</li>
            <li><strong>Why this?</strong> tells you in words which of your things the piece fits.</li>
            <li><strong>Save for later</strong> puts it on your Think it over list. You answer a few quick questions there before you buy, so it is a way to slow down and decide.</li>
          </ul>
        </div>
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
                <div class="rec-row__score" title="This piece fits ${item.score} of your ${item.total} things"><span class="rec-row__score-num">${item.score} of ${item.total}</span><span class="rec-row__score-label">${item.score / item.total >= 0.5 ? "Strong match" : item.score / item.total >= 0.3 ? "Good match" : "Possible match"}</span></div>
              </div>
              <div class="swatch-row">
                ${ex.fromBody.map((t) => `<span class="chip chip--body">${t}</span>`).join("")}
                ${ex.fromStyle.map((t) => `<span class="chip chip--style">${t}</span>`).join("")}
              </div>
              <p class="rec-card__why"><strong>Why this?</strong> ${ex.text}</p>
              <button class="btn-ghost rec-card__think" type="button" data-id="${item.id}" ${has(userId, item.id) ? "disabled" : ""}>${has(userId, item.id) ? "Saved to your Think it over list" : "Save for later"}</button>
            </article>`;
          }).join("")}
        </div>
        <p class="rec-legend"><span class="chip chip--body">body shape</span> <span class="chip chip--style">style</span> The small tags on each piece show what it matches: one colour for your body shape and one for your style. Photos are style inspiration for your aesthetic, not product images (<a href="credits.html">photo credits</a>).</p>
      </div>
    `;
  }

  contentEl.innerHTML = html;
  logEvent(userId, "recs_viewed", `${bodyType.name} + ${style.name}`);
  const fbEl = document.createElement("section");
  fbEl.className = "styleguide-section fb";
  contentEl.appendChild(fbEl);
  mountFeedback(fbEl, userId, "recommendations");
}

contentEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".rec-card__think");
  if (!btn || !bodyType || !style) return;
  const userAttributes = combineAttributes(bodyType.attributes, style.attributes);
  const item = computeMatches(userAttributes, PRODUCT_CATALOG, 99).find((m) => m.id === btn.dataset.id);
  add(userId, { id: item.id, name: item.name, category: item.category, why: explainMatch(item, bodyType, style).text });
  btn.disabled = true;
  btn.textContent = "Saved to your Think it over list";
  logEvent(userId, "think_saved", item.name);
  showToast("Saved to your Think it over list. No rush to decide.");
});
