import "./expiry.js";
// PROTOTYPE MODE: no database and no server.
// This file replaces the Supabase client with a small local store that keeps
// everything in the browser/phone storage of whoever opens the prototype.
// Any email and password will sign in. Nothing leaves the device.
// The calls (auth, from().select().eq()...) match the Supabase client, so a real
// database can be connected later by putting the real client back in this file.

const DB_KEY = "stylecue_proto_db";
const SESSION_KEY = "stylecue_proto_session";
const mem = {};

function read(k, fallback) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return mem[k] ?? fallback; }
}
function write(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { mem[k] = v; }
}
const db = () => read(DB_KEY, { profiles: [], favorites: [], closet_items: [] });
const uid = () => "id" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function pick(row, cols) {
  if (!cols || cols === "*") return { ...row };
  const out = {};
  cols.split(",").map((c) => c.trim()).forEach((c) => { out[c] = row[c] ?? null; });
  return out;
}

function query(table) {
  const q = { op: "select", cols: "*", filters: [], order: null, single: false, payload: null, conflict: "id" };
  const b = {
    select(cols) { if (q.op === "select") q.cols = cols || "*"; return b; },
    eq(col, val) { q.filters.push([col, val]); return b; },
    order(col, o) { q.order = [col, o?.ascending !== false]; return b; },
    single() { q.single = true; return b; },
    maybeSingle() { q.single = true; return b; },
    insert(p) { q.op = "insert"; q.payload = p; return b; },
    upsert(p, o) { q.op = "upsert"; q.payload = p; q.conflict = o?.onConflict || "id"; return b; },
    update(p) { q.op = "update"; q.payload = p; return b; },
    delete() { q.op = "delete"; return b; },
    then(resolve, reject) { return Promise.resolve(run()).then(resolve, reject); },
  };
  const match = (r) => q.filters.every(([c, v]) => r[c] === v);
  function run() {
    const d = db();
    const rows = d[table] || (d[table] = []);
    let out = [];
    if (q.op === "insert") {
      const list = Array.isArray(q.payload) ? q.payload : [q.payload];
      list.forEach((p) => rows.push({ id: uid(), created_at: new Date().toISOString(), ...p }));
    } else if (q.op === "upsert") {
      const p = q.payload;
      const i = rows.findIndex((r) => r[q.conflict] === p[q.conflict]);
      if (i >= 0) rows[i] = { ...rows[i], ...p }; else rows.push({ created_at: new Date().toISOString(), ...p });
    } else if (q.op === "update") {
      rows.forEach((r, i) => { if (match(r)) rows[i] = { ...r, ...q.payload }; });
    } else if (q.op === "delete") {
      d[table] = rows.filter((r) => !match(r));
    } else {
      out = rows.filter(match);
      if (q.order) out.sort((a, b) => (a[q.order[0]] > b[q.order[0]] ? 1 : -1) * (q.order[1] ? 1 : -1));
      out = out.map((r) => pick(r, q.cols));
    }
    write(DB_KEY, d);
    if (q.single) return { data: out[0] || null, error: null };
    return { data: out, error: null };
  }
  return b;
}

const auth = {
  async getSession() { const s = read(SESSION_KEY, null); return { data: { session: s } }; },
  async signUp({ email, options }) {
    const user = { id: "u_" + btoa(email.toLowerCase()).replace(/=/g, ""), email, user_metadata: options?.data || {} };
    const session = { user };
    write(SESSION_KEY, session);
    return { data: { session, user }, error: null };
  },
  async signInWithPassword({ email }) {
    if (!email) return { error: { message: "Enter an email address." } };
    const user = { id: "u_" + btoa(email.toLowerCase()).replace(/=/g, ""), email, user_metadata: {} };
    write(SESSION_KEY, { user });
    return { data: { session: { user } }, error: null };
  },
  async signOut() { write(SESSION_KEY, null); return { error: null }; },
  onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
};

export const supabase = { auth, from: query };
