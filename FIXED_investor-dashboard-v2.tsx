import { html } from 'hono/html';

export const InvestorDashboardPageV2 = (userData?: any) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investor Dashboard - Risivo</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .dashboard-container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 0 40px;
        }
        
        @media (max-width: 899px) {
            .dashboard-container {
                padding: 0 20px;
            }
        }

        .dashboard-header {
            background: white;
            border-radius: 16px;
            padding: 40px 30px 30px 30px;
            margin-bottom: 60px;  /* Increased spacing */
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            position: relative;
        }

        .logout-btn-container {
            position: absolute;
            top: 20px;
            right: 30px;
        }

        .header-content {
            text-align: center;
            margin-bottom: 24px;
        }

        .logo {
            width: 140px;
            height: auto;
            margin: 0 auto 16px auto;
            display: block;
        }

        .welcome-text h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 8px;
            font-weight: 700;
        }

        .welcome-text p {
            color: #666;
            font-size: 16px;
            font-weight: 500;
        }

        .user-email {
            color: #667eea;
            font-weight: 600;
        }

        .investor-badge {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #333;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 700;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .nda-status {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .status-badges {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .status-alert {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }

        .status-alert.pending {
            background: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }

        .status-alert h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .status-alert p {
            font-size: 14px;
            line-height: 1.6;
        }

        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
            margin-bottom: 30px;
        }

        .content-card {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            position: relative;
        }

        .content-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .content-card.locked {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .content-card.locked:hover {
            transform: none;
        }

        .lock-overlay {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .card-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 20px;
        }

        .card-title {
            font-size: 20px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }

        .card-description {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .card-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #999;
            margin-bottom: 16px;
        }

        .btn-access {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-access:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-2px);
        }

        .btn-access:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .btn-logout {
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-logout:hover {
            background: #c82333;
        }

        .loading {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 16px;
            color: #999;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        footer {
            text-align: center;
            color: white;
            padding: 20px;
            font-size: 14px;
            opacity: 0.9;
        }

        @media (max-width: 768px) {
            .logout-btn-container {
                position: static;
                text-align: center;
                margin-bottom: 20px;
            }

            .logo {
                width: 100px;
            }

            .content-grid {
                grid-template-columns: 1fr;
            }

            .welcome-text h1 {
                font-size: 24px;
            }

            .welcome-text p {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Header -->
        <div class="dashboard-header">
            <!-- Logout Button (Top Right) -->
            <div class="logout-btn-container">
                <button class="btn-logout" onclick="logout()">🚪 Logout</button>
            </div>

            <!-- Centered Logo and Welcome Text -->
            <div class="header-content">
                <img src="/risivo-logo.png" alt="Risivo Logo" class="logo">
                <div class="welcome-text">
                    <h1 id="welcomeTitle">Welcome to Investor Portal</h1>
                    <p>Logged in as <span class="user-email" id="userEmail">Loading...</span></p>
                </div>
            </div>

            <!-- Status Badges (Centered) -->
            <div class="status-badges" id="statusBadges">
                <span class="investor-badge">🔐 Verified Investor</span>
            </div>
        </div>

        <!-- Status Alert (for pending approval) -->
        <div id="statusAlert" style="display: none;"></div>

        <!-- Exclusive Content Cards -->
        <h2 class="section-title" style="color: white; margin-bottom: 24px;">
            📂 Exclusive Investor Content
        </h2>
        
        <div id="contentGrid" class="content-grid">
            <div class="loading">
                ⏳ Loading investor content...
            </div>
        </div>

        <!-- Footer -->
        <footer>
            <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved. | Confidential Investor Content</p>
        </footer>
    </div>

    <script>
        // Set current year dynamically
        document.getElementById('copyrightYear').textContent = new Date().getFullYear();

        let userData = null;
        let contentData = [];

        // Load investor content and user data
        async function loadDashboard() {
            try {
                const response = await fetch('/api/auth/investor/content');
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Failed to load content');
                }

                userData = data.user;
                contentData = data.content;

                // Update UI with user data
                document.getElementById('userEmail').textContent = userData.email;
                document.getElementById('welcomeTitle').textContent = \`Welcome back, \${userData.first_name}!\`;

                // Show status alert if pending
                if (userData.investor_status === 'nda_signed') {
                    showStatusAlert(data.status_message);
                }

                // Update status badges
                updateStatusBadges(userData);

                // Render content cards
                renderContent(contentData, userData.investor_status);

            } catch (error) {
                console.error('Failed to load dashboard:', error);
                document.getElementById('contentGrid').innerHTML = \`
                    <div class="empty-state">
                        <div class="empty-state-icon">❌</div>
                        <h3 style="color: white; margin-bottom: 8px;">Failed to load content</h3>
                        <p style="color: rgba(255,255,255,0.8);">Please refresh the page or contact support</p>
                    </div>
                \`;
            }
        }

        // Show status alert for pending approval
        function showStatusAlert(message) {
            const alertDiv = document.getElementById('statusAlert');
            alertDiv.innerHTML = \`
                <div class="status-alert pending">
                    <h3>⏳ Application Under Review</h3>
                    <p>\${message}</p>
                    <p style="margin-top: 8px;">Some content may be locked until your account is approved.</p>
                </div>
            \`;
            alertDiv.style.display = 'block';
        }

        // Update status badges
        function updateStatusBadges(user) {
            const badgesContainer = document.getElementById('statusBadges');
            let badgesHTML = '<span class="investor-badge">🔐 Verified Investor</span>';

            if (user.investor_status === 'nda_signed') {
                badgesHTML += '<span class="nda-status" style="background: #fff3cd; border-color: #ffc107; color: #856404;">⏳ Pending Approval</span>';
            } else if (user.investor_status === 'active') {
                badgesHTML += '<span class="nda-status">✅ NDA Signed & Approved</span>';
            }

            if (user.investor_tier && user.investor_tier !== 'prospective') {
                badgesHTML += \`<span class="investor-badge" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);">👑 \${formatTier(user.investor_tier)}</span>\`;
            }

            badgesContainer.innerHTML = badgesHTML;
        }

        // Format tier name
        function formatTier(tier) {
            return tier.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        // Render content cards
        function renderContent(content, investorStatus) {
            const container = document.getElementById('contentGrid');

            if (content.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3 style="color: white; margin-bottom: 8px;">No content available yet</h3>
                        <p style="color: rgba(255,255,255,0.8);">Check back soon for exclusive investor materials</p>
                    </div>
                \`;
                return;
            }

            // Sort content: featured first, then by sort_order
            const sortedContent = [...content].sort((a, b) => {
                if (a.is_featured && !b.is_featured) return -1;
                if (!a.is_featured && b.is_featured) return 1;
                return a.sort_order - b.sort_order;
            });

            let cardsHTML = '';
            for (const item of sortedContent) {
                const isLocked = investorStatus === 'nda_signed' && item.visibility === 'active_investors_only';
                cardsHTML += createContentCard(item, isLocked);
            }

            container.innerHTML = cardsHTML;
        }

        // Create content card HTML
        function createContentCard(item, isLocked) {
            const ctaText = item.cta_button_text || (item.content_type === 'video' ? 'Watch Video' : 'Download');
            const fileTypeIcon = getFileTypeIcon(item.content_type, item.file_format);
            const formattedDate = item.updated_at ? formatDate(item.updated_at) : 'Recently added';

            return \`
                <div class="content-card \${isLocked ? 'locked' : ''}" onclick="accessContent('\${item.id}', '\${item.content_type}', \${isLocked})">
                    \${isLocked ? '<div class="lock-overlay">🔒 Locked</div>' : ''}
                    <div class="card-icon">\${item.icon || '📄'}</div>
                    <h3 class="card-title">\${item.title}</h3>
                    <p class="card-description">\${item.description || 'Exclusive content for investors'}</p>
                    <div class="card-meta">
                        <span>\${fileTypeIcon} \${item.file_format || item.content_type}</span>
                        <span>Updated: \${formattedDate}</span>
                    </div>
                    <button class="btn-access" \${isLocked ? 'disabled' : ''}>
                        \${isLocked ? '🔒 Awaiting Approval' : ctaText}
                    </button>
                </div>
            \`;
        }

        // Get file type icon
        function getFileTypeIcon(contentType, fileFormat) {
            if (contentType === 'video') return '🎬';
            if (fileFormat === 'PDF' || contentType === 'document') return '📄';
            if (fileFormat === 'XLSX' || fileFormat === 'XLS') return '📊';
            if (fileFormat === 'PPTX' || fileFormat === 'PPT') return '📊';
            return '📄';
        }

        // Format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return \`\${month} \${year}\`;
        }

        // Access content
        async function accessContent(contentId, contentType, isLocked) {
            if (isLocked) {
                alert('🔒 This content is locked.\\n\\nYour account is awaiting admin approval. You will have full access within 1 business day.');
                return;
            }

            try {
                const actionType = contentType === 'video' ? 'view' : 'download';
                const response = await fetch(\`/api/auth/investor/content/\${contentId}/access?action=\${actionType}\`);
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Failed to access content');
                }

                // Open content in new tab
                window.open(data.content_url, '_blank');
                
            } catch (error) {
                console.error('Access error:', error);
                alert('❌ Failed to access content: ' + error.message);
            }
        }

        // Logout
        async function logout() {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/updates/login';
                } catch (error) {
                    console.error('Logout error:', error);
                    window.location.href = '/updates/login';
                }
            }
        }

        // Load dashboard on page load
        loadDashboard();
    </script>
</body>
</html>
`;
