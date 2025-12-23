/**
 * Email Service for Cloudflare Workers
 * Uses SendGrid REST API via fetch (no npm package needed)
 */

export interface EmailConfig {
  SENDGRID_API_KEY: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

export class EmailService {
  private config: EmailConfig;
  private readonly SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

  constructor(config: EmailConfig) {
    this.config = config;
  }

  /**
   * Send email via SendGrid REST API
   */
  private async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    const payload = {
      personalizations: [
        {
          to: [{ email: data.to }],
        },
      ],
      from: {
        email: this.config.FROM_EMAIL,
        name: this.config.FROM_NAME,
      },
      subject: data.subject,
      content: [
        {
          type: 'text/plain',
          value: data.text,
        },
        {
          type: 'text/html',
          value: data.html,
        },
      ],
    };

    const response = await fetch(this.SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }
  }

  /**
   * Send welcome email with temporary password
   */
  async sendWelcomeEmail(data: {
    email: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    tempPassword: string;
    waitlistNumber?: number;
  }): Promise<void> {
    const { email, firstName, lastName, businessName, tempPassword, waitlistNumber } = data;
    
    // Build prefilled signup URL
    const signupParams = new URLSearchParams({
      email: email,
      first_name: firstName,
      last_name: lastName,
      ...(businessName && { business_name: businessName })
    });
    const createAccountUrl = `https://risivo.com/updates/signup/waitlist?${signupParams.toString()}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Risivo Updates</title>
  <style>
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f7fa;
    }
    .email-container {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h1 {
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 10px;
    }
    .credentials-box {
      background: #f9fafb;
      border-left: 4px solid #6b3fea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 8px;
    }
    .credentials-box p {
      margin: 10px 0;
    }
    .credentials-box strong {
      color: #6b3fea;
    }
    .password-highlight {
      font-family: 'Courier New', monospace;
      background: #fff;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      display: inline-block;
      font-size: 1.1rem;
      color: #ed632f;
      font-weight: 600;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 0.95rem;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.9rem;
    }
    .footer a {
      color: #6b3fea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">RISIVO</div>
      <h1>Welcome to Risivo Updates! 🎉</h1>
    </div>
    
    <p>Hi ${firstName},</p>
    
    <p>Thank you for joining our early bird program! We're excited to have you as part of the Risivo community.</p>
    
    <p>Your account has been created and you now have exclusive access to our updates platform where you'll receive:</p>
    
    <ul>
      <li>✨ Product updates and announcements</li>
      <li>🎁 Early bird exclusive benefits</li>
      <li>💡 Tips and best practices</li>
      <li>🚀 Behind-the-scenes insights</li>
    </ul>
    
    <div class="credentials-box">
      <p><strong>Your Login Credentials:</strong></p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong><br>
        <span class="password-highlight">${tempPassword}</span>
      </p>
    </div>
    
    <div style="text-align: center;">
      <a href="https://risivo.com/updates/login" class="btn">
        Login to Your Dashboard
      </a>
    </div>
    
    ${waitlistNumber ? `
    <div style="text-align: center; margin-top: 15px; padding: 15px; background: #f0f9ff; border-radius: 10px;">
      <p style="margin: 0; color: #0369a1; font-size: 1.1rem;">🎉 You're <strong>#${waitlistNumber}</strong> on our waitlist!</p>
    </div>
    ` : ''}
    
    <div class="warning">
      <strong>⚠️ Important:</strong> For security reasons, please change your password after your first login. You can do this from your account settings or use the "Forgot Password" option on the login page.
    </div>
    
    <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
    
    <p>Welcome aboard! 🚀</p>
    
    <p>Best regards,<br>
    The Risivo Team</p>
    
    <div class="footer">
      <p>This email was sent to ${email} because you signed up for Risivo updates.</p>
      <p>Need help? Contact us at <a href="mailto:hello@risivo.com">hello@risivo.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Risivo Updates - Your Login Credentials',
      html: html,
      text: `Welcome to Risivo Updates, ${firstName}!\n\nYour temporary password is: ${tempPassword}\n\nLogin at: https://risivo.com/updates/login\n\nPlease change your password after first login.\n\nBest regards,\nThe Risivo Team`,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: {
    email: string;
    firstName: string;
    resetToken: string;
  }): Promise<void> {
    const { email, firstName, resetToken } = data;
    const resetUrl = `https://risivo.com/updates/reset-password?token=${resetToken}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Risivo</title>
  <style>
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f7fa;
    }
    .email-container {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h1 {
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 10px;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 0.95rem;
    }
    .info-box {
      background: #f9fafb;
      border: 1px solid #e0e0e0;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #666;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.9rem;
    }
    .footer a {
      color: #6b3fea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">RISIVO</div>
      <h1>Reset Your Password 🔐</h1>
    </div>
    
    <p>Hi ${firstName},</p>
    
    <p>We received a request to reset your password for your Risivo Updates account.</p>
    
    <p>Click the button below to reset your password:</p>
    
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn">
        Reset My Password
      </a>
    </div>
    
    <div class="info-box">
      <strong>Link expires in 1 hour</strong><br>
      For security reasons, this password reset link will expire in 60 minutes.
    </div>
    
    <div class="warning">
      <strong>⚠️ Didn't request this?</strong><br>
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    </div>
    
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6b3fea;">${resetUrl}</p>
    
    <p>Best regards,<br>
    The Risivo Team</p>
    
    <div class="footer">
      <p>This email was sent to ${email}</p>
      <p>Need help? Contact us at <a href="mailto:hello@risivo.com">hello@risivo.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Reset Your Risivo Password',
      html: html,
      text: `Reset Your Password\n\nHi ${firstName},\n\nClick this link to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\nBest regards,\nThe Risivo Team`,
    });
  }
}

/**
 * Generate secure random password
 */
export function generateTempPassword(length: number = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % chars.length];
  }
  
  return password;
}

/**
 * Generate secure reset token
 */
export function generateResetToken(): string {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Send admin notification when new investor signs NDA
 */
export async function sendAdminNewInvestorNotification(config: EmailConfig, data: {
  adminEmail: string;
  investorEmail: string;
  investorName: string;
  businessName?: string;
  signedAt: string;
}): Promise<void> {
  const { adminEmail, investorEmail, investorName, businessName, signedAt } = data;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Investor Awaiting Approval - Risivo</title>
  <style>
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f7fa;
    }
    .email-container {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h1 {
      color: #333;
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    .alert-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .investor-details {
      background: #f9fafb;
      border-left: 4px solid #6b3fea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 8px;
    }
    .investor-details p {
      margin: 8px 0;
    }
    .investor-details strong {
      color: #6b3fea;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">RISIVO</div>
      <h1>🔔 New Investor Awaiting Approval</h1>
    </div>
    
    <div style="text-align: center;">
      <span class="alert-badge">⏳ Action Required</span>
    </div>
    
    <p>A new investor has signed the NDA and is awaiting your approval to access investor materials.</p>
    
    <div class="investor-details">
      <p><strong>Investor Name:</strong> ${investorName}</p>
      <p><strong>Email:</strong> ${investorEmail}</p>
      ${businessName ? `<p><strong>Company:</strong> ${businessName}</p>` : ''}
      <p><strong>NDA Signed:</strong> ${new Date(signedAt).toLocaleString('en-US', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })}</p>
    </div>
    
    <div style="text-align: center;">
      <a href="https://risivo.com/admin/investors" class="btn">
        Review & Approve Investor
      </a>
    </div>
    
    <p style="color: #666; font-size: 0.9rem;">
      Once approved, the investor will receive an email notification with access to the investor dashboard.
    </p>
    
    <div class="footer">
      <p>This is an automated notification from Risivo Investor Portal</p>
    </div>
  </div>
</body>
</html>
  `;

  const payload = {
    personalizations: [{ to: [{ email: adminEmail }] }],
    from: { email: config.FROM_EMAIL, name: config.FROM_NAME },
    subject: `🔔 New Investor Awaiting Approval: ${investorName}`,
    content: [
      { type: 'text/plain', value: `New investor ${investorName} (${investorEmail}) has signed the NDA and is awaiting approval. Review at: https://risivo.com/admin/investors` },
      { type: 'text/html', value: html }
    ]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[EMAIL] Failed to send admin notification:', errorText);
    throw new Error(`SendGrid API error: ${response.status}`);
  }
  
  console.log('[EMAIL] Admin notification sent successfully');
}

