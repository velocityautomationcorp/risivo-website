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
