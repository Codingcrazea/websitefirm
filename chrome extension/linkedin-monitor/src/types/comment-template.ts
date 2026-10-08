/**
 * ============================================================================
 * File Name: comment-template.ts
 * Module: Shared types
 * Purpose: Define structures for automated comment templates.
 * Responsibilities: Keep comment template definitions standardized.
 * Called By: template.service.ts, popup components.
 * Calls: None.
 * Receives: None.
 * Returns: Type contracts.
 * Dependencies: None.
 * Connected Files: None.
 * Project Phase: Comment Management.
 * Notes: Enforced maximum of 4 templates.
 * ============================================================================
 */

export interface CommentTemplate {
  id: string;
  name: string;
  content: string;
}
