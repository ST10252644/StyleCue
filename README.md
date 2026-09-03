# StyleCue prototype — setup

Plain HTML/CSS/JS, no build step. Auth and the database run on [Supabase](https://supabase.com) (free tier is plenty for a prototype).

## 1. Create a Supabase project

1. Go to supabase.com → New project. Pick any name/region, set a database password (you won't need it directly).
2. Wait ~2 min for it to spin up.

## 2. Connect this project to it

1. In Supabase: **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. Paste them into `js/config.js`:

```js
export const SUPABASE_URL = "https://xxxxx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

That's it for login/signup — Supabase's built-in `auth.users` table handles accounts automatically. Email/password sign-in is enabled by default.

**Optional but recommended for a prototype:** turn off email confirmation so you can test signup instantly. In Supabase: **Authentication → Providers → Email**, toggle off "Confirm email". (Leave it on if you want to demonstrate a more production-realistic flow — your report already discloses auth as a non-production demo either way.)

## 3. Run it locally

Because the JS uses ES modules, you can't just double-click `index.html` (browsers block module imports over `file://`). Use any local server, e.g.:

```bash
npx serve .
```

or the VS Code "Live Server" extension. Then open the printed `localhost` URL.

## 4. Deploying (optional, for sharing a link with your supervisor)

Drag the `stylecue` folder into [Netlify Drop](https://app.netlify.com/drop) — no account needed — and you get a live URL in seconds. Just make sure `js/config.js` has your real Supabase keys before you drag it in (the anon key is safe to expose publicly; it's designed for client-side use).

## 5. What's next (for when you build the shape classifier / quiz / results screens)

You'll likely want a `profiles` table to store each user's body shape and style personality once they complete those steps. In Supabase: **Table Editor → New table**, e.g.:

| column | type | notes |
|---|---|---|
| id | uuid | references `auth.users.id`, primary key |
| full_name | text | |
| body_shape | text | e.g. "Hourglass", "Pear" |
| style_personality | text | e.g. "Edgy", "Romantic" |
| created_at | timestamptz | default `now()` |

Turn on **Row Level Security** on that table and add a policy so a user can only read/write their own row (`auth.uid() = id`). Happy to help you set that table and the quiz/classifier screens up when you're ready.

## Files

```
stylecue/
├── index.html        Login / signup screen
├── dashboard.html     Placeholder post-login landing page
├── css/style.css      All styling (design tokens at the top)
├── js/config.js        ← put your Supabase URL + anon key here
├── js/supabaseClient.js
└── js/app.js           Tab switching + auth logic
```
