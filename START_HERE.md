# 🚀 START HERE - Risivo Staging Setup

## ⚡ Super Fast Setup (Choose One Method)

### Method 1: Double-Click Setup (Easiest - Windows) ✨

1. **Navigate to project folder:**
   ```
   C:\Users\Buzgrowth\Documents\risivo-website
   ```

2. **Double-click:** `setup-staging.bat`

3. **When prompted for ENABLE_FULL_SITE, type:** `true`

4. **Done!** Visit: https://risivo-staging.pages.dev

---

### Method 2: Command Line (2 minutes)

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
npx wrangler pages project create risivo-staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging
# Enter: true
npm run deploy:staging
```

**Done!** Visit: https://risivo-staging.pages.dev

---

### Method 3: Use NPM Script (Shortest)

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
npm run deploy:staging
```

**Note:** First time, you'll need to create the project manually or use Method 1 or 2.

---

## 🔄 Future Updates (After Initial Setup)

### Just double-click: `deploy-staging.bat`

Or run:
```bash
npm run deploy:staging
```

---

## ✅ What You Get

- **Staging URL:** https://risivo-staging.pages.dev
- **Full marketing website** with complete homepage
- **All sections:** Hero, Features, Testimonials, Pricing, etc.
- **Responsive design** that works on all devices
- **Auto-deploys** when you push to staging branch

---

## 🎯 What's Different from Production?

| Environment | URL | Content | Branch |
|-------------|-----|---------|--------|
| **Production** | www.risivo.com | Coming Soon Page | `main` |
| **Staging** | risivo-staging.pages.dev | Full Website | `staging` |

---

## 📱 After Setup - Check These URLs

1. **Staging site:** https://risivo-staging.pages.dev
2. **Health check:** https://risivo-staging.pages.dev/api/health
3. **Cloudflare dashboard:** https://dash.cloudflare.com/

---

## 🐛 Quick Troubleshooting

### "Not logged in" error?
```bash
npx wrangler login
```

### Build fails?
```bash
npm install
npm run build
```

### Want to see logs?
```bash
npx wrangler pages deployment tail --project-name risivo-staging
```

---

## 📚 More Documentation

- **`FAST_STAGING_SETUP.md`** - Detailed command-line guide
- **`STAGING_SETUP.md`** - Complete staging documentation
- **`SESSION_SUMMARY.md`** - Everything we built today
- **`TROUBLESHOOTING.md`** - Email form debugging

---

## 🎉 That's It!

After running the setup (Method 1, 2, or 3), you'll have:

✅ Live staging environment
✅ Full marketing website
✅ Separate from production  
✅ Ready to continue Phase 2 development

**Next:** Share your staging URL with me and we'll build the Features page!

---

**Questions?** Check the other markdown files or ask me!
