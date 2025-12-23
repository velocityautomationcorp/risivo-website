import { html } from 'hono/html';

export const WaitlistSignupPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Your Account - Risivo Waitlist</title>
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
        
        .signup-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            width: 100%;
            max-width: 500px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .logo img {
            height: 40px;
            margin-bottom: 8px;
        }
        
        .logo h1 {
            color: #667eea;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
        }
        
        .logo p {
            color: #666;
            font-size: 14px;
            margin-top: 4px;
        }
        
        .welcome-badge {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .welcome-badge h3 {
            margin: 0 0 5px 0;
            font-size: 18px;
        }
        
        .welcome-badge p {
            margin: 0;
            font-size: 14px;
            opacity: 0.95;
        }
        
        .form-group {
            margin-bottom: 20px;
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
        
        .form-group input:read-only {
            background: #f7fafc;
            cursor: not-allowed;
        }
        
        .password-strength {
            margin-top: 8px;
            height: 4px;
            background: #e2e8f0;
            border-radius: 2px;
            overflow: hidden;
        }
        
        .password-strength-bar {
            height: 100%;
            width: 0%;
            transition: all 0.3s;
        }
        
        .password-strength-bar.weak { width: 33%; background: #dc3545; }
        .password-strength-bar.medium { width: 66%; background: #ffc107; }
        .password-strength-bar.strong { width: 100%; background: #28a745; }
        
        .password-hint {
            font-size: 12px;
            color: #718096;
            margin-top: 6px;
        }
        
        .checkbox-group {
            margin: 20px 0;
        }
        
        .checkbox-group label {
            display: flex;
            align-items: flex-start;
            font-size: 14px;
            color: #2d3748;
        }
        
        .checkbox-group input[type="checkbox"] {
            margin-right: 10px;
            margin-top: 3px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        
        .submit-btn {
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
        
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .error-message {
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
        
        .login-link {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #718096;
        }
        
        .login-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        
        .login-link a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 480px) {
            .signup-container {
                padding: 32px 24px;
            }
        }
    </style>
</head>
<body>
    <div class="signup-container">
        <div class="logo">
            <img src="/risivo-logo.png" alt="Risivo Logo" />
            <p>Create Your Account</p>
        </div>
        
        <div class="welcome-badge">
            <h3>🎁 50% Lifetime Discount Locked In!</h3>
            <p>Your early supporter pricing is secured</p>
        </div>
        
        <div id="errorMessage" class="error-message"></div>
        
        <form id="signupForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    readonly
                    placeholder="your@email.com"
                />
            </div>
            
            <div class="form-group">
                <label for="first_name">First Name</label>
                <input 
                    type="text" 
                    id="first_name" 
                    name="first_name" 
                    required
                    placeholder="John"
                />
            </div>
            
            <div class="form-group">
                <label for="last_name">Last Name</label>
                <input 
                    type="text" 
                    id="last_name" 
                    name="last_name" 
                    required
                    placeholder="Doe"
                />
            </div>
            
            <div class="form-group">
                <label for="business_name">Business Name</label>
                <input 
                    type="text" 
                    id="business_name" 
                    name="business_name"
                    required
                    placeholder="Acme Corp"
                />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required
                    minlength="8"
                    placeholder="At least 8 characters"
                />
                <div class="password-strength">
                    <div id="passwordStrengthBar" class="password-strength-bar"></div>
                </div>
                <p class="password-hint">Use at least 8 characters with letters and numbers</p>
            </div>
            
            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirm_password" 
                    name="confirm_password" 
                    required
                    placeholder="Re-type your password"
                />
            </div>
            
            <div class="checkbox-group">
                <label>
                    <input type="checkbox" id="terms" required />
                    <span>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a></span>
                </label>
            </div>
            
            <button type="submit" class="submit-btn" id="submitBtn">
                Create My Account
            </button>
        </form>
        
        <div class="login-link">
            Already have an account? <a href="/updates/login">Sign In</a>
        </div>
    </div>
    
    <script>
        // Pre-fill form from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById('email').value = urlParams.get('email') || '';
        
        // Handle both formats: separate first_name/last_name OR combined name
        const firstName = urlParams.get('first_name') || '';
        const lastName = urlParams.get('last_name') || '';
        const fullName = urlParams.get('name') || '';
        
        if (firstName) {
            document.getElementById('first_name').value = firstName;
            document.getElementById('last_name').value = lastName;
        } else if (fullName) {
            const parts = fullName.split(' ');
            document.getElementById('first_name').value = parts[0] || '';
            document.getElementById('last_name').value = parts.slice(1).join(' ') || '';
        }
        
        // Handle both formats: business_name OR business
        document.getElementById('business_name').value = urlParams.get('business_name') || urlParams.get('business') || '';
        
        // Password strength indicator
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('passwordStrengthBar');
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\\d/)) strength++;
            if (password.match(/[^a-zA-Z\\d]/)) strength++;
            
            strengthBar.className = 'password-strength-bar';
            if (strength === 1 || strength === 2) strengthBar.classList.add('weak');
            else if (strength === 3) strengthBar.classList.add('medium');
            else if (strength >= 4) strengthBar.classList.add('strong');
        });
        
        // Form submission
        const form = document.getElementById('signupForm');
        const submitBtn = document.getElementById('submitBtn');
        const errorMessage = document.getElementById('errorMessage');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.classList.add('show');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';
            errorMessage.classList.remove('show');
            
            try {
                const response = await fetch('/api/auth/signup/waitlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: document.getElementById('email').value,
                        password: password,
                        first_name: document.getElementById('first_name').value,
                        last_name: document.getElementById('last_name').value,
                        business_name: document.getElementById('business_name').value
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    window.location.href = '/updates/dashboard';
                } else {
                    errorMessage.textContent = data.error || 'Failed to create account';
                    errorMessage.classList.add('show');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create My Account';
                }
            } catch (error) {
                errorMessage.textContent = 'Network error. Please try again.';
                errorMessage.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create My Account';
            }
        });
    </script>
</body>
</html>
`;
