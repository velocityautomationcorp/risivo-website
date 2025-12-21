/**
 * Terms of Service Page
 */

import { html } from 'hono/html';

export const TermsOfServicePage = () => html`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - Risivo</title>
    <meta name="description" content="Risivo Terms of Service - Read our terms and conditions for using the Risivo Marketing CRM platform.">
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div class="header">
      <h1>Terms of Service</h1>
      <p>Risivo - Marketing CRM Platform</p>
    </div>

    <div class="container">
      <div class="last-updated">
        <strong>Last Updated:</strong> December 13, 2024
      </div>

      <div class="section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          Welcome to Risivo, a Marketing CRM platform operated by Velocity Automation Corp. ("Risivo," "we," "us," or "our"). 
          By accessing or using our website, mobile applications, and services (collectively, the "Service"), you agree to be 
          bound by these Terms of Service ("Terms").
        </p>
        <div class="highlight-box">
          <strong>Important:</strong> Please read these Terms carefully before using the Service. If you do not agree to these 
          Terms, you may not access or use the Service.
        </div>
        <p>
          These Terms constitute a legally binding agreement between you and Velocity Automation Corp. By creating an account, 
          accessing the Service, or using any of our features, you acknowledge that you have read, understood, and agree to be 
          bound by these Terms.
        </p>
      </div>

      <div class="section">
        <h2>2. Definitions</h2>
        <ul>
          <li><strong>"Service"</strong> refers to the Risivo platform, including all websites, applications, features, and functionalities</li>
          <li><strong>"User," "you," or "your"</strong> refers to any individual or entity using the Service</li>
          <li><strong>"Account"</strong> refers to your registered user account on the Service</li>
          <li><strong>"Customer Data"</strong> refers to data you upload, store, or process through the Service</li>
          <li><strong>"Subscription"</strong> refers to your paid or trial access to the Service</li>
          <li><strong>"Content"</strong> refers to text, images, data, and other materials available through the Service</li>
        </ul>
      </div>

      <div class="section">
        <h2>3. Account Registration and Eligibility</h2>
        
        <h3>3.1 Eligibility</h3>
        <p>You must meet the following requirements to use the Service:</p>
        <ul>
          <li>Be at least 18 years of age</li>
          <li>Have the legal capacity to enter into a binding contract</li>
          <li>Not be prohibited from using the Service under applicable law</li>
          <li>Provide accurate and complete registration information</li>
        </ul>

        <h3>3.2 Account Registration</h3>
        <p>To use certain features of the Service, you must create an account. When creating an account, you agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your password secure and confidential</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized access or security breach</li>
        </ul>

        <h3>3.3 Account Restrictions</h3>
        <ul>
          <li>You may not share your account credentials with others</li>
          <li>You may not create an account using false or misleading information</li>
          <li>You may not create multiple accounts to evade restrictions</li>
          <li>You may not transfer your account to another person or entity</li>
        </ul>
      </div>

      <div class="section">
        <h2>4. Subscription Plans and Billing</h2>
        
        <h3>4.1 Subscription Plans</h3>
        <p>
          Risivo offers various subscription plans with different features and pricing. Details of available plans are 
          available on our website at <a href="https://risivo.com/pricing" style="color: #667eea;">risivo.com/pricing</a>.
        </p>

        <h3>4.2 Free Trial</h3>
        <p>
          We may offer a free trial period for new users. During the trial period:
        </p>
        <ul>
          <li>You have access to specified features</li>
          <li>No payment information is required unless you choose to upgrade</li>
          <li>The trial automatically ends after the specified period</li>
          <li>You can upgrade to a paid plan at any time</li>
          <li>We may terminate trials that violate these Terms</li>
        </ul>

        <h3>4.3 Billing and Payments</h3>
        <ul>
          <li><strong>Payment Authorization:</strong> By providing payment information, you authorize us to charge your payment method</li>
          <li><strong>Recurring Charges:</strong> Subscriptions automatically renew unless you cancel before the renewal date</li>
          <li><strong>Price Changes:</strong> We may change subscription prices with 30 days' notice</li>
          <li><strong>Taxes:</strong> Prices do not include applicable taxes, which you are responsible for paying</li>
          <li><strong>Failed Payments:</strong> If payment fails, we may suspend or terminate your access</li>
        </ul>

        <h3>4.4 Refund Policy</h3>
        <p>
          Refunds are provided at our discretion and subject to the following:
        </p>
        <ul>
          <li>Refund requests must be made within 30 days of purchase</li>
          <li>Refunds are not available for partial billing periods</li>
          <li>No refunds for accounts terminated due to Terms violations</li>
          <li>Setup fees and custom development are non-refundable</li>
        </ul>

        <h3>4.5 Cancellation</h3>
        <p>
          You may cancel your subscription at any time. Upon cancellation:
        </p>
        <ul>
          <li>Your access continues until the end of the current billing period</li>
          <li>No refunds are provided for the remaining period</li>
          <li>You can export your data before the subscription ends</li>
          <li>Your account will be deactivated after the billing period ends</li>
        </ul>
      </div>

      <div class="section">
        <h2>5. Acceptable Use Policy</h2>
        
        <h3>5.1 Permitted Use</h3>
        <p>You may use the Service only for lawful purposes and in accordance with these Terms.</p>

        <h3>5.2 Prohibited Activities</h3>
        <p>You agree NOT to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on intellectual property rights of others</li>
          <li>Upload or transmit viruses, malware, or malicious code</li>
          <li>Attempt to gain unauthorized access to the Service or other accounts</li>
          <li>Interfere with or disrupt the Service or servers</li>
          <li>Use the Service to send spam or unsolicited communications</li>
          <li>Scrape, crawl, or harvest data from the Service using automated means</li>
          <li>Reverse engineer, decompile, or disassemble the Service</li>
          <li>Remove or modify any copyright or proprietary notices</li>
          <li>Use the Service to compete with us or develop competing products</li>
          <li>Share your account credentials with unauthorized persons</li>
          <li>Resell or sublicense the Service without permission</li>
          <li>Store or process illegal content or data</li>
          <li>Harass, abuse, or harm other users</li>
        </ul>

        <div class="warning-box">
          <strong>Warning:</strong> Violation of this Acceptable Use Policy may result in immediate suspension or 
          termination of your account without refund.
        </div>
      </div>

      <div class="section">
        <h2>6. Customer Data and Privacy</h2>
        
        <h3>6.1 Your Data</h3>
        <p>
          You retain all rights to your Customer Data. By using the Service, you grant us a limited license to:
        </p>
        <ul>
          <li>Store, process, and transmit your data to provide the Service</li>
          <li>Use your data to improve and optimize the Service</li>
          <li>Create anonymized, aggregated data for analytics and research</li>
        </ul>

        <h3>6.2 Data Responsibilities</h3>
        <p>You are responsible for:</p>
        <ul>
          <li>Ensuring you have the right to use and share your Customer Data</li>
          <li>Compliance with data protection laws (GDPR, CCPA, etc.)</li>
          <li>Obtaining necessary consents from individuals whose data you process</li>
          <li>Maintaining backups of your data</li>
          <li>Accuracy and legality of your data</li>
        </ul>

        <h3>6.3 Data Security</h3>
        <p>
          We implement reasonable security measures to protect your data, but we cannot guarantee absolute security. 
          See our <a href="/privacy-policy" style="color: #667eea;">Privacy Policy</a> for more information.
        </p>

        <h3>6.4 Data Deletion</h3>
        <p>
          Upon account termination, we will delete your Customer Data within 90 days unless:
        </p>
        <ul>
          <li>Required by law to retain it</li>
          <li>Needed to resolve disputes</li>
          <li>Part of anonymized aggregated data</li>
        </ul>
      </div>

      <div class="section">
        <h2>7. Intellectual Property Rights</h2>
        
        <h3>7.1 Our Property</h3>
        <p>
          The Service, including all software, designs, text, graphics, logos, and other content (excluding Customer Data), 
          is owned by Velocity Automation Corp and protected by copyright, trademark, and other intellectual property laws.
        </p>

        <h3>7.2 Limited License</h3>
        <p>
          We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your 
          internal business purposes, subject to these Terms.
        </p>

        <h3>7.3 Restrictions</h3>
        <p>You may not:</p>
        <ul>
          <li>Copy, modify, or create derivative works of the Service</li>
          <li>Distribute, sell, or license the Service to third parties</li>
          <li>Use our trademarks or branding without written permission</li>
          <li>Remove or alter any proprietary notices</li>
        </ul>

        <h3>7.4 Feedback</h3>
        <p>
          If you provide feedback, suggestions, or ideas about the Service, you grant us a perpetual, irrevocable, 
          royalty-free license to use and incorporate such feedback without any obligation to you.
        </p>
      </div>

      <div class="section">
        <h2>8. Third-Party Services and Integrations</h2>
        <p>
          The Service may integrate with third-party services (e.g., email providers, social media platforms, payment processors). 
          Your use of these third-party services is subject to their respective terms and privacy policies.
        </p>
        <ul>
          <li>We are not responsible for third-party services or their content</li>
          <li>We do not endorse or guarantee third-party services</li>
          <li>You use third-party services at your own risk</li>
          <li>We may discontinue third-party integrations at any time</li>
        </ul>
      </div>

      <div class="section">
        <h2>9. Service Availability and Modifications</h2>
        
        <h3>9.1 Service Availability</h3>
        <p>
          We strive to provide reliable service, but we do not guarantee:
        </p>
        <ul>
          <li>Uninterrupted or error-free access to the Service</li>
          <li>That the Service will meet your specific requirements</li>
          <li>That defects will be corrected immediately</li>
          <li>Specific uptime percentages (unless specified in a service level agreement)</li>
        </ul>

        <h3>9.2 Maintenance and Updates</h3>
        <p>
          We may perform scheduled maintenance, updates, and upgrades. We will provide advance notice when possible, but 
          emergency maintenance may be performed without notice.
        </p>

        <h3>9.3 Service Modifications</h3>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. 
          We will not be liable for any modification, suspension, or discontinuation of the Service.
        </p>
      </div>

      <div class="section">
        <h2>10. Disclaimers and Warranties</h2>
        
        <div class="warning-box">
          <strong>IMPORTANT:</strong> THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
          EITHER EXPRESS OR IMPLIED.
        </div>

        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING:
        </p>
        <ul>
          <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
          <li>Warranties regarding accuracy, reliability, or completeness of the Service</li>
          <li>Warranties that the Service will be secure, error-free, or virus-free</li>
          <li>Warranties regarding availability or uptime</li>
        </ul>

        <p>
          You use the Service at your own risk. We do not warrant that the Service will meet your requirements or achieve 
          specific results.
        </p>
      </div>

      <div class="section">
        <h2>11. Limitation of Liability</h2>
        
        <div class="warning-box">
          <strong>IMPORTANT LIABILITY LIMITATION:</strong> PLEASE READ THIS SECTION CAREFULLY AS IT LIMITS OUR LIABILITY.
        </div>

        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, VELOCITY AUTOMATION CORP AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS 
          SHALL NOT BE LIABLE FOR:
        </p>
        <ul>
          <li>Indirect, incidental, consequential, special, or punitive damages</li>
          <li>Loss of profits, revenue, data, or business opportunities</li>
          <li>Loss of goodwill or reputation</li>
          <li>Service interruptions or security breaches</li>
          <li>Errors or inaccuracies in the Service</li>
          <li>Third-party conduct or content</li>
        </ul>

        <p>
          OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE 
          AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
        </p>

        <p>
          Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations 
          may not apply to you.
        </p>
      </div>

      <div class="section">
        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Velocity Automation Corp and its officers, directors, employees, 
          and agents from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable 
          attorneys' fees) arising out of or relating to:
        </p>
        <ul>
          <li>Your use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable laws or regulations</li>
          <li>Your Customer Data or content</li>
          <li>Your infringement of third-party rights</li>
        </ul>
      </div>

      <div class="section">
        <h2>13. Termination</h2>
        
        <h3>13.1 Termination by You</h3>
        <p>
          You may terminate your account at any time by:
        </p>
        <ul>
          <li>Canceling your subscription through your account settings</li>
          <li>Contacting our support team at support@risivo.com</li>
        </ul>

        <h3>13.2 Termination by Us</h3>
        <p>
          We may suspend or terminate your account immediately if:
        </p>
        <ul>
          <li>You violate these Terms or our Acceptable Use Policy</li>
          <li>Your payment fails or is disputed</li>
          <li>We are required to do so by law</li>
          <li>You engage in fraudulent or illegal activity</li>
          <li>Your use of the Service poses a security risk</li>
        </ul>

        <h3>13.3 Effects of Termination</h3>
        <p>
          Upon termination:
        </p>
        <ul>
          <li>Your access to the Service will be immediately revoked</li>
          <li>You must cease all use of the Service</li>
          <li>We will delete your Customer Data according to our retention policy</li>
          <li>You remain liable for any outstanding fees</li>
          <li>Provisions that should survive termination will remain in effect</li>
        </ul>
      </div>

      <div class="section">
        <h2>14. Dispute Resolution and Arbitration</h2>
        
        <h3>14.1 Informal Resolution</h3>
        <p>
          Before initiating formal proceedings, you agree to contact us at legal@risivo.com to attempt to resolve any 
          dispute informally.
        </p>

        <h3>14.2 Binding Arbitration</h3>
        <p>
          If informal resolution fails, you agree that disputes will be resolved through binding arbitration rather than 
          in court, except that:
        </p>
        <ul>
          <li>Either party may seek injunctive relief in court</li>
          <li>Small claims court disputes are permitted</li>
        </ul>

        <h3>14.3 Class Action Waiver</h3>
        <div class="warning-box">
          <strong>CLASS ACTION WAIVER:</strong> You agree to resolve disputes on an individual basis only. You waive the 
          right to participate in class actions, class arbitrations, or representative actions.
        </div>
      </div>

      <div class="section">
        <h2>15. Governing Law and Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of [Your State/Country], without regard to conflict of law principles. 
          Any disputes not subject to arbitration shall be brought exclusively in the courts located in [Your Jurisdiction].
        </p>
      </div>

      <div class="section">
        <h2>16. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. We will notify you of material changes by:
        </p>
        <ul>
          <li>Posting the updated Terms on our website</li>
          <li>Sending you an email notification</li>
          <li>Displaying a notice in the Service</li>
        </ul>
        <p>
          Your continued use of the Service after the effective date of the updated Terms constitutes your acceptance of 
          the changes. If you do not agree to the updated Terms, you must stop using the Service and cancel your account.
        </p>
      </div>

      <div class="section">
        <h2>17. General Provisions</h2>
        
        <h3>17.1 Entire Agreement</h3>
        <p>
          These Terms, together with our Privacy Policy and any other agreements referenced herein, constitute the entire 
          agreement between you and Velocity Automation Corp regarding the Service.
        </p>

        <h3>17.2 Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in 
          full force and effect.
        </p>

        <h3>17.3 Waiver</h3>
        <p>
          Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other 
          provision.
        </p>

        <h3>17.4 Assignment</h3>
        <p>
          You may not assign or transfer these Terms or your account without our written consent. We may assign these Terms 
          to any affiliate or successor without restriction.
        </p>

        <h3>17.5 Force Majeure</h3>
        <p>
          We shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable control, 
          including natural disasters, war, terrorism, pandemics, labor disputes, or government actions.
        </p>

        <h3>17.6 Export Controls</h3>
        <p>
          You agree to comply with all applicable export and import control laws and regulations.
        </p>
      </div>

      <div class="section">
        <h2>18. Contact Information</h2>
        <div class="contact-info">
          <h3>Questions About These Terms?</h3>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
          <p><strong>Email:</strong> legal@risivo.com</p>
          <p><strong>Support:</strong> support@risivo.com</p>
          <p><strong>Mailing Address:</strong><br>
            Velocity Automation Corp.<br>
            Attn: Legal Department<br>
            [Your Company Address]<br>
            [City, State, ZIP Code]
          </p>
          <p><strong>Website:</strong> <a href="https://risivo.com" style="color: #667eea;">https://risivo.com</a></p>
        </div>
      </div>

      <div class="section">
        <h2>19. Acknowledgment</h2>
        <p>
          BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE 
          BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE SERVICE.
        </p>
      </div>

      <a href="/" class="back-link">← Back to Home</a>
    </div>
  </body>
  </html>
`;
