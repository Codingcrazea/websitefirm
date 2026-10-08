/**
 * ============================================================================
 * File Name: vite.content.config.ts
 * Module: Content-script build configuration
 * Purpose: Bundle the LinkedIn content script into one browser-classic JavaScript file.
 * Responsibilities: Inline scanner, parser, observer, and adapter dependencies for Manifest V3.
 * Called By: npm run build after the popup/background build.
 * Calls: Vite and Rollup build pipeline.
 * Receives: platforms/linkedin/adapter.ts and its platform dependencies.
 * Returns: dist/linkedin.js.
 * Dependencies: Vite, Node path utilities.
 * Connected Files: manifest.json → linkedin.js ← platforms/linkedin/adapter.ts.
 * Project Phase: Extension Foundation.
 * Notes: Manifest content scripts cannot rely on Vite-created ES module chunk imports.
 * ============================================================================
 */

import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve("src/platforms/linkedin/adapter.ts"),
      output: {
        format: "iife",
        entryFileNames: "linkedin.js",
      },
    },
  },
});
