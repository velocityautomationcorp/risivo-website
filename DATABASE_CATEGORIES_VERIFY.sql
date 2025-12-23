-- Verify and fix update_categories table
-- Run this if you got a "trigger already exists" error

-- Check if categories exist, if not insert them
INSERT INTO update_categories (name, slug, description, color, display_order) VALUES
  ('Feature', 'feature', 'New features and functionality', '#10b981', 1),
  ('Improvement', 'improvement', 'Enhancements to existing features', '#3b82f6', 2),
  ('Bug Fix', 'bug-fix', 'Bug fixes and issue resolutions', '#ef4444', 3),
  ('Announcement', 'announcement', 'Important announcements and news', '#f59e0b', 4),
  ('General', 'general', 'General updates and information', '#8b5cf6', 5)
ON CONFLICT (name) DO NOTHING;

-- Verify the data
SELECT * FROM update_categories ORDER BY display_order;
