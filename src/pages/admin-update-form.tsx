/**
 * Admin Create/Edit Update Form Page
 * Includes rich text editor, image/video upload, and photo galleries
 */

import { html } from 'hono/html';

interface AdminUpdateFormProps {
  admin: any;
  update?: any;  // If editing existing update
  mode: 'create' | 'edit';
}

export const AdminUpdateFormPage = ({ admin, update, mode }: AdminUpdateFormProps) => {
  // Parse media data
  const updateData = update ? {
    ...update,
    media_type: update.media_type || 'none',
    media_url: update.media_url || '',
    gallery_images: update.gallery_images || []
  } : {
    media_type: 'none',
    media_url: '',
    gallery_images: []
  };

  return html`
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
    
    <!-- Quill Rich Text Editor (No API key needed!) -->
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    
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

      /* Quill Editor Styling */
      #editor {
        height: 400px;
        background: white;
        border-radius: 8px;
      }

      .ql-toolbar {
        border-radius: 8px 8px 0 0 !important;
        border-color: #e5e5e5 !important;
      }

      .ql-container {
        border-radius: 0 0 8px 8px !important;
        border-color: #e5e5e5 !important;
        font-family: inherit !important;
      }

      /* Media Type Selection */
      .media-type-selector {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin: 1rem 0;
      }

      .media-type-option {
        position: relative;
      }

      .media-type-option input[type="radio"] {
        position: absolute;
        opacity: 0;
      }

      .media-type-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem 1rem;
        border: 2px solid #e5e5e5;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
      }

      .media-type-option input[type="radio"]:checked + .media-type-label {
        border-color: #667eea;
        background: #f3f4ff;
      }

      .media-type-label:hover {
        border-color: #667eea;
      }

      .media-icon {
        font-size: 2rem;
      }

      .media-type-name {
        font-weight: 600;
        font-size: 0.9rem;
      }

      /* Media Upload Areas */
      .media-upload-section {
        display: none;
        margin-top: 1rem;
        padding: 1.5rem;
        border: 2px dashed #e5e5e5;
        border-radius: 8px;
      }

      .media-upload-section.active {
        display: block;
      }

      .media-preview {
        max-width: 100%;
        max-height: 400px;
        margin: 1rem 0;
        border-radius: 8px;
        display: none;
      }

      .media-preview.visible {
        display: block;
      }

      .video-preview {
        width: 100%;
        max-height: 400px;
        border-radius: 8px;
        display: none;
      }

      .video-preview.visible {
        display: block;
      }

      /* Gallery */
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .gallery-item {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 1;
        border: 2px solid #e5e5e5;
      }

      .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .gallery-item-remove {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .add-gallery-image {
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        border: 2px dashed #667eea;
        border-radius: 8px;
        cursor: pointer;
        color: #667eea;
        font-size: 3rem;
        transition: all 0.3s;
      }

      .add-gallery-image:hover {
        background: #f3f4ff;
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
        .form-row, .media-type-selector {
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
          <p>${mode === 'create' ? 'Create a new project update with images, videos, or photo galleries' : 'Update your project information'}</p>
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
              value="${updateData.title || ''}"
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
            >${updateData.excerpt || ''}</textarea>
            <small>A short summary shown in update lists (optional, auto-generated if empty)</small>
          </div>

          <!-- Content (Rich Text Editor) -->
          <div class="form-group">
            <label for="content">
              Content<span class="required">*</span>
            </label>
            <div id="editor"></div>
            <textarea id="content" name="content" style="display:none;">${updateData.content || ''}</textarea>
            <small>Full content of your update (supports rich text formatting)</small>
          </div>

          <!-- Row: Category & Status -->
          <div class="form-row">
            <!-- Category -->
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" name="category">
                <option value="">Select category (optional)</option>
                <option value="Feature" ${updateData.category === 'Feature' ? 'selected' : ''}>Feature</option>
                <option value="Improvement" ${updateData.category === 'Improvement' ? 'selected' : ''}>Improvement</option>
                <option value="Bug Fix" ${updateData.category === 'Bug Fix' ? 'selected' : ''}>Bug Fix</option>
                <option value="Announcement" ${updateData.category === 'Announcement' ? 'selected' : ''}>Announcement</option>
                <option value="General" ${updateData.category === 'General' ? 'selected' : ''}>General</option>
              </select>
            </div>

            <!-- Status -->
            <div class="form-group">
              <label>Status<span class="required">*</span></label>
              <div class="status-badges">
                <label class="status-badge">
                  <input type="radio" name="status" value="draft" ${!updateData.status || updateData.status === 'draft' ? 'checked' : ''}>
                  <div class="status-badge-content">
                    <span class="status-badge-title">Draft</span>
                    <span class="status-badge-desc">Not visible to users</span>
                  </div>
                </label>
                <label class="status-badge">
                  <input type="radio" name="status" value="published" ${updateData.status === 'published' ? 'checked' : ''}>
                  <div class="status-badge-content">
                    <span class="status-badge-title">Published</span>
                    <span class="status-badge-desc">Visible to all users</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Media Type Selection -->
          <div class="form-group">
            <label>Media Type</label>
            <div class="media-type-selector">
              <div class="media-type-option">
                <input type="radio" id="mediaTypeNone" name="media_type" value="none" ${updateData.media_type === 'none' ? 'checked' : ''}>
                <label for="mediaTypeNone" class="media-type-label">
                  <span class="media-icon">🚫</span>
                  <span class="media-type-name">No Media</span>
                </label>
              </div>
              <div class="media-type-option">
                <input type="radio" id="mediaTypeImage" name="media_type" value="image" ${updateData.media_type === 'image' ? 'checked' : ''}>
                <label for="mediaTypeImage" class="media-type-label">
                  <span class="media-icon">🖼️</span>
                  <span class="media-type-name">Single Image</span>
                </label>
              </div>
              <div class="media-type-option">
                <input type="radio" id="mediaTypeVideo" name="media_type" value="video" ${updateData.media_type === 'video' ? 'checked' : ''}>
                <label for="mediaTypeVideo" class="media-type-label">
                  <span class="media-icon">🎥</span>
                  <span class="media-type-name">Video</span>
                </label>
              </div>
              <div class="media-type-option">
                <input type="radio" id="mediaTypeGallery" name="media_type" value="gallery" ${updateData.media_type === 'gallery' ? 'checked' : ''}>
                <label for="mediaTypeGallery" class="media-type-label">
                  <span class="media-icon">🖼️📸</span>
                  <span class="media-type-name">Photo Gallery</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Single Image Upload -->
          <div id="singleImageSection" class="media-upload-section ${updateData.media_type === 'image' ? 'active' : ''}">
            <h3 style="margin-bottom: 1rem;">📸 Featured Image</h3>
            <input 
              type="text" 
              id="imageUrl" 
              placeholder="https://example.com/image.jpg"
              value="${updateData.media_type === 'image' ? updateData.media_url : ''}"
              style="width: 100%; margin-bottom: 1rem;"
            >
            <img id="imagePreview" class="media-preview ${updateData.media_type === 'image' && updateData.media_url ? 'visible' : ''}" src="${updateData.media_type === 'image' ? updateData.media_url : ''}" alt="Preview">
            <small>Enter a URL to an image (JPG, PNG, GIF, WebP)</small>
          </div>

          <!-- Video Upload -->
          <div id="videoSection" class="media-upload-section ${updateData.media_type === 'video' ? 'active' : ''}">
            <h3 style="margin-bottom: 1rem;">🎥 Video</h3>
            <input 
              type="text" 
              id="videoUrl" 
              placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
              value="${updateData.media_type === 'video' ? updateData.media_url : ''}"
              style="width: 100%; margin-bottom: 1rem;"
            >
            <div id="videoPreviewContainer"></div>
            <small>Enter a YouTube URL, Vimeo URL, or direct video file URL (MP4, WebM)</small>
          </div>

          <!-- Photo Gallery -->
          <div id="gallerySection" class="media-upload-section ${updateData.media_type === 'gallery' ? 'active' : ''}">
            <h3 style="margin-bottom: 1rem;">📸 Photo Gallery</h3>
            <div class="gallery-grid" id="galleryGrid">
              ${updateData.media_type === 'gallery' && Array.isArray(updateData.gallery_images) ? updateData.gallery_images.map((img: string, idx: number) => `
                <div class="gallery-item" data-url="${img}">
                  <img src="${img}" alt="Gallery image ${idx + 1}">
                  <button type="button" class="gallery-item-remove" onclick="removeGalleryImage(${idx})">×</button>
                </div>
              `).join('') : ''}
              <div class="add-gallery-image" onclick="addGalleryImage()">+</div>
            </div>
            <input type="text" id="galleryImageUrl" placeholder="Paste image URL and press Enter" style="width: 100%; margin-top: 1rem;">
            <small>Add multiple images to create a photo gallery (click + or paste URL)</small>
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
      // Wait for Quill to load
      let quill;
      
      function initializeEditor() {
        // Initialize Quill Rich Text Editor
        quill = new Quill('#editor', {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ]
          },
          placeholder: 'Write your update content here...'
        });

        // Load existing content
        const existingContent = document.getElementById('content').value;
        if (existingContent) {
          quill.root.innerHTML = existingContent;
        }
      }
      
      // Initialize when Quill library is loaded
      if (typeof Quill !== 'undefined') {
        initializeEditor();
      } else {
        window.addEventListener('load', initializeEditor);
      }

      // Gallery images array
      let galleryImages = ${JSON.stringify(updateData.media_type === 'gallery' ? updateData.gallery_images : [])};

      // Media type switching
      const mediaTypeRadios = document.querySelectorAll('input[name="media_type"]');
      mediaTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          document.querySelectorAll('.media-upload-section').forEach(section => {
            section.classList.remove('active');
          });
          
          if (this.value === 'image') {
            document.getElementById('singleImageSection').classList.add('active');
          } else if (this.value === 'video') {
            document.getElementById('videoSection').classList.add('active');
          } else if (this.value === 'gallery') {
            document.getElementById('gallerySection').classList.add('active');
          }
        });
      });

      // Image preview
      const imageUrl = document.getElementById('imageUrl');
      const imagePreview = document.getElementById('imagePreview');
      
      if (imageUrl) {
        imageUrl.addEventListener('input', function() {
          const url = this.value.trim();
          if (url) {
            imagePreview.src = url;
            imagePreview.classList.add('visible');
          } else {
            imagePreview.classList.remove('visible');
          }
        });
      }

      // Video preview
      const videoUrl = document.getElementById('videoUrl');
      const videoPreviewContainer = document.getElementById('videoPreviewContainer');
      
      if (videoUrl) {
        videoUrl.addEventListener('input', function() {
          const url = this.value.trim();
          videoPreviewContainer.innerHTML = '';
          
          if (!url) return;
          
          // Check if YouTube
          const youtubeMatch = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([a-zA-Z0-9_-]+)/);
          if (youtubeMatch) {
            videoPreviewContainer.innerHTML = '<iframe width="100%" height="400" src="https://www.youtube.com/embed/' + youtubeMatch[1] + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px; margin-top: 1rem;"></iframe>';
            return;
          }
          
          // Check if Vimeo
          const vimeoMatch = url.match(/vimeo\\.com\\/(\\d+)/);
          if (vimeoMatch) {
            videoPreviewContainer.innerHTML = '<iframe width="100%" height="400" src="https://player.vimeo.com/video/' + vimeoMatch[1] + '" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="border-radius: 8px; margin-top: 1rem;"></iframe>';
            return;
          }
          
          // Assume direct video URL
          if (url.match(/\\.(mp4|webm|ogg)$/i)) {
            videoPreviewContainer.innerHTML = '<video controls width="100%" style="border-radius: 8px; margin-top: 1rem; max-height: 400px;"><source src="' + url + '" type="video/mp4">Your browser does not support the video tag.</video>';
          }
        });
        
        // Trigger initial preview if editing
        if (videoUrl.value) {
          videoUrl.dispatchEvent(new Event('input'));
        }
      }

      // Gallery functions
      function addGalleryImage() {
        const input = document.getElementById('galleryImageUrl');
        const url = prompt('Enter image URL:');
        if (url && url.trim()) {
          galleryImages.push(url.trim());
          renderGallery();
        }
      }

      function removeGalleryImage(index) {
        if (confirm('Remove this image from gallery?')) {
          galleryImages.splice(index, 1);
          renderGallery();
        }
      }

      function renderGallery() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = galleryImages.map((img, idx) => 
          '<div class="gallery-item" data-url="' + img + '">' +
            '<img src="' + img + '" alt="Gallery image ' + (idx + 1) + '">' +
            '<button type="button" class="gallery-item-remove" onclick="removeGalleryImage(' + idx + ')">×</button>' +
          '</div>'
        ).join('') + '<div class="add-gallery-image" onclick="addGalleryImage()">+</div>';
      }

      // Gallery URL input
      const galleryImageUrl = document.getElementById('galleryImageUrl');
      if (galleryImageUrl) {
        galleryImageUrl.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            const url = this.value.trim();
            if (url) {
              galleryImages.push(url);
              renderGallery();
              this.value = '';
            }
          }
        });
      }

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
        const content = quill ? quill.root.innerHTML : '';
        const category = document.getElementById('category').value;
        const status = document.querySelector('input[name="status"]:checked').value;
        const mediaType = document.querySelector('input[name="media_type"]:checked').value;

        // Validate
        if (!quill) {
          showAlert('error', 'Editor not loaded yet. Please wait a moment and try again.');
          return;
        }
        
        if (!title || !content || content === '<p><br></p>') {
          showAlert('error', 'Please fill in all required fields');
          return;
        }

        // Get media data based on type
        let mediaUrl = '';
        let galleryData = [];
        
        if (mediaType === 'image') {
          mediaUrl = document.getElementById('imageUrl').value.trim();
        } else if (mediaType === 'video') {
          mediaUrl = document.getElementById('videoUrl').value.trim();
        } else if (mediaType === 'gallery') {
          galleryData = galleryImages;
        }

        // Disable form
        submitBtn.disabled = true;
        loading.classList.add('visible');
        alert.classList.remove('visible');

        try {
          const mode = '${mode}';
          const url = mode === 'create' 
            ? '/api/admin/updates'
            : '/api/admin/updates/${updateData.id || ''}';
          
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
              media_type: mediaType,
              media_url: mediaUrl || null,
              gallery_images: mediaType === 'gallery' ? galleryData : null,
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

      // Make functions global
      window.removeGalleryImage = removeGalleryImage;
      window.addGalleryImage = addGalleryImage;
    </script>
  </body>
  </html>
`;
};
