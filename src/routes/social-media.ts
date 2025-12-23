import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
};

const socialMediaRoute = new Hono<{ Bindings: Bindings }>();

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
// PLATFORMS
// ==========================================

// Get all platforms
socialMediaRoute.get('/platforms', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    try {
        const { data, error } = await auth.supabase
            .from('social_platforms')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return c.json({ platforms: data || [] });
    } catch (error) {
        console.error('Get platforms error:', error);
        return c.json({ error: 'Failed to fetch platforms' }, 500);
    }
});

// ==========================================
// CONNECTIONS
// ==========================================

// Get all connections
socialMediaRoute.get('/connections', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    try {
        const { data, error } = await auth.supabase
            .from('social_connections')
            .select(`
                *,
                platform:social_platforms(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return c.json({ connections: data || [] });
    } catch (error) {
        console.error('Get connections error:', error);
        return c.json({ error: 'Failed to fetch connections' }, 500);
    }
});

// Get connections by platform
socialMediaRoute.get('/connections/platform/:platformKey', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    const platformKey = c.req.param('platformKey');

    try {
        // Get platform ID
        const { data: platform } = await auth.supabase
            .from('social_platforms')
            .select('id')
            .eq('platform_key', platformKey)
            .single();

        if (!platform) {
            return c.json({ error: 'Platform not found' }, 404);
        }

        const { data, error } = await auth.supabase
            .from('social_connections')
            .select('*')
            .eq('platform_id', platform.id)
            .eq('is_active', true);

        if (error) throw error;

        return c.json({ connections: data || [] });
    } catch (error) {
        console.error('Get platform connections error:', error);
        return c.json({ error: 'Failed to fetch connections' }, 500);
    }
});

// Create/Update connection
socialMediaRoute.post('/connections', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    try {
        const body = await c.req.json();
        const {
            platform_key,
            connection_name,
            account_id,
            account_name,
            account_url,
            access_token,
            refresh_token,
            token_expires_at,
            api_key,
            api_secret,
            metadata
        } = body;

        if (!platform_key || !connection_name) {
            return c.json({ error: 'Platform and connection name are required' }, 400);
        }

        // Get platform ID
        const { data: platform } = await auth.supabase
            .from('social_platforms')
            .select('id')
            .eq('platform_key', platform_key)
            .single();

        if (!platform) {
            return c.json({ error: 'Platform not found' }, 404);
        }

        const connectionData = {
            platform_id: platform.id,
            connection_name,
            account_id,
            account_name,
            account_url,
            access_token,
            refresh_token,
            token_expires_at,
            api_key,
            api_secret,
            metadata: metadata || {},
            is_connected: !!access_token || !!api_key,
            is_active: true
        };

        const { data, error } = await auth.supabase
            .from('social_connections')
            .insert(connectionData)
            .select(`*, platform:social_platforms(*)`)
            .single();

        if (error) throw error;

        return c.json({ success: true, connection: data });
    } catch (error) {
        console.error('Create connection error:', error);
        return c.json({ error: 'Failed to create connection' }, 500);
    }
});

// Update connection
socialMediaRoute.put('/connections/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    const connectionId = c.req.param('id');

    try {
        const body = await c.req.json();
        const {
            connection_name,
            account_id,
            account_name,
            account_url,
            access_token,
            refresh_token,
            token_expires_at,
            api_key,
            api_secret,
            metadata,
            is_active
        } = body;

        const updateData: any = {};
        if (connection_name !== undefined) updateData.connection_name = connection_name;
        if (account_id !== undefined) updateData.account_id = account_id;
        if (account_name !== undefined) updateData.account_name = account_name;
        if (account_url !== undefined) updateData.account_url = account_url;
        if (access_token !== undefined) updateData.access_token = access_token;
        if (refresh_token !== undefined) updateData.refresh_token = refresh_token;
        if (token_expires_at !== undefined) updateData.token_expires_at = token_expires_at;
        if (api_key !== undefined) updateData.api_key = api_key;
        if (api_secret !== undefined) updateData.api_secret = api_secret;
        if (metadata !== undefined) updateData.metadata = metadata;
        if (is_active !== undefined) updateData.is_active = is_active;

        // Update is_connected status
        updateData.is_connected = !!(access_token || api_key || 
            (body.access_token === undefined && body.api_key === undefined));

        const { data, error } = await auth.supabase
            .from('social_connections')
            .update(updateData)
            .eq('id', connectionId)
            .select(`*, platform:social_platforms(*)`)
            .single();

        if (error) throw error;

        return c.json({ success: true, connection: data });
    } catch (error) {
        console.error('Update connection error:', error);
        return c.json({ error: 'Failed to update connection' }, 500);
    }
});

// Delete connection
socialMediaRoute.delete('/connections/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    const connectionId = c.req.param('id');

    try {
        const { error } = await auth.supabase
            .from('social_connections')
            .delete()
            .eq('id', connectionId);

        if (error) throw error;

        return c.json({ success: true });
    } catch (error) {
        console.error('Delete connection error:', error);
        return c.json({ error: 'Failed to delete connection' }, 500);
    }
});

// Test connection
socialMediaRoute.post('/connections/:id/test', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    const connectionId = c.req.param('id');

    try {
        const { data: connection } = await auth.supabase
            .from('social_connections')
            .select(`*, platform:social_platforms(*)`)
            .eq('id', connectionId)
            .single();

        if (!connection) {
            return c.json({ error: 'Connection not found' }, 404);
        }

        // Test based on platform
        // This would call the actual platform API to verify credentials
        // For now, we just check if tokens exist
        const isValid = !!(connection.access_token || connection.api_key);

        await auth.supabase
            .from('social_connections')
            .update({
                is_connected: isValid,
                last_sync_at: new Date().toISOString(),
                connection_error: isValid ? null : 'No valid credentials'
            })
            .eq('id', connectionId);

        return c.json({
            success: true,
            is_valid: isValid,
            message: isValid ? 'Connection is valid' : 'Missing credentials'
        });
    } catch (error) {
        console.error('Test connection error:', error);
        return c.json({ error: 'Failed to test connection' }, 500);
    }
});

// ==========================================
// POSTS
// ==========================================

// Create social post
socialMediaRoute.post('/posts', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    try {
        const body = await c.req.json();
        const {
            update_type,
            update_id,
            update_title,
            post_content,
            short_url_id,
            image_url,
            video_url,
            scheduled_for,
            connection_ids // Array of connection IDs to post to
        } = body;

        if (!update_type || !update_id || !post_content) {
            return c.json({ error: 'Update type, ID, and content are required' }, 400);
        }

        if (!connection_ids || connection_ids.length === 0) {
            return c.json({ error: 'At least one connection must be selected' }, 400);
        }

        // Create the post
        const postData: any = {
            update_type,
            update_id,
            update_title,
            post_content,
            short_url_id,
            image_url,
            video_url,
            status: scheduled_for ? 'scheduled' : 'pending'
        };

        if (scheduled_for) {
            postData.scheduled_for = scheduled_for;
        }

        const { data: post, error: postError } = await auth.supabase
            .from('social_posts')
            .insert(postData)
            .select()
            .single();

        if (postError) throw postError;

        // Create post targets for each connection
        const targets = connection_ids.map((connectionId: string) => ({
            social_post_id: post.id,
            connection_id: connectionId,
            status: 'pending'
        }));

        const { error: targetsError } = await auth.supabase
            .from('social_post_targets')
            .insert(targets);

        if (targetsError) throw targetsError;

        // If not scheduled, queue for immediate posting
        if (!scheduled_for) {
            await auth.supabase
                .from('social_job_queue')
                .insert({
                    job_type: 'post',
                    payload: { post_id: post.id },
                    scheduled_for: new Date().toISOString()
                });
        } else {
            await auth.supabase
                .from('social_job_queue')
                .insert({
                    job_type: 'post',
                    payload: { post_id: post.id },
                    scheduled_for
                });
        }

        return c.json({ success: true, post });
    } catch (error) {
        console.error('Create post error:', error);
        return c.json({ error: 'Failed to create post' }, 500);
    }
});

// Get posts
socialMediaRoute.get('/posts', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    try {
        const status = c.req.query('status');
        const update_type = c.req.query('update_type');

        let query = auth.supabase
            .from('social_posts')
            .select(`
                *,
                targets:social_post_targets(
                    *,
                    connection:social_connections(
                        *,
                        platform:social_platforms(*)
                    )
                ),
                short_url:short_urls(*)
            `)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        if (update_type) {
            query = query.eq('update_type', update_type);
        }

        const { data, error } = await query.limit(100);

        if (error) throw error;

        return c.json({ posts: data || [] });
    } catch (error) {
        console.error('Get posts error:', error);
        return c.json({ error: 'Failed to fetch posts' }, 500);
    }
});

// Get single post
socialMediaRoute.get('/posts/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    const postId = c.req.param('id');

    try {
        const { data, error } = await auth.supabase
            .from('social_posts')
            .select(`
                *,
                targets:social_post_targets(
                    *,
                    connection:social_connections(
                        *,
                        platform:social_platforms(*)
                    ),
                    analytics:post_analytics(*)
                ),
                short_url:short_urls(*)
            `)
            .eq('id', postId)
            .single();

        if (error) throw error;

        return c.json({ post: data });
    } catch (error) {
        console.error('Get post error:', error);
        return c.json({ error: 'Failed to fetch post' }, 500);
    }
});

// Cancel scheduled post
socialMediaRoute.post('/posts/:id/cancel', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    const postId = c.req.param('id');

    try {
        const { data: post } = await auth.supabase
            .from('social_posts')
            .select('status')
            .eq('id', postId)
            .single();

        if (!post) {
            return c.json({ error: 'Post not found' }, 404);
        }

        if (post.status === 'posted') {
            return c.json({ error: 'Cannot cancel a post that has already been published' }, 400);
        }

        await auth.supabase
            .from('social_posts')
            .update({ status: 'cancelled' })
            .eq('id', postId);

        // Cancel any pending jobs
        await auth.supabase
            .from('social_job_queue')
            .update({ status: 'cancelled' })
            .eq('payload->post_id', postId)
            .eq('status', 'pending');

        return c.json({ success: true });
    } catch (error) {
        console.error('Cancel post error:', error);
        return c.json({ error: 'Failed to cancel post' }, 500);
    }
});

// ==========================================
// ANALYTICS
// ==========================================

// Get dashboard analytics
socialMediaRoute.get('/analytics/dashboard', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    try {
        // Get connection stats
        const { data: connections } = await auth.supabase
            .from('social_connections')
            .select(`
                *,
                platform:social_platforms(*)
            `)
            .eq('is_active', true);

        // Get post stats
        const { count: totalPosts } = await auth.supabase
            .from('social_posts')
            .select('*', { count: 'exact', head: true });

        const { count: scheduledPosts } = await auth.supabase
            .from('social_posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'scheduled');

        const { count: postedPosts } = await auth.supabase
            .from('social_posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'posted');

        // Get short URL stats
        const { data: urlStats } = await auth.supabase
            .from('short_urls')
            .select('click_count')
            .limit(1000);

        const totalClicks = urlStats?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0;

        // Get recent posts
        const { data: recentPosts } = await auth.supabase
            .from('social_posts')
            .select(`
                *,
                targets:social_post_targets(
                    status,
                    connection:social_connections(
                        connection_name,
                        platform:social_platforms(platform_name, icon)
                    )
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        return c.json({
            connections: {
                total: connections?.length || 0,
                connected: connections?.filter(c => c.is_connected).length || 0,
                list: connections || []
            },
            posts: {
                total: totalPosts || 0,
                scheduled: scheduledPosts || 0,
                posted: postedPosts || 0,
                recent: recentPosts || []
            },
            urls: {
                total_clicks: totalClicks
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        return c.json({ error: 'Failed to fetch analytics' }, 500);
    }
});

// Get connection analytics
socialMediaRoute.get('/analytics/connection/:id', async (c) => {
    const auth = await verifyAdmin(c);
    if (!auth) return c.json({ error: 'Unauthorized' }, 401);

    const connectionId = c.req.param('id');

    try {
        const { data } = await auth.supabase
            .from('social_analytics')
            .select('*')
            .eq('connection_id', connectionId)
            .order('recorded_at', { ascending: false })
            .limit(30);

        return c.json({ analytics: data || [] });
    } catch (error) {
        console.error('Get connection analytics error:', error);
        return c.json({ error: 'Failed to fetch analytics' }, 500);
    }
});

export default socialMediaRoute;
