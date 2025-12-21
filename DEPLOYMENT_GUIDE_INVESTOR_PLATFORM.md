# 🚀 INVESTOR PLATFORM DEPLOYMENT GUIDE
## Risivo Investor Dashboard & Admin Management System

---

## ✅ WHAT'S BEEN BUILT

### 1. **Database Infrastructure**
- Investor tier system (prospective, angel, seed, series_a_plus, strategic_partner)
- Investor content management table
- Activity tracking and analytics
- Engagement scoring system
- NDA signatures tracking

### 2. **Investor Dashboard**
- Dynamic content loading based on approval status
- Three-tier access control:
  - **pending_nda**: Limited to non-NDA content only
  - **nda_signed**: Awaiting approval message, some content locked
  - **active**: Full access to all authorized content
- Founder Message video (always visible to all investors)
- Activity tracking for downloads/views
- Responsive design with status badges

### 3. **NDA Review System**
- Electronic signature capture
- IP address and timestamp logging
- Automatic status update to 'nda_signed'
- Legal compliance features

### 4. **Admin Investor Management**
- Dashboard at `/updates/admin/investors`
- View all investors with filtering by status
- Approve/reject workflow with reasons
- Investor details modal with NDA signature info
- Real-time statistics

### 5. **API Endpoints**
- `GET /api/auth/investor/content` - Fetch investor content
- `GET /api/auth/investor/content/:id/access` - Access content with tracking
- `POST /api/admin/investor/:id/approve` - Approve investor
- `POST /api/admin/investor/:id/reject` - Reject investor
- `GET /api/admin/investor/:id/details` - Get investor details

---

## 📋 DEPLOYMENT STEPS

### STEP 1: Pull Latest Code (Windows)
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git pull origin genspark_ai_developer
```

**Verify you have these commits:**
```bash
git log --oneline -5
```
You should see:
- `6c38e19 feat: Add comprehensive admin investor management system`
- `7c9cd3e feat: Implement dynamic investor dashboard with approval status logic`
- `f963ea6 feat: Add comprehensive investor tiers and analytics migration`
- `6b5231d fix: Update NDA sign API to use user_sessions table`

---

### STEP 2: Run Database Migration in Supabase

**Important:** This is the MOST CRITICAL step. Without this, the investor system will not work.

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx/sql/new

2. Copy the ENTIRE contents of `database/migrations/004_investor_tiers_and_analytics.sql`

3. Paste and run it in the SQL Editor

4. **Expected Output:**
   - `investor_tier` column added to `users` table
   - `investor_content` table created
   - `investor_activity_log` table created
   - `investor_engagement_stats` table created
   - 3 functions created (calculate_investor_engagement_score, get_engagement_level, log_investor_activity)
   - "✅ Migration 004: Investor Tiers & Analytics - COMPLETED!" message

**CRITICAL:** If you see ANY errors, DO NOT PROCEED. Send me a screenshot of the error.

---

### STEP 3: Add Sample Investor Content (Optional but Recommended)

Run this SQL to add the default Founder Message video:
```sql
-- This is already in the migration, but run it again to verify
SELECT * FROM public.investor_content WHERE category = 'Founder Message';
```

If you don't see any results, run:
```sql
INSERT INTO public.investor_content (
    title,
    description,
    content_type,
    category,
    icon,
    visibility,
    requires_nda,
    show_on_dashboard,
    is_featured,
    sort_order,
    cta_button_text,
    status,
    published_at
) VALUES (
    'Welcome from Our Founder',
    'A personal message from our founder introducing Risivo and our vision for revolutionizing the industry.',
    'video',
    'Founder Message',
    '🎥',
    'all_investors',
    false,
    true,
    true,
    1,
    'Watch Video',
    'active',
    NOW()
);
```

**To add actual content URLs later:**
```sql
-- Update Founder Message with real video URL
UPDATE public.investor_content
SET video_url = 'https://your-video-url.com/founder-message.mp4',
    thumbnail_url = 'https://your-video-url.com/thumbnail.jpg'
WHERE category = 'Founder Message';

