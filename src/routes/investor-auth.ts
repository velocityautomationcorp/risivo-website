import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import * as bcrypt from 'bcryptjs';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
};

const investorAuth = new Hono<{ Bindings: Bindings }>();

// Helper function to generate session token
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// POST /api/investor/login - Investor login
investorAuth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log('[INVESTOR_AUTH] ========================================');
    console.log('[INVESTOR_AUTH] 🔐 Login attempt');
    console.log('[INVESTOR_AUTH] Email:', email);
    console.log('[INVESTOR_AUTH] ========================================');

    // Validate input
    if (!email || !password) {
      return c.json(
        { error: 'Missing required fields', details: 'Email and password are required' },
        400
      );
    }

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json(
        { error: 'Service configuration error', details: 'Authentication service unavailable' },
        503
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find investor in users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, business_name, password_hash, user_type, investor_status, investor_tier')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      console.log('[INVESTOR_AUTH] ❌ User not found');
      return c.json(
        { error: 'Invalid credentials', details: 'Email or password is incorrect' },
        401
      );
    }

    // Check if user is an investor
    if (user.user_type !== 'investor' && user.investor_status === null) {
      console.log('[INVESTOR_AUTH] ❌ User is not an investor');
      return c.json(
        { error: 'Access denied', details: 'This login is for investors only' },
        403
      );
    }

    // Check investor status
    if (user.investor_status === 'pending_nda') {
      console.log('[INVESTOR_AUTH] ⚠️ NDA not signed yet');
      return c.json(
        { 
          error: 'NDA required', 
          details: 'You must sign the NDA before accessing investor materials.',
          redirect: '/updates/investor/nda'
        },
        403
      );
    }

    if (user.investor_status === 'rejected') {
      console.log('[INVESTOR_AUTH] ❌ Investor rejected');
      return c.json(
        { error: 'Access denied', details: 'Your investor application has been declined.' },
        403
      );
    }

    // Check if password is set
    if (!user.password_hash) {
      console.log('[INVESTOR_AUTH] ❌ No password set for user');
      return c.json(
        { 
          error: 'Account not activated', 
          details: 'Please check your email for activation instructions.' 
        },
        403
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      console.log('[INVESTOR_AUTH] ❌ Invalid password');
      return c.json(
        { error: 'Invalid credentials', details: 'Email or password is incorrect' },
        401
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create session in database
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        user_agent: c.req.header('user-agent') || 'unknown'
      });

    if (sessionError) {
      console.error('[INVESTOR_AUTH] ❌ Session creation error:', sessionError);
      return c.json(
        { error: 'Login failed', details: 'Unable to create session' },
        500
      );
    }

    // Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Set session cookie (30 days)
    setCookie(c, 'user_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    console.log('[INVESTOR_AUTH] ✅ Login successful');
    console.log('[INVESTOR_AUTH] User ID:', user.id);
    console.log('[INVESTOR_AUTH] Investor Status:', user.investor_status);
    console.log('[INVESTOR_AUTH] ========================================');

    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        investor_status: user.investor_status,
        investor_tier: user.investor_tier
      },
      redirect: '/updates/investor/dashboard'
    });
  } catch (error) {
    console.error('[INVESTOR_AUTH] ========================================');
    console.error('[INVESTOR_AUTH] 🔥 FATAL ERROR');
    console.error('[INVESTOR_AUTH] Error:', error);
    console.error('[INVESTOR_AUTH] ========================================');

    return c.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
});

// POST /api/investor/logout - Investor logout
investorAuth.post('/logout', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');

    if (sessionToken) {
      const supabaseUrl = c.env?.SUPABASE_URL;
      const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    }

    deleteCookie(c, 'user_session', { path: '/' });

    return c.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('[INVESTOR_AUTH] Logout error:', error);
    return c.json({ success: true, message: 'Logged out' });
  }
});

