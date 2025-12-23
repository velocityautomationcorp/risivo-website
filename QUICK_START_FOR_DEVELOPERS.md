# 🚀 Quick Start Guide for Developers - Risivo Website

**Purpose**: Get up and running with the Risivo website development in 15 minutes.

---

## ⚡ FAST TRACK SETUP

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/velocityautomationcorp/risivo-website.git
cd risivo-website

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Environment Variables (5 minutes)

Edit `.env` and add these REQUIRED variables:

```bash
# Supabase
SUPABASE_URL=https://sldpdgdkrakfzwtroglx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SendGrid (optional for local dev)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Make.com Webhooks (optional for local dev)
MAKE_WAITLIST_WEBHOOK_URL=https://hook.eu1.make.com/xxxxx
MAKE_INVESTOR_WEBHOOK_URL=https://hook.eu1.make.com/yyyyy

# JWT Secret
JWT_SECRET=your-super-secret-32-character-minimum-string-here
```

**Where to get these**:
- Supabase keys: https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx/settings/api
- SendGrid key: https://app.sendgrid.com/settings/api_keys
- Make.com webhooks: Ask project owner or see MAKE_COM_INTEGRATION_GUIDE.md

### 3. Run Development Server (1 minute)

```bash
npm run dev
```

Visit: http://localhost:5173

### 4. Make Your First Change (2 minutes)

Edit `src/index.tsx` line 1 to add a comment:

```typescript
// My first change - Hello from [Your Name]!
import { Hono } from 'hono';
```

Save and see hot reload in browser ✅

### 5. Build & Test (2 minutes)

```bash
# Build for production
npm run build

# Should output: dist/_worker.js
```

If build succeeds, you're ready to develop! 🎉

---

## 📂 PROJECT STRUCTURE (QUICK REFERENCE)

```
risivo-website/
├── src/
│   ├── index.tsx           ⭐ MAIN FILE - Routes + Pages
│   ├── routes/
│   │   ├── webhook.ts      🔗 Make.com webhooks
│   │   ├── auth.ts         🔐 Authentication
│   │   ├── updates.ts      📝 Blog/updates CRUD
│   │   └── admin.ts        👑 Admin dashboard
│   └── utils/
│       ├── email.ts        📧 SendGrid emails
│       └── supabase.ts     🗄️ Database client
├── public/static/
│   ├── risivo-global.css   🎨 Global styles
│   └── updates-shared.css  🎨 Updates platform
└── dist/                   📦 Build output
```

**Key Files to Know**:
- `src/index.tsx`: Contains ALL routes and page HTML (Hono JSX)
- `src/routes/webhook.ts`: Webhook endpoints for Make.com integration
- `src/utils/email.ts`: SendGrid email service (uses fetch, not npm package!)
- `public/static/risivo-global.css`: All global CSS (refactored, clean)

---

## 🎯 COMMON TASKS

### Task 1: Add a New Page

**File**: `src/index.tsx`

```typescript
// Add route
app.get('/my-new-page', (c) => {
  return c.html(
    <html>
      <head>
        <title>My New Page - Risivo</title>
        <link rel="stylesheet" href="/static/risivo-global.css" />
      </head>
      <body>
        <h1>Hello from my new page!</h1>
      </body>
    </html>
  );
});
```

### Task 2: Add a New API Endpoint

**File**: `src/routes/updates.ts` (or create new route file)

```typescript
import { Hono } from 'hono';
const app = new Hono();

app.get('/my-endpoint', async (c) => {
  return c.json({ message: 'Hello API!' });
});

export default app;
```

**Register route in** `src/index.tsx`:
```typescript
import myRoute from './routes/my-route';
app.route('/api/my-route', myRoute);
```

### Task 3: Query Database (Supabase)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  c.env.SUPABASE_URL,
  c.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch data
const { data, error } = await supabase
  .from('updates')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);

if (error) {
  return c.json({ error: error.message }, 500);
}

return c.json(data);
```

### Task 4: Send Email (SendGrid)

**File**: `src/utils/email.ts`

```typescript
export async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'noreply@risivo.com', name: 'Risivo Team' },
      subject,
      content: [{ type: 'text/html', value: html }]
    })
  });
  
  return response.ok;
}
```

### Task 5: Add CSS Styling

**File**: `public/static/risivo-global.css`

```css
/* Add your styles here */
.my-new-component {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 8px;
  color: white;
}
```

**Use in HTML**:
```html
<div class="my-new-component">
  Styled content here
</div>
```

---

## 🔧 DEVELOPMENT COMMANDS

```bash
# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to production (Cloudflare Pages)
npm run deploy:production

# Deploy to staging
npm run deploy:staging
```

---

## 🚨 CRITICAL RULES (READ THIS!)

### Rule 1: Branch Strategy
- **NEVER push directly to `main`**
- **Always work on `genspark_ai_developer` branch**
- **Create pull requests for production deployment**

```bash
# Ensure you're on the right branch
git checkout genspark_ai_developer

# Pull latest changes FIRST
git pull origin genspark_ai_developer

