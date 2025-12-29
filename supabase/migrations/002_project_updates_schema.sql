-- ============================================
-- RISIVO PROJECT UPDATES PLATFORM - DATABASE SCHEMA
-- This migration creates all tables needed for:
-- 1. Admin authentication (admin_users, admin_sessions)
-- 2. User authentication (waitlist_users, user_sessions, password_reset_tokens)
-- 3. Project updates content
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
-- Note: If admin_users already exists with different columns, 
-- we'll add the missing columns

-- First check if table exists and add missing columns
DO $$ 
BEGIN
  -- Add full_name if it doesn't exist (for code compatibility)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'admin_users' AND column_name = 'full_name') THEN
    ALTER TABLE admin_users ADD COLUMN full_name TEXT;
  END IF;
  
  -- Add is_active if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'admin_users' AND column_name = 'is_active') THEN
    ALTER TABLE admin_users ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  -- Sync full_name from name if full_name is null
  UPDATE admin_users SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;
  
  -- Sync is_active from status if is_active is null
  UPDATE admin_users SET is_active = (status = 'active') WHERE is_active IS NULL AND status IS NOT NULL;
  
EXCEPTION WHEN undefined_table THEN
  -- Table doesn't exist, create it
  CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'admin',
    status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    permissions JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    invited_by UUID,
    invite_token VARCHAR(255),
    invite_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
END $$;

-- ============================================
-- 2. ADMIN SESSIONS TABLE
-- ============================================
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
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ============================================
-- 3. WAITLIST USERS TABLE (for registered investors/users)
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  business_name TEXT,
  phone TEXT,
  company_size TEXT,
  industry TEXT,
  preferred_language TEXT DEFAULT 'en',
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending', -- pending, approved, activated
  source TEXT DEFAULT 'website',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  notes TEXT,
  last_login_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_status ON waitlist_users(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_created ON waitlist_users(created_at DESC);

-- ============================================
-- 4. USER SESSIONS TABLE
-- ============================================
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
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- ============================================
-- 5. PASSWORD RESET TOKENS TABLE
-- ============================================
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
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);

-- ============================================
-- 6. PROJECT UPDATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT DEFAULT 'general',
  author_name TEXT,
  author_id UUID REFERENCES admin_users(id),
  featured_image_url TEXT,
  media_type TEXT, -- 'image', 'video', 'gallery'
  media_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_updates_slug ON project_updates(slug);
CREATE INDEX IF NOT EXISTS idx_project_updates_status ON project_updates(status);
CREATE INDEX IF NOT EXISTS idx_project_updates_published ON project_updates(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_updates_featured ON project_updates(is_featured, published_at DESC);

-- ============================================
-- 7. UPDATE IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS update_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  update_id UUID NOT NULL REFERENCES project_updates(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_update_images_update ON update_images(update_id);

-- ============================================
-- 8. UPDATE ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS update_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  update_id UUID NOT NULL REFERENCES project_updates(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view', 'share_twitter', 'share_linkedin', etc.
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_update_analytics_update ON update_analytics(update_id);
CREATE INDEX IF NOT EXISTS idx_update_analytics_type ON update_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_update_analytics_created ON update_analytics(created_at DESC);

-- ============================================
-- 9. UPDATE CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS update_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#667eea',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO update_categories (name, slug, description, color, display_order) VALUES
  ('General', 'general', 'General updates and announcements', '#667eea', 1),
  ('Product', 'product', 'Product development updates', '#10B981', 2),
  ('Business', 'business', 'Business and company news', '#F59E0B', 3),
  ('Technical', 'technical', 'Technical updates and improvements', '#3B82F6', 4),
  ('Milestone', 'milestone', 'Important milestones achieved', '#8B5CF6', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 10. UPDATE INTERACTIONS TABLE (likes/dislikes)
-- ============================================
CREATE TABLE IF NOT EXISTS update_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  update_id UUID NOT NULL REFERENCES project_updates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES waitlist_users(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL, -- 'like', 'dislike'
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(update_id, user_id, interaction_type)
);

CREATE INDEX IF NOT EXISTS idx_update_interactions_update ON update_interactions(update_id);
CREATE INDEX IF NOT EXISTS idx_update_interactions_user ON update_interactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_interactions ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS for all tables
-- (Cloudflare Workers use service role key)
CREATE POLICY IF NOT EXISTS "Service role bypass for admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for admin_sessions" ON admin_sessions FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for waitlist_users" ON waitlist_users FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for user_sessions" ON user_sessions FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for password_reset_tokens" ON password_reset_tokens FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for project_updates" ON project_updates FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for update_images" ON update_images FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for update_analytics" ON update_analytics FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for update_categories" ON update_categories FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Service role bypass for update_interactions" ON update_interactions FOR ALL USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_admin_users ON admin_users;
CREATE TRIGGER set_updated_at_admin_users
BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_waitlist_users ON waitlist_users;
CREATE TRIGGER set_updated_at_waitlist_users
BEFORE UPDATE ON waitlist_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_project_updates ON project_updates;
CREATE TRIGGER set_updated_at_project_updates
BEFORE UPDATE ON project_updates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_update_categories ON update_categories;
CREATE TRIGGER set_updated_at_update_categories
BEFORE UPDATE ON update_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETE!
-- ============================================

COMMENT ON TABLE admin_users IS 'Admin users for the Project Updates Platform';
COMMENT ON TABLE admin_sessions IS 'Session tokens for admin authentication';
COMMENT ON TABLE waitlist_users IS 'Registered users/investors for the platform';
COMMENT ON TABLE user_sessions IS 'Session tokens for user authentication';
COMMENT ON TABLE password_reset_tokens IS 'Tokens for password reset functionality';
COMMENT ON TABLE project_updates IS 'Project updates/posts content';
COMMENT ON TABLE update_images IS 'Images associated with updates';
COMMENT ON TABLE update_analytics IS 'Analytics events for updates';
COMMENT ON TABLE update_categories IS 'Categories for organizing updates';
COMMENT ON TABLE update_interactions IS 'User interactions (likes/dislikes) with updates';
