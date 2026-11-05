// Compares a closet item's garment measurements against the user's own
// body measurements, dimension by dimension. Same rule-based,
// percentage-threshold method as classifyBodyShape() in bodyShape.js -
// this is a direct extension of that logic, not a separate mechanism,
// so it stays consistent with the report's explainable, non-ML approach.
//
// Threshold: within 5% = "true to size". Beyond that, whichever
// direction (garment smaller or larger than body) determines "runs
// small" / "runs roomy" for that dimension.

const THRESHOLD_PCT = 5;

function assessDimension(label, bodyValue, garmentValue) {
  if (!bodyValue || !garmentValue) return null;

  const diffPct = ((garmentValue - bodyValue) / bodyValue) * 100;
  const rounded = Math.round(Math.abs(diffPct));

  let verdict;
  if (Math.abs(diffPct) <= THRESHOLD_PCT) {
    verdict = "true to size";
  } else if (diffPct < 0) {
    verdict = "runs small";
  } else {
    verdict = "runs roomy";
  }

  return {
    label,
    verdict,
    reason:
      verdict === "true to size"
        ? `${label} is within ${THRESHOLD_PCT}% of your measurement.`
        : `${label} is about ${rounded}% ${diffPct < 0 ? "smaller" : "larger"} than your measurement.`,
  };
}

/**
 * @param {{shoulder_cm?: number, waist_cm?: number, hip_cm?: number}} body
 * @param {{garment_shoulder?: number, garment_waist?: number, garment_hip?: number}} garment
 * @returns {{ overall: string, dimensions: Array, hasData: boolean }}
 */
export function checkFit(body, garment) {
  const dimensions = [
    assessDimension("Shoulder", body.shoulder_cm, garment.garment_shoulder),
    assessDimension("Waist", body.waist_cm, garment.garment_waist),
    assessDimension("Hip", body.hip_cm, garment.garment_hip),
  ].filter(Boolean);

  if (dimensions.length === 0) {
    return { overall: "No fit data", dimensions: [], hasData: false };
  }

  const verdicts = dimensions.map((d) => d.verdict);
  let overall;
  if (verdicts.every((v) => v === "true to size")) {
    overall = "True to size";
  } else if (verdicts.includes("runs small") && verdicts.includes("runs roomy")) {
    overall = "Mixed fit";
  } else if (verdicts.includes("runs small")) {
    overall = "Runs small";
  } else {
    overall = "Runs roomy";
  }

  return { overall, dimensions, hasData: true };
}
