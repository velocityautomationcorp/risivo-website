import { Hono } from "hono";

// Import route modules for Project Updates Platform
import adminAuth from "./routes/admin-auth";
import userAuth from "./routes/user-auth";
import investorAuth from "./routes/investor-auth";
import updates from "./routes/updates";
import adminUpdates from "./routes/admin-updates";
import adminWaitlist from "./routes/admin-waitlist";
import adminCategories from "./routes/admin-categories";
import adminInvestor from "./routes/admin-investor";
import adminInvestorContent from "./routes/admin-investor-content";
import adminInvestorUpdates from "./routes/admin-investor-updates";
import updateInteractions from "./routes/update-interactions";
import waitlist from "./routes/waitlist";
import contact from "./routes/contact";
import newsletter from "./routes/newsletter";
import uploadRoute from "./routes/upload";
import errorReporting from "./routes/error-reporting";

type Bindings = {
  WEBHOOK_URL?: string;
  ENABLE_FULL_SITE?: string;
  ENVIRONMENT?: string;
  DATABASE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// Mount API Routes for Project Updates Platform
// ============================================
app.route("/api/admin", adminAuth);           // Admin authentication
app.route("/api/admin/updates", adminUpdates); // Admin updates management
app.route("/api/admin/waitlist", adminWaitlist); // Admin waitlist management
app.route("/api/admin/categories", adminCategories); // Admin categories management
app.route("/api/admin/investors", adminInvestor); // Admin investor management
app.route("/api/admin/investor-content", adminInvestorContent); // Admin investor content
app.route("/api/admin/investor-updates", adminInvestorUpdates); // Admin investor updates
app.route("/api/user", userAuth);             // User authentication
app.route("/api/investor", investorAuth);     // Investor authentication
app.route("/api/updates", updates);           // Public updates API
app.route("/api/interactions", updateInteractions); // Update interactions (likes, etc.)
app.route("/api/waitlist", waitlist);         // Waitlist signup
app.route("/api/contact", contact);           // Contact form
app.route("/api/newsletter", newsletter);     // Newsletter signup
app.route("/api/upload", uploadRoute);        // Image upload
app.route("/api", errorReporting);            // Error reporting system

// ============================================
// Login Page Routes (HTML Pages)
// ============================================

// Admin login page
app.get("/updates/admin/login", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login - Risivo Updates</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo h1 {
      color: #667eea;
      font-size: 28px;
      font-weight: 700;
    }
    .logo p {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 24px;
      font-size: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    .error {
      background: #fee2e2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: none;
    }
    .error.show { display: block; }
    .back-link {
      display: block;
      text-align: center;
      margin-top: 20px;
      color: #667eea;
      text-decoration: none;
    }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="logo">
      <h1>Risivo</h1>
      <p>Admin Portal</p>
    </div>
    <h2>Admin Login</h2>
    <div id="error" class="error"></div>
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="admin@risivo.com">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required placeholder="Enter your password">
      </div>
      <button type="submit" id="submitBtn">Sign In</button>
    </form>
    <a href="/updates/login" class="back-link">User Login →</a>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const error = document.getElementById('error');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      error.classList.remove('show');
      
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          window.location.href = '/updates/admin/dashboard';
        } else {
          error.textContent = data.details || data.error || 'Login failed';
          error.classList.add('show');
        }
      } catch (err) {
        error.textContent = 'Network error. Please try again.';
        error.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });
  </script>
