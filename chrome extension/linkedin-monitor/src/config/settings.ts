/**
 * ============================================================================
 * File Name: settings.ts
 * Module: Configuration
 * Purpose: Supply immutable default extension settings.
 * Responsibilities: Centralize defaults used before user preferences are persisted.
 * Called By: storage.service.ts.
 * Calls: None.
 * Receives: None.
 * Returns: Default settings values.
 * Dependencies: types/settings.ts.
 * Connected Files: settings.ts → storage.service.ts → service-worker.ts and popup/App.tsx.
 * Project Phase: Configuration.
 * Notes: This file must not read Chrome storage or contain UI behavior.
 * ============================================================================
 */

import type { ExtensionSettings } from "../types/settings";

/** Default behavior that makes monitoring opt-in only through user-visible controls. */
export const DEFAULT_SETTINGS: ExtensionSettings = {
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
};

