/**
 * ============================================================================
 * File Name: lead.ts
 * Module: Shared types
 * Purpose: Define the platform-neutral record persisted for a matched social post.
 * Responsibilities: Keep platform, post, author, and match data consistent across modules.
 * Called By: LinkedIn parser, keyword engine, storage service, popup.
 * Calls: None.
 * Receives: Parsed platform post data.
 * Returns: Type contracts.
 * Dependencies: None.
 * Connected Files: parser.ts → service-worker.ts → storage.service.ts → popup/App.tsx.
 * Project Phase: Shared Types.
 * Notes: New platform parsers must produce this contract without importing LinkedIn code.
 * ============================================================================
 */

/** Represents a normalized post that matched at least one user keyword. */
export interface Lead {
  id: string;
  platform: "linkedin";
  postUrl: string;
  authorName: string;
  authorProfileUrl?: string;
  content: string;
  publishedAt?: string;
  timeText?: string;
  detectedAt: string;
  matchedKeywords: string[];
  region?: string;
}
