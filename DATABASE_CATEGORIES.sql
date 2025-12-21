-- Create categories table for managing update categories
CREATE TABLE IF NOT EXISTS update_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#667eea',
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_update_categories_slug ON update_categories(slug);
CREATE INDEX IF NOT EXISTS idx_update_categories_active ON update_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_update_categories_order ON update_categories(display_order);

-- Insert default categories (migrating from hardcoded values)
INSERT INTO update_categories (name, slug, description, color, display_order) VALUES
  ('Feature', 'feature', 'New features and functionality', '#10b981', 1),
  ('Improvement', 'improvement', 'Enhancements to existing features', '#3b82f6', 2),
  ('Bug Fix', 'bug-fix', 'Bug fixes and issue resolutions', '#ef4444', 3),
  ('Announcement', 'announcement', 'Important announcements and news', '#f59e0b', 4),
  ('General', 'general', 'General updates and information', '#8b5cf6', 5)
ON CONFLICT (name) DO NOTHING;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON update_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Update project_updates table to reference categories table (for future foreign key relationship)
-- Note: This is optional and can be done later if you want stricter data integrity
-- ALTER TABLE project_updates ADD CONSTRAINT fk_category 
-- FOREIGN KEY (category) REFERENCES update_categories(name) ON DELETE SET NULL;
