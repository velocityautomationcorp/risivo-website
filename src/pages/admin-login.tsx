import { html } from 'hono/html';

export const AdminLoginPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Risivo Updates Platform</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,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">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 50px 40px;
            width: 100%;
            max-width: 450px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo img {
            max-width: 100%;
            width: 220px;
            height: auto;
            margin-bottom: 10px;
            object-fit: contain;
        }
        
        .logo p {
            color: #666;
            font-size: 0.95rem;
            margin-top: 5px;
        }
        
        .admin-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 35px;
        }
        
        .login-header h2 {
            font-size: 1.75rem;
            color: #333;
            margin-bottom: 8px;
        }
        
        .login-header p {
            color: #666;
            font-size: 0.95rem;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            font-family: 'Inter', sans-serif;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }
        
        .error-message {
            display: none;
            background: #fee;
            color: #c33;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.9rem;
            border-left: 4px solid #c33;
        }
        
        .error-message.show {
            display: block;
        }
        
        .login-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
        }
        
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .divider {
            text-align: center;
            margin: 25px 0;
            color: #999;
            font-size: 0.9rem;
        }
        
        .back-link {
            text-align: center;
            padding: 16px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        .back-link a:hover {
            color: #764ba2;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.85rem;
        }
        
        @media (max-width: 480px) {
            .login-container {
                padding: 35px 25px;
            }
            
            .logo img {
                max-width: 180px;
            }
            
            .login-header h2 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div>
        <div class="login-container">
            <div class="logo">
                <img src="data:image/png;base64,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" alt="Risivo Logo">
                <p>Admin Updates Platform</p>
            </div>
            
            <div class="login-header">
                <div class="admin-badge">🔒 Admin Access</div>
                <h2>Admin Login</h2>
                <p>Secure access to manage updates</p>
            </div>
            
            <div class="error-message" id="errorMessage">
                Invalid email or password. Please try again.
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Admin Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="admin@risivo.com" 
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
                        placeholder="Enter your admin password" 
                        required 
                        autocomplete="current-password"
                    >
                </div>
                
                <button type="submit" class="login-btn" id="loginBtn">
                    Login to Admin Panel
                </button>
            </form>
            
            <div class="divider">Not an admin?</div>
            
            <div class="back-link">
                <a href="/">← Back to Main Website</a>
            </div>
        </div>
        
        <div class="footer">
            © <span id="currentYear"></span> Risivo® by Velocity Automation Corp. All rights reserved.
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
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    // Success! Redirect to admin dashboard
                    loginBtn.textContent = '✅ Success! Redirecting...';
                    setTimeout(() => {
                        window.location.href = '/updates/admin/dashboard';
                    }, 500);
                } else {
                    // Show error
                    errorMessage.textContent = data.details || data.error || 'Login failed. Please try again.';
                    errorMessage.classList.add('show');
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Login to Admin Panel';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'Connection error. Please check your internet and try again.';
                errorMessage.classList.add('show');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login to Admin Panel';
            }
        });
    </script>
</body>
</html>
`;
