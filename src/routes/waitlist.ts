import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';

type Bindings = {
  WEBHOOK_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// POST /api/waitlist/join - Join waitlist
app.post('/join', async (c) => {
  try {
    // Get form data from request
    const body = await c.req.json();
    const {
      language,
      business_name,
      first_name,
      last_name,
      email,
      timestamp,
      source,
      discount_offer,
    } = body;

    console.log('[WAITLIST] ========================================');
    console.log('[WAITLIST] 📝 New waitlist submission');
    console.log('[WAITLIST] Email:', email);
    console.log('[WAITLIST] Name:', first_name, last_name);
    console.log('[WAITLIST] Language:', language);
    console.log('[WAITLIST] Business:', business_name || 'N/A');
    console.log('[WAITLIST] ========================================');

    // Validate required fields
    if (!email || !first_name || !last_name || !language || !business_name) {
      console.error('[WAITLIST] ❌ Missing required fields');
      return c.json(
        {
          error: 'Missing required fields',
          details: 'Please provide email, first name, last name, business name, and preferred language',
        },
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('[WAITLIST] ❌ Invalid email format:', email);
      return c.json(
        {
          error: 'Invalid email format',
          details: 'Please provide a valid email address',
        },
        400
      );
    }

    // Get environment variables
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    const webhookUrl = c.env?.WEBHOOK_URL;

    console.log('[WAITLIST] 🔧 Environment check:');
    console.log('[WAITLIST] - Supabase URL:', !!supabaseUrl);
    console.log('[WAITLIST] - Supabase Key:', !!supabaseKey);
    console.log('[WAITLIST] - Webhook URL:', !!webhookUrl);

    // Validate Supabase configuration
    if (!supabaseUrl || !supabaseKey) {
      console.error('[WAITLIST] ❌ Supabase not configured');
      return c.json(
        {
          error: 'Service configuration incomplete',
          details: 'Database connection not available. Please contact support.',
        },
        503
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists
    console.log('[WAITLIST] 🔍 Checking for duplicate email...');
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_users')
      .select('id, waitlist_number')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is good - means no duplicate)
      console.error('[WAITLIST] ❌ Database error during duplicate check:', checkError);
      return c.json(
        {
          error: 'Database error',
          details: 'Failed to check for existing email',
        },
        500
      );
    }

    // If user already exists, return their waitlist number
    if (existingUser) {
      console.log('[WAITLIST] ℹ️ Email already registered');
      console.log('[WAITLIST] Waitlist number:', existingUser.waitlist_number);
      return c.json({
        success: true,
        message: 'You are already on the waitlist!',
        waitlist_number: existingUser.waitlist_number,
        already_registered: true,
      });
    }

    // Insert new user into Supabase (waitlist_number will be auto-assigned by trigger)
    console.log('[WAITLIST] 💾 Creating new waitlist entry...');
    const { data: newUser, error: insertError } = await supabase
      .from('waitlist_users')
      .insert({
        email: email.toLowerCase(),
        first_name,
        last_name,
        business_name,
        preferred_language: language,
        status: 'pending',
      })
      .select('id, waitlist_number')
      .single();

    if (insertError) {
      console.error('[WAITLIST] ❌ Database insert error:', insertError);
      return c.json(
        {
          error: 'Database error',
          details: 'Failed to create waitlist entry',
        },
        500
      );
    }

    console.log('[WAITLIST] ✅ Supabase entry created');
    console.log('[WAITLIST] ID:', newUser.id);
    console.log('[WAITLIST] Waitlist Number:', newUser.waitlist_number);

    // Send to Make.com webhook if configured
    if (webhookUrl) {
      console.log('[WAITLIST] 📤 Sending to Make.com webhook...');
      
      const webhookData = {
        email,
        first_name,
        last_name,
        business_name: business_name || '',
        preferred_language: language,
        waitlist_number: newUser.waitlist_number,
        timestamp,
        source,
        discount_offer,
        user_id: newUser.id,
      };

      console.log('[WAITLIST] 📦 Webhook payload:', JSON.stringify(webhookData, null, 2));

      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        console.log('[WAITLIST] Webhook response status:', webhookResponse.status);
        console.log('[WAITLIST] Webhook response ok:', webhookResponse.ok);

        if (!webhookResponse.ok) {
          const errorText = await webhookResponse.text();
          console.error('[WAITLIST] ⚠️ Webhook error (non-critical):', errorText);
          // Don't fail the request if webhook fails - user is already in database
        } else {
          const responseText = await webhookResponse.text();
          console.log('[WAITLIST] ✅ Webhook successful:', responseText);
        }
      } catch (webhookError) {
        console.error('[WAITLIST] ⚠️ Webhook fetch error (non-critical):', webhookError);
        // Don't fail the request if webhook fails - user is already in database
      }
    } else {
      console.warn('[WAITLIST] ⚠️ Webhook URL not configured - skipping Make.com notification');
    }

    console.log('[WAITLIST] ========================================');
    console.log('[WAITLIST] ✅ SUCCESS - Waitlist registration complete');
    console.log('[WAITLIST] Waitlist Number:', newUser.waitlist_number);
    console.log('[WAITLIST] ========================================');

    // Return success response
    return c.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      waitlist_number: newUser.waitlist_number,
      user_id: newUser.id,
    });
  } catch (error) {
    console.error('[WAITLIST] ========================================');
    console.error('[WAITLIST] 🔥 FATAL ERROR');
    console.error('[WAITLIST] Error:', error);
    if (error instanceof Error) {
      console.error('[WAITLIST] Error name:', error.name);
      console.error('[WAITLIST] Error message:', error.message);
      console.error('[WAITLIST] Error stack:', error.stack);
    }
    console.error('[WAITLIST] ========================================');

    return c.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      500
    );
  }
});

export default app;
