# Risivo Project Updates Platform - Technical Documentation

## Overview

The Project Updates Platform is an integrated part of the Risivo website that provides:
1. **Waitlist Dashboard** - For early bird users to view development updates
2. **Investor Portal** - For investors with NDA-protected content access
3. **Admin Panel** - For managing users, content, and approvals

**Repository:** `velocityautomationcorp/risivo-website`
**Branch:** `genspark_ai_developer`
**Hosting:** Cloudflare Pages (`risivo-production`)
**Database:** Supabase (Project ID: `sldpdgdkrakfzwtroglx`)

---

## Architecture

### Tech Stack
- **Framework:** Hono.js (lightweight web framework)
- **Templating:** JSX/TSX with `hono/html`
- **Build Tool:** Vite
- **Runtime:** Cloudflare Workers
- **Database:** Supabase (PostgreSQL)
- **Email:** SendGrid API
- **Video Hosting:** Wistia
- **Authentication:** Custom session-based auth with HTTP-only cookies

### Project Structure

```
src/
├── api/                    # API endpoint handlers
│   ├── admin/
│   │   └── investor-actions.ts    # Approve/reject/delete investors
│   ├── auth/
│   │   ├── login.ts               # User login
│   │   ├── signup-investor.ts     # Investor registration
│   │   ├── signup-waitlist.ts     # Waitlist registration
│   │   ├── forgot-password.ts     # Password reset request
│   │   └── reset-password.ts      # Password reset completion
│   └── investor/
│       ├── sign-nda.ts            # NDA signature processing
│       ├── check-nda.ts           # NDA status check
│       ├── get-content.ts         # Fetch investor content
│       └── access-content.ts      # Content access logging
├── routes/                 # Route definitions
│   ├── auth-new.ts               # User auth routes (/updates/*)
│   ├── admin-auth.ts             # Admin auth routes (/api/admin/*)
│   ├── admin-investor.ts         # Investor management API
│   └── ...
├── pages/                  # Page templates (TSX)
│   ├── user-login.tsx            # Waitlist login page
│   ├── user-dashboard.tsx        # Waitlist dashboard
│   ├── investor-login.tsx        # Investor login page
│   ├── investor-dashboard-v2.tsx # Investor dashboard
│   ├── investor-nda-review.tsx   # NDA signing page
│   ├── signup-investor.tsx       # Investor signup form
│   ├── admin-login.tsx           # Admin login page
│   ├── admin-dashboard.tsx       # Admin main dashboard
│   └── admin-investor-management.tsx # Investor management
├── utils/
│   └── email.ts                  # EmailService class (SendGrid)
└── index.tsx               # Main app entry point
```

---

## URL Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/updates/login` | Waitlist user login |
| `/updates/signup/waitlist` | Waitlist registration |
| `/updates/signup/investor` | Investor registration |
| `/updates/investor/login` | Investor-specific login |
| `/updates/forgot-password` | Password reset request |
| `/updates/reset-password` | Password reset form |

### Protected Routes (Require Authentication)
| Route | Description | Auth Type |
|-------|-------------|-----------|
| `/updates/dashboard` | Waitlist user dashboard | User session |
| `/updates/investor/nda-review` | NDA signing page | User session (investor) |
| `/updates/investor/dashboard` | Investor dashboard | User session + NDA signed |

### Admin Routes (Require Admin Auth)
| Route | Description |
|-------|-------------|
| `/updates/admin/login` | Admin login |
| `/updates/admin/dashboard` | Admin main dashboard |
| `/updates/admin/investors` | Investor management |
| `/updates/admin/waitlist` | Waitlist management |

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup/waitlist` | Waitlist signup |
| POST | `/api/auth/signup/investor` | Investor signup |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Complete password reset |
| POST | `/api/auth/investor/sign-nda` | Sign NDA |
| GET | `/api/auth/investor/content` | Get investor content |
| GET | `/api/auth/investor/check-nda` | Check NDA status |
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/me` | Get admin info |
| POST | `/api/admin/investor/:id/approve` | Approve investor |
| POST | `/api/admin/investor/:id/reject` | Reject investor |
| DELETE | `/api/admin/investor/:id/delete` | Delete investor |
| GET | `/api/admin/investor/:id/details` | Get investor details |

---

## Database Schema (Supabase)

### Core Tables

