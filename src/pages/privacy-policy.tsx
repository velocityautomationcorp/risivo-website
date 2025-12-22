/**
 * Privacy Policy Page
 * Professional redesign with Risivo branding
 */

import { html } from 'hono/html';

export const PrivacyPolicyPage = () => html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Risivo</title>
    <meta name="description" content="Risivo Privacy Policy - Learn how we collect, use, and protect your personal information.">
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
    <style>
      /* Privacy Policy Page Specific Styles */
      .privacy-header {
        background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
        padding: 60px 20px;
        text-align: center;
        margin-bottom: 0;
      }

      .privacy-header .logo {
        margin-bottom: 30px;
      }

      .privacy-header .logo img {
        height: 50px;
        filter: brightness(0) invert(1);
      }

      .privacy-header h1 {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .privacy-header .subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        margin: 0;
      }

      .privacy-content {
        max-width: 900px;
        margin: 0 auto;
        padding: 50px 40px;
      }

      .last-updated {
        background: linear-gradient(135deg, rgba(107, 63, 234, 0.1) 0%, rgba(237, 99, 47, 0.1) 100%);
        border-left: 4px solid var(--color-primary-start);
        padding: 15px 20px;
        border-radius: 0 8px 8px 0;
        margin-bottom: 40px;
        color: var(--color-text-primary);
        font-size: 0.95rem;
      }

      .last-updated strong {
        color: var(--color-primary-start);
      }

      .policy-section {
        background: white;
        border-radius: 16px;
        padding: 35px;
        margin-bottom: 25px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease;
      }

      .policy-section:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }

      .policy-section h2 {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid rgba(107, 63, 234, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .policy-section h2 .section-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
      }

      .policy-section h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 25px 0 15px;
      }

      .policy-section p {
        color: var(--color-text-secondary);
        line-height: 1.8;
        margin-bottom: 15px;
        font-size: 1rem;
      }

      .policy-section ul {
        list-style: none;
        padding: 0;
        margin: 0 0 15px 0;
      }

      .policy-section ul li {
        position: relative;
        padding: 10px 0 10px 30px;
        color: var(--color-text-secondary);
        line-height: 1.7;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      }

      .policy-section ul li:last-child {
        border-bottom: none;
      }

      .policy-section ul li::before {
        content: '';
        position: absolute;
        left: 0;
        top: 16px;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
        border-radius: 50%;
      }

      .policy-section ul li strong {
        color: var(--color-text-primary);
        font-weight: 600;
      }

      .highlight-box {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-left: 4px solid #f59e0b;
        border-radius: 0 10px 10px 0;
        padding: 20px 25px;
        margin: 20px 0;
      }

      .highlight-box strong {
        color: #b45309;
        font-weight: 700;
      }

      .contact-card {
        background: linear-gradient(135deg, rgba(107, 63, 234, 0.05) 0%, rgba(237, 99, 47, 0.05) 100%);
        border-radius: 12px;
        padding: 30px;
        margin-top: 20px;
      }

      .contact-card h3 {
        color: var(--color-primary-start);
        font-size: 1.2rem;
        margin-bottom: 20px;
        margin-top: 0;
      }

      .contact-card p {
        margin-bottom: 12px;
      }

      .contact-card a {
        color: var(--color-primary-start);
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .contact-card a:hover {
        color: var(--color-primary-end);
      }

      .back-home-section {
        text-align: center;
        margin: 50px 0 30px;
      }

      .btn-back-home {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 32px;
        background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
        color: white !important;
        border-radius: 10px;
        font-weight: 600;
        font-size: 1rem;
        text-decoration: none;
        box-shadow: 0 4px 15px rgba(107, 63, 234, 0.3);
        transition: all 0.3s ease;
      }

      .btn-back-home:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(107, 63, 234, 0.4);
        text-decoration: none;
      }

      /* Footer */
      .privacy-footer {
        text-align: center;
        padding: 40px 20px;
        margin-top: 30px;
        color: var(--color-text-secondary);
        font-size: 0.9rem;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        background: var(--color-gray-50);
      }

      .privacy-footer .footer-logo {
        margin-bottom: 15px;
      }

      .privacy-footer .footer-logo img {
        height: 35px;
        opacity: 0.8;
      }

      .privacy-footer p {
        margin: 0;
        color: var(--color-text-muted);
      }

      .footer-links {
        margin-top: 15px;
        display: flex;
        justify-content: center;
        gap: 25px;
        flex-wrap: wrap;
      }

      .footer-links a {
        color: var(--color-text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;
      }

      .footer-links a:hover {
        color: var(--color-primary-start);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .privacy-header {
          padding: 40px 20px;
        }

        .privacy-header h1 {
          font-size: 1.8rem;
        }

        .privacy-content {
          padding: 30px 20px;
        }

        .policy-section {
          padding: 25px 20px;
        }

        .policy-section h2 {
          font-size: 1.2rem;
        }

        .contact-card {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <!-- Header with Logo -->
    <header class="privacy-header">
      <div class="logo">
        <a href="/">
          <img src="/images/risivo-logo.png" alt="Risivo Logo">
        </a>
      </div>
      <h1>Privacy Policy</h1>
      <p class="subtitle">Your privacy matters to us at Risivo</p>
    </header>

    <div class="privacy-content">
      <div class="last-updated">
        <strong>Last Updated:</strong> December 13, 2024
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">1</span> Introduction</h2>
        <p>
          Welcome to Risivo ("we," "our," or "us"). Risivo is operated by Velocity Automation Corp. 
          We are committed to protecting your privacy and ensuring the security of your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
          use our Marketing CRM platform and related services.
        </p>
        <p>
          By accessing or using Risivo, you agree to the terms of this Privacy Policy. If you do not agree 
          with the terms of this Privacy Policy, please do not access or use our services.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">2</span> Information We Collect</h2>
        
        <h3>2.1 Information You Provide</h3>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, phone number, company name, job title, and password when you create an account</li>
          <li><strong>Profile Information:</strong> Additional details you choose to provide in your user profile</li>
          <li><strong>Customer Data:</strong> Information about your customers that you input into our CRM system</li>
          <li><strong>Payment Information:</strong> Billing details and payment card information (processed securely through third-party payment processors)</li>
          <li><strong>Communications:</strong> Messages, feedback, and correspondence you send to us</li>
        </ul>

        <h3>2.2 Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> Information about how you use our platform, including features accessed, time spent, and interaction patterns</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
          <li><strong>Log Data:</strong> Server logs, error reports, and performance data</li>
          <li><strong>Cookies and Tracking:</strong> Information collected through cookies, pixels, and similar technologies</li>
        </ul>

        <h3>2.3 Information from Third Parties</h3>
        <ul>
          <li>Social media profile information when you connect third-party accounts</li>
          <li>Data from integration partners and business tools you connect to Risivo</li>
          <li>Marketing and analytics data from service providers</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">3</span> How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        
        <ul>
          <li><strong>Service Delivery:</strong> To provide, maintain, and improve our CRM platform and services</li>
          <li><strong>Account Management:</strong> To create and manage your account, process transactions, and provide customer support</li>
          <li><strong>Communication:</strong> To send you updates, notifications, marketing materials, and respond to inquiries</li>
          <li><strong>Personalization:</strong> To customize your experience and provide relevant content and features</li>
          <li><strong>Analytics:</strong> To analyze usage patterns, improve our services, and develop new features</li>
          <li><strong>Security:</strong> To detect, prevent, and address security issues, fraud, and technical problems</li>
          <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms of service</li>
          <li><strong>Marketing:</strong> To send promotional materials and product updates (you can opt-out at any time)</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">4</span> Data Sharing and Disclosure</h2>
        
        <h3>4.1 We May Share Your Information With:</h3>
        <ul>
          <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, payment processing, analytics, customer support)</li>
          <li><strong>Business Partners:</strong> Trusted partners who help us deliver our services</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
        </ul>

        <h3>4.2 We Do Not:</h3>
        <ul>
          <li>Sell your personal information to third parties</li>
          <li>Share your customer data with competitors</li>
          <li>Use your data for purposes unrelated to providing our services</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">5</span> Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your information:
        </p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Secure server infrastructure with regular security updates</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Regular security audits and penetration testing</li>
          <li>Employee training on data protection and privacy</li>
          <li>Incident response and breach notification procedures</li>
        </ul>
        <div class="highlight-box">
          <strong>Important:</strong> While we strive to protect your information, no method of transmission over 
          the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
        </div>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">6</span> Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to:
        </p>
        <ul>
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce our agreements</li>
          <li>Maintain business records as required by law</li>
        </ul>
        <p>
          When you close your account, we will delete or anonymize your personal information within 90 days, 
          unless we are required to retain it for legal purposes.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">7</span> Your Rights and Choices</h2>
        <p>You have the following rights regarding your personal information:</p>
        
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal information</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Portability:</strong> Receive your data in a portable format</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
          <li><strong>Restriction:</strong> Limit how we use your information</li>
          <li><strong>Object:</strong> Object to certain types of data processing</li>
        </ul>

        <p>
          To exercise these rights, please contact us at <strong>privacy@risivo.com</strong>.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">8</span> Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to:
        </p>
        <ul>
          <li>Remember your preferences and settings</li>
          <li>Authenticate your account and maintain security</li>
          <li>Analyze usage patterns and improve our services</li>
          <li>Deliver personalized content and advertisements</li>
        </ul>
        <p>
          You can control cookies through your browser settings. However, disabling cookies may affect 
          your ability to use certain features of our platform.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">9</span> Third-Party Links and Services</h2>
        <p>
          Our platform may contain links to third-party websites and services. We are not responsible for 
          the privacy practices of these third parties. We encourage you to review their privacy policies 
          before providing any personal information.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">10</span> Children's Privacy</h2>
        <p>
          Risivo is not intended for children under 13 years of age. We do not knowingly collect personal 
          information from children under 13. If we become aware that we have collected information from a 
          child under 13, we will take steps to delete it promptly.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">11</span> International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your country of residence. 
          These countries may have different data protection laws. By using our services, you consent to the 
          transfer of your information to these countries.
        </p>
        <p>
          We ensure that such transfers comply with applicable data protection laws and implement appropriate 
          safeguards to protect your information.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">12</span> California Privacy Rights (CCPA)</h2>
        <p>
          If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
        </p>
        <ul>
          <li>Right to know what personal information is collected</li>
          <li>Right to know if personal information is sold or disclosed</li>
          <li>Right to opt-out of the sale of personal information</li>
          <li>Right to deletion of personal information</li>
          <li>Right to non-discrimination for exercising your rights</li>
        </ul>
        <p>
          To exercise these rights, contact us at <strong>privacy@risivo.com</strong>.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">13</span> European Privacy Rights (GDPR)</h2>
        <p>
          If you are in the European Economic Area (EEA), you have rights under the General Data Protection 
          Regulation (GDPR), including:
        </p>
        <ul>
          <li>Right of access to your personal data</li>
          <li>Right to rectification of inaccurate data</li>
          <li>Right to erasure ("right to be forgotten")</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
          <li>Right to withdraw consent</li>
          <li>Right to lodge a complaint with a supervisory authority</li>
        </ul>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">14</span> Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal 
          requirements. We will notify you of any material changes by:
        </p>
        <ul>
          <li>Posting the updated policy on our website</li>
          <li>Sending you an email notification</li>
          <li>Displaying a prominent notice in our platform</li>
        </ul>
        <p>
          Your continued use of Risivo after the effective date of the updated Privacy Policy constitutes 
          your acceptance of the changes.
        </p>
      </div>

      <div class="policy-section">
        <h2><span class="section-icon">15</span> Contact Us</h2>
        <div class="contact-card">
          <h3>Questions About This Privacy Policy?</h3>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <p><strong>Email:</strong> <a href="mailto:privacy@risivo.com">privacy@risivo.com</a></p>
          <p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@risivo.com">dpo@risivo.com</a></p>
          <p><strong>Mailing Address:</strong><br>
            Velocity Automation Corp.<br>
            Attn: Privacy Department<br>
            [Your Company Address]<br>
            [City, State, ZIP Code]
          </p>
          <p><strong>Website:</strong> <a href="https://risivo.com">https://risivo.com</a></p>
        </div>
      </div>

      <div class="back-home-section">
        <a href="/" class="btn-back-home">
          <span>&#8592;</span> Back to Home
        </a>
      </div>
    </div>

    <!-- Footer with Dynamic Copyright -->
    <footer class="privacy-footer">
      <div class="footer-logo">
        <img src="/images/risivo-logo.png" alt="Risivo">
      </div>
      <p>&copy; <span id="copyrightYear"></span> Risivo by Velocity Automation Corp. All rights reserved.</p>
      <div class="footer-links">
        <a href="/terms-of-service">Terms of Service</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/">Home</a>
      </div>
    </footer>

    <script>
      // Dynamic copyright year
      document.getElementById('copyrightYear').textContent = new Date().getFullYear();
    </script>
  </body>
  </html>
`;
