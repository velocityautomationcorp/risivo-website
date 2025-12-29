// Email utility for SendGrid
// Used by user-auth.ts for password reset emails

interface EmailConfig {
  SENDGRID_API_KEY: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

interface PasswordResetEmailParams {
  email: string;
  firstName: string;
  resetToken: string;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor(config: EmailConfig) {
    this.apiKey = config.SENDGRID_API_KEY;
    this.fromEmail = config.FROM_EMAIL;
    this.fromName = config.FROM_NAME;
  }

  async sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void> {
    const { email, firstName, resetToken } = params;
    
    // Build reset URL
    const resetUrl = `https://risivo.com/updates/reset-password?token=${resetToken}`;
    
    const emailData = {
      personalizations: [
        {
          to: [{ email }],
          subject: 'Reset Your Risivo Password'
        }
      ],
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      content: [
        {
          type: 'text/html',
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #667eea; margin: 0;">Risivo</h1>
              </div>
              
              <h2 style="color: #333;">Password Reset Request</h2>
              
              <p>Hi ${firstName || 'there'},</p>
              
              <p>We received a request to reset your password for your Risivo account. Click the button below to reset it:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
              </div>
              
              <p style="font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
              
              <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                This email was sent by Risivo.<br>
                &copy; ${new Date().getFullYear()} Risivo. All rights reserved.
              </p>
            </body>
            </html>
          `
        }
      ]
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

  async sendWelcomeEmail(params: { email: string; firstName: string; password: string }): Promise<void> {
    const { email, firstName, password } = params;
    
    const loginUrl = 'https://risivo.com/updates/login';
    
    const emailData = {
      personalizations: [
        {
          to: [{ email }],
          subject: 'Welcome to Risivo - Your Account is Ready!'
        }
      ],
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      content: [
        {
          type: 'text/html',
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #667eea; margin: 0;">Risivo</h1>
              </div>
              
              <h2 style="color: #333;">Welcome to Risivo!</h2>
              
              <p>Hi ${firstName || 'there'},</p>
              
              <p>Your account has been activated! Here are your login credentials:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0 0;"><strong>Password:</strong> ${password}</p>
              </div>
              
              <p style="color: #e53935; font-weight: 500;">Please change your password after your first login for security.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Login to Your Account</a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                This email was sent by Risivo.<br>
                &copy; ${new Date().getFullYear()} Risivo. All rights reserved.
              </p>
            </body>
            </html>
          `
        }
      ]
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
}

// Helper function to generate secure reset token
export function generateResetToken(): string {
  const array = new Uint8Array(32);
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
