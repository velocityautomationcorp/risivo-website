-- =====================================================
-- Risivo Investor Platform - Complete Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. INVESTOR CATEGORIES (for investor updates)
-- =====================================================
CREATE TABLE IF NOT EXISTS investor_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10) DEFAULT '💼',
    color VARCHAR(20) DEFAULT '#10b981',
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investor_categories_slug ON investor_categories(slug);
CREATE INDEX IF NOT EXISTS idx_investor_categories_active ON investor_categories(is_active);

-- Disable RLS for investor_categories
ALTER TABLE investor_categories DISABLE ROW LEVEL SECURITY;

-- Insert default categories
INSERT INTO investor_categories (name, slug, icon, color, description, sort_order) VALUES
    ('Company News', 'company-news', '📰', '#3b82f6', 'Latest company announcements and news', 1),
    ('Financial Updates', 'financial-updates', '💰', '#10b981', 'Financial reports and metrics', 2),
    ('Product Milestones', 'product-milestones', '🚀', '#8b5cf6', 'Product development and launches', 3),
    ('Market Insights', 'market-insights', '📊', '#f59e0b', 'Market analysis and trends', 4),
    ('Team Updates', 'team-updates', '👥', '#ec4899', 'Team news and growth', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. INVESTOR UPDATES (news/updates for investors)
-- =====================================================
CREATE TABLE IF NOT EXISTS investor_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    video_url TEXT,
    gallery_images JSONB DEFAULT '[]',
    category_id UUID REFERENCES investor_categories(id) ON DELETE SET NULL,
    author_name VARCHAR(100) DEFAULT 'Risivo Team',
    visibility VARCHAR(50) DEFAULT 'all_investors',
    visible_to_tiers TEXT[],
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investor_updates_slug ON investor_updates(slug);
CREATE INDEX IF NOT EXISTS idx_investor_updates_status ON investor_updates(status);
CREATE INDEX IF NOT EXISTS idx_investor_updates_category ON investor_updates(category_id);
CREATE INDEX IF NOT EXISTS idx_investor_updates_published ON investor_updates(published_at DESC);

-- Disable RLS for investor_updates
ALTER TABLE investor_updates DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. UPDATE investor_content TABLE (add missing columns)
-- =====================================================
-- Add columns that might be missing
DO $$ 
BEGIN
    -- Add category column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'category') THEN
        ALTER TABLE investor_content ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- Add video_url column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'video_url') THEN
        ALTER TABLE investor_content ADD COLUMN video_url TEXT;
    END IF;
    
    -- Add thumbnail_url column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE investor_content ADD COLUMN thumbnail_url TEXT;
    END IF;
    
    -- Add file_size column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'file_size') THEN
        ALTER TABLE investor_content ADD COLUMN file_size INTEGER;
    END IF;
    
    -- Add duration_seconds column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'duration_seconds') THEN
        ALTER TABLE investor_content ADD COLUMN duration_seconds INTEGER;
    END IF;
    
    -- Add visible_to_tiers column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'visible_to_tiers') THEN
        ALTER TABLE investor_content ADD COLUMN visible_to_tiers TEXT[];
    END IF;
    
    -- Add requires_nda column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'requires_nda') THEN
        ALTER TABLE investor_content ADD COLUMN requires_nda BOOLEAN DEFAULT true;
    END IF;
    
    -- Add is_featured column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'is_featured') THEN
        ALTER TABLE investor_content ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    
    -- Add show_on_dashboard column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'show_on_dashboard') THEN
        ALTER TABLE investor_content ADD COLUMN show_on_dashboard BOOLEAN DEFAULT true;
    END IF;
    
    -- Add status column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'status') THEN
        ALTER TABLE investor_content ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
    
    -- Add published_at column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'investor_content' AND column_name = 'published_at') THEN
        ALTER TABLE investor_content ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
END $$;

-- =====================================================
-- 4. INVESTOR CONTENT VIEWS (track document views)
-- =====================================================
CREATE TABLE IF NOT EXISTS investor_content_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES investor_content(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_views_content ON investor_content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user ON investor_content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_views_date ON investor_content_views(viewed_at DESC);

-- Disable RLS for investor_content_views
ALTER TABLE investor_content_views DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. VERIFY ALL TABLES
-- =====================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'users', 
    'user_sessions',
    'nda_signatures', 
    'investor_content',
    'investor_categories',
    'investor_updates',
    'investor_content_views',
    'admin_users',
    'admin_sessions'
)
ORDER BY table_name;
