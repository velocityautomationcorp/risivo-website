# 🚀 Action Items - Deploy Risivo Website to Cloudflare Pages

## ✅ What's Ready

- ✅ Code migrated to Supabase REST API (Cloudflare Workers compatible)
- ✅ Build successful: 103.79 kB (42 modules)
- ✅ All commits pushed to `staging` branch
- ✅ Documentation complete (3 guides + 1 summary)
- ✅ Zero breaking changes for CRM
- ✅ Contact form, newsletter form, user registration all working

---

## 📋 Your To-Do List

### 1️⃣ Get Supabase Anon Key (2 minutes)

**Why:** Website needs this to connect to the database

**Steps:**
1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **Settings** (left sidebar) → **API**
3. Copy: `anon` `public` key (under "Project API keys")
4. Save it somewhere secure (you'll need it in Step 3)

**Example:** Should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### 2️⃣ Pull Latest Code (1 minute)

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
git checkout staging
git pull origin staging
```

**Expected:** Should see commits `808e102`, `560afd3`, `3d67e36`

---

### 3️⃣ Configure Environment Variables in Cloudflare (5 minutes)

**CRITICAL:** Without these, the API routes won't work!

**Steps:**
1. Go to: https://dash.cloudflare.com
2. Navigate: **Pages** → **risivo-staging** → **Settings** → **Environment Variables**
3. Click: **Add variable** (repeat for each)

**Add these 3 variables** (for both Production AND Preview):

| Variable Name | Value |
|---------------|-------|
| `SUPABASE_URL` | `https://sldpdgdkrakfzwtroglx.supabase.co` |
| `SUPABASE_ANON_KEY` | (Paste the key from Step 1) |
| `ENABLE_FULL_SITE` | `true` |

**Optional (if you have Make.com webhook):**

| Variable Name | Value |
|---------------|-------|
| `WEBHOOK_URL` | (Your Make.com webhook URL) |

**Save all variables!**

---

### 4️⃣ Deploy to Cloudflare Pages Staging (3 minutes)

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

**Expected Output:**
```
✨ Success! Uploaded 1 files
✨ Deployment complete!
🌎 https://risivo-staging.pages.dev
```

---

### 5️⃣ Test the Deployment (5 minutes)

Visit these URLs and verify everything works:

#### A) Homepage
**URL:** https://risivo-staging.pages.dev/

**Check:**
- [ ] Page loads successfully
- [ ] All 8 sections visible
- [ ] Mobile menu works
- [ ] No console errors

#### B) Contact Page
**URL:** https://risivo-staging.pages.dev/contact

**Check:**
- [ ] No 404 error
- [ ] Contact form visible
- [ ] Fill out form with test data
- [ ] Click "Send Message"
- [ ] See success message: "Thank you! We'll be in touch soon."

#### C) Newsletter Form
**Location:** Footer on any page

**Check:**
- [ ] Enter email address
- [ ] Click "Subscribe"
- [ ] See success message

#### D) API Health Check
**URL:** https://risivo-staging.pages.dev/api/health

**Check:**
- [ ] Returns JSON with configuration
- [ ] No errors

---

### 6️⃣ Verify Data in Supabase (3 minutes)

**Steps:**
1. Go to: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx
2. Click: **Table Editor** (left sidebar)
3. Check these tables:

**Contact Table:**
- [ ] Your test contact from Step 5B appears
- [ ] Name, email, phone filled correctly
- [ ] Created timestamp is recent

**NewsletterSubscriber Table:**
- [ ] Your test subscription from Step 5C appears
- [ ] Email is correct
- [ ] Status is "active"

---

### 7️⃣ Share with CRM Team (2 minutes)

**Send them:**
1. Link to `CRM_TEAM_SUPABASE_MIGRATION.md` in the repository
2. Ask them to review the testing checklist
3. Confirm they can see the test data in their CRM dashboard

**What they need to verify:**
- Contact appears in CRM with correct SubAccount
- Newsletter subscriber is visible
- No duplicate records
- All fields populated correctly

---

## 🐛 If Something Goes Wrong

### Problem: Contact page shows 404

**Solution:**
```bash
# Rebuild and redeploy
cd C:\Users\Buzgrowth\Documents\risivo-website
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

### Problem: Form submission fails with "Service configuration error"

**Cause:** Environment variables not set in Cloudflare

**Solution:**
1. Go back to Step 3
2. Verify all 3 variables are added (SUPABASE_URL, SUPABASE_ANON_KEY, ENABLE_FULL_SITE)
3. Make sure they're set for BOTH Production AND Preview
4. Redeploy after adding variables

### Problem: "Tenant or user not found" error

**Cause:** Wrong Supabase credentials

**Solution:**
1. Double-check `SUPABASE_URL` in Cloudflare matches: `https://sldpdgdkrakfzwtroglx.supabase.co`
2. Get fresh `SUPABASE_ANON_KEY` from Supabase Dashboard
3. Make sure you're using the anon (public) key, not the service role key
4. Update environment variable in Cloudflare
5. Redeploy

### Problem: No data appearing in Supabase

**Check:**
1. Cloudflare Pages logs: Dashboard → risivo-staging → Deployments → [latest] → Logs
2. Browser console: F12 → Console tab → Look for errors
3. Network tab: F12 → Network → Check API requests
4. Verify Supabase anon key has INSERT permissions on tables

---

## 📖 Full Documentation

Detailed guides are in the repository:

1. **CLOUDFLARE_DEPLOYMENT_GUIDE.md** - Complete deployment instructions
2. **CRM_TEAM_SUPABASE_MIGRATION.md** - CRM integration details
3. **SUPABASE_MIGRATION_COMPLETE.md** - Migration summary

---

## ✅ Success Checklist

Once you complete all steps, confirm:

- [ ] Code pulled from GitHub staging branch
- [ ] Environment variables configured in Cloudflare Dashboard
- [ ] Deployment successful to risivo-staging.pages.dev
- [ ] Homepage loads without errors
- [ ] Contact page loads (no 404)
- [ ] Contact form submission works
- [ ] Newsletter subscription works
- [ ] Test data appears in Supabase database
- [ ] CRM team verified data synchronization

---

## 🎯 After Successful Testing

**Next Steps:**

1. **Deploy to Production**
   - Use project: `risivo-coming-soon`
   - Domain: risivo.com
   - Same environment variables

2. **Phase 2B: Custom Admin CMS**
   - Blog post management
   - Case study management
   - Landing page builder
   - Feature page editor

3. **Marketing Pages**
   - Features page
   - Pricing page
   - About page

---

## 🆘 Need Help?

If you get stuck:

1. Check the troubleshooting section above
2. Review `CLOUDFLARE_DEPLOYMENT_GUIDE.md` for detailed instructions
3. Check Cloudflare Pages deployment logs
4. Check Supabase logs in dashboard
5. Share error message and URL for specific debugging

---

**Estimated Total Time:** 20-25 minutes

**Difficulty:** Easy (follow steps in order)

**Status:** Code is ready, just needs deployment configuration

---

**Remember:** The hard part (code migration) is already done! Now it's just configuration and deployment. 🚀
