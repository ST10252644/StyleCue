import { supabase } from "./supabaseClient.js";
import { renderNav } from "./nav.js";
import { summary, getFeedback, getEvents } from "./usage.js";

renderNav("profile");
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) window.location.href = "index.html";
const uid = sessionData.session.user.id;

const s = summary(uid);
const fmt = (n) => (n === null ? "No ratings yet" : `${n.toFixed(1)} / 5`);
const tiles = [
  ["Profile completed", s.profileCompleted],
  ["Recommendation views", s.recsViewed],
  ["Saved to Think it over", s.thinkSaved],
  ["Looks saved", s.looksSaved],
  ["Feedback sent", s.feedbackCount],
  ["Average usefulness", fmt(s.avgUseful)],
  ["Average ease of use", fmt(s.avgEasy)],
];
document.getElementById("stats").innerHTML = tiles
  .map(([l, v]) => `<div class="stat"><div class="stat__v">${v}</div><div class="stat__l">${l}</div></div>`).join("");

const fb = getFeedback(uid);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
document.getElementById("fb-list").innerHTML = fb.length
  ? fb.map((f) => `<article class="fb-item"><div>Useful ${f.rating}/5 · Easy ${f.easy}/5</div>${f.comment ? `<p>${esc(f.comment)}</p>` : ""}<small>${new Date(f.at).toLocaleDateString()}</small></article>`).join("")
  : `<p class="saved-empty"><strong>No feedback yet.</strong><br>Open <a class="btn-ghost empty-btn" href="recommendations.html">Picks</a> and rate the suggestions at the bottom of the page.</p>`;

document.getElementById("download").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ summary: s, feedback: fb, events: getEvents(uid) }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "stylecue-my-data.json";
  document.body.appendChild(a); a.click(); a.remove();
});
