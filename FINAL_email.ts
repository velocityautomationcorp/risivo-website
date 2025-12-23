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

    console.log('[EMAIL] Sending email to:', data.to);
    console.log('[EMAIL] Subject:', data.subject);
    console.log('[EMAIL] From:', this.config.FROM_EMAIL);

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
      console.error('[EMAIL] SendGrid error:', response.status, errorText);
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }

    console.log('[EMAIL] Email sent successfully to:', data.to);
  }

  /**
   * Send welcome email with temporary password
   */
  async sendWelcomeEmail(data: {
    email: string;
    firstName: string;
    lastName: string;
    tempPassword: string;
  }): Promise<void> {
    const { email, firstName, lastName, tempPassword } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Risivo Updates</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with gradient -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e0a3c 0%, #6b3fea 50%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <img src="https://risivo.com/images/risivo-logo-white.png" alt="RISIVO" style="height: 40px; margin-bottom: 20px;" />
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">👋 Welcome to Risivo!</h1>
        <div style="display: inline-block; background: linear-gradient(135deg, #ffd700, #ffed4e); color: #333; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 15px;">
          🚀 Early Bird Access
        </div>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for joining our early bird program! We're excited to have you as part of the Risivo community.</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Your account has been created and you now have exclusive access to our updates platform.</p>
        
        <!-- Credentials Box -->
        <div style="background: #f9fafb; border-left: 4px solid #6b3fea; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #6b3fea;">Your Login Credentials:</p>
          <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0; color: #333;"><strong>Temporary Password:</strong></p>
          <div style="background: #fff; padding: 10px 15px; border: 1px solid #ddd; border-radius: 4px; display: inline-block; margin-top: 5px;">
            <code style="font-size: 16px; color: #ed632f; font-weight: 600;">${tempPassword}</code>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://risivo.com/updates/login" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
            Access Your Dashboard
          </a>
        </div>
        
        <!-- Warning -->
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; color: #856404; font-size: 14px;"><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">Welcome aboard! 🚀</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;">Best regards,<br>The Risivo Team</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background: #f5f7fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">This email was sent to ${email}</p>
        <p style="color: #666; font-size: 14px; margin: 0;">Need help? Contact us at <a href="mailto:hello@risivo.com" style="color: #6b3fea; text-decoration: none;">hello@risivo.com</a></p>
        <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">© ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.</p>
      </td>
    </tr>
  </table>
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
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with gradient -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e0a3c 0%, #6b3fea 50%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <img src="https://risivo.com/images/risivo-logo-white.png" alt="RISIVO" style="height: 40px; margin-bottom: 20px;" />
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">🔐 Reset Your Password</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">We received a request to reset your password for your Risivo Updates account.</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Click the button below to reset your password:</p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
            Reset My Password
          </a>
        </div>
        
        <!-- Info Box -->
        <div style="background: #f9fafb; border: 1px solid #e0e0e0; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; color: #666; font-size: 14px;"><strong>Link expires in 1 hour</strong><br>For security reasons, this password reset link will expire in 60 minutes.</p>
        </div>
        
        <!-- Warning -->
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; color: #856404; font-size: 14px;"><strong>⚠️ Didn't request this?</strong><br>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0;">If the button doesn't work, copy and paste this link:<br><a href="${resetUrl}" style="color: #6b3fea; word-break: break-all;">${resetUrl}</a></p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">Best regards,<br>The Risivo Team</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background: #f5f7fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">This email was sent to ${email}</p>
        <p style="color: #666; font-size: 14px; margin: 0;">Need help? Contact us at <a href="mailto:hello@risivo.com" style="color: #6b3fea; text-decoration: none;">hello@risivo.com</a></p>
        <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">© ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.</p>
      </td>
    </tr>
  </table>
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

  /**
   * Send NDA confirmation email to investor (application under review)
   */
  async sendInvestorNDAConfirmation(data: {
    email: string;
    firstName: string;
  }): Promise<void> {
    const { email, firstName } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NDA Received - Risivo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with gradient -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e0a3c 0%, #6b3fea 50%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <img src="https://risivo.com/images/risivo-logo-white.png" alt="RISIVO" style="height: 40px; margin-bottom: 20px;" />
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">📋 NDA Received Successfully</h1>
        <div style="display: inline-block; background: linear-gradient(135deg, #ffd700, #ffed4e); color: #333; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 15px;">
          ⏳ Under Review
        </div>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for signing our Non-Disclosure Agreement. We've received your signed NDA and your investor access request is now being reviewed by our team.</p>
        
        <!-- Info Box -->
        <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #0369a1;">⏱️ What Happens Next?</p>
          <p style="margin: 0; color: #333; font-size: 15px;">Our team will review your application and you'll receive a confirmation email <strong>within 1 business day</strong> with your access approval.</p>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0;">Once approved, you'll have access to:</p>
        
        <ul style="color: #333; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0 0 20px 0;">
          <li>📊 Detailed investor presentations</li>
          <li>📈 Financial projections and metrics</li>
          <li>🎙️ Investment thesis audio briefings</li>
          <li>📁 Confidential documents and reports</li>
        </ul>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">Thank you for your interest in Risivo!</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;">Best regards,<br>The Risivo Team</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background: #f5f7fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">This email was sent to ${email}</p>
        <p style="color: #666; font-size: 14px; margin: 0;">Questions? Contact us at <a href="mailto:investors@risivo.com" style="color: #6b3fea; text-decoration: none;">investors@risivo.com</a></p>
        <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">© ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail({
      to: email,
      subject: '📋 NDA Received - Your Application is Under Review',
      html: html,
      text: `Hi ${firstName},\n\nThank you for signing our NDA. Your investor access request is now under review.\n\nYou'll receive a confirmation email within 1 business day with your access approval.\n\nBest regards,\nThe Risivo Team`,
    });
  }

  /**
   * Send admin notification when new investor signs NDA
   */
  async sendAdminNewInvestorNotification(data: {
    adminEmail: string;
    investorEmail: string;
    investorName: string;
    businessName?: string;
    signedAt: string;
  }): Promise<void> {
    const { adminEmail, investorEmail, investorName, businessName, signedAt } = data;

    console.log('[EMAIL] Preparing admin notification email');
    console.log('[EMAIL] Admin email:', adminEmail);
    console.log('[EMAIL] Investor:', investorName, investorEmail);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Investor Awaiting Approval - Risivo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with gradient -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e0a3c 0%, #6b3fea 50%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <img src="https://risivo.com/images/risivo-logo-white.png" alt="RISIVO" style="height: 40px; margin-bottom: 20px;" />
        <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">🔔 New Investor Awaiting Approval</h1>
        <div style="display: inline-block; background: linear-gradient(135deg, #ffd700, #ffed4e); color: #333; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 15px;">
          ⏳ Action Required
        </div>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">A new investor has signed the NDA and is awaiting your approval to access investor materials.</p>
        
        <!-- Investor Details Box -->
        <div style="background: #f9fafb; border-left: 4px solid #6b3fea; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <p style="margin: 8px 0; color: #333;"><strong style="color: #6b3fea;">Investor Name:</strong> ${investorName}</p>
          <p style="margin: 8px 0; color: #333;"><strong style="color: #6b3fea;">Email:</strong> ${investorEmail}</p>
          ${businessName ? `<p style="margin: 8px 0; color: #333;"><strong style="color: #6b3fea;">Company:</strong> ${businessName}</p>` : ''}
          <p style="margin: 8px 0; color: #333;"><strong style="color: #6b3fea;">NDA Signed:</strong> ${new Date(signedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://risivo.com/admin/investors" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
            Review & Approve Investor
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">Once approved, the investor will receive an email notification with access to the investor dashboard.</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background: #f5f7fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 14px; margin: 0;">This is an automated notification from Risivo Investor Portal</p>
        <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">© ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail({
      to: adminEmail,
      subject: `🔔 New Investor Awaiting Approval: ${investorName}`,
      html: html,
      text: `New investor ${investorName} (${investorEmail}) has signed the NDA and is awaiting approval.\n\nCompany: ${businessName || 'N/A'}\nNDA Signed: ${signedAt}\n\nReview at: https://risivo.com/admin/investors`,
    });
  }

  /**
   * Send investor approval notification
   */
  async sendInvestorApprovalEmail(data: {
    email: string;
    firstName: string;
  }): Promise<void> {
    const { email, firstName } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investor Access Approved - Risivo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with gradient -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e0a3c 0%, #6b3fea 50%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <img src="https://risivo.com/images/risivo-logo-white.png" alt="RISIVO" style="height: 40px; margin-bottom: 20px;" />
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">🎉 Investor Access Approved!</h1>
        <div style="display: inline-block; background: linear-gradient(135deg, #22c55e, #4ade80); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 15px;">
          ✅ Full Access Granted
        </div>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${firstName},</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Great news! Your investor account has been approved. You now have full access to exclusive investor materials and updates.</p>
        
        <!-- Access Box -->
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <p style="margin: 0 0 15px 0; font-weight: 600; color: #166534;">What You Can Access Now:</p>
          <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 15px; line-height: 1.8;">
            <li>📊 Detailed investor presentations</li>
            <li>📈 Financial projections and metrics</li>
            <li>🎙️ Investment thesis audio briefings</li>
            <li>📋 Company updates and milestones</li>
            <li>📁 Confidential documents and reports</li>
          </ul>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://risivo.com/updates/investor/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
            Access Investor Dashboard
          </a>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0;">If you have any questions about the investment opportunity or need additional information, please don't hesitate to reach out.</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">We look forward to having you as part of the Risivo journey!</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;">Best regards,<br>The Risivo Team</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background: #f5f7fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">This email was sent to ${email}</p>
        <p style="color: #666; font-size: 14px; margin: 0;">Need help? Contact us at <a href="mailto:investors@risivo.com" style="color: #6b3fea; text-decoration: none;">investors@risivo.com</a></p>
        <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">© ${new Date().getFullYear()} Risivo™ by Velocity Automation Corp. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail({
      to: email,
      subject: '🎉 Your Risivo Investor Access Has Been Approved!',
      html: html,
      text: `Hi ${firstName},\n\nYour investor account has been approved! You now have full access to exclusive investor materials.\n\nAccess your dashboard: https://risivo.com/updates/investor/dashboard\n\nBest regards,\nThe Risivo Team`,
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
