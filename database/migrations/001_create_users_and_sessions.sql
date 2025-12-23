-- Migration: Create users, sessions, and nda_signatures tables
-- Date: 2025-12-20
-- Purpose: Two-track waitlist/investor system with NDA

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Profile Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(20),
    language VARCHAR(20) DEFAULT 'english',
    
    -- User Type & Status
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('waitlist', 'investor', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    
    -- Waitlist-Specific Fields
    discount_offer VARCHAR(50),
    source VARCHAR(50),
    
    -- Investor-Specific Fields
    investor_status VARCHAR(20),
    nda_signed_at TIMESTAMP,
    nda_ip_address VARCHAR(45),
    admin_approved_by UUID REFERENCES users(id),
    admin_approved_at TIMESTAMP,
    open_to_demo BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_investor_status_values CHECK (
        investor_status IN ('pending_nda', 'nda_signed', 'active', 'rejected') 
        OR investor_status IS NULL
    ),
    CONSTRAINT chk_user_type_investor_status CHECK (
        (user_type = 'investor' AND investor_status IS NOT NULL) OR
        (user_type != 'investor' AND investor_status IS NULL)
    )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_investor_status ON users(investor_status);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Comments
COMMENT ON TABLE users IS 'All users: waitlist subscribers, investors, and admins';
COMMENT ON COLUMN users.user_type IS 'User role: waitlist, investor, or admin';
COMMENT ON COLUMN users.investor_status IS 'Only for investors: pending_nda, nda_signed, active, rejected';
COMMENT ON COLUMN users.discount_offer IS 'Only for waitlist: e.g., 50_percent_lifetime';

-- ============================================================================
-- 2. SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Session Data
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    
    -- Tracking
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

COMMENT ON TABLE sessions IS 'User login sessions with tokens';
COMMENT ON COLUMN sessions.session_token IS 'UUID token stored in HTTP-only cookie';

-- ============================================================================
-- 3. NDA SIGNATURES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS nda_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Signature Details
    full_name_typed VARCHAR(200) NOT NULL,
    signature_timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Legal & Technical Details
    nda_version VARCHAR(20) DEFAULT 'v1.0',
    nda_text_hash VARCHAR(64) NOT NULL,
    
    -- Audit Trail
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    country_code VARCHAR(2),
    
    -- Unique Constraint: One signature per user per version
    UNIQUE(user_id, nda_version)
);

CREATE INDEX IF NOT EXISTS idx_nda_signatures_user_id ON nda_signatures(user_id);
CREATE INDEX IF NOT EXISTS idx_nda_signatures_timestamp ON nda_signatures(signature_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_nda_signatures_version ON nda_signatures(nda_version);

COMMENT ON TABLE nda_signatures IS 'Electronic signatures for investor NDAs';
COMMENT ON COLUMN nda_signatures.nda_text_hash IS 'SHA-256 hash to prove which version was signed';
COMMENT ON COLUMN nda_signatures.full_name_typed IS 'User typed their full name as electronic signature';

-- ============================================================================
-- 4. UPDATE TRIGGER (for updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. CLEANUP FUNCTION (for expired sessions)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. SAMPLE ADMIN USER (Optional - for testing)
-- ============================================================================

-- Uncomment to create a test admin user
-- Password: Admin123!
/*
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    user_type,
    status
) VALUES (
    'admin@risivo.com',
    '$2a$10$rZ0qN5rJ5J5J5J5J5J5J5OhK3K3K3K3K3K3K3K3K3K3K3K3K3K3K3K',
    'Admin',
    'User',
    'admin',
    'active'
) ON CONFLICT (email) DO NOTHING;
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify tables were created
SELECT 
    'users' as table_name, 
    COUNT(*) as row_count 
FROM users
UNION ALL
SELECT 
    'sessions' as table_name, 
    COUNT(*) as row_count 
FROM sessions
UNION ALL
SELECT 
    'nda_signatures' as table_name, 
    COUNT(*) as row_count 
FROM nda_signatures;
