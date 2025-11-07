# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account)
2. Click "New Project"
3. Fill in:
   - **Name**: `retrocompa-voting` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize (takes 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...` - keep this secret!)

## Step 3: Create the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql` into the editor
4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

This creates:

- `families` table
- `guests` table
- `votes` table
- Row Level Security policies

## Step 4: Configure Environment Variables

1. Create a file named `.env.local` in the project root:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual keys from Step 2.

**Important**:

- The `SUPABASE_SERVICE_ROLE_KEY` is only needed for the seed script
- Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 5: Seed the Database

Run the seed script to populate families and guests from `names.txt`:

```bash
npm run seed
```

This will:

- Read `names.txt`
- Create all families
- Create all guests with their family associations

You should see output like:

```
Found 9 families
Inserted family: Familia Higuera
Inserted guest: Raúl (Familia Higuera)
...
Seed completed!
```

## Step 6: Verify Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see:
   - `families` table with 9 rows
   - `guests` table with all the names from `names.txt`
   - `votes` table (empty for now)

## Step 7: Test the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and test the voting flow.

## Troubleshooting

### "Missing environment variables" error

- Make sure `.env.local` exists and has all three variables
- Restart your dev server after creating/updating `.env.local`

### Seed script fails

- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify the database schema was created successfully
- Check the Supabase dashboard for error messages

### "Permission denied" errors

- Verify the RLS policies were created (check in **Authentication** → **Policies**)
- Make sure the `anon` key has the correct permissions

## For Vercel Deployment

When deploying to Vercel:

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add these three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (only if you need to run seed on Vercel, otherwise optional)
4. Redeploy your application
