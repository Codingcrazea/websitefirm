/**
 * ============================================================================
 * File Name: email-alert.service.ts
 * Module: Services
 * Purpose: Deliver accepted leads to the separately deployed Nodemailer API.
 * Responsibilities: Map Lead data to the API contract and handle remote delivery failures.
 * Called By: service-worker.ts.
 * Calls: email configuration, Fetch API, centralized logger.
 * Receives: A unique matched Lead.
 * Returns: Whether the API accepted the email request.
 * Dependencies: Lead type, email payload type, config/email.ts, logger.ts.
 * Connected Files: service-worker.ts → email-alert.service.ts → Vercel send-lead-email API.
 * Project Phase: Email Alerts.
 * Notes: This file never contains SMTP passwords, recipient addresses, or Gmail credentials.
 * ============================================================================
 */

import type { Lead } from "../types/lead";
import { logger } from "../utils/logger";
import { EMAIL_API_BASE } from "../constants";
import type { LeadEmailAlertPayload } from "../types/email";

function toEmailPayload(lead: Lead): LeadEmailAlertPayload {
  return {
    authorName: lead.authorName,
    content: lead.content,
    matchedKeywords: lead.matchedKeywords,
    postUrl: lead.postUrl,
    profileUrl: lead.authorProfileUrl,
    detectedAt: lead.detectedAt,
  };
}

/**
 * Purpose: Request an email notification for a lead already accepted by local processing.
 * Called By: service-worker.ts.
 * Calls: getEmailApiUrl, Fetch API, logger.
 * Parameters: A unique matched Lead.
 * Returns: True only when the API returns a successful response.
 * Dependencies: Vercel API URL and network host permission.
 * Side Effects: Sends lead data to the configured external email API.
 * Next Flow: The Vercel API validates data and sends the mobile-visible email.
 */
// export async function sendLeadEmailAlert(lead: Lead): Promise<boolean> {
// const apiUrl = getEmailApiUrl();
// if (!apiUrl) { logger.warn("Email alert skipped because VITE_EMAIL_API_URL is not configured"); return false; }
// try {
// const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toEmailPayload(lead)) });
// if (!response.ok) { logger.error("Email API rejected lead alert", { status: response.status }); return false; }
// return true;
// } catch (error) {
// logger.error("Email API request failed", { error });
// return false;
// }
// }


export async function sendLeadAlert(lead: Lead): Promise<boolean> {
  const payload = toEmailPayload(lead);
  const endpoint = `${EMAIL_API_BASE}/api/send-lead-email`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      logger.error("Email API error", { status: response.status, error: err });
      return false;
    }
    // Optionally process response JSON if needed
    return true;
  } catch (error) {
    logger.error("Email API request failed", { error });
    return false;
  }
}