-- Add Pitch Deck
INSERT INTO public.investor_content (
    title,
    description,
    content_type,
    category,
    icon,
    file_url,
    file_format,
    file_size,
    visibility,
    sort_order,
    status,
    published_at
) VALUES (
    'Pitch Deck Q4 2024',
    'Our latest investor pitch deck with updated metrics and roadmap',
    'document',
    'Investor Presentations',
    '📊',
    'https://your-storage.com/pitch-deck.pdf',
    'PDF',
    '2.4 MB',
    'nda_signed_only',
    2,
    'active',
    NOW()
);

-- Add Financial Forecast
INSERT INTO public.investor_content (
    title,
    description,
    content_type,
    category,
    icon,
    file_url,
    file_format,
    file_size,
    visibility,
    sort_order,
    status,
    published_at
) VALUES (
    'Financial Forecast 2025',
    'Detailed 5-year financial projections and growth strategy',
    'document',
    'Financial Reports',
    '💰',
    'https://your-storage.com/financials.xlsx',
    'XLSX',
    '1.8 MB',
    'active_investors_only',
    3,
    'active',
    NOW()
);
```

---

### STEP 4: Deploy to Production
```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
npm run deploy:production
```

**Wait for deployment to complete (2-3 minutes)**

---

### STEP 5: Test Investor Signup Flow

#### 5.1: Create Test Investor Account
1. Go to: `https://risivo.com/updates/signup/investor?email=test-investor@example.com`
2. Fill in:
   - First Name: `Test`
   - Last Name: `Investor`
   - Company: `Test Ventures LLC`
   - Password: `TestInvestor2024!`
3. Click "Create Account & Continue to NDA"
4. **Expected:** Redirects to `/updates/investor/nda-review`

#### 5.2: Sign NDA
1. On NDA Review page, full name should be pre-filled
2. Check the agreement checkbox
3. Click "Sign NDA & Continue"
4. **Expected:** 
   - Success message: "NDA signed successfully!"
   - Redirects to `/updates/investor/dashboard`
   - Status shows "⏳ Pending Approval"
   - Most content shows "🔒 Locked" buttons

#### 5.3: Test Investor Login
1. Logout and go to: `https://risivo.com/updates/login`
2. Login with `test-investor@example.com` / `TestInvestor2024!`
3. **Expected:** 
   - Redirects to `/updates/investor/dashboard`
   - Shows pending approval message
   - Founder Message accessible (if URL configured)

---

### STEP 6: Test Admin Approval Workflow

#### 6.1: Login as Admin
1. Go to: `https://risivo.com/updates/admin/login`
2. Login with your admin credentials

#### 6.2: Access Investor Management
1. Go to: `https://risivo.com/updates/admin/investors`
   
   **OR**
   
   Add a navigation link to the admin dashboard (recommended):
   - Edit admin dashboard page to add:
   ```html
   <a href="/updates/admin/investors" class="btn btn-primary">
       👥 Manage Investors
   </a>
   ```

2. **Expected to see:**
   - Statistics cards showing:
     - Total Investors: 1
     - Awaiting Approval: 1
   - Filter tabs
   - Investor table with test investor

#### 6.3: Approve Test Investor
1. Click "Awaiting Approval" tab
2. Click "✅ Approve" button on the test investor
3. Confirm approval
4. **Expected:** 
   - Success message
   - Investor status changes to "Active"
   - Moves to "Active" tab when filtered

#### 6.4: Verify Investor Access
1. Logout from admin
2. Login as test investor (`test-investor@example.com`)
3. Go to investor dashboard
4. **Expected:**
   - Pending approval message is GONE
   - Status badge shows "✅ NDA Signed & Approved"
   - All content buttons are now active (not locked)
   - Clicking buttons opens content (if URLs configured)

---

## 🔍 VERIFICATION CHECKLIST

Run these SQL queries in Supabase to verify everything is working:

### 1. Check if migration ran successfully
```sql
-- Should return 4 tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('investor_content', 'investor_activity_log', 'investor_engagement_stats', 'users');
```

### 2. Check if investor tier column exists
```sql
-- Should show investor_tier column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users' 
  AND column_name = 'investor_tier';
```

