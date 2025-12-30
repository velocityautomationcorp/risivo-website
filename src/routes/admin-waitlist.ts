import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
};

const adminWaitlistRoute = new Hono<{ Bindings: Bindings }>();

// Helper to verify admin session
async function verifyAdmin(c: any) {
    const sessionToken = getCookie(c, 'admin_session');
    if (!sessionToken) return null;

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) return null;

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: session } = await supabase
        .from('admin_sessions')
        .select('*, admin_users(*)')
        .eq('session_token', sessionToken)
        .single();

    if (!session || new Date(session.expires_at) < new Date()) return null;
    if (!session.admin_users?.is_active) return null;

    return { supabase, admin: session.admin_users };
}

// ==========================================
// WAITLIST USER MANAGEMENT
// ==========================================

// GET all waitlist users
adminWaitlistRoute.get('/users', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const { data: waitlistUsers, error } = await auth.supabase
            .from('waitlist_users')
            .select('id, email, first_name, last_name, business_name, phone, status, email_verified, waitlist_number, created_at, last_login_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return c.json({ success: true, waitlistUsers: waitlistUsers || [] });
    } catch (error) {
        console.error('[ADMIN-WAITLIST] List error:', error);
        return c.json({ error: 'Failed to fetch waitlist users' }, 500);
    }
});

// Delete waitlist user (from waitlist_users table)
adminWaitlistRoute.delete('/user/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');

    try {
        const { error } = await auth.supabase
            .from('waitlist_users')
            .delete()
            .eq('id', userId);

        if (error) throw error;

        return c.json({ success: true, message: 'Waitlist user deleted' });
    } catch (error) {
        console.error('[ADMIN-WAITLIST] Delete error:', error);
        return c.json({ error: 'Failed to delete waitlist user' }, 500);
    }
});

// Delete waitlist user (legacy - from users table)
adminWaitlistRoute.delete('/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');

    try {
        // Delete related data first
        await auth.supabase.from('user_sessions').delete().eq('user_id', userId);
        
        // Delete user
        const { error } = await auth.supabase
            .from('users')
            .delete()
            .eq('id', userId)
            .eq('user_type', 'waitlist');

        if (error) throw error;

        return c.json({ success: true });
    } catch (error) {
        console.error('Delete waitlist user error:', error);
        return c.json({ error: 'Failed to delete user' }, 500);
    }
});

// ==========================================
// WAITLIST CATEGORIES MANAGEMENT
// ==========================================

// Get all waitlist categories
adminWaitlistRoute.get('/categories', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const { data, error } = await auth.supabase
            .from('waitlist_categories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return c.json({ categories: data || [] });
    } catch (error) {
        console.error('Get waitlist categories error:', error);
        return c.json({ error: 'Failed to fetch categories' }, 500);
    }
});

// Create waitlist category
adminWaitlistRoute.post('/categories', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const body = await c.req.json();
        const { name, slug, icon, color, description, sort_order, is_active } = body;

        if (!name) {
            return c.json({ error: 'Category name is required' }, 400);
        }

        const { data, error } = await auth.supabase
            .from('waitlist_categories')
            .insert({
                name,
                slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                icon: icon || '📋',
                color: color || '#3b82f6',
                description,
                sort_order: sort_order || 0,
                is_active: is_active !== false
            })
            .select()
            .single();

        if (error) throw error;

        return c.json({ success: true, category: data });
    } catch (error) {
        console.error('Create waitlist category error:', error);
        return c.json({ error: 'Failed to create category' }, 500);
    }
});

// Update waitlist category
adminWaitlistRoute.put('/categories/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const categoryId = c.req.param('id');

    try {
        const body = await c.req.json();
        const { name, slug, icon, color, description, sort_order, is_active } = body;

        const { data, error } = await auth.supabase
            .from('waitlist_categories')
            .update({
                name,
                slug,
                icon,
                color,
                description,
                sort_order,
                is_active
            })
            .eq('id', categoryId)
            .select()
            .single();

        if (error) throw error;

        return c.json({ success: true, category: data });
    } catch (error) {
        console.error('Update waitlist category error:', error);
        return c.json({ error: 'Failed to update category' }, 500);
    }
});

// Delete waitlist category
adminWaitlistRoute.delete('/categories/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const categoryId = c.req.param('id');

    try {
        const { error } = await auth.supabase
            .from('waitlist_categories')
            .delete()
            .eq('id', categoryId);

        if (error) throw error;

        return c.json({ success: true });
    } catch (error) {
        console.error('Delete waitlist category error:', error);
        return c.json({ error: 'Failed to delete category' }, 500);
    }
});

// ==========================================
// WAITLIST UPDATES MANAGEMENT
// ==========================================

// Get all waitlist updates
adminWaitlistRoute.get('/updates', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const { data, error } = await auth.supabase
            .from('project_updates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return c.json({ updates: data || [] });
    } catch (error) {
        console.error('Get waitlist updates error:', error);
        return c.json({ error: 'Failed to fetch updates' }, 500);
    }
});

// Create waitlist update
adminWaitlistRoute.post('/updates', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const body = await c.req.json();
        const { 
            title, slug, excerpt, content, 
            featured_image_url, video_url, gallery_images,
            category_id, author_name, status 
        } = body;

        if (!title || !content) {
            return c.json({ error: 'Title and content are required' }, 400);
        }

        const updateData: any = {
            title,
            slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            excerpt,
            content,
            featured_image_url,
            video_url,
            gallery_images: gallery_images || [],
            category_id,
            author_name: author_name || 'Risivo Team',
            status: status || 'draft'
        };

        if (status === 'published') {
            updateData.published_at = new Date().toISOString();
        }

        const { data, error } = await auth.supabase
            .from('project_updates')
            .insert(updateData)
            .select()
            .single();

        if (error) throw error;

        return c.json({ success: true, update: data });
    } catch (error) {
        console.error('Create waitlist update error:', error);
        return c.json({ error: 'Failed to create update' }, 500);
    }
});

// Update waitlist update
adminWaitlistRoute.put('/updates/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const updateId = c.req.param('id');

    try {
        const body = await c.req.json();
        const { 
            title, slug, excerpt, content, 
            featured_image_url, video_url, gallery_images,
            category_id, author_name, status 
        } = body;

        const updateData: any = {
            title,
            slug,
            excerpt,
            content,
            featured_image_url,
            video_url,
            gallery_images,
            category_id,
            author_name,
            status
        };

        // Set published_at if publishing for first time
        if (status === 'published') {
            const { data: existing } = await auth.supabase
                .from('project_updates')
                .select('published_at')
                .eq('id', updateId)
                .single();
            
            if (!existing?.published_at) {
                updateData.published_at = new Date().toISOString();
            }
        }

        const { data, error } = await auth.supabase
            .from('project_updates')
            .update(updateData)
            .eq('id', updateId)
            .select()
            .single();

        if (error) throw error;

        return c.json({ success: true, update: data });
    } catch (error) {
        console.error('Update waitlist update error:', error);
        return c.json({ error: 'Failed to update' }, 500);
    }
});

// Delete waitlist update
adminWaitlistRoute.delete('/updates/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const updateId = c.req.param('id');

    try {
        const { error } = await auth.supabase
            .from('project_updates')
            .delete()
            .eq('id', updateId);

        if (error) throw error;

        return c.json({ success: true });
    } catch (error) {
        console.error('Delete waitlist update error:', error);
        return c.json({ error: 'Failed to delete update' }, 500);
    }
});

export default adminWaitlistRoute;
