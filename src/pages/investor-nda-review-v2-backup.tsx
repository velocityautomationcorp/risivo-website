import { html } from 'hono/html';

export const InvestorNDAReviewPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NDA Review - Risivo Investor Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .nda-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 900px;
            width: 100%;
            overflow: hidden;
        }

        .nda-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }

        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 15px;
        }

        .nda-header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .nda-header p {
            font-size: 16px;
            opacity: 0.95;
        }

        .investor-badge {
            display: inline-block;
            background: rgba(255, 215, 0, 0.2);
            color: #ffd700;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 12px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .nda-content {
            padding: 40px;
        }

        .nda-scroll-box {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 30px;
            max-height: 500px;
            overflow-y: auto;
            margin-bottom: 30px;
            line-height: 1.8;
            color: #333;
        }

        .nda-scroll-box::-webkit-scrollbar {
            width: 8px;
        }

        .nda-scroll-box::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .nda-scroll-box::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 4px;
        }

        .nda-scroll-box h2 {
            color: #667eea;
            font-size: 20px;
            margin-top: 24px;
            margin-bottom: 12px;
            font-weight: 600;
        }

        .nda-scroll-box h2:first-child {
            margin-top: 0;
        }

        .nda-scroll-box p {
            margin-bottom: 16px;
            font-size: 15px;
        }

        .nda-scroll-box ol {
            margin-left: 20px;
            margin-bottom: 16px;
        }

        .nda-scroll-box li {
            margin-bottom: 8px;
            font-size: 15px;
        }

        .signature-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 24px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .form-label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
            font-size: 15px;
        }

        .form-input {
            width: 100%;
            padding: 14px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 16px;
            font-family: 'Inter', sans-serif;
            transition: all 0.3s;
        }

        .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .signature-display {
            background: white;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            font-family: 'Brush Script MT', cursive;
            font-size: 32px;
            color: #667eea;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .checkbox-group {
            display: flex;
            align-items: flex-start;
            margin-bottom: 24px;
            padding: 20px;
            background: #fff3cd;
            border-radius: 8px;
            border: 2px solid #ffc107;
        }

        .checkbox-group input[type="checkbox"] {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            margin-top: 2px;
            cursor: pointer;
        }

        .checkbox-group label {
            font-size: 15px;
            color: #856404;
            font-weight: 500;
            line-height: 1.6;
            cursor: pointer;
        }

        .btn-sign {
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
        }

        .btn-sign:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-sign:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 14px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
            border: 1px solid #f5c6cb;
        }

        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #667eea;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 14px;
            color: #004085;
        }

        .metadata {
            font-size: 13px;
            color: #6c757d;
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
        }

        @media (max-width: 768px) {
            .nda-content {
                padding: 24px;
            }

            .nda-header {
                padding: 24px;
            }

            .nda-header h1 {
                font-size: 24px;
            }

            .nda-scroll-box {
                padding: 20px;
                max-height: 400px;
            }

            .signature-section {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="nda-container">
        <div class="nda-header">
            <img src="/risivo-logo-white.png" alt="Risivo Logo" class="logo">
            <h1>Non-Disclosure Agreement</h1>
            <p>Please review and sign to access exclusive investor content</p>
            <div class="investor-badge">🔐 Investor Access Required</div>
        </div>

        <div class="nda-content">
            <div class="info-box">
                <strong>⚖️ Legal Notice:</strong> This is a legally binding Non-Disclosure Agreement between you and Velocity Automation Corp (operating as Risivo™). Your electronic signature will be recorded with IP address and timestamp as legally admissible evidence under U.S. federal and Delaware state law. Please read carefully before signing.
            </div>

            <div id="errorMessage" class="error-message"></div>

            <!-- NDA Legal Text -->
            <div class="nda-scroll-box" id="ndaText">
                <h2>MUTUAL NON-DISCLOSURE AGREEMENT</h2>
                
                <p><strong>Effective Date:</strong> <span id="currentDate"></span></p>
                
                <p>This Non-Disclosure Agreement (the "Agreement") is entered into as of the Effective Date by and between:</p>
                
                <p><strong>Risivo™</strong>, a registered trademark and software-as-a-service (SaaS) platform owned and operated by <strong>Velocity Automation Corp</strong>, a corporation duly incorporated and validly existing under the laws of the State of Delaware, United States of America, with its principal place of business located in the United States (hereinafter referred to as the "Company" or "Disclosing Party"),</p>
                
                <p style="text-align: center; margin: 20px 0; font-weight: 600; font-size: 16px;">AND</p>
                
                <p>The undersigned individual or entity executing this Agreement (hereinafter referred to as the "Recipient" or "Receiving Party"),</p>
                
                <p>(The Company and Recipient are hereinafter collectively referred to as the "Parties" and individually as a "Party.")</p>

                <h2>RECITALS</h2>
                <p><strong>WHEREAS,</strong> the Company is engaged in the business of developing, marketing, and providing software-as-a-service solutions and related technology services;</p>
                
                <p><strong>WHEREAS,</strong> the Recipient has expressed interest in evaluating a potential business relationship, investment opportunity, or strategic partnership with the Company;</p>
                
                <p><strong>WHEREAS,</strong> in connection with such evaluation, the Company may disclose to the Recipient certain confidential, proprietary, and trade secret information;</p>
                
                <p><strong>NOW, THEREFORE,</strong> in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:</p>

                <h2>1. Purpose</h2>
                <p>The Parties wish to explore a potential business relationship, investment opportunity, or strategic partnership involving the disclosure of certain confidential and proprietary information related to the Company's business operations, financial forecasts, business strategy, technology roadmap, intellectual property, pitch deck, investment terms, and other proprietary materials (collectively, the "Confidential Information"). The purpose of this Agreement is to protect the confidentiality of such information and to set forth the terms and conditions under which the Confidential Information may be disclosed and used.</p>

                <h2>2. Definition of Confidential Information</h2>
                <p>Confidential Information includes, but is not limited to:</p>
                <ol>
                    <li>Financial forecasts, projections, and business plans</li>
                    <li>Pitch decks, investor presentations, and marketing materials</li>
                    <li>Product roadmaps, technical specifications, and software architecture</li>
                    <li>Customer lists, pricing strategies, and business strategies</li>
                    <li>Trade secrets, proprietary processes, and intellectual property</li>
                    <li>Any information marked as "Confidential" or that a reasonable person would consider confidential</li>
                </ol>

                <h2>3. Obligations of Recipient</h2>
                <p>The Recipient agrees to:</p>
                <ol>
                    <li><strong>Maintain Confidentiality:</strong> Keep all Confidential Information strictly confidential and not disclose it to any third party without prior written consent from the Company.</li>
                    <li><strong>Limit Use:</strong> Use the Confidential Information solely for the purpose of evaluating a potential investment or business relationship with Risivo.</li>
                    <li><strong>Protect Information:</strong> Take reasonable measures to protect the Confidential Information from unauthorized disclosure or use, using at least the same degree of care as used for their own confidential information.</li>
                    <li><strong>Restrict Access:</strong> Limit access to Confidential Information to employees, advisors, or representatives who have a legitimate need to know and who are bound by confidentiality obligations.</li>
                </ol>

                <h2>4. Exceptions</h2>
                <p>Confidential Information does not include information that:</p>
                <ol>
                    <li>Was publicly available at the time of disclosure or becomes publicly available through no fault of the Recipient</li>
                    <li>Was already known to the Recipient prior to disclosure by the Company</li>
                    <li>Is independently developed by the Recipient without reference to the Confidential Information</li>
                    <li>Is rightfully received by the Recipient from a third party without breach of confidentiality obligations</li>
                    <li>Is required to be disclosed by law, regulation, or court order (with prompt notice to the Company)</li>
                </ol>

                <h2>5. Term and Termination</h2>
                <p>This Agreement shall remain in effect for a period of <strong>three (3) years</strong> from the Effective Date. Upon termination or request by the Company, the Recipient shall:</p>
                <ol>
                    <li>Immediately cease using the Confidential Information</li>
                    <li>Return or destroy all copies of Confidential Information in their possession</li>
                    <li>Provide written certification of compliance with these obligations</li>
                </ol>

                <h2>6. No License or Rights Granted</h2>
                <p>This Agreement does not grant the Recipient any license, intellectual property rights, ownership interest, or other rights whatsoever in or to the Confidential Information or any intellectual property owned or controlled by the Company. All Confidential Information and all intellectual property rights therein remain the sole and exclusive property of Velocity Automation Corp and/or Risivo™. Nothing in this Agreement shall be construed as granting any rights to the Recipient under any patent, copyright, trademark, trade secret, or other intellectual property right of the Company, by implication, estoppel, or otherwise.</p>

                <h2>7. No Obligation to Transact; No Agency Relationship</h2>
                <p>This Agreement does not create any obligation on either Party to pursue, consummate, or enter into any business relationship, investment transaction, strategic partnership, or other agreement whatsoever. The Company reserves the absolute right, in its sole and exclusive discretion, to accept or reject any investment proposal, business proposition, or other opportunity, and to determine the terms and conditions of any such transaction. Nothing in this Agreement shall be construed to create any agency, partnership, joint venture, employment, or fiduciary relationship between the Parties.</p>

                <h2>8. Remedies and Injunctive Relief</h2>
                <p>The Recipient acknowledges and agrees that any breach or threatened breach of this Agreement may cause the Company irreparable harm for which monetary damages would be an inadequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Company shall be entitled to seek and obtain injunctive relief, specific performance, or other equitable relief to prevent or restrain any breach or threatened breach of this Agreement, without the necessity of posting any bond or proving actual damages.</p>

                <h2>9. Electronic Signature and Acknowledgment</h2>
                <p>By typing your full legal name below and clicking "I Agree and Sign," you hereby acknowledge, represent, warrant, and agree that:</p>
                <ol>
                    <li>Your electronic signature is legally binding, valid, and enforceable, and shall have the same legal effect as an original handwritten signature under applicable law, including but not limited to the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and the Uniform Electronic Transactions Act (UETA);</li>
                    <li>You have carefully read, fully understood, and voluntarily agree to be legally bound by all terms, conditions, covenants, and obligations set forth in this Agreement;</li>
                    <li>Your IP address, geographic location, timestamp, device information, and other technical metadata will be recorded, logged, and retained for authentication, verification, and legal evidentiary purposes;</li>
                    <li>You are of legal age and have the full legal capacity, authority, and right to enter into this Agreement and to perform your obligations hereunder;</li>
                    <li>If you are executing this Agreement on behalf of a business entity, you represent and warrant that you have the requisite authority to bind such entity to the terms of this Agreement;</li>
                    <li>You acknowledge that this electronic signature process satisfies any requirements under applicable law for a written signature, and you waive any objections to the admissibility of this electronically signed Agreement as evidence in any legal or administrative proceeding.</li>
                </ol>

                <h2>9. Governing Law and Jurisdiction</h2>
                <p>This Agreement shall be governed by, and construed and interpreted in accordance with, the internal laws of the State of Delaware, United States of America, without giving effect to any choice or conflict of law provision or rule (whether of the State of Delaware or any other jurisdiction) that would cause the application of the laws of any jurisdiction other than the State of Delaware.</p>
                
                <p>Any legal action, suit, or proceeding arising out of or relating to this Agreement or the transactions contemplated hereby shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware, and each Party irrevocably submits to the exclusive jurisdiction of such courts in any such action, suit, or proceeding. The Parties hereby waive any right to a jury trial in connection with any action or litigation in any way arising out of or related to this Agreement.</p>

                <h2>10. Dispute Resolution</h2>
                <p>In the event of any dispute, controversy, or claim arising out of or relating to this Agreement, or the breach, termination, or validity thereof, the Parties agree to first attempt to resolve such dispute through good faith negotiations between senior executives of both Parties for a period of thirty (30) days. If the dispute cannot be resolved through negotiation, the Parties may pursue other legal remedies available under applicable law.</p>

                <h2>11. Entire Agreement and Amendments</h2>
                <p>This Agreement constitutes the entire agreement between the Parties regarding the subject matter herein and supersedes all prior and contemporaneous discussions, negotiations, agreements, understandings, or representations of any kind, whether written or oral, relating to the subject matter of this Agreement. This Agreement may not be amended, modified, or supplemented except by a written instrument signed by duly authorized representatives of both Parties.</p>
                
                <h2>12. Severability</h2>
                <p>If any provision of this Agreement is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be deemed modified to the minimum extent necessary to make it valid, legal, and enforceable, or if such modification is not possible, such provision shall be severed from this Agreement. In either case, the remaining provisions of this Agreement shall continue in full force and effect.</p>
                
                <h2>13. Counterparts and Electronic Signatures</h2>
                <p>This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. The Parties agree that electronic signatures, digital signatures, or facsimile signatures shall be deemed to have the same legal effect as original handwritten signatures and that this Agreement may be validly executed and delivered by electronic means.</p>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <h3 style="margin-bottom: 20px; color: #333;">Electronic Signature</h3>
                
                <div class="form-group">
                    <label class="form-label" for="fullName">Full Legal Name *</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        class="form-input" 
                        placeholder="Type your full legal name"
                        required
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">Your Signature (auto-generated):</label>
                    <div class="signature-display" id="signatureDisplay">
                        <span style="color: #ccc;">Your signature will appear here...</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Date:</label>
                    <input 
                        type="text" 
                        id="signatureDate" 
                        class="form-input" 
                        readonly
                        style="background: #f8f9fa;"
                    >
                </div>
            </div>

            <!-- Agreement Checkbox -->
            <div class="checkbox-group">
                <input type="checkbox" id="agreeCheckbox">
                <label for="agreeCheckbox">
                    <strong>I have read and understood this Non-Disclosure Agreement.</strong> I agree to be legally bound by its terms and conditions. I understand that my electronic signature is legally binding and that this agreement will be recorded with my IP address and timestamp.
                </label>
            </div>

            <!-- Sign Button -->
            <button class="btn-sign" id="signButton" disabled>
                🔒 I Agree and Sign NDA
            </button>

            <!-- Metadata -->
            <div class="metadata">
                <p><strong>NDA Version:</strong> v2.0 (Enhanced Legal) | <strong>Document ID:</strong> NDA-RISIVO-VAC-2025</p>
                <p><strong>Issuing Entity:</strong> Velocity Automation Corp (Delaware) | <strong>Brand:</strong> Risivo™</p>
                <p>Your electronic signature, IP address, and timestamp will be cryptographically recorded for legal verification and evidentiary purposes.</p>
            </div>
        </div>
    </div>

    <script>
        // Set current date
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        document.getElementById('currentDate').textContent = dateStr;
        document.getElementById('signatureDate').value = dateStr;

        // Live signature preview
        const fullNameInput = document.getElementById('fullName');
        const signatureDisplay = document.getElementById('signatureDisplay');
        
        fullNameInput.addEventListener('input', (e) => {
            const name = e.target.value.trim();
            if (name) {
                signatureDisplay.innerHTML = name;
                signatureDisplay.style.color = '#667eea';
            } else {
                signatureDisplay.innerHTML = '<span style="color: #ccc;">Your signature will appear here...</span>';
            }
        });

        // Enable/disable sign button
        const agreeCheckbox = document.getElementById('agreeCheckbox');
        const signButton = document.getElementById('signButton');
        
        agreeCheckbox.addEventListener('change', (e) => {
            signButton.disabled = !e.target.checked;
        });

        // Form submission
        signButton.addEventListener('click', async () => {
            const fullName = fullNameInput.value.trim();
            const agreed = agreeCheckbox.checked;
            const errorMessage = document.getElementById('errorMessage');

            // Validation
            if (!fullName) {
                errorMessage.textContent = 'Please enter your full legal name.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!agreed) {
                errorMessage.textContent = 'Please check the agreement box to proceed.';
                errorMessage.style.display = 'block';
                return;
            }

            // Disable button during submission
            signButton.disabled = true;
            signButton.textContent = '🔄 Signing NDA...';

            try {
                const response = await fetch('/api/auth/investor/sign-nda', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        full_name: fullName,
                        signature_date: new Date().toISOString(),
                        nda_version: 'v2.0'
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Redirect to investor dashboard
                    window.location.href = '/updates/investor/dashboard';
                } else {
                    throw new Error(data.error || 'Failed to sign NDA');
                }
            } catch (error) {
                console.error('NDA signature error:', error);
                errorMessage.textContent = 'Error signing NDA: ' + error.message;
                errorMessage.style.display = 'block';
                signButton.disabled = false;
                signButton.textContent = '🔒 I Agree and Sign NDA';
            }
        });

        // Hide error message when user starts typing
        fullNameInput.addEventListener('input', () => {
            document.getElementById('errorMessage').style.display = 'none';
        });

        agreeCheckbox.addEventListener('change', () => {
            document.getElementById('errorMessage').style.display = 'none';
        });
    </script>
</body>
</html>
`;