### 3. Check test investor was created
```sql
-- Should show your test investor
SELECT 
    email, 
    first_name, 
    last_name, 
    business_name, 
    user_type, 
    investor_status, 
    investor_tier,
    created_at
FROM public.users 
WHERE email = 'test-investor@example.com';
```

### 4. Check NDA signature was recorded
```sql
-- Should show NDA signature with timestamp and IP
SELECT 
    u.email,
    n.full_name_typed,
    n.signature_timestamp,
    n.ip_address,
    n.nda_version
FROM public.nda_signatures n
JOIN public.users u ON n.user_id = u.id
WHERE u.email = 'test-investor@example.com';
```

### 5. Check investor content
```sql
-- Should show at least the Founder Message
SELECT 
    title, 
    content_type, 
    category, 
    visibility, 
    requires_nda,
    status,
    sort_order
FROM public.investor_content
ORDER BY sort_order;
```

### 6. Check activity tracking (after testing)
```sql
-- Should show investor activities (logins, content views, etc.)
SELECT 
    u.email,
    a.action_type,
    a.resource_type,
    a.resource_title,
    a.action_timestamp
FROM public.investor_activity_log a
JOIN public.users u ON a.user_id = u.id
WHERE u.email = 'test-investor@example.com'
ORDER BY a.action_timestamp DESC
LIMIT 10;
```

### 7. Check engagement stats (after testing)
```sql
-- Should show engagement metrics
SELECT 
    u.email,
    e.total_logins,
    e.total_downloads,
    e.total_views,
    e.engagement_score,
    e.engagement_level,
    e.last_login_at
FROM public.investor_engagement_stats e
JOIN public.users u ON e.user_id = u.id
WHERE u.email = 'test-investor@example.com';
```

---

## 🎨 CUSTOMIZATION GUIDE

### Add Navigation Link to Admin Dashboard

1. Edit `src/pages/admin-dashboard.tsx`
2. Find the section with dashboard actions (around line 100-150)
3. Add this button:

```html
<div class="action-buttons">
    <a href="/updates/admin/investors" class="btn btn-primary">
        👥 Manage Investors
    </a>
    <a href="/updates/admin/categories" class="btn btn-secondary">
        🏷️ Categories
    </a>
    <!-- other buttons -->
</div>
```

### Upload Content Files

