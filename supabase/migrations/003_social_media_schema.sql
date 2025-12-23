-- ============================================
-- RISIVO - SOCIAL MEDIA MANAGEMENT SCHEMA
-- Complete social media posting and analytics system
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SOCIAL MEDIA PLATFORMS (Reference Table)
-- ============================================

CREATE TABLE IF NOT EXISTS social_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_key TEXT NOT NULL UNIQUE, -- facebook_page, facebook_group, linkedin_company, etc.
    platform_name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    requires_video BOOLEAN DEFAULT false, -- For YouTube, TikTok
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default platforms
INSERT INTO social_platforms (platform_key, platform_name, icon, color, requires_video, sort_order) VALUES
    ('facebook_page', 'Facebook Page', '📘', '#1877f2', false, 1),
    ('facebook_group', 'Facebook Group', '👥', '#1877f2', false, 2),
    ('linkedin_company', 'LinkedIn Company Page', '💼', '#0a66c2', false, 3),
    ('linkedin_profile', 'LinkedIn Profile', '👤', '#0a66c2', false, 4),
    ('linkedin_group', 'LinkedIn Group', '👥', '#0a66c2', false, 5),
    ('twitter', 'Twitter/X', '🐦', '#1da1f2', false, 6),
    ('instagram', 'Instagram', '📷', '#e4405f', false, 7),
    ('youtube', 'YouTube', '🎬', '#ff0000', true, 8),
    ('pinterest', 'Pinterest', '📌', '#bd081c', false, 9),
    ('tiktok', 'TikTok', '🎵', '#000000', true, 10)
ON CONFLICT (platform_key) DO NOTHING;

-- ============================================
-- 2. SOCIAL MEDIA CONNECTIONS (Admin Config)
-- ============================================

CREATE TABLE IF NOT EXISTS social_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_id UUID NOT NULL REFERENCES social_platforms(id) ON DELETE CASCADE,
    
    -- Connection details
    connection_name TEXT NOT NULL, -- e.g., "Risivo Official Page", "Risivo Investors Group"
    account_id TEXT, -- Platform-specific account/page/group ID
    account_name TEXT, -- Display name from platform
    account_url TEXT, -- Link to the page/profile
    
    -- OAuth credentials (encrypted in production)
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    
    -- API credentials (for platforms that need them)
    api_key TEXT,
    api_secret TEXT,
    
    -- Additional platform-specific data
    metadata JSONB DEFAULT '{}',
    
    -- Status
    is_connected BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    connection_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint per platform
    UNIQUE(platform_id, account_id)
);

CREATE INDEX IF NOT EXISTS idx_social_connections_platform ON social_connections(platform_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_active ON social_connections(is_active, is_connected);

-- ============================================
-- 3. URL SHORTENER
-- ============================================

CREATE TABLE IF NOT EXISTS short_urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    short_code TEXT NOT NULL UNIQUE, -- The 'xyz' in risivo.com/s/xyz
    original_url TEXT NOT NULL,
    
    -- Metadata
    title TEXT, -- For analytics display
    update_type TEXT, -- 'waitlist', 'investor'
    update_id UUID, -- Reference to the update
    
    -- Analytics
    click_count INTEGER DEFAULT 0,
    
    -- Tracking
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ -- Optional expiration
);

CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_short_urls_update ON short_urls(update_id);

-- ============================================
-- 4. URL CLICK ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS url_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    short_url_id UUID NOT NULL REFERENCES short_urls(id) ON DELETE CASCADE,
    
    -- Click data
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT, -- mobile, desktop, tablet
    browser TEXT,
    
    -- Source tracking
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT
);

CREATE INDEX IF NOT EXISTS idx_url_clicks_short_url ON url_clicks(short_url_id);
CREATE INDEX IF NOT EXISTS idx_url_clicks_date ON url_clicks(clicked_at);

-- ============================================
-- 5. SOCIAL MEDIA POSTS
-- ============================================

CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source update
    update_type TEXT NOT NULL, -- 'waitlist' or 'investor'
    update_id UUID NOT NULL,
    update_title TEXT,
    
    -- Post content
    post_content TEXT NOT NULL, -- The actual text to post
    short_url_id UUID REFERENCES short_urls(id),
    
    -- Media
    image_url TEXT,
    video_url TEXT,
    
    -- Scheduling
    scheduled_for TIMESTAMPTZ, -- NULL = post immediately
    posted_at TIMESTAMPTZ,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'posting', 'posted', 'failed', 'cancelled')),
    
    -- Created by
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_update ON social_posts(update_type, update_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_posts(scheduled_for);

-- ============================================
-- 6. SOCIAL POST TARGETS (Which platforms to post to)
-- ============================================

CREATE TABLE IF NOT EXISTS social_post_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    social_post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
    connection_id UUID NOT NULL REFERENCES social_connections(id) ON DELETE CASCADE,
    
    -- Platform response
    platform_post_id TEXT, -- ID returned by platform after posting
    platform_post_url TEXT, -- Direct link to the post
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'posting', 'posted', 'failed')),
    error_message TEXT,
    
    -- Timestamps
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(social_post_id, connection_id)
);

CREATE INDEX IF NOT EXISTS idx_post_targets_post ON social_post_targets(social_post_id);
CREATE INDEX IF NOT EXISTS idx_post_targets_connection ON social_post_targets(connection_id);
CREATE INDEX IF NOT EXISTS idx_post_targets_status ON social_post_targets(status);

-- ============================================
-- 7. SOCIAL MEDIA ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS social_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID NOT NULL REFERENCES social_connections(id) ON DELETE CASCADE,
    
    -- Metrics (updated periodically)
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Engagement metrics
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    
    -- Period
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_social_analytics_connection ON social_analytics(connection_id);
CREATE INDEX IF NOT EXISTS idx_social_analytics_date ON social_analytics(recorded_at);

-- ============================================
-- 8. POST ANALYTICS (Per-post metrics)
-- ============================================

CREATE TABLE IF NOT EXISTS post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_target_id UUID NOT NULL REFERENCES social_post_targets(id) ON DELETE CASCADE,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    
    -- Reach
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    
    -- Updated
    last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_analytics_target ON post_analytics(post_target_id);

-- ============================================
-- 9. SCHEDULED JOBS QUEUE
-- ============================================

CREATE TABLE IF NOT EXISTS social_job_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    job_type TEXT NOT NULL, -- 'post', 'refresh_token', 'sync_analytics'
    payload JSONB NOT NULL,
    
    -- Scheduling
    scheduled_for TIMESTAMPTZ NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_job_queue_status ON social_job_queue(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_job_queue_scheduled ON social_job_queue(scheduled_for) WHERE status = 'pending';

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Trigger for social_connections
DROP TRIGGER IF EXISTS set_updated_at_social_connections ON social_connections;
CREATE TRIGGER set_updated_at_social_connections
BEFORE UPDATE ON social_connections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for social_posts
DROP TRIGGER IF EXISTS set_updated_at_social_posts ON social_posts;
CREATE TRIGGER set_updated_at_social_posts
BEFORE UPDATE ON social_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTION: Generate Short Code
-- ============================================

CREATE OR REPLACE FUNCTION generate_short_code(length INTEGER DEFAULT 6)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE social_platforms IS 'Reference table for supported social media platforms';
COMMENT ON TABLE social_connections IS 'Admin-configured social media account connections';
COMMENT ON TABLE short_urls IS 'URL shortener for social media posts (risivo.com/s/xyz)';
COMMENT ON TABLE url_clicks IS 'Click tracking for shortened URLs';
COMMENT ON TABLE social_posts IS 'Posts scheduled/sent to social media';
COMMENT ON TABLE social_post_targets IS 'Which platforms each post is sent to';
COMMENT ON TABLE social_analytics IS 'Historical analytics for connected accounts';
COMMENT ON TABLE post_analytics IS 'Per-post engagement metrics';
COMMENT ON TABLE social_job_queue IS 'Background job queue for scheduled posts';
