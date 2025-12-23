/**
 * Social Post Scheduler Component
 * Reusable component for integrating social media posting into update forms
 */

export const SocialPostSchedulerHTML = `
<!-- Social Media Posting Section -->
<div class="social-posting-section" id="socialPostingSection">
    <div class="section-header">
        <h3 class="section-title">
            <span>📱</span>
            <span>Social Media Auto-Post</span>
        </h3>
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
            <p class="form-hint">Select which platforms to post to. Only connected accounts are shown.</p>
        </div>
        
        <!-- Post Content -->
        <div class="form-group">
            <label class="form-label">Post Content</label>
            <textarea 
                id="socialPostContent" 
                name="social_post_content" 
                class="form-textarea" 
                rows="4" 
                placeholder="Write your social media post content... A short URL will be automatically added."
                maxlength="280"
            ></textarea>
            <div class="char-counter">
                <span id="charCount">0</span>/280 characters
            </div>
            <p class="form-hint">Keep it short and engaging. Twitter has a 280 character limit.</p>
        </div>
        
        <!-- Post Timing -->
        <div class="form-group">
            <label class="form-label">When to Post</label>
            <div class="timing-options">
                <label class="radio-option">
                    <input type="radio" name="post_timing" value="immediate" checked>
                    <span class="radio-label">Post Immediately</span>
                    <span class="radio-desc">Post as soon as the update is published</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="post_timing" value="scheduled">
                    <span class="radio-label">Schedule for Later</span>
                    <span class="radio-desc">Choose a specific date and time</span>
                </label>
            </div>
        </div>
        
        <!-- Schedule DateTime (hidden by default) -->
        <div class="form-group schedule-datetime" id="scheduleDatetimeGroup" style="display: none;">
            <label class="form-label">Schedule Date & Time</label>
            <input 
                type="datetime-local" 
                id="scheduleDatetime" 
                name="schedule_datetime" 
                class="form-input"
            >
            <p class="form-hint">Posts will be sent at this time (your local timezone)</p>
        </div>
        
        <!-- Include Image -->
        <div class="form-group">
            <label class="toggle-inline">
                <input type="checkbox" id="includeUpdateImage" name="include_update_image" checked>
                <span>Include featured image in social posts</span>
            </label>
        </div>
        
        <!-- Preview -->
        <div class="post-preview" id="postPreview">
            <div class="preview-header">
                <span>📝</span>
                <span>Post Preview</span>
            </div>
            <div class="preview-content">
                <p id="previewText">Your post content will appear here...</p>
                <p class="preview-link" id="previewLink">🔗 risivo.com/s/xxxxx</p>
            </div>
        </div>
    </div>
</div>

<style>
    .social-posting-section {
        background: #f8f9fa;
        border: 2px solid #e9ecef;
        border-radius: 16px;
        padding: 24px;
        margin-top: 30px;
    }
    
    .social-posting-section .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .social-posting-section .section-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #333;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
    }
    
    /* Toggle Switch */
    .toggle-switch {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }
    
    .toggle-switch input {
        display: none;
    }
    
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
        background: #6b3fea;
    }
    
    .toggle-switch input:checked + .toggle-slider::after {
        transform: translateX(24px);
    }
    
    .toggle-label {
        font-weight: 600;
        color: #666;
    }
    
    .toggle-switch input:checked ~ .toggle-label {
        color: #6b3fea;
    }
    
    /* Platforms Checklist */
    .platforms-checklist {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        margin-top: 10px;
    }
    
    .platform-checkbox {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .platform-checkbox:hover {
        border-color: #6b3fea;
    }
    
    .platform-checkbox input {
        width: 18px;
        height: 18px;
    }
    
    .platform-checkbox.checked {
        border-color: #6b3fea;
        background: #f3f0ff;
    }
    
    .platform-icon {
        font-size: 20px;
    }
    
    .platform-name {
        font-weight: 500;
        color: #333;
    }
    
    .platform-account {
        font-size: 12px;
        color: #666;
    }
    
    /* Timing Options */
    .timing-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .radio-option {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .radio-option:hover {
        border-color: #6b3fea;
    }
    
    .radio-option input {
        width: 18px;
        height: 18px;
    }
    
    .radio-option input:checked ~ .radio-label {
        color: #6b3fea;
        font-weight: 600;
    }
    
    .radio-label {
        font-weight: 500;
        color: #333;
    }
    
    .radio-desc {
        flex-basis: 100%;
        margin-left: 28px;
        font-size: 13px;
        color: #666;
    }
    
    /* Character Counter */
    .char-counter {
        text-align: right;
        font-size: 13px;
        color: #666;
        margin-top: 6px;
    }
    
    .char-counter.warning {
        color: #f59e0b;
    }
    
    .char-counter.error {
        color: #dc2626;
    }
    
    /* Toggle Inline */
    .toggle-inline {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .toggle-inline input {
        width: 18px;
        height: 18px;
    }
    
    /* Post Preview */
    .post-preview {
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        margin-top: 20px;
        overflow: hidden;
    }
    
    .preview-header {
        background: #f8f9fa;
        padding: 10px 16px;
        font-weight: 600;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .preview-content {
        padding: 16px;
    }
    
    .preview-content p {
        margin: 0;
        color: #333;
        line-height: 1.5;
    }
    
    .preview-link {
        margin-top: 10px !important;
        color: #6b3fea !important;
        font-weight: 500;
    }
    
    .loading-text {
        color: #666;
        font-style: italic;
    }
    
    .no-platforms {
        padding: 20px;
        text-align: center;
        background: #fff3cd;
        border-radius: 10px;
    }
    
    .no-platforms a {
        color: #6b3fea;
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .platforms-checklist {
            grid-template-columns: 1fr;
        }
    }
</style>

<script>
    // Social Posting Functionality
    (function() {
        const enableToggle = document.getElementById('enableSocialPosting');
        const socialContent = document.getElementById('socialContent');
        const postContentInput = document.getElementById('socialPostContent');
        const charCount = document.getElementById('charCount');
        const previewText = document.getElementById('previewText');
        const platformsChecklist = document.getElementById('platformsChecklist');
        const timingRadios = document.querySelectorAll('input[name="post_timing"]');
        const scheduleDatetimeGroup = document.getElementById('scheduleDatetimeGroup');
        
        // Toggle social posting section
        enableToggle.addEventListener('change', function() {
            socialContent.style.display = this.checked ? 'block' : 'none';
            if (this.checked) {
                loadConnectedPlatforms();
            }
        });
        
        // Character counter and preview
        postContentInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            const counter = charCount.parentElement;
            counter.classList.remove('warning', 'error');
            if (length > 260) counter.classList.add('warning');
            if (length > 280) counter.classList.add('error');
            
            // Update preview
            previewText.textContent = this.value || 'Your post content will appear here...';
        });
        
        // Timing option change
        timingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                scheduleDatetimeGroup.style.display = this.value === 'scheduled' ? 'block' : 'none';
            });
        });
        
        // Load connected platforms from API
        async function loadConnectedPlatforms() {
            try {
                const response = await fetch('/api/admin/social/connections');
                const data = await response.json();
                
                if (!data.connections || data.connections.length === 0) {
                    platformsChecklist.innerHTML = \`
                        <div class="no-platforms">
                            <p>No social media accounts connected yet.</p>
                            <p><a href="/updates/admin/social/connections">Connect your accounts</a> to enable auto-posting.</p>
                        </div>
                    \`;
                    return;
                }
                
                // Filter only connected accounts
                const connectedPlatforms = data.connections.filter(c => c.is_connected && c.is_active);
                
                if (connectedPlatforms.length === 0) {
                    platformsChecklist.innerHTML = \`
                        <div class="no-platforms">
                            <p>No active connections found.</p>
                            <p><a href="/updates/admin/social/connections">Set up your accounts</a> to enable auto-posting.</p>
                        </div>
                    \`;
                    return;
                }
                
                platformsChecklist.innerHTML = connectedPlatforms.map(conn => \`
                    <label class="platform-checkbox" data-id="\${conn.id}">
                        <input type="checkbox" name="social_platforms[]" value="\${conn.id}">
                        <span class="platform-icon">\${conn.platform?.icon || '📱'}</span>
                        <div>
                            <div class="platform-name">\${conn.platform?.platform_name || 'Unknown'}</div>
                            <div class="platform-account">\${conn.connection_name}</div>
                        </div>
                    </label>
                \`).join('');
                
                // Add click handlers
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
                platformsChecklist.innerHTML = \`
                    <div class="no-platforms">
                        <p>Failed to load connected platforms.</p>
                        <p>Please refresh the page or <a href="/updates/admin/social/connections">check your connections</a>.</p>
                    </div>
                \`;
            }
        }
        
        // Auto-fill post content from update title
        const updateTitleInput = document.getElementById('title');
        if (updateTitleInput) {
            updateTitleInput.addEventListener('blur', function() {
                if (!postContentInput.value && this.value) {
                    postContentInput.value = this.value;
                    postContentInput.dispatchEvent(new Event('input'));
                }
            });
        }
        
        // Set minimum datetime for scheduling
        const scheduleDatetime = document.getElementById('scheduleDatetime');
        if (scheduleDatetime) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 5); // At least 5 minutes in the future
            const minDate = now.toISOString().slice(0, 16);
            scheduleDatetime.min = minDate;
        }
    })();
</script>
`;

// Function to get just the HTML for embedding
export function getSocialPostSchedulerSection(): string {
    return SocialPostSchedulerHTML;
}
