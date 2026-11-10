// Usage log and in-app feedback (Design requirement 7: usability and perceived usefulness).
// Everything is stored on this device only. Nothing is sent anywhere.
// The person can download their own data as a JSON file for the research evaluation.

const evKey = (uid) => `stylecue_events_${uid}`;
const fbKey = (uid) => `stylecue_feedback_${uid}`;

function read(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } }
function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } }

export function logEvent(uid, type, detail = "") {
  const list = read(evKey(uid));
  list.push({ type, detail, at: Date.now() });
  write(evKey(uid), list.slice(-500));
}
export function getEvents(uid) { return read(evKey(uid)); }

export function addFeedback(uid, { rating, easy, comment, page }) {
  const list = read(fbKey(uid));
  list.unshift({ rating, easy, comment: (comment || "").slice(0, 500), page, at: Date.now() });
  write(fbKey(uid), list.slice(0, 100));
  logEvent(uid, "feedback", `${rating}/5`);
}
export function getFeedback(uid) { return read(fbKey(uid)); }

export function summary(uid) {
  const ev = getEvents(uid);
  const count = (t) => ev.filter((e) => e.type === t).length;
  const fb = getFeedback(uid);
  const avg = (f) => {
    const v = fb.map(f).filter((n) => typeof n === "number");
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  return {
    profileCompleted: count("profile_completed"),
    recsViewed: count("recs_viewed"),
    thinkSaved: count("think_saved"),
    looksSaved: count("look_saved"),
    feedbackCount: fb.length,
    avgUseful: avg((f) => f.rating),
    avgEasy: avg((f) => f.easy),
  };
}

/** Renders the star and comment form into `el`. */
export function mountFeedback(el, uid, page) {
  el.innerHTML = `
    <h2>Was this helpful?</h2>
    <p class="fb__lede">Your answers stay on this phone and help the research.</p>
    <fieldset class="fb__group"><legend>How useful were these suggestions?</legend>
      <div class="fb__stars" role="radiogroup" aria-label="Usefulness from 1 to 5">
        ${[1,2,3,4,5].map((n) => `<button type="button" class="fb__star" data-group="rating" data-v="${n}" role="radio" aria-checked="false" aria-label="${n} out of 5">★</button>`).join("")}
      </div>
    </fieldset>
    <fieldset class="fb__group"><legend>How easy was the app to use?</legend>
      <div class="fb__stars" role="radiogroup" aria-label="Ease of use from 1 to 5">
        ${[1,2,3,4,5].map((n) => `<button type="button" class="fb__star" data-group="easy" data-v="${n}" role="radio" aria-checked="false" aria-label="${n} out of 5">★</button>`).join("")}
      </div>
    </fieldset>
    <label class="fb__label" for="fb-comment">Anything we should change? (optional)</label>
    <textarea id="fb-comment" rows="3" maxlength="500"></textarea>
    <button type="button" class="btn-primary" id="fb-send" disabled>Send feedback</button>
    <p class="fb__thanks" id="fb-thanks" role="status"></p>`;
  const val = { rating: 0, easy: 0 };
  const send = el.querySelector("#fb-send");
  el.addEventListener("click", (e) => {
    const b = e.target.closest(".fb__star");
    if (!b) return;
    const g = b.dataset.group, n = Number(b.dataset.v);
    val[g] = n;
    el.querySelectorAll(`.fb__star[data-group="${g}"]`).forEach((s) => {
      const on = Number(s.dataset.v) <= n;
      s.classList.toggle("is-on", on);
      s.setAttribute("aria-checked", String(Number(s.dataset.v) === n));
    });
    send.disabled = !(val.rating && val.easy);
  });
  send.addEventListener("click", () => {
    addFeedback(uid, { rating: val.rating, easy: val.easy, comment: el.querySelector("#fb-comment").value, page });
    send.disabled = true;
    el.querySelector("#fb-thanks").textContent = "Thank you. Your feedback was saved.";
  });
}
