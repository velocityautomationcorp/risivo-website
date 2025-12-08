import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files
app.use('/*', serveStatic({ root: './public' }))

// Coming Soon Page
app.get('/', (c) => {
  const launchDate = new Date('2025-02-08T00:00:00').getTime()
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Risivo - Coming Soon</title>
        <meta name="description" content="Risivo - The Future of CRM is Coming. Transform how you manage customers, close deals, and grow your business.">
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
                font-size: 3rem;
                font-weight: 800;
                margin-bottom: 2rem;
                letter-spacing: -2px;
                text-transform: uppercase;
                background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
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
                .logo {
                    font-size: 2rem;
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
            <div class="logo">RISIVO</div>
            
            <div class="subtitle">The Future of CRM is Coming</div>
            
            <p class="description">
                Transform how you manage customers, close deals, and grow your business. 
                The all-in-one CRM platform built for modern teams is launching soon.
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
                © 2024 Risivo. All rights reserved.
            </div>
        </div>
        
        <script>
            // Countdown Timer
            const launchDate = ${launchDate};
            
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
            
            // Email Form
            document.getElementById('emailForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('emailInput').value;
                
                // TODO: Connect to your email service (Mailchimp, ConvertKit, etc.)
                console.log('Email submitted:', email);
                
                // Show success message
                const successMessage = document.getElementById('successMessage');
                successMessage.classList.add('show');
                
                // Clear form
                document.getElementById('emailInput').value = '';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            });
        </script>
    </body>
    </html>
  `)
})

export default app
