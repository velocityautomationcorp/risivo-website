-- Add media fields to project_updates table
-- Run this in your Supabase SQL Editor

ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN project_updates.media_type IS 'Type of media: none, image, video, or gallery';
COMMENT ON COLUMN project_updates.media_url IS 'URL for single image or video';
COMMENT ON COLUMN project_updates.gallery_images IS 'Array of image URLs for photo galleries';

-- Create index for media_type for faster queries
CREATE INDEX IF NOT EXISTS idx_project_updates_media_type ON project_updates(media_type);
