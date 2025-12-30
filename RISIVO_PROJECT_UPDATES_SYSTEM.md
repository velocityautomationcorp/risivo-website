# Risivo Project Updates System - Complete Documentation

**Version:** 1.0  
**Last Updated:** December 30, 2025  
**Author:** Development Team  

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [User Flows](#user-flows)
5. [API Endpoints](#api-endpoints)
6. [Email Templates](#email-templates)
7. [Admin Dashboard Features](#admin-dashboard-features)
8. [Known Issues & Solutions](#known-issues--solutions)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Risivo Project Updates System is a comprehensive content management and user engagement platform with three main user types:

1. **Waitlist Subscribers** - Early access users who can view public updates
2. **Investors** - NDA-protected users with access to confidential materials
3. **Administrators** - Full system access for content and user management

### Key Features

- Multi-tier user authentication system
- NDA signing workflow with admin approval
- Content management (Updates, Documents)
- User engagement tracking (Views, Likes, Dislikes)
- Gallery and video support
- Email notifications for all user events
- Real-time error monitoring

---

## System Architecture

### Technology Stack

- **Frontend:** HTML/CSS/JavaScript (inline in Hono templates)
- **Backend:** Hono.js (TypeScript)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Cloudflare Pages
- **Email:** SendGrid
- **File Storage:** Supabase Storage (bucket: `media`)

### File Structure

```
src/
├── index.tsx                    # Main app with all page routes
├── routes/
│   ├── admin-auth.ts           # Admin authentication
│   ├── admin-investor.ts       # Admin investor management (approve/reject)
│   ├── admin-investor-content.ts # Admin document management
│   ├── admin-investor-updates.ts # Admin investor updates CRUD
│   ├── admin-waitlist.ts       # Admin waitlist management & project updates
│   ├── admin-categories.ts     # Category management
│   ├── investor-auth.ts        # Investor auth, NDA signing, updates API
│   ├── user-auth.ts            # Waitlist user authentication
│   ├── updates.ts              # Waitlist updates API
│   └── upload.ts               # File upload handling
├── utils/
│   └── email.ts                # Email service (SendGrid)
```

---

## Database Schema

### Core Tables

#### `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone TEXT,
  business_name VARCHAR(255),
  password_hash VARCHAR(255),
  user_type VARCHAR(50) DEFAULT 'investor', -- 'investor' or 'waitlist'
  investor_status VARCHAR(50), -- 'pending_nda', 'nda_signed', 'active', 'rejected'
  investor_tier VARCHAR(50) DEFAULT 'standard',
  nda_token VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
```

#### `waitlist_users` Table
```sql
CREATE TABLE waitlist_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  business_name VARCHAR(255),
  phone TEXT,
  password_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'inactive'
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  waitlist_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);
```

#### `nda_signatures` Table
```sql
CREATE TABLE nda_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name_typed VARCHAR(255) NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  nda_version VARCHAR(20) DEFAULT '1.0',
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_nda_signatures_user_id ON nda_signatures(user_id);
```

### Content Tables

#### `project_updates` Table (Waitlist Updates)
```sql
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  media_url TEXT,           -- Video URL
  media_type VARCHAR(50),   -- 'video', 'image', etc.
  gallery_images JSONB,     -- Array of image URLs
  category TEXT,            -- UUID reference to waitlist_categories
  author_name TEXT DEFAULT 'Risivo Team',
  status TEXT DEFAULT 'draft', -- 'draft', 'published'
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `investor_updates` Table
```sql
CREATE TABLE investor_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  video_url TEXT,
  gallery_images JSONB,
  category_id UUID REFERENCES investor_categories(id),
  author_name TEXT DEFAULT 'Risivo Team',
  visibility TEXT DEFAULT 'all_investors',
  status TEXT DEFAULT 'draft',
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `waitlist_categories` Table
```sql
CREATE TABLE waitlist_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  icon VARCHAR(50) DEFAULT '📋',
  color VARCHAR(20) DEFAULT '#3b82f6',
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `investor_categories` Table
```sql
CREATE TABLE investor_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  icon VARCHAR(50) DEFAULT '📌',
  color VARCHAR(20) DEFAULT '#667eea',
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `investor_content` Table (Documents)
```sql
CREATE TABLE investor_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50),
  category VARCHAR(100),
  icon VARCHAR(50) DEFAULT '📄',
  cta_button_text VARCHAR(100) DEFAULT 'View Document',
  visibility VARCHAR(50) DEFAULT 'all_investors',
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Session Tables

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waitlist_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## User Flows

### Investor Registration & NDA Flow

```
1. Investor visits /updates/investor/signup
   └── Fills form: first_name, last_name, email, phone, business_name
   
2. System creates user with:
   └── investor_status: 'pending_nda'
   └── nda_token: generated unique token
   └── Sends NDA email with signing link
   └── Admin receives notification

3. Investor clicks NDA link → /investor/sign-nda?token=xxx
   └── Reviews NDA document
   └── Types full name to sign
   └── Agrees to terms
   └── Clicks "Sign NDA"

4. System updates user:
   └── investor_status: 'nda_signed' (pending admin review)
   └── nda_token: null
   └── Creates nda_signatures record
   └── Sends "Pending Review" email to investor
   └── Admin receives notification

5. Admin reviews in /updates/admin/dashboard
   └── Can APPROVE: 
       ├── Status → 'active'
       ├── Generate password
       ├── Send approval email with credentials
   └── Can REJECT:
       ├── Status → 'rejected'
       ├── Send rejection email (with optional reason)

6. Approved investor logs in at /updates/investor/login
   └── Access to Investor Dashboard
   └── Can view documents, updates, videos, galleries
```

### Waitlist Registration Flow

```
1. User visits /waitlist or /waitlist/signup
   └── Fills form: first_name, last_name, email, phone, business_name

2. System creates waitlist_user with:
   └── status: 'pending'
   └── email_verified: false
   └── verification_token: generated
   └── Sends verification email

3. User clicks verification link
   └── status: 'active'
   └── email_verified: true
   └── Generates password
   └── Sends welcome email with credentials

4. User logs in at /waitlist/login
   └── Access to Waitlist Dashboard
   └── Can view updates with engagement features
```

---

## API Endpoints

### Investor Authentication (`/api/investor/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new investor |
| POST | `/login` | Login with credentials |
| POST | `/logout` | Logout and clear session |
| GET | `/me` | Get current user info |
| POST | `/sign-nda` | Sign NDA (logged in) |
| POST | `/sign-nda-token` | Sign NDA via token (from email) |
| POST | `/change-password` | Change password |
| POST | `/forgot-password` | Request password reset |
| GET | `/content` | Get investor documents |
| GET | `/updates` | Get investor updates |
| POST | `/updates/:id/view` | Track view |
| POST | `/updates/:id/like` | Like update |
| POST | `/updates/:id/dislike` | Dislike update |

### Waitlist User (`/api/user/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/me` | Get current user |
| POST | `/change-password` | Change password |
| POST | `/forgot-password` | Request reset |

### Waitlist Updates (`/api/updates/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | Get published updates |
| POST | `/:id/view` | Track view |
| POST | `/:id/like` | Like update |
| POST | `/:id/dislike` | Dislike update |

### Admin - Investors (`/api/admin/investors/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/investors` | List all investors |
| GET | `/investor/:id/details` | Get investor details + NDA |
| POST | `/investor/:id/approve` | Approve & send credentials |
| POST | `/investor/:id/reject` | Reject & send notification |
| DELETE | `/investor/:id/delete` | Delete investor |
| PUT | `/investor/:id/tier` | Update investor tier |

### Admin - Waitlist (`/api/admin/waitlist/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List waitlist users |
| DELETE | `/user/:id` | Delete waitlist user |
| GET | `/categories` | List categories |
| POST | `/categories` | Create category |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |
| GET | `/updates` | List project updates |
| POST | `/updates` | Create update |
| PUT | `/updates/:id` | Update |
| DELETE | `/updates/:id` | Delete |

### Admin - Investor Updates (`/api/admin/investor-updates/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List investor updates |
| POST | `/` | Create investor update |
| PUT | `/:id` | Update |
| DELETE | `/:id` | Delete |

### Admin - Investor Content (`/api/admin/investor-content/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List documents |
| POST | `/` | Create document |
| PUT | `/:id` | Update |
| DELETE | `/:id` | Delete |

---

## Email Templates

### Available Email Functions (`src/utils/email.ts`)

1. **sendPasswordResetEmail** - Password reset with token link
2. **sendWaitlistVerificationEmail** - Email verification for waitlist
3. **sendWaitlistConfirmationEmail** - Verified + credentials
4. **sendWelcomeEmail** - Legacy/alternate welcome
5. **sendInvestorNDAEmail** - NDA signing invitation
6. **sendInvestorPendingReviewEmail** - After NDA signed, pending approval
7. **sendInvestorApprovedEmail** - Approved with login credentials
8. **sendInvestorRejectedEmail** - Rejection with optional reason
9. **sendAdminNotification** - Admin alerts for various events

### Email Styling

- **Header**: Purple gradient (#667eea → #764ba2) with white logo
- **Footer**: Light grey (#f5f5f5) with copyright
- **Buttons**: Purple gradient, white text
- **Credentials Box**: Light grey background with purple labels

---

## Admin Dashboard Features

### Overview Tab
- Total Investors count
- Total Waitlist count
- Documents count
- Updates count
- Pending Approval count

### Investors Tab
- Table with: Name, Email, Business, Status, Tier, Joined, Actions
- Actions for `nda_signed` status:
  - ✅ Approve - sends credentials email
  - ❌ Reject - prompts for reason, sends rejection email
  - 🗑️ Delete
- View investor details modal with NDA signature info
- Export to CSV

### Waitlist Tab
- Table with subscriber info
- Delete functionality
- Export to CSV

### Documents Tab
- Create/Edit/Delete investor documents
- Fields: Title, Description, File URL, Category, Icon, CTA Button

### Investor Updates Tab
- Create/Edit/Delete investor-specific updates
- Rich text content
- Featured image, video URL, gallery images
- Category selection
- Visibility settings

### Waitlist Updates Tab
- Create/Edit/Delete public updates
- Same rich content features
- Category selection

### Categories Tab
- Manage both waitlist and investor categories
- Icon, color, description, sort order

---

## Known Issues & Solutions

### Issue 1: Category Shows as UUID Instead of Name

**Symptom**: Update cards display UUID like "3fc807ab-d5b8-4593-bb44-933b9c7c2796" instead of category name.

**Cause**: 
- The `project_updates.category` column stores a UUID
- The category might not exist in `waitlist_categories` table
- Case sensitivity in UUID comparison

**Solution**:
1. Ensure category exists in `waitlist_categories`:
```sql
SELECT * FROM waitlist_categories WHERE id = 'your-uuid-here';
```

2. If missing, create it:
```sql
INSERT INTO waitlist_categories (id, name, icon, color, slug) 
VALUES ('your-uuid-here', 'Category Name', '📌', '#667eea', 'category-slug');
```

3. Code uses case-insensitive UUID matching (implemented in `src/routes/updates.ts`)

### Issue 2: 500 Error on POST /api/admin/waitlist/updates

**Symptom**: Creating updates fails with 500 error.

**Cause**: Database column mismatch
- Code used `category_id` but table has `category`
- Code used `video_url` but table has `media_url`/`media_type`

**Solution**: Updated code to match actual schema:
```typescript
// src/routes/admin-waitlist.ts
const updateData = {
  category: category || null,  // NOT category_id
  media_url: video_url || null,  // NOT video_url
  media_type: video_url ? 'video' : null,
  // ...
};
```

### Issue 3: Gallery Images Not Displaying

**Symptom**: Gallery section shows broken images or empty.

**Cause**: Gallery images stored in different formats:
- Array of strings: `["url1", "url2"]`
- Array of objects: `[{url: "url1"}, {url: "url2"}]`
- JSON string that needs parsing

**Solution**: Code handles all formats:
```javascript
const galleryImages = item.gallery_images || [];
let images = galleryImages;
if (typeof images === 'string') {
  try { images = JSON.parse(images); } catch(e) {}
}
currentGalleryImages = images.map(g => g.url || g);
```

### Issue 4: NDA Date Hardcoded

**Symptom**: NDA shows "Effective Date: December 21, 2025" always.

**Solution**: Changed to dynamic date:
```javascript
const effectiveDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});
// Now shows: "December 30, 2025" (current date)
```

### Issue 5: Wrong Message After NDA Signing

**Symptom**: After signing NDA, message says "account is active" but it should be pending review.

**Solution**: Updated flow:
1. NDA signing sets `investor_status = 'nda_signed'` (NOT 'active')
2. No password generated at this stage
3. Shows: "Your application is now under review. You will receive an email with your login credentials once approved."
4. Admin must approve to activate account

### Issue 6: Supabase Storage Bucket Name

**Symptom**: Image uploads fail.

**Cause**: Code referenced bucket 'images' but actual bucket is 'media'.

**Solution**: Updated all storage references to use 'media' bucket.

---

## Deployment Guide

### Prerequisites
- Node.js 18+
- Cloudflare account
- Supabase project
- SendGrid account

### Environment Variables (Cloudflare)

```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=hello@risivo.com
FROM_NAME=Risivo Team
ADMIN_EMAIL=admin@risivo.com
```

### Deployment Commands

```bash
# Local development
npm install
npm run dev

# Production build
npm run build

# Deploy to Cloudflare
npx wrangler pages deploy dist --project-name=risivo-production
```

### Post-Deployment Checklist

1. ✅ Verify all environment variables set in Cloudflare
2. ✅ Test waitlist signup flow
3. ✅ Test investor signup + NDA flow
4. ✅ Test admin approval/rejection
5. ✅ Test email delivery
6. ✅ Test file uploads
7. ✅ Test update creation with gallery/video
8. ✅ Test view/like/dislike tracking

---

## Troubleshooting

### Debug Logging

Key log prefixes in the codebase:
- `[INVESTOR_AUTH]` - Investor authentication
- `[INVESTOR_SIGNUP]` - New investor registration
- `[ADMIN-INVESTOR]` - Admin investor actions
- `[UPDATES]` - Updates API operations
- `[EMAIL]` - Email sending

### Common Errors

**"Registration failed"**
- Check if all required fields are sent
- Verify `users` table has all columns
- Check Supabase service role key

**"Failed to sign NDA"**
- Verify `nda_signatures` table exists
- Check user has valid `nda_token`
- Ensure `investor_status = 'pending_nda'`

**"Unauthorized" on admin endpoints**
- Verify admin session cookie exists
- Check `admin_sessions` table
- Ensure session not expired

**"Unable to load updates"**
- Check user session is valid
- Verify table has `status = 'published'` updates
- Check category join is working

### Viewing Cloudflare Logs

1. Go to Cloudflare Dashboard
2. Select Pages project
3. Go to "Functions" tab
4. Click "Real-time logs"

---

## Contact & Support

- **Admin Email**: admin@risivo.com
- **Repository**: https://github.com/velocityautomationcorp/risivo-website
- **Production URL**: https://risivo.com

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 30, 2025 | Initial documentation |

---

*This document should be updated whenever significant changes are made to the system.*
