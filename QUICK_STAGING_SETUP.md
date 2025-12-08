# 🚀 Quick Staging Setup (5 Minutes)

## ✅ What's Done

- ✅ Staging branch created and pushed to GitHub
- ✅ Full website homepage built and ready
- ✅ Design system and components created
- ✅ Routing system implemented
- ✅ All documentation ready

**GitHub Branch**: https://github.com/velocityautomationcorp/risivo-website/tree/staging

## 🎯 What You Need To Do

### Step 1: Create Cloudflare Pages Project for Staging (3 minutes)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Navigate to: **Workers & Pages**

2. **Create New Project**
   - Click: **Create application**
   - Select: **Pages** → **Connect to Git**

3. **Select Repository**
   - Choose: `velocityautomationcorp/risivo-website`
   - Click: **Begin setup**

4. **Configure Build Settings**
   ```
   Project name: risivo-staging
   Production branch: staging
   Build command: npm run build
   Build output directory: dist
   ```

5. **Set Environment Variable**
   - Before clicking "Save and Deploy", click **Add variable**
   - Name: `ENABLE_FULL_SITE`
   - Value: `true`
   - Click: **Save and Deploy**

### Step 2: Wait for Deployment (1-2 minutes)

Cloudflare will:
- Install dependencies
- Build the project
- Deploy to edge network

### Step 3: Get Your Staging URL

After deployment completes, you'll see:
```
🎉 Success! Project deployed to:
https://risivo-staging.pages.dev
```

**Visit this URL** to see your full marketing website!

## 🎨 What You'll See on Staging

Your staging site will show the new **full marketing website** with:

✅ **Modern Homepage**
  - Hero section with countdown
  - Problem/Solution comparison
  - Feature highlights (4 key features)
  - How it works (3 steps)
  - Testimonials + social proof
  - Pricing teaser (3 tiers)
  - Final CTA section

✅ **Navigation & Footer**
  - Sticky header with mobile menu
  - Multi-column footer with newsletter
  - All internal links ready

✅ **Design System**
  - Purple gradient theme
  - Inter font
  - Responsive breakpoints
  - Smooth animations

## 🔗 URLs After Setup

- **Production (Coming Soon)**: https://www.risivo.com
- **Staging (Full Website)**: https://risivo-staging.pages.dev
- **GitHub Staging Branch**: https://github.com/velocityautomationcorp/risivo-website/tree/staging

## 🧪 Testing the Staging Site

1. **Visit staging URL**: https://risivo-staging.pages.dev

2. **Check health endpoint**: https://risivo-staging.pages.dev/api/health
   - Should show: `{" status": "ok", "fullSiteEnabled": true, ...}`

3. **Test navigation**:
   - Click navigation links
   - Test mobile menu (resize browser)
   - Scroll and see animations

4. **Test form** (optional):
   - Email form should work same as production
   - You can set WEBHOOK_URL for staging too if needed

## 📝 Optional: Add Custom Subdomain

Want `staging.risivo.com` instead of `.pages.dev`?

1. In Cloudflare Pages → risivo-staging
2. Go to: **Custom domains**
3. Click: **Set up a custom domain**
4. Enter: `staging.risivo.com`
5. Click: **Continue**
6. DNS auto-configures (wait 5-10 min)

## 🔄 Development Workflow

### Making Changes to Staging

```bash
# On your local machine
cd C:\Users\Buzgrowth\Documents\risivo-website

# Switch to staging branch
git checkout staging

# Make changes to files
# (edit src/pages/homepage.ts, add new pages, etc.)

# Commit and push
git add .
git commit -m "feat: Add new feature"
git push origin staging

# Cloudflare auto-deploys in 1-2 minutes!
```

### When Ready for Production

```bash
# Merge staging to main
git checkout main
git merge staging
git push origin main

# Production (www.risivo.com) updates automatically
```

## 🐛 Troubleshooting

### Staging shows coming soon page
**Fix**: Check environment variable `ENABLE_FULL_SITE=true` is set

### Build fails
**Check**: 
- Build logs in Cloudflare dashboard
- Make sure `npm run build` works locally

### Changes not showing
**Solutions**:
- Wait 1-2 minutes for deployment
- Clear browser cache (Ctrl+Shift+Delete)
- Check correct URL (staging vs production)

## 📊 What's Next?

Once staging is live, we can:

1. ✅ **Review the homepage** together
2. ✅ **Build Features page** next
3. ✅ **Build Pricing page** with calculator
4. ✅ **Add more sections** iteratively
5. ✅ **Test everything** before production

## 🎉 You're All Set!

After completing Step 1 (creating Cloudflare project), you'll have:

- ✅ Live staging environment
- ✅ Full marketing website visible
- ✅ Separate from production
- ✅ Auto-deploys on push
- ✅ Ready for Phase 2 development!

**Next**: Share the staging URL with me and we'll continue building!

---

**Need Help?** Check `STAGING_SETUP.md` for detailed documentation.
