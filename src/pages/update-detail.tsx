import { html } from 'hono/html';

export const UpdateDetailPage = (user: any, update: any) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${update.title} - Risivo Updates</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .back-btn {
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .back-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 800;
        }
        
        /* Main Container */
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .article {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .article-header {
            padding: 40px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .article-category {
            display: inline-block;
            padding: 6px 14px;
            background: #f0f0f0;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
        
        .article-category.feature {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .article-category.bugfix {
            background: #fff3e0;
            color: #f57c00;
        }
        
        .article-category.announcement {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .article-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #333;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        
        .article-meta {
            display: flex;
            gap: 25px;
            color: #999;
            font-size: 0.9rem;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .article-image {
            width: 100%;
            max-height: 500px;
            object-fit: cover;
        }
        
        .article-content {
            padding: 40px;
            font-size: 1.1rem;
            line-height: 1.8;
            color: #333;
        }
        
        .article-content h1,
        .article-content h2,
        .article-content h3 {
            margin-top: 30px;
            margin-bottom: 15px;
            color: #333;
        }
        
        .article-content h1 {
            font-size: 2rem;
        }
        
        .article-content h2 {
            font-size: 1.6rem;
        }
        
        .article-content h3 {
            font-size: 1.3rem;
        }
        
        .article-content p {
            margin-bottom: 20px;
        }
        
        .article-content ul,
        .article-content ol {
            margin-left: 30px;
            margin-bottom: 20px;
        }
        
        .article-content li {
            margin-bottom: 10px;
        }
        
        .article-content strong {
            font-weight: 700;
            color: #667eea;
        }
        
        .article-content a {
            color: #667eea;
            text-decoration: underline;
        }
        
        .article-content code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        /* Share Section */
        .share-section {
            padding: 30px 40px;
            background: #f9f9f9;
            border-top: 1px solid #f0f0f0;
        }
        
        .share-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
        }
        
        .share-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .share-btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .share-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .share-btn.twitter {
            background: #1DA1F2;
            color: white;
        }
        
        .share-btn.linkedin {
            background: #0077B5;
            color: white;
        }
        
        .share-btn.facebook {
            background: #1877F2;
            color: white;
        }
        
        @media (max-width: 768px) {
            .article-title {
                font-size: 1.8rem;
            }
            
            .article-header,
            .article-content,
            .share-section {
                padding: 25px;
            }
            
            .share-buttons {
                flex-direction: column;
            }
            
            .share-btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-content">
            <a href="/updates/dashboard" class="back-btn">← Back to Dashboard</a>
            <div class="logo">RISIVO</div>
        </div>
    </div>
    
    <!-- Article -->
    <div class="container">
        <article class="article">
            <div class="article-header">
                <span class="article-category ${update.category}">${update.category}</span>
                <h1 class="article-title">${update.title}</h1>
                <div class="article-meta">
                    <span class="meta-item">📝 ${update.author_name}</span>
                    <span class="meta-item">📅 ${formatDate(update.published_at)}</span>
                    <span class="meta-item">👁️ ${update.views_count} views</span>
                </div>
            </div>
            
            ${update.featured_image_url ? `
                <img src="${update.featured_image_url}" alt="${update.title}" class="article-image">
            ` : ''}
            
            <div class="article-content">
                ${renderMarkdown(update.content)}
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
    </script>
</body>
</html>
`;

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function renderMarkdown(content: string) {
    // Simple markdown to HTML conversion
    return content
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .split('\n\n')
        .map(p => p.trim() ? (p.startsWith('<') ? p : `<p>${p}</p>`) : '')
        .join('\n');
}
`;
