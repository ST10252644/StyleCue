// Seasonal color analysis, classic four-season method (Color Me Beautiful /
// Carole Jackson, 1980; still the standard basis most modern seasonal
// color tools build on). Two underlying axes: warm vs cool undertone,
// and light/clear vs deep/muted depth. Rule-based, same principle as the
// body shape and style personality classifiers.

export const SEASON_TYPES = {
  spring: {
    name: "Spring",
    tagline: "Warm, clear, and bright.",
    description: "You carry warm, golden undertones best matched with clear, energetic color, nothing muddy or muted.",
    bestColors: ["Coral", "Peach", "Warm turquoise", "Golden yellow", "Grass green", "Ivory"],
    avoidColors: ["Black", "Icy pastels", "Cool grey"],
    metal: "Gold",
    fabricNote: "Lighter, crisp fabrics in clear warm tones suit you best, avoid anything that reads dusty or muted.",
    keywords: "spring color palette warm bright outfit",
    images: { hero: "images/seasons/spring/hero.jpg" },
    features: {"skin": "Light to medium skin with a warm, golden or peachy undertone, often with freckles or a warm flush.", "hair": "Golden blonde, strawberry blonde or light warm brown.", "eyes": "Light warm eyes such as golden green, turquoise, hazel or light warm brown.", "contrast": "Low to medium contrast. The overall look is fresh and bright.", "veins": "Wrist veins tend to look green."},
  },
  summer: {
    name: "Summer",
    tagline: "Cool, soft, and muted.",
    description: "You carry cool, blue-based undertones best matched with soft, muted color, nothing too warm or too bright.",
    bestColors: ["Dusty blue", "Lavender", "Rose pink", "Sage green", "Soft white", "Cool grey"],
    avoidColors: ["Orange", "Bright warm tones", "Black"],
    metal: "Silver",
    fabricNote: "Soft-drape fabrics in muted, powdery tones work with your coloring rather than against it.",
    keywords: "summer color palette soft muted outfit",
    images: { hero: "images/seasons/summer/hero.jpg" },
    features: {"skin": "Fair to medium skin with a cool pink or neutral-cool undertone that can burn easily.", "hair": "Ash blonde, light ash brown or soft mid brown, with no golden or red shine.", "eyes": "Soft blue, grey, blue-green, soft hazel or soft brown eyes.", "contrast": "Low contrast. Skin, hair and eyes blend softly together.", "veins": "Wrist veins tend to look blue or purple."},
  },
  autumn: {
    name: "Autumn",
    tagline: "Warm, deep, and earthy.",
    description: "You carry warm, golden undertones best matched with deep, rich color, nothing icy or overly pastel.",
    bestColors: ["Rust", "Olive", "Mustard", "Chocolate brown", "Burnt orange", "Deep teal"],
    avoidColors: ["Icy pastels", "Neon", "Cool pink"],
    metal: "Bronze or antique gold",
    fabricNote: "Rich, textured fabrics in warm, earthy tones are your strongest base.",
    keywords: "autumn color palette earthy warm outfit",
    images: { hero: "images/seasons/autumn/hero.jpg" },
    features: {"skin": "Medium to deep skin with a warm golden, olive or bronze undertone that tans easily.", "hair": "Red, copper, auburn, chestnut or warm dark brown.", "eyes": "Deep warm brown, amber, olive green or warm hazel eyes.", "contrast": "Medium contrast. The overall look is rich, earthy and warm.", "veins": "Wrist veins tend to look green or olive."},
  },
  winter: {
    name: "Winter",
    tagline: "Cool, deep, and bold.",
    description: "You carry cool undertones with strong natural contrast, best matched with bold, clear color, nothing muted or warm-beige.",
    bestColors: ["True red", "Emerald", "Sapphire", "Black", "Pure white", "Fuchsia"],
    avoidColors: ["Muted earth tones", "Orange", "Warm beige"],
    metal: "Silver or platinum",
    fabricNote: "High-contrast, saturated color reads strongest on you, soft or muted tones tend to wash you out.",
    keywords: "winter color palette bold cool outfit",
    images: { hero: "images/seasons/winter/hero.jpg" },
    features: {"skin": "Fair to very deep skin with a cool or blue-based undertone, often with a clear, even surface.", "hair": "Black, espresso or cool dark brown, or very light ash blonde with strong contrast.", "eyes": "Very dark brown, black-brown, icy blue, grey or bright emerald eyes.", "contrast": "High contrast. Dark hair against light skin, or very distinct features.", "veins": "Wrist veins tend to look blue or purple."},
  },
};

// Underlying axes: each season is a fixed combination of undertone, depth and chroma.
export const SEASON_AXES = {
  spring: { undertone: "warm", depth: "light", chroma: "clear" },
  summer: { undertone: "cool", depth: "light", chroma: "soft" },
  autumn: { undertone: "warm", depth: "deep", chroma: "soft" },
  winter: { undertone: "cool", depth: "deep", chroma: "clear" },
};

