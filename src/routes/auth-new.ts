// src/routes/auth-new.ts
// New authentication routes for waitlist/investor signup

import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';
import { signupWaitlist } from '../api/auth/signup-waitlist';
import { signupInvestor } from '../api/auth/signup-investor';
import { login } from '../api/auth/login';
import { signNDA } from '../api/investor/sign-nda';
import { checkNDA, getCurrentUser } from '../api/investor/check-nda';
import { getInvestorContent } from '../api/investor/get-content';
import { accessInvestorContent } from '../api/investor/access-content';
import { forgotPassword } from '../api/auth/forgot-password';
import { resetPassword } from '../api/auth/reset-password';
import { WaitlistSignupPage } from '../pages/signup-waitlist';
import { InvestorSignupPage } from '../pages/signup-investor';
import { ForgotPasswordPage } from '../pages/forgot-password-new';
import { ResetPasswordNewPage } from '../pages/reset-password-new';
import { InvestorNDAReviewPage } from '../pages/investor-nda-review';
import { InvestorDashboardPageV2 } from '../pages/investor-dashboard-v2';
import { requireNDA } from '../middleware/require-nda';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const authNewRoute = new Hono<{ Bindings: Bindings }>();

// Signup page routes (HTML)
authNewRoute.get('/signup/waitlist', (c) => {
  return c.html(WaitlistSignupPage());
});

authNewRoute.get('/signup/investor', (c) => {
  const email = c.req.query('email') || '';
  const firstName = c.req.query('first_name') || '';
  const lastName = c.req.query('last_name') || '';
  const businessName = c.req.query('business_name') || '';
  
  return c.html(InvestorSignupPage(email, firstName, lastName, businessName));
});

// Password reset page routes
authNewRoute.get('/forgot-password', (c) => {
  return c.html(ForgotPasswordPage());
});

authNewRoute.get('/reset-password', (c) => {
  const token = c.req.query('token') || '';
  const email = c.req.query('email') || '';
  
  return c.html(ResetPasswordNewPage(token, email));
});

// Investor NDA review page (no middleware - this is where they sign)
authNewRoute.get('/investor/nda-review', async (c) => {
  // Try to get user data from session for pre-filling the form
  let userData = { first_name: '', last_name: '', business_name: '' };
  
  try {
    const sessionToken = getCookie(c, 'user_session') || getCookie(c, 'session');
    
    if (sessionToken) {
      const supabaseUrl = c.env?.SUPABASE_URL;
      const supabaseKey = c.env?.SUPABASE_SERVICE_ROLE_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Get user from session
        const { data: session } = await supabase
          .from('user_sessions')
          .select('user_id')
          .eq('session_token', sessionToken)
          .gt('expires_at', new Date().toISOString())
          .single();
        
        if (session?.user_id) {
          const { data: user } = await supabase
            .from('users')
            .select('first_name, last_name, business_name')
            .eq('id', session.user_id)
            .single();
          
          if (user) {
            userData = user;
          }
        }
      }
    }
  } catch (error) {
    console.error('[NDA Page] Error fetching user data:', error);
    // Continue with empty user data - form will be blank
  }
  
  return c.html(InvestorNDAReviewPage(userData));
});

// Investor dashboard page (PROTECTED - requires NDA signature)
authNewRoute.get('/investor/dashboard', requireNDA, (c) => {
  return c.html(InvestorDashboardPageV2());
});

// Signup API routes (POST)
authNewRoute.post('/signup/waitlist', signupWaitlist);
authNewRoute.post('/signup/investor', signupInvestor);

// Login route
authNewRoute.post('/login', login);

// Password reset API routes
authNewRoute.post('/forgot-password', forgotPassword);
authNewRoute.post('/reset-password', resetPassword);

// NDA signature route
authNewRoute.post('/investor/sign-nda', signNDA);

// Investor content routes
authNewRoute.get('/investor/content', getInvestorContent);
authNewRoute.get('/investor/content/:content_id/access', accessInvestorContent);

// Check NDA status and get user info
authNewRoute.get('/investor/check-nda', checkNDA);
authNewRoute.get('/me', getCurrentUser);

export default authNewRoute;
