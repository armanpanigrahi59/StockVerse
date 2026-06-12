# Vercel Environment Variables Setup Guide 🚀

## Problem Solved
Your frontend was trying to connect to `http://127.0.0.1:5000` instead of your Render backend URLs. This has been fixed by using environment variables, but you need to configure them in Vercel.

---

## ✅ What Was Fixed in the Code

### Updated Components:
1. **`src/components/StockChart.tsx`** - Now uses `VITE_API_URL` environment variable
2. **`src/components/RandomGraph.tsx`** - Now uses `VITE_API_URL` environment variable
3. **`src/components/StockBot.tsx`** - Already uses `VITE_ASSISTANT_URL` environment variable

### Code Changes:
```typescript
// Before ❌
const response = await fetch('http://127.0.0.1:5000/api/stock-data?limit=50');

// After ✅
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const response = await fetch(`${API_BASE}/api/stock-data?limit=50`);
```

---

## 🔧 Step-by-Step: Configure Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Find your `stock-verse` project
3. Click on it to open the project dashboard

### Step 2: Access Environment Variables Settings
1. Click on **"Settings"** tab at the top
2. In the left sidebar, click on **"Environment Variables"**

### Step 3: Add Environment Variables
Add these **TWO** environment variables:

#### Variable 1: VITE_API_URL
```
Name: VITE_API_URL
Value: https://stock-verse.onrender.com
Environment: Production (check this box)
```

#### Variable 2: VITE_ASSISTANT_URL
```
Name: VITE_ASSISTANT_URL
Value: https://stock-verse-1.onrender.com
Environment: Production (check this box)
```

### Step 4: Save Variables
- Click **"Save"** for each variable
- You should see both variables listed in the Environment Variables section

---

## 🚀 Step 5: Trigger a Redeploy

### Option A: Automatic (Recommended)
Your changes have already been pushed to GitHub, so Vercel should automatically redeploy. 

**Check deployment status:**
1. Go to your Vercel project dashboard
2. Click on the **"Deployments"** tab
3. Look for the latest deployment (should show "Building" or "Ready")

### Option B: Manual Redeploy
If automatic deployment doesn't trigger:

1. Go to your Vercel project dashboard
2. Click on **"Deployments"** tab
3. Find the latest successful deployment
4. Click the **three dots (⋯)** menu
5. Select **"Redeploy"**
6. Confirm the redeployment

---

## ✅ Verification Steps

### 1. Wait for Vercel Deployment
- Check the Deployments tab in Vercel
- Wait until status shows **"Ready"** with a green checkmark
- This usually takes 1-3 minutes

### 2. Test Your Application
Once deployed, visit your site: **https://stock-verse-nine.vercel.app**

### 3. Check Browser Console
Open browser DevTools (F12) and look for:

#### ✅ **Expected (Success):**
```
GET https://stock-verse.onrender.com/api/stock-data?limit=50 200 OK
GET https://stock-verse.onrender.com/proxy/yahoo/AAPL 200 OK
```

#### ❌ **Old (Should NOT see this anymore):**
```
GET http://127.0.0.1:5000/api/stock-data?limit=50 net::ERR_CONNECTION_REFUSED
```

### 4. Test API Endpoints Manually
Open browser console and test:

```javascript
// Test Stock Data API
fetch('https://stock-verse.onrender.com/api/stock-data?limit=10')
  .then(r => r.json())
  .then(console.log)

// Test Yahoo Finance Proxy
fetch('https://stock-verse.onrender.com/proxy/yahoo/AAPL')
  .then(r => r.json())
  .then(console.log)

// Test Chatbot API
fetch('https://stock-verse-1.onrender.com/test')
  .then(r => r.json())
  .then(console.log)
```

---

## 📋 Environment Variables Reference

### Your Render Services:
| Service Name | URL | Purpose |
|-------------|-----|---------|
| Stock_Verse | https://stock-verse.onrender.com | Main FastAPI backend |
| Stock_Verse-1 | https://stock-verse-1.onrender.com | Chatbot Flask server |

