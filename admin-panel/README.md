# Risivo CMS - React Admin Panel

Modern, production-ready admin panel built with React, TypeScript, and Tailwind CSS.

## Features

✅ **Authentication** - Secure login with Supabase Auth  
✅ **Dashboard** - Overview of your CMS content  
✅ **Pages Manager** - Create, edit, publish, and delete pages  
✅ **Page Editor** - Edit page metadata in 6 languages  
✅ **Media Library** - (Coming soon) Upload and manage media  
✅ **Translations** - (Coming soon) Manage multi-language content  
✅ **Settings** - (Coming soon) Configure CMS settings  

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Supabase** - Backend & auth
- **Headless UI** - Accessible components
- **Hero Icons** - Beautiful icons

## Setup Instructions

### 1. Install Dependencies

```bash
cd admin-panel
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the `admin-panel/` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=https://risivo-staging.pages.dev/api/cms
```

**Where to find these:**
- Go to https://supabase.com/dashboard
- Select your project
- Go to **Settings** → **API**
- Copy **Project URL** → `VITE_SUPABASE_URL`
- Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. Run Development Server

```bash
npm run dev
```

The admin panel will open at: **http://localhost:3001**

### 4. Login

Use your Supabase admin credentials:
- Email: `your-admin-email@example.com`
- Password: `your-password`

**Note:** Make sure you have an admin profile in the `cms_user_profiles` table.

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Deploy

You can deploy the admin panel to:
- **Cloudflare Pages**
- **Vercel**
- **Netlify**
- Any static hosting service

### Deploy to Cloudflare Pages

```bash
# From admin-panel directory
npm run build
npx wrangler pages deploy dist --project-name risivo-admin
```

Add environment variables in Cloudflare dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`

## Project Structure

```
admin-panel/
├── src/
│   ├── components/
│   │   ├── auth/           # Login, Protected Route
│   │   ├── layout/         # Sidebar, Header, AppLayout
│   │   └── ui/             # Reusable UI components
│   ├── pages/              # Main page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities, API, Supabase
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── package.json            # Dependencies
```

## Available Pages

- `/admin` - Dashboard
- `/admin/pages` - Pages Manager
- `/admin/pages/new` - Create New Page
- `/admin/pages/:id` - Edit Page
- `/admin/media` - Media Library (coming soon)
- `/admin/translations` - Translations (coming soon)
- `/admin/settings` - Settings (coming soon)

## API Integration

The admin panel connects to your CMS API at:
- Production: `https://risivo-staging.pages.dev/api/cms`

All API calls are authenticated using Supabase session tokens.

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart the dev server after adding env vars

### Can't login
- Verify your user exists in Supabase Auth
- Check that you have an admin profile in `cms_user_profiles` table
- Check browser console for errors

### API calls failing
- Verify `VITE_API_BASE_URL` is correct
- Check that CMS API is deployed and working
- Check browser network tab for error details

## Next Steps

1. ✅ Login to admin panel
2. ✅ Create your first page
3. ✅ Edit page metadata
4. ✅ Publish the page
5. 🔜 Add more features (media, translations)

## Support

For issues or questions, check the main project documentation.
