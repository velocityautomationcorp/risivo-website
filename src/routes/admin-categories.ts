/**
 * Admin Categories API Routes
 * Manage update categories (CRUD operations)
 */

import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

const adminCategories = new Hono();

/**
 * Helper: Verify admin session
 */
async function verifyAdminSession(c: any) {
  console.log('verifyAdminSession: Starting verification');
  const sessionToken = getCookie(c, 'admin_session');
  
  console.log('verifyAdminSession: Session token present:', !!sessionToken);
  if (!sessionToken) {
    console.log('verifyAdminSession: No session token found');
    return null;
  }

  const supabaseUrl = c.env.SUPABASE_URL;
  const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('verifyAdminSession: Supabase config:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey
  });

  if (!supabaseUrl || !supabaseKey) {
    console.log('verifyAdminSession: Missing Supabase config');
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('verifyAdminSession: Querying admin_sessions table');
  // Verify session
  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('*, admin_users(*)')
    .eq('session_token', sessionToken)
    .single();

  if (error) {
    console.error('verifyAdminSession: Database error:', error);
    return null;
  }
  
  if (!session) {
    console.log('verifyAdminSession: No session found');
    return null;
  }

  console.log('verifyAdminSession: Session found, checking expiry');
  // Check if session is expired
  if (new Date(session.expires_at) < new Date()) {
    console.log('verifyAdminSession: Session expired');
    return null;
  }

  console.log('verifyAdminSession: Session valid, returning admin user');
  return session.admin_users;
}

/**
 * Helper: Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ====================
// GET /api/admin/categories - Get all categories
// ====================
adminCategories.get('/', async (c) => {
  try {
    console.log('Categories API: Starting request');
    const admin = await verifyAdminSession(c);
    console.log('Categories API: Admin verification result:', admin ? 'authenticated' : 'not authenticated');
    
    if (!admin) {
      console.log('Categories API: Returning 401 - Unauthorized');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Categories API: Supabase config present:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Categories API: Fetching from investor_categories table');
    const { data: categories, error } = await supabase
      .from('investor_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Categories API: Database error:', error);
      return c.json({ 
        error: 'Failed to fetch categories', 
        details: error.message,
        code: error.code 
      }, 500);
    }

    console.log('Categories API: Success, found', categories?.length || 0, 'categories');
    return c.json({ 
      success: true, 
      categories: categories || [] 
    });
  } catch (error) {
    console.error('Categories API: Unexpected error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// ====================
// GET /api/admin/categories/active - Get only active categories (for forms)
// ====================
adminCategories.get('/active', async (c) => {
  try {
    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: categories, error } = await supabase
      .from('investor_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch active categories:', error);
      return c.json({ error: 'Failed to fetch categories' }, 500);
    }

    return c.json({ 
      success: true, 
      categories: categories || [] 
    });
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ====================
// POST /api/admin/categories - Create new category
// ====================
adminCategories.post('/', async (c) => {
  try {
    const admin = await verifyAdminSession(c);
    if (!admin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name, description, color, icon } = body;

    if (!name || name.trim() === '') {
      return c.json({ error: 'Category name is required' }, 400);
    }

    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate slug
    const slug = generateSlug(name);

    // Check if category with same name or slug already exists
    const { data: existing } = await supabase
      .from('investor_categories')
      .select('id')
      .or(`name.eq.${name},slug.eq.${slug}`)
      .single();

    if (existing) {
      return c.json({ error: 'Category with this name already exists' }, 409);
    }

    // Get max sort_order
    const { data: maxOrder } = await supabase
      .from('investor_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrder?.sort_order || 0) + 1;

    // Create category
    const { data: category, error } = await supabase
      .from('investor_categories')
      .insert({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        color: color || '#667eea',
        icon: icon?.trim() || '💼',
        sort_order: nextOrder,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create category:', error);
      return c.json({ error: 'Failed to create category' }, 500);
    }

    return c.json({ 
      success: true, 
      category,
      message: 'Category created successfully' 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ====================
// PUT /api/admin/categories/:id - Update category
// ====================
adminCategories.put('/:id', async (c) => {
  try {
    const admin = await verifyAdminSession(c);
    if (!admin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const categoryId = c.req.param('id');
    const body = await c.req.json();
    const { name, description, color, icon, display_order, is_active } = body;

    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if category exists
    const { data: existing } = await supabase
      .from('investor_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (!existing) {
      return c.json({ error: 'Category not found' }, 404);
    }

    // Build update data
    const updateData: any = {};

    if (name !== undefined && name.trim() !== '') {
      updateData.name = name.trim();
      updateData.slug = generateSlug(name);
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (color !== undefined) {
      updateData.color = color || '#667eea';
    }

    if (icon !== undefined) {
      updateData.icon = icon?.trim() || '💼';
    }

    if (display_order !== undefined) {
      updateData.sort_order = parseInt(display_order, 10);
    }

    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active);
    }

    // Update category
    const { data: category, error } = await supabase
      .from('investor_categories')
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update category:', error);
      return c.json({ error: 'Failed to update category' }, 500);
    }

    return c.json({ 
      success: true, 
      category,
      message: 'Category updated successfully' 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ====================
// DELETE /api/admin/categories/:id - Delete category
// ====================
adminCategories.delete('/:id', async (c) => {
  try {
    const admin = await verifyAdminSession(c);
    if (!admin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const categoryId = c.req.param('id');

    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if category exists
    const { data: existing } = await supabase
      .from('investor_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (!existing) {
      return c.json({ error: 'Category not found' }, 404);
    }

    // Check if category is being used by investor updates
    const { data: updates, error: checkError } = await supabase
      .from('investor_updates')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (checkError) {
      console.error('Failed to check category usage:', checkError);
      return c.json({ error: 'Failed to check category usage' }, 500);
    }

    if (updates && updates.length > 0) {
      return c.json({ 
        error: 'Cannot delete category that is in use. Please reassign or delete associated updates first.',
        in_use: true 
      }, 409);
    }

    // Delete category
    const { error } = await supabase
      .from('investor_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Failed to delete category:', error);
      return c.json({ error: 'Failed to delete category' }, 500);
    }

    return c.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ====================
// POST /api/admin/categories/:id/reorder - Reorder categories
// ====================
adminCategories.post('/reorder', async (c) => {
  try {
    const admin = await verifyAdminSession(c);
    if (!admin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { order } = body; // Array of { id, display_order }

    if (!Array.isArray(order)) {
      return c.json({ error: 'Order must be an array' }, 400);
    }

    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update each category's sort_order
    const updates = order.map(item => 
      supabase
        .from('investor_categories')
        .update({ sort_order: item.display_order })
        .eq('id', item.id)
    );

    await Promise.all(updates);

    return c.json({ 
      success: true, 
      message: 'Categories reordered successfully' 
    });
  } catch (error) {
    console.error('Error reordering categories:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default adminCategories;
