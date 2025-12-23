# 🔐 Signup Pages Implementation Guide

**Purpose**: Complete technical guide for building two separate signup pages for Waitlist Subscribers and Investors, including database schema, API routes, and frontend UI.

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Routes](#api-routes)
4. [Signup Pages UI](#signup-pages-ui)
5. [Authentication System](#authentication-system)
6. [Testing](#testing)

---

## 1. ARCHITECTURE OVERVIEW

### **User Journey**

```
┌──────────────────────────────────────────────────────────────┐
│                      USER SUBMITS FORM                       │
│                   (Waitlist or Investor)                     │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   MAKE.COM SENDS EMAIL                       │
│              with signup link + pre-filled data              │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              USER CLICKS SIGNUP LINK IN EMAIL                │
│   /updates/signup/waitlist  OR  /updates/signup/investor    │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                  SIGNUP PAGE OPENS                           │
│         - Email pre-filled (read-only)                       │
│         - Name pre-filled                                    │
│         - User creates password                              │
│         - Accepts terms                                      │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                  USER SUBMITS SIGNUP FORM                    │
│              POST /api/auth/signup/{type}                    │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│             BACKEND CREATES USER IN SUPABASE                 │
│         - Hash password with bcrypt                          │
│         - Store user with appropriate user_type              │
│         - Set investor_status if investor                    │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   AUTO-LOGIN USER                            │
│         - Create session cookie                              │
│         - Redirect based on user_type                        │
└─────────────────────────┬────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌────────────────────┐          ┌──────────────────────────┐
│  WAITLIST USER     │          │    INVESTOR USER         │
│  → /updates        │          │  → /updates/investor/    │
│  (Main Dashboard)  │          │       nda-review         │
└────────────────────┘          └──────────────────────────┘
```

---

## 2. DATABASE SCHEMA

### **2.1 Users Table**

```sql
-- Users table with support for waitlist and investor types
CREATE TABLE IF NOT EXISTS users (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Profile Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(20),
    language VARCHAR(20) DEFAULT 'english',
    
    -- User Type & Status
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('waitlist', 'investor', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    
    -- Waitlist-Specific Fields
    discount_offer VARCHAR(50), -- e.g., '50_percent_lifetime'
    source VARCHAR(50), -- e.g., 'waitlist-modal', 'referral'
    
    -- Investor-Specific Fields
    investor_status VARCHAR(20) CHECK (
        investor_status IN ('pending_nda', 'nda_signed', 'active', 'rejected') 
        OR investor_status IS NULL
    ),
    nda_signed_at TIMESTAMP,
    nda_ip_address VARCHAR(45),
    admin_approved_by UUID REFERENCES users(id),
    admin_approved_at TIMESTAMP,
    open_to_demo BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    
    -- Constraints
    CONSTRAINT user_type_investor_status CHECK (
        (user_type = 'investor' AND investor_status IS NOT NULL) OR
        (user_type != 'investor' AND investor_status IS NULL)
    )
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_investor_status ON users(investor_status);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

### **2.2 NDA Signatures Table**

```sql
-- NDA signatures for investors
CREATE TABLE IF NOT EXISTS nda_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Signature Details
    full_name_typed VARCHAR(200) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    
    -- Legal Compliance
    nda_version VARCHAR(20) DEFAULT 'v1.0',
    nda_text_hash VARCHAR(64), -- SHA-256 hash of the NDA text
    signature_timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Unique constraint: one signature per user per NDA version
    UNIQUE(user_id, nda_version)
);

CREATE INDEX idx_nda_signatures_user_id ON nda_signatures(user_id);
CREATE INDEX idx_nda_signatures_timestamp ON nda_signatures(signature_timestamp DESC);
```

---

### **2.3 Sessions Table (for authentication)**

```sql
-- Session management for logged-in users
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Session Data
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    
    -- Tracking
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Cleanup expired sessions periodically
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
```

---

### **2.4 Sample Data (for testing)**

```sql
-- Sample waitlist user
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    business_name, 
    phone, 
    user_type, 
    discount_offer, 
    source
) VALUES (
    'john.doe@example.com',
    '$2a$10$...[bcrypt hash]',
    'John',
    'Doe',
    'Acme Corp',
    '+15551234567',
    'waitlist',
    '50_percent_lifetime',
    'waitlist-modal'
);

-- Sample investor user
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    business_name, 
    phone, 
    user_type, 
    investor_status,
    open_to_demo
) VALUES (
    'jane.smith@fund.com',
    '$2a$10$...[bcrypt hash]',
    'Jane',
    'Smith',
    'Investment Fund LLC',
    '+447700900123',
    'investor',
    'pending_nda',
    true
);
```

---

## 3. API ROUTES

### **3.1 API Endpoint Structure**

```
/api/auth/
├── signup/
│   ├── waitlist (POST) - Create waitlist user account
│   └── investor (POST) - Create investor user account
├── login (POST) - Authenticate user
├── logout (POST) - End user session
├── me (GET) - Get current user info
└── verify-email (GET) - Email verification (future)

/api/investor/
├── sign-nda (POST) - Sign NDA
└── check-nda-status (GET) - Check if NDA signed

/api/admin/
├── users (GET) - List all users
├── users/:id (GET/PATCH/DELETE) - Manage user
└── pending-investors (GET) - List investors pending approval
```

---

### **3.2 POST /api/auth/signup/waitlist**

**Purpose**: Create a new waitlist subscriber account

**Request Body**:
```typescript
{
  email: string;           // Required, valid email format
  password: string;        // Required, min 8 chars
  first_name: string;      // Required
  last_name: string;       // Required
  business_name?: string;  // Optional
  phone?: string;          // Optional
  language?: string;       // Default: 'english'
}
```

**Response (201 Created)**:
```typescript
{
  success: true,
  user: {
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    user_type: 'waitlist',
    discount_offer: '50_percent_lifetime'
  },
  session_token: string
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Database or hashing error

**Implementation** (Cloudflare Workers):
```typescript
// src/api/auth/signup-waitlist.ts
import { Hono } from 'hono';
import bcrypt from 'bcryptjs';

const app = new Hono();

app.post('/api/auth/signup/waitlist', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validation
    if (!body.email || !body.password || !body.first_name || !body.last_name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    if (body.password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(body.password, 10);
    
    // Create user in Supabase
    const supabaseUrl = c.env.SUPABASE_URL;
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        email: body.email.toLowerCase(),
        password_hash,
        first_name: body.first_name,
        last_name: body.last_name,
        business_name: body.business_name || null,
        phone: body.phone || null,
        language: body.language || 'english',
        user_type: 'waitlist',
        status: 'active',
        discount_offer: '50_percent_lifetime',
        source: 'signup-page'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      if (error.code === '23505') { // Unique constraint violation
        return c.json({ error: 'Email already exists' }, 409);
      }
      throw new Error('Failed to create user');
    }
    
    const user = await response.json();
    
    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    await fetch(`${supabaseUrl}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user[0].id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: c.req.header('CF-Connecting-IP'),
        user_agent: c.req.header('User-Agent')
      })
    });
    
    // Set cookie
    c.res.headers.set('Set-Cookie', `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`);
    
    return c.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        user_type: user[0].user_type,
        discount_offer: user[0].discount_offer
      },
      session_token: sessionToken
    }, 201);
    
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
```

---

### **3.3 POST /api/auth/signup/investor**

**Purpose**: Create a new investor account

**Request Body**:
```typescript
{
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  business_name?: string;
  phone?: string;
  language?: string;
  open_to_demo?: boolean;
}
```

**Response (201 Created)**:
```typescript
{
  success: true,
  user: {
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    user_type: 'investor',
    investor_status: 'pending_nda'
  },
  session_token: string,
  redirect_to: '/updates/investor/nda-review'
}
```

**Implementation** (similar to waitlist, with investor-specific fields):
```typescript
// Key differences:
user_type: 'investor',
investor_status: 'pending_nda',
open_to_demo: body.open_to_demo || false,
source: 'investor-signup-page'

