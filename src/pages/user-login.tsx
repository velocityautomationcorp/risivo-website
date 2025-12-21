import { html } from 'hono/html';

export const UserLoginPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Risivo Updates Platform</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 48px;
            width: 100%;
            max-width: 450px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .logo p {
            color: #666;
            font-size: 14px;
            margin-top: 12px;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .login-header h2 {
            color: #1a202c;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .login-header p {
            color: #718096;
            font-size: 15px;
        }
        
        .error-message {
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 8px;
            color: #c33;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        .form-group label {
            display: block;
            color: #2d3748;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.2s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .login-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .login-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        .login-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        .divider {
            text-align: center;
            color: #a0aec0;
            font-size: 14px;
            margin: 24px 0;
            position: relative;
        }
        
        .divider::before,
        .divider::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 35%;
            height: 1px;
            background: #e2e8f0;
        }
        
        .divider::before {
            left: 0;
        }
        
        .divider::after {
            right: 0;
        }
        
        .signup-link {
            text-align: center;
        }
        
        .signup-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
        }
        
        .signup-link a:hover {
            text-decoration: underline;
        }
        
        .footer {
            color: rgba(255, 255, 255, 0.9);
            text-align: center;
            font-size: 13px;
            margin-top: 24px;
        }
        
        @media (max-width: 480px) {
            .login-container {
                padding: 32px 24px;
            }
            
            .login-header h2 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div>
        <div class="login-container">
            <div class="logo">
                <img src="/images/risivo-logo.png" style="height: 40px" alt="Risivo Logo" />
                <p>Development Updates Platform</p>
            </div>
            
            <div class="login-header">
                <h2>Welcome Back!</h2>
                <p>Login to access exclusive updates</p>
            </div>
            
            <div class="error-message" id="errorMessage">
                Invalid email or password. Please try again.
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="your@email.com" 
                        required 
                        autocomplete="email"
                    >
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Enter your password" 
                        required 
                        autocomplete="current-password"
                    >
                </div>
                
                <div style="text-align: right; margin-bottom: 20px;">
                    <a href="/updates/forgot-password" style="color: #667eea; text-decoration: none; font-size: 14px;">
                        Forgot Password?
                    </a>
                </div>
                
                <button type="submit" class="login-btn" id="loginBtn">
                    Login to Updates Platform
                </button>
            </form>
            
            <div class="divider">Don't have access yet?</div>
            
            <div class="signup-link">
                <a href="/">← Join Our Exclusive Waitlist for FREE</a>
            </div>
        </div>
        
        <div class="footer">
            © <span id="currentYear"></span> Risivo™ by Velocity Automation Corp. All rights reserved.
        </div>
    </div>
    
    <script>
        // Set current year
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const errorMessage = document.getElementById('errorMessage');
            const loginBtn = document.getElementById('loginBtn');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Hide error message
            errorMessage.classList.remove('show');
            
            // Disable button
            loginBtn.disabled = true;
            loginBtn.textContent = '⏳ Logging in...';
            
            try {
                console.log('Sending login request to /api/auth/login');
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                console.log('Response received:', {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText
                });
                
                const data = await response.json();
                
                console.log('Login response:', {
                    status: response.ok,
                    data: data
                });
                console.log('data.success is:', data.success, typeof data.success);
                console.log('response.ok is:', response.ok, typeof response.ok);
                console.log('Condition check:', response.ok && data.success);
                
                if (response.ok && data.success) {
                    // Success! Redirect based on user type and NDA status
                    loginBtn.textContent = '✅ Success! Redirecting...';
                    console.log('Full response data:', JSON.stringify(data, null, 2));
                    
                    let redirectUrl = '/updates/dashboard'; // Default for waitlist users
                    
                    // Check if user is an investor
                    if (data.user && data.user.user_type === 'investor') {
                        console.log('User is investor, investor_status:', data.user.investor_status);
                        
                        // Check if investor has signed NDA
                        if (data.user.investor_status === 'pending_nda') {
                            // Investor hasn't signed NDA - redirect to NDA page
                            redirectUrl = '/updates/investor/nda-review';
                            console.log('Investor with pending_nda - redirecting to NDA review');
                        } else if (data.user.investor_status === 'nda_signed' || data.user.investor_status === 'active') {
                            // Investor has signed NDA or is active - redirect to investor dashboard
                            redirectUrl = '/updates/investor/dashboard';
                            console.log('Investor with NDA signed or active - redirecting to investor dashboard');
                        } else {
                            // Unknown status, default to dashboard
                            redirectUrl = '/updates/dashboard';
                            console.log('Investor with unknown status, using default dashboard');
                        }
                    }
                    
                    console.log('Redirecting to:', redirectUrl);
                    
                    // Immediate redirect - no setTimeout, just do it
                    window.location.href = redirectUrl;
                } else {
                    // Show error
                    console.error('Login failed:', data);
                    errorMessage.textContent = data.details || data.error || 'Login failed. Please try again.';
                    errorMessage.classList.add('show');
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Login to Updates Platform';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'Connection error. Please check your internet and try again.';
                errorMessage.classList.add('show');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login to Updates Platform';
            }
        });
    </script>
</body>
</html>
`;
