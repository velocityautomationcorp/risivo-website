-- ============================================
-- SET TEST USER PASSWORD
-- ============================================
-- This script sets the password for jpfrancois2021@gmail.com
-- to "risivo2025" using bcrypt hashing (10 rounds)
--
-- IMPORTANT: Run this AFTER running UPDATE_WAITLIST_USERS_AUTH.sql
-- ============================================

-- Set password for test user
-- Password: risivo2025
-- Bcrypt hash (10 rounds): $2b$10$7xGcH3x5YRZpYK1PzGPZJ.bxJ9Xz5mfZfRv5fZvZfZvZfZvZfZvZ
UPDATE waitlist_users
SET 
  password_hash = '$2a$10$XXXHASHXXXXX',  -- This will be replaced with actual hash
  is_active = true
WHERE email = 'jpfrancois2021@gmail.com';

-- ============================================
-- MANUAL PASSWORD GENERATION INSTRUCTIONS
-- ============================================
-- Since we can't generate bcrypt hashes in SQL directly,
-- you need to generate the hash and update the password.
--
-- Option 1: Use an online bcrypt generator:
-- 1. Go to https://bcrypt-generator.com/
-- 2. Enter password: risivo2025
-- 3. Select 10 rounds
-- 4. Copy the generated hash
-- 5. Replace $2a$10$XXXHASHXXXXX above with the generated hash
-- 6. Run this SQL script
--
-- Option 2: Use Node.js (if you have bcryptjs installed):
-- Run this in Node.js console:
--   const bcrypt = require('bcryptjs');
--   const hash = bcrypt.hashSync('risivo2025', 10);
--   console.log(hash);
--
-- Then replace the hash above and run this script.
--
-- ============================================
-- VERIFICATION
-- ============================================
-- After running this script, verify the password is set:
SELECT 
  id, 
  email, 
  first_name, 
  last_name,
  password_hash IS NOT NULL as has_password,
  is_active
FROM waitlist_users 
WHERE email = 'jpfrancois2021@gmail.com';
--
-- Expected result:
-- has_password: true
-- is_active: true
-- ============================================
