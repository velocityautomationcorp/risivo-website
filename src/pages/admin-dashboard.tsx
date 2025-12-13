import { html } from 'hono/html';

export const AdminDashboardPage = (admin: any) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Risivo Updates Platform</title>
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
            background: #f5f7fa;
            min-height: 100vh;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo img {
            height: 40px;
            width: auto;
        }
        
        .user-menu {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .user-info {
            text-align: right;
        }
        
        .user-name {
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .user-email {
            font-size: 0.8rem;
            opacity: 0.9;
        }
        
        .admin-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
        }
        
        .logout-btn {
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .welcome-section {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .welcome-section h1 {
            font-size: 2rem;
            color: #333;
            margin-bottom: 10px;
        }
        
        .welcome-section p {
            color: #666;
            font-size: 1rem;
        }
        
        .actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        
        .btn-primary {
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .loading {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB8QAAAHECAYAAABP6pBcAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nOzd7VEkV7Yu4LwT8x9OOQCygDwWgCxoxgJQRP1vZEHTFoj+XxENFoi2QGCBqi0QOFADFpwb2bNKU03zUR+ZWTv3fp6IDp2rq5FgZ31k7nevtf7f//3f/1UAAFCw3aqq6oVffz/+LHr6z2zioaqq6TP/+5uF//ulfwYAAADYwGxc1/GcP/fcPkDjqOV1vos/T01jH+Dvf280mT73zwFrEogDAJCr+QPu4oPt/GG2+X/vDej3vo2/Lj48zwP0pw/OAAAAUJTZuF583n+6B9A4HOh6PC4cmF88PP/3/sBoMr15+X8OVAJxAAAGbF61PX/YrRf+3k6BF/ZrPBzPH4RvXjl9DgAAAIOxEHgfPeniNtSguwtfF0Lzv/8qMAeBOAAA6Zs/6NYLwXepofe6vkYwPl34IygHAAAgGbNxPT/wfvRkL8Dz/+bmleZ3C/sDTWt249oogkAcAICU7MaDb73wZ0itzYfm9klI7kEYAACATs3G9e6T5/59ld5btXiI/sYMc3IkEAcAYJvm4ff8r8Lv7buNB+D5g7D55AAAAKxlIfw+cvB9UB4X9gW+HaAXkjNkAnEAAPqy+yQAd/p7GL4uPATfaLUOAADAS2bjun7y7C/8zsfTkPxmNJk6RM8gCMQBAOjS0cIfAXge7ququl4IyD38AgAAFGo2rj33l+27Q/SqyEmVQBwAgDY1c7+OFx6Gd6xu9m4XAnIzyAEAADImAOcN9wsH6AXkJEMgDgDAppo2aKfxMHxgNYs2f/C9jj8AAAAM2EIL9GMBOGtY3CfQYp2teSkQP44/+y4NmZs+afN5E399UOEEAK86XnggNg+M5zwuVI5fa60OAACQvtm43l143jcDnLZ9nR+iH02mMhh68zQQbz7cLn3AwXe+LgTkDwuzMn1YA1Ca5lT4WTwUa4XOqq5UjgMAAKRnNq73FwolVYHTl8eFfQLV43RqMRBv2lx+ttywkq8RjN8tzM30oc22zVsX165EER7ipvGy9IWgM/sLIbhDk7ThceFz68aKEnQpK8tdl58BsaE7H+UBq2ie6S/MuiQlUal5Gt+TsIrmM+1SBSYviVboxp+Rki8L1eNyFlo1D8SbD74/LS204j5uOG8WQnLow25sLL6z2kW6j4cY4RJt2I0NtzMPxXTsPr67LiMgozx1XH+fNWW6jfuX1t7/s3F9UVXV+9IXlo19qqrq3EYs2zYb1+dxT647E5toAqZTn2lU34fgDr2TOuE4rZoH4jfaYECnbhfmZwrI6cJuvMZsJvOLanE2cBQPxicWkS24XQjHKUMd9y82+cv2GN8/Gz8nzcb1tcOhtKjpCHdkA5ZtmY3rS/fltMhnWsGie47ObwyZcJyNNYF482H4l6WE3jwuhOPXWqzTkqkwnNDapjLFmFeDn3swJhGPEYpfqBrP2m5cX2E4VXSLqDd5NlIZTke+jCZTbarpXVSGf7DytOzraDI1Xq8QCzPBT+0ZkpkvMQ7i2oVlFU0g3pwM+s2qwdZ8jU3fa5u+rKm5sf1s8Vhwa2YmS5ifED8VSJGwLxGMGweRH1VvPPUxDmetLDZ8HfSnKz+PJlPfQ/QmZoY7NEZXfhlNpjoyZWw2ruft0HXNIXePkalcjCZThUG8qQnEnTiEdAjHWYfqcJ7zk88RXqAtOkN0H0GZ7jr5eLDRzxOP0TlgZarD6ZgqcXo1G9eKl+iSKvEMLcwFd+CdUt3HYfpLLdV5yT+sDCTlIB56/oqQ82zdTSGKIgznOSrEeeooqmz/EIYzQHvRDeUugnH3R8N2ZKOOZ+xE2/R12NinS++iCwH05cxK0yF7SJloukk01eCzcd3sIf8ZhwPdY1OqvchV/j0b15ezcW1flB8IxCFd83D831EN5UQ6z/Hlzkts2jF3... (line truncated)" alt="Risivo Logo">
            </div>
            <div class="user-menu">
                <div class="admin-badge">ADMIN</div>
                <div class="user-info">
                    <div class="user-name">${admin.full_name}</div>
                    <div class="user-email">${admin.email}</div>
                </div>
                <button class="logout-btn" id="logoutBtn">Logout</button>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="welcome-section">
            <h1>🛠️ Admin Dashboard</h1>
            <p>Manage your updates platform</p>
            <div class="actions">
                <button class="btn-primary" onclick="alert('Create Update UI coming soon!')">
                    ➕ Create New Update
                </button>
            </div>
        </div>
        
        <div id="updatesContainer">
            <div class="loading">⏳ Loading updates...</div>
        </div>
    </div>
    
    <script>
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/updates/admin/login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/updates/admin/login';
            }
        });
    </script>
</body>
</html>
`;
