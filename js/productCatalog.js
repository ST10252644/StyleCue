// Illustrative sample product catalogue for the rule-based, attribute-overlap
// recommendation engine described in the research report (Section 3.5 /
// 4.2). Items 1-5 are the exact items from the report's worked example
// (Pear + Romantic), with attribute tags matching that example precisely,
// so the documented worked-example table can be reproduced exactly by
// running the live app with the same inputs (shoulder 92cm, waist 78cm,
// hip 108cm; style quiz answered to land on Romantic).
//
// The remaining items extend coverage across the other body shapes and
// the 16 style categories, so most profile combinations return at least
// a few non-zero matches. This remains a small, clearly-labelled
// illustrative catalogue, not a real retail dataset, consistent with
// the report's stated scope and resource constraints.

export const PRODUCT_CATALOG = [
  // ---- Exact items from the report's worked example (do not edit tags) ----
  { id: "p01", name: "Ruffle-Sleeve Blouse", category: "Top", attributes: ["ruffle", "soft-fabric", "v-neck"] },
  { id: "p02", name: "Wrap Midi Dress", category: "Dress", attributes: ["v-neck", "soft-fabric"] },
  { id: "p03", name: "Empire Waist Sundress", category: "Dress", attributes: ["flowy", "soft-fabric"] },
  { id: "p04", name: "Layered Boho Maxi", category: "Dress", attributes: ["flowy", "wide-leg"] },
  { id: "p05", name: "Soft V-Neck Wrap Top", category: "Top", attributes: ["v-neck", "soft-fabric"] },

  // ---- Classic ----
  { id: "p06", name: "Tailored Blazer", category: "Outerwear", attributes: ["tailored", "structured", "neutral-tone"] },
  { id: "p07", name: "Straight-Leg Trousers", category: "Bottom", attributes: ["straight-leg", "tailored", "neutral-tone"] },

  // ---- Edgy / Punk ----
  { id: "p08", name: "Leather Biker Jacket", category: "Outerwear", attributes: ["leather", "asymmetric", "dark-tone"] },
  { id: "p09", name: "Studded Combat Boots", category: "Shoes", attributes: ["hardware-detail", "dark-tone"] },
  { id: "p10", name: "Studded Leather Skirt", category: "Bottom", attributes: ["studded", "dark-tone", "hardware-detail"] },

  // ---- Minimalist ----
  { id: "p11", name: "Clean Crew Tee", category: "Top", attributes: ["clean-line", "monochrome", "unembellished"] },
  { id: "p12", name: "Straight Trouser Set", category: "Bottom", attributes: ["straight-cut", "capsule-basic", "monochrome"] },

  // ---- Preppy ----
  { id: "p13", name: "Pleated Tennis Skirt", category: "Bottom", attributes: ["pleated", "collegiate", "striped"] },
  { id: "p14", name: "Cable-Knit Sweater", category: "Top", attributes: ["pique-knit", "collegiate"] },

  // ---- Glam ----
  { id: "p15", name: "Sequin Slip Dress", category: "Dress", attributes: ["sequin", "metallic", "bodycon"] },
  { id: "p16", name: "Statement Metallic Heels", category: "Shoes", attributes: ["statement-heel", "metallic"] },

  // ---- Streetwear ----
  { id: "p17", name: "Oversized Graphic Hoodie", category: "Top", attributes: ["oversized", "graphic-print", "hoodie"] },
  { id: "p18", name: "Cargo Utility Pants", category: "Bottom", attributes: ["cargo", "oversized"] },

  // ---- Grunge ----
  { id: "p19", name: "Distressed Flannel Shirt", category: "Top", attributes: ["distressed", "flannel", "layered"] },

  // ---- Artsy / Eclectic ----
  { id: "p20", name: "Mismatched Print Set", category: "Dress", attributes: ["mixed-print", "color-block", "unconventional-cut"] },

  // ---- Sporty / Athleisure ----
  { id: "p21", name: "Performance Track Jacket", category: "Outerwear", attributes: ["track-style", "zip-front", "performance-fabric"] },

  // ---- Vintage / Retro ----
  { id: "p22", name: "High-Waisted Retro Trousers", category: "Bottom", attributes: ["high-waisted", "retro-print"] },

  // ---- Parisian Chic ----
  { id: "p23", name: "Silk Neck Scarf", category: "Accessory", attributes: ["tonal-neutral", "effortless-drape"] },

  // ---- Coastal / Resort ----
  { id: "p24", name: "Linen Resort Set", category: "Dress", attributes: ["linen", "breezy", "sun-faded"] },

  // ---- Cottagecore ----
  { id: "p25", name: "Gingham Prairie Dress", category: "Dress", attributes: ["gingham", "puff-sleeve", "floral-print"] },

  // ---- Additional body-shape coverage (Hourglass, Apple, Inverted Triangle, Rectangle) ----
  { id: "p26", name: "Belted Wrap Coat", category: "Outerwear", attributes: ["belted", "fitted-waist"] },
  { id: "p27", name: "Empire-Waist Blouse", category: "Top", attributes: ["empire-waist", "v-neck"] },
  { id: "p28", name: "Wide-Leg Palazzo Pants", category: "Bottom", attributes: ["wide-leg", "flared"] },
  { id: "p29", name: "Peplum Top", category: "Top", attributes: ["peplum", "belted"] },

  // ---- Version 2 additions: wider coverage of all 16 styles and 5 body shapes ----
  { id: "p30", name: "Button-Front Oxford Shirt", category: "Top", attributes: ["button-front", "tailored", "neutral-tone"] },
  { id: "p31", name: "Structured Camel Coat", category: "Outerwear", attributes: ["structured", "neutral-tone", "tailored"] },
  { id: "p32", name: "Asymmetric Zip Skirt", category: "Bottom", attributes: ["asymmetric", "dark-tone", "hardware-detail"] },
  { id: "p33", name: "Leather Moto Vest", category: "Outerwear", attributes: ["leather", "dark-tone"] },
  { id: "p34", name: "Monochrome Knit Set", category: "Dress", attributes: ["monochrome", "clean-line", "capsule-basic"] },
  { id: "p35", name: "Unembellished Shift Dress", category: "Dress", attributes: ["unembellished", "straight-cut", "clean-line"] },
  { id: "p36", name: "Fringe Suede Vest", category: "Outerwear", attributes: ["fringe", "layered", "printed"] },
  { id: "p37", name: "Printed Kimono Wrap", category: "Outerwear", attributes: ["printed", "layered"] },
  { id: "p38", name: "Plaid Pleated Skirt", category: "Bottom", attributes: ["plaid", "collegiate", "pleated"] },
  { id: "p39", name: "Polo-Collar Knit Dress", category: "Dress", attributes: ["polo-collar", "pique-knit"] },
  { id: "p40", name: "Penny Loafers", category: "Shoes", attributes: ["loafer-style", "collegiate"] },
  { id: "p41", name: "Satin Cami Top", category: "Top", attributes: ["satin", "statement-jewelry"] },
  { id: "p42", name: "Metallic Bodycon Dress", category: "Dress", attributes: ["bodycon", "metallic", "sequin"] },
  { id: "p43", name: "Chunky White Sneakers", category: "Shoes", attributes: ["sneaker-style", "oversized"] },
  { id: "p44", name: "Oversized Bomber Jacket", category: "Outerwear", attributes: ["oversized", "graphic-print"] },
  { id: "p45", name: "Faded Band Tee", category: "Top", attributes: ["faded-tone", "distressed", "graphic-print"] },
  { id: "p46", name: "Combat Boots", category: "Shoes", attributes: ["combat-boot-style", "distressed"] },
  { id: "p47", name: "Colour-Block Knit Top", category: "Top", attributes: ["color-block", "textural-mix"] },
  { id: "p48", name: "Statement-Print Trousers", category: "Bottom", attributes: ["statement-print", "unconventional-cut", "mixed-print"] },
  { id: "p49", name: "Stretch Training Leggings", category: "Bottom", attributes: ["stretch-fabric", "performance-fabric"] },
  { id: "p50", name: "Zip-Front Running Vest", category: "Outerwear", attributes: ["zip-front", "track-style", "sneaker-style"] },
  { id: "p51", name: "Tea-Length Swing Dress", category: "Dress", attributes: ["tea-length", "era-silhouette", "retro-print"] },
  { id: "p52", name: "Thrifted Denim Jacket", category: "Outerwear", attributes: ["thrifted-look", "high-waisted"] },
  { id: "p53", name: "Classic Trench Coat", category: "Outerwear", attributes: ["trench", "tonal-neutral", "tailored"] },
  { id: "p54", name: "Breton Striped Top", category: "Top", attributes: ["striped", "effortless-drape"] },
  { id: "p55", name: "Fishnet Layering Top", category: "Top", attributes: ["fishnet", "dark-tone", "DIY-edge"] },
  { id: "p56", name: "Platform Boots", category: "Shoes", attributes: ["platform-boot-style", "studded"] },
  { id: "p57", name: "Straw Beach Tote", category: "Accessory", attributes: ["straw-texture", "breezy"] },
  { id: "p58", name: "Resort Linen Shirt Dress", category: "Dress", attributes: ["resort-cut", "linen", "sun-faded"] },
  { id: "p59", name: "Lace-Trim Prairie Blouse", category: "Top", attributes: ["lace-trim", "prairie-cut", "puff-sleeve"] },
  { id: "p60", name: "Floral Gingham Skirt", category: "Bottom", attributes: ["floral-print", "gingham"] },
  { id: "p61", name: "Wrap-Front Jersey Dress", category: "Dress", attributes: ["wrap-style", "fitted-waist"] },
  { id: "p62", name: "Soft Scoop-Neck Top", category: "Top", attributes: ["soft-neckline", "drape"] },
  { id: "p63", name: "Ruched Hip-Detail Skirt", category: "Bottom", attributes: ["hip-detail", "flared"] },
  { id: "p64", name: "Draped Cowl Tunic", category: "Top", attributes: ["drape", "empire-waist"] },
];
