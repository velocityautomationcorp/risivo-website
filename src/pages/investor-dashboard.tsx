import { html } from 'hono/html';

export const InvestorDashboardPage = (userData?: any) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investor Dashboard - Risivo</title>
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
            max-width: 1400px;
            margin: 0 auto;
        }

        .dashboard-header {
            background: white;
            border-radius: 16px;
            padding: 40px 30px 30px 30px;
            margin-bottom: 30px;
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
        }

        .content-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
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

        .btn-access:hover {
            opacity: 0.9;
            transform: translateY(-2px);
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

        .updates-section {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .update-item {
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
            transition: background 0.2s;
        }

        .update-item:last-child {
            border-bottom: none;
        }

        .update-item:hover {
            background: #f8f9fa;
        }

        .update-date {
            color: #667eea;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .update-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }

        .update-description {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
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
                    <h1>Welcome to Investor Portal</h1>
                    <p>Logged in as <span class="user-email" id="userEmail">Loading...</span></p>
                </div>
            </div>

            <!-- Status Badges (Centered) -->
            <div class="status-badges">
                <span class="investor-badge">🔐 Verified Investor</span>
                <span class="nda-status">✅ NDA Signed</span>
            </div>
        </div>

        <!-- Exclusive Content Cards -->
        <h2 class="section-title" style="color: white; margin-bottom: 24px;">
            📂 Exclusive Investor Content
        </h2>
        
        <div class="content-grid">
            <!-- Pitch Deck -->
            <div class="content-card">
                <div class="card-icon">📊</div>
                <h3 class="card-title">Pitch Deck</h3>
                <p class="card-description">
                    Comprehensive presentation covering our vision, market opportunity, business model, and growth strategy.
                </p>
                <div class="card-meta">
                    <span>📄 PDF Document</span>
                    <span>Updated: Dec 2025</span>
                </div>
                <button class="btn-access" onclick="accessContent('pitch-deck')">
                    📥 Download Pitch Deck
                </button>
            </div>

            <!-- Financial Forecast -->
            <div class="content-card">
                <div class="card-icon">💰</div>
                <h3 class="card-title">Financial Forecast</h3>
                <p class="card-description">
                    Detailed 5-year financial projections including revenue, expenses, profitability, and cash flow analysis.
                </p>
                <div class="card-meta">
                    <span>📊 Excel File</span>
                    <span>Updated: Dec 2025</span>
                </div>
                <button class="btn-access" onclick="accessContent('financial-forecast')">
                    📥 Download Financials
                </button>
            </div>

            <!-- Business Plan -->
            <div class="content-card">
                <div class="card-icon">📈</div>
                <h3 class="card-title">Business Plan</h3>
                <p class="card-description">
                    Complete business plan outlining our strategy, market analysis, competitive landscape, and execution roadmap.
                </p>
                <div class="card-meta">
                    <span>📄 PDF Document</span>
                    <span>Updated: Dec 2025</span>
                </div>
                <button class="btn-access" onclick="accessContent('business-plan')">
                    📥 Download Business Plan
                </button>
            </div>

            <!-- Investment Overview -->
            <div class="content-card">
                <div class="card-icon">🎯</div>
                <h3 class="card-title">Investment Overview</h3>
                <p class="card-description">
                    Investment opportunity summary including terms, equity structure, use of funds, and expected returns.
                </p>
                <div class="card-meta">
                    <span>📄 PDF Document</span>
                    <span>Updated: Dec 2025</span>
                </div>
                <button class="btn-access" onclick="accessContent('investment-overview')">
                    📥 Download Overview
                </button>
            </div>

            <!-- Product Roadmap -->
            <div class="content-card">
                <div class="card-icon">🗺️</div>
                <h3 class="card-title">Product Roadmap</h3>
                <p class="card-description">
                    Detailed product development timeline showing planned features, milestones, and release schedule.
                </p>
                <div class="card-meta">
                    <span>📄 PDF Document</span>
                    <span>Updated: Dec 2025</span>
                </div>
                <button class="btn-access" onclick="accessContent('product-roadmap')">
                    📥 Download Roadmap
                </button>
            </div>

            <!-- Founder Video -->
            <div class="content-card">
                <div class="card-icon">🎥</div>
                <h3 class="card-title">Founder Message</h3>
                <p class="card-description">
                    Personal message from the founder discussing vision, mission, and why now is the right time to invest.
                </p>
                <div class="card-meta">
                    <span>🎬 Video</span>
                    <span>Duration: 8 min</span>
                </div>
                <button class="btn-access" onclick="accessContent('founder-video')">
                    ▶️ Watch Video
                </button>
            </div>
        </div>

        <!-- Updates Feed -->
        <div class="updates-section">
            <h2 class="section-title">
                📢 Latest Updates
            </h2>
            
            <div id="updatesContainer">
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3 style="color: #666; margin-bottom: 8px;">No updates yet</h3>
                    <p style="color: #999;">Check back soon for the latest news and announcements</p>
                </div>
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

        // Load user data
        async function loadUserData() {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('userEmail').textContent = data.email;
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        }

        // Access content
        function accessContent(contentType) {
            alert('📥 Download link will be provided here.\\n\\nContent: ' + contentType + '\\n\\nPlease upload your investor documents to enable downloads.');
            
            // TODO: Implement actual download logic
            // Example: window.open('/api/investor/download/' + contentType, '_blank');
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

        // Load data on page load
        loadUserData();
    </script>
</body>
</html>
`;