// An option's season can be one season, a list of seasons (the answer fits both, so each gets half a point)
// or null (a neutral answer such as "hard to tell", which scores nothing).
export const SEASON_QUESTIONS = [
  // Every question asks about a feature that the published work on personal colour analysis uses:
  // undertone (Jackson, 1987), skin, hair and eye colour (Stacchio et al., 2025; Hong and Kim, 2019;
  // Alyoubi et al., 2025), wrist vein undertone (Alyoubi et al., 2025), contrast and vividness (Dinh, 2026).
  {
    feature: "Overall colouring",
    imgKey: "q1",
    source: "Jackson (1987)",
    prompt: "Which best describes your natural coloring?",
    options: [
      { label: "Warm golden undertones, hair lightens in the sun", season: "spring" },
      { label: "Cool pink or blue undertones, hair stays fairly light", season: "summer" },
      { label: "Warm golden-olive undertones, rich deep hair color", season: "autumn" },
      { label: "Cool undertones, high contrast between hair and skin", season: "winter" },
    ],
  },
  {
    feature: "Wrist veins",
    imgKey: "veins",
    source: "Alyoubi et al. (2025)",
    prompt: "Look at the veins on the inside of your wrist in daylight. What colour are they?",
    options: [
      { label: "Mostly blue or purple", season: ["summer", "winter"] },
      { label: "Mostly green or olive", season: ["spring", "autumn"] },
      { label: "A mix of blue and green", season: null },
      { label: "Hard to tell", season: null },
    ],
  },
  {
    feature: "Skin colour",
    imgKey: "skin",
    source: "Stacchio et al. (2025); Hong and Kim (2019)",
    prompt: "Which best describes your skin colour?",
    options: [
      { label: "Fair or light with a golden or peachy tone", season: "spring" },
      { label: "Fair or light with a pink or rosy tone", season: "summer" },
      { label: "Medium to deep with a golden, olive or bronze tone", season: "autumn" },
      { label: "Fair to very deep with a cool, blue-based tone", season: "winter" },
    ],
  },
  {
    feature: "Natural hair colour",
    imgKey: "hair",
    source: "Stacchio et al. (2025); Hong and Kim (2019)",
    prompt: "What is your natural hair colour, before any dye?",
    options: [
      { label: "Golden blonde, strawberry blonde or light warm brown", season: "spring" },
      { label: "Ash blonde, light ash brown or soft mid brown", season: "summer" },
      { label: "Red, copper, auburn, chestnut or warm dark brown", season: "autumn" },
      { label: "Black, espresso or cool dark brown", season: "winter" },
    ],
  },
  {
    feature: "Eye colour",
    imgKey: "eyes",
    source: "Stacchio et al. (2025); Alyoubi et al. (2025)",
    prompt: "Which best describes your eyes?",
    options: [
      { label: "Light and warm: golden green, turquoise, hazel or light warm brown", season: "spring" },
      { label: "Soft and cool: soft blue, grey, blue-green or soft hazel", season: "summer" },
      { label: "Deep and warm: amber, olive green or rich warm brown", season: "autumn" },
      { label: "Very dark brown, black-brown, icy blue or bright emerald", season: "winter" },
    ],
  },
  {
    feature: "Contrast",
    imgKey: "contrast",
    source: "Dinh (2026)",
    prompt: "How strongly do your skin, hair and eyes stand out against each other?",
    options: [
      { label: "Low contrast, everything is close in lightness and blended", season: ["summer", "autumn"] },
      { label: "Medium contrast", season: null },
      { label: "High contrast, for example dark hair against light skin", season: ["winter", "spring"] },
      { label: "Not sure", season: null },
    ],
  },
  {
    feature: "Vividness",
    imgKey: "vivid",
    source: "Dinh (2026)",
    prompt: "Do your features look clear and bright, or soft and muted?",
    options: [
      { label: "Clear and bright, with sharp, fresh features", season: ["spring", "winter"] },
      { label: "Soft and muted, with gentle, blended features", season: ["summer", "autumn"] },
      { label: "A bit of both", season: null },
      { label: "Not sure", season: null },
    ],
  },
];

// Convert an answer into points per season.
function pointsFor(answer) {
  if (!answer) return {};
  const list = Array.isArray(answer) ? answer : [answer];
  const out = {};
  list.forEach((k) => { out[k] = (out[k] || 0) + 1 / list.length; });
  return out;
}

export function tallySeason(answers) {
  const tally = {};
  let total = 0;
  answers.forEach((a) => {
    const pts = pointsFor(a);
    const keys = Object.keys(pts);
    if (!keys.length) return;
    total += 1;
    keys.forEach((k) => { tally[k] = (tally[k] || 0) + pts[k]; });
  });
  let keys = Object.keys(tally);
  if (!keys.length) { tally.spring = 0; keys = ["spring"]; }
  const maxScore = Math.max(...keys.map((k) => tally[k]));
  const winners = keys.filter((k) => Math.abs(tally[k] - maxScore) < 1e-9);
  const winnerKey = winners[0];
  // Axis percentages: share of the points that fall on each side of each axis.
  const sum = keys.reduce((n, k) => n + tally[k], 0) || 1;
  const axes = {};
  ["undertone", "depth", "chroma"].forEach((axis) => {
    const side = {};
    keys.forEach((k) => { const v = SEASON_AXES[k][axis]; side[v] = (side[v] || 0) + tally[k]; });
    axes[axis] = Object.fromEntries(Object.entries(side).map(([v, n]) => [v, Math.round((n / sum) * 100)]));
  });
  return {
    key: winnerKey,
    tied: winners.length > 1 ? winners : [],
    tally,
    score: Math.round(maxScore * 10) / 10,
    total,
    axes,
    ...SEASON_TYPES[winnerKey],
  };
}

// One line per question: what the person answered and which season(s) it points to.
export function seasonBreakdown(options) {
  return options.map((o, i) => ({
    feature: SEASON_QUESTIONS[i].feature,
    source: SEASON_QUESTIONS[i].source,
    label: o.label,
    seasons: o.season ? (Array.isArray(o.season) ? o.season : [o.season]).map((k) => SEASON_TYPES[k].name) : [],
  }));
}
