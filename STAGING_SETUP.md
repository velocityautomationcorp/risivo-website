# Staging Environment Setup Guide

## Overview

We now have a multi-environment setup:

- **Production** (`main` branch) → www.risivo.com → Coming Soon Page
- **Staging** (`staging` branch) → risivo-staging.pages.dev → Full Marketing Website (Phase 2)
- **Development** (local) → localhost:8787 → Local testing

## Architecture

```
┌─────────────────────────────────────────────┐
│                  GitHub                      │
├─────────────────────────────────────────────┤
│  main branch          staging branch         │
│  (Coming Soon)        (Full Website)         │
└────────┬───────────────────────┬─────────────┘
         │                       │
         │ Auto-deploy           │ Auto-deploy
         ▼                       ▼
┌────────────────────┐  ┌────────────────────┐
│   Production       │  │    Staging         │
│   www.risivo.com   │  │   risivo-staging   │
│                    │  │   .pages.dev       │
└────────────────────┘  └────────────────────┘
```

## Quick Start

### Option 1: Cloudflare Dashboard Setup (Recommended)

#### Step 1: Create Staging Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click **Create application** → **Pages** → **Connect to Git**
4. Select repository: `velocityautomationcorp/risivo-website`
5. Configure:
   - **Project name**: `risivo-staging`
   - **Production branch**: `staging`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**

#### Step 2: Configure Environment Variables

1. Go to **Settings** → **Environment variables**
2. Add variables for **Production** environment:
   - `WEBHOOK_URL`: Your Make.com webhook URL (optional for staging)
   - `ENABLE_FULL_SITE`: `true` (important!)
3. Click **Save**

#### Step 3: Get Staging URL

After deployment completes, you'll get:
- **Staging URL**: `https://risivo-staging.pages.dev`
- Or custom domain: `https://staging.risivo.com` (optional)

### Option 2: Using Wrangler CLI

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

# Switch to staging branch
git checkout staging

# Create Cloudflare Pages project
npx wrangler pages project create risivo-staging

# Deploy staging
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging

# Set environment variables
npx wrangler pages secret put ENABLE_FULL_SITE --project-name risivo-staging
# Enter: true

npx wrangler pages secret put WEBHOOK_URL --project-name risivo-staging
# Enter: your webhook URL (optional)
```

## Development Workflow

### Working on New Features

```bash
# Start on staging branch
git checkout staging

# Create feature branch
git checkout -b feature/pricing-page

# Make changes and test locally
npm run dev
# Visit http://localhost:8787

# Commit changes
git add .
git commit -m "feat: Add pricing page"

# Merge to staging for testing
git checkout staging
git merge feature/pricing-page

# Push to trigger staging deployment
git push origin staging

# Test on staging URL
# Visit https://risivo-staging.pages.dev

# When ready for production, merge to main
git checkout main
git merge staging
git push origin main
```

### Branch Strategy

```
main (Production)
  │
  ├─ Coming Soon Page (live)
  │
  └─ Merge when ready ←─────┐
                             │
staging (Staging)            │
  │                          │
  ├─ Full Website            │
  │  (Phase 2 development)   │
  │                          │
  └─ Merge when tested ──────┘
       │
       └─ feature/* branches
          (individual features)
```

## Deployment Strategies

### Strategy A: Auto-Deploy on Push (Recommended)

**Setup**: Connect both projects to GitHub in Cloudflare Dashboard

- `main` branch → Deploys to `risivo-coming-soon`
- `staging` branch → Deploys to `risivo-staging`

**Pros**: Fully automated, no manual steps
**Cons**: Requires GitHub integration

### Strategy B: Manual Deploy with CI/CD

**Setup**: Use GitHub Actions (already created in `.github/workflows/`)

**Pros**: More control, can run tests before deploy
**Cons**: Requires GitHub secrets setup

### Strategy C: Manual Deploy via Wrangler

**When to use**: Quick testing, one-off deployments

```bash
# Build and deploy manually
npm run build
npx wrangler pages deploy dist --project-name risivo-staging --branch staging
```

## Environment Variables

### Production (main branch)
```
WEBHOOK_URL=<your webhook URL>
ENABLE_FULL_SITE=false  (keeps coming soon page)
```

### Staging (staging branch)
```
WEBHOOK_URL=<optional test webhook>
ENABLE_FULL_SITE=true   (enables full site)
```

### Local Development
```
WEBHOOK_URL=<test webhook or empty>
ENABLE_FULL_SITE=true
```

## Testing Before Going Live

### 1. Test on Staging

```bash
# Deploy to staging
git checkout staging
git push origin staging

# Test at https://risivo-staging.pages.dev
```

### 2. Preview Deployments

Cloudflare creates preview URLs for every commit:
```
https://<commit-hash>.risivo-staging.pages.dev
```

### 3. Local Testing

```bash
npm run dev
# Visit http://localhost:8787
```

## Switching Between Environments

### View Current Branch
```bash
git branch
```

### Switch to Staging
```bash
git checkout staging
```

### Switch to Main (Production)
```bash
git checkout main
```

### Sync Staging with Main
```bash
git checkout staging
git merge main
git push origin staging
```

## Custom Domains (Optional)

### Add Staging Subdomain

1. Cloudflare Dashboard → risivo-staging → Custom domains
2. Add: `staging.risivo.com`
3. DNS will auto-configure:
   ```
   CNAME staging risivo-staging.pages.dev
   ```
4. Wait 5-10 minutes for DNS propagation

### Result
- Production: www.risivo.com (Coming Soon)
- Staging: staging.risivo.com (Full Website)

## Rollback Strategy

### Rollback Production

```bash
# Find last good commit
git log --oneline

# Revert to specific commit
git checkout main
git revert <bad-commit-hash>
git push origin main
```

Or in Cloudflare Dashboard:
1. Go to Deployments
2. Find previous successful deployment
3. Click "Rollback to this deployment"

## Current Setup Status

✅ Staging branch created
✅ Staging configuration files ready
✅ GitHub Actions workflow created
⏳ Cloudflare staging project (needs setup)
⏳ Environment variables (needs configuration)

## Next Steps

1. **Create Cloudflare Pages project** for staging
2. **Connect to GitHub** (staging branch)
3. **Set environment variables** (ENABLE_FULL_SITE=true)
4. **Deploy and test** the full website
5. **Iterate on features** without affecting production

## Useful Commands

```bash
# Check current branch
git branch

# Switch branches
git checkout staging
git checkout main

# Deploy staging manually
npm run build && npx wrangler pages deploy dist --project-name risivo-staging

# View staging logs
npx wrangler pages deployment tail --project-name risivo-staging

# List deployments
npx wrangler pages deployment list --project-name risivo-staging
```

## Troubleshooting

### Issue: Staging not deploying
**Solution**: Check branch name matches in Cloudflare settings

### Issue: Changes not visible
**Solution**: Clear cache, check correct URL

### Issue: Environment variables not working
**Solution**: Redeploy after setting variables

### Issue: Both sites show same content
**Solution**: Check ENABLE_FULL_SITE variable

## Support

For issues:
1. Check Cloudflare deployment logs
2. Review GitHub Actions logs
3. Test locally first with `npm run dev`

---

**Last Updated**: December 8, 2025
