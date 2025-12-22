import { html, raw } from 'hono/html';

export const AdminDashboardPage = (admin: any, updates: any[] = [], subscriberStats?: any) => {
    const stats = {
        total: updates.length,
        published: updates.filter(u => u.status === 'published').length,
        draft: updates.filter(u => u.status === 'draft').length,
        totalViews: updates.reduce((sum, u) => sum + (u.view_count || 0), 0)
    };
    
    // Subscriber stats with defaults
    const subStats = subscriberStats || {
        totalSubscribers: 0,
        waitlistCount: 0,
        pendingInvestors: 0,
        awaitingNda: 0,
        approvedInvestors: 0
    };
    
    // Generate updates table HTML
    let updatesHTML = '';
    if (updates.length > 0) {
        const rows = updates.map(update => `
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
                        <button class="btn-icon btn-edit" onclick="editUpdate('${update.id}')">✏️ Edit</button>
                        <button class="btn-icon btn-delete" onclick="deleteUpdate('${update.id}')">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        updatesHTML = `
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
        updatesHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No updates yet. Create your first one!</div>
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

        .btn-primary {
            padding: 14px 28px;
            background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(107, 63, 234, 0.4);
        }
        
        .btn-secondary {
            padding: 14px 28px;
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white !important;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-left: 12px;
            box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        .btn-secondary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(108, 117, 125, 0.5);
        }
        
        .btn-secondary span {
            color: white !important;
            font-weight: 700;
        }

        /* Subscriber Overview Section */
        .subscriber-section {
            margin-bottom: 40px;
        }

        .subscriber-section h2 {
            font-size: 1.5rem;
            color: #333;
            margin-bottom: 20px;
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

        .subscriber-card.total .sub-value {
            color: #6b3fea;
        }

        .subscriber-card.waitlist .sub-value {
            color: #3b82f6;
        }

        .subscriber-card.pending .sub-value {
            color: #f59e0b;
        }

        .subscriber-card.awaiting-nda .sub-value {
            color: #8b5cf6;
        }

        .subscriber-card.approved .sub-value {
            color: #10b981;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <img src="/images/risivo-logo.png" style="height: 40px" alt=\"Risivo Logo\">
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
        
        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-label">Total Updates</div>
                <div class="stat-value">${stats.total}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-label">Published</div>
                <div class="stat-value">${stats.published}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✏️</div>
                <div class="stat-label">Drafts</div>
                <div class="stat-value">${stats.draft}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👁️</div>
                <div class="stat-label">Total Views</div>
                <div class="stat-value">${stats.totalViews}</div>
            </div>
        </div>

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
        <div class="actions-section">
            <h2 class="actions-title">Quick Actions</h2>
            <button class="btn-primary" onclick="window.location.href='/updates/admin/create'">
                <span>➕</span>
                <span>Create New Update</span>
            </button>
            <button class="btn-secondary" onclick="window.location.href='/updates/admin/investors'">
                <span>👥</span>
                <span>Manage Investors</span>
            </button>
            <button class="btn-secondary" onclick="window.location.href='/updates/admin/investor-content'">
                <span>📂</span>
                <span>Manage Investor Content</span>
            </button>
        </div>
        
        <!-- Updates List -->
        <div class="updates-section">
            <div class="section-header">
                <h2 class="section-title">Recent Updates</h2>
            </div>
            ${raw(updatesHTML)}
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
        
        // Edit update
        function editUpdate(id) {
            window.location.href = \`/updates/admin/edit/\${id}\`;
        }
        
        // Delete update
        async function deleteUpdate(id) {
            if (!confirm('Are you sure you want to delete this update?')) return;
            
            try {
                const response = await fetch(\`/api/admin/updates/\${id}\`, {
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
