-- ============================================================
-- SOCIAL MEDIA INTEGRATION
-- Stores OAuth tokens for LinkedIn and other social platforms
-- ============================================================

-- Create social_media_accounts table
CREATE TABLE IF NOT EXISTS public.social_media_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,  -- 'linkedin', 'twitter', 'facebook', etc.
    account_name VARCHAR(255),       -- Display name or username
    account_id VARCHAR(255),         -- Platform-specific user/org ID
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    scopes TEXT[],                   -- Array of granted scopes
    profile_url TEXT,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    connected_by UUID REFERENCES public.admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(platform, account_id)
);

CREATE INDEX idx_social_media_platform ON public.social_media_accounts(platform);
CREATE INDEX idx_social_media_active ON public.social_media_accounts(is_active);

-- Create social_media_posts table to track posted content
CREATE TABLE IF NOT EXISTS public.social_media_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.social_media_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    post_id VARCHAR(255),            -- Platform-specific post ID
    content TEXT,
    media_urls TEXT[],
    link_url TEXT,
    update_id UUID REFERENCES public.project_updates(id) ON DELETE SET NULL,  -- If posted from an update
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'posted', 'failed', 'deleted'
    error_message TEXT,
    posted_at TIMESTAMP WITH TIME ZONE,
    posted_by UUID REFERENCES public.admin_users(id),
    engagement_data JSONB,           -- likes, comments, shares, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_social_posts_account ON public.social_media_posts(account_id);
CREATE INDEX idx_social_posts_platform ON public.social_media_posts(platform);
CREATE INDEX idx_social_posts_status ON public.social_media_posts(status);
CREATE INDEX idx_social_posts_update ON public.social_media_posts(update_id);

-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT 
    'social_media_accounts table' as item,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'social_media_accounts'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'social_media_posts table',
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'social_media_posts'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END;
