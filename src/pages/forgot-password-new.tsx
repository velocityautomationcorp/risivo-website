import { html } from 'hono/html';

export const ForgotPasswordPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - Risivo</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .forgot-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 480px;
            width: 100%;
            padding: 48px 40px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .logo img {
            height: 40px;
        }
        
        .forgot-header {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .forgot-header h2 {
            color: #1a202c;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
        }
        
        .forgot-header p {
            color: #718096;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .success-message,
        .error-message {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 14px;
            display: none;
        }
        
        .success-message {
            background: #c6f6d5;
            border-left: 4px solid #38a169;
            color: #22543d;
        }
        
        .error-message {
            background: #fed7d7;
            border-left: 4px solid #e53e3e;
            color: #c53030;
        }
        
        .success-message.show,
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
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 15px;
            font-family: inherit;
            transition: all 0.2s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .back-link {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }
        
        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
        }
        
        .back-link a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 480px) {
            .forgot-container {
                padding: 32px 24px;
            }
            
            .forgot-header h2 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="forgot-container">
        <div class="logo">
            <img src="/risivo-logo.png" alt="Risivo Logo" />
        </div>
        
        <div class="forgot-header">
            <h2>Forgot Password? 🔐</h2>
            <p>No worries! Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        <div id="successMessage" class="success-message"></div>
        <div id="errorMessage" class="error-message"></div>
        
        <form id="forgotForm">
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
            
            <button type="submit" class="submit-btn" id="submitBtn">
                Send Reset Link
            </button>
        </form>
        
        <div class="back-link">
            <a href="/updates/login">← Back to Login</a>
        </div>
    </div>
    
    <script>
        const form = document.getElementById('forgotForm');
        const submitBtn = document.getElementById('submitBtn');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            
            if (!email) {
                errorMessage.textContent = 'Please enter your email address.';
                errorMessage.classList.add('show');
                successMessage.classList.remove('show');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            errorMessage.classList.remove('show');
            successMessage.classList.remove('show');
            
            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    successMessage.textContent = 'Password reset link sent! Check your email inbox.';
                    successMessage.classList.add('show');
                    form.reset();
                } else {
                    errorMessage.textContent = data.error || 'Failed to send reset link. Please try again.';
                    errorMessage.classList.add('show');
                }
            } catch (error) {
                errorMessage.textContent = 'Network error. Please try again later.';
                errorMessage.classList.add('show');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';
            }
        });
    </script>
</body>
</html>
`;
