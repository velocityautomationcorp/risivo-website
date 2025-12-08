# ⚡ Quick Start - Deploy in 10 Minutes

## Option 1: Auto-Deployment (Recommended) 🔄

**Setup once, deploy automatically forever!**

### 1. Connect GitHub to Cloudflare (5 min)
1. Go to: https://dash.cloudflare.com/
2. Click **Workers & Pages** → **Create application** → **Pages**
3. Click **Connect to Git** → Select **GitHub**
4. Choose: `velocityautomationcorp/risivo-website`
5. Configure:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

### 2. Add Environment Variable (1 min)
Click **Add variable**:
- **Name:** `WEBHOOK_URL`
- **Value:** Your Make.com webhook URL

Click **Save and Deploy**

### 3. Add Custom Domain (2 min)
1. Go to project → **Custom domains** tab
2. Add: `www.risivo.com`
3. Done! SSL auto-configured.

### 4. Setup Make.com Webhook (2 min)
1. Create scenario in Make.com
2. Add **Webhooks** → **Custom webhook**
3. Copy webhook URL
4. Add to Cloudflare environment variables (done in step 2)
5. Add modules:
   - **Google Sheets** - Add row
   - **Email** - Send auto-response

**✅ Done!** Now every `git push` auto-deploys in ~1-2 minutes.

---

## Option 2: Manual Deployment 🔨

### 1. Build Project
```bash
cd risivo-website
npm install
npm run build
```

### 2. Deploy to Cloudflare
```bash
npx wrangler pages deploy dist --project-name risivo-coming-soon
```

### 3. Add Webhook URL
```bash
npx wrangler pages secret put WEBHOOK_URL --project-name risivo-coming-soon
# Paste your Make.com webhook URL
```

### 4. Setup Custom Domain
```bash
# In Cloudflare Dashboard:
# Workers & Pages → Your project → Custom domains → Add: www.risivo.com
```

**⚠️ Manual:** You need to run `npm run deploy` after every change.

---

## 🪝 Make.com Webhook Setup (5 min)

### Quick Setup:
1. Create new scenario: "Risivo Email Capture"
2. Add **Webhooks** → **Custom webhook**
3. Copy webhook URL
4. Add module: **Google Sheets** → **Add a row**
   - Map: `{{1.email}}`, `{{1.timestamp}}`, `{{1.source}}`
5. Add module: **Gmail** → **Send an Email**
   - To: `{{1.email}}`
   - Subject: "Thanks for subscribing to Risivo!"
6. Click **ON** to activate

---

## 📝 Making Changes

### Change Launch Date:
```typescript
// src/index.tsx - Line 48
const launchDate = new Date('2026-03-01T00:00:00').getTime()
```

### Change Text:
```html
<!-- Line 335 -->
<div class="subtitle">Your New Headline</div>

<!-- Line 337 -->
<p class="description">Your new description...</p>
```

### Deploy Changes:

**Auto-deployment:**
```bash
git add .
git commit -m "Update text"
git push origin main
# Wait 1-2 minutes - auto-deploys!
```

**Manual deployment:**
```bash
npm run build
npm run deploy
```

---

## ✅ Deployment Checklist

- [ ] Deploy to Cloudflare ✓
- [ ] Add WEBHOOK_URL secret ✓
- [ ] Setup Make.com webhook ✓
- [ ] Connect Google Sheets ✓
- [ ] Setup email auto-response ✓
- [ ] Add custom domain (www.risivo.com) ✓
- [ ] Test form submission ✓
- [ ] Verify emails in sheet ✓

---

## 🆘 Quick Troubleshooting

**Form not submitting?**
```bash
npx wrangler pages secret list --project-name risivo-coming-soon
# Check if WEBHOOK_URL is set
```

**Auto-deployment not working?**
- Check Cloudflare Dashboard → Deployments tab
- Verify build command: `npm run build`
- Verify output: `dist`

**Domain not working?**
- Wait 5-10 minutes (DNS propagation)
- Check SSL status in Cloudflare

---

**📚 Full Guide:** See `DEPLOYMENT_COMPLETE_GUIDE.md` for detailed instructions.
