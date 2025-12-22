/**
 * Social Media Posting Service
 * Handles posting to all supported social media platforms
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Platform posting interfaces
interface PostContent {
    text: string;
    image_url?: string;
    video_url?: string;
    link_url?: string;
}

interface PostResult {
    success: boolean;
    platform_post_id?: string;
    platform_post_url?: string;
    error?: string;
}

interface ConnectionCredentials {
    access_token?: string;
    refresh_token?: string;
    api_key?: string;
    api_secret?: string;
    account_id?: string;
    metadata?: Record<string, any>;
}

// ==========================================
// FACEBOOK POSTING
// ==========================================

export async function postToFacebookPage(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token, account_id } = credentials;
        
        if (!access_token || !account_id) {
            return { success: false, error: 'Missing Facebook credentials' };
        }

        const url = `https://graph.facebook.com/v18.0/${account_id}/feed`;
        
        const params: Record<string, string> = {
            access_token,
            message: content.text
        };

        if (content.link_url) {
            params.link = content.link_url;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        const data = await response.json();

        if (data.error) {
            return { success: false, error: data.error.message };
        }

        return {
            success: true,
            platform_post_id: data.id,
            platform_post_url: `https://facebook.com/${data.id}`
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Facebook posting failed' };
    }
}

export async function postToFacebookGroup(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    // Similar to page posting but with group endpoint
    return postToFacebookPage(credentials, content);
}

// ==========================================
// LINKEDIN POSTING
// ==========================================

export async function postToLinkedInCompany(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token, account_id } = credentials;
        
        if (!access_token || !account_id) {
            return { success: false, error: 'Missing LinkedIn credentials' };
        }

        const url = 'https://api.linkedin.com/v2/ugcPosts';

        const postBody = {
            author: `urn:li:organization:${account_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: content.text
                    },
                    shareMediaCategory: content.link_url ? 'ARTICLE' : 'NONE',
                    ...(content.link_url && {
                        media: [{
                            status: 'READY',
                            originalUrl: content.link_url
                        }]
                    })
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postBody)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'LinkedIn posting failed' };
        }

        const postId = data.id?.replace('urn:li:share:', '');

        return {
            success: true,
            platform_post_id: data.id,
            platform_post_url: postId ? `https://www.linkedin.com/feed/update/${data.id}` : undefined
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'LinkedIn posting failed' };
    }
}

export async function postToLinkedInProfile(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token, account_id } = credentials;
        
        if (!access_token || !account_id) {
            return { success: false, error: 'Missing LinkedIn credentials' };
        }

        const url = 'https://api.linkedin.com/v2/ugcPosts';

        const postBody = {
            author: `urn:li:person:${account_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: content.text
                    },
                    shareMediaCategory: content.link_url ? 'ARTICLE' : 'NONE',
                    ...(content.link_url && {
                        media: [{
                            status: 'READY',
                            originalUrl: content.link_url
                        }]
                    })
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postBody)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'LinkedIn posting failed' };
        }

        return {
            success: true,
            platform_post_id: data.id,
            platform_post_url: `https://www.linkedin.com/feed/update/${data.id}`
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'LinkedIn posting failed' };
    }
}

export async function postToLinkedInGroup(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    // LinkedIn Groups API is limited, return placeholder
    return { 
        success: false, 
        error: 'LinkedIn Groups API requires special permissions. Please post manually.' 
    };
}

// ==========================================
// TWITTER/X POSTING
// ==========================================

export async function postToTwitter(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token, api_key, api_secret } = credentials;
        
        if (!access_token) {
            return { success: false, error: 'Missing Twitter credentials' };
        }

        // Twitter API v2 endpoint
        const url = 'https://api.twitter.com/2/tweets';

        let tweetText = content.text;
        if (content.link_url) {
            tweetText = `${content.text}\n\n${content.link_url}`;
        }

        // Truncate to 280 characters if needed
        if (tweetText.length > 280) {
            tweetText = tweetText.substring(0, 277) + '...';
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: tweetText })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.detail || data.title || 'Twitter posting failed' };
        }

        return {
            success: true,
            platform_post_id: data.data?.id,
            platform_post_url: data.data?.id ? `https://twitter.com/i/web/status/${data.data.id}` : undefined
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Twitter posting failed' };
    }
}

// ==========================================
// INSTAGRAM POSTING
// ==========================================

export async function postToInstagram(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token, account_id } = credentials;
        
        if (!access_token || !account_id) {
            return { success: false, error: 'Missing Instagram credentials' };
        }

        // Instagram requires an image for feed posts
        if (!content.image_url) {
            return { success: false, error: 'Instagram requires an image for feed posts' };
        }

        // Step 1: Create media container
        const containerUrl = `https://graph.facebook.com/v18.0/${account_id}/media`;
        
        const containerParams = {
            image_url: content.image_url,
            caption: content.text + (content.link_url ? `\n\n🔗 Link in bio` : ''),
            access_token
        };

        const containerResponse = await fetch(containerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(containerParams)
        });

        const containerData = await containerResponse.json();

        if (containerData.error) {
            return { success: false, error: containerData.error.message };
        }

        // Step 2: Publish the container
        const publishUrl = `https://graph.facebook.com/v18.0/${account_id}/media_publish`;
        
        const publishResponse = await fetch(publishUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creation_id: containerData.id,
                access_token
            })
        });

        const publishData = await publishResponse.json();

        if (publishData.error) {
            return { success: false, error: publishData.error.message };
        }

        return {
            success: true,
            platform_post_id: publishData.id,
            platform_post_url: `https://www.instagram.com/p/${publishData.id}`
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Instagram posting failed' };
    }
}

// ==========================================
// YOUTUBE POSTING
// ==========================================

export async function postToYouTube(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token } = credentials;
        
        if (!access_token) {
            return { success: false, error: 'Missing YouTube credentials' };
        }

        if (!content.video_url) {
            return { success: false, error: 'YouTube requires a video URL' };
        }

        // YouTube video upload is complex and requires the video file
        // This is a placeholder - actual implementation would need video upload
        return {
            success: false,
            error: 'YouTube video upload requires direct file upload. Please upload manually via YouTube Studio.'
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'YouTube posting failed' };
    }
}

// ==========================================
// PINTEREST POSTING
// ==========================================

export async function postToPinterest(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token, metadata } = credentials;
        const boardId = metadata?.board_id;
        
        if (!access_token) {
            return { success: false, error: 'Missing Pinterest credentials' };
        }

        if (!content.image_url) {
            return { success: false, error: 'Pinterest requires an image' };
        }

        const url = 'https://api.pinterest.com/v5/pins';

        const pinData: Record<string, any> = {
            title: content.text.substring(0, 100),
            description: content.text,
            media_source: {
                source_type: 'image_url',
                url: content.image_url
            }
        };

        if (boardId) {
            pinData.board_id = boardId;
        }

        if (content.link_url) {
            pinData.link = content.link_url;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pinData)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || 'Pinterest posting failed' };
        }

        return {
            success: true,
            platform_post_id: data.id,
            platform_post_url: `https://www.pinterest.com/pin/${data.id}`
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Pinterest posting failed' };
    }
}

// ==========================================
// TIKTOK POSTING
// ==========================================

export async function postToTikTok(
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    try {
        const { access_token } = credentials;
        
        if (!access_token) {
            return { success: false, error: 'Missing TikTok credentials' };
        }

        if (!content.video_url) {
            return { success: false, error: 'TikTok requires a video' };
        }

        // TikTok Content Posting API is limited
        // This is a placeholder - actual implementation needs TikTok for Developers access
        return {
            success: false,
            error: 'TikTok video upload requires TikTok Content Posting API access. Please upload manually via TikTok.'
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'TikTok posting failed' };
    }
}

// ==========================================
// MAIN POSTING DISPATCHER
// ==========================================

export async function postToplatform(
    platformKey: string,
    credentials: ConnectionCredentials,
    content: PostContent
): Promise<PostResult> {
    switch (platformKey) {
        case 'facebook_page':
            return postToFacebookPage(credentials, content);
        case 'facebook_group':
            return postToFacebookGroup(credentials, content);
        case 'linkedin_company':
            return postToLinkedInCompany(credentials, content);
        case 'linkedin_profile':
            return postToLinkedInProfile(credentials, content);
        case 'linkedin_group':
            return postToLinkedInGroup(credentials, content);
        case 'twitter':
            return postToTwitter(credentials, content);
        case 'instagram':
            return postToInstagram(credentials, content);
        case 'youtube':
            return postToYouTube(credentials, content);
        case 'pinterest':
            return postToPinterest(credentials, content);
        case 'tiktok':
            return postToTikTok(credentials, content);
        default:
            return { success: false, error: `Unknown platform: ${platformKey}` };
    }
}

// ==========================================
// PROCESS SOCIAL POST JOB
// ==========================================

export async function processSocialPost(
    supabase: SupabaseClient,
    postId: string
): Promise<{ success: boolean; results: Record<string, PostResult> }> {
    const results: Record<string, PostResult> = {};

    try {
        // Get the post with targets and connections
        const { data: post } = await supabase
            .from('social_posts')
            .select(`
                *,
                short_url:short_urls(*),
                targets:social_post_targets(
                    *,
                    connection:social_connections(
                        *,
                        platform:social_platforms(*)
                    )
                )
            `)
            .eq('id', postId)
            .single();

        if (!post) {
            return { success: false, results: { error: { success: false, error: 'Post not found' } } };
        }

        // Update post status to posting
        await supabase
            .from('social_posts')
            .update({ status: 'posting' })
            .eq('id', postId);

        // Process each target
        for (const target of post.targets || []) {
            const connection = target.connection;
            if (!connection || !connection.is_connected) {
                results[target.id] = { success: false, error: 'Connection not active' };
                continue;
            }

            const platformKey = connection.platform?.platform_key;
            if (!platformKey) {
                results[target.id] = { success: false, error: 'Unknown platform' };
                continue;
            }

            // Prepare content
            const content: PostContent = {
                text: post.post_content,
                image_url: post.image_url,
                video_url: post.video_url,
                link_url: post.short_url ? `https://risivo.com/s/${post.short_url.short_code}` : undefined
            };

            // Prepare credentials
            const credentials: ConnectionCredentials = {
                access_token: connection.access_token,
                refresh_token: connection.refresh_token,
                api_key: connection.api_key,
                api_secret: connection.api_secret,
                account_id: connection.account_id,
                metadata: connection.metadata
            };

            // Post to platform
            const result = await postToplatform(platformKey, credentials, content);
            results[target.id] = result;

            // Update target status
            await supabase
                .from('social_post_targets')
                .update({
                    status: result.success ? 'posted' : 'failed',
                    platform_post_id: result.platform_post_id,
                    platform_post_url: result.platform_post_url,
                    error_message: result.error,
                    posted_at: result.success ? new Date().toISOString() : null
                })
                .eq('id', target.id);
        }

        // Determine overall post status
        const allSucceeded = Object.values(results).every(r => r.success);
        const anySucceeded = Object.values(results).some(r => r.success);

        await supabase
            .from('social_posts')
            .update({
                status: allSucceeded ? 'posted' : (anySucceeded ? 'posted' : 'failed'),
                posted_at: anySucceeded ? new Date().toISOString() : null
            })
            .eq('id', postId);

        return { success: anySucceeded, results };
    } catch (error) {
        console.error('Process social post error:', error);
        
        await supabase
            .from('social_posts')
            .update({ status: 'failed' })
            .eq('id', postId);

        return { 
            success: false, 
            results: { error: { success: false, error: error instanceof Error ? error.message : 'Processing failed' } }
        };
    }
}
