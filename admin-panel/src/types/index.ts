// CMS Types
export interface CMSPage {
  id: string
  slug: string
  template: string
  status: 'draft' | 'published' | 'archived'
  meta_title: Record<string, string>
  meta_description: Record<string, string>
  meta_keywords: Record<string, string>
  layout: string
  include_header: boolean
  include_footer: boolean
  created_at: string
  updated_at: string
  published_at?: string
}

export interface CMSContentBlock {
  id: string
  page_id: string
  block_type: string
  position: number
  content: Record<string, any>
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CMSMedia {
  id: string
  filename: string
  original_filename: string
  file_type: 'image' | 'video' | 'document' | 'other'
  mime_type: string
  size_bytes: number
  url: string
  storage_path: string
  width?: number
  height?: number
  alt_text: Record<string, string>
  folder: string
  tags: string[]
  created_at: string
}

export interface CMSTranslation {
  id: string
  key: string
  translations: Record<string, string>
  category: string
  description?: string
}

export interface CMSUserProfile {
  id: string
  role: 'admin' | 'editor' | 'viewer'
  display_name: string
  avatar_url?: string
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

// Block Types
export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'image_gallery'
  | 'video'
  | 'cta'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'form'
  | 'code'
  | 'divider'

// Language Types
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt'

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
]

// API Response Types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
