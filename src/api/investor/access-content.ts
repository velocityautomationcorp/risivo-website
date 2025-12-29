import { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

/**
 * API endpoint to handle investor content access (view/download)
 * Tracks activity and redirects to content URL
 */
export async function accessInvestorContent(c: Context<{ Bindings: Bindings }>) {
  try {
    const contentId = c.req.param('content_id');
    const actionType = c.req.query('action') || 'view'; // 'view' or 'download'

    if (!contentId) {
      return c.json({ success: false, error: 'Content ID required' }, 400);
    }

    // Get session cookie
    const sessionCookie = c.req.header('cookie');
    let sessionToken = null;

    if (sessionCookie) {
      const cookies = sessionCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'user_session' || name === 'session' || name === 'risivo_session') {
          sessionToken = value;
          break;
        }
      }
    }

    if (!sessionToken) {
      return c.json({ success: false, error: 'Not authenticated' }, 401);
    }

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user by session token
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return c.json({ success: false, error: 'Invalid session' }, 401);
    }

    const userId = session.user_id;

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('investor_status')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    // Get content info
    const { data: content, error: contentError } = await supabase
      .from('investor_content')
      .select('*')
      .eq('id', contentId)
      .eq('status', 'active')
      .single();

    if (contentError || !content) {
      return c.json({ success: false, error: 'Content not found' }, 404);
    }

    // Check if user has access
    if (user.investor_status !== 'active' && content.visibility === 'active_investors_only') {
      return c.json({
        success: false,
        error: 'Access denied',
        details: 'This content requires admin approval. Please wait for your account to be reviewed.'
      }, 403);
    }

    // Determine resource type and URL
    const resourceType = actionType === 'download' ? 'download' : 
                        content.content_type === 'video' ? 'watch_video' : 'view_document';
    const contentUrl = actionType === 'download' ? content.file_url : 
                      content.content_type === 'video' ? content.video_url : content.file_url;

    if (!contentUrl) {
      return c.json({ success: false, error: 'Content URL not available' }, 404);
    }

    // Log activity
    try {
      await supabase.rpc('log_investor_activity', {
        p_user_id: userId,
        p_action_type: resourceType,
        p_resource_type: 'investor_content',
        p_resource_id: contentId,
        p_resource_title: content.title,
        p_ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        p_user_agent: c.req.header('user-agent') || 'unknown'
      });
    } catch (logError) {
      console.error('[ACCESS-CONTENT] Failed to log activity:', logError);
      // Don't fail the request if logging fails
    }

    // Return the content URL for client-side redirect/download
    return c.json({
      success: true,
      content_url: contentUrl,
      content_title: content.title,
      content_type: content.content_type
    });

  } catch (error) {
    console.error('[ACCESS-CONTENT] Error:', error);
    return c.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
}
