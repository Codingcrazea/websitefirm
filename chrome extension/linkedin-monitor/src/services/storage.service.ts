/**
 * ============================================================================
 * File Name: storage.service.ts
 * Module: Services
 * Purpose: Provide the only persistence boundary for extension data.
 * Responsibilities: Validate and save settings, keywords, and detected leads in chrome.storage.local.
 * Called By: service-worker.ts and popup/App.tsx through runtime messages.
 * Calls: Chrome Storage API and configuration defaults.
 * Receives: User preferences, user keywords, and accepted Lead records.
 * Returns: Validated persisted data.
 * Dependencies: Chrome Storage API, config, shared types, logger.
 * Connected Files: service-worker.ts → storage.service.ts → popup/App.tsx.
 * Project Phase: Shared Services.
 * Notes: No other module may access chrome.storage.local directly.
 * ============================================================================
 */

import { DEFAULT_KEYWORDS } from "../config/keywords";
import { DEFAULT_SETTINGS } from "../config/settings";
import type { Keyword } from "../types/keyword";
import type { Lead } from "../types/lead";
import type { ExtensionSettings } from "../types/settings";
import type { CommentTemplate } from "../types/comment-template";
import type { LogEntry } from "../types/logging";
import { logger } from "../utils/logger";

const STORAGE_KEYS = {
  settings: "settings",
  keywords: "keywords",
  leads: "leads",
  templates: "commentTemplates",
  logs: "extensionLogs",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isKeyword(value: unknown): value is Keyword {
  return isRecord(value) && typeof value.id === "string" && typeof value.value === "string" && typeof value.enabled === "boolean";
}

function isLead(value: unknown): value is Lead {
  return isRecord(value) && value.platform === "linkedin" && typeof value.id === "string" && typeof value.postUrl === "string" && typeof value.authorName === "string" && typeof value.content === "string" && typeof value.detectedAt === "string" && Array.isArray(value.matchedKeywords);
}

function isCommentTemplate(value: unknown): value is CommentTemplate {
  return isRecord(value) && typeof value.id === "string" && typeof value.name === "string" && typeof value.content === "string";
}

function isLogEntry(value: unknown): value is LogEntry {
  return isRecord(value) && typeof value.timestamp === "number" && typeof value.module === "string" && typeof value.level === "string" && typeof value.message === "string";
}

function readStorage(keys: string | string[] | null): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (items) => {
      const error = chrome.runtime.lastError?.message;
      if (error) { reject(new Error(error)); return; }
      resolve(items);
    });
  });
}

function writeStorage(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      const error = chrome.runtime.lastError?.message;
      if (error) { reject(new Error(error)); return; }
      resolve();
    });
  });
}

/**
 * Purpose: Read settings while safely recovering from missing or malformed stored data.
 * Called By: service-worker.ts and popup dashboard requests.
 * Calls: Chrome storage through readStorage.
 * Parameters: None.
 * Returns: A complete settings object.
 * Dependencies: DEFAULT_SETTINGS and Chrome Storage API.
 * Side Effects: Logs storage failures.
 * Next Flow: The caller decides whether monitoring or notifications should run.
 */
