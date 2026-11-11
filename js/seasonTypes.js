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
    features: {"skin": "Light to medium skin with a warm, golden or peachy undertone, often with freckles or a warm flush.", "hair": "Golden blonde, strawberry blonde or light warm brown.", "eyes": "Light warm eyes such as golden green, turquoise, hazel or light warm brown.", "contrast": "Low to medium contrast. The overall look is fresh and bright.", "veins": "Veins tend to look green. Gold jewellery looks best."},
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
    features: {"skin": "Fair to medium skin with a cool pink or neutral-cool undertone that can burn easily.", "hair": "Ash blonde, light ash brown or soft mid brown, with no golden or red shine.", "eyes": "Soft blue, grey, blue-green, soft hazel or soft brown eyes.", "contrast": "Low contrast. Skin, hair and eyes blend softly together.", "veins": "Veins tend to look blue or purple. Silver jewellery looks best."},
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
    features: {"skin": "Medium to deep skin with a warm golden, olive or bronze undertone that tans easily.", "hair": "Red, copper, auburn, chestnut or warm dark brown.", "eyes": "Deep warm brown, amber, olive green or warm hazel eyes.", "contrast": "Medium contrast. The overall look is rich, earthy and warm.", "veins": "Veins tend to look green or olive. Gold or bronze jewellery looks best."},
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
    features: {"skin": "Fair to very deep skin with a cool or blue-based undertone, often with a clear, even surface.", "hair": "Black, espresso or cool dark brown, or very light ash blonde with strong contrast.", "eyes": "Very dark brown, black-brown, icy blue, grey or bright emerald eyes.", "contrast": "High contrast. Dark hair against light skin, or very distinct features.", "veins": "Veins tend to look blue or purple. Silver or platinum jewellery looks best."},
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
  {
    feature: "Overall colouring",
    prompt: "Which best describes your natural coloring?",
    options: [
      { label: "Warm golden undertones, hair lightens in the sun", season: "spring" },
      { label: "Cool pink or blue undertones, hair stays fairly light", season: "summer" },
      { label: "Warm golden-olive undertones, rich deep hair color", season: "autumn" },
      { label: "Cool undertones, high contrast between hair and skin", season: "winter" },
    ],
  },
  {
    feature: "Metal preference",
    prompt: "Pick a metal you gravitate toward",
    options: [
      { label: "Gold, warm and bright", season: "spring" },
      { label: "Silver, soft and cool", season: "summer" },
      { label: "Bronze or antique gold", season: "autumn" },
      { label: "Silver or platinum, high shine", season: "winter" },
    ],
  },
  {
    feature: "Lipstick shade",
    prompt: "Pick a lipstick shade",
    options: [
      { label: "Coral or peach", season: "spring" },
      { label: "Rose or mauve", season: "summer" },
      { label: "Brick red or terracotta", season: "autumn" },
      { label: "Blue-red or berry", season: "winter" },
    ],
  },
  {
    feature: "Preferred palette",
    prompt: "Pick your ideal color palette to wear",
    options: [
      { label: "Bright, clear, warm colors", season: "spring" },
      { label: "Soft, muted, cool colors", season: "summer" },
      { label: "Rich, earthy, warm colors", season: "autumn" },
      { label: "Bold, deep, cool colors", season: "winter" },
    ],
  },
  {
    feature: "Veins",
    prompt: "Look at the veins on the inside of your wrist in daylight. What colour are they?",
    options: [
      { label: "Mostly blue or purple", season: ["summer", "winter"] },
      { label: "Mostly green or olive", season: ["spring", "autumn"] },
      { label: "Blue-green, a mix of both", season: null },
      { label: "Hard to tell", season: null },
    ],
  },
  {
    feature: "Jewellery test",
    prompt: "Hold gold and silver jewellery against your face. Which one makes your skin look healthier?",
    options: [
      { label: "Gold looks best", season: ["spring", "autumn"] },
      { label: "Silver looks best", season: ["summer", "winter"] },
      { label: "Rose gold looks best", season: "summer" },
      { label: "Both look fine", season: null },
    ],
  },
  {
    feature: "White test",
    prompt: "Hold a stark white sheet and a cream sheet under your chin. Which one suits your skin?",
    options: [
      { label: "Stark, bright white", season: "winter" },
      { label: "Soft white with a hint of blue or grey", season: "summer" },
      { label: "Warm ivory", season: "spring" },
      { label: "Cream or oatmeal", season: "autumn" },
    ],
  },
  {
    feature: "Natural hair colour",
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
    prompt: "Which best describes your eyes?",
    options: [
      { label: "Light and warm: golden green, turquoise, hazel or light warm brown", season: "spring" },
      { label: "Soft and cool: soft blue, grey, blue-green or soft hazel", season: "summer" },
      { label: "Deep and warm: amber, olive green or rich warm brown", season: "autumn" },
      { label: "Very dark brown, black-brown, icy blue or bright emerald", season: "winter" },
    ],
  },
  {
    feature: "Skin tone and sun",
    prompt: "Which best describes your skin tone and how it reacts to the sun?",
    options: [
      { label: "Fair or light with a golden or peachy tone, burns easily, may freckle", season: "spring" },
      { label: "Fair or light with a pink tone, burns first and then tans a little", season: "summer" },
      { label: "Medium to deep with a golden or olive tone, tans easily", season: "autumn" },
      { label: "Porcelain or very deep with a cool tone, burns or tans very little", season: "winter" },
    ],
  },
  {
    feature: "Contrast",
    prompt: "How strongly do your skin, hair and eyes stand out against each other?",
    options: [
      { label: "Low contrast, everything is light and blended", season: "summer" },
      { label: "Low to medium, fresh and warm", season: "spring" },
      { label: "Medium, everything looks rich and deep", season: "autumn" },
      { label: "High, dark hair against light skin or very distinct features", season: "winter" },
    ],
  },
  {
    feature: "Black test",
    prompt: "How do you look in a black top held near your face?",
    options: [
      { label: "Striking, black makes my features stand out", season: "winter" },
      { label: "Too heavy, soft navy or charcoal looks better", season: "summer" },
      { label: "Washed out or tired, dark brown looks better", season: ["spring", "autumn"] },
      { label: "Fine, I see no big difference", season: null },
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
    label: o.label,
    seasons: o.season ? (Array.isArray(o.season) ? o.season : [o.season]).map((k) => SEASON_TYPES[k].name) : [],
  }));
}
