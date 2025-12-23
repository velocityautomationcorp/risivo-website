import { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

export async function checkNDA(c: Context<{ Bindings: Bindings }>) {
  try {
    // Get session cookie
    const sessionCookie = c.req.header('cookie');
    let sessionToken = null;

    if (sessionCookie) {
      const cookies = sessionCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        // Check all possible cookie names
        if (name === 'user_session' || name === 'session' || name === 'risivo_session') {
          sessionToken = value;
          break;
        }
      }
    }

    if (!sessionToken) {
      return c.json(
        {
          authenticated: false,
          nda_signed: false,
          error: 'Not authenticated'
        },
        401
      );
    }

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json(
        {
          authenticated: false,
          nda_signed: false,
          error: 'Service configuration error'
        },
        500
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user by session token
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())  // Check not expired
      .single();

    if (sessionError || !session) {
      return c.json(
        {
          authenticated: false,
          nda_signed: false,
          error: 'Invalid session'
        },
        401
      );
    }

    const userId = session.user_id;

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, first_name, last_name, user_type, investor_status')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return c.json(
        {
          authenticated: false,
          nda_signed: false,
          error: 'User not found'
        },
        404
      );
    }

    // Check if user is an investor
    if (user.user_type !== 'investor') {
      return c.json(
        {
          authenticated: true,
          is_investor: false,
          nda_signed: false,
          user: {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.user_type
          }
        }
      );
    }

    // Check if NDA is signed
    const { data: nda, error: ndaError } = await supabase
      .from('nda_signatures')
      .select('id, full_name_typed, signature_timestamp, nda_version')  // Use correct column names
      .eq('user_id', userId)
      .single();

    if (ndaError || !nda) {
      return c.json({
        authenticated: true,
        is_investor: true,
        nda_signed: false,
        investor_status: user.investor_status,
        user: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          user_type: user.user_type
        }
      });
    }

    // NDA is signed
    return c.json({
      authenticated: true,
      is_investor: true,
      nda_signed: true,
      investor_status: user.investor_status,
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type
      },
      nda: {
        signed_date: nda.signature_timestamp,  // Use correct column name
        full_name: nda.full_name_typed,         // Use correct column name
        nda_version: nda.nda_version
      }
    });

  } catch (error) {
    console.error('[CHECK-NDA] Error:', error);
    return c.json(
      {
        authenticated: false,
        nda_signed: false,
        error: 'Internal server error'
      },
      500
    );
  }
}

// Get current user info
export async function getCurrentUser(c: Context<{ Bindings: Bindings }>) {
  try {
    // Get session cookie
    const sessionCookie = c.req.header('cookie');
    let sessionToken = null;

    if (sessionCookie) {
      const cookies = sessionCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        // Check all possible cookie names
        if (name === 'user_session' || name === 'session' || name === 'risivo_session') {
          sessionToken = value;
          break;
        }
      }
    }

    if (!sessionToken) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user by session token
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())  // Check not expired
      .single();

    if (sessionError || !session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, user_type, investor_status, created_at')
      .eq('id', session.user_id)
      .single();

    if (userError || !user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      investor_status: user.investor_status,
      created_at: user.created_at
    });

  } catch (error) {
    console.error('[GET-USER] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
