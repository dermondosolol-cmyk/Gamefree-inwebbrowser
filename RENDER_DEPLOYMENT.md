# 🎨 Render.com Deployment Guide

## Complete Setup for Gamefree Browser

### Prerequisites
- Node.js 18+ installed
- npm 8+ installed  
- GitHub account (with your repo pushed)
- Render.com account (free at render.com)

---

## Step-by-Step Deployment

### 1. **Push Code to GitHub**

First, ensure your code is pushed to GitHub:

```bash
cd /workspaces/Gamefree-inwebbrowser

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - ready for Render deployment"

# Push to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. **Create Render Account**

1. Visit https://render.com
2. Sign up (free tier available)
3. Connect your GitHub account

### 3. **Create New Web Service**

1. Dashboard → "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `Gamefree-inwebbrowser` repository
4. Click "Connect"

### 4. **Configure Service Settings**

In the service configuration page:

**Name**: `gamefree-browser` (or your choice)

**Environment**: `Node`

**Build Command**:
```
npm install
```

**Start Command**:
```
npm run start
```

**Node Version**: `18` (or 20)

**Free Tier Settings**:
- Plan: `Free`
- Auto-scaling: Leave default

### 5. **Environment Variables** (Optional)

Add environment variables:
- Key: `NODE_ENV`
- Value: `production`

### 6. **Deploy**

Click "Create Web Service"

Render will:
- Clone your repository
- Install dependencies (`npm install`)
- Build the application
- Start the service with `npm run start`
- Provide a public URL

---

## Accessing Your Deployed Site

After successful deployment:
- **Public URL**: `https://gamefree-browser.onrender.com`
- **Dashboard**: https://dashboard.render.com
- **Logs**: Real-time in dashboard
- **Metrics**: Usage and performance

---

## Auto-Deployments (Always On)

Render automatically redeploys when you push to GitHub:

1. Dashboard → Your service
2. Settings → "Auto-Deploy"
3. Select branch: `main` (or your main branch)
4. Save

Now every push automatically redeploys! ✅

---

## Important: Avoiding Auto-Sleep

Free tier apps go to sleep after 15 minutes of inactivity.

**To keep it running:**

1. Upgrade to Paid ($7/month) - No auto-sleep
2. Or use a "ping" service:
   - Visit https://uptimerobot.com (free)
   - Create monitor pointing to your Render URL
   - Set interval to 5 minutes
   - Your app stays awake!

---

## Monitoring & Management

### View Logs
1. Dashboard → Your service
2. Logs tab → View real-time logs

### Redeploy Manually
1. Service page → "Manual Deploy"
2. Click "Deploy latest commit"

### Check Service Status
1. Dashboard → Your service
2. Status badge shows if running

---

## Free Tier Limits

⏰ **15-minute auto-sleep** (when inactive)  
💾 **512 MB RAM** (usually sufficient)  
🔄 **Unlimited deployments**  
📊 **Limited metrics**  
🎯 **Good for hobbyist projects**

---

## Common Issues & Solutions

### Service won't start
Check logs in dashboard:
1. Dashboard → Service
2. "Logs" tab
3. Look for error messages

Common fixes:
```bash
# Ensure correct Node version
node --version  # Should be 18+

# Test locally
npm install
npm run start
```

### Port issues
The `Procfile` and `server.js` handle port automatically:
- Reads `$PORT` environment variable
- Defaults to 3000 on Render

### Build failures
1. Ensure `package.json` has all dependencies
2. Check `npm run start` works locally
3. Push changes and redeploy

---

## Useful Links

| Link | Purpose |
|------|---------|
| https://dashboard.render.com | Main dashboard |
| https://docs.render.com | Documentation |
| https://render.com/status | Status page |
| https://discord.gg/6Kp5gluTWs | Discord community |

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Web Service created
- [ ] Build command: `npm install`
- [ ] Start command: `npm run start`
- [ ] Node version: 18+
- [ ] Auto-deploy enabled
- [ ] Service running successfully
- [ ] Public URL accessible
- [ ] Ping service configured (optional)

---

## After Deployment

1. ✅ Test your site: https://gamefree-browser.onrender.com
2. ✅ Check all features work
3. ✅ Set up custom domain (optional)
4. ✅ Configure DNS if using custom domain
5. ✅ Monitor logs for errors

---

## Support

- Render Docs: https://docs.render.com
- Support: https://render.com/support
- Discord: https://discord.gg/6Kp5gluTWs
- Email: support@render.com

---

## Upgrading (Optional)

When ready to use custom domains and skip auto-sleep:

**Starter Plan: $7/month**
- No auto-sleep
- Auto-scaling
- Custom domains
- Priority support

Visit Dashboard → Service → Settings → Plan
