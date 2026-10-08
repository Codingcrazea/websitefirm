/**
 * ============================================================================
 * File Name: service-worker.ts
 * Module: Background
 * Purpose: Coordinate extension lifecycle, runtime messages, and lead-processing flow.
 * Responsibilities: Apply settings, match keywords, prevent duplicates, persist leads, and trigger notifications.
 * Called By: adapter.ts content script and popup/App.tsx through Chrome Runtime messages.
 * Calls: Storage service, engines, notification service, logger.
 * Receives: ExtensionMessage payloads.
 * Returns: Runtime response payloads.
 * Dependencies: Chrome Runtime API, services, engines, types.
 * Connected Files: adapter.ts → service-worker.ts ← popup/App.tsx.
 * Project Phase: Background and Integration.
 * Notes: This coordinator holds workflow order but no LinkedIn DOM selectors.
 * ============================================================================
 */

import { isDuplicateLead } from "../engine/duplicate.engine";
import { matchKeywords } from "../engine/keyword.engine";
import { sendLeadAlert } from "../services/email-alert.service";
import { notifyLead } from "../services/notification.service";
import { getKeywords, getLeads, getSettings, saveKeywords, saveLead, saveSettings, getStoredTemplates, saveStoredTemplates } from "../services/storage.service";
import { exportCsv } from "../services/logging.service";
import type { ExtensionMessage } from "../types/messages";
import type { Lead } from "../types/lead";
import type { ExtensionSettings } from "../types/settings";
import { logger } from "../utils/logger";
import { calculatePostAgeInHours } from "../utils/helper";

let activeMonitorTabId: number | null = null;
let isScanning = false;

async function setupSearchAlarm(settings: ExtensionSettings): Promise<void> {
  try {
    await chrome.alarms.clear("linkedin_search_poll");
    if (settings.monitoringEnabled && settings.searchPollingEnabled) {
      chrome.alarms.create("linkedin_search_poll", {
        periodInMinutes: settings.searchPollingInterval,
      });
      logger.info("Search poll alarm scheduled", { interval: settings.searchPollingInterval });
    } else {
      logger.info("Search poll alarm disabled or unscheduled");
    }
  } catch (error) {
    logger.error("Error setting up search alarm", { error });
  }
}

async function closeMonitorTab(tabId: number, reason: string): Promise<void> {
  if (activeMonitorTabId === tabId) {
    activeMonitorTabId = null;
  }
  isScanning = false;
  try {
    await chrome.tabs.remove(tabId);
    logger.info("Closed monitor search tab", { reason, tabId });
  } catch (error) {
    logger.debug("Could not close monitor search tab", { error, tabId });
  }
}

