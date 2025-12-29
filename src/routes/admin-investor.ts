import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { getCookie } from 'hono/cookie';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const adminInvestorRoute = new Hono<{ Bindings: Bindings }>();

// Helper to verify admin session
async function verifyAdmin(c: any) {
  const sessionToken = getCookie(c, 'admin_session');
  if (!sessionToken) return null;

  const supabaseUrl = c.env?.SUPABASE_URL;
  const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: session } = await supabase
    .from('admin_sessions')
    .select('*, admin_users(*)')
    .eq('session_token', sessionToken)
    .single();

  if (!session || new Date(session.expires_at) < new Date()) return null;
  if (!session.admin_users?.is_active) return null;

  return { supabase, admin: session.admin_users };
}

// GET /investors - List all investors
adminInvestorRoute.get('/investors', async (c) => {
  const auth = await verifyAdmin(c);
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { data: investors, error } = await auth.supabase
      .from('users')
      .select('id, email, first_name, last_name, business_name, user_type, investor_status, investor_tier, created_at, last_login')
      .in('user_type', ['investor', 'waitlist'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    return c.json({ success: true, investors: investors || [] });
  } catch (error) {
    console.error('[ADMIN-INVESTOR] List error:', error);
    return c.json({ error: 'Failed to fetch investors' }, 500);
  }
});

// GET /investor/:id/details - Get investor details including NDA
adminInvestorRoute.get('/investor/:investor_id/details', async (c) => {
  const auth = await verifyAdmin(c);
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const investorId = c.req.param('investor_id');

  try {
    // Get investor info
    const { data: investor, error: investorError } = await auth.supabase
      .from('users')
      .select('*')
      .eq('id', investorId)
      .single();

    if (investorError || !investor) {
      return c.json({ error: 'Investor not found' }, 404);
    }

    // Get NDA signature if exists
    const { data: ndaSignature } = await auth.supabase
      .from('nda_signatures')
      .select('*')
      .eq('user_id', investorId)
      .single();

    return c.json({
      success: true,
      investor,
      nda_signature: ndaSignature || null
    });
  } catch (error) {
    console.error('[ADMIN-INVESTOR] Details error:', error);
    return c.json({ error: 'Failed to fetch investor details' }, 500);
  }
});

// POST /investor/:id/approve - Approve investor
adminInvestorRoute.post('/investor/:investor_id/approve', async (c) => {
  const auth = await verifyAdmin(c);
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const investorId = c.req.param('investor_id');

  try {
    const body = await c.req.json().catch(() => ({}));
    const tier = body.tier || 'standard';

    const { data, error } = await auth.supabase
      .from('users')
      .update({
        investor_status: 'active',
        investor_tier: tier,
        user_type: 'investor',
        updated_at: new Date().toISOString()
      })
      .eq('id', investorId)
      .select()
      .single();

    if (error) throw error;

    console.log('[ADMIN-INVESTOR] ✅ Approved investor:', data.email);

    return c.json({
      success: true,
      message: 'Investor approved successfully',
      investor: data
    });
  } catch (error) {
    console.error('[ADMIN-INVESTOR] Approve error:', error);
    return c.json({ error: 'Failed to approve investor' }, 500);
  }
});

// POST /investor/:id/reject - Reject investor
adminInvestorRoute.post('/investor/:investor_id/reject', async (c) => {
  const auth = await verifyAdmin(c);
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const investorId = c.req.param('investor_id');

  try {
    const body = await c.req.json().catch(() => ({}));
    const reason = body.reason || 'No reason provided';

    const { data, error } = await auth.supabase
      .from('users')
      .update({
        investor_status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', investorId)
      .select()
      .single();

    if (error) throw error;

    console.log('[ADMIN-INVESTOR] ❌ Rejected investor:', data.email, 'Reason:', reason);

    return c.json({
      success: true,
      message: 'Investor rejected',
      investor: data
    });
  } catch (error) {
    console.error('[ADMIN-INVESTOR] Reject error:', error);
    return c.json({ error: 'Failed to reject investor' }, 500);
  }
});

// DELETE /investor/:id/delete - Delete investor
adminInvestorRoute.delete('/investor/:investor_id/delete', async (c) => {
  const auth = await verifyAdmin(c);
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const investorId = c.req.param('investor_id');

  try {
    // First delete related records
    // Delete user sessions
    await auth.supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', investorId);

    // Delete NDA signatures
    await auth.supabase
      .from('nda_signatures')
      .delete()
      .eq('user_id', investorId);

    // Delete the user
    const { error } = await auth.supabase
      .from('users')
      .delete()
      .eq('id', investorId);

    if (error) throw error;

    console.log('[ADMIN-INVESTOR] 🗑️ Deleted investor:', investorId);

    return c.json({
      success: true,
      message: 'Investor deleted permanently'
    });
  } catch (error) {
    console.error('[ADMIN-INVESTOR] Delete error:', error);
    return c.json({ error: 'Failed to delete investor' }, 500);
  }
});

// PUT /investor/:id/tier - Update investor tier
adminInvestorRoute.put('/investor/:investor_id/tier', async (c) => {
  const auth = await verifyAdmin(c);
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const investorId = c.req.param('investor_id');

  try {
    const body = await c.req.json();
    const { tier } = body;

    if (!tier) {
      return c.json({ error: 'Tier is required' }, 400);
    }

    const { data, error } = await auth.supabase
      .from('users')
      .update({
        investor_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', investorId)
      .select()
      .single();

    if (error) throw error;

    console.log('[ADMIN-INVESTOR] 📊 Updated tier for:', data.email, 'to:', tier);

    return c.json({
      success: true,
      message: 'Investor tier updated',
      investor: data
    });
  } catch (error) {
    console.error('[ADMIN-INVESTOR] Tier update error:', error);
    return c.json({ error: 'Failed to update tier' }, 500);
  }
});

export default adminInvestorRoute;
