import { html, raw } from 'hono/html';

export const AdminSocialAnalyticsPage = (admin: any, analyticsData: any = {}) => {
    const connections = analyticsData.connections || [];
    const posts = analyticsData.posts || [];
    const urlClicks = analyticsData.urlClicks || 0;
    
    // Calculate summary stats
    const totalConnections = connections.length;
    const activeConnections = connections.filter((c: any) => c.is_connected).length;
    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p: any) => p.status === 'posted').length;
    const scheduledPosts = posts.filter((p: any) => p.status === 'scheduled').length;
    
    // Generate mock data for charts (in production, this would come from real analytics)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    
    // Mock engagement data
    const engagementData = [45, 62, 38, 85, 72, 90, 68];
    const clicksData = [12, 18, 8, 25, 20, 32, 15];
    const postsData = [2, 1, 3, 2, 4, 1, 2];

    return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Analytics - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            text-align: center;
            transition: all 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .stat-card.primary {
            background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%);
            color: white;
        }

        .stat-card.success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .stat-card.info {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
        }

        .stat-card.warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
        }

        .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .charts-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        @media (max-width: 768px) {
            .charts-section {
                grid-template-columns: 1fr;
            }
        }

        .chart-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .chart-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .chart-period {
            font-size: 0.85rem;
            color: #666;
            background: #f3f4f6;
            padding: 6px 12px;
            border-radius: 20px;
        }

        .chart-container {
            position: relative;
            height: 300px;
        }

        .platform-breakdown {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .platform-breakdown h3 {
            font-size: 1.2rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .platform-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }

        .platform-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 12px;
            transition: all 0.3s;
        }

        .platform-item:hover {
            background: #e9ecef;
        }

        .platform-item.connected {
            background: #d1fae5;
        }

        .platform-icon {
            font-size: 2rem;
        }

        .platform-info {
            flex: 1;
        }

        .platform-name {
            font-weight: 600;
            color: #333;
        }

        .platform-status {
            font-size: 0.8rem;
            color: #666;
        }

        .platform-stats {
            text-align: right;
        }

        .platform-posts {
            font-size: 1.2rem;
            font-weight: 700;
            color: #6b3fea;
        }

        .platform-posts-label {
            font-size: 0.75rem;
            color: #666;
        }

        .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .insight-card {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .insight-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
        }

        .insight-icon {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
        }

        .insight-icon.blue { background: #dbeafe; }
        .insight-icon.green { background: #d1fae5; }
        .insight-icon.purple { background: #ede9fe; }
        .insight-icon.orange { background: #ffedd5; }

        .insight-title {
            font-weight: 700;
            color: #333;
        }

        .insight-value {
            font-size: 2rem;
            font-weight: 800;
            color: #333;
            margin-bottom: 5px;
        }

        .insight-change {
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .insight-change.positive { color: #10b981; }
        .insight-change.negative { color: #ef4444; }

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

        .quick-actions {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
        }

        .btn-primary {
            background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%);
            color: white;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #333;
        }

        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }

        .empty-state-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }

        .empty-state-text {
            color: #666;
            margin-bottom: 25px;
        }

        .date-filter {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }

        .date-btn {
            padding: 8px 16px;
            border: 2px solid #e9ecef;
            background: white;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .date-btn:hover {
            border-color: #6b3fea;
            color: #6b3fea;
        }

        .date-btn.active {
            background: #6b3fea;
            border-color: #6b3fea;
            color: white;
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
        
        <h1 class="page-title">📊 Social Media Analytics</h1>
        <p class="page-subtitle">Track performance and engagement across all your social platforms</p>

        <!-- Date Filter -->
        <div class="date-filter">
            <button class="date-btn active" data-range="7">Last 7 Days</button>
            <button class="date-btn" data-range="30">Last 30 Days</button>
            <button class="date-btn" data-range="90">Last 90 Days</button>
            <button class="date-btn" data-range="365">Last Year</button>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <a href="/updates/admin/social/connections" class="btn-action btn-primary">
                ⚙️ Manage Connections
            </a>
            <a href="/updates/admin/social/posts" class="btn-action btn-secondary">
                📝 View All Posts
            </a>
            <button class="btn-action btn-secondary" onclick="exportData()">
                📥 Export Data
            </button>
        </div>

        <!-- Summary Stats -->
        <div class="analytics-grid">
            <div class="stat-card primary">
                <div class="stat-icon">🔗</div>
                <div class="stat-value">${activeConnections}</div>
                <div class="stat-label">Connected Accounts</div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">📤</div>
                <div class="stat-value">${publishedPosts}</div>
                <div class="stat-label">Posts Published</div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${scheduledPosts}</div>
                <div class="stat-label">Scheduled Posts</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">🔗</div>
                <div class="stat-value">${urlClicks}</div>
                <div class="stat-label">Link Clicks</div>
            </div>
        </div>

        <!-- Insights Cards -->
        <div class="insights-grid">
            <div class="insight-card">
                <div class="insight-header">
                    <div class="insight-icon blue">👁️</div>
                    <div class="insight-title">Total Reach</div>
                </div>
                <div class="insight-value">12.5K</div>
                <div class="insight-change positive">
                    <span>↑</span> 15% vs last period
                </div>
            </div>
            <div class="insight-card">
                <div class="insight-header">
                    <div class="insight-icon green">💬</div>
                    <div class="insight-title">Engagement Rate</div>
                </div>
                <div class="insight-value">4.8%</div>
                <div class="insight-change positive">
                    <span>↑</span> 0.5% vs last period
                </div>
            </div>
            <div class="insight-card">
                <div class="insight-header">
                    <div class="insight-icon purple">❤️</div>
                    <div class="insight-title">Total Reactions</div>
                </div>
                <div class="insight-value">842</div>
                <div class="insight-change positive">
                    <span>↑</span> 23% vs last period
                </div>
            </div>
            <div class="insight-card">
                <div class="insight-header">
                    <div class="insight-icon orange">🔄</div>
                    <div class="insight-title">Shares</div>
                </div>
                <div class="insight-value">156</div>
                <div class="insight-change negative">
                    <span>↓</span> 5% vs last period
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">📈 Engagement Over Time</div>
                    <div class="chart-period">Last 7 days</div>
                </div>
                <div class="chart-container">
                    <canvas id="engagementChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">🔗 Link Clicks</div>
                    <div class="chart-period">Last 7 days</div>
                </div>
                <div class="chart-container">
                    <canvas id="clicksChart"></canvas>
                </div>
            </div>
        </div>

        <div class="charts-section">
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">📊 Posts by Platform</div>
                    <div class="chart-period">All time</div>
                </div>
                <div class="chart-container">
                    <canvas id="platformChart"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <div class="chart-header">
                    <div class="chart-title">📅 Posting Activity</div>
                    <div class="chart-period">Last 7 days</div>
                </div>
                <div class="chart-container">
                    <canvas id="activityChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Platform Breakdown -->
        <div class="platform-breakdown">
            <h3>🌐 Platform Performance</h3>
            <div class="platform-list">
                <div class="platform-item connected">
                    <div class="platform-icon">📘</div>
                    <div class="platform-info">
                        <div class="platform-name">Facebook</div>
                        <div class="platform-status">● Connected</div>
                    </div>
                    <div class="platform-stats">
                        <div class="platform-posts">24</div>
                        <div class="platform-posts-label">posts</div>
                    </div>
                </div>
                <div class="platform-item connected">
                    <div class="platform-icon">💼</div>
                    <div class="platform-info">
                        <div class="platform-name">LinkedIn</div>
                        <div class="platform-status">● Connected</div>
                    </div>
                    <div class="platform-stats">
                        <div class="platform-posts">18</div>
                        <div class="platform-posts-label">posts</div>
                    </div>
                </div>
                <div class="platform-item">
                    <div class="platform-icon">🐦</div>
                    <div class="platform-info">
                        <div class="platform-name">Twitter/X</div>
                        <div class="platform-status">○ Not connected</div>
                    </div>
                    <div class="platform-stats">
                        <div class="platform-posts">0</div>
                        <div class="platform-posts-label">posts</div>
                    </div>
                </div>
                <div class="platform-item">
                    <div class="platform-icon">📷</div>
                    <div class="platform-info">
                        <div class="platform-name">Instagram</div>
                        <div class="platform-status">○ Not connected</div>
                    </div>
                    <div class="platform-stats">
                        <div class="platform-posts">0</div>
                        <div class="platform-posts-label">posts</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        // Chart.js configuration
        const chartColors = {
            primary: '#6b3fea',
            secondary: '#ed632f',
            success: '#10b981',
            info: '#3b82f6',
            warning: '#f59e0b',
            danger: '#ef4444'
        };

        const labels = ${JSON.stringify(last7Days)};

        // Engagement Chart
        const engagementCtx = document.getElementById('engagementChart').getContext('2d');
        new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Engagement',
                    data: ${JSON.stringify(engagementData)},
                    borderColor: chartColors.primary,
                    backgroundColor: 'rgba(107, 63, 234, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: chartColors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Clicks Chart
        const clicksCtx = document.getElementById('clicksChart').getContext('2d');
        new Chart(clicksCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Clicks',
                    data: ${JSON.stringify(clicksData)},
                    backgroundColor: chartColors.secondary,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Platform Distribution Chart
        const platformCtx = document.getElementById('platformChart').getContext('2d');
        new Chart(platformCtx, {
            type: 'doughnut',
            data: {
                labels: ['Facebook', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube'],
                datasets: [{
                    data: [35, 28, 15, 12, 10],
                    backgroundColor: [
                        '#1877f2',
                        '#0a66c2',
                        '#1da1f2',
                        '#e4405f',
                        '#ff0000'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });

        // Activity Chart
        const activityCtx = document.getElementById('activityChart').getContext('2d');
        new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Posts',
                    data: ${JSON.stringify(postsData)},
                    backgroundColor: chartColors.success,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Date filter buttons
        document.querySelectorAll('.date-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // In production, this would fetch new data based on the selected range
                console.log('Selected range:', btn.dataset.range, 'days');
            });
        });

        // Export data function
        function exportData() {
            alert('Export functionality coming soon! This will download a CSV/PDF report of your analytics.');
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                window.location.href = '/updates/admin/login';
            }
        });
    </script>
</body>
</html>
`;
};
