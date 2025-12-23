import { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from '../../utils/email';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
  FROM_EMAIL?: string;
};

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
    const fromEmail = c.env?.FROM_EMAIL || 'hello@risivo.com';

    if (sendgridKey) {
      try {
        const emailService = new EmailService({
          SENDGRID_API_KEY: sendgridKey,
          FROM_EMAIL: fromEmail,
          FROM_NAME: 'Risivo Investor Portal'
        });

        await emailService.sendInvestorApprovalEmail({
          email: investor.email,
          firstName: investor.first_name
        });
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
 * Admin API endpoint to permanently delete an investor
 * Removes user, sessions, and NDA signature from database
 */
export async function deleteInvestor(c: Context<{ Bindings: Bindings }>) {
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

    // Get investor details first (to confirm they exist and are an investor)
    const { data: investor, error: investorError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, user_type')
      .eq('id', investorId)
      .eq('user_type', 'investor')
      .single();

    if (investorError || !investor) {
      return c.json({ success: false, error: 'Investor not found' }, 404);
    }

    console.log('[DELETE-INVESTOR] Deleting investor:', investor.email);

    // Delete in order to respect foreign key constraints:
    
    // 1. Delete NDA signature
    const { error: ndaError } = await supabase
      .from('nda_signatures')
      .delete()
      .eq('user_id', investorId);
    
    if (ndaError) {
      console.error('[DELETE-INVESTOR] Error deleting NDA signature:', ndaError);
      // Continue anyway - might not have NDA
    } else {
      console.log('[DELETE-INVESTOR] NDA signature deleted');
    }

    // 2. Delete user sessions
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', investorId);
    
    if (sessionError) {
      console.error('[DELETE-INVESTOR] Error deleting sessions:', sessionError);
      // Continue anyway
    } else {
      console.log('[DELETE-INVESTOR] User sessions deleted');
    }

    // 3. Delete investor activity logs (if table exists)
    try {
      const { error: activityError } = await supabase
        .from('investor_activity_log')
        .delete()
        .eq('user_id', investorId);
      
      if (!activityError) {
        console.log('[DELETE-INVESTOR] Activity logs deleted');
      }
    } catch (e) {
      // Table might not exist
    }

    // 4. Delete content access logs (if table exists)
    try {
      const { error: accessError } = await supabase
        .from('investor_content_access')
        .delete()
        .eq('user_id', investorId);
      
      if (!accessError) {
        console.log('[DELETE-INVESTOR] Content access logs deleted');
      }
    } catch (e) {
      // Table might not exist
    }

    // 5. Finally, delete the user
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', investorId);

    if (userError) {
      console.error('[DELETE-INVESTOR] Error deleting user:', userError);
      return c.json({ 
        success: false, 
        error: 'Failed to delete user',
        details: userError.message 
      }, 500);
    }

    console.log('[DELETE-INVESTOR] ✅ Investor deleted successfully:', investor.email);

    return c.json({
      success: true,
      message: 'Investor deleted successfully',
      deleted: {
        id: investor.id,
        email: investor.email,
        name: `${investor.first_name} ${investor.last_name}`
      }
    });

  } catch (error) {
    console.error('[DELETE-INVESTOR] Error:', error);
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
