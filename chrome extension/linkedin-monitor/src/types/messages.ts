/**
 * ============================================================================
 * File Name: messages.ts
 * Module: Shared types
 * Purpose: Define runtime messages exchanged by content script, background, and popup.
 * Responsibilities: Prevent untyped cross-context communication.
 * Called By: adapter.ts, service-worker.ts, popup/App.tsx.
 * Calls: None.
 * Receives: Extension runtime payloads.
 * Returns: Type contracts.
 * Dependencies: lead.ts, keyword.ts, settings.ts.
 * Connected Files: adapter.ts → service-worker.ts ← popup/App.tsx.
 * Project Phase: Integration.
 * Notes: Message handling remains in the background coordinator.
 * ============================================================================
 */

import type { Keyword } from "./keyword";
import type { Lead } from "./lead";
import type { ExtensionSettings } from "./settings";

import type { CommentTemplate } from "./comment-template";

/** Messages sent from the LinkedIn content script to the extension background. */
export interface LeadDetectedMessage { type: "LEAD_DETECTED"; lead: Lead }

/** Messages sent by the popup to retrieve its complete dashboard state. */
export interface GetDashboardMessage { type: "GET_DASHBOARD" }

/** Messages sent by the popup to persist monitoring preferences. */
export interface SaveSettingsMessage { type: "SAVE_SETTINGS"; settings: ExtensionSettings }

/** Messages sent by the popup to persist its complete keyword collection. */
export interface SaveKeywordsMessage { type: "SAVE_KEYWORDS"; keywords: Keyword[] }

/** Messages sent by the search scan tab when background scanning completes. */
export interface SearchScanCompleteMessage { type: "SEARCH_SCAN_COMPLETE" }

/** Messages to retrieve/save comment templates */
export interface GetTemplatesMessage { type: "GET_TEMPLATES" }
export interface SaveTemplatesMessage { type: "SAVE_TEMPLATES"; templates: CommentTemplate[] }

/** Message to export error logs as CSV */
export interface ExportLogsCsvMessage { type: "EXPORT_LOGS_CSV" }

/** Union handled by the service worker runtime listener. */
export type ExtensionMessage =
  | LeadDetectedMessage
  | GetDashboardMessage
  | SaveSettingsMessage
  | SaveKeywordsMessage
  | SearchScanCompleteMessage
  | GetTemplatesMessage
  | SaveTemplatesMessage
  | ExportLogsCsvMessage;

/** Payload returned to popup state initialization. */
export interface DashboardResponse { settings: ExtensionSettings; keywords: Keyword[]; leads: Lead[]; nextScheduledTime: number | null; isScanning: boolean }

