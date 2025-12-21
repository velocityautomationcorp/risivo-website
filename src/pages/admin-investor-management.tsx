import { html, raw } from 'hono/html';

export const AdminInvestorManagementPage = (admin: any, investors: any[] = []) => {
  // Calculate stats
  const stats = {
    total: investors.length,
    pending_nda: investors.filter(i => i.investor_status === 'pending_nda').length,
    nda_signed: investors.filter(i => i.investor_status === 'nda_signed').length,
    active: investors.filter(i => i.investor_status === 'active').length,
    rejected: investors.filter(i => i.investor_status === 'rejected').length
  };

  return html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investor Management - Risivo Admin</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
        /* Investor Management specific styles */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 50px;
            gap: 24px;
        }

        .page-header h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 8px;
            font-weight: 700;
        }

        .page-header .subtitle {
            color: #666;
            font-size: 16px;
            font-weight: 500;
        }

        .btn {
            padding: 14px 28px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            color: white !important;
            line-height: 1.5;
        }

        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            box-shadow: 0 2px 8px rgba(108, 117, 125, 0.25);
        }

        .btn-secondary:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
        }

        .stat-number {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .stat-label {
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-card.pending_nda .stat-number { color: #6c757d; }
        .stat-card.nda_signed .stat-number { color: #ffc107; }
        .stat-card.active .stat-number { color: #28a745; }
        .stat-card.rejected .stat-number { color: #dc3545; }

        .filter-tabs {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }

        .filter-tab {
            padding: 12px 24px;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 700;
            font-size: 15px;
            color: #333;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .filter-tab:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-color: #6b3fea;
        }

        .filter-tab.active {
            background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
            color: white !important;
            border-color: transparent;
            box-shadow: 0 4px 12px rgba(107, 63, 234, 0.4);
        }

        .filter-tab .badge {
            display: inline-block;
            background: rgba(0, 0, 0, 0.1);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 6px;
        }

        .investor-table {
            width: 100%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .investor-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .investor-table th {
            background: #f8f9fa;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e9ecef;
        }

        .investor-table td {
            padding: 16px;
            border-bottom: 1px solid #e9ecef;
            color: #666;
        }

        .investor-table tbody tr:hover {
            background: #f8f9fa;
        }

        .investor-table tbody tr:last-child td {
            border-bottom: none;
        }

        .investor-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }

        .investor-email {
            font-size: 13px;
            color: #999;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-badge.pending_nda {
            background: #e9ecef;
            color: #6c757d;
        }

        .status-badge.nda_signed {
            background: #fff3cd;
            color: #856404;
        }

        .status-badge.active {
            background: #d4edda;
            color: #155724;
        }

        .status-badge.rejected {
            background: #f8d7da;
            color: #721c24;
        }

        .tier-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 600;
            background: #f0f0f0;
            color: #666;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn-action {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white !important;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .btn-approve {
            background: linear-gradient(135deg, #28a745 0%, #218838 100%);
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.25);
        }

        .btn-reject {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.25);
        }

        .btn-view {
            background: linear-gradient(135deg, #6b3fea 0%, #5a2fc7 100%);
            box-shadow: 0 2px 8px rgba(107, 63, 234, 0.25);
        }

        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: #999;
        }

        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            padding: 24px;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            font-size: 24px;
            color: #333;
            margin: 0;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #999;
        }

        .modal-close:hover {
            color: #333;
        }

        .modal-body {
            padding: 24px;
        }

        .detail-row {
            margin-bottom: 16px;
        }

        .detail-label {
            font-weight: 600;
            color: #666;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .detail-value {
            color: #333;
            font-size: 15px;
        }

        .nda-info {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin: 20px 0;
        }

        .nda-info h4 {
            color: #333;
            margin-bottom: 8px;
        }

        .nda-detail {
            font-size: 13px;
            color: #666;
            margin: 4px 0;
        }

        .modal-footer {
            padding: 24px;
            border-top: 2px solid #e9ecef;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .modal-footer button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            color: white;
        }

        .modal-footer .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
        }

        .modal-footer .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }

        .modal-footer .btn-approve {
            background: linear-gradient(135deg, #28a745 0%, #218838 100%);
        }

        .modal-footer .btn-approve:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }

        .modal-footer .btn-reject {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .modal-footer .btn-reject:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        @media (max-width: 768px) {
            .investor-table {
                overflow-x: auto;
            }

            .filter-tabs {
                justify-content: center;
            }

            .action-buttons {
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
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        </div>
    </div>

    <div class="container">
        <!-- Navigation -->
        <div class="page-header">
            <div>
                <h1>👥 Investor Management</h1>
                <p class="subtitle">Review and manage investor applications</p>
            </div>
            <div>
                <a href="/updates/admin/dashboard" class="btn btn-secondary">← Back to Dashboard</a>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="stats-grid">
            <div class="stat-card total">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Investors</div>
            </div>
            <div class="stat-card pending_nda">
                <div class="stat-number">${stats.pending_nda}</div>
                <div class="stat-label">Pending NDA</div>
            </div>
            <div class="stat-card nda_signed">
                <div class="stat-number">${stats.nda_signed}</div>
                <div class="stat-label">Awaiting Approval</div>
            </div>
            <div class="stat-card active">
                <div class="stat-number">${stats.active}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-card rejected">
                <div class="stat-number">${stats.rejected}</div>
                <div class="stat-label">Rejected</div>
            </div>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <button class="filter-tab active" data-filter="all">
                All <span class="badge">${stats.total}</span>
            </button>
            <button class="filter-tab" data-filter="pending_nda">
                Pending NDA <span class="badge">${stats.pending_nda}</span>
            </button>
            <button class="filter-tab" data-filter="nda_signed">
                Awaiting Approval <span class="badge">${stats.nda_signed}</span>
            </button>
            <button class="filter-tab" data-filter="active">
                Active <span class="badge">${stats.active}</span>
            </button>
            <button class="filter-tab" data-filter="rejected">
                Rejected <span class="badge">${stats.rejected}</span>
            </button>
        </div>

        <!-- Investors Table -->
        <div class="investor-table" id="investorTable">
            <!-- Table will be populated by JavaScript -->
        </div>
    </div>

    <!-- Investor Details Modal -->
    <div class="modal" id="investorModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Investor Details</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Details will be populated by JavaScript -->
            </div>
            <div class="modal-footer" id="modalFooter">
                <!-- Actions will be populated by JavaScript -->
            </div>
        </div>
    </div>

    <script>
        let allInvestors = ${raw(JSON.stringify(investors))};
        let currentFilter = 'all';

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            setupFilterTabs();
            renderInvestors();
        });

        // Setup filter tabs
        function setupFilterTabs() {
            const tabs = document.querySelectorAll('.filter-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    currentFilter = tab.dataset.filter;
                    renderInvestors();
                });
            });
        }

        // Render investors table
        function renderInvestors() {
            const container = document.getElementById('investorTable');
            
            // Filter investors
            const filtered = currentFilter === 'all' 
                ? allInvestors 
                : allInvestors.filter(inv => inv.investor_status === currentFilter);

            if (filtered.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3 style="color: #666; margin-bottom: 8px;">No investors found</h3>
                        <p style="color: #999;">No investors match the selected filter</p>
                    </div>
                \`;
                return;
            }

            // Build table HTML
            let tableHTML = \`
                <table>
                    <thead>
                        <tr>
                            <th>Investor</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Tier</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            \`;

            filtered.forEach(investor => {
                const joinedDate = new Date(investor.created_at).toLocaleDateString();
                const tierDisplay = investor.investor_tier ? formatTier(investor.investor_tier) : '-';
                
                // Build action buttons separately to avoid HTML entity encoding
                let actionButtons = '<button class="btn-action btn-view" onclick="viewInvestor(\'' + investor.id + '\')">👁️ View</button>';
                if (investor.investor_status === 'nda_signed') {
                    actionButtons += '<button class="btn-action btn-approve" onclick="approveInvestor(\'' + investor.id + '\')">✅ Approve</button>';
                    actionButtons += '<button class="btn-action btn-reject" onclick="rejectInvestor(\'' + investor.id + '\')">❌ Reject</button>';
                }
                
                tableHTML += \`
                    <tr>
                        <td>
                            <div class="investor-name">\${investor.first_name} \${investor.last_name}</div>
                            <div class="investor-email">\${investor.email}</div>
                        </td>
                        <td>\${investor.business_name || '-'}</td>
                        <td>
                            <span class="status-badge \${investor.investor_status}">
                                \${formatStatus(investor.investor_status)}
                            </span>
                        </td>
                        <td>
                            <span class="tier-badge">\${tierDisplay}</span>
                        </td>
                        <td>\${joinedDate}</td>
                        <td>
                            <div class="action-buttons">
                                \${actionButtons}
                            </div>
                        </td>
                    </tr>
                \`;
            });

            tableHTML += \`
                    </tbody>
                </table>
            \`;

            container.innerHTML = tableHTML;
        }

        // Format status
        function formatStatus(status) {
            const statuses = {
                'pending_nda': 'Pending NDA',
                'nda_signed': 'Awaiting Approval',
                'active': 'Active',
                'rejected': 'Rejected'
            };
            return statuses[status] || status;
        }

        // Format tier
        function formatTier(tier) {
            return tier.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
        }

        // View investor details
        async function viewInvestor(investorId) {
            const investor = allInvestors.find(inv => inv.id === investorId);
            if (!investor) return;

            // Fetch NDA signature details if available
            let ndaDetails = null;
            if (investor.investor_status !== 'pending_nda') {
                try {
                    const response = await fetch(\`/api/admin/investor/\${investorId}/details\`);
                    const data = await response.json();
                    if (data.success) {
                        ndaDetails = data.nda_signature;
                    }
                } catch (error) {
                    console.error('Failed to fetch NDA details:', error);
                }
            }

            // Build modal content
            let modalContent = \`
                <div class="detail-row">
                    <div class="detail-label">Full Name</div>
                    <div class="detail-value">\${investor.first_name} \${investor.last_name}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">\${investor.email}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Company/Organization</div>
                    <div class="detail-value">\${investor.business_name || 'Not provided'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="status-badge \${investor.investor_status}">
                            \${formatStatus(investor.investor_status)}
                        </span>
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Investor Tier</div>
                    <div class="detail-value">\${investor.investor_tier ? formatTier(investor.investor_tier) : 'Not assigned'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Joined Date</div>
                    <div class="detail-value">\${new Date(investor.created_at).toLocaleString()}</div>
                </div>
            \`;

            if (ndaDetails) {
                modalContent += \`
                    <div class="nda-info">
                        <h4>📜 NDA Signature Details</h4>
                        <div class="nda-detail">
                            <strong>Signed Name:</strong> \${ndaDetails.full_name_typed}
                        </div>
                        <div class="nda-detail">
                            <strong>Signature Date:</strong> \${new Date(ndaDetails.signature_timestamp).toLocaleString()}
                        </div>
                        <div class="nda-detail">
                            <strong>IP Address:</strong> \${ndaDetails.ip_address}
                        </div>
                        <div class="nda-detail">
                            <strong>NDA Version:</strong> \${ndaDetails.nda_version}
                        </div>
                    </div>
                \`;
            }

            document.getElementById('modalBody').innerHTML = modalContent;

            // Build footer actions
            let footerHTML = '<button class="btn btn-secondary" onclick="closeModal()">Close</button>';
            
            if (investor.investor_status === 'nda_signed') {
                footerHTML += '<button class="btn btn-approve" onclick="approveInvestor' + "('" + investor.id + "', true)" + '">✅ Approve Investor</button>';
                footerHTML += '<button class="btn btn-reject" onclick="rejectInvestor' + "('" + investor.id + "', true)" + '">❌ Reject</button>';
            }

            document.getElementById('modalFooter').innerHTML = footerHTML;

            // Show modal
            document.getElementById('investorModal').classList.add('active');
        }

        // Close modal
        function closeModal() {
            document.getElementById('investorModal').classList.remove('active');
        }

        // Approve investor
        async function approveInvestor(investorId, fromModal = false) {
            if (!confirm('Approve this investor? They will receive full access to all investor materials and be notified via email.')) {
                return;
            }

            try {
                const response = await fetch(\`/api/admin/investor/\${investorId}/approve\`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Failed to approve investor');
                }

                alert('✅ Investor approved successfully! Notification email sent.');
                
                // Update local data
                const investor = allInvestors.find(inv => inv.id === investorId);
                if (investor) {
                    investor.investor_status = 'active';
                }

                if (fromModal) {
                    closeModal();
                }

                renderInvestors();

            } catch (error) {
                console.error('Approval error:', error);
                alert('❌ Failed to approve investor: ' + error.message);
            }
        }

        // Reject investor
        async function rejectInvestor(investorId, fromModal = false) {
            const reason = prompt('Reason for rejection (will be included in notification email):');
            if (!reason) return;

            try {
                const response = await fetch(\`/api/admin/investor/\${investorId}/reject\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Failed to reject investor');
                }

                alert('✅ Investor rejected. Notification email sent.');
                
                // Update local data
                const investor = allInvestors.find(inv => inv.id === investorId);
                if (investor) {
                    investor.investor_status = 'rejected';
                }

                if (fromModal) {
                    closeModal();
                }

                renderInvestors();

            } catch (error) {
                console.error('Rejection error:', error);
                alert('❌ Failed to reject investor: ' + error.message);
            }
        }

        // Logout
        async function logout() {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await fetch('/api/admin/logout', { method: 'POST' });
                    window.location.href = '/updates/admin/login';
                } catch (error) {
                    window.location.href = '/updates/admin/login';
                }
            }
        }

        // Close modal on background click
        document.getElementById('investorModal').addEventListener('click', (e) => {
            if (e.target.id === 'investorModal') {
                closeModal();
            }
        });
    </script>
</body>
</html>
`;
};
