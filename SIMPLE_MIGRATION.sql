-- SIMPLE MIGRATION - NO FOREIGN KEYS YET
-- Run this first to create the basic structure

-- Step 1: Create password_reset_tokens WITHOUT foreign key
DROP TABLE IF EXISTS public.password_reset_tokens CASCADE;

CREATE TABLE public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,  -- NO FOREIGN KEY YET
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- Verify it was created
SELECT 'password_reset_tokens table created successfully!' as status;
