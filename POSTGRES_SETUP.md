# PostgreSQL Setup Guide for Viktor AI

## Quick Setup Options

### Option 1: Supabase (Recommended - Free tier available)
1. Go to https://supabase.com and sign up
2. Create a new project
3. Copy your connection string from **Settings > Database > Connection String**
4. Select "URI" format and copy it

### Option 2: Railway (Easy deployment)
1. Go to https://railway.app
2. Create project → Add PostgreSQL
3. Copy the PostgreSQL connection string

### Option 3: Local PostgreSQL
1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create a database: `createdb viktor_ai`
3. Connection string: `postgresql://username:password@localhost:5432/viktor_ai`

---

## Add to .env.local

Create a `.env.local` file in your project root with:

```
# Database
DATABASE_URL="your_postgresql_connection_string_here"

# NextAuth
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# PayPal (optional for testing)
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret

# APIs
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant
TAVILY_API_KEY=your_tavily_key
```

## Generate NEXTAUTH_SECRET

Run in terminal:
```bash
openssl rand -base64 32
```

---

## Run Migration

After adding DATABASE_URL:

```bash
npx prisma migrate dev --name init
```

This will:
1. Create all database tables
2. Set up the schema
3. Generate Prisma client

---

## Verify Setup

```bash
npx prisma studio
```

Opens a visual database editor to confirm tables were created.

---

## Production Deployment (Vercel)

1. In Vercel dashboard, add environment variables:
   - `DATABASE_URL` (your production PostgreSQL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel domain)
   - PayPal credentials
   - API keys

2. Migrations run automatically on deploy
