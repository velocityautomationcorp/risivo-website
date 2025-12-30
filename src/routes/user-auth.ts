import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import * as bcrypt from 'bcryptjs';
import { EmailService, generateResetToken } from '../utils/email';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Helper function to generate session token
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// POST /api/user/login - User login
app.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log('[USER_AUTH] ========================================');
    console.log('[USER_AUTH] 🔐 Login attempt');
    console.log('[USER_AUTH] Email:', email);
    console.log('[USER_AUTH] ========================================');

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

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('waitlist_users')
      .select('id, email, first_name, last_name, business_name, preferred_language, password_hash, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      console.log('[USER_AUTH] ❌ User not found');
      return c.json(
        { error: 'Invalid credentials', details: 'Email or password is incorrect' },
        401
      );
    }

    // Check if user is active
    if (!user.is_active) {
      console.log('[USER_AUTH] ❌ User account is disabled');
      return c.json(
        { error: 'Account disabled', details: 'Your account has been disabled. Please contact support.' },
        403
      );
    }

    // Check if password is set
    if (!user.password_hash) {
      console.log('[USER_AUTH] ❌ No password set for user');
      return c.json(
        { 
          error: 'Account not activated', 
          details: 'Please check your email for activation instructions. If you signed up recently, you should receive login credentials shortly.' 
        },
        403
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      console.log('[USER_AUTH] ❌ Invalid password');
      return c.json(
        { error: 'Invalid credentials', details: 'Email or password is incorrect' },
        401
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create session in database (using waitlist_sessions table)
    const { error: sessionError } = await supabase
      .from('waitlist_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        user_agent: c.req.header('user-agent') || 'unknown'
      });

    if (sessionError) {
      console.error('[USER_AUTH] ❌ Session creation error:', sessionError);
      console.error('[USER_AUTH] ❌ Error details:', JSON.stringify(sessionError));
      return c.json(
        { error: 'Login failed', details: 'Unable to create session' },
        500
      );
    }

    // Update last_login_at
    await supabase
      .from('waitlist_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // Set session cookie (30 days)
    setCookie(c, 'user_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    console.log('[USER_AUTH] ✅ Login successful');
    console.log('[USER_AUTH] User ID:', user.id);
    console.log('[USER_AUTH] ========================================');

    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        preferred_language: user.preferred_language
      }
    });
  } catch (error) {
    console.error('[USER_AUTH] ========================================');
    console.error('[USER_AUTH] 🔥 FATAL ERROR');
    console.error('[USER_AUTH] Error:', error);
    console.error('[USER_AUTH] ========================================');

    return c.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
});

// POST /api/user/logout - User logout
app.post('/logout', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');

    if (sessionToken) {
      // Get Supabase client
      const supabaseUrl = c.env?.SUPABASE_URL;
      const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Delete session from database
        await supabase
          .from('waitlist_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    }

    // Delete session cookie
    deleteCookie(c, 'user_session', { path: '/' });

    return c.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('[USER_AUTH] Logout error:', error);
    return c.json({ success: true, message: 'Logged out' }); // Always succeed logout
  }
});

