// Small helpers that render the collected photographs (see photoIndex.js and the credits page).
export function photoStrip(list, { title = "", note = "" } = {}) {
  if (!list || !list.length) return "";
  return `
    <section class="photo-strip" aria-label="${title}">
      ${title ? `<h3 class="photo-strip__title">${title}</h3>` : ""}
      ${note ? `<p class="photo-strip__note">${note}</p>` : ""}
      <div class="photo-strip__row" tabindex="0">
        ${list.map((p) => `<figure class="photo-strip__item"><img src="${p.src}" alt="${p.label || title}" loading="lazy" decoding="async" /><figcaption>${p.label || ""}</figcaption></figure>`).join("")}
      </div>
    </section>`;
}
export function photoGrid(list) {
  if (!list || !list.length) return "";
  return `<div class="photo-grid">${list.map((p) => `<figure class="photo-grid__item"><img src="${p.src}" alt="${p.label || "Style example"}" loading="lazy" decoding="async" />${p.label ? `<figcaption>${p.label}</figcaption>` : ""}</figure>`).join("")}</div>`;
}
export function banner(src, alt = "") {
  return src ? `<img class="page-banner" src="${src}" alt="${alt}" loading="lazy" decoding="async" />` : "";
}
