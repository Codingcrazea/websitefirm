/**
 * ============================================================================
 * File Name: logging.service.ts
 * Module: Services
 * Purpose: Manage logging, retrieving, and exporting extension error logs.
 * Responsibilities: Format log entries, persist them via storage.service, and generate CSV file contents.
 * Called By: service-worker.ts, popup/LogSettings, popup/ErrorReport, utils/logger.ts.
 * Calls: storage.service.ts.
 * Receives: Error events, logs retrieve request.
 * Returns: LogEntry objects and formatted CSV string.
 * Dependencies: LogEntry interface, storage.service.ts.
 * Connected Files: logging.service.ts -> storage.service.ts
 * Project Phase: Error Logging
 * Notes: Bounded logging history is enforced inside storage.service.ts.
 * ============================================================================
 */

import { getStoredLogs, saveStoredLog, clearStoredLogs } from "./storage.service";
import type { LogEntry } from "../types/logging";

/**
 * Purpose: Log an error or warning message with metadata.
 * Called By: Background coordinator, content script parser, and general modules.
 * Parameters: module - string, level - "error" | "warn" | "info" | "debug", message - string, errorObj - optional any.
 * Returns: Promise resolving when entry is saved.
 * Next Flow: Entry is persisted in local storage.
 */
export async function logError(
  module: string,
  level: LogEntry["level"],
  message: string,
  errorObj?: any
): Promise<void> {
  let manifestVersion = "1.0.0";
  try {
    manifestVersion = chrome.runtime.getManifest().version;
  } catch {
    // Fallback when called outside extension environment (e.g. testing)
  }

  const entry: LogEntry = {
    timestamp: Date.now(),
    module,
    level,
    message,
    stack: errorObj?.stack || errorObj?.message || "",
    url: typeof window !== "undefined" ? window.location.href : "background",
    extensionVersion: manifestVersion,
  };

  await saveStoredLog(entry);
}

/**
 * Purpose: Retrieve all stored log entries.
 * Called By: popup logs viewer.
 * Parameters: None.
 * Returns: Promise resolving to LogEntry[].
 * Next Flow: Logs list is rendered.
 */
export async function getLogs(): Promise<LogEntry[]> {
  return getStoredLogs();
}

/**
 * Purpose: Clear all stored logs.
 * Called By: popup logs viewer clear button.
 * Parameters: None.
 * Returns: Promise resolving when logs are cleared.
 * Next Flow: Storage logs array is emptied.
 */
export async function clearLogs(): Promise<void> {
  await clearStoredLogs();
}

/**
 * Purpose: Escape values containing CSV special characters.
 * Called By: exportCsv.
 * Parameters: val - string.
 * Returns: Escaped string for CSV insertion.
 * Next Flow: None.
 */
function escapeCsvField(val: string): string {
  if (val === undefined || val === null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Purpose: Generate CSV formatted string from all stored logs.
 * Called By: popup export logs action.
 * Parameters: None.
 * Returns: Promise resolving to CSV content string.
 * Next Flow: Trigger browser download in popup.
 */
export async function exportCsv(): Promise<string> {
  const logs = await getStoredLogs();
  const headers = ["Timestamp", "Module", "Level", "Message", "Stack", "URL", "ExtensionVersion"];
  
  const rows = logs.map((log) => [
    new Date(log.timestamp).toISOString(),
    log.module,
    log.level,
    log.message,
    log.stack || "",
    log.url || "",
    log.extensionVersion,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCsvField).join(",")),
  ].join("\n");

  return csvContent;
}