// GET /api/investor/me - Get current investor info
investorAuth.get('/me', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');

    if (!sessionToken) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify session
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session) {
      deleteCookie(c, 'user_session', { path: '/' });
      return c.json({ error: 'Invalid session' }, 401);
    }

    if (new Date(session.expires_at) < new Date()) {
      await supabase.from('user_sessions').delete().eq('session_token', sessionToken);
      deleteCookie(c, 'user_session', { path: '/' });
      return c.json({ error: 'Session expired' }, 401);
    }

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, business_name, user_type, investor_status, investor_tier, created_at, last_login')
      .eq('id', session.user_id)
      .single();

    if (userError || !user) {
      deleteCookie(c, 'user_session', { path: '/' });
      return c.json({ error: 'User not found' }, 401);
    }

    return c.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[INVESTOR_AUTH] /me error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/investor/content - Get investor content
investorAuth.get('/content', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');

    if (!sessionToken) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify session and get user
    const { data: session } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    // Get user's investor tier
    const { data: user } = await supabase
      .from('users')
      .select('investor_tier, investor_status')
      .eq('id', session.user_id)
      .single();

    if (!user) {
      return c.json({ error: 'User not found' }, 401);
    }

    // Check if investor has access
    if (user.investor_status !== 'active' && user.investor_status !== 'nda_signed') {
      return c.json({ error: 'Access denied. Please complete the NDA process.' }, 403);
    }

    // Get available content based on investor tier
    const { data: content, error } = await supabase
      .from('investor_content')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[INVESTOR_AUTH] Content fetch error:', error);
      return c.json({ error: 'Failed to fetch content' }, 500);
    }

    return c.json({
      success: true,
      content: content || [],
      investor_tier: user.investor_tier
    });
  } catch (error) {
    console.error('[INVESTOR_AUTH] /content error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/investor/updates - Get investor updates (articles, project updates from CMS)
investorAuth.get('/updates', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');

    if (!sessionToken) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify session and get user
    const { data: session } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    // Get user's investor tier and status
    const { data: user } = await supabase
      .from('users')
      .select('investor_tier, investor_status')
      .eq('id', session.user_id)
      .single();

    if (!user) {
      return c.json({ error: 'User not found' }, 401);
    }

    // Check if investor has access
    if (user.investor_status !== 'active' && user.investor_status !== 'nda_signed') {
      return c.json({ error: 'Access denied. Please complete the NDA process.' }, 403);
    }

    // Get published investor updates with category info
    const { data: updates, error } = await supabase
      .from('investor_updates')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        video_url,
        gallery_images,
        author_name,
        visibility,
        status,
        views_count,
        published_at,
        created_at,
        category_id,
        investor_categories (
          id,
          name,
          slug,
          icon,
          color
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[INVESTOR_AUTH] Updates fetch error:', error);
      // Return empty array if table doesn't exist yet
      return c.json({
        success: true,
        updates: [],
        investor_tier: user.investor_tier
      });
    }

    return c.json({
      success: true,
      updates: updates || [],
      investor_tier: user.investor_tier
    });
  } catch (error) {
    console.error('[INVESTOR_AUTH] /updates error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/investor/sign-nda - Sign NDA
investorAuth.post('/sign-nda', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');

    if (!sessionToken) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const body = await c.req.json();
    const { full_name_typed } = body;

    if (!full_name_typed) {
      return c.json({ error: 'Full name is required to sign NDA' }, 400);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from session
    const { data: session } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .single();

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Create NDA signature
    const { error: ndaError } = await supabase
      .from('nda_signatures')
      .insert({
        user_id: session.user_id,
        full_name_typed,
        ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        user_agent: c.req.header('user-agent') || 'unknown',
        nda_version: '1.0'
      });

    if (ndaError) {
      console.error('[INVESTOR_AUTH] NDA signature error:', ndaError);
      return c.json({ error: 'Failed to sign NDA' }, 500);
    }

    // Update user status to nda_signed
    await supabase
      .from('users')
      .update({ 
        investor_status: 'nda_signed',
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user_id);

    console.log('[INVESTOR_AUTH] ✅ NDA signed successfully');

    return c.json({
      success: true,
      message: 'NDA signed successfully. You now have access to investor materials.',
      redirect: '/updates/investor/dashboard'
    });
  } catch (error) {
    console.error('[INVESTOR_AUTH] /sign-nda error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default investorAuth;
