import { html, raw } from 'hono/html';

export const AdminSocialDashboardPage = (admin: any, data: any = {}) => {
    const { connections = [], posts = [], analytics = {} } = data;
    
    // Group connections by platform
    const platformGroups: Record<string, any[]> = {};
    connections.forEach((conn: any) => {
        const key = conn.platform?.platform_key || 'unknown';
        if (!platformGroups[key]) platformGroups[key] = [];
        platformGroups[key].push(conn);
    });

    // Stats
    const totalConnections = connections.length;
    const connectedCount = connections.filter((c: any) => c.is_connected).length;
    const totalPosts = analytics.posts?.total || 0;
    const scheduledPosts = analytics.posts?.scheduled || 0;
    const postedPosts = analytics.posts?.posted || 0;
    const totalClicks = analytics.urls?.total_clicks || 0;

    // Generate connections HTML
    const connectionsHTML = connections.length > 0 ? connections.map((conn: any) => `
        <div class="connection-card ${conn.is_connected ? 'connected' : 'disconnected'}">
            <div class="connection-header">
                <span class="platform-icon">${conn.platform?.icon || '📱'}</span>
                <div class="connection-info">
                    <div class="connection-name">${conn.connection_name}</div>
                    <div class="platform-name">${conn.platform?.platform_name || 'Unknown'}</div>
                </div>
                <span class="connection-status ${conn.is_connected ? 'status-connected' : 'status-disconnected'}">
                    ${conn.is_connected ? '✅ Connected' : '❌ Disconnected'}
                </span>
            </div>
            <div class="connection-actions">
                <button class="btn-sm btn-test" onclick="testConnection('${conn.id}')">🔄 Test</button>
                <button class="btn-sm btn-edit" onclick="editConnection('${conn.id}')">✏️ Edit</button>
                <button class="btn-sm btn-delete" onclick="deleteConnection('${conn.id}')">🗑️</button>
            </div>
        </div>
    `).join('') : '<div class="empty-state"><p>No connections yet. Add your first social media account!</p></div>';

    // Generate recent posts HTML
    const recentPostsHTML = (analytics.posts?.recent || []).length > 0 ? 
        (analytics.posts.recent || []).map((post: any) => `
            <tr>
                <td class="post-title">${post.update_title || 'Untitled'}</td>
                <td>
                    <span class="badge badge-${post.update_type}">${post.update_type}</span>
                </td>
                <td>
                    ${(post.targets || []).map((t: any) => `
                        <span class="platform-badge" title="${t.connection?.connection_name || ''}">
                            ${t.connection?.platform?.icon || '📱'}
                        </span>
                    `).join('')}
                </td>
                <td>
                    <span class="status-badge status-${post.status}">${post.status}</span>
                </td>
                <td>${new Date(post.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('') : '<tr><td colspan="5" class="text-center">No posts yet</td></tr>';

    return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Dashboard - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        @media (max-width: 1024px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr; }
        }

        .stat-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        .stat-card.primary { border-top: 4px solid #6b3fea; }
        .stat-card.success { border-top: 4px solid #10b981; }
        .stat-card.info { border-top: 4px solid #3b82f6; }
        .stat-card.warning { border-top: 4px solid #f59e0b; }

        .stat-icon { font-size: 32px; margin-bottom: 10px; }
        .stat-value { font-size: 36px; font-weight: 800; margin-bottom: 5px; }
        .stat-card.primary .stat-value { color: #6b3fea; }
        .stat-card.success .stat-value { color: #10b981; }
        .stat-card.info .stat-value { color: #3b82f6; }
        .stat-card.warning .stat-value { color: #f59e0b; }
        .stat-label { color: #666; font-size: 14px; font-weight: 500; }

        /* Quick Actions */
        .quick-actions {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 40px;
        }

        .btn-action {
            padding: 14px 24px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: white;
            text-decoration: none;
            transition: all 0.3s;
        }

        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-primary { background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%); }
        .btn-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .btn-info { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }

        /* Connections Section */
        .section {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e9ecef;
        }

        .section-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Connection Cards */
        .connections-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }

        .connection-card {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 16px;
            transition: all 0.3s;
        }

        .connection-card.connected {
            border-color: #d1fae5;
            background: #f0fdf4;
        }

        .connection-card.disconnected {
            border-color: #fee2e2;
            background: #fef2f2;
        }

        .connection-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .platform-icon {
            font-size: 28px;
        }

        .connection-info {
            flex: 1;
        }

        .connection-name {
            font-weight: 600;
            color: #333;
        }

        .platform-name {
            font-size: 13px;
            color: #666;
        }

        .connection-status {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
        }

        .status-connected {
            background: #d1fae5;
            color: #059669;
        }

        .status-disconnected {
            background: #fee2e2;
            color: #dc2626;
        }

        .connection-actions {
            display: flex;
            gap: 8px;
        }

        .btn-sm {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-test { background: #e0e7ff; color: #4338ca; }
        .btn-edit { background: #fef3c7; color: #d97706; }
        .btn-delete { background: #fee2e2; color: #dc2626; }

        .btn-sm:hover { transform: scale(1.05); }

        /* Posts Table */
        .table-container {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }

        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }

        .post-title {
            font-weight: 500;
            max-width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-waitlist { background: #dbeafe; color: #2563eb; }
        .badge-investor { background: #d1fae5; color: #059669; }

        .platform-badge {
            display: inline-block;
            font-size: 16px;
            margin-right: 4px;
        }

        .status-badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
        }

        .status-pending { background: #fef3c7; color: #d97706; }
        .status-scheduled { background: #dbeafe; color: #2563eb; }
        .status-posting { background: #e0e7ff; color: #4338ca; }
        .status-posted { background: #d1fae5; color: #059669; }
        .status-failed { background: #fee2e2; color: #dc2626; }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #6b3fea;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .back-link:hover { text-decoration: underline; }

        .text-center { text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <img src="/images/risivo-logo.png" style="height: 40px" alt="Risivo Logo">
            </div>
            <div class="user-menu">
                <div class="admin-badge">🔒 ADMIN</div>
                <div class="user-info">
                    <div class="user-name">${admin.full_name || 'Admin User'}</div>
                    <div class="user-email">${admin.email}</div>
                </div>
                <button class="logout-btn" id="logoutBtn">Logout</button>
            </div>
        </div>
    </div>
    
    <div class="container">
        <a href="/updates/admin/dashboard" class="back-link">← Back to Dashboard</a>
        
        <h1 class="page-title">📱 Social Media Management</h1>
        <p class="page-subtitle">Manage your social media connections and posts</p>
        
        <!-- Stats -->
        <div class="stats-grid">
            <div class="stat-card primary">
                <div class="stat-icon">🔗</div>
                <div class="stat-value">${connectedCount}/${totalConnections}</div>
                <div class="stat-label">Connected Accounts</div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">📤</div>
                <div class="stat-value">${postedPosts}</div>
                <div class="stat-label">Posts Published</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${scheduledPosts}</div>
                <div class="stat-label">Scheduled Posts</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">🔗</div>
                <div class="stat-value">${totalClicks}</div>
                <div class="stat-label">Link Clicks</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <a href="/updates/admin/social/connections" class="btn-action btn-primary">
                <span>⚙️</span>
                <span>Manage Connections</span>
            </a>
            <a href="/updates/admin/social/posts" class="btn-action btn-success">
                <span>📋</span>
                <span>View All Posts</span>
            </a>
            <a href="/updates/admin/social/analytics" class="btn-action btn-info">
                <span>📊</span>
                <span>Analytics</span>
            </a>
        </div>

        <!-- Connected Accounts -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">
                    <span>🔗</span>
                    <span>Connected Accounts</span>
                </h2>
                <a href="/updates/admin/social/connections" class="btn-action btn-primary" style="padding: 10px 16px; font-size: 13px;">
                    <span>➕</span>
                    <span>Add Connection</span>
                </a>
            </div>
            <div class="connections-grid">
                ${raw(connectionsHTML)}
            </div>
        </div>

        <!-- Recent Posts -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">
                    <span>📤</span>
                    <span>Recent Social Posts</span>
                </h2>
                <a href="/updates/admin/social/posts" class="btn-action btn-info" style="padding: 10px 16px; font-size: 13px;">
                    <span>📄</span>
                    <span>View All</span>
                </a>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Update</th>
                            <th>Type</th>
                            <th>Platforms</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${raw(recentPostsHTML)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                window.location.href = '/updates/admin/login';
            }
        });

        // Test connection
        async function testConnection(id) {
            try {
                const response = await fetch(\`/api/admin/social/connections/\${id}/test\`, {
                    method: 'POST'
                });
                const data = await response.json();
                
                if (data.is_valid) {
                    alert('✅ Connection is working!');
                } else {
                    alert('❌ Connection test failed: ' + (data.message || 'Unknown error'));
                }
                
                window.location.reload();
            } catch (error) {
                alert('Error testing connection');
            }
        }

        // Edit connection
        function editConnection(id) {
            window.location.href = \`/updates/admin/social/connections/edit/\${id}\`;
        }

        // Delete connection
        async function deleteConnection(id) {
            if (!confirm('Are you sure you want to delete this connection?')) return;
            
            try {
                const response = await fetch(\`/api/admin/social/connections/\${id}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    alert('Connection deleted!');
                    window.location.reload();
                } else {
                    alert('Failed to delete connection');
                }
            } catch (error) {
                alert('Error deleting connection');
            }
        }
    </script>
</body>
</html>
`;
};
