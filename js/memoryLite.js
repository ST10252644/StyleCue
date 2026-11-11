// Keeps phone memory low: a photo that is far off-screen is unloaded, and it loads again when you scroll back near it.
// The photo files stay in the browser's cache, so coming back is quick. The space the photo took up is kept, so the page does not jump.
const MARGIN = "900px 0px";
const seen = new WeakSet();

const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    const img = e.target;
    if (e.isIntersecting) {
      if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); }
      img.style.height = ""; img.style.width = "";
    } else if (img.complete && img.naturalWidth > 0 && img.src && !img.dataset.src) {
      img.style.width = img.clientWidth + "px";
      img.style.height = img.clientHeight + "px";
      img.dataset.src = img.getAttribute("src");
      img.removeAttribute("src");
    }
  });
}, { rootMargin: MARGIN }) : null;

function watch(root) {
  if (!io) return;
  root.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (seen.has(img)) return;
    seen.add(img); io.observe(img);
  });
}

if (io) {
  watch(document);
  new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    if (n.matches?.('img[loading="lazy"]') && !seen.has(n)) { seen.add(n); io.observe(n); }
    else watch(n);
  }))).observe(document.documentElement, { childList: true, subtree: true });
}
