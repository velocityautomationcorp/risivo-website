import { html } from 'hono/html';

export const InvestorSignupPage = (email: string = '', firstName: string = '', lastName: string = '', businessName: string = '') => {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investor Sign Up - Risivo</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .signup-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 480px;
            width: 100%;
            padding: 48px 40px;
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            text-align: center;
            margin-bottom: 32px;
        }

        .logo img {
            height: 40px;
            margin-bottom: 12px;
        }

        .logo h1 {
            color: #667eea;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .investor-badge {
            display: inline-block;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        h2 {
            color: #1a202c;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-align: center;
        }

        .subtitle {
            color: #718096;
            font-size: 15px;
            text-align: center;
            margin-bottom: 32px;
            line-height: 1.6;
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            color: #2d3748;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        input[type="email"],
        input[type="password"],
        input[type="text"] {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 15px;
            font-family: inherit;
            transition: all 0.2s;
            background: #f7fafc;
        }

        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input[type="email"]:disabled {
            background: #edf2f7;
            cursor: not-allowed;
            color: #718096;
        }

        .password-requirements {
            margin-top: 8px;
            padding: 12px;
            background: #f7fafc;
            border-radius: 6px;
            font-size: 13px;
            color: #4a5568;
            line-height: 1.6;
        }

        .password-requirements ul {
            list-style: none;
            padding-left: 0;
        }

        .password-requirements li {
            padding-left: 20px;
            position: relative;
            margin-bottom: 4px;
        }

        .password-requirements li:before {
            content: "•";
            position: absolute;
            left: 8px;
            color: #667eea;
        }

        .checkbox-group {
            margin: 24px 0;
        }

        .checkbox-wrapper {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        input[type="checkbox"] {
            margin-top: 4px;
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #667eea;
        }

        .checkbox-label {
            font-size: 14px;
            color: #4a5568;
            line-height: 1.6;
            cursor: pointer;
        }

        .checkbox-label a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }

        .checkbox-label a:hover {
            text-decoration: underline;
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
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .submit-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .error-message {
            background: #fed7d7;
            color: #c53030;
            padding: 14px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
            border-left: 4px solid #c53030;
        }

        .success-message {
            background: #c6f6d5;
            color: #22543d;
            padding: 14px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
            border-left: 4px solid #22543d;
        }

        .info-box {
            background: #ebf4ff;
            border: 2px solid #bee3f8;
            border-radius: 8px;
            padding: 16px;
            margin-top: 24px;
            font-size: 14px;
            color: #2c5282;
            line-height: 1.6;
        }

        .info-box strong {
            color: #1a365d;
            display: block;
            margin-bottom: 8px;
        }

        .login-link {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
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

            h2 {
                font-size: 24px;
            }

            .logo h1 {
                font-size: 28px;
            }
        }
    </style>
    <link rel="icon" type="image/png" href="/favicon.png">
</head>
<body>
    <div class="signup-container">
        <div class="logo">
            <img src="/risivo-logo.png" alt="Risivo Logo" />
        </div>

        <div style="text-align: center;">
            <span class="investor-badge">🔐 Investor Access</span>
        </div>

        <h2>Create Your Account</h2>
        <p class="subtitle">
            Set up your password to access exclusive investor updates and materials.
        </p>

        <div id="errorMessage" class="error-message"></div>
        <div id="successMessage" class="success-message"></div>

        <form id="signupForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value="${email}"
                    disabled
                    required
                >
            </div>

            <div class="form-group">
                <label for="first_name">First Name</label>
                <input 
                    type="text" 
                    id="first_name" 
                    name="first_name" 
                    value="${firstName}"
                    placeholder="John"
                    required
                >
            </div>

            <div class="form-group">
                <label for="last_name">Last Name</label>
                <input 
                    type="text" 
                    id="last_name" 
                    name="last_name" 
                    value="${lastName}"
                    placeholder="Doe"
                    required
                >
            </div>

            <div class="form-group">
                <label for="business_name">Company/Organization Name</label>
                <input 
                    type="text" 
                    id="business_name" 
                    name="business_name" 
                    value="${businessName}"
                    placeholder="Acme Ventures LLC"
                    required
                >
            </div>

            <div class="form-group">
                <label for="password">Create Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Create a strong password"
                    required
                    minlength="8"
                >
                <div class="password-requirements">
                    <ul>
                        <li>At least 8 characters long</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Include at least one number</li>
                    </ul>
                </div>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    placeholder="Re-enter your password"
                    required
                >
            </div>

            <div class="checkbox-group">
                <div class="checkbox-wrapper">
                    <input 
                        type="checkbox" 
                        id="terms" 
                        name="terms" 
                        required
                    >
                    <label for="terms" class="checkbox-label">
                        I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                    </label>
                </div>
            </div>

            <button type="submit" class="submit-btn" id="submitBtn">
                Create Account & Continue to NDA
            </button>

            <div class="info-box">
                <strong>📋 Next Step: NDA Review</strong>
                After creating your account, you'll be redirected to review and sign our Non-Disclosure Agreement (NDA) to access confidential investor materials.
            </div>

            <div class="login-link">
                Already have an account? <a href="/updates/login">Sign In</a>
            </div>
        </form>
    </div>

    <script>
        const form = document.getElementById('signupForm');
        const submitBtn = document.getElementById('submitBtn');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        // Get email from URL params (pre-filled from Make.com email)
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email');
        const firstNameFromUrl = urlParams.get('first_name');
        const lastNameFromUrl = urlParams.get('last_name');
        const businessNameFromUrl = urlParams.get('business_name');
        
        if (emailFromUrl) {
            document.getElementById('email').value = emailFromUrl;
        }
        if (firstNameFromUrl) {
            document.getElementById('first_name').value = firstNameFromUrl;
        }
        if (lastNameFromUrl) {
            document.getElementById('last_name').value = lastNameFromUrl;
        }
        if (businessNameFromUrl) {
            document.getElementById('business_name').value = businessNameFromUrl;
        }

        // Password validation
        function validatePassword(password) {
            const minLength = password.length >= 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);

            return minLength && hasUpperCase && hasLowerCase && hasNumber;
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Hide previous messages
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            // Get form values
            const email = document.getElementById('email').value.trim();
            const firstName = document.getElementById('first_name').value.trim();
            const lastName = document.getElementById('last_name').value.trim();
            const businessName = document.getElementById('business_name').value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const termsAccepted = document.getElementById('terms').checked;

            // Validation
            if (!email) {
                errorMessage.textContent = 'Email address is required.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!firstName || !lastName) {
                errorMessage.textContent = 'First name and last name are required.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!businessName) {
                errorMessage.textContent = 'Company/Organization name is required.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!password) {
                errorMessage.textContent = 'Password is required.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!validatePassword(password)) {
                errorMessage.textContent = 'Password does not meet requirements. Please ensure it has at least 8 characters, includes uppercase and lowercase letters, and at least one number.';
                errorMessage.style.display = 'block';
                return;
            }

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match. Please try again.';
                errorMessage.style.display = 'block';
                confirmPasswordInput.focus();
                return;
            }

            if (!termsAccepted) {
                errorMessage.textContent = 'You must agree to the Terms & Conditions to continue.';
                errorMessage.style.display = 'block';
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';

            try {
                // Call signup API - credentials: 'include' is REQUIRED to receive cookies
                const response = await fetch('/api/auth/signup/investor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                        business_name: businessName,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Show success message
                    successMessage.textContent = 'Account created successfully! Redirecting to NDA review...';
                    successMessage.style.display = 'block';

                    // Redirect to NDA review page after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = '/updates/investor/nda-review';
                    }, 1500);
                } else {
                    // Show error message
                    errorMessage.textContent = data.error || 'Failed to create account. Please try again.';
                    errorMessage.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create Account & Continue to NDA';
                }
            } catch (error) {
                console.error('Signup error:', error);
                errorMessage.textContent = 'An error occurred. Please try again later.';
                errorMessage.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account & Continue to NDA';
            }
        });

        // Real-time password matching feedback
        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.style.borderColor = '#fc8181';
            } else {
                confirmPasswordInput.style.borderColor = '#e2e8f0';
            }
        });
    </script>
</body>
</html>`;
};
