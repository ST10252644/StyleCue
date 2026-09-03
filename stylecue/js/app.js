import { supabase } from "./supabaseClient.js";

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const formLogin = document.getElementById("form-login");
const formSignup = document.getElementById("form-signup");
const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");
const messageEl = document.getElementById("message");

function showTab(tab) {
  const showLogin = tab === "login";
  tabLogin.classList.toggle("is-active", showLogin);
  tabSignup.classList.toggle("is-active", !showLogin);
  tabLogin.setAttribute("aria-selected", showLogin);
  tabSignup.setAttribute("aria-selected", !showLogin);
  formLogin.style.display = showLogin ? "block" : "none";
  formSignup.style.display = showLogin ? "none" : "block";
  hideMessage();
}

tabLogin.addEventListener("click", () => showTab("login"));
tabSignup.addEventListener("click", () => showTab("signup"));
switchToSignup.addEventListener("click", () => showTab("signup"));
switchToLogin.addEventListener("click", () => showTab("login"));

function showMessage(text, type = "error") {
  messageEl.textContent = text;
  messageEl.className = `message is-visible message--${type}`;
}

function hideMessage() {
  messageEl.className = "message";
}

function setLoading(button, isLoading, label) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Please wait…" : label;
}

// ---- Sign up ----
formSignup.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const submitBtn = document.getElementById("signup-submit");

  setLoading(submitBtn, true, "Create account");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  setLoading(submitBtn, false, "Create account");

  if (error) {
    showMessage(error.message, "error");
    return;
  }

  if (data.session) {
    // Email confirmation is off — user is logged in immediately.
    window.location.href = "dashboard.html";
  } else {
    showMessage(
      "Account created. Check your email to confirm before logging in.",
      "success"
    );
    showTab("login");
  }
});

// ---- Log in ----
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const submitBtn = document.getElementById("login-submit");

  setLoading(submitBtn, true, "Log in");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  setLoading(submitBtn, false, "Log in");

  if (error) {
    showMessage(error.message, "error");
    return;
  }

  window.location.href = "dashboard.html";
});

// If already logged in, skip straight to the dashboard.
supabase.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = "dashboard.html";
});