/**
 * Social Media Auto-Post Integration
 * Handles posting updates to LinkedIn, Facebook, Instagram, and X (Twitter)
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
 * Post to LinkedIn Company Page
 */
async function postToLinkedIn(
  post: SocialMediaPost,
  accessToken: string
): Promise<{ success: boolean; error?: string; platform_post_id?: string }> {
  try {
    // Format post for LinkedIn (max 3000 chars)
    const postText = `${post.title}\n\n${post.excerpt || post.content.substring(0, 200)}...\n\nRead more: https://risivo.com/updates/view/${post.slug}`;

    const linkedInPayload = {
      author: `urn:li:organization:YOUR_LINKEDIN_ORG_ID`, // Will be replaced with actual ID
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postText.substring(0, 3000),
          },
          shareMediaCategory: post.featured_image ? 'IMAGE' : 'NONE',
          ...(post.featured_image && {
            media: [
              {
                status: 'READY',
                originalUrl: post.featured_image,
              },
            ],
          }),
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(linkedInPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LinkedIn API Error:', error);
      return { success: false, error: `LinkedIn: ${error}` };
    }

    const data = await response.json();
    return {
      success: true,
      platform_post_id: data.id,
    };
  } catch (error: any) {
    console.error('LinkedIn posting error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Post to Facebook Page
 */
async function postToFacebook(
  post: SocialMediaPost,
  accessToken: string,
  pageId: string
): Promise<{ success: boolean; error?: string; platform_post_id?: string }> {
  try {
    // Format post for Facebook
    const postText = `${post.title}\n\n${post.excerpt || post.content.substring(0, 300)}...\n\nRead more: https://risivo.com/updates/view/${post.slug}`;

    const facebookPayload: any = {
      message: postText,
      link: `https://risivo.com/updates/view/${post.slug}`,
      access_token: accessToken,
    };

    // Add image if available
    if (post.featured_image) {
      facebookPayload.picture = post.featured_image;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facebookPayload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Facebook API Error:', error);
      return { success: false, error: `Facebook: ${error.error?.message}` };
    }

    const data = await response.json();
    return {
      success: true,
      platform_post_id: data.id,
    };
  } catch (error: any) {
    console.error('Facebook posting error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Post to Instagram Business Account
 */
async function postToInstagram(
  post: SocialMediaPost,
  accessToken: string,
  instagramAccountId: string
): Promise<{ success: boolean; error?: string; platform_post_id?: string }> {
  try {
    if (!post.featured_image) {
      return {
        success: false,
        error: 'Instagram requires an image for posting',
      };
    }

    // Instagram requires 2-step process: create container, then publish

    // Step 1: Create media container
    const caption = `${post.title}\n\n${post.excerpt || post.content.substring(0, 200)}...\n\n🔗 Link in bio\n\n${(post.tags || []).map((tag) => `#${tag.replace(/\s+/g, '')}`).join(' ')}`;

    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: post.featured_image,
          caption: caption.substring(0, 2200), // Instagram limit
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json();
      console.error('Instagram Container Error:', error);
      return {
        success: false,
        error: `Instagram: ${error.error?.message}`,
      };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Step 2: Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      console.error('Instagram Publish Error:', error);
      return {
        success: false,
        error: `Instagram: ${error.error?.message}`,
      };
    }

    const publishData = await publishResponse.json();
    return {
      success: true,
      platform_post_id: publishData.id,
    };
  } catch (error: any) {
    console.error('Instagram posting error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Post to X (Twitter)
 */
async function postToX(
  post: SocialMediaPost,
  accessToken: string,
  accessTokenSecret: string,
  apiKey: string,
  apiKeySecret: string
): Promise<{ success: boolean; error?: string; platform_post_id?: string }> {
  try {
    // Format post for X (280 character limit for text)
    const baseText = `${post.title}\n\nRead more: https://risivo.com/updates/view/${post.slug}`;
    const postText =
      baseText.length > 280 ? baseText.substring(0, 277) + '...' : baseText;

    // X API v2 requires OAuth 1.0a signature
    // For simplicity, we'll use a webhook approach or Make.com integration
    // Direct API integration would require OAuth1.0a library

    // For now, return a note that X integration requires webhook setup
    return {
      success: false,
      error:
        'X (Twitter) posting requires OAuth 1.0a setup. Please use Make.com webhook.',
    };
  } catch (error: any) {
    console.error('X posting error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Main endpoint to post to all social media platforms
 */
socialMediaRoute.post('/post', async (c) => {
  try {
    const body = await c.req.json<SocialMediaPost>();

    // Get credentials from environment variables
    const linkedinToken = c.env?.LINKEDIN_ACCESS_TOKEN;
    const facebookToken = c.env?.FACEBOOK_ACCESS_TOKEN;
    const facebookPageId = c.env?.FACEBOOK_PAGE_ID;
    const instagramToken = c.env?.INSTAGRAM_ACCESS_TOKEN;
    const instagramAccountId = c.env?.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const xApiKey = c.env?.X_API_KEY;
    const xApiKeySecret = c.env?.X_API_KEY_SECRET;
    const xAccessToken = c.env?.X_ACCESS_TOKEN;
    const xAccessTokenSecret = c.env?.X_ACCESS_TOKEN_SECRET;

    const results: any = {
      linkedin: null,
      facebook: null,
      instagram: null,
      x: null,
    };

    // Post to LinkedIn
    if (linkedinToken) {
      results.linkedin = await postToLinkedIn(body, linkedinToken);
    } else {
      results.linkedin = {
        success: false,
        error: 'LinkedIn access token not configured',
      };
    }

    // Post to Facebook
    if (facebookToken && facebookPageId) {
      results.facebook = await postToFacebook(
        body,
        facebookToken,
        facebookPageId
      );
    } else {
      results.facebook = {
        success: false,
        error: 'Facebook credentials not configured',
      };
    }

    // Post to Instagram
    if (instagramToken && instagramAccountId) {
      results.instagram = await postToInstagram(
        body,
        instagramToken,
        instagramAccountId
      );
    } else {
      results.instagram = {
        success: false,
        error: 'Instagram credentials not configured',
      };
    }

    // Post to X (Twitter) - Note: Requires special OAuth handling
    if (xApiKey && xApiKeySecret && xAccessToken && xAccessTokenSecret) {
      results.x = await postToX(
        body,
        xAccessToken,
        xAccessTokenSecret,
        xApiKey,
        xApiKeySecret
      );
    } else {
      results.x = {
        success: false,
        error: 'X (Twitter) credentials not configured',
      };
    }

    // Count successes
    const successCount = Object.values(results).filter(
      (r: any) => r.success
    ).length;

    return c.json({
      success: successCount > 0,
      posted_to: successCount,
      total_platforms: 4,
      results,
    });
  } catch (error: any) {
    console.error('Social media posting error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

/**
 * Health check endpoint
 */
socialMediaRoute.get('/health', (c) => {
  return c.json({
    status: 'ok',
    platforms: SOCIAL_PLATFORMS,
    configured: {
      linkedin: !!c.env?.LINKEDIN_ACCESS_TOKEN,
      facebook: !!(
        c.env?.FACEBOOK_ACCESS_TOKEN && c.env?.FACEBOOK_PAGE_ID
      ),
      instagram: !!(
        c.env?.INSTAGRAM_ACCESS_TOKEN && c.env?.INSTAGRAM_BUSINESS_ACCOUNT_ID
      ),
      x: !!(
        c.env?.X_API_KEY &&
        c.env?.X_API_KEY_SECRET &&
        c.env?.X_ACCESS_TOKEN &&
        c.env?.X_ACCESS_TOKEN_SECRET
      ),
    },
  });
});

export default socialMediaRoute;
