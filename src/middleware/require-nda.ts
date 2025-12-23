import { Context, Next } from 'hono';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

/**
 * Middleware to require NDA signature for investor access
 * Redirects to NDA review page if investor hasn't signed
 */
export async function requireNDA(c: Context<{ Bindings: Bindings }>, next: Next) {
  try {
    // Get session cookie (check multiple possible cookie names)
    const sessionCookie = c.req.header('cookie');
    let sessionToken = null;

    if (sessionCookie) {
      const cookies = sessionCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        // Check for any of the possible session cookie names
        if (name === 'risivo_session' || name === 'session' || name === 'user_session') {
          sessionToken = value;
          console.log('[NDA-MIDDLEWARE] Found session cookie:', name);
          break;
        }
      }
    }

    // If no session, redirect to login
    if (!sessionToken) {
      console.log('[NDA-MIDDLEWARE] No session found, redirecting to login');
      return c.redirect('/updates/login');
    }

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[NDA-MIDDLEWARE] Supabase not configured');
      return c.redirect('/updates/login');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user by session token in user_sessions table
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())  // Check not expired
      .single();

    if (sessionError || !session) {
      console.log('[NDA-MIDDLEWARE] Invalid or expired session, redirecting to login');
      console.log('[NDA-MIDDLEWARE] Session error:', sessionError);
      return c.redirect('/updates/login');
    }

    const userId = session.user_id;

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, user_type, investor_status')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('[NDA-MIDDLEWARE] User not found');
      return c.redirect('/updates/login');
    }

    console.log('[NDA-MIDDLEWARE] User type:', user.user_type);
    console.log('[NDA-MIDDLEWARE] Investor status:', user.investor_status);

    // If user is NOT an investor, allow access (waitlist users don't need NDA)
    if (user.user_type !== 'investor') {
      console.log('[NDA-MIDDLEWARE] Not an investor, allowing access');
      await next();
      return;
    }

    // User is an investor - check if NDA is signed
    const { data: nda, error: ndaError } = await supabase
      .from('nda_signatures')
      .select('id, nda_version, signature_timestamp')  // Use correct column name
      .eq('user_id', userId)
      .single();

    if (ndaError || !nda) {
      // No NDA signature found - redirect to NDA review page
      console.log('[NDA-MIDDLEWARE] No NDA signature found, redirecting to NDA review');
      return c.redirect('/updates/investor/nda-review');
    }

    // NDA is signed - allow access
    console.log('[NDA-MIDDLEWARE] NDA signed (version:', nda.nda_version, '), allowing access');
    await next();

  } catch (error) {
    console.error('[NDA-MIDDLEWARE] Error:', error);
    return c.redirect('/updates/login');
  }
}
