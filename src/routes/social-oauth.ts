/**
 * Social Media OAuth Routes
 * Handles OAuth initiation and callbacks for social platforms
 * Provides "one-click connect" flow for LinkedIn, Facebook, etc.
 */

import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  // LinkedIn OAuth
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_CLIENT_SECRET?: string;
  // Facebook OAuth
  FACEBOOK_APP_ID?: string;
  FACEBOOK_APP_SECRET?: string;
  // Twitter OAuth
  TWITTER_CLIENT_ID?: string;
  TWITTER_CLIENT_SECRET?: string;
  // Base URL for callbacks
  SITE_URL?: string;
};

const socialOAuthRoute = new Hono<{ Bindings: Bindings }>();

// Helper function to generate random state for OAuth
function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================
// LINKEDIN OAUTH
// ============================================

// Initiate LinkedIn OAuth flow
socialOAuthRoute.get('/connect/linkedin', async (c) => {
  const clientId = c.env?.LINKEDIN_CLIENT_ID;
  const siteUrl = c.env?.SITE_URL || 'https://risivo.com';
  
  if (!clientId) {
    console.error('LinkedIn OAuth: LINKEDIN_CLIENT_ID not configured');
    return c.redirect('/updates/admin/social/connections?error=linkedin_not_configured');
  }
  
  // Verify admin is logged in
  const sessionToken = getCookie(c, 'admin_session');
  if (!sessionToken) {
    return c.redirect('/updates/admin/login?redirect=/updates/admin/social/connections');
  }
  
  // Generate state for CSRF protection
  const state = generateState();
  
  // Store state in cookie for verification
  setCookie(c, 'linkedin_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 600, // 10 minutes
    path: '/'
  });
  
  const redirectUri = `${siteUrl}/api/admin/social/oauth/callback/linkedin`;
  
  // LinkedIn OAuth scopes for pages and posting
  // - openid: OpenID Connect
  // - profile: Basic profile access
  // - email: Email address
  // - w_member_social: Post on behalf of member
  // - r_organization_admin: Read organization admin data (for pages)
  // - w_organization_social: Post on behalf of organization
  // - rw_organization_admin: Read/write organization admin data
  const scopes = [
    'openid',
    'profile', 
    'email',
    'w_member_social',
    'r_organization_admin',
    'w_organization_social',
    'rw_organization_admin'
  ].join(' ');
  
  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', scopes);
  
  console.log('[LinkedIn OAuth] Initiating flow with redirect:', redirectUri);
  
  return c.redirect(authUrl.toString());
});

