# 🔒 NDA System Implementation Guide

**Purpose**: Complete guide for implementing the investor NDA (Non-Disclosure Agreement) system, including legal document display, electronic signature capture, access control, and audit trail.

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [NDA Review Page](#nda-review-page)
4. [Signature API](#signature-api)
5. [Access Control](#access-control)
6. [Legal Compliance](#legal-compliance)
7. [Admin Dashboard](#admin-dashboard)

---

## 1. OVERVIEW

### **Why NDA is Required**

Investors need access to confidential information:
- 📊 Financial projections and forecasts
- 📈 Business strategy and go-to-market plans
- 💰 Fundraising details and term sheets
- 🎯 Product roadmap and proprietary features
- 👥 Team information and compensation details
- 🔬 Proprietary technology and IP

**Without NDA protection**, this information could be shared with competitors or used against the company.

---

### **NDA Workflow**

```
┌──────────────────────────────────────────────────────────────┐
│         Investor Creates Account                             │
│         investor_status = 'pending_nda'                      │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│         Automatic Redirect to NDA Review Page                │
│         /updates/investor/nda-review                         │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│         Investor Reads Full NDA Text                         │
│         - Scrollable container with legal terms              │
│         - Cannot proceed until scrolled to bottom            │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│         Investor Signs Electronically                        │
│         - Types full name as signature                       │
│         - Checks "I agree" checkbox                          │
│         - IP address + timestamp recorded                    │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│         Signature Stored in Database                         │
│         - nda_signatures table                               │
│         - investor_status = 'nda_signed'                     │
│         - nda_signed_at timestamp set                        │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│         Investor Gains Access                                │
│         → /updates/investor (dashboard)                      │
│         → /updates/investor/documents (confidential files)   │
└──────────────────────────────────────────────────────────────┘
```

---

### **Access Control Matrix**

| User State | Can Access Dashboard | Can Access Documents | Redirect |
|-----------|---------------------|---------------------|----------|
| `pending_nda` | ❌ No | ❌ No | `/updates/investor/nda-review` |
| `nda_signed` | ✅ Yes | ✅ Yes | Normal access |
| `active` (admin approved) | ✅ Yes | ✅ Yes + Premium | Normal access |
| `rejected` | ❌ No | ❌ No | Error page |

---

## 2. DATABASE SCHEMA

### **2.1 NDA Signatures Table**

```sql
-- Store all NDA signatures for audit trail
CREATE TABLE IF NOT EXISTS nda_signatures (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Reference
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Signature Details
    full_name_typed VARCHAR(200) NOT NULL,
    signature_timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Legal & Technical Details
    nda_version VARCHAR(20) DEFAULT 'v1.0',
    nda_text_hash VARCHAR(64) NOT NULL, -- SHA-256 of the NDA text
    
    -- Audit Trail
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    country_code VARCHAR(2), -- Detected from IP
    city VARCHAR(100), -- Detected from IP
    
    -- Unique Constraint: One signature per user per version
    UNIQUE(user_id, nda_version)
);

-- Indexes
CREATE INDEX idx_nda_signatures_user_id ON nda_signatures(user_id);
CREATE INDEX idx_nda_signatures_timestamp ON nda_signatures(signature_timestamp DESC);
CREATE INDEX idx_nda_signatures_version ON nda_signatures(nda_version);

-- Comments
COMMENT ON TABLE nda_signatures IS 'Electronic signatures for investor NDAs';
COMMENT ON COLUMN nda_signatures.nda_text_hash IS 'SHA-256 hash to prove which version was signed';
COMMENT ON COLUMN nda_signatures.full_name_typed IS 'User typed their full name as electronic signature';
```

---

### **2.2 Users Table Update**

```sql
-- Add NDA-related fields to users table (if not already present)
ALTER TABLE users ADD COLUMN IF NOT EXISTS investor_status VARCHAR(20) 
  CHECK (investor_status IN ('pending_nda', 'nda_signed', 'active', 'rejected'));

ALTER TABLE users ADD COLUMN IF NOT EXISTS nda_signed_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nda_ip_address VARCHAR(45);

-- Create index
CREATE INDEX IF NOT EXISTS idx_users_investor_status ON users(investor_status);

-- Add constraint: Only investors can have investor_status
ALTER TABLE users ADD CONSTRAINT check_investor_status 
  CHECK (
    (user_type = 'investor' AND investor_status IS NOT NULL) OR
    (user_type != 'investor' AND investor_status IS NULL)
  );
```

---

### **2.3 NDA Documents Table** (Optional - for versioning)

```sql
-- Store different versions of the NDA document
CREATE TABLE IF NOT EXISTS nda_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Version Info
    version VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    
    -- Document Content
    content TEXT NOT NULL,
    content_hash VARCHAR(64) NOT NULL, -- SHA-256 of content
    
    -- Metadata
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Only one active NDA at a time
CREATE UNIQUE INDEX idx_nda_documents_active ON nda_documents(is_active) WHERE is_active = TRUE;

-- Insert current NDA version
INSERT INTO nda_documents (version, title, content, content_hash, effective_date, is_active) 
VALUES (
    'v1.0',
    'Risivo Investor Non-Disclosure Agreement',
    '[Full NDA text here]',
    '[SHA-256 hash]',
    '2025-01-01',
    TRUE
);
```

---

## 3. NDA REVIEW PAGE

### **3.1 Route: `/updates/investor/nda-review`**

**Access Control**: 
- ✅ Must be logged in
- ✅ Must be investor (`user_type = 'investor'`)
- ✅ Must have `investor_status = 'pending_nda'`
- ❌ Redirects if already signed NDA

---

### **3.2 UI Implementation**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Non-Disclosure Agreement - Risivo Investor Portal</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            padding: 20px;
        }
        
        .nda-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .nda-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .nda-header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        
        .nda-header p {
            margin: 0;
            opacity: 0.95;
            font-size: 16px;
        }
        
        .nda-notice {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px 30px;
            color: #856404;
        }
        
        .nda-notice strong {
            display: block;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .nda-content {
            padding: 40px 30px;
        }
        
        .nda-document {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 30px;
            max-height: 500px;
            overflow-y: scroll;
            background: #fafafa;
            font-size: 14px;
            line-height: 1.8;
            color: #333;
            margin-bottom: 30px;
        }
        
        .nda-document::-webkit-scrollbar {
            width: 10px;
        }
        
        .nda-document::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .nda-document::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        
        .nda-document::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        .nda-document h2 {
            color: #667eea;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .nda-document h2:first-child {
            margin-top: 0;
        }
        
        .nda-document p {
            margin: 0 0 15px 0;
        }
        
        .nda-document ol, .nda-document ul {
            margin: 0 0 15px 20px;
            padding: 0;
        }
        
        .scroll-indicator {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
            padding: 10px;
            background: #e3f2fd;
            border-radius: 6px;
        }
        
        .scroll-indicator.complete {
            background: #e8f5e9;
            color: #2e7d32;
        }
        
        .signature-section {
            opacity: 0.5;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        
        .signature-section.enabled {
            opacity: 1;
            pointer-events: auto;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 10px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }
        
        .form-group input[type="text"] {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 16px;
            font-family: 'Brush Script MT', cursive, serif;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        
        .form-group input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .checkbox-group {
            margin: 25px 0;
        }
        
        .checkbox-group label {
            display: flex;
            align-items: flex-start;
            font-size: 15px;
            color: #333;
        }
        
        .checkbox-group input[type="checkbox"] {
            margin-right: 12px;
            margin-top: 4px;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        .metadata-display {
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 13px;
            color: #666;
        }
        
        .metadata-display p {
            margin: 5px 0;
        }
        
        .metadata-display strong {
            color: #333;
        }
        
        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        
        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .error-message {
            background: #ffebee;
            color: #c62828;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
        
        .success-animation {
            display: none;
            text-align: center;
            padding: 40px;
        }
        
        .success-animation.show {
            display: block;
        }
        
        .success-animation .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: block;
            stroke-width: 4;
            stroke: #4caf50;
            stroke-miterlimit: 10;
            margin: 0 auto 20px;
            box-shadow: inset 0px 0px 0px #4caf50;
            animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
        }
        
        .success-animation .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: #4caf50;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .success-animation .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        @keyframes stroke {
            100% {
                stroke-dashoffset: 0;
            }
        }
        
        @keyframes fill {
            100% {
                box-shadow: inset 0px 0px 0px 30px #4caf50;
            }
        }
    </style>
</head>
<body>
    <div class="nda-container">
        <div class="nda-header">
            <h1>🔒 Non-Disclosure Agreement</h1>
            <p>Please review and sign to access investor materials</p>
        </div>
        
        <div class="nda-notice">
            <strong>⚠️ Important Legal Document</strong>
            Please read this Non-Disclosure Agreement carefully. By signing below, you agree to keep all confidential information you receive through the Risivo Investor Portal strictly confidential.
        </div>
        
        <div class="nda-content">
            <div id="scrollIndicator" class="scroll-indicator">
                📜 Please scroll to the bottom of the document to continue
            </div>
            
            <div id="ndaDocument" class="nda-document">
                <!-- NDA Text will be loaded here -->
                <h1 style="text-align: center; color: #667eea; margin-bottom: 30px;">NON-DISCLOSURE AGREEMENT</h1>
                
                <p><strong>Effective Date:</strong> January 1, 2025</p>
                <p><strong>NDA Version:</strong> v1.0</p>
                
                <p>This Non-Disclosure Agreement (the "Agreement") is entered into as of the date of signature below (the "Effective Date") by and between:</p>
                
                <p><strong>DISCLOSING PARTY:</strong><br>
                Velocity Automation Corp. (doing business as "Risivo")<br>
                [Address]<br>
                [City, State, ZIP]</p>
                
                <p><strong>RECEIVING PARTY:</strong><br>
                The individual or entity accessing the Risivo Investor Portal</p>
                
                <h2>1. PURPOSE</h2>
                <p>The Disclosing Party intends to share certain confidential and proprietary information with the Receiving Party for the purpose of evaluating a potential investment opportunity in Risivo.</p>
                
                <h2>2. DEFINITION OF CONFIDENTIAL INFORMATION</h2>
                <p>"Confidential Information" means all information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or through electronic means, including but not limited to:</p>
                <ul>
                    <li>Business plans, strategies, and financial projections</li>
                    <li>Product roadmaps, features, and technical specifications</li>
                    <li>Customer lists, contracts, and sales data</li>
                    <li>Marketing strategies and market research</li>
                    <li>Source code, algorithms, and proprietary technology</li>
                    <li>Trade secrets, know-how, and inventions</li>
                    <li>Employee information and organizational structure</li>
                    <li>Any other information marked as "Confidential" or that would reasonably be considered confidential</li>
                </ul>
                
                <h2>3. OBLIGATIONS OF RECEIVING PARTY</h2>
                <p>The Receiving Party agrees to:</p>
                <ol>
                    <li><strong>Maintain Confidentiality:</strong> Hold all Confidential Information in strict confidence and not disclose it to any third party without the prior written consent of the Disclosing Party.</li>
                    <li><strong>Limited Use:</strong> Use Confidential Information solely for evaluating the potential investment opportunity and not for any other purpose.</li>
                    <li><strong>Protection:</strong> Take all reasonable measures to protect the confidentiality of the Confidential Information, using at least the same degree of care as the Receiving Party uses to protect its own confidential information.</li>
                    <li><strong>Limited Access:</strong> Disclose Confidential Information only to employees, advisors, or agents who have a legitimate need to know and who are bound by confidentiality obligations at least as restrictive as those in this Agreement.</li>
                    <li><strong>No Copying:</strong> Not copy, reproduce, or distribute Confidential Information without prior written authorization.</li>
                    <li><strong>Return or Destruction:</strong> Upon request by the Disclosing Party, promptly return or destroy all Confidential Information and any copies thereof.</li>
                </ol>
                
                <h2>4. EXCEPTIONS</h2>
                <p>Confidential Information does not include information that:</p>
                <ul>
                    <li>Was publicly known at the time of disclosure or becomes publicly known through no breach of this Agreement</li>
                    <li>Was rightfully known by the Receiving Party prior to disclosure</li>
                    <li>Is rightfully obtained by the Receiving Party from a third party without breach of any confidentiality obligation</li>
                    <li>Is independently developed by the Receiving Party without use of or reference to the Confidential Information</li>
                    <li>Is required to be disclosed by law or court order, provided the Receiving Party gives prompt notice to the Disclosing Party</li>
                </ul>
                
                <h2>5. NO LICENSE OR RIGHTS GRANTED</h2>
                <p>Nothing in this Agreement grants the Receiving Party any license or rights in or to the Confidential Information or any intellectual property rights of the Disclosing Party.</p>
                
                <h2>6. NO WARRANTY</h2>
                <p>All Confidential Information is provided "AS IS" without any warranty, express or implied. The Disclosing Party makes no representation as to the accuracy or completeness of the Confidential Information.</p>
                
                <h2>7. TERM AND TERMINATION</h2>
                <p>This Agreement shall commence on the Effective Date and continue for a period of five (5) years, unless earlier terminated by either party upon written notice. The obligations of confidentiality shall survive termination of this Agreement for a period of five (5) years from the date of disclosure.</p>
                
                <h2>8. REMEDIES</h2>
                <p>The Receiving Party acknowledges that:</p>
                <ul>
                    <li>Breach of this Agreement may cause irreparable harm to the Disclosing Party</li>
                    <li>The Disclosing Party shall be entitled to seek injunctive relief without the necessity of proving actual damages</li>
                    <li>The Disclosing Party may pursue all available legal remedies, including monetary damages</li>
                </ul>
                
                <h2>9. NO COMMITMENT TO INVEST</h2>
                <p>This Agreement does not obligate the Receiving Party to invest in the Disclosing Party or enter into any business relationship. Any investment will be subject to separate definitive agreements.</p>
                
                <h2>10. GOVERNING LAW</h2>
                <p>This Agreement shall be governed by and construed in accordance with the laws of [State/Country], without regard to its conflict of laws principles.</p>
                
                <h2>11. ENTIRE AGREEMENT</h2>
                <p>This Agreement constitutes the entire agreement between the parties regarding the subject matter and supersedes all prior agreements, understandings, and communications.</p>
                
                <h2>12. AMENDMENTS</h2>
                <p>This Agreement may only be amended or modified by a written document signed by both parties.</p>
                
                <h2>13. SEVERABILITY</h2>
                <p>If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
                
                <h2>14. ELECTRONIC SIGNATURE</h2>
                <p>The parties agree that electronic signatures shall have the same legal effect as original signatures. By typing your full name below, you acknowledge that you intend to sign this Agreement electronically.</p>
                
                <p style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #666;">
                    <strong>END OF DOCUMENT</strong><br>
                    You have reached the end of the Non-Disclosure Agreement
                </p>
            </div>
            
            <div id="errorMessage" class="error-message"></div>
            
            <div id="signatureSection" class="signature-section">
                <form id="ndaForm">
                    <div class="form-group">
                        <label for="fullName">Electronic Signature (Type Your Full Name)</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            required
                            placeholder="John Doe"
                            autocomplete="name"
                        />
                        <p style="font-size: 13px; color: #666; margin-top: 8px;">
                            By typing your full name, you agree that this constitutes a legal electronic signature.
                        </p>
                    </div>
                    
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="agreeCheckbox" required />
                            <span>I have read, understand, and agree to be bound by the terms of this Non-Disclosure Agreement. I acknowledge that my electronic signature has the same legal effect as a handwritten signature.</span>
                        </label>
                    </div>
                    
                    <div class="metadata-display">
                        <p><strong>Signature Details:</strong></p>
                        <p>IP Address: <span id="ipAddress">Loading...</span></p>
                        <p>Timestamp: <span id="timestamp">Loading...</span></p>
                        <p>NDA Version: <strong>v1.0</strong></p>
                        <p>Document Hash: <span id="docHash" style="font-family: monospace; font-size: 11px;">Loading...</span></p>
                    </div>
                    
                    <button type="submit" class="submit-btn" id="submitBtn" disabled>
                        🔒 Sign NDA & Access Investor Portal
                    </button>
                </form>
            </div>
            
            <div id="successAnimation" class="success-animation">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <h2 style="color: #4caf50; margin: 0 0 10px 0;">NDA Signed Successfully!</h2>
                <p style="color: #666; margin: 0 0 20px 0;">Redirecting to investor portal...</p>
            </div>
        </div>
    </div>
    
    <script>
        // Load user metadata
        async function loadMetadata() {
            try {
                // Get IP address (Cloudflare provides this)
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                document.getElementById('ipAddress').textContent = ipData.ip;
            } catch (error) {
                document.getElementById('ipAddress').textContent = 'Unable to detect';
            }
            
            // Set timestamp
            const now = new Date();
            document.getElementById('timestamp').textContent = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
            
            // Calculate document hash
            const ndaText = document.getElementById('ndaDocument').innerText;
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ndaText));
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            document.getElementById('docHash').textContent = hashHex.substring(0, 16) + '...';
            
            return hashHex;
        }
        
        let documentHash = '';
        loadMetadata().then(hash => {
            documentHash = hash;
        });
        
        // Scroll detection
        const ndaDocument = document.getElementById('ndaDocument');
        const scrollIndicator = document.getElementById('scrollIndicator');
        const signatureSection = document.getElementById('signatureSection');
        const submitBtn = document.getElementById('submitBtn');
        const agreeCheckbox = document.getElementById('agreeCheckbox');
        
        let hasScrolledToBottom = false;
        
        ndaDocument.addEventListener('scroll', function() {
            const scrollPosition = this.scrollTop + this.clientHeight;
            const scrollHeight = this.scrollHeight;
            
            // Check if scrolled to within 50px of bottom
            if (scrollHeight - scrollPosition < 50 && !hasScrolledToBottom) {
                hasScrolledToBottom = true;
                scrollIndicator.textContent = '✅ You have reached the end of the document';
                scrollIndicator.classList.add('complete');
                signatureSection.classList.add('enabled');
            }
        });
        
        // Enable submit button only when checkbox is checked
        agreeCheckbox.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
        
        // Form submission
        const form = document.getElementById('ndaForm');
        const errorMessage = document.getElementById('errorMessage');
        const successAnimation = document.getElementById('successAnimation');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!hasScrolledToBottom) {
                errorMessage.textContent = 'Please scroll to the bottom of the document before signing.';
                errorMessage.classList.add('show');
                return;
            }
            
            const fullName = document.getElementById('fullName').value.trim();
            
            if (!fullName) {
                errorMessage.textContent = 'Please type your full name to sign the agreement.';
                errorMessage.classList.add('show');
                return;
            }
            
            // Disable form
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing signature...';
            errorMessage.classList.remove('show');
            
            try {
                const response = await fetch('/api/investor/sign-nda', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        full_name_typed: fullName,
                        nda_version: 'v1.0',
                        nda_text_hash: documentHash
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Show success animation
                    form.style.display = 'none';
                    successAnimation.classList.add('show');
                    
                    // Redirect after 3 seconds
                    setTimeout(() => {
                        window.location.href = '/updates/investor';
                    }, 3000);
                } else {
                    errorMessage.textContent = data.error || 'Failed to record signature. Please try again.';
                    errorMessage.classList.add('show');
                    submitBtn.disabled = false;
                    submitBtn.textContent = '🔒 Sign NDA & Access Investor Portal';
                }
            } catch (error) {
                errorMessage.textContent = 'Network error. Please check your connection and try again.';
                errorMessage.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = '🔒 Sign NDA & Access Investor Portal';
            }
        });
    </script>
</body>
</html>
```

---

## 4. SIGNATURE API

### **4.1 POST /api/investor/sign-nda**

**Purpose**: Record electronic signature of NDA

**Authentication**: Required (session cookie)

**Request Body**:
```typescript
{
  full_name_typed: string;    // Required
  nda_version: string;        // e.g., 'v1.0'
  nda_text_hash: string;      // SHA-256 hash (64 chars)
}
```

**Response (200 OK)**:
```typescript
{
  success: true,
  message: 'NDA signed successfully',
  investor_status: 'nda_signed',
  signed_at: '2025-12-20T14:30:00.000Z'
}
```

**Error Responses**:
- `401 Unauthorized` - Not logged in or not an investor
- `409 Conflict` - NDA already signed
- `500 Internal Server Error` - Database error

**Implementation**:
```typescript
// src/api/investor/sign-nda.ts
import { Hono } from 'hono';
import { getCurrentUser } from '../../middleware/auth';

const app = new Hono();

app.post('/api/investor/sign-nda', async (c) => {
  try {
    // Get current user
    const user = await getCurrentUser(c);
    
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }
    
    if (user.user_type !== 'investor') {
      return c.json({ error: 'Only investors can sign NDAs' }, 403);
    }
    
    if (user.investor_status !== 'pending_nda') {
      return c.json({ error: 'NDA already signed' }, 409);
    }
    
    const body = await c.req.json();
    
    // Validation
    if (!body.full_name_typed || !body.nda_version || !body.nda_text_hash) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    if (body.nda_text_hash.length !== 64) {
      return c.json({ error: 'Invalid document hash' }, 400);
    }
    
    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const ipAddress = c.req.header('CF-Connecting-IP') || 'unknown';
    const userAgent = c.req.header('User-Agent') || 'unknown';
    const countryCode = c.req.header('CF-IPCountry') || null;
    
    // Record signature
    const signatureResponse = await fetch(`${supabaseUrl}/rest/v1/nda_signatures`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: user.id,
        full_name_typed: body.full_name_typed,
        nda_version: body.nda_version,
        nda_text_hash: body.nda_text_hash,
        ip_address: ipAddress,
        user_agent: userAgent,
        country_code: countryCode,
        signature_timestamp: new Date().toISOString()
      })
    });
    
    if (!signatureResponse.ok) {
      const error = await signatureResponse.json();
      if (error.code === '23505') { // Unique constraint violation
        return c.json({ error: 'You have already signed this NDA version' }, 409);
      }
      throw new Error('Failed to record signature');
    }
    
    const signature = await signatureResponse.json();
    
    // Update user's investor_status
    const userUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        investor_status: 'nda_signed',
        nda_signed_at: signature[0].signature_timestamp,
        nda_ip_address: ipAddress
      })
    });
    
    if (!userUpdateResponse.ok) {
      throw new Error('Failed to update user status');
    }
    
    return c.json({
      success: true,
      message: 'NDA signed successfully',
      investor_status: 'nda_signed',
      signed_at: signature[0].signature_timestamp
    }, 200);
    
  } catch (error) {
    console.error('NDA signature error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
```

---

### **4.2 GET /api/investor/nda-status**

**Purpose**: Check if investor has signed NDA

**Response**:
```typescript
{
  has_signed: boolean,
  investor_status: string,
  signed_at?: string,
  nda_version?: string
}
```

---

## 5. ACCESS CONTROL

### **5.1 Middleware: requireNDASigned**

```typescript
// src/middleware/auth.ts
export async function requireNDASigned(c: Context, next: Next) {
  const user = c.get('user');
  
  if (!user || user.user_type !== 'investor') {
    return c.redirect('/updates');
  }
  
  if (user.investor_status === 'pending_nda') {
    return c.redirect('/updates/investor/nda-review');
  }
  
  if (user.investor_status === 'rejected') {
    return c.html(`
      <h1>Access Denied</h1>
      <p>Your investor access has been revoked. Please contact us for more information.</p>
    `, 403);
  }
  
  await next();
}
```

---

### **5.2 Protected Routes**

```typescript
// Apply middleware to investor routes
app.get('/updates/investor', requireAuth, requireInvestor, requireNDASigned, ...);
app.get('/updates/investor/documents', requireAuth, requireInvestor, requireNDASigned, ...);
app.get('/updates/investor/profile', requireAuth, requireInvestor, requireNDASigned, ...);

// NDA review page only for pending_nda status
app.get('/updates/investor/nda-review', requireAuth, requireInvestor, async (c) => {
  const user = c.get('user');
  
  if (user.investor_status !== 'pending_nda') {
    // Already signed, redirect to dashboard
    return c.redirect('/updates/investor');
  }
  
  // Show NDA page
  return c.html(ndaReviewPageHTML);
});
```

---

## 6. LEGAL COMPLIANCE

### **6.1 Requirements for Valid Electronic Signatures**

According to ESIGN Act (US) and eIDAS (EU):

1. ✅ **Intent to Sign**: User explicitly agrees to sign (checkbox + typed name)
2. ✅ **Consent to Electronic Records**: User acknowledges electronic signature is legally binding
3. ✅ **Association with Record**: Signature is clearly linked to the NDA document
4. ✅ **Record Retention**: Signature and document are stored and can be retrieved
5. ✅ **Audit Trail**: IP address, timestamp, and user agent are recorded

---

### **6.2 What We Store (Audit Trail)**

```sql
-- Example nda_signatures record
{
  id: 'uuid',
  user_id: 'uuid',
  full_name_typed: 'John Doe',
  signature_timestamp: '2025-12-20T14:30:45.123Z',
  nda_version: 'v1.0',
  nda_text_hash: 'a3f9c8e7...',  -- SHA-256 of exact NDA text
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0...',
  country_code: 'US'
}
```

This provides:
- **Proof of who signed** (user_id + full_name_typed)
- **Proof of when** (signature_timestamp)
- **Proof of where** (ip_address + country_code)
- **Proof of what was signed** (nda_text_hash)
- **Proof of how** (user_agent)

---

### **6.3 Document Hash (Integrity Verification)**

**Why hash the NDA text?**
- Proves which exact version was signed
- Prevents disputes about content
- Legally defensible audit trail

**How it works**:
```javascript
// Frontend calculates hash
const ndaText = document.getElementById('ndaDocument').innerText;
const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ndaText));
const hashHex = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

