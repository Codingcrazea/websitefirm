# LinkedIn Monitor Chrome Extension

Version: 1.0.0

---

# Purpose

This document defines the complete development rules, architecture vision, coding standards, documentation standards, module boundaries, and AI Agent responsibilities for this project.

Every AI coding agent MUST read this file before generating any code.

This project MUST follow the rules written here.

No rule should be ignored unless explicitly changed by the project owner.

---

# Project Goal

Develop a production-ready Chrome Extension capable of monitoring LinkedIn posts, identifying user-defined keywords, storing detected leads locally, and sending browser notifications.

The project must be modular, scalable, maintainable, loosely coupled, and easy to extend.

Future social media platforms should be integrated without modifying the core engine.

---

# Current Version Scope

Current Version ONLY supports

- LinkedIn

Future Versions may support

- Reddit
- X (Twitter)
- Facebook
- GitHub
- Discord
- StackOverflow
- Quora

The architecture MUST already support future expansion.

---

# Development Philosophy

Always prioritize

- Readability
- Maintainability
- Loose Coupling
- Reusability
- Small Modules
- Clear Responsibilities
- Strong Documentation

Never write "quick fix" code.

Never duplicate logic.

Never mix business logic with UI logic.

Never create unnecessary dependencies.

---

# Tech Stack

Language

- TypeScript

Frontend

- React
- Vite
- TailwindCSS

Chrome APIs

- Manifest V3
- Chrome Storage API
- Chrome Notification API
- Chrome Tabs API
- Chrome Runtime API

Monitoring

- MutationObserver

Storage

- chrome.storage.local

Testing

- Vitest

Formatting

- ESLint
- Prettier

---

# Architecture Style

The project follows

- Modular Architecture
- Feature Based Structure
- Service Based Design
- Adapter Pattern
- Event Driven Communication
- Single Responsibility Principle

---

# Project Folder

src/

background/

popup/

platforms/

engine/

services/

config/

types/

utils/

assets/

docs/

---

# General Coding Rules

Always

Use TypeScript.

Always define interfaces.

Always use explicit return types.

Always handle errors.

Always validate input.

Always log unexpected errors.

Always keep functions small.

Maximum function size

≈50 lines

Maximum file size

≈300 lines

Split large files into multiple modules.

---

# Naming Convention

Files

kebab-case

Example

notification.service.ts

Variables

camelCase

Functions

camelCase

Classes

PascalCase

Interfaces

PascalCase

Constants

UPPER_SNAKE_CASE

Folders

lowercase

---

# Documentation Rules

Every file MUST begin with a documentation block.

Every exported function MUST include documentation.

Every class MUST include documentation.

Every interface MUST include documentation.

Every complex logic block should include comments.

---

# Mandatory File Header

Every source file MUST begin with

/**
=========================================================

File Name:

Module:

Purpose:

Responsibilities:

Called By:

Calls:

Imports:

Exports:

Input:

Output:

Dependencies:

Notes:

=========================================================
*/

---

# Mandatory Function Header

/**
Purpose:

Called By:

Parameters:

Returns:

Throws:

Next Flow:

*/

---

# Mandatory Inline Comments

Every important logic block should explain

WHY

instead of only

WHAT

Bad

// increment counter

Good

// Increase processed post count so duplicate detection
// can compare the latest processed state.

---

# Connection Documentation

Every file should clearly document

Incoming data

Outgoing data

Who calls this file

Which file this file calls

Every exported function should mention

Called By

Calls

Input

Output

---

# Error Handling Rules

Never ignore exceptions.

Never leave empty catch blocks.

Always log unexpected errors.

Always return meaningful error messages.

---

# Logging Rules

Use centralized logger.

Never use random console.log.

Logger should support

Info

Warning

Error

Debug

---

# Development Rules

Never create temporary code.

Never hardcode selectors unless documented.

Never hardcode keywords.

Never duplicate utility functions.

Never place LinkedIn logic inside Engine.

Never place UI logic inside Services.

---

# Performance Rules

Avoid unnecessary DOM queries.

Cache frequently used selectors.

Avoid repeated parsing.

Avoid duplicate notifications.

Only process newly added posts.

---

# Security Rules

Never store LinkedIn passwords.

Never bypass authentication.

Only work on pages already opened by the user.

Never inject unnecessary scripts.

Never collect personal information.

---

# AI Agent Responsibilities

The AI Agent must

Read project structure.

Understand dependencies.

Generate production-ready code.

Maintain architecture.

Update comments.

Document every function.

Document every exported type.

Keep modules loosely coupled.

Never break existing APIs.

Always explain why code is added.

---

# Before Creating Any File

The AI Agent MUST understand

Purpose

Inputs

Outputs

Dependencies

Caller

Next Flow

No file should be created without understanding these.

---

# Before Completing Any Task

Verify

Compilation

Imports

Types

Formatting

Comments

Documentation

Connections

Architecture

Only after verification may the task be considered complete.
