// Email utility for SendGrid
// Comprehensive email service for Risivo platform

interface EmailConfig {
  SENDGRID_API_KEY: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
  ADMIN_EMAIL?: string;
}

interface PasswordResetEmailParams {
  email: string;
  firstName: string;
  resetToken: string;
  userType?: 'investor' | 'waitlist';
}

interface WaitlistWelcomeParams {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  tempPassword: string;
  waitlistNumber?: number;
}

interface WaitlistVerificationParams {
  email: string;
  firstName: string;
  verificationToken: string;
}

interface WaitlistConfirmationParams {
  email: string;
  firstName: string;
  lastName: string;
  tempPassword: string;
  loginUrl: string;
}

interface InvestorNDAParams {
  email: string;
  firstName: string;
  lastName: string;
  ndaToken: string;
}

interface InvestorApprovedParams {
  email: string;
  firstName: string;
  lastName: string;
  tempPassword: string;
}

interface InvestorPendingReviewParams {
  email: string;
  firstName: string;
  lastName: string;
}

interface InvestorRejectedParams {
  email: string;
  firstName: string;
  lastName: string;
  reason?: string;
}

interface NewUpdateNotificationParams {
  email: string;
  firstName: string;
  updateTitle: string;
  updateExcerpt?: string;
  featuredImageUrl?: string;
  updateUrl: string;
  updateType: 'investor' | 'waitlist';
}

interface AdminNotificationParams {
  type: 'waitlist_signup' | 'investor_signup' | 'nda_signed' | 'investor_approved';
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    businessName?: string;
    companyName?: string;
  };
}

// Get current year dynamically
const getCurrentYear = () => new Date().getFullYear();

// Logo URLs - using the actual hosted images
const LOGO_WHITE = 'https://risivo.com/images/risivo-logo-white.png';
const LOGO_COLOR = 'https://risivo.com/images/risivo-logo.png';

// Email styles matching the exact design provided
const emailStyles = `
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background: #f5f5f5; 
    }
    .email-wrapper { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    .container { 
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }
    /* Header - Purple gradient with WHITE logo */
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header img { 
      height: 45px; 
      max-width: 180px;
    }
    .header-subtitle {
      color: #FFD700;
      font-size: 14px;
      margin: 12px 0 0 0;
      font-weight: 500;
    }
    /* Content area - White background */
    .content { 
      padding: 40px 30px; 
      background: white;
    }
    h2 { 
      color: #1a1a2e; 
      font-size: 22px; 
      margin: 0 0 20px 0;
      font-weight: 600;
    }
    p { 
      color: #4a4a4a; 
      font-size: 15px; 
      margin: 0 0 16px 0; 
      line-height: 1.7; 
    }
    /* Button - Purple gradient */
    .btn { 
      display: inline-block; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white !important; 
      padding: 14px 32px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      font-size: 15px; 
    }
    .btn-wrapper {
      text-align: center;
      margin: 25px 0;
    }
    /* Credentials box - Light grey */
    .credentials { 
      background: #f8f9fa; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 20px 0; 
      border: 1px solid #e9ecef; 
    }
    .credentials p { 
      margin: 8px 0; 
      font-size: 14px;
    }
    .credentials strong { 
      color: #667eea; 
    }
    /* Info box - Light blue/purple tint */
    .info-box { 
      background: #f0f4ff; 
      border: 1px solid #c7d2fe; 
      padding: 16px; 
      border-radius: 8px; 
      margin: 20px 0; 
    }
    .info-box h4 { 
      color: #4f46e5; 
      margin: 0 0 8px 0; 
      font-size: 14px;
      font-weight: 600;
    }
    .info-box p { 
      color: #555; 
      font-size: 13px; 
      margin: 0;
      line-height: 1.6;
    }
    .warning { 
      color: #dc2626; 
      font-weight: 500; 
      font-size: 14px; 
    }
    /* Footer - LIGHT GREY background (NOT yellow) */
    .footer { 
      background: #f5f5f5; 
      padding: 25px 20px; 
      text-align: center;
      border-top: 1px solid #e5e5e5;
    }
    .footer p { 
      color: #666; 
      font-size: 12px; 
      margin: 4px 0; 
    }
    .footer .copyright { 
      font-weight: 600;
      color: #444;
    }
    .footer .disclaimer { 
      font-size: 11px; 
      color: #888;
      margin-top: 10px;
    }
    .footer-links { 
      margin-top: 15px; 
    }
    .footer-links a { 
      color: #667eea; 
      text-decoration: none; 
      font-size: 12px; 
      margin: 0 10px; 
    }
    .link-text { 
      font-size: 12px; 
      color: #888; 
      word-break: break-all; 
      margin-top: 15px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 4px;
    }
    .link-text a {
      color: #667eea;
      word-break: break-all;
    }
    /* Details table for admin emails */
    table.details { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0; 
    }
    table.details td { 
      padding: 12px 10px; 
      border-bottom: 1px solid #eee; 
      font-size: 14px;
    }
    table.details td:first-child { 
      font-weight: 600; 
      color: #666; 
      width: 40%; 
    }
  </style>
`;

