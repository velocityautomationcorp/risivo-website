# Resolve Git Conflicts - Quick Guide

## Option 1: Keep Remote Changes (RECOMMENDED - Fastest)

This will discard your local changes and use the fixed code from GitHub:

```bash
# Step 1: Check what files have conflicts
git status

# Step 2: Reset to clean state (WARNING: This discards local changes)
git reset --hard HEAD

# Step 3: Pull latest fixes
git pull origin genspark_ai_developer

# Step 4: Deploy
npm run deploy:production
```

---

## Option 2: Stash Local Changes (If you want to keep local work)

This saves your local changes for later:

```bash
# Step 1: Stash your local changes
git stash

# Step 2: Pull latest fixes
git pull origin genspark_ai_developer

# Step 3: Deploy
npm run deploy:production

# (Optional) Later, if you want your local changes back:
# git stash pop
```

---

## Option 3: Manual Conflict Resolution

If you want to manually resolve conflicts:

```bash
# Step 1: See which files have conflicts
git status

# Step 2: For each conflicted file, choose one:

# Option A: Keep remote version (recommended)
git checkout --theirs <file-path>

# Option B: Keep your local version
git checkout --ours <file-path>

# Step 3: After resolving all conflicts
git add .
git commit -m "Resolved merge conflicts"

# Step 4: Pull again
git pull origin genspark_ai_developer

# Step 5: Deploy
npm run deploy:production
```

---

## Quick Fix (Copy-Paste This)

**For fastest resolution, run this:**

```bash
git reset --hard HEAD
git pull origin genspark_ai_developer
npm run deploy:production
```

This will:
✅ Discard local conflicts
✅ Get latest fixed code from GitHub
✅ Deploy to production

---

## What Files Likely Have Conflicts

Based on the work done, conflicts are likely in:
- `src/pages/admin-investor-management.tsx`
- `src/pages/admin-dashboard.tsx`
- Documentation files (*.md)

**Recommendation**: Use Option 1 (reset --hard) since the GitHub version has all the fixes you need.

---

## After Resolving

Test at:
- https://risivo.com/updates/admin/login
- https://risivo.com/updates/admin/investors

All buttons should work, text should be visible, and no console errors!
