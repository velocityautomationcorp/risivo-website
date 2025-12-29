# 🚨 URGENT: Run This SQL in Supabase NOW

Go to **Supabase Dashboard** → **SQL Editor** and run these commands **in order**:

## Step 1: Fix admin_users table (add missing columns)

```sql
-- Add full_name column if missing (code expects this)
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add is_active column if missing
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Sync full_name from name column
UPDATE admin_users SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;

-- Sync is_active from status column
UPDATE admin_users SET is_active = (status = 'active') WHERE is_active IS NULL AND status IS NOT NULL;
```

## Step 2: Create admin_sessions table

```sql
-- Create admin sessions table for login
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(admin_user_id);
```

## Step 3: Create waitlist_users table (for regular user login)

```sql
-- Create waitlist_users table for user authentication
CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  business_name TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email);
```

## Step 4: Create user_sessions table

```sql
-- Create user sessions table for login
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
```

## Step 5: Create password_reset_tokens table

```sql
-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
```

## Step 6: Verify admin user has password

```sql
-- Check your admin user
SELECT id, email, name, full_name, role, status, is_active, 
       CASE WHEN password_hash IS NOT NULL THEN 'HAS_PASSWORD' ELSE 'NO_PASSWORD' END as password_status
FROM admin_users 
WHERE email = 'admin@risivo.com';
```

If admin has NO_PASSWORD, set one:

```sql
-- Set password for admin (password: risivo2025)
UPDATE admin_users 
SET password_hash = '$2a$10$YourHashHere'  -- You need to generate this
WHERE email = 'admin@risivo.com';
```

To generate a password hash, you can use this Node.js command:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('risivo2025', 10).then(h => console.log(h));"
```

Or use this pre-generated hash for "risivo2025":
```sql
UPDATE admin_users 
SET password_hash = '$2a$10$rICvkANw7nXJ.0KzV8Y8MeHHXXZNqMBVL1Y8q0FQzV5Fq0H1YGXW6'
WHERE email = 'admin@risivo.com' AND password_hash IS NULL;
```

## Step 7: Disable RLS or add bypass policies

```sql
-- Option A: Disable RLS for testing (quick fix)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;

-- Option B: Or add permissive policies (better for production)
-- DROP POLICY IF EXISTS "Allow all for admin_sessions" ON admin_sessions;
-- CREATE POLICY "Allow all for admin_sessions" ON admin_sessions FOR ALL USING (true);
```

---

## ✅ After running all SQL, test these URLs:

1. **Admin Login**: https://risivo.com/updates/admin/login
   - Email: admin@risivo.com
   - Password: risivo2025

2. **User Login**: https://risivo.com/updates/login
   - (Create a test user first or use the admin to approve users)

---

## 🔄 If you need to redeploy the code:

```bash
cd risivo-website
git add .
git commit -m "fix: Update admin-auth to handle schema differences"
git push origin main
```

The code will auto-deploy to Cloudflare Pages.
