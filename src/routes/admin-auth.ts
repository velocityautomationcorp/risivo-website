import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const adminAuth = new Hono();

// Helper to get display name from admin object (handles both name and full_name columns)
function getAdminDisplayName(admin: any): string {
  return admin.full_name || admin.name || admin.email.split('@')[0];
}

// Helper to check if admin is active (handles both is_active and status columns)
function isAdminActive(admin: any): boolean {
  if (typeof admin.is_active === 'boolean') {
    return admin.is_active;
  }
  if (admin.status) {
    return admin.status === 'active';
  }
  return true; // Default to active if no status field
}

// ============================================
// POST /api/admin/login
// Admin login endpoint
// ============================================
adminAuth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    console.log('[ADMIN_AUTH] ========================================');
    console.log('[ADMIN_AUTH] Login attempt for:', email);

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
      console.error('[ADMIN_AUTH] Missing Supabase configuration');
      return c.json({ 
        success: false, 
        error: 'Server configuration error',
        details: 'Database connection not configured'
      }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get admin user from database
    const { data: admin, error: dbError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (dbError) {
      console.error('[ADMIN_AUTH] Database error:', dbError);
      return c.json({ 
        success: false, 
        error: 'Invalid credentials',
        details: 'Admin user not found'
      }, 401);
    }

    if (!admin) {
      console.log('[ADMIN_AUTH] Admin not found:', email);
      return c.json({ 
        success: false, 
        error: 'Invalid credentials',
        details: 'Admin user not found'
      }, 401);
    }

    console.log('[ADMIN_AUTH] Admin found:', admin.email);
    console.log('[ADMIN_AUTH] Admin status/is_active:', admin.status || admin.is_active);

    // Check if admin is active
    if (!isAdminActive(admin)) {
      console.log('[ADMIN_AUTH] Admin account is inactive');
      return c.json({ 
        success: false, 
        error: 'Account disabled',
        details: 'Your admin account has been deactivated'
      }, 403);
    }

    // Check if password hash exists
    if (!admin.password_hash) {
      console.log('[ADMIN_AUTH] No password hash set for admin');
      return c.json({ 
        success: false, 
        error: 'Account not activated',
        details: 'Please contact the system administrator to set up your password'
      }, 403);
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    
    if (!passwordMatch) {
      console.log('[ADMIN_AUTH] Password mismatch');
      return c.json({ 
        success: false, 
        error: 'Invalid credentials',
        details: 'Password does not match'
      }, 401);
    }

    console.log('[ADMIN_AUTH] Password verified successfully');

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
        ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown',
        user_agent: c.req.header('user-agent') || 'unknown'
      });

    if (sessionError) {
      console.error('[ADMIN_AUTH] Session creation error:', sessionError);
      
      // Check if admin_sessions table exists
      if (sessionError.code === '42P01') {
        return c.json({ 
          success: false, 
          error: 'Database setup incomplete',
          details: 'Admin sessions table not found. Please run database migrations.'
        }, 500);
      }
      
      return c.json({ 
        success: false, 
        error: 'Failed to create session',
        details: sessionError.message
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

    console.log('[ADMIN_AUTH] Login successful for:', admin.email);
    console.log('[ADMIN_AUTH] ========================================');

    // Return success with admin info (without password)
    return c.json({ 
      success: true, 
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: getAdminDisplayName(admin),
        name: getAdminDisplayName(admin),
        role: admin.role
      }
    });

  } catch (error) {
    console.error('[ADMIN_AUTH] Login error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
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

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Delete session from database
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
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
    console.error('[ADMIN_AUTH] Logout error:', error);
    return c.json({ success: true }); // Always return success for logout
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
      .select('admin_user_id, expires_at')
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

    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.admin_user_id)
      .single();

    if (adminError || !admin) {
      return c.json({ 
        success: false, 
        error: 'Admin not found' 
      }, 401);
    }

    // Return admin info (without password)
    return c.json({ 
      success: true, 
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: getAdminDisplayName(admin),
        name: getAdminDisplayName(admin),
        role: admin.role
      }
    });

  } catch (error) {
    console.error('[ADMIN_AUTH] Get admin info error:', error);
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

export default adminAuth;
