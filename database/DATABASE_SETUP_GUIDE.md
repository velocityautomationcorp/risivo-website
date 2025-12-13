# 🗄️ Database Setup Guide - Risivo Updates Platform

## ⚡ Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: `sldpdgdkrakfzwtroglx`
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

---

### Step 2: Run the Schema SQL

1. Copy the entire contents of `SUPABASE_SCHEMA_UPDATES_PLATFORM.sql`
2. Paste into the SQL Editor
3. Click **RUN** button (or press Ctrl+Enter)
4. Wait for "Success. No rows returned" message

**Expected result:** ✅ All tables, indexes, triggers, and sample data created!

---

### Step 3: Verify Setup

Run these verification queries one by one:

#### ✅ Check all tables exist:
```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('project_updates', 'update_images', 'admin_users', 'admin_sessions', 'update_analytics')
ORDER BY tablename;
```

**Expected output:** 5 rows (all tables listed)

---

#### ✅ Check RLS is disabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('project_updates', 'update_images', 'admin_users', 'admin_sessions', 'update_analytics')
ORDER BY tablename;
```

**Expected output:** All tables with `rowsecurity: false`

---

#### ✅ Verify admin user exists:
```sql
SELECT id, email, full_name, role, is_active, created_at
FROM admin_users;
```

**Expected output:** 1 row
- Email: `admin@risivo.com`
- Password: `risivo2025` (change this after first login!)

---

#### ✅ Verify sample update exists:
```sql
SELECT id, slug, title, category, status, published_at
FROM project_updates
WHERE status = 'published';
```

**Expected output:** 1 row (Welcome to Risivo Updates!)

---

#### ✅ Test utility functions:
```sql
-- Test slug generation
SELECT generate_slug('My Awesome Update: Testing 123!');
```

**Expected output:** `my-awesome-update-testing-123`

---

### Step 4: Browse Tables in Table Editor

1. Click **Table Editor** in left sidebar
2. You should see these tables:
   - ✅ `project_updates`
   - ✅ `update_images`
   - ✅ `admin_users`
   - ✅ `admin_sessions`
   - ✅ `update_analytics`

3. Click on `project_updates` table
4. You should see 1 row: "Welcome to Risivo Development Updates!"

---

## 📊 Database Schema Overview

### **Table: `project_updates`** (Main content)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | TEXT | URL-friendly identifier (unique) |
| `title` | TEXT | Update title |
| `excerpt` | TEXT | Short summary (for previews) |
| `content` | TEXT | Full content (Markdown or HTML) |
| `category` | TEXT | 'feature', 'improvement', 'bugfix', 'announcement', 'maintenance' |
| `author_name` | TEXT | Author display name |
| `author_email` | TEXT | Author email (optional) |
| `featured_image_url` | TEXT | Main image URL |
| `status` | TEXT | 'draft', 'published', 'archived' |
| `views_count` | INTEGER | Total views |
| `shares_count` | INTEGER | Total shares |
| `published_at` | TIMESTAMP | When published |
| `created_at` | TIMESTAMP | When created |
| `updated_at` | TIMESTAMP | Last updated (auto-updated) |

---

### **Table: `update_images`** (Multiple images per update)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `update_id` | UUID | Foreign key to `project_updates` |
| `image_url` | TEXT | Image URL |
| `alt_text` | TEXT | Alt text for accessibility |
| `caption` | TEXT | Image caption |
| `display_order` | INTEGER | Order in gallery |
| `created_at` | TIMESTAMP | When added |

---

### **Table: `admin_users`** (Admin authentication)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT | Login email (unique) |
| `password_hash` | TEXT | bcrypt hashed password |
| `full_name` | TEXT | Display name |
| `role` | TEXT | 'admin', 'editor', 'viewer' |
| `is_active` | BOOLEAN | Account enabled/disabled |
| `last_login_at` | TIMESTAMP | Last login time |
| `created_at` | TIMESTAMP | Account created |
| `updated_at` | TIMESTAMP | Last updated |

---

### **Table: `admin_sessions`** (Session management)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `admin_user_id` | UUID | Foreign key to `admin_users` |
| `session_token` | TEXT | Unique session token |
| `expires_at` | TIMESTAMP | Session expiration |
| `ip_address` | TEXT | Login IP |
| `user_agent` | TEXT | Browser info |
| `created_at` | TIMESTAMP | Session created |

---

### **Table: `update_analytics`** (Track views/shares)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `update_id` | UUID | Foreign key to `project_updates` |
| `event_type` | TEXT | 'view', 'share_twitter', 'share_linkedin', etc. |
| `ip_address` | TEXT | Visitor IP |
| `user_agent` | TEXT | Browser info |
| `referrer` | TEXT | Where they came from |
| `created_at` | TIMESTAMP | Event time |

---

## 🎯 Key Features

### ✅ Lessons Learned from Previous Issues:

1. **No CHECK Constraints**
   - ❌ Previously: `CHECK (preferred_language IN ('English', 'Spanish', ...))`
   - ✅ Now: Just TEXT field, validate in API code

2. **RLS Disabled**
   - ❌ Previously: RLS blocked service_role inserts
   - ✅ Now: RLS disabled, auth handled in API

3. **Lowercase Values**
   - ❌ Previously: 'English' vs 'english' mismatches
   - ✅ Now: All lowercase ('feature', 'published', 'admin')

4. **Auto-updated Timestamps**
   - ✅ `updated_at` automatically updates on row changes

5. **Cascading Deletes**
   - ✅ Delete an update → all its images/analytics also deleted

6. **Proper Indexes**
   - ✅ Fast queries on slug, status, category, dates

---

## 🔐 Security Notes

### Default Admin Credentials:
```
Email: admin@risivo.com
Password: risivo2025
```

**⚠️ IMPORTANT: Change this password after first login!**

### Session Management:
- Sessions expire after 7 days
- Use `cleanup_expired_sessions()` function periodically
- Store session token in secure HTTP-only cookie

---

## 🛠️ Utility Functions

### Generate URL-friendly slug:
```sql
SELECT generate_slug('My Awesome Feature Update!');
-- Returns: 'my-awesome-feature-update'
```

### Increment view count:
```sql
SELECT increment_view_count('update-uuid-here');
```

### Increment share count:
```sql
SELECT increment_share_count('update-uuid-here');
```

### Clean up expired sessions:
```sql
SELECT cleanup_expired_sessions();
-- Returns: number of deleted sessions
```

---

## 📈 Sample Queries

### Get all published updates:
```sql
SELECT * FROM project_updates
WHERE status = 'published'
ORDER BY published_at DESC;
```

### Get updates with stats:
```sql
SELECT * FROM published_updates_with_stats
ORDER BY published_at DESC;
```

### Get recent activity:
```sql
SELECT 
    u.title,
    a.event_type,
    a.created_at
