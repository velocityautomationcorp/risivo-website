import { html } from 'hono/html';

export const UpdateDetailPage = (user: any, update: any) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${update.title} - Risivo Updates</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaUAAAGlCAYAAABa0umuAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+kMCREhJgYRGzgAABKsSURBVHja7d1PbhuJmcbhtxu9lwYGuLVyAionKOYEzRuIhpdctHwC0ydo9oJLw/QJRj5ByBOMdILIWwJGpBPMLFjKGIbTlmNJ/KrqeYBGB0EH7nwk9dNXrD8/pQPmze4kyTTJaZKTQL9cJrn54r+7bv9KkpvVdnRpTAzBT8VjdJxkkeQ3LxUkSa7agN1F67KN1sZoEKXHD9ImydjLBPdy20bq7q9rsUKUHi5KmySNlwgeZLvatKHarLajayNBlL4vSLMk77w88Ggb1ab960KkEKVvR+kyDtvBU/l4F6h2k7oxEkTp/4N0nOSfXho4mG0bKFsUojRvdpMkf/fSQAlXSdYChSgBFQO1bAPlEB+P4mcjAO5pnP0JSP+cN7uLebObGgk2JaCSj9kf3ls7vIdNCTi050leJ/nHvNmt218qQZSAgztL8vd5s9u01xqCKAEH1yR5N2921+LE9/KdEvDY7r53WjprD5sScGh33ztdz5vduXEgSkAFR0l+d1gPUQKqbU533zlNjANRAqrE6e5svRPjQJSACprsr3NatjdkRpQADu637E+GmBmFKAFUcJT9900O6YkSQBl3h/QWRiFKAFW8nje7y3mzOzUKUQKoYJzkf2xNogRQcWs6MQpRAqiyNV06Q0+UAKq4O0Nv7bomUQKo4izJxkkQogRQxbgN08woRAmggrvDeUujECWAKn5r7wTheyZRAiihyf7sPN8ziRJACc+z/55pYhSiBFDBUfbPapoZhSgBVPHO7YlECaCS1/NmtzYGUQKo4kyYRAmgWpgunDIuSgBV/Jr9mXnCJEoAJYyFSZQAhAlRAhAmUQLoSpjWxiBKAFX86nRxUQKoxHVMogRQLkwLYxAlgCpeu4mrKAFU8s5jL0QJoJILDwoUJYAqjtowuYZJlABKeJ7kwhhECaCKxqniogRQyZkz8kQJoJKlEx9ECaCKoyRrJz6IEkAV4yRLYxAlgCp8vyRKAKUs583uxBhECaCCo7h+SZQAChm7o7goAVTy2mniogRQydoIRAmgCofxRAmgFIfxRAmgFBfVihJAGc282Z0bgygBVLFwbzxRAqjiKA7jiRJAIWdOehAlgEpsS6IEUEYzb3ZTYxAlANuSKAHwheeeuyRKAKW2JaeIixJAFUdJXFArSgBlnNuWRAnAtiRKANiWRAnAtiRKANzTzAhECaAK1y2JEkApCyMQJYBK29LEGEQJoAonPIgSQBm/zpvdiTGIEoBtSZQA+MLMCEQJoIojp4eLEkAlnkwrSgBlOOFBlABsS6IEwNfMjECUAKoYz5vdqTGIEoBtSZQA+ILvlUQJoIznDuGJEoBtSZQAEKU/91PFf6l5s/tfLw0wIH9ZbUfXxlB3U/rgpQEGZGIEtaO08NIAA+IQXuUorbajyyRvvDyATUmUqoRpkeQPLxEwAEdODS8epTZM50n+lmTrpQJ6ziG8FD777mvmze44id8k6JtJ+/e79/dJkufGMkjb1XY0ESWg4i9gk/avqUgNx2o7GvzPZFGC+pE6zf7GnbMkRybSa39tT/QSJaATgZplf8mE7amfXq22o+WQB+A2Q9Ahq+1ovdqOTpK8SHJrIr0zGfoARAk6GqfsT4pw2US/DP5kLofvoOPmzW6SZB2H9Priv1bb0Y1NCejq1rRpf8N2z0jbkigBJcJ0s9qOpnE4rw8mogT0JU7n2Z8EQXediBLQpzCthUmURAmoFqZXJtFJjSgBfQzTMsl7k+ieebMb7LYkStDvMM2SXJlE54gS0FvTuPt... (line truncated)" />
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
        
        .logo img {
            height: 40px;
            width: auto;
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
            <div class="logo">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB8QAAAHECAYAAABP6pBcAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nOzdXW4bV7Y/7DqNvpebAK+ljEDMCFwZgdUjkALw7k/AyggsjyAywEsClkcQeQQpjSD0CGLdvgR4rBGcF9vZTGhZH/yoIqv2fh4g6JzT6W56Fz+q9m+vtf7n//7v/woAAMjdqJwdFUVxdG8ZyieW5aF//iHVE//e5/jX38ZV/6l/HgAAAKjBfDgYFEXx4t5/01P7AMFD/5mHTIui+PLEv/8l/jPLPvcm089P/GeADQnEAQBI1qicLR5UX8SH1uLew2v4+4MW//lvlwLzxcP03w/NwnMAAAD4y1LAvbwHsHyYPfz/jzu0XJ+WQvXpA3//pTeZ3g/VgQcIxAEA6KxROVs85C4ecAdLD75tDrrr9mkpKP8Sq9K/jKu+B2MAAACSMB8OFtXb9//1pStc3MR/nS7vD/QmUwfpyV4hEAcAoAuW2pmXS+G3B97VfFoKyUO1+VRQDgAAQBvFKu+jBw6/53TovQk3S0G5sJzsCMQBAGiV2Ob8/l8efOv3aelBeKr9OgAAALsyHw6WD74vwu8utTNPxWJU29+H6LVhJ0UCcQAA9iZWfg+WHoBVfe/XIiSvVJIDAABQhxh+D+49/zv43m7fHKJXTU7XCcQBANiZGICXS38dWv1Wu1uE4+FfVZEDAADwlPlw8GIp9BZ+p+WbQ/QqyekSgTgAAI0RgCfpY3z4rVSQAwAA5C1Wf5dL4be25/m4WwrIK1XktJlAHACAWo3K2Ul8ED4RgCcvPPxex4ff63HV/5L7ggAAAKTsXgDu4Dv33QjIaSOBOAAAW1mqAg8B+CurmbXQPu0qhuOfc18MAACArltqgX4iAGcDN4uD9Fqss08PBuKjcjaIX27hX1+4QiTkS2zhcd80/nvBZxu4APC0GIKH+8Uz7dB4xG186L3SWh0AAKA75sPBIiM68cxPjb7pMtebTHWZY2e+CcTjxmao6HjpEsBXN/FfF4F5+KL+YlMXgBwJwdmCcBwAAKDF5sPByVIIfuBasQOf4l7BtepxmvZ3IB6rwitfdLCy2xiU//2XynLaYCmwKnX5yMJibq+bRhoxKmcv4nfKuRCcmtzGQ7hX7p1YiPcvZ7qUZeHL0v1LI98Bsa3n4n74KPcFZ2WfVSvRVvPhYPEbOXCRWNGXpe8099w8aOmeyfgz2uB2KRw3e5zafQ3E4+bDVBgOW7uLn6Vq8a/jqu9Bmp2IodVFURSvrXiWQkeLc8E4dRmVs8VD8alFpUE3SzPH3TNlKN6/XNmAy9aHeP9S2+d/Phycx3ti+xtsKjzXX/Ym0wsryL7Fas1L83rZ0rvw2+iwD4UQnO64WwrHr1036rAIxK9sdkJjPi2F5DZ7aUTcTK5Ub2Yv3CyWQnE2tVSheWbTjR1bPOxe+g7Lhy5lRJ/i/cvWz0nz4cDeBnX60JtMz6wo+zIfDi4deKdGX39vheJ5EoLTccJxavE//+/l/xc2Pv+0nLAzn5bCca0/qMWonF27oSUKN4kDbYhZR6wGP/M9QkvcxupOBwkTFg/zTR2+Ifo0rvpbtQGeDwfhe+ONBaVm73qT6blFZddii/T3Fp6afexNpicWNR+xy4RnfVKyaKt+ZeY46wqBuBss2J/F6SbV42wsBlm/WUGWfBhXfdUsPCmGUWdxNrhAijZa3CddOOSTnlE5E15y39tx1d+oRfV8OHDQnyb9ZI4luxQrOT/roEJDfKclbj4cDOJz/onvERJ3G8eKhMpxewY8619FURxZJtibg9jSLxxK+d9Q5TsqZ2cxpIBVCT657zS2vobvhPfGqJxdxk22X4XhtNjiPunPUTmrRuWsdLGSouKS+7a5p3U/TJO8v9g1IRZNcg+WoHCQZj4cnM+Hg/Cc/0d8jvI9QuoO477Wn/Ph4Dp2V4FHhQpxJ/O... (line truncated)" alt="Risivo Logo" />
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
