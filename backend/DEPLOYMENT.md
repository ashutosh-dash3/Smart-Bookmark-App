# Smart Bookmark App - Backend Deployment Guide

## Overview
This guide covers deploying the Smart Bookmark App backend to Render with MongoDB Atlas.

---

## Required Environment Variables (Render Dashboard)

Set these in your Render Dashboard > Web Service > Environment:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxxxxx` |
| `SESSION_SECRET` | Random string for session encryption | `64-char-hex-string` |
| `CLIENT_URL` | Your deployed frontend URL | `https://your-app.vercel.app` |

---

## MongoDB Atlas Configuration

### 1. Create Cluster
1. Go to https://cloud.mongodb.com
2. Create a new cluster (M0 Sandbox is free)
3. Choose AWS as cloud provider (closest to your region)

### 2. Configure Database Access
1. Go to **Database Access** > **Add New Database User**
2. Create a username and password (save these!)
3. Set privileges: **Read and write to any database**

### 3. Configure Network Access
1. Go to **Network Access** > **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Required for Render deployment (dynamic IPs)
   - Or use Render's outbound IP ranges if available

### 4. Get Connection String
1. Go to **Database** > **Connect** > **Drivers**
2. Select **Node.js** and version 4.1 or later
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `smart-bookmark`

### 5. Test Connection
```bash
# Local test with MongoDB Compass or mongosh
mongodb+srv://username:password@cluster.mongodb.net/smart-bookmark
```

---

## Google OAuth Configuration

### 1. Update Authorized Redirect URIs
In Google Cloud Console > APIs & Services > Credentials:

Add these URLs:
```
https://your-render-backend.onrender.com/api/auth/google/callback
```

### 2. Update Authorized JavaScript Origins
```
https://your-render-backend.onrender.com
https://your-frontend.vercel.app
```

---

## Render Deployment Steps

### 1. Create Web Service
1. Go to https://dashboard.render.com
2. Click **New +** > **Web Service**
3. Connect your GitHub repository
4. Select the `backend` folder as the root directory

### 2. Configure Build Settings
| Setting | Value |
|---------|-------|
| **Name** | smart-bookmark-api |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free or paid |

### 3. Add Environment Variables
Copy all variables from the table above into Render's Environment section.

### 4. Deploy
Click **Create Web Service** and wait for deployment.

---

## Deployment Checklist

### Pre-Deployment
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string tested locally
- [ ] Google OAuth credentials obtained
- [ ] Google OAuth redirect URIs updated
- [ ] Frontend deployed (for CLIENT_URL)

### Render Setup
- [ ] Web Service created
- [ ] Build command set to `npm install`
- [ ] Start command set to `npm start`
- [ ] All 6 environment variables added
- [ ] Node version 18+ selected

### Post-Deployment
- [ ] Health check endpoint responds: `GET /health`
- [ ] MongoDB connection successful (check logs)
- [ ] Google OAuth login works
- [ ] API endpoints respond correctly
- [ ] Frontend can connect to backend

---

## Troubleshooting

### Error: "Missing required environment variables"
**Solution**: Check that all 6 required variables are set in Render dashboard.

### Error: "MongoDB Connection Error"
**Solutions**:
- Verify MONGODB_URI format (must start with mongodb+srv://)
- Check Network Access in MongoDB Atlas (allow 0.0.0.0/0)
- Verify database user credentials
- Check if IP whitelist is blocking Render's IPs

### Error: "CORS policy blocked"
**Solution**: Ensure CLIENT_URL matches your actual frontend URL exactly (including https://).

### Error: "Google OAuth redirect_uri_mismatch"
**Solution**: Update Authorized redirect URIs in Google Cloud Console with your Render URL.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/bookmarks` | Get all bookmarks |
| POST | `/api/bookmarks` | Create bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |

---

## Support

For issues with:
- **Render**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