// No discount_offer field for investors
```

---

### **3.4 POST /api/auth/login**

**Purpose**: Authenticate existing user

**Request Body**:
```typescript
{
  email: string;
  password: string;
}
```

**Response (200 OK)**:
```typescript
{
  success: true,
  user: {
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    user_type: 'waitlist' | 'investor' | 'admin',
    investor_status?: string
  },
  session_token: string
}
```

**Implementation**:
```typescript
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // Fetch user from database
  const supabaseUrl = c.env.SUPABASE_URL;
  const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email.toLowerCase()}`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  
  const users = await response.json();
  
  if (users.length === 0) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  const user = users[0];
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isValid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  // Create session (similar to signup)
  // ...
  
  return c.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      investor_status: user.investor_status
    },
    session_token: sessionToken
  });
});
```

---

### **3.5 GET /api/auth/me**

**Purpose**: Get current authenticated user info

**Headers**: `Cookie: session=<session_token>`

**Response (200 OK)**:
```typescript
{
  id: string,
  email: string,
  first_name: string,
  last_name: string,
  user_type: string,
  investor_status?: string
}
```

**Response (401 Unauthorized)** if not logged in:
```typescript
{
  error: 'Not authenticated'
}
```

---

### **3.6 POST /api/investor/sign-nda**

