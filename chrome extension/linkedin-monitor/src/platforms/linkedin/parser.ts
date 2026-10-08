/**
 * ============================================================================
 * File Name: parser.ts
 * Module: LinkedIn platform
 * Purpose: Convert raw LinkedIn post data into the platform-neutral Lead contract.
 * Responsibilities: Normalize platform output without querying the DOM, matching, or persistence.
 * Called By: observer.ts.
 * Calls: Shared helper functions.
 * Receives: RawLinkedInPost values from scanner.ts.
 * Returns: An unclassified Lead.
 * Dependencies: scanner.ts raw type, Lead type, helper.ts.
 * Connected Files: scanner.ts → parser.ts → adapter.ts → service-worker.ts.
 * Project Phase: LinkedIn Parser.
 * Notes: Keeping DOM reads in scanner.ts makes this parser independently testable.
 * ============================================================================
 */

import type { Lead } from "../../types/lead";
import { createStableId, normalizeText } from "../../utils/helper";
import type { RawLinkedInPost } from "./scanner";

/**
 * Purpose: Map a raw LinkedIn record into the shared Lead model used by engines and services.
 * Called By: observer.ts.
 * Calls: createStableId and normalizeText.
 * Parameters: One raw LinkedIn post from scanner.ts.
 * Returns: A normalized Lead with no matched keywords yet.
 * Dependencies: RawLinkedInPost and Lead contracts.
 * Side Effects: None.
 * Next Flow: adapter.ts sends the Lead to service-worker.ts for keyword processing.
 */
export function parseLinkedInPost(post: RawLinkedInPost): Lead {
  const content = normalizeText(post.content);
  const authorName = normalizeText(post.authorName);
  const postUrl = post.sourceUrl;
  return {
    id: createStableId(`${postUrl}|${authorName}|${content}`),
    platform: "linkedin",
    postUrl,
    authorName,
    authorProfileUrl: post.authorProfileUrl,
    content,
    publishedAt: post.publishedAt,
    timeText: post.timeText,
    detectedAt: new Date().toISOString(),
    matchedKeywords: [],
  };
}
