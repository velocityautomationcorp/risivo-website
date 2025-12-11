/**
 * Supabase Client Configuration
 * Handles database connections for CMS
 */

import { createClient } from '@supabase/supabase-js'

// These will come from environment variables
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for CMS
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

// Helper function to get page with blocks
export async function getPageBySlug(slug: string, lang: string = 'en') {
  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (pageError || !page) {
    return null
  }

  const { data: blocks, error: blocksError } = await supabase
    .from('cms_content_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position')

  if (blocksError) {
    return null
  }

  return {
    page,
    blocks: blocks || []
  }
}

// Helper function to get translations
export async function getTranslations(category?: string) {
  let query = supabase
    .from('cms_translations')
    .select('*')

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return []
  }

  return data || []
}

// Helper function to get media
export async function getMedia(folder?: string) {
  let query = supabase
    .from('cms_media')
    .select('*')
    .order('created_at', { ascending: false })

  if (folder) {
    query = query.eq('folder', folder)
  }

  const { data, error } = await query

  if (error) {
    return []
  }

  return data || []
}
