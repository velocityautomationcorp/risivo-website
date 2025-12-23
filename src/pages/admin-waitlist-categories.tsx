import { html, raw } from 'hono/html';

export const AdminWaitlistCategoriesPage = (admin: any, categories: any[] = []) => {
    // Generate categories list HTML
    let categoriesHTML = '';
    if (categories.length > 0) {
        const rows = categories.map(cat => `
            <tr>
                <td>
                    <div class="category-info">
                        <span class="category-icon">${cat.icon || '📋'}</span>
                        <span class="category-name">${cat.name}</span>
                    </div>
                </td>
                <td><code>${cat.slug}</code></td>
                <td>
                    <span class="color-badge" style="background-color: ${cat.color || '#6c757d'}"></span>
                    <code>${cat.color || '#6c757d'}</code>
                </td>
                <td>${cat.sort_order || 0}</td>
                <td>
                    <span class="status-badge status-${cat.is_active ? 'active' : 'inactive'}">
                        ${cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editCategory('${cat.id}')">✏️ Edit</button>
                        <button class="btn-icon btn-delete" onclick="deleteCategory('${cat.id}')">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        categoriesHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Slug</th>
                            <th>Color</th>
                            <th>Order</th>
                            <th>Status</th>
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
        categoriesHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No categories yet. Create your first one!</div>
            </div>
        `;
    }

    return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waitlist Categories - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
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

        .category-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .category-icon {
            font-size: 20px;
        }

        .category-name {
            font-weight: 600;
            color: #333;
        }

        code {
            background: #f1f3f5;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 13px;
            color: #495057;
        }

        .color-badge {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            vertical-align: middle;
            margin-right: 8px;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
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

        .btn-edit {
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

        .btn-primary {
            padding: 12px 24px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
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

        /* Modal Styles */
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
            margin-bottom: 25px;
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

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 15px;
            transition: border-color 0.3s;
        }

        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .btn-save {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
        }

        .btn-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .checkbox-group input {
            width: 20px;
            height: 20px;
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
        
        <h1 class="page-title">🏷️ Waitlist Categories</h1>
        <p class="page-subtitle">Manage categories for waitlist updates</p>
        
        <div class="section-header">
            <h2 class="section-title">
                <span>📋</span>
                <span>All Categories</span>
            </h2>
            <button class="btn-primary" onclick="openModal()">
                <span>➕</span>
                <span>Add Category</span>
            </button>
        </div>
        
        ${raw(categoriesHTML)}
    </div>

    <!-- Category Modal -->
    <div class="modal" id="categoryModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="modalTitle">Add Category</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <form id="categoryForm" onsubmit="saveCategory(event)">
                <input type="hidden" id="categoryId" name="id">
                
                <div class="form-group">
                    <label class="form-label">Category Name *</label>
                    <input type="text" id="categoryName" name="name" class="form-input" required placeholder="e.g., Feature Update">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Icon</label>
                        <input type="text" id="categoryIcon" name="icon" class="form-input" placeholder="e.g., ✨">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Color</label>
                        <input type="color" id="categoryColor" name="color" class="form-input" value="#3b82f6">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" id="categoryDescription" name="description" class="form-input" placeholder="Optional description">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Sort Order</label>
                        <input type="number" id="categorySortOrder" name="sort_order" class="form-input" value="0" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="checkbox-group" style="margin-top: 12px;">
                            <input type="checkbox" id="categoryActive" name="is_active" checked>
                            <label for="categoryActive">Active</label>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="btn-save">Save Category</button>
            </form>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        const categories = ${raw(JSON.stringify(categories))};
        let editingId = null;
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                window.location.href = '/updates/admin/login';
            }
        });
        
        // Open modal for new category
        function openModal(category = null) {
            editingId = category ? category.id : null;
            document.getElementById('modalTitle').textContent = category ? 'Edit Category' : 'Add Category';
            
            document.getElementById('categoryId').value = category?.id || '';
            document.getElementById('categoryName').value = category?.name || '';
            document.getElementById('categoryIcon').value = category?.icon || '📋';
            document.getElementById('categoryColor').value = category?.color || '#3b82f6';
            document.getElementById('categoryDescription').value = category?.description || '';
            document.getElementById('categorySortOrder').value = category?.sort_order || 0;
            document.getElementById('categoryActive').checked = category?.is_active !== false;
            
            document.getElementById('categoryModal').classList.add('active');
        }
        
        function closeModal() {
            document.getElementById('categoryModal').classList.remove('active');
            editingId = null;
        }
        
        // Edit category
        function editCategory(id) {
            const category = categories.find(c => c.id === id);
            if (category) {
                openModal(category);
            }
        }
        
        // Save category
        async function saveCategory(event) {
            event.preventDefault();
            
            const name = document.getElementById('categoryName').value.trim();
            if (!name) {
                alert('Category name is required');
                return;
            }
            
            const data = {
                name,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                icon: document.getElementById('categoryIcon').value || '📋',
                color: document.getElementById('categoryColor').value,
                description: document.getElementById('categoryDescription').value,
                sort_order: parseInt(document.getElementById('categorySortOrder').value) || 0,
                is_active: document.getElementById('categoryActive').checked
            };
            
            try {
                const url = editingId 
                    ? \`/api/admin/waitlist-categories/\${editingId}\`
                    : '/api/admin/waitlist-categories';
                    
                const response = await fetch(url, {
                    method: editingId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert(editingId ? 'Category updated!' : 'Category created!');
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.error || 'Failed to save category'));
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Error saving category');
            }
        }
        
        // Delete category
        async function deleteCategory(id) {
            if (!confirm('Are you sure you want to delete this category?')) return;
            
            try {
                const response = await fetch(\`/api/admin/waitlist-categories/\${id}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    alert('Category deleted!');
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.error || 'Failed to delete category'));
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting category');
            }
        }
        
        // Close modal on outside click
        document.getElementById('categoryModal').addEventListener('click', (e) => {
            if (e.target.id === 'categoryModal') {
                closeModal();
            }
        });
    </script>
</body>
</html>
`;
};