# Make your changes...

# Commit immediately after changes
git add -A
git commit -m "feat: Your descriptive message"

# Push to branch
git push origin genspark_ai_developer
```

### Rule 2: ALWAYS Commit After Changes
**MANDATORY**: Commit after EVERY code modification. No exceptions.

```bash
# After editing ANY file:
git add -A
git commit -m "type(scope): description"
git push origin genspark_ai_developer
```

### Rule 3: Pull Request Workflow
1. **Fetch latest**: `git fetch origin main`
2. **Rebase**: `git rebase origin/main`
3. **Resolve conflicts** (prefer remote code)
4. **Squash commits**: `git reset --soft HEAD~N && git commit`
5. **Force push**: `git push -f origin genspark_ai_developer`
6. **Create PR**: On GitHub, create PR to main
7. **Share PR link** with project owner

### Rule 4: NO These Packages!
- ❌ `@sendgrid/mail` (not compatible with Cloudflare Workers)
- ❌ `bcryptjs` (not compatible with Cloudflare Workers)
- ✅ Use fetch API for SendGrid instead
- ✅ Use Web Crypto API for password hashing

### Rule 5: Environment-Specific Code
```typescript
// Access environment variables
const apiKey = c.env.SENDGRID_API_KEY;
const supabaseUrl = c.env.SUPABASE_URL;

// NEVER hardcode secrets!
```

---

## 🐛 DEBUGGING TIPS

### Issue: Build Fails

**Check**:
1. Did you use template literals inside JSX `<script>` tags?
   - ❌ Bad: `` `Hello ${name}` ``
   - ✅ Good: `'Hello ' + name`

2. Did you import incompatible packages?
   - Remove `@sendgrid/mail`, `bcryptjs`, `fs`, `path`, etc.

3. Syntax errors?
   - Check TypeScript errors: `npm run build`

### Issue: Changes Not Showing

**Check**:
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart dev server: `npm run dev`

### Issue: Database Queries Failing

**Check**:
1. Supabase URL and keys are correct in `.env`
2. Table exists in Supabase dashboard
3. Query syntax is correct (see Supabase docs)

### Issue: Webhook Not Working

**Check**:
1. `MAKE_WAITLIST_WEBHOOK_URL` set in Cloudflare (not `.env`)
2. Make.com scenario is activated (scheduling toggle ON)
3. Check Make.com execution log for errors

---

## 📚 ESSENTIAL READING

**Before making major changes, read**:
1. `RISIVO_WEBSITE_DOCUMENTATION.md` - Complete technical docs
2. `MAKE_COM_INTEGRATION_GUIDE.md` - Webhook automation setup
3. `README.md` - Project overview

**External Documentation**:
- Hono.js: https://hono.dev
- Supabase: https://supabase.com/docs
- Cloudflare Workers: https://developers.cloudflare.com/workers
- SendGrid API: https://docs.sendgrid.com/api-reference

---

## 🎓 LEARNING PATH

### Day 1: Understand the Stack
- [ ] Read through `src/index.tsx` (main file)
- [ ] Explore database schema in Supabase dashboard
- [ ] Test coming soon page locally (http://localhost:5173)
- [ ] Submit a test form and check Make.com

### Day 2: Make Small Changes
- [ ] Add a console.log to a route
- [ ] Modify CSS color in `risivo-global.css`
- [ ] Add a new static page
- [ ] Commit and push changes

### Day 3: Work on Features
- [ ] Pick a task from roadmap
- [ ] Implement feature on `genspark_ai_developer` branch
- [ ] Test locally
- [ ] Create pull request

---

## 🆘 GETTING HELP

### Questions About Code?
1. Check `RISIVO_WEBSITE_DOCUMENTATION.md` first
2. Search GitHub issues
3. Ask project owner

### Technical Issues?
1. Check Cloudflare Workers logs: `wrangler tail`
2. Check Supabase logs in dashboard
3. Check Make.com execution history

### Need Credentials?
Ask project owner for:
- Supabase keys
- SendGrid API key
- Make.com access
- Cloudflare Pages access

---

## ✅ QUICK CHECKLIST

Before starting development:
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with all keys
- [ ] Dev server running (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Build succeeds (`npm run build`)
- [ ] On `genspark_ai_developer` branch
- [ ] Read `RISIVO_WEBSITE_DOCUMENTATION.md`

Before committing:
- [ ] Code builds without errors
- [ ] Tested changes locally
- [ ] Commit message follows format
- [ ] Pushing to `genspark_ai_developer` branch
- [ ] Will create PR before merging to main

---

## 🚀 YOU'RE READY!

You now have everything you need to start developing on the Risivo website. Remember:

1. ✅ **Always work on `genspark_ai_developer` branch**
2. ✅ **Commit after every change**
3. ✅ **Read documentation before major changes**
4. ✅ **Test locally before pushing**
5. ✅ **Create PRs for production deployment**

**Happy coding!** 🎉

---

**Document Version**: 1.0  
**Last Updated**: December 16, 2025  
**For**: New developers and AI assistants
