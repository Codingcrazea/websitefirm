/**
 * ============================================================================
 * File Name: platforms.ts
 * Module: Configuration
 * Purpose: Register supported platforms without leaking platform code into engines.
 * Responsibilities: Expose platform identity and page-match metadata.
 * Called By: service-worker.ts and future platform selection UI.
 * Calls: None.
 * Receives: None.
 * Returns: Supported platform configuration.
 * Dependencies: None.
 * Connected Files: platforms.ts → manifest.json → platforms/linkedin/adapter.ts.
 * Project Phase: Configuration.
 * Notes: Add future platforms here after their independent adapter is created.
 * ============================================================================
 */

/** Identifies one installed social platform integration. */
export interface PlatformConfig {
  id: "linkedin";
  name: string;
  urlPattern: string;
}

/** LinkedIn is the sole enabled platform in version 1. */
export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  { id: "linkedin", name: "LinkedIn", urlPattern: "https://www.linkedin.com/*" },
];
