/**
 * ============================================================================
 * File Name: logger.ts
 * Module: Utilities
 * Purpose: Centralize diagnostic output for extension modules.
 * Responsibilities: Apply a consistent, searchable prefix to unexpected errors and events.
 * Called By: All modules that need diagnostics.
 * Calls: Browser console methods.
 * Receives: Message text and optional safe diagnostic context.
 * Returns: Nothing.
 * Dependencies: None.
 * Connected Files: Every service, engine, platform module, and service worker.
 * Project Phase: Shared Services.
 * Notes: Logging must not contain LinkedIn credentials or sensitive data.
 * ============================================================================
 */

type LogContext = Record<string, unknown>;

/**
 * Purpose: Write standardized diagnostics so integration failures are traceable.
 * Called By: Project modules.
 * Calls: console.info, console.warn, console.error, console.debug.
 * Parameters: A message and optional non-sensitive context.
 * Returns: Nothing.
 * Dependencies: Browser console.
 * Side Effects: Emits a browser-console entry.
 * Next Flow: Developers can inspect the extension service-worker or page console.
 */
export const logger = {
  info(message: string, context?: LogContext): void { console.info("[LinkedIn Monitor]", message, context); },
  warn(message: string, context?: LogContext): void { console.warn("[LinkedIn Monitor]", message, context); },
  error(message: string, context?: LogContext): void { console.error("[LinkedIn Monitor]", message, context); },
  debug(message: string, context?: LogContext): void { console.debug("[LinkedIn Monitor]", message, context); },
};
