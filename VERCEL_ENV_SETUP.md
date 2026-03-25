# 🚀 Vercel Environment Variables Setup

Your database is already working! This guide will fix the build failure by adding your existing DATABASE_URL to Vercel.

## Quick Setup (2 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/shaikh-sarims-projects-b10857f3/viktor-ai
2. Click **Settings** tab

### Step 2: Add Environment Variables
1. Click **Environment Variables** in the left sidebar
2. Click **Add New**
3. Add the following variables:

| Variable Name | Value | Notes |
|---|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string | Same one you used before it was working |
| `NEXTAUTH_SECRET` | From your `.env.local` | The long random string after `NEXTAUTH_SECRET=` |
| `NEXTAUTH_URL` | Your production URL | Usually `https://viktor-ai-git-main-shaikh-sarims-projects-b10857f3.vercel.app` |
| `PAYPAL_CLIENT_ID` | From `.env.local` | The PayPal Client ID |
| `PAYPAL_SECRET` | From `.env.local` | The PayPal Secret |
| `GROQ_API_KEY` | From `.env.local` | Your Groq API key |
| `TAVILY_API_KEY` | From `.env.local` | Your Tavily API key (optional) |
| `CLAUDE_API_KEY` | From `.env.local` | Your Claude API key (optional) |
| `REPLICATE_API_KEY` | From `.env.local` | Your Replicate API key (optional) |

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click on the failed deployment (87cc3a9)
3. Click **Redeploy** button
4. Wait for build to complete

## Where to Find DATABASE_URL

### If using Supabase (PostgreSQL):
- Go to https://supabase.com → Project → Settings → Database
- Copy the connection string

### If using Railway, Neon, or other PostgreSQL provider:
- Go to your provider's dashboard
- Find the database connection string

### If using environment variables exported from Vercel:
- Check your previous deployment logs to see the connection string you used

## Testing the Connection

After redeploy, you can verify the database is connected:
1. Go to Dashboard → Check if data loads correctly
2. Try creating a new subscription, upgrading plan, etc.
3. Check Vercel logs for any errors

## Troubleshooting

**Still failing?** Check:
1. ✅ DATABASE_URL is correct and can connect
2. ✅ All variables are set (no typos in names)
3. ✅ NEXTAUTH_URL matches your Vercel domain
4. ✅ Variables are set for Production environment (not Preview)

**If still stuck:**
```bash
# View current environment on Vercel dashboard
# Go to Settings → Environment Variables
# Scroll down and check "Production" environment
```
