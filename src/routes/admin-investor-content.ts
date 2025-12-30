import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const adminInvestorContentRoute = new Hono<{ Bindings: Bindings }>();

// Middleware to verify admin session
async function verifyAdminSession(c: any): Promise<boolean> {
  const sessionToken = getCookie(c, 'admin_session');
  
  if (!sessionToken) {
    return false;
  }

  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: session } = await supabase
    .from('admin_sessions')
    .select('*, admin_users(*)')
    .eq('session_token', sessionToken)
    .single();

  if (!session || new Date(session.expires_at) < new Date()) {
    return false;
  }

  return session.admin_users?.is_active === true;
}

// GET - List all investor content
adminInvestorContentRoute.get('/', async (c) => {
  try {
    if (!await verifyAdminSession(c)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: content, error } = await supabase
      .from('investor_content')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[ADMIN-CONTENT] List error:', error);
      return c.json({ success: false, error: 'Failed to fetch content' }, 500);
    }

    return c.json({ success: true, content: content || [] });

  } catch (error) {
    console.error('[ADMIN-CONTENT] Error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// POST - Create new content
adminInvestorContentRoute.post('/', async (c) => {
  try {
    if (!await verifyAdminSession(c)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();

    // Validation
    if (!body.title) {
      return c.json({ success: false, error: 'Title is required' }, 400);
    }

    if (!body.content_type) {
      return c.json({ success: false, error: 'Content type is required' }, 400);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build content data with ONLY columns that exist in investor_content table:
    // id, title, description, content_type, file_url, file_format, icon, visibility, sort_order, cta_button_text, created_at, updated_at
    const contentData: any = {
      title: body.title,
      description: body.description || null,
      content_type: body.content_type || 'document',
      file_url: body.file_url || null,
      file_format: body.file_format || null,
      icon: body.icon || '📄',
      visibility: body.visibility || 'all_investors',
      sort_order: body.sort_order || 0,
      cta_button_text: body.cta_button_text || 'View Document'
    };

    console.log('[ADMIN-CONTENT] Creating with data:', JSON.stringify(contentData, null, 2));

    const { data: content, error } = await supabase
      .from('investor_content')
      .insert(contentData)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN-CONTENT] Create error:', error);
      return c.json({ success: false, error: 'Failed to create content', details: error.message }, 500);
    }

    console.log('[ADMIN-CONTENT] Created:', content.title);

    return c.json({ success: true, content }, 201);

  } catch (error) {
    console.error('[ADMIN-CONTENT] Error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// PUT - Update content
adminInvestorContentRoute.put('/:id', async (c) => {
  try {
    if (!await verifyAdminSession(c)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const contentId = c.req.param('id');
    const body = await c.req.json();

    if (!contentId) {
      return c.json({ success: false, error: 'Content ID is required' }, 400);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Only columns that exist: id, title, description, content_type, file_url, file_format, icon, visibility, sort_order, cta_button_text, created_at, updated_at
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Only include fields that exist in the database
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.content_type !== undefined) updateData.content_type = body.content_type;
    if (body.file_url !== undefined) updateData.file_url = body.file_url;
    if (body.file_format !== undefined) updateData.file_format = body.file_format;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.visibility !== undefined) updateData.visibility = body.visibility;
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
    if (body.cta_button_text !== undefined) updateData.cta_button_text = body.cta_button_text;
    // Note: status/is_active column doesn't exist - ignoring

    console.log('[ADMIN-CONTENT] Updating with data:', JSON.stringify(updateData, null, 2));

    const { data: content, error } = await supabase
      .from('investor_content')
      .update(updateData)
      .eq('id', contentId)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN-CONTENT] Update error:', error);
      return c.json({ success: false, error: 'Failed to update content', details: error.message }, 500);
    }

    console.log('[ADMIN-CONTENT] Updated:', content.title);

    return c.json({ success: true, content });

  } catch (error) {
    console.error('[ADMIN-CONTENT] Error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// DELETE - Delete content
adminInvestorContentRoute.delete('/:id', async (c) => {
  try {
    if (!await verifyAdminSession(c)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const contentId = c.req.param('id');

    if (!contentId) {
      return c.json({ success: false, error: 'Content ID is required' }, 400);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get content title for logging
    const { data: existing } = await supabase
      .from('investor_content')
      .select('title')
      .eq('id', contentId)
      .single();

    const { error } = await supabase
      .from('investor_content')
      .delete()
      .eq('id', contentId);

    if (error) {
      console.error('[ADMIN-CONTENT] Delete error:', error);
      return c.json({ success: false, error: 'Failed to delete content', details: error.message }, 500);
    }

    console.log('[ADMIN-CONTENT] Deleted:', existing?.title || contentId);

    return c.json({ success: true, message: 'Content deleted' });

  } catch (error) {
    console.error('[ADMIN-CONTENT] Error:', error);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

export default adminInvestorContentRoute;
