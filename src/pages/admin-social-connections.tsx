import { html, raw } from 'hono/html';

// Default platforms (fallback if database doesn't have them)
const DEFAULT_PLATFORMS = [
    { id: '1', platform_key: 'facebook_page', platform_name: 'Facebook Page', icon: '📘', color: '#1877f2', requires_video: false, sort_order: 1 },
    { id: '2', platform_key: 'facebook_group', platform_name: 'Facebook Group', icon: '👥', color: '#1877f2', requires_video: false, sort_order: 2 },
    { id: '3', platform_key: 'linkedin_company', platform_name: 'LinkedIn Company Page', icon: '💼', color: '#0a66c2', requires_video: false, sort_order: 3 },
    { id: '4', platform_key: 'linkedin_profile', platform_name: 'LinkedIn Profile', icon: '👤', color: '#0a66c2', requires_video: false, sort_order: 4 },
    { id: '5', platform_key: 'linkedin_group', platform_name: 'LinkedIn Group', icon: '👥', color: '#0a66c2', requires_video: false, sort_order: 5 },
    { id: '6', platform_key: 'twitter', platform_name: 'Twitter/X', icon: '🐦', color: '#1da1f2', requires_video: false, sort_order: 6 },
    { id: '7', platform_key: 'instagram', platform_name: 'Instagram', icon: '📷', color: '#e4405f', requires_video: false, sort_order: 7 },
    { id: '8', platform_key: 'youtube', platform_name: 'YouTube', icon: '🎬', color: '#ff0000', requires_video: true, sort_order: 8 },
    { id: '9', platform_key: 'pinterest', platform_name: 'Pinterest', icon: '📌', color: '#bd081c', requires_video: false, sort_order: 9 },
    { id: '10', platform_key: 'tiktok', platform_name: 'TikTok', icon: '🎵', color: '#000000', requires_video: true, sort_order: 10 }
];