// LinkedIn OAuth Callback - Exchange code for token
socialOAuthRoute.get('/callback/linkedin', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');
  const errorDescription = c.req.query('error_description');
  const storedState = getCookie(c, 'linkedin_oauth_state');
  
  console.log('[LinkedIn OAuth Callback] Received code:', code ? 'present' : 'missing');
  console.log('[LinkedIn OAuth Callback] State match:', state === storedState);
  
  if (error) {
    console.error('[LinkedIn OAuth] Error:', error, errorDescription);
    return c.redirect(`/updates/admin/social/connections?error=${encodeURIComponent(errorDescription || error)}`);
  }
  
  if (!code) {
    return c.redirect('/updates/admin/social/connections?error=no_code');
  }
  
  // Verify state for CSRF protection
  if (!state || state !== storedState) {
    console.error('[LinkedIn OAuth] State mismatch - possible CSRF attack');
    return c.redirect('/updates/admin/social/connections?error=invalid_state');
  }
  
  const clientId = c.env?.LINKEDIN_CLIENT_ID;
  const clientSecret = c.env?.LINKEDIN_CLIENT_SECRET;
  const siteUrl = c.env?.SITE_URL || 'https://risivo.com';
  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!clientId || !clientSecret) {
    console.error('[LinkedIn OAuth] Missing credentials');
    return c.redirect('/updates/admin/social/connections?error=missing_credentials');
  }
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('[LinkedIn OAuth] Missing database config');
    return c.redirect('/updates/admin/social/connections?error=database_error');
  }
  
  const redirectUri = `${siteUrl}/api/admin/social/oauth/callback/linkedin`;
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString()
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[LinkedIn OAuth] Token exchange failed:', errorText);
      return c.redirect('/updates/admin/social/connections?error=token_exchange_failed');
    }
    
    const tokenData = await tokenResponse.json() as {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
      refresh_token_expires_in?: number;
      scope: string;
    };
    
    console.log('[LinkedIn OAuth] Token received, expires in:', tokenData.expires_in);
    
    // Get user profile info
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      }
    });
    
    let profileData: any = {};
    if (profileResponse.ok) {
      profileData = await profileResponse.json();
      console.log('[LinkedIn OAuth] Profile loaded:', profileData.name || profileData.sub);
    }
    
    // Get organization pages the user administers
    let organizations: any[] = [];
    try {
      const orgResponse = await fetch('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (orgResponse.ok) {
        const orgData = await orgResponse.json();
        organizations = orgData.elements || [];
        console.log('[LinkedIn OAuth] Found', organizations.length, 'organizations');
      }
    } catch (orgError) {
      console.log('[LinkedIn OAuth] Could not fetch organizations:', orgError);
    }
    
    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
    
    // Store in temporary session for page selection
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Store OAuth data temporarily
    const oauthSessionId = generateState();
    
    setCookie(c, 'linkedin_oauth_session', oauthSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 600, // 10 minutes for selection
      path: '/'
    });
    
    // Store OAuth data in database temporarily
    const { error: sessionError } = await supabase
      .from('oauth_sessions')
      .upsert({
        session_id: oauthSessionId,
        platform: 'linkedin',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: expiresAt,
        profile_data: profileData,
        organizations: organizations,
        created_at: new Date().toISOString()
      });
    
    if (sessionError) {
      console.error('[LinkedIn OAuth] Session storage error:', sessionError);
      // Fallback: store basic connection immediately
      return c.redirect(`/updates/admin/social/select/linkedin?session=${oauthSessionId}&profile=${encodeURIComponent(JSON.stringify(profileData))}&orgs=${encodeURIComponent(JSON.stringify(organizations))}`);
    }
    
    // Redirect to page/organization selection
    return c.redirect(`/updates/admin/social/select/linkedin?session=${oauthSessionId}`);
    
  } catch (err) {
    console.error('[LinkedIn OAuth] Error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// Save LinkedIn connection after page selection
socialOAuthRoute.post('/save/linkedin', async (c) => {
  const sessionToken = getCookie(c, 'admin_session');
  if (!sessionToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const oauthSession = getCookie(c, 'linkedin_oauth_session');
  if (!oauthSession) {
    return c.json({ error: 'OAuth session expired' }, 400);
  }
  
  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return c.json({ error: 'Database configuration error' }, 500);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const body = await c.req.json();
    const { connection_type, organization_id, connection_name } = body;
    
    // Get OAuth session data
    const { data: sessionData, error: sessionError } = await supabase
      .from('oauth_sessions')
      .select('*')
      .eq('session_id', oauthSession)
      .single();
    
    if (sessionError || !sessionData) {
      return c.json({ error: 'OAuth session not found or expired' }, 400);
    }
    
    // Determine platform key based on connection type
    let platformKey = 'linkedin_profile';
    if (connection_type === 'company') {
      platformKey = 'linkedin_company';
    } else if (connection_type === 'group') {
      platformKey = 'linkedin_group';
    }
    
    // Get the platform ID
    const { data: platform } = await supabase
      .from('social_platforms')
      .select('id')
      .eq('platform_key', platformKey)
      .single();
    
    const platformId = platform?.id || platformKey; // Fallback to platform_key if no DB entry
    
    // Prepare connection data
    const profileData = sessionData.profile_data || {};
    const accountId = connection_type === 'profile' 
      ? profileData.sub 
      : organization_id;
    const accountName = connection_type === 'profile'
      ? profileData.name || profileData.email
      : connection_name;
    
    // Save the connection
    const { data: connection, error: connError } = await supabase
      .from('social_connections')
      .insert({
        platform_id: platformId,
        connection_name: connection_name || accountName,
        account_id: accountId,
        account_name: accountName,
        account_url: connection_type === 'profile' 
          ? `https://www.linkedin.com/in/${profileData.sub}`
          : `https://www.linkedin.com/company/${organization_id}`,
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
        token_expires_at: sessionData.expires_at,
        is_connected: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (connError) {
      console.error('[LinkedIn Save] Error:', connError);
      return c.json({ error: 'Failed to save connection' }, 500);
    }
    
    // Clean up OAuth session
    await supabase
      .from('oauth_sessions')
      .delete()
      .eq('session_id', oauthSession);
    
    return c.json({ 
      success: true, 
      connection_id: connection.id,
      message: 'LinkedIn connection saved successfully!'
    });
    
  } catch (err) {
    console.error('[LinkedIn Save] Error:', err);
    return c.json({ error: 'Failed to save connection' }, 500);
  }
});

// ============================================
// FACEBOOK OAUTH
// ============================================

// Initiate Facebook OAuth flow
socialOAuthRoute.get('/connect/facebook', async (c) => {
  const appId = c.env?.FACEBOOK_APP_ID;
  const siteUrl = c.env?.SITE_URL || 'https://risivo.com';
  
  if (!appId) {
    console.error('Facebook OAuth: FACEBOOK_APP_ID not configured');
    return c.redirect('/updates/admin/social/connections?error=facebook_not_configured');
  }
  
  // Verify admin is logged in
  const sessionToken = getCookie(c, 'admin_session');
  if (!sessionToken) {
    return c.redirect('/updates/admin/login?redirect=/updates/admin/social/connections');
  }
  
  // Generate state for CSRF protection
  const state = generateState();
  
  setCookie(c, 'facebook_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 600,
    path: '/'
  });
  
  const redirectUri = `${siteUrl}/api/admin/social/oauth/callback/facebook`;
  
  // Facebook OAuth scopes
  const scopes = [
    'email',
    'public_profile',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'pages_manage_metadata',
    'publish_to_groups'
  ].join(',');
  
  const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  authUrl.searchParams.set('client_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('response_type', 'code');
  
  console.log('[Facebook OAuth] Initiating flow');
  
  return c.redirect(authUrl.toString());
});

// Facebook OAuth Callback
socialOAuthRoute.get('/callback/facebook', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');
  const storedState = getCookie(c, 'facebook_oauth_state');
  
  if (error) {
    console.error('[Facebook OAuth] Error:', error);
    return c.redirect(`/updates/admin/social/connections?error=${encodeURIComponent(error)}`);
  }
  
  if (!code || !state || state !== storedState) {
    return c.redirect('/updates/admin/social/connections?error=invalid_request');
  }
  
  const appId = c.env?.FACEBOOK_APP_ID;
  const appSecret = c.env?.FACEBOOK_APP_SECRET;
  const siteUrl = c.env?.SITE_URL || 'https://risivo.com';
  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!appId || !appSecret) {
    return c.redirect('/updates/admin/social/connections?error=missing_credentials');
  }
  
  if (!supabaseUrl || !supabaseKey) {
    return c.redirect('/updates/admin/social/connections?error=database_error');
  }
  
  const redirectUri = `${siteUrl}/api/admin/social/oauth/callback/facebook`;
  
  try {
    // Exchange code for access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('code', code);
    
    const tokenResponse = await fetch(tokenUrl.toString());
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Facebook OAuth] Token exchange failed:', errorText);
      return c.redirect('/updates/admin/social/connections?error=token_exchange_failed');
    }
    
    const tokenData = await tokenResponse.json() as {
      access_token: string;
      token_type: string;
      expires_in?: number;
    };
    
    // Get user profile
    const profileResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
    );
    const profileData = profileResponse.ok ? await profileResponse.json() as any : {};
    
    // Get pages the user manages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`
    );
    let pages: any[] = [];
    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json() as any;
      pages = pagesData.data || [];
    }
    
    // Get groups the user manages
    const groupsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/groups?admin_only=true&access_token=${tokenData.access_token}`
    );
    let groups: any[] = [];
    if (groupsResponse.ok) {
      const groupsData = await groupsResponse.json() as any;
      groups = groupsData.data || [];
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const oauthSessionId = generateState();
    
    setCookie(c, 'facebook_oauth_session', oauthSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 600,
      path: '/'
    });
    
    // Store OAuth data
    await supabase
      .from('oauth_sessions')
      .upsert({
        session_id: oauthSessionId,
        platform: 'facebook',
        access_token: tokenData.access_token,
        expires_at: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          : null,
        profile_data: profileData,
        organizations: { pages, groups },
        created_at: new Date().toISOString()
      });
    
    return c.redirect(`/updates/admin/social/select/facebook?session=${oauthSessionId}`);
    
  } catch (err) {
    console.error('[Facebook OAuth] Error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// Save Facebook connection
socialOAuthRoute.post('/save/facebook', async (c) => {
  const sessionToken = getCookie(c, 'admin_session');
  if (!sessionToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const oauthSession = getCookie(c, 'facebook_oauth_session');
  if (!oauthSession) {
    return c.json({ error: 'OAuth session expired' }, 400);
  }
  
  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return c.json({ error: 'Database configuration error' }, 500);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const body = await c.req.json();
    const { connection_type, page_id, group_id, connection_name, page_access_token } = body;
    
    // Get OAuth session data
    const { data: sessionData, error: sessionError } = await supabase
      .from('oauth_sessions')
      .select('*')
      .eq('session_id', oauthSession)
      .single();
    
    if (sessionError || !sessionData) {
      return c.json({ error: 'OAuth session not found or expired' }, 400);
    }
    
    // Determine platform key
    let platformKey = 'facebook_page';
    if (connection_type === 'group') {
      platformKey = 'facebook_group';
    }
    
    // Get platform ID
    const { data: platform } = await supabase
      .from('social_platforms')
      .select('id')
      .eq('platform_key', platformKey)
      .single();
    
    const platformId = platform?.id || platformKey;
    
    // Use page-specific access token if available
    const accessToken = page_access_token || sessionData.access_token;
    const accountId = connection_type === 'page' ? page_id : group_id;
    
    // Save connection
    const { data: connection, error: connError } = await supabase
      .from('social_connections')
      .insert({
        platform_id: platformId,
        connection_name: connection_name,
        account_id: accountId,
        account_name: connection_name,
        account_url: connection_type === 'page'
          ? `https://www.facebook.com/${page_id}`
          : `https://www.facebook.com/groups/${group_id}`,
        access_token: accessToken,
        token_expires_at: sessionData.expires_at,
        is_connected: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (connError) {
      console.error('[Facebook Save] Error:', connError);
      return c.json({ error: 'Failed to save connection' }, 500);
    }
    
    // Clean up
    await supabase
      .from('oauth_sessions')
      .delete()
      .eq('session_id', oauthSession);
    
    return c.json({ 
      success: true, 
      connection_id: connection.id,
      message: 'Facebook connection saved successfully!'
    });
    
  } catch (err) {
    console.error('[Facebook Save] Error:', err);
    return c.json({ error: 'Failed to save connection' }, 500);
  }
});

export default socialOAuthRoute;