</body>
</html>
  `);
});

// Admin dashboard page - Complete CMS with full CRUD functionality
app.get("/updates/admin/dashboard", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Risivo CMS</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- Quill Rich Text Editor -->
  <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
  <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: #f5f7fa; min-height: 100vh; }
    
    /* Header */
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0 24px; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3); position: sticky; top: 0; z-index: 100; }
    .header-inner { max-width: 1600px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 64px; }
    .header-logo { display: flex; align-items: center; gap: 12px; }
    .header-logo img { height: 32px; filter: brightness(0) invert(1); }
    .header-logo .badge { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: 600; }
    .header-nav { display: flex; gap: 4px; }
    .nav-btn { color: white; background: transparent; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .nav-btn:hover, .nav-btn.active { background: rgba(255,255,255,0.2); }
    .header-actions { display: flex; gap: 12px; align-items: center; }
    .admin-email { font-size: 13px; opacity: 0.9; }
    .logout-btn { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
    .logout-btn:hover { background: rgba(255,255,255,0.25); }
    
    /* Main Layout */
    .main-container { max-width: 1600px; margin: 0 auto; padding: 24px; }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; align-items: center; gap: 16px; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .stat-icon.investors { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.waitlist { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.docs { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.updates { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-icon.pending { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .stat-info .stat-number { font-size: 28px; font-weight: 800; color: #1a1a2e; line-height: 1; }
    .stat-info .stat-label { font-size: 12px; color: #888; margin-top: 4px; }
    
    /* Tabs */
    .tabs-container { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 24px; overflow: hidden; }
    .tabs-header { display: flex; border-bottom: 1px solid #eee; background: #fafafa; padding: 0 16px; overflow-x: auto; }
    .tab-btn { background: none; border: none; padding: 16px 20px; font-size: 14px; font-weight: 600; color: #666; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; }
    .tab-btn:hover { color: #667eea; }
    .tab-btn.active { color: #667eea; border-bottom-color: #667eea; background: white; }
    .tab-content { display: none; padding: 20px; }
    .tab-content.active { display: block; }
    
    /* Section Header */
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
    .section-title { font-size: 18px; font-weight: 700; color: #1a1a2e; display: flex; align-items: center; gap: 10px; }
    .section-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn { padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; display: inline-flex; align-items: center; gap: 6px; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .btn-secondary { background: #f0f0f0; color: #333; }
    .btn-secondary:hover { background: #e0e0e0; }
    .btn-danger { background: #fee2e2; color: #dc2626; }
    .btn-danger:hover { background: #fecaca; }
    .btn-success { background: #dcfce7; color: #16a34a; }
    .btn-success:hover { background: #bbf7d0; }
    
    /* Table */
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #f0f0f0; }
    .data-table th { background: #f8f9fc; font-weight: 600; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; position: sticky; top: 0; }
    .data-table td { font-size: 14px; color: #333; vertical-align: middle; }
    .data-table tr:hover td { background: #fafafa; }
    .data-table .checkbox { width: 40px; }
    .data-table input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
    
    /* Status Badges */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: 600; }
    .badge-active, .badge-published { background: #dcfce7; color: #16a34a; }
    .badge-pending, .badge-pending_nda { background: #fef3c7; color: #d97706; }
    .badge-nda_signed { background: #dbeafe; color: #2563eb; }
    .badge-draft { background: #f3f4f6; color: #6b7280; }
    .badge-rejected, .badge-inactive { background: #fee2e2; color: #dc2626; }
    .badge-standard { background: #e0e7ff; color: #4f46e5; }
    .badge-premium { background: #fef3c7; color: #d97706; }
    .badge-enterprise { background: #f3e8ff; color: #9333ea; }
    
    /* Action Buttons */
    .action-btns { display: flex; gap: 4px; }
    .action-btn { background: none; border: none; padding: 6px 8px; cursor: pointer; border-radius: 6px; transition: all 0.2s; font-size: 14px; }
    .action-btn:hover { background: #f0f0f0; }
    .action-btn.edit:hover { background: #dbeafe; }
    .action-btn.delete:hover { background: #fee2e2; }
    .action-btn.approve:hover { background: #dcfce7; }
    .action-btn.reject:hover { background: #fee2e2; }
    .action-btn.view:hover { background: #f3e8ff; }
    
    /* Modal */
    .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
    .modal-overlay.show { display: flex; }
    .modal { background: white; border-radius: 16px; max-width: 600px; width: 90%; max-height: 90vh; overflow: auto; }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
    .modal-title { font-size: 18px; font-weight: 700; color: #1a1a2e; }
    .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 4px; line-height: 1; }
    .modal-close:hover { color: #333; }
    .modal-body { padding: 24px; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 12px; }
    
    /* Form */
    .form-group { margin-bottom: 16px; }
    .form-label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 13px; color: #333; }
    .form-input, .form-select, .form-textarea { width: 100%; padding: 10px 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; }
    .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #667eea; }
    .form-textarea { min-height: 100px; resize: vertical; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-hint { font-size: 12px; color: #888; margin-top: 4px; }
    
    /* Upload Components */
    .upload-area { border: 2px dashed #e0e0e0; border-radius: 8px; padding: 16px; text-align: center; background: #fafafa; transition: all 0.2s; }
    .upload-area:hover { border-color: #667eea; background: #f5f5ff; }
    .upload-area.dragging { border-color: #667eea; background: #f0f0ff; }
    .upload-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
    .upload-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
    .upload-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .image-preview { position: relative; display: inline-block; margin-bottom: 12px; }
    .image-preview img { max-width: 100%; max-height: 200px; border-radius: 8px; display: block; }
    .remove-image-btn { position: absolute; top: -8px; right: -8px; background: #dc2626; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 16px; line-height: 1; display: flex; align-items: center; justify-content: center; }
    .remove-image-btn:hover { background: #b91c1c; }
    .gallery-upload-area { border: 2px dashed #e0e0e0; border-radius: 8px; padding: 16px; background: #fafafa; }
    .gallery-preview { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; margin-bottom: 12px; }
    .gallery-preview:empty { display: none; }
    .gallery-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    .gallery-item .remove-image-btn { top: 4px; right: 4px; width: 20px; height: 20px; font-size: 14px; }
    .upload-progress { margin-top: 8px; font-size: 12px; color: #667eea; }
    
    /* Quill Editor */
    .ql-container { font-family: 'Inter', sans-serif; font-size: 14px; }
    .ql-editor { min-height: 200px; max-height: 400px; }
    .ql-toolbar { border-radius: 8px 8px 0 0; border-color: #e0e0e0; }
    .ql-container { border-radius: 0 0 8px 8px; border-color: #e0e0e0; }
    .ql-editor.ql-blank::before { font-style: normal; color: #aaa; }
    
    /* Empty State */
    .empty-state { text-align: center; padding: 60px 20px; color: #888; }
    .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
    .empty-state h3 { font-size: 18px; color: #333; margin-bottom: 8px; }
    
    /* Loading */
    .loading { text-align: center; padding: 40px; color: #666; }
    .spinner { width: 32px; height: 32px; border: 3px solid #f0f0f0; border-top-color: #667eea; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    /* Toast */
    .toast-container { position: fixed; top: 20px; right: 20px; z-index: 2000; }
    .toast { background: white; border-radius: 8px; padding: 12px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); margin-bottom: 8px; display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease; }
    .toast.success { border-left: 4px solid #16a34a; }
    .toast.error { border-left: 4px solid #dc2626; }
    .toast.info { border-left: 4px solid #2563eb; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    
    /* Footer */
    .footer { background: #1a1a2e; color: white; padding: 20px 24px; text-align: center; margin-top: 40px; }
    .footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 12px; flex-wrap: wrap; }
    .footer-links a { color: white; text-decoration: none; opacity: 0.7; font-size: 13px; }
    .footer-links a:hover { opacity: 1; }
    .footer p { font-size: 12px; opacity: 0.6; }
    
    /* Responsive */
    @media (max-width: 768px) {
      .header-nav { display: none; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .form-row { grid-template-columns: 1fr; }
      .section-header { flex-direction: column; align-items: flex-start; }
      .data-table { font-size: 12px; }
      .data-table th, .data-table td { padding: 8px 12px; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <div class="header-logo">
        <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<span style=\\'font-size:20px;font-weight:800\\'>Risivo</span>'">
        <span class="badge">Admin CMS</span>
      </div>
      <nav class="header-nav">
        <button class="nav-btn active" onclick="switchTab('overview')">📊 Overview</button>
        <button class="nav-btn" onclick="switchTab('investors')">👥 Investors</button>
        <button class="nav-btn" onclick="switchTab('waitlist')">📋 Waitlist</button>
        <button class="nav-btn" onclick="switchTab('documents')">📁 Documents</button>
        <button class="nav-btn" onclick="switchTab('updates')">📰 Updates</button>
      </nav>
      <div class="header-actions">
        <span class="admin-email" id="adminEmail">Loading...</span>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
  </header>
  
  <main class="main-container">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon investors">👥</div>
        <div class="stat-info">
          <div class="stat-number" id="investorCount">-</div>
          <div class="stat-label">Total Investors</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon waitlist">📋</div>
        <div class="stat-info">
          <div class="stat-number" id="waitlistCount">-</div>
          <div class="stat-label">Waitlist</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon docs">📁</div>
        <div class="stat-info">
          <div class="stat-number" id="documentCount">-</div>
          <div class="stat-label">Documents</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon updates">📰</div>
        <div class="stat-info">
          <div class="stat-number" id="updateCount">-</div>
          <div class="stat-label">Updates</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pending">⏳</div>
        <div class="stat-info">
          <div class="stat-number" id="pendingCount">-</div>
          <div class="stat-label">Pending Approval</div>
        </div>
      </div>
    </div>
    
    <!-- Tabs Container -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button class="tab-btn active" data-tab="overview">📊 Overview</button>
        <button class="tab-btn" data-tab="investors">👥 Investors</button>
        <button class="tab-btn" data-tab="waitlist">📋 Waitlist</button>
        <button class="tab-btn" data-tab="documents">📁 Documents</button>
        <button class="tab-btn" data-tab="investor-updates">📰 Investor Updates</button>
        <button class="tab-btn" data-tab="waitlist-updates">📢 Waitlist Updates</button>
        <button class="tab-btn" data-tab="categories">🏷️ Categories</button>
      </div>
      
      <!-- Overview Tab -->
      <div class="tab-content active" id="tab-overview">
        <div class="section-header">
          <h2 class="section-title">📊 Dashboard Overview</h2>
        </div>
        <p style="color: #666; margin-bottom: 20px;">Quick summary of your platform activity. Use the tabs above to manage specific sections.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div style="background: #f8f9fc; border-radius: 12px; padding: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 12px;">📈 Recent Activity</h3>
            <div id="recentActivity" style="color: #666; font-size: 14px;">Loading...</div>
          </div>
          <div style="background: #f8f9fc; border-radius: 12px; padding: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 12px;">⚡ Quick Actions</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-primary" onclick="switchTab('documents'); openAddDocumentModal();">+ Add Document</button>
              <button class="btn btn-primary" onclick="switchTab('investor-updates'); openAddInvestorUpdateModal();">+ Add Investor Update</button>
              <button class="btn btn-secondary" onclick="exportInvestorsCSV()">📥 Export Investors CSV</button>
              <button class="btn btn-secondary" onclick="exportWaitlistCSV()">📥 Export Waitlist CSV</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Investors Tab -->
      <div class="tab-content" id="tab-investors">
        <div class="section-header">
          <h2 class="section-title">👥 Investor Management</h2>
          <div class="section-actions">
            <button class="btn btn-secondary" onclick="exportInvestorsCSV()">📥 Export CSV</button>
            <button class="btn btn-primary" onclick="loadInvestors()">🔄 Refresh</button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Business</th>
                <th>Status</th>
                <th>Tier</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="investorsTableBody">
              <tr><td colspan="7" class="loading"><div class="spinner"></div>Loading investors...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Waitlist Tab -->
      <div class="tab-content" id="tab-waitlist">
        <div class="section-header">
          <h2 class="section-title">📋 Waitlist Subscribers</h2>
          <div class="section-actions">
            <button class="btn btn-secondary" onclick="exportWaitlistCSV()">📥 Export CSV</button>
            <button class="btn btn-primary" onclick="loadWaitlist()">🔄 Refresh</button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Source</th>
                <th>Subscribed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="waitlistTableBody">
              <tr><td colspan="5" class="loading"><div class="spinner"></div>Loading waitlist...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Documents Tab -->
      <div class="tab-content" id="tab-documents">
        <div class="section-header">
          <h2 class="section-title">📁 Investor Documents</h2>
          <div class="section-actions">
            <button class="btn btn-primary" onclick="openAddDocumentModal()">+ Add Document</button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="documentsTableBody">
              <tr><td colspan="6" class="loading"><div class="spinner"></div>Loading documents...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Investor Updates Tab -->
      <div class="tab-content" id="tab-investor-updates">
        <div class="section-header">
          <h2 class="section-title">📰 Investor Updates</h2>
          <div class="section-actions">
            <button class="btn btn-primary" onclick="openAddInvestorUpdateModal()">+ Add Update</button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="investorUpdatesTableBody">
              <tr><td colspan="5" class="loading"><div class="spinner"></div>Loading updates...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Waitlist Updates Tab -->
      <div class="tab-content" id="tab-waitlist-updates">
        <div class="section-header">
          <h2 class="section-title">📢 Waitlist Updates</h2>
          <div class="section-actions">
            <button class="btn btn-primary" onclick="openAddWaitlistUpdateModal()">+ Add Update</button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="waitlistUpdatesTableBody">
              <tr><td colspan="5" class="loading"><div class="spinner"></div>Loading updates...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Categories Tab -->
      <div class="tab-content" id="tab-categories">
        <div class="section-header">
          <h2 class="section-title">🏷️ Category Management</h2>
          <div class="section-actions">
            <button class="btn btn-primary" onclick="openAddCategoryModal('investor')">+ Investor Category</button>
            <button class="btn btn-secondary" onclick="openAddCategoryModal('waitlist')">+ Waitlist Category</button>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3 style="font-size: 16px; margin-bottom: 12px;">Investor Categories</h3>
            <div id="investorCategoriesList" style="background: #f8f9fc; border-radius: 8px; padding: 16px;">Loading...</div>
          </div>
          <div>
            <h3 style="font-size: 16px; margin-bottom: 12px;">Waitlist Categories</h3>
            <div id="waitlistCategoriesList" style="background: #f8f9fc; border-radius: 8px; padding: 16px;">Loading...</div>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="footer-links">
      <a href="/">Main Site</a>
      <a href="/updates/investor/login">Investor Portal</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms-of-service">Terms of Service</a>
    </div>
    <p>© ${currentYear} Risivo ™ Owned by Velocity Automation Corp. All rights reserved.</p>
  </footer>
  
  <!-- Toast Container -->
  <div class="toast-container" id="toastContainer"></div>
  
  <!-- Add/Edit Document Modal -->
  <div class="modal-overlay" id="documentModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title" id="documentModalTitle">Add Document</h3>
        <button class="modal-close" onclick="closeModal('documentModal')">&times;</button>
      </div>
      <div class="modal-body">
        <form id="documentForm">
          <input type="hidden" id="docId">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="docTitle" required placeholder="e.g., Pitch Deck">
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="docDescription" placeholder="Brief description of this document"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Content Type *</label>
              <select class="form-select" id="docType" required>
                <option value="document">Document</option>
                <option value="presentation">Presentation</option>
                <option value="spreadsheet">Spreadsheet</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Icon</label>
              <select class="form-select" id="docIcon">
                <option value="📊">📊 Presentation</option>
                <option value="📈">📈 Chart</option>
                <option value="📋">📋 Document</option>
                <option value="📄">📄 File</option>
                <option value="📝">📝 Summary</option>
                <option value="💰">💰 Financial</option>
                <option value="💼">💼 Business</option>
                <option value="🎬">🎬 Video</option>
                <option value="🖼️">🖼️ Image</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">File/Embed URL *</label>
            <input type="url" class="form-input" id="docFileUrl" required placeholder="https://drive.google.com/file/d/.../preview">
            <div class="form-hint">Use Google Drive preview links (ending with /preview) for best results</div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">CTA Button Text</label>
              <input type="text" class="form-input" id="docCta" placeholder="View Document">
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" id="docStatus">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Sort Order</label>
            <input type="number" class="form-input" id="docSortOrder" value="0" min="0">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal('documentModal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveDocument()">Save Document</button>
      </div>
    </div>
  </div>
  
  <!-- Add/Edit Investor Update Modal -->
  <div class="modal-overlay" id="investorUpdateModal">
    <div class="modal" style="max-width: 700px;">
      <div class="modal-header">
        <h3 class="modal-title" id="investorUpdateModalTitle">Add Investor Update</h3>
        <button class="modal-close" onclick="closeModal('investorUpdateModal')">&times;</button>
      </div>
      <div class="modal-body">
        <form id="investorUpdateForm">
          <input type="hidden" id="invUpdateId">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="invUpdateTitle" required placeholder="Update title">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="invUpdateCategory">
                <option value="">Select category...</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" id="invUpdateStatus">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Excerpt</label>
            <textarea class="form-textarea" id="invUpdateExcerpt" placeholder="Brief summary of this update" style="min-height: 60px;"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Content *</label>
            <div id="invUpdateContentEditor" style="background: white;"></div>
            <input type="hidden" id="invUpdateContent">
          </div>
          <div class="form-group">
            <label class="form-label">Featured Image</label>
            <div class="upload-area" id="invFeaturedImageArea">
              <input type="file" id="invFeaturedImageInput" accept="image/*" style="display:none" onchange="handleInvFeaturedUpload(this)">
              <div id="invFeaturedImagePreview" class="image-preview" style="display:none;">
                <img id="invFeaturedImageImg" src="" alt="Preview">
                <button type="button" class="remove-image-btn" onclick="removeInvFeaturedImage()">&times;</button>
              </div>
              <button type="button" class="upload-btn" id="invFeaturedImageBtn" onclick="document.getElementById('invFeaturedImageInput').click()">
                📷 Upload Featured Image
              </button>
              <input type="hidden" id="invUpdateImage" value="">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Video URL (YouTube)</label>
            <input type="url" class="form-input" id="invUpdateVideo" placeholder="https://youtube.com/watch?v=...">
          </div>
          <div class="form-group">
            <label class="form-label">Image Gallery</label>
            <div class="gallery-upload-area" id="invGalleryArea">
              <input type="file" id="invGalleryInput" accept="image/*" multiple style="display:none" onchange="handleInvGalleryUpload(this)">
              <div id="invGalleryPreview" class="gallery-preview"></div>
              <button type="button" class="upload-btn" onclick="document.getElementById('invGalleryInput').click()">
                🖼️ Add Gallery Images (max 10)
              </button>
              <input type="hidden" id="invGalleryImages" value="[]">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Author Name</label>
            <input type="text" class="form-input" id="invUpdateAuthor" placeholder="Risivo Team" value="Risivo Team">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal('investorUpdateModal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveInvestorUpdate()">Save Update</button>
      </div>
    </div>
  </div>
  
  <!-- Add/Edit Waitlist Update Modal -->
  <div class="modal-overlay" id="waitlistUpdateModal">
    <div class="modal" style="max-width: 700px;">
      <div class="modal-header">
        <h3 class="modal-title" id="waitlistUpdateModalTitle">Add Waitlist Update</h3>
        <button class="modal-close" onclick="closeModal('waitlistUpdateModal')">&times;</button>
      </div>
      <div class="modal-body">
        <form id="waitlistUpdateForm">
          <input type="hidden" id="wlUpdateId">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="wlUpdateTitle" required placeholder="Update title">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="wlUpdateCategory">
                <option value="">Select category...</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" id="wlUpdateStatus">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Excerpt</label>
            <textarea class="form-textarea" id="wlUpdateExcerpt" placeholder="Brief summary of this update"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Content *</label>
            <div id="wlUpdateContentEditor" style="height: 200px; background: white;"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Featured Image</label>
            <div class="upload-area" id="wlFeaturedImageArea">
              <input type="file" id="wlFeaturedImageInput" accept="image/*" style="display:none" onchange="handleWlFeaturedUpload(this)">
              <div id="wlFeaturedImagePreview" class="image-preview" style="display:none;">
                <img id="wlFeaturedImageImg" src="" alt="Preview">
                <button type="button" class="remove-image-btn" onclick="removeWlFeaturedImage()">&times;</button>
              </div>
              <button type="button" class="upload-btn" id="wlFeaturedImageBtn" onclick="document.getElementById('wlFeaturedImageInput').click()">
                📷 Upload Featured Image
              </button>
              <input type="hidden" id="wlUpdateImage" value="">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Video URL (YouTube)</label>
            <input type="url" class="form-input" id="wlUpdateVideo" placeholder="https://youtube.com/watch?v=...">
          </div>
          <div class="form-group">
            <label class="form-label">Image Gallery</label>
            <div class="gallery-upload-area" id="wlGalleryArea">
              <input type="file" id="wlGalleryInput" accept="image/*" multiple style="display:none" onchange="handleWlGalleryUpload(this)">
              <div id="wlGalleryPreview" class="gallery-preview"></div>
              <button type="button" class="upload-btn" onclick="document.getElementById('wlGalleryInput').click()">
                🖼️ Add Gallery Images (max 10)
              </button>
              <input type="hidden" id="wlGalleryImages" value="[]">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Author</label>
            <input type="text" class="form-input" id="wlUpdateAuthor" value="Risivo Team">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal('waitlistUpdateModal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveWaitlistUpdate()">Save Update</button>
      </div>
    </div>
  </div>
  
  <!-- Confirm Delete Modal -->
  <div class="modal-overlay" id="confirmModal">
    <div class="modal" style="max-width: 400px;">
      <div class="modal-header">
        <h3 class="modal-title">Confirm Delete</h3>
        <button class="modal-close" onclick="closeModal('confirmModal')">&times;</button>
      </div>
      <div class="modal-body">
        <p id="confirmMessage">Are you sure you want to delete this item? This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal('confirmModal')">Cancel</button>
        <button class="btn btn-danger" id="confirmDeleteBtn" onclick="confirmDelete()">Delete</button>
      </div>
    </div>
  </div>
  
  <!-- View Investor Modal -->
  <div class="modal-overlay" id="viewInvestorModal">
    <div class="modal" style="max-width: 500px;">
      <div class="modal-header">
        <h3 class="modal-title">Investor Details</h3>
        <button class="modal-close" onclick="closeModal('viewInvestorModal')">&times;</button>
      </div>
      <div class="modal-body" id="investorDetailsContent">
        <div class="loading"><div class="spinner"></div>Loading...</div>
      </div>
      <div class="modal-footer" id="investorDetailsActions"></div>
    </div>
  </div>
  
  <script>
    // Global state
    let investors = [];
    let waitlist = [];
    let documents = [];
    let investorUpdates = [];
    let waitlistUpdates = [];
    let investorCategories = [];
    let waitlistCategories = [];
    let deleteTarget = null;
    let invUpdateQuill = null;
    let wlUpdateQuill = null;
    
    // Initialize Quill Editors
    invUpdateQuill = new Quill('#invUpdateContentEditor', {
      theme: 'snow',
      placeholder: 'Write your update content here...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean']
        ]
      }
    });
    
    // Initialize Waitlist Update Quill Editor
    wlUpdateQuill = new Quill('#wlUpdateContentEditor', {
      theme: 'snow',
      placeholder: 'Write your project update here...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean']
        ]
      }
    });
    
    let adminUser = null;
    
    // Global Error Tracking
    window.onerror = function(message, source, lineno, colno, error) {
      reportError('JavaScript Error', message, error ? error.stack : null);
      return false;
    };
    
    window.onunhandledrejection = function(event) {
      reportError('Unhandled Promise Rejection', event.reason ? event.reason.message || String(event.reason) : 'Unknown', event.reason ? event.reason.stack : null);
    };
    
    function reportError(errorType, errorMessage, errorStack) {
      try {
        fetch('/api/report-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            errorType,
            errorMessage: String(errorMessage).substring(0, 1000),
            errorStack: errorStack ? String(errorStack).substring(0, 2000) : null,
            userEmail: adminUser ? adminUser.email : 'admin@risivo.com',
            userName: 'Admin',
            userType: 'admin',
            pageUrl: window.location.href,
            additionalInfo: 'Admin Dashboard'
          })
        }).catch(e => console.error('Error reporting failed:', e));
      } catch (e) {
        console.error('Error reporting failed:', e);
      }
    }
    
    // Initialize
    async function init() {
      try {
        const meRes = await fetch('/api/admin/me');
        const meData = await meRes.json();
        
        if (!meData.success) {
          window.location.href = '/updates/admin/login';
          return;
        }
        
        adminUser = meData.admin;
        document.getElementById('adminEmail').textContent = meData.admin.email;
        
        // Load all data
        await Promise.all([
          loadInvestors(),
          loadWaitlistUsers(),
          loadDocuments(),
          loadInvestorUpdates(),
          loadWaitlistUpdates(),
          loadInvestorCategories(),
          loadWaitlistCategories()
        ]);
        
        updateRecentActivity();
        
      } catch (error) {
        console.error('Init error:', error);
        reportError('Admin Init Error', error.message, error.stack);
        window.location.href = '/updates/admin/login';
      }
    }
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });
    
    function switchTab(tabName) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const tabBtn = document.querySelector(\`.tab-btn[data-tab="\${tabName}"]\`);
      if (tabBtn) tabBtn.classList.add('active');
      const tabContent = document.getElementById('tab-' + tabName);
      if (tabContent) tabContent.classList.add('active');
    }
    
    // Toast notifications
    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = 'toast ' + type;
      toast.innerHTML = \`<span>\${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> \${message}\`;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }
    
    // Modal functions
    function openModal(id) { document.getElementById(id).classList.add('show'); }
    function closeModal(id) { document.getElementById(id).classList.remove('show'); }
    
    // Load Investors
    async function loadInvestors() {
      try {
        const res = await fetch('/api/admin/investors/investors');
        const data = await res.json();
        
        if (data.success && data.investors) {
          investors = data.investors;
          const realInvestors = investors.filter(i => i.user_type === 'investor');
          const pending = realInvestors.filter(i => ['pending_nda', 'nda_signed'].includes(i.investor_status));
          
          document.getElementById('investorCount').textContent = realInvestors.length;
          document.getElementById('pendingCount').textContent = pending.length;
          
          renderInvestorsTable(realInvestors);
        }
      } catch (error) {
        console.error('Load investors error:', error);
        showToast('Failed to load investors', 'error');
      }
    }
    
    // Load Waitlist Users (from waitlist_users table)
    async function loadWaitlistUsers() {
      try {
        const res = await fetch('/api/admin/waitlist/users');
        const data = await res.json();
        
        if (data.success && data.waitlistUsers) {
          waitlist = data.waitlistUsers;
          document.getElementById('waitlistCount').textContent = waitlist.length;
          renderWaitlistTable(waitlist);
        }
      } catch (error) {
        console.error('Load waitlist error:', error);
        showToast('Failed to load waitlist', 'error');
      }
    }
    
    function renderInvestorsTable(data) {
      const tbody = document.getElementById('investorsTableBody');
      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><div class="empty-state-icon">👥</div><h3>No investors yet</h3></td></tr>';
        return;
      }
      tbody.innerHTML = data.map(inv => \`
        <tr>
          <td><strong>\${escapeHtml(inv.first_name || '')} \${escapeHtml(inv.last_name || '')}</strong></td>
          <td>\${escapeHtml(inv.email)}</td>
          <td>\${escapeHtml(inv.business_name || '-')}</td>
          <td><span class="badge badge-\${inv.investor_status || 'pending'}">\${inv.investor_status || 'pending'}</span></td>
          <td><span class="badge badge-\${inv.investor_tier || 'standard'}">\${inv.investor_tier || 'standard'}</span></td>
          <td>\${inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '-'}</td>
          <td class="action-btns">
            <button class="action-btn view" onclick="viewInvestor('\${inv.id}')" title="View">👁️</button>
            \${inv.investor_status === 'nda_signed' ? \`<button class="action-btn approve" onclick="approveInvestor('\${inv.id}')" title="Approve">✅</button><button class="action-btn reject" onclick="rejectInvestor('\${inv.id}')" title="Reject">❌</button>\` : ''}
            <button class="action-btn delete" onclick="confirmDeleteInvestor('\${inv.id}')" title="Delete">🗑️</button>
          </td>
        </tr>
      \`).join('');
    }
    
    function renderWaitlistTable(data) {
      const tbody = document.getElementById('waitlistTableBody');
      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">📋</div><h3>No waitlist subscribers</h3></td></tr>';
        return;
      }
      tbody.innerHTML = data.map(item => \`
        <tr>
          <td>\${escapeHtml(item.email)}</td>
          <td>\${escapeHtml(item.first_name || '')} \${escapeHtml(item.last_name || '')}</td>
          <td>\${escapeHtml(item.business_name || '-')}</td>
          <td><span class="badge badge-\${item.email_verified ? 'active' : 'pending'}">\${item.email_verified ? 'Verified' : 'Pending'}</span></td>
          <td>\${item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
          <td class="action-btns">
            <button class="action-btn delete" onclick="confirmDeleteWaitlistUser('\${item.id}')" title="Delete">🗑️</button>
          </td>
        </tr>
      \`).join('');
    }
    
    // Load Documents
    async function loadDocuments() {
      try {
        const res = await fetch('/api/admin/investor-content');
        const data = await res.json();
        
        if (data.success && data.content) {
          documents = data.content;
          document.getElementById('documentCount').textContent = documents.length;
          renderDocumentsTable();
        }
      } catch (error) {
        console.error('Load documents error:', error);
      }
    }
    
    function renderDocumentsTable() {
      const tbody = document.getElementById('documentsTableBody');
      if (!documents || documents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">📁</div><h3>No documents yet</h3><p>Add your first investor document</p></td></tr>';
        return;
      }
      tbody.innerHTML = documents.map(doc => \`
        <tr>
          <td style="font-size: 24px;">\${doc.icon || '📄'}</td>
          <td><strong>\${escapeHtml(doc.title)}</strong></td>
          <td>\${doc.content_type || 'document'}</td>
          <td><span class="badge badge-\${doc.status || 'active'}">\${doc.status || 'active'}</span></td>
          <td>\${doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '-'}</td>
          <td class="action-btns">
            <button class="action-btn edit" onclick="editDocument('\${doc.id}')" title="Edit">✏️</button>
            <button class="action-btn delete" onclick="confirmDeleteDocument('\${doc.id}')" title="Delete">🗑️</button>
          </td>
        </tr>
      \`).join('');
    }
    
    // Load Investor Updates
    async function loadInvestorUpdates() {
      try {
        const res = await fetch('/api/admin/investor-updates');
        const data = await res.json();
        
        // API returns { updates: [...] } or { success: true, updates: [...] }
        const updates = data.updates || [];
        investorUpdates = updates;
        document.getElementById('updateCount').textContent = investorUpdates.length;
        renderInvestorUpdatesTable();
      } catch (error) {
        console.error('Load investor updates error:', error);
        document.getElementById('investorUpdatesTableBody').innerHTML = '<tr><td colspan="5" class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error loading updates</h3></td></tr>';
      }
    }
    
    function renderInvestorUpdatesTable() {
      const tbody = document.getElementById('investorUpdatesTableBody');
      if (!investorUpdates || investorUpdates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><div class="empty-state-icon">📰</div><h3>No updates yet</h3></td></tr>';
        return;
      }
      tbody.innerHTML = investorUpdates.map(u => \`
        <tr>
          <td><strong>\${escapeHtml(u.title)}</strong></td>
          <td>\${u.investor_categories?.name || 'General'}</td>
          <td><span class="badge badge-\${u.status === 'published' ? 'published' : 'draft'}">\${u.status || 'draft'}</span></td>
          <td>\${u.published_at ? new Date(u.published_at).toLocaleDateString() : '-'}</td>
          <td class="action-btns">
            <button class="action-btn edit" onclick="editInvestorUpdate('\${u.id}')" title="Edit">✏️</button>
            <button class="action-btn delete" onclick="confirmDeleteInvestorUpdate('\${u.id}')" title="Delete">🗑️</button>
          </td>
        </tr>
      \`).join('');
    }
    
    // Load Waitlist Updates
    async function loadWaitlistUpdates() {
      try {
        const res = await fetch('/api/admin/waitlist/updates');
        const data = await res.json();
        
        const updates = data.updates || [];
        waitlistUpdates = updates;
        renderWaitlistUpdatesTable();
      } catch (error) {
        console.error('Load waitlist updates error:', error);
        document.getElementById('waitlistUpdatesTableBody').innerHTML = '<tr><td colspan="5" class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error loading updates</h3></td></tr>';
      }
    }
    
    function renderWaitlistUpdatesTable() {
      const tbody = document.getElementById('waitlistUpdatesTableBody');
      if (!waitlistUpdates || waitlistUpdates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><div class="empty-state-icon">📢</div><h3>No waitlist updates yet</h3><p>Add your first project update</p></td></tr>';
        return;
      }
      tbody.innerHTML = waitlistUpdates.map(u => \`
        <tr>
          <td><strong>\${escapeHtml(u.title)}</strong></td>
          <td>\${u.waitlist_categories?.name || 'General'}</td>
          <td><span class="badge badge-\${u.status === 'published' ? 'published' : 'draft'}">\${u.status || 'draft'}</span></td>
          <td>\${u.published_at ? new Date(u.published_at).toLocaleDateString() : '-'}</td>
          <td class="action-btns">
            <button class="action-btn edit" onclick="editWaitlistUpdate('\${u.id}')" title="Edit">✏️</button>
            <button class="action-btn delete" onclick="confirmDeleteWaitlistUpdate('\${u.id}')" title="Delete">🗑️</button>
          </td>
        </tr>
      \`).join('');
    }
    
    // Load Categories
    async function loadInvestorCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (data.categories) {
          investorCategories = data.categories;
          updateInvestorCategorySelect();
          renderInvestorCategoriesList();
        }
      } catch (error) {
        console.error('Load investor categories error:', error);
      }
    }
    
    async function loadWaitlistCategories() {
      try {
        const res = await fetch('/api/admin/waitlist/categories');
        const data = await res.json();
        if (data.categories) {
          waitlistCategories = data.categories;
          renderWaitlistCategoriesList();
        }
      } catch (error) {
        console.error('Load waitlist categories error:', error);
      }
    }
    
    function updateInvestorCategorySelect() {
      const select = document.getElementById('invUpdateCategory');
      select.innerHTML = '<option value="">Select category...</option>' + 
        investorCategories.map(c => \`<option value="\${c.id}">\${c.icon || '📌'} \${escapeHtml(c.name)}</option>\`).join('');
    }
    
    function renderInvestorCategoriesList() {
      const container = document.getElementById('investorCategoriesList');
      if (!investorCategories.length) {
        container.innerHTML = '<p style="color: #888;">No categories yet</p>';
        return;
      }
      container.innerHTML = investorCategories.map(c => \`
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
          <span>\${c.icon || '📌'} \${escapeHtml(c.name)}</span>
          <button class="action-btn delete" onclick="deleteCategory('investor', '\${c.id}')" title="Delete">🗑️</button>
        </div>
      \`).join('');
    }
    
    function renderWaitlistCategoriesList() {
      const container = document.getElementById('waitlistCategoriesList');
      if (!waitlistCategories.length) {
        container.innerHTML = '<p style="color: #888;">No categories yet</p>';
        return;
      }
      container.innerHTML = waitlistCategories.map(c => \`
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
          <span>\${c.icon || '📌'} \${escapeHtml(c.name)}</span>
          <button class="action-btn delete" onclick="deleteCategory('waitlist', '\${c.id}')" title="Delete">🗑️</button>
        </div>
      \`).join('');
    }
    
    // Document CRUD
    function openAddDocumentModal() {
      document.getElementById('documentModalTitle').textContent = 'Add Document';
      document.getElementById('documentForm').reset();
      document.getElementById('docId').value = '';
      openModal('documentModal');
    }
    
    function editDocument(id) {
      const doc = documents.find(d => d.id === id);
      if (!doc) return;
      
      document.getElementById('documentModalTitle').textContent = 'Edit Document';
      document.getElementById('docId').value = doc.id;
      document.getElementById('docTitle').value = doc.title || '';
      document.getElementById('docDescription').value = doc.description || '';
      document.getElementById('docType').value = doc.content_type || 'document';
      document.getElementById('docIcon').value = doc.icon || '📄';
      document.getElementById('docFileUrl').value = doc.file_url || '';
      document.getElementById('docCta').value = doc.cta_button_text || '';
      document.getElementById('docStatus').value = doc.status || 'active';
      document.getElementById('docSortOrder').value = doc.sort_order || 0;
      openModal('documentModal');
    }
    
    async function saveDocument() {
      const id = document.getElementById('docId').value;
      const data = {
        title: document.getElementById('docTitle').value,
        description: document.getElementById('docDescription').value,
        content_type: document.getElementById('docType').value,
        icon: document.getElementById('docIcon').value,
        file_url: document.getElementById('docFileUrl').value,
        cta_button_text: document.getElementById('docCta').value || 'View Document',
        sort_order: parseInt(document.getElementById('docSortOrder').value) || 0
        // Note: status field removed - column doesn't exist in database
      };
      
      try {
        const url = id ? \`/api/admin/investor-content/\${id}\` : '/api/admin/investor-content';
        const method = id ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        if (result.success) {
          showToast(id ? 'Document updated!' : 'Document created!', 'success');
          closeModal('documentModal');
          await loadDocuments();
        } else {
          showToast(result.error || 'Failed to save document', 'error');
        }
      } catch (error) {
        console.error('Save document error:', error);
        showToast('Failed to save document', 'error');
      }
    }
    
    // Investor Update CRUD
    function openAddInvestorUpdateModal() {
      document.getElementById('investorUpdateModalTitle').textContent = 'Add Investor Update';
      document.getElementById('investorUpdateForm').reset();
      document.getElementById('invUpdateId').value = '';
      document.getElementById('invUpdateAuthor').value = 'Risivo Team';
      document.getElementById('invUpdateImage').value = '';
      document.getElementById('invGalleryImages').value = '[]';
      // Clear image previews
      document.getElementById('invFeaturedImagePreview').style.display = 'none';
      document.getElementById('invFeaturedImageBtn').style.display = 'inline-block';
      document.getElementById('invGalleryPreview').innerHTML = '';
      // Clear Quill editor
      if (invUpdateQuill) {
        invUpdateQuill.root.innerHTML = '';
      }
      openModal('investorUpdateModal');
    }
    
    function editInvestorUpdate(id) {
      const update = investorUpdates.find(u => u.id === id);
      if (!update) return;
      
      document.getElementById('investorUpdateModalTitle').textContent = 'Edit Update';
      document.getElementById('invUpdateId').value = update.id;
      document.getElementById('invUpdateTitle').value = update.title || '';
      document.getElementById('invUpdateCategory').value = update.category_id || '';
      document.getElementById('invUpdateStatus').value = update.status || 'draft';
      document.getElementById('invUpdateExcerpt').value = update.excerpt || '';
      // Load content into Quill editor
      if (invUpdateQuill) {
        invUpdateQuill.root.innerHTML = update.content || '';
      }
      document.getElementById('invUpdateImage').value = update.featured_image_url || '';
      document.getElementById('invUpdateVideo').value = update.video_url || '';
      document.getElementById('invUpdateAuthor').value = update.author_name || 'Risivo Team';
      
      // Set featured image preview
      if (update.featured_image_url) {
        document.getElementById('invFeaturedImageImg').src = update.featured_image_url;
        document.getElementById('invFeaturedImagePreview').style.display = 'inline-block';
        document.getElementById('invFeaturedImageBtn').style.display = 'none';
      } else {
        document.getElementById('invFeaturedImagePreview').style.display = 'none';
        document.getElementById('invFeaturedImageBtn').style.display = 'inline-block';
      }
      
      // Set gallery images
      const gallery = update.gallery_images || [];
      document.getElementById('invGalleryImages').value = JSON.stringify(gallery);
      renderInvGalleryPreview(gallery);
      
      openModal('investorUpdateModal');
    }
    
    // Investor image upload handlers
    async function handleInvFeaturedUpload(input) {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const btn = document.getElementById('invFeaturedImageBtn');
      btn.disabled = true;
      btn.textContent = 'Uploading...';
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'investor-updates');
        
        const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
        const result = await res.json();
        
        if (result.success) {
          document.getElementById('invUpdateImage').value = result.url;
          document.getElementById('invFeaturedImageImg').src = result.url;
          document.getElementById('invFeaturedImagePreview').style.display = 'inline-block';
          btn.style.display = 'none';
          showToast('Image uploaded!', 'success');
        } else {
          showToast(result.error || 'Upload failed', 'error');
        }
      } catch (error) {
        showToast('Upload failed', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '📷 Upload Featured Image';
        input.value = '';
      }
    }
    
    function removeInvFeaturedImage() {
      document.getElementById('invUpdateImage').value = '';
      document.getElementById('invFeaturedImagePreview').style.display = 'none';
      document.getElementById('invFeaturedImageBtn').style.display = 'inline-block';
    }
    
    async function handleInvGalleryUpload(input) {
      if (!input.files || input.files.length === 0) return;
      const files = Array.from(input.files);
      const currentGallery = JSON.parse(document.getElementById('invGalleryImages').value || '[]');
      
      if (currentGallery.length + files.length > 10) {
        showToast('Maximum 10 images allowed', 'error');
        return;
      }
      
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'investor-gallery');
          
          const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
          const result = await res.json();
          
          if (result.success) {
            currentGallery.push({ url: result.url, path: result.path });
          }
        } catch (error) {
          console.error('Gallery upload error:', error);
        }
      }
      
      document.getElementById('invGalleryImages').value = JSON.stringify(currentGallery);
      renderInvGalleryPreview(currentGallery);
      showToast('Images uploaded!', 'success');
      input.value = '';
    }
    
    function renderInvGalleryPreview(gallery) {
      const container = document.getElementById('invGalleryPreview');
      container.innerHTML = gallery.map((img, idx) => \`
        <div class="gallery-item">
          <img src="\${img.url}" alt="Gallery image">
          <button type="button" class="remove-image-btn" onclick="removeInvGalleryImage(\${idx})">&times;</button>
        </div>
      \`).join('');
    }
    
    function removeInvGalleryImage(idx) {
      const gallery = JSON.parse(document.getElementById('invGalleryImages').value || '[]');
      gallery.splice(idx, 1);
      document.getElementById('invGalleryImages').value = JSON.stringify(gallery);
      renderInvGalleryPreview(gallery);
    }
    
    async function saveInvestorUpdate() {
      const id = document.getElementById('invUpdateId').value;
      // Get content from Quill editor
      const content = invUpdateQuill ? invUpdateQuill.root.innerHTML : '';
      const galleryImages = JSON.parse(document.getElementById('invGalleryImages').value || '[]');
      const data = {
        title: document.getElementById('invUpdateTitle').value,
        category_id: document.getElementById('invUpdateCategory').value || null,
        status: document.getElementById('invUpdateStatus').value,
        excerpt: document.getElementById('invUpdateExcerpt').value,
        content: content,
        featured_image_url: document.getElementById('invUpdateImage').value || null,
        video_url: document.getElementById('invUpdateVideo').value || null,
        gallery_images: galleryImages.length > 0 ? galleryImages : null,
        author_name: document.getElementById('invUpdateAuthor').value || 'Risivo Team'
      };
      
      try {
        const url = id ? \`/api/admin/investor-updates/\${id}\` : '/api/admin/investor-updates';
        const method = id ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        if (result.success) {
          showToast(id ? 'Update saved!' : 'Update created!', 'success');
          closeModal('investorUpdateModal');
          await loadInvestorUpdates();
        } else {
          showToast(result.error || 'Failed to save update', 'error');
        }
      } catch (error) {
        console.error('Save update error:', error);
        showToast('Failed to save update', 'error');
      }
    }
    
    // Delete functions
    function confirmDeleteDocument(id) {
      deleteTarget = { type: 'document', id };
      document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this document? This action cannot be undone.';
      openModal('confirmModal');
    }
    
    function confirmDeleteInvestorUpdate(id) {
      deleteTarget = { type: 'investor-update', id };
      document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this update? This action cannot be undone.';
      openModal('confirmModal');
    }
    
    function confirmDeleteInvestor(id) {
      deleteTarget = { type: 'investor', id };
      document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this investor? All their data will be permanently removed.';
      openModal('confirmModal');
    }
    
    function confirmDeleteWaitlist(id) {
      deleteTarget = { type: 'waitlist', id };
      document.getElementById('confirmMessage').textContent = 'Are you sure you want to remove this subscriber from the waitlist?';
      openModal('confirmModal');
    }
    
    function confirmDeleteWaitlistUser(id) {
      deleteTarget = { type: 'waitlist-user', id };
      document.getElementById('confirmMessage').textContent = 'Are you sure you want to remove this subscriber from the waitlist?';
      openModal('confirmModal');
    }
    
    async function confirmDelete() {
      if (!deleteTarget) return;
      
      try {
        let url;
        switch (deleteTarget.type) {
          case 'document':
            url = \`/api/admin/investor-content/\${deleteTarget.id}\`;
            break;
          case 'investor-update':
            url = \`/api/admin/investor-updates/\${deleteTarget.id}\`;
            break;
          case 'investor':
            url = \`/api/admin/investors/investor/\${deleteTarget.id}/delete\`;
            break;
          case 'waitlist':
            url = \`/api/admin/waitlist/\${deleteTarget.id}\`;
            break;
          case 'waitlist-user':
            url = \`/api/admin/waitlist/user/\${deleteTarget.id}\`;
            break;
          case 'waitlist-update':
            url = \`/api/admin/waitlist/updates/\${deleteTarget.id}\`;
            break;
        }
        
        const res = await fetch(url, { method: 'DELETE' });
        const result = await res.json();
        
        if (result.success) {
          showToast('Deleted successfully', 'success');
          closeModal('confirmModal');
          
          // Refresh appropriate data
          if (deleteTarget.type === 'document') await loadDocuments();
          else if (deleteTarget.type === 'investor-update') await loadInvestorUpdates();
          else if (deleteTarget.type === 'waitlist-update') await loadWaitlistUpdates();
          else if (deleteTarget.type === 'waitlist-user') await loadWaitlistUsers();
          else if (deleteTarget.type === 'investor' || deleteTarget.type === 'waitlist') await loadInvestors();
        } else {
          showToast(result.error || 'Delete failed', 'error');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showToast('Delete failed', 'error');
      }
      
      deleteTarget = null;
    }
    
    // Investor management
    async function viewInvestor(id) {
      const content = document.getElementById('investorDetailsContent');
      const actions = document.getElementById('investorDetailsActions');
      content.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';
      actions.innerHTML = '';
      openModal('viewInvestorModal');
      
      try {
        const res = await fetch(\`/api/admin/investors/investor/\${id}/details\`);
        const data = await res.json();
        
        if (data.success && data.investor) {
          const inv = data.investor;
          const nda = data.nda_signature;
          
          content.innerHTML = \`
            <div style="margin-bottom: 16px;">
              <p style="margin-bottom: 8px;"><strong>Name:</strong> \${escapeHtml(inv.first_name || '')} \${escapeHtml(inv.last_name || '')}</p>
              <p style="margin-bottom: 8px;"><strong>Email:</strong> \${escapeHtml(inv.email)}</p>
              <p style="margin-bottom: 8px;"><strong>Business:</strong> \${escapeHtml(inv.business_name || 'N/A')}</p>
              <p style="margin-bottom: 8px;"><strong>Status:</strong> <span class="badge badge-\${inv.investor_status || 'pending'}">\${inv.investor_status || 'pending'}</span></p>
              <p style="margin-bottom: 8px;"><strong>Tier:</strong> <span class="badge badge-\${inv.investor_tier || 'standard'}">\${inv.investor_tier || 'standard'}</span></p>
              <p style="margin-bottom: 8px;"><strong>Joined:</strong> \${inv.created_at ? new Date(inv.created_at).toLocaleString() : 'N/A'}</p>
              <p style="margin-bottom: 8px;"><strong>Last Login:</strong> \${inv.last_login ? new Date(inv.last_login).toLocaleString() : 'Never'}</p>
            </div>
            \${nda ? \`
            <div style="background: #f8f9fc; padding: 12px; border-radius: 8px; margin-top: 16px;">
              <h4 style="margin-bottom: 8px;">📝 NDA Signature</h4>
              <p style="font-size: 13px; margin-bottom: 4px;"><strong>Signed as:</strong> \${escapeHtml(nda.full_name_typed)}</p>
              <p style="font-size: 13px; margin-bottom: 4px;"><strong>Date:</strong> \${new Date(nda.signed_at).toLocaleString()}</p>
              <p style="font-size: 13px;"><strong>IP:</strong> \${nda.ip_address || 'N/A'}</p>
            </div>
            \` : '<p style="color: #888; font-style: italic;">No NDA signed yet</p>'}
          \`;
          
          actions.innerHTML = \`
            \${inv.investor_status === 'nda_signed' ? \`<button class="btn btn-success" onclick="approveInvestor('\${id}'); closeModal('viewInvestorModal');">✅ Approve</button><button class="btn btn-danger" style="background:#dc2626;margin-left:8px;" onclick="rejectInvestor('\${id}'); closeModal('viewInvestorModal');">❌ Reject</button>\` : ''}
            <button class="btn btn-secondary" onclick="closeModal('viewInvestorModal')">Close</button>
          \`;
        } else {
          content.innerHTML = '<p style="color: red;">Failed to load investor details</p>';
        }
      } catch (error) {
        console.error('View investor error:', error);
        content.innerHTML = '<p style="color: red;">Error loading details</p>';
      }
    }
    
    async function approveInvestor(id) {
      if (!confirm('Approve this investor? They will receive an email with login credentials.')) return;
      try {
        const res = await fetch(\`/api/admin/investors/investor/\${id}/approve\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: 'standard' })
        });
        const result = await res.json();
        
        if (result.success) {
          showToast('Investor approved! Credentials sent via email.', 'success');
          await loadInvestors();
        } else {
          showToast(result.error || 'Approval failed', 'error');
        }
      } catch (error) {
        console.error('Approve error:', error);
        showToast('Approval failed', 'error');
      }
    }
    
    async function rejectInvestor(id) {
      const reason = prompt('Enter rejection reason (optional):');
      if (reason === null) return; // User cancelled
      
      try {
        const res = await fetch(\`/api/admin/investors/investor/\${id}/reject\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: reason || '' })
        });
        const result = await res.json();
        
        if (result.success) {
          showToast('Investor rejected. Notification sent.', 'success');
          await loadInvestors();
        } else {
          showToast(result.error || 'Rejection failed', 'error');
        }
      } catch (error) {
        console.error('Reject error:', error);
        showToast('Rejection failed', 'error');
      }
    }
    
    // CSV Export
    function exportInvestorsCSV() {
      const realInvestors = investors.filter(i => i.user_type === 'investor');
      if (!realInvestors.length) {
        showToast('No investors to export', 'info');
        return;
      }
      
      const headers = ['Email', 'First Name', 'Last Name', 'Business', 'Status', 'Tier', 'Joined'];
      const rows = realInvestors.map(i => [
        i.email,
        i.first_name || '',
        i.last_name || '',
        i.business_name || '',
        i.investor_status || '',
        i.investor_tier || '',
        i.created_at ? new Date(i.created_at).toISOString() : ''
      ]);
      
      downloadCSV(headers, rows, 'risivo_investors_' + new Date().toISOString().split('T')[0] + '.csv');
      showToast('Investors exported!', 'success');
    }
    
    function exportWaitlistCSV() {
      const waitlistUsers = investors.filter(i => i.user_type === 'waitlist');
      if (!waitlistUsers.length) {
        showToast('No waitlist subscribers to export', 'info');
        return;
      }
      
      const headers = ['Email', 'First Name', 'Last Name', 'Subscribed'];
      const rows = waitlistUsers.map(i => [
        i.email,
        i.first_name || '',
        i.last_name || '',
        i.created_at ? new Date(i.created_at).toISOString() : ''
      ]);
      
      downloadCSV(headers, rows, 'risivo_waitlist_' + new Date().toISOString().split('T')[0] + '.csv');
      showToast('Waitlist exported!', 'success');
    }
    
    function downloadCSV(headers, rows, filename) {
      const csvContent = [headers, ...rows].map(row => 
        row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')
      ).join('\\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
    
    // Recent Activity
    function updateRecentActivity() {
      const container = document.getElementById('recentActivity');
      const activities = [];
      
      if (investorUpdates.length > 0) {
        const latest = investorUpdates[0];
        activities.push(\`📰 Latest update: "\${escapeHtml(latest.title)}" (\${latest.status})\`);
      }
      
      const pending = investors.filter(i => i.investor_status === 'nda_signed');
      if (pending.length > 0) {
        activities.push(\`⏳ \${pending.length} investor(s) pending approval\`);
      }
      
      const active = investors.filter(i => i.investor_status === 'active');
      if (active.length > 0) {
        activities.push(\`✅ \${active.length} active investor(s)\`);
      }
      
      if (documents.length > 0) {
        activities.push(\`📁 \${documents.length} document(s) available\`);
      }
      
      container.innerHTML = activities.length > 0 
        ? activities.map(a => \`<p style="margin-bottom: 8px;">\${a}</p>\`).join('')
        : '<p style="color: #888;">No recent activity</p>';
    }
    
    // Utilities
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    async function logout() {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/updates/admin/login';
    }
    
    // Waitlist Updates CRUD
    function openAddWaitlistUpdateModal() {
      document.getElementById('waitlistUpdateModalTitle').textContent = 'Add Waitlist Update';
      document.getElementById('waitlistUpdateForm').reset();
      document.getElementById('wlUpdateId').value = '';
      document.getElementById('wlUpdateAuthor').value = 'Risivo Team';
      document.getElementById('wlUpdateImage').value = '';
      document.getElementById('wlGalleryImages').value = '[]';
      // Clear image previews
      document.getElementById('wlFeaturedImagePreview').style.display = 'none';
      document.getElementById('wlFeaturedImageBtn').style.display = 'inline-block';
      document.getElementById('wlGalleryPreview').innerHTML = '';
      if (wlUpdateQuill) wlUpdateQuill.root.innerHTML = '';
      updateWaitlistCategorySelect();
      openModal('waitlistUpdateModal');
    }
    
    function editWaitlistUpdate(id) {
      const update = waitlistUpdates.find(u => u.id === id);
      if (!update) return;
      
      document.getElementById('waitlistUpdateModalTitle').textContent = 'Edit Update';
      document.getElementById('wlUpdateId').value = id;
      document.getElementById('wlUpdateTitle').value = update.title || '';
      document.getElementById('wlUpdateCategory').value = update.category_id || '';
      document.getElementById('wlUpdateStatus').value = update.status || 'draft';
      document.getElementById('wlUpdateExcerpt').value = update.excerpt || '';
      if (wlUpdateQuill) wlUpdateQuill.root.innerHTML = update.content || '';
      document.getElementById('wlUpdateImage').value = update.featured_image_url || '';
      document.getElementById('wlUpdateVideo').value = update.video_url || '';
      document.getElementById('wlUpdateAuthor').value = update.author_name || 'Risivo Team';
      
      // Set featured image preview
      if (update.featured_image_url) {
        document.getElementById('wlFeaturedImageImg').src = update.featured_image_url;
        document.getElementById('wlFeaturedImagePreview').style.display = 'inline-block';
        document.getElementById('wlFeaturedImageBtn').style.display = 'none';
      } else {
        document.getElementById('wlFeaturedImagePreview').style.display = 'none';
        document.getElementById('wlFeaturedImageBtn').style.display = 'inline-block';
      }
      
      // Set gallery images
      const gallery = update.gallery_images || [];
      document.getElementById('wlGalleryImages').value = JSON.stringify(gallery);
      renderWlGalleryPreview(gallery);
      
      updateWaitlistCategorySelect();
      openModal('waitlistUpdateModal');
    }
    
    // Waitlist image upload handlers
    async function handleWlFeaturedUpload(input) {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const btn = document.getElementById('wlFeaturedImageBtn');
      btn.disabled = true;
      btn.textContent = 'Uploading...';
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'waitlist-updates');
        
        const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
        const result = await res.json();
        
        if (result.success) {
          document.getElementById('wlUpdateImage').value = result.url;
          document.getElementById('wlFeaturedImageImg').src = result.url;
          document.getElementById('wlFeaturedImagePreview').style.display = 'inline-block';
          btn.style.display = 'none';
          showToast('Image uploaded!', 'success');
        } else {
          showToast(result.error || 'Upload failed', 'error');
        }
      } catch (error) {
        showToast('Upload failed', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '📷 Upload Featured Image';
        input.value = '';
      }
    }
    
    function removeWlFeaturedImage() {
      document.getElementById('wlUpdateImage').value = '';
      document.getElementById('wlFeaturedImagePreview').style.display = 'none';
      document.getElementById('wlFeaturedImageBtn').style.display = 'inline-block';
    }
    
    async function handleWlGalleryUpload(input) {
      if (!input.files || input.files.length === 0) return;
      const files = Array.from(input.files);
      const currentGallery = JSON.parse(document.getElementById('wlGalleryImages').value || '[]');
      
      if (currentGallery.length + files.length > 10) {
        showToast('Maximum 10 images allowed', 'error');
        return;
      }
      
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'waitlist-gallery');
          
          const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
          const result = await res.json();
          
          if (result.success) {
            currentGallery.push({ url: result.url, path: result.path });
          }
        } catch (error) {
          console.error('Gallery upload error:', error);
        }
      }
      
      document.getElementById('wlGalleryImages').value = JSON.stringify(currentGallery);
      renderWlGalleryPreview(currentGallery);
      showToast('Images uploaded!', 'success');
      input.value = '';
    }
    
    function renderWlGalleryPreview(gallery) {
      const container = document.getElementById('wlGalleryPreview');
      container.innerHTML = gallery.map((img, idx) => \`
        <div class="gallery-item">
          <img src="\${img.url}" alt="Gallery image">
          <button type="button" class="remove-image-btn" onclick="removeWlGalleryImage(\${idx})">&times;</button>
        </div>
      \`).join('');
    }
    
    function removeWlGalleryImage(idx) {
      const gallery = JSON.parse(document.getElementById('wlGalleryImages').value || '[]');
      gallery.splice(idx, 1);
      document.getElementById('wlGalleryImages').value = JSON.stringify(gallery);
      renderWlGalleryPreview(gallery);
    }
    
    function updateWaitlistCategorySelect() {
      const select = document.getElementById('wlUpdateCategory');
      select.innerHTML = '<option value="">Select category...</option>' + 
        waitlistCategories.map(c => \`<option value="\${c.id}">\${c.icon || '📋'} \${escapeHtml(c.name)}</option>\`).join('');
    }
    
    async function saveWaitlistUpdate() {
      const id = document.getElementById('wlUpdateId').value;
      const title = document.getElementById('wlUpdateTitle').value;
      const category_id = document.getElementById('wlUpdateCategory').value || null;
      const status = document.getElementById('wlUpdateStatus').value;
      const excerpt = document.getElementById('wlUpdateExcerpt').value;
      const content = wlUpdateQuill ? wlUpdateQuill.root.innerHTML : '';
      const featured_image_url = document.getElementById('wlUpdateImage').value;
      const video_url = document.getElementById('wlUpdateVideo').value;
      const author_name = document.getElementById('wlUpdateAuthor').value || 'Risivo Team';
      const galleryImages = JSON.parse(document.getElementById('wlGalleryImages').value || '[]');
      
      if (!title || !content) {
        showToast('Title and content are required', 'error');
        return;
      }
      
      const payload = { 
        title, category_id, status, excerpt, content, featured_image_url, video_url, author_name,
        gallery_images: galleryImages.length > 0 ? galleryImages : null
      };
      
      try {
        const url = id ? \`/api/admin/waitlist/updates/\${id}\` : '/api/admin/waitlist/updates';
        const res = await fetch(url, {
          method: id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        
        if (result.success) {
          showToast(id ? 'Update saved!' : 'Update created!', 'success');
          closeModal('waitlistUpdateModal');
          await loadWaitlistUpdates();
        } else {
          showToast(result.error || 'Failed to save update', 'error');
        }
      } catch (error) {
        showToast('Failed to save update', 'error');
      }
    }
    
    function confirmDeleteWaitlistUpdate(id) {
      deleteTarget = { type: 'waitlist-update', id };
      document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this update? This action cannot be undone.';
      openModal('confirmModal');
    }
    
    function openAddCategoryModal(type) {
      const name = prompt('Enter category name:');
      if (name) {
        createCategory(type, name);
      }
    }
    
    async function createCategory(type, name) {
      try {
        const url = type === 'investor' ? '/api/admin/categories' : '/api/admin/waitlist/categories';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, icon: '📌' })
        });
        const result = await res.json();
        
        if (result.success) {
          showToast('Category created!', 'success');
          if (type === 'investor') await loadInvestorCategories();
          else await loadWaitlistCategories();
        } else {
          showToast(result.error || 'Failed to create category', 'error');
        }
      } catch (error) {
        showToast('Failed to create category', 'error');
      }
    }
    
    async function deleteCategory(type, id) {
      if (!confirm('Delete this category?')) return;
      
      try {
        const url = type === 'investor' ? \`/api/admin/categories/\${id}\` : \`/api/admin/waitlist/categories/\${id}\`;
        const res = await fetch(url, { method: 'DELETE' });
        const result = await res.json();
        
        if (result.success) {
          showToast('Category deleted!', 'success');
          if (type === 'investor') await loadInvestorCategories();
          else await loadWaitlistCategories();
        } else {
          showToast(result.error || 'Failed to delete category', 'error');
        }
      } catch (error) {
        showToast('Failed to delete category', 'error');
      }
    }
    
    // Initialize on load
    init();
  </script>
</body>
</html>
  `);
});

