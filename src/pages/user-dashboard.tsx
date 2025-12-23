import { html } from 'hono/html';

export const UserDashboardPage = (user: any) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Risivo Updates</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        /* Dashboard-specific styles */
        .filter-tabs {
            display: flex;
            gap: 10px;
        }
        
        .filter-tab {
            padding: 8px 16px;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            color: #666;
            transition: all 0.3s ease;
        }
        
        .filter-tab.active {
            background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
            color: #ffffff;
            border-color: transparent;
        }
        
        .update-category.feature {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .update-category.bugfix {
            background: #fff3e0;
            color: #f57c00;
        }
        
        .update-category.announcement {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .loading {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }
        
        .no-updates {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 15px;
            color: #999;
        }
        
        .featured-post {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 40px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .featured-post:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        
        .featured-image-container {
            position: relative;
            width: 100%;
            height: 500px;
            background: #f5f7fa;
        }
        
        .featured-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .featured-category {
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
        
        .featured-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #333;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        
        .featured-excerpt {
            color: #666;
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 20px;
        }
        
        .section-divider {
            margin: 40px 0 30px 0;
            text-align: center;
        }
        
        .section-divider h3 {
            font-size: 1.3rem;
            color: #333;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            .filter-tabs {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .featured-image-container {
                height: 300px;
            }
            
            .featured-title {
                font-size: 1.8rem;
            }
            
            .featured-excerpt {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <img src="/images/risivo-logo.png" alt="Risivo Logo" />
            </div>
            <div class="user-menu">
                <div class="user-info">
                    <div class="user-name">${user.first_name} ${user.last_name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
                <button class="logout-btn" id="logoutBtn">Logout</button>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="container-lg">
        <div class="welcome-section">
            <h1>👋 Welcome back, ${user.first_name}!</h1>
            <p>Here are the latest development updates from the Risivo team.</p>
        </div>
        
        <div class="section-header">
            <h2>Latest Updates</h2>
            <div class="filter-tabs">
                <button class="filter-tab active" data-filter="all">All</button>
                <button class="filter-tab" data-filter="feature">Features</button>
                <button class="filter-tab" data-filter="bugfix">Bug Fixes</button>
                <button class="filter-tab" data-filter="announcement">Announcements</button>
            </div>
        </div>
        
        <div id="updatesContainer">
            <div class="loading">⏳ Loading updates...</div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        let allUpdates = [];
        let currentFilter = 'all';
        
        // Load updates on page load
        async function loadUpdates() {
            try {
                const response = await fetch('/api/updates/list');
                const data = await response.json();
                
                // DEBUG: Log the API response
                console.log('[DASHBOARD] API Response:', data);
                if (data.updates && data.updates.length > 0) {
                    console.log('[DASHBOARD] First update data:', data.updates[0]);
                    console.log('[DASHBOARD] Fields available:', Object.keys(data.updates[0]));
                }
                
                if (!response.ok) {
                    if (response.status === 401) {
                        // Not authenticated, redirect to login
                        window.location.href = '/updates/login';
                        return;
                    }
                    throw new Error(data.error || 'Failed to load updates');
                }
                
                allUpdates = data.updates || [];
                renderUpdates();
            } catch (error) {
                console.error('Load updates error:', error);
                document.getElementById('updatesContainer').innerHTML = \`
                    <div class="no-updates">
                        ❌ Failed to load updates. Please refresh the page.
                    </div>
                \`;
            }
        }
        
        function renderUpdates() {
            const container = document.getElementById('updatesContainer');
            
            // Filter updates
            const filteredUpdates = currentFilter === 'all' 
                ? allUpdates 
                : allUpdates.filter(u => u.category === currentFilter);
            
            if (filteredUpdates.length === 0) {
                container.innerHTML = \`
                    <div class="no-updates">
                        📭 No updates found in this category yet.
                    </div>
                \`;
                return;
            }
            
            // Separate featured and regular updates
            const featuredUpdate = filteredUpdates.find(u => u.is_featured);
            const regularUpdates = filteredUpdates.filter(u => !u.is_featured);
            
            let html = '';
            
            // Render featured post if exists (Theater mode)
            if (featuredUpdate) {
                const featuredThumbnail = getUpdateThumbnail(featuredUpdate);
                html += \`
                    <div class="featured-post" onclick="viewUpdate('\${featuredUpdate.slug}')">
                        \${featuredThumbnail ? \`
                            <div class="featured-image-container">
                                <div class="featured-badge">⭐ Featured</div>
                                <img src="\${featuredThumbnail}" alt="\${featuredUpdate.title}" onerror="this.style.display='none'">
                            </div>
                        \` : ''}
                        <div class="featured-content">
                            <span class="featured-category \${featuredUpdate.category}">\${featuredUpdate.category}</span>
                            <h2 class="featured-title">\${featuredUpdate.title}</h2>
                            <p class="featured-excerpt">\${featuredUpdate.excerpt || 'Click to read more...'}</p>
                            <div class="featured-meta">
                                <span class="featured-meta-item">👤 \${featuredUpdate.author_name || 'Risivo Team'}</span>
                                <span class="featured-meta-item">👁️ \${featuredUpdate.view_count || featuredUpdate.views_count || 0}</span>
                                <span class="featured-meta-item">👍 \${featuredUpdate.likes_count || 0}</span>
                                <span class="featured-meta-item">💬 \${featuredUpdate.comments_count || 0}</span>
                            </div>
                        </div>
                    </div>
                \`;
                
                // Add section divider if there are regular updates
                if (regularUpdates.length > 0) {
                    html += \`
                        <div class="section-divider">
                            <h3>More Updates</h3>
                        </div>
                    \`;
                }
            }
            
            // Render regular update cards
            if (regularUpdates.length > 0) {
                html += \`
                    <div class="updates-grid">
                        \${regularUpdates.map(update => {
                            const thumbnail = getUpdateThumbnail(update);
                            return \`
                                <div class="update-card" onclick="viewUpdate('\${update.slug}')">
                                    \${thumbnail ? \`
                                        <img src="\${thumbnail}" alt="\${update.title}" class="update-image" onerror="this.outerHTML='<div class=\\"update-image update-placeholder\\">🎬</div>'">
                                    \` : \`
                                        <div class="update-image update-placeholder">🎬</div>
                                    \`}
                                    <div class="update-content">
                                        <span class="update-category \${update.category}">\${update.category}</span>
                                        <h3 class="update-title">\${update.title}</h3>
                                        <p class="update-excerpt">\${update.excerpt || 'Click to read more...'}</p>
                                        <div class="update-meta">
                                            <span class="update-meta-item">👤 \${update.author_name || 'Risivo Team'}</span>
                                            <span class="update-meta-item">👁️ \${update.view_count || update.views_count || 0}</span>
                                            <span class="update-meta-item">👍 \${update.likes_count || 0}</span>
                                            <span class="update-meta-item">💬 \${update.comments_count || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            \`;
                        }).join('')}
                    </div>
                \`;
            }
            
            container.innerHTML = html;
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
        
        function getUpdateThumbnail(update) {
            // Priority 1: Use featured_image_url if set
            if (update.featured_image_url) {
                return update.featured_image_url;
            }
            
            // Priority 2: Generate thumbnail from media_url based on media_type
            if (update.media_url && update.media_type === 'video') {
                const url = update.media_url;
                
                // YouTube thumbnail - extract video ID
                let videoId = null;
                if (url.includes('youtube.com/watch')) {
                    const urlParams = new URLSearchParams(url.split('?')[1]);
                    videoId = urlParams.get('v');
                } else if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1]?.split('?')[0];
                } else if (url.includes('youtube.com/embed/')) {
                    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
                }
                
                if (videoId && videoId.length === 11) {
                    return \`https://img.youtube.com/vi/\${videoId}/maxresdefault.jpg\`;
                }
                
                // Vimeo thumbnail - extract video ID
                if (url.includes('vimeo.com/')) {
                    const vimeoId = url.split('vimeo.com/')[1]?.split('/')[0]?.split('?')[0];
                    if (vimeoId && /^\\d+$/.test(vimeoId)) {
                        // Vimeo requires API call for thumbnail, return null for now
                        return null;
                    }
                }
                
                // Wistia thumbnail - extract media ID
                if (url.includes('wistia.com/medias/')) {
                    const wistiaId = url.split('wistia.com/medias/')[1]?.split('?')[0];
                    if (wistiaId) {
                        return \`https://embed-ssl.wistia.com/deliveries/\${wistiaId}.jpg\`;
                    }
                }
            }
            
            // Priority 3: If media_type is image, use media_url directly
            if (update.media_url && update.media_type === 'image') {
                return update.media_url;
            }
            
            // No thumbnail available
            return null;
        }
        
        function viewUpdate(slug) {
            window.location.href = \`/updates/view/\${slug}\`;
        }
        
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active state
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update filter and re-render
                currentFilter = tab.dataset.filter;
                renderUpdates();
            });
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/user/logout', { method: 'POST' });
                window.location.href = '/updates/login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/updates/login';
            }
        });
        
        // Load updates on page load
        loadUpdates();
    </script>
</body>
</html>
`;
