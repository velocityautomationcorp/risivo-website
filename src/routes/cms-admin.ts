/**
 * CMS Admin API Routes
 * Authenticated endpoints for content management
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getSupabaseCMSAdmin } from '../lib/supabase-cms'

type Bindings = {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

const cmsAdmin = new Hono<{ Bindings: Bindings }>()

// Enable CORS for admin panel
cmsAdmin.use('/*', cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://risivo-admin.pages.dev'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ============================================
// PAGES MANAGEMENT
// ============================================

// List all pages (including drafts)
cmsAdmin.get('/pages', async (c) => {
  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    const { data, error } = await supabaseCMS
      .from('cms_pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return c.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return c.json({ error: 'Failed to fetch pages' }, 500)
  }
})

// Get single page with blocks
cmsAdmin.get('/pages/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    const { data: page, error: pageError } = await supabaseCMS
      .from('cms_pages')
      .select('*')
      .eq('id', id)
      .single()

    if (pageError) throw pageError

    const { data: blocks, error: blocksError } = await supabaseCMS
      .from('cms_content_blocks')
      .select('*')
      .eq('page_id', id)
      .order('position')

    if (blocksError) throw blocksError

    return c.json({
      success: true,
      data: { page, blocks: blocks || [] }
    })
  } catch (error) {
    console.error('Error fetching page:', error)
    return c.json({ error: 'Failed to fetch page' }, 500)
  }
})

// Create new page
cmsAdmin.post('/pages', async (c) => {
  try {
    const body = await c.req.json()
    console.log('📝 Creating page with body:', JSON.stringify(body, null, 2))
    
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    console.log('🔑 Supabase URL:', c.env?.SUPABASE_URL ? 'configured' : 'missing')

    const { data, error } = await supabaseCMS
      .from('cms_pages')
      .insert({
        slug: body.slug,
        template: body.template || 'default',
        status: body.status || 'draft',
        meta_title: body.meta_title || {},
        meta_description: body.meta_description || {},
        meta_keywords: body.meta_keywords || {},
        layout: body.layout || 'default',
        include_header: body.include_header ?? true,
        include_footer: body.include_footer ?? true
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return c.json({ 
        error: 'Failed to create page', 
        details: error.message || error,
        code: error.code,
        hint: error.hint 
      }, 500)
    }

    console.log('✅ Page created successfully:', data)
    return c.json({ success: true, data }, 201)
  } catch (error: any) {
    console.error('❌ Error creating page:', error)
    return c.json({ 
      error: 'Failed to create page',
      details: error.message || String(error),
      stack: error.stack
    }, 500)
  }
})

// Update page
cmsAdmin.put('/pages/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const body = await c.req.json()
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabaseCMS
      .from('cms_pages')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error updating page:', error)
    return c.json({ error: 'Failed to update page' }, 500)
  }
})

// Delete page
cmsAdmin.delete('/pages/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    const { error } = await supabaseCMS
      .from('cms_pages')
      .delete()
      .eq('id', id)

    if (error) throw error

    return c.json({ success: true, message: 'Page deleted' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return c.json({ error: 'Failed to delete page' }, 500)
  }
})

// Publish page
cmsAdmin.post('/pages/:id/publish', async (c) => {
  const id = c.req.param('id')

  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    const { data, error } = await supabaseCMS
      .from('cms_pages')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error publishing page:', error)
    return c.json({ error: 'Failed to publish page' }, 500)
  }
})

// ============================================
// CONTENT BLOCKS MANAGEMENT
// ============================================

// Create content block
cmsAdmin.post('/blocks', async (c) => {
  try {
    const body = await c.req.json()
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabaseCMS
      .from('cms_content_blocks')
      .insert({
        page_id: body.page_id,
        block_type: body.block_type,
        position: body.position,
        content: body.content || {},
        settings: body.settings || {}
      })
      .select()
      .single()

    if (error) throw error

    return c.json({ success: true, data }, 201)
  } catch (error) {
    console.error('Error creating block:', error)
    return c.json({ error: 'Failed to create block' }, 500)
  }
})

// Update content block
cmsAdmin.put('/blocks/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const body = await c.req.json()
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabaseCMS
      .from('cms_content_blocks')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error updating block:', error)
    return c.json({ error: 'Failed to update block' }, 500)
  }
})

// Delete content block
cmsAdmin.delete('/blocks/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    const { error } = await supabaseCMS
      .from('cms_content_blocks')
      .delete()
      .eq('id', id)

    if (error) throw error

    return c.json({ success: true, message: 'Block deleted' })
  } catch (error) {
    console.error('Error deleting block:', error)
    return c.json({ error: 'Failed to delete block' }, 500)
  }
})

// Reorder blocks
cmsAdmin.put('/blocks/reorder', async (c) => {
  try {
    const { blocks } = await c.req.json()
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)

    // Update position for each block
    const updates = blocks.map((block: { id: string; position: number }) =>
      supabaseCMS
        .from('cms_content_blocks')
        .update({ position: block.position })
        .eq('id', block.id)
    )

    await Promise.all(updates)

    return c.json({ success: true, message: 'Blocks reordered' })
  } catch (error) {
    console.error('Error reordering blocks:', error)
    return c.json({ error: 'Failed to reorder blocks' }, 500)
  }
})

// ============================================
// MEDIA MANAGEMENT
// ============================================

// List media
cmsAdmin.get('/media', async (c) => {
  const folder = c.req.query('folder')

  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    let query = supabaseCMS
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false })

    if (folder) {
      query = query.eq('folder', folder)
    }

    const { data, error } = await query

    if (error) throw error

    return c.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Error fetching media:', error)
    return c.json({ error: 'Failed to fetch media' }, 500)
  }
})

// Delete media
cmsAdmin.delete('/media/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    // Get media info first to delete from storage
    const { data: media } = await supabaseCMS
      .from('cms_media')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (media) {
      // Delete from storage bucket
      await supabaseCMS.storage
        .from('media')
        .remove([media.storage_path])
    }

    // Delete from database
    const { error } = await supabaseCMS
      .from('cms_media')
      .delete()
      .eq('id', id)

    if (error) throw error

    return c.json({ success: true, message: 'Media deleted' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return c.json({ error: 'Failed to delete media' }, 500)
  }
})

// ============================================
// TRANSLATIONS MANAGEMENT
// ============================================

// List translations
cmsAdmin.get('/translations', async (c) => {
  const category = c.req.query('category')

  try {
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)
    
    let query = supabaseCMS
      .from('cms_translations')
      .select('*')
      .order('key')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    return c.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Error fetching translations:', error)
    return c.json({ error: 'Failed to fetch translations' }, 500)
  }
})

// Update translation
cmsAdmin.put('/translations/:key', async (c) => {
  const key = c.req.param('key')

  try {
    const body = await c.req.json()
    const supabaseCMS = getSupabaseCMSAdmin(c.env?.SUPABASE_URL, c.env?.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabaseCMS
      .from('cms_translations')
      .update({
        translations: body.translations,
        category: body.category,
        description: body.description
      })
      .eq('key', key)
      .select()
      .single()

    if (error) throw error

    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error updating translation:', error)
    return c.json({ error: 'Failed to update translation' }, 500)
  }
})

export default cmsAdmin
