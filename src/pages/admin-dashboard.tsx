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
                        <button class="btn-icon btn-edit" onclick="editUpdate('${update.slug}')">✏️ Edit</button>
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
                <img src="data:image/png;base64,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\" alt=\"Risivo Logo\">
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
        function editUpdate(slug) {
            window.location.href = \`/updates/admin/edit/\${slug}\`;
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
