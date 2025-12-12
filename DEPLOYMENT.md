# F1 Pulse Deployment Guide

This guide explains how to deploy the F1 Pulse application to production.

## Architecture

The F1 Pulse application consists of **two separate, independently deployable services**:

- **Frontend**: Next.js app (deployed to Vercel)
- **Backend**: FastAPI app (deployed to Railway or Render)
- **Communication**: Frontend communicates with backend via HTTP API calls using environment variables

Both services are completely independent and can be deployed separately. They communicate only through REST API calls.

## Step 1: Deploy Backend

### Option A: Railway (Recommended)

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Configure the service:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Build Command**: `pip install -r requirements.txt` (optional, Railway auto-detects)

5. **Add Environment Variable**:
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://your-app.vercel.app,https://*.vercel.app,http://localhost:3000`
     - Replace `your-app.vercel.app` with your actual Vercel domain
     - The `*.vercel.app` wildcard allows all Vercel preview deployments

6. Deploy and copy the generated URL (e.g., `https://f1-pulse-backend.railway.app`)

### Option B: Render

1. Go to [Render](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `f1-pulse-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variable**:
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://your-app.vercel.app,https://*.vercel.app,http://localhost:3000`

6. Deploy and copy the URL

### Verify Backend Deployment

1. Visit: `https://your-backend-url.railway.app/health`
   - Should return: `{"status": "healthy"}`

2. Visit: `https://your-backend-url.railway.app/docs`
   - Should show FastAPI interactive documentation

## Step 2: Deploy Frontend

### Vercel Deployment

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "Add New Project" → Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your backend URL (e.g., `https://f1-pulse-backend.railway.app`)
     - **Important**: No trailing slash!

5. Click "Deploy"

### Verify Frontend Deployment

1. Visit your Vercel URL
2. Open browser DevTools (F12) → Console tab
3. Check for any CORS errors
4. Try making a prediction to verify API connection

## Step 3: Update Backend CORS (If Needed)

If you need to add more domains later, update the `ALLOWED_ORIGINS` environment variable in your backend platform:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app,http://localhost:3000,https://another-domain.com
```

## How It Works

### Communication Flow

```
Frontend (Vercel)                    Backend (Railway/Render)
     │                                      │
     │ 1. User clicks "Predict"            │
     │                                      │
     │ 2. Reads NEXT_PUBLIC_API_URL        │
     │    from environment                  │
     │                                      │
     │ 3. Makes HTTP request ──────────────>│
     │    GET /predict/123                  │
     │                                      │
     │                                      │ 4. Checks CORS
     │                                      │    (allows request?)
     │                                      │
     │                                      │ 5. Processes request
     │                                      │    (runs ML model)
     │                                      │
     │ 6. Receives response <──────────────│
     │    { predictions: [...] }            │
     │                                      │
     │ 7. Displays results                  │
```

### Environment Variables

**Backend (Railway/Render)**:
- `ALLOWED_ORIGINS`: Comma-separated list of frontend URLs allowed to make requests

**Frontend (Vercel)**:
- `NEXT_PUBLIC_API_URL`: The backend API URL (must start with `NEXT_PUBLIC_` to be accessible in browser)

## Troubleshooting

### CORS Errors

**Symptom**: Browser console shows "CORS policy" errors

**Solution**:
1. Check that `ALLOWED_ORIGINS` in backend includes your Vercel URL
2. Verify the URL matches exactly (including `https://`)
3. Restart backend after updating environment variables

### API Connection Failed

**Symptom**: Frontend shows "Failed to load" errors

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Test backend URL directly: `https://your-backend-url/health`
3. Check backend logs for errors
4. Ensure backend is running and accessible

### Build Errors

**Frontend**:
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Backend**:
- Check Railway/Render build logs
- Ensure `requirements.txt` includes all dependencies
- Verify Python version (3.11 recommended)

## Repository Structure

The repository is structured for separate deployment:

```
f1-pulse/
├── app/                    # Frontend (Next.js)
├── public/                  # Static assets
├── package.json            # Frontend dependencies
├── vercel.json             # Vercel config (optional)
├── backend/                # Backend (FastAPI) - standalone
│   ├── main.py
│   ├── F1_predict_md.py
│   ├── requirements.txt
│   ├── Procfile           # Railway/Heroku
│   ├── railway.json       # Railway config
│   ├── render.yaml        # Render config
│   ├── data/
│   └── models/
└── DEPLOYMENT.md           # This file
```

## Required Files in Repository

Make sure these files are committed (not in `.gitignore`):

**Backend**:
```
backend/
  ├── data/
  │   ├── races.csv
  │   ├── circuits.csv
  │   └── predictions_2025_flat.csv (optional)
  ├── models/
  │   └── f1_model.cbm
  ├── F1_predict_md.py
  ├── main.py
  ├── requirements.txt
  ├── Procfile
  ├── railway.json
  └── render.yaml
```

**Frontend**:
```
app/
public/
package.json
next.config.ts
vercel.json (optional)
```

## Quick Checklist

- [ ] Backend deployed (Railway/Render)
- [ ] Backend URL obtained
- [ ] `ALLOWED_ORIGINS` environment variable set in backend
- [ ] Backend health check works (`/health`)
- [ ] Frontend deployed to Vercel
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Frontend can connect to backend (no CORS errors)
- [ ] Test prediction works end-to-end

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs in Railway/Render dashboard
3. Verify all environment variables are set correctly
4. Test backend endpoints directly using `/docs` page

