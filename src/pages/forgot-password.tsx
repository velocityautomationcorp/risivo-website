import { html } from 'hono/html';

export const ForgotPasswordPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - Risivo</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
</head>
<body>
    <div class="forgot-container">
        <div class="logo">
            <div class="logo-text">RISIVO</div>
        </div>
        
        <div class="forgot-header">
            <h2>Forgot Password? 🔐</h2>
            <p>No worries! Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        <div id="alert-container"></div>
        
        <form id="forgot-form">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="your.email@example.com"
                    required
                    autocomplete="email"
                >
            </div>
            
            <button type="submit" class="btn-submit" id="submit-btn">
                Send Reset Link
            </button>
        </form>
        
        <div class="back-link">
            <a href="/updates/login">← Back to Login</a>
        </div>
    </div>
    
    <script>
        const form = document.getElementById('forgot-form');
        const submitBtn = document.getElementById('submit-btn');
        const alertContainer = document.getElementById('alert-container');
        
        function showAlert(message, type = 'error') {
            alertContainer.innerHTML = \`
                <div class="alert alert-\${type}">
                    \${message}
                </div>
            \`;
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            
            if (!email) {
                showAlert('Please enter your email address');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            alertContainer.innerHTML = '';
            
            try {
                const response = await fetch('/api/user/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showAlert(
                        'If this email is registered, you will receive a password reset link shortly. Please check your inbox and spam folder.',
                        'success'
                    );
                    form.reset();
                    
                    // Show info alert after 3 seconds
                    setTimeout(() => {
                        showAlert(
                            'Didn\\'t receive the email? Check your spam folder or try again in a few minutes.',
                            'info'
                        );
                    }, 3000);
                } else {
                    showAlert(data.error || 'Failed to send reset link. Please try again.');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                showAlert('An error occurred. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';
            }
        });
    </script>
</body>
</html>
`;
