// src/api/auth/signup-waitlist.ts
// API route for waitlist user signup

import { Context } from 'hono';
import bcrypt from 'bcryptjs';

export async function signupWaitlist(c: Context) {
  try {
    const body = await c.req.json();
    
    // Validation
    if (!body.email || !body.password || !body.first_name || !body.last_name || !body.business_name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    if (body.password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    
    // Hash password using bcrypt (industry standard)
    const passwordHash = await bcrypt.hash(body.password, 10);
    
    console.log('Signup password hashing (bcrypt):', {
      password_length: body.password.length,
      hash_length: passwordHash.length,
      hash_prefix: passwordHash.substring(0, 7) // Should be $2a$10$ or similar
    });
    
    // Create user in Supabase
    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'Accept-Profile': 'public',
        'Content-Profile': 'public'
      },
      body: JSON.stringify({
        email: body.email.toLowerCase(),
        password_hash: passwordHash,
        first_name: body.first_name,
        last_name: body.last_name,
        business_name: body.business_name,
        phone: body.phone || null,
        language: body.language || 'english',
        user_type: 'waitlist',
        status: 'active',
        discount_offer: '50_percent_lifetime',
        source: 'signup-page'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      if (error.code === '23505') { // Unique constraint violation
        return c.json({ error: 'Email already exists' }, 409);
      }
      console.error('Supabase error:', error);
      return c.json({ error: 'Failed to create user' }, 500);
    }
    
    const userData = await response.json();
    const user = userData[0];
    
    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    await fetch(`${supabaseUrl}/rest/v1/user_sessions`, {
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
    
    // Set cookie
    const cookieValue = `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`;
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
        discount_offer: user.discount_offer
      }
    }, 201, {
      'Set-Cookie': cookieValue
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
