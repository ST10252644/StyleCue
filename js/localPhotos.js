// The researcher's hand-picked photographs, shaped like Look Library photos so that
// they can sit in the same grid. Sources are in images/pinterest_credits.json.
let creditMap = null;
async function credits() {
  if (creditMap) return creditMap;
  creditMap = {};
  try {
    const list = await (await fetch("images/pinterest_credits.json")).json();
    list.forEach((c) => (creditMap[c.path] = c));
  } catch { /* credits stay empty, photos still show */ }
  return creditMap;
}
export async function localPhotoObjects(list, idPrefix, altBase) {
  const map = await credits();
  return (list || []).map((p, i) => {
    const c = map[p.src] || {};
    return {
      id: `${idPrefix}-${i + 1}`,
      source: "pinterest",
      urls: { small: p.src, regular: p.src },
      alt_description: `${altBase} outfit example ${i + 1}`,
      user: { name: c.pinner ? `Saved by ${c.pinner}` : "Pinterest", links: { html: c.pin || "https://www.pinterest.com/" } },
      links: { html: c.pin || "" },
    };
  });
}
