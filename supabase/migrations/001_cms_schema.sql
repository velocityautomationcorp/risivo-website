-- ============================================
-- RISIVO CMS - DATABASE SCHEMA
-- Multi-language CMS with Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER PROFILES & ROLES
-- ============================================

CREATE TABLE cms_user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{}',
  display_name TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PAGES TABLE
-- ============================================

CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL DEFAULT 'default',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Multi-language SEO
  meta_title JSONB NOT NULL DEFAULT '{}',
  meta_description JSONB DEFAULT '{}',
  meta_keywords JSONB DEFAULT '{}',
  
  -- Layout settings
  layout TEXT DEFAULT 'default',
  include_header BOOLEAN DEFAULT true,
  include_footer BOOLEAN DEFAULT true,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for pages
CREATE INDEX idx_pages_slug ON cms_pages(slug);
CREATE INDEX idx_pages_status ON cms_pages(status);
CREATE INDEX idx_pages_created_at ON cms_pages(created_at DESC);

-- ============================================
-- 3. CONTENT BLOCKS TABLE
-- ============================================

CREATE TABLE cms_content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL, -- hero, features, pricing, text, image, video, cta, etc.
  position INTEGER NOT NULL,
  
  -- Multi-language content
  content JSONB NOT NULL DEFAULT '{}',
  
  -- Block-specific settings
  settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for content blocks
CREATE INDEX idx_content_blocks_page ON cms_content_blocks(page_id);
CREATE INDEX idx_content_blocks_position ON cms_content_blocks(page_id, position);

-- ============================================
-- 4. MEDIA LIBRARY TABLE
-- ============================================

CREATE TABLE cms_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'other')),
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  
  -- Storage
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  
  -- Image-specific
  width INTEGER,
  height INTEGER,
  alt_text JSONB DEFAULT '{}', -- Multi-language alt text
  
  -- Organization
  folder TEXT DEFAULT 'root',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0
);

-- Indexes for media
CREATE INDEX idx_media_type ON cms_media(file_type);
CREATE INDEX idx_media_folder ON cms_media(folder);
CREATE INDEX idx_media_created_at ON cms_media(created_at DESC);

-- ============================================
-- 5. TRANSLATIONS TABLE
-- ============================================

CREATE TABLE cms_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  translations JSONB NOT NULL DEFAULT '{}',
  category TEXT DEFAULT 'general',
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for translations
CREATE INDEX idx_translations_key ON cms_translations(key);
CREATE INDEX idx_translations_category ON cms_translations(category);

-- ============================================
-- 6. CONTENT TEMPLATES TABLE
-- ============================================

CREATE TABLE cms_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL DEFAULT '[]', -- Array of block definitions
  preview_image TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. CONTENT HISTORY TABLE
-- ============================================

CREATE TABLE cms_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  content_snapshot JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_note TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for history
CREATE INDEX idx_history_page ON cms_history(page_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE cms_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: CMS USER PROFILES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON cms_user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
ON cms_user_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update profiles
CREATE POLICY "Admins can update profiles"
ON cms_user_profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLICIES: PAGES
-- ============================================

-- Public can read published pages
CREATE POLICY "Published pages are public"
ON cms_pages FOR SELECT
USING (status = 'published');

-- Authenticated users can read all pages
CREATE POLICY "Authenticated can read all pages"
ON cms_pages FOR SELECT
TO authenticated
USING (true);

-- Editors and admins can insert pages
CREATE POLICY "Editors can insert pages"
ON cms_pages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  )
);

-- Editors and admins can update pages
CREATE POLICY "Editors can update pages"
ON cms_pages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  )
);

-- Only admins can delete pages
CREATE POLICY "Admins can delete pages"
ON cms_pages FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLICIES: CONTENT BLOCKS
-- ============================================

-- Public can read blocks of published pages
CREATE POLICY "Public can read published blocks"
ON cms_content_blocks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cms_pages
    WHERE cms_pages.id = page_id AND status = 'published'
  )
);

