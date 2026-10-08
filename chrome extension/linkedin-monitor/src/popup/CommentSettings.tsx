/**
 * ============================================================================
 * File Name: CommentSettings.tsx
 * Module: popup
 * Purpose: Render user interface for comment template CRUD operations and settings.
 * Responsibilities: Manage auto-comment settings and perform template CRUD (max 4 templates limit).
 * Called By: SettingsDashboard.tsx
 * Calls: settings.service.ts, template.service.ts
 * Receives: Current settings configuration.
 * Returns: CommentSettings component JSX.
 * Dependencies: ExtensionSettings, CommentTemplate, React hooks.
 * Connected Files: SettingsDashboard.tsx -> CommentSettings.tsx
 * Project Phase: Comment Management
 * Notes: Limits templates to exactly 4 items max.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import type { ExtensionSettings } from "../types/settings";
import type { CommentTemplate } from "../types/comment-template";
import { getTemplates, addTemplate, deleteTemplate, updateTemplate } from "../services/template.service";

interface Props {
  settings: ExtensionSettings | null;
  onSave: (newSettings: ExtensionSettings) => void;
}

export const CommentSettings: React.FC<Props> = ({ settings, onSave }) => {
  const [autoCommentEnabled, setAutoCommentEnabled] = useState(false);
  const [templates, setTemplates] = useState<CommentTemplate[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setAutoCommentEnabled(settings.autoCommentEnabled ?? false);
    }
    loadTemplates();
  }, [settings]);

  const loadTemplates = () => {
    getTemplates()
      .then(setTemplates)
      .catch(() => setError("Failed to load comment templates."));
  };

  const handleSaveSettings = () => {
    if (!settings) return;
    const newSettings: ExtensionSettings = {
      ...settings,
      autoCommentEnabled,
    };
    onSave(newSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nameInput.trim() || !contentInput.trim()) {
      setError("Please fill in both name and content fields.");
      return;
    }
    try {
      await addTemplate(nameInput, contentInput);
      setNameInput("");
      setContentInput("");
      loadTemplates();
    } catch (err: any) {
      setError(err.message || "Unable to add template.");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    setError("");
    try {
      await deleteTemplate(id);
      loadTemplates();
      if (editingId === id) {
        setEditingId(null);
      }
    } catch (err: any) {
      setError("Unable to delete template.");
    }
  };

  const handleStartEdit = (template: CommentTemplate) => {
    setEditingId(template.id);
    setEditName(template.name);
    setEditContent(template.content);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!editName.trim() || !editContent.trim()) {
      setError("Please fill in both name and content fields for edit.");
      return;
    }
    if (!editingId) return;
    try {
      await updateTemplate({
        id: editingId,
        name: editName.trim(),
        content: editContent.trim(),
      });
      setEditingId(null);
      loadTemplates();
    } catch (err: any) {
      setError("Unable to update template.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">Comment Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Automate comments on matched leads using customizable templates.
        </p>
      </div>

      {/* Auto-comment Toggle */}
      <div className="space-y-4 border-b border-slate-100 pb-5">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-1 cursor-pointer"
            checked={autoCommentEnabled}
            onChange={(e) => setAutoCommentEnabled(e.target.checked)}
          />
          <div>
            <span className="text-sm font-medium text-slate-700">Enable Automated Commenting</span>
            <p className="text-xs text-slate-500">
              When enabled, the extension will attempt to post a comment on matched leads.
            </p>
          </div>
        </label>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1.5 px-4 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            Save Toggle Settings
          </button>
          {isSaved && (
            <span className="text-xs text-emerald-600 font-medium">✓ Saved!</span>
          )}
        </div>
      </div>

      {/* Templates Section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 flex justify-between items-center mb-3">
          <span>Templates List</span>
          <span className="text-xs font-normal text-slate-500">{templates.length} / 4 templates</span>
        </h3>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
            ⚠ {error}
          </div>
        )}

        {/* Existing templates list */}
        {templates.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded">
            No templates configured yet. Create one below.
          </p>
        ) : (
          <div className="space-y-3 mb-6">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                {editingId === tpl.id ? (
                  <form onSubmit={handleSaveEdit} className="space-y-2">
                    <input
                      type="text"
                      className="block w-full text-xs font-medium p-1.5 border rounded"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <textarea
                      className="block w-full text-xs p-1.5 border rounded resize-none"
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex space-x-2 pt-1">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-2.5 py-1 rounded text-2xs font-medium hover:bg-indigo-700 cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-2xs font-medium hover:bg-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-slate-800">{tpl.name}</h4>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(tpl)}
                          className="text-2xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          className="text-2xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-2xs text-slate-600 whitespace-pre-wrap leading-normal font-mono bg-slate-50 p-1.5 rounded">
                      {tpl.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Template Form */}
        {templates.length < 4 ? (
          <form onSubmit={handleAddTemplate} className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md space-y-3">
            <h4 className="text-xs font-semibold text-slate-700">Add New Template</h4>
            <div>
              <label htmlFor="tpl-name" className="block text-2xs font-medium text-slate-500 mb-0.5">
                Template Name
              </label>
              <input
                type="text"
                id="tpl-name"
                placeholder="e.g. Greeting Template"
                className="block w-full text-xs p-2 border rounded bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="tpl-content" className="block text-2xs font-medium text-slate-500 mb-0.5">
                Template Body Content
              </label>
              <textarea
                id="tpl-content"
                rows={3}
                placeholder="e.g. Hello, I noticed your post about {keyword}. I would love to connect!"
                className="block w-full text-xs p-2 border rounded bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded bg-indigo-600 py-1.5 px-3 text-xs font-medium text-white shadow hover:bg-indigo-700 cursor-pointer"
            >
              Add Template
            </button>
          </form>
        ) : (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 text-center font-medium">
            🛈 Maximum limit of 4 templates reached. Delete an existing template to add a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSettings;
