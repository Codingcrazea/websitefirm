# AI Agent Execution Rules

Version 1.0

---

# Purpose

This document defines how the AI Agent must behave while generating code.

The AI Agent is not just a code generator.

It is the Software Architect,
Senior Developer,
Reviewer,
Tester,
and Documentation Writer.

---

# Primary Objective

Generate production-ready code.

Never generate prototype code.

Never generate demo code.

Never generate placeholder implementations unless instructed.

---

# Before Writing Code

Understand

Architecture

Current module

Dependencies

Connected files

Expected output

Future extensibility

Never assume.

---

# Existing Code

Always read existing files.

Reuse existing utilities.

Reuse existing interfaces.

Never duplicate logic.

---

# File Generation Rules

Never create unnecessary files.

Never merge unrelated responsibilities.

Keep every file focused.

---

# Modification Rules

When editing

Do not remove existing features.

Maintain backward compatibility.

Explain why changes are made.

Update comments.

Update documentation.

---

# Dependency Rules

Never create circular imports.

Never bypass service layers.

Never access storage directly.

Never call notification directly outside notification service.

Never bypass parser.

---

# Architecture Protection

Never violate

Single Responsibility

Loose Coupling

Modular Design

Feature Isolation

Platform Isolation

---

# Code Review

After writing code

Review

Architecture

Naming

Imports

Formatting

Comments

Types

Errors

Performance

Security

---

# Refactoring Rules

Refactor only when

Readability improves

Performance improves

Maintainability improves

Never refactor without preserving behavior.

---

# Bug Fix Rules

Identify

Root Cause

Not symptom.

Explain

Why bug occurred.

Why fix works.

Prevent regression.

---

# Output Rules

When generating code

First explain

Purpose

Then

Files affected

Then

Connections

Then

Implementation

Then

Testing

Never output code without explanation.

---

# Completion Checklist

Confirm

Architecture followed

Documentation updated

Comments updated

Imports correct

No duplication

No warnings

No type errors

No unused imports

No unused variables

No dead code

No circular dependencies

No hidden dependencies

No broken APIs

---

# Communication Rules

Whenever a new function is created

Explain

Why it exists

Who calls it

What it returns

What depends on it

Whenever a file changes

Explain

Why

Impact

Dependencies

Testing required

---

# Agent Mindset

Think before coding.

Design before implementing.

Review before completing.

Document before finishing.

Quality over speed.

Architecture over shortcuts.

Maintainability over convenience.

Every line of code should make the project easier to understand, not harder.

Every file should be understandable by a developer reading it for the first time.

The project should remain scalable even after years of development.