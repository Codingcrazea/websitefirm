/**
 * ============================================================================
 * File Name: email.ts
 * Module: Shared types
 * Purpose: Define the non-sensitive payload sent from the extension to the email API.
 * Responsibilities: Keep the cross-project lead-alert request explicit and minimal.
 * Called By: email-alert.service.ts.
 * Calls: None.
 * Receives: Lead values accepted by the background worker.
 * Returns: Type contract.
 * Dependencies: None.
 * Connected Files: service-worker.ts → email-alert.service.ts → Vercel API.
 * Project Phase: Email Alerts.
 * Notes: SMTP configuration and recipient address are deliberately excluded.
 * ============================================================================
 */

/** Represents the exact JSON body accepted by the separate Nodemailer API. */
export interface LeadEmailAlertPayload {
  authorName: string;
  content: string;
  matchedKeywords: string[];
  postUrl: string;
  profileUrl?: string;
  detectedAt: string;
}
