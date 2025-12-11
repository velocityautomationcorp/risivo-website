# 🚀 DEPLOY FIXED FOOTER - EXACT STEPS

## Run These Commands on Your Computer

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

# 1. Copy white logo to public folder
copy "White Favicon.png" "public\white-favicon.png"

# 2. Stage all changes
git add -A

# 3. Commit with force
git commit -m "fix: Footer design corrections - all 5 issues fixed" --allow-empty

# 4. Force push to GitHub
git push origin staging --force

# 5. Build locally
npm run build

# 6. Force deploy to Cloudflare (bypass auto-deploy)
npx wrangler pages deploy dist --project-name risivo-staging --branch staging --commit-dirty=true
```

## What Each Command Does

1. **Copy logo** - Ensures white-favicon.png is in public folder
2. **Stage changes** - Prepares all modified files
3. **Commit** - Saves changes locally (--allow-empty forces it even if nothing changed)
4. **Force push** - Overwrites GitHub with your local code (--force)
5. **Build** - Creates production bundle with all fixes
6. **Force deploy** - Sends build directly to Cloudflare (--commit-dirty=true bypasses git checks)

## Time Estimate

Total: 2-3 minutes

---

## If You Get Errors

### Error: "copy is not recognized"
**Fix**: Use File Explorer to manually copy `White Favicon.png` to `public` folder and rename to `white-favicon.png`

### Error: "git push rejected"
**Fix**: Already using --force, should work

### Error: "wrangler not found"
**Fix**: Run `npm install -g wrangler` first

---

## After Deployment

1. Wait 2 minutes
2. Clear browser cache: Ctrl+Shift+Delete → "Cached images and files" → Clear
3. Visit in Incognito: https://risivo-staging.pages.dev/contact
4. Hard refresh: Ctrl+Shift+R

---

## Verification

You should see:
- ✅ 75px gap above newsletter box
- ✅ Title: "Stay Ahead of the Curve" (no language codes)
- ✅ Form order: Language dropdown | Email | Subscribe
- ✅ White logo visible
- ✅ 4 proper social media SVG icons (white on grey)

---

**Start now with command 1!**
