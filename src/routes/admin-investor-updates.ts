import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
};

const adminInvestorUpdatesRoute = new Hono<{ Bindings: Bindings }>();

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
// INVESTOR CATEGORIES MANAGEMENT
// ==========================================

// Get all investor categories
adminInvestorUpdatesRoute.get('/categories', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const { data, error } = await auth.supabase
            .from('investor_categories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return c.json({ categories: data || [] });
    } catch (error) {
        console.error('Get investor categories error:', error);
        return c.json({ error: 'Failed to fetch categories' }, 500);
    }
});

// Create investor category
adminInvestorUpdatesRoute.post('/categories', async (c) => {
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
            .from('investor_categories')
            .insert({
                name,
                slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                icon: icon || '💼',
                color: color || '#10b981',
                description,
                sort_order: sort_order || 0,
                is_active: is_active !== false
            })
            .select()
            .single();

        if (error) throw error;

        return c.json({ success: true, category: data });
    } catch (error) {
        console.error('Create investor category error:', error);
        return c.json({ error: 'Failed to create category' }, 500);
    }
});

// Update investor category
adminInvestorUpdatesRoute.put('/categories/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const categoryId = c.req.param('id');

    try {
        const body = await c.req.json();
        const { name, slug, icon, color, description, sort_order, is_active } = body;

        const { data, error } = await auth.supabase
            .from('investor_categories')
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
        console.error('Update investor category error:', error);
        return c.json({ error: 'Failed to update category' }, 500);
    }
});

// Delete investor category
adminInvestorUpdatesRoute.delete('/categories/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const categoryId = c.req.param('id');

    try {
        const { error } = await auth.supabase
            .from('investor_categories')
            .delete()
            .eq('id', categoryId);

        if (error) throw error;

        return c.json({ success: true });
    } catch (error) {
        console.error('Delete investor category error:', error);
        return c.json({ error: 'Failed to delete category' }, 500);
    }
});

// ==========================================
// INVESTOR UPDATES MANAGEMENT
// ==========================================

// Get all investor updates
adminInvestorUpdatesRoute.get('/', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const { data, error } = await auth.supabase
            .from('investor_updates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return c.json({ updates: data || [] });
    } catch (error) {
        console.error('Get investor updates error:', error);
        return c.json({ error: 'Failed to fetch updates' }, 500);
    }
});

// Get single investor update
adminInvestorUpdatesRoute.get('/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const updateId = c.req.param('id');

    try {
        const { data, error } = await auth.supabase
            .from('investor_updates')
            .select('*')
            .eq('id', updateId)
            .single();

        if (error) throw error;

        return c.json({ update: data });
    } catch (error) {
        console.error('Get investor update error:', error);
        return c.json({ error: 'Failed to fetch update' }, 500);
    }
});

// Create investor update
adminInvestorUpdatesRoute.post('/', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const body = await c.req.json();
        const { 
            title, slug, excerpt, content, 
            featured_image_url, video_url, gallery_images,
            category_id, author_name, visibility, status 
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
            visibility: visibility || 'all_investors',
            status: status || 'draft'
        };

        if (status === 'published') {
            updateData.published_at = new Date().toISOString();
        }

        const { data, error } = await auth.supabase
            .from('investor_updates')
            .insert(updateData)
            .select()
            .single();

        if (error) throw error;

        return c.json({ success: true, update: data });
    } catch (error) {
        console.error('Create investor update error:', error);
        return c.json({ error: 'Failed to create update' }, 500);
    }
});

// Update investor update
adminInvestorUpdatesRoute.put('/:id', async (c) => {
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
            category_id, author_name, visibility, status 
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
            visibility,
            status
        };

        // Set published_at if publishing for first time
        if (status === 'published') {
            const { data: existing } = await auth.supabase
                .from('investor_updates')
                .select('published_at')
                .eq('id', updateId)
                .single();
            
            if (!existing?.published_at) {
                updateData.published_at = new Date().toISOString();
            }
        }

        const { data, error } = await auth.supabase
            .from('investor_updates')
            .update(updateData)
            .eq('id', updateId)
            .select()
            .single();

        if (error) throw error;

        return c.json({ success: true, update: data });
    } catch (error) {
        console.error('Update investor update error:', error);
        return c.json({ error: 'Failed to update' }, 500);
    }
});

// Delete investor update
adminInvestorUpdatesRoute.delete('/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const updateId = c.req.param('id');

    try {
        const { error } = await auth.supabase
            .from('investor_updates')
            .delete()
            .eq('id', updateId);

        if (error) throw error;

        return c.json({ success: true });
    } catch (error) {
        console.error('Delete investor update error:', error);
        return c.json({ error: 'Failed to delete update' }, 500);
    }
});

export default adminInvestorUpdatesRoute;
