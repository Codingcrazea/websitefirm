/**
 * ============================================================================
 * File Name: LogSettings.tsx
 * Module: popup
 * Purpose: Render user interface for viewing error logs and exporting them as CSV.
 * Responsibilities: Show log table, support filter searching, clear logs, and download CSV.
 * Called By: SettingsDashboard.tsx
 * Calls: logging.service.ts
 * Receives: None.
 * Returns: LogSettings component JSX.
 * Dependencies: LogEntry, React hooks.
 * Connected Files: SettingsDashboard.tsx -> LogSettings.tsx
 * Project Phase: Error Logging UI
 * Notes: Bounded to show the newest logs.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import type { LogEntry } from "../types/logging";
import { getLogs, clearLogs, exportCsv } from "../services/logging.service";

export const LogSettings: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    getLogs()
      .then(setLogs)
      .catch(() => setError("Failed to retrieve log history."));
  };

  const handleExport = async () => {
    try {
      const csv = await exportCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `linkedin-monitor-logs-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to generate CSV export.");
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to delete all log history?")) return;
    try {
      await clearLogs();
      setLogs([]);
    } catch {
      setError("Failed to clear log history.");
    }
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      log.message.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q) ||
      log.level.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-medium text-slate-900">Error Log settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            View system actions and export logs for debugging.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={logs.length === 0}
            className="inline-flex justify-center items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={logs.length === 0}
            className="inline-flex justify-center items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
          ⚠ {error}
        </div>
      )}

      {/* Log Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search logs by keyword, level, or module..."
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-2 border bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Logs Table / List */}
      <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            {logs.length === 0 ? "No log entries captured yet." : "No logs match your search filter."}
          </div>
        ) : (
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-2xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Level</th>
                  <th className="px-3 py-2">Module</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {filteredLogs.map((log, idx) => {
                  const levelColors = {
                    error: "text-rose-600 bg-rose-50 font-bold",
                    warn: "text-amber-600 bg-amber-50",
                    info: "text-blue-600 bg-blue-50",
                    debug: "text-slate-500 bg-slate-50",
                  };
                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-3xs uppercase tracking-wide ${levelColors[log.level] || ""}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-600">
                        {log.module}
                      </td>
                      <td className="px-3 py-2 break-all max-w-xs font-sans text-slate-800">
                        {log.message}
                        {log.stack && (
                          <details className="mt-1 text-3xs text-slate-400 font-mono cursor-pointer">
                            <summary className="hover:text-slate-600">View Stack Trace</summary>
                            <pre className="mt-1 p-1 bg-slate-50 border rounded overflow-x-auto whitespace-pre">
                              {log.stack}
                            </pre>
                          </details>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogSettings;
