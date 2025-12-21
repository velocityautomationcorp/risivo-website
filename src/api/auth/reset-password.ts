// src/api/auth/reset-password.ts
// API route for password reset (with token)

import { Context } from 'hono';
import bcrypt from 'bcryptjs';

export async function resetPassword(c: Context) {
  try {
    const body = await c.req.json();
    
    if (!body.token || !body.password) {
      return c.json({ error: 'Token and password are required' }, 400);
    }
    
    if (body.password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    
    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Verify reset token
    const tokenResponse = await fetch(
      `${supabaseUrl}/rest/v1/password_reset_tokens?token=eq.${body.token}&used=eq.false`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept-Profile': 'public',
          'Content-Profile': 'public'
        }
      }
    );
    
    const tokens = await tokenResponse.json();
    
    if (tokens.length === 0) {
      return c.json({ error: 'Invalid or expired reset token' }, 400);
    }
    
    const resetToken = tokens[0];
    
    // Check if token is expired
    if (new Date(resetToken.expires_at) < new Date()) {
      return c.json({ error: 'Reset token has expired' }, 400);
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(body.password, 10);
    
    // Update user password
    await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${resetToken.user_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept-Profile': 'public',
        'Content-Profile': 'public'
      },
      body: JSON.stringify({
        password_hash: passwordHash
      })
    });
    
    // Mark token as used
    await fetch(`${supabaseUrl}/rest/v1/password_reset_tokens?token=eq.${body.token}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept-Profile': 'public',
        'Content-Profile': 'public'
      },
      body: JSON.stringify({
        used: true
      })
    });
    
    return c.json({ 
      success: true, 
      message: 'Password reset successfully' 
    }, 200);
    
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
