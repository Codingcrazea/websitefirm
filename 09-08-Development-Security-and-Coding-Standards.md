# 09-08 Development, Security & Coding Standards

Version: 2.0

## Purpose

Define coding and security standards for the database-free Next.js company website.

---

# Architecture Rule

Use:

```text
Route Handler
 ↓
Validation
 ↓
Service
 ↓
File / Email / External Service
```

Do not place business logic directly inside UI components or route handlers.

---

# Server Services

Recommended services:

```text
/server
  /auth
  /content
  /media
  /settings
  /email
  /seo
  /security
```

Responsibilities:

### Auth Service

Admin authentication and session management.

### Content Service

Read/write Markdown and JSON content.

### Media Service

Upload, validate, rename and delete media.

### Settings Service

Read/write company and website settings.

### Email Service

Send contact and application emails.

### SEO Service

Generate metadata and structured data.

---

# Validation

Use Zod for:

- Contact forms
- Admin forms
- Settings
- Content metadata
- Upload metadata
- Newsletter requests

Never trust browser validation alone.

---

# Authentication

Admin authentication must:

- Run server-side
- Use secure HTTP-only cookies
- Use hashed passwords
- Use strong session secrets
- Expire sessions
- Rate-limit login attempts
- Provide logout

Never send admin secrets to client JavaScript.

---

# Authorization

Every Admin API must verify the current session.

A user must not be able to bypass the Admin UI and directly call an Admin API.

---

# File Security

Never accept arbitrary paths from the browser.

Resolve paths internally from controlled content types and slugs.

Example:

```text
type = blogs
slug = my-post
```

must map to a controlled directory.

Never accept:

```text
../../some-server-file
```

as a filesystem target.

---

# Email Security

The contact endpoint must protect against:

- Spam
- Flooding
- Header injection
- Invalid email addresses
- Oversized payloads

Never put user-provided values directly into SMTP headers without validation.

---

# Secrets

Secrets belong in environment variables.

Examples:

```text
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
AUTH_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
CONTACT_RECEIVER_EMAIL=
```

Never commit `.env`.

Provide `.env.example`.

---

# Logging

Server logs may record:

- Authentication events
- Errors
- Upload failures
- Email failures
- Admin actions

Do not log:

- Passwords
- Authentication secrets
- SMTP passwords
- Sensitive user content unnecessarily

---

# TypeScript

Use strict TypeScript.

Avoid `any`.

Define explicit types for:

- Content
- Settings
- SEO
- Admin session
- API responses
- Forms

---

# Components

Keep components:

- Focused
- Reusable
- Typed
- Accessible
- Theme-aware

Do not put filesystem or SMTP logic inside React components.

---

# Error Handling

Every API should return predictable errors.

Do not expose:

- Stack traces
- Internal filesystem paths
- Environment variables
- Server configuration
- Authentication details

to public users.

---

# Acceptance Criteria

✓ Strict TypeScript  
✓ Zod validation  
✓ Secure admin authentication  
✓ Secure file operations  
✓ Secure email handling  
✓ Environment-based secrets  
✓ Safe logging  
✓ No database  
✓ No sensitive data exposure  
