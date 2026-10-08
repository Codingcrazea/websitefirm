/**
 * ============================================================================
 * File Name: EmailSettings.tsx
 * Module: popup
 * Purpose: Render user interface for configuring email delivery options.
 * Responsibilities: Allow user to view and save target recipient and email method.
 * Called By: SettingsDashboard.tsx
 * Calls: settings.service.ts
 * Receives: Current settings configuration.
 * Returns: EmailSettings component JSX.
 * Dependencies: ExtensionSettings, React hooks.
 * Connected Files: SettingsDashboard.tsx -> EmailSettings.tsx
 * Project Phase: Email Alerts Settings
 * Notes: Uses mailto link method, requires valid email addresses.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import type { ExtensionSettings } from "../types/settings";

interface Props {
  settings: ExtensionSettings | null;
  onSave: (newSettings: ExtensionSettings) => void;
}

export const EmailSettings: React.FC<Props> = ({ settings, onSave }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailMethod, setEmailMethod] = useState<"mailto">("mailto");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setRecipientEmail(settings.recipientEmail || "");
      setEmailMethod(settings.emailMethod || "mailto");
    }
  }, [settings]);

  const handleSave = () => {
    if (!settings) return;
    const newSettings: ExtensionSettings = {
      ...settings,
      recipientEmail: recipientEmail.trim(),
      emailMethod,
    };
    onSave(newSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">Email Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure how batch lead updates are emailed to you.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email-method" className="block text-sm font-medium text-slate-700">
            Email Delivery Method
          </label>
          <select
            id="email-method"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white p-2 border"
            value={emailMethod}
            onChange={(e) => setEmailMethod(e.target.value as "mailto")}
          >
            <option value="mailto">mailto (Opens your default mail client)</option>
          </select>
        </div>

        <div>
          <label htmlFor="recipient-email" className="block text-sm font-medium text-slate-700">
            Recipient Email Address
          </label>
          <input
            type="email"
            id="recipient-email"
            placeholder="e.g. yourname@example.com"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Your mail client will open with this address pre-filled when you trigger the email.
          </p>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          Save Email Settings
        </button>
        {isSaved && (
          <span className="text-sm text-emerald-600 font-medium animate-fade-in">
            ✓ Settings saved successfully!
          </span>
        )}
      </div>
    </div>
  );
};

export default EmailSettings;
