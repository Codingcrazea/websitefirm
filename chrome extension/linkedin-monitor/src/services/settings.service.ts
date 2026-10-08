/**
 * ============================================================================
 * File Name: settings.service.ts
 * Module: Services
 * Purpose: Manage settings retrieval and update in the popup UI layer.
 * Responsibilities: Request settings from background coordinator or save them.
 * Called By: popup/SettingsDashboard, popup/MonitoringSettings, popup/EmailSettings, popup/CommentSettings
 * Calls: chrome.runtime.sendMessage
 * Receives: Settings payload updates.
 * Returns: ExtensionSettings promises.
 * Dependencies: ExtensionSettings, ExtensionMessage.
 * Connected Files: settings.service.ts -> service-worker.ts -> storage.service.ts
 * Project Phase: Shared Services
 * Notes: Ensures UI components do not call chrome.runtime.sendMessage directly.
 * ============================================================================
 */

import type { ExtensionSettings } from "../types/settings";
import type { DashboardResponse } from "../types/messages";

/**
 * Purpose: Retrieve current settings from background coordinator.
 * Called By: popup components.
 * Parameters: None.
 * Returns: Promise resolving to ExtensionSettings.
 * Throws: Error if chrome runtime fails.
 * Next Flow: UI updates state with retrieved settings.
 */
export async function getSettings(): Promise<ExtensionSettings> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "GET_DASHBOARD" }, (response: unknown) => {
      const error = chrome.runtime.lastError?.message;
      if (error) {
        reject(new Error(error));
        return;
      }
      const res = response as DashboardResponse;
      if (res && res.settings) {
        resolve(res.settings);
      } else {
        reject(new Error("Malformed dashboard response"));
      }
    });
  });
}

/**
 * Purpose: Persist updated settings to background coordinator.
 * Called By: popup components.
 * Parameters: settings - ExtensionSettings.
 * Returns: Promise resolving when settings are saved.
 * Throws: Error if chrome runtime fails.
 * Next Flow: Background worker updates behavior based on new settings.
 */
export async function updateSettings(settings: ExtensionSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings }, (_response: unknown) => {
      const error = chrome.runtime.lastError?.message;
      if (error) {
        reject(new Error(error));
        return;
      }
      resolve();
    });
  });
}
