// Generated: photos for the researched colour season quiz and result pages.
export const SEASON_DEEP = {
 "spring": [
  {
   "src": "images/seasons/spring/skin_1.jpg",
   "label": "Skin tone 1"
  },
  {
   "src": "images/seasons/spring/skin_2.jpg",
   "label": "Skin tone 2"
  },
  {
   "src": "images/seasons/spring/skin_3.jpg",
   "label": "Skin tone 3"
  },
  {
   "src": "images/seasons/spring/hair_1.jpg",
   "label": "Hair colour 1"
  },
  {
   "src": "images/seasons/spring/hair_2.jpg",
   "label": "Hair colour 2"
  },
  {
   "src": "images/seasons/spring/eyes_1.jpg",
   "label": "Eyes 1"
  },
  {
   "src": "images/seasons/spring/eyes_2.jpg",
   "label": "Eyes 2"
  },
  {
   "src": "images/seasons/spring/contrast.jpg",
   "label": "Contrast"
  }
 ],
 "summer": [
  {
   "src": "images/seasons/summer/skin_1.jpg",
   "label": "Skin tone 1"
  },
  {
   "src": "images/seasons/summer/skin_2.jpg",
   "label": "Skin tone 2"
  },
  {
   "src": "images/seasons/summer/skin_3.jpg",
   "label": "Skin tone 3"
  },
  {
   "src": "images/seasons/summer/hair_1.jpg",
   "label": "Hair colour 1"
  },
  {
   "src": "images/seasons/summer/hair_2.jpg",
   "label": "Hair colour 2"
  },
  {
   "src": "images/seasons/summer/eyes_1.jpg",
   "label": "Eyes 1"
  },
  {
   "src": "images/seasons/summer/eyes_2.jpg",
   "label": "Eyes 2"
  },
  {
   "src": "images/seasons/summer/contrast.jpg",
   "label": "Contrast"
  }
 ],
 "autumn": [
  {
   "src": "images/seasons/autumn/skin_1.jpg",
   "label": "Skin tone 1"
  },
  {
   "src": "images/seasons/autumn/skin_2.jpg",
   "label": "Skin tone 2"
  },
  {
   "src": "images/seasons/autumn/skin_3.jpg",
   "label": "Skin tone 3"
  },
  {
   "src": "images/seasons/autumn/hair_1.jpg",
   "label": "Hair colour 1"
  },
  {
   "src": "images/seasons/autumn/hair_2.jpg",
   "label": "Hair colour 2"
  },
  {
   "src": "images/seasons/autumn/eyes_1.jpg",
   "label": "Eyes 1"
  },
  {
   "src": "images/seasons/autumn/eyes_2.jpg",
   "label": "Eyes 2"
  },
  {
   "src": "images/seasons/autumn/contrast.jpg",
   "label": "Contrast"
  }
 ],
 "winter": [
  {
   "src": "images/seasons/winter/skin_1.jpg",
   "label": "Skin tone 1"
  },
  {
   "src": "images/seasons/winter/skin_2.jpg",
   "label": "Skin tone 2"
  },
  {
   "src": "images/seasons/winter/skin_3.jpg",
   "label": "Skin tone 3"
  },
  {
   "src": "images/seasons/winter/hair_1.jpg",
   "label": "Hair colour 1"
  },
  {
   "src": "images/seasons/winter/hair_2.jpg",
   "label": "Hair colour 2"
  },
  {
   "src": "images/seasons/winter/eyes_1.jpg",
   "label": "Eyes 1"
  },
  {
   "src": "images/seasons/winter/eyes_2.jpg",
   "label": "Eyes 2"
  },
  {
   "src": "images/seasons/winter/contrast.jpg",
   "label": "Contrast"
  }
 ]
};
export const SEASON_TESTS = {
 "veinsHowto": "images/seasons/tests/test_veins_howto.jpg",
 "veinsCompare": "images/seasons/tests/test_veins_blue_vs_green.jpg",
 "daylightFace": "images/seasons/tests/test_daylight_face.jpg"
};

// A short photo hint shown above the answers of a question, so the user knows how to check herself.
export function seasonHint(imgKey) {
  const row = (imgs, text) =>
    `<div class="hint-row season-hint">${imgs.map((s) => `<img class="hint-photo" src="${s}" alt="" decoding="async" />`).join("")}<span>${text}</span></div>`;
  if (imgKey === "veins") return row([SEASON_TESTS.veinsHowto, SEASON_TESTS.veinsCompare], "Hold your wrist out in daylight. Blue or purple veins point to a cool undertone, and green veins point to a warm one.");
  if (["skin", "hair", "eyes", "contrast", "vivid"].includes(imgKey)) return row([SEASON_TESTS.daylightFace], "Check this in daylight beside a window, with no make-up or filter, so the colours are true.");
  return "";
}
