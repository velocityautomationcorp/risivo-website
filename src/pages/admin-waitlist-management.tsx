import { html, raw } from 'hono/html';

export const AdminWaitlistManagementPage = (admin: any, waitlistUsers: any[] = []) => {
    // Calculate stats
    const stats = {
        total: waitlistUsers.length,
        active: waitlistUsers.filter(u => u.status === 'active').length,
        inactive: waitlistUsers.filter(u => u.status !== 'active').length,
        thisWeek: waitlistUsers.filter(u => {
            const created = new Date(u.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return created >= weekAgo;
        }).length
    };

    // Generate users table
    let usersHTML = '';
    if (waitlistUsers.length > 0) {
        const rows = waitlistUsers.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${(user.first_name?.[0] || user.email[0]).toUpperCase()}</div>
                        <div class="user-details">
                            <div class="user-name">${user.first_name || ''} ${user.last_name || ''}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${user.business_name || '-'}</td>
                <td>
                    <span class="status-badge status-${user.status || 'active'}">
                        ${user.status || 'active'}
                    </span>
                </td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" onclick="viewUser('${user.id}')">👁️ View</button>
                        <button class="btn-icon btn-delete" onclick="deleteUser('${user.id}')">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        usersHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Business</th>
                            <th>Status</th>
                            <th>Joined</th>
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
        usersHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No waitlist subscribers yet.</div>
            </div>
        `;
    }

    return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Wait List - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        .stat-card.total {
            border-top: 4px solid #3b82f6;
        }

        .stat-card.active {
            border-top: 4px solid #10b981;
        }

        .stat-card.inactive {
            border-top: 4px solid #f59e0b;
        }

        .stat-card.week {
            border-top: 4px solid #8b5cf6;
        }

        .stat-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .stat-value {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 5px;
        }

        .stat-card.total .stat-value { color: #3b82f6; }
        .stat-card.active .stat-value { color: #10b981; }
        .stat-card.inactive .stat-value { color: #f59e0b; }
        .stat-card.week .stat-value { color: #8b5cf6; }

        .stat-label {
            color: #666;
            font-size: 14px;
            font-weight: 500;
        }

        .table-container {
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 700px;
        }

        th, td {
            padding: 14px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }

        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
        }

        .user-details .user-name {
            font-weight: 600;
            color: #333;
        }

        .user-details .user-email {
            font-size: 13px;
            color: #666;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: capitalize;
        }

        .status-active {
            background: #d1fae5;
            color: #059669;
        }

        .status-inactive {
            background: #fef3c7;
            color: #d97706;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn-icon {
            padding: 8px 14px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
        }

        .btn-view {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .btn-delete {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .btn-icon:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .section-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .empty-state-text {
            font-size: 18px;
        }

        /* User Details Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #333;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }

        .detail-label {
            font-weight: 600;
            color: #666;
        }

        .detail-value {
            color: #333;
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
        <a href="/updates/admin/dashboard" class="back-link">← Back to Dashboard</a>
        
        <h1 class="page-title">📋 Manage Wait List</h1>
        <p class="page-subtitle">View and manage waitlist subscribers</p>
        
        <!-- Stats -->
        <div class="stats-grid">
            <div class="stat-card total">
                <div class="stat-icon">👥</div>
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total Subscribers</div>
            </div>
            <div class="stat-card active">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${stats.active}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-card inactive">
                <div class="stat-icon">⏸️</div>
                <div class="stat-value">${stats.inactive}</div>
                <div class="stat-label">Inactive</div>
            </div>
            <div class="stat-card week">
                <div class="stat-icon">📅</div>
                <div class="stat-value">${stats.thisWeek}</div>
                <div class="stat-label">This Week</div>
            </div>
        </div>
        
        <!-- Users Table -->
        <div class="section-header">
            <h2 class="section-title">
                <span>👥</span>
                <span>Waitlist Subscribers</span>
            </h2>
        </div>
        ${raw(usersHTML)}
    </div>

    <!-- User Details Modal -->
    <div class="modal" id="userModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">User Details</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div id="userDetails"></div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        const users = ${raw(JSON.stringify(waitlistUsers))};
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                window.location.href = '/updates/admin/login';
            }
        });
        
        // View user details
        function viewUser(id) {
            const user = users.find(u => u.id === id);
            if (!user) return;
            
            const details = \`
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">\${user.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Name</span>
                    <span class="detail-value">\${user.first_name || '-'} \${user.last_name || ''}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Business</span>
                    <span class="detail-value">\${user.business_name || '-'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">\${user.status || 'active'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Joined</span>
                    <span class="detail-value">\${new Date(user.created_at).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Last Login</span>
                    <span class="detail-value">\${user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</span>
                </div>
            \`;
            
            document.getElementById('userDetails').innerHTML = details;
            document.getElementById('userModal').classList.add('active');
        }
        
        function closeModal() {
            document.getElementById('userModal').classList.remove('active');
        }
        
        // Delete user
        async function deleteUser(id) {
            if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
            
            try {
                const response = await fetch(\`/api/admin/waitlist/\${id}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    alert('User deleted successfully!');
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert('Failed to delete user: ' + (error.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting user');
            }
        }
        
        // Close modal on outside click
        document.getElementById('userModal').addEventListener('click', (e) => {
            if (e.target.id === 'userModal') {
                closeModal();
            }
        });
    </script>
</body>
</html>
`;
};
