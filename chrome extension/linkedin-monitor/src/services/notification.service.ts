/**
 * ============================================================================
 * File Name: notification.service.ts
 * Module: Services
 * Purpose: Display browser notifications for newly accepted leads.
 * Responsibilities: Convert a Lead into a user-visible notification without DOM or platform access.
 * Called By: service-worker.ts.
 * Calls: Chrome Notifications API.
 * Receives: A persisted Lead.
 * Returns: A promise that resolves after the notification request.
 * Dependencies: Chrome Notifications API, Lead type, logger.
 * Connected Files: service-worker.ts → notification.service.ts.
 * Project Phase: Shared Services.
 * Notes: This service never decides whether a lead matches or is a duplicate.
 * ============================================================================
 */

import type { Lead } from "../types/lead";
import { logger } from "../utils/logger";

/**
 * Purpose: Notify the user about a newly saved lead.
 * Called By: service-worker.ts.
 * Calls: chrome.notifications.create.
 * Parameters: The unique matched lead to summarize.
 * Returns: A promise that resolves when Chrome accepts the notification.
 * Dependencies: Chrome Notifications API and favicon asset.
 * Side Effects: Displays a browser notification.
 * Next Flow: The user can open the extension popup to review stored lead history.
 */
export async function notifyLead(lead: Lead): Promise<void> {
  await new Promise<void>((resolve) => {
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("favicon.svg"),
      title: `LinkedIn match: ${lead.authorName}`,
      message: lead.matchedKeywords.length ? `Matched: ${lead.matchedKeywords.join(", ")}` : "New LinkedIn lead detected",
    }, () => {
      const error = chrome.runtime.lastError?.message;
      if (error) logger.error("Unable to create notification", { error });
      resolve();
    });
  });
}
