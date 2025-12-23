import { html, raw } from 'hono/html';

export const AdminWaitlistUpdateFormPage = (admin: any, categories: any[] = [], update: any = null) => {
    const isEdit = !!update;
    const title = isEdit ? 'Edit Waitlist Update' : 'Create Waitlist Update';
    
    // Generate category options
    const categoryOptions = categories.map(cat => `
        <option value="${cat.id}" ${update?.category_id === cat.id ? 'selected' : ''}>
            ${cat.icon || '📋'} ${cat.name}
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
            border-color: #3b82f6;
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
            color: #3b82f6;
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
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
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

        .gallery-preview {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .gallery-preview img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
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
            border-color: #3b82f6;
            background: #eff6ff;
        }

        .status-option input {
            display: none;
        }
        
        /* Social Posting Styles */
        .social-posting-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
        }
        
        .section-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .toggle-switch {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }
        
        .toggle-switch input { display: none; }
        
        .toggle-slider {
            width: 50px;
            height: 26px;
            background: #ccc;
            border-radius: 26px;
            position: relative;
            transition: background 0.3s;
        }
        
        .toggle-slider::after {
            content: '';
            position: absolute;
            width: 22px;
            height: 22px;
            background: white;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: transform 0.3s;
        }
        
        .toggle-switch input:checked + .toggle-slider {
            background: #3b82f6;
        }
        
        .toggle-switch input:checked + .toggle-slider::after {
            transform: translateX(24px);
        }
        
        .toggle-label {
            font-weight: 600;
            color: #666;
        }
        
        .platforms-checklist {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        
        .platform-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            cursor: pointer;
        }
        
        .platform-checkbox:hover { border-color: #3b82f6; }
        .platform-checkbox.checked { border-color: #3b82f6; background: #eff6ff; }
        .platform-checkbox input { width: 18px; height: 18px; }
        .platform-icon { font-size: 20px; }
        .platform-name { font-weight: 500; }
        .platform-account { font-size: 12px; color: #666; }
        
        .timing-options {
            display: flex;
            gap: 10px;
        }
        
        .radio-option {
            flex: 1;
            padding: 12px;
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            cursor: pointer;
        }
        
        .radio-option:hover { border-color: #3b82f6; }
        .radio-option input { margin-right: 8px; }
        .radio-label { font-weight: 500; }
        .radio-desc { display: block; font-size: 12px; color: #666; margin-top: 4px; margin-left: 26px; }
        
        .char-counter { text-align: right; font-size: 13px; color: #666; margin-top: 4px; }
        .char-counter.warning { color: #f59e0b; }
        .char-counter.error { color: #dc2626; }
        
        .toggle-inline {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .toggle-inline input { width: 18px; height: 18px; }
        
        .no-platforms {
            padding: 20px;
            text-align: center;
            background: #fff3cd;
            border-radius: 10px;
        }
        
        .no-platforms a { color: #3b82f6; font-weight: 600; }
        .loading-text { color: #666; font-style: italic; }
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
        
        <h1 class="page-title">${isEdit ? '✏️' : '➕'} ${title}</h1>
        <p class="page-subtitle">${isEdit ? 'Update this waitlist post' : 'Create a new update for waitlist subscribers'}</p>
        
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
                                  placeholder="Write your update content here...">${update?.content || ''}</textarea>
                        <div class="form-hint">Supports basic HTML formatting</div>
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
                
                <!-- Social Media Auto-Post -->
                <div class="form-section social-posting-section" id="socialPostingSection">
                    <div class="section-header-row">
                        <h3 class="section-title">📱 Social Media Auto-Post</h3>
                        <label class="toggle-switch">
                            <input type="checkbox" id="enableSocialPosting" name="enable_social_posting">
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">Enable</span>
                        </label>
                    </div>
                    
                    <div class="social-content" id="socialContent" style="display: none;">
                        <!-- Platform Selection -->
                        <div class="form-group">
                            <label class="form-label">Select Platforms</label>
                            <div class="platforms-checklist" id="platformsChecklist">
                                <p class="loading-text">Loading connected platforms...</p>
                            </div>
                            <div class="form-hint">Select which platforms to post to. Only connected accounts are shown.</div>
                        </div>
                        
                        <!-- Post Content -->
                        <div class="form-group">
                            <label class="form-label">Post Content</label>
                            <textarea 
                                id="socialPostContent" 
                                name="social_post_content" 
                                class="form-textarea" 
                                rows="3" 
                                placeholder="Write your social media post content... A short URL will be automatically added."
                                maxlength="280"
                            ></textarea>
                            <div class="char-counter">
                                <span id="charCount">0</span>/280 characters
                            </div>
                        </div>
                        
                        <!-- Post Timing -->
                        <div class="form-group">
                            <label class="form-label">When to Post</label>
                            <div class="timing-options">
                                <label class="radio-option">
                                    <input type="radio" name="post_timing" value="immediate" checked>
                                    <span class="radio-label">Post Immediately</span>
                                    <span class="radio-desc">When update is published</span>
                                </label>
                                <label class="radio-option">
                                    <input type="radio" name="post_timing" value="scheduled">
                                    <span class="radio-label">Schedule for Later</span>
                                    <span class="radio-desc">Choose date and time</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Schedule DateTime -->
                        <div class="form-group" id="scheduleDatetimeGroup" style="display: none;">
                            <label class="form-label">Schedule Date & Time</label>
                            <input type="datetime-local" id="scheduleDatetime" name="schedule_datetime" class="form-input">
                        </div>
                        
                        <!-- Include Image -->
                        <div class="form-group">
                            <label class="toggle-inline">
                                <input type="checkbox" id="includeUpdateImage" name="include_update_image" checked>
                                <span>Include featured image in social posts</span>
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
        let galleryImages = [...existingGallery];
        
        // Load existing gallery images
        existingGallery.forEach((url, index) => {
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
            const index = container.children.length;
            
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
            document.querySelector(\`input[value="\${status}"]\`).closest('.status-option').classList.add('active');
            document.querySelector(\`input[value="\${status}"]\`).checked = true;
        }
        
        // Social Posting functionality
        const enableToggle = document.getElementById('enableSocialPosting');
        const socialContent = document.getElementById('socialContent');
        const socialPostContent = document.getElementById('socialPostContent');
        const charCount = document.getElementById('charCount');
        const platformsChecklist = document.getElementById('platformsChecklist');
        const timingRadios = document.querySelectorAll('input[name="post_timing"]');
        const scheduleDatetimeGroup = document.getElementById('scheduleDatetimeGroup');
        
        enableToggle.addEventListener('change', function() {
            socialContent.style.display = this.checked ? 'block' : 'none';
            if (this.checked) loadConnectedPlatforms();
        });
        
        socialPostContent.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            const counter = charCount.parentElement;
            counter.classList.remove('warning', 'error');
            if (length > 260) counter.classList.add('warning');
            if (length > 280) counter.classList.add('error');
        });
        
        timingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                scheduleDatetimeGroup.style.display = this.value === 'scheduled' ? 'block' : 'none';
            });
        });
        
        async function loadConnectedPlatforms() {
            try {
                const response = await fetch('/api/admin/social/connections');
                const data = await response.json();
                
                if (!data.connections || data.connections.length === 0) {
                    platformsChecklist.innerHTML = '<div class="no-platforms"><p>No social media accounts connected.</p><p><a href="/updates/admin/social/connections">Connect accounts</a></p></div>';
                    return;
                }
                
                const connected = data.connections.filter(c => c.is_connected && c.is_active);
                if (connected.length === 0) {
                    platformsChecklist.innerHTML = '<div class="no-platforms"><p>No active connections.</p><p><a href="/updates/admin/social/connections">Set up accounts</a></p></div>';
                    return;
                }
                
                platformsChecklist.innerHTML = connected.map(conn => \`
                    <label class="platform-checkbox" data-id="\${conn.id}">
                        <input type="checkbox" name="social_platforms[]" value="\${conn.id}">
                        <span class="platform-icon">\${conn.platform?.icon || '📱'}</span>
                        <div>
                            <div class="platform-name">\${conn.platform?.platform_name || 'Unknown'}</div>
                            <div class="platform-account">\${conn.connection_name}</div>
                        </div>
                    </label>
                \`).join('');
                
                document.querySelectorAll('.platform-checkbox').forEach(label => {
                    label.addEventListener('click', function(e) {
                        if (e.target.tagName !== 'INPUT') {
                            const checkbox = this.querySelector('input');
                            checkbox.checked = !checkbox.checked;
                        }
                        this.classList.toggle('checked', this.querySelector('input').checked);
                    });
                });
            } catch (error) {
                console.error('Failed to load platforms:', error);
                platformsChecklist.innerHTML = '<div class="no-platforms"><p>Failed to load platforms.</p></div>';
            }
        }
        
        // Auto-fill social content from title
        document.getElementById('title').addEventListener('blur', function() {
            if (!socialPostContent.value && this.value) {
                socialPostContent.value = this.value;
                socialPostContent.dispatchEvent(new Event('input'));
            }
        });
        
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
                status: document.querySelector('input[name="status"]:checked').value
            };
            
            // Add social posting data if enabled
            if (enableToggle.checked) {
                data.social_posting = {
                    enabled: true,
                    content: socialPostContent.value.trim(),
                    platforms: Array.from(document.querySelectorAll('input[name="social_platforms[]"]:checked')).map(cb => cb.value),
                    timing: document.querySelector('input[name="post_timing"]:checked').value,
                    scheduled_for: document.getElementById('scheduleDatetime').value || null,
                    include_image: document.getElementById('includeUpdateImage').checked
                };
            }
            
            const updateId = document.getElementById('updateId').value;
            const isEdit = !!updateId;
            
            try {
                const url = isEdit 
                    ? \`/api/admin/waitlist-updates/\${updateId}\`
                    : '/api/admin/waitlist-updates';
                    
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
