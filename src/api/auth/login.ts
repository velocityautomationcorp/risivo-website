// src/api/auth/login.ts
// API route for user login

import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';

export async function login(c: Context) {
  try {
    const body = await c.req.json();
    
    if (!body.email || !body.password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }
    
    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Fetch user from database (explicitly use public schema)
    const response = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${body.email.toLowerCase()}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept-Profile': 'public',
          'Content-Profile': 'public'
        }
      }
    );
    
    const users = await response.json();
    
    console.log('User lookup response:', {
      status: response.status,
      users_found: users.length,
      response_ok: response.ok
    });
    
    if (users.length === 0) {
      return c.json({ 
        error: 'Invalid email or password',
        debug: 'User not found in database'
      }, 401);
    }
    
    const user = users[0];
    
    console.log('User found:', {
      email: user.email,
      has_password_hash: !!user.password_hash,
      hash_length: user.password_hash?.length,
      hash_prefix: user.password_hash?.substring(0, 7)
    });
    
    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(body.password, user.password_hash);
    
    console.log('Password verification:', {
      email: body.email,
      password_length: body.password.length,
      hash_length: user.password_hash.length,
      hash_prefix: user.password_hash.substring(0, 7),
      password_match: passwordMatch
    });
    
    if (!passwordMatch) {
      return c.json({ 
        error: 'Invalid email or password',
        debug: {
          user_found: true,
          password_verified: false,
          hash_type: user.password_hash.substring(0, 4)
        }
      }, 401);
    }
    
    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    await fetch(`${supabaseUrl}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept-Profile': 'public',
        'Content-Profile': 'public'
      },
      body: JSON.stringify({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: c.req.header('CF-Connecting-IP'),
        user_agent: c.req.header('User-Agent')
      })
    });
    
    // Update last_login
    await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept-Profile': 'public',
        'Content-Profile': 'public'
      },
      body: JSON.stringify({
        last_login: new Date().toISOString()
      })
    });
    
    // Set cookie using Hono's setCookie helper
    setCookie(c, 'user_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',  // Changed from 'Strict' to 'Lax' to allow redirects to work
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
        investor_status: user.investor_status
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
