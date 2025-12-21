import { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

/**
 * API endpoint to fetch investor content based on user's approval status
 * Returns content items that the user is authorized to access
 */
export async function getInvestorContent(c: Context<{ Bindings: Bindings }>) {
  try {
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

    // Get user info with investor details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, business_name, user_type, investor_status, investor_tier')
      .eq('id', session.user_id)
      .single();

    if (userError || !user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    // Check if user is an investor
    if (user.user_type !== 'investor') {
      return c.json({ success: false, error: 'Access denied' }, 403);
    }

    // Determine which content the user can access based on investor_status
    let contentQuery = supabase
      .from('investor_content')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    // Filter by visibility based on investor status
    if (user.investor_status === 'pending_nda') {
      // Only show content that doesn't require NDA
      contentQuery = contentQuery.eq('requires_nda', false);
    } else if (user.investor_status === 'nda_signed') {
      // Show content that allows NDA-signed investors (but not active-only)
      contentQuery = contentQuery.in('visibility', ['all_investors', 'nda_signed_only']);
    } else if (user.investor_status === 'active') {
      // ACTIVE INVESTORS: Show ALL content (all visibility levels)
      // No visibility filter needed - they have full access
      // Tier filtering happens later if needed
      console.log('[GET-CONTENT] Active investor - granting full content access');
    }

    const { data: content, error: contentError } = await contentQuery;
    
    console.log('[GET-CONTENT] Query result:', {
      investor_status: user.investor_status,
      content_count: content?.length || 0,
      content_titles: content?.map(c => c.title) || []
    });

    if (contentError) {
      console.error('[GET-CONTENT] Error fetching content:', contentError);
      return c.json({ success: false, error: 'Failed to fetch content' }, 500);
    }

    // Filter by tier if user is active
    let filteredContent = content || [];
    if (user.investor_status === 'active' && user.investor_tier) {
      filteredContent = filteredContent.filter(item => {
        // If no tier restriction, include it
        if (!item.visible_to_tiers || item.visible_to_tiers.length === 0) {
          return true;
        }
        // Check if user's tier is in the allowed tiers
        return item.visible_to_tiers.includes(user.investor_tier);
      });
    }

    // Log activity: investor viewing dashboard
    try {
      await supabase.rpc('log_investor_activity', {
        p_user_id: user.id,
        p_action_type: 'view_dashboard',
        p_resource_type: 'dashboard',
        p_ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        p_user_agent: c.req.header('user-agent') || 'unknown'
      });
    } catch (logError) {
      console.error('[GET-CONTENT] Failed to log activity:', logError);
      // Don't fail the request if logging fails
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        investor_status: user.investor_status,
        investor_tier: user.investor_tier
      },
      content: filteredContent,
      status_message: getStatusMessage(user.investor_status)
    });

  } catch (error) {
    console.error('[GET-CONTENT] Error:', error);
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

/**
 * Helper function to get user-friendly status message
 */
function getStatusMessage(investorStatus: string): string {
  switch (investorStatus) {
    case 'pending_nda':
      return 'Please sign the NDA to access investor materials';
    case 'nda_signed':
      return '⏳ Your application is under review. You will have full access within 1 business day.';
    case 'active':
      return '✅ You have full access to all investor materials';
    case 'rejected':
      return 'Your investor application has been declined';
    default:
      return '';
  }
}
