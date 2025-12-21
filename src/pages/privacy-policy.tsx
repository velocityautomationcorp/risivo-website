/**
 * Privacy Policy Page
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div class="header">
      <h1>Privacy Policy</h1>
      <p>Risivo - Marketing CRM Platform</p>
    </div>

    <div class="container">
      <div class="last-updated">
        <strong>Last Updated:</strong> December 13, 2024
      </div>

      <div class="section">
        <h2>1. Introduction</h2>
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

      <div class="section">
        <h2>2. Information We Collect</h2>
        
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

      <div class="section">
        <h2>3. How We Use Your Information</h2>
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

      <div class="section">
        <h2>4. Data Sharing and Disclosure</h2>
        
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

      <div class="section">
        <h2>5. Data Security</h2>
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

      <div class="section">
        <h2>6. Data Retention</h2>
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

      <div class="section">
        <h2>7. Your Rights and Choices</h2>
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

      <div class="section">
        <h2>8. Cookies and Tracking Technologies</h2>
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

      <div class="section">
        <h2>9. Third-Party Links and Services</h2>
        <p>
          Our platform may contain links to third-party websites and services. We are not responsible for 
          the privacy practices of these third parties. We encourage you to review their privacy policies 
          before providing any personal information.
        </p>
      </div>

      <div class="section">
        <h2>10. Children's Privacy</h2>
        <p>
          Risivo is not intended for children under 13 years of age. We do not knowingly collect personal 
          information from children under 13. If we become aware that we have collected information from a 
          child under 13, we will take steps to delete it promptly.
        </p>
      </div>

      <div class="section">
        <h2>11. International Data Transfers</h2>
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

      <div class="section">
        <h2>12. California Privacy Rights (CCPA)</h2>
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

      <div class="section">
        <h2>13. European Privacy Rights (GDPR)</h2>
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

      <div class="section">
        <h2>14. Changes to This Privacy Policy</h2>
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

      <div class="section">
        <h2>15. Contact Us</h2>
        <div class="contact-info">
          <h3>Questions About This Privacy Policy?</h3>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <p><strong>Email:</strong> privacy@risivo.com</p>
          <p><strong>Data Protection Officer:</strong> dpo@risivo.com</p>
          <p><strong>Mailing Address:</strong><br>
            Velocity Automation Corp.<br>
            Attn: Privacy Department<br>
            [Your Company Address]<br>
            [City, State, ZIP Code]
          </p>
          <p><strong>Website:</strong> <a href="https://risivo.com" style="color: #667eea;">https://risivo.com</a></p>
        </div>
      </div>

      <a href="/" class="back-link">← Back to Home</a>
    </div>
  </body>
  </html>
`;