// =============================================================================
// RISIVO EMAIL TEMPLATE - DO NOT MODIFY WITHOUT APPROVAL
// =============================================================================
// Header: Purple gradient (#667eea -> #764ba2) with WHITE logo
// Footer: Light grey background (#f5f5f5) with copyright
// This is the APPROVED design - keep consistent across ALL emails
// =============================================================================

// Email header with WHITE logo on purple gradient
const getEmailHeader = (subtitle?: string) => `
  <div class="header">
    <img src="${LOGO_WHITE}" alt="Risivo" />
    ${subtitle ? `<p class="header-subtitle">${subtitle}</p>` : ''}
  </div>
`;

// Email footer with LIGHT GREY background and correct copyright
const getEmailFooter = () => `
  <div class="footer">
    <p class="copyright">© ${getCurrentYear()} Risivo. All rights reserved.</p>
    <p class="disclaimer">This email contains confidential information intended only for the addressee.</p>
    <div class="footer-links">
      <a href="https://risivo.com/privacy-policy">Privacy Policy</a> | 
      <a href="https://risivo.com/terms-of-service">Terms of Service</a>
    </div>
  </div>
`;

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;
  private adminEmail: string;

  constructor(config: EmailConfig) {
    this.apiKey = config.SENDGRID_API_KEY;
    this.fromEmail = config.FROM_EMAIL || 'hello@risivo.com';
    this.fromName = config.FROM_NAME || 'Risivo Team';
    this.adminEmail = config.ADMIN_EMAIL || 'admin@risivo.com';
  }

  private async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    const emailData = {
      personalizations: [{ to: [{ email: to }], subject }],
      from: { email: this.fromEmail, name: this.fromName },
      content: [{ type: 'text/html', value: htmlContent }]
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid error: ${response.status} - ${errorText}`);
    }
  }

  // Helper to build consistent email HTML
  private buildEmailHtml(content: string, headerSubtitle?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${emailStyles}
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            ${getEmailHeader(headerSubtitle)}
            <div class="content">
              ${content}
            </div>
            ${getEmailFooter()}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // ===========================================
  // PASSWORD RESET EMAIL
  // ===========================================
  async sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void> {
    const { email, firstName, resetToken, userType } = params;
    const typeParam = userType === 'investor' ? '&type=investor' : '';
    const resetUrl = `https://risivo.com/reset-password?token=${resetToken}${typeParam}`;
    
    const content = `
      <h2>Password Reset Request</h2>
      <p>Hi ${firstName || 'there'},</p>
      <p>We received a request to reset your password for your Risivo account. Click the button below to reset it:</p>
      <div class="btn-wrapper">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
      <div class="link-text">If the button doesn't work, copy and paste this link:<br><a href="${resetUrl}">${resetUrl}</a></div>
    `;

    await this.sendEmail(email, 'Reset Your Risivo Password', this.buildEmailHtml(content, 'Password Reset'));
  }

  // ===========================================
  // WAITLIST: VERIFICATION EMAIL
  // ===========================================
  async sendWaitlistVerificationEmail(params: WaitlistVerificationParams): Promise<void> {
    const { email, firstName, verificationToken } = params;
    const verifyUrl = `https://risivo.com/api/waitlist/verify?token=${verificationToken}`;
    
    const content = `
      <h2>Verify Your Email Address</h2>
      <p>Hi ${firstName || 'there'},</p>
      <p>Thank you for joining the Risivo waitlist! Please verify your email address by clicking the button below:</p>
      <div class="btn-wrapper">
        <a href="${verifyUrl}" class="btn">Verify Email</a>
      </div>
      <div class="info-box">
        <h4>What happens next?</h4>
        <p>Once verified, you'll receive your login credentials and can access your waitlist dashboard to track your position and get exclusive updates.</p>
      </div>
      <div class="link-text">If the button doesn't work, copy and paste this link:<br><a href="${verifyUrl}">${verifyUrl}</a></div>
    `;

    await this.sendEmail(email, 'Verify Your Risivo Account', this.buildEmailHtml(content, 'Email Verification'));
  }

  // ===========================================
  // WAITLIST: CONFIRMATION WITH CREDENTIALS
  // ===========================================
  async sendWaitlistConfirmationEmail(params: WaitlistConfirmationParams): Promise<void> {
    const { email, firstName, lastName, tempPassword, loginUrl } = params;
    
    const content = `
      <h2>Welcome to Risivo, ${firstName}! 🎉</h2>
      <p>Your email has been verified and your account is now active! Here are your login credentials:</p>
      <div class="credentials">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p class="warning">⚠️ Please change your password after your first login for security.</p>
      <div class="btn-wrapper">
        <a href="${loginUrl}" class="btn">Login to Dashboard</a>
      </div>
      <div class="info-box">
        <h4>What can you do now?</h4>
        <p>Access your waitlist dashboard to see your position, exclusive updates, and early access features as we prepare for launch.</p>
      </div>
    `;

    await this.sendEmail(email, 'Welcome to Risivo - Your Account is Ready!', this.buildEmailHtml(content, 'Account Activated'));
  }

  // ===========================================
  // WAITLIST: WELCOME EMAIL (Legacy support)
  // ===========================================
  async sendWelcomeEmail(params: WaitlistWelcomeParams | { email: string; firstName: string; password: string }): Promise<void> {
    // Handle legacy format
    if ('password' in params) {
      const { email, firstName, password } = params;
      await this.sendWaitlistConfirmationEmail({
        email,
        firstName,
        lastName: '',
        tempPassword: password,
        loginUrl: 'https://risivo.com/waitlist/login'
      });
      return;
    }

    const { email, firstName, lastName, businessName, tempPassword, waitlistNumber } = params;
    const loginUrl = 'https://risivo.com/waitlist/login';
    
    const content = `
      <h2>Welcome to the Risivo Waitlist! 🎉</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for joining the Risivo waitlist! Your account has been created and is ready to use.</p>
      ${waitlistNumber ? `<p style="font-size: 18px; text-align: center; color: #667eea; font-weight: 600;">Your Waitlist Position: #${waitlistNumber}</p>` : ''}
      <div class="credentials">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p class="warning">⚠️ Please change your password after your first login for security.</p>
      <div class="btn-wrapper">
        <a href="${loginUrl}" class="btn">Login to Dashboard</a>
      </div>
      <div class="info-box">
        <h4>What's Next?</h4>
        <p>• Track your waitlist position<br>• Get exclusive early access updates<br>• Be among the first to experience Risivo</p>
      </div>
    `;

    await this.sendEmail(email, 'Welcome to Risivo - You\'re on the List!', this.buildEmailHtml(content, 'Welcome to the Waitlist'));
  }

  // ===========================================
  // INVESTOR: NDA SIGNING REQUEST
  // ===========================================
  async sendInvestorNDAEmail(params: InvestorNDAParams): Promise<void> {
    const { email, firstName, lastName, ndaToken } = params;
    const ndaUrl = `https://risivo.com/investor/sign-nda?token=${ndaToken}`;
    
    const content = `
      <h2>Welcome, Investor! 📊</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for your interest in investing with Risivo. To access our confidential investor materials, including pitch decks, financial forecasts, and business plans, we require you to review and sign our Non-Disclosure Agreement (NDA).</p>
      <div class="btn-wrapper">
        <a href="${ndaUrl}" class="btn">Review & Sign NDA</a>
      </div>
      <div class="info-box">
        <h4>What You'll Get Access To:</h4>
        <p>• Comprehensive Pitch Deck<br>• Financial Forecasts & Projections<br>• Detailed Business Plan<br>• Executive Summary<br>• Exclusive Investor Updates</p>
      </div>
      <p style="font-size: 14px; color: #666;">The NDA protects confidential business information and is standard practice for investor relations. Once signed, you'll receive immediate access to all investor materials.</p>
      <div class="link-text">If the button doesn't work, copy and paste this link:<br><a href="${ndaUrl}">${ndaUrl}</a></div>
    `;

    await this.sendEmail(email, 'Risivo Investor Portal - NDA Required', this.buildEmailHtml(content, 'Investor Portal'));
  }

  // ===========================================
  // INVESTOR: PENDING REVIEW (after NDA signed)
  // ===========================================
  async sendInvestorPendingReviewEmail(params: InvestorPendingReviewParams): Promise<void> {
    const { email, firstName, lastName } = params;
    
    const content = `
      <h2>NDA Signed Successfully! 📋</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for signing the Non-Disclosure Agreement. We have received your request to access our investor materials.</p>
      <div class="info-box">
        <h4>What Happens Next?</h4>
        <p>Our team will review your application and, once approved, you'll receive an email with your login credentials to access the Investor Portal.</p>
      </div>
      <p>This review process typically takes <strong>1 business day</strong>. We appreciate your patience.</p>
      <p style="font-size: 14px; color: #666;">If you have any questions in the meantime, please feel free to contact us.</p>
    `;

    await this.sendEmail(email, 'Risivo - NDA Received, Application Under Review', this.buildEmailHtml(content, 'Application Received'));
  }

  // ===========================================
  // INVESTOR: REJECTED
  // ===========================================
  async sendInvestorRejectedEmail(params: InvestorRejectedParams): Promise<void> {
    const { email, firstName, lastName, reason } = params;
    
    const content = `
      <h2>Investor Application Update</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for your interest in Risivo. After careful review, we regret to inform you that we are unable to approve your investor application at this time.</p>
      ${reason ? `<div class="info-box"><h4>Reason:</h4><p>${reason}</p></div>` : ''}
      <p>If you believe this decision was made in error or would like to provide additional information, please don't hesitate to contact us.</p>
      <p style="font-size: 14px; color: #666;">We appreciate your understanding and wish you the best in your future endeavors.</p>
    `;

    await this.sendEmail(email, 'Risivo - Investor Application Update', this.buildEmailHtml(content, 'Application Update'));
  }

  // ===========================================
  // INVESTOR: APPROVED & CREDENTIALS
  // ===========================================
  async sendInvestorApprovedEmail(params: InvestorApprovedParams): Promise<void> {
    const { email, firstName, lastName, tempPassword } = params;
    const loginUrl = 'https://risivo.com/updates/investor/login';
    
    const content = `
      <h2>Application Approved - Access Granted! 🎉</h2>
      <p>Hi ${firstName},</p>
      <p>Great news! Your investor application has been approved. You now have full access to our investor portal with all confidential materials.</p>
      <div class="credentials">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p class="warning">⚠️ Please change your password after your first login for security.</p>
      <div class="btn-wrapper">
        <a href="${loginUrl}" class="btn">Access Investor Portal</a>
      </div>
      <div class="info-box">
        <h4>Available Materials:</h4>
        <p>• 📊 Pitch Deck<br>• 📈 Financial Forecasts<br>• 📋 Business Plan<br>• 📄 Executive Summary<br>• 🔔 Real-time Investor Updates</p>
      </div>
      <p style="font-size: 14px; color: #666;">If you have any questions, please don't hesitate to reach out to our investor relations team.</p>
    `;

    await this.sendEmail(email, 'Risivo Investor Portal - Access Granted', this.buildEmailHtml(content, 'Access Granted'));
  }

  // ===========================================
  // NEW UPDATE NOTIFICATION
  // ===========================================
  async sendNewUpdateNotification(params: NewUpdateNotificationParams): Promise<void> {
    const { email, firstName, updateTitle, updateExcerpt, featuredImageUrl, updateUrl, updateType } = params;
    
    const isInvestor = updateType === 'investor';
    const portalName = isInvestor ? 'Investor Portal' : 'Waitlist Dashboard';
    const subtitle = isInvestor ? 'New Investor Update' : 'New Project Update';
    
    const content = `
      <h2>📢 New Update Available!</h2>
      <p>Hi ${firstName || 'there'},</p>
      <p>We've just published a new update that we think you'll find interesting:</p>
      
      ${featuredImageUrl ? `
      <div style="margin: 24px 0; border-radius: 12px; overflow: hidden;">
        <img src="${featuredImageUrl}" alt="${updateTitle}" style="width: 100%; max-height: 300px; object-fit: cover; display: block;">
      </div>
      ` : ''}
      
      <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1a1a2e; font-size: 20px;">${updateTitle}</h3>
        ${updateExcerpt ? `<p style="margin: 0; color: #4a4a4a; font-size: 15px; line-height: 1.6;">${updateExcerpt}</p>` : ''}
      </div>
      
      <div class="btn-wrapper">
        <a href="${updateUrl}" class="btn">Read Full Update →</a>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 24px;">
        Log in to your ${portalName} to view this update and all available content.
      </p>
    `;

    const subject = isInvestor 
      ? `📢 New Investor Update: ${updateTitle}`
      : `📢 New Project Update: ${updateTitle}`;

    await this.sendEmail(email, subject, this.buildEmailHtml(content, subtitle));
  }

  // Bulk send new update notifications
  async sendBulkUpdateNotifications(
    recipients: Array<{ email: string; firstName: string }>,
    updateDetails: {
      title: string;
      excerpt?: string;
      featuredImageUrl?: string;
      slug: string;
      updateType: 'investor' | 'waitlist';
    }
  ): Promise<{ sent: number; failed: number }> {
    const { title, excerpt, featuredImageUrl, slug, updateType } = updateDetails;
    
    const baseUrl = updateType === 'investor' 
      ? 'https://risivo.com/updates/investor/dashboard'
      : 'https://risivo.com/waitlist/dashboard';
    
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        await this.sendNewUpdateNotification({
          email: recipient.email,
          firstName: recipient.firstName,
          updateTitle: title,
          updateExcerpt: excerpt,
          featuredImageUrl: featuredImageUrl,
          updateUrl: baseUrl,
          updateType
        });
        sent++;
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`[EMAIL] Failed to send to ${recipient.email}:`, error);
        failed++;
      }
    }

    console.log(`[EMAIL] Bulk notifications sent: ${sent} success, ${failed} failed`);
    return { sent, failed };
  }

  // ===========================================
  // ADMIN: NOTIFICATION EMAILS
  // ===========================================
  async sendAdminNotification(params: AdminNotificationParams): Promise<void> {
    const { type, userData } = params;
    let subject = '';
    let title = '';
    let details = '';

    switch (type) {
      case 'waitlist_signup':
        subject = '🆕 New Waitlist Signup';
        title = 'New Waitlist Registration';
        details = `
          <table class="details">
            <tr><td>Name</td><td>${userData.firstName} ${userData.lastName}</td></tr>
            <tr><td>Email</td><td>${userData.email}</td></tr>
            <tr><td>Phone</td><td>${userData.phone || 'Not provided'}</td></tr>
            <tr><td>Business/Agency</td><td>${userData.businessName || 'Not provided'}</td></tr>
            <tr><td>Registered At</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
        `;
        break;

      case 'investor_signup':
        subject = '💼 New Investor Registration (Pre-NDA)';
        title = 'New Investor Signup - NDA Pending';
        details = `
          <table class="details">
            <tr><td>Name</td><td>${userData.firstName} ${userData.lastName}</td></tr>
            <tr><td>Email</td><td>${userData.email}</td></tr>
            <tr><td>Phone</td><td>${userData.phone || 'Not provided'}</td></tr>
            <tr><td>Company</td><td>${userData.companyName || userData.businessName || 'Not provided'}</td></tr>
            <tr><td>Status</td><td style="color: #f59e0b; font-weight: 600;">NDA Pending</td></tr>
            <tr><td>Registered At</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
        `;
        break;

      case 'nda_signed':
        subject = '✅ Investor NDA Signed';
        title = 'Investor NDA Completed';
        details = `
          <table class="details">
            <tr><td>Name</td><td>${userData.firstName} ${userData.lastName}</td></tr>
            <tr><td>Email</td><td>${userData.email}</td></tr>
            <tr><td>Company</td><td>${userData.companyName || userData.businessName || 'Not provided'}</td></tr>
            <tr><td>Status</td><td style="color: #10b981; font-weight: 600;">NDA Signed - Active</td></tr>
            <tr><td>Signed At</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
        `;
        break;

      case 'investor_approved':
        subject = '🎉 Investor Approved';
        title = 'Investor Account Activated';
        details = `
          <table class="details">
            <tr><td>Name</td><td>${userData.firstName} ${userData.lastName}</td></tr>
            <tr><td>Email</td><td>${userData.email}</td></tr>
            <tr><td>Company</td><td>${userData.companyName || userData.businessName || 'Not provided'}</td></tr>
            <tr><td>Status</td><td style="color: #10b981; font-weight: 600;">Active</td></tr>
            <tr><td>Approved At</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
        `;
        break;
    }

    const content = `
      <h2>${title}</h2>
      <p>A new activity has been recorded on the Risivo platform:</p>
      ${details}
      <div class="btn-wrapper">
        <a href="https://risivo.com/updates/admin/dashboard" class="btn">View in Admin Dashboard</a>
      </div>
    `;

    await this.sendEmail(this.adminEmail, subject, this.buildEmailHtml(content, 'Admin Notification'));
  }

  // ===========================================
  // ERROR REPORTING - System Bug/Error Alerts
  // ===========================================
  async sendErrorReport(params: {
    errorType: string;
    errorMessage: string;
    errorStack?: string;
    userEmail?: string;
    userName?: string;
    userType?: string; // 'admin', 'investor', 'waitlist', 'anonymous'
    pageUrl?: string;
    userAgent?: string;
    ipAddress?: string;
    additionalInfo?: string;
  }): Promise<void> {
    const { 
      errorType, 
      errorMessage, 
      errorStack, 
      userEmail, 
      userName,
      userType,
      pageUrl, 
      userAgent, 
      ipAddress,
      additionalInfo 
    } = params;

    const content = `
      <h2>🚨 System Error Report</h2>
      <p style="color: #dc2626; font-weight: 600; font-size: 16px;">An error has been detected in the Risivo platform that requires immediate attention.</p>
      
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin: 0 0 8px 0;">Error Type: ${errorType}</h4>
        <p style="font-family: monospace; background: #fff; padding: 12px; border-radius: 4px; margin: 0; white-space: pre-wrap; word-break: break-all;">${errorMessage}</p>
      </div>
      
      ${errorStack ? `
      <div style="margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0;">Stack Trace:</h4>
        <pre style="background: #1a1a2e; color: #10b981; padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 12px;">${errorStack}</pre>
      </div>
      ` : ''}
      
      <table class="details">
        <tr><td style="width: 140px;">User Email</td><td>${userEmail || 'Not logged in / Anonymous'}</td></tr>
        <tr><td>User Name</td><td>${userName || 'N/A'}</td></tr>
        <tr><td>User Type</td><td><span style="padding: 4px 8px; border-radius: 4px; background: ${
          userType === 'admin' ? '#dbeafe' : 
          userType === 'investor' ? '#dcfce7' : 
          userType === 'waitlist' ? '#fef3c7' : '#f3f4f6'
        }; font-weight: 500;">${userType || 'Anonymous'}</span></td></tr>
        <tr><td>Page URL</td><td style="word-break: break-all;">${pageUrl || 'N/A'}</td></tr>
        <tr><td>IP Address</td><td>${ipAddress || 'N/A'}</td></tr>
        <tr><td>User Agent</td><td style="font-size: 12px; word-break: break-all;">${userAgent || 'N/A'}</td></tr>
        <tr><td>Timestamp</td><td>${new Date().toLocaleString()} UTC</td></tr>
      </table>
      
      ${additionalInfo ? `
      <div style="margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0;">Additional Information:</h4>
        <p style="background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${additionalInfo}</p>
      </div>
      ` : ''}
      
      <div class="btn-wrapper">
        <a href="https://risivo.com/updates/admin/dashboard" class="btn">View Admin Dashboard</a>
      </div>
      
      <p style="font-size: 13px; color: #666; margin-top: 24px;">
        This is an automated error report from the Risivo monitoring system. 
        Please investigate and resolve this issue promptly.
      </p>
    `;

    await this.sendEmail(
      this.adminEmail, 
      `🚨 [RISIVO ERROR] ${errorType}: ${errorMessage.substring(0, 50)}...`, 
      this.buildEmailHtml(content, 'System Alert')
    );
  }
}

// Helper function to generate secure reset token
export function generateResetToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper function to generate verification token
export function generateVerificationToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper function to generate temporary password
export function generateTempPassword(length: number = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => chars[b % chars.length])
    .join('');
}