// User login page
app.get("/updates/login", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Risivo Updates</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo h1 {
      color: #667eea;
      font-size: 28px;
      font-weight: 700;
    }
    .logo p {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 24px;
      font-size: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    .error {
      background: #fee2e2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: none;
    }
    .error.show { display: block; }
    .links {
      text-align: center;
      margin-top: 20px;
    }
    .links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    .links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" style="height: 48px; margin-bottom: 12px;" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:32px;font-weight:800;margin-bottom:12px\\'>Risivo</h1>'">
      <p>Project Updates Portal</p>
    </div>
    <h2>Welcome Back</h2>
    <div id="error" class="error"></div>
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required placeholder="Enter your password">
      </div>
      <button type="submit" id="submitBtn">Sign In</button>
    </form>
    <div class="links">
      <a href="/waitlist/forgot-password">Forgot Password?</a>
      <a href="/signup/waitlist">Create Account</a>
    </div>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const error = document.getElementById('error');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      error.classList.remove('show');
      
      try {
        const res = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          window.location.href = '/updates/dashboard';
        } else {
          error.textContent = data.details || data.error || 'Login failed';
          error.classList.add('show');
        }
      } catch (err) {
        error.textContent = 'Network error. Please try again.';
        error.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });
  </script>
</body>
</html>
  `);
});

// Investor login page - Professional Risivo Design
app.get("/updates/investor/login", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investor Portal - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .main-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .login-container {
      display: flex;
      max-width: 900px;
      width: 100%;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 80px rgba(0,0,0,0.25);
    }
    .login-left {
      flex: 1;
      background: linear-gradient(180deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
      padding: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .login-left img {
      max-width: 200px;
      margin-bottom: 32px;
    }
    .login-left h2 {
      color: #1a1a2e;
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    .login-left p {
      color: #666;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .features {
      list-style: none;
    }
    .features li {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #444;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .features li::before {
      content: '✓';
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 700;
    }
    .login-right {
      flex: 1;
      padding: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .login-header h3 {
      color: #1a1a2e;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .login-header p {
      color: #888;
      font-size: 14px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }
    .form-group input {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid #e8e8e8;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.2s;
      background: #fafafa;
    }
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }
    .form-group input::placeholder {
      color: #aaa;
    }
    .submit-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    .error-msg {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
      padding: 14px 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: none;
      font-size: 14px;
      border: 1px solid #fca5a5;
    }
    .error-msg.show { display: block; }
    .success-msg {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      color: #16a34a;
      padding: 14px 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: none;
      font-size: 14px;
      border: 1px solid #86efac;
    }
    .success-msg.show { display: block; }
    .login-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .login-footer a {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin: 0 12px;
    }
    .login-footer a:hover { text-decoration: underline; }
    .page-footer {
      background: #1a1a2e;
      color: white;
      padding: 20px 40px;
      text-align: center;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-logo img { height: 28px; filter: brightness(0) invert(1); }
    .footer-copyright { font-size: 13px; opacity: 0.7; }
    @media (max-width: 768px) {
      .login-container { flex-direction: column; }
      .login-left { display: none; }
      .login-right { padding: 40px 30px; }
      .footer-content { flex-direction: column; gap: 12px; }
    }
  </style>
</head>
<body>
  <div class="main-content">
    <div class="login-container">
      <div class="login-left">
        <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:32px;font-weight:800;margin-bottom:32px\\'>Risivo</h1>'">
        <h2>Exclusive Investor Access</h2>
        <p>Welcome to the Risivo Investor Portal. Access confidential company information, financial reports, and strategic updates.</p>
        <ul class="features">
          <li>Pitch Deck & Business Plan</li>
          <li>Financial Forecasts & Reports</li>
          <li>Project Updates & Milestones</li>
          <li>Video Presentations</li>
          <li>Direct Communication Channel</li>
        </ul>
      </div>
      <div class="login-right">
        <div class="login-header">
          <h3>Investor Sign In</h3>
          <p>Enter your credentials to access the portal</p>
        </div>
        <div id="success" class="success-msg"></div>
        <div id="error" class="error-msg"></div>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required placeholder="investor@example.com">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Enter your password">
          </div>
          <button type="submit" class="submit-btn" id="submitBtn">Access Portal</button>
        </form>
        <div class="login-footer">
          <a href="/investor/forgot-password">Forgot Password?</a>
          <a href="https://risivo.com">Back to Risivo.com</a>
        </div>
      </div>
    </div>
  </div>
  <div class="page-footer">
    <div class="footer-content">
      <div class="footer-logo">
        <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<span style=\\'font-size:18px;font-weight:700\\'>Risivo</span>'">
      </div>
      <div class="footer-copyright">© ${new Date().getFullYear()} Risivo. All rights reserved. Confidential.</div>
    </div>
  </div>
  <script>
    // Check for NDA signed success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('nda_signed') === 'true') {
      const success = document.getElementById('success');
      success.innerHTML = '<strong>NDA Signed Successfully!</strong><br>Your account is now active. Please check your email for your login credentials. If you don\\'t see it, check your spam folder.';
      success.classList.add('show');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const error = document.getElementById('error');
      const success = document.getElementById('success');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      btn.disabled = true;
      btn.textContent = 'Authenticating...';
      error.classList.remove('show');
      success.classList.remove('show');
      
      try {
        const res = await fetch('/api/investor/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          window.location.href = data.redirect || '/updates/investor/dashboard';
        } else {
          error.textContent = data.details || data.error || 'Login failed. Please check your credentials.';
          error.classList.add('show');
        }
      } catch (err) {
        error.textContent = 'Connection error. Please check your internet and try again.';
        error.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Access Portal';
      }
    });
  </script>
</body>
</html>
  `);
});

