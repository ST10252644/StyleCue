// "Think it over" list (Design requirement 6).
// Items are kept on this device only. There is no timer, no countdown and
// no stock message: the aim is a calm pause before any buying decision.

const key = (uid) => `stylecue_think_${uid}`;

export function getList(uid) {
  try { return JSON.parse(localStorage.getItem(key(uid))) || []; } catch { return []; }
}
function save(uid, list) {
  try { localStorage.setItem(key(uid), JSON.stringify(list)); } catch { /* storage blocked */ }
}
export function has(uid, id) { return getList(uid).some((i) => i.id === id); }
export function add(uid, item) {
  const list = getList(uid);
  if (list.some((i) => i.id === item.id)) return;
  list.unshift({ ...item, savedAt: Date.now(), checks: [false, false, false], status: "thinking" });
  save(uid, list);
}
export function update(uid, id, patch) {
  save(uid, getList(uid).map((i) => (i.id === id ? { ...i, ...patch } : i)));
}
export function remove(uid, id) { save(uid, getList(uid).filter((i) => i.id !== id)); }
export const QUESTIONS = [
  "Do I already own something similar? (Check your closet.)",
  "Does it fit my size and my body shape?",
  "Would I still want it after a few days?",
];
