# 📁 ALL FILES TO UPDATE - COMPLETE COPY & PASTE GUIDE

## ⚠️ GitHub Push Failed

The sandbox cannot push to GitHub due to authentication. Follow this guide to manually update files.

---

## 📋 FILES TO UPDATE (5 files)

### ✅ INSTRUCTIONS

For each file below:
1. Navigate to the path on your local machine
2. Open the file in your code editor
3. **Select ALL content** (Ctrl+A)
4. **Delete everything**
5. **Paste the new content** from this document
6. **Save the file**

---

## FILE 1: `src/pages/homepage-step6.ts`

**Path**: `C:\Users\Buzgrowth\Documents\risivo-website\src\pages\homepage-step6.ts`

**Action**: Replace ALL content

**New Content**: (See `/home/user/webapp/src/pages/homepage-step6.ts` - 158 lines)

---

## FILE 2: `src/pages/features.ts` (NEW FILE)

**Path**: `C:\Users\Buzgrowth\Documents\risivo-website\src\pages\features.ts`

**Action**: Create NEW file

**New Content**: (See `/home/user/webapp/src/pages/features.ts` - 224 lines)

---

## FILE 3: `src/pages/pricing.ts` (NEW FILE)

**Path**: `C:\Users\Buzgrowth\Documents\risivo-website\src\pages\pricing.ts`

**Action**: Create NEW file

**New Content**: (See `/home/user/webapp/src/pages/pricing.ts`)

---

## FILE 4: `src/index.tsx`

**Path**: `C:\Users\Buzgrowth\Documents\risivo-website\src\index.tsx`

**Action**: Update imports and routes

**Changes needed**:

1. **Add imports** (after line 4):
```typescript
import { FeaturesPage } from './pages/features'
import { PricingPage } from './pages/pricing'
```

2. **Replace features route** (around line 151):
```typescript
// Features page
app.get('/features', (c) => {
  return c.html(FeaturesPage())
})
```

3. **Replace pricing route** (around line 164):
```typescript
// Pricing page
app.get('/pricing', (c) => {
  return c.html(PricingPage())
})
```

---

## FILE 5: `src/layouts/BaseLayout.ts`

**Path**: `C:\Users\Buzgrowth\Documents\risivo-website\src\layouts\BaseLayout.ts`

**Action**: Update copyright text (line 97)

**Find** (line 97):
```typescript
copyrightText: `© ${new Date().getFullYear()} Risivo. All rights reserved.`
```

**Replace with**:
```typescript
copyrightText: `© ${new Date().getFullYear()} Velocity Automation Corp. All rights reserved.`
```

---

## 🚀 AFTER UPDATING ALL FILES

Run these commands:

```bash
cd C:\Users\Buzgrowth\Documents\risivo-website

git add -A

git commit -m "feat: Apply new footer to all pages (homepage, features, pricing, contact)"

git push origin staging

npm run build

npx wrangler pages deploy dist --project-name risivo-staging --branch staging --commit-dirty=true
```

---

## ✅ WHAT THESE CHANGES DO

1. **homepage-step6.ts**: Converts homepage to use BaseLayout (adds new footer)
2. **features.ts**: Creates new Features page with footer
3. **pricing.ts**: Creates new Pricing page with footer
4. **index.tsx**: Adds routes for Features and Pricing pages
5. **BaseLayout.ts**: Fixes copyright text to "Velocity Automation Corp"

---

## 📊 EXPECTED RESULT

After deployment, all 4 pages will have the new footer:
- ✅ Homepage (/)
- ✅ Features (/features)
- ✅ Pricing (/pricing)
- ✅ Contact (/contact)

---

**Time needed**: 10-12 minutes total
