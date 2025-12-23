# 🔗 Make.com Integration Guide - Risivo Website

**Purpose**: Complete guide for setting up and managing Make.com automations for the Risivo platform.

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Waitlist Subscriber Automation](#waitlist-subscriber-automation)
3. [Investor Automation](#investor-automation)
4. [Email Templates](#email-templates)
5. [Testing & Debugging](#testing--debugging)
6. [Troubleshooting](#troubleshooting)

---

## 1. OVERVIEW

### 1.1 What is Make.com?

Make.com (formerly Integromat) is a visual automation platform that connects the Risivo website to various services without requiring code changes. It handles:

- User account creation in Supabase
- Password reset token generation
- Welcome email delivery via SendGrid
- Data transformation and error handling

### 1.2 Why Make.com?

**Benefits**:
- ✅ **No Code Changes**: Update automation logic without deploying code
- ✅ **Visual Workflows**: Easy to understand and modify
- ✅ **Error Handling**: Built-in retry and error notification
- ✅ **Audit Trail**: Complete history of all executions
- ✅ **Testing Tools**: Test scenarios before going live

### 1.3 Architecture

```
Risivo Website → Webhook → Make.com → Supabase + SendGrid
```

**Data Flow**:
1. User submits form on risivo.com
2. Website POSTs data to `/api/webhook/waitlist` or `/api/webhook/investor`
3. Backend forwards data to Make.com webhook URL
4. Make.com creates user in Supabase
5. Make.com generates password reset token
6. Make.com sends welcome email via SendGrid
7. User receives email with password setup link

---

## 2. WAITLIST SUBSCRIBER AUTOMATION

### 2.1 Scenario Overview

**Name**: Risivo Waitlist Subscriber Onboarding  
**Trigger**: Webhook (instant)  
**Modules**: 6-7 modules  
**Estimated Setup Time**: 30-45 minutes

### 2.2 Step-by-Step Setup

#### **Module 1: Webhook Trigger**

1. Add **Webhooks > Custom Webhook** module
2. Click **Create a webhook**
3. Name it: `Risivo Waitlist Webhook`
4. Copy the webhook URL (looks like: `https://hook.eu1.make.com/xxxxxxxxxxxxx`)
5. **IMPORTANT**: Save this URL! You'll need it for Cloudflare Pages environment variables

**Data Structure**: The webhook will receive this JSON:
```json
{
  "type": "waitlist",
  "language": "english",
  "business_name": "Acme Corp",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@acme.com",
  "country_code": "+1",
  "phone": "5551234567",
  "discount_offer": "50_percent_lifetime",
  "source": "waitlist-modal",
  "timestamp": "2025-12-16T12:00:00.000Z"
}
```

#### **Module 2: Set Variables (Generate Token)**

1. Add **Tools > Set Variable** module
2. Create these variables:

**Variable 1: reset_token**
- Name: `reset_token`
- Value: `{{uuid}}`
- Description: Password reset token (36-character UUID)

**Variable 2: full_phone**
- Name: `full_phone`
- Value: `{{1.country_code}}{{1.phone}}`
- Description: Complete phone number with country code

**Variable 3: expires_at**
- Name: `expires_at`
- Value: `{{addHours(now; 24)}}`
- Description: Token expiry (24 hours from now)

#### **Module 3: Create User in Supabase**

1. Add **HTTP > Make a Request** module
2. Configure:

**URL**: `https://sldpdgdkrakfzwtroglx.supabase.co/rest/v1/users`

**Method**: POST

**Headers**:
```
apikey: [Your SUPABASE_ANON_KEY]
Authorization: Bearer [Your SUPABASE_SERVICE_ROLE_KEY]
Content-Type: application/json
Prefer: return=representation
```

**Body** (as JSON):
```json
{
  "email": "{{1.email}}",
  "first_name": "{{1.first_name}}",
  "last_name": "{{1.last_name}}",
  "business_name": "{{1.business_name}}",
  "phone": "{{2.full_phone}}",
  "language": "{{1.language}}",
  "user_type": "waitlist",
  "status": "pending_password",
  "discount_offer": "{{1.discount_offer}}",
  "source": "{{1.source}}",
  "created_at": "{{now}}"
}
```

**Parse Response**: Yes

**Expected Response**: User object with generated `id`

#### **Module 4: Create Password Reset Token**

1. Add **HTTP > Make a Request** module
2. Configure:

**URL**: `https://sldpdgdkrakfzwtroglx.supabase.co/rest/v1/password_reset_tokens`

**Method**: POST

**Headers**: Same as Module 3

**Body** (as JSON):
```json
{
  "user_id": "{{3.id}}",
  "token": "{{2.reset_token}}",
  "expires_at": "{{2.expires_at}}",
  "used": false
}
```

#### **Module 5: Send Welcome Email (SendGrid)**

1. Add **SendGrid > Send an Email** module
2. Create connection:
   - Click **Add** next to Connection
   - Enter your SendGrid API key
   - Test connection

3. Configure email:

**From Email**: `noreply@risivo.com`  
**From Name**: `Risivo Team`  
**To Email**: `{{1.email}}`  
**Subject**: `Welcome to Risivo, {{1.first_name}}! Set Up Your Account 🎉`  
**Content Type**: HTML  

**HTML Content**: (See section 4.1 for full template)

Key dynamic fields in template:
- `{{1.first_name}}` - User's first name
- `{{1.email}}` - User's email
- `{{2.reset_token}}` - Password setup token
- Link: `https://risivo.com/updates/set-password?token={{2.reset_token}}&email={{1.email}}`

#### **Module 6: Error Handler (Optional but Recommended)**

1. Right-click on any module
2. Add **Error Handler**
3. Choose **Email** or **Webhooks > Custom Webhook**
4. Send notification to admin email if anything fails

**Example Error Email**:
- To: `admin@velocityautomation.com`
- Subject: `[URGENT] Risivo Waitlist Automation Failed`
- Body: Include error details, user email, timestamp

### 2.3 Testing the Scenario

1. Click **Run Once** button
2. Go to risivo.com
3. Fill out waitlist form
4. Submit
5. Check Make.com execution log
6. Verify:
   - ✅ Webhook received data
   - ✅ User created in Supabase
   - ✅ Token created
   - ✅ Email sent via SendGrid
   - ✅ User received email

### 2.4 Activating the Scenario

1. Click **Scheduling** toggle (bottom left)
2. Set to **Immediately as data arrives** (instant)
3. Click **OK**
4. Scenario is now ACTIVE ✅

### 2.5 Setting Webhook URL in Cloudflare

1. Copy your webhook URL from Module 1
2. Go to Cloudflare Pages Dashboard
3. Navigate to risivo-production → Settings → Environment Variables
4. Add variable:
   - **Name**: `MAKE_WAITLIST_WEBHOOK_URL`
   - **Value**: `https://hook.eu1.make.com/xxxxxxxxxxxxx`
   - **Environment**: Production
5. Save
6. Redeploy if necessary

---

## 3. INVESTOR AUTOMATION

### 3.1 Scenario Overview

**Name**: Risivo Investor Onboarding  
**Trigger**: Webhook (instant)  
**Modules**: 6-7 modules (similar to waitlist, with modifications)

### 3.2 Key Differences from Waitlist

**Module 1: Webhook**
- Create a NEW webhook (different URL)
- Data structure includes `open_to_demo` field

**Module 3: Create User**
- Set `user_type` to `"investor"` (not "waitlist")
- Set `discount_offer` to `null` (investors don't get discount)
- Add `open_to_demo` field: `{{1.open_to_demo}}`

**Module 5: Email Template**
- Different subject line
- Mention "Investor Portal" instead of waitlist
- No mention of "50% discount"
- Emphasize exclusive access to financials

### 3.3 Investor Webhook Data Structure

```json
{
  "type": "investor",
  "language": "english",
  "business_name": "Investment Fund LLC",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@fund.com",
  "country_code": "+44",
  "phone": "7700900123",
  "open_to_demo": "yes",
  "timestamp": "2025-12-16T12:00:00.000Z"
}
```

### 3.4 Setting Investor Webhook URL

Add to Cloudflare Pages environment variables:
- **Name**: `MAKE_INVESTOR_WEBHOOK_URL`
- **Value**: `https://hook.eu1.make.com/yyyyyyyyyyyyy` (different from waitlist)

---

## 4. EMAIL TEMPLATES

### 4.1 Waitlist Welcome Email Template

**Subject**: `Welcome to Risivo, {{first_name}}! Set Up Your Account 🎉`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .content p {
            margin: 0 0 15px 0;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
        }
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .info-box strong {
            color: #667eea;
            display: block;
            margin-bottom: 8px;
        }
        .features-list {
            margin: 20px 0;
            padding: 0;
        }
        .features-list li {
            margin: 10px 0;
            padding-left: 10px;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Risivo, {{first_name}}!</h1>
            <p>You're on the list! Let's set up your account.</p>
        </div>
        
        <div class="content">
            <p>Hi {{first_name}},</p>
            
            <p>Thank you for joining the Risivo revolution! We've created your account and you're now part of an exclusive group getting early access to the future of CRM.</p>
            
            <div class="info-box">
                <strong>✅ Your 50% Lifetime Discount is Locked In!</strong>
                You're one of the first to join, and your special pricing is secured forever.
            </div>
            
            <p><strong>Next Step: Set Up Your Password</strong></p>
            
            <p>Click the button below to create your password and access our Development Update Platform where you can track our progress in real-time:</p>
            
            <center>
                <a href="https://risivo.com/updates/set-password?token={{reset_token}}&email={{email}}" class="button">
                    🔐 Set Up My Password
                </a>
            </center>
            
            <div class="info-box">
                <strong>📧 Your Login Email:</strong> {{email}}<br>
                <strong>🔗 Platform URL:</strong> <a href="https://risivo.com/updates/login">https://risivo.com/updates/login</a>
            </div>
            
            <p><strong>What You'll Get Access To:</strong></p>
            <ul class="features-list">
                <li>📹 Weekly development video updates</li>
                <li>🎯 Feature roadmap and progress tracking</li>
                <li>💬 Direct feedback channel to our team</li>
                <li>🎁 Exclusive early access features</li>
                <li>📊 Real-time project milestones</li>
            </ul>
            
            <p><strong>⏰ This link expires in 24 hours</strong>, so make sure to set up your password soon!</p>
            
            <p>If you have any questions, just reply to this email. We're here to help!</p>
            
            <p>Welcome aboard! 🚀</p>
            
            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The Risivo Team</strong><br>
                Velocity Automation Corp.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>© 2025 Risivo® by Velocity Automation Corp.</strong></p>
            <p>All rights reserved.</p>
            <p style="margin-top: 15px;">This email was sent to {{email}} because you joined our waitlist at risivo.com</p>
        </div>
    </div>
</body>
</html>
```

### 4.2 Investor Welcome Email Template

**Subject**: `Welcome to Risivo Investor Portal, {{first_name}}! 💼`

```html
<!-- Similar structure to waitlist template, but with these changes: -->

<!-- Header -->
<h1>💼 Welcome to Risivo, {{first_name}}!</h1>
<p>Thank you for your interest in investing with us.</p>

<!-- Remove discount badge -->
<!-- Replace with: -->
<div class="info-box">
    <strong>🔐 Exclusive Investor Portal Access</strong>
    You now have access to our private investor portal with confidential materials.
</div>

<!-- Features List (replace with investor-specific items) -->
<ul class="features-list">
    <li>📊 Detailed financial projections</li>
    <li>📈 Business plan and strategy documents</li>
    <li>🎯 Product roadmap and timeline</li>
    <li>💼 Pitch deck and investor materials</li>
    <li>📉 Market analysis and competitive landscape</li>
    <li>👥 Team bios and organizational structure</li>
</ul>

<!-- Additional note if they selected "Yes" to demo -->
{{#if open_to_demo === "yes"}}
<div class="info-box">
    <strong>📅 Live Demo Meeting</strong>
    You indicated interest in a live demo. Our team will reach out within 48 hours to schedule a meeting.
</div>
{{/if}}
```

### 4.3 Password Reset Email Template

**Subject**: `Reset Your Risivo Password`

**Note**: This is for the `/updates/forgot-password` flow, can be sent directly from backend or via Make.com.

```html
<!-- Similar header and structure -->
<div class="content">
    <p>Hi {{first_name}},</p>
    
    <p>We received a request to reset your password for your Risivo account.</p>
    
    <p>Click the button below to reset your password:</p>
    
    <center>
        <a href="https://risivo.com/updates/reset-password?token={{reset_token}}&email={{email}}" class="button">
            🔐 Reset My Password
        </a>
    </center>
    
    <p><strong>⏰ This link expires in 1 hour.</strong></p>
    
    <p>If you didn't request this password reset, please ignore this email or contact us if you have concerns.</p>
    
    <p>Best regards,<br>
    <strong>The Risivo Team</strong></p>
</div>
```

---

## 5. TESTING & DEBUGGING

### 5.1 Test Checklist

Before activating scenarios:

1. **Webhook Reception**
   - [ ] Webhook URL is accessible
   - [ ] Data structure matches expected format
   - [ ] All required fields are present

2. **Supabase Integration**
   - [ ] API keys are correct (anon + service role)
   - [ ] User table exists with correct schema
   - [ ] password_reset_tokens table exists
   - [ ] User is created successfully
   - [ ] Token is created successfully

3. **SendGrid Integration**
   - [ ] API key is valid
   - [ ] From email is verified in SendGrid
   - [ ] Email template renders correctly
   - [ ] Dynamic fields populate correctly
   - [ ] Links work (password setup URL)

4. **End-to-End Flow**
   - [ ] Submit form on risivo.com
   - [ ] Check Make.com execution log (success)
   - [ ] Check Supabase (user + token created)
   - [ ] Check email inbox (welcome email received)
   - [ ] Click password setup link (opens correct page)
   - [ ] Set password (user can login)

### 5.2 Make.com Debugging Tools

**Execution History**:
- View last 100 executions
- See input/output data for each module
- Identify which module failed

**Manual Run**:
- Click **Run Once**
- Trigger form submission manually
- Watch execution in real-time

**Incomplete Executions**:
- Shows scenarios that failed
- Retry failed executions
- Update scenario and reprocess

**Data Store** (optional):
- Store execution history
- Log errors for analysis
- Track user signups over time

### 5.3 Common Test Cases

**Test Case 1: Happy Path**
- Submit form with all valid data
- Expect: User created, email sent, token generated

**Test Case 2: Duplicate Email**
- Submit same email twice
- Expect: Error (email already exists)
- Action: Add error handling in Make.com

**Test Case 3: Invalid Email**
- Submit form with invalid email format
- Expect: Validation error on frontend
- Action: Ensure frontend validates before webhook

**Test Case 4: SendGrid Rate Limit**
- Submit multiple forms quickly
- Expect: Some emails delayed
- Action: Check SendGrid quota, add retry logic

**Test Case 5: Expired Token**
- Wait 25 hours, try to use password setup link
- Expect: "Token expired" error
- Action: User must request new password reset

---

## 6. TROUBLESHOOTING

### 6.1 Common Issues

#### **Issue 1: Webhook Not Receiving Data**

**Symptoms**:
- No executions in Make.com
- Form submits but nothing happens

**Causes & Fixes**:
1. Webhook URL not set in Cloudflare
   - Fix: Add `MAKE_WAITLIST_WEBHOOK_URL` to environment variables
2. Webhook URL incorrect
   - Fix: Copy exact URL from Make.com, no typos
3. Scenario not activated
   - Fix: Turn on scheduling toggle in Make.com

#### **Issue 2: User Not Created in Supabase**

**Symptoms**:
- Execution succeeds in Make.com
- No user in Supabase users table

**Causes & Fixes**:
1. Wrong API key or URL
   - Fix: Double-check Supabase credentials
2. Missing required fields
   - Fix: Ensure all NOT NULL columns are provided
3. Table doesn't exist
   - Fix: Run SQL migrations first

#### **Issue 3: Email Not Sent**

**Symptoms**:
- User created in Supabase
- No email received

**Causes & Fixes**:
1. SendGrid API key invalid
   - Fix: Regenerate key in SendGrid dashboard
2. From email not verified
   - Fix: Verify sender identity in SendGrid
3. Email in spam folder
   - Fix: Check spam, configure SPF/DKIM records
4. SendGrid rate limit reached
   - Fix: Upgrade plan or add delay between sends

#### **Issue 4: Password Setup Link Doesn't Work**

**Symptoms**:
- Email received
- Click link, page shows "Invalid token"

**Causes & Fixes**:
1. Token not created in database
   - Fix: Check Module 4 in Make.com
2. Token expired (>24 hours old)
   - Fix: User must request new password reset
3. Password setup page not implemented
   - Fix: Ensure `/updates/set-password` route exists

### 6.2 Debug Logs

**Enable in Make.com**:
- Add **Tools > Set Variable** modules to log data at key points
- Example: Log user ID after creation, token after generation

**Check Cloudflare Logs**:
```bash
wrangler tail --project-name=risivo-production
```

**Check Supabase Logs**:
- Go to Supabase Dashboard → Logs → API
- Filter by status code, table name, or timestamp

### 6.3 Getting Help

**Make.com Support**:
- Help Center: https://www.make.com/en/help
- Community Forum: https://community.make.com
- Support Ticket (paid plans)

**Supabase Support**:
- Documentation: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub Issues

**SendGrid Support**:
- Documentation: https://docs.sendgrid.com
- Support Portal: https://support.sendgrid.com
- Status Page: https://status.sendgrid.com

---

## 7. BEST PRACTICES

### 7.1 Security

1. **Never expose API keys publicly**
   - Store in Make.com connection settings
   - Use environment variables in Cloudflare

2. **Use service role key carefully**
   - Only in Make.com (server-side)
   - Never send to frontend

3. **Validate data before database insertion**
   - Check email format
   - Sanitize user input
   - Prevent SQL injection (Supabase client handles this)

### 7.2 Error Handling

1. **Add error handlers to critical modules**
   - User creation (Module 3)
   - Email sending (Module 5)

2. **Send admin notifications on failure**
   - Email or Slack message
   - Include error details

3. **Retry failed executions**
   - Check "Incomplete Executions" daily
   - Retry or investigate

### 7.3 Monitoring

1. **Check execution history weekly**
   - Look for patterns in failures
   - Optimize slow modules

2. **Monitor SendGrid usage**
   - Track email deliverability
   - Watch for bounces/spam complaints

3. **Track user signups**
   - Use Make.com Data Store
   - Or query Supabase directly

### 7.4 Maintenance

1. **Update email templates as needed**
   - Edit in Make.com Module 5
   - Test before saving

2. **Archive old scenarios**
   - Keep backup of working scenarios
   - Version control for templates

3. **Review token expiration policy**
   - Current: 24 hours
   - Adjust in Module 2 if needed

---

## 8. ADVANCED FEATURES

### 8.1 Data Store for Analytics

Create a Data Store in Make.com to track signups:

**Structure**:
```json
{
  "email": "john@example.com",
  "first_name": "John",
  "user_type": "waitlist",
  "signup_date": "2025-12-16",
  "email_opened": false,
  "password_set": false
}
```

**Use Cases**:
- Track conversion rates
- Monitor email engagement
- Identify users who haven't set password

### 8.2 Webhooks for Additional Services

Forward data to other services:
- **Slack**: Notify team of new signups
- **Google Sheets**: Log signups for analysis
- **Zapier/n8n**: Integrate with other tools

### 8.3 Conditional Logic

Add **Router** modules to:
- Send different emails based on language preference
- Skip demo scheduling if user selected "No"
- Apply different templates for high-value leads

---

## 9. CONCLUSION

This guide should help you set up and maintain Make.com automations for the Risivo platform. Key takeaways:

1. ✅ **Waitlist and Investor automations are separate scenarios**
2. ✅ **Always test before activating**
3. ✅ **Monitor execution logs regularly**
4. ✅ **Handle errors gracefully with notifications**
5. ✅ **Keep email templates updated**

**Remember**: Make.com gives you flexibility to iterate on your automation logic without code deployments. Take advantage of this to continuously improve the user onboarding experience!

---

**Document Version**: 1.0  
**Last Updated**: December 16, 2025  
**Status**: Production Ready
