/**
 * Parses a tag string or array of strings, splitting by non-escaped commas.
 * Handles escaping (e.g., "Veg\, Non-Veg"), trimming, and lowercasing.
 */
export function parseTags(input: string | string[] | undefined): string[] {
  if (!input) return [];
  
  // If input is an array (from variadic positional args), some elements might 
  // already be separate tags. We join them carefully.
  const str = Array.isArray(input) ? input.join(',') : input;
  
  // Split by comma NOT preceded by a backslash
  return str.split(/(?<!\\),/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => tag.replace(/\\,/g, ',').toLowerCase());
}
