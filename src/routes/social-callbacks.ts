/**
 * Social Media OAuth Callbacks & Webhooks
 * Handles OAuth redirects and webhook verification for social platforms
 */

import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  FACEBOOK_WEBHOOK_VERIFY_TOKEN?: string;
};

const socialCallbacksRoute = new Hono<{ Bindings: Bindings }>();

// ============================================
// FACEBOOK / META WEBHOOKS
// ============================================

// Facebook Webhook Verification (GET request)
// Meta sends a GET request to verify the webhook URL
socialCallbacksRoute.get('/webhooks/facebook', async (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');

  // The verify token you set in Meta Developer Console
  const VERIFY_TOKEN = c.env?.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'risivo_fb_webhook_verify_2024';

  console.log('Facebook webhook verification request:', { mode, token, challenge });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Facebook webhook verified successfully');
    // Return the challenge to complete verification
    return c.text(challenge || '', 200);
  } else {
    console.log('Facebook webhook verification failed');
    return c.text('Forbidden', 403);
  }
});

// Facebook Webhook Events (POST request)
// Meta sends POST requests with event data
socialCallbacksRoute.post('/webhooks/facebook', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Facebook webhook event received:', JSON.stringify(body, null, 2));

    // Handle different event types
    if (body.object === 'page') {
      // Page events (messages, comments, etc.)
      for (const entry of body.entry || []) {
        const pageId = entry.id;
        const time = entry.time;

        // Handle messaging events
        if (entry.messaging) {
          for (const event of entry.messaging) {
            if (event.message) {
              console.log('New message received:', event.message);
              // TODO: Process incoming message
            }
            if (event.postback) {
              console.log('Postback received:', event.postback);
              // TODO: Process postback
            }
          }
        }

        // Handle feed events (comments, reactions)
        if (entry.changes) {
          for (const change of entry.changes) {
            console.log('Feed change:', change);
            // TODO: Process feed changes
          }
        }
      }
    }

    // Always return 200 OK to acknowledge receipt
    return c.json({ status: 'ok' }, 200);
  } catch (error) {
    console.error('Error processing Facebook webhook:', error);
    // Still return 200 to prevent Meta from retrying
    return c.json({ status: 'error', message: 'Processing error' }, 200);
  }
});

// ============================================
// OAUTH CALLBACKS
// ============================================

// Facebook OAuth Callback
socialCallbacksRoute.get('/callback/facebook', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');
  const errorDescription = c.req.query('error_description');

  if (error) {
    console.error('Facebook OAuth error:', error, errorDescription);
    return c.redirect('/updates/admin/social/connections?error=' + encodeURIComponent(errorDescription || error));
  }

  if (!code) {
    return c.redirect('/updates/admin/social/connections?error=no_code');
  }

  try {
    // TODO: Exchange code for access token
    // This requires FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in environment
    console.log('Facebook OAuth callback received with code:', code);

    // For now, redirect back to connections page with success
    return c.redirect('/updates/admin/social/connections?success=facebook_connected');
  } catch (err) {
    console.error('Facebook OAuth callback error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// LinkedIn OAuth Callback
socialCallbacksRoute.get('/callback/linkedin', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');
  const errorDescription = c.req.query('error_description');

  if (error) {
    console.error('LinkedIn OAuth error:', error, errorDescription);
    return c.redirect('/updates/admin/social/connections?error=' + encodeURIComponent(errorDescription || error));
  }

  if (!code) {
    return c.redirect('/updates/admin/social/connections?error=no_code');
  }

  try {
    // TODO: Exchange code for access token
    // This requires LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in environment
    console.log('LinkedIn OAuth callback received with code:', code);

    // For now, redirect back to connections page with success
    return c.redirect('/updates/admin/social/connections?success=linkedin_connected');
  } catch (err) {
    console.error('LinkedIn OAuth callback error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// Twitter/X OAuth Callback
socialCallbacksRoute.get('/callback/twitter', async (c) => {
  const oauthToken = c.req.query('oauth_token');
  const oauthVerifier = c.req.query('oauth_verifier');
  const denied = c.req.query('denied');

  if (denied) {
    console.error('Twitter OAuth denied');
    return c.redirect('/updates/admin/social/connections?error=access_denied');
  }

  if (!oauthToken || !oauthVerifier) {
    return c.redirect('/updates/admin/social/connections?error=missing_oauth_params');
  }

  try {
    // TODO: Exchange oauth_token and oauth_verifier for access token
    console.log('Twitter OAuth callback received');

    return c.redirect('/updates/admin/social/connections?success=twitter_connected');
  } catch (err) {
    console.error('Twitter OAuth callback error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// Instagram OAuth Callback (uses Facebook's OAuth)
socialCallbacksRoute.get('/callback/instagram', async (c) => {
  const code = c.req.query('code');
  const error = c.req.query('error');
  const errorDescription = c.req.query('error_description');

  if (error) {
    console.error('Instagram OAuth error:', error, errorDescription);
    return c.redirect('/updates/admin/social/connections?error=' + encodeURIComponent(errorDescription || error));
  }

  if (!code) {
    return c.redirect('/updates/admin/social/connections?error=no_code');
  }

  try {
    // TODO: Exchange code for access token (Instagram Basic Display API)
    console.log('Instagram OAuth callback received with code:', code);

    return c.redirect('/updates/admin/social/connections?success=instagram_connected');
  } catch (err) {
    console.error('Instagram OAuth callback error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// YouTube OAuth Callback (Google OAuth)
socialCallbacksRoute.get('/callback/youtube', async (c) => {
  const code = c.req.query('code');
  const error = c.req.query('error');

  if (error) {
    console.error('YouTube OAuth error:', error);
    return c.redirect('/updates/admin/social/connections?error=' + encodeURIComponent(error));
  }

  if (!code) {
    return c.redirect('/updates/admin/social/connections?error=no_code');
  }

  try {
    // TODO: Exchange code for access token (Google OAuth)
    console.log('YouTube OAuth callback received with code:', code);

    return c.redirect('/updates/admin/social/connections?success=youtube_connected');
  } catch (err) {
    console.error('YouTube OAuth callback error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// Pinterest OAuth Callback
socialCallbacksRoute.get('/callback/pinterest', async (c) => {
  const code = c.req.query('code');
  const error = c.req.query('error');

  if (error) {
    console.error('Pinterest OAuth error:', error);
    return c.redirect('/updates/admin/social/connections?error=' + encodeURIComponent(error));
  }

  if (!code) {
    return c.redirect('/updates/admin/social/connections?error=no_code');
  }

  try {
    // TODO: Exchange code for access token
    console.log('Pinterest OAuth callback received with code:', code);

    return c.redirect('/updates/admin/social/connections?success=pinterest_connected');
  } catch (err) {
    console.error('Pinterest OAuth callback error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

// TikTok OAuth Callback
socialCallbacksRoute.get('/callback/tiktok', async (c) => {
  const code = c.req.query('code');
  const error = c.req.query('error');

  if (error) {
    console.error('TikTok OAuth error:', error);
    return c.redirect('/updates/admin/social/connections?error=' + encodeURIComponent(error));
  }

  if (!code) {
    return c.redirect('/updates/admin/social/connections?error=no_code');
  }

  try {
    // TODO: Exchange code for access token
    console.log('TikTok OAuth callback received with code:', code);

    return c.redirect('/updates/admin/social/connections?success=tiktok_connected');
  } catch (err) {
    console.error('TikTok OAuth callback error:', err);
    return c.redirect('/updates/admin/social/connections?error=oauth_failed');
  }
});

export default socialCallbacksRoute;
