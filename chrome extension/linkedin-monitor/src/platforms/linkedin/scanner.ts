/**
 * ============================================================================
 * File Name: scanner.ts
 * Module: LinkedIn platform
 * Purpose: Locate newly visible LinkedIn feed posts and extract raw platform fields.
 * Responsibilities: Perform all LinkedIn DOM reads and return raw post data only once.
 * Called By: observer.ts.
 * Calls: Native DOM selector APIs.
 * Receives: A DOM root containing potential LinkedIn content.
 * Returns: Raw LinkedIn post data for parser.ts.
 * Dependencies: helper.ts.
 * Connected Files: observer.ts → scanner.ts → parser.ts.
 * Project Phase: LinkedIn Scanner.
 * Notes: Selectors are deliberately isolated here because LinkedIn markup changes frequently.
 * ============================================================================
 */

import { normalizeText } from "../../utils/helper";

/** Raw data collected from LinkedIn DOM before conversion to a shared Lead. */
export interface RawLinkedInPost {
  sourceUrl: string;
  authorName: string;
  authorProfileUrl?: string;
  content: string;
  publishedAt?: string;
  timeText?: string;
}

const POST_SELECTORS = "article, [data-urn*='activity'], .feed-shared-update-v2, .reusable-search__result-container, .entity-result";
const AUTHOR_SELECTORS = ".update-components-actor__name, .feed-shared-actor__name, [data-test-id='actor-name'], .entity-result__title-text, .entity-result__title-line, .entity-result__title-text a";
const CONTENT_SELECTORS = ".update-components-text, .feed-shared-update-v2__description, [data-test-id='main-feed-activity-card__commentary'], .entity-result__summary, .entity-result__content-summary";

function getUnscannedPostElements(root: ParentNode): HTMLElement[] {
  const candidates: HTMLElement[] = [];
  if (root instanceof HTMLElement && root.matches(POST_SELECTORS)) {
    candidates.push(root);
  }
  const descendants = root.querySelectorAll<HTMLElement>(POST_SELECTORS);
  candidates.push(...descendants);
  return candidates.filter((element) => element.dataset.linkedinMonitorScanned !== "true");
}

function readPostElement(element: HTMLElement): RawLinkedInPost {
  // Find author profile link. Look for links containing /in/ inside the container
  const authorLink = element.querySelector<HTMLAnchorElement>("a[href*='/in/']");
  
  // Extract and clean up author name to filter out connection degree (e.g. • 2nd) or sub-texts
  let authorName = normalizeText(element.querySelector(AUTHOR_SELECTORS)?.textContent) || "LinkedIn member";
  if (authorName.includes("•")) {
    authorName = authorName.split("•")[0].trim();
  }
  if (authorName.includes("\n")) {
    authorName = authorName.split("\n")[0].trim();
  }

  // Extract post content text, falling back to innerText if specific selectors are absent
  const content = normalizeText(element.querySelector(CONTENT_SELECTORS)?.textContent) || normalizeText(element.innerText);
  
  // Extract post URL by checking typical link targets or generating from URN data attribute
  let postUrl = element.querySelector<HTMLAnchorElement>("a[href*='/feed/update/'], a[href*='/posts/']")?.href;
  if (!postUrl) {
    const urn = element.getAttribute("data-urn") || element.querySelector("[data-urn]")?.getAttribute("data-urn");
    if (urn && urn.includes("activity:")) {
      postUrl = `https://www.linkedin.com/feed/update/${urn}`;
    }
  }

  const timeElement = element.querySelector("time");
  const publishedAt = timeElement?.getAttribute("datetime") ?? undefined;
  const timeText = timeElement ? normalizeText(timeElement.textContent) : undefined;

  return {
    sourceUrl: postUrl ?? window.location.href,
    authorName,
    authorProfileUrl: authorLink?.href,
    content,
    publishedAt,
    timeText,
  };
}

/**
 * Purpose: Read each unprocessed LinkedIn post once to reduce duplicate DOM work.
 * Called By: observer.ts and adapter.ts.
 * Calls: DOM selectors and readPostElement.
 * Parameters: The document or mutation subtree to scan.
 * Returns: Raw LinkedIn post records with no business decision applied.
 * Dependencies: LinkedIn DOM and normalizeText.
 * Side Effects: Marks scanned post elements to avoid repeat processing during infinite scroll.
 * Next Flow: Every raw record is passed to parser.ts by observer.ts or adapter.ts.
 */
export function scanLinkedInPosts(root: ParentNode = document): RawLinkedInPost[] {
  return getUnscannedPostElements(root).map((element) => {
    element.dataset.linkedinMonitorScanned = "true";
    return readPostElement(element);
  }).filter((post) => post.content.length > 0);
}
