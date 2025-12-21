-- ============================================================
-- SIMPLIFIED INVESTOR PLATFORM MIGRATION
-- This version works with existing tables
-- ============================================================

-- ============================================================
-- PART 1: Add Investor Tier Column (if missing)
-- ============================================================

-- Add investor_tier column to users table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'investor_tier'
    ) THEN
        ALTER TABLE public.users ADD COLUMN investor_tier VARCHAR(50) DEFAULT 'prospective';
        CREATE INDEX idx_users_investor_tier ON public.users(investor_tier) WHERE user_type = 'investor';
    END IF;
END $$;


-- ============================================================
-- PART 2: Drop and Recreate Investor Tables
-- (Ensures correct structure)
-- ============================================================

-- Drop existing investor tables if they exist
DROP TABLE IF EXISTS public.investor_activity_log CASCADE;
DROP TABLE IF EXISTS public.investor_engagement_stats CASCADE;
DROP TABLE IF EXISTS public.investor_content CASCADE;

-- Create investor_content table
CREATE TABLE public.investor_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL,
    file_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    category VARCHAR(100),
    icon VARCHAR(50) DEFAULT '📄',
    file_format VARCHAR(20),
    file_size VARCHAR(20),
    duration_seconds INT,
    visibility VARCHAR(50) DEFAULT 'active_investors_only',
    visible_to_tiers TEXT[],
    requires_nda BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    show_on_dashboard BOOLEAN DEFAULT true,
    cta_button_text VARCHAR(100) DEFAULT 'Download',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0
);

CREATE INDEX idx_investor_content_category ON public.investor_content(category);
CREATE INDEX idx_investor_content_status ON public.investor_content(status);
CREATE INDEX idx_investor_content_sort_order ON public.investor_content(sort_order);

-- Create investor_activity_log table
CREATE TABLE public.investor_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    resource_title VARCHAR(255),
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_duration INT,
    metadata JSONB,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_investor_activity_user_id ON public.investor_activity_log(user_id);
CREATE INDEX idx_investor_activity_action_type ON public.investor_activity_log(action_type);
CREATE INDEX idx_investor_activity_timestamp ON public.investor_activity_log(action_timestamp DESC);

-- Create investor_engagement_stats table
CREATE TABLE public.investor_engagement_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    total_logins INT DEFAULT 0,
    first_login_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    days_since_last_login INT,
    total_downloads INT DEFAULT 0,
    total_views INT DEFAULT 0,
    total_watch_time_minutes INT DEFAULT 0,
    unique_content_viewed INT DEFAULT 0,
    updates_viewed INT DEFAULT 0,
    last_update_viewed_at TIMESTAMP WITH TIME ZONE,
    engagement_score INT DEFAULT 0,
    engagement_level VARCHAR(20) DEFAULT 'new',
    is_active BOOLEAN DEFAULT true,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_investor_engagement_user_id ON public.investor_engagement_stats(user_id);
CREATE INDEX idx_investor_engagement_score ON public.investor_engagement_stats(engagement_score DESC);


-- ============================================================
-- PART 3: Update NDA Signatures Table
-- ============================================================

-- Add missing columns to nda_signatures (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'nda_signatures' 
        AND column_name = 'signature_text'
    ) THEN
        ALTER TABLE public.nda_signatures ADD COLUMN signature_text VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'nda_signatures' 
        AND column_name = 'agreed_at'
    ) THEN
        ALTER TABLE public.nda_signatures ADD COLUMN agreed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_nda_signatures_user_id ON public.nda_signatures(user_id);


-- ============================================================
-- PART 4: Create Functions
-- ============================================================

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_investor_engagement_score(investor_user_id UUID)
RETURNS INT AS $$
DECLARE
    score INT := 0;
    stats RECORD;
