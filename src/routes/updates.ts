import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware to check user authentication
async function checkUserAuth(c: any) {
  const sessionToken = getCookie(c, 'user_session');
  
  if (!sessionToken) {
    return null;
  }

  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Verify session
  const { data: session } = await supabase
    .from('user_sessions')
    .select('user_id, expires_at')
    .eq('session_token', sessionToken)
    .single();

  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, status')
    .eq('id', session.user_id)
    .single();

  if (!user || user.status !== 'active') {
    return null;
  }

  return user;
}

// GET /api/updates/list - Get all published updates
app.get('/list', async (c) => {
  try {
    // Check authentication
    const user = await checkUserAuth(c);
    
    if (!user) {
      return c.json({ error: 'Authentication required', details: 'Please login to view updates' }, 401);
    }

    console.log('[UPDATES] 📋 Fetching updates list');
    console.log('[UPDATES] User:', user.email);

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all published updates (featured first, then by published date)
    const { data: updates, error } = await supabase
      .from('project_updates')
      .select('id, slug, title, excerpt, category, author_name, featured_image_url, views_count, shares_count, likes_count, dislikes_count, comments_count, media_type, media_url, gallery_images, published_at, created_at, is_featured')
      .eq('status', 'published')
      .order('is_featured', { ascending: false, nullsFirst: false })
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[UPDATES] ❌ Database error:', error);
      return c.json({ error: 'Failed to fetch updates' }, 500);
    }

    console.log('[UPDATES] ✅ Found', updates?.length || 0, 'updates');

    return c.json({
      success: true,
      updates: updates || [],
      count: updates?.length || 0
    });
  } catch (error) {
    console.error('[UPDATES] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/updates/:slug - Get single update by slug
app.get('/:slug', async (c) => {
  try {
    // Check authentication
    const user = await checkUserAuth(c);
    
    if (!user) {
      return c.json({ error: 'Authentication required', details: 'Please login to view this update' }, 401);
    }

    const slug = c.req.param('slug');

    console.log('[UPDATES] 📖 Fetching update:', slug);
    console.log('[UPDATES] User:', user.email);

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get update
    const { data: update, error } = await supabase
      .from('project_updates')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !update) {
      console.log('[UPDATES] ❌ Update not found');
      return c.json({ error: 'Update not found' }, 404);
    }

    // Get images for this update
    const { data: images } = await supabase
      .from('update_images')
      .select('*')
      .eq('update_id', update.id)
      .order('display_order', { ascending: true });

    // Track view
    const { error: analyticsError } = await supabase
      .from('update_analytics')
      .insert({
        update_id: update.id,
        event_type: 'view',
        ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        user_agent: c.req.header('user-agent') || 'unknown',
        referrer: c.req.header('referer') || c.req.header('referrer') || null
      });

    if (analyticsError) {
      console.error('[UPDATES] ⚠️ Analytics error (non-critical):', analyticsError);
    }

    // Increment view count
    await supabase
      .from('project_updates')
      .update({ views_count: (update.views_count || 0) + 1 })
      .eq('id', update.id);

    console.log('[UPDATES] ✅ Update found');

    return c.json({
      success: true,
      update: {
        ...update,
        images: images || []
      }
    });
  } catch (error) {
    console.error('[UPDATES] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/updates/:slug/share - Track share event
app.post('/:slug/share', async (c) => {
  try {
    // Check authentication
    const user = await checkUserAuth(c);
    
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const slug = c.req.param('slug');
    const body = await c.req.json();
    const { platform } = body; // 'twitter', 'linkedin', 'facebook', 'other'

    console.log('[UPDATES] 📤 Share event:', slug, 'on', platform);

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get update
    const { data: update } = await supabase
      .from('project_updates')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!update) {
      return c.json({ error: 'Update not found' }, 404);
    }

    // Track share
    await supabase
      .from('update_analytics')
      .insert({
        update_id: update.id,
        event_type: `share_${platform}`,
        ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        user_agent: c.req.header('user-agent') || 'unknown',
        referrer: c.req.header('referer') || c.req.header('referrer') || null
      });

    // Increment share count
    const { data: currentUpdate } = await supabase
      .from('project_updates')
      .select('shares_count')
      .eq('id', update.id)
      .single();

    await supabase
      .from('project_updates')
      .update({ shares_count: (currentUpdate?.shares_count || 0) + 1 })
      .eq('id', update.id);

    console.log('[UPDATES] ✅ Share tracked');

    return c.json({ success: true, message: 'Share tracked' });
  } catch (error) {
    console.error('[UPDATES] Share error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/updates/stats/overview - Get overall stats (for user dashboard)
app.get('/stats/overview', async (c) => {
  try {
    // Check authentication
    const user = await checkUserAuth(c);
    
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get total published updates count
    const { count: totalUpdates } = await supabase
      .from('project_updates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get latest update
    const { data: latestUpdate } = await supabase
      .from('project_updates')
      .select('title, slug, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    return c.json({
      success: true,
      stats: {
        total_updates: totalUpdates || 0,
        latest_update: latestUpdate || null
      }
    });
  } catch (error) {
    console.error('[UPDATES] Stats error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