FROM update_analytics a
JOIN project_updates u ON a.update_id = u.id
ORDER BY a.created_at DESC
LIMIT 10;
```

### Get most viewed updates:
```sql
SELECT title, views_count, shares_count
FROM project_updates
WHERE status = 'published'
ORDER BY views_count DESC
LIMIT 5;
```

---

## ✅ Setup Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Ran `SUPABASE_SCHEMA_UPDATES_PLATFORM.sql`
- [ ] Verified all 5 tables exist
- [ ] Confirmed RLS is disabled on all tables
- [ ] Tested admin user login credentials
- [ ] Verified sample update exists
- [ ] Tested utility functions
- [ ] Browsed tables in Table Editor

---

## 🚀 Next Steps

After database setup is complete:

1. ✅ **Phase 1 Complete: Database Setup**
2. ⏳ **Phase 2: Build Admin Authentication** (login page, session management)
3. ⏳ **Phase 3: Build Admin Dashboard** (CRUD operations)
4. ⏳ **Phase 4: Build Public Updates Page** (timeline, sharing)
5. ⏳ **Phase 5: Deploy & Test**

---

## 🆘 Troubleshooting

### Issue: "relation already exists"
**Solution:** Tables already created. Run individual CREATE TABLE statements with `IF NOT EXISTS`.

### Issue: RLS blocking inserts
**Solution:** Run:
```sql
ALTER TABLE project_updates DISABLE ROW LEVEL SECURITY;
```

### Issue: Can't find admin_users table
**Solution:** Check you're in the correct Supabase project (`sldpdgdkrakfzwtroglx`).

### Issue: Sample data not inserted
**Solution:** Run INSERT statements individually, check for conflicts.

---

**🎉 Database setup complete! Ready for Phase 2!**
