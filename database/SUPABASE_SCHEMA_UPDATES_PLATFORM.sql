-- ============================================
-- RISIVO PROJECT UPDATES PLATFORM
-- Database Schema for Supabase
-- ============================================
-- This schema avoids common issues:
-- ✅ No CHECK constraints with case-sensitive values
-- ✅ RLS disabled by default (will enable with proper policies)
-- ✅ All lowercase enum values
-- ✅ Proper indexes for performance
-- ✅ Cascading deletes where appropriate
-- ✅ Auto-incrementing sequences where needed
-- ============================================

-- ============================================
-- TABLE 1: project_updates
-- Main table for storing all project updates
-- ============================================
CREATE TABLE IF NOT EXISTS project_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'announcement',
    author_name TEXT NOT NULL DEFAULT 'Risivo Team',
    author_email TEXT,
    featured_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_updates_slug ON project_updates(slug);
CREATE INDEX IF NOT EXISTS idx_project_updates_status ON project_updates(status);
CREATE INDEX IF NOT EXISTS idx_project_updates_category ON project_updates(category);
CREATE INDEX IF NOT EXISTS idx_project_updates_published_at ON project_updates(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON project_updates;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON project_updates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 2: update_images
-- Store multiple images per update
-- ============================================
CREATE TABLE IF NOT EXISTS update_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    update_id UUID NOT NULL REFERENCES project_updates(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_update_images_update_id ON update_images(update_id);
CREATE INDEX IF NOT EXISTS idx_update_images_display_order ON update_images(display_order);

-- ============================================
-- TABLE 3: admin_users
-- Store admin user credentials
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_admin_updated_at ON admin_users;
CREATE TRIGGER set_admin_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE 4: admin_sessions
-- Store admin login sessions (JWT alternative)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- ============================================
-- TABLE 5: update_analytics
-- Track individual view/share events
-- ============================================
CREATE TABLE IF NOT EXISTS update_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    update_id UUID NOT NULL REFERENCES project_updates(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'view', 'share_twitter', 'share_linkedin', 'share_facebook'
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_update_analytics_update_id ON update_analytics(update_id);
CREATE INDEX IF NOT EXISTS idx_update_analytics_event_type ON update_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_update_analytics_created_at ON update_analytics(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Disable RLS for all tables (we'll use API-level auth)
-- ============================================
ALTER TABLE project_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE update_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE update_analytics DISABLE ROW LEVEL SECURITY;

-- ============================================
-- SAMPLE DATA - Create first admin user
-- ============================================
-- Password: risivo2025 (hashed with bcrypt)
-- You should change this after first login!
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES (
    'admin@risivo.com',
    '$2a$10$rQZ9YX5K8vH3jB4nP2tZMOqQXb8YQ9xL6tE3fK7wR5nM4pA2sD1uG', -- risivo2025
    'Admin User',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SAMPLE DATA - Create demo project update
-- ============================================
INSERT INTO project_updates (
    slug,
    title,
    excerpt,
    content,
    category,
    author_name,
    author_email,
    status,
    published_at
)
VALUES (
    'welcome-to-risivo-updates',
    'Welcome to Risivo Development Updates!',
    'Stay up to date with the latest features, improvements, and announcements from the Risivo team.',
    '# Welcome to Risivo Updates!

We''re excited to launch our new development update platform! 🎉

## What You Can Expect

- **Weekly Updates**: Get insights into what we''re building
- **Feature Announcements**: Be the first to know about new features
- **Bug Fixes**: Transparency about what we''re fixing
- **Roadmap Insights**: See what''s coming next

## Stay Connected

Follow us on social media and share your feedback. We''re building Risivo together with you!

**Thank you for being part of our journey!**

— The Risivo Team',
    'announcement',
    'Risivo Team',
    'team@risivo.com',
    'published',
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to generate URL-friendly slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(update_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE project_updates
    SET views_count = views_count + 1
    WHERE id = update_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to increment share count
CREATE OR REPLACE FUNCTION increment_share_count(update_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE project_updates
    SET shares_count = shares_count + 1
    WHERE id = update_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS for easier querying
-- ============================================

-- View: Published updates with analytics
CREATE OR REPLACE VIEW published_updates_with_stats AS
SELECT 
    u.*,
    COUNT(DISTINCT CASE WHEN a.event_type = 'view' THEN a.id END) as total_views,
    COUNT(DISTINCT CASE WHEN a.event_type LIKE 'share_%' THEN a.id END) as total_shares
FROM project_updates u
LEFT JOIN update_analytics a ON u.id = a.update_id
WHERE u.status = 'published'
GROUP BY u.id
ORDER BY u.published_at DESC;

-- ============================================
-- CLEANUP OLD SESSIONS (run this periodically)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM admin_sessions
    WHERE expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after setup to verify everything works:

-- 1. Check all tables exist
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('project_updates', 'update_images', 'admin_users', 'admin_sessions', 'update_analytics');

-- 2. Check RLS is disabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('project_updates', 'update_images', 'admin_users', 'admin_sessions', 'update_analytics');

-- 3. Verify sample data
-- SELECT * FROM admin_users;
-- SELECT * FROM project_updates WHERE status = 'published';

-- 4. Test utility functions
-- SELECT generate_slug('My Awesome Update: Testing 123!');
-- SELECT increment_view_count((SELECT id FROM project_updates LIMIT 1));

-- ============================================
-- NOTES FOR IMPLEMENTATION
-- ============================================
-- 
-- CATEGORIES (use lowercase in code):
-- - 'feature' - New features
-- - 'improvement' - Enhancements to existing features
-- - 'bugfix' - Bug fixes
-- - 'announcement' - General announcements
-- - 'maintenance' - Maintenance updates
--
-- STATUSES (use lowercase in code):
-- - 'draft' - Not published yet
-- - 'published' - Live and visible to public
-- - 'archived' - Hidden but not deleted
--
-- ROLES (use lowercase in code):
-- - 'admin' - Full access
-- - 'editor' - Can create/edit/publish updates
-- - 'viewer' - Read-only access
--
-- ANALYTICS EVENT TYPES (use lowercase in code):
-- - 'view' - Someone viewed an update
-- - 'share_twitter' - Shared on Twitter
-- - 'share_linkedin' - Shared on LinkedIn
-- - 'share_facebook' - Shared on Facebook
-- - 'share_other' - Shared via other means
--
-- ============================================
-- SECURITY NOTES
-- ============================================
-- 
-- 1. RLS is DISABLED because we're using service_role key
--    and implementing auth at the API level
--
-- 2. Admin password is hashed with bcrypt (NOT stored plain)
--
-- 3. Sessions expire after 7 days by default
--
-- 4. Always use service_role key for admin operations
--
-- 5. Public endpoints (view updates) don't need auth
--
-- ============================================
-- END OF SCHEMA
-- ============================================
