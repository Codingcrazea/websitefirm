/**
 * ============================================================================
 * File Name: adapter.ts
 * Module: LinkedIn platform
 * Purpose: Serve as the LinkedIn content-script entry point.
 * Responsibilities: Start observation and forward parsed Leads to the background coordinator.
 * Called By: Chrome content-script runtime through manifest.json.
 * Calls: observer.ts and Chrome Runtime API.
 * Receives: Parsed Leads from observer.ts.
 * Returns: Nothing.
 * Dependencies: observer.ts, messages.ts, logger.ts, Chrome Runtime API.
 * Connected Files: manifest.json → adapter.ts → observer.ts → service-worker.ts.
 * Project Phase: LinkedIn Adapter.
 * Notes: Keyword matching, storage, and notifications intentionally remain outside this platform layer.
 * ============================================================================
 */

import type { ExtensionSettings } from "../../types/settings";
import type { LeadDetectedMessage, SearchScanCompleteMessage } from "../../types/messages";
import { logger } from "../../utils/logger";
import { observeLinkedInPosts } from "./observer";
import { scanLinkedInPosts } from "./scanner";
import { parseLinkedInPost } from "./parser";

function forwardLeadToBackground(lead: LeadDetectedMessage["lead"]): void {
  const message: LeadDetectedMessage = { type: "LEAD_DETECTED", lead };
  chrome.runtime.sendMessage(message, () => {
    const error = chrome.runtime.lastError?.message;
    if (error) logger.debug("Lead was not delivered to background", { error });
  });
}

/**
 * Purpose: Retrieve active settings configuration from storage via background coordinator.
 * Called By: runAutoMonitorScan.
 * Calls: chrome.runtime.sendMessage.
 * Parameters: None.
 * Returns: Active ExtensionSettings object.
 */
function getExtensionSettings(): Promise<ExtensionSettings> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_DASHBOARD" }, (response: any) => {
      const error = chrome.runtime.lastError?.message;
      if (error || !response || !response.settings) {
        // Safe default settings if communication fails
        resolve({
          monitoringEnabled: true,
          notificationsEnabled: true,
          emailAlertsEnabled: false,
          searchPollingEnabled: false,
          searchPollingInterval: 15,
          maxPostAgeHours: 0,
          enableFuzzyMatch: false,
          regionFilterEnabled: false,
          selectedRegion: "",
          sortLeadsByLatest: true,
          emailMethod: "mailto",
          scanDuration: 30,
          scrollSteps: 100,
          autoCommentEnabled: false,
          recipientEmail: "",
        });
      } else {
        resolve(response.settings);
      }
    });
  });
}

/**
 * Purpose: Wait dynamically for search result elements or a 'No results found' element.
 * Called By: runAutoMonitorScan.
 * Calls: MutationObserver APIs.
 * Parameters: timeoutMs (maximum wait duration in milliseconds).
 * Returns: Promise resolving to true if results are found, false if page loading fails/no results.
 */