// Investor NDA Signing Page
app.get("/investor/sign-nda", (c) => {
  const token = c.req.query('token');
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign NDA - Investor Portal - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .nda-container { background: white; border-radius: 24px; max-width: 800px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    h2 { text-align: center; color: #1a1a2e; font-size: 28px; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 32px; }
    .nda-content { background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px; max-height: 500px; overflow-y: auto; font-size: 14px; line-height: 1.7; color: #333; border: 1px solid #e0e0e0; }
    .nda-content h3 { color: #1a1a2e; font-size: 18px; margin-bottom: 16px; }
    .nda-content h4 { color: #333; font-size: 15px; margin: 20px 0 12px; }
    .nda-content p { margin-bottom: 12px; }
    .nda-content ul { margin: 12px 0; padding-left: 24px; }
    .nda-content li { margin-bottom: 8px; }
    .signature-section { background: #f0f4ff; border: 1px solid #c7d2fe; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
    .signature-section h4 { color: #4f46e5; margin-bottom: 16px; font-size: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333; }
    .form-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; transition: all 0.2s; }
    .form-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .checkbox-group { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
    .checkbox-group input[type="checkbox"] { width: 20px; height: 20px; margin-top: 2px; accent-color: #667eea; }
    .checkbox-group label { font-size: 14px; color: #444; line-height: 1.5; }
    .submit-btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .error-msg.show { display: block; }
    .success-msg { background: #dcfce7; color: #16a34a; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .success-msg.show { display: block; }
    .back-link { display: block; text-align: center; margin-top: 24px; color: #667eea; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    @media (max-width: 600px) { .nda-container { padding: 24px; } }
  </style>
</head>
<body>
  <div class="nda-container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:32px\\'>Risivo</h1>'">
    </div>
    <h2>Non-Disclosure Agreement</h2>
    <p class="subtitle">Please review and sign the NDA to access investor materials</p>
    
    <div id="error" class="error-msg"></div>
    <div id="success" class="success-msg"></div>
    
    <div class="nda-content">
      <h3>MUTUAL NON-DISCLOSURE AGREEMENT</h3>
      <p style="text-align: center; font-weight: 600; margin-bottom: 20px;"><strong>Effective Date: <span id="ndaEffectiveDate"></span></strong></p>
      <script>document.getElementById('ndaEffectiveDate').textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });</script>
      
      <p>This Non-Disclosure Agreement (the "Agreement") is entered into as of the Effective Date by and between:</p>
      
      <p><strong>Risivo™</strong>, a registered trademark and software-as-a-service (SaaS) platform owned and operated by <strong>Velocity Automation Corp</strong>, a corporation duly incorporated and validly existing under the laws of the State of Delaware, United States of America, with its principal place of business located in the United States (hereinafter referred to as the "Company" or "Disclosing Party"),</p>
      
      <p style="text-align: center; font-weight: 600;">AND</p>
      
      <p>The undersigned individual or entity executing this Agreement (hereinafter referred to as the "Recipient" or "Receiving Party"),</p>
      
      <p>(The Company and Recipient are hereinafter collectively referred to as the "Parties" and individually as a "Party.")</p>
      
      <h4>RECITALS</h4>
      <p>WHEREAS, the Company is engaged in the business of developing, marketing, and providing software-as-a-service solutions and related technology services;</p>
      <p>WHEREAS, the Recipient has expressed interest in evaluating a potential business relationship, investment opportunity, or strategic partnership with the Company;</p>
      <p>WHEREAS, in connection with such evaluation, the Company may disclose to the Recipient certain confidential, proprietary, and trade secret information;</p>
      <p>NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:</p>
      
      <h4>1. Purpose</h4>
      <p>The Parties wish to explore a potential business relationship, investment opportunity, or strategic partnership involving the disclosure of certain confidential and proprietary information related to the Company's business operations, financial forecasts, business strategy, technology roadmap, intellectual property, pitch deck, investment terms, and other proprietary materials (collectively, the "Confidential Information"). The purpose of this Agreement is to protect the confidentiality of such information and to set forth the terms and conditions under which the Confidential Information may be disclosed and used.</p>
      
      <h4>2. Definition of Confidential Information</h4>
      <p>Confidential Information includes, but is not limited to:</p>
      <ul>
        <li>Financial forecasts, projections, and business plans</li>
        <li>Pitch decks, investor presentations, and marketing materials</li>
        <li>Product roadmaps, technical specifications, and software architecture</li>
        <li>Customer lists, pricing strategies, and business strategies</li>
        <li>Trade secrets, proprietary processes, and intellectual property</li>
        <li>Any information marked as "Confidential" or that a reasonable person would consider confidential</li>
      </ul>
      
      <h4>3. Obligations of Recipient</h4>
      <p>The Recipient agrees to:</p>
      <ul>
        <li><strong>Maintain Confidentiality:</strong> Keep all Confidential Information strictly confidential and not disclose it to any third party without prior written consent from the Company.</li>
        <li><strong>Limit Use:</strong> Use the Confidential Information solely for the purpose of evaluating a potential investment or business relationship with Risivo.</li>
        <li><strong>Protect Information:</strong> Take reasonable measures to protect the Confidential Information from unauthorized disclosure or use, using at least the same degree of care as used for their own confidential information.</li>
        <li><strong>Restrict Access:</strong> Limit access to Confidential Information to employees, advisors, or representatives who have a legitimate need to know and who are bound by confidentiality obligations.</li>
      </ul>
      
      <h4>4. Exceptions</h4>
      <p>Confidential Information does not include information that:</p>
      <ul>
        <li>Was publicly available at the time of disclosure or becomes publicly available through no fault of the Recipient</li>
        <li>Was already known to the Recipient prior to disclosure by the Company</li>
        <li>Is independently developed by the Recipient without reference to the Confidential Information</li>
        <li>Is rightfully received by the Recipient from a third party without breach of confidentiality obligations</li>
        <li>Is required to be disclosed by law, regulation, or court order (with prompt notice to the Company)</li>
      </ul>
      
      <h4>5. Term and Termination</h4>
      <p>This Agreement shall remain in effect for a period of <strong>three (3) years</strong> from the Effective Date. Upon termination or request by the Company, the Recipient shall:</p>
      <ul>
        <li>Immediately cease using the Confidential Information</li>
        <li>Return or destroy all copies of Confidential Information in their possession</li>
        <li>Provide written certification of compliance with these obligations</li>
      </ul>
      
      <h4>6. No License or Rights Granted</h4>
      <p>This Agreement does not grant the Recipient any license, intellectual property rights, ownership interest, or other rights whatsoever in or to the Confidential Information or any intellectual property owned or controlled by the Company. All Confidential Information and all intellectual property rights therein remain the sole and exclusive property of Velocity Automation Corp and/or Risivo™. Nothing in this Agreement shall be construed as granting any rights to the Recipient under any patent, copyright, trademark, trade secret, or other intellectual property right of the Company, by implication, estoppel, or otherwise.</p>
      
      <h4>7. No Obligation to Transact; No Agency Relationship</h4>
      <p>This Agreement does not create any obligation on either Party to pursue, consummate, or enter into any business relationship, investment transaction, strategic partnership, or other agreement whatsoever. The Company reserves the absolute right, in its sole and exclusive discretion, to accept or reject any investment proposal, business proposition, or other opportunity, and to determine the terms and conditions of any such transaction. Nothing in this Agreement shall be construed to create any agency, partnership, joint venture, employment, or fiduciary relationship between the Parties.</p>
      
      <h4>8. Remedies and Injunctive Relief</h4>
      <p>The Recipient acknowledges and agrees that any breach or threatened breach of this Agreement may cause the Company irreparable harm for which monetary damages would be an inadequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Company shall be entitled to seek and obtain injunctive relief, specific performance, or other equitable relief to prevent or restrain any breach or threatened breach of this Agreement, without the necessity of posting any bond or proving actual damages.</p>
      
      <h4>9. Electronic Signature and Acknowledgment</h4>
      <p>By typing your full legal name below and clicking "I Agree and Sign," you hereby acknowledge, represent, warrant, and agree that:</p>
      <ul>
        <li>Your electronic signature is legally binding, valid, and enforceable, and shall have the same legal effect as an original handwritten signature under applicable law, including but not limited to the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and the Uniform Electronic Transactions Act (UETA);</li>
        <li>You have carefully read, fully understood, and voluntarily agree to be legally bound by all terms, conditions, covenants, and obligations set forth in this Agreement;</li>
        <li>Your IP address, geographic location, timestamp, device information, and other technical metadata will be recorded, logged, and retained for authentication, verification, and legal evidentiary purposes;</li>
        <li>You are of legal age and have the full legal capacity, authority, and right to enter into this Agreement and to perform your obligations hereunder;</li>
        <li>If you are executing this Agreement on behalf of a business entity, you represent and warrant that you have the requisite authority to bind such entity to the terms of this Agreement;</li>
        <li>You acknowledge that this electronic signature process satisfies any requirements under applicable law for a written signature, and you waive any objections to the admissibility of this electronically signed Agreement as evidence in any legal or administrative proceeding.</li>
      </ul>
      
      <h4>10. Governing Law and Jurisdiction</h4>
      <p>This Agreement shall be governed by, and construed and interpreted in accordance with, the internal laws of the State of Delaware, United States of America, without giving effect to any choice or conflict of law provision or rule (whether of the State of Delaware or any other jurisdiction) that would cause the application of the laws of any jurisdiction other than the State of Delaware. Any legal action, suit, or proceeding arising out of or relating to this Agreement or the transactions contemplated hereby shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware, and each Party irrevocably submits to the exclusive jurisdiction of such courts in any such action, suit, or proceeding. The Parties hereby waive any right to a jury trial in connection with any action or litigation in any way arising out of or related to this Agreement.</p>
      
      <h4>11. Dispute Resolution</h4>
      <p>In the event of any dispute, controversy, or claim arising out of or relating to this Agreement, or the breach, termination, or validity thereof, the Parties agree to first attempt to resolve such dispute through good faith negotiations between senior executives of both Parties for a period of thirty (30) days. If the dispute cannot be resolved through negotiation, the Parties may pursue other legal remedies available under applicable law.</p>
      
      <h4>12. Entire Agreement and Amendments</h4>
      <p>This Agreement constitutes the entire agreement between the Parties regarding the subject matter herein and supersedes all prior and contemporaneous discussions, negotiations, agreements, understandings, or representations of any kind, whether written or oral, relating to the subject matter of this Agreement. This Agreement may not be amended, modified, or supplemented except by a written instrument signed by duly authorized representatives of both Parties.</p>
      
      <h4>13. Severability</h4>
      <p>If any provision of this Agreement is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be deemed modified to the minimum extent necessary to make it valid, legal, and enforceable, or if such modification is not possible, such provision shall be severed from this Agreement. In either case, the remaining provisions of this Agreement shall continue in full force and effect.</p>
      
      <h4>14. Counterparts and Electronic Signatures</h4>
      <p>This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. The Parties agree that electronic signatures, digital signatures, or facsimile signatures shall be deemed to have the same legal effect as original handwritten signatures and that this Agreement may be validly executed and delivered by electronic means.</p>
    </div>
    
    <form id="ndaForm">
      <input type="hidden" id="ndaToken" value="${token || ''}">
      
      <div class="signature-section">
        <h4>Electronic Signature</h4>
        <p style="font-size: 13px; color: #666; margin-bottom: 16px;">By typing your full legal name below and clicking "I Agree and Sign," you acknowledge that your electronic signature is legally binding under the U.S. E-SIGN Act and UETA.</p>
        
        <div class="form-group">
          <label>Full Legal Name (as signature) *</label>
          <input type="text" class="form-input" id="fullName" required placeholder="Type your full legal name exactly as it appears on legal documents">
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="agreeTerms" required>
          <label for="agreeTerms">I have carefully read, fully understood, and voluntarily agree to be legally bound by all terms, conditions, covenants, and obligations set forth in this Mutual Non-Disclosure Agreement.</label>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="confirmCapacity" required>
          <label for="confirmCapacity">I confirm that I am of legal age and have the full legal capacity, authority, and right to enter into this Agreement. If signing on behalf of a business entity, I have the requisite authority to bind such entity.</label>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="confirmMetadata" required>
          <label for="confirmMetadata">I acknowledge that my IP address, timestamp, device information, and other technical metadata will be recorded and retained for authentication, verification, and legal evidentiary purposes.</label>
        </div>
      </div>
      
      <button type="submit" class="submit-btn" id="submitBtn">I Agree and Sign NDA</button>
    </form>
    
    <a href="/" class="back-link">← Back to Home</a>
  </div>
  
  <script>
    document.getElementById('ndaForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const error = document.getElementById('error');
      const success = document.getElementById('success');
      const token = document.getElementById('ndaToken').value;
      const fullName = document.getElementById('fullName').value.trim();
      
      if (!fullName) {
        error.textContent = 'Please enter your full legal name.';
        error.classList.add('show');
        return;
      }
      
      if (!document.getElementById('agreeTerms').checked || !document.getElementById('confirmCapacity').checked || !document.getElementById('confirmMetadata').checked) {
        error.textContent = 'Please agree to all terms to continue.';
        error.classList.add('show');
        return;
      }
      
      btn.disabled = true;
      btn.textContent = 'Processing...';
      error.classList.remove('show');
      
      try {
        const res = await fetch('/api/investor/sign-nda-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, full_name_typed: fullName })
        });
        const data = await res.json();
        
        if (data.success) {
          success.innerHTML = '<strong>NDA Signed Successfully!</strong><br><br>' + 
            'Your application is now under review. You will receive an email with your login credentials once approved (typically within 1 business day).<br><br>' +
            'Thank you for your interest in Risivo!';
          success.classList.add('show');
          btn.textContent = 'Application Submitted';
          // Don't redirect - let them read the message
        } else {
          error.textContent = data.error || 'Failed to sign NDA. Please try again.';
          error.classList.add('show');
          btn.disabled = false;
          btn.textContent = 'Sign NDA & Access Portal';
        }
      } catch (err) {
        error.textContent = 'Connection error. Please try again.';
        error.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Sign NDA & Access Portal';
      }
    });
  </script>
</body>
</html>
  `);
});

// Investor dashboard page - Professional Risivo Design with CMS Content
app.get("/updates/investor/dashboard", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investor Dashboard - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f5f7fa;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    /* Header */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0 40px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }
    .header-logo {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header-logo img {
      height: 38px;
      filter: brightness(0) invert(1);
    }
    .header-logo .divider {
      width: 1px;
      height: 28px;
      background: rgba(255,255,255,0.3);
    }
    .header-logo .portal-badge {
      font-size: 13px;
      font-weight: 600;
      opacity: 0.95;
      letter-spacing: 0.5px;
    }
    .header-nav {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
      transition: all 0.2s;
    }
    .nav-link:hover { opacity: 1; background: rgba(255,255,255,0.1); }
    .nav-link.active { background: rgba(255,255,255,0.2); opacity: 1; }
    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }
    .user-name {
      font-size: 14px;
      font-weight: 500;
    }
    .logout-btn {
      background: rgba(255,255,255,0.15);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .logout-btn:hover { background: rgba(255,255,255,0.25); }
    .settings-btn {
      background: rgba(255,255,255,0.15);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .settings-btn:hover { background: rgba(255,255,255,0.25); }
    
    /* Main Content */
    .main-content {
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 40px 60px;
      width: 100%;
    }
    
    /* Welcome Section */
    .welcome-section {
      background: white;
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    .welcome-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
    .welcome-text h1 {
      color: #1a1a2e;
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .welcome-text p {
      color: #666;
      font-size: 15px;
      max-width: 500px;
    }
    .welcome-stats {
      display: flex;
      gap: 32px;
    }
    .stat-item {
      text-align: center;
      padding: 16px 24px;
      background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
      border-radius: 12px;
    }
    .stat-number {
      font-size: 28px;
      font-weight: 800;
      color: #667eea;
    }
    .stat-label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    
    /* Section Styles */
    .section {
      margin-bottom: 40px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .section-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }
    .section-title h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .section-title p {
      font-size: 13px;
      color: #888;
    }
    .view-all-btn {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .view-all-btn:hover { text-decoration: underline; }
    
    /* Content Cards */
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .content-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      position: relative;
    }
    .content-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.18);
      border-color: #667eea;
    }
    .content-card-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-bottom: 20px;
      color: white;
    }
    .content-card h3 {
      color: #1a1a2e;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .content-card p {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .content-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .content-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    /* Update Cards */
    .updates-grid {
      display: grid;
      gap: 20px;
    }
    .update-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      display: flex;
      gap: 24px;
      align-items: stretch;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    .update-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 28px rgba(102, 126, 234, 0.15);
      border-color: #667eea;
    }
    .update-image {
      width: 180px;
      min-height: 120px;
      border-radius: 12px;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .update-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .update-image .placeholder {
      font-size: 36px;
    }
    .update-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .update-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
      color: #667eea;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      width: fit-content;
      margin-bottom: 12px;
    }
    .update-title {
      color: #1a1a2e;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .update-excerpt {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      flex: 1;
    }
    .update-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      font-size: 13px;
      color: #888;
    }
    .update-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    /* Videos Section */
    .video-card {
      position: relative;
    }
    .video-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 40px;
      background: white;
      border-radius: 16px;
      border: 2px dashed #ddd;
    }
    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .empty-state h3 {
      color: #333;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .empty-state p {
      color: #888;
      font-size: 14px;
    }
    
    /* Loading */
    .loading {
      text-align: center;
      padding: 60px;
      color: #666;
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f0f0f0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Footer */
    .footer {
      background: #1a1a2e;
      color: white;
      padding: 32px 40px;
    }
    .footer-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-logo img {
      height: 32px;
      filter: brightness(0) invert(1);
    }
    .footer-text {
      font-size: 12px;
      opacity: 0.7;
      margin-left: 12px;
    }
    .footer-links {
      display: flex;
      gap: 24px;
    }
    .footer-links a {
      color: white;
      text-decoration: none;
      font-size: 13px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .footer-links a:hover { opacity: 1; }
    .footer-copyright {
      font-size: 13px;
      opacity: 0.6;
    }
    
    /* Update Detail Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      overflow-y: auto;
    }
    .modal-overlay.active { display: flex; }
    .modal-content {
      background: white;
      border-radius: 20px;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border: none;
      background: rgba(0,0,0,0.1);
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background 0.2s;
    }
    .modal-close:hover { background: rgba(0,0,0,0.2); }
    .modal-featured-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 20px 20px 0 0;
    }
    .modal-body {
      padding: 32px;
    }
    .modal-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
      color: #667eea;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .modal-title {
      font-size: 28px;
      font-weight: 800;
      color: #1a1a2e;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    .modal-meta {
      display: flex;
      gap: 20px;
      color: #888;
      font-size: 14px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .modal-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .modal-text {
      color: #444;
      line-height: 1.8;
      font-size: 16px;
    }
    .modal-text img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
    .modal-text p { margin-bottom: 16px; }
    .modal-text h1, .modal-text h2, .modal-text h3 { margin: 24px 0 12px; color: #1a1a2e; }
    .modal-text ul, .modal-text ol { margin: 16px 0; padding-left: 24px; }
    .modal-text li { margin-bottom: 8px; }
    
    /* Video Embed */
    .video-container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      margin: 24px 0;
      border-radius: 12px;
      overflow: hidden;
      background: #000;
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    
    /* Image Gallery */
    .gallery-section {
      margin-top: 32px;
    }
    .gallery-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .gallery-thumb {
      aspect-ratio: 16/9;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .gallery-thumb:hover { transform: scale(1.02); }
    .gallery-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Lightbox */
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .lightbox-overlay.active { display: flex; }
    .lightbox-img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 8px;
    }
    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border: none;
      background: rgba(255,255,255,0.1);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lightbox-close:hover { background: rgba(255,255,255,0.2); }
    .lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border: none;
      background: rgba(255,255,255,0.1);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lightbox-nav:hover { background: rgba(255,255,255,0.2); }
    .lightbox-nav.prev { left: 20px; }
    .lightbox-nav.next { right: 20px; }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .welcome-section { flex-direction: column; gap: 24px; text-align: center; }
      .welcome-text p { max-width: 100%; }
    }
    @media (max-width: 768px) {
      .header { padding: 0 20px; }
      .header-nav { display: none; }
      .main-content { padding: 20px; }
      .welcome-section { padding: 28px; }
      .welcome-stats { flex-wrap: wrap; justify-content: center; }
      .update-card { flex-direction: column; }
      .update-image { width: 100%; height: 180px; }
      .footer-inner { flex-direction: column; gap: 20px; text-align: center; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <div class="header-logo">
        <img src="/images/risivo-logo-white.png" alt="Risivo" onerror="this.outerHTML='<span style=\\'font-size:24px;font-weight:800\\'>Risivo</span>'">
        <div class="divider"></div>
        <span class="portal-badge">Investor Portal</span>
      </div>
      <nav class="header-nav">
        <a href="#documents" class="nav-link active">Documents</a>
        <a href="#updates" class="nav-link">Updates</a>
        <a href="https://risivo.com" class="nav-link" target="_blank">Main Site</a>
      </nav>
      <div class="header-actions">
        <div class="user-info">
          <div class="user-avatar" id="userAvatar">?</div>
          <span class="user-name" id="userName">Loading...</span>
        </div>
        <button class="settings-btn" onclick="openChangePasswordModal()">🔑 Change Password</button>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
  </header>
  
  <!-- Change Password Modal -->
  <div class="modal-overlay" id="changePasswordModal">
    <div class="modal-content" style="max-width: 420px;">
      <button class="modal-close" onclick="closeChangePasswordModal()">&times;</button>
      <div class="modal-body">
        <h2 style="font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px;">Change Password</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Update your account password</p>
        <div id="pwdModalMsg" style="padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; display: none;"></div>
        <form id="changePasswordForm">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333;">Current Password</label>
            <input type="password" id="currentPwd" required placeholder="Enter current password" style="width: 100%; padding: 12px 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px;">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333;">New Password</label>
            <input type="password" id="newPwd" required placeholder="Enter new password (min 8 chars)" minlength="8" style="width: 100%; padding: 12px 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px;">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333;">Confirm New Password</label>
            <input type="password" id="confirmPwd" required placeholder="Confirm new password" style="width: 100%; padding: 12px 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px;">
          </div>
          <button type="submit" id="changePwdBtn" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer;">Update Password</button>
        </form>
      </div>
    </div>
  </div>
  
  <main class="main-content">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="welcome-text">
        <h1>Welcome back, <span id="userFirstName">Investor</span>!</h1>
        <p>Access confidential investor materials, strategic updates, and company performance data. All content is protected under NDA.</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-item">
          <div class="stat-number" id="docCount">-</div>
          <div class="stat-label">Documents</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" id="updateCount">-</div>
          <div class="stat-label">Updates</div>
        </div>
      </div>
    </section>
    
    <!-- Documents Section -->
    <section class="section" id="documents">
      <div class="section-header">
        <div class="section-title">
          <div class="section-icon">📁</div>
          <div>
            <h2>Investor Documents</h2>
            <p>Access pitch decks, financial forecasts, and business plans</p>
          </div>
        </div>
      </div>
      <div class="content-grid" id="contentGrid">
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    </section>
    
    <!-- Updates Section -->
    <section class="section" id="updates">
      <div class="section-header">
        <div class="section-title">
          <div class="section-icon">📰</div>
          <div>
            <h2>Latest Updates</h2>
            <p>Company news, project milestones, and strategic announcements</p>
          </div>
        </div>
      </div>
      <div class="updates-grid" id="updatesGrid">
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>Loading updates...</p>
        </div>
      </div>
    </section>
  </main>
  
  <!-- Update Detail Modal -->
  <div class="modal-overlay" id="updateDetailModal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeUpdateModal()">&times;</button>
      <img class="modal-featured-image" id="modalFeaturedImage" src="" alt="" style="display:none;">
      <div class="modal-body">
        <div class="modal-category" id="modalCategory"></div>
        <h1 class="modal-title" id="modalTitle"></h1>
        <div class="modal-meta">
          <span id="modalDate"></span>
          <span id="modalAuthor"></span>
        </div>
        <div class="modal-stats" style="display: flex; gap: 16px; margin: 16px 0; padding: 16px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
          <span style="display: flex; align-items: center; gap: 6px; color: #666; font-size: 14px;">👁 <span id="modalViews">0</span> views</span>
          <button onclick="likeInvestorUpdate()" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #e0e0e0; border-radius: 20px; background: white; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s;" onmouseover="this.style.borderColor='#10b981';this.style.color='#10b981'" onmouseout="this.style.borderColor='#e0e0e0';this.style.color='#666'">👍 <span id="modalLikes">0</span></button>
          <button onclick="dislikeInvestorUpdate()" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #e0e0e0; border-radius: 20px; background: white; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s;" onmouseover="this.style.borderColor='#ef4444';this.style.color='#ef4444'" onmouseout="this.style.borderColor='#e0e0e0';this.style.color='#666'">👎 <span id="modalDislikes">0</span></button>
        </div>
        <div id="modalVideoContainer"></div>
        <div class="modal-text" id="modalContent"></div>
        <div class="gallery-section" id="modalGallerySection" style="display:none;">
          <h3 class="gallery-title">🖼️ Image Gallery</h3>
          <div class="gallery-grid" id="modalGalleryGrid"></div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Lightbox for Gallery -->
  <div class="lightbox-overlay" id="lightboxOverlay">
    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
    <button class="lightbox-nav prev" onclick="navigateLightbox(-1)">&#8249;</button>
    <img class="lightbox-img" id="lightboxImg" src="" alt="">
    <button class="lightbox-nav next" onclick="navigateLightbox(1)">&#8250;</button>
  </div>
  
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-logo">
        <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<span style=\\'font-size:18px;font-weight:700\\'>Risivo</span>'">
        <span class="footer-text">Investor Portal</span>
      </div>
      <div class="footer-links">
        <a href="https://risivo.com">Main Website</a>
        <a href="mailto:investors@risivo.com">Contact</a>
        <a href="https://risivo.com/privacy">Privacy</a>
      </div>
      <div class="footer-copyright">© ${currentYear} Risivo. All rights reserved. Confidential.</div>
    </div>
  </footer>
  
  <script>
    let userData = null;
    
    // Global Error Tracking
    window.onerror = function(message, source, lineno, colno, error) {
      reportError('JavaScript Error', message, error ? error.stack : null);
      return false;
    };
    
    window.onunhandledrejection = function(event) {
      reportError('Unhandled Promise Rejection', event.reason ? event.reason.message || String(event.reason) : 'Unknown', event.reason ? event.reason.stack : null);
    };
    
    function reportError(errorType, errorMessage, errorStack) {
      try {
        fetch('/api/report-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            errorType,
            errorMessage: String(errorMessage).substring(0, 1000),
            errorStack: errorStack ? String(errorStack).substring(0, 2000) : null,
            userEmail: userData ? userData.email : null,
            userName: userData ? (userData.first_name + ' ' + userData.last_name) : null,
            userType: 'investor',
            pageUrl: window.location.href,
            additionalInfo: 'Investor Dashboard'
          })
        }).catch(e => console.error('Error reporting failed:', e));
      } catch (e) {
        console.error('Error reporting failed:', e);
      }
    }
    
    async function init() {
      try {
        // Get user info
        const meRes = await fetch('/api/investor/me');
        const meData = await meRes.json();
        
        if (!meData.success) {
          window.location.href = '/updates/investor/login';
          return;
        }
        
        userData = meData.user;
        document.getElementById('userName').textContent = userData.email;
        document.getElementById('userFirstName').textContent = userData.first_name || 'Investor';
        document.getElementById('userAvatar').textContent = (userData.first_name || userData.email)[0].toUpperCase();
        
        // Load documents
        const contentRes = await fetch('/api/investor/content');
        const contentData = await contentRes.json();
        
        if (contentData.success && contentData.content && contentData.content.length > 0) {
          renderContent(contentData.content);
          document.getElementById('docCount').textContent = contentData.content.length;
        } else {
          document.getElementById('contentGrid').innerHTML = renderEmptyState('📁', 'No documents yet', 'Documents will appear here when available.');
          document.getElementById('docCount').textContent = '0';
        }
        
        // Load updates (articles, project updates from CMS)
        const updatesRes = await fetch('/api/investor/updates');
        const updatesData = await updatesRes.json();
        
        if (updatesData.success && updatesData.updates && updatesData.updates.length > 0) {
          renderUpdates(updatesData.updates);
          document.getElementById('updateCount').textContent = updatesData.updates.length;
        } else {
          document.getElementById('updatesGrid').innerHTML = renderEmptyState('📰', 'No updates yet', 'Project updates and announcements will appear here.');
          document.getElementById('updateCount').textContent = '0';
        }
        
      } catch (error) {
        console.error('Init error:', error);
        window.location.href = '/updates/investor/login';
      }
    }
    
    function renderEmptyState(icon, title, desc) {
      return \`
        <div class="empty-state">
          <div class="empty-state-icon">\${icon}</div>
          <h3>\${title}</h3>
          <p>\${desc}</p>
        </div>
      \`;
    }
    
    // Map icon names/text to actual emojis
    function getIconEmoji(icon, title) {
      if (!icon) return '📄';
      
      // If it's already an emoji (single char or emoji-like), return it
      if (icon.length <= 4 && /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}]/u.test(icon)) {
        return icon;
      }
      
      // Map common icon names to emojis
      const iconMap = {
        'presentation': '📊',
        'chart': '📈',
        'document': '📋',
        'file': '📄',
        'folder': '📁',
        'video': '🎬',
        'image': '🖼️',
        'pdf': '📕',
        'excel': '📗',
        'word': '📘',
        'powerpoint': '📙',
        'pitch': '📊',
        'forecast': '📈',
        'plan': '📋',
        'summary': '📝',
        'report': '📑',
        'financial': '💰',
        'business': '💼',
        'executive': '👔',
        'deck': '🎯'
      };
      
      const iconLower = icon.toLowerCase();
      for (const [key, emoji] of Object.entries(iconMap)) {
        if (iconLower.includes(key)) return emoji;
      }
      
      // Check title for hints
      const titleLower = (title || '').toLowerCase();
      if (titleLower.includes('pitch') || titleLower.includes('deck')) return '📊';
      if (titleLower.includes('forecast') || titleLower.includes('financial')) return '📈';
      if (titleLower.includes('plan') || titleLower.includes('business')) return '📋';
      if (titleLower.includes('summary') || titleLower.includes('executive')) return '📝';
      
      return '📄';
    }
    
    function renderContent(content) {
      const grid = document.getElementById('contentGrid');
      grid.innerHTML = content.map(item => \`
        <div class="content-card">
          <div class="content-card-icon">\${getIconEmoji(item.icon, item.title)}</div>
          <h3>\${escapeHtml(item.title)}</h3>
          <p>\${escapeHtml(item.description || 'Click to view this document')}</p>
          <a href="\${item.file_url}" target="_blank" class="content-btn">
            \${item.cta_button_text || 'View Document'} →
          </a>
        </div>
      \`).join('');
    }
    
    let allUpdates = [];
    let currentGalleryImages = [];
    let currentLightboxIndex = 0;
    
    function renderUpdates(updates) {
      allUpdates = updates;
      const grid = document.getElementById('updatesGrid');
      grid.innerHTML = updates.map((item, idx) => {
        const category = item.investor_categories || {};
        const categoryIcon = category.icon || '📌';
        const categoryName = category.name || 'Update';
        const hasVideo = item.video_url || (item.media_url && item.media_type === 'video');
        const date = item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }) : '';
        
        return \`
          <div class="update-card \${hasVideo ? 'video-card' : ''}" onclick="openUpdateDetail(\${idx})" style="cursor:pointer;">
            <div class="update-image">
              \${item.featured_image_url 
                ? \`<img src="\${item.featured_image_url}" alt="\${escapeHtml(item.title)}">\`
                : \`<span class="placeholder">\${hasVideo ? '🎬' : '📄'}</span>\`
              }
            </div>
            <div class="update-body">
              <div class="update-category">\${categoryIcon} \${escapeHtml(categoryName)}</div>
              <h3 class="update-title">\${escapeHtml(item.title)}</h3>
              <p class="update-excerpt">\${escapeHtml(item.excerpt || '')}</p>
              <div class="update-meta">
                \${date ? \`<span>📅 \${date}</span>\` : ''}
                \${item.author_name ? \`<span>✍️ \${escapeHtml(item.author_name)}</span>\` : ''}
                \${hasVideo ? \`<span>🎬 Video</span>\` : ''}
              </div>
              <div class="update-stats" style="display:flex;gap:12px;margin-top:8px;font-size:13px;color:#666;">
                <span>👁️ \${item.views_count || 0}</span>
                <span>👍 \${item.likes_count || 0}</span>
                <span>👎 \${item.dislikes_count || 0}</span>
              </div>
            </div>
            \${hasVideo ? '<div class="video-badge">▶ Video</div>' : ''}
          </div>
        \`;
      }).join('');
    }
    
    let currentInvestorUpdateId = null;
    
    function openUpdateDetail(idx) {
      const item = allUpdates[idx];
      if (!item) return;
      
      currentInvestorUpdateId = item.id;
      
      // Track view
      fetch('/api/investor/updates/' + item.id + '/view', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            item.views_count = data.views_count;
            document.getElementById('modalViews').textContent = data.views_count;
            // Update list view as well
            renderUpdates(allUpdates);
          }
        })
        .catch(err => console.log('View tracking error:', err));
      
      const category = item.investor_categories || {};
      const categoryIcon = category.icon || '📌';
      const categoryName = category.name || 'Update';
      const date = item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }) : '';
      
      // Featured image
      const featuredImg = document.getElementById('modalFeaturedImage');
      if (item.featured_image_url) {
        featuredImg.src = item.featured_image_url;
        featuredImg.style.display = 'block';
      } else {
        featuredImg.style.display = 'none';
      }
      
      // Category
      document.getElementById('modalCategory').innerHTML = categoryIcon + ' ' + escapeHtml(categoryName);
      
      // Title
      document.getElementById('modalTitle').textContent = item.title;
      
      // Meta
      document.getElementById('modalDate').innerHTML = date ? '📅 ' + date : '';
      document.getElementById('modalAuthor').innerHTML = item.author_name ? '✍️ ' + escapeHtml(item.author_name) : '';
      
      // Stats
      document.getElementById('modalViews').textContent = item.views_count || 0;
      document.getElementById('modalLikes').textContent = item.likes_count || 0;
      document.getElementById('modalDislikes').textContent = item.dislikes_count || 0;
      
      // Video - support both video_url and media_url
      const videoContainer = document.getElementById('modalVideoContainer');
      const videoUrl = item.video_url || (item.media_type === 'video' ? item.media_url : null);
      if (videoUrl) {
        const embedUrl = getYouTubeEmbedUrl(videoUrl);
        if (embedUrl) {
          videoContainer.innerHTML = \`<div class="video-container"><iframe src="\${embedUrl}" allowfullscreen></iframe></div>\`;
        } else {
          videoContainer.innerHTML = \`<p><a href="\${videoUrl}" target="_blank">🎬 Watch Video</a></p>\`;
        }
      } else {
        videoContainer.innerHTML = '';
      }
      
      // Content
      document.getElementById('modalContent').innerHTML = item.content || '';
      
      // Gallery
      const gallerySection = document.getElementById('modalGallerySection');
      const galleryGrid = document.getElementById('modalGalleryGrid');
      const galleryImages = item.gallery_images || [];
      
      if (galleryImages.length > 0) {
        currentGalleryImages = galleryImages.map(g => g.url || g);
        galleryGrid.innerHTML = currentGalleryImages.map((url, i) => \`
          <div class="gallery-thumb" onclick="openLightbox(\${i})">
            <img src="\${url}" alt="Gallery image \${i + 1}">
          </div>
        \`).join('');
        gallerySection.style.display = 'block';
      } else {
        currentGalleryImages = [];
        gallerySection.style.display = 'none';
      }
      
      // Show modal
      document.getElementById('updateDetailModal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeUpdateModal() {
      document.getElementById('updateDetailModal').classList.remove('active');
      document.body.style.overflow = '';
      document.getElementById('modalVideoContainer').innerHTML = '';
    }
    
    function getYouTubeEmbedUrl(url) {
      if (!url) return null;
      let videoId = null;
      
      // Handle various YouTube URL formats
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URL(url).searchParams;
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0];
      }
      
      return videoId ? \`https://www.youtube.com/embed/\${videoId}\` : null;
    }
    
    function openLightbox(idx) {
      currentLightboxIndex = idx;
      document.getElementById('lightboxImg').src = currentGalleryImages[idx];
      document.getElementById('lightboxOverlay').classList.add('active');
    }
    
    function closeLightbox() {
      document.getElementById('lightboxOverlay').classList.remove('active');
    }
    
    function navigateLightbox(dir) {
      currentLightboxIndex = (currentLightboxIndex + dir + currentGalleryImages.length) % currentGalleryImages.length;
      document.getElementById('lightboxImg').src = currentGalleryImages[currentLightboxIndex];
    }
    
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('lightboxOverlay').classList.contains('active')) {
          closeLightbox();
        } else if (document.getElementById('updateDetailModal').classList.contains('active')) {
          closeUpdateModal();
        }
      }
      // Arrow keys for lightbox
      if (document.getElementById('lightboxOverlay').classList.contains('active')) {
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      }
    });
    
    // Close modal when clicking outside
    document.getElementById('updateDetailModal').addEventListener('click', (e) => {
      if (e.target.id === 'updateDetailModal') closeUpdateModal();
    });
    document.getElementById('lightboxOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'lightboxOverlay') closeLightbox();
    });
    
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    async function likeInvestorUpdate() {
      if (!currentInvestorUpdateId) return;
      try {
        const res = await fetch('/api/investor/updates/' + currentInvestorUpdateId + '/like', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          // Update modal
          document.getElementById('modalLikes').textContent = data.likes_count;
          
          // Update local data and re-render list
          const updateIndex = allUpdates.findIndex(u => u.id === currentInvestorUpdateId);
          if (updateIndex !== -1) {
            allUpdates[updateIndex].likes_count = data.likes_count;
            renderUpdates(allUpdates);
          }
        }
      } catch (err) {
        console.error('Like error:', err);
      }
    }
    
    async function dislikeInvestorUpdate() {
      if (!currentInvestorUpdateId) return;
      try {
        const res = await fetch('/api/investor/updates/' + currentInvestorUpdateId + '/dislike', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          // Update modal
          document.getElementById('modalDislikes').textContent = data.dislikes_count;
          
          // Update local data and re-render list
          const updateIndex = allUpdates.findIndex(u => u.id === currentInvestorUpdateId);
          if (updateIndex !== -1) {
            allUpdates[updateIndex].dislikes_count = data.dislikes_count;
            renderUpdates(allUpdates);
          }
        }
      } catch (err) {
        console.error('Dislike error:', err);
      }
    }
    
    async function logout() {
      await fetch('/api/investor/logout', { method: 'POST' });
      window.location.href = '/updates/investor/login';
    }
    
    // Change Password Modal Functions
    function openChangePasswordModal() {
      document.getElementById('changePasswordModal').classList.add('active');
      document.getElementById('changePasswordForm').reset();
      document.getElementById('pwdModalMsg').style.display = 'none';
    }
    
    function closeChangePasswordModal() {
      document.getElementById('changePasswordModal').classList.remove('active');
    }
    
    document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('changePwdBtn');
      const msg = document.getElementById('pwdModalMsg');
      const currentPwd = document.getElementById('currentPwd').value;
      const newPwd = document.getElementById('newPwd').value;
      const confirmPwd = document.getElementById('confirmPwd').value;
      
      if (newPwd !== confirmPwd) {
        msg.style.background = '#fee2e2';
        msg.style.color = '#dc2626';
        msg.textContent = 'New passwords do not match.';
        msg.style.display = 'block';
        return;
      }
      
      if (newPwd.length < 8) {
        msg.style.background = '#fee2e2';
        msg.style.color = '#dc2626';
        msg.textContent = 'Password must be at least 8 characters.';
        msg.style.display = 'block';
        return;
      }
      
      btn.disabled = true;
      btn.textContent = 'Updating...';
      msg.style.display = 'none';
      
      try {
        const res = await fetch('/api/investor/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_password: currentPwd, new_password: newPwd })
        });
        const data = await res.json();
        
        if (data.success) {
          msg.style.background = '#dcfce7';
          msg.style.color = '#16a34a';
          msg.textContent = 'Password updated successfully!';
          msg.style.display = 'block';
          setTimeout(() => closeChangePasswordModal(), 2000);
        } else {
          msg.style.background = '#fee2e2';
          msg.style.color = '#dc2626';
          msg.textContent = data.error || 'Failed to update password.';
          msg.style.display = 'block';
        }
      } catch (err) {
        msg.style.background = '#fee2e2';
        msg.style.color = '#dc2626';
        msg.textContent = 'Connection error. Please try again.';
        msg.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Update Password';
      }
    });
    
    // Close modal on click outside
    document.getElementById('changePasswordModal').addEventListener('click', (e) => {
      if (e.target.id === 'changePasswordModal') closeChangePasswordModal();
    });
    
    init();
  </script>
</body>
</html>
  `);
});

// Base64 encoded logo
const LOGO_BASE64 = `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`;

// Base64 encoded favicon
const FAVICON_BASE64 = `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`;

// Debug endpoint to check configuration
app.get("/api/health", (c) => {
  const hasWebhook = !!c.env?.WEBHOOK_URL;
  return c.json({
    status: "ok",
    webhookConfigured: hasWebhook,
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to inspect webhook URL for hidden characters
app.get("/api/debug-webhook", (c) => {
  const webhookUrl = c.env?.WEBHOOK_URL || "";

  if (!webhookUrl) {
    return c.json({ error: "WEBHOOK_URL not set" });
  }

  // Show character codes to find hidden characters
  const charCodes = Array.from(webhookUrl.substring(0, 60)).map((char, i) => ({
    index: i,
    char: char,
    code: char.charCodeAt(0),
    hex: "0x" + char.charCodeAt(0).toString(16).padStart(2, "0"),
    isPrintable: char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126,
  }));

  return c.json({
    length: webhookUrl.length,
    first60chars: webhookUrl.substring(0, 60),
    charCodes: charCodes,
    hasControlChars: charCodes.some((c) => !c.isPrintable),
    controlChars: charCodes.filter((c) => !c.isPrintable),
  });
});

// API endpoint for email subscriptions
app.post("/api/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email, timestamp, source } = body;

    // Validate email first
    if (!email || !email.includes("@")) {
      console.error("Invalid email:", email);
      return c.json({ error: "Invalid email address" }, 400);
    }

    // Get webhook URL from environment variable
    const webhookUrl = c.env?.WEBHOOK_URL || "";

    console.log("[SUBSCRIBE] ========================================");
    console.log("[SUBSCRIBE] 📧 Email:", email);
    console.log("[SUBSCRIBE] 🔗 Webhook configured:", !!webhookUrl);
    console.log("[SUBSCRIBE] ========================================");

    if (!webhookUrl) {
      console.error(
        "[SUBSCRIBE] WEBHOOK_URL not configured in environment variables"
      );
      console.error(
        "[SUBSCRIBE] Email cannot be saved without webhook configuration"
      );
      // Return error to alert user that configuration is needed
      return c.json(
        {
          error: "Service configuration incomplete. Please contact support.",
          code: "WEBHOOK_NOT_CONFIGURED",
        },
        503
      );
    }

    console.log(
      "[SUBSCRIBE] 🚀 Webhook URL (first 40 chars):",
      webhookUrl.substring(0, 40) + "..."
    );
    console.log("[SUBSCRIBE] 📤 Sending data to Make.com...");
    console.log(
      "[SUBSCRIBE] 📦 Data being sent:",
      JSON.stringify(
        {
          email,
          timestamp,
          source,
          subscribed_at: new Date().toISOString(),
          page_url: c.req.url,
        },
        null,
        2
      )
    );

    // Send to Make.com webhook with timeout
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          timestamp,
          source,
          subscribed_at: new Date().toISOString(),
          page_url: c.req.url,
        }),
      });

      console.log("[SUBSCRIBE] ========================================");
      console.log(
        "[SUBSCRIBE] Webhook response status:",
        webhookResponse.status
      );
      console.log("[SUBSCRIBE] Webhook response ok:", webhookResponse.ok);
      console.log("[SUBSCRIBE] ========================================");

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error(
          "[SUBSCRIBE] ❌ WEBHOOK ERROR - Status:",
          webhookResponse.status
        );
        console.error("[SUBSCRIBE] ❌ Error response:", errorText);
        console.error("[SUBSCRIBE] ❌ This means Make.com rejected the data");
        console.error("[SUBSCRIBE] ========================================");

        // Return more detailed error to help debug
        return c.json(
          {
            success: false,
            error: "Webhook processing failed",
            details: {
              status: webhookResponse.status,
              message: errorText,
              hint: "Check Make.com scenario - it might be off, in error state, or expecting different data format",
            },
          },
          502
        );
      }

      const responseText = await webhookResponse.text();
      console.log("[SUBSCRIBE] ✅ SUCCESS - Make.com accepted the data");
      console.log("[SUBSCRIBE] ✅ Response body:", responseText);
      console.log("[SUBSCRIBE] ========================================");

      return c.json({
        success: true,
        message: "Email subscription successful! Check Make.com to verify.",
      });
    } catch (fetchError) {
      console.error("[SUBSCRIBE] ========================================");
      console.error("[SUBSCRIBE] 🔥 FETCH EXCEPTION (not HTTP error)");
      console.error(
        "[SUBSCRIBE] 🔥 This means network timeout, DNS failure, or connection refused"
      );
      console.error("[SUBSCRIBE] 🔥 Fetch error:", fetchError);
      if (fetchError instanceof Error) {
        console.error("[SUBSCRIBE] 🔥 Error name:", fetchError.name);
        console.error("[SUBSCRIBE] 🔥 Error message:", fetchError.message);
      }
      console.error("[SUBSCRIBE] ========================================");

      // Return detailed error to help debug
      return c.json(
        {
          success: false,
          error: "Failed to connect to webhook",
          details: {
            type: "network_error",
            message:
              fetchError instanceof Error
                ? fetchError.message
                : "Unknown fetch error",
            hint: "This is a network/connection issue, not an HTTP error. Check if webhook URL is accessible.",
          },
        },
        503
      );
    }
  } catch (error) {
    console.error("[SUBSCRIBE] General error:", error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error("[SUBSCRIBE] Error name:", error.name);
      console.error("[SUBSCRIBE] Error message:", error.message);
      console.error("[SUBSCRIBE] Error stack:", error.stack);
    }
    return c.json(
      {
        error: "Failed to process subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Coming Soon Page - Complete with Wistia video, proper branding, social links, footer
app.get("/", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Risivo - Coming Soon</title>
        <meta name="description" content="Risivo - The AI-powered business operating system combining CRM, marketing, projects, digital creation, and communications.">
        <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/upload_files/android-chrome-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/upload_files/android-chrome-512x512.png">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <script src="https://fast.wistia.com/player.js" async></script>
        <script src="https://fast.wistia.com/embed/fqt1aw1yl3.js" async type="module"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html {
                height: auto;
            }
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: fit-content;
            }
            .page-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 40px;
                padding-bottom: 20px;
                position: relative;
                overflow: hidden;
            }
            .bg-shape {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.05);
                animation: float 20s infinite ease-in-out;
            }
            .shape-1 { width: 300px; height: 300px; top: -100px; left: -100px; }
            .shape-2 { width: 200px; height: 200px; bottom: -50px; right: -50px; animation-delay: 5s; }
            .shape-3 { width: 150px; height: 150px; top: 50%; right: 10%; animation-delay: 10s; }
            @keyframes float {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(30px, 30px) scale(1.1); }
            }
            .container {
                position: relative;
                z-index: 1;
                text-align: center;
                padding: 2rem;
                max-width: 900px;
                width: 100%;
            }
            .logo { margin-bottom: 1.5rem; display: flex; justify-content: center; }
            .logo img { max-width: 220px; height: auto; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.15)); }
            .subtitle { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; opacity: 0.95; }
            .description {
                font-size: 1rem;
                line-height: 1.7;
                opacity: 0.9;
                margin-bottom: 2rem;
                max-width: 750px;
                margin-left: auto;
                margin-right: auto;
            }
            .video-container {
                max-width: 700px;
                margin: 0 auto 2.5rem;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            wistia-player[media-id='fqt1aw1yl3']:not(:defined) {
                background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/fqt1aw1yl3/swatch');
                display: block;
                filter: blur(5px);
                padding-top: 56.25%;
            }
            .countdown {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                margin: 2rem 0;
                flex-wrap: wrap;
            }
            .countdown-item {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 1.25rem 1.75rem;
                min-width: 100px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .countdown-number { font-size: 2.5rem; font-weight: 800; display: block; line-height: 1; }
            .countdown-label { font-size: 0.75rem; text-transform: uppercase; opacity: 0.7; margin-top: 0.5rem; letter-spacing: 1px; }
            .email-form {
                display: flex;
                gap: 1rem;
                max-width: 500px;
                margin: 2rem auto;
                flex-wrap: wrap;
                justify-content: center;
            }
            .email-input {
                flex: 1;
                min-width: 250px;
                padding: 1rem 1.5rem;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50px;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                color: white;
                font-size: 1rem;
                outline: none;
                transition: all 0.3s;
            }
            .email-input::placeholder { color: rgba(255,255,255,0.6); }
            .email-input:focus { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.15); }
            .submit-btn {
                padding: 1rem 2rem;
                background: white;
                color: #667eea;
                border: none;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            .success-message {
                display: none;
                background: rgba(76,175,80,0.2);
                border: 1px solid rgba(76,175,80,0.4);
                padding: 1rem;
                border-radius: 12px;
                margin-top: 1rem;
                max-width: 500px;
                margin-left: auto;
                margin-right: auto;
            }
            .success-message.show { display: block; animation: slideIn 0.3s ease; }
            @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            
            /* CTA Cards */
            .cta-cards-container {
                display: flex;
                gap: 24px;
                max-width: 900px;
                margin: 40px auto;
                padding: 0 20px;
                flex-wrap: wrap;
                justify-content: center;
            }
            .cta-card {
                flex: 1;
                min-width: 320px;
                max-width: 420px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 32px 28px;
                border: 2px solid rgba(255, 255, 255, 0.15);
                transition: all 0.3s ease;
                text-align: center;
                display: flex;
                flex-direction: column;
            }
            .cta-card:hover {
                transform: translateY(-8px);
                border-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .card-icon {
                font-size: 48px;
                margin-bottom: 16px;
                animation: float 3s ease-in-out infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            .cta-card h3 {
                font-size: 24px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 12px;
                letter-spacing: -0.5px;
            }
            .cta-card p {
                font-size: 16px;
                line-height: 1.7;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 24px;
                flex: 1;
            }
            .cta-card p strong {
                color: #FFD700;
                font-weight: 600;
            }
            .cta-button {
                width: 100%;
                padding: 16px 24px;
                font-size: 16px;
                font-weight: 600;
                border-radius: 12px;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                text-decoration: none;
            }
            .primary-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .primary-btn:hover {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                transform: scale(1.05);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            }
            .secondary-btn {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .secondary-btn:hover {
                background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
                transform: scale(1.05);
                box-shadow: 0 10px 25px rgba(245, 87, 108, 0.4);
            }
            .cta-button .icon {
                font-size: 20px;
            }
            .social-links {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-top: 2rem;
            }
            .social-link {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: white;
                transition: all 0.3s;
            }
            .social-link:hover { background: rgba(255,255,255,0.2); transform: translateY(-3px); }
            .social-link svg { width: 20px; height: 20px; }
            .footer {
                margin-top: 3rem;
                padding: 1.5rem;
                text-align: center;
                font-size: 0.8rem;
                opacity: 0.7;
            }
            .footer-links {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            .footer-links a { color: white; text-decoration: none; opacity: 0.8; transition: opacity 0.2s; }
            .footer-links a:hover { opacity: 1; text-decoration: underline; }
            @media (max-width: 768px) {
                .logo img { max-width: 180px; }
                .countdown { gap: 0.75rem; }
                .countdown-item { min-width: 80px; padding: 1rem; }
                .countdown-number { font-size: 2rem; }
                .cta-cards-container { flex-direction: column; gap: 20px; }
                .cta-card { max-width: 100%; min-width: auto; }
            }
        </style>
    </head>
    <body>
        <div class="page-wrapper">
            <div class="bg-shape shape-1"></div>
            <div class="bg-shape shape-2"></div>
            <div class="bg-shape shape-3"></div>
            
            <div class="container">
            <div class="logo">
                <img src="/images/risivo-logo-white.png" alt="Risivo" />
            </div>
            
            <div class="subtitle">No. 1 CRM 100% Powered by AI</div>
            
            <p class="description">
                The AI-powered business operating system combining CRM, marketing, projects, digital creation, and communications. Automate campaigns, build websites/funnels, manage appointments, track reputation, and communicate across 15+ languages—all with AI voice control and intelligent workflows. Features 149+ integrations and white-label capabilities. AI executes 90% of your operations automatically.
            </p>
            
            <div class="video-container">
                <wistia-player media-id="fqt1aw1yl3" aspect="1.7777777777777777"></wistia-player>
            </div>
            
            <div class="countdown" id="countdown">
                <div class="countdown-item">
                    <span class="countdown-number" id="days">00</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="hours">00</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="minutes">00</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="seconds">00</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
            
            <div class="cta-cards-container">
                <!-- Waitlist Card -->
                <div class="cta-card waitlist-card">
                    <div class="card-icon">🎁</div>
                    <h3>Join Early Access</h3>
                    <p>Be among the first to experience Risivo AI CRM. Early subscribers get a <strong>14-day free trial</strong> plus <strong>50% lifetime discount</strong> when we launch!</p>
                    <a href="/signup/waitlist" class="cta-button primary-btn">
                        <span class="icon">📋</span> Join Waitlist
                    </a>
                </div>
                
                <!-- Investor Card -->
                <div class="cta-card investor-card">
                    <div class="card-icon">💼</div>
                    <h3>Investment Opportunity</h3>
                    <p>Access our complete project documentation including pitch deck, financial forecasts, business plan, executive summary, and real-time updates.</p>
                    <a href="/signup/investor" class="cta-button secondary-btn">
                        <span class="icon">🔐</span> Investor Portal
                    </a>
                </div>
            </div>
            
            <div class="social-links">
                <a href="https://www.facebook.com/people/Risivo-AI-CRM/61585523581162/" target="_blank" class="social-link" aria-label="Facebook">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/risivo-ai-crm/" target="_blank" class="social-link" aria-label="LinkedIn">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://x.com/risivocrm" target="_blank" class="social-link" aria-label="Twitter/X">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.youtube.com/@RisivoCRM" target="_blank" class="social-link" aria-label="YouTube">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
            </div>
            
            <div class="footer">
                <div class="footer-links">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms-of-service">Terms of Service</a>
                </div>
                <p>© ${currentYear} Risivo ™ Owned by Velocity Automation Corp. All rights reserved.</p>
            </div>
        </div>
        </div>
        
        <script>
            const launchDate = Date.UTC(2026, 2, 1, 0, 0, 0);
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = launchDate - now;
                if (distance < 0) {
                    document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">🚀</span><span class="countdown-label">Launched!</span></div>';
                    return;
                }
                document.getElementById('days').textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
                document.getElementById('hours').textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                document.getElementById('minutes').textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                document.getElementById('seconds').textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
            }
            updateCountdown();
            setInterval(updateCountdown, 1000);
        </script>
    </body>
    </html>
  `);
});

// Waitlist Signup Page
app.get("/signup/waitlist", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join Waitlist - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .signup-container { background: white; border-radius: 24px; max-width: 520px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    .logo h1 { color: #667eea; font-size: 28px; font-weight: 800; margin-top: 12px; }
    .logo p { color: #666; font-size: 14px; margin-top: 4px; }
    h2 { text-align: center; color: #1a1a2e; font-size: 24px; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 32px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333; }
    .form-group label span { color: #dc2626; }
    .form-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; transition: all 0.2s; }
    .form-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .phone-input-wrapper { display: flex; gap: 8px; }
    .country-select { width: 100px; padding: 14px 8px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; background: white; cursor: pointer; }
    .country-select:focus { outline: none; border-color: #667eea; }
    .phone-number { flex: 1; }
    .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .error-msg.show { display: block; }
    .success-msg { background: #dcfce7; color: #16a34a; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .success-msg.show { display: block; }
    .login-link { text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee; }
    .login-link a { color: #667eea; text-decoration: none; font-weight: 600; }
    .login-link a:hover { text-decoration: underline; }
    .back-link { display: block; text-align: center; margin-top: 16px; color: #888; text-decoration: none; font-size: 14px; }
    .back-link:hover { color: #667eea; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } .signup-container { padding: 32px 24px; } }
  </style>
</head>
<body>
  <div class="signup-container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:32px\\'>Risivo</h1>'">
      <p>Join our exclusive waitlist</p>
    </div>
    <h2>Join the Waitlist</h2>
    <p class="subtitle">Be the first to experience the future of AI-powered business management</p>
    
    <div id="error" class="error-msg"></div>
    <div id="success" class="success-msg"></div>
    
    <form id="signupForm">
      <div class="form-row">
        <div class="form-group">
          <label>First Name <span>*</span></label>
          <input type="text" class="form-input" id="firstName" required placeholder="John">
        </div>
        <div class="form-group">
          <label>Last Name <span>*</span></label>
          <input type="text" class="form-input" id="lastName" required placeholder="Doe">
        </div>
      </div>
      
      <div class="form-group">
        <label>Email Address <span>*</span></label>
        <input type="email" class="form-input" id="email" required placeholder="john@company.com">
      </div>
      
      <div class="form-group">
        <label>Phone Number <span>*</span></label>
        <div class="phone-input-wrapper">
          <select class="country-select" id="countryCode">
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+81">🇯🇵 +81</option>
            <option value="+86">🇨🇳 +86</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+55">🇧🇷 +55</option>
            <option value="+52">🇲🇽 +52</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+39">🇮🇹 +39</option>
            <option value="+82">🇰🇷 +82</option>
            <option value="+65">🇸🇬 +65</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+966">🇸🇦 +966</option>
            <option value="+27">🇿🇦 +27</option>
            <option value="+234">🇳🇬 +234</option>
            <option value="+63">🇵🇭 +63</option>
            <option value="+62">🇮🇩 +62</option>
          </select>
          <input type="tel" class="form-input phone-number" id="phone" required placeholder="555 123 4567">
        </div>
      </div>
      
      <div class="form-group">
        <label>Agency/Business Name <span>*</span></label>
        <input type="text" class="form-input" id="businessName" required placeholder="Your Company LLC">
      </div>
      
      <button type="submit" class="submit-btn" id="submitBtn">Join Waitlist</button>
    </form>
    
    <div class="login-link">
      Already registered? <a href="/updates/login">Sign In</a>
    </div>
    <a href="/" class="back-link">← Back to Home</a>
  </div>
  
  <script>
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const error = document.getElementById('error');
      const success = document.getElementById('success');
      
      const data = {
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        phone: document.getElementById('countryCode').value + ' ' + document.getElementById('phone').value.trim(),
        business_name: document.getElementById('businessName').value.trim(),
        user_type: 'waitlist'
      };
      
      btn.disabled = true;
      btn.textContent = 'Submitting...';
      error.classList.remove('show');
      success.classList.remove('show');
      
      try {
        const res = await fetch('/api/waitlist/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.success) {
          success.textContent = '✓ Success! Please check your email to verify your account.';
          success.classList.add('show');
          document.getElementById('signupForm').reset();
        } else {
          error.textContent = result.error || 'Registration failed. Please try again.';
          error.classList.add('show');
        }
      } catch (err) {
        error.textContent = 'Connection error. Please try again.';
        error.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Join Waitlist';
      }
    });
  </script>
</body>
</html>
  `);
});

// Investor Signup Page
app.get("/signup/investor", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Become an Investor - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .signup-container { background: white; border-radius: 24px; max-width: 520px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    .logo h1 { color: #667eea; font-size: 28px; font-weight: 800; margin-top: 12px; }
    .logo p { color: #666; font-size: 14px; margin-top: 4px; }
    h2 { text-align: center; color: #1a1a2e; font-size: 24px; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 32px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333; }
    .form-group label span { color: #dc2626; }
    .form-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; transition: all 0.2s; }
    .form-input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    .phone-input-wrapper { display: flex; gap: 8px; }
    .country-select { width: 100px; padding: 14px 8px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; background: white; cursor: pointer; }
    .country-select:focus { outline: none; border-color: #667eea; }
    .phone-number { flex: 1; }
    .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .error-msg.show { display: block; }
    .success-msg { background: #dcfce7; color: #16a34a; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .success-msg.show { display: block; }
    .info-box { background: #f0f4ff; border: 1px solid #c7d2fe; padding: 16px; border-radius: 12px; margin-bottom: 24px; }
    .info-box h4 { color: #4f46e5; font-size: 14px; margin-bottom: 8px; }
    .info-box p { color: #666; font-size: 13px; line-height: 1.5; }
    .login-link { text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee; }
    .login-link a { color: #667eea; text-decoration: none; font-weight: 600; }
    .login-link a:hover { text-decoration: underline; }
    .back-link { display: block; text-align: center; margin-top: 16px; color: #888; text-decoration: none; font-size: 14px; }
    .back-link:hover { color: #667eea; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } .signup-container { padding: 32px 24px; } }
  </style>
</head>
<body>
  <div class="signup-container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:32px\\'>Risivo</h1>'">
      <p>Investor Registration</p>
    </div>
    <h2>Become an Investor</h2>
    <p class="subtitle">Get exclusive access to confidential investor materials</p>
    
    <div class="info-box">
      <h4>📋 What happens next?</h4>
      <p>After registration, you'll receive an email with a link to sign our Non-Disclosure Agreement (NDA). Once the NDA is signed, you'll get access to our investor portal with pitch decks, financial forecasts, and exclusive updates.</p>
    </div>
    
    <div id="error" class="error-msg"></div>
    <div id="success" class="success-msg"></div>
    
    <form id="signupForm">
      <div class="form-row">
        <div class="form-group">
          <label>First Name <span>*</span></label>
          <input type="text" class="form-input" id="firstName" required placeholder="John">
        </div>
        <div class="form-group">
          <label>Last Name <span>*</span></label>
          <input type="text" class="form-input" id="lastName" required placeholder="Doe">
        </div>
      </div>
      
      <div class="form-group">
        <label>Email Address <span>*</span></label>
        <input type="email" class="form-input" id="email" required placeholder="john@company.com">
      </div>
      
      <div class="form-group">
        <label>Phone Number <span>*</span></label>
        <div class="phone-input-wrapper">
          <select class="country-select" id="countryCode">
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+81">🇯🇵 +81</option>
            <option value="+86">🇨🇳 +86</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+55">🇧🇷 +55</option>
            <option value="+52">🇲🇽 +52</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+39">🇮🇹 +39</option>
            <option value="+82">🇰🇷 +82</option>
            <option value="+65">🇸🇬 +65</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+966">🇸🇦 +966</option>
            <option value="+27">🇿🇦 +27</option>
            <option value="+234">🇳🇬 +234</option>
            <option value="+63">🇵🇭 +63</option>
            <option value="+62">🇮🇩 +62</option>
          </select>
          <input type="tel" class="form-input phone-number" id="phone" required placeholder="555 123 4567">
        </div>
      </div>
      
      <div class="form-group">
        <label>Company Name <span>*</span></label>
        <input type="text" class="form-input" id="companyName" required placeholder="Investment Firm LLC">
      </div>
      
      <button type="submit" class="submit-btn" id="submitBtn">Register as Investor</button>
    </form>
    
    <div class="login-link">
      Already registered? <a href="/updates/investor/login">Investor Sign In</a>
    </div>
    <a href="/" class="back-link">← Back to Home</a>
  </div>
  
  <script>
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const error = document.getElementById('error');
      const success = document.getElementById('success');
      
      const data = {
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        phone: document.getElementById('countryCode').value + ' ' + document.getElementById('phone').value.trim(),
        business_name: document.getElementById('companyName').value.trim(),
        user_type: 'investor'
      };
      
      btn.disabled = true;
      btn.textContent = 'Submitting...';
      error.classList.remove('show');
      success.classList.remove('show');
      
      try {
        const res = await fetch('/api/investor/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (result.success) {
          success.textContent = '✓ Registration successful! Please check your email for the NDA signing link.';
          success.classList.add('show');
          document.getElementById('signupForm').reset();
        } else {
          error.textContent = result.error || 'Registration failed. Please try again.';
          error.classList.add('show');
        }
      } catch (err) {
        error.textContent = 'Connection error. Please try again.';
        error.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Register as Investor';
      }
    });
  </script>
</body>
</html>
  `);
});

// Waitlist Login Page
app.get("/waitlist/login", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waitlist Login - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .login-container { background: white; border-radius: 24px; max-width: 420px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    .logo p { color: #666; font-size: 14px; margin-top: 8px; }
    h2 { text-align: center; color: #1a1a2e; font-size: 24px; margin-bottom: 32px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333; }
    .form-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; transition: all 0.2s; }
    .form-input:focus { outline: none; border-color: #667eea; }
    .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .error-msg { background: #fee2e2; color: #dc2626; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .error-msg.show { display: block; }
    .success-msg { background: #d1fae5; color: #047857; padding: 16px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; line-height: 1.6; border: 1px solid #a7f3d0; }
    .success-msg.show { display: block; }
    .success-msg strong { display: block; margin-bottom: 6px; font-size: 15px; color: #065f46; }
    .links { text-align: center; margin-top: 24px; }
    .links a { color: #667eea; text-decoration: none; font-size: 14px; margin: 0 8px; }
    .links a:hover { text-decoration: underline; }
    .back-link { display: block; text-align: center; margin-top: 16px; color: #888; text-decoration: none; font-size: 14px; }
    .back-link:hover { color: #667eea; }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:28px\\'>Risivo</h1>'">
      <p>Waitlist Member Portal</p>
    </div>
    <h2>Sign In</h2>
    
    <div id="success" class="success-msg"></div>
    <div id="error" class="error-msg"></div>
    
    <form id="loginForm">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" class="form-input" id="email" required placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-input" id="password" required placeholder="Enter your password">
      </div>
      <button type="submit" class="submit-btn" id="submitBtn">Sign In</button>
    </form>
    
    <div class="links">
      <a href="/waitlist/forgot-password">Forgot Password?</a>
      <a href="/signup/waitlist">Create Account</a>
    </div>
    <a href="/" class="back-link">← Back to Home</a>
  </div>
  
  <script>
    // Check for verification success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      const successEl = document.getElementById('success');
      successEl.innerHTML = '<strong>Email Verified Successfully!</strong>Your account is now active. Please check your email for your login credentials (temporary password). If you don\\'t see it, check your spam folder.';
      successEl.classList.add('show');
      // Clean URL without reloading
      window.history.replaceState({}, document.title, '/waitlist/login');
    }
    
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const error = document.getElementById('error');
      const success = document.getElementById('success');
      
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      error.classList.remove('show');
      success.classList.remove('show');
      
      try {
        const res = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
          })
        });
        const data = await res.json();
        
        if (data.success) {
          window.location.href = '/waitlist/dashboard';
        } else {
          error.textContent = data.details || data.error || 'Login failed';
          error.classList.add('show');
        }
      } catch (err) {
        error.textContent = 'Connection error. Please try again.';
        error.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });
  </script>
</body>
</html>
  `);
});

// Waitlist Dashboard
app.get("/waitlist/dashboard", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waitlist Dashboard - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f5f7fa; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; }
    .header-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .header-logo img { height: 32px; filter: brightness(0) invert(1); }
    .header-nav { display: flex; gap: 16px; align-items: center; }
    .user-info { font-size: 14px; opacity: 0.9; }
    .logout-btn { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; }
    .logout-btn:hover { background: rgba(255,255,255,0.25); }
    .main { max-width: 1200px; margin: 0 auto; padding: 32px 20px; }
    .welcome { background: white; border-radius: 20px; padding: 40px; margin-bottom: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); position: relative; overflow: hidden; }
    .welcome::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: linear-gradient(180deg, #667eea, #764ba2); }
    .welcome h1 { font-size: 28px; color: #1a1a2e; margin-bottom: 8px; }
    .welcome p { color: #666; font-size: 15px; }
    .waitlist-number { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 20px; border-radius: 30px; font-size: 18px; font-weight: 700; margin-top: 16px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .stat-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }
    .stat-icon.purple { background: #f3e8ff; }
    .stat-icon.blue { background: #dbeafe; }
    .stat-icon.green { background: #dcfce7; }
    .stat-title { font-size: 14px; color: #666; margin-bottom: 4px; }
    .stat-value { font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .content-section { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .section-title { font-size: 22px; font-weight: 700; color: #1a1a2e; }
    
    /* Blog-style update cards */
    .updates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
    .update-card { background: white; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; }
    .update-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15); border-color: #667eea; }
    .update-image { width: 100%; height: 200px; object-fit: cover; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .update-image-placeholder { width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; }
    .update-content { padding: 20px; }
    .update-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
    .update-category { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .update-date { font-size: 13px; color: #888; }
    .update-title { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .update-excerpt { font-size: 14px; color: #666; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 16px; }
    .update-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #f0f0f0; }
    .update-author { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #666; }
    .update-author-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600; }
    .update-stats { display: flex; gap: 12px; font-size: 12px; color: #888; }
    .update-stat { display: flex; align-items: center; gap: 4px; }
    .read-more-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .read-more-btn:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    
    /* Detail Modal */
    .detail-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: none; z-index: 2000; overflow-y: auto; }
    .detail-modal.show { display: block; }
    .detail-container { max-width: 900px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 80px rgba(0,0,0,0.3); }
    .detail-close { position: fixed; top: 20px; right: 20px; width: 48px; height: 48px; background: white; border: none; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 2001; display: flex; align-items: center; justify-content: center; }
    .detail-close:hover { background: #f5f5f5; }
    .detail-featured-image { width: 100%; height: 400px; object-fit: cover; }
    .detail-body { padding: 40px; }
    .detail-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .detail-category { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .detail-date { font-size: 14px; color: #888; }
    .detail-author { font-size: 14px; color: #666; }
    .detail-title { font-size: 32px; font-weight: 800; color: #1a1a2e; margin-bottom: 24px; line-height: 1.3; }
    .detail-stats { display: flex; gap: 24px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #eee; }
    .detail-stat { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #666; }
    .detail-stat svg { width: 18px; height: 18px; }
    .detail-action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #e0e0e0; border-radius: 20px; background: white; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s; }
    .detail-action-btn:hover { border-color: #667eea; color: #667eea; background: rgba(102, 126, 234, 0.05); }
    .detail-action-btn svg { width: 18px; height: 18px; }
    .like-btn:hover { border-color: #10b981; color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .dislike-btn:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.05); }
    .detail-content { font-size: 16px; line-height: 1.8; color: #444; }
    .detail-content p { margin-bottom: 16px; }
    .detail-content h1, .detail-content h2, .detail-content h3 { color: #1a1a2e; margin: 24px 0 16px; }
    .detail-content ul, .detail-content ol { margin: 16px 0; padding-left: 24px; }
    .detail-content li { margin-bottom: 8px; }
    .detail-content img { max-width: 100%; border-radius: 12px; margin: 16px 0; }
    .detail-content a { color: #667eea; }
    
    /* Video embed */
    .detail-video { margin: 24px 0; border-radius: 12px; overflow: hidden; }
    .detail-video iframe { width: 100%; aspect-ratio: 16/9; border: none; }
    
    /* Gallery */
    .detail-gallery { margin: 32px 0; }
    .detail-gallery-title { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; }
    .detail-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
    .detail-gallery-item { aspect-ratio: 1; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
    .detail-gallery-item:hover { transform: scale(1.05); }
    .detail-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    
    /* Lightbox */
    .lightbox { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); display: none; align-items: center; justify-content: center; z-index: 3000; }
    .lightbox.show { display: flex; }
    .lightbox img { max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; }
    .lightbox-close { position: absolute; top: 20px; right: 20px; width: 48px; height: 48px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: white; font-size: 24px; cursor: pointer; }
    .lightbox-close:hover { background: rgba(255,255,255,0.2); }
    .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: white; font-size: 24px; cursor: pointer; }
    .lightbox-nav:hover { background: rgba(255,255,255,0.2); }
    .lightbox-prev { left: 20px; }
    .lightbox-next { right: 20px; }
    
    .footer { text-align: center; padding: 40px 20px; color: #888; font-size: 13px; }
    .loading { text-align: center; padding: 60px; color: #666; }
    .empty-state { text-align: center; padding: 60px 20px; color: #888; }
    .empty-state-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.5; }
    .empty-state-text { font-size: 16px; }
    
    /* Settings button */
    .settings-btn { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .settings-btn:hover { background: rgba(255,255,255,0.25); }
    
    /* Password Modal */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-overlay.show { display: flex; }
    .modal { background: white; border-radius: 20px; max-width: 420px; width: 100%; padding: 32px; box-shadow: 0 25px 80px rgba(0,0,0,0.3); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .modal-title { font-size: 20px; font-weight: 700; color: #1a1a2e; }
    .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #888; padding: 4px; }
    .modal-close:hover { color: #333; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333; }
    .form-input { width: 100%; padding: 12px 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; transition: border-color 0.2s; }
    .form-input:focus { outline: none; border-color: #667eea; }
    .modal-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .modal-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
    .modal-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .modal-msg { padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; display: none; }
    .modal-msg.error { background: #fee2e2; color: #dc2626; display: block; }
    .modal-msg.success { background: #dcfce7; color: #16a34a; display: block; }
    
    @media (max-width: 768px) {
      .updates-grid { grid-template-columns: 1fr; }
      .detail-container { margin: 0; border-radius: 0; min-height: 100vh; }
      .detail-featured-image { height: 250px; }
      .detail-body { padding: 24px; }
      .detail-title { font-size: 24px; }
      .detail-close { top: 10px; right: 10px; width: 40px; height: 40px; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <div class="header-logo">
        <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<span style=\\\\'font-size:24px;font-weight:800\\\\'>Risivo</span>'">
      </div>
      <div class="header-nav">
        <span class="user-info" id="userEmail">Loading...</span>
        <button class="settings-btn" onclick="openChangePassword()">🔑 Change Password</button>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
  </header>
  
  <!-- Change Password Modal -->
  <div class="modal-overlay" id="passwordModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Change Password</h3>
        <button class="modal-close" onclick="closeChangePassword()">&times;</button>
      </div>
      <div id="passwordMsg" class="modal-msg"></div>
      <form id="changePasswordForm">
        <div class="form-group">
          <label>Current Password</label>
          <input type="password" class="form-input" id="currentPassword" required placeholder="Enter current password">
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" class="form-input" id="newPassword" required placeholder="Enter new password (min 8 characters)" minlength="8">
        </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input type="password" class="form-input" id="confirmPassword" required placeholder="Confirm new password">
        </div>
        <button type="submit" class="modal-btn" id="changePasswordBtn">Update Password</button>
      </form>
    </div>
  </div>
  
  <main class="main">
    <div class="welcome">
      <h1>Welcome back, <span id="userName">...</span>!</h1>
      <p>You're on the exclusive Risivo waitlist. We'll notify you as soon as we launch!</p>
      <div class="waitlist-number" id="waitlistNumber">Loading...</div>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-icon purple">🎯</div>
        <div class="stat-title">Your Position</div>
        <div class="stat-value" id="position">-</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">📅</div>
        <div class="stat-title">Member Since</div>
        <div class="stat-value" id="memberSince">-</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div class="stat-title">Status</div>
        <div class="stat-value" id="status">Active</div>
      </div>
    </div>
    
    <div class="content-section">
      <div class="section-header">
        <h2 class="section-title">Latest Updates</h2>
      </div>
      <div id="updatesList" class="updates-grid">
        <div class="loading">Loading updates...</div>
      </div>
    </div>
  </main>
  
  <!-- Update Detail Modal -->
  <div class="detail-modal" id="detailModal">
    <button class="detail-close" onclick="closeDetail()">&times;</button>
    <div class="detail-container">
      <img class="detail-featured-image" id="detailImage" src="" alt="">
      <div class="detail-body">
        <div class="detail-meta">
          <span class="detail-category" id="detailCategory">Update</span>
          <span class="detail-date" id="detailDate"></span>
          <span class="detail-author" id="detailAuthor"></span>
        </div>
        <h1 class="detail-title" id="detailTitle"></h1>
        <div class="detail-stats">
          <div class="detail-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg><span id="detailViews">0 views</span></div>
          <button class="detail-action-btn like-btn" onclick="likeUpdate()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg><span id="detailLikes">0</span></button>
          <button class="detail-action-btn dislike-btn" onclick="dislikeUpdate()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg><span id="detailDislikes">0</span></button>
        </div>
        <div class="detail-content" id="detailContent"></div>
        <div class="detail-video" id="detailVideo" style="display:none;"></div>
        <div class="detail-gallery" id="detailGallery" style="display:none;">
          <h3 class="detail-gallery-title">Gallery</h3>
          <div class="detail-gallery-grid" id="detailGalleryGrid"></div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Lightbox -->
  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
    <button class="lightbox-nav lightbox-prev" onclick="prevImage()">&#10094;</button>
    <img id="lightboxImage" src="" alt="">
    <button class="lightbox-nav lightbox-next" onclick="nextImage()">&#10095;</button>
  </div>
  
  <footer class="footer">
    <p>© ${currentYear} Risivo. Owned by Velocity Automation Corp. All rights reserved.</p>
  </footer>
  
  <script>
    let currentUser = null;
    
    // Global Error Tracking
    window.onerror = function(message, source, lineno, colno, error) {
      reportError('JavaScript Error', message, error ? error.stack : null);
      return false;
    };
    
    window.onunhandledrejection = function(event) {
      reportError('Unhandled Promise Rejection', event.reason ? event.reason.message || String(event.reason) : 'Unknown', event.reason ? event.reason.stack : null);
    };
    
    function reportError(errorType, errorMessage, errorStack) {
      try {
        fetch('/api/report-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            errorType,
            errorMessage: String(errorMessage).substring(0, 1000),
            errorStack: errorStack ? String(errorStack).substring(0, 2000) : null,
            userEmail: currentUser ? currentUser.email : null,
            userName: currentUser ? (currentUser.first_name + ' ' + currentUser.last_name) : null,
            userType: 'waitlist',
            pageUrl: window.location.href,
            additionalInfo: 'Waitlist Dashboard'
          })
        }).catch(e => console.error('Error reporting failed:', e));
      } catch (e) {
        console.error('Error reporting failed:', e);
      }
    }
    
    async function init() {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        
        if (!data.success) {
          window.location.href = '/waitlist/login';
          return;
        }
        
        const user = data.user;
        currentUser = user;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userName').textContent = user.first_name || 'Member';
        document.getElementById('waitlistNumber').textContent = user.waitlist_number ? '#' + user.waitlist_number : 'Waitlist Member';
        document.getElementById('position').textContent = user.waitlist_number || '-';
        document.getElementById('memberSince').textContent = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        document.getElementById('status').textContent = user.status === 'active' ? 'Active' : user.status || 'Pending';
        
        // Load updates
        loadUpdates();
      } catch (error) {
        console.error('Init error:', error);
        reportError('Init Error', error.message, error.stack);
        window.location.href = '/waitlist/login';
      }
    }
    
    let allUpdates = [];
    let galleryImages = [];
    let currentImageIndex = 0;
    
    async function loadUpdates() {
      try {
        const res = await fetch('/api/updates/list');
        const data = await res.json();
        
        const container = document.getElementById('updatesList');
        
        if (!data.success || !data.updates || data.updates.length === 0) {
          container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📰</div><p class="empty-state-text">No updates yet. Check back soon!</p></div>';
          return;
        }
        
        allUpdates = data.updates;
        container.innerHTML = allUpdates.map((u, index) => {
          const date = new Date(u.published_at || u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const authorInitial = (u.author_name || 'R')[0].toUpperCase();
          const hasImage = u.featured_image_url;
          const safeTitle = (u.title || '').replace(/"/g, '&quot;');
          const categoryName = u.category_name || 'Update';
          const categoryIcon = u.category_icon || '📰';
          
          let html = '<div class="update-card" onclick="openDetail(' + index + ')">';
          if (hasImage) {
            html += '<img class="update-image" src="' + u.featured_image_url + '" alt="' + safeTitle + '" onerror="this.style.display=\\'none\\';this.nextElementSibling.style.display=\\'flex\\';">';
            html += '<div class="update-image-placeholder" style="display:none;">' + categoryIcon + '</div>';
          } else {
            html += '<div class="update-image-placeholder">' + categoryIcon + '</div>';
          }
          html += '<div class="update-content">';
          html += '<div class="update-meta">';
          html += '<span class="update-category">' + categoryIcon + ' ' + categoryName + '</span>';
          html += '<span class="update-date">' + date + '</span>';
          html += '</div>';
          html += '<h3 class="update-title">' + safeTitle + '</h3>';
          html += '<p class="update-excerpt">' + (u.excerpt || stripHtml(u.content || '').substring(0, 150) + '...') + '</p>';
          html += '<div class="update-footer">';
          html += '<div class="update-author">';
          html += '<div class="update-author-avatar">' + authorInitial + '</div>';
          html += '<span>' + (u.author_name || 'Risivo Team') + '</span>';
          html += '</div>';
          html += '<div class="update-stats">';
          html += '<span class="update-stat">👁 ' + (u.views_count || 0) + '</span>';
          html += '<span class="update-stat">👍 ' + (u.likes_count || 0) + '</span>';
          html += '</div>';
          html += '</div>';
          html += '</div>';
          html += '</div>';
          return html;
        }).join('');
      } catch (error) {
        console.error('Load updates error:', error);
        document.getElementById('updatesList').innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p class="empty-state-text">Unable to load updates.</p></div>';
      }
    }
    
    function stripHtml(html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
    
    let currentUpdateId = null;
    
    function openDetail(index) {
      const update = allUpdates[index];
      if (!update) return;
      
      currentUpdateId = update.id;
      
      // Track view
      fetch('/api/updates/' + update.id + '/view', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            update.views_count = data.views_count;
            document.getElementById('detailViews').textContent = data.views_count + ' views';
          }
        })
        .catch(err => console.log('View tracking error:', err));
      
      document.getElementById('detailImage').src = update.featured_image_url || '';
      document.getElementById('detailImage').style.display = update.featured_image_url ? 'block' : 'none';
      
      const categoryName = update.category_name || 'Update';
      const categoryIcon = update.category_icon || '📰';
      document.getElementById('detailCategory').textContent = categoryIcon + ' ' + categoryName;
      document.getElementById('detailDate').textContent = new Date(update.published_at || update.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      document.getElementById('detailAuthor').textContent = 'By ' + (update.author_name || 'Risivo Team');
      document.getElementById('detailTitle').textContent = update.title;
      document.getElementById('detailViews').textContent = (update.views_count || 0) + ' views';
      document.getElementById('detailLikes').textContent = (update.likes_count || 0);
      document.getElementById('detailDislikes').textContent = (update.dislikes_count || 0);
      document.getElementById('detailContent').innerHTML = update.content || '<p>No content available.</p>';
      
      // Video
      const videoContainer = document.getElementById('detailVideo');
      if (update.media_url && update.media_type === 'video') {
        const videoId = extractYoutubeId(update.media_url);
        if (videoId) {
          videoContainer.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '" allowfullscreen></iframe>';
          videoContainer.style.display = 'block';
        } else {
          videoContainer.style.display = 'none';
        }
      } else {
        videoContainer.style.display = 'none';
      }
      
      // Gallery - handle both array of strings and array of objects
      const galleryContainer = document.getElementById('detailGallery');
      const galleryGrid = document.getElementById('detailGalleryGrid');
      let galleryArr = update.gallery_images || [];
      
      // Parse if it's a string
      if (typeof galleryArr === 'string') {
        try { galleryArr = JSON.parse(galleryArr); } catch(e) { galleryArr = []; }
      }
      
      if (Array.isArray(galleryArr) && galleryArr.length > 0) {
        // Handle both string URLs and objects with url property
        galleryImages = galleryArr.map(img => typeof img === 'string' ? img : (img.url || img));
        galleryGrid.innerHTML = galleryImages.map((imgUrl, i) => 
          '<div class="detail-gallery-item" onclick="event.stopPropagation();openLightbox(' + i + ')"><img src="' + imgUrl + '" alt="Gallery image ' + (i+1) + '" onerror="this.parentElement.style.display=\\'none\\'"></div>'
        ).join('');
        galleryContainer.style.display = 'block';
      } else {
        galleryImages = [];
        galleryContainer.style.display = 'none';
      }
      
      document.getElementById('detailModal').classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    
    async function likeUpdate() {
      if (!currentUpdateId) return;
      try {
        const res = await fetch('/api/updates/' + currentUpdateId + '/like', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          document.getElementById('detailLikes').textContent = data.likes_count;
          // Update in allUpdates array
          const update = allUpdates.find(u => u.id === currentUpdateId);
          if (update) update.likes_count = data.likes_count;
        }
      } catch (err) {
        console.error('Like error:', err);
      }
    }
    
    async function dislikeUpdate() {
      if (!currentUpdateId) return;
      try {
        const res = await fetch('/api/updates/' + currentUpdateId + '/dislike', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          document.getElementById('detailDislikes').textContent = data.dislikes_count;
          // Update in allUpdates array
          const update = allUpdates.find(u => u.id === currentUpdateId);
          if (update) update.dislikes_count = data.dislikes_count;
        }
      } catch (err) {
        console.error('Dislike error:', err);
      }
    }
    
    function closeDetail() {
      document.getElementById('detailModal').classList.remove('show');
      document.body.style.overflow = '';
    }
    
    function extractYoutubeId(url) {
      if (!url) return null;
      const match = url.match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }
    
    function openLightbox(index) {
      currentImageIndex = index;
      document.getElementById('lightboxImage').src = galleryImages[index];
      document.getElementById('lightbox').classList.add('show');
    }
    
    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('show');
    }
    
    function prevImage() {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      document.getElementById('lightboxImage').src = galleryImages[currentImageIndex];
    }
    
    function nextImage() {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      document.getElementById('lightboxImage').src = galleryImages[currentImageIndex];
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('lightbox').classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      } else if (document.getElementById('detailModal').classList.contains('show')) {
        if (e.key === 'Escape') closeDetail();
      }
    });
    
    async function logout() {
      try {
        await fetch('/api/user/logout', { method: 'POST' });
      } catch (e) {}
      window.location.href = '/waitlist/login';
    }
    
    function openChangePassword() {
      document.getElementById('passwordModal').classList.add('show');
      document.getElementById('changePasswordForm').reset();
      document.getElementById('passwordMsg').className = 'modal-msg';
      document.getElementById('passwordMsg').textContent = '';
    }
    
    function closeChangePassword() {
      document.getElementById('passwordModal').classList.remove('show');
    }
    
    // Close modal on overlay click
    document.getElementById('passwordModal').addEventListener('click', (e) => {
      if (e.target.id === 'passwordModal') closeChangePassword();
    });
    
    document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('changePasswordBtn');
      const msg = document.getElementById('passwordMsg');
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validation
      if (newPassword !== confirmPassword) {
        msg.className = 'modal-msg error';
        msg.textContent = 'New passwords do not match';
        return;
      }
      
      if (newPassword.length < 8) {
        msg.className = 'modal-msg error';
        msg.textContent = 'Password must be at least 8 characters';
        return;
      }
      
      btn.disabled = true;
      btn.textContent = 'Updating...';
      msg.className = 'modal-msg';
      
      try {
        const res = await fetch('/api/user/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
        });
        const data = await res.json();
        
        if (data.success) {
          msg.className = 'modal-msg success';
          msg.textContent = 'Password updated successfully!';
          document.getElementById('changePasswordForm').reset();
          setTimeout(closeChangePassword, 2000);
        } else {
          msg.className = 'modal-msg error';
          msg.textContent = data.error || 'Failed to update password';
        }
      } catch (err) {
        msg.className = 'modal-msg error';
        msg.textContent = 'Connection error. Please try again.';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Update Password';
      }
    });
    
    init();
  </script>
</body>
</html>
  `);
});

// Forgot Password - Waitlist
app.get("/waitlist/forgot-password", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 24px; max-width: 420px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    h2 { text-align: center; color: #1a1a2e; font-size: 24px; margin-bottom: 12px; }
    .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 32px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; }
    .form-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; }
    .form-input:focus { outline: none; border-color: #667eea; }
    .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; }
    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .message { padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .message.error { background: #fee2e2; color: #dc2626; }
    .message.success { background: #dcfce7; color: #16a34a; }
    .message.show { display: block; }
    .back-link { display: block; text-align: center; margin-top: 24px; color: #667eea; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:28px\\'>Risivo</h1>'">
    </div>
    <h2>Forgot Password?</h2>
    <p class="subtitle">Enter your email and we'll send you a reset link</p>
    
    <div id="message" class="message"></div>
    
    <form id="forgotForm">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" class="form-input" id="email" required placeholder="your@email.com">
      </div>
      <button type="submit" class="submit-btn" id="submitBtn">Send Reset Link</button>
    </form>
    
    <a href="/waitlist/login" class="back-link">← Back to Login</a>
  </div>
  
  <script>
    document.getElementById('forgotForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const message = document.getElementById('message');
      
      btn.disabled = true;
      btn.textContent = 'Sending...';
      message.classList.remove('show', 'error', 'success');
      
      try {
        const res = await fetch('/api/user/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: document.getElementById('email').value.trim() })
        });
        const data = await res.json();
        
        message.textContent = data.message || 'If this email is registered, you will receive a reset link.';
        message.classList.add('show', data.success ? 'success' : 'error');
      } catch (err) {
        message.textContent = 'Connection error. Please try again.';
        message.classList.add('show', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Reset Link';
      }
    });
  </script>
</body>
</html>
  `);
});

// Forgot Password - Investor
app.get("/investor/forgot-password", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password - Investor Portal - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 24px; max-width: 420px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    h2 { text-align: center; color: #1a1a2e; font-size: 24px; margin-bottom: 12px; }
    .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 32px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; }
    .form-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; }
    .form-input:focus { outline: none; border-color: #667eea; }
    .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; }
    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .message { padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .message.error { background: #fee2e2; color: #dc2626; }
    .message.success { background: #dcfce7; color: #16a34a; }
    .message.show { display: block; }
    .back-link { display: block; text-align: center; margin-top: 24px; color: #667eea; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:28px\\'>Risivo</h1>'">
    </div>
    <h2>Forgot Password?</h2>
    <p class="subtitle">Enter your email and we'll send you a reset link</p>
    
    <div id="message" class="message"></div>
    
    <form id="forgotForm">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" class="form-input" id="email" required placeholder="investor@email.com">
      </div>
      <button type="submit" class="submit-btn" id="submitBtn">Send Reset Link</button>
    </form>
    
    <a href="/updates/investor/login" class="back-link">← Back to Investor Login</a>
  </div>
  
  <script>
    document.getElementById('forgotForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const message = document.getElementById('message');
      
      btn.disabled = true;
      btn.textContent = 'Sending...';
      message.classList.remove('show', 'error', 'success');
      
      try {
        const res = await fetch('/api/investor/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: document.getElementById('email').value.trim() })
        });
        const data = await res.json();
        
        message.textContent = data.message || 'If this email is registered, you will receive a reset link.';
        message.classList.add('show', data.success ? 'success' : 'error');
      } catch (err) {
        message.textContent = 'Connection error. Please try again.';
        message.classList.add('show', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Reset Link';
      }
    });
  </script>
</body>
</html>
  `);
});

// Email Verification Page
app.get("/verify-email", (c) => {
  const token = c.req.query('token');
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Email - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 24px; max-width: 420px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); text-align: center; }
    .logo img { height: 48px; margin-bottom: 24px; }
    .icon { font-size: 64px; margin-bottom: 24px; }
    h2 { color: #1a1a2e; font-size: 24px; margin-bottom: 16px; }
    p { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; transition: all 0.3s; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .error { color: #dc2626; }
    .success { color: #16a34a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:28px\\'>Risivo</h1>'">
    </div>
    <div id="content">
      <div class="icon">⏳</div>
      <h2>Verifying Your Email</h2>
      <p>Please wait while we verify your email address...</p>
    </div>
  </div>
  
  <script>
    async function verifyEmail() {
      const token = '${token || ''}';
      const content = document.getElementById('content');
      
      if (!token) {
        content.innerHTML = \`
          <div class="icon">❌</div>
          <h2 class="error">Invalid Link</h2>
          <p>This verification link is invalid or has expired.</p>
          <a href="/signup/waitlist" class="btn">Register Again</a>
        \`;
        return;
      }
      
      try {
        const res = await fetch('/api/waitlist/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        
        if (data.success) {
          content.innerHTML = \`
            <div class="icon">✅</div>
            <h2 class="success">Email Verified!</h2>
            <p>\${data.message || 'Your email has been verified successfully. Check your inbox for login credentials.'}</p>
            <a href="/waitlist/login" class="btn">Sign In</a>
          \`;
        } else {
          content.innerHTML = \`
            <div class="icon">❌</div>
            <h2 class="error">Verification Failed</h2>
            <p>\${data.error || 'This link may have expired or already been used.'}</p>
            <a href="/signup/waitlist" class="btn">Register Again</a>
          \`;
        }
      } catch (error) {
        content.innerHTML = \`
          <div class="icon">⚠️</div>
          <h2 class="error">Something Went Wrong</h2>
          <p>Unable to verify your email. Please try again later.</p>
          <a href="/" class="btn">Go Home</a>
        \`;
      }
    }
    
    verifyEmail();
  </script>
</body>
</html>
  `);
});

// Password Reset Page
app.get("/reset-password", (c) => {
  const token = c.req.query('token');
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .container { background: white; border-radius: 24px; max-width: 420px; width: 100%; padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    h2 { text-align: center; color: #1a1a2e; font-size: 24px; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #666; font-size: 14px; margin-bottom: 32px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #333; }
    .form-input { width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; }
    .form-input:focus { outline: none; border-color: #667eea; }
    .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; }
    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .message { padding: 14px; border-radius: 12px; margin-bottom: 20px; display: none; font-size: 14px; }
    .message.error { background: #fee2e2; color: #dc2626; }
    .message.success { background: #dcfce7; color: #16a34a; }
    .message.show { display: block; }
    .back-link { display: block; text-align: center; margin-top: 24px; color: #667eea; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
    .password-requirements { font-size: 12px; color: #888; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/images/risivo-logo.png" alt="Risivo" onerror="this.outerHTML='<h1 style=\\'color:#667eea;font-size:28px\\'>Risivo</h1>'">
    </div>
    <h2>Reset Password</h2>
    <p class="subtitle">Enter your new password below</p>
    
    <div id="message" class="message"></div>
    
    <form id="resetForm">
      <input type="hidden" id="token" value="${token || ''}">
      <div class="form-group">
        <label>New Password</label>
        <input type="password" class="form-input" id="password" required placeholder="Enter new password" minlength="8">
        <p class="password-requirements">Minimum 8 characters</p>
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" class="form-input" id="confirmPassword" required placeholder="Confirm new password">
      </div>
      <button type="submit" class="submit-btn" id="submitBtn">Reset Password</button>
    </form>
    
    <a href="/waitlist/login" class="back-link">← Back to Login</a>
  </div>
  
  <script>
    document.getElementById('resetForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const message = document.getElementById('message');
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const token = document.getElementById('token').value;
      
      if (!token) {
        message.textContent = 'Invalid reset link.';
        message.className = 'message error show';
        return;
      }
      
      if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        message.className = 'message error show';
        return;
      }
      
      if (password.length < 8) {
        message.textContent = 'Password must be at least 8 characters.';
        message.className = 'message error show';
        return;
      }
      
      btn.disabled = true;
      btn.textContent = 'Resetting...';
      message.classList.remove('show');
      
      try {
        const res = await fetch('/api/user/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, new_password: password })
        });
        const data = await res.json();
        
        if (data.success) {
          message.textContent = 'Password reset successfully! Redirecting to login...';
          message.className = 'message success show';
          setTimeout(() => window.location.href = '/waitlist/login', 2000);
        } else {
          message.textContent = data.error || 'Failed to reset password.';
          message.className = 'message error show';
          btn.disabled = false;
          btn.textContent = 'Reset Password';
        }
      } catch (error) {
        message.textContent = 'Connection error. Please try again.';
        message.className = 'message error show';
        btn.disabled = false;
        btn.textContent = 'Reset Password';
      }
    });
  </script>
</body>
</html>
  `);
});

// Privacy Policy Page
app.get("/privacy-policy", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8f9fc; color: #333; line-height: 1.7; }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 24px 40px;
      text-align: center;
    }
    .header img { height: 40px; filter: brightness(0) invert(1); }
    .container { max-width: 800px; margin: 0 auto; padding: 60px 40px; }
    h1 { color: #1a1a2e; font-size: 36px; margin-bottom: 16px; }
    .updated { color: #888; font-size: 14px; margin-bottom: 40px; }
    h2 { color: #1a1a2e; font-size: 22px; margin: 32px 0 16px; }
    p { margin-bottom: 16px; color: #555; }
    ul { margin: 16px 0 16px 24px; }
    li { margin-bottom: 8px; color: #555; }
    a { color: #667eea; }
    .footer {
      background: #1a1a2e;
      color: white;
      padding: 32px 40px;
      text-align: center;
    }
    .footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
    .footer-links a { color: white; text-decoration: none; opacity: 0.8; }
    .footer-links a:hover { opacity: 1; }
    .footer p { font-size: 13px; opacity: 0.7; }
  </style>
</head>
<body>
  <header class="header">
    <a href="/"><img src="/images/risivo-logo-white.png" alt="Risivo"></a>
  </header>
  <div class="container">
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: January 1, ${currentYear}</p>
    
    <h2>1. Introduction</h2>
    <p>Risivo ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>
    
    <h2>2. Information We Collect</h2>
    <p>We may collect information about you in various ways, including:</p>
    <ul>
      <li><strong>Personal Data:</strong> Name, email address, phone number, and business information you provide when signing up.</li>
      <li><strong>Usage Data:</strong> Information about how you interact with our platform.</li>
      <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</li>
    </ul>
    
    <h2>3. How We Use Your Information</h2>
    <p>We use the collected information to:</p>
    <ul>
      <li>Provide, maintain, and improve our services</li>
      <li>Process transactions and send related information</li>
      <li>Send promotional communications (with your consent)</li>
      <li>Respond to customer service requests</li>
      <li>Monitor and analyze usage patterns</li>
    </ul>
    
    <h2>4. Information Sharing</h2>
    <p>We do not sell your personal information. We may share your information with:</p>
    <ul>
      <li>Service providers who assist in our operations</li>
      <li>Business partners with your consent</li>
      <li>Legal authorities when required by law</li>
    </ul>
    
    <h2>5. Data Security</h2>
    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
    
    <h2>6. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li>Access your personal data</li>
      <li>Correct inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Object to data processing</li>
      <li>Data portability</li>
    </ul>
    
    <h2>7. Cookies</h2>
    <p>We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings.</p>
    
    <h2>8. Contact Us</h2>
    <p>If you have questions about this Privacy Policy, please contact us at:</p>
    <p>Email: <a href="mailto:privacy@risivo.com">privacy@risivo.com</a></p>
    
    <h2>9. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
  </div>
  <footer class="footer">
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms-of-service">Terms of Service</a>
    </div>
    <p>© ${currentYear} Risivo ™ Owned by Velocity Automation Corp. All rights reserved.</p>
  </footer>
</body>
</html>
  `);
});

// Terms of Service Page
app.get("/terms-of-service", (c) => {
  const currentYear = new Date().getFullYear();
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - Risivo</title>
  <link rel="icon" href="/upload_files/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="/upload_files/apple-touch-icon.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8f9fc; color: #333; line-height: 1.7; }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 24px 40px;
      text-align: center;
    }
    .header img { height: 40px; filter: brightness(0) invert(1); }
    .container { max-width: 800px; margin: 0 auto; padding: 60px 40px; }
    h1 { color: #1a1a2e; font-size: 36px; margin-bottom: 16px; }
    .updated { color: #888; font-size: 14px; margin-bottom: 40px; }
    h2 { color: #1a1a2e; font-size: 22px; margin: 32px 0 16px; }
    p { margin-bottom: 16px; color: #555; }
    ul { margin: 16px 0 16px 24px; }
    li { margin-bottom: 8px; color: #555; }
    a { color: #667eea; }
    .footer {
      background: #1a1a2e;
      color: white;
      padding: 32px 40px;
      text-align: center;
    }
    .footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
    .footer-links a { color: white; text-decoration: none; opacity: 0.8; }
    .footer-links a:hover { opacity: 1; }
    .footer p { font-size: 13px; opacity: 0.7; }
  </style>
</head>
<body>
  <header class="header">
    <a href="/"><img src="/images/risivo-logo-white.png" alt="Risivo"></a>
  </header>
  <div class="container">
    <h1>Terms of Service</h1>
    <p class="updated">Last updated: January 1, ${currentYear}</p>
    
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using Risivo's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.</p>
    
    <h2>2. Description of Service</h2>
    <p>Risivo provides an AI-powered business operating system combining CRM, marketing, projects, digital creation, and communications tools. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.</p>
    
    <h2>3. User Accounts</h2>
    <p>To access certain features, you must create an account. You are responsible for:</p>
    <ul>
      <li>Maintaining the confidentiality of your account credentials</li>
      <li>All activities that occur under your account</li>
      <li>Notifying us immediately of any unauthorized use</li>
    </ul>
    
    <h2>4. Acceptable Use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Use the service for any unlawful purpose</li>
      <li>Attempt to gain unauthorized access to any systems</li>
      <li>Interfere with or disrupt the service</li>
      <li>Upload malicious code or content</li>
      <li>Violate any applicable laws or regulations</li>
    </ul>
    
    <h2>5. Intellectual Property</h2>
    <p>All content, features, and functionality of Risivo are owned by Velocity Automation Corp. and are protected by international copyright, trademark, and other intellectual property laws.</p>
    
    <h2>6. Payment Terms</h2>
    <p>For paid services, you agree to pay all fees according to the pricing and payment terms presented at the time of purchase. All payments are non-refundable unless otherwise stated.</p>
    
    <h2>7. Limitation of Liability</h2>
    <p>Risivo and Velocity Automation Corp. shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
    
    <h2>8. Indemnification</h2>
    <p>You agree to indemnify and hold harmless Risivo, Velocity Automation Corp., and their officers, directors, employees, and agents from any claims arising from your use of the service.</p>
    
    <h2>9. Termination</h2>
    <p>We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately.</p>
    
    <h2>10. Governing Law</h2>
    <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Velocity Automation Corp. operates.</p>
    
    <h2>11. Changes to Terms</h2>
    <p>We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated terms on our website.</p>
    
    <h2>12. Contact Information</h2>
    <p>For questions about these Terms, please contact us at:</p>
    <p>Email: <a href="mailto:legal@risivo.com">legal@risivo.com</a></p>
  </div>
  <footer class="footer">
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms-of-service">Terms of Service</a>
    </div>
    <p>© ${currentYear} Risivo ™ Owned by Velocity Automation Corp. All rights reserved.</p>
  </footer>
</body>
</html>
  `);
});

export default app;
