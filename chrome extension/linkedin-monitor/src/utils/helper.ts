import type { Lead } from "../types/lead";

/**
 * Purpose: Normalize text before matching so DOM whitespace does not hide keywords.
 * Called By: parser.ts and keyword.engine.ts.
 * Calls: Native string methods.
 * Parameters: Raw nullable text.
 * Returns: Trimmed, single-space text.
 * Dependencies: None.
 */
export function normalizeText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

/**
 * Purpose: Create a deterministic ID when LinkedIn does not expose a stable post identifier.
 * Called By: parser.ts.
 * Calls: Native string iteration.
 * Parameters: Any stable source string.
 * Returns: A compact, repeatable identifier.
 * Dependencies: None.
 */
export function createStableId(value: string): string {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return `linkedin-${Math.abs(hash)}`;
}

/**
 * Purpose: Strip separators (. - _ / \) to normalize terms like node.js -> nodejs and full-stack -> fullstack.
 * Called By: keyword.engine.ts.
 */
export function cleanSeparators(text: string): string {
  return text.replace(/[.\-_\\\/]/g, "");
}

/**
 * Purpose: Extract the base root of a word to support pluralization and stemming.
 * Called By: keyword.engine.ts.
 */
export function normalizeWordRoot(word: string): string {
  let root = word.toLowerCase().trim();
  // Strip punctuation and special symbols
  root = root.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
  
  // Stem common inflectional suffixes
  const suffixes = ["ment", "ers", "ing", "ed", "er", "es", "s"];
  for (const suffix of suffixes) {
    if (root.endsWith(suffix) && root.length > suffix.length + 1) {
      root = root.slice(0, -suffix.length);
      break;
    }
  }
  return root;
}

/**
 * Purpose: Calculate the approximate age of a post in hours from metadata.
 * Called By: service-worker.ts.
 */
export function calculatePostAgeInHours(lead: Lead): number {
  // 1. Try parsing numeric timestamp or date string from publishedAt
  if (lead.publishedAt) {
    const ts = Number(lead.publishedAt);
    const date = new Date(isNaN(ts) ? lead.publishedAt : ts);
    if (!isNaN(date.getTime())) {
      return (Date.now() - date.getTime()) / (1000 * 60 * 60);
    }
  }

  // 2. Try parsing relative string from timeText (e.g. "3h", "1 day ago", "5m")
  if (lead.timeText) {
    const text = lead.timeText.toLowerCase().replace(/edited/g, "").trim();
    
    // Minutes
    const matchM = text.match(/(\d+)\s*(m|min|minute)/);
    if (matchM) return Number(matchM[1]) / 60;
    
    // Hours
    const matchH = text.match(/(\d+)\s*(h|hr|hour)/);
    if (matchH) return Number(matchH[1]);
    
    // Days
    const matchD = text.match(/(\d+)\s*(d|day)/);
    if (matchD) return Number(matchD[1]) * 24;
    
    // Weeks
    const matchW = text.match(/(\d+)\s*(w|wk|week)/);
    if (matchW) return Number(matchW[1]) * 24 * 7;
    
    // Months
    const matchMo = text.match(/(\d+)\s*(mo|month)/);
    if (matchMo) return Number(matchMo[1]) * 24 * 30;
    
    // Years
    const matchY = text.match(/(\d+)\s*(y|yr|year)/);
    if (matchY) return Number(matchY[1]) * 24 * 365;
  }

  // Default to 0 if no age metadata exists
  return 0;
}