### Vercel Environment Variables:
| Variable | Value | Used In |
|----------|-------|---------|
| VITE_API_URL | https://stock-verse.onrender.com | StockChart, RandomGraph, marketData service |
| VITE_ASSISTANT_URL | https://stock-verse-1.onrender.com | StockBot component |

---

## 🎯 Quick Checklist

- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Add `VITE_API_URL` = `https://stock-verse.onrender.com`
- [ ] Add `VITE_ASSISTANT_URL` = `https://stock-verse-1.onrender.com`
- [ ] Set both to "Production" environment
- [ ] Save both variables
- [ ] Wait for automatic redeploy OR trigger manual redeploy
- [ ] Visit your site and check browser console
- [ ] Verify no more `ERR_CONNECTION_REFUSED` errors
- [ ] Confirm stock data and charts are loading

---

## 🔍 Troubleshooting

### Issue: Still seeing localhost errors after redeployment
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+F5)
3. Check that environment variables are saved in Vercel
4. Verify deployment used the latest code (check git commit hash in Vercel)

### Issue: Environment variables not working
**Solution:**
1. Make sure variable names are **EXACT**: `VITE_API_URL` (not `VITE_API_BASE` or similar)
2. Make sure they start with `VITE_` (required for Vite to expose them)
3. Make sure "Production" is checked for each variable
4. After adding variables, you MUST redeploy

### Issue: 404 errors from Render backend
**Solution:**
1. Check that both Render services are "Live" (green status)
2. Test the Render URLs directly in browser:
   - https://stock-verse.onrender.com/test
   - https://stock-verse-1.onrender.com/test
3. If not responding, go to Render dashboard and manually deploy

### Issue: CORS errors
**Solution:**
- These should be fixed in the backend code
- If you still see CORS errors, check Render logs for the backend service
- Verify the backend deployed successfully

---

## 📊 Expected Timeline

| Step | Time |
|------|------|
| Add environment variables in Vercel | 2 minutes |
| Vercel automatic redeployment | 1-3 minutes |
| DNS propagation (if needed) | Instant |
| **Total** | **~5 minutes** |

---

## 🎉 Success Indicators

You'll know everything is working when you see:

1. ✅ No more `ERR_CONNECTION_REFUSED` errors
2. ✅ Stock charts displaying real data
3. ✅ Live market data updating
4. ✅ Chatbot responding to messages
5. ✅ All API calls going to `https://stock-verse.onrender.com`
6. ✅ Green "200 OK" responses in Network tab

---

## 📝 Summary of Changes

### Files Modified:
```
✓ src/components/StockChart.tsx
✓ src/components/RandomGraph.tsx
✓ backend/server.py
```

### Git Commits:
```
✓ Fix proxy endpoint: Handle query params correctly
✓ Clean up duplicate imports in server.py
✓ Fix: Use environment variables instead of hardcoded localhost URLs
```

### Deployments Required:
```
✓ Backend: Already redeployed on Render (auto-deploy from git)
⏳ Frontend: Waiting for environment variables + redeploy on Vercel
```

---

## 🆘 Still Having Issues?

If you've followed all steps and still experiencing problems:

1. **Check Vercel Build Logs:**
   - Go to Deployments → Latest Deployment → Building
   - Look for any errors or warnings
   - Verify environment variables are being used during build

2. **Check Render Logs:**
   - Go to Render Dashboard → Stock_Verse → Logs
   - Look for incoming requests
   - Check for any error messages

3. **Verify URLs are correct:**
   ```bash
   # Test Render services directly
   curl https://stock-verse.onrender.com/test
   curl https://stock-verse-1.onrender.com/test
   ```

---

**Last Updated:** October 17, 2025  
**Next Action:** Add environment variables in Vercel, then redeploy  
**Expected Result:** Full stack application working with no connection errors  

Good luck! 🚀📈
