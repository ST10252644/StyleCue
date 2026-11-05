// The rule-based, attribute-overlap recommendation engine described in
// the research report (Section 3.5 methodology, Section 4.2 worked
// example). Combines a user's body-shape attributes and style-personality
// attributes into one deduplicated set, then scores each catalogue item
// by how many of its own attribute tags fall within that set. This is
// the exact mechanism the report documents, no ML, fully explainable,
// every score traceable to specific matched tags.

/**
 * @param {string[]} bodyAttributes
 * @param {string[]} styleAttributes
 * @returns {string[]} deduplicated combined attribute set
 */
export function combineAttributes(bodyAttributes, styleAttributes) {
  return Array.from(new Set([...bodyAttributes, ...styleAttributes]));
}

/**
 * @param {string[]} userAttributes - combined, deduplicated user attribute set
 * @param {Array<{id:string,name:string,category:string,attributes:string[]}>} catalog
 * @param {number} topN - max results to return (default 8)
 * @returns {Array} catalogue items with score, matched tags, and total possible, ranked
 */
export function computeMatches(userAttributes, catalog, topN = 8) {
  const scored = catalog.map((item) => {
    const matched = item.attributes.filter((tag) => userAttributes.includes(tag));
    return {
      ...item,
      score: matched.length,
      matched,
      total: userAttributes.length,
    };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, topN);
}

/**
 * Builds a plain-English reason for one match (Design requirement 4).
 * It says which attributes came from the body shape and which from the style.
 */
export function explainMatch(item, bodyType, style) {
  const fromBody = item.matched.filter((t) => bodyType.attributes.includes(t));
  const fromStyle = item.matched.filter((t) => style.attributes.includes(t));
  const parts = [];
  if (fromBody.length) parts.push(`${fromBody.join(", ")} suits your ${bodyType.name} shape`);
  if (fromStyle.length) parts.push(`${fromStyle.join(", ")} fits your ${style.name} style`);
  const missed = item.attributes.filter((t) => !item.matched.includes(t));
  let text = parts.join(", and ") + ".";
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (missed.length) text += ` Not part of your profile: ${missed.join(", ")}.`;
  return { text, fromBody, fromStyle, missed };
}
