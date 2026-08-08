# 09-09 Deployment, Operations & Maintenance

Version: 2.0

## Purpose

Define production deployment and maintenance for the database-free company website.

---

# Production Architecture

```text
Internet
   ↓
HTTPS
   ↓
Next.js Application Server
   ├── Public Website
   ├── Admin Panel
   └── API Routes
        │
        ├── /content
        ├── /config
        └── /uploads

Contact API
   ↓
SMTP / Email Provider
   ↓
Company Inbox
```

---

# Critical Hosting Requirement

The application uses server-side file storage for CMS content.

Therefore production hosting MUST provide persistent storage.

Do not assume that a serverless function's local filesystem is persistent.

Before deployment verify:

- Files survive application restart
- Files survive new requests
- Files survive redeployment where intended
- Upload directory persists
- Content directory persists
- Configuration persists
- Backup is possible

---

# Environment Variables

Example:

```text
NODE_ENV=production

APP_URL=

ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
AUTH_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
CONTACT_RECEIVER_EMAIL=

NEXT_PUBLIC_SITE_URL=
```

Only values intended for browser exposure may use `NEXT_PUBLIC_`.

Never expose:

- Admin password
- Auth secret
- SMTP password
- Private API keys

to client-side code.

---

# Deployment Process

1. Install dependencies
2. Validate environment variables
3. Run TypeScript checks
4. Run lint
5. Run tests
6. Build Next.js
7. Prepare persistent content directories
8. Prepare upload directories
9. Set correct filesystem permissions
10. Start production server
11. Verify public website
12. Verify Admin login
13. Verify content editing
14. Verify image upload
15. Verify contact email
16. Verify SEO
17. Verify sitemap
18. Verify backups

---

# Backup Strategy

Because there is no database, the following are critical:

```text
/content
/config
/uploads
```

Back up these directories regularly.

Recommended:

- Daily incremental backup
- Weekly full backup
- Retain multiple backup versions
- Store backups separately from the production server

---

# Git Strategy

Git should contain:

- Application source
- Configuration templates
- Content schema/examples
- `.env.example`
- Documentation

Do NOT commit:

- `.env`
- SMTP credentials
- Admin password
- Private keys
- Sensitive uploads
- Private client documents

Whether CMS-generated content is committed to Git should be a deliberate deployment choice.

---

# Monitoring

Monitor:

- Application uptime
- HTTP errors
- Server errors
- Email delivery failures
- Disk usage
- Upload failures
- SSL certificate
- Backup status

No internal analytics database is required.

---

# Maintenance

Regularly perform:

- Dependency updates
- Security updates
- Backup verification
- Disk cleanup
- Broken-link checks
- SEO checks
- Performance checks
- Image optimization
- Admin credential rotation
- Log cleanup

---

# Disaster Recovery

If the production server fails:

1. Provision a new compatible server
2. Install the application
3. Restore `/content`
4. Restore `/config`
5. Restore `/uploads`
6. Restore environment variables securely
7. Build application
8. Start production server
9. Verify Admin
10. Verify website
11. Verify email
12. Verify SEO
13. Restore DNS if required

---

# Change Management

Before major architecture changes:

- Document the reason
- Identify affected files
- Test in staging
- Back up content
- Deploy during a controlled window
- Verify rollback path

---

# Acceptance Criteria

✓ Persistent storage verified  
✓ Secure environment variables  
✓ Production build process  
✓ CMS content backup  
✓ Upload backup  
✓ Email testing  
✓ Monitoring  
✓ Disaster recovery  
✓ No database dependency  
✓ Production-ready operations
