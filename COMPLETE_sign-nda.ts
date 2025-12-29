import { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
  ADMIN_EMAIL?: string;
  FROM_EMAIL?: string;
};

// Email sending helper function
async function sendEmail(config: { apiKey: string; fromEmail: string; fromName: string }, data: { to: string; subject: string; html: string; text: string }) {
  const payload = {
    personalizations: [{ to: [{ email: data.to }] }],
    from: { email: config.fromEmail, name: config.fromName },
    subject: data.subject,
    content: [
      { type: 'text/plain', value: data.text },
      { type: 'text/html', value: data.html }
    ]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
  }
}

export async function signNDA(c: Context<{ Bindings: Bindings }>) {
  try {
    // Get request body
    const body = await c.req.json();
    const { full_name, signature_date, nda_version } = body;

    console.log('[NDA] Signature request received');
    console.log('[NDA] Full Name:', full_name);
    console.log('[NDA] NDA Version:', nda_version);

    // Validate required fields
    if (!full_name || !signature_date) {
      return c.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'Full name and signature date are required'
        },
        400
      );
    }

    // Get session cookie to identify user
    // Check for multiple cookie names (user_session, session, risivo_session)
    const sessionCookie = c.req.header('cookie');
    let sessionToken = null;

    if (sessionCookie) {
      const cookies = sessionCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        // Check all possible cookie names
        if (name === 'user_session' || name === 'session' || name === 'risivo_session') {
          sessionToken = value;
          console.log(`[NDA] Found session cookie: ${name}`);
          break;
        }
      }
    }

    if (!sessionToken) {
      console.error('[NDA] No session token found in cookies');
      console.log('[NDA] Cookies received:', sessionCookie);
      return c.json(
        {
          success: false,
          error: 'Not authenticated',
          details: 'Please log in first'
        },
        401
      );
    }

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[NDA] Supabase not configured');
      return c.json(
        {
          success: false,
          error: 'Service configuration error'
        },
        500
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user by session token in user_sessions table
    console.log('[NDA] Looking up session token:', sessionToken.substring(0, 10) + '...');
    
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString()) // Check not expired
      .single();
    
    console.log('[NDA] Session lookup result:', {
      hasData: !!session,
      error: sessionError?.message,
      errorCode: sessionError?.code
    });

    if (sessionError || !session) {
      console.error('[NDA] Invalid or expired session:', sessionError);
      return c.json(
        {
          success: false,
          error: 'Invalid session',
          details: 'Please log in again. Your session may have expired.'
        },
        401
      );
    }

    const userId = session.user_id;
    console.log('[NDA] User ID:', userId);

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, first_name, last_name, business_name, user_type, investor_status')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('[NDA] User not found:', userError);
      return c.json(
        {
          success: false,
          error: 'User not found'
        },
        404
      );
    }

    // Verify user is an investor
    if (user.user_type !== 'investor') {
      console.error('[NDA] User is not an investor:', user.user_type);
      return c.json(
        {
          success: false,
          error: 'Access denied',
          details: 'Only investors can sign the NDA'
        },
        403
      );
    }

    // Check if NDA already signed
    const { data: existingNDA, error: checkError } = await supabase
      .from('nda_signatures')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingNDA) {
      console.log('[NDA] NDA already signed by this user');
      return c.json({
        success: true,
        message: 'NDA already signed',
        already_signed: true
      });
    }

    // Get IP address and user agent
    const ipAddress = c.req.header('cf-connecting-ip') || 
                      c.req.header('x-forwarded-for') || 
                      c.req.header('x-real-ip') || 
                      'unknown';
    
    const userAgent = c.req.header('user-agent') || 'unknown';

    console.log('[NDA] IP Address:', ipAddress);
    console.log('[NDA] User Agent:', userAgent);

    // Generate NDA text hash (SHA-256) for legal proof
    // This proves which version of the NDA was signed
    const ndaTextHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(`NDA-v${nda_version || 'v1.0'}-RISIVO-VAC-2025`)
    ).then(buffer => 
      Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    );

    console.log('[NDA] Generated text hash:', ndaTextHash);

    // Store NDA signature (using correct column names from schema)
    const { data: signature, error: insertError } = await supabase
      .from('nda_signatures')
      .insert({
        user_id: userId,
        full_name_typed: full_name,              // ✅ Correct column name
        signature_timestamp: signature_date,      // ✅ Correct column name
        ip_address: ipAddress,
        user_agent: userAgent,
        nda_version: nda_version || 'v1.0',
        nda_text_hash: ndaTextHash               // ✅ Required field
      })
      .select()
      .single();

    if (insertError) {
      console.error('[NDA] Failed to store signature:', insertError);
      return c.json(
        {
          success: false,
          error: 'Failed to store signature',
          details: insertError.message
        },
        500
      );
    }

    console.log('[NDA] Signature stored successfully:', signature.id);

    // Update user's investor status to 'nda_signed'
    const { error: updateError } = await supabase
      .from('users')
      .update({
        investor_status: 'nda_signed',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[NDA] Failed to update investor status:', updateError);
      // Don't fail the request - signature is already stored
    } else {
      console.log('[NDA] Investor status updated to: nda_signed');
    }

    // ========== SEND EMAIL NOTIFICATIONS ==========
    const sendgridKey = c.env?.SENDGRID_API_KEY;
    const adminEmail = c.env?.ADMIN_EMAIL || 'jp@risivo.com';
    const fromEmail = c.env?.FROM_EMAIL || 'admin@risivo.com';

    if (sendgridKey) {
      const emailConfig = {
        apiKey: sendgridKey,
        fromEmail: fromEmail,
        fromName: 'Risivo Investor Portal'
      };

      // 1. Send confirmation email to INVESTOR (NDA received, under review)
      try {
        const investorConfirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NDA Received - Risivo</title>
</head>
<body style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa;">
  <div style="background: white; border-radius: 15px; padding: 40px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">RISIVO</div>
      <h1 style="color: #333; font-size: 1.8rem; margin-bottom: 10px;">📋 NDA Received Successfully</h1>
    </div>
    
    <div style="text-align: center;">
      <span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; margin-bottom: 20px;">⏳ Under Review</span>
    </div>
    
    <p>Hi ${user.first_name},</p>
    
    <p>Thank you for signing our Non-Disclosure Agreement. We've received your signed NDA and your investor access request is now being reviewed by our team.</p>
    
    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
      <h3 style="margin-top: 0; color: #0369a1; font-size: 1rem;">⏱️ What Happens Next?</h3>
      <p style="margin-bottom: 0;">Our team will review your application and you'll receive a confirmation email <strong>within 1 business day</strong> with your access approval.</p>
    </div>
    
    <p>Once approved, you'll have access to:</p>
    <ul>
      <li>📊 Detailed investor presentations</li>
      <li>📈 Financial projections and metrics</li>
      <li>🎙️ Investment thesis audio briefings</li>
      <li>📁 Confidential documents and reports</li>
    </ul>
    
    <p>Thank you for your interest in Risivo!</p>
    
    <p>Best regards,<br>The Risivo Team</p>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 0.9rem;">
      <p>Questions? Contact us at <a href="mailto:investors@risivo.com" style="color: #6b3fea; text-decoration: none;">investors@risivo.com</a></p>
    </div>
  </div>
</body>
</html>`;

        await sendEmail(emailConfig, {
          to: user.email,
          subject: '📋 NDA Received - Your Application is Under Review',
          html: investorConfirmationHtml,
          text: `Hi ${user.first_name},\n\nThank you for signing our NDA. Your investor access request is now under review.\n\nYou'll receive a confirmation email within 1 business day with your access approval.\n\nBest regards,\nThe Risivo Team`
        });
        console.log('[NDA] Investor confirmation email sent to:', user.email);
      } catch (emailError) {
        console.error('[NDA] Failed to send investor confirmation email:', emailError);
      }

      // 2. Send notification to ADMIN (new investor pending approval)
      try {
        const adminNotificationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Investor Awaiting Approval - Risivo</title>
</head>
<body style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa;">
  <div style="background: white; border-radius: 15px; padding: 40px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">RISIVO</div>
      <h1 style="color: #333; font-size: 1.5rem; margin-bottom: 10px;">🔔 New Investor Awaiting Approval</h1>
    </div>
    
    <div style="text-align: center;">
      <span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; margin-bottom: 20px;">⏳ Action Required</span>
    </div>
    
    <p>A new investor has signed the NDA and is awaiting your approval to access investor materials.</p>
    
    <div style="background: #f9fafb; border-left: 4px solid #6b3fea; padding: 20px; margin: 25px 0; border-radius: 8px;">
      <p style="margin: 8px 0;"><strong style="color: #6b3fea;">Investor Name:</strong> ${user.first_name} ${user.last_name}</p>
      <p style="margin: 8px 0;"><strong style="color: #6b3fea;">Email:</strong> ${user.email}</p>
      ${user.business_name ? `<p style="margin: 8px 0;"><strong style="color: #6b3fea;">Company:</strong> ${user.business_name}</p>` : ''}
      <p style="margin: 8px 0;"><strong style="color: #6b3fea;">NDA Signed:</strong> ${new Date(signature_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
    </div>
    
    <div style="text-align: center;">
      <a href="https://risivo.com/admin/investors" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 20px 0;">
        Review & Approve Investor
      </a>
    </div>
    
    <p style="color: #666; font-size: 0.9rem;">
      Once approved, the investor will receive an email notification with access to the investor dashboard.
    </p>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 0.9rem;">
      <p>This is an automated notification from Risivo Investor Portal</p>
    </div>
  </div>
</body>
</html>`;

        await sendEmail(emailConfig, {
          to: adminEmail,
          subject: `🔔 New Investor Awaiting Approval: ${user.first_name} ${user.last_name}`,
          html: adminNotificationHtml,
          text: `New investor ${user.first_name} ${user.last_name} (${user.email}) has signed the NDA and is awaiting approval.\n\nReview at: https://risivo.com/admin/investors`
        });
        console.log('[NDA] Admin notification email sent to:', adminEmail);
      } catch (emailError) {
        console.error('[NDA] Failed to send admin notification email:', emailError);
      }
    } else {
      console.warn('[NDA] SendGrid not configured - skipping email notifications');
    }

    // Success response
    return c.json({
      success: true,
      message: 'NDA signed successfully',
      signature_id: signature.id,
      signed_at: signature.signature_timestamp  // ✅ Correct column name
    });

  } catch (error) {
    console.error('[NDA] Signature error:', error);
    return c.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
}
