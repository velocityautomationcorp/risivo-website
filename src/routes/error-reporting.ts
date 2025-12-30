import { Hono } from 'hono';
import { EmailService } from '../utils/email';

type Bindings = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
  FROM_EMAIL?: string;
  FROM_NAME?: string;
  ADMIN_EMAIL?: string;
};

const errorReportingRoute = new Hono<{ Bindings: Bindings }>();

// Helper to get email service
function getEmailService(env: Bindings) {
  if (!env.SENDGRID_API_KEY) return null;
  return new EmailService({
    SENDGRID_API_KEY: env.SENDGRID_API_KEY,
    FROM_EMAIL: env.FROM_EMAIL || 'hello@risivo.com',
    FROM_NAME: env.FROM_NAME || 'Risivo System',
    ADMIN_EMAIL: env.ADMIN_EMAIL || 'admin@risivo.com'
  });
}

// Rate limiting - simple in-memory store (resets on deploy)
const errorReports: Map<string, { count: number; lastReport: number }> = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REPORTS_PER_WINDOW = 5;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = errorReports.get(identifier);
  
  if (!record) {
    errorReports.set(identifier, { count: 1, lastReport: now });
    return false;
  }
  
  if (now - record.lastReport > RATE_LIMIT_WINDOW) {
    errorReports.set(identifier, { count: 1, lastReport: now });
    return false;
  }
  
  if (record.count >= MAX_REPORTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  record.lastReport = now;
  return false;
}

// POST /api/report-error - Client-side error reporting
errorReportingRoute.post('/report-error', async (c) => {
  try {
    const body = await c.req.json();
    const {
      errorType,
      errorMessage,
      errorStack,
      userEmail,
      userName,
      userType,
      pageUrl,
      additionalInfo
    } = body;

    // Basic validation
    if (!errorType || !errorMessage) {
      return c.json({ success: false, error: 'Error type and message are required' }, 400);
    }

    // Get client info
    const userAgent = c.req.header('user-agent') || 'Unknown';
    const ipAddress = c.req.header('cf-connecting-ip') || 
                      c.req.header('x-forwarded-for') || 
                      c.req.header('x-real-ip') || 
                      'Unknown';

    // Rate limiting by IP + error type
    const rateLimitKey = `${ipAddress}_${errorType}`;
    if (isRateLimited(rateLimitKey)) {
      console.log('[ERROR_REPORT] Rate limited:', rateLimitKey);
      return c.json({ success: true, message: 'Error noted (rate limited)' });
    }

    // Send email
    const emailService = getEmailService(c.env as Bindings);
    if (emailService) {
      await emailService.sendErrorReport({
        errorType,
        errorMessage,
        errorStack,
        userEmail,
        userName,
        userType,
        pageUrl,
        userAgent,
        ipAddress,
        additionalInfo
      });

      console.log('[ERROR_REPORT] ✅ Error report sent to admin');
      console.log('[ERROR_REPORT] Type:', errorType);
      console.log('[ERROR_REPORT] Message:', errorMessage.substring(0, 100));
      console.log('[ERROR_REPORT] User:', userEmail || 'Anonymous');
    } else {
      console.error('[ERROR_REPORT] ❌ Email service not available');
      // Still log the error
      console.error('[ERROR_REPORT] Error details:', {
        errorType,
        errorMessage,
        userEmail,
        pageUrl
      });
    }

    return c.json({ success: true, message: 'Error reported successfully' });
  } catch (error) {
    console.error('[ERROR_REPORT] Failed to process error report:', error);
    return c.json({ success: false, error: 'Failed to report error' }, 500);
  }
});

// POST /api/report-error/server - Server-side error reporting (internal use)
errorReportingRoute.post('/report-error/server', async (c) => {
  try {
    // This could be called internally when server errors occur
    const body = await c.req.json();
    
    const emailService = getEmailService(c.env as Bindings);
    if (emailService) {
      await emailService.sendErrorReport({
        errorType: body.errorType || 'Server Error',
        errorMessage: body.errorMessage || 'Unknown server error',
        errorStack: body.errorStack,
        userEmail: body.userEmail,
        userName: body.userName,
        userType: body.userType || 'system',
        pageUrl: body.endpoint || body.pageUrl,
        userAgent: c.req.header('user-agent'),
        ipAddress: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for'),
        additionalInfo: body.additionalInfo
      });
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('[ERROR_REPORT] Server error reporting failed:', error);
    return c.json({ success: false }, 500);
  }
});

export default errorReportingRoute;
