import { UNSPLASH_ACCESS_KEY } from "./config.js";

// Prototype mode: with no Unsplash key, the Look Library shows built-in demo
// look cards (drawn colour cards with an outfit idea) instead of photos.
function demoPhotos(query, n = 12) {
  const words = (query || "outfit").split(/\s+/).filter(Boolean);
  const palettes = [["#15130e", "#cfff04"], ["#3b2f2f", "#e8c4a0"], ["#2d3a3a", "#b7d3c6"], ["#5a3d5a", "#f0d2e6"], ["#33405a", "#c9d6f0"], ["#4a3a22", "#e6d29a"]];
  const results = Array.from({ length: n }, (_, i) => {
    const [a, b] = palettes[(i + words.length) % palettes.length];
    const w = words[i % words.length];
    const h = [440, 520, 380, 480][i % 4];
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='300' height='${h}' fill='url(#g)'/><text x='24' y='${h - 54}' font-family='Georgia,serif' font-style='italic' font-size='30' fill='#f7f2e7'>${w}</text><text x='24' y='${h - 28}' font-family='Arial,sans-serif' font-size='13' fill='#f7f2e7' opacity='.8'>Demo look ${i + 1}</text></svg>`;
    return {
      id: `demo-${words.join("-")}-${i}`,
      urls: { small: "data:image/svg+xml;utf8," + encodeURIComponent(svg) },
      user: { name: "StyleCue demo", links: { html: "#" } },
      alt_description: `Demo look for ${query}`,
    };
  });
  return { total: n, results };
}

let galleryCache;
async function loadGallery() {
  if (galleryCache !== undefined) return galleryCache;
  try {
    const res = await fetch("images/gallery.json");
    galleryCache = res.ok ? [].concat(await res.json()) : null;
  } catch { galleryCache = null; }
  return galleryCache;
}

// Prototype photo library: uses the saved women's-style gallery (images/gallery.json) when it exists.
function fromGallery(gallery, query, perPage) {
  const words = (query || "").toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  let hits = gallery.filter((p) => words.some((w) => p.style === w || (p.alt_description || "").toLowerCase().includes(w)));
  if (!hits.length) hits = gallery;
  // Mix the styles so one style does not fill the whole screen.
  hits = hits.slice().sort((a, b) => (a.id > b.id ? 1 : -1));
  return { total: hits.length, results: hits.slice(0, Math.max(perPage, 60)) };
}

export async function searchPhotos(query, perPage = 24) {
  const gallery = await loadGallery();
  if (gallery && gallery.length) return fromGallery(gallery, query, perPage);
  if (!UNSPLASH_ACCESS_KEY) return demoPhotos(query);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
  );
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
  return res.json();
}
