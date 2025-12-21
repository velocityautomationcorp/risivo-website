-- ============================================================
-- Migration 004: Investor Tiers, Analytics & Content Management
-- ============================================================
-- Purpose: Add investor tier system, activity tracking, engagement
--          analytics, and investor-specific content management
-- Created: 2025-12-21
-- ============================================================

-- ============================================================
-- PART 1: Add Investor Tier Column to Users Table
-- ============================================================

-- Add investor_tier column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS investor_tier VARCHAR(50) DEFAULT 'prospective';

-- Add comment explaining tiers
COMMENT ON COLUMN public.users.investor_tier IS 
'Investor tier levels: prospective, angel, seed, series_a_plus, strategic_partner';

-- Add index for investor tier queries
CREATE INDEX IF NOT EXISTS idx_users_investor_tier 
ON public.users(investor_tier) 
WHERE user_type = 'investor';


-- ============================================================
-- PART 2: Create Investor Content Table
-- ============================================================

-- Table for managing investor-only content (documents, videos, etc.)
CREATE TABLE IF NOT EXISTS public.investor_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content identification
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'document', 'video', 'presentation', 'report', 'legal'
    
    -- File/resource details
    file_url TEXT,                      -- URL to document (PDF, DOCX, etc.)
    video_url TEXT,                     -- URL to video file or embed
    thumbnail_url TEXT,                 -- Preview thumbnail
    
    -- Organization
    category VARCHAR(100),              -- 'Financial Reports', 'Product Demos', 'Investor Presentations', 'Legal Documents', 'Founder Message'
    icon VARCHAR(50) DEFAULT '📄',      -- Display icon/emoji
    
    -- File metadata
    file_format VARCHAR(20),            -- 'PDF', 'MP4', 'PPTX', etc.
    file_size VARCHAR(20),              -- Human-readable size like '2.4 MB'
    duration_seconds INT,               -- For videos
    
    -- Access control
    visibility VARCHAR(50) DEFAULT 'active_investors_only', -- 'all_investors', 'active_investors_only', 'nda_signed_only', 'specific_tiers'
    visible_to_tiers TEXT[],           -- Array of tiers: ['angel', 'seed', 'series_a_plus']
    requires_nda BOOLEAN DEFAULT true,
    
    -- Display settings
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    show_on_dashboard BOOLEAN DEFAULT true,
    cta_button_text VARCHAR(100) DEFAULT 'Download',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'draft'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Tracking
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0
);

-- Indexes for investor_content
CREATE INDEX IF NOT EXISTS idx_investor_content_category ON public.investor_content(category);
CREATE INDEX IF NOT EXISTS idx_investor_content_status ON public.investor_content(status);
CREATE INDEX IF NOT EXISTS idx_investor_content_visibility ON public.investor_content(visibility);
CREATE INDEX IF NOT EXISTS idx_investor_content_sort_order ON public.investor_content(sort_order);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_investor_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER investor_content_updated_at
    BEFORE UPDATE ON public.investor_content
    FOR EACH ROW
    EXECUTE FUNCTION update_investor_content_updated_at();


-- ============================================================
-- PART 3: Create Investor Activity Log Table
-- ============================================================

