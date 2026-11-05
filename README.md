# StyleCue prototype, setup

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

That's it for login/signup, Supabase's built-in `auth.users` table handles accounts automatically. Email/password sign-in is enabled by default.

**Optional but recommended for a prototype:** turn off email confirmation so you can test signup instantly. In Supabase: **Authentication → Providers → Email**, toggle off "Confirm email". (Leave it on if you want to demonstrate a more production-realistic flow, your report already discloses auth as a non-production demo either way.)

## 3. Run it locally

Because the JS uses ES modules, you can't just double-click `index.html` (browsers block module imports over `file://`). Use any local server, e.g.:

```bash
npx serve .
```

or the VS Code "Live Server" extension. Then open the printed `localhost` URL.

## 4. Deploying (optional, for sharing a link with your supervisor)

Drag the `stylecue` folder into [Netlify Drop](https://app.netlify.com/drop), no account needed, and you get a live URL in seconds. Just make sure `js/config.js` has your real Supabase keys before you drag it in (the anon key is safe to expose publicly; it's designed for client-side use).

## 5. Set up the `profiles` table (needed for the body shape calculator)

`bodytype.html` saves each user's calculated shape, so create this table before testing it. In Supabase: **SQL Editor → New query**, paste and run:

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  body_shape text,
  style_personality text,
  season text,
  shoulder_cm numeric,
  waist_cm numeric,
  hip_cm numeric,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
```

**Already created `profiles` earlier without the newer columns?** Run this instead of re-creating the table:

```sql
alter table profiles
  add column if not exists season text,
  add column if not exists shoulder_cm numeric,
  add column if not exists waist_cm numeric,
  add column if not exists hip_cm numeric;
```

Without this table, the shape calculator still works and shows a result, it just can't save it, and will show a message saying so.

## 6. Add your own body-type images

`bodytype.html` and its reference cards currently show plain placeholder boxes ("Add your Hourglass image here" etc). Drop your saved images into the `images/` folder (see `images/README.md`), then in `js/bodytype-app.js` replace the placeholder `<div class="type-card__img">` markup with an `<img src="images/hourglass.jpg" alt="Hourglass body shape" />` for each type.

## 7. Set up the `favorites` table (needed for the Look Library's save button)

In Supabase: **SQL Editor → New query**, paste and run:

```sql
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  photo_id text not null,
  image_url text not null,
  photographer text,
  photographer_url text,
  query text,
  created_at timestamptz default now()
);

alter table favorites enable row level security;

create policy "Users can view their own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on favorites for delete
  using (auth.uid() = user_id);
```

## 8. Add your Unsplash key (needed for the Look Library)

1. Go to [unsplash.com/developers](https://unsplash.com/developers) → create a free app.
2. Copy the **Access Key**.
3. Paste it into `js/config.js` in place of `"YOUR_UNSPLASH_ACCESS_KEY"`.

The free tier is rate-limited to 50 requests/hour, fine for demo/prototype use, but worth knowing if you're testing a lot in one sitting. When your Pinterest API access comes through, `js/unsplashClient.js` is the one file to swap out, everything else (the query-building logic, the save-to-favorites flow) stays the same.

## 9. Set up the `closet_items` table (needed for Closet + fit check)

```sql
create table closet_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text,
  color text,
  garment_shoulder numeric,
  garment_waist numeric,
  garment_hip numeric,
  size_label text,
  fit_source text,
  created_at timestamptz default now()
);

alter table closet_items enable row level security;

create policy "Users can view their own closet"
  on closet_items for select using (auth.uid() = user_id);
create policy "Users can add to their own closet"
  on closet_items for insert with check (auth.uid() = user_id);
create policy "Users can remove from their own closet"
  on closet_items for delete using (auth.uid() = user_id);
```

If you created `closet_items` earlier without `size_label` / `fit_source`:

```sql
alter table closet_items
  add column if not exists size_label text,
  add column if not exists fit_source text;
```

**Retake the body shape once** after adding `shoulder_cm` / `waist_cm` / `hip_cm` so your measurements are saved. The fit check needs them.

## 10. Images

- `images/styles/<style>/hero.jpg`, `palette.jpg`, `detail.jpg` for all 16 styles (48 images), see `images/STYLE_IMAGES_GUIDE.md` for exact search terms.
- `images/seasons/<spring|summer|autumn|winter>/hero.jpg` (4 images).
- Body-type images (5) in `images/`, see section 6.

Missing images just show a plain placeholder block; nothing breaks.

## 11. How the recommendation logic works (for your report)

Everything is rule-based and explainable, no machine learning:

| Step | File | Method |
|---|---|---|
| Body shape | `js/bodyShape.js` | Ratio thresholds on shoulder / waist / hip, with a plain-English reason string |
| Style personality | `js/quizQuestions.js`, `js/quiz-app.js` | 12 forced-choice questions, 16 styles, each style appears 3 times; tally with tie-handling |
| Colour season | `js/seasonTypes.js` | 4 questions, tally |
| Recommendations | `js/matchEngine.js`, `js/productCatalog.js` | Body-shape tags + style tags are combined, then each of the 29 catalogue items is scored by how many tags it matches (shown as score/total) |
| Fit check | `js/fitCheck.js`, `js/sizeChart.js` | Garment vs body measurement, +/-5% threshold; or size-chart lookup (waist/hip only) |

Worked example (run it live at `recommendations.html`): shoulder 92 / waist 78 / hip 108 cm gives **Pear**. With **Romantic** the combined list has 8 tags and *Ruffle-Sleeve Blouse* ranks first at 3/8.

## 12. Before you submit

`REPORT_CHANGES.md` lists every place the report needs to change so it matches what is built. Re-run the worked example from the live app and copy the numbers from there, not from older drafts.

## Files

```
stylecue/
├── index.html / onboarding.html / dashboard.html
├── bodytype.html / quiz.html / season.html
├── recommendations.html / library.html / closet.html / occasions.html
├── styleguide.html / profile.html
├── css/style.css
├── images/                      (styles/, seasons/, body types, guide)
└── js/
    ├── config.js                ← put your keys here
    ├── supabaseClient.js, unsplashClient.js, nav.js, toast.js, shareCard.js
    ├── bodyShape.js, styleTypes.js, quizQuestions.js, seasonTypes.js
    ├── matchEngine.js, productCatalog.js, fitCheck.js, sizeChart.js
    └── app.js, onboarding.js, *-app.js   (page logic)
```

Run with a local server (VS Code Live Server or `npx serve`), not by double-clicking the HTML files, because the scripts are ES modules.
