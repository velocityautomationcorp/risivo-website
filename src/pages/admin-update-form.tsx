/**
 * Admin Create/Edit Update Form Page
 * Includes rich text editor, image/video upload, and photo galleries
 */

import { html } from 'hono/html';

interface AdminUpdateFormProps {
  admin: any;
  update?: any;  // If editing existing update
  mode: 'create' | 'edit';
  categories?: any[];  // Dynamic categories from database
}

export const AdminUpdateFormPage = ({ admin, update, mode, categories = [] }: AdminUpdateFormProps) => {
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
  
  // Filter only active categories
  const activeCategories = categories.filter(cat => cat.is_active);

  return html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mode === 'create' ? 'Create New Update' : 'Edit Update'} - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Quill Rich Text Editor (No API key needed!) -->
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    
    <style>
        /* Admin Form - Page-specific */
        .form-section {
            margin-bottom: 30px;
        }
        .rich-text-editor {
            min-height: 300px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
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
                <option value="What's New" ${updateData.category === "What's New" ? 'selected' : ''}>What's New</option>
                <option value="Improvement" ${updateData.category === 'Improvement' ? 'selected' : ''}>Improvement</option>
                <option value="Bug Fix" ${updateData.category === 'Bug Fix' ? 'selected' : ''}>Bug Fix</option>
                <option value="Announcement" ${updateData.category === 'Announcement' ? 'selected' : ''}>Announcement</option>
                <option value="General" ${updateData.category === 'General' ? 'selected' : ''}>General</option>
                <option value="Integrations" ${updateData.category === 'Integrations' ? 'selected' : ''}>Integrations</option>
                <option value="Partnership" ${updateData.category === 'Partnership' ? 'selected' : ''}>Partnership</option>
                <option value="Event" ${updateData.category === 'Event' ? 'selected' : ''}>Event</option>
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

          <!-- Featured Post Checkbox -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="is_featured" name="is_featured" ${updateData.is_featured ? 'checked' : ''}>
              <span>⭐ Mark as Featured Post</span>
            </label>
            <small>Featured post will be displayed prominently at the top of the user dashboard (only one post can be featured at a time)</small>
          </div>

          <!-- Featured Image URL (Thumbnail) -->
          <div class="form-group">
            <label for="featuredImageUrl">
              🖼️ Featured Image (Thumbnail) <span style="color: #999; font-weight: 400; font-size: 0.85rem;">- Optional</span>
            </label>
            
            <div class="upload-helper">
              <input 
                type="text" 
                id="featuredImageUrl" 
                name="featured_image_url"
                placeholder="Paste image URL here..."
                value="${updateData.featured_image_url || ''}"
              >
              <button type="button" class="upload-guide-btn" onclick="toggleUploadGuide()">
                📤 How to Upload?
              </button>
            </div>
            
            <div id="uploadGuide" class="upload-guide" style="display: none;">
              <h4>🚀 Quick Upload Options:</h4>
              <ol>
                <li>
                  <strong>Imgur (Recommended - Free & Fast)</strong>
                  <br>→ Go to <a href="https://imgur.com/upload" target="_blank">imgur.com/upload</a>
                  <br>→ Drag & drop your image
                  <br>→ Right-click uploaded image → "Copy image address"
                  <br>→ Paste URL above ⬆️
                </li>
                <li>
                  <strong>Cloudinary (Professional)</strong>
                  <br>→ Sign up at <a href="https://cloudinary.com" target="_blank">cloudinary.com</a> (free tier)
                  <br>→ Upload image & copy URL
                </li>
                <li>
                  <strong>Your Own Server</strong>
                  <br>→ Upload to your website's /images/ folder
                  <br>→ Use URL like: https://risivo.com/images/thumbnail.jpg
                </li>
              </ol>
              <p><strong>💡 Tip:</strong> Recommended size: 1200x630px (JPG or PNG)</p>
            </div>
            
            <div id="featuredImagePreview" class="media-preview ${updateData.featured_image_url ? 'visible' : ''}">
              <img src="${updateData.featured_image_url || ''}" alt="Featured image preview" onerror="this.parentElement.style.display='none'">
            </div>
            
            <small>
              📌 This image appears as the post thumbnail in the dashboard. 
              <br><strong>For videos:</strong> Upload a custom thumbnail (recommended: 1200x630px for best quality).
              <br>If left empty, system will try to auto-generate from video URL.
            </small>
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
              placeholder="https://youtube.com/watch?v=... or https://wistia.com/medias/..."
              value="${updateData.media_type === 'video' ? updateData.media_url : ''}"
              style="width: 100%; margin-bottom: 1rem;"
            >
            <div id="videoPreviewContainer"></div>
            <small>Enter a YouTube, Vimeo, Wistia URL, or direct video file URL (MP4, WebM)</small>
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

      // Featured image preview (thumbnail)
      const featuredImageUrl = document.getElementById('featuredImageUrl');
      const featuredImagePreview = document.getElementById('featuredImagePreview');
      
      if (featuredImageUrl) {
        featuredImageUrl.addEventListener('input', function() {
          const url = this.value.trim();
          if (url) {
            const img = featuredImagePreview.querySelector('img');
            img.src = url;
            featuredImagePreview.classList.add('visible');
            featuredImagePreview.style.display = 'block';
          } else {
            featuredImagePreview.classList.remove('visible');
            featuredImagePreview.style.display = 'none';
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
          
          // Check if Wistia
          const wistiaMatch = url.match(/(?:wistia\\.com\\/medias\\/|wi\\.st\\/)([a-zA-Z0-9]+)/);
          if (wistiaMatch) {
            videoPreviewContainer.innerHTML = '<script src="https://fast.wistia.com/embed/medias/' + wistiaMatch[1] + '.jsonp" async><\\/script><script src="https://fast.wistia.com/assets/external/E-v1.js" async><\\/script><div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_' + wistiaMatch[1] + ' seo=false videoFoam=true" style="height:100%;position:relative;width:100%"><div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;"><img src="https://fast.wistia.com/embed/medias/' + wistiaMatch[1] + '/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;" alt="" aria-hidden="true" onload="this.parentNode.style.opacity=1;" /></div></div></div></div>';
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

      // Toggle upload guide
      function toggleUploadGuide() {
        const guide = document.getElementById('uploadGuide');
        if (guide.style.display === 'none' || !guide.style.display) {
          guide.style.display = 'block';
        } else {
          guide.style.display = 'none';
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
        const isFeatured = document.getElementById('is_featured').checked;
        const featuredImageUrl = document.getElementById('featuredImageUrl').value.trim();

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
              featured_image_url: featuredImageUrl || null,
              media_type: mediaType,
              media_url: mediaUrl || null,
              gallery_images: mediaType === 'gallery' ? galleryData : null,
              is_featured: isFeatured,
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
