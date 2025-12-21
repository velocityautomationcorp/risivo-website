import { html, raw } from 'hono/html';

export const AdminInvestorContentPage = (admin: any, content: any[] = []) => {
  // Calculate stats
  const stats = {
    total: content.length,
    videos: content.filter(c => c.content_type === 'video').length,
    documents: content.filter(c => c.content_type === 'document').length,
    active: content.filter(c => c.status === 'active').length,
    draft: content.filter(c => c.status === 'draft').length
  };

  return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investor Content Management - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        .container {
            max-width: 1600px !important;
            padding: 0 40px;
        }
        
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            gap: 24px;
            flex-wrap: wrap;
        }

        .page-header h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 8px;
            font-weight: 700;
        }

        .page-header .subtitle {
            color: #666;
            font-size: 16px;
            font-weight: 500;
        }

        .header-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 14px 28px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            color: white !important;
        }

        .btn-primary {
            background: linear-gradient(135deg, #28a745 0%, #218838 100%);
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.25);
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            box-shadow: 0 2px 8px rgba(108, 117, 125, 0.25);
        }

        .btn-secondary:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        .stat-number {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #6b3fea;
        }

        .stat-label {
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .content-table {
            width: 100%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .content-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .content-table th {
            background: #f8f9fa;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e9ecef;
        }

        .content-table td {
            padding: 16px;
            border-bottom: 1px solid #e9ecef;
            color: #666;
            vertical-align: middle;
        }

        .content-table tbody tr:hover {
            background: #f8f9fa;
        }

        .content-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }

        .content-description {
            font-size: 13px;
            color: #999;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .content-icon {
            font-size: 24px;
            margin-right: 12px;
        }

        .type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .type-badge.video {
            background: #e3f2fd;
            color: #1976d2;
        }

        .type-badge.document {
            background: #fff3e0;
            color: #f57c00;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-badge.active {
            background: #d4edda;
            color: #155724;
        }

        .status-badge.draft {
            background: #e9ecef;
            color: #6c757d;
        }

        .visibility-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 600;
            background: #f0f0f0;
            color: #666;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn-action {
            padding: 8px 14px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white !important;
        }

        .btn-edit {
            background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%);
        }

        .btn-delete {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: #999;
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            padding: 24px;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            font-size: 24px;
            color: #333;
            margin: 0;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #999;
        }

        .modal-body {
            padding: 24px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 15px;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #6b3fea;
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .form-help {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
        }

        .modal-footer {
            padding: 24px;
            border-top: 2px solid #e9ecef;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .modal-footer button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            color: white;
        }

        .btn-cancel {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
        }

        .btn-save {
            background: linear-gradient(135deg, #28a745 0%, #218838 100%);
        }

        .btn-save:hover, .btn-cancel:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
            .container {
                padding: 0 20px !important;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }

            .content-table {
                overflow-x: auto;
            }

            .action-buttons {
                flex-direction: column;
            }
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
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        </div>
    </div>

    <div class="container">
        <!-- Page Header -->
        <div class="page-header">
            <div>
                <h1>📂 Investor Content Management</h1>
                <p class="subtitle">Manage documents, videos, and resources for investors</p>
            </div>
            <div class="header-buttons">
                <a href="/updates/admin/dashboard" class="btn btn-secondary">← Back to Dashboard</a>
                <button class="btn btn-primary" onclick="openAddModal()">➕ Add Content</button>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.videos}</div>
                <div class="stat-label">Videos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.documents}</div>
                <div class="stat-label">Documents</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.active}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.draft}</div>
                <div class="stat-label">Draft</div>
            </div>
        </div>

        <!-- Content Table -->
        <div class="content-table" id="contentTable">
            <!-- Table will be populated by JavaScript -->
        </div>
    </div>

    <!-- Add/Edit Content Modal -->
    <div class="modal" id="contentModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Add New Content</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <form id="contentForm">
                    <input type="hidden" id="contentId" name="id">
                    
                    <div class="form-group">
                        <label for="title">Title *</label>
                        <input type="text" id="title" name="title" required placeholder="e.g., Pitch Deck">
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" placeholder="Brief description of this content..."></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="content_type">Content Type *</label>
                            <select id="content_type" name="content_type" required onchange="toggleUrlFields()">
                                <option value="document">Document (PDF, etc.)</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <input type="text" id="category" name="category" placeholder="e.g., Core Documents">
                        </div>
                    </div>

                    <div class="form-group" id="fileUrlGroup">
                        <label for="file_url">Document URL *</label>
                        <input type="url" id="file_url" name="file_url" placeholder="https://drive.google.com/...">
                        <p class="form-help">Direct link to the document (Google Drive, Dropbox, etc.)</p>
                    </div>

                    <div class="form-group" id="videoUrlGroup" style="display: none;">
                        <label for="video_url">Video URL *</label>
                        <input type="url" id="video_url" name="video_url" placeholder="https://youtube.com/... or https://vimeo.com/...">
                        <p class="form-help">YouTube, Vimeo, or direct video link</p>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="icon">Icon (Emoji)</label>
                            <input type="text" id="icon" name="icon" placeholder="📄" maxlength="4">
                        </div>
                        <div class="form-group">
                            <label for="file_format">File Format</label>
                            <input type="text" id="file_format" name="file_format" placeholder="PDF">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="visibility">Visibility *</label>
                            <select id="visibility" name="visibility" required>
                                <option value="active_investors_only">Active Investors Only</option>
                                <option value="nda_signed_only">NDA Signed (incl. pending)</option>
                                <option value="all_investors">All Investors</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="status">Status *</label>
                            <select id="status" name="status" required>
                                <option value="active">Active (Visible)</option>
                                <option value="draft">Draft (Hidden)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="sort_order">Sort Order</label>
                            <input type="number" id="sort_order" name="sort_order" value="0" min="0">
                            <p class="form-help">Lower numbers appear first</p>
                        </div>
                        <div class="form-group">
                            <label for="cta_button_text">Button Text</label>
                            <input type="text" id="cta_button_text" name="cta_button_text" placeholder="Download PDF">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="is_featured" name="is_featured">
                            Featured content (shown prominently)
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="button" class="btn-save" onclick="saveContent()">💾 Save Content</button>
            </div>
        </div>
    </div>

    <script>
        let allContent = ${raw(JSON.stringify(content))};

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            renderContent();
        });

        // Render content table
        function renderContent() {
            const container = document.getElementById('contentTable');

            if (allContent.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3 style="color: #666; margin-bottom: 8px;">No content yet</h3>
                        <p style="color: #999; margin-bottom: 20px;">Add your first investor document or video</p>
                        <button class="btn btn-primary" onclick="openAddModal()">➕ Add Content</button>
                    </div>
                \`;
                return;
            }

            // Sort by sort_order
            const sorted = [...allContent].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

            let tableHTML = \`
                <table>
                    <thead>
                        <tr>
                            <th>Content</th>
                            <th>Type</th>
                            <th>Visibility</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            \`;

            sorted.forEach(item => {
                tableHTML += \`
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center;">
                                <span class="content-icon">\${item.icon || '📄'}</span>
                                <div>
                                    <div class="content-title">\${item.title}</div>
                                    <div class="content-description">\${item.description || '-'}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="type-badge \${item.content_type}">\${item.content_type}</span>
                        </td>
                        <td>
                            <span class="visibility-badge">\${formatVisibility(item.visibility)}</span>
                        </td>
                        <td>
                            <span class="status-badge \${item.status}">\${item.status}</span>
                        </td>
                        <td>\${item.sort_order || 0}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-action btn-edit" onclick="editContent('\${item.id}')">✏️ Edit</button>
                                <button class="btn-action btn-delete" onclick="deleteContent('\${item.id}')">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                \`;
            });

            tableHTML += \`
                    </tbody>
                </table>
            \`;

            container.innerHTML = tableHTML;
        }

        // Format visibility for display
        function formatVisibility(visibility) {
            const map = {
                'active_investors_only': 'Active Only',
                'nda_signed_only': 'NDA Signed',
                'all_investors': 'All Investors'
            };
            return map[visibility] || visibility;
        }

        // Toggle URL fields based on content type
        function toggleUrlFields() {
            const contentType = document.getElementById('content_type').value;
            const fileUrlGroup = document.getElementById('fileUrlGroup');
            const videoUrlGroup = document.getElementById('videoUrlGroup');

            if (contentType === 'video') {
                fileUrlGroup.style.display = 'none';
                videoUrlGroup.style.display = 'block';
                document.getElementById('file_url').required = false;
                document.getElementById('video_url').required = true;
            } else {
                fileUrlGroup.style.display = 'block';
                videoUrlGroup.style.display = 'none';
                document.getElementById('file_url').required = true;
                document.getElementById('video_url').required = false;
            }
        }

        // Open add modal
        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Add New Content';
            document.getElementById('contentForm').reset();
            document.getElementById('contentId').value = '';
            toggleUrlFields();
            document.getElementById('contentModal').classList.add('active');
        }

        // Edit content
        function editContent(contentId) {
            const item = allContent.find(c => c.id === contentId);
            if (!item) return;

            document.getElementById('modalTitle').textContent = 'Edit Content';
            document.getElementById('contentId').value = item.id;
            document.getElementById('title').value = item.title || '';
            document.getElementById('description').value = item.description || '';
            document.getElementById('content_type').value = item.content_type || 'document';
            document.getElementById('category').value = item.category || '';
            document.getElementById('file_url').value = item.file_url || '';
            document.getElementById('video_url').value = item.video_url || '';
            document.getElementById('icon').value = item.icon || '';
            document.getElementById('file_format').value = item.file_format || '';
            document.getElementById('visibility').value = item.visibility || 'active_investors_only';
            document.getElementById('status').value = item.status || 'active';
            document.getElementById('sort_order').value = item.sort_order || 0;
            document.getElementById('cta_button_text').value = item.cta_button_text || '';
            document.getElementById('is_featured').checked = item.is_featured || false;

            toggleUrlFields();
            document.getElementById('contentModal').classList.add('active');
        }

        // Close modal
        function closeModal() {
            document.getElementById('contentModal').classList.remove('active');
        }

        // Save content
        async function saveContent() {
            const form = document.getElementById('contentForm');
            const contentId = document.getElementById('contentId').value;
            const isEdit = !!contentId;

            const data = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                content_type: document.getElementById('content_type').value,
                category: document.getElementById('category').value,
                file_url: document.getElementById('file_url').value || null,
                video_url: document.getElementById('video_url').value || null,
                icon: document.getElementById('icon').value || '📄',
                file_format: document.getElementById('file_format').value || null,
                visibility: document.getElementById('visibility').value,
                status: document.getElementById('status').value,
                sort_order: parseInt(document.getElementById('sort_order').value) || 0,
                cta_button_text: document.getElementById('cta_button_text').value || null,
                is_featured: document.getElementById('is_featured').checked,
                requires_nda: document.getElementById('visibility').value !== 'all_investors',
                show_on_dashboard: true
            };

            // Validation
            if (!data.title) {
                alert('Please enter a title');
                return;
            }

            if (data.content_type === 'video' && !data.video_url) {
                alert('Please enter a video URL');
                return;
            }

            if (data.content_type === 'document' && !data.file_url) {
                alert('Please enter a document URL');
                return;
            }

            try {
                const url = isEdit 
                    ? \`/api/admin/investor-content/\${contentId}\`
                    : '/api/admin/investor-content';
                
                const response = await fetch(url, {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.error || 'Failed to save content');
                }

                alert(isEdit ? '✅ Content updated!' : '✅ Content added!');
                
                // Update local data
                if (isEdit) {
                    const index = allContent.findIndex(c => c.id === contentId);
                    if (index !== -1) {
                        allContent[index] = { ...allContent[index], ...data };
                    }
                } else {
                    allContent.push(result.content);
                }

                closeModal();
                renderContent();

            } catch (error) {
                console.error('Save error:', error);
                alert('❌ Failed to save: ' + error.message);
            }
        }

        // Delete content
        async function deleteContent(contentId) {
            const item = allContent.find(c => c.id === contentId);
            if (!item) return;

            if (!confirm(\`Delete "\${item.title}"? This cannot be undone.\`)) {
                return;
            }

            try {
                const response = await fetch(\`/api/admin/investor-content/\${contentId}\`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.error || 'Failed to delete content');
                }

                alert('✅ Content deleted!');
                
                // Remove from local data
                allContent = allContent.filter(c => c.id !== contentId);
                renderContent();

            } catch (error) {
                console.error('Delete error:', error);
                alert('❌ Failed to delete: ' + error.message);
            }
        }

        // Logout
        async function logout() {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await fetch('/api/admin/logout', { method: 'POST' });
                    window.location.href = '/updates/admin/login';
                } catch (error) {
                    window.location.href = '/updates/admin/login';
                }
            }
        }

        // Close modal on background click
        document.getElementById('contentModal').addEventListener('click', (e) => {
            if (e.target.id === 'contentModal') {
                closeModal();
            }
        });
    </script>
</body>
</html>
`;
};
