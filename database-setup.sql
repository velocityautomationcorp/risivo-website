-- =============================================
-- RISIVO COMPLETE DATABASE SETUP
-- Run this ONCE in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. ADMIN TABLES (if not exist)
-- =============================================

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Admin Sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- =============================================
-- 2. USER TABLES
-- =============================================

-- Users (Investors + Waitlist)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    country_code VARCHAR(10),
    business_name VARCHAR(255),
    user_type VARCHAR(50) DEFAULT 'waitlist', -- 'investor', 'waitlist'
    investor_status VARCHAR(50) DEFAULT 'pending_nda', -- 'pending_nda', 'nda_signed', 'active', 'rejected'
    investor_tier VARCHAR(50) DEFAULT 'standard', -- 'standard', 'premium', 'enterprise'
    nda_token VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    waitlist_number INTEGER,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NDA Signatures
CREATE TABLE IF NOT EXISTS nda_signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    full_name_typed VARCHAR(255), -- For typed signature
    email VARCHAR(255),
    company_name VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    signature_data TEXT, -- Can store base64 signature or text confirmation
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nda_version VARCHAR(50) DEFAULT '2.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. INVESTOR CATEGORIES
-- =============================================

CREATE TABLE IF NOT EXISTS investor_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    icon VARCHAR(50) DEFAULT '💼',
    color VARCHAR(50) DEFAULT '#10b981',
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. INVESTOR UPDATES
-- =============================================

CREATE TABLE IF NOT EXISTS investor_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500),
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    video_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    category_id UUID REFERENCES investor_categories(id) ON DELETE SET NULL,
    author_name VARCHAR(255) DEFAULT 'Risivo Team',
    visibility VARCHAR(50) DEFAULT 'all_investors', -- 'all_investors', 'premium_only', 'enterprise_only'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published'
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. INVESTOR CONTENT (Documents)
-- =============================================

CREATE TABLE IF NOT EXISTS investor_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'document', 'presentation', 'spreadsheet', 'video', 'image'
    category VARCHAR(100),
    file_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    icon VARCHAR(50) DEFAULT '📄',
    file_format VARCHAR(50),
    file_size INTEGER,
    duration_seconds INTEGER,
    visibility VARCHAR(50) DEFAULT 'active_investors_only',
    visible_to_tiers JSONB, -- ['standard', 'premium', 'enterprise']
    requires_nda BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    show_on_dashboard BOOLEAN DEFAULT true,
    cta_button_text VARCHAR(100) DEFAULT 'Download',
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. WAITLIST CATEGORIES
-- =============================================

CREATE TABLE IF NOT EXISTS waitlist_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    icon VARCHAR(50) DEFAULT '📋',
    color VARCHAR(50) DEFAULT '#3b82f6',
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. PROJECT UPDATES (Waitlist Updates)
-- =============================================

CREATE TABLE IF NOT EXISTS project_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500),
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    video_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    category_id UUID REFERENCES waitlist_categories(id) ON DELETE SET NULL,
    category VARCHAR(100), -- Legacy field for backwards compatibility
    author_name VARCHAR(255) DEFAULT 'Risivo Team',
    visibility VARCHAR(50) DEFAULT 'public',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published'
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. WAITLIST USERS (Legacy - for user_auth routes)
-- =============================================

CREATE TABLE IF NOT EXISTS waitlist_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    business_name VARCHAR(255),
    waitlist_number SERIAL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'inactive'
    email_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 9. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 10. RLS POLICIES - Allow service role access
-- =============================================

-- Drop existing policies if they exist (to avoid conflicts)
DO $$ 
BEGIN
    -- Admin Users
    DROP POLICY IF EXISTS "Service role full access to admin_users" ON admin_users;
    DROP POLICY IF EXISTS "Service role full access to admin_sessions" ON admin_sessions;
    DROP POLICY IF EXISTS "Service role full access to users" ON users;
    DROP POLICY IF EXISTS "Service role full access to user_sessions" ON user_sessions;
    DROP POLICY IF EXISTS "Service role full access to password_reset_tokens" ON password_reset_tokens;
    DROP POLICY IF EXISTS "Service role full access to nda_signatures" ON nda_signatures;
    DROP POLICY IF EXISTS "Service role full access to investor_categories" ON investor_categories;
    DROP POLICY IF EXISTS "Service role full access to investor_updates" ON investor_updates;
    DROP POLICY IF EXISTS "Service role full access to investor_content" ON investor_content;
    DROP POLICY IF EXISTS "Service role full access to waitlist_categories" ON waitlist_categories;
    DROP POLICY IF EXISTS "Service role full access to project_updates" ON project_updates;
    DROP POLICY IF EXISTS "Service role full access to waitlist_users" ON waitlist_users;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create policies for service role full access
CREATE POLICY "Service role full access to admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Service role full access to admin_sessions" ON admin_sessions FOR ALL USING (true);
CREATE POLICY "Service role full access to users" ON users FOR ALL USING (true);
CREATE POLICY "Service role full access to user_sessions" ON user_sessions FOR ALL USING (true);
CREATE POLICY "Service role full access to password_reset_tokens" ON password_reset_tokens FOR ALL USING (true);
CREATE POLICY "Service role full access to nda_signatures" ON nda_signatures FOR ALL USING (true);
CREATE POLICY "Service role full access to investor_categories" ON investor_categories FOR ALL USING (true);
CREATE POLICY "Service role full access to investor_updates" ON investor_updates FOR ALL USING (true);
CREATE POLICY "Service role full access to investor_content" ON investor_content FOR ALL USING (true);
CREATE POLICY "Service role full access to waitlist_categories" ON waitlist_categories FOR ALL USING (true);
CREATE POLICY "Service role full access to project_updates" ON project_updates FOR ALL USING (true);
CREATE POLICY "Service role full access to waitlist_users" ON waitlist_users FOR ALL USING (true);

-- =============================================
-- 11. INSERT DEFAULT DATA
-- =============================================

-- Default Investor Categories (if empty)
INSERT INTO investor_categories (name, slug, icon, color, sort_order) 
SELECT * FROM (VALUES 
    ('General', 'general', '💼', '#10b981', 1),
    ('Product', 'product', '🚀', '#3b82f6', 2),
    ('Business', 'business', '💰', '#8b5cf6', 3)
) AS v(name, slug, icon, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM investor_categories LIMIT 1);

-- Default Waitlist Categories (if empty)
INSERT INTO waitlist_categories (name, slug, icon, color, sort_order) 
SELECT * FROM (VALUES 
    ('Product Updates', 'product-updates', '🚀', '#10b981', 1),
    ('Company News', 'company-news', '📰', '#3b82f6', 2),
    ('Announcements', 'announcements', '✨', '#8b5cf6', 3)
) AS v(name, slug, icon, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM waitlist_categories LIMIT 1);

-- =============================================
-- 12. VERIFY SETUP
-- =============================================

SELECT 'Setup Complete!' as status;

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN (
    'admin_users', 'admin_sessions', 'users', 'user_sessions', 
    'password_reset_tokens', 'nda_signatures', 'investor_categories',
    'investor_updates', 'investor_content', 'waitlist_categories',
    'project_updates', 'waitlist_users'
)
ORDER BY table_name;
