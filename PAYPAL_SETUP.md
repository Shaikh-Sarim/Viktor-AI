# PayPal Integration Setup Guide

## Prerequisites
You need to have a PayPal Business or Developer account to integrate PayPal payments.

## Steps to Setup PayPal

### 1. Create a PayPal Developer Account
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign up or log in with your PayPal account
3. Navigate to **Apps & Credentials**

### 2. Create an App
1. In the **Apps & Credentials** section, select **Sandbox** (for testing) or **Live** (for production)
2. Click **Create App** under the **REST API apps** section
3. Enter an app name (e.g., "Viktor AI")
4. Click **Create App**

### 3. Get Your Credentials
1. Your app will appear in the list. Click on it to view details
2. You'll see two sections:
   - **Sandbox** (for testing)
   - **Live** (for production)

Under each section, you'll find:
- **Client ID**
- **Secret** (Click "Show" to reveal)

### 4. Set Environment Variables
Add these to your `.env.local` file:

**For Sandbox (Testing):**
```
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_SECRET=your_sandbox_secret
```

**For Production (Live):**
```
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_SECRET=your_live_secret
```

### 5. Configure Return URLs
In the API route files (`/api/paypal-create-order/route.ts`), ensure:
- `PAYPAL_API` is set to `https://api.sandbox.paypal.com` for testing
- Change to `https://api.paypal.com` for production
- `NEXTAUTH_URL` environment variable is correctly set

### 6. Test the Integration
1. Start your dev server: `npm run dev`
2. Register/login to your app
3. Choose a paid plan
4. You'll be redirected to PayPal Sandbox
5. Use these test credentials:
   - **Buyer Email:** `sb-buyer@personal.example.com`
   - **Password:** `a1B@w0rd` (or check your PayPal sandbox for actual test accounts)

### 7. Deploy to Production
1. Get your live PayPal credentials
2. Update environment variables in your hosting platform
3. Change `PAYPAL_API` to `https://api.paypal.com` in the API routes
4. Test with real PayPal accounts

## Environment Variables Summary

```env
# Required for PayPal Integration
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret

# Other required variables
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000 # or your production URL
DATABASE_URL=file:./prisma/dev.db
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant
TAVILY_API_KEY=your_tavily_key
```

## Pricing Configuration

Current plan pricing (in USD):
- **Basic:** $9.99/month (500 credits)
- **Pro:** $29.99/month (2,000 credits)
- **Pro+:** $79.99/month (10,000 credits)

To change prices, edit the `PLAN_PRICES` object in `/api/paypal-create-order/route.ts`

## Troubleshooting

**Issue:** "PayPal not configured" error
- **Solution:** Ensure `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET` are set in `.env.local`

**Issue:** Payment fails with "Invalid plan"
- **Solution:** Ensure the plan ID matches one in `PLAN_PRICES` object

**Issue:** Can't get access token
- **Solution:** Verify your credentials are correct in the PayPal Developer Dashboard

**Issue:** Return URL shows error
- **Solution:** Ensure `NEXTAUTH_URL` is correctly set. For local testing, use `http://localhost:3000`
