# Vercel Deployment Instructions

## Frontend Deployment to Vercel

### Step 1: Configure Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **IMPORTANT: Configure these settings:**

   - **Root Directory**: `suvidha-2026/src/frontend`
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build -- --configuration production`
   - **Output Directory**: `dist/suvidha-2026/browser`
   - **Install Command**: `npm install`

### Step 2: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
PRODUCTION=true
```

### Step 3: Deploy

Click **"Deploy"** - Vercel will build and deploy your frontend.

### Step 4: Get Your Vercel URL

After deployment, you'll get a URL like: `https://your-app.vercel.app`

---

## Backend Deployment to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. **Configure:**
   - **Name**: `suvidha-backend`
   - **Root Directory**: `suvidha-2026/src/backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/app.js`

### Step 3: Add Environment Variables

Add all variables from your `.env` file:

```
PORT=5000
DATABASE_URL=<your_postgres_connection_string>
CASHFREE_APP_ID=<your_cashfree_app_id>
CASHFREE_SECRET_KEY=<your_cashfree_secret>
MSG91_AUTH_KEY=<your_msg91_key>
JWT_SECRET=<your_jwt_secret>
DATA_ENCRYPTION_KEY=<your_encryption_key>
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Step 4: Deploy

Click **"Create Web Service"** - Render will build and deploy.

### Step 5: Get Your Render URL

You'll get a URL like: `https://suvidha-backend.onrender.com`

---

## Final Step: Connect Frontend to Backend

### Update Frontend Environment

Edit `environment.prod.ts` with your Render backend URL:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://suvidha-backend.onrender.com/api'
};
```

Commit and push - Vercel will auto-redeploy.

---

## Verification

1. ✅ Visit your Vercel URL - frontend should load
2. ✅ Check Network tab - API calls should go to Render backend
3. ✅ Test login with OTP
4. ✅ Test payment flow
5. ✅ Test complaint submission

---

## Troubleshooting

**Frontend 404 on routes:**
- Verify `vercel.json` rewrites are configured
- Check build output directory

**Backend API errors:**
- Verify all environment variables are set
- Check Render logs for errors
- Ensure database is accessible

**CORS errors:**
- Add Vercel URL to backend CORS whitelist
- Check `FRONTEND_URL` environment variable
