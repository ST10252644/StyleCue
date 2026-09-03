// 12 questions x 4 options. Every one of the 16 style categories appears
// in exactly 3 questions (up from 2 in the original 8-question version),
// and never twice in the same question — so coverage stays even and
// results are more finely differentiated. Questions go beyond clothing
// into lifestyle signals (room aesthetic, ideal Saturday, music), in
// line with the report's definition of style personality as identity
// and self-expression, not just clothing choice.

export const QUIZ_QUESTIONS = [
    {
        prompt: "Pick a going-out outfit",
        options: [
            { label: "Sequin dress and heels", style: "glam" },
            { label: "Studded leather jacket", style: "punk" },
            { label: "Oversized hoodie and cargo pants", style: "streetwear" },
            { label: "Tailored blazer set", style: "classic" },
        ],
    },
    {
        prompt: "Choose a color palette",
        options: [
            { label: "Tonal neutrals — black, white, beige", style: "parisian" },
            { label: "Earth tones and warm terracotta", style: "bohemian" },
            { label: "Sun-bleached whites and pastels", style: "coastal" },
            { label: "Muted, faded plaid", style: "grunge" },
        ],
    },
    {
        prompt: "Pick a pair of shoes",
        options: [
            { label: "Clean minimal sneakers", style: "minimalist" },
            { label: "Classic penny loafers", style: "preppy" },
            { label: "Retro platform heels", style: "vintage" },
            { label: "Performance running sneakers", style: "sporty" },
        ],
    },
    {
        prompt: "Pick a weekend outfit",
        options: [
            { label: "Puff-sleeve prairie dress", style: "cottagecore" },
            { label: "Clashing prints, mismatched layers", style: "artsy" },
            { label: "Flowy sundress", style: "romantic" },
            { label: "Asymmetric-hem top", style: "edgy" },
        ],
    },
    {
        prompt: "Pick a jacket",
        options: [
            { label: "Trench coat", style: "classic" },
            { label: "Studded leather jacket", style: "punk" },
            { label: "Logo puffer jacket", style: "streetwear" },
            { label: "Suede fringe jacket", style: "bohemian" },
        ],
    },
    {
        prompt: "Choose an accessory",
        options: [
            { label: "Statement layered jewelry", style: "glam" },
            { label: "One delicate pendant, nothing else", style: "minimalist" },
            { label: "Collegiate pin or crest detail", style: "preppy" },
            { label: "Silk neck scarf", style: "parisian" },
        ],
    },
    {
        prompt: "Pick a pattern",
        options: [
            { label: "Faded flannel plaid", style: "grunge" },
            { label: "Retro geometric print", style: "vintage" },
            { label: "Gingham florals", style: "cottagecore" },
            { label: "Clashing mixed prints", style: "artsy" },
        ],
    },
    {
        prompt: "Choose a vacation look",
        options: [
            { label: "Linen set and sandals", style: "coastal" },
            { label: "Activewear set", style: "sporty" },
            { label: "Flowy resort dress", style: "romantic" },
            { label: "All-black travel outfit", style: "edgy" },
        ],
    },
    {
        prompt: "Pick your ideal Saturday morning",
        options: [
            { label: "Clean apartment, oat milk latte, a good book", style: "minimalist" },
            { label: "Thrift store hunting for band tees and boots", style: "punk" },
            { label: "Farmers market, fresh flowers, a floaty dress", style: "romantic" },
            { label: "Beach walk, linen shirt, salt in your hair", style: "coastal" },
        ],
    },
    {
        prompt: "Pick a phone lock screen aesthetic",
        options: [
            { label: "A tidy grid, neutral tones, nothing flashy", style: "classic" },
            { label: "A sunset photo with warm, earthy filters", style: "bohemian" },
            { label: "A workout playlist cover or running stats", style: "sporty" },
            { label: "A gallery photo or an unusual piece of art", style: "artsy" },
        ],
    },
    {
        prompt: "Pick a room you'd want to live in",
        options: [
            { label: "Tartan throws, brass details, a fireplace", style: "preppy" },
            { label: "Concrete floors, sneaker wall, neon sign", style: "streetwear" },
            { label: "Dried flowers, gingham curtains, a window seat", style: "cottagecore" },
            { label: "Black walls, industrial lighting, leather sofa", style: "edgy" },
        ],
    },
    {
        prompt: "Pick a soundtrack for getting ready",
        options: [
            { label: "French pop, something effortlessly cool", style: "parisian" },
            { label: "90s alt-rock, a little messy and loud", style: "grunge" },
            { label: "Old soul or motown, something with character", style: "vintage" },
            { label: "Pop anthems, the kind you lip-sync to", style: "glam" },
        ],
    },
];