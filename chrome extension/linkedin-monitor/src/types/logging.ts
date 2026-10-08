/**
 * ============================================================================
 * File Name: logging.ts
 * Module: Shared types
 * Purpose: Define structure for error and info logs.
 * Responsibilities: Keep log format consistent.
 * Called By: logging.service.ts, popup/LogSettings, popup/ErrorReport.
 * Calls: None.
 * Receives: None.
 * Returns: Type contracts.
 * Dependencies: None.
 * Connected Files: None.
 * Project Phase: Error Logging
 * Notes: None.
 * ============================================================================
 */

export interface LogEntry {
  timestamp: number;
  module: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
  stack?: string;
  url?: string;
  extensionVersion: string;
}
