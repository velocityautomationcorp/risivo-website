import { html } from 'hono/html';

export const UserLoginPage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Risivo Updates Platform</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaUAAAGlCAYAAABa0umuAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+kMCREhJgYRGzgAABKsSURBVHja7d1PbhuJmcbhtxu9lwYGuLVyAionKOYEzRuIhpdctHwC0ydo9oJLw/QJRj5ByBOMdILIWwJGpBPMLFjKGIbTlmNJ/KrqeYBGB0EH7nwk9dNXrD8/pQPmze4kyTTJaZKTQL9cJrn54r+7bv9KkpvVdnRpTAzBT8VjdJxkkeQ3LxUkSa7agN1F67KN1sZoEKXHD9ImydjLBPdy20bq7q9rsUKUHi5KmySNlwgeZLvatKHarLajayNBlL4vSLMk77w88Ggb1ab960KkEKVvR+kyDtvBU/l4F6h2k7oxEkTp/4N0nOSfXho4mG0bKFsUojRvdpMkf/fSQAlXSdYChSgBFQO1bAPlEB+P4mcjAO5pnP0JSP+cN7uLebObGgk2JaCSj9kf3ls7vIdNCTi050leJ/nHvNmt218qQZSAgztL8vd5s9u01xqCKAEH1yR5N2921+LE9/KdEvDY7r53WjprD5sScGh33ztdz5vduXEgSkAFR0l+d1gPUQKqbU533zlNjANRAqrE6e5svRPjQJSACprsr3NatjdkRpQADu637E+GmBmFKAFUcJT9900O6YkSQBl3h/QWRiFKAFW8nje7y3mzOzUKUQKoYJzkf2xNogRQcWs6MQpRAqiyNV06Q0+UAKq4O0Nv7bomUQKo4izJxkkQogRQxbgN08woRAmggrvDeUujECWAKn5r7wTheyZRAiihyf7sPN8ziRJACc+z/55pYhSiBFDBUfbPapoZhSgBVPHO7YlECaCS1/NmtzYGUQKo4kyYRAmgWpgunDIuSgBV/Jr9mXnCJEoAJYyFSZQAhAlRAhAmUQLoSpjWxiBKAFX86nRxUQKoxHVMogRQLkwLYxAlgCpeu4mrKAFU8s5jL0QJoJILDwoUJYAqjtowuYZJlABKeJ7kwhhECaCKxqniogRQyZkz8kQJoJKlEx9ECaCKoyRrJz6IEkAV4yRLYxAlgCp8vyRKAKUs583uxBhECaCCo7h+SZQAChm7o7goAVTy2mniogRQydoIRAmgCofxRAmgFIfxRAmgFBfVihJAGc282Z0bgygBVLFwbzxRAqjiKA7jiRJAIWdOehAlgEpsS6IEUEYzb3ZTYxAlANuSKAHwheeeuyRKAKW2JaeIixJAFUdJXFArSgBlnNuWRAnAtiRKANiWRAnAtiRKANzTzAhECaAK1y2JEkApCyMQJYBK29LEGEQJoAonPIgSQBm/zpvdiTGIEoBtSZQA+MLMCEQJoIojp4eLEkAlnkwrSgBlOOFBlABsS6IEwNfMjECUAKoYz5vdqTGIEoBtSZQA+ILvlUQJoIznDuGJEoBtSZQAEKU/91PFf6l5s/tfLw0wIH9ZbUfXxlB3U/rgpQEGZGIEtaO08NIAA+IQXuUorbajyyRvvDyATUmUqoRpkeQPLxEwAEdODS8epTZM50n+lmTrpQJ6ziG8FD777mvmze44id8k6JtJ+/e79/dJkufGMkjb1XY0ESWg4i9gk/avqUgNx2o7GvzPZFGC+pE6zf7GnbMkRybSa39tT/QSJaATgZplf8mE7amfXq22o+WQB+A2Q9Ahq+1ovdqOTpK8SHJrIr0zGfoARAk6GqfsT4pw2US/DP5kLofvoOPmzW6SZB2H9Priv1bb0Y1NCejq1rRpf8N2z0jbkigBJcJ0s9qOpnE4rw8mogT0JU7n2Z8EQXediBLQpzCthUmURAmoFqZXJtFJjSgBfQzTMsl7k+ieebMb7LYkStDvMM2SXJlE54gS0FvTuPt... (line truncated)" />
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
            max-width: 220px;
            height: auto;
            margin-bottom: 10px;
        }
        
        .logo p {
            color: #666;
            font-size: 0.95rem;
            margin-top: 5px;
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
        
        .signup-link {
            text-align: center;
            padding: 16px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .signup-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        .signup-link a:hover {
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
            
            .logo h1 {
                font-size: 2rem;
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
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB8QAAAHECAYAAABP6pBcAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nOzdXW4bV7Y/7DqNvpebAK+ljEDMCFwZgdUjkALw7k/AyggsjyAywEsClkcQeQQpjSD0CGLdvgR4rBGcF9vZTGhZH/yoIqv2fh4g6JzT6W56Fz+q9m+vtf7n//7v/woAAMjdqJwdFUVxdG8ZyieW5aF//iHVE//e5/jX38ZV/6l/HgAAAKjBfDgYFEXx4t5/01P7AMFD/5mHTIui+PLEv/8l/jPLPvcm089P/GeADQnEAQBI1qicLR5UX8SH1uLew2v4+4MW//lvlwLzxcP03w/NwnMAAAD4y1LAvbwHsHyYPfz/jzu0XJ+WQvXpA3//pTeZ3g/VgQcIxAEA6KxROVs85C4ecAdLD75tDrrr9mkpKP8Sq9K/jKu+B2MAAACSMB8OFtXb9//1pStc3MR/nS7vD/QmUwfpyV4hEAcAoAuW2pmXS+G3B97VfFoKyUO1+VRQDgAAQBvFKu+jBw6/53TovQk3S0G5sJzsCMQBAGiV2Ob8/l8efOv3aelBeKr9OgAAALsyHw6WD74vwu8utTNPxWJU29+H6LVhJ0UCcQAA9iZWfg+WHoBVfe/XIiSvVJIDAABQhxh+D+49/zv43m7fHKJXTU7XCcQBANiZGICXS38dWv1Wu1uE4+FfVZEDAADwlPlw8GIp9BZ+p+WbQ/QqyekSgTgAAI0RgCfpY3z4rVSQAwAA5C1Wf5dL4be25/m4WwrIK1XktJlAHACAWo3K2Ul8ED4RgCcvPPxex4ff63HV/5L7ggAAAKTsXgDu4Dv33QjIaSOBOAAAW1mqAg8B+CurmbXQPu0qhuOfc18MAACArltqgX4iAGcDN4uD9Fqss08PBuKjcjaIX27hX1+4QiTkS2zhcd80/nvBZxu4APC0GIKH+8Uz7dB4xG186L3SWh0AAKA75sPBIiM68cxPjb7pMtebTHWZY2e+CcTjxmao6HjpEsBXN/FfF4F5+KL+YlMXgBwJwdmCcBwAAKDF5sPByVIIfuBasQOf4l7BtepxmvZ3IB6rwitfdLCy2xiU//2XynLaYCmwKnX5yMJibq+bRhoxKmcv4nfKuRCcmtzGQ7hX7p1YiPcvZ7qUZeHL0v1LI98Bsa3n4n74KPcFZ2WfVSvRVvPhYPEbOXCRWNGXpe8099w8aOmeyfgz2uB2KRw3e5zafQ3E4+bDVBgOW7uLn6Vq8a/jqu9Bmp2IodVFURSvrXiWQkeLc8E4dRmVs8VD8alFpUE3SzPH3TNlKN6/XNmAy9aHeP9S2+d/Phycx3ti+xtsKjzXX/Ym0wsryL7Fas1L83rZ0rvw2+iwD4UQnO64WwrHr1036rAIxK9sdkJjPi2F5DZ7aUTcTK5Ub2Yv3CyWQnE2tVSheWbTjR1bPOxe+g7Lhy5lRJ/i/cvWz0nz4cDeBnX60JtMz6wo+zIfDi4deKdGX39vheJ5EoLTccJxavE//+/l/xc2Pv+0nLAzn5bCca0/qMWonF27oSUKN4kDbYhZR6wGP/M9QkvcxupOBwkTFg/zTR2+Ifo0rvpbtQGeDwfhe+ONBaVm73qT6blFZddii/T3Fp6afexNpicWNR+xy4RnfVKyaKt+ZeY46wqBuBss2J/F6SbV42wsBlm/WUGWfBhXfdUsPCmGUWdxNrhAijZa3CddOOSTnlE5E15y39tx1d+oRfV8OHDQnyb9ZI4luxQrOT/roEJDfKclbj4cDOJz/onvERJ3G8eKhMpxewY8619FURxZJtibg9jSLxxK+d9Q5TsqZ2cxpIBVCT657zS2vobvhPfGqJxdxk22X4XhtNjiPunPUTmrRuWsdLGSouKS+7a5p3U/TJO8v9g1IRZNcg+WoHCQZj4cnM+Hg/Cc/0d8jvI9QuoO477Wn/Ph4Dp2V4FHhQpxJ/O... (line truncated)" alt="Risivo Logo" />
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
                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    // Success! Redirect to dashboard
                    loginBtn.textContent = '✅ Success! Redirecting...';
                    setTimeout(() => {
                        window.location.href = '/updates/dashboard';
                    }, 500);
                } else {
                    // Show error
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
