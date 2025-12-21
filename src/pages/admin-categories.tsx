/**
 * Admin Category Management Page
 * CRUD operations for update categories
 */

import { html } from 'hono/html';

interface AdminCategoriesPageProps {
  admin: any;
  categories: any[];
}

export const AdminCategoriesPage = ({ admin, categories }: AdminCategoriesPageProps) => {
  return html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Categories - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
  </head>
  <body>
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1>📂 Category Management</h1>
      </div>
      <div class="header-right">
        <span>Admin: ${admin.email}</span>
        <a href="/updates/admin/dashboard" class="back-btn">← Dashboard</a>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Categories</h2>
          <button class="btn" onclick="openCreateModal()">+ Add Category</button>
        </div>

        <div class="categories-grid" id="categoriesList">
          ${categories.length === 0 ? html`
            <div class="empty-state">
              <h3>No categories yet</h3>
              <p>Click "Add Category" to create your first category</p>
            </div>
          ` : categories.map(cat => html`
            <div class="category-item">
              <div class="category-info">
                <div class="category-color" style="background: ${cat.color}"></div>
                <div class="category-details">
                  <div class="category-name">${cat.name}</div>
                  ${cat.description ? html`<div class="category-description">${cat.description}</div>` : ''}
                </div>
              </div>
              <div class="category-meta">
                <span class="status-badge ${cat.is_active ? 'status-active' : 'status-inactive'}">
                  ${cat.is_active ? 'Active' : 'Inactive'}
                </span>
                <div class="category-actions">
                  <button class="icon-btn" onclick="editCategory('${cat.id}')">✏️ Edit</button>
                  <button class="icon-btn" onclick="deleteCategory('${cat.id}', '${cat.name}')">🗑️ Delete</button>
                </div>
              </div>
            </div>
          `)}
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal" id="categoryModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Add Category</h3>
        </div>
        <form id="categoryForm">
          <input type="hidden" id="categoryId">
          
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" required>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description"></textarea>
          </div>

          <div class="form-group">
            <label for="color">Color</label>
            <input type="color" id="color" value="#667eea" class="color-input">
          </div>

          <div class="form-group">
            <label for="is_active">Status</label>
            <select id="is_active">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn">Save</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      const categories = ${JSON.stringify(categories)};

      function openCreateModal() {
        document.getElementById('modalTitle').textContent = 'Add Category';
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        document.getElementById('color').value = '#667eea';
        document.getElementById('categoryModal').classList.add('active');
      }

      function closeModal() {
        document.getElementById('categoryModal').classList.remove('active');
      }

      function editCategory(id) {
        const category = categories.find(c => c.id === id);
        if (!category) return;

        document.getElementById('modalTitle').textContent = 'Edit Category';
        document.getElementById('categoryId').value = category.id;
        document.getElementById('name').value = category.name;
        document.getElementById('description').value = category.description || '';
        document.getElementById('color').value = category.color;
        document.getElementById('is_active').value = category.is_active.toString();
        document.getElementById('categoryModal').classList.add('active');
      }

      async function deleteCategory(id, name) {
        if (!confirm(\`Are you sure you want to delete the category "\${name}"?\`)) {
          return;
        }

        try {
          const response = await fetch(\`/api/admin/categories/\${id}\`, {
            method: 'DELETE'
          });

          const result = await response.json();

          if (response.ok) {
            alert('Category deleted successfully!');
            window.location.reload();
          } else {
            alert(result.error || 'Failed to delete category');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while deleting the category');
        }
      }

      document.getElementById('categoryForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const id = document.getElementById('categoryId').value;
        const name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();
        const color = document.getElementById('color').value;
        const is_active = document.getElementById('is_active').value === 'true';

        const data = { name, description, color, is_active };

        try {
          const url = id ? \`/api/admin/categories/\${id}\` : '/api/admin/categories';
          const method = id ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          const result = await response.json();

          if (response.ok) {
            alert(result.message || 'Category saved successfully!');
            window.location.reload();
          } else {
            alert(result.error || 'Failed to save category');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while saving the category');
        }
      });

      async function logout() {
        try {
          await fetch('/api/admin/logout', { method: 'POST' });
          window.location.href = '/updates/admin/login';
        } catch (error) {
          console.error('Logout error:', error);
          window.location.href = '/updates/admin/login';
        }
      }

      // Close modal when clicking outside
      document.getElementById('categoryModal').addEventListener('click', function(e) {
        if (e.target === this) {
          closeModal();
        }
      });
    </script>
  </body>
  </html>
  `;
};
