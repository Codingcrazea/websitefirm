# Development Guidelines

Version: 1.0

---

# Purpose

This document defines how every source file must be developed.

The AI Agent must follow every rule in this document.

Never generate code without following these standards.

---

# Code Quality Rules

Every code generated must be

Readable

Reusable

Maintainable

Modular

Well documented

Type Safe

Production Ready

---

# File Creation Rules

Before creating a file, determine

Purpose

Responsibilities

Inputs

Outputs

Dependencies

Caller

Next Flow

If these are unknown,
STOP and determine them first.

---

# Function Rules

Every function must

Have one responsibility

Return predictable output

Handle errors

Have explicit return types

Remain small

Recommended

20-40 lines

Maximum

50 lines

Split larger functions.

---

# Variable Rules

Use meaningful names.

Good

matchedKeywords

leadObject

observerInstance

Bad

a

temp

x

obj

test

---

# Constants

Avoid magic values.

Bad

if(score > 3)

Good

const MIN_SCORE = 3

if(score > MIN_SCORE)

---

# Interfaces

Always create interfaces.

Never use any.

Document every interface.

---

# Error Handling

Every async function must

Use try/catch

Log unexpected errors

Return meaningful responses

Never swallow exceptions.

---

# Logging

Use logger service.

Never use random console.log.

Levels

Info

Warning

Error

Debug

---

# Comments

Document WHY.

Not only WHAT.

Avoid obvious comments.

Bad

// create array

Good

// Store processed IDs to avoid duplicate notifications.

---

# Documentation

Every exported function

Purpose

Parameters

Returns

Throws

Called By

Calls

Next Flow

---

# File Connections

Every source file should explain

Receives Data From

Sends Data To

Used By

Depends On

---

# Storage Rules

Only storage.service.ts

Can

Read Storage

Write Storage

Delete Storage

Other modules must never access storage directly.

---

# Notification Rules

Only notification.service.ts

Can display notifications.

Other modules send notification requests only.

---

# DOM Rules

Only scanner.ts

Should read the page.

Parser

Should never query DOM.

Keyword Engine

Should never query DOM.

Notification

Should never query DOM.

---

# Platform Rules

Platform folder

Contains only platform-specific logic.

Never import LinkedIn files outside platform layer.

---

# React Rules

Use Functional Components.

Use Hooks.

Avoid Class Components.

Keep components small.

Split reusable UI.

---

# TypeScript Rules

Strict Mode

Enabled

No implicit any

No unused variables

No ignored errors

No @ts-ignore unless approved.

---

# Import Order

Node

Chrome API

Third-party

Project Services

Project Engine

Project Types

Utilities

Styles

---

# Testing

Every module

Should be independently testable.

No hidden dependencies.

---

# Before Commit

Verify

Types

Imports

Formatting

Lint

Comments

Documentation

Architecture

Unused code

Unused imports

No warnings

---

# Definition of Done

Task is complete only if

Feature works

Code compiles

No lint errors

No type errors

Comments updated

Documentation updated

Architecture respected

No duplicated logic