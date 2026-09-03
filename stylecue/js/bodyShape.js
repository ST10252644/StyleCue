// Rule-based body shape classifier.
// Uses shoulders, waist, and hips (not bust) as StyleCue's chosen inputs.
// Every result comes with a plain-language reason, in line with the
// "explainable recommendations" approach described in the research report.

export const BODY_TYPES = {
    hourglass: {
        name: "Hourglass",
        desc: "Your shoulders and hips are close in width, with a clearly defined waist. Clothes that follow your natural waistline — wrap dresses, belted coats, fitted knits — tend to work with your shape rather than against it.",
    },
    pear: {
        name: "Pear",
        desc: "Your hips are wider than your shoulders. Structured shoulders, statement sleeves, and A-line or straight-leg bottoms help balance the width between your upper and lower body.",
    },
    invertedTriangle: {
        name: "Inverted triangle",
        desc: "Your shoulders are broader than your hips. Softer necklines, wider-leg or flared bottoms, and detail around the hips help bring balance to the silhouette.",
    },
    apple: {
        name: "Apple",
        desc: "Your waist is close in width to your shoulders and hips, without a lot of definition at the middle. Empire waistlines, V-necks, and fabrics with drape tend to sit well on this shape.",
    },
    rectangle: {
        name: "Rectangle",
        desc: "Your shoulders, waist, and hips are all fairly similar in width. Belting, peplum, and layering are easy ways to create the appearance of more shape if that's the look you're after.",
    },
};

/**
 * @param {number} shoulder
 * @param {number} waist
 * @param {number} hip
 * @returns {{ key: string, name: string, desc: string, reason: string }}
 */
export function classifyBodyShape(shoulder, waist, hip) {
    const shoulderToHip = shoulder / hip;
    const waistToHip = waist / hip;
    const waistToShoulder = waist / shoulder;

    const shoulderHipPct = Math.round(Math.abs(shoulderToHip - 1) * 100);
    const waistDropPct = Math.round((1 - Math.min(waistToHip, waistToShoulder)) * 100);
    const waistClosePct = 100 - Math.round((1 - Math.max(waistToHip, waistToShoulder)) * 100);

    let key;
    let reason;

    if (waistToHip > 0.9 && waistToShoulder > 0.9) {
        key = "apple";
        reason = `Your waist measures at least ${waistClosePct}% as wide as both your shoulders and hips, so there isn't a sharp narrowing at the middle — that's the defining trait of an apple shape.`;
    } else if (shoulderHipPct <= 5 && waistDropPct >= 25) {
        key = "hourglass";
        reason = `Your shoulders and hips are within ${shoulderHipPct}% of each other, and your waist is about ${waistDropPct}% narrower than both — that combination of balance plus a defined waist is what makes this an hourglass shape.`;
    } else if (shoulderToHip < 0.95) {
        key = "pear";
        const diff = Math.round((1 - shoulderToHip) * 100);
        reason = `Your hips measure about ${diff}% wider than your shoulders, which places more visual weight on your lower body — the defining trait of a pear shape.`;
    } else if (shoulderToHip > 1.05) {
        key = "invertedTriangle";
        const diff = Math.round((shoulderToHip - 1) * 100);
        reason = `Your shoulders measure about ${diff}% wider than your hips, which places more visual weight on your upper body — the defining trait of an inverted triangle shape.`;
    } else {
        key = "rectangle";
        reason = `Your shoulders and hips are close in width (within ${shoulderHipPct}%), and your waist doesn't narrow enough to read as an hourglass — that even, straighter line is a rectangle shape.`;
    }

    return { key, ...BODY_TYPES[key], reason };
}