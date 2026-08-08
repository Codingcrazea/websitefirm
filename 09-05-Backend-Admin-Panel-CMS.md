# 09-05 Backend, Admin Panel & File-Based CMS

Version: 2.0

## Purpose

Build a production-ready backend and Admin Panel without a database.

The website owner must be able to update normal website content without editing React/Next.js source code.

Content is stored on the server as structured files.

Contact enquiries are sent by email and are not stored in a database.

---

# Architecture

```text
Admin Panel
   ↓
Protected Admin API
   ↓
Validation
   ↓
Content / Settings / Media Service
   ↓
Server Files
```

Contact:

```text
Public Form
   ↓
Validation
   ↓
Anti-Spam / Rate Limit
   ↓
Email Service
   ↓
Company Inbox
```

---

# Backend Stack

- Next.js Route Handlers
- TypeScript
- Zod
- Node.js filesystem APIs
- Secure HTTP-only cookies
- JWT or signed session mechanism
- Nodemailer OR approved transactional email provider

Do NOT use:

- Prisma
- PostgreSQL
- MySQL
- MongoDB
- Supabase Database
- Repository-to-database architecture

---

# Folder Structure

```text
app/
  api/
    contact/
    newsletter/
    admin/
      auth/
      content/
      media/
      settings/

  admin/
    login/
    dashboard/
    content/
    media/
    settings/

server/
  auth/
  content/
  media/
  settings/
  email/
  seo/
  validation/
  security/

content/
  blogs/
  portfolio/
  case-studies/
  services/
  solutions/
  industries/
  technologies/
  team/
  testimonials/
  faqs/
  careers/
  resources/

config/
  company.json
  site.json
  navigation.json
  seo.json
  footer.json

uploads/
```

---

# Authentication

Admin authentication must NOT depend on a database.

Admin credentials must be supplied through environment variables or another protected server secret mechanism.

Example concept:

```text
ADMIN_EMAIL
ADMIN_PASSWORD_HASH
AUTH_SECRET
```

Never expose these values to the browser.

Use:

- Secure HTTP-only cookie
- SameSite protection
- HTTPS in production
- Session expiry
- Logout
- Login rate limiting
- Failed-login protection

Do not store plaintext admin passwords.

---

# Admin Roles

Because there is no database, do not create a complex database-backed RBAC system.

For the initial company website use a simple server-configured role model if required:

```text
SUPER_ADMIN
EDITOR
```

Role permissions may be defined in server configuration.

If the company later needs many administrators, client portals or enterprise RBAC, that should be treated as a separate architecture upgrade.

---

# Admin Dashboard

Dashboard should show file-based operational information:

- Published blogs
- Draft blogs
- Portfolio items
- Case studies
- Services
- Media count
- Recent content modifications
- Storage usage
- Website status
- Configuration status

Do not claim database analytics.

---

# CMS Modules

Admin Panel should manage:

- Homepage content
- Blogs
- Portfolio
- Case Studies
- Services
- Solutions
- Industries
- Technologies
- Team
- Testimonials
- FAQs
- Careers
- Resources
- Media
- Navigation
- Footer
- SEO
- Company Settings

---

# Blog Module

Fields:

- Title
- Slug
- Excerpt
- Content
- Category
- Tags
- Author
- Featured image
- Reading time
- Publish date
- Status
- Featured flag
- Meta title
- Meta description
- OG image
- Canonical URL
- Related posts

Storage:

```text
/content/blogs/my-blog.md
```

---

# Portfolio Module

Fields:

- Project title
- Slug
- Description
- Industry
- Technologies
- Project images
- Gallery
- Architecture summary
- Timeline
- Client name if permitted
- Business result
- Testimonial if permitted
- SEO
- Status

---

# Case Study Module

Fields:

- Problem
- Challenge
- Approach
- Solution
- Architecture
- Development
- Deployment
- Results
- Metrics if verified
- Images
- Downloads
- SEO

Never invent project results.

---

# Services Module

Fields:

- Name
- Slug
- Description
- Hero
- Icon
- Features
- Benefits
- Process
- FAQ
- CTA
- SEO
- Display order
- Published status

---

# Industries Module

Fields:

- Industry
- Slug
- Business challenges
- Solutions
- Benefits
- Relevant services
- Relevant technologies
- Projects
- CTA
- SEO

Do not claim specialist experience unless verified.

---

# Technology Module

Fields:

- Technology
- Category
- Logo
- Description
- Related services
- Related projects
- Display order

---

# Team Module

Fields:

- Name
- Designation
- Photo
- Bio
- Skills
- Social links
- Display order
- Published status

---

# Testimonial Module

Fields:

- Client name
- Company
- Photo if authorized
- Quote
- Project
- Rating if genuine
- Video if available
- Published status

Never fabricate testimonials.

---

# FAQ Module

Fields:

- Question
- Answer
- Category
- Display order
- Published status

---

# Careers

Fields:

- Job title
- Department
- Location
- Employment type
- Experience
- Salary if desired
- Description
- Requirements
- Application instructions
- Status

Applications should be emailed unless a separate storage architecture is later approved.

---

# Media Library

Server-based media management.

Capabilities:

- Upload
- Replace
- Rename
- Delete
- Search by filename
- Filter by folder
- Copy public path
- Image preview

Media metadata does not require a database.

Directory structure is the primary organization mechanism.

---

# Contact Form

Contact submissions are NOT persisted.

Required processing:

1. Receive request
2. Validate with Zod
3. Sanitize input
4. Rate limit
5. Spam protection
6. Send email
7. Return success response

Email must be sent to the configured company email.

---

# Newsletter

For the initial implementation, do not maintain a subscriber database.

Options:

- Send subscription notification to company email
- Integrate an external email marketing provider later

Do not build a hidden local subscriber database.

---

# Company Settings

All company information must come from:

```text
/config/company.json
```

Example:

```json
{
  "companyName": "{{COMPANY_NAME}}",
  "tagline": "{{TAGLINE}}",
  "email": "{{SALES_EMAIL}}",
  "phone": "{{PHONE}}",
  "website": "{{WEBSITE}}",
  "address": "{{ADDRESS}}",
  "whatsapp": "{{WHATSAPP}}",
  "linkedin": "{{LINKEDIN}}",
  "github": "{{GITHUB}}",
  "x": "{{X}}",
  "youtube": "{{YOUTUBE}}",
  "logo": "/images/logo.svg"
}
```

Admin Panel should allow editing these values.

---

# API Structure

```text
/api/contact
/api/newsletter

/api/admin/auth/login
/api/admin/auth/logout
/api/admin/auth/session

/api/admin/content/[type]
/api/admin/content/[type]/[slug]

/api/admin/media
/api/admin/media/upload
/api/admin/media/[filename]

/api/admin/settings
/api/admin/seo
```

Public GET routes should expose only published content.

Admin routes must be protected.

---

# Security

Implement:

- Secure cookies
- CSRF protection where applicable
- Rate limiting
- Zod validation
- Output escaping
- Upload validation
- MIME validation
- File-extension validation
- File-size limits
- Path traversal protection
- Authentication
- Authorization
- Audit-style server logs without storing business leads

Never allow an admin request to write arbitrary filesystem paths.

---

# Acceptance Criteria

✓ No database  
✓ File-based CMS  
✓ Admin authentication  
✓ Secure admin API  
✓ Dynamic company settings  
✓ Blog management  
✓ Portfolio management  
✓ Case study management  
✓ Service management  
✓ Media management  
✓ SEO management  
✓ Email-based contact enquiries  
✓ Secure uploads  
✓ No hardcoded credentials  
