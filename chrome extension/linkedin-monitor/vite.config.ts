/**
 * ============================================================================
 * File Name: vite.config.ts
 * Module: Build configuration
 * Purpose: Build the popup and module-capable background worker as extension assets.
 * Responsibilities: Define standard extension entry points and stable manifest-facing file names.
 * Called By: npm run build.
 * Calls: Vite and Rollup build pipeline.
 * Receives: Source entry files.
 * Returns: Extension-ready dist assets.
 * Dependencies: Vite, React plugin, Tailwind plugin, Node path utilities.
 * Connected Files: manifest.json → background.js and src/popup/popup.html.
 * Project Phase: Extension Foundation.
 * Notes: vite.content.config.ts separately emits the self-contained linkedin.js content script.
 * ============================================================================
 */

import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve("src/popup/popup.html"),
        background: resolve("src/background/service-worker.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
