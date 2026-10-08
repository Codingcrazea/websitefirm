/**
 * ============================================================================
 * File Name: observer.ts
 * Module: LinkedIn platform
 * Purpose: Watch the LinkedIn page for initial and dynamically added posts.
 * Responsibilities: Invoke scanner and parser when DOM changes introduce unseen posts.
 * Called By: adapter.ts.
 * Calls: scanner.ts and parser.ts.
 * Receives: A callback for normalized Lead values.
 * Returns: A cleanup function.
 * Dependencies: MutationObserver, scanner.ts, parser.ts.
 * Connected Files: adapter.ts → observer.ts → scanner.ts → parser.ts.
 * Project Phase: LinkedIn Observer.
 * Notes: MutationObserver supports LinkedIn's infinite-scroll rendering without polling.
 * ============================================================================
 */

import type { Lead } from "../../types/lead";
import { parseLinkedInPost } from "./parser";
import { scanLinkedInPosts } from "./scanner";

function processPosts(root: ParentNode, onLead: (lead: Lead) => void): void {
  scanLinkedInPosts(root).map(parseLinkedInPost).forEach(onLead);
}

/**
 * Purpose: Start observing LinkedIn's dynamic feed and emit each newly parsed lead.
 * Called By: adapter.ts.
 * Calls: scanLinkedInPosts and parseLinkedInPost through processPosts.
 * Parameters: A callback receiving normalized, unclassified Leads.
 * Returns: A function that disconnects the observer.
 * Dependencies: MutationObserver and LinkedIn scanner/parser modules.
 * Side Effects: Reads the current page and attaches a DOM observer.
 * Next Flow: adapter.ts sends emitted Leads to the background worker.
 */
export function observeLinkedInPosts(onLead: (lead: Lead) => void): () => void {
  processPosts(document, onLead);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) processPosts(node, onLead);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
