import { html } from 'hono/html';

export const UserDashboardPage = (user: any) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Risivo Updates</title>
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.75rem;
            font-weight: 800;
        }
        
        .user-menu {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .user-info {
            text-align: right;
        }
        
        .user-name {
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .user-email {
            font-size: 0.8rem;
            opacity: 0.9;
        }
        
        .logout-btn {
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        /* Main Container */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .welcome-section {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .welcome-section h1 {
            font-size: 2rem;
            color: #333;
            margin-bottom: 10px;
        }
        
        .welcome-section p {
            color: #666;
            font-size: 1rem;
        }
        
        /* Updates Section */
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .section-header h2 {
            font-size: 1.5rem;
            color: #333;
        }
        
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: transparent;
        }
        
        .updates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
        }
        
        .update-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .update-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .update-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .update-content {
            padding: 25px;
        }
        
        .update-category {
            display: inline-block;
            padding: 5px 12px;
            background: #f0f0f0;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 12px;
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
        
        .update-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
            line-height: 1.3;
        }
        
        .update-excerpt {
            color: #666;
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .update-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #f0f0f0;
        }
        
        .update-author {
            font-size: 0.85rem;
            color: #999;
        }
        
        .update-date {
            font-size: 0.85rem;
            color: #999;
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
        
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .user-info {
                text-align: center;
            }
            
            .updates-grid {
                grid-template-columns: 1fr;
            }
            
            .filter-tabs {
                flex-wrap: wrap;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-content">
            <div class="logo">RISIVO</div>
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
    <div class="container">
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
    
    <script>
        let allUpdates = [];
        let currentFilter = 'all';
        
        // Load updates on page load
        async function loadUpdates() {
            try {
                const response = await fetch('/api/updates/list');
                const data = await response.json();
                
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
            
            // Render update cards
            container.innerHTML = \`
                <div class="updates-grid">
                    \${filteredUpdates.map(update => \`
                        <div class="update-card" onclick="viewUpdate('\${update.slug}')">
                            \${update.featured_image_url ? \`
                                <img src="\${update.featured_image_url}" alt="\${update.title}" class="update-image">
                            \` : \`
                                <div class="update-image"></div>
                            \`}
                            <div class="update-content">
                                <span class="update-category \${update.category}">\${update.category}</span>
                                <h3 class="update-title">\${update.title}</h3>
                                <p class="update-excerpt">\${update.excerpt || 'Click to read more...'}</p>
                                <div class="update-meta">
                                    <span class="update-author">\${update.author_name}</span>
                                    <span class="update-date">\${formatDate(update.published_at)}</span>
                                </div>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
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
