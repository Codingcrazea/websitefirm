/**
 * ============================================================================
 * File Name: keyword.ts
 * Module: Shared types
 * Purpose: Define the user-managed keyword model and matching result.
 * Responsibilities: Provide a stable contract between popup, engine, and storage.
 * Called By: Popup, keyword engine, storage service.
 * Calls: None.
 * Receives: User-entered keyword data and normalized lead text.
 * Returns: Type contracts.
 * Dependencies: None.
 * Connected Files: popup/App.tsx → storage.service.ts → keyword.engine.ts.
 * Project Phase: Shared Types.
 * Notes: Keywords remain user data; this file contains no matching logic.
 * ============================================================================
 */

/** Represents one keyword a user has enabled for monitoring. */
export interface Keyword {
  id: string;
  value: string;
  enabled: boolean;
}

/** Describes the keyword-engine outcome for one parsed lead. */
export interface KeywordMatchResult {
  isMatch: boolean;
  matchedKeywords: string[];
}
