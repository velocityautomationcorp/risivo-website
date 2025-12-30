import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware to check user authentication (supports both investors and waitlist users)
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

  // First try waitlist_sessions (for waitlist users)
  const { data: waitlistSession } = await supabase
    .from('waitlist_sessions')
    .select('user_id, expires_at')
    .eq('session_token', sessionToken)
    .single();

  if (waitlistSession && new Date(waitlistSession.expires_at) > new Date()) {
    // Get waitlist user
    const { data: waitlistUser } = await supabase
      .from('waitlist_users')
      .select('id, email, first_name, last_name, status, is_active')
      .eq('id', waitlistSession.user_id)
      .single();

    if (waitlistUser && waitlistUser.is_active) {
      return { ...waitlistUser, userType: 'waitlist' };
    }
  }

  // Try user_sessions (for investors)
  const { data: userSession } = await supabase
    .from('user_sessions')
    .select('user_id, expires_at')
    .eq('session_token', sessionToken)
    .single();

  if (userSession && new Date(userSession.expires_at) > new Date()) {
    // Get investor user
    const { data: user } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, status')
      .eq('id', userSession.user_id)
      .single();

    if (user && user.status === 'active') {
      return { ...user, userType: 'investor' };
    }
  }

  return null;
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
    // Include content for detail view
    const { data: updates, error } = await supabase
      .from('project_updates')
      .select('id, slug, title, excerpt, content, category, author_name, featured_image_url, views_count, shares_count, likes_count, dislikes_count, comments_count, media_type, media_url, gallery_images, published_at, created_at, is_featured')
      .eq('status', 'published')
      .order('is_featured', { ascending: false, nullsFirst: false })
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[UPDATES] ❌ Database error:', error);
      return c.json({ error: 'Failed to fetch updates' }, 500);
    }

    // Get all categories to map category UUIDs to names
    const { data: categories } = await supabase
      .from('waitlist_categories')
      .select('id, name, icon, color');
    
    const categoryMap: Record<string, any> = {};
    if (categories) {
      categories.forEach((cat: any) => {
        // Store with lowercase key for case-insensitive matching
        categoryMap[cat.id.toLowerCase()] = cat;
      });
    }
    
    console.log('[UPDATES] Categories loaded:', Object.keys(categoryMap).length);

    // Map category names to updates
    const updatesWithCategories = (updates || []).map((update: any) => {
      // Normalize category to lowercase for matching
      const categoryKey = update.category ? update.category.toLowerCase().trim() : null;
      const matchedCategory = categoryKey ? categoryMap[categoryKey] : null;
      
      if (update.category && !matchedCategory) {
        console.log('[UPDATES] Category not found:', update.category, 'Available:', Object.keys(categoryMap).slice(0, 5));
      }
      
      return {
        ...update,
        category_name: matchedCategory ? matchedCategory.name : 'Update',
        category_icon: matchedCategory ? matchedCategory.icon : '📰',
        category_color: matchedCategory ? matchedCategory.color : '#667eea'
      };
    });

    console.log('[UPDATES] ✅ Found', updatesWithCategories.length, 'updates');

    return c.json({
      success: true,
      updates: updatesWithCategories,
      count: updatesWithCategories.length
    });
  } catch (error) {
    console.error('[UPDATES] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/updates/:id/view - Track view for an update
app.post('/:id/view', async (c) => {
  try {
    const user = await checkUserAuth(c);
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const updateId = c.req.param('id');
    
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current view count
    const { data: update } = await supabase
      .from('project_updates')
      .select('views_count')
      .eq('id', updateId)
      .single();

    if (!update) {
      return c.json({ error: 'Update not found' }, 404);
    }

    // Increment view count
    const newViewCount = (update.views_count || 0) + 1;
    await supabase
      .from('project_updates')
      .update({ views_count: newViewCount })
      .eq('id', updateId);

    return c.json({ success: true, views_count: newViewCount });
  } catch (error) {
    console.error('[UPDATES] View tracking error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/updates/:id/like - Like an update
app.post('/:id/like', async (c) => {
  try {
    const user = await checkUserAuth(c);
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const updateId = c.req.param('id');
    
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current like count
    const { data: update } = await supabase
      .from('project_updates')
      .select('likes_count')
      .eq('id', updateId)
      .single();

    if (!update) {
      return c.json({ error: 'Update not found' }, 404);
    }

    // Increment like count
    const newLikeCount = (update.likes_count || 0) + 1;
    await supabase
      .from('project_updates')
      .update({ likes_count: newLikeCount })
      .eq('id', updateId);

    return c.json({ success: true, likes_count: newLikeCount });
  } catch (error) {
    console.error('[UPDATES] Like error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/updates/:id/dislike - Dislike an update
app.post('/:id/dislike', async (c) => {
  try {
    const user = await checkUserAuth(c);
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const updateId = c.req.param('id');
    
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current dislike count
    const { data: update } = await supabase
      .from('project_updates')
      .select('dislikes_count')
      .eq('id', updateId)
      .single();

    if (!update) {
      return c.json({ error: 'Update not found' }, 404);
    }

    // Increment dislike count
    const newDislikeCount = (update.dislikes_count || 0) + 1;
    await supabase
      .from('project_updates')
      .update({ dislikes_count: newDislikeCount })
      .eq('id', updateId);

    return c.json({ success: true, dislikes_count: newDislikeCount });
  } catch (error) {
    console.error('[UPDATES] Dislike error:', error);
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