**Purpose**: Record NDA signature for investor

**Request Body**:
```typescript
{
  full_name_typed: string;    // User's typed signature
  nda_version: string;        // e.g., 'v1.0'
  nda_text_hash: string;      // SHA-256 of NDA text
}
```

**Response (200 OK)**:
```typescript
{
  success: true,
  message: 'NDA signed successfully',
  investor_status: 'nda_signed'
}
```

**Implementation**:
```typescript
app.post('/api/investor/sign-nda', async (c) => {
  // Get user from session
  const user = await getCurrentUser(c);
  
  if (!user || user.user_type !== 'investor') {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const { full_name_typed, nda_version, nda_text_hash } = await c.req.json();
  
  // Record signature
  await fetch(`${supabaseUrl}/rest/v1/nda_signatures`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: user.id,
      full_name_typed,
      ip_address: c.req.header('CF-Connecting-IP'),
      user_agent: c.req.header('User-Agent'),
      nda_version,
      nda_text_hash
    })
  });
  
  // Update user's investor_status
  await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user.id}`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      investor_status: 'nda_signed',
      nda_signed_at: new Date().toISOString(),
      nda_ip_address: c.req.header('CF-Connecting-IP')
    })
  });
  
  return c.json({
    success: true,
    message: 'NDA signed successfully',
    investor_status: 'nda_signed'
  });
});
```

---

## 4. SIGNUP PAGES UI

### **4.1 Waitlist Signup Page**

**Route**: `/updates/signup/waitlist`

**URL Parameters**:
- `email` (required) - Pre-filled from email link
- `name` (optional) - Full name to split into first/last
- `business` (optional) - Pre-filled business name

**Page Structure**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Create Your Risivo Account</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Gradient background matching brand */
        body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .signup-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 450px;
            padding: 40px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h1 {
            color: #667eea;
            margin: 0;
            font-size: 32px;
        }
        
        .welcome-badge {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .welcome-badge h3 {
            margin: 0 0 5px 0;
            font-size: 18px;
        }
        
        .welcome-badge p {
            margin: 0;
            font-size: 14px;
            opacity: 0.95;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .form-group input:read-only {
            background-color: #f8f9fa;
            cursor: not-allowed;
        }
        
        .password-strength {
            margin-top: 8px;
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            overflow: hidden;
        }
        
        .password-strength-bar {
            height: 100%;
            width: 0%;
            transition: all 0.3s;
        }
        
        .password-strength-bar.weak {
            width: 33%;
            background: #dc3545;
        }
        
        .password-strength-bar.medium {
            width: 66%;
            background: #ffc107;
        }
        
        .password-strength-bar.strong {
            width: 100%;
            background: #28a745;
        }
        
        .password-hint {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        
        .checkbox-group {
            margin: 20px 0;
        }
        
        .checkbox-group label {
            display: flex;
            align-items: flex-start;
            font-size: 14px;
            color: #333;
        }
        
        .checkbox-group input[type="checkbox"] {
            margin-right: 10px;
            margin-top: 3px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        
        .submit-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .error-message {
            background: #ffe5e5;
            color: #d32f2f;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
        
        .login-link {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
        
        .login-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        
        .login-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="signup-container">
        <div class="logo">
            <h1>🚀 Risivo</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Create Your Account</p>
        </div>
        
        <div class="welcome-badge">
            <h3>🎁 50% Lifetime Discount Locked In!</h3>
            <p>Your early supporter pricing is secured</p>
        </div>
        
        <div id="errorMessage" class="error-message"></div>
        
        <form id="signupForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    readonly
                    placeholder="your@email.com"
                />
            </div>
            
            <div class="form-group">
                <label for="first_name">First Name</label>
                <input 
                    type="text" 
                    id="first_name" 
                    name="first_name" 
                    required
                    placeholder="John"
                />
            </div>
            
            <div class="form-group">
                <label for="last_name">Last Name</label>
                <input 
                    type="text" 
                    id="last_name" 
                    name="last_name" 
                    required
                    placeholder="Doe"
                />
            </div>
            
            <div class="form-group">
                <label for="business_name">Business Name (Optional)</label>
                <input 
                    type="text" 
                    id="business_name" 
                    name="business_name"
                    placeholder="Acme Corp"
                />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required
                    minlength="8"
                    placeholder="At least 8 characters"
                />
                <div class="password-strength">
                    <div id="passwordStrengthBar" class="password-strength-bar"></div>
                </div>
                <p class="password-hint">Use at least 8 characters with letters and numbers</p>
            </div>
            
            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirm_password" 
                    name="confirm_password" 
                    required
                    placeholder="Re-type your password"
                />
            </div>
            
            <div class="checkbox-group">
                <label>
                    <input type="checkbox" id="terms" required />
                    <span>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a></span>
                </label>
            </div>
            
            <button type="submit" class="submit-btn" id="submitBtn">
                Create My Account
            </button>
        </form>
        
        <div class="login-link">
            Already have an account? <a href="/updates/login">Sign In</a>
        </div>
    </div>
    
    <script>
        // Pre-fill form from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById('email').value = urlParams.get('email') || '';
        
        const fullName = urlParams.get('name') || '';
        if (fullName) {
            const parts = fullName.split(' ');
            document.getElementById('first_name').value = parts[0] || '';
            document.getElementById('last_name').value = parts.slice(1).join(' ') || '';
        }
        
        document.getElementById('business_name').value = urlParams.get('business') || '';
        
        // Password strength indicator
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('passwordStrengthBar');
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;
            
            strengthBar.className = 'password-strength-bar';
            if (strength === 1 || strength === 2) strengthBar.classList.add('weak');
            else if (strength === 3) strengthBar.classList.add('medium');
            else if (strength >= 4) strengthBar.classList.add('strong');
        });
        
        // Form submission
        const form = document.getElementById('signupForm');
        const submitBtn = document.getElementById('submitBtn');
        const errorMessage = document.getElementById('errorMessage');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.classList.add('show');
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';
            errorMessage.classList.remove('show');
            
            try {
                const response = await fetch('/api/auth/signup/waitlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: document.getElementById('email').value,
                        password: password,
                        first_name: document.getElementById('first_name').value,
                        last_name: document.getElementById('last_name').value,
                        business_name: document.getElementById('business_name').value || null
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Success! Redirect to dashboard
                    window.location.href = '/updates';
                } else {
                    // Show error
                    errorMessage.textContent = data.error || 'Failed to create account';
                    errorMessage.classList.add('show');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create My Account';
                }
            } catch (error) {
                errorMessage.textContent = 'Network error. Please try again.';
                errorMessage.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create My Account';
            }
        });
    </script>
</body>
</html>
```

