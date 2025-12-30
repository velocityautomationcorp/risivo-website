import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { EmailService, generateTempPassword, generateVerificationToken } from '../utils/email';

type Bindings = {
  WEBHOOK_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
  ADMIN_EMAIL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Helper to get email service
function getEmailService(env: Bindings): EmailService | null {
  if (!env.SENDGRID_API_KEY) return null;
  return new EmailService({
    SENDGRID_API_KEY: env.SENDGRID_API_KEY,
    FROM_EMAIL: 'hello@risivo.com',
    FROM_NAME: 'Risivo Team',
    ADMIN_EMAIL: env.ADMIN_EMAIL || 'admin@risivo.com'
  });
}

// POST /api/waitlist/signup - New waitlist registration with email verification
app.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { first_name, last_name, email, phone, business_name } = body;

    console.log('[WAITLIST-SIGNUP] ========================================');
    console.log('[WAITLIST-SIGNUP] 📝 New waitlist signup');
    console.log('[WAITLIST-SIGNUP] Email:', email);
    console.log('[WAITLIST-SIGNUP] Name:', first_name, last_name);
    console.log('[WAITLIST-SIGNUP] ========================================');

    // Validate required fields
    if (!first_name || !last_name || !email || !phone || !business_name) {
      return c.json({
        success: false,
        error: 'All fields are required',
        details: 'Please provide first name, last name, email, phone, and business name'
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({
        success: false,
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      }, 400);
    }

    // Get Supabase client
    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[WAITLIST-SIGNUP] ❌ Supabase not configured');
      return c.json({
        success: false,
        error: 'Service unavailable',
        details: 'Database connection not available'
      }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists in waitlist_users
    const { data: existingWaitlist } = await supabase
      .from('waitlist_users')
      .select('id, email_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (existingWaitlist) {
      if (existingWaitlist.email_verified) {
        return c.json({
          success: false,
          error: 'Email already registered',
          details: 'This email is already on the waitlist. Please sign in instead.'
        }, 400);
      } else {
        // Resend verification email
        const verificationToken = generateVerificationToken();
        
        await supabase
          .from('waitlist_users')
          .update({ verification_token: verificationToken, updated_at: new Date().toISOString() })
          .eq('id', existingWaitlist.id);

        const emailService = getEmailService(c.env as Bindings);
        if (emailService) {
          await emailService.sendWaitlistVerificationEmail({
            email: email.toLowerCase(),
            firstName: first_name,
            verificationToken
          });
        }

        return c.json({
          success: true,
          message: 'Verification email resent. Please check your inbox.'
        });
      }
    }

    // Also check users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return c.json({
        success: false,
        error: 'Email already registered',
        details: 'This email is already registered. Please sign in instead.'
      }, 400);
    }

    // Generate verification token and temp password
    const verificationToken = generateVerificationToken();
    const tempPassword = generateTempPassword(12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create waitlist user - using only confirmed columns from schema
    const insertData = {
      email: email.toLowerCase(),
      first_name,
      last_name,
      phone,
      business_name,
      password_hash: hashedPassword,
      verification_token: verificationToken,
      email_verified: false,
      status: 'pending',
      is_active: false
    };
    
    console.log('[WAITLIST-SIGNUP] 📦 Insert data:', JSON.stringify(insertData, null, 2));
    
    const { data: newUser, error: insertError } = await supabase
      .from('waitlist_users')
      .insert(insertData)
      .select('id, waitlist_number')
      .single();

    if (insertError) {
      console.error('[WAITLIST-SIGNUP] ❌ Insert error:', JSON.stringify(insertError, null, 2));
      console.error('[WAITLIST-SIGNUP] ❌ Error code:', insertError.code);
      console.error('[WAITLIST-SIGNUP] ❌ Error message:', insertError.message);
      console.error('[WAITLIST-SIGNUP] ❌ Error details:', insertError.details);
      return c.json({
        success: false,
        error: 'Registration failed',
        details: insertError.message || 'Unable to create account. Please try again.'
      }, 500);
    }

    console.log('[WAITLIST-SIGNUP] ✅ User created:', newUser.id);

    // Send verification email
    const emailService = getEmailService(c.env as Bindings);
    if (emailService) {
      try {
        await emailService.sendWaitlistVerificationEmail({
          email: email.toLowerCase(),
          firstName: first_name,
          verificationToken
        });
        console.log('[WAITLIST-SIGNUP] ✅ Verification email sent');

        // Send admin notification
        await emailService.sendAdminNotification({
          type: 'waitlist_signup',
          userData: {
            firstName: first_name,
            lastName: last_name,
            email: email.toLowerCase(),
            phone,
            businessName: business_name
          }
        });
        console.log('[WAITLIST-SIGNUP] ✅ Admin notification sent');
      } catch (emailError) {
        console.error('[WAITLIST-SIGNUP] ⚠️ Email error:', emailError);
      }
    }

    // Also send to Make.com webhook if configured
    const webhookUrl = c.env?.WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.toLowerCase(),
            first_name,
            last_name,
            phone,
            business_name,
            waitlist_number: newUser.waitlist_number,
            source: 'waitlist-signup',
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookError) {
        console.error('[WAITLIST-SIGNUP] ⚠️ Webhook error:', webhookError);
      }
    }

    return c.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('[WAITLIST-SIGNUP] 🔥 Error:', error);
    return c.json({
      success: false,
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// POST /api/waitlist/verify-email - Verify email and activate account
app.post('/verify-email', async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;

    if (!token) {
      return c.json({
        success: false,
        error: 'Verification token required'
      }, 400);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ success: false, error: 'Service unavailable' }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user by verification token
    const { data: user, error: findError } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (findError || !user) {
      return c.json({
        success: false,
        error: 'Invalid or expired verification link'
      }, 400);
    }

    if (user.email_verified) {
      return c.json({
        success: true,
        message: 'Email already verified. You can sign in now.',
        redirect: '/waitlist/login'
      });
    }

    // Generate new temp password for confirmed user
    const tempPassword = generateTempPassword(12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user as verified and active
    const { error: updateError } = await supabase
      .from('waitlist_users')
      .update({
        email_verified: true,
        is_active: true,
        status: 'active',
        password_hash: hashedPassword,
        verification_token: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[WAITLIST-VERIFY] Update error:', updateError);
      return c.json({
        success: false,
        error: 'Verification failed'
      }, 500);
    }

    // Send confirmation email with credentials
    const emailService = getEmailService(c.env as Bindings);
    if (emailService) {
      try {
        await emailService.sendWaitlistConfirmationEmail({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          tempPassword,
          loginUrl: 'https://risivo.com/waitlist/login'
        });
        console.log('[WAITLIST-VERIFY] ✅ Confirmation email sent');
      } catch (emailError) {
        console.error('[WAITLIST-VERIFY] ⚠️ Email error:', emailError);
      }
    }

    return c.json({
      success: true,
      message: 'Email verified successfully! Check your inbox for login credentials.',
      redirect: '/waitlist/login'
    });
  } catch (error) {
    console.error('[WAITLIST-VERIFY] Error:', error);
    return c.json({
      success: false,
      error: 'Verification failed'
    }, 500);
  }
});

// GET /api/waitlist/verify - Verify email via GET (for link clicks)
app.get('/verify', async (c) => {
  try {
    const token = c.req.query('token');

    if (!token) {
      return c.redirect('/waitlist/login?error=invalid_token');
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return c.redirect('/waitlist/login?error=service_unavailable');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user by verification token
    const { data: user, error: findError } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (findError || !user) {
      return c.redirect('/waitlist/login?error=invalid_token');
    }

    if (user.email_verified) {
      return c.redirect('/waitlist/login?message=already_verified');
    }

    // Generate new temp password
    const tempPassword = generateTempPassword(12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user as verified
    await supabase
      .from('waitlist_users')
      .update({
        email_verified: true,
        is_active: true,
        status: 'active',
        password_hash: hashedPassword,
        verification_token: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    // Send confirmation email
    const emailService = getEmailService(c.env as Bindings);
    if (emailService) {
      try {
        await emailService.sendWaitlistConfirmationEmail({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          tempPassword,
          loginUrl: 'https://risivo.com/waitlist/login'
        });
      } catch (emailError) {
        console.error('[WAITLIST-VERIFY] Email error:', emailError);
      }
    }

    return c.redirect('/waitlist/login?verified=true');
  } catch (error) {
    console.error('[WAITLIST-VERIFY] Error:', error);
    return c.redirect('/waitlist/login?error=verification_failed');
  }
});

// POST /api/waitlist/join - Join waitlist (legacy endpoint)
app.post('/join', async (c) => {
  try {
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
      return c.json({
        error: 'Missing required fields',
        details: 'Please provide email, first name, last name, business name, and preferred language',
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('[WAITLIST] ❌ Invalid email format:', email);
      return c.json({
        error: 'Invalid email format',
        details: 'Please provide a valid email address',
      }, 400);
    }

    const supabaseUrl = c.env?.SUPABASE_URL;
    const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
    const webhookUrl = c.env?.WEBHOOK_URL;

    if (!supabaseUrl || !supabaseKey) {
      return c.json({
        error: 'Service configuration incomplete',
        details: 'Database connection not available. Please contact support.',
      }, 503);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_users')
      .select('id, waitlist_number')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return c.json({
        error: 'Database error',
        details: 'Failed to check for existing email',
      }, 500);
    }

    if (existingUser) {
      return c.json({
        success: true,
        message: 'You are already on the waitlist!',
        waitlist_number: existingUser.waitlist_number,
        already_registered: true,
      });
    }

    // Insert new user
    const tempPassword = generateTempPassword(12);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('waitlist_users')
      .insert({
        email: email.toLowerCase(),
        first_name,
        last_name,
        business_name,
        preferred_language: language,
        password_hash: hashedPassword,
        is_active: true,
        email_verified: true,
        status: 'active',
      })
      .select('id, waitlist_number')
      .single();

    if (insertError) {
      return c.json({
        error: 'Database error',
        details: 'Failed to create waitlist entry',
      }, 500);
    }

    // Send welcome email
    const emailService = getEmailService(c.env as Bindings);
    if (emailService) {
      try {
        await emailService.sendWelcomeEmail({
          email,
          firstName: first_name,
          lastName: last_name,
          businessName: business_name,
          tempPassword,
          waitlistNumber: newUser.waitlist_number
        });

        await emailService.sendAdminNotification({
          type: 'waitlist_signup',
          userData: {
            firstName: first_name,
            lastName: last_name,
            email,
            businessName: business_name
          }
        });
      } catch (emailError) {
        console.error('[WAITLIST] ⚠️ Email error:', emailError);
      }
    }

    // Send to webhook
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            first_name,
            last_name,
            business_name,
            preferred_language: language,
            waitlist_number: newUser.waitlist_number,
            timestamp,
            source,
            discount_offer,
            user_id: newUser.id,
          }),
        });
      } catch (webhookError) {
        console.error('[WAITLIST] ⚠️ Webhook error:', webhookError);
      }
    }

    return c.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      waitlist_number: newUser.waitlist_number,
      user_id: newUser.id,
    });
  } catch (error) {
    console.error('[WAITLIST] 🔥 Error:', error);
    return c.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    }, 500);
  }
});

export default app;
