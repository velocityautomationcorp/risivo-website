-- FIX AUTHOR NAME IN EXISTING POSTS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx/sql

-- Step 1: Check current state of your post
SELECT 
    id, 
    title, 
    author_name,
    author_id,
    likes_count,
    comments_count,
    views_count,
    slug
FROM project_updates
WHERE slug = 'welcome-to-risivo-your-early-bird-benefits-explained';

-- Step 2: Update author_name based on admin_users relationship
-- This will set author_name from the admin user's first_name and last_name
UPDATE project_updates
SET author_name = CONCAT(
    COALESCE(admin_users.first_name, ''),
    ' ',
    COALESCE(admin_users.last_name, '')
)
FROM admin_users
WHERE project_updates.author_id = admin_users.id
  AND (project_updates.author_name IS NULL OR project_updates.author_name = '');

-- Step 3: For posts without author_id, set default
UPDATE project_updates
SET author_name = 'Risivo Team'
WHERE author_name IS NULL OR author_name = '';

-- Step 4: Verify the fix
SELECT 
    id, 
    title, 
    author_name,
    author_id,
    likes_count,
    comments_count,
    views_count,
    slug
FROM project_updates
WHERE slug = 'welcome-to-risivo-your-early-bird-benefits-explained';

-- Step 5: Initialize counts if they are NULL
UPDATE project_updates
SET 
    likes_count = COALESCE(likes_count, 0),
    dislikes_count = COALESCE(dislikes_count, 0),
    comments_count = COALESCE(comments_count, 0),
    views_count = COALESCE(views_count, 0)
WHERE likes_count IS NULL 
   OR dislikes_count IS NULL 
   OR comments_count IS NULL 
   OR views_count IS NULL;

-- Step 6: Final verification
SELECT 
    id, 
    title, 
    author_name,
    likes_count,
    comments_count,
    views_count
FROM project_updates
ORDER BY created_at DESC;