BEGIN
    SELECT * INTO stats FROM public.investor_engagement_stats WHERE user_id = investor_user_id;
    IF NOT FOUND THEN RETURN 0; END IF;
    
    score := score + LEAST(COALESCE(stats.total_logins, 0) * 5, 25);
    score := score + LEAST(COALESCE(stats.total_downloads, 0) * 3, 20);
    score := score + LEAST(COALESCE(stats.total_views, 0) * 2, 20);
    score := score + LEAST(COALESCE(stats.total_watch_time_minutes, 0) / 10, 20);
    
    IF stats.last_login_at IS NOT NULL THEN
        IF EXTRACT(DAY FROM NOW() - stats.last_login_at) > 7 THEN
            score := score - LEAST(EXTRACT(DAY FROM NOW() - stats.last_login_at)::INT, 15);
        END IF;
    END IF;
    
    RETURN LEAST(GREATEST(score, 0), 100);
END;
$$ LANGUAGE plpgsql;

-- Function to get engagement level
CREATE OR REPLACE FUNCTION get_engagement_level(score INT)
RETURNS VARCHAR(20) AS $$
BEGIN
    IF score >= 80 THEN RETURN 'champion';
    ELSIF score >= 60 THEN RETURN 'high';
    ELSIF score >= 40 THEN RETURN 'medium';
    ELSIF score >= 20 THEN RETURN 'low';
    ELSE RETURN 'new';
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
    INSERT INTO public.investor_activity_log (
        user_id, action_type, resource_type, resource_id, 
        resource_title, session_duration, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action_type, p_resource_type, p_resource_id,
        p_resource_title, p_session_duration, p_ip_address, p_user_agent
    ) RETURNING id INTO activity_id;
    
    INSERT INTO public.investor_engagement_stats (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    IF p_action_type = 'login' THEN
        UPDATE public.investor_engagement_stats
        SET total_logins = total_logins + 1,
            last_login_at = NOW(),
            first_login_at = COALESCE(first_login_at, NOW())
        WHERE user_id = p_user_id;
    
    ELSIF p_action_type = 'download' THEN
        UPDATE public.investor_engagement_stats
        SET total_downloads = total_downloads + 1
        WHERE user_id = p_user_id;
        
        IF p_resource_type = 'investor_content' AND p_resource_id IS NOT NULL THEN
            UPDATE public.investor_content
            SET download_count = download_count + 1
            WHERE id = p_resource_id;
        END IF;
    
    ELSIF p_action_type IN ('view_document', 'watch_video') THEN
        UPDATE public.investor_engagement_stats
        SET total_views = total_views + 1,
            total_watch_time_minutes = total_watch_time_minutes + COALESCE(p_session_duration / 60, 0)
        WHERE user_id = p_user_id;
        
        IF p_resource_type = 'investor_content' AND p_resource_id IS NOT NULL THEN
            UPDATE public.investor_content
            SET view_count = view_count + 1
            WHERE id = p_resource_id;
        END IF;
    END IF;
    
    UPDATE public.investor_engagement_stats
    SET engagement_score = calculate_investor_engagement_score(p_user_id),
        engagement_level = get_engagement_level(calculate_investor_engagement_score(p_user_id)),
        last_calculated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- PART 5: Insert Default Content
-- ============================================================

-- Insert Founder Message
INSERT INTO public.investor_content (
    title, description, content_type, category, icon,
    visibility, requires_nda, show_on_dashboard, is_featured,
    sort_order, cta_button_text, status, published_at
) VALUES (
    'Welcome from Our Founder',
    'A personal message from our founder introducing Risivo and our vision.',
    'video', 'Founder Message', '🎥',
    'all_investors', false, true, true,
    1, 'Watch Video', 'active', NOW()
) ON CONFLICT DO NOTHING;


-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT 
    'investor_tier column' as item,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' 
        AND column_name = 'investor_tier'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'investor_content table',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'investor_content'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
    'investor_activity_log table',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'investor_activity_log'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
    'investor_engagement_stats table',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'investor_engagement_stats'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
    'log_investor_activity function',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_name = 'log_investor_activity'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END;

-- Success message
SELECT '🎉 MIGRATION COMPLETE! Investor platform is ready.' as message;
