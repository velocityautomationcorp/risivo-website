import { html } from 'hono/html';

export const InvestorNDAReviewPage = (user: any = { first_name: '', last_name: '', business_name: '' }) => {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NDA Review - Risivo Investor Portal</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            text-align: center;
            color: white;
        }

        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
        }

        .investor-badge {
            display: inline-block;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 15px;
        }

        .content {
            padding: 40px;
        }

        .welcome-message {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        .welcome-message h2 {
            color: #1a202c;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .welcome-message p {
            color: #4a5568;
            line-height: 1.6;
        }

        .nda-section {
            margin-bottom: 30px;
        }

        .nda-section h3 {
            color: #2d3748;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nda-text {
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            max-height: 400px;
            overflow-y: auto;
            font-size: 14px;
            line-height: 1.8;
            color: #2d3748;
            margin-bottom: 20px;
        }

        .nda-text h4 {
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0 10px 0;
            color: #1a202c;
        }

        .nda-text h4:first-child {
            margin-top: 0;
        }

        .nda-text p {
            margin-bottom: 15px;
        }

        .nda-text ul {
            margin-left: 20px;
            margin-bottom: 15px;
        }

        .nda-text li {
            margin-bottom: 8px;
        }

        .signature-section {
            background: #fff;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            margin-top: 30px;
        }

        .signature-section h3 {
            color: #2d3748;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            color: #2d3748;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 15px;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .signature-info {
            background: #ebf4ff;
            border-left: 4px solid #4299e1;
            padding: 15px;
            border-radius: 4px;
            font-size: 13px;
            color: #2c5282;
            margin-bottom: 20px;
        }

        .checkbox-group {
            margin: 25px 0;
        }

        .checkbox-wrapper {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .checkbox-wrapper input[type="checkbox"] {
            width: 20px;
            height: 20px;
            margin-top: 2px;
            cursor: pointer;
        }

        .checkbox-label {
            flex: 1;
            color: #2d3748;
            font-size: 14px;
            line-height: 1.6;
            cursor: pointer;
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
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
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .error-message {
            background: #fed7d7;
            color: #c53030;
            padding: 14px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
            border-left: 4px solid #c53030;
        }

        .success-message {
            background: #c6f6d5;
            color: #22543d;
            padding: 14px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
            border-left: 4px solid #22543d;
        }

        .signature-box {
            background: #fffef0;
            border: 2px dashed #d4a574;
            border-radius: 8px;
            padding: 30px 20px;
            text-align: center;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .signature-placeholder {
            color: #a0aec0;
            font-style: italic;
            font-size: 14px;
        }

        .signature-text {
            font-family: 'Brush Script MT', 'Segoe Script', 'Bradley Hand', cursive;
            font-size: 32px;
            color: #1a365d;
            letter-spacing: 1px;
        }

        .signature-hint {
            font-size: 12px;
            color: #718096;
            margin-top: 8px;
            text-align: center;
        }

        @media (max-width: 768px) {
            .content {
                padding: 30px 20px;
            }

            .header {
                padding: 30px 20px;
            }

            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📜 Non-Disclosure Agreement</h1>
            <p>Please review and sign to access investor materials</p>
            <div class="investor-badge">🔐 Investor Access</div>
        </div>

        <div class="content">
            <div class="welcome-message">
                <h2>👋 Welcome${user.first_name ? ', ' + user.first_name : ''}!</h2>
                <p>
                    Thank you for your interest in Risivo. To access confidential investor materials, 
                    we require all investors to review and electronically sign our Non-Disclosure Agreement (NDA). 
                    This ensures the protection of proprietary information and maintains confidentiality.
                </p>
            </div>

            <div class="nda-section">
                <h3>📄 Non-Disclosure Agreement</h3>
                <div class="nda-text">
                    <h4>MUTUAL NON-DISCLOSURE AGREEMENT</h4>
                    <p>
                        This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of the date of electronic signature 
                        (the "Effective Date") by and between <strong>Velocity Automation Corp., doing business as Risivo</strong> 
                        ("Disclosing Party") and <strong id="ndaReceiverName">${user.first_name && user.last_name ? user.first_name + ' ' + user.last_name : '[Your Name]'}</strong> of <strong>${user.business_name || 'Individual Investor'}</strong> ("Receiving Party").
                    </p>

                    <h4>1. Purpose</h4>
                    <p>
                        The parties wish to explore a potential investment opportunity and related business relationship. 
                        In connection with this purpose, each party may disclose certain confidential and proprietary information 
                        to the other party.
                    </p>

                    <h4>2. Definition of Confidential Information</h4>
                    <p>
                        "Confidential Information" means any and all information disclosed by the Disclosing Party to the Receiving Party, 
                        including but not limited to:
                    </p>
                    <ul>
                        <li>Business plans, strategies, financial information, and projections</li>
                        <li>Product roadmaps, technical specifications, and development plans</li>
                        <li>Customer lists, investor information, and business relationships</li>
                        <li>Marketing plans, pricing information, and sales data</li>
                        <li>Trade secrets, proprietary processes, and intellectual property</li>
                        <li>Any information marked as "Confidential" or that would reasonably be considered confidential</li>
                    </ul>

                    <h4>3. Obligations of Receiving Party</h4>
                    <p>The Receiving Party agrees to:</p>
                    <ul>
                        <li>Hold all Confidential Information in strict confidence</li>
                        <li>Not disclose Confidential Information to any third party without prior written consent</li>
                        <li>Use Confidential Information solely for the Purpose stated above</li>
                        <li>Protect Confidential Information with the same degree of care used for its own confidential information</li>
                        <li>Limit access to Confidential Information to employees or advisors who have a legitimate need to know</li>
                    </ul>

                    <h4>4. Exclusions from Confidential Information</h4>
                    <p>Confidential Information does not include information that:</p>
                    <ul>
                        <li>Is or becomes publicly available through no breach of this Agreement</li>
                        <li>Was rightfully in the Receiving Party's possession prior to disclosure</li>
                        <li>Is independently developed by the Receiving Party without use of Confidential Information</li>
                        <li>Is rightfully received from a third party without breach of confidentiality obligations</li>
                    </ul>

                    <h4>5. Term and Termination</h4>
                    <p>
                        This Agreement shall remain in effect for a period of three (3) years from the Effective Date. 
                        The obligations regarding Confidential Information shall survive termination of this Agreement.
                    </p>

                    <h4>6. Return of Materials</h4>
                    <p>
                        Upon request or termination of this Agreement, the Receiving Party shall promptly return or destroy 
                        all Confidential Information and any copies thereof.
                    </p>

                    <h4>7. No License or Rights Granted</h4>
                    <p>
                        Nothing in this Agreement grants the Receiving Party any license, right, title, or interest in any 
                        intellectual property, technology, or Confidential Information of the Disclosing Party.
                    </p>

                    <h4>8. Legal Compliance</h4>
                    <p>
                        If the Receiving Party is required by law to disclose Confidential Information, it shall provide 
                        prompt notice to the Disclosing Party and cooperate in any effort to seek protective measures.
                    </p>

                    <h4>9. Remedies</h4>
                    <p>
                        The Receiving Party acknowledges that breach of this Agreement may cause irreparable harm to the 
                        Disclosing Party, and that monetary damages may be inadequate. The Disclosing Party shall be entitled 
                        to seek equitable relief, including injunction and specific performance.
                    </p>

                    <h4>10. Governing Law</h4>
                    <p>
                        This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction 
                        where Velocity Automation Corp. is registered, without regard to conflicts of law principles.
                    </p>

                    <h4>11. Entire Agreement</h4>
                    <p>
                        This Agreement constitutes the entire agreement between the parties regarding confidentiality and 
                        supersedes all prior agreements and understandings, whether written or oral.
                    </p>
                </div>
            </div>

            <div id="errorMessage" class="error-message"></div>
            <div id="successMessage" class="success-message"></div>

            <form id="ndaForm">
                <div class="signature-section">
                    <h3>✍️ Electronic Signature</h3>
                    
                    <div class="signature-info">
                        🔒 <strong>Secure Electronic Signature:</strong> By typing your full legal name below and checking the agreement box, 
                        you are creating a legally binding electronic signature. Your IP address and timestamp will be recorded.
                    </div>

                    <div class="form-group">
                        <label for="fullName">Full Legal Name *</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            placeholder="Type your full legal name"
                            required
                        >
                    </div>

                    <!-- Signature Preview Box -->
                    <div class="form-group">
                        <label>Signature Preview</label>
                        <div class="signature-box" id="signatureBox">
                            <span class="signature-placeholder" id="signaturePlaceholder">Your signature will appear here</span>
                            <span class="signature-text" id="signatureText" style="display: none;"></span>
                        </div>
                        <p class="signature-hint">This signature image will be generated from your typed name and stored as proof of signing.</p>
                    </div>

                    <div class="checkbox-group">
                        <div class="checkbox-wrapper">
                            <input 
                                type="checkbox" 
                                id="agreement" 
                                name="agreement" 
                                required
                            >
                            <label for="agreement" class="checkbox-label">
                                I have read and understood the Non-Disclosure Agreement above. 
                                I agree to be bound by its terms and acknowledge that my electronic signature 
                                has the same legal effect as a handwritten signature.
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="submit-btn" id="submitBtn">
                        ✅ Sign NDA & Continue
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const form = document.getElementById('ndaForm');
        const submitBtn = document.getElementById('submitBtn');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const fullNameInput = document.getElementById('fullName');
        const agreementCheckbox = document.getElementById('agreement');
        const signaturePlaceholder = document.getElementById('signaturePlaceholder');
        const signatureText = document.getElementById('signatureText');

        // Pre-fill full name only if we have actual user data
        const firstName = '${user.first_name || ''}'.trim();
        const lastName = '${user.last_name || ''}'.trim();
        const fullName = (firstName + ' ' + lastName).trim();
        if (fullName) {
            fullNameInput.value = fullName;
            updateSignature(fullName);
        }

        // Update signature preview when name is typed
        fullNameInput.addEventListener('input', function() {
            updateSignature(this.value.trim());
        });

        function updateSignature(name) {
            if (name) {
                signaturePlaceholder.style.display = 'none';
                signatureText.style.display = 'block';
                signatureText.textContent = name;
            } else {
                signaturePlaceholder.style.display = 'block';
                signatureText.style.display = 'none';
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Hide messages
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            const fullName = fullNameInput.value.trim();
            const agreed = agreementCheckbox.checked;

            // Validation
            if (!fullName) {
                errorMessage.textContent = 'Please enter your full legal name.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!agreed) {
                errorMessage.textContent = 'You must agree to the terms of the NDA to continue.';
                errorMessage.style.display = 'block';
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Processing...';

            try {
                const response = await fetch('/api/auth/investor/sign-nda', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        full_name: fullName,
                        signature_date: new Date().toISOString(),
                        nda_version: 'v3.0'
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Show success message
                    successMessage.textContent = '✅ NDA signed successfully! Redirecting to your dashboard...';
                    successMessage.style.display = 'block';

                    // Redirect after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/updates/dashboard';
                    }, 2000);
                } else {
                    // Show error message
                    errorMessage.textContent = data.error || 'Failed to sign NDA. Please try again.';
                    errorMessage.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = '✅ Sign NDA & Continue';
                }
            } catch (error) {
                console.error('NDA signing error:', error);
                errorMessage.textContent = 'Network error. Please check your connection and try again.';
                errorMessage.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = '✅ Sign NDA & Continue';
            }
        });
    </script>
</body>
</html>
`;
};
