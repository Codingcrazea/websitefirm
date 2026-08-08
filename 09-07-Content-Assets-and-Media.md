# 09-07 Content, Assets & Media

Version: 2.0

## Purpose

Define how website content and media are stored, edited, uploaded and served without a database.

---

# Storage Model

Use server directories.

```text
/content
/config
/uploads
/public
```

---

# Static Frontend Assets

Use `/public` for assets that are part of the application itself.

Examples:

```text
/public
  /images
  /icons
  /brand
  /fonts
  /illustrations
```

Use this for:

- Logo
- Favicon
- Permanent icons
- Design backgrounds
- Brand illustrations
- Application assets

---

# CMS Uploads

Use `/uploads` for Admin-managed assets.

```text
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

# Content Storage

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
```

---

# File Naming

Use predictable filenames.

Example:

```text
ai-automation-services.md
crm-platform-case-study.md
company-team.md
```

Images:

```text
crm-dashboard.webp
ai-assistant-hero.webp
team-sanskar.webp
```

Avoid spaces and uncontrolled special characters.

---

# Upload Validation

Allow only approved types.

Images:

- JPG/JPEG
- PNG
- WEBP
- AVIF
- SVG where safe

Documents:

- PDF

Videos should use external video hosting where practical rather than uncontrolled server uploads.

---

# Security

Every upload must validate:

- MIME type
- Extension
- File size
- Filename
- Path
- Content where feasible

Prevent:

- Executable uploads
- Script uploads
- Path traversal
- Overwriting arbitrary files

SVG uploads require additional sanitization or should be restricted to trusted administrators.

---

# Image Optimization

Where possible:

- Resize oversized images
- Compress images
- Generate WebP/AVIF
- Preserve useful quality
- Generate suitable thumbnails

Do not store multiple unnecessary copies.

---

# Media Deletion

Admin deletion must:

1. Validate authenticated user
2. Confirm target path is inside the uploads directory
3. Delete only the intended file
4. Never allow arbitrary filesystem deletion

---

# Backup

Because there is no database, backup must include:

```text
/content
/config
/uploads
```

Application source code should be maintained in Git.

Backups should be automated where the hosting environment supports it.

---

# Important Deployment Rule

The production server must provide persistent storage for `/content`, `/config` and `/uploads`.

If the hosting platform uses ephemeral/serverless filesystem storage, this architecture must not be used unchanged for production CMS writes.

---

# Acceptance Criteria

✓ Server-based content  
✓ Server-based media  
✓ Secure uploads  
✓ Predictable paths  
✓ Image optimization  
✓ Backup strategy  
✓ No database  
✓ No arbitrary file access  
