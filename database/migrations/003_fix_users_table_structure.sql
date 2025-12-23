-- Migration 003: Fix users table structure and add password_reset_tokens
-- Date: 2025-12-20
-- Purpose: Ensure public.users has correct structure and add password reset functionality

-- ============================================================================
-- STEP 1: Check if public.users already has correct structure
-- ============================================================================

DO $$
BEGIN
    -- Check if id column exists in public.users
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'id'
    ) THEN
        -- If id doesn't exist, we need to add it
        ALTER TABLE public.users ADD COLUMN id UUID DEFAULT gen_random_uuid();
        
        -- Make it primary key if table has data
        IF EXISTS (SELECT 1 FROM public.users LIMIT 1) THEN
            -- Update any NULL ids first
            UPDATE public.users SET id = gen_random_uuid() WHERE id IS NULL;
        END IF;
        
        -- Now make it primary key and not null
        ALTER TABLE public.users ALTER COLUMN id SET NOT NULL;
        ALTER TABLE public.users ADD PRIMARY KEY (id);
    END IF;
END $$;

-- ============================================================================
-- STEP 2: Ensure all required columns exist
-- ============================================================================

-- Add missing columns if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS language VARCHAR(20) DEFAULT 'english';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_type VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS discount_offer VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS source VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS investor_status VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nda_signed_at TIMESTAMP;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nda_ip_address VARCHAR(45);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS admin_approved_by UUID;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMP;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS open_to_demo BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Ensure email is unique
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_email_key' 
        AND conrelid = 'public.users'::regclass
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;
END $$;

-- ============================================================================
-- STEP 3: Create sessions table if it doesn't exist
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions(expires_at);

-- ============================================================================
-- STEP 4: Create password_reset_tokens table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

COMMENT ON TABLE public.password_reset_tokens IS 'Stores password reset tokens for user account recovery';

-- ============================================================================
-- STEP 5: Create nda_signatures table if it doesn't exist
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.nda_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name_typed VARCHAR(200) NOT NULL,
    signature_timestamp TIMESTAMP DEFAULT NOW(),
    nda_version VARCHAR(20) DEFAULT 'v1.0',
    nda_text_hash VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    country_code VARCHAR(2),
    UNIQUE(user_id, nda_version)
);

CREATE INDEX IF NOT EXISTS idx_nda_signatures_user_id ON public.nda_signatures(user_id);
CREATE INDEX IF NOT EXISTS idx_nda_signatures_timestamp ON public.nda_signatures(signature_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_nda_signatures_version ON public.nda_signatures(nda_version);

-- ============================================================================
-- STEP 6: Add indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_investor_status ON public.users(investor_status);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show current table structure
SELECT 
    'public.users' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
AND column_name IN ('id', 'email', 'password_hash', 'first_name', 'last_name', 'user_type')
ORDER BY column_name;

-- Confirm all tables exist
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM (
    VALUES 
        ('users'),
        ('sessions'),
        ('password_reset_tokens'),
        ('nda_signatures')
) AS t(table_name)
WHERE EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = t.table_name
);
