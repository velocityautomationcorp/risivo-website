import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const adminAuth = new Hono();

// ============================================
// POST /api/admin/login
// Admin login endpoint
// ============================================
adminAuth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, 400);
    }

    // Initialize Supabase client with environment variables
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ 
        success: false, 
        error: 'Server configuration error' 
      }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get admin user from database
    const { data: admin, error: dbError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (dbError || !admin) {
      console.error('Admin login error:', dbError);
      return c.json({ 
        success: false, 
        error: 'Invalid credentials',
        details: 'Admin user not found or inactive'
      }, 401);
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    
    if (!passwordMatch) {
      return c.json({ 
        success: false, 
        error: 'Invalid credentials',
        details: 'Password does not match'
      }, 401);
    }

    // Generate session token (simple UUID for now)
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Store session in database
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: admin.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: c.req.header('x-forwarded-for') || c.req.header('x-real-ip'),
        user_agent: c.req.header('user-agent')
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return c.json({ 
        success: false, 
        error: 'Failed to create session' 
      }, 500);
    }

    // Update last_login_at
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id);

    // Set HTTP-only cookie
    setCookie(c, 'admin_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Return success with admin info (without password)
    return c.json({ 
      success: true, 
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// ============================================
// POST /api/admin/logout
// Admin logout endpoint
// ============================================
adminAuth.post('/logout', async (c) => {
  try {
    const sessionToken = getCookie(c, 'admin_session');

    if (sessionToken) {
      // Initialize Supabase client
      const supabaseUrl = c.env?.SUPABASE_URL;
      const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return c.json({ 
          success: false, 
          error: 'Server configuration error' 
        }, 500);
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Delete session from database
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken);
    }

    // Clear cookie
    setCookie(c, 'admin_session', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 0,
      path: '/'
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// ============================================
// GET /api/admin/me
// Get current admin user info
// ============================================
adminAuth.get('/me', async (c) => {
  try {
    const sessionToken = getCookie(c, 'admin_session');

    if (!sessionToken) {
      return c.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, 401);
    }

    // Initialize Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ 
        success: false, 
        error: 'Server configuration error' 
      }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get session from database
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('*, admin_users(*)')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session) {
      return c.json({ 
        success: false, 
        error: 'Invalid session' 
      }, 401);
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken);

      return c.json({ 
        success: false, 
        error: 'Session expired' 
      }, 401);
    }

    const admin = session.admin_users;

    // Return admin info (without password)
    return c.json({ 
      success: true, 
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Get admin info error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

export default adminAuth;
