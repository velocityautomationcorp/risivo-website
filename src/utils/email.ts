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

const emailStyles = `
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
    .container { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    h2 { color: #1a1a2e; font-size: 24px; margin-bottom: 16px; }
    p { color: #4a4a4a; font-size: 15px; margin-bottom: 16px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .btn:hover { opacity: 0.9; }
    .credentials { background: #f8f9fa; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e9ecef; }
    .credentials p { margin: 8px 0; }
    .credentials strong { color: #667eea; }
    .info-box { background: #f0f4ff; border: 1px solid #c7d2fe; padding: 16px; border-radius: 10px; margin: 20px 0; }
    .info-box h4 { color: #4f46e5; margin: 0 0 8px 0; font-size: 14px; }
    .info-box p { color: #666; font-size: 13px; margin: 0; }
    .warning { color: #dc2626; font-weight: 500; }
    .divider { border: none; border-top: 1px solid #eee; margin: 30px 0; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; }
    .footer a { color: #667eea; text-decoration: none; }
    .link-text { font-size: 12px; color: #999; word-break: break-all; margin-top: 10px; }
    table.details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    table.details td { padding: 10px; border-bottom: 1px solid #eee; }
    table.details td:first-child { font-weight: 600; color: #666; width: 40%; }
  </style>
`;

const emailHeader = `
  <div class="header">
    <div class="logo">Risivo</div>
  </div>
`;

