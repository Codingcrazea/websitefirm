/**
 * ============================================================================
 * File Name: email.ts
 * Module: Configuration
 * Purpose: Retrieve the public Vercel email API URL injected at extension build time.
 * Responsibilities: Prevent email calls until a valid HTTPS endpoint is configured.
 * Called By: email-alert.service.ts.
 * Calls: None.
 * Receives: VITE_EMAIL_API_URL environment value.
 * Returns: Configured API URL or null.
 * Dependencies: Vite environment support.
 * Connected Files: .env → email.ts → email-alert.service.ts.
 * Project Phase: Email Alerts.
 * Notes: This value is public configuration, not an SMTP secret.
 * ============================================================================
 */

/**
 * Purpose: Validate the deployment URL before the service worker sends external lead data.
 * Called By: email-alert.service.ts.
 * Calls: Native URL parsing.
 * Parameters: None.
 * Returns: HTTPS Vercel API URL or null when email deployment is not configured.
 * Dependencies: VITE_EMAIL_API_URL build environment variable.
 * Side Effects: None.
 * Next Flow: A valid result is used for POST delivery by email-alert.service.ts.
 */
export function getEmailApiUrl(): string | null {
  const value = import.meta.env.VITE_EMAIL_API_URL?.trim();
  if (!value) return null;
  try { return new URL("/api/send-lead-email", value).toString(); } catch { return null; }
}
