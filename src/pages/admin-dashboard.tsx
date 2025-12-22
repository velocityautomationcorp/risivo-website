import { html, raw } from 'hono/html';

export const AdminDashboardPage = (admin: any, waitlistUpdates: any[] = [], investorUpdates: any[] = [], subscriberStats?: any) => {
    // Waitlist updates stats
    const waitlistStats = {
        total: waitlistUpdates.length,
        published: waitlistUpdates.filter(u => u.status === 'published').length,
        draft: waitlistUpdates.filter(u => u.status === 'draft').length,
        totalViews: waitlistUpdates.reduce((sum, u) => sum + (u.view_count || 0), 0)
    };
    
    // Investor updates stats
    const investorStats = {
        total: investorUpdates.length,
        published: investorUpdates.filter(u => u.status === 'published').length,
        draft: investorUpdates.filter(u => u.status === 'draft').length,
        totalViews: investorUpdates.reduce((sum, u) => sum + (u.view_count || 0), 0)
    };
    
    // Subscriber stats with defaults
    const subStats = subscriberStats || {
        totalSubscribers: 0,
        waitlistCount: 0,
        pendingInvestors: 0,
        awaitingNda: 0,
        approvedInvestors: 0
    };
    
    // Generate waitlist updates table HTML
    let waitlistUpdatesHTML = '';
    if (waitlistUpdates.length > 0) {
        const rows = waitlistUpdates.slice(0, 5).map(update => `
            <tr>
                <td>
                    <div class="update-title">${update.title}</div>
                </td>
                <td>
                    <span class="status-badge status-${update.status}">
                        ${update.status}
                    </span>
                </td>
                <td>${update.category || 'General'}</td>
                <td>${update.view_count || 0}</td>
                <td>${new Date(update.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editWaitlistUpdate('${update.id}')">✏️ Edit</button>
                        <button class="btn-icon btn-delete" onclick="deleteWaitlistUpdate('${update.id}')">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        waitlistUpdatesHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Views</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        waitlistUpdatesHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No waitlist updates yet. Create your first one!</div>
            </div>
        `;
    }

    // Generate investor updates table HTML
    let investorUpdatesHTML = '';
    if (investorUpdates.length > 0) {
        const rows = investorUpdates.slice(0, 5).map(update => `
            <tr>
                <td>
                    <div class="update-title">${update.title}</div>
                </td>
                <td>
                    <span class="status-badge status-${update.status}">
                        ${update.status}
                    </span>
                </td>
                <td>${update.category || 'General'}</td>
                <td>${update.view_count || 0}</td>
                <td>${new Date(update.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editInvestorUpdate('${update.id}')">✏️ Edit</button>
                        <button class="btn-icon btn-delete" onclick="deleteInvestorUpdate('${update.id}')">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        investorUpdatesHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Views</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        investorUpdatesHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No investor updates yet. Create your first one!</div>
            </div>
        `;
    }

    return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Risivo Updates Platform</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        /* Admin Dashboard - Page-specific styles */
        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        /* Fix table layout */
        .table-container {
            overflow-x: auto;
            margin-top: 20px;
        }
        
        .table-container table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
        }
        
        .table-container th,
        .table-container td {
            padding: 12px;
            text-align: left;
            white-space: nowrap;
        }
        
        .table-container th:first-child,
        .table-container td:first-child {
            min-width: 250px;
            white-space: normal;
        }
        
        .table-container th:last-child,
        .table-container td:last-child {
            min-width: 180px;
        }
        
        .action-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: nowrap;
        }

        .btn-icon {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-icon:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .btn-edit {
            background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%);
        }

        .btn-delete {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .btn-action {
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: white;
            text-decoration: none;
        }

        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .btn-waitlist-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .btn-waitlist-secondary {
            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
        }

        .btn-investor-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .btn-investor-secondary {
            background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
        }

        .btn-manage {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
        }

        /* Section spacing */
        .dashboard-section {
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .dashboard-section:last-of-type {
            border-bottom: none;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .section-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #333;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        /* Subscriber Overview Section */
        .subscriber-section {
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .subscriber-section h2 {
            font-size: 1.5rem;
            color: #333;
            margin-bottom: 25px;
            font-weight: 700;
        }

        .subscriber-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
        }

        @media (max-width: 1200px) {
            .subscriber-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .subscriber-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .section-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .section-actions {
                width: 100%;
            }
            .btn-action {
                flex: 1;
                justify-content: center;
                font-size: 13px;
                padding: 10px 15px;
            }
        }

        @media (max-width: 480px) {
            .subscriber-grid {
                grid-template-columns: 1fr;
            }
        }

        .subscriber-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
            border-left: 4px solid #6b3fea;
        }

        .subscriber-card.total {
            border-left-color: #6b3fea;
            background: linear-gradient(135deg, #f8f5ff 0%, #ffffff 100%);
        }

        .subscriber-card.waitlist {
            border-left-color: #3b82f6;
        }

        .subscriber-card.pending {
            border-left-color: #f59e0b;
        }

        .subscriber-card.awaiting-nda {
            border-left-color: #8b5cf6;
        }

        .subscriber-card.approved {
            border-left-color: #10b981;
        }

        .subscriber-card .sub-icon {
            font-size: 28px;
            margin-bottom: 8px;
        }

        .subscriber-card .sub-value {
            font-size: 32px;
            font-weight: 800;
            color: #333;
            margin-bottom: 4px;
        }

        .subscriber-card .sub-label {
            font-size: 13px;
            color: #666;
            font-weight: 500;
        }

        .subscriber-card.total .sub-value { color: #6b3fea; }
        .subscriber-card.waitlist .sub-value { color: #3b82f6; }
        .subscriber-card.pending .sub-value { color: #f59e0b; }
        .subscriber-card.awaiting-nda .sub-value { color: #8b5cf6; }
        .subscriber-card.approved .sub-value { color: #10b981; }

        /* Mini stats for update sections */
        .mini-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .mini-stat {
            background: #f8f9fa;
            padding: 12px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mini-stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #333;
        }

        .mini-stat-label {
            font-size: 13px;
            color: #666;
        }

        /* Quick Actions Section */
        .quick-actions-section {
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .quick-actions-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
        }

        @media (max-width: 768px) {
            .quick-actions-grid {
                grid-template-columns: 1fr;
            }
        }

        .action-group {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .action-group-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .action-group.waitlist {
            border-top: 4px solid #3b82f6;
        }

        .action-group.waitlist .action-group-title {
            color: #2563eb;
        }

        .action-group.investor {
            border-top: 4px solid #10b981;
        }

        .action-group.investor .action-group-title {
            color: #059669;
        }

        .action-buttons-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .action-buttons-grid .btn-action {
            width: 100%;
            justify-content: flex-start;
        }

        /* Update section styling */
        .updates-section {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .updates-section.waitlist {
            border-top: 4px solid #3b82f6;
        }

        .updates-section.investor {
            border-top: 4px solid #10b981;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .empty-state-text {
            font-size: 16px;
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
        <h1 class="page-title">📊 Admin Dashboard</h1>
        <p class="page-subtitle">Manage and monitor your updates platform</p>
        
        <!-- Platform Subscribers Overview -->
        <div class="subscriber-section">
            <h2>👥 Platform Subscribers Overview</h2>
            <div class="subscriber-grid">
                <div class="subscriber-card total">
                    <div class="sub-icon">📊</div>
                    <div class="sub-value">${subStats.totalSubscribers}</div>
                    <div class="sub-label">Total Subscribers</div>
                </div>
                <div class="subscriber-card waitlist">
                    <div class="sub-icon">📝</div>
                    <div class="sub-value">${subStats.waitlistCount}</div>
                    <div class="sub-label">Waitlist Subscribers</div>
                </div>
                <div class="subscriber-card pending">
                    <div class="sub-icon">⏳</div>
                    <div class="sub-value">${subStats.pendingInvestors}</div>
                    <div class="sub-label">Pending Investors</div>
                </div>
                <div class="subscriber-card awaiting-nda">
                    <div class="sub-icon">📜</div>
                    <div class="sub-value">${subStats.awaitingNda}</div>
                    <div class="sub-label">Awaiting NDA</div>
                </div>
                <div class="subscriber-card approved">
                    <div class="sub-icon">✅</div>
                    <div class="sub-value">${subStats.approvedInvestors}</div>
                    <div class="sub-label">Approved Investors</div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
            <h2 style="font-size: 1.5rem; color: #333; margin-bottom: 25px; font-weight: 700;">⚡ Quick Actions</h2>
            <div class="quick-actions-grid">
                <!-- Waitlist Actions -->
                <div class="action-group waitlist">
                    <div class="action-group-title">
                        <span>📋</span>
                        <span>Waitlist Management</span>
                    </div>
                    <div class="action-buttons-grid">
                        <a href="/updates/admin/waitlist" class="btn-action btn-waitlist-primary">
                            <span>👥</span>
                            <span>Manage Wait List</span>
                        </a>
                        <a href="/updates/admin/waitlist/create" class="btn-action btn-waitlist-secondary">
                            <span>➕</span>
                            <span>Create Wait List Update</span>
                        </a>
                        <a href="/updates/admin/waitlist/categories" class="btn-action btn-manage">
                            <span>🏷️</span>
                            <span>Manage Categories</span>
                        </a>
                    </div>
                </div>

                <!-- Investor Actions -->
                <div class="action-group investor">
                    <div class="action-group-title">
                        <span>💼</span>
                        <span>Investor Management</span>
                    </div>
                    <div class="action-buttons-grid">
                        <a href="/updates/admin/investors" class="btn-action btn-investor-primary">
                            <span>👥</span>
                            <span>Manage Investors</span>
                        </a>
                        <a href="/updates/admin/investor-updates/create" class="btn-action btn-investor-secondary">
                            <span>➕</span>
                            <span>Create Investor Update</span>
                        </a>
                        <a href="/updates/admin/investor-updates/categories" class="btn-action btn-manage">
                            <span>🏷️</span>
                            <span>Manage Categories</span>
                        </a>
                        <a href="/updates/admin/investor-content" class="btn-action btn-manage">
                            <span>📂</span>
                            <span>Manage Investor Content</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Recent Wait List Updates -->
        <div class="updates-section waitlist">
            <div class="section-header">
                <h2 class="section-title">
                    <span>📋</span>
                    <span>Recent Wait List Updates</span>
                </h2>
                <div class="section-actions">
                    <a href="/updates/admin/waitlist/create" class="btn-action btn-waitlist-primary">
                        <span>➕</span>
                        <span>New Update</span>
                    </a>
                    <a href="/updates/admin/waitlist/all" class="btn-action btn-manage">
                        <span>📄</span>
                        <span>View All</span>
                    </a>
                </div>
            </div>
            <div class="mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-value">${waitlistStats.total}</span>
                    <span class="mini-stat-label">Total</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-value">${waitlistStats.published}</span>
                    <span class="mini-stat-label">Published</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-value">${waitlistStats.draft}</span>
                    <span class="mini-stat-label">Drafts</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-value">${waitlistStats.totalViews}</span>
                    <span class="mini-stat-label">Views</span>
                </div>
            </div>
            ${raw(waitlistUpdatesHTML)}
        </div>

        <!-- Recent Investor Updates -->
        <div class="updates-section investor">
            <div class="section-header">
                <h2 class="section-title">
                    <span>💼</span>
                    <span>Recent Investor Updates</span>
                </h2>
                <div class="section-actions">
                    <a href="/updates/admin/investor-updates/create" class="btn-action btn-investor-primary">
                        <span>➕</span>
                        <span>New Update</span>
                    </a>
                    <a href="/updates/admin/investor-updates/all" class="btn-action btn-manage">
                        <span>📄</span>
                        <span>View All</span>
                    </a>
                </div>
            </div>
            <div class="mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-value">${investorStats.total}</span>
                    <span class="mini-stat-label">Total</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-value">${investorStats.published}</span>
                    <span class="mini-stat-label">Published</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-value">${investorStats.draft}</span>
                    <span class="mini-stat-label">Drafts</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-value">${investorStats.totalViews}</span>
                    <span class="mini-stat-label">Views</span>
                </div>
            </div>
            ${raw(investorUpdatesHTML)}
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/updates/admin/login';
            }
        });
        
        // Edit waitlist update
        function editWaitlistUpdate(id) {
            window.location.href = \`/updates/admin/waitlist/edit/\${id}\`;
        }
        
        // Delete waitlist update
        async function deleteWaitlistUpdate(id) {
            if (!confirm('Are you sure you want to delete this update?')) return;
            
            try {
                const response = await fetch(\`/api/admin/waitlist-updates/\${id}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    alert('Update deleted successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to delete update');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting update');
            }
        }

        // Edit investor update
        function editInvestorUpdate(id) {
            window.location.href = \`/updates/admin/investor-updates/edit/\${id}\`;
        }
        
        // Delete investor update
        async function deleteInvestorUpdate(id) {
            if (!confirm('Are you sure you want to delete this update?')) return;
            
            try {
                const response = await fetch(\`/api/admin/investor-updates/\${id}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    alert('Update deleted successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to delete update');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting update');
            }
        }
    </script>
</body>
</html>
`;
};
