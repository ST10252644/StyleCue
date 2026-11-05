import { supabase } from "./supabaseClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { BODY_TYPES } from "./bodyShape.js";
import { SEASON_TYPES } from "./seasonTypes.js";
import { renderNav } from "./nav.js";

renderNav("styleguide");

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session.user.id;

const badgesEl = document.getElementById("badges");
const contentEl = document.getElementById("content");

const { data: profile } = await supabase
  .from("profiles")
  .select("body_shape, style_personality, season")
  .eq("id", userId)
  .single();

const bodyType = profile?.body_shape ? BODY_TYPES[profile.body_shape] : null;
const style = profile?.style_personality ? STYLE_TYPES[profile.style_personality] : null;
const season = profile?.season ? SEASON_TYPES[profile.season] : null;

// ---- Badges ----
badgesEl.innerHTML = [
  { label: "Body shape", value: bodyType?.name, href: "bodytype.html" },
  { label: "Style", value: style?.name, href: "quiz.html" },
  { label: "Color season", value: season?.name, href: "season.html" },
]
  .map(
    (b) =>
      `<a href="${b.href}" class="styleguide-badge" style="text-decoration:none;">${b.label}: <span>${b.value || "Not set, tap to add"}</span></a>`
  )
  .join("");

// ---- Content sections ----
let html = "";

if (season) {
  html += `
    <div class="styleguide-section">
      <h2>Your palette, ${season.name}</h2>
      <p>${season.description}</p>
      <div class="style-photos"><div class="style-photos__item style-photos__item--big" style="background-image:url('${season.images.hero}')"></div></div>
      <div class="swatch-row" style="margin-top:0.75rem;">
        ${season.bestColors.map((c) => `<span class="swatch-chip" style="background:rgba(21,19,14,0.06); color:var(--ink); border-color:var(--line-on-bone);">${c}</span>`).join("")}
      </div>
    </div>
  `;
} else {
  html += `<div class="styleguide-section"><div class="styleguide-nudge">Take the <a href="season.html">color season quiz</a> to see your palette here.</div></div>`;
}

if (bodyType) {
  html += `
    <div class="styleguide-section">
      <h2>Your silhouette, ${bodyType.name}</h2>
      <p>${bodyType.desc}</p>
    </div>
  `;
} else {
  html += `<div class="styleguide-section"><div class="styleguide-nudge">Find your <a href="bodytype.html">body shape</a> to see silhouette tips here.</div></div>`;
}

if (style) {
  html += `
    <div class="styleguide-section">
      <h2>Your aesthetic, ${style.name}</h2>
      <p>${style.mood} ${style.bestFor}</p>
      <p style="margin-top:0.75rem;"><strong>Key pieces:</strong> ${style.keyPieces.join(", ")}.</p>
      <div class="style-photos">
        <div class="style-photos__item style-photos__item--big" style="background-image:url('${style.images.hero}')"></div>
        <div class="style-photos__item" style="background-image:url('${style.images.palette}')"></div>
        <div class="style-photos__item" style="background-image:url('${style.images.detail}')"></div>
      </div>
      <p class="field-hint"><a href="credits.html">Photo credits</a></p>
    </div>
  `;
} else {
  html += `<div class="styleguide-section"><div class="styleguide-nudge">Take the <a href="quiz.html">style quiz</a> to see your aesthetic here.</div></div>`;
}

if (bodyType && style && season) {
  html += `
    <div class="styleguide-section">
      <h2>Put it together</h2>
      <p>
        For you specifically: lean on ${style.name.toLowerCase()} pieces cut for a
        ${bodyType.name.toLowerCase()} shape, in colors from your ${season.name.toLowerCase()}
        palette, think ${season.bestColors.slice(0, 3).join(", ").toLowerCase()} in
        ${style.keyPieces[0].toLowerCase()} or ${style.keyPieces[1].toLowerCase()} silhouettes.
      </p>
    </div>
  `;
}

contentEl.innerHTML = html;