export const AdminSocialConnectionsPage = (admin: any, platforms: any[] = [], connections: any[] = []) => {
    // Use default platforms if none provided from database
    const platformsList = platforms.length > 0 ? platforms : DEFAULT_PLATFORMS;
    
    // Generate platform cards
    const platformsHTML = platformsList.map(platform => {
        const platformConnections = connections.filter(c => c.platform_id === platform.id);
        const hasConnection = platformConnections.length > 0;
        const isConnected = platformConnections.some(c => c.is_connected);

        return `
            <div class="platform-card ${isConnected ? 'connected' : ''}" data-platform="${platform.platform_key}">
                <div class="platform-header">
                    <span class="platform-icon" style="color: ${platform.color}">${platform.icon}</span>
                    <div class="platform-info">
                        <div class="platform-name">${platform.platform_name}</div>
                        ${platform.requires_video ? '<span class="video-badge">📹 Video Only</span>' : ''}
                    </div>
                    <span class="platform-status ${isConnected ? 'status-on' : 'status-off'}">
                        ${isConnected ? '● Connected' : '○ Not Connected'}
                    </span>
                </div>
                
                ${platformConnections.length > 0 ? `
                    <div class="platform-connections">
                        ${platformConnections.map(conn => `
                            <div class="connection-item ${conn.is_connected ? 'active' : 'inactive'}">
                                <div class="connection-details">
                                    <span class="connection-name">${conn.connection_name}</span>
                                    <span class="connection-account">${conn.account_name || conn.account_id || ''}</span>
                                </div>
                                <div class="connection-actions">
                                    <button class="btn-mini btn-edit" onclick="editConnection('${conn.id}')">✏️</button>
                                    <button class="btn-mini btn-delete" onclick="deleteConnection('${conn.id}')">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <button class="btn-add-connection" onclick="openModal('${platform.id}', '${platform.platform_key}', '${platform.platform_name}')">
                    ➕ Add ${platform.platform_name} Connection
                </button>
            </div>
        `;
    }).join('');

    return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Connections - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        .platforms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }

        .platform-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 16px;
            padding: 20px;
            transition: all 0.3s;
        }

        .platform-card.connected {
            border-color: #d1fae5;
        }

        .platform-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e9ecef;
        }

        .platform-icon {
            font-size: 36px;
        }

        .platform-info {
            flex: 1;
        }

        .platform-name {
            font-size: 18px;
            font-weight: 700;
            color: #333;
        }

        .video-badge {
            font-size: 11px;
            background: #fef3c7;
            color: #d97706;
            padding: 2px 8px;
            border-radius: 10px;
        }

        .platform-status {
            font-size: 12px;
            font-weight: 600;
        }

        .status-on { color: #10b981; }
        .status-off { color: #9ca3af; }

        .platform-connections {
            margin-bottom: 16px;
        }

        .connection-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 8px;
        }

        .connection-item.active {
            background: #d1fae5;
        }

        .connection-item.inactive {
            background: #fee2e2;
        }

        .connection-details {
            display: flex;
            flex-direction: column;
        }

        .connection-name {
            font-weight: 600;
            color: #333;
        }

        .connection-account {
            font-size: 12px;
            color: #666;
        }

        .connection-actions {
            display: flex;
            gap: 6px;
        }

        .btn-mini {
            padding: 6px 10px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-edit { background: #fef3c7; }
        .btn-delete { background: #fee2e2; }
        .btn-mini:hover { transform: scale(1.1); }

        .btn-add-connection {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-add-connection:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(107, 63, 234, 0.4);
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .modal.active { display: flex; }

        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .modal-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }

        .form-label .required { color: #dc3545; }

        .form-input, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 15px;
            transition: border-color 0.3s;
        }

        .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: #6b3fea;
        }

        .form-hint {
            font-size: 12px;
            color: #666;
            margin-top: 6px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        @media (max-width: 600px) {
            .form-row { grid-template-columns: 1fr; }
        }

        .btn-save {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
        }

        .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(107, 63, 234, 0.4);
        }

        .credentials-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
        }

        .credentials-title {
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .help-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #6b3fea;
            text-decoration: none;
            font-size: 13px;
            margin-top: 10px;
        }

        .help-link:hover { text-decoration: underline; }

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

        .section-info {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 30px;
        }

        .section-info p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
        }
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
        <a href="/updates/admin/social" class="back-link">← Back to Social Dashboard</a>
        
        <h1 class="page-title">⚙️ Social Media Connections</h1>
        <p class="page-subtitle">Connect your social media accounts to enable auto-posting</p>
        
        <div class="section-info">
            <p>💡 <strong>Tip:</strong> You need to create developer apps on each platform to get API credentials. Click "Setup Guide" on each platform for instructions.</p>
        </div>

        <div class="platforms-grid">
            ${raw(platformsHTML)}
        </div>
    </div>

    <!-- Add/Edit Connection Modal -->
    <div class="modal" id="connectionModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="modalTitle">
                    <span id="modalIcon">📱</span>
                    <span id="modalPlatformName">Add Connection</span>
                </h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            
            <form id="connectionForm" onsubmit="saveConnection(event)">
                <input type="hidden" id="connectionId" value="">
                <input type="hidden" id="platformId" value="">
                <input type="hidden" id="platformKey" value="">
                
                <div class="form-group">
                    <label class="form-label">Connection Name <span class="required">*</span></label>
                    <input type="text" id="connectionName" class="form-input" required 
                           placeholder="e.g., Risivo Official Page">
                    <div class="form-hint">A friendly name to identify this connection</div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Account/Page ID</label>
                        <input type="text" id="accountId" class="form-input" 
                               placeholder="Platform-specific ID">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Account Name</label>
                        <input type="text" id="accountName" class="form-input" 
                               placeholder="Display name">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Account URL</label>
                    <input type="url" id="accountUrl" class="form-input" 
                           placeholder="https://...">
                </div>
                
                <div class="credentials-section">
                    <div class="credentials-title">🔐 API Credentials</div>
                    
                    <div class="form-group">
                        <label class="form-label">Access Token</label>
                        <input type="password" id="accessToken" class="form-input" 
                               placeholder="Your access token">
                        <div class="form-hint">OAuth access token from the platform</div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">API Key</label>
                            <input type="password" id="apiKey" class="form-input" 
                                   placeholder="API Key (if required)">
                        </div>
                        <div class="form-group">
                            <label class="form-label">API Secret</label>
                            <input type="password" id="apiSecret" class="form-input" 
                                   placeholder="API Secret (if required)">
                        </div>
                    </div>
                    
                    <a href="#" class="help-link" id="setupGuideLink" target="_blank">
                        📖 View Setup Guide for this platform
                    </a>
                </div>
                
                <button type="submit" class="btn-save">💾 Save Connection</button>
            </form>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        const connections = ${raw(JSON.stringify(connections))};
        let editingId = null;
        
        const setupGuides = {
            'facebook_page': 'https://developers.facebook.com/docs/pages-api/getting-started',
            'facebook_group': 'https://developers.facebook.com/docs/groups-api',
            'linkedin_company': 'https://learn.microsoft.com/en-us/linkedin/marketing/getting-started',
            'linkedin_profile': 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow',
            'linkedin_group': 'https://learn.microsoft.com/en-us/linkedin/marketing/',
            'twitter': 'https://developer.twitter.com/en/docs/twitter-api',
            'instagram': 'https://developers.facebook.com/docs/instagram-basic-display-api',
            'youtube': 'https://developers.google.com/youtube/v3/getting-started',
            'pinterest': 'https://developers.pinterest.com/docs/getting-started/introduction/',
            'tiktok': 'https://developers.tiktok.com/doc/content-posting-api/'
        };
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                window.location.href = '/updates/admin/login';
            }
        });
        
        // Open modal
        function openModal(platformId, platformKey, platformName) {
            editingId = null;
            document.getElementById('modalPlatformName').textContent = 'Add ' + platformName;
            document.getElementById('connectionId').value = '';
            document.getElementById('platformId').value = platformId;
            document.getElementById('platformKey').value = platformKey;
            document.getElementById('connectionName').value = '';
            document.getElementById('accountId').value = '';
            document.getElementById('accountName').value = '';
            document.getElementById('accountUrl').value = '';
            document.getElementById('accessToken').value = '';
            document.getElementById('apiKey').value = '';
            document.getElementById('apiSecret').value = '';
            
            const guideLink = setupGuides[platformKey] || '#';
            document.getElementById('setupGuideLink').href = guideLink;
            
            document.getElementById('connectionModal').classList.add('active');
        }
        
        function closeModal() {
            document.getElementById('connectionModal').classList.remove('active');
            editingId = null;
        }
        
        // Edit connection
        function editConnection(id) {
            const conn = connections.find(c => c.id === id);
            if (!conn) return;
            
            editingId = id;
            document.getElementById('modalPlatformName').textContent = 'Edit Connection';
            document.getElementById('connectionId').value = conn.id;
            document.getElementById('platformId').value = conn.platform_id;
            document.getElementById('platformKey').value = conn.platform?.platform_key || '';
            document.getElementById('connectionName').value = conn.connection_name || '';
            document.getElementById('accountId').value = conn.account_id || '';
            document.getElementById('accountName').value = conn.account_name || '';
            document.getElementById('accountUrl').value = conn.account_url || '';
            document.getElementById('accessToken').value = '';  // Don't show existing token
            document.getElementById('apiKey').value = '';
            document.getElementById('apiSecret').value = '';
            
            const platformKey = conn.platform?.platform_key;
            const guideLink = setupGuides[platformKey] || '#';
            document.getElementById('setupGuideLink').href = guideLink;
            
            document.getElementById('connectionModal').classList.add('active');
        }
        
        // Save connection
        async function saveConnection(event) {
            event.preventDefault();
            
            const connectionName = document.getElementById('connectionName').value.trim();
            if (!connectionName) {
                alert('Connection name is required');
                return;
            }
            
            const data = {
                platform_key: document.getElementById('platformKey').value,
                connection_name: connectionName,
                account_id: document.getElementById('accountId').value.trim() || null,
                account_name: document.getElementById('accountName').value.trim() || null,
                account_url: document.getElementById('accountUrl').value.trim() || null
            };
            
            // Only include credentials if they were entered
            const accessToken = document.getElementById('accessToken').value.trim();
            const apiKey = document.getElementById('apiKey').value.trim();
            const apiSecret = document.getElementById('apiSecret').value.trim();
            
            if (accessToken) data.access_token = accessToken;
            if (apiKey) data.api_key = apiKey;
            if (apiSecret) data.api_secret = apiSecret;
            
            try {
                const url = editingId 
                    ? \`/api/admin/social/connections/\${editingId}\`
                    : '/api/admin/social/connections';
                    
                const response = await fetch(url, {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert(editingId ? 'Connection updated!' : 'Connection created!');
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.error || 'Failed to save connection'));
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Error saving connection');
            }
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
        
        // Close modal on outside click
        document.getElementById('connectionModal').addEventListener('click', (e) => {
            if (e.target.id === 'connectionModal') {
                closeModal();
            }
        });
    </script>
</body>
</html>
`;
};
