# Risivo - Coming Soon Page

A beautiful, minimal coming soon page for Risivo CRM.

**Live Demo:** www.risivo.com (after deployment)

---

## 🚀 Features

- ✅ Real-time countdown timer to launch date (February 8, 2025)
- ✅ Email capture form
- ✅ Animated gradient background
- ✅ Fully responsive design
- ✅ Social media links
- ✅ Clean, modern UI
- ✅ Fast loading (Cloudflare Pages CDN)

---

## 🎨 Design

- **Theme:** Purple gradient background
- **Font:** Inter (Google Fonts)
- **Style:** Minimal, modern, professional
- **Mobile:** Fully responsive

---

## 📦 Tech Stack

- **Framework:** Hono (TypeScript)
- **Hosting:** Cloudflare Pages
- **Build Tool:** Vite
- **Styling:** Inline CSS (no dependencies)

---

## 🛠️ Deployment Instructions

### **Step 1: Create Cloudflare Pages Project**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select **GitHub** and authorize Cloudflare
6. Choose repository: `velocityautomationcorp/risivo-website`
7. Configure build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
8. Click **Save and Deploy**

### **Step 2: Connect Custom Domain (www.risivo.com)**

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `www.risivo.com`
4. Click **Continue**
5. Cloudflare will automatically configure DNS records
6. Wait 1-5 minutes for DNS propagation
7. **Done!** Your site will be live at www.risivo.com

### **Alternative: Manual DNS Setup**

If auto-configuration doesn't work:

1. Go to **Cloudflare DNS** (same Cloudflare account)
2. Select domain: `risivo.com`
3. Add these DNS records:

```
Type: CNAME
Name: www
Content: risivo-website.pages.dev
Proxy: Yes (orange cloud)
```

---

## 🔧 Local Development

### **Install Dependencies:**
```bash
npm install
```

### **Run Development Server:**
```bash
npm run dev
```

### **Build for Production:**
```bash
npm run build
```

### **Preview Production Build:**
```bash
npm run preview
```

---

## 📝 Customization Guide

### **Change Launch Date:**

Edit `src/index.tsx`, line 12:
```typescript
const launchDate = new Date('2025-02-08T00:00:00').getTime()
```

### **Change Headline:**

Edit `src/index.tsx`, line 250:
```html
<div class="subtitle">The Future of CRM is Coming</div>
```

### **Change Description:**

Edit `src/index.tsx`, line 252:
```html
<p class="description">
    Transform how you manage customers...
</p>
```

### **Change Colors:**

Edit `src/index.tsx`, line 24:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### **Add Logo:**

Replace line 246:
```html
<div class="logo">RISIVO</div>
```

With:
```html
<img src="/logo.png" alt="Risivo" style="max-width: 200px;">
```

Then add `logo.png` to `public/` folder.

### **Connect Email Service:**

Edit `src/index.tsx`, line 309:
```javascript
// TODO: Connect to your email service
console.log('Email submitted:', email);
```

**Examples:**

**Mailchimp:**
```javascript
fetch('https://your-mailchimp-endpoint', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: { 'Content-Type': 'application/json' }
});
```

**Google Sheets:**
```javascript
fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
    method: 'POST',
    body: JSON.stringify({ email })
});
```

**ConvertKit:**
```javascript
fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
    method: 'POST',
    body: JSON.stringify({ 
        api_key: 'YOUR_API_KEY',
        email: email 
    }),
    headers: { 'Content-Type': 'application/json' }
});
```

### **Update Social Links:**

Edit `src/index.tsx`, line 268-286:
```html
<a href="https://twitter.com/risivo" class="social-link">
<a href="https://linkedin.com/company/risivo" class="social-link">
<a href="https://facebook.com/risivo" class="social-link">
```

---

## 📊 Analytics (Optional)

### **Add Google Analytics:**

Add before `</head>` in `src/index.tsx`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🚀 Quick Deployment Checklist

- [ ] Create Cloudflare Pages project
- [ ] Connect to GitHub repo
- [ ] Configure build settings
- [ ] Deploy (automatic on push to main)
- [ ] Add custom domain (www.risivo.com)
- [ ] Wait for DNS propagation (1-5 mins)
- [ ] Test on www.risivo.com
- [ ] Update social links (optional)
- [ ] Connect email service (optional)
- [ ] Add analytics (optional)

---

## 📱 Preview

**Desktop:**
- Clean gradient background
- Large countdown timer
- Email capture form
- Social media links

**Mobile:**
- Fully responsive
- Stacked countdown elements
- Full-width email form
- Touch-friendly buttons

---

## 🔄 Updates & Maintenance

### **Push Updates:**
```bash
git add .
git commit -m "Update: your message"
git push origin main
```

Cloudflare Pages will automatically rebuild and deploy!

---

## 💡 Tips

1. **Test Before Launch:** Use `npm run dev` locally
2. **Email Collection:** Connect a service ASAP to start collecting emails
3. **Social Proof:** Add testimonials or user count later
4. **SEO:** Add meta description, Open Graph tags
5. **Analytics:** Track email signups and page views

---

## 📞 Support

**Repository:** https://github.com/velocityautomationcorp/risivo-website  
**CRM Repository:** https://github.com/velocityautomationcorp/risivo-crm

---

## 📅 Timeline

- **Created:** December 8, 2024
- **Launch Date:** February 8, 2025
- **Countdown:** ~2 months

---

**Built with ❤️ for Risivo**
