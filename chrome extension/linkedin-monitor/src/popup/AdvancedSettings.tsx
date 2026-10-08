/**
 * ============================================================================
 * File Name: AdvancedSettings.tsx
 * Module: popup
 * Purpose: Render user interface for advanced extension utility actions (e.g. storage wipe).
 * Responsibilities: Allow user to clear all extension data or restore defaults.
 * Called By: SettingsDashboard.tsx
 * Calls: chrome.storage.local.clear
 * Receives: Current settings configuration.
 * Returns: AdvancedSettings component JSX.
 * Dependencies: ExtensionSettings, React hooks.
 * Connected Files: SettingsDashboard.tsx -> AdvancedSettings.tsx
 * Project Phase: Advanced Settings
 * Notes: None.
 * ============================================================================
 */

import React, { useState } from "react";
import type { ExtensionSettings } from "../types/settings";

interface Props {
  settings: ExtensionSettings | null;
  onSave: (newSettings: ExtensionSettings) => void;
}

export const AdvancedSettings: React.FC<Props> = () => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleResetAll = async () => {
    const confirmation = window.confirm(
      "WARNING: This will delete ALL keywords, leads, templates, settings, and logs. This action cannot be undone.\n\nAre you sure you want to perform a factory reset?"
    );
    if (!confirmation) return;

    setStatus("");
    setError("");

    try {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.local.clear(() => {
          const err = chrome.runtime.lastError?.message;
          if (err) reject(new Error(err));
          else resolve();
        });
      });
      setStatus("Extension data has been completely reset. Please reload the extension.");
      // Reload extension popup after 2 seconds to force state refresh
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch {
      setError("Failed to clear local storage.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">Advanced Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Advanced utility options and diagnostic tools.
        </p>
      </div>

      {status && (
        <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
          ✓ {status}
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
          ⚠ {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 border border-rose-200 bg-rose-50/50 rounded-md">
          <h3 className="text-sm font-semibold text-rose-800">Factory Reset</h3>
          <p className="mt-1 text-xs text-slate-600 leading-normal">
            Clears all saved leads, custom keywords, settings, log files, and auto-comment templates. Your extension will revert to initial installation state.
          </p>
          <button
            type="button"
            onClick={handleResetAll}
            className="mt-3 inline-flex justify-center items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            Clear All Extension Data
          </button>
        </div>

        <div className="p-4 border border-slate-200 rounded-md bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-700">Extension Diagnostics</h3>
          <ul className="mt-2 text-xs text-slate-600 space-y-1 font-mono">
            <li>Version: 1.0.0</li>
            <li>Environment: Production MV3</li>
            <li>Platform Support: LinkedIn Only</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