// GET /api/user/me - Get current user info
app.get('/me', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');

    if (!sessionToken) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify session and get user
    const { data: session, error: sessionError } = await supabase
      .from('waitlist_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session) {
      deleteCookie(c, 'user_session', { path: '/' });
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase.from('waitlist_sessions').delete().eq('session_token', sessionToken);
      deleteCookie(c, 'user_session', { path: '/' });
      return c.json({ error: 'Session expired' }, 401);
    }

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('waitlist_users')
      .select('id, email, first_name, last_name, business_name, preferred_language, is_active, last_login_at')
      .eq('id', session.user_id)
      .single();

    if (userError || !user || !user.is_active) {
      deleteCookie(c, 'user_session', { path: '/' });
      return c.json({ error: 'User not found or inactive' }, 401);
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        business_name: user.business_name,
        preferred_language: user.preferred_language,
        last_login_at: user.last_login_at
      }
    });
  } catch (error) {
    console.error('[USER_AUTH] /me error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/user/change-password - Change password
app.post('/change-password', async (c) => {
  try {
    const sessionToken = getCookie(c, 'user_session');
    
    if (!sessionToken) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const body = await c.req.json();
    const { current_password, new_password } = body;

    if (!current_password || !new_password) {
      return c.json({ error: 'Current and new password are required' }, 400);
    }

    if (new_password.length < 8) {
      return c.json({ error: 'New password must be at least 8 characters' }, 400);
    }

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from session
    const { data: session } = await supabase
      .from('waitlist_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .single();

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Get user with password
    const { data: user } = await supabase
      .from('waitlist_users')
      .select('id, password_hash')
      .eq('id', session.user_id)
      .single();

    if (!user || !user.password_hash) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(current_password, user.password_hash);
    
    if (!passwordMatch) {
      return c.json({ error: 'Current password is incorrect' }, 401);
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(new_password, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('waitlist_users')
      .update({ password_hash: newPasswordHash })
      .eq('id', user.id);

    if (updateError) {
      console.error('[USER_AUTH] Password update error:', updateError);
      return c.json({ error: 'Failed to update password' }, 500);
    }

    return c.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('[USER_AUTH] Change password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/user/forgot-password - Request password reset
app.post('/forgot-password', async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    console.log('[USER_AUTH] ========================================');
    console.log('[USER_AUTH] 🔐 Password reset request');
    console.log('[USER_AUTH] Email:', email);

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Get environment
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    const sendgridKey = c.env?.SENDGRID_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user
    const { data: user, error: userError } = await supabase
      .from('waitlist_users')
      .select('id, email, first_name, last_name, is_active')
      .eq('email', email.toLowerCase())
      .single();

    // Always return success even if user doesn't exist (security best practice)
    if (userError || !user) {
      console.log('[USER_AUTH] ℹ️ User not found (returning success for security)');
      return c.json({ 
        success: true, 
        message: 'If this email is registered, you will receive a password reset link.' 
      });
    }

    if (!user.is_active) {
      console.log('[USER_AUTH] ⚠️ User account is inactive');
      return c.json({ 
        success: true, 
        message: 'If this email is registered, you will receive a password reset link.' 
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        ip_address: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
        user_agent: c.req.header('user-agent') || 'unknown'
      });

    if (tokenError) {
      console.error('[USER_AUTH] ❌ Token storage error:', tokenError);
      return c.json({ error: 'Failed to process reset request' }, 500);
    }

    // Send reset email
    if (sendgridKey) {
      console.log('[USER_AUTH] 📧 Sending password reset email...');
      try {
        const emailService = new EmailService({
          SENDGRID_API_KEY: sendgridKey,
          FROM_EMAIL: 'hello@risivo.com',
          FROM_NAME: 'Risivo Team'
        });

        await emailService.sendPasswordResetEmail({
          email: user.email,
          firstName: user.first_name,
          resetToken: resetToken
        });

        console.log('[USER_AUTH] ✅ Reset email sent successfully');
      } catch (emailError) {
        console.error('[USER_AUTH] ⚠️ Email send error:', emailError);
        return c.json({ error: 'Failed to send reset email. Please try again.' }, 500);
      }
    } else {
      console.warn('[USER_AUTH] ⚠️ SendGrid not configured');
      return c.json({ error: 'Email service not configured' }, 503);
    }

    console.log('[USER_AUTH] ✅ Password reset initiated');
    console.log('[USER_AUTH] ========================================');

    return c.json({ 
      success: true, 
      message: 'Password reset email sent. Please check your inbox.' 
    });
  } catch (error) {
    console.error('[USER_AUTH] Forgot password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/user/reset-password - Reset password with token
app.post('/reset-password', async (c) => {
  try {
    const body = await c.req.json();
    const { token, new_password } = body;

    console.log('[USER_AUTH] ========================================');
    console.log('[USER_AUTH] 🔐 Password reset with token');

    if (!token || !new_password) {
      return c.json({ error: 'Token and new password are required' }, 400);
    }

    if (new_password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }

    // Get environment
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: 'Service configuration error' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify token
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('id, user_id, expires_at, used_at')
      .eq('token', token)
      .single();

    if (tokenError || !resetToken) {
      console.log('[USER_AUTH] ❌ Invalid token');
      return c.json({ error: 'Invalid or expired reset token' }, 400);
    }

    // Check if already used
    if (resetToken.used_at) {
      console.log('[USER_AUTH] ❌ Token already used');
      return c.json({ error: 'This reset link has already been used' }, 400);
    }

    // Check if expired
    if (new Date(resetToken.expires_at) < new Date()) {
      console.log('[USER_AUTH] ❌ Token expired');
      return c.json({ error: 'Reset link has expired. Please request a new one.' }, 400);
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(new_password, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('waitlist_users')
      .update({ password_hash: newPasswordHash })
      .eq('id', resetToken.user_id);

    if (updateError) {
      console.error('[USER_AUTH] ❌ Password update error:', updateError);
      return c.json({ error: 'Failed to reset password' }, 500);
    }

    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', resetToken.id);

    console.log('[USER_AUTH] ✅ Password reset successful');
    console.log('[USER_AUTH] ========================================');

    return c.json({ 
      success: true, 
      message: 'Password reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('[USER_AUTH] Reset password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