---

### **4.2 Investor Signup Page**

**Route**: `/updates/signup/investor`

**Key Differences from Waitlist Page**:
1. **No "50% Discount" badge** - replace with "Investor Portal Access" badge
2. **NDA Notice** - prominent banner explaining NDA requirement
3. **Different redirect** - after signup, redirect to `/updates/investor/nda-review`
4. **Additional field** - "Open to demo" checkbox (pre-checked if came from email)

**HTML Changes**:
```html
<!-- Replace welcome badge with investor badge -->
<div class="welcome-badge" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <h3>📊 Investor Portal Access</h3>
    <p>Access confidential materials and investor updates</p>
</div>

<!-- Add NDA notice -->
<div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
    <p style="margin: 0; font-size: 14px; color: #856404;">
        <strong>⚠️ Important:</strong> After creating your account, you'll be required to review and sign our Non-Disclosure Agreement (NDA) before accessing investor materials.
    </p>
</div>

<!-- Add "Open to demo" checkbox -->
<div class="checkbox-group">
    <label>
        <input type="checkbox" id="open_to_demo" name="open_to_demo" />
        <span>I'm interested in scheduling a live demo with the team</span>
    </label>
</div>

<!-- Update form submission -->
<script>
    // Pre-check demo checkbox if URL param says so
    const openToDemo = urlParams.get('demo');
    if (openToDemo === 'yes') {
        document.getElementById('open_to_demo').checked = true;
    }
    
    // On successful signup, redirect to NDA page
    if (response.ok) {
        window.location.href = '/updates/investor/nda-review';
    }
</script>
```

---

## 5. AUTHENTICATION SYSTEM

### **5.1 Middleware: Protect Routes**

