-- ============================================
-- ADD AUTHENTICATION TO WAITLIST USERS
-- ============================================
-- This adds login capability for waitlist members
-- to access the exclusive Updates Platform
-- ============================================

-- Add authentication fields to waitlist_users table
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;

-- Create index for faster login lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email_active ON waitlist_users(email, is_active);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_password_reset_token ON waitlist_users(password_reset_token);

-- Create user_sessions table for waitlist members
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Disable RLS for user_sessions
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- UTILITY FUNCTIONS FOR USER AUTH
-- ============================================

-- Function to cleanup expired user sessions
CREATE OR REPLACE FUNCTION cleanup_expired_user_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions
    WHERE expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to generate random password (8 characters: letters + numbers)
CREATE OR REPLACE FUNCTION generate_random_password()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN 'Risivo' || result || '!';
END;
$$ LANGUAGE plpgsql;

-- Function to create user session
CREATE OR REPLACE FUNCTION create_user_session(
    p_user_id UUID,
    p_session_token TEXT,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_session_id UUID;
BEGIN
    INSERT INTO user_sessions (
        user_id,
        session_token,
        expires_at,
        ip_address,
        user_agent
    )
    VALUES (
        p_user_id,
        p_session_token,
        CURRENT_TIMESTAMP + INTERVAL '30 days', -- Sessions last 30 days
        p_ip_address,
        p_user_agent
    )
    RETURNING id INTO new_session_id;
    
    -- Update last_login_at for user
    UPDATE waitlist_users
    SET last_login_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
    
    RETURN new_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to verify user session
CREATE OR REPLACE FUNCTION verify_user_session(p_session_token TEXT)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    business_name TEXT,
    preferred_language TEXT,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.business_name,
        u.preferred_language,
        u.is_active
    FROM user_sessions s
    JOIN waitlist_users u ON s.user_id = u.id
    WHERE s.session_token = p_session_token
    AND s.expires_at > CURRENT_TIMESTAMP
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check new columns exist
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'waitlist_users' 
-- AND column_name IN ('password_hash', 'is_active', 'last_login_at', 'password_reset_token', 'password_reset_expires');

-- Check user_sessions table exists
-- SELECT * FROM user_sessions LIMIT 1;

-- Test password generation
-- SELECT generate_random_password();

-- ============================================
-- NOTES FOR MAKE.COM WEBHOOK
-- ============================================
-- 
-- After a user signs up on the coming soon page:
--
-- 1. Generate password:
--    password = generate_random_password() 
--    Example: "RisivoAb3Xy9Kp!"
--
-- 2. Hash password with bcrypt (rounds=10)
--    Use bcrypt library in Make.com or external API
--
-- 3. Update waitlist_users:
--    UPDATE waitlist_users 
--    SET password_hash = '{bcrypt_hash}'
--    WHERE email = '{user_email}';
--
-- 4. Send email with:
--    Subject: "Welcome to Risivo Early Access! 🎉"
--    Body:
--      - Welcome message
--      - Login URL: https://risivo.com/updates/login
--      - Email: {user_email}
--      - Password: {plain_password}
--      - Instructions to change password
--
-- 5. User receives email and can login to Updates Platform
--
-- ============================================

-- ============================================
-- SAMPLE: Update existing user with password
-- ============================================
-- For testing, you can manually set a password for an existing user:
-- 
-- UPDATE waitlist_users
-- SET password_hash = '$2a$10$rQZ9YX5K8vH3jB4nP2tZMOqQXb8YQ9xL6tE3fK7wR5nM4pA2sD1uG' -- Password: risivo2025
-- WHERE email = 'jpfrancois2021@gmail.com';
--
-- Then test login at /updates/login with:
-- Email: jpfrancois2021@gmail.com
-- Password: risivo2025

-- ============================================
-- END OF UPDATE
-- ============================================
