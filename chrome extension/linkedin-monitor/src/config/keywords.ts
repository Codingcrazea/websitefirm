/**
 * ============================================================================
 * File Name: keywords.ts
 * Module: Configuration
 * Purpose: Provide safe initial keyword data for a new installation.
 * Responsibilities: Keep starter keyword choices separate from matching logic.
 * Called By: storage.service.ts.
 * Calls: None.
 * Receives: None.
 * Returns: Initial keyword collection.
 * Dependencies: types/keyword.ts.
 * Connected Files: keywords.ts → storage.service.ts → popup/App.tsx and keyword.engine.ts.
 * Project Phase: Configuration.
 * Notes: An empty default prevents unrequested monitoring criteria.
 * ============================================================================
 */

import type { Keyword } from "../types/keyword";

/** New users begin with no hidden or hard-coded monitoring terms. */
export const DEFAULT_KEYWORDS: Keyword[] = [];
