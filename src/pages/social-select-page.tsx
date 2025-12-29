import { html, raw } from 'hono/html';

interface OAuthSessionData {
  session_id: string;
  platform: string;
  profile_data: {
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
    id?: string;
  };
  organizations: any[];
  access_token: string;
  expires_at: string;
}

// LinkedIn Selection Page
export const LinkedInSelectPage = (admin: any, sessionData: OAuthSessionData | null, error?: string) => {
  const profile = sessionData?.profile_data || {};
  const organizations = sessionData?.organizations || [];
  
  return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select LinkedIn Connection - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        .selection-container {
            max-width: 700px;
            margin: 30px auto;
            padding: 40px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .selection-header {
            text-align: center;
            margin-bottom: 35px;
        }
        
        .selection-header h1 {
            font-size: 2rem;
            font-weight: 800;
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        
        .selection-header p {
            color: #666;
            font-size: 1.1rem;
        }
        
        .linkedin-icon {
            font-size: 2.5rem;
        }
        
        .success-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #d1fae5;
            color: #047857;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            margin-bottom: 25px;
        }
        
        .profile-card {
            background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
            color: white;
            padding: 25px;
            border-radius: 16px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .profile-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            overflow: hidden;
        }
        
        .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .profile-info h3 {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .profile-info p {
            opacity: 0.9;
            font-size: 0.95rem;
        }
        
        .section-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .connection-options {
            margin-bottom: 25px;
        }
        
        .option-card {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 14px;
            padding: 20px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .option-card:hover {
            border-color: #0a66c2;
            background: #f0f7ff;
        }
        
        .option-card.selected {
            border-color: #0a66c2;
            background: #e8f4fc;
            box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.2);
        }
        
        .option-radio {
            width: 24px;
            height: 24px;
            border: 2px solid #ccc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .option-card.selected .option-radio {
            border-color: #0a66c2;
            background: #0a66c2;
        }
        
        .option-card.selected .option-radio::after {
            content: '✓';
            color: white;
            font-size: 14px;
            font-weight: bold;
        }
        
        .option-icon {
            font-size: 2rem;
        }
        
        .option-content {
            flex: 1;
        }
        
        .option-title {
            font-weight: 700;
            color: #333;
            font-size: 1.05rem;
            margin-bottom: 3px;
        }
        
        .option-desc {
            color: #666;
            font-size: 0.9rem;
        }
        
        .org-select {
            margin-top: 15px;
            display: none;
        }
        
        .org-select.visible {
            display: block;
        }
        
        .org-select select {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            background: white;
            cursor: pointer;
        }
        
        .org-select select:focus {
            outline: none;
            border-color: #0a66c2;
        }
        
        .name-input {
            margin-top: 20px;
        }
        
        .name-input label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        
        .name-input input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
        }
        
        .name-input input:focus {
            outline: none;
            border-color: #0a66c2;
        }
        
        .btn-row {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn-cancel {
            flex: 1;
            padding: 16px 24px;
            background: #f8f9fa;
            color: #666;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-cancel:hover {
            background: #e9ecef;
        }
        
        .btn-connect {
            flex: 2;
            padding: 16px 24px;
            background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .btn-connect:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(10, 102, 194, 0.4);
        }
        
        .btn-connect:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .error-message {
            background: #fee2e2;
            border: 1px solid #fca5a5;
            color: #b91c1c;
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        
        .empty-orgs {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            color: #92400e;
            padding: 15px 20px;
            border-radius: 12px;
            margin-top: 15px;
            font-size: 0.9rem;
        }
        
        @media (max-width: 600px) {
            .selection-container {
                margin: 15px;
                padding: 25px;
            }
            
            .btn-row {
                flex-direction: column;
            }
            
            .btn-cancel, .btn-connect {
                flex: none;
                width: 100%;
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
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="selection-container">
            ${error ? `<div class="error-message">⚠️ ${error}</div>` : ''}
            
            <div class="selection-header">
                <div class="success-badge">✓ LinkedIn Connected Successfully!</div>
                <h1><span class="linkedin-icon">💼</span> Select Connection Type</h1>
                <p>Choose how you want to connect your LinkedIn account</p>
            </div>
            
            ${profile.name || profile.email ? `
            <div class="profile-card">
                <div class="profile-avatar">
                    ${profile.picture 
                        ? `<img src="${profile.picture}" alt="Profile">` 
                        : '👤'}
                </div>
                <div class="profile-info">
                    <h3>${profile.name || 'LinkedIn User'}</h3>
                    <p>${profile.email || ''}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="connection-options">
                <h3 class="section-title">📌 Connection Type</h3>
                
                <div class="option-card" data-type="profile" onclick="selectOption(this, 'profile')">
                    <div class="option-radio"></div>
                    <div class="option-icon">👤</div>
                    <div class="option-content">
                        <div class="option-title">Personal Profile</div>
                        <div class="option-desc">Post updates to your personal LinkedIn feed</div>
                    </div>
                </div>
                
                <div class="option-card" data-type="company" onclick="selectOption(this, 'company')">
                    <div class="option-radio"></div>
                    <div class="option-icon">🏢</div>
                    <div class="option-content">
                        <div class="option-title">Company Page</div>
                        <div class="option-desc">Post updates as your company page</div>
                    </div>
                </div>
                
                <div class="org-select" id="orgSelect">
                    ${organizations.length > 0 ? `
                        <select id="organizationId">
                            <option value="">-- Select a Company Page --</option>
                            ${organizations.map((org: any) => `
                                <option value="${org.organization || org.id}" data-name="${org.name || org.organization}">
                                    ${org.name || `Organization ${org.organization || org.id}`}
                                </option>
                            `).join('')}
                        </select>
                    ` : `
                        <div class="empty-orgs">
                            ⚠️ No company pages found. You need to be an admin of a LinkedIn Company Page to connect it.
                        </div>
                    `}
                </div>
            </div>
            
            <div class="name-input">
                <label for="connectionName">Connection Name</label>
                <input type="text" id="connectionName" placeholder="e.g., My LinkedIn Profile" value="${profile.name || 'LinkedIn Connection'}">
            </div>
            
            <div class="btn-row">
                <button class="btn-cancel" onclick="window.location.href='/updates/admin/social/connections'">
                    Cancel
                </button>
                <button class="btn-connect" id="saveBtn" onclick="saveConnection()" disabled>
                    <span>💾</span>
                    <span id="saveBtnText">Save Connection</span>
                </button>
            </div>
        </div>
    </div>
    
    <script>
        let selectedType = null;
        const sessionId = '${sessionData?.session_id || ''}';
        
        function selectOption(card, type) {
            // Remove selection from all cards
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            
            // Select this card
            card.classList.add('selected');
            selectedType = type;
            
            // Show/hide org selector
            const orgSelect = document.getElementById('orgSelect');
            if (type === 'company') {
                orgSelect.classList.add('visible');
            } else {
                orgSelect.classList.remove('visible');
            }
            
            // Update connection name suggestion
            const nameInput = document.getElementById('connectionName');
            if (type === 'profile') {
                nameInput.value = '${profile.name || 'My LinkedIn Profile'}';
            } else if (type === 'company') {
                const orgSelector = document.getElementById('organizationId');
                if (orgSelector && orgSelector.selectedOptions[0]) {
                    const orgName = orgSelector.selectedOptions[0].dataset.name;
                    if (orgName) {
                        nameInput.value = orgName;
                    }
                }
            }
            
            // Enable save button
            document.getElementById('saveBtn').disabled = false;
        }
        
        // Update name when org is selected
        const orgSelector = document.getElementById('organizationId');
        if (orgSelector) {
            orgSelector.addEventListener('change', function() {
                const nameInput = document.getElementById('connectionName');
                const selectedOpt = this.selectedOptions[0];
                if (selectedOpt && selectedOpt.dataset.name) {
                    nameInput.value = selectedOpt.dataset.name;
                }
            });
        }
        
        async function saveConnection() {
            if (!selectedType) {
                alert('Please select a connection type');
                return;
            }
            
            const connectionName = document.getElementById('connectionName').value.trim();
            if (!connectionName) {
                alert('Please enter a connection name');
                return;
            }
            
            let organizationId = null;
            if (selectedType === 'company') {
                const orgSelector = document.getElementById('organizationId');
                if (orgSelector) {
                    organizationId = orgSelector.value;
                    if (!organizationId) {
                        alert('Please select a company page');
                        return;
                    }
                } else {
                    alert('No company pages available');
                    return;
                }
            }
            
            const saveBtn = document.getElementById('saveBtn');
            const saveBtnText = document.getElementById('saveBtnText');
            saveBtn.disabled = true;
            saveBtnText.textContent = 'Saving...';
            
            try {
                const response = await fetch('/api/admin/social/oauth/save/linkedin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        connection_type: selectedType,
                        organization_id: organizationId,
                        connection_name: connectionName
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    alert('✓ ' + (data.message || 'Connection saved successfully!'));
                    window.location.href = '/updates/admin/social/connections';
                } else {
                    alert('Error: ' + (data.error || 'Failed to save connection'));
                    saveBtn.disabled = false;
                    saveBtnText.textContent = 'Save Connection';
                }
            } catch (err) {
                console.error('Save error:', err);
                alert('Error saving connection. Please try again.');
                saveBtn.disabled = false;
                saveBtnText.textContent = 'Save Connection';
            }
        }
    </script>
</body>
</html>
`;
};

// Facebook Selection Page
export const FacebookSelectPage = (admin: any, sessionData: OAuthSessionData | null, error?: string) => {
  const profile = sessionData?.profile_data || {};
  const orgs = sessionData?.organizations as any || {};
  const pages = orgs.pages || [];
  const groups = orgs.groups || [];
  
  return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Facebook Connection - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        .selection-container {
            max-width: 700px;
            margin: 30px auto;
            padding: 40px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .selection-header {
            text-align: center;
            margin-bottom: 35px;
        }
        
        .selection-header h1 {
            font-size: 2rem;
            font-weight: 800;
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        
        .selection-header p {
            color: #666;
            font-size: 1.1rem;
        }
        
        .facebook-icon {
            font-size: 2.5rem;
        }
        
        .success-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #d1fae5;
            color: #047857;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            margin-bottom: 25px;
        }
        
        .profile-card {
            background: linear-gradient(135deg, #1877f2 0%, #0d65d9 100%);
            color: white;
            padding: 25px;
            border-radius: 16px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .profile-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        
        .profile-info h3 {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .profile-info p {
            opacity: 0.9;
        }
        
        .section-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .connection-options {
            margin-bottom: 25px;
        }
        
        .option-card {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 14px;
            padding: 20px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .option-card:hover {
            border-color: #1877f2;
            background: #f0f7ff;
        }
        
        .option-card.selected {
            border-color: #1877f2;
            background: #e7f3ff;
            box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.2);
        }
        
        .option-radio {
            width: 24px;
            height: 24px;
            border: 2px solid #ccc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .option-card.selected .option-radio {
            border-color: #1877f2;
            background: #1877f2;
        }
        
        .option-card.selected .option-radio::after {
            content: '✓';
            color: white;
            font-size: 14px;
            font-weight: bold;
        }
        
        .option-icon {
            font-size: 2rem;
        }
        
        .option-content {
            flex: 1;
        }
        
        .option-title {
            font-weight: 700;
            color: #333;
            font-size: 1.05rem;
            margin-bottom: 3px;
        }
        
        .option-desc {
            color: #666;
            font-size: 0.9rem;
        }
        
        .page-select, .group-select {
            margin-top: 15px;
            display: none;
        }
        
        .page-select.visible, .group-select.visible {
            display: block;
        }
        
        .page-select select, .group-select select {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            background: white;
        }
        
        .page-select select:focus, .group-select select:focus {
            outline: none;
            border-color: #1877f2;
        }
        
        .name-input {
            margin-top: 20px;
        }
        
        .name-input label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        
        .name-input input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
        }
        
        .name-input input:focus {
            outline: none;
            border-color: #1877f2;
        }
        
        .btn-row {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn-cancel {
            flex: 1;
            padding: 16px 24px;
            background: #f8f9fa;
            color: #666;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        }
        
        .btn-cancel:hover {
            background: #e9ecef;
        }
        
        .btn-connect {
            flex: 2;
            padding: 16px 24px;
            background: linear-gradient(135deg, #1877f2 0%, #0d65d9 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .btn-connect:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(24, 119, 242, 0.4);
        }
        
        .btn-connect:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .error-message {
            background: #fee2e2;
            border: 1px solid #fca5a5;
            color: #b91c1c;
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        
        .empty-notice {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            color: #92400e;
            padding: 15px 20px;
            border-radius: 12px;
            margin-top: 15px;
            font-size: 0.9rem;
        }
        
        @media (max-width: 600px) {
            .selection-container {
                margin: 15px;
                padding: 25px;
            }
            
            .btn-row {
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
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="selection-container">
            ${error ? `<div class="error-message">⚠️ ${error}</div>` : ''}
            
            <div class="selection-header">
                <div class="success-badge">✓ Facebook Connected Successfully!</div>
                <h1><span class="facebook-icon">📘</span> Select Connection Type</h1>
                <p>Choose a Page or Group to connect</p>
            </div>
            
            ${profile.name || profile.email ? `
            <div class="profile-card">
                <div class="profile-avatar">👤</div>
                <div class="profile-info">
                    <h3>${profile.name || 'Facebook User'}</h3>
                    <p>${profile.email || ''}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="connection-options">
                <h3 class="section-title">📌 Connection Type</h3>
                
                <div class="option-card" data-type="page" onclick="selectOption(this, 'page')">
                    <div class="option-radio"></div>
                    <div class="option-icon">📘</div>
                    <div class="option-content">
                        <div class="option-title">Facebook Page</div>
                        <div class="option-desc">Post updates to a Facebook Page you manage</div>
                    </div>
                </div>
                
                <div class="page-select" id="pageSelect">
                    ${pages.length > 0 ? `
                        <select id="pageId">
                            <option value="">-- Select a Page --</option>
                            ${pages.map((page: any) => `
                                <option value="${page.id}" data-name="${page.name}" data-token="${page.access_token || ''}">
                                    ${page.name}
                                </option>
                            `).join('')}
                        </select>
                    ` : `
                        <div class="empty-notice">
                            ⚠️ No Facebook Pages found. You need to be an admin of a Facebook Page to connect it.
                        </div>
                    `}
                </div>
                
                <div class="option-card" data-type="group" onclick="selectOption(this, 'group')">
                    <div class="option-radio"></div>
                    <div class="option-icon">👥</div>
                    <div class="option-content">
                        <div class="option-title">Facebook Group</div>
                        <div class="option-desc">Post updates to a Facebook Group you manage</div>
                    </div>
                </div>
                
                <div class="group-select" id="groupSelect">
                    ${groups.length > 0 ? `
                        <select id="groupId">
                            <option value="">-- Select a Group --</option>
                            ${groups.map((group: any) => `
                                <option value="${group.id}" data-name="${group.name}">
                                    ${group.name}
                                </option>
                            `).join('')}
                        </select>
                    ` : `
                        <div class="empty-notice">
                            ⚠️ No Facebook Groups found where you are an admin.
                        </div>
                    `}
                </div>
            </div>
            
            <div class="name-input">
                <label for="connectionName">Connection Name</label>
                <input type="text" id="connectionName" placeholder="e.g., My Business Page" value="">
            </div>
            
            <div class="btn-row">
                <button class="btn-cancel" onclick="window.location.href='/updates/admin/social/connections'">
                    Cancel
                </button>
                <button class="btn-connect" id="saveBtn" onclick="saveConnection()" disabled>
                    <span>💾</span>
                    <span id="saveBtnText">Save Connection</span>
                </button>
            </div>
        </div>
    </div>
    
    <script>
        let selectedType = null;
        const sessionId = '${sessionData?.session_id || ''}';
        
        function selectOption(card, type) {
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedType = type;
            
            // Show/hide selectors
            const pageSelect = document.getElementById('pageSelect');
            const groupSelect = document.getElementById('groupSelect');
            
            if (type === 'page') {
                pageSelect.classList.add('visible');
                groupSelect.classList.remove('visible');
            } else if (type === 'group') {
                pageSelect.classList.remove('visible');
                groupSelect.classList.add('visible');
            }
            
            document.getElementById('saveBtn').disabled = false;
        }
        
        // Update name when page/group is selected
        document.getElementById('pageId')?.addEventListener('change', function() {
            const nameInput = document.getElementById('connectionName');
            const selectedOpt = this.selectedOptions[0];
            if (selectedOpt && selectedOpt.dataset.name) {
                nameInput.value = selectedOpt.dataset.name;
            }
        });
        
        document.getElementById('groupId')?.addEventListener('change', function() {
            const nameInput = document.getElementById('connectionName');
            const selectedOpt = this.selectedOptions[0];
            if (selectedOpt && selectedOpt.dataset.name) {
                nameInput.value = selectedOpt.dataset.name;
            }
        });
        
        async function saveConnection() {
            if (!selectedType) {
                alert('Please select a connection type');
                return;
            }
            
            const connectionName = document.getElementById('connectionName').value.trim();
            if (!connectionName) {
                alert('Please enter a connection name');
                return;
            }
            
            let pageId = null;
            let groupId = null;
            let pageAccessToken = null;
            
            if (selectedType === 'page') {
                const pageSelector = document.getElementById('pageId');
                if (pageSelector) {
                    pageId = pageSelector.value;
                    pageAccessToken = pageSelector.selectedOptions[0]?.dataset?.token || null;
                    if (!pageId) {
                        alert('Please select a page');
                        return;
                    }
                }
            } else if (selectedType === 'group') {
                const groupSelector = document.getElementById('groupId');
                if (groupSelector) {
                    groupId = groupSelector.value;
                    if (!groupId) {
                        alert('Please select a group');
                        return;
                    }
                }
            }
            
            const saveBtn = document.getElementById('saveBtn');
            const saveBtnText = document.getElementById('saveBtnText');
            saveBtn.disabled = true;
            saveBtnText.textContent = 'Saving...';
            
            try {
                const response = await fetch('/api/admin/social/oauth/save/facebook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        connection_type: selectedType,
                        page_id: pageId,
                        group_id: groupId,
                        connection_name: connectionName,
                        page_access_token: pageAccessToken
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    alert('✓ ' + (data.message || 'Connection saved successfully!'));
                    window.location.href = '/updates/admin/social/connections';
                } else {
                    alert('Error: ' + (data.error || 'Failed to save connection'));
                    saveBtn.disabled = false;
                    saveBtnText.textContent = 'Save Connection';
                }
            } catch (err) {
                console.error('Save error:', err);
                alert('Error saving connection. Please try again.');
                saveBtn.disabled = false;
                saveBtnText.textContent = 'Save Connection';
            }
        }
    </script>
</body>
</html>
`;
};
