import { supabase } from "./supabaseClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { checkFit } from "./fitCheck.js";
import { SIZE_CHART } from "./sizeChart.js";
import { renderNav } from "./nav.js";
import { showToast } from "./toast.js";

renderNav("closet");

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const userId = sessionData.session.user.id;

const form = document.getElementById("add-item-form");
const closetList = document.getElementById("closet-list");
const closetEmpty = document.getElementById("closet-empty");
const itemCount = document.getElementById("item-count");
const gapIntro = document.getElementById("gap-intro");
const gapList = document.getElementById("gap-list");
const noMeasurementsNotice = document.getElementById("no-measurements-notice");

let items = [];
let bodyMeasurements = null; // { shoulder_cm, waist_cm, hip_cm } or null if not set
let fitMode = "none"; // "none" | "size" | "exact"

// ---- Populate the size dropdown from the size chart data ----
const sizeSelect = document.getElementById("item-size");
Object.entries(SIZE_CHART).forEach(([key, data]) => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = data.display;
  sizeSelect.appendChild(opt);
});

// ---- Fit mode toggle ----
const fitModeButtons = document.querySelectorAll("#fit-mode-toggle button");
const sizePanel = document.getElementById("fit-mode-size");
const exactPanel = document.getElementById("fit-mode-exact");

fitModeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    fitMode = btn.dataset.mode;
    fitModeButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    sizePanel.style.display = fitMode === "size" ? "block" : "none";
    exactPanel.style.display = fitMode === "exact" ? "block" : "none";
  });
});

async function loadBodyMeasurements() {
  const { data: profile } = await supabase
    .from("profiles")
    .select("shoulder_cm, waist_cm, hip_cm")
    .eq("id", userId)
    .single();

  if (profile?.shoulder_cm && profile?.waist_cm && profile?.hip_cm) {
    bodyMeasurements = profile;
    noMeasurementsNotice.style.display = "none";
  } else {
    bodyMeasurements = null;
    noMeasurementsNotice.style.display = "block";
  }
}

async function loadItems() {
  const { data } = await supabase
    .from("closet_items")
    .select("id, name, category, color, garment_shoulder, garment_waist, garment_hip, size_label, fit_source")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  items = data || [];
  renderItems();
  renderGapAnalysis();
}

function fitBadge(item) {
  if (!bodyMeasurements) return "";
  const fit = checkFit(bodyMeasurements, item);
  if (!fit.hasData) return "";

  const colorMap = {
    "True to size": "#4d5900",
    "Runs small": "#b5391b",
    "Runs roomy": "#b5391b",
    "Mixed fit": "#8a6d1b",
  };
  const bg = fit.overall === "True to size" ? "rgba(207,255,4,0.18)" : "rgba(255,92,57,0.1)";

  const reasonText = fit.dimensions.map((d) => d.reason).join(" ");
  const estimateCaveat =
    item.fit_source === "size-estimate"
      ? ` Estimated from size ${item.size_label} on standard sizing, actual fit varies by brand.`
      : "";

  return `
    <div style="margin-top:0.35rem;">
      <span style="display:inline-block; font-size:0.72rem; font-weight:700; padding:0.15rem 0.6rem; border-radius:999px; background:${bg}; color:${colorMap[fit.overall]};">
        ${fit.overall}
      </span>
      <span style="display:block; font-size:0.75rem; color:#8a8371; margin-top:0.25rem;">${reasonText}${estimateCaveat}</span>
    </div>
  `;
}

