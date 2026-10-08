/**
 * ============================================================================
 * File Name: duplicate.engine.ts
 * Module: Business engine
 * Purpose: Prevent repeated storage and notifications for the same post.
 * Responsibilities: Compare normalized lead identity without DOM or storage access.
 * Called By: service-worker.ts.
 * Calls: None.
 * Receives: Candidate lead and existing persisted leads.
 * Returns: A boolean duplicate decision.
 * Dependencies: Lead type.
 * Connected Files: keyword.engine.ts → duplicate.engine.ts → storage.service.ts.
 * Project Phase: Business Logic.
 * Notes: Storage retrieval remains in the service layer so this engine stays testable.
 * ============================================================================
 */

import type { Lead } from "../types/lead";

/**
 * Purpose: Check whether a candidate post has already been accepted.
 * Called By: service-worker.ts.
 * Calls: Native Array.some.
 * Parameters: The candidate lead and recently stored leads.
 * Returns: True when the lead ID or canonical post URL was previously stored.
 * Dependencies: Lead contract.
 * Side Effects: None.
 * Next Flow: New leads are saved and notified; duplicates stop processing.
 */
export function isDuplicateLead(candidate: Lead, existingLeads: Lead[]): boolean {
  return existingLeads.some((lead) => lead.id === candidate.id || lead.postUrl === candidate.postUrl);
}
