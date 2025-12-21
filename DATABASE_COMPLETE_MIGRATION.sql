-- COMPLETE DATABASE MIGRATION FOR RISIVO UPDATES SYSTEM
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
-- This adds all missing fields needed for the complete updates functionality

-- ============================================
-- 1. ADD AUTHOR FIELDS
-- ============================================
ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS author_id UUID,
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Add foreign key to admin_users if the table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        ALTER TABLE project_updates 
        ADD CONSTRAINT fk_project_updates_author 
        FOREIGN KEY (author_id) 
        REFERENCES admin_users(id) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for faster author queries
CREATE INDEX IF NOT EXISTS idx_project_updates_author_id ON project_updates(author_id);

COMMENT ON COLUMN project_updates.author_id IS 'ID of admin user who created the update';
COMMENT ON COLUMN project_updates.author_name IS 'Display name of the author (cached for performance)';

-- ============================================
-- 2. ADD PUBLISHED_AT TIMESTAMP
-- ============================================
ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Update existing published posts to have a published_at date
UPDATE project_updates 
SET published_at = created_at 
WHERE status = 'published' AND published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_project_updates_published_at ON project_updates(published_at);

COMMENT ON COLUMN project_updates.published_at IS 'Timestamp when the update was published';

-- ============================================
-- 3. ADD FEATURED POST FIELD
-- ============================================
ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for faster featured queries
CREATE INDEX IF NOT EXISTS idx_project_updates_featured ON project_updates(is_featured);

COMMENT ON COLUMN project_updates.is_featured IS 'Whether this post is featured (theater mode display)';

-- Create function to ensure only ONE post is featured at a time
CREATE OR REPLACE FUNCTION ensure_single_featured_post()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_featured = true THEN
    -- Unfeature all other posts
    UPDATE project_updates 
    SET is_featured = false 
    WHERE id != NEW.id AND is_featured = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single featured post
DROP TRIGGER IF EXISTS single_featured_post_trigger ON project_updates;
CREATE TRIGGER single_featured_post_trigger
  BEFORE INSERT OR UPDATE ON project_updates
  FOR EACH ROW
  WHEN (NEW.is_featured = true)
  EXECUTE FUNCTION ensure_single_featured_post();

-- ============================================
-- 4. ADD MEDIA FIELDS (if not already present)
-- ============================================
ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_project_updates_media_type ON project_updates(media_type);

COMMENT ON COLUMN project_updates.media_type IS 'Type of media: none, image, video, or gallery';
COMMENT ON COLUMN project_updates.media_url IS 'URL for single image or video (YouTube, Vimeo, Wistia, direct)';
COMMENT ON COLUMN project_updates.gallery_images IS 'Array of image URLs for photo galleries';

-- ============================================
-- 5. VERIFY CORE FIELDS EXIST
-- ============================================
-- These should already exist, but adding IF NOT EXISTS for safety

ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE NOT NULL,
ADD COLUMN IF NOT EXISTS content TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_project_updates_slug ON project_updates(slug);
CREATE INDEX IF NOT EXISTS idx_project_updates_status ON project_updates(status);
CREATE INDEX IF NOT EXISTS idx_project_updates_category ON project_updates(category);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);

-- ============================================
-- 6. ADD UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS project_updates_updated_at ON project_updates;
CREATE TRIGGER project_updates_updated_at 
  BEFORE UPDATE ON project_updates
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration worked:

-- Check all columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'project_updates'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'project_updates'
ORDER BY indexname;

-- Check triggers
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'project_updates';

-- Count existing posts
SELECT 
  status,
  COUNT(*) as count,
  COUNT(CASE WHEN is_featured THEN 1 END) as featured_count,
  COUNT(CASE WHEN author_id IS NOT NULL THEN 1 END) as with_author
FROM project_updates
GROUP BY status;

-- ============================================
-- SUCCESS!
-- ============================================
-- If you see no errors above, the migration is complete.
-- You can now deploy the code and create posts.
