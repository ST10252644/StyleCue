import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";
import { getList, update, remove, QUESTIONS } from "./pause.js";

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) window.location.href = "index.html";
const uid = sessionData.session.user.id;
renderNav("thinkitover", uid);

const el = document.getElementById("content");

function ago(ts) {
  const d = Math.floor((Date.now() - ts) / 86400000);
  return d <= 0 ? "Saved today" : d === 1 ? "Saved yesterday" : `Saved ${d} days ago`;
}

function render() {
  const list = getList(uid);
  if (!list.length) {
    el.innerHTML = `<div class="styleguide-nudge"><img class="empty-photo" src="images/pages/empty_state_3.jpg" alt="An empty shopping bag" loading="lazy" decoding="async" /><br>Nothing here yet. On <a href="recommendations.html">Picks</a>, tap “Think it over” on anything you like.</div>`;
    return;
  }
  el.innerHTML = list.map((i) => `
    <article class="think-card" data-id="${i.id}">
      <div class="think-card__top">
        <div><div class="rec-row__name">${i.name}</div><div class="rec-row__category">${i.category} · ${ago(i.savedAt)}</div></div>
        <span class="think-status think-status--${i.status}">${i.status === "thinking" ? "Thinking" : i.status === "decided" ? "Decided" : "Skipped"}</span>
      </div>
      <p class="think-why">${i.why}</p>
      ${i.status === "thinking" ? `
      <div class="think-checks">
        ${QUESTIONS.map((q, n) => `<label class="think-check"><input type="checkbox" data-n="${n}" ${i.checks[n] ? "checked" : ""}/> <span>${q}</span></label>`).join("")}
      </div>
      <div class="think-actions">
        <button class="btn-ghost" data-act="skip">Skip it</button>
        <button class="btn-primary" data-act="decide" ${i.checks.every(Boolean) ? "" : "disabled"}>I have decided</button>
      </div>` : `<div class="think-actions"><button class="btn-ghost" data-act="reopen">Think again</button><button class="btn-ghost" data-act="remove">Remove</button></div>`}
    </article>`).join("");
}

el.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = btn.closest(".think-card").dataset.id;
  const act = btn.dataset.act;
  if (act === "skip") update(uid, id, { status: "skipped" });
  if (act === "decide") update(uid, id, { status: "decided" });
  if (act === "reopen") update(uid, id, { status: "thinking" });
  if (act === "remove") remove(uid, id);
  render();
});
el.addEventListener("change", (e) => {
  const cb = e.target.closest("input[type=checkbox]");
  if (!cb) return;
  const id = cb.closest(".think-card").dataset.id;
  const item = getList(uid).find((i) => i.id === id);
  const checks = [...item.checks];
  checks[Number(cb.dataset.n)] = cb.checked;
  update(uid, id, { checks });
  render();
});
render();
