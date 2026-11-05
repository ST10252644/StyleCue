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
  },
};

export const SEASON_QUESTIONS = [
  {
    prompt: "Which best describes your natural coloring?",
    options: [
      { label: "Warm golden undertones, hair lightens in the sun", season: "spring" },
      { label: "Cool pink or blue undertones, hair stays fairly light", season: "summer" },
      { label: "Warm golden-olive undertones, rich deep hair color", season: "autumn" },
      { label: "Cool undertones, high contrast between hair and skin", season: "winter" },
    ],
  },
  {
    prompt: "Pick a metal you gravitate toward",
    options: [
      { label: "Gold, warm and bright", season: "spring" },
      { label: "Silver, soft and cool", season: "summer" },
      { label: "Bronze or antique gold", season: "autumn" },
      { label: "Silver or platinum, high shine", season: "winter" },
    ],
  },
  {
    prompt: "Pick a lipstick shade",
    options: [
      { label: "Coral or peach", season: "spring" },
      { label: "Rose or mauve", season: "summer" },
      { label: "Brick red or terracotta", season: "autumn" },
      { label: "Blue-red or berry", season: "winter" },
    ],
  },
  {
    prompt: "Pick your ideal color palette to wear",
    options: [
      { label: "Bright, clear, warm colors", season: "spring" },
      { label: "Soft, muted, cool colors", season: "summer" },
      { label: "Rich, earthy, warm colors", season: "autumn" },
      { label: "Bold, deep, cool colors", season: "winter" },
    ],
  },
];

export function tallySeason(answers) {
  const tally = {};
  answers.forEach((key) => {
    tally[key] = (tally[key] || 0) + 1;
  });
  const maxScore = Math.max(...Object.values(tally));
  const winners = Object.keys(tally).filter((k) => tally[k] === maxScore);
  const winnerKey = winners[0];
  return {
    key: winnerKey,
    tied: winners.length > 1 ? winners : [],
    tally,
    score: maxScore,
    total: answers.length,
    ...SEASON_TYPES[winnerKey],
  };
}
