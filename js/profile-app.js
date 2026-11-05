import { supabase } from "./supabaseClient.js";
import { STYLE_TYPES } from "./styleTypes.js";
import { BODY_TYPES } from "./bodyShape.js";
import { renderNav, logOut } from "./nav.js";

renderNav("profile");

const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "index.html";
}
const user = sessionData.session.user;

const fullNameInput = document.getElementById("full-name");
const emailLine = document.getElementById("email-line");
const saveNameBtn = document.getElementById("save-name");
const saveNameMsg = document.getElementById("save-name-msg");
const bodyShapeValue = document.getElementById("bodyshape-value");
const styleValue = document.getElementById("style-value");
const savedGrid = document.getElementById("saved-grid");
const savedEmpty = document.getElementById("saved-empty");

emailLine.textContent = `Signed in as ${user.email}`;

async function loadProfile() {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, body_shape, style_personality")
    .eq("id", user.id)
    .single();

  fullNameInput.value = profile?.full_name || user.user_metadata?.full_name || "";
  bodyShapeValue.textContent = profile?.body_shape ? BODY_TYPES[profile.body_shape].name : "Not set";
  styleValue.textContent = profile?.style_personality ? STYLE_TYPES[profile.style_personality].name : "Not set";
}

saveNameBtn.addEventListener("click", async () => {
  saveNameBtn.disabled = true;
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, full_name: fullNameInput.value.trim() }, { onConflict: "id" });
  saveNameBtn.disabled = false;
  saveNameMsg.textContent = error ? "Couldn't save, try again." : "Saved.";
  setTimeout(() => (saveNameMsg.textContent = ""), 2500);
});

async function loadSavedLooks() {
  const { data: favorites } = await supabase
    .from("favorites")
    .select("id, photo_id, image_url, photographer, photographer_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!favorites || favorites.length === 0) {
    savedEmpty.style.display = "block";
    return;
  }

  savedGrid.innerHTML = "";
  favorites.forEach((fav) => {
    const item = document.createElement("div");
    item.className = "saved-item";
    item.innerHTML = `
      <img src="${fav.image_url}" alt="Saved look" />
      <button class="saved-item__remove" type="button" title="Remove">×</button>
    `;
    item.querySelector(".saved-item__remove").addEventListener("click", async () => {
      await supabase.from("favorites").delete().eq("id", fav.id);
      item.remove();
      if (savedGrid.children.length === 0) savedEmpty.style.display = "block";
    });
    savedGrid.appendChild(item);
  });
}

loadProfile();
loadSavedLooks();

document.getElementById("logout").addEventListener("click", logOut);