// Stored in database: nda_text_hash
// Later, we can verify: hash(stored_nda_text) === nda_text_hash
```

---

## 7. ADMIN DASHBOARD

### **7.1 View All NDA Signatures**

**Route**: `/updates/admin/nda-signatures`

**Features**:
- List all signed NDAs
- Filter by date, investor, version
- Export to CSV for legal records
- View signature details (IP, timestamp, etc.)

**UI**:
```html
<table>
  <thead>
    <tr>
      <th>Investor</th>
      <th>Signed Name</th>
      <th>Date Signed</th>
      <th>IP Address</th>
      <th>NDA Version</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>jane.smith@fund.com</td>
      <td>Jane Smith</td>
      <td>Dec 20, 2025 2:30 PM</td>
      <td>192.168.1.1 (US)</td>
      <td>v1.0</td>
      <td><span class="badge success">Signed</span></td>
      <td><button>View Details</button></td>
    </tr>
  </tbody>
</table>
```

---

### **7.2 API: GET /api/admin/nda-signatures**

**Response**:
```typescript
{
  signatures: [
    {
      id: string,
      user: {
        id: string,
        email: string,
        first_name: string,
        last_name: string
      },
      full_name_typed: string,
      signature_timestamp: string,
      nda_version: string,
      ip_address: string,
      country_code: string
    }
  ],
  total: number
}
```

---

## 8. TESTING

### **8.1 Manual Testing Checklist**

**NDA Review Page**:
- [ ] Page loads correctly for pending_nda investors
- [ ] NDA text is readable and scrollable
- [ ] Scroll indicator updates when reaching bottom
- [ ] Signature section is disabled until scrolled
- [ ] IP address and timestamp load correctly
- [ ] Document hash is calculated
- [ ] Typed name field works
- [ ] Checkbox enables submit button
- [ ] Submit shows loading state

**NDA Submission**:
- [ ] Signature is recorded in database
- [ ] User's investor_status changes to 'nda_signed'
- [ ] Success animation shows
- [ ] Redirects to /updates/investor after 3 seconds

**Access Control**:
- [ ] Investors with pending_nda are redirected to NDA page
- [ ] Investors with nda_signed can access investor portal
- [ ] Waitlist users cannot access investor routes
- [ ] Logged out users are redirected to login

---

## 9. NEXT STEPS

After implementing NDA system:
1. ✅ Build investor dashboard (`/updates/investor`)
2. ✅ Build document management system (`/updates/investor/documents`)
3. ✅ Upload investor materials (pitch deck, financials, etc.)
4. ✅ Build admin approval system (optional)
5. ✅ Deploy to production

---

**Document Version**: 1.0  
**Last Updated**: December 20, 2025  
**Status**: Ready for Implementation
**Legal Review**: Recommended before deployment