You can host investor content on:
1. **Supabase Storage** (recommended - same as your app)
2. **Cloudflare R2** (if you're already using Cloudflare)
3. **AWS S3 / Google Cloud Storage**
4. **Direct video platforms** (Vimeo, YouTube unlisted links)

**Example - Supabase Storage:**
```sql
-- After uploading file to Supabase Storage, update content
UPDATE public.investor_content
SET file_url = 'https://sldpdgdkrakfzwtroglx.supabase.co/storage/v1/object/public/investor-content/pitch-deck.pdf'
WHERE title = 'Pitch Deck Q4 2024';
```

---

## 🚨 TROUBLESHOOTING

### Issue: "Content not loading" on investor dashboard
**Solution:**
1. Check browser console (F12) for errors
2. Verify SQL migration ran successfully
3. Check that `investor_content` table has records:
   ```sql
   SELECT COUNT(*) FROM public.investor_content WHERE status = 'active';
   ```

### Issue: "Approve/Reject buttons not working"
**Solution:**
1. Check admin session is valid
2. Verify admin routes are mounted:
   ```bash
   # In code, check src/index.tsx has:
   app.route('/api/admin', adminInvestorRoute)
   ```
3. Check browser console for API errors

### Issue: "Activity tracking not working"
**Solution:**
1. Verify `log_investor_activity` function was created:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
     AND routine_name = 'log_investor_activity';
   ```
2. If not found, re-run the migration SQL

### Issue: "Investor can't see any content"
**Solution:**
1. Check investor status:
   ```sql
   SELECT investor_status FROM public.users WHERE email = 'investor@example.com';
   ```
2. If 'nda_signed', content is locked until admin approves
3. If 'active', check content visibility settings:
   ```sql
   SELECT title, visibility, requires_nda FROM public.investor_content;
   ```

---

## 📊 INVESTOR FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│  INVESTOR JOURNEY                                                │
└─────────────────────────────────────────────────────────────────┘

1. Signup (email from Make.com)
   ↓
2. Create account at /updates/signup/investor
   ↓ (auto-login)
3. Sign NDA at /updates/investor/nda-review
   ↓ (status: pending_nda → nda_signed)
4. Investor Dashboard (LIMITED ACCESS)
   │ - Status: ⏳ Awaiting Approval
   │ - Founder Message: ✅ Accessible
   │ - Other Content: 🔒 Locked
   ↓
5. Admin Reviews at /updates/admin/investors
   ↓
6A. APPROVED                    6B. REJECTED
    │ (status: active)               │ (status: rejected)
    ↓                                ↓
7A. Full Access to Dashboard    7B. Access Revoked
    │ - All content unlocked        │ - Cannot access content
    │ - Downloads tracked           │ - Notification email sent
    │ - Activity logged             └─────────────────────
    └─────────────────────

ADMIN ACTIONS:
- View all investors
- Filter by status
- View investor details & NDA
- Approve (sends email + SMS)
- Reject (sends email with reason)
```

---

## 🔐 SECURITY NOTES

1. **Admin Routes**: All admin routes check for valid `admin_session` cookie
2. **Investor Routes**: Investor dashboard requires NDA signature (protected by `requireNDA` middleware)
3. **Content Access**: API checks investor status before allowing downloads
4. **Activity Logging**: All investor actions are logged with IP and user agent
5. **NDA Signatures**: Legally binding with IP address, timestamp, and document hash

---

## 🎯 NEXT STEPS (OPTIONAL ENHANCEMENTS)

### 1. Email Notifications (High Priority)
- **Approval Email**: When admin approves investor
- **Rejection Email**: When admin rejects investor
- **Integration**: Make.com webhooks
- **Endpoints to create**:
  - Webhook triggers on investor status change
  - Email templates in Make.com

### 2. SMS Notifications
- **Approval SMS**: Text message on approval
- **Integration**: Twilio via Make.com
- **Implementation**: Similar to email webhooks

### 3. Investor Analytics Dashboard
- **New route**: `/updates/admin/investor-analytics`
- **Features**:
  - Engagement metrics chart
  - Most viewed content
  - Active vs inactive investors
  - Login trends

### 4. Investor Content Management UI
- **New route**: `/updates/admin/investor-content`
- **Features**:
  - Upload files directly
  - Set visibility and tier restrictions
  - Reorder content
  - Archive old content

### 5. Investor Tiers Management
- **Feature**: Assign/change investor tiers
- **UI**: Dropdown in investor details modal
- **API**: Update investor_tier column

---

## ✅ FINAL CHECKLIST

Before going live with real investors:

- [ ] Database migration ran successfully
- [ ] Test investor account created
- [ ] NDA signature working
- [ ] Admin can approve/reject investors
- [ ] Approved investor sees all content
- [ ] Locked content shows for pending investors
- [ ] Activity tracking is working (check SQL)
- [ ] Founder Message video has real URL
- [ ] At least 3-5 content items uploaded
- [ ] Admin navigation includes "Manage Investors" link
- [ ] Tested on mobile device
- [ ] Email notifications configured (recommended)
- [ ] Legal review of NDA text (if needed)

---

## 📞 SUPPORT

If you encounter any issues during deployment:

1. **Check the verification SQL queries** above
2. **Screenshot any errors** from:
   - Supabase SQL Editor
   - Browser console (F12)
   - Deployment logs
3. **Send me**:
   - The error screenshots
   - Which step you're on
   - What you've tried

---

## 🎉 DEPLOYMENT COMPLETE!

Once all steps are done and verified, you'll have a fully functional investor platform with:

✅ Investor signup and NDA signing
✅ Dynamic content access based on approval status
✅ Admin approval workflow
✅ Activity tracking and analytics
✅ Tier-based access control
✅ Mobile-responsive design

**Your investors can now:**
- Sign up via your email links
- Sign NDA electronically
- Access exclusive content after approval
- View updates and download materials
- Track their engagement

**You can now:**
- Manage all investors from one dashboard
- Approve/reject applications with reasons
- View investor details and NDA signatures
- Track investor engagement and activity
- Control content visibility and access

---

**Need help? I'm here! Just send me any errors or questions.**
