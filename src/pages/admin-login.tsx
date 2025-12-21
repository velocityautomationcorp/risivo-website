import { html } from "hono/html";

export const AdminLoginPage = () => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Admin Login - Risivo Updates Platform</title>
      <link rel="icon" type="image/png" href="/favicon.png">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" type="image/png" href="/favicon.png">
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

        .login-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 50px 40px;
          max-width: 450px;
          width: 100%;
        }

        .logo {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo img {
          height: 50px;
          margin-bottom: 10px;
        }

        .logo p {
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .admin-badge {
          display: inline-block;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          color: #333;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 15px;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .login-header h2 {
          font-size: 28px;
          color: #333;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .login-header p {
          color: #999;
          font-size: 14px;
        }

        .error-message {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          display: none;
        }

        .error-message.show {
          display: block;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #333;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          text-align: center;
          color: #999;
          font-size: 14px;
          margin: 25px 0;
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: #e0e0e0;
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .back-link {
          text-align: center;
        }

        .back-link a {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .back-link a:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .footer {
          text-align: center;
          color: white;
          font-size: 14px;
          margin-top: 30px;
          opacity: 0.9;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 40px 30px;
          }

          .logo img {
            height: 40px;
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
            <img
              src="/images/risivo-logo.png"
              alt="Risivo Logo"
            />
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
              />
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
              />
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
          © <span id="currentYear"></span> Risivo™ by Velocity Automation Corp.
          All rights reserved.
        </div>
      </div>

      <script>
        // Set current year
        document.getElementById("currentYear").textContent =
          new Date().getFullYear();

        // Handle form submission
        document
          .getElementById("loginForm")
          .addEventListener("submit", async (e) => {
            e.preventDefault();

            const errorMessage = document.getElementById("errorMessage");
            const loginBtn = document.getElementById("loginBtn");
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Hide error message
            errorMessage.classList.remove("show");

            // Disable button
            loginBtn.disabled = true;
            loginBtn.textContent = "⏳ Logging in...";

            try {
              const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              });

              const data = await response.json();

              if (response.ok && data.success) {
                // Success! Redirect to admin dashboard
                loginBtn.textContent = "✅ Success! Redirecting...";
                setTimeout(() => {
                  window.location.href = "/updates/admin/dashboard";
                }, 500);
              } else {
                // Show error
                errorMessage.textContent =
                  data.details ||
                  data.error ||
                  "Login failed. Please try again.";
                errorMessage.classList.add("show");
                loginBtn.disabled = false;
                loginBtn.textContent = "Login to Admin Panel";
              }
            } catch (error) {
              console.error("Login error:", error);
              errorMessage.textContent =
                "Connection error. Please check your internet and try again.";
              errorMessage.classList.add("show");
              loginBtn.disabled = false;
              loginBtn.textContent = "Login to Admin Panel";
            }
          });
      </script>
    </body>
  </html>
`;
