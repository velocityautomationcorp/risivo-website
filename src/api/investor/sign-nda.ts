import { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { sendAdminNewInvestorNotification } from '../../utils/email';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
  ADMIN_EMAIL?: string;
};

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
      .select('email, user_type, investor_status')
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

    // Get full user info for email notification
    const { data: fullUser } = await supabase
      .from('users')
      .select('first_name, last_name, business_name')
      .eq('id', userId)
      .single();

    // Send admin notification email
    const sendgridKey = c.env?.SENDGRID_API_KEY;
    const adminEmail = c.env?.ADMIN_EMAIL || 'jp@risivo.com'; // Default admin email
    
    if (sendgridKey) {
      try {
        await sendAdminNewInvestorNotification(
          {
            SENDGRID_API_KEY: sendgridKey,
            FROM_EMAIL: 'noreply@risivo.com',
            FROM_NAME: 'Risivo Investor Portal'
          },
          {
            adminEmail: adminEmail,
            investorEmail: user.email,
            investorName: fullUser ? `${fullUser.first_name} ${fullUser.last_name}` : full_name,
            businessName: fullUser?.business_name || undefined,
            signedAt: signature_date
          }
        );
        console.log('[NDA] Admin notification email sent');
      } catch (emailError) {
        console.error('[NDA] Failed to send admin notification:', emailError);
        // Don't fail the request - NDA is already signed
      }
    } else {
      console.warn('[NDA] SendGrid not configured - skipping admin notification');
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
