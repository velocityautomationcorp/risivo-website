# 🔗 Make.com Two-Track Automation Setup Guide

**Purpose**: Step-by-step guide to set up TWO separate Make.com scenarios for Waitlist Subscribers and Investors.

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Scenario A: Waitlist Subscribers](#scenario-a-waitlist-subscribers)
3. [Scenario B: Investors (with NDA)](#scenario-b-investors-with-nda)
4. [Email Templates](#email-templates)
5. [Cloudflare Environment Variables](#cloudflare-environment-variables)
6. [Testing & Activation](#testing--activation)

---

## 1. OVERVIEW

### **Why Two Separate Scenarios?**

Different user types require different onboarding flows:

| Feature | Waitlist | Investor |
|---------|----------|----------|
| **Signup URL** | `/updates/signup/waitlist` | `/updates/signup/investor` |
| **NDA Required** | ❌ No | ✅ Yes |
| **Access Level** | Basic updates only | Investor portal + documents |
| **Special Offer** | 50% lifetime discount | No discount |
| **Follow-up** | Email updates only | Personal demo (optional) |

### **Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     Risivo Website                          │
│                    (Coming Soon Page)                       │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │
                │                     │
    ┌───────────▼──────────┐  ┌──────▼────────────┐
    │ Waitlist Form Submit │  │ Investor Form Submit│
    │ /api/webhook/waitlist│  │ /api/webhook/investor│
    └───────────┬──────────┘  └──────┬────────────┘
                │                     │
                │                     │
    ┌───────────▼──────────┐  ┌──────▼────────────┐
    │  Make.com Scenario A │  │ Make.com Scenario B│
    │   (Waitlist Flow)    │  │  (Investor Flow)   │
    └───────────┬──────────┘  └──────┬────────────┘
                │                     │
                │                     │
    ┌───────────▼──────────┐  ┌──────▼────────────┐
    │ Welcome Email        │  │ Welcome Email      │
    │ + Signup Link        │  │ + NDA Notice       │
    │ (Waitlist)           │  │ + Signup Link      │
    └──────────────────────┘  └────────────────────┘
```

---

## 2. SCENARIO A: WAITLIST SUBSCRIBERS

### **Scenario Overview**

- **Name**: `Risivo - Waitlist Subscriber Onboarding`
- **Modules**: 2 (Webhook + Gmail)
- **Setup Time**: 10-15 minutes
- **Complexity**: ⭐ Simple

---

### **Step-by-Step Setup**

#### **MODULE 1: Webhook Trigger**

1. **Open Make.com** and create a new scenario
2. **Add Module**: `Webhooks > Custom Webhook`
3. **Create Webhook**:
   - Click **"Create a webhook"**
   - **Webhook name**: `Risivo Waitlist Webhook`
   - Click **"Save"**
4. **Copy the Webhook URL** (looks like: `https://hook.eu1.make.com/abc123xyz456...`)
5. **Save this URL** - you'll need it for Cloudflare environment variables

**Expected Data Structure** (automatically detected after first form submission):
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
  "timestamp": "2025-12-20T12:00:00.000Z"
}
```

---

#### **MODULE 2: Send Welcome Email (Gmail)**

1. **Add Module**: `Gmail > Send an Email`
2. **Create Gmail Connection**:
   - Click **"Add"** next to Connection
   - Follow OAuth flow to connect your Gmail account
   - Authorize Make.com to send emails
3. **Configure Email**:

**To**: `{{1.email}}`

**Subject**: `Welcome to Risivo, {{1.first_name}}! Create Your Account 🎉`

**Content Type**: `HTML`

**Content** (copy the full HTML template from Section 4.1 below)

**Key Dynamic Fields**:
- `{{1.first_name}}` - User's first name
- `{{1.last_name}}` - User's last name
- `{{1.email}}` - User's email
- `{{1.business_name}}` - Business name (if provided)

**Signup Link**:
```
https://risivo.com/updates/signup/waitlist?email={{1.email}}&name={{1.first_name}}%20{{1.last_name}}&business={{1.business_name}}
```

---

#### **MODULE 3 (Optional): Error Handler**

1. **Right-click on Module 2** (Gmail)
2. **Add Error Handler Route**
3. **Choose**: `Email` or `Webhooks > Custom Webhook`
4. **Configure**: Send notification to your admin email

**Admin Error Notification Example**:
- **To**: `admin@velocityautomation.com`
- **Subject**: `[ALERT] Risivo Waitlist Email Failed`
- **Body**:
  ```
  Failed to send welcome email to: {{1.email}}
  
  User Details:
  - Name: {{1.first_name}} {{1.last_name}}
  - Business: {{1.business_name}}
  - Timestamp: {{1.timestamp}}
  
  Error: {{2.message}}
  ```

---

### **Testing Scenario A**

1. **Click "Run once"** (bottom of scenario)
2. **Go to your website**: `https://risivo.com`
3. **Fill out the Waitlist form** with test data
4. **Submit the form**
5. **Check Make.com execution log**:
   - Module 1 should show green checkmark ✅
   - Module 2 should show green checkmark ✅
6. **Check your email inbox** - you should receive the welcome email
7. **Click the signup link** - it should open `/updates/signup/waitlist` page

---

## 3. SCENARIO B: INVESTORS (WITH NDA)

### **Scenario Overview**

- **Name**: `Risivo - Investor Onboarding`
- **Modules**: 2 (Webhook + Gmail)
- **Setup Time**: 10-15 minutes
- **Complexity**: ⭐ Simple

---

### **Step-by-Step Setup**

#### **MODULE 1: Webhook Trigger**

1. **Create a NEW scenario** (separate from Waitlist)
2. **Add Module**: `Webhooks > Custom Webhook`
3. **Create Webhook**:
   - **Webhook name**: `Risivo Investor Webhook`
   - Click **"Save"**
4. **Copy the Webhook URL** (DIFFERENT from waitlist webhook!)
5. **Save this URL** - you'll add it as `MAKE_INVESTOR_WEBHOOK_URL`

**Expected Data Structure**:
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
  "timestamp": "2025-12-20T12:00:00.000Z"
}
```

**Note**: Investor data includes `open_to_demo` field (not present in waitlist data).

---

#### **MODULE 2: Send Welcome Email (Gmail)**

1. **Add Module**: `Gmail > Send an Email`
2. **Use the same Gmail connection** from Scenario A
3. **Configure Email**:

**To**: `{{1.email}}`

**Subject**: `Welcome to Risivo Investor Portal, {{1.first_name}}! 📊`

**Content Type**: `HTML`

**Content** (copy the full HTML template from Section 4.2 below)

**Key Differences from Waitlist Email**:
- No mention of "50% discount"
- Emphasizes "Investor Portal" and "confidential materials"
- Mentions NDA requirement
- Lists investor-specific benefits (pitch deck, financials, etc.)

**Signup Link**:
```
https://risivo.com/updates/signup/investor?email={{1.email}}&name={{1.first_name}}%20{{1.last_name}}&business={{1.business_name}}&phone={{1.country_code}}{{1.phone}}
```

---

#### **MODULE 3 (Optional): Conditional Demo Notification**

If investor selected "Yes" to demo, notify your team:

1. **Add Router Module** after Module 2
2. **Add Filter**:
   - Condition: `{{1.open_to_demo}}` equals `yes`
3. **Add Gmail Module**:
   - **To**: `team@risivo.com` or `invest@risivo.com`
   - **Subject**: `[ACTION REQUIRED] New Investor Wants Demo - {{1.first_name}} {{1.last_name}}`
   - **Body**:
     ```
     New investor requested a live demo!
     
     Investor Details:
     - Name: {{1.first_name}} {{1.last_name}}
     - Email: {{1.email}}
     - Business: {{1.business_name}}
     - Phone: {{1.country_code}}{{1.phone}}
     - Submitted: {{1.timestamp}}
     
     ACTION: Schedule a demo call within 48 hours.
     
     Calendar link: https://calendly.com/your-link
     ```

---

### **Testing Scenario B**

1. **Click "Run once"** in Scenario B
2. **Go to your website**: `https://risivo.com`
3. **Switch to the "SaaS Investors" tab**
4. **Fill out the Investor form** with test data
5. **Select "Yes" for demo** (to test Module 3)
6. **Submit the form**
7. **Check Make.com execution log**
8. **Check your email inbox**:
   - User should receive investor welcome email
   - Team should receive demo notification (if open_to_demo = yes)
9. **Click the signup link** - should open `/updates/signup/investor` page

---

## 4. EMAIL TEMPLATES

### **4.1 Waitlist Welcome Email Template**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Risivo! 🎉</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hi <strong>{{1.first_name}}</strong>,
                            </p>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Thank you for joining the <strong>Risivo Waitlist</strong>! We're excited to have you on board. 🚀
                            </p>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                You now have access to our <strong>Project Updates Platform</strong> where you'll receive exclusive updates about Risivo's development.
                            </p>
                            
                            <!-- Special Offer Badge -->
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 8px; text-align: center;">
                                <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px;">🎁 50% LIFETIME DISCOUNT</h2>
                                <p style="color: #ffffff; margin: 0; font-size: 16px; opacity: 0.95;">
                                    Your early supporter pricing is locked in forever!
                                </p>
                            </div>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                To get started, please create your account:
                            </p>
                            
                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://risivo.com/updates/signup/waitlist?email={{1.email}}&name={{1.first_name}}%20{{1.last_name}}&business={{1.business_name}}" 
                                           style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                                            Create Your Account →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Account Details -->
                            <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your Details:</h3>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 14px;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666;"><strong>Email:</strong></td>
                                        <td style="padding: 8px 0; color: #333333;">{{1.email}}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666;"><strong>Name:</strong></td>
                                        <td style="padding: 8px 0; color: #333333;">{{1.first_name}} {{1.last_name}}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666;"><strong>Business:</strong></td>
                                        <td style="padding: 8px 0; color: #333333;">{{1.business_name}}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 10px 0;">
                                <strong>What You'll Get Access To:</strong>
                            </p>
                            
                            <ul style="color: #333333; font-size: 16px; line-height: 1.8; margin: 0 0 20px 20px; padding: 0;">
                                <li>📹 Weekly development video updates</li>
                                <li>🎯 Feature roadmap and progress tracking</li>
                                <li>💬 Direct feedback channel to our team</li>
                                <li>🎁 Exclusive early access features</li>
                                <li>📊 Real-time project milestones</li>
                            </ul>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                                Once you've created your account, you can access the platform at:
                            </p>
                            
                            <p style="margin: 10px 0;">
                                <a href="https://risivo.com/updates" style="color: #667eea; text-decoration: none; font-weight: 600;">https://risivo.com/updates</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                                Need help? Contact us at <a href="mailto:support@risivo.com" style="color: #667eea; text-decoration: none;">support@risivo.com</a>
                            </p>
                            
                            <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 10px 0 0 0;">
                                This email was sent to {{1.email}} because you signed up for Risivo.<br>
                                If you didn't request this, please ignore this email.
                            </p>
                            
                            <p style="color: #999999; font-size: 12px; margin: 15px 0 0 0;">
                                © 2025 Risivo. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

### **4.2 Investor Welcome Email Template**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Risivo Investor Portal! 📊</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hi <strong>{{1.first_name}}</strong>,
                            </p>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Thank you for your interest in <strong>Risivo</strong> as a potential investor! We're excited to share our vision with you.
                            </p>
                            
                            <!-- NDA Notice -->
                            <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                <p style="color: #856404; margin: 0; font-size: 15px; line-height: 1.6;">
                                    <strong>⚠️ Important:</strong> To access confidential investor materials (pitch deck, financials, business strategy), you'll be required to <strong>review and sign our Non-Disclosure Agreement (NDA)</strong> after creating your account.
                                </p>
                            </div>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 10px 0;">
                                <strong>Next Steps:</strong>
                            </p>
                            
                            <ol style="color: #333333; font-size: 16px; line-height: 1.8; margin: 0 0 20px 20px; padding: 0;">
                                <li>Create your investor account</li>
                                <li>Review and sign our Non-Disclosure Agreement (NDA)</li>
                                <li>Access exclusive investor materials</li>
                            </ol>
                            
                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://risivo.com/updates/signup/investor?email={{1.email}}&name={{1.first_name}}%20{{1.last_name}}&business={{1.business_name}}&phone={{1.country_code}}{{1.phone}}" 
                                           style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                                            Create Your Investor Account →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Account Details -->
                            <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your Details:</h3>
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size: 14px;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666;"><strong>Email:</strong></td>
                                        <td style="padding: 8px 0; color: #333333;">{{1.email}}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666;"><strong>Name:</strong></td>
                                        <td style="padding: 8px 0; color: #333333;">{{1.first_name}} {{1.last_name}}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666666;"><strong>Business:</strong></td>
                                        <td style="padding: 8px 0; color: #333333;">{{1.business_name}}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 10px 0;">
                                <strong>What You'll Get Access To:</strong>
                            </p>
                            
                            <ul style="color: #333333; font-size: 16px; line-height: 1.8; margin: 0 0 20px 20px; padding: 0;">
                                <li>📊 Detailed financial projections & forecasts</li>
                                <li>📈 Complete business plan & go-to-market strategy</li>
                                <li>🎯 Product roadmap & development timeline</li>
                                <li>💼 Professional pitch deck</li>
                                <li>📉 Market analysis & competitive landscape</li>
                                <li>👥 Team bios & organizational structure</li>
                                <li>💬 Direct communication channel with founders</li>
                            </ul>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                                After creating your account, you can access the investor portal at:
                            </p>
                            
                            <p style="margin: 10px 0;">
                                <a href="https://risivo.com/updates/investor" style="color: #667eea; text-decoration: none; font-weight: 600;">https://risivo.com/updates/investor</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                                Questions? Contact our investment team at <a href="mailto:invest@risivo.com" style="color: #667eea; text-decoration: none;">invest@risivo.com</a>
                            </p>
                            
                            <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 10px 0 0 0;">
                                This email was sent to {{1.email}} because you expressed interest in investing in Risivo.<br>
                                All investor materials are confidential and protected under NDA.
                            </p>
                            
                            <p style="color: #999999; font-size: 12px; margin: 15px 0 0 0;">
                                © 2025 Risivo. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 5. CLOUDFLARE ENVIRONMENT VARIABLES

After creating both scenarios in Make.com, you need to add the webhook URLs to Cloudflare Pages:

### **Step-by-Step**

1. **Go to Cloudflare Dashboard**
2. **Navigate to**: Pages → risivo-production → Settings → Environment Variables
3. **Add two variables**:

**Variable 1: Waitlist Webhook**
- **Name**: `MAKE_WAITLIST_WEBHOOK_URL`
- **Value**: `https://hook.eu1.make.com/abc123xyz456...` (from Scenario A)
- **Environment**: Production ✅

**Variable 2: Investor Webhook**
- **Name**: `MAKE_INVESTOR_WEBHOOK_URL`
- **Value**: `https://hook.eu1.make.com/def789uvw012...` (from Scenario B)
- **Environment**: Production ✅

4. **Save** the variables
5. **Redeploy** your site (if necessary)

---

## 6. TESTING & ACTIVATION

### **6.1 Test Waitlist Flow**

1. **In Make.com Scenario A**: Click **"Run once"**
2. **Go to**: `https://risivo.com`
3. **Click**: "Join Waitlist" tab
4. **Fill form** with test data:
   - Language: English
   - Business: Test Company
   - Name: John Doe
   - Email: your-test-email@gmail.com
   - Phone: +1 555-123-4567
5. **Submit** the form
6. **Check Make.com**: Execution should show ✅ (success)
7. **Check email**: Welcome email should arrive within 1-2 minutes
8. **Click signup link**: Should open `/updates/signup/waitlist` page

---

### **6.2 Test Investor Flow**

1. **In Make.com Scenario B**: Click **"Run once"**
2. **Go to**: `https://risivo.com`
3. **Click**: "SaaS Investors" tab
4. **Fill form** with test data:
   - Language: English
   - Business: Investment Fund LLC
   - Name: Jane Smith
   - Email: your-test-email+investor@gmail.com
   - Phone: +44 77009 00123
   - Open to demo: Yes
5. **Submit** the form
6. **Check Make.com**: Execution should show ✅ (success)
7. **Check email**: Investor welcome email should arrive
8. **Check team email**: Demo notification should arrive (if Module 3 added)
9. **Click signup link**: Should open `/updates/signup/investor` page

---

### **6.3 Activate Both Scenarios**

Once testing is complete:

**For Each Scenario**:
1. **Click**: Scheduling toggle (bottom left)
2. **Set to**: "Immediately as data arrives" (instant trigger)
3. **Click**: "OK"
4. **Verify**: Green "ON" indicator appears

Both scenarios should now be ACTIVE and processing form submissions automatically! ✅

---

### **6.4 Monitoring**

**Daily**:
- Check execution history for errors
- Monitor email deliverability

**Weekly**:
- Review complete execution logs
- Check for any failed submissions

**Monthly**:
- Update email templates if needed
- Review user feedback

---

## 7. TROUBLESHOOTING

### **Issue: Email Not Sent**

**Check**:
1. Gmail connection is still active in Make.com
2. Gmail account has not hit daily sending limit (500 emails/day for free Gmail)
3. Email isn't in spam folder
4. User's email address is valid

**Fix**:
- Reconnect Gmail if expired
- Upgrade to Google Workspace for higher limits
- Add SPF/DKIM records to improve deliverability

---

### **Issue: Webhook Not Triggered**

**Check**:
1. Scenario is ACTIVE (green toggle ON)
2. Webhook URL is correctly set in Cloudflare environment variables
3. Website is sending data to correct endpoint (`/api/webhook/waitlist` or `/api/webhook/investor`)

**Fix**:
- Activate scenario
- Double-check environment variable spelling and URL
- Check Cloudflare Workers logs: `wrangler tail --project-name=risivo-production`

---

### **Issue: Signup Link Broken**

**Check**:
1. Link in email template is correct
2. `/updates/signup/waitlist` and `/updates/signup/investor` routes exist
3. Query parameters are being parsed correctly

**Fix**:
- Update email template link
- Implement signup pages (Phase 2)

---

## 8. NEXT STEPS

✅ **Phase 1 Complete**: Make.com automation setup

**Phase 2**: Build signup pages (next task)
- `/updates/signup/waitlist` page
- `/updates/signup/investor` page

**Phase 3**: Implement NDA system
- `/updates/investor/nda-review` page
- NDA signature capture
- Access control

---

**Document Version**: 2.0 (Two-Track System)  
**Last Updated**: December 20, 2025  
**Status**: Ready for Implementation