function waitForSearchResults(timeoutMs: number = 15000): Promise<boolean> {
  return new Promise((resolve) => {
    const resultsSelector = ".reusable-search__result-container, .feed-shared-update-v2, article, .entity-result";
    const noResultsSelector = ".search-no-results__container, .search-no-results, [class*='no-results']";

    if (document.querySelector(resultsSelector)) {
      resolve(true);
      return;
    }
    if (document.querySelector(noResultsSelector)) {
      resolve(false);
      return;
    }

    let timeoutTimer: any;
    const observer = new MutationObserver(() => {
      if (document.querySelector(resultsSelector)) {
        clearTimeout(timeoutTimer);
        observer.disconnect();
        resolve(true);
      } else if (document.querySelector(noResultsSelector)) {
        clearTimeout(timeoutTimer);
        observer.disconnect();
        resolve(false);
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });

    timeoutTimer = setTimeout(() => {
      observer.disconnect();
      logger.warn("Dynamic loading wait timed out. Continuing with scan anyway.");
      resolve(false);
    }, timeoutMs);
  });
}

/**
 * Purpose: Scroll down incrementally to trigger lazy loading of search result items.
 * Called By: runAutoMonitorScan.
 * Calls: window.scrollTo.
 * Parameters: durationSeconds (scroll loop time limit), scrollSteps (maximum number of scroll iterations).
 * Returns: Promise resolving when scrolling concludes.
 */
async function runProgressiveScroll(
  durationSeconds: number,
  scrollSteps: number,
  onScroll?: () => void
): Promise<void> {
  const startTime = Date.now();
  const endTime = startTime + durationSeconds * 1000;
  const scrollIncrement = 500;
  const cycleDelayMs = 500;
  let currentScrollTop = 0;

  logger.info(`Starting progressive scroll. Limit: ${durationSeconds}s, steps: ${scrollSteps}`);

  for (let i = 0; i < scrollSteps; i++) {
    if (Date.now() >= endTime) {
      logger.info("Progressive scroll reached duration limit.");
      break;
    }

    currentScrollTop += scrollIncrement;
    window.scrollTo(0, currentScrollTop);

    if (onScroll) {
      onScroll();
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (currentScrollTop >= maxScroll + 1000) {
      window.scrollTo(0, document.body.scrollHeight);
      if (onScroll) {
        onScroll();
      }
      logger.info("Reached the bottom of the page content.");
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, cycleDelayMs));
  }
}

/**
 * Purpose: Scroll the search results page to trigger lazy loading, scan the posts, and notify completion.
 * Called By: initializeLinkedInAdapter when monitor=true parameter is present.
 * Calls: getExtensionSettings, waitForSearchResults, runProgressiveScroll, scanLinkedInPosts, parseLinkedInPost, forwardLeadToBackground, and Chrome Runtime sendMessage.
 * Parameters: None.
 * Returns: Promise resolving after scan complete.
 * Dependencies: LinkedIn scanner, parser, and Chrome Runtime API.
 */
async function runAutoMonitorScan(): Promise<void> {
  logger.info("Auto-monitor search tab active. Waiting for posts to load...");
  
  try {
    const settings = await getExtensionSettings();
    const hasResults = await waitForSearchResults(15000);
    
    const scanAndProcess = () => {
      const rawPosts = scanLinkedInPosts(document);
      if (rawPosts.length > 0) {
        logger.info(`Auto-monitor scan captured ${rawPosts.length} new posts.`);
        const leads = rawPosts.map(parseLinkedInPost);
        leads.forEach(forwardLeadToBackground);
      }
    };

    // Scan initial posts immediately
    scanAndProcess();

    if (hasResults) {
      logger.info("Search results detected. Commencing scroll sequence.");
      const scanDuration = settings.scanDuration ?? 30;
      const scrollSteps = settings.scrollSteps ?? 100;
      await runProgressiveScroll(scanDuration, scrollSteps, scanAndProcess);
    } else {
      logger.info("No search results or page load timed out. Scanning what is available.");
      scanAndProcess();
    }
  } catch (error) {
    logger.error("Error during auto-monitor search scan", { error });
  } finally {
    // Notify service worker that we're done so the tab can be closed
    const completeMessage: SearchScanCompleteMessage = { type: "SEARCH_SCAN_COMPLETE" };
    chrome.runtime.sendMessage(completeMessage);
  }
}

/**
 * Purpose: Initialize LinkedIn monitoring or auto-scan based on page context.
 * Called By: This content script entry point.
 * Calls: runAutoMonitorScan or observeLinkedInPosts.
 * Parameters: None.
 * Returns: Nothing.
 * Dependencies: LinkedIn observer, runAutoMonitorScan, and logger.
 */
export function initializeLinkedInAdapter(): void {
  const isMonitorTab = window.location.search.includes("monitor=true");
  
  if (isMonitorTab) {
    void runAutoMonitorScan();
  } else {
    observeLinkedInPosts(forwardLeadToBackground);
    logger.info("LinkedIn monitoring initialized");
  }
}

if (document.body) initializeLinkedInAdapter();
else document.addEventListener("DOMContentLoaded", initializeLinkedInAdapter, { once: true });