export async function getSettings(): Promise<ExtensionSettings> {
  try {
    const items = await readStorage(STORAGE_KEYS.settings);
    const stored = items[STORAGE_KEYS.settings];
    if (!isRecord(stored)) return { ...DEFAULT_SETTINGS };
    return {
      monitoringEnabled: typeof stored.monitoringEnabled === "boolean" ? stored.monitoringEnabled : DEFAULT_SETTINGS.monitoringEnabled,
      notificationsEnabled: typeof stored.notificationsEnabled === "boolean" ? stored.notificationsEnabled : DEFAULT_SETTINGS.notificationsEnabled,
      emailAlertsEnabled: typeof stored.emailAlertsEnabled === "boolean" ? stored.emailAlertsEnabled : DEFAULT_SETTINGS.emailAlertsEnabled,
      searchPollingEnabled: typeof stored.searchPollingEnabled === "boolean" ? stored.searchPollingEnabled : DEFAULT_SETTINGS.searchPollingEnabled,
      searchPollingInterval: typeof stored.searchPollingInterval === "number" ? stored.searchPollingInterval : DEFAULT_SETTINGS.searchPollingInterval,
      maxPostAgeHours: typeof stored.maxPostAgeHours === "number" ? stored.maxPostAgeHours : DEFAULT_SETTINGS.maxPostAgeHours,
      enableFuzzyMatch: typeof stored.enableFuzzyMatch === "boolean" ? stored.enableFuzzyMatch : DEFAULT_SETTINGS.enableFuzzyMatch,
      regionFilterEnabled: typeof stored.regionFilterEnabled === "boolean" ? stored.regionFilterEnabled : DEFAULT_SETTINGS.regionFilterEnabled,
      selectedRegion: typeof stored.selectedRegion === "string" ? stored.selectedRegion : DEFAULT_SETTINGS.selectedRegion,
      sortLeadsByLatest: typeof stored.sortLeadsByLatest === "boolean" ? stored.sortLeadsByLatest : DEFAULT_SETTINGS.sortLeadsByLatest,
      emailMethod: stored.emailMethod === "mailto" ? stored.emailMethod : DEFAULT_SETTINGS.emailMethod,
      scanDuration: typeof stored.scanDuration === "number" ? stored.scanDuration : DEFAULT_SETTINGS.scanDuration,
      scrollSteps: typeof stored.scrollSteps === "number" ? stored.scrollSteps : DEFAULT_SETTINGS.scrollSteps,
      autoCommentEnabled: typeof stored.autoCommentEnabled === "boolean" ? stored.autoCommentEnabled : DEFAULT_SETTINGS.autoCommentEnabled,
      recipientEmail: typeof stored.recipientEmail === "string" ? stored.recipientEmail : DEFAULT_SETTINGS.recipientEmail,
    };
  } catch (error) {
    logger.error("Unable to read settings", { error });
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Purpose: Persist validated settings from the popup.
 * Called By: service-worker.ts.
 * Calls: Chrome storage through writeStorage.
 * Parameters: A complete settings object.
 * Returns: A promise that resolves after persistence.
 * Dependencies: Chrome Storage API.
 * Side Effects: Writes chrome.storage.local.
 * Next Flow: Updated settings control new lead processing.
 */
export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  await writeStorage({ [STORAGE_KEYS.settings]: settings });
}

/**
 * Purpose: Retrieve user keywords and exclude malformed persisted values.
 * Called By: service-worker.ts and popup dashboard requests.
 * Calls: Chrome storage through readStorage.
 * Parameters: None.
 * Returns: Valid keyword records.
 * Dependencies: DEFAULT_KEYWORDS and Chrome Storage API.
 * Side Effects: Logs storage failures.
 * Next Flow: Results are rendered by popup or passed into keyword.engine.ts.
 */
export async function getKeywords(): Promise<Keyword[]> {
  try {
    const items = await readStorage(STORAGE_KEYS.keywords);
    const stored = items[STORAGE_KEYS.keywords];
    return Array.isArray(stored) ? stored.filter(isKeyword) : [...DEFAULT_KEYWORDS];
  } catch (error) {
    logger.error("Unable to read keywords", { error });
    return [...DEFAULT_KEYWORDS];
  }
}

/**
 * Purpose: Save the popup-managed keyword collection.
 * Called By: service-worker.ts.
 * Calls: Chrome storage through writeStorage.
 * Parameters: Validated user keyword records.
 * Returns: A promise that resolves after persistence.
 * Dependencies: Chrome Storage API.
 * Side Effects: Writes chrome.storage.local.
 * Next Flow: New LinkedIn leads use these terms in keyword.engine.ts.
 */
export async function saveKeywords(keywords: Keyword[]): Promise<void> {
  await writeStorage({ [STORAGE_KEYS.keywords]: keywords.filter(isKeyword) });
}

/**
 * Purpose: Retrieve newest persisted leads for duplicate detection and dashboard display.
 * Called By: service-worker.ts and popup dashboard requests.
 * Calls: Chrome storage through readStorage.
 * Parameters: An optional maximum result count.
 * Returns: Newest valid leads first.
 * Dependencies: Chrome Storage API.
 * Side Effects: Logs storage failures.
 * Next Flow: Leads are checked by duplicate.engine.ts or rendered by the popup.
 */
export async function getLeads(limit = 100): Promise<Lead[]> {
  try {
    const items = await readStorage(STORAGE_KEYS.leads);
    const stored = items[STORAGE_KEYS.leads];
    return Array.isArray(stored) ? stored.filter(isLead).slice(0, limit) : [];
  } catch (error) {
    logger.error("Unable to read leads", { error });
    return [];
  }
}

/**
 * Purpose: Add one accepted lead while retaining a bounded local history.
 * Called By: service-worker.ts after keyword and duplicate processing.
 * Calls: getLeads and Chrome storage through writeStorage.
 * Parameters: A matched, unique Lead.
 * Returns: A promise that resolves after persistence.
 * Dependencies: Chrome Storage API.
 * Side Effects: Writes chrome.storage.local.
 * Next Flow: The same lead may be displayed by the popup and notified by notification.service.ts.
 */
export async function saveLead(lead: Lead): Promise<void> {
  const existingLeads = await getLeads();
  await writeStorage({ [STORAGE_KEYS.leads]: [lead, ...existingLeads].slice(0, 100) });
}

/**
 * Purpose: Retrieve stored comment templates.
 * Called By: template.service.ts
 * Parameters: None.
 * Returns: CommentTemplate[]
 * Next Flow: Template management operations.
 */
export async function getStoredTemplates(): Promise<CommentTemplate[]> {
  try {
    const items = await readStorage(STORAGE_KEYS.templates);
    const stored = items[STORAGE_KEYS.templates];
    return Array.isArray(stored) ? stored.filter(isCommentTemplate) : [];
  } catch (error) {
    logger.error("Unable to read templates", { error });
    return [];
  }
}

/**
 * Purpose: Persist updated comment templates.
 * Called By: template.service.ts
 * Parameters: templates - CommentTemplate[]
 * Returns: Promise resolving after write completes.
 * Next Flow: Storage is updated.
 */
export async function saveStoredTemplates(templates: CommentTemplate[]): Promise<void> {
  await writeStorage({ [STORAGE_KEYS.templates]: templates.filter(isCommentTemplate) });
}

/**
 * Purpose: Retrieve stored log entries.
 * Called By: logging.service.ts
 * Parameters: None.
 * Returns: LogEntry[]
 * Next Flow: Logs rendering or CSV export.
 */
export async function getStoredLogs(): Promise<LogEntry[]> {
  try {
    const items = await readStorage(STORAGE_KEYS.logs);
    const stored = items[STORAGE_KEYS.logs];
    return Array.isArray(stored) ? stored.filter(isLogEntry) : [];
  } catch (error) {
    logger.error("Unable to read logs", { error });
    return [];
  }
}

/**
 * Purpose: Save a new log entry to history.
 * Called By: logging.service.ts
 * Parameters: log - LogEntry
 * Returns: Promise resolving when log is appended.
 * Next Flow: Log is stored.
 */
export async function saveStoredLog(log: LogEntry): Promise<void> {
  try {
    const existingLogs = await getStoredLogs();
    await writeStorage({ [STORAGE_KEYS.logs]: [log, ...existingLogs].slice(0, 200) });
  } catch (error) {
    logger.error("Unable to save log entry", { error });
  }
}

/**
 * Purpose: Clear all stored log entries.
 * Called By: logging.service.ts
 * Parameters: None.
 * Returns: Promise resolving after clear completes.
 * Next Flow: Logs list is emptied.
 */
export async function clearStoredLogs(): Promise<void> {
  await writeStorage({ [STORAGE_KEYS.logs]: [] });
}

