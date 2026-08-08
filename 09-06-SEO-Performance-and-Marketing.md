# 09-06 SEO, Performance & Digital Marketing

Version: 2.0

## Purpose

Make the website search-engine friendly, fast, accessible and conversion-oriented without depending on a database.

---

# SEO Data Source

SEO configuration must come from:

```text
/config/seo.json
```

Page-specific SEO may be stored inside each content item's Markdown/JSON frontmatter.

---

# Global SEO

Support:

- Site title
- Default description
- Default OG image
- Robots policy
- Canonical base URL
- Organization schema
- Website schema
- Social profiles

---

# Page SEO

Every important page must support:

- Meta title
- Meta description
- Canonical
- Robots
- OpenGraph title
- OpenGraph description
- OpenGraph image
- Twitter/X card
- Breadcrumb data
- Structured data where appropriate

---

# Dynamic SEO Flow

```text
Page Request
 ↓
Content Service
 ↓
Content Metadata
 ↓
SEO Generator
 ↓
Next.js Metadata API
```

No SEO record is stored in a database.

---

# Structured Data

Use JSON-LD where appropriate:

- Organization
- WebSite
- WebPage
- BreadcrumbList
- Article
- FAQPage
- Service

Only output schema supported by the actual page content.

---

# Sitemap

Generate sitemap dynamically from:

- Static routes
- Published blogs
- Published portfolio
- Published case studies
- Published services
- Published industries

Draft content must never appear in the sitemap.

---

# Robots

Generate robots rules through Next.js.

Do not expose:

```text
/admin
/api/admin
```

to search engines.

---

# Performance

Use:

- Server Components by default
- Static generation where appropriate
- Dynamic rendering only when required
- Image optimization
- WebP/AVIF where supported
- Lazy loading
- Minimal client JavaScript
- Font optimization
- Code splitting
- Proper caching

---

# Core Web Vitals

Monitor:

- LCP
- INP
- CLS

Also monitor:

- Page weight
- Image weight
- JavaScript size
- Server response time

---

# Accessibility

Target WCAG-aligned practices:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Alt text
- Color contrast
- Accessible forms
- Screen-reader-friendly navigation

---

# Marketing Conversion

Important pages should contain clear CTAs:

- Book a Discovery Call
- Request a Proposal
- Discuss Your Project
- Contact Us

CTA destinations must be configurable.

---

# Analytics

Analytics should be handled by an external analytics service if required.

Do not create an analytics database inside the website.

Possible integrations:

- Google Analytics
- Google Search Console
- Microsoft Clarity
- Other approved analytics tools

Analytics credentials must remain server/configuration controlled where applicable.

---

# Acceptance Criteria

✓ Dynamic metadata  
✓ Dynamic sitemap  
✓ Dynamic robots  
✓ JSON-LD  
✓ SEO-friendly URLs  
✓ OpenGraph  
✓ Performance optimization  
✓ Accessibility  
✓ No database dependency  