const emailFooter = `
  <hr class="divider">
  <div class="footer">
    <p>This email was sent by Risivo.<br>
    &copy; ${new Date().getFullYear()} Risivo. All rights reserved.</p>
    <p><a href="https://risivo.com/privacy-policy">Privacy Policy</a> | <a href="https://risivo.com/terms-of-service">Terms of Service</a></p>
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

  // ===========================================
  // PASSWORD RESET EMAIL
  // ===========================================
  async sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void> {
    const { email, firstName, resetToken } = params;
    const resetUrl = `https://risivo.com/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head>
      <body>
        <div class="container">
          ${emailHeader}
          <h2>Password Reset Request</h2>
          <p>Hi ${firstName || 'there'},</p>
          <p>We received a request to reset your password for your Risivo account. Click the button below to reset it:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
          <p class="link-text">If the button doesn't work, copy and paste this link: ${resetUrl}</p>
          ${emailFooter}
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Reset Your Risivo Password', html);
  }

  // ===========================================
  // WAITLIST: VERIFICATION EMAIL
  // ===========================================
  async sendWaitlistVerificationEmail(params: WaitlistVerificationParams): Promise<void> {
    const { email, firstName, verificationToken } = params;
    const verifyUrl = `https://risivo.com/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head>
      <body>
        <div class="container">
          ${emailHeader}
          <h2>Verify Your Email Address</h2>
          <p>Hi ${firstName || 'there'},</p>
          <p>Thank you for joining the Risivo waitlist! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="btn">Verify Email</a>
          </div>
          <div class="info-box">
            <h4>What happens next?</h4>
            <p>Once verified, you'll receive your login credentials and can access your waitlist dashboard to track your position and get exclusive updates.</p>
          </div>
          <p class="link-text">If the button doesn't work, copy and paste this link: ${verifyUrl}</p>
          ${emailFooter}
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Verify Your Risivo Account', html);
  }

  // ===========================================
  // WAITLIST: CONFIRMATION WITH CREDENTIALS
  // ===========================================
  async sendWaitlistConfirmationEmail(params: WaitlistConfirmationParams): Promise<void> {
    const { email, firstName, lastName, tempPassword, loginUrl } = params;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head>
      <body>
        <div class="container">
          ${emailHeader}
          <h2>Welcome to Risivo, ${firstName}! 🎉</h2>
          <p>Your email has been verified and your account is now active! Here are your login credentials:</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p class="warning">⚠️ Please change your password after your first login for security.</p>
          <div style="text-align: center;">
            <a href="${loginUrl}" class="btn">Login to Dashboard</a>
          </div>
          <div class="info-box">
            <h4>What can you do now?</h4>
            <p>Access your waitlist dashboard to see your position, exclusive updates, and early access features as we prepare for launch.</p>
          </div>
          ${emailFooter}
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Welcome to Risivo - Your Account is Ready!', html);
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
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head>
      <body>
        <div class="container">
          ${emailHeader}
          <h2>Welcome to the Risivo Waitlist! 🎉</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for joining the Risivo waitlist! Your account has been created and is ready to use.</p>
          ${waitlistNumber ? `<p style="font-size: 18px; text-align: center; color: #667eea; font-weight: 600;">Your Waitlist Position: #${waitlistNumber}</p>` : ''}
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p class="warning">⚠️ Please change your password after your first login for security.</p>
          <div style="text-align: center;">
            <a href="${loginUrl}" class="btn">Login to Dashboard</a>
          </div>
          <div class="info-box">
            <h4>What's Next?</h4>
            <p>• Track your waitlist position<br>• Get exclusive early access updates<br>• Be among the first to experience Risivo</p>
          </div>
          ${emailFooter}
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Welcome to Risivo - You\'re on the List!', html);
  }

  // ===========================================
  // INVESTOR: NDA SIGNING REQUEST
  // ===========================================
  async sendInvestorNDAEmail(params: InvestorNDAParams): Promise<void> {
    const { email, firstName, lastName, ndaToken } = params;
    const ndaUrl = `https://risivo.com/investor/sign-nda?token=${ndaToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head>
      <body>
        <div class="container">
          ${emailHeader}
          <h2>Welcome, Investor! 📊</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for your interest in investing with Risivo. To access our confidential investor materials, including pitch decks, financial forecasts, and business plans, we require you to review and sign our Non-Disclosure Agreement (NDA).</p>
          <div style="text-align: center;">
            <a href="${ndaUrl}" class="btn">Review & Sign NDA</a>
          </div>
          <div class="info-box">
            <h4>What You'll Get Access To:</h4>
            <p>• Comprehensive Pitch Deck<br>• Financial Forecasts & Projections<br>• Detailed Business Plan<br>• Executive Summary<br>• Exclusive Investor Updates</p>
          </div>
          <p style="font-size: 14px; color: #666;">The NDA protects confidential business information and is standard practice for investor relations. Once signed, you'll receive immediate access to all investor materials.</p>
          <p class="link-text">If the button doesn't work, copy and paste this link: ${ndaUrl}</p>
          ${emailFooter}
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Risivo Investor Portal - NDA Required', html);
  }

  // ===========================================
  // INVESTOR: APPROVED & CREDENTIALS
  // ===========================================
  async sendInvestorApprovedEmail(params: InvestorApprovedParams): Promise<void> {
    const { email, firstName, lastName, tempPassword } = params;
    const loginUrl = 'https://risivo.com/updates/investor/login';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head>
      <body>
        <div class="container">
          ${emailHeader}
          <h2>NDA Signed - Access Granted! 🎉</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for signing the NDA. You now have full access to our investor portal with all confidential materials.</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p class="warning">⚠️ Please change your password after your first login for security.</p>
          <div style="text-align: center;">
            <a href="${loginUrl}" class="btn">Access Investor Portal</a>
          </div>
          <div class="info-box">
            <h4>Available Materials:</h4>
            <p>• 📊 Pitch Deck<br>• 📈 Financial Forecasts<br>• 📋 Business Plan<br>• 📄 Executive Summary<br>• 🔔 Real-time Investor Updates</p>
          </div>
          <p style="font-size: 14px; color: #666;">If you have any questions, please don't hesitate to reach out to our investor relations team.</p>
          ${emailFooter}
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Risivo Investor Portal - Access Granted', html);
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

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${emailStyles}</head>
      <body>
        <div class="container">
          ${emailHeader}
          <h2>${title}</h2>
          <p>A new activity has been recorded on the Risivo platform:</p>
          ${details}
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://risivo.com/updates/admin/dashboard" class="btn">View in Admin Dashboard</a>
          </div>
          ${emailFooter}
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(this.adminEmail, subject, html);
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
