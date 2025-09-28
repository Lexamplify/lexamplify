# Clerk Production Setup

## Required Environment Variables

Add these to your Vercel environment variables for the editor app:

### Clerk Production Keys
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

### Other Required Variables
```
NEXT_PUBLIC_CONVEX_URL=your-production-convex-url
LIVEBLOCKS_SECRET_KEY=your-liveblocks-secret-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key
NEXT_PUBLIC_SEARCH_TEMPLATES_API_URL=your-search-api-url
MAIN_WEBSITE_URL=https://lexamplify.vercel.app
WEBHOOK_SECRET=your-webhook-secret
```

## Steps to Fix

1. **Get Production Clerk Keys:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Select your project
   - Go to "API Keys" section
   - Copy the production keys (not development)

2. **Add to Vercel:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all the variables above

3. **Redeploy:**
   - Trigger a new deployment
   - The production keys will be used

## Verification

After deployment, you should see:
- No "development keys" warning in console
- Clerk authentication working properly
- No Server Components errors
