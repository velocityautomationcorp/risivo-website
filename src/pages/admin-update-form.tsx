/**
 * Admin Create/Edit Update Form Page
 * Includes rich text editor, image upload, and all update fields
 */

import { html } from 'hono/html';

interface AdminUpdateFormProps {
  admin: any;
  update?: any;  // If editing existing update
  mode: 'create' | 'edit';
}

export const AdminUpdateFormPage = ({ admin, update, mode }: AdminUpdateFormProps) => html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mode === 'create' ? 'Create New Update' : 'Edit Update'} - Risivo Admin</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJASURBVHgB7ZZNaxNRFIbPvZOkNRZBqYKgC0VEFy50owsXIi7qRnHlQl24cOdfoODCneJGcaELF7oSXLhxIeJCQRBBRBEVbKFJ0yTNxzkzmZCZJjOZpFZdCD64ZGbuvfc85z5z7p0g+E+RUg0UohlhIKzUcPRLyIUqjxN6bqnfJKGRCBpfGnj2rIGjhwb8eoD1zQCPnm5qJVt6C9GfHs6drkTCaVydmcb5s5VIeP1rG7PvtvD2wwZ+/mrhtxegGQRI0xh3bk7j5sxUJJxdmMad+SUcGCtif/hb+vgLH8tYWt7Gm6UNfP3egpfykZbAQOj67BRaLbQQQAMBgkYLW9s+fv72EQ+TIpDC0YMjaLZaaCKFTVZ9//WOTqbFyXrV2mVWq42d6sZ/q9t1bYK/1XXttU4kPAEPn25ic9vHjfnLOHd6Ipb8+vkKXr5ex9J7B0+erWF9o4FapYqaU0OtXsP9u1fgVBxU7BrcqouAq+L+natwKjYqtq1f9xw4doVbu2sbtaodWl9tnQYKxUIkvDz3DHcXlrC5Vc+O3a/YqFTq+Pj5K+oNF44TJu86qDgVzL9Yxdb2DiYPjGJifw8XHx3dhGIgOgF+8+oHVldruHRhEqcmxiLhhS9ruH/nCo7dv4VCPp+de/D0C+y8iaGBPgwPFiPhh2Ut7O8dxqHxEg6OlVAsFqPlc3P8wL7eIRTyeRRvvESnSNTAu6XP+PJ1HT+dOl4tfY6Ep07/HO09cfiM8uyBwQwMDZawdz+S0H+UPzLVKl9NhIb4AAAAAElFTkSuQmCC">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- TinyMCE Rich Text Editor -->
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
    
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f5f5f7;
        color: #1d1d1f;
        line-height: 1.6;
      }

      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logo {
        height: 40px;
      }

      .header h1 {
        font-size: 1.5rem;
        font-weight: 700;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .back-btn, .logout-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: none;
        transition: all 0.3s;
      }

      .back-btn:hover, .logout-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 2rem;
      }

      .form-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 2px 20px rgba(0,0,0,0.08);
      }

      .form-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f0f0f0;
      }

      .form-header h2 {
        font-size: 1.75rem;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .form-header p {
        color: #666;
        font-size: 0.95rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #333;
        font-size: 0.95rem;
      }

      .form-group label .required {
        color: #ef4444;
        margin-left: 0.25rem;
      }

      .form-group input[type="text"],
      .form-group textarea,
      .form-group select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e5e5;
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.3s;
      }

      .form-group input[type="text"]:focus,
      .form-group textarea:focus,
      .form-group select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-group textarea {
        min-height: 100px;
        resize: vertical;
      }

      .form-group small {
        display: block;
        margin-top: 0.5rem;
        color: #666;
        font-size: 0.85rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      .image-upload-area {
        border: 2px dashed #e5e5e5;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s;
        cursor: pointer;
      }

      .image-upload-area:hover {
        border-color: #667eea;
        background: #f9fafb;
      }

      .image-upload-area.has-image {
        border-style: solid;
        border-color: #10b981;
      }

      .image-preview {
        max-width: 100%;
        max-height: 300px;
        margin: 1rem 0;
        border-radius: 8px;
        display: none;
      }

      .image-preview.visible {
        display: block;
      }

      .upload-text {
        color: #666;
        margin-top: 0.5rem;
      }

      .upload-text strong {
        color: #667eea;
      }

      .status-badges {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
      }

      .status-badge {
        flex: 1;
        padding: 1rem;
        border: 2px solid #e5e5e5;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: all 0.3s;
      }

      .status-badge input[type="radio"] {
        display: none;
      }

      .status-badge:hover {
        border-color: #667eea;
      }

      .status-badge input[type="radio"]:checked + .status-badge-content {
        color: #667eea;
        font-weight: 600;
      }

      .status-badge input[type="radio"]:checked ~ .status-badge {
        border-color: #667eea;
        background: #f3f4ff;
      }

      .status-badge-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .status-badge-title {
        font-weight: 600;
        font-size: 1rem;
      }

      .status-badge-desc {
        font-size: 0.85rem;
        color: #666;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #f0f0f0;
      }

      .btn {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;
        display: inline-block;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .btn-secondary {
        background: #f5f5f7;
        color: #333;
      }

      .btn-secondary:hover {
        background: #e5e5e7;
      }

      .alert {
        padding: 1rem 1.25rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        display: none;
      }

      .alert.visible {
        display: block;
      }

      .alert-success {
        background: #d1fae5;
        border: 1px solid #10b981;
        color: #065f46;
      }

      .alert-error {
        background: #fee2e2;
        border: 1px solid #ef4444;
        color: #991b1b;
      }

      .loading {
        display: none;
        text-align: center;
        padding: 2rem;
      }

      .loading.visible {
        display: block;
      }

      .spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .form-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-left">
        <h1>${mode === 'create' ? 'Create New Update' : 'Edit Update'}</h1>
      </div>
      <div class="header-right">
        <a href="/updates/admin/dashboard" class="back-btn">← Back to Dashboard</a>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>

    <div class="container">
      <div class="form-card">
        <div class="form-header">
          <h2>${mode === 'create' ? '📝 New Update' : '✏️ Edit Update'}</h2>
          <p>${mode === 'create' ? 'Create a new project update to share with your users' : 'Update your project information'}</p>
        </div>

        <div id="alert" class="alert"></div>
        <div id="loading" class="loading">
          <div class="spinner"></div>
          <p>Saving update...</p>
        </div>

        <form id="updateForm">
          <!-- Title -->
          <div class="form-group">
            <label for="title">
              Title<span class="required">*</span>
            </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              placeholder="Enter update title" 
              value="${update?.title || ''}"
              required
            >
            <small>A clear, concise title for your update</small>
          </div>

          <!-- Excerpt -->
          <div class="form-group">
            <label for="excerpt">
              Excerpt
            </label>
            <textarea 
              id="excerpt" 
              name="excerpt" 
              placeholder="Enter a brief summary (optional)"
              rows="3"
            >${update?.excerpt || ''}</textarea>
            <small>A short summary shown in update lists (optional, auto-generated if empty)</small>
          </div>

          <!-- Content (Rich Text Editor) -->
          <div class="form-group">
            <label for="content">
              Content<span class="required">*</span>
            </label>
            <textarea 
              id="content" 
              name="content"
            >${update?.content || ''}</textarea>
            <small>Full content of your update (supports rich text formatting)</small>
          </div>

          <!-- Row: Category & Status -->
          <div class="form-row">
            <!-- Category -->
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" name="category">
                <option value="">Select category (optional)</option>
                <option value="Feature" ${update?.category === 'Feature' ? 'selected' : ''}>Feature</option>
                <option value="Improvement" ${update?.category === 'Improvement' ? 'selected' : ''}>Improvement</option>
                <option value="Bug Fix" ${update?.category === 'Bug Fix' ? 'selected' : ''}>Bug Fix</option>
                <option value="Announcement" ${update?.category === 'Announcement' ? 'selected' : ''}>Announcement</option>
                <option value="General" ${update?.category === 'General' ? 'selected' : ''}>General</option>
              </select>
            </div>

            <!-- Status -->
            <div class="form-group">
              <label>Status<span class="required">*</span></label>
              <div class="status-badges">
                <label class="status-badge">
                  <input type="radio" name="status" value="draft" ${!update || update?.status === 'draft' ? 'checked' : ''}>
                  <div class="status-badge-content">
                    <span class="status-badge-title">Draft</span>
                    <span class="status-badge-desc">Not visible to users</span>
                  </div>
                </label>
                <label class="status-badge">
                  <input type="radio" name="status" value="published" ${update?.status === 'published' ? 'checked' : ''}>
                  <div class="status-badge-content">
                    <span class="status-badge-title">Published</span>
                    <span class="status-badge-desc">Visible to all users</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Featured Image -->
          <div class="form-group">
            <label>Featured Image</label>
            <div class="image-upload-area" id="imageUploadArea" onclick="document.getElementById('imageUrl').focus()">
              <img id="imagePreview" class="image-preview ${update?.featured_image_url ? 'visible' : ''}" src="${update?.featured_image_url || ''}" alt="Preview">
              <div class="upload-icon" style="font-size: 3rem; color: #667eea;">📸</div>
              <div class="upload-text">
                <strong>Enter image URL below</strong>
                <div style="font-size: 0.85rem; margin-top: 0.5rem;">Or use an image hosting service like Imgur, Cloudinary, etc.</div>
              </div>
            </div>
            <input 
              type="text" 
              id="imageUrl" 
              name="featured_image_url" 
              placeholder="https://example.com/image.jpg"
              value="${update?.featured_image_url || ''}"
              style="margin-top: 1rem;"
            >
            <small>Enter a URL to an image (JPG, PNG, GIF)</small>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <a href="/updates/admin/dashboard" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" id="submitBtn">
              ${mode === 'create' ? '✨ Create Update' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>

    <script>
      // Initialize TinyMCE Rich Text Editor
      tinymce.init({
        selector: '#content',
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 16px; line-height: 1.6; }',
        branding: false,
      });

      // Image preview
      const imageUrl = document.getElementById('imageUrl');
      const imagePreview = document.getElementById('imagePreview');
      const imageUploadArea = document.getElementById('imageUploadArea');

      imageUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
          imagePreview.src = url;
          imagePreview.classList.add('visible');
          imageUploadArea.classList.add('has-image');
        } else {
          imagePreview.classList.remove('visible');
          imageUploadArea.classList.remove('has-image');
        }
      });

      // Form submission
      const form = document.getElementById('updateForm');
      const submitBtn = document.getElementById('submitBtn');
      const loading = document.getElementById('loading');
      const alert = document.getElementById('alert');

      form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const title = document.getElementById('title').value.trim();
        const excerpt = document.getElementById('excerpt').value.trim();
        const content = tinymce.get('content').getContent();
        const category = document.getElementById('category').value;
        const status = document.querySelector('input[name="status"]:checked').value;
        const featured_image_url = document.getElementById('imageUrl').value.trim();

        // Validate
        if (!title || !content) {
          showAlert('error', 'Please fill in all required fields');
          return;
        }

        // Disable form
        submitBtn.disabled = true;
        loading.classList.add('visible');
        alert.classList.remove('visible');

        try {
          const mode = '${mode}';
          const url = mode === 'create' 
            ? '/api/admin/updates'
            : '/api/admin/updates/${update?.id || ''}';
          
          const method = mode === 'create' ? 'POST' : 'PUT';

          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              excerpt,
              content,
              category,
              status,
              featured_image_url: featured_image_url || null,
            }),
          });

          const data = await response.json();

          if (data.success) {
            showAlert('success', mode === 'create' ? 'Update created successfully!' : 'Update saved successfully!');
            setTimeout(() => {
              window.location.href = '/updates/admin/dashboard';
            }, 1500);
          } else {
            showAlert('error', data.error || 'Failed to save update');
            submitBtn.disabled = false;
          }
        } catch (error) {
          console.error('Error:', error);
          showAlert('error', 'Network error. Please try again.');
          submitBtn.disabled = false;
        } finally {
          loading.classList.remove('visible');
        }
      });

      function showAlert(type, message) {
        alert.className = 'alert alert-' + type + ' visible';
        alert.textContent = message;
        setTimeout(() => {
          alert.classList.remove('visible');
        }, 5000);
      }

      async function logout() {
        try {
          await fetch('/api/admin/logout', { method: 'POST' });
          window.location.href = '/updates/admin/login';
        } catch (error) {
          console.error('Logout error:', error);
          window.location.href = '/updates/admin/login';
        }
      }
    </script>
  </body>
  </html>
`;
