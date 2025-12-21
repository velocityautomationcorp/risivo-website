import { html, raw } from 'hono/html';

// Helper function to format date
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Helper function to extract image URL from featured_image_url field
// Handles cases where field contains HTML <img> tag or just URL
function extractImageUrl(featuredImageUrl: string | null | undefined): string | null {
  if (!featuredImageUrl) return null;
  
  // If it's an HTML img tag, extract the src attribute
  if (featuredImageUrl.includes('<img')) {
    const srcMatch = featuredImageUrl.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  
  // Otherwise, assume it's a direct URL
  return featuredImageUrl;
}

// Helper function to clean content - remove standalone img tags that should be featured images
function cleanContent(content: string | null | undefined): string {
  if (!content) return '';
  
  let cleaned = content;
  
  console.log('[CLEAN CONTENT] Original length:', cleaned.length);
  console.log('[CLEAN CONTENT] First 200 chars:', cleaned.substring(0, 200));
  
  // Remove ALL img tags (they should be in media_url field, not content)
  // This is more aggressive but safer
  cleaned = cleaned.replace(/<img[^>]*>/gi, '');
  
  // Also clean up empty paragraphs that might be left
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
  
  // Remove leading whitespace and empty tags
  cleaned = cleaned.trim();
  
  console.log('[CLEAN CONTENT] Cleaned length:', cleaned.length);
  console.log('[CLEAN CONTENT] First 200 chars after clean:', cleaned.substring(0, 200));
  
  return cleaned;
}

// Helper function to generate video embed HTML
function generateVideoEmbed(mediaType: string | null, mediaUrl: string | null): string {
  if (mediaType !== 'video' || !mediaUrl) {
    return '';
  }
  
  console.log('[VIDEO EMBED] Generating embed for:', mediaUrl);
  
  let embedHtml = '';
  
  // YouTube
  if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
    let videoId = '';
    if (mediaUrl.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(mediaUrl);
        videoId = urlObj.searchParams.get('v') || '';
      } catch (e) {
        console.error('[VIDEO EMBED] YouTube URL parse error:', e);
      }
    } else if (mediaUrl.includes('youtu.be/')) {
      const parts = mediaUrl.split('youtu.be/');
      if (parts[1]) {
        videoId = parts[1].split('?')[0].split('/')[0];
      }
    }
    if (videoId) {
      embedHtml = `<div class="article-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      console.log('[VIDEO EMBED] YouTube video ID:', videoId);
    }
  }
  // Vimeo
  else if (mediaUrl.includes('vimeo.com')) {
    const parts = mediaUrl.split('vimeo.com/');
    if (parts[1]) {
      const videoId = parts[1].split('/')[0].split('?')[0];
      if (videoId) {
        embedHtml = `<div class="article-video"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
        console.log('[VIDEO EMBED] Vimeo video ID:', videoId);
      }
    }
  }
  // Wistia
  else if (mediaUrl.includes('wistia.com/medias/')) {
    const parts = mediaUrl.split('wistia.com/medias/');
    if (parts[1]) {
      const videoId = parts[1].split('?')[0].split('/')[0];
      if (videoId) {
        embedHtml = `<div class="article-video"><iframe src="https://fast.wistia.net/embed/iframe/${videoId}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;
        console.log('[VIDEO EMBED] Wistia video ID:', videoId);
      }
    }
  }
  // Direct video file
  else if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
    embedHtml = `<div class="article-video"><video controls><source src="${mediaUrl}" type="video/mp4"></video></div>`;
    console.log('[VIDEO EMBED] Direct video file');
  }
  
  if (!embedHtml) {
    console.warn('[VIDEO EMBED] No embed generated for URL:', mediaUrl);
  }
  
  return embedHtml;
}

// Helper function to generate image HTML
function generateImageEmbed(mediaType: string | null, mediaUrl: string | null, featuredImageUrl: string | null, title: string): string {
  if (mediaType === 'image' && mediaUrl && !featuredImageUrl) {
    return `<img src="${mediaUrl}" alt="${title}" class="article-image">`;
  }
  return '';
}

// Helper function to generate gallery HTML
function generateGalleryEmbed(mediaType: string | null, galleryImages: any): string {
  if (mediaType === 'gallery' && galleryImages && Array.isArray(galleryImages) && galleryImages.length > 0) {
    const images = galleryImages.map((img: string) => 
      `<img src="${img}" alt="Gallery image" class="gallery-image">`
    ).join('');
    return `<div class="article-gallery">${images}</div>`;
  }
  return '';
}

export const UpdateDetailPage = (user: any, update: any) => {
  // Pre-format the date for use in template
  const formattedDate = formatDate(update.published_at || update.created_at);
  
  // Extract clean image URL from featured_image_url (handles HTML img tags)
  const cleanFeaturedImageUrl = extractImageUrl(update.featured_image_url);
  
  // Clean content - remove standalone img tags at the beginning
  const cleanedContent = cleanContent(update.content);
  
  // Pre-generate media embeds
  const videoEmbed = generateVideoEmbed(update.media_type, update.media_url);
  const imageEmbed = generateImageEmbed(update.media_type, update.media_url, cleanFeaturedImageUrl, update.title);
  const galleryEmbed = generateGalleryEmbed(update.media_type, update.gallery_images);
  
  return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${update.title} - Risivo Updates</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        * {
            margin: 0;
    <style>
        /* Update Detail Page - Minimal page-specific styles */
        #interactions-section {
            scroll-margin-top: 80px;
        }
        
        #comments-section {
            scroll-margin-top: 80px;
        }
    </style>
    <div class="header">
        <div class="header-content">
            <a href="/updates/dashboard" class="back-btn">← Back to Dashboard</a>
            <div class="logo">
                <img src="/images/risivo-logo.png" alt="Risivo Logo" />
            </div>
        </div>
    </div>
    
    <!-- Article -->
    <div class="container">
        <article class="article">
            <div class="article-header">
                <span class="article-category ${update.category}">${update.category}</span>
                <h1 class="article-title">${update.title}</h1>
                <div class="article-meta">
                    <span class="meta-item">📝 By ${user.first_name || ''} ${user.last_name || 'Risivo Team'}</span>
                    <span class="meta-item">📅 ${formattedDate}</span>
                    <span class="meta-item">👁️ ${update.views_count || update.view_count || 0} views</span>
                    <span class="meta-item"><a href="#interactions-section" style="text-decoration: none; color: inherit;">👍 <span id="header-likes-count">0</span> likes</a></span>
                    <span class="meta-item"><a href="#comments-section" style="text-decoration: none; color: inherit;">💬 <span id="header-comments-count">0</span> comments</a></span>
                </div>
            </div>
            
            <div class="article-content">
                ${raw(videoEmbed)}
                
                ${raw(imageEmbed)}
                
                ${raw(galleryEmbed)}
                
                ${!videoEmbed && !imageEmbed && !galleryEmbed && cleanFeaturedImageUrl ? raw(`
                    <img src="${cleanFeaturedImageUrl}" alt="${update.title}" class="article-image">
                `) : ''}
                
                ${raw(cleanedContent)}
            </div>
            
            <div class="share-section">
                <h3 class="share-title">Share this update:</h3>
                <div class="share-buttons">
                    <button class="share-btn twitter" onclick="shareOnTwitter()">
                        🐦 Share on Twitter
                    </button>
                    <button class="share-btn linkedin" onclick="shareOnLinkedIn()">
                        💼 Share on LinkedIn
                    </button>
                    <button class="share-btn facebook" onclick="shareOnFacebook()">
                        👍 Share on Facebook
                    </button>
                </div>
            </div>
            
            <!-- Like/Dislike Section -->
            <div class="interactions-section" id="interactions-section">
                <h3 class="interactions-title">Was this update helpful?</h3>
                <div class="like-buttons">
                    <button class="like-btn" id="likeBtn" onclick="toggleLike('like')">
                        <span class="like-icon">👍</span>
                        <span class="like-text">Helpful</span>
                        <span class="like-count" id="likeCount">0</span>
                    </button>
                    <button class="like-btn" id="dislikeBtn" onclick="toggleLike('dislike')">
                        <span class="like-icon">👎</span>
                        <span class="like-text">Not Helpful</span>
                        <span class="like-count" id="dislikeCount">0</span>
                    </button>
                </div>
            </div>
            
            <!-- Comments Section -->
            <div class="comments-section" id="comments-section">
                <h3 class="comments-title">
                    <span>💬 Comments</span>
                    <span class="comments-count" id="totalCommentsCount">0</span>
                </h3>
                
                <!-- Add Comment Form -->
                <div class="add-comment-form">
                    <textarea 
                        id="commentInput" 
                        placeholder="Share your thoughts about this update..."
                        rows="3"
                        maxlength="1000"
                    ></textarea>
                    <div class="comment-form-footer">
                        <span class="char-count" id="charCount">0/1000</span>
                        <button class="btn-post-comment" onclick="postComment()">Post Comment</button>
                    </div>
                </div>
                
                <!-- Comments List -->
                <div class="comments-list" id="commentsList">
                    <div class="loading-comments">Loading comments...</div>
                </div>
            </div>
        </article>
    </div>
    
    <script>
        const updateSlug = '${update.slug}';
        const updateTitle = '${update.title}';
        const updateUrl = window.location.href;
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
        
        function renderMarkdown(content) {
            // Simple markdown rendering (you can enhance this)
            return content
                .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>')
                .replace(/\\n\\n/g, '</p><p>')
                .replace(/^(?!<[hul])/gm, '<p>')
                .replace(/(?<![hul]>)$/gm, '</p>');
        }
        
        async function trackShare(platform) {
            try {
                await fetch(\`/api/updates/\${updateSlug}/share\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ platform })
                });
            } catch (error) {
                console.error('Track share error:', error);
            }
        }
        
        function shareOnTwitter() {
            const text = \`Check out this update from Risivo: \${updateTitle}\`;
            const url = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text)}&url=\${encodeURIComponent(updateUrl)}\`;
            window.open(url, '_blank', 'width=600,height=400');
            trackShare('twitter');
        }
        
        function shareOnLinkedIn() {
            const url = \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(updateUrl)}\`;
            window.open(url, '_blank', 'width=600,height=600');
            trackShare('linkedin');
        }
        
        function shareOnFacebook() {
            const url = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(updateUrl)}\`;
            window.open(url, '_blank', 'width=600,height=400');
            trackShare('facebook');
        }
        
        // ============================================
        // LIKES/DISLIKES & COMMENTS FUNCTIONALITY
        // ============================================
        
        const updateId = '${update.id}';
        let userLikeStatus = null; // 'like', 'dislike', or null
        
        // Load interactions on page load
        async function loadInteractions() {
            try {
                const response = await fetch(\`/api/updates/\${updateId}/interactions\`);
                const data = await response.json();
                
                if (data.success) {
                    // Update counts
                    document.getElementById('likeCount').textContent = data.likes_count;
                    document.getElementById('dislikeCount').textContent = data.dislikes_count;
                    document.getElementById('totalCommentsCount').textContent = data.comments_count;
                    
                    // Update user's like status
                    userLikeStatus = data.user_like_status;
                    
                    if (userLikeStatus === 'like') {
                        document.getElementById('likeBtn').classList.add('active');
                    } else if (userLikeStatus === 'dislike') {
                        document.getElementById('dislikeBtn').classList.add('active');
                    }
                }
            } catch (error) {
                console.error('Error loading interactions:', error);
            }
        }
        
        // Toggle like/dislike
        async function toggleLike(type) {
            try {
                const response = await fetch(\`/api/updates/\${updateId}/like\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Reload interactions to get updated counts
                    await loadInteractions();
                }
            } catch (error) {
                console.error('Error toggling like:', error);
                alert('Failed to update. Please try again.');
            }
        }
        
        // Load comments
        async function loadComments() {
            try {
                const response = await fetch(\`/api/updates/\${updateId}/comments\`);
                const data = await response.json();
                
                const commentsList = document.getElementById('commentsList');
                
                if (data.success) {
                    if (data.comments.length === 0) {
                        commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
                    } else {
                        commentsList.innerHTML = data.comments.map(comment => \`
                            <div class="comment-item">
                                <div class="comment-header">
                                    <span class="comment-author">\${comment.user.first_name || ''} \${comment.user.last_name || ''}</span>
                                    <span class="comment-date">\${formatCommentDate(comment.created_at)}</span>
                                </div>
                                <div class="comment-text">\${comment.comment_text}</div>
                                <div class="comment-actions">
                                    <button class="btn-delete-comment" onclick="deleteComment('\${comment.id}')">🗑️ Delete</button>
                                </div>
                            </div>
                        \`).join('');
                    }
                }
            } catch (error) {
                console.error('Error loading comments:', error);
                document.getElementById('commentsList').innerHTML = '<div class="no-comments">Failed to load comments.</div>';
            }
        }
        
        // Post comment
        async function postComment() {
            const input = document.getElementById('commentInput');
            const comment = input.value.trim();
            
            if (!comment) {
                alert('Please enter a comment');
                return;
            }
            
            try {
                const response = await fetch(\`/api/updates/\${updateId}/comments\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    input.value = '';
                    document.getElementById('charCount').textContent = '0/1000';
                    await loadComments();
                    await loadInteractions(); // Update comment count
                }
            } catch (error) {
                console.error('Error posting comment:', error);
                alert('Failed to post comment. Please try again.');
            }
        }
        
        // Delete comment
        async function deleteComment(commentId) {
            if (!confirm('Are you sure you want to delete this comment?')) {
                return;
            }
            
            try {
                const response = await fetch(\`/api/updates/\${updateId}/comments/\${commentId}\`, {
                    method: 'DELETE'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    await loadComments();
                    await loadInteractions(); // Update comment count
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment. Please try again.');
            }
        }
        
        // Character counter for comment input
        document.getElementById('commentInput').addEventListener('input', function() {
            const count = this.value.length;
            document.getElementById('charCount').textContent = \`\${count}/1000\`;
        });
        
        // Format comment date
        function formatCommentDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 7) {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } else if (days > 0) {
                return \`\${days} day\${days > 1 ? 's' : ''} ago\`;
            } else if (hours > 0) {
                return \`\${hours} hour\${hours > 1 ? 's' : ''} ago\`;
            } else if (minutes > 0) {
                return \`\${minutes} minute\${minutes > 1 ? 's' : ''} ago\`;
            } else {
                return 'Just now';
            }
        }
        
        // Initialize on page load
        loadInteractions();
        loadComments();
    </script>
</body>
</html>
`;
};
