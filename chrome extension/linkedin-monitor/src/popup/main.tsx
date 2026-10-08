/**
 * ============================================================================
 * File Name: main.tsx
 * Module: Popup UI
 * Purpose: Bootstrap the React popup application.
 * Responsibilities: Mount the dashboard into popup.html.
 * Called By: popup.html.
 * Calls: React createRoot and App.
 * Receives: Popup DOM root.
 * Returns: Rendered popup UI.
 * Dependencies: React, App.tsx, popup.css.
 * Connected Files: popup.html → main.tsx → App.tsx.
 * Project Phase: Popup UI.
 * Notes: This entry is intentionally separate from the Vite starter page entry.
 * ============================================================================
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./popup.css";

/*
Purpose: Mount the popup-specific React tree into the manifest-facing document.
Connected Files: popup.html supplies #root; App.tsx supplies the dashboard content.
Input: The popup DOM root created by popup.html.
Output: Rendered dashboard UI.
Next Flow: App.tsx requests state from service-worker.ts.
*/
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