-- Authenticated users can read all blocks
CREATE POLICY "Authenticated can read all blocks"
ON cms_content_blocks FOR SELECT
TO authenticated
USING (true);

-- Editors can manage blocks
CREATE POLICY "Editors can manage blocks"
ON cms_content_blocks FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  )
);

-- ============================================
-- POLICIES: MEDIA
-- ============================================

-- Public can read all media
CREATE POLICY "Media is public"
ON cms_media FOR SELECT
USING (true);

-- Authenticated users can upload media
CREATE POLICY "Authenticated can upload media"
ON cms_media FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update their own uploads
CREATE POLICY "Users can update own media"
ON cms_media FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid());

-- Admins can delete any media
CREATE POLICY "Admins can delete media"
ON cms_media FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLICIES: TRANSLATIONS
-- ============================================

-- Public can read all translations
CREATE POLICY "Translations are public"
ON cms_translations FOR SELECT
USING (true);

-- Editors can manage translations
CREATE POLICY "Editors can manage translations"
ON cms_translations FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  )
);

-- ============================================
-- POLICIES: TEMPLATES
-- ============================================

-- Templates are public (read-only for non-authenticated)
CREATE POLICY "Templates are public"
ON cms_templates FOR SELECT
USING (true);

-- Only admins can manage templates
CREATE POLICY "Admins can manage templates"
ON cms_templates FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- POLICIES: HISTORY
-- ============================================

-- Authenticated users can read history
CREATE POLICY "Authenticated can read history"
ON cms_history FOR SELECT
TO authenticated
USING (true);

-- System can insert history (no direct user access)
CREATE POLICY "System can insert history"
ON cms_history FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_pages
BEFORE UPDATE ON cms_pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_blocks
BEFORE UPDATE ON cms_content_blocks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_translations
BEFORE UPDATE ON cms_translations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_templates
BEFORE UPDATE ON cms_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON cms_user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA: DEFAULT TRANSLATIONS
-- ============================================

INSERT INTO cms_translations (key, translations, category) VALUES
('nav.features', '{"en": "Features", "es": "Características", "fr": "Fonctionnalités", "de": "Funktionen", "it": "Caratteristiche", "pt": "Recursos"}', 'navigation'),
('nav.pricing', '{"en": "Pricing", "es": "Precios", "fr": "Tarifs", "de": "Preise", "it": "Prezzi", "pt": "Preços"}', 'navigation'),
('nav.resources', '{"en": "Resources", "es": "Recursos", "fr": "Ressources", "de": "Ressourcen", "it": "Risorse", "pt": "Recursos"}', 'navigation'),
('nav.company', '{"en": "Company", "es": "Empresa", "fr": "Entreprise", "de": "Unternehmen", "it": "Azienda", "pt": "Empresa"}', 'navigation'),
('nav.login', '{"en": "Login", "es": "Iniciar Sesión", "fr": "Connexion", "de": "Anmelden", "it": "Accedi", "pt": "Entrar"}', 'navigation'),
('cta.start_trial', '{"en": "Start Free Trial", "es": "Comenzar Prueba Gratis", "fr": "Essai Gratuit", "de": "Kostenlos Testen", "it": "Prova Gratuita", "pt": "Teste Grátis"}', 'cta');

-- ============================================
-- COMPLETE!
-- ============================================

COMMENT ON TABLE cms_pages IS 'CMS pages with multi-language support';
COMMENT ON TABLE cms_content_blocks IS 'Flexible content blocks for pages';
COMMENT ON TABLE cms_media IS 'Media library for images, videos, documents';
COMMENT ON TABLE cms_translations IS 'UI translations for interface elements';
COMMENT ON TABLE cms_templates IS 'Reusable page templates';
COMMENT ON TABLE cms_history IS 'Version control for content changes';