#### `users`
```sql
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE NOT NULL
password_hash   VARCHAR NOT NULL
first_name      VARCHAR
last_name       VARCHAR
business_name   VARCHAR
user_type       VARCHAR ('waitlist', 'investor')
investor_status VARCHAR ('pending_nda', 'nda_signed', 'active', 'rejected')
investor_tier   VARCHAR
created_at      TIMESTAMP
updated_at      TIMESTAMP
last_login      TIMESTAMP
```

#### `user_sessions`
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
session_token   VARCHAR UNIQUE NOT NULL
expires_at      TIMESTAMP NOT NULL
ip_address      VARCHAR
user_agent      VARCHAR
created_at      TIMESTAMP
```

#### `nda_signatures`
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES users(id)
full_name_typed     VARCHAR NOT NULL
signature_timestamp TIMESTAMP NOT NULL
ip_address          VARCHAR
user_agent          VARCHAR
nda_version         VARCHAR
nda_text_hash       VARCHAR
created_at          TIMESTAMP
```

#### `admin_users`
```sql
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE NOT NULL
password_hash   VARCHAR NOT NULL
full_name       VARCHAR
role            VARCHAR
created_at      TIMESTAMP
last_login_at   TIMESTAMP
```

#### `admin_sessions`
```sql
id              UUID PRIMARY KEY
admin_user_id   UUID REFERENCES admin_users(id)
session_token   VARCHAR UNIQUE NOT NULL
expires_at      TIMESTAMP NOT NULL
ip_address      VARCHAR
user_agent      VARCHAR
created_at      TIMESTAMP
```

#### `investor_content`
```sql
id              UUID PRIMARY KEY
title           VARCHAR NOT NULL
description     TEXT
content_type    VARCHAR ('pdf', 'video', 'audio', 'link')
file_url        VARCHAR
file_format     VARCHAR
icon            VARCHAR
visibility      VARCHAR ('all_investors', 'active_investors_only')
sort_order      INTEGER
cta_button_text VARCHAR
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `waitlist_users`
```sql
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE NOT NULL
first_name      VARCHAR
last_name       VARCHAR
business_name   VARCHAR
position        INTEGER
created_at      TIMESTAMP
```

---

## Authentication Flow

### User Authentication (Waitlist/Investor)

1. **Login:** `POST /api/auth/login`
   - Validates email/password against `users` table
   - Creates session in `user_sessions` table
   - Sets `user_session` HTTP-only cookie (SameSite=Lax)
   - Returns user info including `user_type` and `investor_status`

2. **Session Validation:**
   - Cookie name: `user_session`
   - Checked against `user_sessions` table
   - Must not be expired

3. **Logout:**
   - Deletes session from database
   - Clears cookie

### Admin Authentication

1. **Login:** `POST /api/admin/login`
   - Validates email/password against `admin_users` table
   - Creates session in `admin_sessions` table
   - Sets `admin_session` HTTP-only cookie

2. **Session Validation:**
   - Cookie name: `admin_session`
   - Checked against `admin_sessions` table with join to `admin_users`

---

## Investor Flow

### 1. Signup
- User visits `/updates/signup/investor`
- Can be pre-filled via URL params: `?email=...&first_name=...&last_name=...&business_name=...`
- On submit: creates user with `user_type='investor'`, `investor_status='pending_nda'`
- Creates session and redirects to NDA review page

### 2. NDA Signing
- User visits `/updates/investor/nda-review`
- Displays NDA text with signature form
- On sign: 
  - Stores signature in `nda_signatures` table
  - Updates user's `investor_status` to `'nda_signed'`
  - Sends confirmation email to investor
  - Sends notification email to admin

### 3. Admin Approval
- Admin views pending investors at `/updates/admin/investors`
- Can approve (status → `'active'`) or reject (status → `'rejected'`)
- Approval triggers email to investor with dashboard access link

### 4. Dashboard Access
- Approved investors can access `/updates/investor/dashboard`
- Shows:
  - Investment Thesis Brief (audio player)
  - Exclusive content cards (video, meeting scheduler)
  - Investor documents (Pitch Deck, Financial Forecast, etc.)

---

## Email Notifications

### EmailService Class (`src/utils/email.ts`)

Uses SendGrid API. Methods:

| Method | When Sent | To |
|--------|-----------|-----|
| `sendWelcomeEmail()` | Waitlist signup | User |
| `sendPasswordResetEmail()` | Password reset request | User |
| `sendInvestorNDAConfirmation()` | After NDA signed | Investor |
| `sendAdminNewInvestorNotification()` | After NDA signed | Admin |
| `sendInvestorApprovalEmail()` | After admin approval | Investor |

### Environment Variables (Cloudflare)
```
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=hello@risivo.com
ADMIN_EMAIL=admin@risivo.com
```

---

## Static Assets

### Location
- Source: `public/` directory
- Build output: `dist/` directory
- Deployed to Cloudflare Pages

### Key Files
```
public/
├── audio/
│   └── investment-thesis-brief.mp3    # Investment thesis audio
├── videos/                            # (Future) Local video files
├── images/
│   ├── risivo-logo.png
│   └── risivo-logo-white.png
└── _routes.json                       # Cloudflare routing config
```

### `_routes.json` Configuration
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/favicon.ico",
    "/images/*",
    "/static/*",
    "/audio/*",
    "/videos/*"
  ]
}
```
**Important:** Paths in `exclude` are served as static files. All other paths go to the worker.

