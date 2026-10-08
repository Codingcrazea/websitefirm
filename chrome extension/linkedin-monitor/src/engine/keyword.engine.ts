/**
 * ============================================================================
 * File Name: keyword.engine.ts
 * Module: Business engine
 * Purpose: Match normalized Leads against enabled user keywords.
 * Responsibilities: Perform platform-independent matching without storage or DOM access.
 * Called By: service-worker.ts.
 * Calls: normalizeText utility.
 * Receives: A Lead and keyword collection.
 * Returns: Match decision and matched term values.
 * Dependencies: Shared types and helper utility.
 * Connected Files: parser.ts → service-worker.ts → keyword.engine.ts → duplicate.engine.ts.
 * Project Phase: Business Logic.
 * Notes: Future platforms reuse this module unchanged.
 * ============================================================================
 */

import { cleanSeparators, normalizeWordRoot } from "../utils/helper";
import type { Keyword, KeywordMatchResult } from "../types/keyword";
import type { Lead } from "../types/lead";

/**
 * Purpose: Identify enabled keyword values present in a lead's searchable text using stemming.
 * Called By: service-worker.ts.
 * Calls: cleanSeparators and normalizeWordRoot.
 * Parameters: One parsed lead and all persisted user keywords.
 * Returns: Whether the lead matches and the matching keyword values.
 */
export function matchKeywords(lead: Lead, keywords: Keyword[], enableFuzzyMatch?: boolean): KeywordMatchResult {
  const searchableText = `${lead.authorName} ${lead.content}`;
  
  // Normalize post text into clean word roots
  const postRoots = cleanSeparators(searchableText)
    .split(/\s+/)
    .map(normalizeWordRoot)
    .filter(Boolean);

  const matchedKeywords = keywords
    .filter((keyword) => {
    // Ensure keyword is enabled and non‑empty
    if (!keyword.enabled || keyword.value.trim().length === 0) return false;

    const cleanContent = cleanSeparators(searchableText).toLowerCase();
    const cleanKeyword = cleanSeparators(keyword.value).toLowerCase();

    // Case 1: Exact substring match (handles compound words like "fullstack" or "nodejs")
    if (cleanContent.includes(cleanKeyword)) return true;

    // Case 2: Stemmed root matching (covers plurals and tenses: "develop" matches "developing")
    const keywordRoots = cleanSeparators(keyword.value)
      .split(/\s+/)
      .map(normalizeWordRoot)
      .filter(Boolean);
    if (keywordRoots.length === 0) return false;
    const stemMatch = keywordRoots.every((kwRoot) =>
      postRoots.some((postRoot) => postRoot.includes(kwRoot) || kwRoot.includes(postRoot))
    );
    if (stemMatch) return true;

    // Case 3: Fuzzy partial match (>=50% chars) when enabled
    if (enableFuzzyMatch) {
      const minLen = Math.ceil(keyword.value.length / 2);
      for (let i = 0; i <= keyword.value.length - minLen; i++) {
        const sub = keyword.value.substr(i, minLen).toLowerCase();
        if (cleanContent.includes(sub)) return true;
      }
    }
    return false;
  })
    .map((keyword) => keyword.value);

  return { isMatch: matchedKeywords.length > 0, matchedKeywords };
}
