/**
 * ============================================================================
 * File Name: settings.ts
 * Module: Shared types
 * Purpose: Define extension-wide user preferences.
 * Responsibilities: Keep persisted settings independent from UI and platform logic.
 * Called By: Config, storage service, service worker, popup.
 * Calls: None.
 * Receives: User preference values.
 * Returns: Type contracts.
 * Dependencies: None.
 * Connected Files: settings.ts config → storage.service.ts → service-worker.ts → popup/App.tsx.
 * Project Phase: Shared Types.
 * Notes: Settings apply to every supported platform unless a future platform-specific setting is added.
 * ============================================================================
 */

/** Controls the extension monitoring and notification behavior. */
export interface ExtensionSettings {
  monitoringEnabled: boolean;
  notificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
  searchPollingEnabled: boolean;
  searchPollingInterval: number;
  maxPostAgeHours: number;
  enableFuzzyMatch?: boolean;
  regionFilterEnabled?: boolean;
  selectedRegion?: string;
  sortLeadsByLatest?: boolean;
  emailMethod?: "mailto";
  scanDuration?: number;
  scrollSteps?: number;
  autoCommentEnabled?: boolean;
  recipientEmail?: string;
}

