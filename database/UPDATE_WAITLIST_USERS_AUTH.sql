-- ============================================
-- ADD AUTHENTICATION TO WAITLIST USERS
-- Update existing waitlist_users table
-- ============================================

-- Add authentication columns to waitlist_users table
ALTER TABLE waitlist_users 
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS temp_password TEXT; -- Store temp password for first email

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_users_is_active ON waitlist_users(is_active);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_last_login ON waitlist_users(last_login_at DESC);

-- Add comments for clarity
COMMENT ON COLUMN waitlist_users.password_hash IS 'Bcrypt hashed password for login';
COMMENT ON COLUMN waitlist_users.is_active IS 'Whether user has access to updates platform';
COMMENT ON COLUMN waitlist_users.last_login_at IS 'Last time user logged into updates platform';
COMMENT ON COLUMN waitlist_users.temp_password IS 'Temporary password sent in welcome email (for reference only)';

-- ============================================
-- CREATE USER SESSIONS TABLE
-- ============================================
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

-- ============================================
-- UTILITY FUNCTIONS FOR USER AUTH
-- ============================================

-- Function to generate random password
CREATE OR REPLACE FUNCTION generate_random_password()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to verify user session
CREATE OR REPLACE FUNCTION verify_user_session(token TEXT)
RETURNS TABLE(
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    business_name TEXT,
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
        u.is_active
    FROM user_sessions s
    JOIN waitlist_users u ON s.user_id = u.id
    WHERE s.session_token = token
    AND s.expires_at > CURRENT_TIMESTAMP
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

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

-- ============================================
-- UPDATE EXISTING WAITLIST USERS
-- Set is_active = true for all existing users
-- ============================================
UPDATE waitlist_users
SET is_active = true
WHERE is_active IS NULL;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check new columns exist
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'waitlist_users'
-- AND column_name IN ('password_hash', 'is_active', 'last_login_at', 'temp_password');

-- Check user_sessions table exists
-- SELECT * FROM user_sessions LIMIT 1;

-- Test generate random password
-- SELECT generate_random_password();

-- ============================================
-- NOTES FOR IMPLEMENTATION
-- ============================================
--
-- WORKFLOW FOR NEW WAITLIST SIGNUP:
-- 1. User fills form on coming soon page
-- 2. API inserts into waitlist_users (no password yet)
-- 3. Make.com webhook triggers:
--    a. Generate random password: SELECT generate_random_password()
--    b. Hash password with bcrypt
--    c. Update waitlist_users SET password_hash = hashed_password
--    d. Send email with login URL and temp password
-- 4. User receives email with:
--    - Login URL: https://risivo.com/updates/login
--    - Email: {email}
--    - Password: {temp_password}
--    - Message: "Change your password after first login"
--
-- USER LOGIN FLOW:
-- 1. User goes to /updates/login
-- 2. Enters email + password
-- 3. API verifies credentials
-- 4. Creates session in user_sessions table
-- 5. Returns session_token (stored in HTTP-only cookie)
-- 6. Redirects to /updates/dashboard
--
-- SESSION VERIFICATION:
-- 1. Every protected page checks session_token cookie
-- 2. Calls verify_user_session(token)
-- 3. If valid + active user → Allow access
-- 4. If invalid/expired → Redirect to /updates/login
--
-- ============================================
-- END OF UPDATE SCRIPT
-- ============================================
