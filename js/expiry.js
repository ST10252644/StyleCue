// The prototype stops working after this date. It is set for the university hand-in, so the app cannot be used afterwards.
// EXPIRES_ON is the first day the app no longer opens. APK_ONLY = true means the website stays open and only the installed Android app expires.
const EXPIRES_ON = new Date(2027, 0, 1); // 1 January 2027, 00:00 on the phone
const APK_ONLY = true;

const isApp = !!(window.Capacitor && (window.Capacitor.isNativePlatform ? window.Capacitor.isNativePlatform() : window.Capacitor.platform && window.Capacitor.platform !== "web"));

if ((isApp || !APK_ONLY) && Date.now() >= EXPIRES_ON.getTime()) {
  const show = () => {
    document.title = "StyleCue, prototype expired";
    document.body.className = "";
    document.body.style.cssText = "margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1e1537;color:#fff;font-family:Inter,system-ui,sans-serif;text-align:center;padding:2rem";
    document.body.innerHTML = '<main><h1 style="font-family:Fraunces,Georgia,serif;font-weight:500;font-size:2rem;margin:0 0 1rem">StyleCue</h1><p style="font-size:1.1rem;line-height:1.6;max-width:22rem;margin:0 auto 1rem">This prototype was made for the REIT8419 research project and has expired. It can no longer be used.</p><p style="color:#d9c9ff;font-size:0.95rem">Expired on 1 January 2027.</p></main>';
    try { localStorage.clear(); } catch { /* nothing to clear */ }
  };
  if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
  throw new Error("StyleCue prototype expired");
}
