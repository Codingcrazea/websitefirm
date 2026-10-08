# System Architecture

---

# Folder Responsibilities

## background/

Purpose

Extension lifecycle.

Responsibilities

Start extension

Receive messages

Manage runtime

Handle alarms

Communicate with popup

Communicate with content scripts

No business logic here.

---

## popup/

Purpose

User Interface

Responsibilities

Dashboard

Settings

Keyword Management

Lead List

Notification History

Status Display

No DOM scanning.

---

## platforms/

Purpose

Platform-specific implementation.

Current

platforms/

linkedin/

Future

platforms/

reddit/

platforms/

twitter/

platforms/

facebook/

Every platform must remain independent.

Never access another platform's files.

---

## LinkedIn Folder

Contains

adapter.ts

scanner.ts

parser.ts

observer.ts

---

### adapter.ts

Purpose

Entry point.

Responsibilities

Initialize LinkedIn module.

Connect Observer.

Connect Scanner.

Send parsed leads into Engine.

No parsing logic.

No keyword matching.

---

### scanner.ts

Purpose

Find posts.

Responsibilities

Locate DOM.

Extract post containers.

Return raw elements.

No parsing.

---

### parser.ts

Purpose

Convert raw HTML into Lead objects.

No keyword detection.

No notification.

---

### observer.ts

Purpose

Watch LinkedIn page.

Detect

New Posts

Infinite Scroll

DOM Updates

Call Scanner when needed.

---

## engine/

Purpose

Business Logic.

Contains

keyword.engine.ts

duplicate.engine.ts

Responsibilities

Keyword Matching

Duplicate Detection

Filtering

Future AI

Platform Independent.

---

## services/

Purpose

Reusable Services.

Contains

notification.service.ts

storage.service.ts

Future

export.service.ts

email.service.ts

Responsibilities

Shared functionality only.

Never include LinkedIn logic.

---

## config/

Purpose

Application Configuration.

Contains

keywords.ts

settings.ts

platforms.ts

Configuration only.

No business logic.

---

## utils/

Purpose

Shared Helpers.

Contains

Logger

Validators

Date Helpers

Formatters

Never add business logic.

---

## types/

Purpose

Shared Types.

Contains

Interfaces

Enums

Models

Reusable types only.

---

# Communication Flow

User

↓

Popup

↓

Background

↓

Platform Adapter

↓

Observer

↓

Scanner

↓

Parser

↓

Keyword Engine

↓

Duplicate Engine

↓

Storage

↓

Notification

---

# Dependency Rules

Popup

Can call

Services

Config

Background

Cannot call

Scanner

Parser

Observer

---

Scanner

Can call

Parser

Cannot call

Notification

Storage

Popup

---

Parser

Can return

Lead Object

Cannot

Store Data

Notify User

---

Keyword Engine

Can call

Duplicate Engine

Cannot access DOM.

---

Notification

Cannot access DOM.

Cannot scan LinkedIn.

Only display notifications.

---

Storage

Only save.

Only retrieve.

No UI.

No keyword matching.

---

# Import Rules

Never import

Popup into Engine

Never import

Engine into Config

Never import

Platform into Notification

Never create circular dependencies.

---

# Module Boundaries

Platform Layer

↓

Engine Layer

↓

Service Layer

↓

UI Layer

Keep responsibilities isolated.

---

# Extension Flow

Extension Starts

↓

Load Config

↓

Initialize Background

↓

Detect LinkedIn Tab

↓

Load Adapter

↓

Observer Starts

↓

Scanner Finds Posts

↓

Parser Creates Lead

↓

Engine Matches Keywords

↓

Duplicate Check

↓

Save Lead

↓

Show Notification

↓

Update Popup

---

# Future Platform Integration

To add Reddit

Create

platforms/

reddit/

adapter.ts

scanner.ts

parser.ts

observer.ts

Register platform inside

config/platforms.ts

No changes should be required inside

Engine

Services

Popup

Storage

Notification

---

# AI Agent Rules

Before writing any code

Understand

Caller

Purpose

Dependency

Flow

Input

Output

After writing code

Verify

Imports

Types

Comments

Architecture

Documentation

No file should violate these rules.
