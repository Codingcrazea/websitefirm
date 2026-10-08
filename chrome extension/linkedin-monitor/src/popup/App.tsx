/**
 * ============================================================================
 * File Name: App.tsx
 * Module: Popup UI
 * Purpose: Let users control monitoring keywords/settings and review captured leads.
 * Responsibilities: Render dashboard state and send user changes to the background coordinator.
 * Called By: popup/main.tsx.
 * Calls: Chrome Runtime API through typed messages.
 * Receives: DashboardResponse and user form events.
 * Returns: React popup elements.
 * Dependencies: React, shared message/types contracts.
 * Connected Files: main.tsx → App.tsx → service-worker.ts → storage.service.ts.
 * Project Phase: Popup UI.
 * Notes: The popup never imports LinkedIn scanner, parser, or observer code.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import SettingsDashboard from "./SettingsDashboard";
import type { Keyword } from "../types/keyword";
import type { Lead } from "../types/lead";
import type { DashboardResponse, ExtensionMessage } from "../types/messages";
import type { ExtensionSettings } from "../types/settings";

function sendMessage<TResponse>(message: ExtensionMessage): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const error = chrome.runtime.lastError?.message;
      if (error) { reject(new Error(error)); return; }
      resolve(response as TResponse);
    });
  });
}

function createKeyword(value: string): Keyword {
  return { id: crypto.randomUUID(), value: value.trim(), enabled: true };
}

/**
 * Purpose: Render and coordinate the extension's user-facing dashboard.
 * Called By: popup/main.tsx.
 * Calls: Chrome Runtime API through sendMessage.
 * Parameters: None.
 * Returns: Popup React elements.
 * Dependencies: React hooks and shared extension message contracts.
 * Side Effects: Reads and saves extension data through service-worker.ts.
 * Next Flow: Updated settings/keywords affect leads processed by the background worker.
 */
