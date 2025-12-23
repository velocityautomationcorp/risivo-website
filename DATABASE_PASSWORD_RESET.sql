-- PASSWORD RESET TOKENS TABLE
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx/sql

-- ============================================
-- CREATE PASSWORD RESET TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(100),
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Add comments
COMMENT ON TABLE password_reset_tokens IS 'Stores password reset tokens for user password recovery';
COMMENT ON COLUMN password_reset_tokens.token IS 'Unique token sent in reset email';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Token expiration time (typically 1 hour)';
COMMENT ON COLUMN password_reset_tokens.used_at IS 'Timestamp when token was used (NULL if not used)';

-- ============================================
-- CLEANUP OLD TOKENS (Optional - run periodically)
-- ============================================
-- Delete expired or used tokens older than 7 days
-- You can run this manually or set up as a scheduled job
/*
DELETE FROM password_reset_tokens
WHERE created_at < NOW() - INTERVAL '7 days'
  AND (used_at IS NOT NULL OR expires_at < NOW());
*/

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Password reset tokens table created successfully!' AS status;

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'password_reset_tokens'
ORDER BY ordinal_position;
