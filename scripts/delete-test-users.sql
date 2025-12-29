-- ============================================
-- DELETE TEST USERS FROM RISIVO DATABASE
-- ============================================
-- Run this in Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx/sql
-- ============================================

-- Test emails to delete
-- jp@risivo.com
-- jp@buzgrowth.digital
-- jpfrancois2021@gmail.com
-- jpfrancois070879@gmail.com

-- Step 1: Delete user sessions first (foreign key constraint)
DELETE FROM user_sessions 
WHERE user_id IN (
  SELECT id FROM users 
  WHERE email IN (
    'jp@risivo.com',
    'jp@buzgrowth.digital',
    'jpfrancois2021@gmail.com',
    'jpfrancois070879@gmail.com'
  )
);

-- Step 2: Delete from users table
DELETE FROM users 
WHERE email IN (
  'jp@risivo.com',
  'jp@buzgrowth.digital',
  'jpfrancois2021@gmail.com',
  'jpfrancois070879@gmail.com'
);

-- Step 3: Delete from waitlist_users table
DELETE FROM waitlist_users 
WHERE email IN (
  'jp@risivo.com',
  'jp@buzgrowth.digital',
  'jpfrancois2021@gmail.com',
  'jpfrancois070879@gmail.com'
);

-- Step 4: Verify deletion (optional - check if any remain)
SELECT 'users' as table_name, email FROM users 
WHERE email IN (
  'jp@risivo.com',
  'jp@buzgrowth.digital',
  'jpfrancois2021@gmail.com',
  'jpfrancois070879@gmail.com'
)
UNION ALL
SELECT 'waitlist_users' as table_name, email FROM waitlist_users 
WHERE email IN (
  'jp@risivo.com',
  'jp@buzgrowth.digital',
  'jpfrancois2021@gmail.com',
  'jpfrancois070879@gmail.com'
);

-- If the above returns no rows, all test users have been deleted successfully!
