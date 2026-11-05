/**
 * Draws a shareable "style card" to a canvas and triggers a download
 * (or the native share sheet on mobile, if available).
 * @param {{name: string, tagline: string, palette: string, images: {hero: string}}} style
 */
export async function generateStyleCard(style) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#15130e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Hero image, if it loads (same-origin local file, so canvas won't taint)
  try {
    const img = await loadImage(style.images.hero);
    const imgH = 560;
    drawCover(ctx, img, 0, 0, canvas.width, imgH);
    // Gradient fade into the ink background so text stays legible
    const grad = ctx.createLinearGradient(0, imgH - 200, 0, imgH);
    grad.addColorStop(0, "rgba(21,19,14,0)");
    grad.addColorStop(1, "rgba(21,19,14,1)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, imgH - 200, canvas.width, 200);
  } catch {
    // No image yet (placeholder not filled in), just skip, plain background works fine.
  }

  // Lime accent bar
  ctx.fillStyle = "#cfff04";
  ctx.fillRect(60, 600, 70, 6);

  // "StyleCue" eyebrow
  ctx.fillStyle = "#c9c2b0";
  ctx.font = "600 22px Inter, sans-serif";
  ctx.fillText("STYLECUE STYLE PERSONALITY", 60, 580);

  // Style name
  ctx.fillStyle = "#f7f2e7";
  ctx.font = "italic 500 64px Fraunces, serif";
  wrapText(ctx, style.name, 60, 690, 680, 70);

  // Tagline
  ctx.fillStyle = "#c9c2b0";
  ctx.font = "24px Inter, sans-serif";
  wrapText(ctx, style.tagline, 60, 790, 680, 34);

  // Palette line
  ctx.fillStyle = "#cfff04";
  ctx.font = "600 20px Inter, sans-serif";
  wrapText(ctx, style.palette, 60, 900, 680, 28);

  return canvas;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  words.forEach((word) => {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      ctx.fillText(line, x, curY);
      line = word + " ";
      curY += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, curY);
}

/** Downloads the canvas as a PNG, or opens the native share sheet if available. */
export async function shareOrDownloadCard(canvas, filename) {
  canvas.toBlob(async (blob) => {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "My StyleCue result" });
        return;
      } catch {
        // fall through to download if share is cancelled/fails
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}