export default function App(): React.JSX.Element {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [newKeyword, setNewKeyword] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    /*
    Purpose: Load one consistent dashboard snapshot when the popup opens.
    Connected Files: App.tsx → service-worker.ts → storage.service.ts.
    Input: GET_DASHBOARD runtime message.
    Output: Settings, keywords, and newest leads for React state.
    Next Flow: Users can immediately review and change persisted extension data.
    */
    void sendMessage<DashboardResponse>({ type: "GET_DASHBOARD" })
      .then(setDashboard)
      .catch(() => setError("Unable to load extension data. Reload the popup and try again."));
  }, []);

  useEffect(() => {
    if (!dashboard || !dashboard.settings.searchPollingEnabled || !dashboard.nextScheduledTime || dashboard.isScanning) {
      setCountdown("");
      return;
    }
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, dashboard.nextScheduledTime! - now);
      if (diff === 0) {
        setCountdown("Fetching...");
        return;
      }
      const totalSecs = Math.floor(diff / 1000);
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      setCountdown(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [dashboard?.nextScheduledTime, dashboard?.settings.searchPollingEnabled, dashboard?.isScanning]);

  async function updateSettings(settings: ExtensionSettings): Promise<void> {
    setError("");
    try {
      await sendMessage<{ saved: boolean }>({ type: "SAVE_SETTINGS", settings });
      const freshDashboard = await sendMessage<DashboardResponse>({ type: "GET_DASHBOARD" });
      setDashboard(freshDashboard);
    } catch { setError("Unable to save settings."); }
  }

  async function persistKeywords(keywords: Keyword[]): Promise<void> {
    setError("");
    try {
      await sendMessage<{ saved: boolean }>({ type: "SAVE_KEYWORDS", keywords });
      setDashboard((current) => current ? { ...current, keywords } : current);
    } catch { setError("Unable to save keywords."); }
  }

  function addKeyword(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!dashboard || newKeyword.trim().length === 0) return;
    void persistKeywords([...dashboard.keywords, createKeyword(newKeyword)]);
    setNewKeyword("");
  }

  function triggerEmail(leads: Lead[], recipient?: string): void {
    if (leads.length === 0) return;
    const to = recipient ? encodeURIComponent(recipient.trim()) : "";
    const subject = encodeURIComponent(`LinkedIn Monitor: Captured ${leads.length} Leads`);
    
    const tableRows = leads
      .map((lead) => {
        const time = new Date(lead.detectedAt).toLocaleString();
        const authorLink = lead.authorProfileUrl ? `<a href="${lead.authorProfileUrl}" target="_blank">${lead.authorName}</a>` : lead.authorName;
        const postLink = `<a href="${lead.postUrl}" target="_blank">View Post</a>`;
        return `
          <tr>
            <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px;">${time}</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; font-weight: bold;">${authorLink}</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; line-height: 1.4;">${lead.content}</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; color: #4f46e5;">${lead.matchedKeywords.join(", ")}</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; font-weight: bold;">${postLink}</td>
          </tr>
        `;
      })
      .join("");

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #0f172a; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px;">LinkedIn Monitor: Captured Leads</h2>
        <p style="font-size: 13px; color: #475569; margin-bottom: 12px;">Here are your matched LinkedIn leads:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; min-width: 400px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left; font-size: 11px; font-weight: 600;">Time</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left; font-size: 11px; font-weight: 600;">Author</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left; font-size: 11px; font-weight: 600;">Content</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left; font-size: 11px; font-weight: 600;">Keywords</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left; font-size: 11px; font-weight: 600;">Link</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;

    const textSummary = leads
      .map((lead, idx) => {
        const time = new Date(lead.detectedAt).toLocaleString();
        return `${idx + 1}. [${time}] Author: ${lead.authorName} (${lead.authorProfileUrl || 'No Profile'})\n   Keywords: ${lead.matchedKeywords.join(", ")}\n   Post: ${lead.postUrl}\n   Content Preview: ${lead.content.substring(0, 100)}...\n`;
      })
      .join("\n");

    const fullBody = `LinkedIn Monitor Report\n\n${textSummary}\n\n=== HTML Table (Copy/Paste to Rich-Text Email) ===\n\n${htmlBody}`;
    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(fullBody)}`;
    window.open(mailtoUrl, "_blank");
  }

  if (!dashboard) return <main className="popup"><p>{error || "Loading LinkedIn Monitor…"}</p></main>;

  return (
    <main className="popup">
      <header className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">LinkedIn Monitor</h1>
          <p className="text-2xs text-slate-500">Monitor visible posts for your keywords.</p>
        </div>
        {!showSettings && (
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="text-2xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-2 py-1 rounded transition-all cursor-pointer border border-indigo-200"
          >
            ⚙ Settings
          </button>
        )}
      </header>
      {error && <p className="error" role="alert">{error}</p>}
      <section>
        {showSettings ? (
          <React.Suspense fallback={<div>Loading Settings…</div>}>
            <SettingsDashboard onBack={() => setShowSettings(false)} />
          </React.Suspense>
        ) : (
          <>
            <section aria-labelledby="monitoring-heading">
              <h2 id="monitoring-heading">Monitoring</h2>
              <label>
                <input type="checkbox" checked={dashboard.settings.monitoringEnabled} onChange={(event) => void updateSettings({ ...dashboard.settings, monitoringEnabled: event.target.checked })} /> Enable LinkedIn monitoring</label>
              <label>
                <input type="checkbox" checked={dashboard.settings.notificationsEnabled} onChange={(event) => void updateSettings({ ...dashboard.settings, notificationsEnabled: event.target.checked })} /> Show browser notifications</label>
              <label>
                <input type="checkbox" checked={dashboard.settings.emailAlertsEnabled} onChange={(event) => void updateSettings({ ...dashboard.settings, emailAlertsEnabled: event.target.checked })} /> Send email alerts</label>
              <div className="setting-select-group">
                <label htmlFor="age-limit-select">Ignore posts older than:</label>
                <select
                  id="age-limit-select"
                  value={dashboard.settings.maxPostAgeHours}
                  onChange={(event) => void updateSettings({ ...dashboard.settings, maxPostAgeHours: Number(event.target.value) })}
                >
                  <option value={0}>No limit (Any time)</option>
                  <option value={1}>1 hour</option>
                  <option value={4}>4 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours (1 day)</option>
                  <option value={168}>7 days (1 week)</option>
                </select>
              </div>
              <label>
                <input type="checkbox" checked={dashboard.settings.enableFuzzyMatch ?? false} onChange={(event) => void updateSettings({ ...dashboard.settings, enableFuzzyMatch: event.target.checked })} /> Enable fuzzy (≥50 % chars) match</label>
              <label>
                <input type="checkbox" checked={dashboard.settings.sortLeadsByLatest ?? true} onChange={(event) => void updateSettings({ ...dashboard.settings, sortLeadsByLatest: event.target.checked })} /> Sort leads by latest first</label>
              <label>
                <input type="checkbox" checked={dashboard.settings.regionFilterEnabled ?? false} onChange={(event) => void updateSettings({ ...dashboard.settings, regionFilterEnabled: event.target.checked })} /> Enable region filter</label>
              {dashboard.settings.regionFilterEnabled && (
                <input type="text" placeholder="Region (e.g., India)" value={dashboard.settings.selectedRegion ?? ''} onChange={(e) => void updateSettings({ ...dashboard.settings, selectedRegion: e.target.value })} />
              )}
              <label>
                <input type="checkbox" checked={dashboard.settings.searchPollingEnabled} onChange={(event) => void updateSettings({ ...dashboard.settings, searchPollingEnabled: event.target.checked })} /> Enable background search polling</label>
              {dashboard.settings.searchPollingEnabled && (
                <>
                  <div className="setting-sub-group">
                    <label htmlFor="poll-interval-select">Search interval:</label>
                    <select
                      id="poll-interval-select"
                      value={dashboard.settings.searchPollingInterval}
                      onChange={(event) => void updateSettings({ ...dashboard.settings, searchPollingInterval: Number(event.target.value) })}
                    >
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                  <div className="poll-status-container">
                    {dashboard.isScanning ? (
                      <span className="status-scanning">
                        <span className="pulse-dot"></span> Scanning LinkedIn in background...
                      </span>
                    ) : countdown ? (
                      <span className="status-countdown">Next background search in {countdown}</span>
                    ) : (
                      <span className="status-idle">Background search is idle</span>
                    )}
                  </div>
                </>
              )}
            </section>

            <section aria-labelledby="keywords-heading">
              <h2 id="keywords-heading">Keywords</h2>
              <form onSubmit={addKeyword}><input value={newKeyword} onChange={(event) => setNewKeyword(event.target.value)} placeholder="e.g. hiring designer" aria-label="New keyword" /><button type="submit">Add</button></form>
              <ul className="keyword-list">
                {dashboard.keywords.map((keyword) => (<li key={keyword.id}><label><input type="checkbox" checked={keyword.enabled} onChange={(event) => void persistKeywords(dashboard.keywords.map((item) => item.id === keyword.id ? { ...item, enabled: event.target.checked } : item))} /> {keyword.value}</label><button type="button" aria-label={`Remove ${keyword.value}`} onClick={() => void persistKeywords(dashboard.keywords.filter((item) => item.id !== keyword.id))}>×</button></li>))}
              </ul>
            </section>

            <section aria-labelledby="leads-heading">
              <div className="flex justify-between items-center mb-2">
                <h2 id="leads-heading" className="text-sm font-bold text-slate-800 m-0">Recent leads</h2>
                {dashboard.leads.length > 0 && (
                  <button
                    type="button"
                    onClick={() => triggerEmail(dashboard.leads, dashboard.settings.recipientEmail)}
                    className="text-3xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-2 py-1 rounded transition-colors cursor-pointer border border-indigo-200"
                  >
                    ✉ Email All
                  </button>
                )}
              </div>
              {dashboard.leads.length === 0 ? <p>No matches saved yet.</p> : (
                <ul className="lead-list">
                  {dashboard.leads
                    .filter((lead) => {
                      if (dashboard.settings.regionFilterEnabled) {
                        const sel = dashboard.settings.selectedRegion?.trim().toLowerCase();
                        return sel && lead.region?.toLowerCase() === sel;
                      }
                      return true;
                    })
                    .sort((a, b) => {
                      if (dashboard.settings.sortLeadsByLatest) {
                        return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
                      }
                      return new Date(a.detectedAt).getTime() - new Date(b.detectedAt).getTime();
                    })
                    .map((lead) => (
                      <li key={lead.id}>
                        <a href={lead.postUrl} target="_blank" rel="noreferrer">{lead.authorName}</a>
                        <p>{lead.content}</p>
                        <small>{lead.matchedKeywords.join(", ")}</small>
                        {lead.region && <small className="lead-region"> [{lead.region}]</small>}
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
