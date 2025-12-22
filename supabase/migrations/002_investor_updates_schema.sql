-- ============================================
-- RISIVO - INVESTOR UPDATES SCHEMA
-- Separate update system for investors
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. INVESTOR CATEGORIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS investor_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#6b3fea',
    icon TEXT DEFAULT '📋',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_investor_categories_slug ON investor_categories(slug);
CREATE INDEX IF NOT EXISTS idx_investor_categories_sort ON investor_categories(sort_order);

-- ============================================
-- 2. INVESTOR UPDATES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS investor_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    
    -- Media
    featured_image_url TEXT,
    video_url TEXT,
    gallery_images JSONB DEFAULT '[]', -- Array of image URLs
    
    -- Categorization
    category_id UUID REFERENCES investor_categories(id) ON DELETE SET NULL,
    category TEXT DEFAULT 'General', -- Fallback text category
    
    -- Status and visibility
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    visibility TEXT DEFAULT 'all_investors' CHECK (visibility IN ('all_investors', 'active_only', 'tier_restricted')),
    required_tier TEXT, -- For tier-restricted content
    
    -- Author info
    author_name TEXT DEFAULT 'Risivo Team',
    author_id UUID,
    
    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_investor_updates_slug ON investor_updates(slug);
CREATE INDEX IF NOT EXISTS idx_investor_updates_status ON investor_updates(status);
CREATE INDEX IF NOT EXISTS idx_investor_updates_category ON investor_updates(category_id);
CREATE INDEX IF NOT EXISTS idx_investor_updates_created ON investor_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investor_updates_published ON investor_updates(published_at DESC);

-- ============================================
-- 3. WAITLIST CATEGORIES TABLE (rename existing update_categories if needed)
-- ============================================

CREATE TABLE IF NOT EXISTS waitlist_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    icon TEXT DEFAULT '📋',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_categories_slug ON waitlist_categories(slug);
CREATE INDEX IF NOT EXISTS idx_waitlist_categories_sort ON waitlist_categories(sort_order);

-- ============================================
-- 4. ADD CATEGORY_ID TO PROJECT_UPDATES IF NOT EXISTS
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_updates' 
        AND column_name = 'category_id'
    ) THEN
        ALTER TABLE project_updates 
        ADD COLUMN category_id UUID REFERENCES waitlist_categories(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_updates' 
        AND column_name = 'gallery_images'
    ) THEN
        ALTER TABLE project_updates 
        ADD COLUMN gallery_images JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'project_updates' 
        AND column_name = 'video_url'
    ) THEN
        ALTER TABLE project_updates 
        ADD COLUMN video_url TEXT;
    END IF;
END $$;

-- ============================================
-- 5. TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update 'updated_at' timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for investor_categories
DROP TRIGGER IF EXISTS set_updated_at_investor_categories ON investor_categories;
CREATE TRIGGER set_updated_at_investor_categories
BEFORE UPDATE ON investor_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for investor_updates
DROP TRIGGER IF EXISTS set_updated_at_investor_updates ON investor_updates;
CREATE TRIGGER set_updated_at_investor_updates
BEFORE UPDATE ON investor_updates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for waitlist_categories
DROP TRIGGER IF EXISTS set_updated_at_waitlist_categories ON waitlist_categories;
CREATE TRIGGER set_updated_at_waitlist_categories
BEFORE UPDATE ON waitlist_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. SEED DEFAULT CATEGORIES
-- ============================================

-- Default Waitlist Categories
INSERT INTO waitlist_categories (name, slug, description, color, icon, sort_order)
VALUES 
    ('Feature', 'feature', 'New feature announcements', '#10b981', '✨', 1),
    ('Improvement', 'improvement', 'Platform improvements', '#3b82f6', '🔧', 2),
    ('Bug Fix', 'bug-fix', 'Bug fixes and patches', '#f59e0b', '🐛', 3),
    ('Announcement', 'announcement', 'General announcements', '#6b3fea', '📢', 4),
    ('General', 'general', 'General updates', '#6c757d', '📋', 5)
ON CONFLICT (slug) DO NOTHING;

-- Default Investor Categories
INSERT INTO investor_categories (name, slug, description, color, icon, sort_order)
VALUES 
    ('Financial Update', 'financial-update', 'Financial reports and metrics', '#10b981', '💰', 1),
    ('Product Update', 'product-update', 'Product development news', '#3b82f6', '🚀', 2),
    ('Milestone', 'milestone', 'Company milestones', '#f59e0b', '🏆', 3),
    ('Market Update', 'market-update', 'Market and industry news', '#8b5cf6', '📈', 4),
    ('Team Update', 'team-update', 'Team and hiring news', '#ec4899', '👥', 5),
    ('General', 'general', 'General investor updates', '#6c757d', '📋', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE investor_categories IS 'Categories for investor-specific updates';
COMMENT ON TABLE investor_updates IS 'Updates specifically for investors with financial info';
COMMENT ON TABLE waitlist_categories IS 'Categories for waitlist subscriber updates';
