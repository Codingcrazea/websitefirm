/**
 * ============================================================================
 * File Name: chrome.d.ts
 * Module: Shared browser API types
 * Purpose: Provide the minimal Chrome extension API contracts used by this project.
 * Responsibilities: Type extension storage, runtime messaging, and notifications.
 * Called By: All extension modules that use the Chrome API.
 * Calls: None.
 * Receives: Chrome API callback values.
 * Returns: Compile-time type information only.
 * Dependencies: Chrome Manifest V3 runtime.
 * Connected Files: storage.service.ts, notification.service.ts, service-worker.ts, adapter.ts.
 * Project Phase: Foundation.
 * Notes: Avoids untyped browser API access until a full Chrome type package is introduced.
 * ============================================================================
 */

interface ChromeRuntimeMessageSender { tab?: { id?: number } }

interface ChromeRuntime {
  lastError?: { message?: string };
  getURL(path: string): string;
  onMessage: { addListener(listener: (message: unknown, sender: ChromeRuntimeMessageSender, sendResponse: (response: unknown) => void) => boolean | void): void };
  sendMessage(message: unknown, callback?: (response: unknown) => void): void;
  getManifest(): { version: string };
}

interface ChromeStorageArea {
  get(keys: string | string[] | null, callback: (items: Record<string, unknown>) => void): void;
  set(items: Record<string, unknown>, callback?: () => void): void;
  clear(callback?: () => void): void;
}

interface ChromeNotifications {
  create(options: { type: "basic"; iconUrl: string; title: string; message: string }, callback?: (notificationId: string) => void): void;
}

interface ChromeAlarm {
  name: string;
  scheduledTime: number;
  periodInMinutes?: number;
}

interface ChromeAlarms {
  get(name: string): Promise<ChromeAlarm | undefined>;
  clear(name: string): Promise<boolean>;
  create(name: string, alarmInfo: { periodInMinutes?: number; delayInMinutes?: number }): void;
  onAlarm: {
    addListener(listener: (alarm: ChromeAlarm) => void): void;
  };
}

interface ChromeTab {
  id?: number;
  url?: string;
  title?: string;
}

interface ChromeTabs {
  create(createProperties: { url?: string; active?: boolean }, callback?: (tab: ChromeTab) => void): void;
  remove(tabId: number | number[]): Promise<void>;
}

declare const chrome: {
  runtime: ChromeRuntime;
  storage: { local: ChromeStorageArea };
  notifications: ChromeNotifications;
  alarms: ChromeAlarms;
  tabs: ChromeTabs;
};