/**
 * Send investor approval notification
 */
export async function sendInvestorApprovalEmail(config: EmailConfig, data: {
  email: string;
  firstName: string;
  lastName: string;
}): Promise<void> {
  const { email, firstName, lastName } = data;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investor Access Approved - Risivo</title>
  <style>
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f7fa;
    }
    .email-container {
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h1 {
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 10px;
    }
    .success-badge {
      display: inline-block;
      background: #d1fae5;
      color: #065f46;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .features-box {
      background: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 20px;
      margin: 25px 0;
      border-radius: 8px;
    }
    .features-box h3 {
      margin-top: 0;
      color: #0369a1;
    }
    .features-box ul {
      margin: 0;
      padding-left: 20px;
    }
    .features-box li {
      margin: 8px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.9rem;
    }
    .footer a {
      color: #6b3fea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">RISIVO</div>
      <h1>🎉 Investor Access Approved!</h1>
    </div>
    
    <div style="text-align: center;">
      <span class="success-badge">✅ Full Access Granted</span>
    </div>
    
    <p>Hi ${firstName},</p>
    
    <p>Great news! Your investor account has been approved. You now have full access to exclusive investor materials and updates.</p>
    
    <div class="features-box">
      <h3>What You Can Access Now:</h3>
      <ul>
        <li>📊 Detailed investor presentations</li>
        <li>📈 Financial projections and metrics</li>
        <li>🎙️ Investment thesis audio briefings</li>
        <li>📋 Company updates and milestones</li>
        <li>📁 Confidential documents and reports</li>
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href="https://risivo.com/updates/investor/dashboard" class="btn">
        Access Investor Dashboard
      </a>
    </div>
    
    <p>If you have any questions about the investment opportunity or need additional information, please don't hesitate to reach out.</p>
    
    <p>We look forward to having you as part of the Risivo journey!</p>
    
    <p>Best regards,<br>
    The Risivo Team</p>
    
    <div class="footer">
      <p>This email was sent to ${email}</p>
      <p>Need help? Contact us at <a href="mailto:investors@risivo.com">investors@risivo.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const payload = {
    personalizations: [{ to: [{ email }] }],
    from: { email: config.FROM_EMAIL, name: config.FROM_NAME },
    subject: '🎉 Your Risivo Investor Access Has Been Approved!',
    content: [
      { type: 'text/plain', value: `Hi ${firstName},\n\nYour investor account has been approved! You now have full access to exclusive investor materials.\n\nAccess your dashboard: https://risivo.com/updates/investor/dashboard\n\nBest regards,\nThe Risivo Team` },
      { type: 'text/html', value: html }
    ]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[EMAIL] Failed to send approval email:', errorText);
    throw new Error(`SendGrid API error: ${response.status}`);
  }
  
  console.log('[EMAIL] Investor approval email sent successfully');
}
