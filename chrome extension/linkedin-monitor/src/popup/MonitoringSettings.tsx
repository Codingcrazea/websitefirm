/**
 * ============================================================================
 * File Name: MonitoringSettings.tsx
 * Module: popup
 * Purpose: Render user interface for configuring monitoring intervals, scrolling, and filters.
 * Responsibilities: Bind inputs to settings state and save changes.
 * Called By: SettingsDashboard.tsx
 * Calls: settings.service.ts
 * Receives: Current settings configuration.
 * Returns: MonitoringSettings component JSX.
 * Dependencies: ExtensionSettings, React hooks.
 * Connected Files: SettingsDashboard.tsx -> MonitoringSettings.tsx
 * Project Phase: Monitoring Settings
 * Notes: Includes region and fuzzy matching toggles.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import type { ExtensionSettings } from "../types/settings";

interface Props {
  settings: ExtensionSettings | null;
  onSave: (newSettings: ExtensionSettings) => void;
}

export const MonitoringSettings: React.FC<Props> = ({ settings, onSave }) => {
  const [scanDuration, setScanDuration] = useState(30);
  const [scrollSteps, setScrollSteps] = useState(100);
  const [enableFuzzyMatch, setEnableFuzzyMatch] = useState(false);
  const [regionFilterEnabled, setRegionFilterEnabled] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortLeadsByLatest, setSortLeadsByLatest] = useState(true);
  const [maxPostAgeHours, setMaxPostAgeHours] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setScanDuration(settings.scanDuration ?? 30);
      setScrollSteps(settings.scrollSteps ?? 100);
      setEnableFuzzyMatch(settings.enableFuzzyMatch ?? false);
      setRegionFilterEnabled(settings.regionFilterEnabled ?? false);
      setSelectedRegion(settings.selectedRegion ?? "");
      setSortLeadsByLatest(settings.sortLeadsByLatest ?? true);
      setMaxPostAgeHours(settings.maxPostAgeHours ?? 0);
    }
  }, [settings]);

  const handleSave = () => {
    if (!settings) return;
    const newSettings: ExtensionSettings = {
      ...settings,
      scanDuration,
      scrollSteps,
      enableFuzzyMatch,
      regionFilterEnabled,
      selectedRegion: selectedRegion.trim(),
      sortLeadsByLatest,
      maxPostAgeHours,
    };
    onSave(newSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">Monitoring Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure how the background scanner behaves on LinkedIn search pages.
        </p>
      </div>

      <div className="space-y-4">
        {/* Row 1: Duration & Steps */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="scan-duration" className="block text-sm font-medium text-slate-700">
              Scan Duration (seconds)
            </label>
            <input
              type="number"
              id="scan-duration"
              min={5}
              max={3600}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
              value={scanDuration}
              onChange={(e) => setScanDuration(Math.max(5, Number(e.target.value)))}
            />
          </div>

          <div>
            <label htmlFor="scroll-steps" className="block text-sm font-medium text-slate-700">
              Scroll Steps per Cycle
            </label>
            <input
              type="number"
              id="scroll-steps"
              min={1}
              max={5000}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
              value={scrollSteps}
              onChange={(e) => setScrollSteps(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        {/* Row 2: Max Post Age */}
        <div>
          <label htmlFor="max-age" className="block text-sm font-medium text-slate-700">
            Ignore Posts Older Than
          </label>
          <select
            id="max-age"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white p-2 border"
            value={maxPostAgeHours}
            onChange={(e) => setMaxPostAgeHours(Number(e.target.value))}
          >
            <option value={0}>No limit (Any time)</option>
            <option value={1}>1 hour</option>
            <option value={4}>4 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours (1 day)</option>
            <option value={168}>7 days (1 week)</option>
          </select>
        </div>

        {/* Region Filter options */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              checked={regionFilterEnabled}
              onChange={(e) => setRegionFilterEnabled(e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-700">Enable Region Filter</span>
          </label>

          {regionFilterEnabled && (
            <div className="pl-7">
              <label htmlFor="selected-region" className="block text-xs font-medium text-slate-500">
                Region Name (e.g. India, United States)
              </label>
              <input
                type="text"
                id="selected-region"
                placeholder="Region to match"
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              checked={enableFuzzyMatch}
              onChange={(e) => setEnableFuzzyMatch(e.target.checked)}
            />
            <span className="text-sm text-slate-700 font-medium">Enable Fuzzy Matching (≥50% chars match)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              checked={sortLeadsByLatest}
              onChange={(e) => setSortLeadsByLatest(e.target.checked)}
            />
            <span className="text-sm text-slate-700 font-medium">Sort Leads by Latest First</span>
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          Save Monitoring Settings
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

export default MonitoringSettings;
