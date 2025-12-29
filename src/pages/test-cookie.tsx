import { html } from 'hono/html';

export const TestCookiePage = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cookie Test - Risivo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #667eea; }
        .cookie-info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: monospace;
        }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍪 Cookie Test Page</h1>
        <p>This page tests if cookies are being set and read correctly.</p>
        
        <div id="results"></div>
        
        <h2>Actions:</h2>
        <button onclick="testLogin()">Test Login API</button>
        <button onclick="showCookies()">Show Current Cookies</button>
        <button onclick="clearCookies()">Clear All Cookies</button>
    </div>

    <script>
        // Show all cookies on page load
        window.onload = function() {
            showCookies();
        };

        function showCookies() {
            const cookies = document.cookie;
            const resultsDiv = document.getElementById('results');
            
            if (cookies) {
                const cookieArray = cookies.split(';').map(c => c.trim());
                let html = '<h3>Current Cookies:</h3>';
                cookieArray.forEach(cookie => {
                    const [name, value] = cookie.split('=');
                    html += '<div class="cookie-info"><strong>' + name + ':</strong> ' + value + '</div>';
                });
                resultsDiv.innerHTML = html;
            } else {
                resultsDiv.innerHTML = '<p class="error">❌ No cookies found!</p>';
            }
        }

        async function testLogin() {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p>🔄 Testing login...</p>';
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'test-investor@example.com',
                        password: 'RisivoAdmin2024!'
                    })
                });
                
                const data = await response.json();
                
                let html = '<h3>Login API Response:</h3>';
                html += '<div class="cookie-info">Status: ' + response.status + '</div>';
                html += '<div class="cookie-info">Success: ' + data.success + '</div>';
                html += '<div class="cookie-info">Response: ' + JSON.stringify(data, null, 2) + '</div>';
                
                // Check Set-Cookie header (won't be visible in JS due to HttpOnly)
                html += '<p><strong>Note:</strong> If HttpOnly is set, cookie won\\'t be visible in document.cookie</p>';
                
                resultsDiv.innerHTML = html;
                
                // Wait a moment, then show cookies
                setTimeout(showCookies, 1000);
                
            } catch (error) {
                resultsDiv.innerHTML = '<p class="error">❌ Error: ' + error.message + '</p>';
            }
        }

        function clearCookies() {
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            alert('Cookies cleared! (Note: HttpOnly cookies cannot be cleared from JavaScript)');
            showCookies();
        }
    </script>
</body>
</html>
`;
