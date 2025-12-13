/**
 * Social Media Auto-Post Integration via Make.com
 * Simple webhook-based posting to LinkedIn, Facebook, Instagram, and X (Twitter)
 */

import { Hono } from 'hono';
import type { Env } from '../types';

const socialMediaRoute = new Hono<{ Bindings: Env }>();

// Social Media Platform URLs
const SOCIAL_PLATFORMS = {
  linkedin: 'https://www.linkedin.com/showcase/risivo-crm/',
  facebook: 'https://www.facebook.com/risivocrm',
  instagram: 'https://www.instagram.com/risivocrm/',
  x: 'https://x.com/risivocrm',
};

interface SocialMediaPost {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featured_image?: string;
  tags?: string[];
}

/**
 * Post to all social media platforms via Make.com webhook
 */
socialMediaRoute.post('/post', async (c) => {
  try {
    const body = await c.req.json<SocialMediaPost>();

    // Get Make.com webhook URL from environment variables
    const makeWebhookUrl = c.env?.MAKE_WEBHOOK_URL;

    if (!makeWebhookUrl) {
      return c.json({
        success: false,
        error: 'Make.com webhook URL not configured',
        message: 'Please set MAKE_WEBHOOK_URL environment variable in Cloudflare',
      }, 500);
    }

    // Prepare payload for Make.com
    const makePayload = {
      // Basic update information
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 300),
      slug: body.slug,
      update_url: `https://risivo.com/updates/view/${body.slug}`,
      
      // Media
      featured_image: body.featured_image || null,
      
      // Metadata
      tags: body.tags || [],
      timestamp: new Date().toISOString(),
      
      // Platform-specific URLs
      platforms: SOCIAL_PLATFORMS,
      
      // Pre-formatted posts for each platform
      posts: {
        // LinkedIn (3000 char limit)
        linkedin: {
          text: `${body.title}\n\n${body.excerpt || body.content.substring(0, 200)}...\n\nRead more: https://risivo.com/updates/view/${body.slug}`,
          image_url: body.featured_image || null,
        },
        
        // Facebook
        facebook: {
          message: `${body.title}\n\n${body.excerpt || body.content.substring(0, 300)}...\n\nRead more: https://risivo.com/updates/view/${body.slug}`,
          link: `https://risivo.com/updates/view/${body.slug}`,
          picture: body.featured_image || null,
        },
        
        // Instagram (2200 char limit, requires image)
        instagram: {
          caption: `${body.title}\n\n${body.excerpt || body.content.substring(0, 200)}...\n\n🔗 Link in bio\n\n${(body.tags || []).map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')}`.substring(0, 2200),
          image_url: body.featured_image || null,
          requires_image: true,
        },
        
        // X/Twitter (280 char limit)
        x: {
          text: (() => {
            const baseText = `${body.title}\n\nRead more: https://risivo.com/updates/view/${body.slug}`;
            return baseText.length > 280 ? baseText.substring(0, 277) + '...' : baseText;
          })(),
          media_url: body.featured_image || null,
        },
      },
    };

    // Send to Make.com webhook
    const makeResponse = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(makePayload),
    });

    if (!makeResponse.ok) {
      const errorText = await makeResponse.text();
      console.error('Make.com webhook error:', errorText);
      return c.json({
        success: false,
        error: 'Failed to send to Make.com webhook',
        status: makeResponse.status,
        message: errorText,
      }, 500);
    }

    // Get response from Make.com (if any)
    let makeResult;
    try {
      makeResult = await makeResponse.json();
    } catch (e) {
      // Make.com might not return JSON, that's okay
      makeResult = { accepted: true };
    }

    return c.json({
      success: true,
      message: 'Update sent to Make.com for social media posting',
      webhook_response: makeResult,
      platforms: Object.keys(SOCIAL_PLATFORMS),
      update_url: `https://risivo.com/updates/view/${body.slug}`,
    });

  } catch (error: any) {
    console.error('Social media posting error:', error);
    return c.json({
      success: false,
      error: error.message || 'Internal server error',
    }, 500);
  }
});

/**
 * Health check endpoint
 */
socialMediaRoute.get('/health', (c) => {
  const makeWebhookUrl = c.env?.MAKE_WEBHOOK_URL;
  
  return c.json({
    status: 'ok',
    integration: 'Make.com',
    webhook_configured: !!makeWebhookUrl,
    webhook_url_preview: makeWebhookUrl 
      ? `${makeWebhookUrl.substring(0, 40)}...` 
      : 'Not configured',
    platforms: SOCIAL_PLATFORMS,
    message: makeWebhookUrl 
      ? 'Ready to post to social media via Make.com' 
      : 'Please configure MAKE_WEBHOOK_URL environment variable',
  });
});

/**
 * Test endpoint - Send a test post to Make.com
 */
socialMediaRoute.post('/test', async (c) => {
  try {
    const makeWebhookUrl = c.env?.MAKE_WEBHOOK_URL;

    if (!makeWebhookUrl) {
      return c.json({
        success: false,
        error: 'Make.com webhook URL not configured',
      }, 500);
    }

    // Test payload
    const testPayload = {
      title: 'Test Post from Risivo',
      content: 'This is a test post to verify the Make.com integration is working correctly.',
      excerpt: 'This is a test post to verify the Make.com integration.',
      slug: 'test-post',
      update_url: 'https://risivo.com/updates/view/test-post',
      featured_image: null,
      tags: ['test'],
      timestamp: new Date().toISOString(),
      is_test: true,
      platforms: SOCIAL_PLATFORMS,
      posts: {
        linkedin: {
          text: 'Test Post from Risivo\n\nThis is a test post to verify integration.\n\nRead more: https://risivo.com/updates/view/test-post',
          image_url: null,
        },
        facebook: {
          message: 'Test Post from Risivo - Integration Test',
          link: 'https://risivo.com/updates/view/test-post',
          picture: null,
        },
        instagram: {
          caption: 'Test Post from Risivo 🧪 #test',
          image_url: null,
          requires_image: true,
        },
        x: {
          text: 'Test Post from Risivo - Integration working! 🚀',
          media_url: null,
        },
      },
    };

    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const result = response.ok ? await response.json().catch(() => ({ accepted: true })) : null;

    return c.json({
      success: response.ok,
      status: response.status,
      message: response.ok 
        ? 'Test post sent successfully to Make.com' 
        : 'Failed to send test post',
      webhook_response: result,
    });

  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
    }, 500);
  }
});

export default socialMediaRoute;
