import { supabase } from "./supabaseClient.js";
import { getList } from "./pause.js";

const ICONS = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  picks: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  looks: '<rect x="3" y="3" width="8" height="10" rx="2"/><rect x="13" y="3" width="8" height="6" rx="2"/><rect x="13" y="11" width="8" height="10" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/>',
  closet: '<path d="M12 4a2 2 0 1 1 2 2c-1 .5-2 1-2 2v1M3 18l9-8 9 8z"/>',
  me: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

/**
 * Mobile app shell: a slim top bar and a bottom tab bar.
 * @param {string} active  dashboard | recommendations | library | closet | profile | (others have no tab)
 * @param {string} [uid]   user id, used for the "Think it over" count
 */
export function renderNav(active, uid) {
  const tabs = [
    { href: "dashboard.html", label: "Home", key: "dashboard", icon: "home" },
    { href: "recommendations.html", label: "Picks", key: "recommendations", icon: "picks" },
    { href: "library.html", label: "Looks", key: "library", icon: "looks" },
    { href: "closet.html", label: "Closet", key: "closet", icon: "closet" },
    { href: "profile.html", label: "You", key: "profile", icon: "me" },
  ];
  const countFor = (id) => (id ? getList(id).filter((i) => i.status === "thinking").length : 0);
  const count = countFor(uid);

  const bar = document.createElement("header");
  bar.className = "app-bar";
  bar.innerHTML = `
    <a href="dashboard.html" class="app-bar__brand">StyleCue</a>
    <a href="thinkitover.html" class="app-bar__btn${active === "thinkitover" ? " is-active" : ""}" aria-label="Think it over">
      ${icon("bookmark")}${count ? `<span class="app-bar__badge">${count}</span>` : ""}
    </a>`;
  document.body.prepend(bar);

  const tab = document.createElement("nav");
  tab.className = "tab-bar";
  tab.setAttribute("aria-label", "Main");
  tab.innerHTML = tabs.map((t) =>
    `<a href="${t.href}" class="tab-bar__item${t.key === active ? " is-active" : ""}"${t.key === active ? ' aria-current="page"' : ""}>${icon(t.icon)}<span>${t.label}</span></a>`
  ).join("");
  document.body.appendChild(tab);

  if (!uid) {
    supabase.auth.getSession().then(({ data }) => {
      const n = countFor(data?.session?.user?.id);
      if (n) bar.querySelector(".app-bar__btn").insertAdjacentHTML("beforeend", `<span class="app-bar__badge">${n}</span>`);
    });
  }
}

export async function logOut() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}
