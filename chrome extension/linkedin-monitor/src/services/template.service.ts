/**
 * ============================================================================
 * File Name: template.service.ts
 * Module: Services
 * Purpose: Manage CRUD operations for auto-comment templates in popup UI.
 * Responsibilities: Request templates, validate template limit (max 4), add, delete, or update templates.
 * Called By: popup/CommentSettings, popup/CommentTemplateManager.
 * Calls: chrome.runtime.sendMessage
 * Receives: Templates updates.
 * Returns: CommentTemplate promises.
 * Dependencies: CommentTemplate interface.
 * Connected Files: template.service.ts -> service-worker.ts -> storage.service.ts
 * Project Phase: Comment Management
 * Notes: Limits templates to a maximum of 4 to prevent clutter and database abuse.
 * ============================================================================
 */

import type { CommentTemplate } from "../types/comment-template";

/**
 * Purpose: Retrieve the current list of comment templates.
 * Called By: popup components.
 * Parameters: None.
 * Returns: Promise resolving to CommentTemplate[].
 * Throws: Error if chrome runtime communication fails.
 * Next Flow: UI renders active templates.
 */
export async function getTemplates(): Promise<CommentTemplate[]> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "GET_TEMPLATES" }, (response: unknown) => {
      const error = chrome.runtime.lastError?.message;
      if (error) {
        reject(new Error(error));
        return;
      }
      resolve((response as CommentTemplate[]) || []);
    });
  });
}

/**
 * Purpose: Save the templates array after validating limit.
 * Called By: popup components or within this service.
 * Parameters: templates - CommentTemplate[]
 * Returns: Promise resolving when saved.
 * Throws: Error if limit (>4) is exceeded or chrome runtime communication fails.
 * Next Flow: Background persists templates list.
 */
export async function saveTemplates(templates: CommentTemplate[]): Promise<void> {
  if (templates.length > 4) {
    throw new Error("Maximum of 4 templates allowed.");
  }
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "SAVE_TEMPLATES", templates }, (_response: unknown) => {
      const error = chrome.runtime.lastError?.message;
      if (error) {
        reject(new Error(error));
        return;
      }
      resolve();
    });
  });
}

/**
 * Purpose: Add a new comment template.
 * Called By: popup template manager form.
 * Parameters: name - string, content - string
 * Returns: Promise resolving when added.
 * Throws: Error if maximum templates (4) limit is reached.
 * Next Flow: Templates list is updated.
 */
export async function addTemplate(name: string, content: string): Promise<void> {
  const templates = await getTemplates();
  if (templates.length >= 4) {
    throw new Error("Cannot add template: Maximum limit of 4 templates reached.");
  }
  const newTemplate: CommentTemplate = {
    id: crypto.randomUUID(),
    name: name.trim(),
    content: content.trim(),
  };
  await saveTemplates([...templates, newTemplate]);
}

/**
 * Purpose: Delete a comment template by ID.
 * Called By: popup template list remove button.
 * Parameters: id - string
 * Returns: Promise resolving when deleted.
 * Throws: Error if chrome runtime communication fails.
 * Next Flow: Templates list is updated.
 */
export async function deleteTemplate(id: string): Promise<void> {
  const templates = await getTemplates();
  await saveTemplates(templates.filter((t) => t.id !== id));
}

/**
 * Purpose: Update an existing comment template.
 * Called By: popup template edit form.
 * Parameters: updated - CommentTemplate
 * Returns: Promise resolving when updated.
 * Throws: Error if chrome runtime communication fails.
 * Next Flow: Templates list is updated.
 */
export async function updateTemplate(updated: CommentTemplate): Promise<void> {
  const templates = await getTemplates();
  await saveTemplates(templates.map((t) => (t.id === updated.id ? updated : t)));
}
