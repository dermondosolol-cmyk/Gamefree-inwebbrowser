# ⚡ Quick Deployment Reference

## 🎯 Deploy in 3 Minutes

### Railway.app (Easiest)

```bash
npm install -g railway
railway login
railway init
railway up
```

**Done!** Your app is live at: `https://<project>.railway.app`

---

### Render.com (GitHub Required)

1. Push to GitHub: `git push origin main`
2. Visit https://render.com/dashboard
3. Click "New Web Service"
4. Connect GitHub → Select repo
5. Configure:
   - Build: `npm install`
   - Start: `npm run start`
   - Node: `18`
6. Click Deploy

**Done!** Your app is live at: `https://gamefree-browser.onrender.com`

---

## 📊 Platform at a Glance

| | Railway | Render |
|---|---------|--------|
| **Cost** | $5/mo free | Free forever |
| **Sleep** | No | 15 min (free) |
| **Setup** | CLI: 4 steps | Dashboard: 6 steps |
| **Speed** | ⚡⚡⚡ | ⚡⚡ |
| **Best** | Production | Learning |

---

## 🔧 Useful Commands

```bash
# Local testing
npm run serve                    # Dev mode (port 8000)
npm run serve:production         # Prod mode locally

# Railway
railway login
railway init
railway up
railway status
railway logs --follow
railway restart

# Deployment
npm run deploy:railway
npm run deploy:render
```

---

## 📁 Key Files

- `railway.json` - Railway configuration
- `render.yaml` - Render configuration  
- `Procfile` - Both platforms
- `server.js` - Production-ready server
- `RAILWAY_DEPLOYMENT.md` - Full Railway guide
- `RENDER_DEPLOYMENT.md` - Full Render guide

---

## ❓ FAQs

**Q: Which is faster?**  
A: Railway (auto-scaling)

**Q: Which is cheaper?**  
A: Render (free forever)

**Q: Which has better uptime?**  
A: Railway (no auto-sleep)

**Q: Can I use both?**  
A: Yes! Deploy to both for redundancy

---

## 🚀 Next Steps

1. ✅ Choose platform above
2. ✅ Run 3-6 commands
3. ✅ Get public URL
4. ✅ App is live!

---

**Questions?** See full guides in project root.
