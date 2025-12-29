-- Add is_featured field to project_updates table
-- This allows marking one post as featured to display prominently on the dashboard

ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_updates_featured ON project_updates(is_featured);

-- Optional: If you want only ONE featured post at a time, you can create a function
-- This function ensures only one post is featured at a time
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

-- You can manually feature a post with:
-- UPDATE project_updates SET is_featured = true WHERE id = 'your-post-id';
