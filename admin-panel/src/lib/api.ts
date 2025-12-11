import { supabase } from './supabase'
import type {
  CMSPage,
  CMSContentBlock,
  CMSMedia,
  CMSTranslation,
  APIResponse,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/cms'

// Helper to get auth token
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && {
      Authorization: `Bearer ${session.access_token}`,
    }),
  }
}

// ============================================
// PAGES API
// ============================================

export const pagesAPI = {
  // Get all pages
  async getAll(): Promise<APIResponse<CMSPage[]>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/pages`, { headers })
    return response.json()
  },

  // Get single page with blocks
  async getById(id: string): Promise<APIResponse<{ page: CMSPage; blocks: CMSContentBlock[] }>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/pages/${id}`, { headers })
    return response.json()
  },

  // Create new page
  async create(page: Partial<CMSPage>): Promise<APIResponse<CMSPage>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/pages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(page),
    })
    return response.json()
  },

  // Update page
  async update(id: string, updates: Partial<CMSPage>): Promise<APIResponse<CMSPage>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/pages/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    })
    return response.json()
  },

  // Delete page
  async delete(id: string): Promise<APIResponse<void>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/pages/${id}`, {
      method: 'DELETE',
      headers,
    })
    return response.json()
  },

  // Publish page
  async publish(id: string): Promise<APIResponse<CMSPage>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/pages/${id}/publish`, {
      method: 'POST',
      headers,
    })
    return response.json()
  },
}

// ============================================
// BLOCKS API
// ============================================

export const blocksAPI = {
  // Create block
  async create(block: Partial<CMSContentBlock>): Promise<APIResponse<CMSContentBlock>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/blocks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(block),
    })
    return response.json()
  },

  // Update block
  async update(id: string, updates: Partial<CMSContentBlock>): Promise<APIResponse<CMSContentBlock>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/blocks/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    })
    return response.json()
  },

  // Delete block
  async delete(id: string): Promise<APIResponse<void>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/blocks/${id}`, {
      method: 'DELETE',
      headers,
    })
    return response.json()
  },

  // Reorder blocks
  async reorder(blocks: { id: string; position: number }[]): Promise<APIResponse<void>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/blocks/reorder`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ blocks }),
    })
    return response.json()
  },
}

// ============================================
// MEDIA API
// ============================================

export const mediaAPI = {
  // Get all media
  async getAll(folder?: string): Promise<APIResponse<CMSMedia[]>> {
    const headers = await getAuthHeaders()
    const url = folder
      ? `${API_BASE_URL}/admin/media?folder=${folder}`
      : `${API_BASE_URL}/admin/media`
    const response = await fetch(url, { headers })
    return response.json()
  },

  // Delete media
  async delete(id: string): Promise<APIResponse<void>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/media/${id}`, {
      method: 'DELETE',
      headers,
    })
    return response.json()
  },

  // Upload media (direct to Supabase Storage)
  async upload(file: File, folder: string = 'general'): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return { url: publicUrl, path: data.path }
  },
}

// ============================================
// TRANSLATIONS API
// ============================================

export const translationsAPI = {
  // Get all translations
  async getAll(category?: string): Promise<APIResponse<CMSTranslation[]>> {
    const headers = await getAuthHeaders()
    const url = category
      ? `${API_BASE_URL}/admin/translations?category=${category}`
      : `${API_BASE_URL}/admin/translations`
    const response = await fetch(url, { headers })
    return response.json()
  },

  // Update translation
  async update(key: string, updates: Partial<CMSTranslation>): Promise<APIResponse<CMSTranslation>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/translations/${key}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    })
    return response.json()
  },
}
