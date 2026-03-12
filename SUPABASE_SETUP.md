# Supabase Setup Guide

Follow these steps to set up your Supabase backend for NYUAD Travel Guide v2.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"** (if you already have an account)
3. Sign up with GitHub (recommended) or email
4. Once logged in, click **"New Project"**

## Step 2: Project Configuration

Fill in the project details:

- **Name**: `nyuad-travel-guide-v2`
- **Database Password**: Create a strong password (save this somewhere safe!)
- **Region**: Choose the closest to your target audience
  - US East (if targeting Americas)
  - Europe (if targeting Europe/Middle East)
  - Southeast Asia (if targeting Asia)
- **Pricing Plan**: Free (perfect for this project)

Click **"Create new project"**

⏱️ Wait 2-3 minutes for your database to be provisioned...

## Step 3: Get Your API Keys

Once your project is ready:

1. Click on the **Settings** icon (gear) in the left sidebar
2. Go to **API** section
3. You'll see two important values:

   **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **Project API keys**
   - Find the `anon` `public` key (this is safe to use in your frontend)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Copy both values** - you'll need them next!

## Step 4: Run Database Migration

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the file at `/Users/alyssayu/Downloads/nyuad-travel-guide-v2/supabase/migrations/001_initial_schema.sql`
4. **Copy the entire SQL script** and paste it into the SQL Editor
5. Click **"Run"** button (or press Cmd/Ctrl + Enter)

You should see: ✅ **Success. No rows returned**

This creates:
- `guides` table for travel entries
- `guide_photos` table for photos
- `guide-photos` storage bucket
- All necessary indexes, triggers, and security policies

## Step 5: Verify Setup

Check that everything was created:

1. Click **Table Editor** in left sidebar
2. You should see two tables:
   - ✅ `guides`
   - ✅ `guide_photos`

3. Click **Storage** in left sidebar
4. You should see one bucket:
   - ✅ `guide-photos`

## Step 6: Configure Local Environment

Create a `.env.local` file in your project root:

```bash
cd /Users/alyssayu/Downloads/nyuad-travel-guide-v2
cp .env.example .env.local
```

Edit `.env.local` and paste your values:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key (we'll get this later)
```

## Step 7: Test the Setup

Run the dev server:

```bash
npm run dev
```

Open http://localhost:5173 - if the app loads without errors, Supabase is configured! 🎉

---

## Next Steps

After Supabase is set up, we'll:
1. ✅ Create the Supabase client connection
2. ✅ Build authentication system
3. ✅ Migrate the 49 legacy travel entries
4. ✅ Build the map visualization
5. ✅ Create guide submission forms
6. ✅ Deploy to Vercel

---

## Troubleshooting

**Error: "relation does not exist"**
- Make sure you ran the SQL migration in Step 4
- Check Table Editor to verify tables were created

**Error: "Invalid API key"**
- Double-check you copied the `anon public` key, not the `service_role secret`
- Make sure there are no extra spaces or line breaks

**Error: "PostGIS extension not available"**
- Supabase should have PostGIS by default
- Try running: `CREATE EXTENSION IF NOT EXISTS postgis;` separately first

---

Need help? Let me know what step you're on!
