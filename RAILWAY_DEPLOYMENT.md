# 🚀 Railway.app Deployment Guide

## Complete Setup for Gamefree Browser

### Prerequisites
- Node.js 18+ installed
- npm 8+ installed
- GitHub account
- Railway.app account (free at railway.app)

---

## Step-by-Step Deployment

### 1. **Install Railway CLI**

```bash
npm install -g railway
```

Verify installation:
```bash
railway --version
```

### 2. **Login to Railway**

```bash
railway login
```

This opens your browser to authenticate. After logging in, return to terminal.

### 3. **Initialize Railway Project**

```bash
cd /workspaces/Gamefree-inwebbrowser
railway init
```

Follow the prompts:
- Create a new project
- Choose a project name (e.g., "gamefree-browser")
- Select environment (leave as default or choose "production")

### 4. **Configure Environment Variables** (Optional)

```bash
railway variables:set NODE_ENV=production
railway variables:set PORT=3000
```

View current variables:
```bash
railway variables
```

### 5. **Deploy Your Application**

```bash
railway up
```

The CLI will:
- Bundle your application
- Upload to Railway's servers
- Build and start the service
- Provide you with a public URL

### 6. **Monitor Deployment**

Check deployment status:
```bash
railway status
```

View logs:
```bash
railway logs
```

---

## Accessing Your Deployed Site

After successful deployment, Railway provides:
- **Public URL**: `https://<service-name>.railway.app`
- **Dashboard**: https://railway.app/dashboard
- **Logs**: Real-time logs in dashboard
- **Metrics**: CPU, Memory, Requests in dashboard

---

## Automatic Deployments (Optional)

Connect your GitHub repository for automatic deployments:

1. Visit https://railway.app/dashboard
2. Select your project
3. Click "Settings" → "GitHub"
4. Authorize GitHub
5. Select repository
6. Choose branch for auto-deploy (main)

Now every push to `main` automatically deploys!

---

## Monitoring & Troubleshooting

### Check if service is running
```bash
railway status
```

### View recent logs
```bash
railway logs --follow
```

### Restart service
```bash
railway restart
```

### Scale your app
```bash
railway scale web=2
```

---

## Free Tier Benefits

✅ **$5 USD credit per month**  
✅ **Generous free tier**  
✅ **Auto-scaling included**  
✅ **Custom domains**  
✅ **Unlimited projects**  
✅ **GitHub integration**  

---

## Common Issues & Solutions

### Port Already in Use
Railway automatically handles port allocation. The `server.js` reads `$PORT` environment variable.

### Build Failures
Check build logs:
```bash
railway logs --service <service-name>
```

### Service Not Starting
Verify the `Procfile`:
```
web: PORT=$PORT npm run start
```

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `railway up` | Deploy/Update application |
| `railway status` | Check deployment status |
| `railway logs` | View application logs |
| `railway logs -f` | Stream logs in real-time |
| `railway restart` | Restart the service |
| `railway variables` | View environment variables |
| `railway variables:set KEY=VALUE` | Set environment variable |
| `railway shell` | Open remote shell |
| `railway open` | Open app in browser |

---

## Next Steps

After deployment:

1. ✅ Visit your public URL
2. ✅ Test all features
3. ✅ Connect custom domain (if needed)
4. ✅ Set up monitoring
5. ✅ Configure auto-deployments

---

## Support

- Railway Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status Page: https://railway.app/status