async function runSearchPoll(): Promise<void> {
  try {
    const settings = await getSettings();
    if (!settings.monitoringEnabled || !settings.searchPollingEnabled) {
      isScanning = false;
      return;
    }

    const keywords = await getKeywords();
    const enabledKeywords = keywords.filter((k) => k.enabled).map((k) => k.value.trim());
    if (enabledKeywords.length === 0) {
      logger.info("Search poll skipped: No enabled keywords configured.");
      isScanning = false;
      return;
    }

    const query = enabledKeywords.map((k) => `"${k}"`).join(" OR ");
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.linkedin.com/search/results/content/?keywords=${encodedQuery}&sortBy=%22date_posted%22&monitor=true`;

    if (activeMonitorTabId !== null) {
      await closeMonitorTab(activeMonitorTabId, "Stale tab cleanup");
    }

    isScanning = true;
    chrome.tabs.create({ url: searchUrl, active: false }, (tab: ChromeTab) => {
      const error = chrome.runtime.lastError?.message;
      if (error || !tab || tab.id === undefined) {
        logger.error("Failed to create search polling tab", { error });
        isScanning = false;
        return;
      }
      activeMonitorTabId = tab.id;
      logger.info("Created search polling tab", { tabId: tab.id });

      const currentTabId = tab.id;
      setTimeout(() => {
        if (activeMonitorTabId === currentTabId) {
          void closeMonitorTab(currentTabId, "Scan Timeout");
        }
      }, 60000);
    });
  } catch (error) {
    isScanning = false;
    logger.error("Error running search poll", { error });
  }
}

chrome.alarms.onAlarm.addListener((alarm: ChromeAlarm) => {
  if (alarm.name === "linkedin_search_poll") {
    void runSearchPoll();
  }
});

function isExtensionMessage(message: unknown): message is ExtensionMessage {
  return typeof message === "object" && message !== null && "type" in message && typeof message.type === "string";
}

async function processDetectedLead(lead: Lead): Promise<{ accepted: boolean }> {
  const settings = await getSettings();
  if (!settings.monitoringEnabled) return { accepted: false };

  if (settings.maxPostAgeHours > 0) {
    const ageInHours = calculatePostAgeInHours(lead);
    if (ageInHours > settings.maxPostAgeHours) {
      logger.info("Lead filtered out because it exceeds the maximum age limit", { leadId: lead.id, ageInHours, maxAgeHours: settings.maxPostAgeHours });
      return { accepted: false };
    }
  }

  const match = matchKeywords(lead, await getKeywords(), settings.enableFuzzyMatch);
  if (!match.isMatch) return { accepted: false };

  const matchedLead: Lead = { ...lead, matchedKeywords: match.matchedKeywords };
  if (isDuplicateLead(matchedLead, await getLeads())) return { accepted: false };

  await saveLead(matchedLead);
  if (settings.notificationsEnabled) await notifyLead(matchedLead);
  if (settings.emailAlertsEnabled) await sendLeadAlert(matchedLead);
  logger.info("Stored a new matched lead", { leadId: matchedLead.id });
  return { accepted: true };
}

async function handleMessage(message: ExtensionMessage, sender: ChromeRuntimeMessageSender): Promise<unknown> {
  switch (message.type) {
    case "LEAD_DETECTED": return processDetectedLead(message.lead);
    case "GET_DASHBOARD": {
      const alarm = await chrome.alarms.get("linkedin_search_poll");
      return {
        settings: await getSettings(),
        keywords: await getKeywords(),
        leads: await getLeads(),
        nextScheduledTime: alarm ? alarm.scheduledTime : null,
        isScanning
      };
    }
    case "SAVE_SETTINGS": {
      const oldSettings = await getSettings();
      await saveSettings(message.settings); 
      await setupSearchAlarm(message.settings);
      if (message.settings.searchPollingEnabled && !oldSettings.searchPollingEnabled) {
        void runSearchPoll();
      }
      return { saved: true };
    }
    case "SAVE_KEYWORDS": await saveKeywords(message.keywords); return { saved: true };
    case "SEARCH_SCAN_COMPLETE":
      if (sender.tab && sender.tab.id !== undefined) {
        void closeMonitorTab(sender.tab.id, "Scan Complete");
      }
      return { success: true };
    case "GET_TEMPLATES": return getStoredTemplates();
    case "SAVE_TEMPLATES": await saveStoredTemplates(message.templates); return { success: true };
    case "EXPORT_LOGS_CSV": return exportCsv();
  }
}

/*
Purpose: Keep asynchronous message handling alive until background processing completes.
Connected Files: adapter.ts and popup/App.tsx send ExtensionMessage values to this listener.
Input: Runtime message plus Chrome sender metadata.
Output: Processing result or a safe error response.
Next Flow: Content scripts and popup update only after their message callback receives this result.
*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isExtensionMessage(message)) return false;
  void handleMessage(message, sender)
    .then(sendResponse)
    .catch((error: unknown) => {
      logger.error("Background message processing failed", { error });
      sendResponse({ error: "Unable to process the requested extension action." });
    });
  return true;
});

async function initializeAlarm(): Promise<void> {
  const settings = await getSettings();
  await setupSearchAlarm(settings);
}
void initializeAlarm();

logger.info("LinkedIn Monitor background worker started");
