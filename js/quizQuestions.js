// 12 questions x 8 options. Every one of the 16 style categories appears
// in exactly 6 questions and never twice in the same question, so coverage stays even and
// results are more finely differentiated. Questions go beyond clothing
// into lifestyle signals (room aesthetic, ideal Saturday, music), in
// line with the report's definition of style personality as identity
// and self-expression, not just clothing choice.

export const QUIZ_QUESTIONS = [
  {
    prompt: "Pick a going-out outfit",
    options: [
      { label: "Sequin dress and heels", style: "glam" },
      { label: "Trench coat over a slim black dress", style: "parisian" },
      { label: "Studded leather jacket", style: "punk" },
      { label: "Fringe vest, flared jeans and boots", style: "bohemian" },
      { label: "Oversized hoodie and cargo pants", style: "streetwear" },
      { label: "White linen jumpsuit and sandals", style: "coastal" },
      { label: "Tailored blazer set", style: "classic" },
      { label: "Ripped tights, flannel and boots", style: "grunge" },
    ],
  },
  {
    prompt: "Choose a color palette",
    options: [
      { label: "Tonal neutrals, black, white, beige", style: "parisian" },
      { label: "Bright white, navy and neon accents", style: "sporty" },
      { label: "Earth tones and warm terracotta", style: "bohemian" },
      { label: "Sage green, cream and soft yellow", style: "cottagecore" },
      { label: "Sun-bleached whites and pastels", style: "coastal" },
      { label: "Bold clashing primary colours", style: "artsy" },
      { label: "Muted, faded plaid", style: "grunge" },
      { label: "Blush pink, ivory and soft lavender", style: "romantic" },
    ],
  },
  {
    prompt: "Pick a pair of shoes",
    options: [
      { label: "Clean minimal sneakers", style: "minimalist" },
      { label: "Sharp pointed boots", style: "edgy" },
      { label: "Classic penny loafers", style: "preppy" },
      { label: "Metallic strappy heels", style: "glam" },
      { label: "Retro platform heels", style: "vintage" },
      { label: "Chunky studded combat boots", style: "punk" },
      { label: "Performance running sneakers", style: "sporty" },
      { label: "High-top sneakers in loud colours", style: "streetwear" },
    ],
  },
  {
    prompt: "Pick a weekend outfit",
    options: [
      { label: "Puff-sleeve prairie dress", style: "cottagecore" },
      { label: "Cream knit and tailored trousers", style: "classic" },
      { label: "Clashing prints, mismatched layers", style: "artsy" },
      { label: "Plain tee and straight trousers", style: "minimalist" },
      { label: "Flowy sundress", style: "romantic" },
      { label: "Polo shirt and pleated skirt", style: "preppy" },
      { label: "Asymmetric-hem top", style: "edgy" },
      { label: "High-waisted jeans and a retro blouse", style: "vintage" },
    ],
  },
  {
    prompt: "Pick a jacket",
    options: [
      { label: "Trench coat", style: "classic" },
      { label: "Quilted jacket over a floral dress", style: "cottagecore" },
      { label: "Studded leather jacket", style: "punk" },
      { label: "Patchwork or painted denim jacket", style: "artsy" },
      { label: "Logo puffer jacket", style: "streetwear" },
      { label: "Soft cropped cardigan with ruffle trim", style: "romantic" },
      { label: "Suede fringe jacket", style: "bohemian" },
      { label: "Cropped leather biker jacket", style: "edgy" },
    ],
  },
  {
    prompt: "Choose an accessory",
    options: [
      { label: "Statement layered jewelry", style: "glam" },
      { label: "Chain wallet and chunky rings", style: "grunge" },
      { label: "One delicate pendant, nothing else", style: "minimalist" },
      { label: "Cat-eye sunglasses and a scarf headband", style: "vintage" },
      { label: "Collegiate pin or crest detail", style: "preppy" },
      { label: "Sports watch and a visor", style: "sporty" },
      { label: "Silk neck scarf", style: "parisian" },
      { label: "Spiked choker and wristbands", style: "punk" },
    ],
  },
  {
    prompt: "Pick a pattern",
    options: [
      { label: "Faded flannel plaid", style: "grunge" },
      { label: "Bold logo print", style: "streetwear" },
      { label: "Retro geometric print", style: "vintage" },
      { label: "Pinstripes", style: "classic" },
      { label: "Gingham florals", style: "cottagecore" },
      { label: "Breton stripes", style: "parisian" },
      { label: "Clashing mixed prints", style: "artsy" },
      { label: "Paisley and ethnic prints", style: "bohemian" },
    ],
  },
  {
    prompt: "Choose a vacation look",
    options: [
      { label: "Linen set and sandals", style: "coastal" },
      { label: "Sparkly dress and statement sunglasses", style: "glam" },
      { label: "Activewear set", style: "sporty" },
      { label: "Neutral capsule pieces in one bag", style: "minimalist" },
      { label: "Flowy resort dress", style: "romantic" },
      { label: "Boat shoes and a striped knit", style: "preppy" },
      { label: "All-black travel outfit", style: "edgy" },
      { label: "Colourful handmade jewellery and mixed prints", style: "artsy" },
    ],
  },
  {
    prompt: "Pick your ideal Saturday morning",
    options: [
      { label: "Clean apartment, oat milk latte, a good book", style: "minimalist" },
      { label: "Tennis match, then brunch at the club", style: "preppy" },
      { label: "Thrift store hunting for band tees and boots", style: "punk" },
      { label: "Record store and a vintage market", style: "vintage" },
      { label: "Farmers market, fresh flowers, a floaty dress", style: "romantic" },
      { label: "A long run, then a smoothie", style: "sporty" },
      { label: "Beach walk, linen shirt, salt in your hair", style: "coastal" },
      { label: "Baking bread and picking wildflowers", style: "cottagecore" },
    ],
  },
  {
    prompt: "Pick a phone lock screen aesthetic",
    options: [
      { label: "A tidy grid, neutral tones, nothing flashy", style: "classic" },
      { label: "Ocean waves and soft sand tones", style: "coastal" },
      { label: "A sunset photo with warm, earthy filters", style: "bohemian" },
      { label: "A Paris street at dusk", style: "parisian" },
      { label: "A workout playlist cover or running stats", style: "sporty" },
      { label: "A grainy film photo in black and white", style: "grunge" },
      { label: "A gallery photo or an unusual piece of art", style: "artsy" },
      { label: "A plain wallpaper with one small icon", style: "minimalist" },
    ],
  },
  {
    prompt: "Pick a room you'd want to live in",
    options: [
      { label: "Tartan throws, brass details, a fireplace", style: "preppy" },
      { label: "Pastel walls, lace curtains, vases of roses", style: "romantic" },
      { label: "Concrete floors, sneaker wall, neon sign", style: "streetwear" },
      { label: "Mirrored walls, velvet sofa, gold lamps", style: "glam" },
      { label: "Dried flowers, gingham curtains, a window seat", style: "cottagecore" },
      { label: "Graffiti walls, posters, a vinyl player", style: "punk" },
      { label: "Black walls, industrial lighting, leather sofa", style: "edgy" },
      { label: "Cream walls, wooden desk, framed prints", style: "classic" },
    ],
  },
  {
    prompt: "Pick a soundtrack for getting ready",
    options: [
      { label: "French pop, something effortlessly cool", style: "parisian" },
      { label: "Dark synth and alternative beats", style: "edgy" },
      { label: "90s alt-rock, a little messy and loud", style: "grunge" },
      { label: "Hip-hop and trap", style: "streetwear" },
      { label: "Old soul or motown, something with character", style: "vintage" },
      { label: "Folk and acoustic guitar", style: "bohemian" },
      { label: "Pop anthems, the kind you lip-sync to", style: "glam" },
      { label: "Surf rock and reggae", style: "coastal" },
    ],
  },
];
