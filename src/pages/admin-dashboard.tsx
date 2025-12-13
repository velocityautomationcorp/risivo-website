import { html, raw } from 'hono/html';

export const AdminDashboardPage = (admin: any, updates: any[] = []) => {
    const stats = {
        total: updates.length,
        published: updates.filter(u => u.status === 'published').length,
        draft: updates.filter(u => u.status === 'draft').length,
        totalViews: updates.reduce((sum, u) => sum + (u.view_count || 0), 0)
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
    <link rel="icon" type="image/png" href="data:image/png;base64,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">
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo img {
            height: 45px;
            width: auto;
        }
        
        .user-menu {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .admin-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
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
            margin-top: 2px;
        }
        
        .logout-btn {
            padding: 10px 24px;
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
            transform: translateY(-1px);
        }
        
        /* Main Content */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .page-title {
            font-size: 2rem;
            color: #2d3748;
            margin-bottom: 10px;
        }
        
        .page-subtitle {
            color: #718096;
            font-size: 1.05rem;
            margin-bottom: 40px;
        }
        
        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: white;
            padding: 28px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transform: translateY(-4px);
        }
        
        .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 12px;
        }
        
        .stat-label {
            font-size: 0.85rem;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2d3748;
        }
        
        /* Actions Section */
        .actions-section {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            margin-bottom: 40px;
        }
        
        .actions-title {
            font-size: 1.4rem;
            color: #2d3748;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .btn-primary {
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
        }
        
        /* Updates Table */
        .updates-section {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        
        .section-title {
            font-size: 1.4rem;
            color: #2d3748;
            font-weight: 600;
        }
        
        .table-container {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background: #f7fafc;
        }
        
        th {
            padding: 16px;
            text-align: left;
            font-size: 0.85rem;
            font-weight: 600;
            color: #4a5568;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        td {
            padding: 18px 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #2d3748;
        }
        
        tbody tr:hover {
            background: #f7fafc;
        }
        
        .status-badge {
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-published {
            background: #c6f6d5;
            color: #22543d;
        }
        
        .status-draft {
            background: #fed7d7;
            color: #742a2a;
        }
        
        .update-title {
            font-weight: 600;
            color: #2d3748;
            max-width: 400px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
        }
        
        .btn-icon {
            padding: 8px 14px;
            background: #edf2f7;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }
        
        .btn-icon:hover {
            background: #e2e8f0;
            transform: translateY(-1px);
        }
        
        .btn-edit:hover {
            background: #bee3f8;
        }
        
        .btn-delete:hover {
            background: #fed7d7;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #a0aec0;
        }
        
        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .empty-state-text {
            font-size: 1.2rem;
            color: #718096;
        }
        
        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .header-content {
                flex-direction: column;
                gap: 20px;
            }
            
            .user-menu {
                flex-direction: column;
                width: 100%;
            }
            
            .table-container {
                overflow-x: scroll;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <img src="data:image/png;base64,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" alt=\"Risivo Logo\">
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
        
        <!-- Quick Actions -->
        <div class="actions-section">
            <h2 class="actions-title">Quick Actions</h2>
            <button class="btn-primary" onclick="window.location.href='/updates/admin/create'">
                <span>➕</span>
                <span>Create New Update</span>
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
