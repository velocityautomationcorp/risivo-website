import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

const adminUpdates = new Hono();

// Helper function to verify admin session
async function verifyAdminSession(c: any) {
  const sessionToken = getCookie(c, 'admin_session');
  
  if (!sessionToken) {
    return null;
  }
  
  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: session } = await supabase
    .from('admin_sessions')
    .select('*, admin_users(*)')
    .eq('session_token', sessionToken)
    .single();
  
  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }
  
  const admin = session.admin_users;
  
  if (!admin || !admin.is_active) {
    return null;
  }
  
  return { admin, supabase };
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ============================================
// GET /api/admin/updates - List all updates
// ============================================
adminUpdates.get('/', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { supabase } = auth;
    
    // Get query parameters for filtering
    const status = c.req.query('status'); // 'published', 'draft', or all
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    
    let query = supabase
      .from('project_updates')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: updates, error } = await query;
    
    if (error) {
      console.error('Error fetching updates:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to fetch updates' 
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      updates: updates || [],
      count: updates?.length || 0
    });
    
  } catch (error) {
    console.error('Get updates error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// ============================================
// POST /api/admin/updates - Create new update
// ============================================
adminUpdates.post('/', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { admin, supabase } = auth;
    const body = await c.req.json();
    
    // Validate required fields
    const { title, content, excerpt, status, category } = body;
    
    if (!title || !content) {
      return c.json({ 
        success: false, 
        error: 'Title and content are required' 
      }, 400);
    }
    
    // Generate slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists
    while (true) {
      const { data: existing } = await supabase
        .from('project_updates')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Create the update
    const updateData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200),
      status: status || 'draft',
      category: category || null,
      featured_image_url: body.featured_image_url || null,
      author_id: admin.id,
      view_count: 0
    };
    
    const { data: newUpdate, error } = await supabase
      .from('project_updates')
      .insert(updateData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating update:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to create update' 
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      update: newUpdate
    }, 201);
    
  } catch (error) {
    console.error('Create update error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// ============================================
// GET /api/admin/updates/:id - Get single update
// ============================================
adminUpdates.get('/:id', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { supabase } = auth;
    const id = c.req.param('id');
    
    const { data: update, error } = await supabase
      .from('project_updates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !update) {
      return c.json({ 
        success: false, 
        error: 'Update not found' 
      }, 404);
    }
    
    return c.json({ 
      success: true, 
      update 
    });
    
  } catch (error) {
    console.error('Get update error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// ============================================
// PUT /api/admin/updates/:id - Update existing
// ============================================
adminUpdates.put('/:id', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { supabase } = auth;
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Get existing update
    const { data: existing } = await supabase
      .from('project_updates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!existing) {
      return c.json({ 
        success: false, 
        error: 'Update not found' 
      }, 404);
    }
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (body.title && body.title !== existing.title) {
      updateData.title = body.title;
      // Regenerate slug if title changed
      const baseSlug = generateSlug(body.title);
      let slug = baseSlug;
      let counter = 1;
      
      while (true) {
        const { data: slugExists } = await supabase
          .from('project_updates')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .single();
        
        if (!slugExists) break;
        
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      updateData.slug = slug;
    }
    
    if (body.content !== undefined) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.featured_image_url !== undefined) updateData.featured_image_url = body.featured_image_url;
    
    // Update the record
    const { data: updated, error } = await supabase
      .from('project_updates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating update:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to update' 
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      update: updated
    });
    
  } catch (error) {
    console.error('Update error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// ============================================
// DELETE /api/admin/updates/:id - Delete update
// ============================================
adminUpdates.delete('/:id', async (c) => {
  try {
    const auth = await verifyAdminSession(c);
    
    if (!auth) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }
    
    const { supabase } = auth;
    const id = c.req.param('id');
    
    // Check if update exists
    const { data: existing } = await supabase
      .from('project_updates')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!existing) {
      return c.json({ 
        success: false, 
        error: 'Update not found' 
      }, 404);
    }
    
    // Delete the update
    const { error } = await supabase
      .from('project_updates')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting update:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to delete update' 
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      message: 'Update deleted successfully' 
    });
    
  } catch (error) {
    console.error('Delete update error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

export default adminUpdates;