```typescript
// src/middleware/auth.ts
import { Context, Next } from 'hono';

export async function requireAuth(c: Context, next: Next) {
  const sessionToken = c.req.cookie('session');
  
  if (!sessionToken) {
    return c.redirect('/updates/login');
  }
  
  // Verify session in database
  const supabaseUrl = c.env.SUPABASE_URL;
  const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const response = await fetch(
    `${supabaseUrl}/rest/v1/sessions?session_token=eq.${sessionToken}&expires_at=gt.${new Date().toISOString()}`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );
  
  const sessions = await response.json();
  
  if (sessions.length === 0) {
    // Invalid or expired session
    return c.redirect('/updates/login');
  }
  
  const session = sessions[0];
  
  // Fetch user
  const userResponse = await fetch(
    `${supabaseUrl}/rest/v1/users?id=eq.${session.user_id}`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );
  
  const users = await userResponse.json();
  
  if (users.length === 0) {
    return c.redirect('/updates/login');
  }
  
  // Attach user to context
  c.set('user', users[0]);
  
  await next();
}

export async function requireInvestor(c: Context, next: Next) {
  await requireAuth(c, next);
  
  const user = c.get('user');
  
  if (user.user_type !== 'investor') {
    return c.redirect('/updates');
  }
  
  await next();
}

export async function requireNDASigned(c: Context, next: Next) {
  await requireInvestor(c, next);
  
  const user = c.get('user');
  
  if (user.investor_status === 'pending_nda') {
    return c.redirect('/updates/investor/nda-review');
  }
  
  await next();
}
```

---

### **5.2 Protected Routes**

```typescript
// src/index.tsx or src/router.ts
import { Hono } from 'hono';
import { requireAuth, requireInvestor, requireNDASigned } from './middleware/auth';

const app = new Hono();

// Public routes
app.get('/updates/signup/waitlist', ...);
app.get('/updates/signup/investor', ...);
app.get('/updates/login', ...);

// Protected routes (all users)
app.get('/updates', requireAuth, ...);
app.get('/updates/profile', requireAuth, ...);

// Investor-only routes
app.get('/updates/investor/nda-review', requireInvestor, ...);
app.get('/updates/investor', requireNDASigned, ...);
app.get('/updates/investor/documents', requireNDASigned, ...);

export default app;
```

---

## 6. TESTING

### **6.1 Manual Testing Checklist**

**Waitlist Signup Flow**:
- [ ] Click signup link in email
- [ ] Email is pre-filled and read-only
- [ ] Name and business are pre-filled
- [ ] Password strength indicator works
- [ ] Confirm password validation works
- [ ] Terms checkbox is required
- [ ] Submit button is disabled during submission
- [ ] Success redirects to `/updates`
- [ ] User is automatically logged in
- [ ] User can see waitlist dashboard

**Investor Signup Flow**:
- [ ] Click investor signup link in email
- [ ] NDA notice is visible
- [ ] "Open to demo" checkbox works
- [ ] Submit button shows loading state
- [ ] Success redirects to `/updates/investor/nda-review`
- [ ] User is automatically logged in
- [ ] User cannot access investor documents yet

**Error Handling**:
- [ ] Duplicate email shows error message
- [ ] Weak password shows error
- [ ] Password mismatch shows error
- [ ] Network error shows error
- [ ] Server error (500) shows error

---

### **6.2 Automated Testing (Optional)**

```typescript
// tests/signup.test.ts
import { describe, it, expect } from 'vitest';

describe('Waitlist Signup', () => {
  it('should create a new waitlist user', async () => {
    const response = await fetch('http://localhost:8787/api/auth/signup/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'SecurePass123!',
        first_name: 'Test',
        last_name: 'User'
      })
    });
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.user.user_type).toBe('waitlist');
    expect(data.session_token).toBeDefined();
  });
  
  it('should reject duplicate email', async () => {
    // First signup
    await fetch('http://localhost:8787/api/auth/signup/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
        first_name: 'First',
        last_name: 'User'
      })
    });
    
    // Second signup with same email
    const response = await fetch('http://localhost:8787/api/auth/signup/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
        first_name: 'Second',
        last_name: 'User'
      })
    });
    
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toContain('already exists');
  });
});
```

---

## 7. NEXT STEPS

**After completing signup pages**:
1. ✅ Build NDA review and signature page (`/updates/investor/nda-review`)
2. ✅ Build login page (`/updates/login`)
3. ✅ Build main dashboard (`/updates`)
4. ✅ Build investor portal (`/updates/investor`)
5. ✅ Build document management system
6. ✅ Deploy to production

---

**Document Version**: 1.0  
**Last Updated**: December 20, 2025  
**Status**: Ready for Implementation
