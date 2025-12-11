import { Hono } from "hono";

type Bindings = {
  WEBHOOK_URL?: string;
  ENABLE_FULL_SITE?: string;
  ENVIRONMENT?: string;
  DATABASE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Base64 encoded logo
const LOGO_BASE64 = `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`;

// Base64 encoded favicon
const FAVICON_BASE64 = `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`;

// Debug endpoint to check configuration
app.get("/api/health", (c) => {
  const hasWebhook = !!c.env?.WEBHOOK_URL;
  return c.json({
    status: "ok",
    webhookConfigured: hasWebhook,
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to inspect webhook URL for hidden characters
app.get("/api/debug-webhook", (c) => {
  const webhookUrl = c.env?.WEBHOOK_URL || "";

  if (!webhookUrl) {
    return c.json({ error: "WEBHOOK_URL not set" });
  }

  // Show character codes to find hidden characters
  const charCodes = Array.from(webhookUrl.substring(0, 60)).map((char, i) => ({
    index: i,
    char: char,
    code: char.charCodeAt(0),
    hex: "0x" + char.charCodeAt(0).toString(16).padStart(2, "0"),
    isPrintable: char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126,
  }));

  return c.json({
    length: webhookUrl.length,
    first60chars: webhookUrl.substring(0, 60),
    charCodes: charCodes,
    hasControlChars: charCodes.some((c) => !c.isPrintable),
    controlChars: charCodes.filter((c) => !c.isPrintable),
  });
});

// API endpoint for email subscriptions
app.post("/api/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email, timestamp, source } = body;

    // Validate email first
    if (!email || !email.includes("@")) {
      console.error("Invalid email:", email);
      return c.json({ error: "Invalid email address" }, 400);
    }

    // Get webhook URL from environment variable
    const webhookUrl = c.env?.WEBHOOK_URL || "";

    console.log("[SUBSCRIBE] ========================================");
    console.log("[SUBSCRIBE] 📧 Email:", email);
    console.log("[SUBSCRIBE] 🔗 Webhook configured:", !!webhookUrl);
    console.log("[SUBSCRIBE] ========================================");

    if (!webhookUrl) {
      console.error(
        "[SUBSCRIBE] WEBHOOK_URL not configured in environment variables"
      );
      console.error(
        "[SUBSCRIBE] Email cannot be saved without webhook configuration"
      );
      // Return error to alert user that configuration is needed
      return c.json(
        {
          error: "Service configuration incomplete. Please contact support.",
          code: "WEBHOOK_NOT_CONFIGURED",
        },
        503
      );
    }

    console.log(
      "[SUBSCRIBE] 🚀 Webhook URL (first 40 chars):",
      webhookUrl.substring(0, 40) + "..."
    );
    console.log("[SUBSCRIBE] 📤 Sending data to Make.com...");
    console.log(
      "[SUBSCRIBE] 📦 Data being sent:",
      JSON.stringify(
        {
          email,
          timestamp,
          source,
          subscribed_at: new Date().toISOString(),
          page_url: c.req.url,
        },
        null,
        2
      )
    );

    // Send to Make.com webhook with timeout
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          timestamp,
          source,
          subscribed_at: new Date().toISOString(),
          page_url: c.req.url,
        }),
      });

      console.log("[SUBSCRIBE] ========================================");
      console.log(
        "[SUBSCRIBE] Webhook response status:",
        webhookResponse.status
      );
      console.log("[SUBSCRIBE] Webhook response ok:", webhookResponse.ok);
      console.log("[SUBSCRIBE] ========================================");

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error(
          "[SUBSCRIBE] ❌ WEBHOOK ERROR - Status:",
          webhookResponse.status
        );
        console.error("[SUBSCRIBE] ❌ Error response:", errorText);
        console.error("[SUBSCRIBE] ❌ This means Make.com rejected the data");
        console.error("[SUBSCRIBE] ========================================");

        // Return more detailed error to help debug
        return c.json(
          {
            success: false,
            error: "Webhook processing failed",
            details: {
              status: webhookResponse.status,
              message: errorText,
              hint: "Check Make.com scenario - it might be off, in error state, or expecting different data format",
            },
          },
          502
        );
      }

      const responseText = await webhookResponse.text();
      console.log("[SUBSCRIBE] ✅ SUCCESS - Make.com accepted the data");
      console.log("[SUBSCRIBE] ✅ Response body:", responseText);
      console.log("[SUBSCRIBE] ========================================");

      return c.json({
        success: true,
        message: "Email subscription successful! Check Make.com to verify.",
      });
    } catch (fetchError) {
      console.error("[SUBSCRIBE] ========================================");
      console.error("[SUBSCRIBE] 🔥 FETCH EXCEPTION (not HTTP error)");
      console.error(
        "[SUBSCRIBE] 🔥 This means network timeout, DNS failure, or connection refused"
      );
      console.error("[SUBSCRIBE] 🔥 Fetch error:", fetchError);
      if (fetchError instanceof Error) {
        console.error("[SUBSCRIBE] 🔥 Error name:", fetchError.name);
        console.error("[SUBSCRIBE] 🔥 Error message:", fetchError.message);
      }
      console.error("[SUBSCRIBE] ========================================");

      // Return detailed error to help debug
      return c.json(
        {
          success: false,
          error: "Failed to connect to webhook",
          details: {
            type: "network_error",
            message:
              fetchError instanceof Error
                ? fetchError.message
                : "Unknown fetch error",
            hint: "This is a network/connection issue, not an HTTP error. Check if webhook URL is accessible.",
          },
        },
        503
      );
    }
  } catch (error) {
    console.error("[SUBSCRIBE] General error:", error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error("[SUBSCRIBE] Error name:", error.name);
      console.error("[SUBSCRIBE] Error message:", error.message);
      console.error("[SUBSCRIBE] Error stack:", error.stack);
    }
    return c.json(
      {
        error: "Failed to process subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Coming Soon Page
app.get("/", (c) => {
  const launchDate = new Date("2026-03-01T00:00:00Z").getTime();

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Risivo - Coming Soon</title>
        <meta name="description" content="Risivo - The Future of CRM is Coming. Transform how you manage customers, close deals, and grow your business.">
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${FAVICON_BASE64}">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }
            
            /* Animated background elements */
            .bg-shape {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.05);
                animation: float 20s infinite ease-in-out;
            }
            
            .shape-1 {
                width: 300px;
                height: 300px;
                top: -100px;
                left: -100px;
                animation-delay: 0s;
            }
            
            .shape-2 {
                width: 200px;
                height: 200px;
                bottom: -50px;
                right: -50px;
                animation-delay: 5s;
            }
            
            .shape-3 {
                width: 150px;
                height: 150px;
                top: 50%;
                right: 10%;
                animation-delay: 10s;
            }
            
            @keyframes float {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(30px, 30px) scale(1.1); }
            }
            
            .container {
                position: relative;
                z-index: 1;
                text-align: center;
                padding: 2rem;
                max-width: 800px;
                width: 100%;
            }
            
            .logo {
                margin-bottom: 2rem;
                display: flex;
                justify-content: center;
            }
            
            .logo img {
                max-width: 250px;
                height: auto;
                filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15));
            }
            
            .subtitle {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1rem;
                opacity: 0.9;
            }
            
            .description {
                font-size: 1.125rem;
                line-height: 1.6;
                opacity: 0.8;
                margin-bottom: 3rem;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .countdown {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin: 3rem 0;
                flex-wrap: wrap;
            }
            
            .countdown-item {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 1.5rem 2rem;
                min-width: 120px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .countdown-number {
                font-size: 3rem;
                font-weight: 800;
                display: block;
                line-height: 1;
            }
            
            .countdown-label {
                font-size: 0.875rem;
                text-transform: uppercase;
                opacity: 0.7;
                margin-top: 0.5rem;
                letter-spacing: 1px;
            }
            
            .email-form {
                display: flex;
                gap: 1rem;
                max-width: 500px;
                margin: 3rem auto 2rem;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .email-input {
                flex: 1;
                min-width: 250px;
                padding: 1rem 1.5rem;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                color: white;
                font-size: 1rem;
                outline: none;
                transition: all 0.3s ease;
            }
            
            .email-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
            
            .email-input:focus {
                border-color: rgba(255, 255, 255, 0.6);
                background: rgba(255, 255, 255, 0.15);
            }
            
            .submit-btn {
                padding: 1rem 2.5rem;
                background: white;
                color: #667eea;
                border: none;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            
            .submit-btn:active {
                transform: translateY(0);
            }
            
            .social-links {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                margin-top: 3rem;
            }
            
            .social-link {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: white;
                font-size: 1.25rem;
                transition: all 0.3s ease;
            }
            
            .social-link:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-3px);
            }
            
            .footer {
                margin-top: 4rem;
                opacity: 0.6;
                font-size: 0.875rem;
            }
            
            .success-message {
                display: none;
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid rgba(76, 175, 80, 0.4);
                padding: 1rem;
                border-radius: 12px;
                margin-top: 1rem;
            }
            
            .success-message.show {
                display: block;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .logo img {
                    max-width: 200px;
                }
                
                .countdown {
                    gap: 1rem;
                }
                
                .countdown-item {
                    min-width: 90px;
                    padding: 1rem 1.5rem;
                }
                
                .countdown-number {
                    font-size: 2rem;
                }
                
                .email-form {
                    flex-direction: column;
                }
                
                .email-input {
                    min-width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
        
        <div class="container">
            <div class="logo">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Risivo" />
            </div>
            
            <div class="subtitle">No. 1 CRM 100% Powered by AI</div>
            
            <p class="description">
                The world's first AI-powered CRM with built-in translation, voice automation, and intelligent workflows. Reach customers in 15+ languages, automate follow-ups, and scale globally—launching soon.
            </p>
            
            <div class="countdown" id="countdown">
                <div class="countdown-item">
                    <span class="countdown-number" id="days">00</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="hours">00</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="minutes">00</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="seconds">00</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
            
            <form class="email-form" id="emailForm">
                <input 
                    type="email" 
                    class="email-input" 
                    placeholder="Enter your email address" 
                    required 
                    id="emailInput"
                >
                <button type="submit" class="submit-btn">Notify Me</button>
            </form>
            
            <div class="success-message" id="successMessage">
                ✓ Thanks! We'll notify you when we launch.
            </div>
            
            <div class="social-links">
                <a href="#" class="social-link" aria-label="Twitter">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                </a>
                <a href="#" class="social-link" aria-label="LinkedIn">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                        <circle cx="4" cy="4" r="2"/>
                    </svg>
                </a>
                <a href="#" class="social-link" aria-label="Facebook">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                </a>
            </div>
            
            <div class="footer">
                © <span id="currentYear"></span> Risivo. All rights reserved.
            </div>
        </div>
        
        <script>
            // Countdown Timer - March 1st, 2026 at 00:00 UTC
            // Using Date.UTC for better browser compatibility
            const launchDate = Date.UTC(2026, 2, 1, 0, 0, 0); // Note: Month is 0-indexed (2 = March)
            
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = launchDate - now;
                
                if (distance < 0) {
                    document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">🚀</span><span class="countdown-label">Launched!</span></div>';
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = String(days).padStart(2, '0');
                document.getElementById('hours').textContent = String(hours).padStart(2, '0');
                document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
                document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
            }
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
            
            // Set current year dynamically
            document.getElementById('currentYear').textContent = new Date().getFullYear();
            
            // Check API health on page load
            fetch('/api/health')
                .then(r => r.json())
                .then(data => {
                    console.log('[HEALTH CHECK] API Status:', data);
                    if (!data.webhookConfigured) {
                        console.warn('[HEALTH CHECK] Webhook is not configured!');
                    }
                })
                .catch(err => console.error('[HEALTH CHECK] Failed:', err));
            
            // Email Form with Webhook Integration
            document.getElementById('emailForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('emailInput').value.trim();
                const submitBtn = document.querySelector('.submit-btn');
                const successMessage = document.getElementById('successMessage');
                
                console.log('[FORM] Submitting email:', email);
                console.log('[FORM] Email length:', email.length);
                console.log('[FORM] Email includes @:', email.includes('@'));
                
                // Very simple email validation - just check for @ and .
                if (!email || email.length < 5 || !email.includes('@') || !email.includes('.')) {
                    console.warn('[FORM] Invalid email format');
                    successMessage.textContent = '⚠ Please enter a valid email address.';
                    successMessage.style.background = 'rgba(255, 152, 0, 0.2)';
                    successMessage.style.borderColor = 'rgba(255, 152, 0, 0.4)';
                    successMessage.classList.add('show');
                    setTimeout(() => successMessage.classList.remove('show'), 5000);
                    return;
                }
                
                // Disable button during submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
                
                try {
                    console.log('[FORM] Sending to /api/subscribe...');
                    
                    // Send to webhook endpoint
                    const response = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            email: email,
                            timestamp: new Date().toISOString(),
                            source: 'coming-soon-page'
                        })
                    });
                    
                    console.log('[FORM] Response status:', response.status);
                    console.log('[FORM] Response ok:', response.ok);
                    
                    const data = await response.json();
                    console.log('[FORM] Response data:', data);
                    
                    if (response.ok) {
                        // Show success message
                        successMessage.textContent = "✓ Thanks! We'll notify you when we launch.";
                        successMessage.style.background = 'rgba(76, 175, 80, 0.2)';
                        successMessage.style.borderColor = 'rgba(76, 175, 80, 0.4)';
                        successMessage.classList.add('show');
                        
                        // Clear form
                        document.getElementById('emailInput').value = '';
                        console.log('[FORM] Subscription successful!');
                    } else {
                        // Show specific error from server
                        const errorMsg = data.error || 'Subscription failed';
                        const errorCode = data.code || 'UNKNOWN';
                        console.error('[FORM] Subscription error:', errorMsg, 'Code:', errorCode);
                        console.error('[FORM] Details:', data.details);
                        throw new Error(errorMsg);
                    }
                } catch (error) {
                    console.error('[FORM] Catch block error:', error);
                    // Show error message with more details
                    let errorText = '⚠ Oops! Something went wrong. Please try again.';
                    if (error.message === 'Failed to fetch') {
                        errorText = '⚠ Connection error. Please check your internet and try again.';
                        console.error('[FORM] Network error - Failed to fetch');
                    } else if (error.message.includes('configuration')) {
                        errorText = '⚠ Service is being configured. Please try again in a few minutes.';
                        console.error('[FORM] Configuration error');
                    }
                    successMessage.textContent = errorText;
                    successMessage.style.background = 'rgba(244, 67, 54, 0.2)';
                    successMessage.style.borderColor = 'rgba(244, 67, 54, 0.4)';
                    successMessage.classList.add('show');
                } finally {
                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'NOTIFY ME';
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                }
            });
        </script>
    </body>
    </html>
  `);
});

export default app;
