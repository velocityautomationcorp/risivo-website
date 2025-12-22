-- OAuth Sessions Migration
-- Stores temporary OAuth session data during the connection flow
-- This allows for a smooth "one-click connect" experience

-- Create oauth_sessions table for temporary OAuth state
CREATE TABLE IF NOT EXISTS oauth_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    platform VARCHAR(50) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    profile_data JSONB DEFAULT '{}',
    organizations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_session_id ON oauth_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_platform ON oauth_sessions(platform);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_created_at ON oauth_sessions(created_at);

-- Auto-cleanup function to remove expired sessions (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM oauth_sessions
    WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Add token_expires_at column to social_connections if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'social_connections' 
        AND column_name = 'token_expires_at'
    ) THEN
        ALTER TABLE social_connections ADD COLUMN token_expires_at TIMESTAMPTZ;
    END IF;
END $$;

-- Add refresh_token column to social_connections if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'social_connections' 
        AND column_name = 'refresh_token'
    ) THEN
        ALTER TABLE social_connections ADD COLUMN refresh_token TEXT;
    END IF;
END $$;

-- Add updated_at column to social_connections if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'social_connections' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE social_connections ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Grant permissions
GRANT ALL ON oauth_sessions TO authenticated;
GRANT ALL ON oauth_sessions TO service_role;

-- Comments for documentation
COMMENT ON TABLE oauth_sessions IS 'Temporary storage for OAuth session data during the connection flow';
COMMENT ON COLUMN oauth_sessions.session_id IS 'Unique session identifier stored in cookie';
COMMENT ON COLUMN oauth_sessions.platform IS 'Social platform name (linkedin, facebook, twitter, etc.)';
COMMENT ON COLUMN oauth_sessions.access_token IS 'OAuth access token (encrypted in production)';
COMMENT ON COLUMN oauth_sessions.refresh_token IS 'OAuth refresh token for token renewal';
COMMENT ON COLUMN oauth_sessions.profile_data IS 'User profile data from the platform';
COMMENT ON COLUMN oauth_sessions.organizations IS 'List of organizations/pages/groups the user can connect';
