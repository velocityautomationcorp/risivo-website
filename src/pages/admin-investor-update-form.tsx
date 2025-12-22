import { html, raw } from 'hono/html';

export const AdminInvestorUpdateFormPage = (admin: any, categories: any[] = [], update: any = null) => {
    const isEdit = !!update;
    const title = isEdit ? 'Edit Investor Update' : 'Create Investor Update';
    
    // Generate category options
    const categoryOptions = categories.map(cat => `
        <option value="${cat.id}" ${update?.category_id === cat.id ? 'selected' : ''}>
            ${cat.icon || '💼'} ${cat.name}
        </option>
    `).join('');

    return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        .form-container {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            max-width: 900px;
            margin: 0 auto;
            border-top: 4px solid #10b981;
        }

        .form-section {
            margin-bottom: 30px;
            padding-bottom: 25px;
            border-bottom: 1px solid #e9ecef;
        }

        .form-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .section-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
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

        .form-label .required {
            color: #dc3545;
        }

        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 15px;
            transition: border-color 0.3s;
            font-family: inherit;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: #10b981;
        }

        .form-textarea {
            min-height: 200px;
            resize: vertical;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }

        .form-hint {
            font-size: 13px;
            color: #666;
            margin-top: 6px;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #10b981;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        .btn-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }

        .btn {
            padding: 14px 28px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white;
        }

        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
        }

        .image-preview {
            margin-top: 15px;
        }

        .image-preview img {
            max-width: 300px;
            max-height: 200px;
            border-radius: 10px;
            border: 2px solid #e9ecef;
        }

        .gallery-input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .gallery-input-group input {
            flex: 1;
        }

        .gallery-input-group button {
            padding: 8px 16px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        .add-gallery-btn {
            padding: 10px 20px;
            background: #e9ecef;
            border: 2px dashed #adb5bd;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            transition: all 0.3s;
        }

        .add-gallery-btn:hover {
            background: #dee2e6;
            border-color: #6c757d;
        }

        .status-toggle {
            display: flex;
            gap: 10px;
        }

        .status-option {
            flex: 1;
            padding: 14px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .status-option.active {
            border-color: #10b981;
            background: #d1fae5;
        }

        .status-option input {
            display: none;
        }

        .visibility-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .visibility-option {
            padding: 14px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .visibility-option.active {
            border-color: #10b981;
            background: #d1fae5;
        }

        .visibility-option input {
            display: none;
        }

        .visibility-label {
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .visibility-desc {
            font-size: 13px;
            color: #666;
            margin-top: 4px;
        }

        .investor-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 10px;
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
        
        <div class="investor-badge">💼 INVESTOR UPDATE</div>
        <h1 class="page-title">${isEdit ? '✏️' : '➕'} ${title}</h1>
        <p class="page-subtitle">${isEdit ? 'Update this investor post' : 'Create a new update for investors (includes financial info)'}</p>
        
        <div class="form-container">
            <form id="updateForm" onsubmit="saveUpdate(event)">
                <input type="hidden" id="updateId" value="${update?.id || ''}">
                
                <!-- Basic Info -->
                <div class="form-section">
                    <h3 class="section-title">📝 Basic Information</h3>
                    
                    <div class="form-group">
                        <label class="form-label">Title <span class="required">*</span></label>
                        <input type="text" id="title" class="form-input" required 
                               value="${update?.title || ''}" placeholder="Enter update title">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Excerpt</label>
                        <input type="text" id="excerpt" class="form-input" 
                               value="${update?.excerpt || ''}" placeholder="Brief summary (optional)">
                        <div class="form-hint">A short summary shown in previews</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Content <span class="required">*</span></label>
                        <textarea id="content" class="form-textarea" required 
                                  placeholder="Write your update content here. Include financial details, metrics, costs, etc.">${update?.content || ''}</textarea>
                        <div class="form-hint">Supports basic HTML formatting. Include financial information relevant to investors.</div>
                    </div>
                </div>
                
                <!-- Media -->
                <div class="form-section">
                    <h3 class="section-title">🖼️ Media</h3>
                    
                    <div class="form-group">
                        <label class="form-label">Featured Image URL</label>
                        <input type="url" id="featuredImage" class="form-input" 
                               value="${update?.featured_image_url || ''}" placeholder="https://example.com/image.jpg">
                        <div class="image-preview" id="featuredImagePreview">
                            ${update?.featured_image_url ? `<img src="${update.featured_image_url}" alt="Preview">` : ''}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Video URL</label>
                        <input type="url" id="videoUrl" class="form-input" 
                               value="${update?.video_url || ''}" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
                        <div class="form-hint">YouTube or Vimeo URL</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Gallery Images</label>
                        <div id="galleryInputs">
                            <!-- Gallery inputs will be added dynamically -->
                        </div>
                        <button type="button" class="add-gallery-btn" onclick="addGalleryInput()">
                            ➕ Add Image URL
                        </button>
                    </div>
                </div>
                
                <!-- Settings -->
                <div class="form-section">
                    <h3 class="section-title">⚙️ Settings</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select id="category" class="form-select">
                                <option value="">Select Category</option>
                                ${raw(categoryOptions)}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Author</label>
                            <input type="text" id="authorName" class="form-input" 
                                   value="${update?.author_name || 'Risivo Team'}" placeholder="Author name">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Visibility</label>
                        <div class="visibility-options">
                            <label class="visibility-option ${!update?.visibility || update?.visibility === 'all_investors' ? 'active' : ''}" onclick="selectVisibility('all_investors')">
                                <input type="radio" name="visibility" value="all_investors" ${!update?.visibility || update?.visibility === 'all_investors' ? 'checked' : ''}>
                                <div class="visibility-label">👥 All Investors</div>
                                <div class="visibility-desc">Visible to all investors (NDA signed or active)</div>
                            </label>
                            <label class="visibility-option ${update?.visibility === 'active_only' ? 'active' : ''}" onclick="selectVisibility('active_only')">
                                <input type="radio" name="visibility" value="active_only" ${update?.visibility === 'active_only' ? 'checked' : ''}>
                                <div class="visibility-label">✅ Active Investors Only</div>
                                <div class="visibility-desc">Only visible to approved/active investors</div>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="status-toggle">
                            <label class="status-option ${update?.status !== 'published' ? 'active' : ''}" onclick="selectStatus('draft')">
                                <input type="radio" name="status" value="draft" ${update?.status !== 'published' ? 'checked' : ''}>
                                <div>📝 Draft</div>
                            </label>
                            <label class="status-option ${update?.status === 'published' ? 'active' : ''}" onclick="selectStatus('published')">
                                <input type="radio" name="status" value="published" ${update?.status === 'published' ? 'checked' : ''}>
                                <div>✅ Published</div>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="btn-group">
                    <button type="submit" class="btn btn-primary">
                        <span>${isEdit ? '💾' : '➕'}</span>
                        <span>${isEdit ? 'Save Changes' : 'Create Update'}</span>
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="window.location.href='/updates/admin/dashboard'">
                        <span>❌</span>
                        <span>Cancel</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Footer -->
    <footer style="text-align: center; padding: 30px 20px; margin-top: 50px; color: #666; font-size: 14px; border-top: 1px solid #e9ecef;">
        <p>&copy; <span id="copyrightYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.</p>
    </footer>
    <script>document.getElementById('copyrightYear').textContent = new Date().getFullYear();</script>
    
    <script>
        // Initialize gallery images
        const existingGallery = ${raw(JSON.stringify(update?.gallery_images || []))};
        
        // Load existing gallery images
        existingGallery.forEach((url) => {
            addGalleryInput(url);
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                window.location.href = '/updates/admin/login';
            }
        });
        
        // Preview featured image
        document.getElementById('featuredImage').addEventListener('change', function() {
            const preview = document.getElementById('featuredImagePreview');
            if (this.value) {
                preview.innerHTML = \`<img src="\${this.value}" alt="Preview" onerror="this.style.display='none'">\`;
            } else {
                preview.innerHTML = '';
            }
        });
        
        // Add gallery input
        function addGalleryInput(value = '') {
            const container = document.getElementById('galleryInputs');
            
            const div = document.createElement('div');
            div.className = 'gallery-input-group';
            div.innerHTML = \`
                <input type="url" class="form-input gallery-url" placeholder="https://example.com/image.jpg" value="\${value}">
                <button type="button" onclick="removeGalleryInput(this)">🗑️</button>
            \`;
            
            container.appendChild(div);
        }
        
        // Remove gallery input
        function removeGalleryInput(btn) {
            btn.parentElement.remove();
        }
        
        // Select status
        function selectStatus(status) {
            document.querySelectorAll('.status-option').forEach(opt => {
                opt.classList.remove('active');
            });
            document.querySelector(\`input[name="status"][value="\${status}"]\`).closest('.status-option').classList.add('active');
            document.querySelector(\`input[name="status"][value="\${status}"]\`).checked = true;
        }
        
        // Select visibility
        function selectVisibility(visibility) {
            document.querySelectorAll('.visibility-option').forEach(opt => {
                opt.classList.remove('active');
            });
            document.querySelector(\`input[name="visibility"][value="\${visibility}"]\`).closest('.visibility-option').classList.add('active');
            document.querySelector(\`input[name="visibility"][value="\${visibility}"]\`).checked = true;
        }
        
        // Save update
        async function saveUpdate(event) {
            event.preventDefault();
            
            const title = document.getElementById('title').value.trim();
            const content = document.getElementById('content').value.trim();
            
            if (!title || !content) {
                alert('Title and content are required');
                return;
            }
            
            // Collect gallery URLs
            const galleryUrls = [];
            document.querySelectorAll('.gallery-url').forEach(input => {
                if (input.value.trim()) {
                    galleryUrls.push(input.value.trim());
                }
            });
            
            const data = {
                title,
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                excerpt: document.getElementById('excerpt').value.trim(),
                content,
                featured_image_url: document.getElementById('featuredImage').value.trim() || null,
                video_url: document.getElementById('videoUrl').value.trim() || null,
                gallery_images: galleryUrls,
                category_id: document.getElementById('category').value || null,
                author_name: document.getElementById('authorName').value.trim() || 'Risivo Team',
                visibility: document.querySelector('input[name="visibility"]:checked').value,
                status: document.querySelector('input[name="status"]:checked').value
            };
            
            const updateId = document.getElementById('updateId').value;
            const isEdit = !!updateId;
            
            try {
                const url = isEdit 
                    ? \`/api/admin/investor-updates/\${updateId}\`
                    : '/api/admin/investor-updates';
                    
                const response = await fetch(url, {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert(isEdit ? 'Update saved!' : 'Update created!');
                    window.location.href = '/updates/admin/dashboard';
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.error || 'Failed to save update'));
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Error saving update');
            }
        }
    </script>
</body>
</html>
`;
};
