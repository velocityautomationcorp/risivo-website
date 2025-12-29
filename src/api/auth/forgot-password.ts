// src/api/auth/forgot-password.ts
// API route for password reset request

import { Context } from 'hono';

export async function forgotPassword(c: Context) {
  try {
    const body = await c.req.json();
    
    if (!body.email) {
      return c.json({ error: 'Email is required' }, 400);
    }
    
    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Check if user exists
    const userResponse = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${body.email.toLowerCase()}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );
    
    const users = await userResponse.json();
    
    // Always return success (security: don't reveal if email exists)
    if (users.length === 0) {
      return c.json({ 
        success: true, 
        message: 'If this email exists, a password reset link has been sent.' 
      }, 200);
    }
    
    const user = users[0];
    
    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Store reset token in database
    await fetch(`${supabaseUrl}/rest/v1/password_reset_tokens`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        used: false
      })
    });
    
    // Send reset email via webhook
    const resetLink = `https://risivo.com/updates/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    
    // TODO: Send email via Make.com or SendGrid
    // For now, log the reset link (in production, send via email)
    console.log('Password reset link:', resetLink);
    console.log('User:', user.email, user.first_name, user.last_name);
    
    // You can add Make.com webhook call here to send email
    // await fetch(c.env.MAKE_PASSWORD_RESET_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email: user.email,
    //     first_name: user.first_name,
    //     reset_link: resetLink
    //   })
    // });
    
    return c.json({ 
      success: true, 
      message: 'If this email exists, a password reset link has been sent.',
      // TEMP: Include link in response for testing (remove in production)
      reset_link: resetLink
    }, 200);
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