-- Table for tracking all investor actions
CREATE TABLE IF NOT EXISTS public.investor_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- What
    action_type VARCHAR(50) NOT NULL, -- 'login', 'view_document', 'download', 'watch_video', 'view_update', 'nda_signed', 'profile_updated'
    
    -- Where (what resource was accessed)
    resource_type VARCHAR(50),        -- 'investor_content', 'project_update', 'dashboard'
    resource_id UUID,                 -- ID of the resource
    resource_title VARCHAR(255),      -- Human-readable resource name
    
    -- When
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- How (session details)
    session_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Additional context
    session_duration INT,             -- Seconds (for video watch time, document read time)
    metadata JSONB,                   -- Flexible field for extra data
    
    -- Device & location info
    device_type VARCHAR(50),          -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(2),               -- ISO country code
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for investor_activity_log
CREATE INDEX IF NOT EXISTS idx_investor_activity_user_id ON public.investor_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_activity_action_type ON public.investor_activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_investor_activity_timestamp ON public.investor_activity_log(action_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_investor_activity_resource ON public.investor_activity_log(resource_type, resource_id);


-- ============================================================
-- PART 4: Create Investor Engagement Stats Table
-- ============================================================

-- Aggregated engagement metrics per investor (updated periodically)
CREATE TABLE IF NOT EXISTS public.investor_engagement_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User reference
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Login activity
    total_logins INT DEFAULT 0,
    first_login_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    days_since_last_login INT,
    
    -- Content engagement
    total_downloads INT DEFAULT 0,
    total_views INT DEFAULT 0,
    total_watch_time_minutes INT DEFAULT 0, -- Total video watch time
    unique_content_viewed INT DEFAULT 0,
    
    -- Update engagement
    updates_viewed INT DEFAULT 0,
    last_update_viewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Engagement scoring
    engagement_score INT DEFAULT 0,        -- 0-100 score
    engagement_level VARCHAR(20) DEFAULT 'new', -- 'new', 'low', 'medium', 'high', 'champion'
    
    -- Status tracking
    is_active BOOLEAN DEFAULT true,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for investor_engagement_stats
CREATE INDEX IF NOT EXISTS idx_investor_engagement_user_id ON public.investor_engagement_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_engagement_score ON public.investor_engagement_stats(engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_investor_engagement_level ON public.investor_engagement_stats(engagement_level);


-- ============================================================
-- PART 5: Add Additional Columns to NDA Signatures Table
-- ============================================================

-- Add missing columns to nda_signatures
ALTER TABLE public.nda_signatures
ADD COLUMN IF NOT EXISTS signature_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS agreed_at TIMESTAMP WITH TIME ZONE;

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_nda_signatures_user_id ON public.nda_signatures(user_id);


-- ============================================================
-- PART 6: Useful Functions
-- ============================================================

-- Function to calculate engagement score for an investor
CREATE OR REPLACE FUNCTION calculate_investor_engagement_score(investor_user_id UUID)
RETURNS INT AS $$
DECLARE
    score INT := 0;
    login_count INT;
    download_count INT;
    view_count INT;
    watch_time INT;
    days_since_login INT;
BEGIN
    -- Get stats from investor_engagement_stats
    SELECT 
        total_logins,
        total_downloads,
        total_views,
        total_watch_time_minutes,
        EXTRACT(DAY FROM NOW() - last_login_at)
    INTO 
        login_count,
        download_count,
        view_count,
        watch_time,
        days_since_login
    FROM public.investor_engagement_stats
    WHERE user_id = investor_user_id;
    
    -- If no stats found, return 0
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Calculate score based on activity
    score := score + LEAST(login_count * 5, 25);           -- Max 25 points for logins
    score := score + LEAST(download_count * 3, 20);        -- Max 20 points for downloads
    score := score + LEAST(view_count * 2, 20);            -- Max 20 points for views
    score := score + LEAST(watch_time / 10, 20);           -- Max 20 points for watch time
    
    -- Deduct points for inactivity
    IF days_since_login > 7 THEN
        score := score - LEAST(days_since_login, 15);      -- Max -15 points for inactivity
    END IF;
    
    -- Ensure score is between 0 and 100
    score := LEAST(GREATEST(score, 0), 100);
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;


-- Function to determine engagement level from score
CREATE OR REPLACE FUNCTION get_engagement_level(score INT)
RETURNS VARCHAR(20) AS $$
BEGIN
    IF score >= 80 THEN
        RETURN 'champion';
    ELSIF score >= 60 THEN
        RETURN 'high';
    ELSIF score >= 40 THEN
        RETURN 'medium';
    ELSIF score >= 20 THEN
        RETURN 'low';
    ELSE
        RETURN 'new';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Function to log investor activity
CREATE OR REPLACE FUNCTION log_investor_activity(
    p_user_id UUID,
    p_action_type VARCHAR(50),
    p_resource_type VARCHAR(50) DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_resource_title VARCHAR(255) DEFAULT NULL,
    p_session_duration INT DEFAULT NULL,
    p_ip_address VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    -- Insert activity log
    INSERT INTO public.investor_activity_log (
        user_id,
        action_type,
        resource_type,
        resource_id,
        resource_title,
        session_duration,
        ip_address,
        user_agent
    ) VALUES (
        p_user_id,
        p_action_type,
        p_resource_type,
        p_resource_id,
        p_resource_title,
        p_session_duration,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO activity_id;
    
    -- Update engagement stats
    INSERT INTO public.investor_engagement_stats (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update specific metrics based on action type
    IF p_action_type = 'login' THEN
        UPDATE public.investor_engagement_stats
        SET 
            total_logins = total_logins + 1,
            last_login_at = NOW(),
            days_since_last_login = 0,
            first_login_at = COALESCE(first_login_at, NOW())
        WHERE user_id = p_user_id;
    
    ELSIF p_action_type = 'download' THEN
        UPDATE public.investor_engagement_stats
        SET total_downloads = total_downloads + 1
        WHERE user_id = p_user_id;
        
        -- Increment download count on content
        IF p_resource_type = 'investor_content' AND p_resource_id IS NOT NULL THEN
            UPDATE public.investor_content
            SET download_count = download_count + 1
            WHERE id = p_resource_id;
        END IF;
    
    ELSIF p_action_type = 'view_document' OR p_action_type = 'watch_video' THEN
        UPDATE public.investor_engagement_stats
        SET 
            total_views = total_views + 1,
            total_watch_time_minutes = total_watch_time_minutes + COALESCE(p_session_duration / 60, 0)
        WHERE user_id = p_user_id;
        
        -- Increment view count on content
        IF p_resource_type = 'investor_content' AND p_resource_id IS NOT NULL THEN
            UPDATE public.investor_content
            SET view_count = view_count + 1
            WHERE id = p_resource_id;
        END IF;
    
    ELSIF p_action_type = 'view_update' THEN
        UPDATE public.investor_engagement_stats
        SET 
            updates_viewed = updates_viewed + 1,
            last_update_viewed_at = NOW()
        WHERE user_id = p_user_id;
    END IF;
    
    -- Recalculate engagement score
    UPDATE public.investor_engagement_stats
    SET 
        engagement_score = calculate_investor_engagement_score(p_user_id),
        engagement_level = get_engagement_level(calculate_investor_engagement_score(p_user_id)),
        last_calculated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- PART 7: Insert Default Investor Content (Founder Message)
-- ============================================================

-- Insert Founder Message video (always visible to all investors)
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
    false, -- No NDA required for founder message
    true,
    true,
    1, -- Show first
    'Watch Video',
    'active',
    NOW()
) ON CONFLICT DO NOTHING;


-- ============================================================
-- PART 8: Sample Data for Testing (Optional)
-- ============================================================

-- Uncomment below to insert sample investor content for testing
/*
INSERT INTO public.investor_content (title, description, content_type, category, icon, visibility, sort_order, status, published_at) VALUES
('Pitch Deck Q4 2024', 'Our latest investor pitch deck with updated metrics and roadmap', 'document', 'Investor Presentations', '📊', 'nda_signed_only', 2, 'active', NOW()),
('Financial Forecast 2025', 'Detailed financial projections and growth strategy', 'document', 'Financial Reports', '💰', 'active_investors_only', 3, 'active', NOW()),
('Product Demo: Platform Overview', 'Comprehensive walkthrough of our platform features', 'video', 'Product Demos', '🎬', 'nda_signed_only', 4, 'active', NOW()),
('Term Sheet Template', 'Standard investment terms and conditions', 'document', 'Legal Documents', '📋', 'active_investors_only', 5, 'active', NOW());
*/


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if investor_tier column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'investor_tier';

-- Check if investor_content table was created
SELECT COUNT(*) as investor_content_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'investor_content';

-- Check if investor_activity_log table was created
SELECT COUNT(*) as activity_log_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'investor_activity_log';

-- Check if investor_engagement_stats table was created
SELECT COUNT(*) as engagement_stats_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'investor_engagement_stats';

-- Show all functions created
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('calculate_investor_engagement_score', 'get_engagement_level', 'log_investor_activity');

-- Success message
SELECT '✅ Migration 004: Investor Tiers & Analytics - COMPLETED!' as status;
