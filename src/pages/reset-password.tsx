import { html } from 'hono/html';

export const ResetPasswordPage = (token: string) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Risivo</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/static/risivo-global.css">
</head>
<body>
    <div class="reset-container">
        <div class="logo">
            <div class="logo-text">RISIVO</div>
        </div>
        
        <div class="reset-header">
            <h2>Reset Password 🔑</h2>
            <p>Enter your new password below. Make sure it's strong and memorable!</p>
        </div>
        
        <div id="alert-container"></div>
        
        <form id="reset-form">
            <div class="form-group">
                <label for="password">New Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Enter new password"
                    required
                    autocomplete="new-password"
                >
                <ul class="password-requirements">
                    <li id="req-length">At least 8 characters long</li>
                    <li id="req-uppercase">Contains uppercase letter</li>
                    <li id="req-lowercase">Contains lowercase letter</li>
                    <li id="req-number">Contains a number</li>
                </ul>
            </div>
            
            <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirm-password" 
                    name="confirm-password" 
                    placeholder="Confirm new password"
                    required
                    autocomplete="new-password"
                >
            </div>
            
            <button type="submit" class="btn-submit" id="submit-btn">
                Reset Password
            </button>
        </form>
        
        <div class="back-link">
            <a href="/updates/login">← Back to Login</a>
        </div>
    </div>
    
    <script>
        const token = '${token}';
        const form = document.getElementById('reset-form');
        const submitBtn = document.getElementById('submit-btn');
        const alertContainer = document.getElementById('alert-container');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        function showAlert(message, type = 'error') {
            alertContainer.innerHTML = \`
                <div class="alert alert-\${type}">
                    \${message}
                </div>
            \`;
        }
        
        // Password strength validation
        const requirements = {
            length: { regex: /.{8,}/, element: document.getElementById('req-length') },
            uppercase: { regex: /[A-Z]/, element: document.getElementById('req-uppercase') },
            lowercase: { regex: /[a-z]/, element: document.getElementById('req-lowercase') },
            number: { regex: /[0-9]/, element: document.getElementById('req-number') }
        };
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            
            Object.values(requirements).forEach(req => {
                if (req.regex.test(password)) {
                    req.element.classList.add('valid');
                } else {
                    req.element.classList.remove('valid');
                }
            });
        });
        
        function validatePassword(password) {
            return Object.values(requirements).every(req => req.regex.test(password));
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            // Validate password strength
            if (!validatePassword(password)) {
                showAlert('Password does not meet all requirements');
                return;
            }
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showAlert('Passwords do not match');
                return;
            }
            
            // Check if token exists
            if (!token) {
                showAlert('Invalid or missing reset token');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Resetting...';
            alertContainer.innerHTML = '';
            
            try {
                const response = await fetch('/api/user/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showAlert(
                        'Password reset successfully! Redirecting to login...',
                        'success'
                    );
                    form.reset();
                    
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/updates/login';
                    }, 2000);
                } else {
                    showAlert(data.error || 'Failed to reset password. Please try again.');
                }
            } catch (error) {
                console.error('Reset password error:', error);
                showAlert('An error occurred. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reset Password';
            }
        });
    </script>
</body>
</html>
`;
