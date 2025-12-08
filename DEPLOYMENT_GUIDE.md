# 🚀 Risivo Coming Soon - Deployment Guide

## ✅ **Everything is Ready!**

Your coming soon page is built and pushed to GitHub. Now you just need to deploy it!

---

## 📦 **What's Been Created:**

1. ✅ **GitHub Repository:** https://github.com/velocityautomationcorp/risivo-website
2. ✅ **Coming Soon Page:** Beautiful, responsive, with countdown timer
3. ✅ **Email Form:** Ready to connect to your email service
4. ✅ **Build Configuration:** Ready for Cloudflare Pages

---

## ⏱️ **Deployment Time: ~15 minutes**

---

## 🎯 **Step-by-Step Deployment:**

### **Step 1: Go to Cloudflare Dashboard (2 mins)**

1. Open: https://dash.cloudflare.com/
2. Log in to your Cloudflare account
3. Click **"Pages"** in the left sidebar
4. Click **"Create a project"** button

### **Step 2: Connect to GitHub (3 mins)**

1. Click **"Connect to Git"**
2. Click **"GitHub"**
3. If first time:
   - Click **"Authorize Cloudflare Pages"**
   - Log in to GitHub
   - Approve access
4. Select repository: **"velocityautomationcorp/risivo-website"**
5. Click **"Begin setup"**

### **Step 3: Configure Build Settings (2 mins)**

Enter these settings:

**Project name:** `risivo-website` (or any name you prefer)

**Production branch:** `main`

**Framework preset:** Select **"None"**

**Build command:** 
```
npm run build
```

**Build output directory:**
```
dist
```

**Root directory:** (leave empty)

**Environment variables:** (none needed for now)

Click **"Save and Deploy"**

### **Step 4: Wait for First Build (5 mins)**

- Cloudflare will start building your site
- You'll see build logs in real-time
- Wait for "Success!" message
- You'll get a temporary URL like: `risivo-website.pages.dev`

### **Step 5: Test Temporary URL (1 min)**

1. Click on the temporary URL
2. You should see your coming soon page!
3. Test the countdown timer
4. Test the email form
5. Check on mobile (responsive)

### **Step 6: Add Custom Domain (3 mins)**

1. In your Cloudflare Pages project, click **"Custom domains"** tab
2. Click **"Set up a custom domain"**
3. Enter: `www.risivo.com`
4. Click **"Continue"**
5. Cloudflare will show you DNS configuration:
   - **Type:** CNAME
   - **Name:** www
   - **Target:** risivo-website.pages.dev
6. If Cloudflare manages your DNS, click **"Activate domain"** (automatic!)
7. If not, manually add the CNAME record in your DNS provider

### **Step 7: Wait for DNS Propagation (1-5 mins)**

- DNS changes can take 1-5 minutes
- Check status in Cloudflare Pages dashboard
- Look for "Active" status next to www.risivo.com

### **Step 8: Test Your Domain! (1 min)**

1. Open: **www.risivo.com**
2. You should see your coming soon page!
3. Test all features
4. Share with your team!

---

## ✅ **Success Checklist:**

After deployment, verify:

- [ ] www.risivo.com loads correctly
- [ ] Countdown timer is working
- [ ] Countdown shows correct date (February 8, 2025)
- [ ] Email form appears
- [ ] "Notify Me" button works (shows success message)
- [ ] Social media icons are visible
- [ ] Page looks good on mobile
- [ ] Page loads fast (should be instant)
- [ ] HTTPS is working (green padlock in browser)

---

## 🔧 **Troubleshooting:**

### **Issue: Build failed**
**Solution:** Check build logs, ensure all dependencies installed

### **Issue: Domain not working**
**Solution:** Wait 5 more minutes for DNS propagation, check CNAME record

### **Issue: Page shows 404**
**Solution:** Ensure build output directory is `dist`, rebuild project

### **Issue: Email form not submitting**
**Solution:** Expected - you need to connect to email service (see below)

---

## 📧 **Next Steps - Connect Email Service:**

The email form currently just shows a success message. To actually collect emails, you need to connect it to a service.

### **Option A: Mailchimp (Recommended for beginners)**

1. Create Mailchimp account
2. Create an audience
3. Get form endpoint
4. Update `src/index.tsx` line 309
5. Push changes to GitHub
6. Auto-deploys!

### **Option B: ConvertKit (Recommended for creators)**

1. Create ConvertKit account
2. Create a form
3. Get API key and form ID
4. Update `src/index.tsx` line 309
5. Push changes

### **Option C: Google Sheets (Free, simple)**

1. Create Google Sheet
2. Create Google Apps Script
3. Deploy as web app
4. Get script URL
5. Update `src/index.tsx` line 309
6. Push changes

### **Option D: Custom Backend**

1. Create API endpoint in your CRM backend
2. Store emails in database
3. Update `src/index.tsx` line 309
4. Push changes

**Instructions for each option are in README.md**

---

## 🎨 **Customization:**

### **Want to change something?**

1. Edit `src/index.tsx` locally or in GitHub
2. Commit and push changes
3. Cloudflare Pages automatically rebuilds!
4. Changes live in ~1 minute

**Common changes:**
- Launch date (line 12)
- Headline (line 250)
- Description (line 252)
- Colors (line 24)
- Social links (line 268-286)

---

## 📊 **Add Analytics (Optional but Recommended):**

### **Google Analytics:**

1. Create GA4 property
2. Get measurement ID (G-XXXXXXXXXX)
3. Add tracking code to `src/index.tsx` before `</head>`
4. Push changes

### **Cloudflare Web Analytics (Easiest):**

1. In Cloudflare dashboard, go to **Analytics**
2. Click **Web Analytics**
3. Add your site
4. Copy tracking code
5. Add to `src/index.tsx` before `</head>`
6. Push changes

---

## 🚀 **Deployment is Done When:**

✅ www.risivo.com loads your coming soon page  
✅ Countdown timer shows February 8, 2025  
✅ Email form appears and works  
✅ Page is fast and responsive  
✅ HTTPS is active  

---

## 📞 **Need Help?**

**Deployment issues?** Check Cloudflare Pages build logs  
**GitHub issues?** Repo: https://github.com/velocityautomationcorp/risivo-website  
**Email service?** See README.md customization section  

---

## 🎉 **Congratulations!**

Once deployed, you'll have a professional coming soon page collecting emails for your February 8, 2025 launch!

**Estimated Total Time:** 15-25 minutes (including DNS propagation)

---

**Last Updated:** December 8, 2024  
**Launch Date:** February 8, 2025 (62 days from now)