function renderItems() {
  itemCount.textContent = items.length;
  if (items.length === 0) {
    closetList.innerHTML = "";
    closetEmpty.style.display = "block";
    return;
  }
  closetEmpty.style.display = "none";

  const categories = ["top", "bottom", "dress", "outerwear", "shoes", "accessory"];
  closetList.innerHTML = categories
    .map((cat) => {
      const catItems = items.filter((i) => i.category === cat);
      if (catItems.length === 0) return "";
      return `
        <div style="margin-bottom:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#8a8371; text-transform:capitalize; margin-bottom:0.5rem;">${cat}</div>
          ${catItems
            .map(
              (i) => `
            <div style="padding:0.6rem 0; border-bottom:1px solid var(--line-on-bone);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <span style="font-size:0.9rem;">${i.name}${i.color ? `, <span style="color:#8a8371;">${i.color}</span>` : ""}</span>
                <button data-id="${i.id}" class="remove-item" style="background:none; border:none; color:#8a8371; cursor:pointer; font-size:1rem; flex-shrink:0;">×</button>
              </div>
              ${fitBadge(i)}
            </div>
          `
            )
            .join("")}
        </div>
      `;
    })
    .join("");

  closetList.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await supabase.from("closet_items").delete().eq("id", btn.dataset.id);
      showToast("Removed from closet.");
      loadItems();
    });
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("item-name").value.trim();
  const category = document.getElementById("item-category").value;
  const color = document.getElementById("item-color").value.trim();
  if (!name) return;

  let garment_shoulder = null;
  let garment_waist = null;
  let garment_hip = null;
  let size_label = null;
  let fit_source = null;

  if (fitMode === "size") {
    const sizeKey = sizeSelect.value;
    if (sizeKey) {
      const sizeData = SIZE_CHART[sizeKey];
      garment_waist = sizeData.waist_cm;
      garment_hip = sizeData.hip_cm;
      size_label = sizeKey;
      fit_source = "size-estimate";
      // Shoulder isn't part of a standard size chart, so it's left
      // unset here, checkFit() simply skips dimensions it has no data for.
    }
  } else if (fitMode === "exact") {
    garment_shoulder = parseFloat(document.getElementById("item-shoulder").value) || null;
    garment_waist = parseFloat(document.getElementById("item-waist").value) || null;
    garment_hip = parseFloat(document.getElementById("item-hip").value) || null;
    if (garment_shoulder || garment_waist || garment_hip) fit_source = "exact";
  }

  const { error } = await supabase.from("closet_items").insert({
    user_id: userId,
    name,
    category,
    color,
    garment_shoulder,
    garment_waist,
    garment_hip,
    size_label,
    fit_source,
  });

  if (error) {
    showToast("Couldn't add item, check your closet_items table is set up.", "error");
    return;
  }
  showToast("Added to your closet.");
  form.reset();
  fitMode = "none";
  fitModeButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.mode === "none"));
  sizePanel.style.display = "none";
  exactPanel.style.display = "none";
  loadItems();
});

// ---- Gap analysis: compare the user's style personality's key pieces
// against what's actually logged in their closet (simple keyword match). ----
async function renderGapAnalysis() {
  const { data: profile } = await supabase
    .from("profiles")
    .select("style_personality")
    .eq("id", userId)
    .single();

  if (!profile?.style_personality) {
    gapIntro.innerHTML = `Take the <a href="quiz.html">style quiz</a> to see which pieces would complete your wardrobe.`;
    gapList.innerHTML = "";
    return;
  }

  const style = STYLE_TYPES[profile.style_personality];
  const ownedNames = items.map((i) => i.name.toLowerCase());

  const missing = style.keyPieces.filter((piece) => {
    const pieceWords = piece.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    return !ownedNames.some((owned) => pieceWords.some((w) => owned.includes(w)));
  });

  gapIntro.textContent = `Based on your ${style.name} style, here's what's not yet in your closet:`;

  if (missing.length === 0) {
    gapList.innerHTML = `<li>Nice, your closet already covers the core ${style.name} pieces.</li>`;
  } else {
    gapList.innerHTML = missing.map((piece) => `<li>${piece}</li>`).join("");
  }
}

async function init() {
  await loadBodyMeasurements();
  await loadItems();
}

init();
