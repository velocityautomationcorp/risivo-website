-- DATABASE MIGRATION FOR LIKES/DISLIKES AND COMMENTS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx

-- ============================================
-- 1. CREATE LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS update_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id UUID NOT NULL REFERENCES project_updates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  like_type VARCHAR(10) NOT NULL CHECK (like_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one like/dislike per user per update
  UNIQUE(update_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_update_likes_update_id ON update_likes(update_id);
CREATE INDEX IF NOT EXISTS idx_update_likes_user_id ON update_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_update_likes_type ON update_likes(like_type);

COMMENT ON TABLE update_likes IS 'Stores user likes/dislikes for updates';
COMMENT ON COLUMN update_likes.like_type IS 'Either "like" or "dislike"';

-- ============================================
-- 2. CREATE COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS update_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id UUID NOT NULL REFERENCES project_updates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_update_comments_update_id ON update_comments(update_id);
CREATE INDEX IF NOT EXISTS idx_update_comments_user_id ON update_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_update_comments_created_at ON update_comments(created_at DESC);

COMMENT ON TABLE update_comments IS 'User comments on updates';
COMMENT ON COLUMN update_comments.is_edited IS 'Track if comment was edited';

-- ============================================
-- 3. ADD LIKE/COMMENT COUNTS TO project_updates
-- ============================================
ALTER TABLE project_updates 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_project_updates_likes ON project_updates(likes_count);
CREATE INDEX IF NOT EXISTS idx_project_updates_comments ON project_updates(comments_count);

-- ============================================
-- 4. CREATE TRIGGERS TO UPDATE COUNTS
-- ============================================

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment appropriate count
    IF NEW.like_type = 'like' THEN
      UPDATE project_updates SET likes_count = likes_count + 1 WHERE id = NEW.update_id;
    ELSE
      UPDATE project_updates SET dislikes_count = dislikes_count + 1 WHERE id = NEW.update_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement appropriate count
    IF OLD.like_type = 'like' THEN
      UPDATE project_updates SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.update_id;
    ELSE
      UPDATE project_updates SET dislikes_count = GREATEST(dislikes_count - 1, 0) WHERE id = OLD.update_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle type change (like -> dislike or vice versa)
    IF OLD.like_type != NEW.like_type THEN
      IF OLD.like_type = 'like' THEN
        UPDATE project_updates 
        SET likes_count = GREATEST(likes_count - 1, 0), 
            dislikes_count = dislikes_count + 1 
        WHERE id = NEW.update_id;
      ELSE
        UPDATE project_updates 
        SET dislikes_count = GREATEST(dislikes_count - 1, 0), 
            likes_count = likes_count + 1 
        WHERE id = NEW.update_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE project_updates SET comments_count = comments_count + 1 WHERE id = NEW.update_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE project_updates SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.update_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_likes_count_trigger ON update_likes;
CREATE TRIGGER update_likes_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON update_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_like_counts();

DROP TRIGGER IF EXISTS update_comments_count_trigger ON update_comments;
CREATE TRIGGER update_comments_count_trigger
  AFTER INSERT OR DELETE ON update_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_counts();

-- ============================================
-- 5. CREATE UPDATED_AT TRIGGERS
-- ============================================

-- Create the updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_likes_updated_at ON update_likes;
CREATE TRIGGER update_likes_updated_at
  BEFORE UPDATE ON update_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON update_comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON update_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Tables created successfully!' AS status;

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('update_likes', 'update_comments')
ORDER BY table_name;

-- Check new columns in project_updates
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'project_updates' 
  AND column_name IN ('likes_count', 'dislikes_count', 'comments_count');
