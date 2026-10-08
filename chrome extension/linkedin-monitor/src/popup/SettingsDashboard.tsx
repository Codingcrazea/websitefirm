/**
 * ============================================================================
 * File Name: SettingsDashboard.tsx
 * Module: popup
 * Purpose: Central UI dashboard for all Settings tabs in popup view.
 * Responsibilities: Manage settings tabs selection and pass active settings states.
 * Called By: App.tsx
 * Calls: EmailSettings, MonitoringSettings, CommentSettings, LogSettings, AdvancedSettings.
 * Receives: None.
 * Returns: SettingsDashboard React component JSX.
 * Dependencies: React hooks, settings.service.ts.
 * Connected Files: App.tsx -> SettingsDashboard.tsx
 * Project Phase: Settings Dashboard Integration
 * Notes: Uses vanilla Tailwind tabs with scroll support for small widths.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../services/settings.service";
import EmailSettings from "./EmailSettings";
import MonitoringSettings from "./MonitoringSettings";
import CommentSettings from "./CommentSettings";
import LogSettings from "./LogSettings";
import AdvancedSettings from "./AdvancedSettings";

type TabKey = "email" | "monitoring" | "comments" | "logs" | "advanced";

interface Props {
  onBack: () => void;
}

export const SettingsDashboard: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("email");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleSave = async (newSettings: any) => {
    await updateSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 -mx-4 -mb-4 p-4 rounded-b-lg border-t border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm font-bold text-slate-900">Extension Settings</h1>
        <button
          type="button"
          onClick={onBack}
          className="text-2xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-2 py-1 rounded transition-colors cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { key: "email", label: "Email" },
          { key: "monitoring", label: "Monitor" },
          { key: "comments", label: "Comments" },
          { key: "logs", label: "Logs" },
          { key: "advanced", label: "Advanced" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`mr-3 pb-2 transition-all border-b-2 cursor-pointer ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab(tab.key as TabKey)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-2 text-xs">
        {activeTab === "email" && <EmailSettings settings={settings} onSave={handleSave} />}
        {activeTab === "monitoring" && <MonitoringSettings settings={settings} onSave={handleSave} />}
        {activeTab === "comments" && <CommentSettings settings={settings} onSave={handleSave} />}
        {activeTab === "logs" && <LogSettings />}
        {activeTab === "advanced" && <AdvancedSettings settings={settings} onSave={handleSave} />}
      </div>
    </div>
  );
};

export default SettingsDashboard;
