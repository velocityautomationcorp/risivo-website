import { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
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

/**
 * Admin API endpoint to approve an investor
 * Changes investor_status from 'nda_signed' to 'active'
 * Sends approval notification email
 */
export async function approveInvestor(c: Context<{ Bindings: Bindings }>) {
  try {
    const investorId = c.req.param('investor_id');

    if (!investorId) {
      return c.json({ success: false, error: 'Investor ID required' }, 400);
    }

    // TODO: Verify admin authentication
    // For now, assuming route is protected by admin middleware

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get investor details
    const { data: investor, error: investorError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, business_name, investor_status')
      .eq('id', investorId)
      .eq('user_type', 'investor')
      .single();

    if (investorError || !investor) {
      return c.json({ success: false, error: 'Investor not found' }, 404);
    }

    // Check if investor is eligible for approval
    if (investor.investor_status !== 'nda_signed') {
      return c.json({
        success: false,
        error: 'Cannot approve',
        details: `Investor status is '${investor.investor_status}'. Only 'nda_signed' investors can be approved.`
      }, 400);
    }

    // Update investor status to 'active'
    const { error: updateError } = await supabase
      .from('users')
      .update({
        investor_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', investorId);

    if (updateError) {
      console.error('[APPROVE-INVESTOR] Update error:', updateError);
      return c.json({ success: false, error: 'Failed to update investor status' }, 500);
    }

    // Log approval activity
    try {
      await supabase.rpc('log_investor_activity', {
        p_user_id: investorId,
        p_action_type: 'approved',
        p_resource_type: 'investor_status',
        p_ip_address: c.req.header('cf-connecting-ip') || 'admin',
        p_user_agent: 'Admin approval'
      });
    } catch (logError) {
      console.error('[APPROVE-INVESTOR] Failed to log activity:', logError);
    }

    // ========== SEND APPROVAL EMAIL TO INVESTOR ==========
    const sendgridKey = c.env?.SENDGRID_API_KEY;
    const fromEmail = c.env?.FROM_EMAIL || 'admin@risivo.com';

    if (sendgridKey) {
      try {
        const approvalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investor Access Approved - Risivo</title>
</head>
<body style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa;">
  <div style="background: white; border-radius: 15px; padding: 40px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">RISIVO</div>
      <h1 style="color: #333; font-size: 1.8rem; margin-bottom: 10px;">🎉 Investor Access Approved!</h1>
    </div>
    
    <div style="text-align: center;">
      <span style="display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; margin-bottom: 20px;">✅ Full Access Granted</span>
    </div>
    
    <p>Hi ${investor.first_name},</p>
    
    <p>Great news! Your investor account has been approved. You now have full access to exclusive investor materials and updates.</p>
    
    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
      <h3 style="margin-top: 0; color: #0369a1;">What You Can Access Now:</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin: 8px 0;">📊 Detailed investor presentations</li>
        <li style="margin: 8px 0;">📈 Financial projections and metrics</li>
        <li style="margin: 8px 0;">🎙️ Investment thesis audio briefings</li>
        <li style="margin: 8px 0;">📋 Company updates and milestones</li>
        <li style="margin: 8px 0;">📁 Confidential documents and reports</li>
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href="https://risivo.com/updates/investor/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6b3fea 0%, #ed632f 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 20px 0;">
        Access Investor Dashboard
      </a>
    </div>
    
    <p>If you have any questions about the investment opportunity or need additional information, please don't hesitate to reach out.</p>
    
    <p>We look forward to having you as part of the Risivo journey!</p>
    
    <p>Best regards,<br>The Risivo Team</p>
    
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 0.9rem;">
      <p>This email was sent to ${investor.email}</p>
      <p>Need help? Contact us at <a href="mailto:investors@risivo.com" style="color: #6b3fea; text-decoration: none;">investors@risivo.com</a></p>
    </div>
  </div>
</body>
</html>`;

        await sendEmail(
          { apiKey: sendgridKey, fromEmail: fromEmail, fromName: 'Risivo Investor Portal' },
          {
            to: investor.email,
            subject: '🎉 Your Risivo Investor Access Has Been Approved!',
            html: approvalHtml,
            text: `Hi ${investor.first_name},\n\nYour investor account has been approved! You now have full access to exclusive investor materials.\n\nAccess your dashboard: https://risivo.com/updates/investor/dashboard\n\nBest regards,\nThe Risivo Team`
          }
        );
        console.log('[APPROVE-INVESTOR] Approval email sent to:', investor.email);
      } catch (emailError) {
        console.error('[APPROVE-INVESTOR] Failed to send approval email:', emailError);
        // Don't fail - investor is already approved
      }
    } else {
      console.warn('[APPROVE-INVESTOR] SendGrid not configured - skipping approval email');
    }

    return c.json({
      success: true,
      message: 'Investor approved successfully',
      investor: {
        id: investor.id,
        email: investor.email,
        name: `${investor.first_name} ${investor.last_name}`,
        status: 'active'
      }
    });

  } catch (error) {
    console.error('[APPROVE-INVESTOR] Error:', error);
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

/**
 * Admin API endpoint to reject an investor
 * Changes investor_status from 'nda_signed' to 'rejected'
 * Sends rejection notification email with reason
 */
export async function rejectInvestor(c: Context<{ Bindings: Bindings }>) {
  try {
    const investorId = c.req.param('investor_id');
    const body = await c.req.json();
    const { reason } = body;

    if (!investorId) {
      return c.json({ success: false, error: 'Investor ID required' }, 400);
    }

    if (!reason) {
      return c.json({ success: false, error: 'Rejection reason required' }, 400);
    }

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get investor details
    const { data: investor, error: investorError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, investor_status')
      .eq('id', investorId)
      .eq('user_type', 'investor')
      .single();

    if (investorError || !investor) {
      return c.json({ success: false, error: 'Investor not found' }, 404);
    }

    // Update investor status to 'rejected'
    const { error: updateError } = await supabase
      .from('users')
      .update({
        investor_status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', investorId);

    if (updateError) {
      console.error('[REJECT-INVESTOR] Update error:', updateError);
      return c.json({ success: false, error: 'Failed to update investor status' }, 500);
    }

    // Log rejection activity
    try {
      await supabase.rpc('log_investor_activity', {
        p_user_id: investorId,
        p_action_type: 'rejected',
        p_resource_type: 'investor_status',
        p_ip_address: c.req.header('cf-connecting-ip') || 'admin',
        p_user_agent: `Admin rejection: ${reason}`
      });
    } catch (logError) {
      console.error('[REJECT-INVESTOR] Failed to log activity:', logError);
    }

    // TODO: Send rejection notification email with reason
    console.log('[REJECT-INVESTOR] TODO: Send rejection email to:', investor.email);
    console.log('[REJECT-INVESTOR] Rejection reason:', reason);

    return c.json({
      success: true,
      message: 'Investor rejected',
      investor: {
        id: investor.id,
        email: investor.email,
        name: `${investor.first_name} ${investor.last_name}`,
        status: 'rejected'
      }
    });

  } catch (error) {
    console.error('[REJECT-INVESTOR] Error:', error);
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

/**
 * Get detailed information about an investor including NDA signature
 */
export async function getInvestorDetails(c: Context<{ Bindings: Bindings }>) {
  try {
    const investorId = c.req.param('investor_id');

    if (!investorId) {
      return c.json({ success: false, error: 'Investor ID required' }, 400);
    }

    // Initialize Supabase
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service configuration error' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get NDA signature details
    const { data: ndaSignature, error: ndaError } = await supabase
      .from('nda_signatures')
      .select('*')
      .eq('user_id', investorId)
      .single();

    if (ndaError && ndaError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('[GET-INVESTOR-DETAILS] NDA query error:', ndaError);
    }

    return c.json({
      success: true,
      nda_signature: ndaSignature || null
    });

  } catch (error) {
    console.error('[GET-INVESTOR-DETAILS] Error:', error);
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
