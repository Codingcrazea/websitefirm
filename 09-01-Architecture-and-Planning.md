# 09-01 Architecture & Planning

Version: 2.0

## Purpose

Define the production architecture for the company website built with Next.js.

The website is intentionally **database-free**.

Normal website content, CMS content, company information, SEO configuration and uploaded media are stored on the application server using structured files and directories.

The system must remain modular, secure, maintainable and SEO-friendly.

---

# Core Architecture

```text
Visitor
  ↓
Next.js App Router
  ↓
Server Components / Client Components
  ↓
Server Services
  ↓
Content / Configuration / Media Files

Contact Form
  ↓
Next.js Route Handler
  ↓
Validation + Rate Limiting
  ↓
Email Service
  ↓
Company Email Inbox
```

Admin:

```text
Admin Browser
  ↓
Admin Login
  ↓
HTTP-Only Secure Session Cookie
  ↓
Protected Admin Routes
  ↓
Admin API
  ↓
Server File Services
  ↓
Content / Configuration / Media
```

---

# Technology Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- Zod
- Server-side file APIs
- Nodemailer or another transactional email provider
- JWT or signed secure session cookie
- Node.js runtime
- Persistent server storage

Do not introduce Prisma, PostgreSQL, MongoDB, MySQL, Supabase Database or another database.

---

# Storage Philosophy

Use the server filesystem as the content source.

Recommended structure:

```text
/content
  /blogs
  /portfolio
  /case-studies
  /services
  /solutions
  /industries
  /technologies
  /team
  /testimonials
  /faqs
  /careers
  /resources

/config
  company.json
  site.json
  navigation.json
  seo.json
  footer.json

/uploads
  /blogs
  /portfolio
  /case-studies
  /team
  /testimonials
  /careers
  /documents
```

---

# Content Formats

Use JSON for structured global settings.

Use Markdown or JSON for editorial content.

Recommended:

- `company.json` — company/contact/branding
- `site.json` — website-wide settings
- `navigation.json` — menus
- `seo.json` — global SEO
- Markdown/JSON — blogs, case studies, portfolio and service content

Every content item must have a stable slug.

---

# Dynamic Content Principle

Do not hardcode normal business content inside React components.

Components should consume content through server-side content services.

Example:

```text
Page
 ↓
Content Service
 ↓
/content/services/
 ↓
Service data
 ↓
Reusable UI
```

---

# Contact Architecture

Contact information submitted by visitors is NOT stored in a database.

```text
Form
 ↓
Zod Validation
 ↓
Rate Limit / Anti-Spam
 ↓
Email Service
 ↓
Company Inbox
```

The email should include:

- Name
- Company
- Email
- Phone
- Country
- Project type
- Budget range
- Message
- Submission timestamp
- Source page

No persistent lead record is required.

---

# Admin Architecture

Admin Panel is part of the same Next.js application.

```text
/app/admin
/app/api/admin
/server/auth
/server/content
/server/media
/server/email
/server/settings
```

The Admin Panel can create, edit, publish and delete server-side content.

---

# Deployment Constraint

The selected hosting environment MUST provide persistent storage if server-side files are used as the production CMS source.

Do not deploy this architecture to a serverless environment where local filesystem writes disappear between invocations.

If a deployment platform does not provide persistent filesystem storage, use a compatible persistent storage layer or change the deployment architecture before production.

---

# Non-Negotiable Rules

- No database
- No Prisma
- No hardcoded company contact information
- No hardcoded CMS content inside components
- No sensitive secrets in client-side code
- No admin credentials in source code
- No contact-query database
- Validate every write operation
- Validate every uploaded file
- Protect all admin APIs
- Back up content and uploads
- Keep public website and Admin Panel in the same architectural system unless explicitly approved

---

# Acceptance Criteria

✓ Next.js App Router  
✓ Database-free  
✓ File-based content management  
✓ Dynamic company settings  
✓ Server-side media storage  
✓ Protected Admin Panel  
✓ Email-only contact enquiries  
✓ SEO-ready  
✓ Persistent production storage requirement documented  
✓ Backup strategy documented  
