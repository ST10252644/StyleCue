import "./expiry.js";
import "./memoryLite.js";
// Small shared helpers for phone use: password eye, keyboard-safe scrolling, cm/inch units.

// ---- 1. Show / hide password ----
function addPasswordEyes() {
  document.querySelectorAll('input[type="password"]').forEach((input) => {
    if (input.dataset.eye) return;
    input.dataset.eye = "1";
    const wrap = document.createElement("div");
    wrap.className = "pw-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pw-eye";
    btn.setAttribute("aria-label", "Show password");
    btn.setAttribute("aria-pressed", "false");
    btn.textContent = "Show";
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.setAttribute("aria-pressed", String(show));
      input.focus();
    });
    wrap.appendChild(btn);
  });
}

// ---- 2. Keep the page scrollable and the field visible when the keyboard is open ----
function setupKeyboard() {
  const isField = (el) => el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  let t;
  document.addEventListener("focusin", (e) => {
    if (!isField(e.target)) return;
    clearTimeout(t);
    document.body.classList.add("kb-open");
    setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 320);
  });
  document.addEventListener("focusout", () => {
    t = setTimeout(() => {
      if (!isField(document.activeElement)) document.body.classList.remove("kb-open");
    }, 150);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      const a = document.activeElement;
      if (isField(a)) a.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
}

// ---- 3. cm / inch ----
const KEY = "stylecue_unit";
export function getUnit() {
  try { return localStorage.getItem(KEY) === "in" ? "in" : "cm"; } catch { return "cm"; }
}
function saveUnit(u) { try { localStorage.setItem(KEY, u); } catch {} }
const round1 = (n) => Math.round(n * 10) / 10;

/** Value of a measurement input, always returned in cm. */
export function cmValue(input) {
  const v = parseFloat(input.value);
  if (!Number.isFinite(v)) return NaN;
  return getUnit() === "in" ? v * 2.54 : v;
}

/** Wire up .unit-toggle buttons (#unit-cm, #unit-in), inputs[data-measure] and labels .unit-label. */
export function setupUnits() {
  const bCm = document.getElementById("unit-cm");
  const bIn = document.getElementById("unit-in");
  const inputs = [...document.querySelectorAll("input[data-measure]")];
  if (!bCm || !bIn || !inputs.length) return;
  const apply = (unit, convert) => {
    const from = getUnit();
    inputs.forEach((i) => {
      if (convert && i.value !== "" && from !== unit) {
        const v = parseFloat(i.value);
        if (Number.isFinite(v)) {
          if (unit === "in") { i.dataset.cm = String(v); i.dataset.in = String(round1(v / 2.54)); i.value = i.dataset.in; }
          else if (i.dataset.cm && i.dataset.in === String(v)) i.value = i.dataset.cm; // untouched: restore exact cm
          else i.value = round1(v * 2.54);
        }
      }
      if (unit === "in") { i.min = "0.4"; i.max = "80"; } else { i.min = "1"; i.max = "200"; }
    });
    saveUnit(unit);
    bCm.classList.toggle("is-active", unit === "cm");
    bIn.classList.toggle("is-active", unit === "in");
    bCm.setAttribute("aria-pressed", String(unit === "cm"));
    bIn.setAttribute("aria-pressed", String(unit === "in"));
    document.querySelectorAll(".unit-label").forEach((s) => (s.textContent = unit === "in" ? "in" : "cm"));
  };
  bCm.addEventListener("click", () => apply("cm", true));
  bIn.addEventListener("click", () => apply("in", true));
  apply(getUnit(), false);
}

addPasswordEyes();
setupKeyboard();
setupUnits();