---

## Investor Dashboard Content

### Static Content (Hardcoded)
Located in `src/pages/investor-dashboard-v2.tsx`:

1. **Investment Thesis Brief** - Audio player
   - File: `/audio/investment-thesis-brief.mp3`

2. **Exclusive Investor Content** (2-card grid):
   - **Welcome from Our Founder** - Opens Wistia video modal
     - Video ID: `n7wm9obini`
   - **Schedule Meeting with Founder** - Opens Calendly
     - URL: `https://calendly.com/jp-risivo/45-min`

### Dynamic Content (From Database)
Loaded from `investor_content` table via `/api/auth/investor/content`:
- Pitch Deck (PDF)
- Financial Forecast (PDF)
- Business Plan (PDF)
- Executive Summary (PDF)

**Note:** The "Welcome from Our Founder" video is filtered out from dynamic content to prevent duplication (it's already in the static section).

---

## Known Issues & Recent Fixes

### Fixed Issues
1. ✅ **NDA Full Name defaulting to "Investor"** - Now pre-fills from user data
2. ✅ **NDA signature box** - Implemented with cursive preview
3. ✅ **"Invalid session" error after NDA signing** - Fixed cookie name mismatch
4. ✅ **Redirect to wrong dashboard** - Now correctly redirects to investor dashboard
5. ✅ **Email notifications not sending** - Fixed SendGrid configuration
6. ✅ **Admin login failing** - Removed non-existent `is_active` column check
7. ✅ **Audio/video 404 errors** - Added `/audio/*` and `/videos/*` to `_routes.json`

### Current Configuration
- **Cookie name:** `user_session` (for users), `admin_session` (for admins)
- **Cookie settings:** `httpOnly: true`, `secure: true`, `sameSite: 'Lax'`
- **Session duration:** 30 days (users), 7 days (admins)

---

## Deployment

### Commands
```bash
# Pull latest changes
git pull origin genspark_ai_developer

# Build
npm run build

# Deploy to Cloudflare Pages
npm run deploy:production
```

### Environment Variables (Cloudflare Dashboard)
Go to: Pages → risivo-production → Settings → Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `SENDGRID_API_KEY` | SendGrid API key |
| `FROM_EMAIL` | Sender email (must be verified in SendGrid) |
| `ADMIN_EMAIL` | Admin notification email |

---

## Testing Checklist

### Investor Flow
- [ ] Signup at `/updates/signup/investor`
- [ ] Receive redirect to NDA page
- [ ] Sign NDA successfully
- [ ] Investor receives confirmation email
- [ ] Admin receives notification email
- [ ] Admin can approve investor
- [ ] Investor receives approval email
- [ ] Investor can login and access dashboard
- [ ] Audio player works
- [ ] Video modal opens
- [ ] Calendly link works
- [ ] Documents are accessible

### Admin Flow
- [ ] Login at `/updates/admin/login`
- [ ] View investor management
- [ ] Approve/reject/delete investors
- [ ] Email notifications sent correctly

---

## Contact & Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
- **Cloudflare Dashboard:** https://dash.cloudflare.com (risivo-production)
- **SendGrid Dashboard:** https://app.sendgrid.com
- **Wistia Dashboard:** https://risivo.wistia.com

---

*Last Updated: December 29, 2025*
