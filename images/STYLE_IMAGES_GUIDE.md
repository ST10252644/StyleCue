# Style images, what to search and where to save them

**48 images total: 3 per style × 16 styles.**

For each style you need:
- **hero**, one full outfit photo that represents the style (used in the quiz option thumbnails AND as the big image on the reveal page)
- **palette**, a flat-lay or color-palette-style image (fabric swatches, folded clothes, or a moodboard shot showing the color story)
- **detail**, a close-up on an accessory, texture, or signature detail

Save each as a `.jpg` at the path shown, replacing the placeholder. Folders already exist in `images/styles/`.

| Style | Search: hero | Search: palette | Search: detail |
|---|---|---|---|
| Classic | `classic style outfit navy blazer` | `classic neutral color palette flatlay` | `leather loafers watch classic style` |
| Edgy | `edgy outfit leather jacket black` | `edgy black outfit flatlay` | `combat boots studded belt edgy` |
| Minimalist | `minimalist outfit monochrome` | `minimalist capsule wardrobe flatlay` | `minimalist white sneakers clean bag` |
| Romantic | `romantic style outfit wrap dress` | `romantic pastel blush flatlay` | `lace ruffle detail romantic fashion` |
| Bohemian | `boho outfit maxi skirt fringe` | `bohemian earth tone flatlay` | `layered jewelry fringe boho detail` |
| Preppy | `preppy outfit polo blazer` | `preppy navy plaid flatlay` | `penny loafers crest pin preppy` |
| Glam | `glam outfit sequin dress heels` | `glam metallic gold flatlay` | `statement jewelry glam heels detail` |
| Streetwear | `streetwear outfit hoodie sneakers` | `streetwear black white flatlay` | `sneakers streetwear detail closeup` |
| Grunge | `grunge outfit flannel ripped jeans` | `grunge plaid faded flatlay` | `combat boots grunge distressed denim` |
| Artsy / Eclectic | `eclectic outfit mismatched print` | `artsy color block flatlay` | `handmade jewelry artsy accessory` |
| Sporty / Athleisure | `athleisure outfit leggings sneakers` | `sporty color block flatlay` | `performance sneakers sporty detail` |
| Vintage / Retro | `70s vintage outfit retro` | `retro vintage color palette flatlay` | `cat eye sunglasses vintage accessory` |
| Parisian Chic | `parisian chic outfit trench` | `parisian neutral beige flatlay` | `silk scarf parisian style detail` |
| Punk / Gothic | `punk outfit studded leather` | `punk black red flatlay` | `chain spike punk accessory detail` |
| Coastal / Resort | `coastal resort outfit linen` | `coastal sun bleached flatlay` | `straw bag sandals coastal detail` |
| Cottagecore | `cottagecore outfit prairie dress` | `cottagecore floral gingham flatlay` | `gingham lace cottagecore detail` |

## Where each goes

```
images/styles/<style-key>/hero.jpg
images/styles/<style-key>/palette.jpg
images/styles/<style-key>/detail.jpg
```

Style keys (folder names, already created): `classic`, `edgy`, `minimalist`, `romantic`, `bohemian`, `preppy`, `glam`, `streetwear`, `grunge`, `artsy`, `sporty`, `vintage`, `parisian`, `punk`, `coastal`, `cottagecore`.

Example: the Classic hero image goes to `images/styles/classic/hero.jpg`.

## Also needed: 5 body-type images (separate, smaller task)

From the earlier body-shape calculator, still outstanding if you haven't done these yet:

| Body type | Search | Save as |
|---|---|---|
| Hourglass | `hourglass body shape outfit` | `images/hourglass.jpg` |
| Pear | `pear body shape outfit` | `images/pear.jpg` |
| Inverted Triangle | `inverted triangle body shape outfit` | `images/inverted-triangle.jpg` |
| Rectangle | `rectangle body shape outfit` | `images/rectangle.jpg` |
| Apple | `apple body shape outfit` | `images/apple.jpg` |

**Grand total across both: 53 images.**

No code changes needed once the files are in place, `styleTypes.js` already points at these exact paths, so the images will just appear once saved.
