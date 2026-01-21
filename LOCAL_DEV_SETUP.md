# 🎮 Nebula Gaming - Local Development Setup

## Quick Start

### macOS / Linux
```bash
# Make the startup script executable
chmod +x start-dev.sh

# Run the development server
./start-dev.sh
```

### Windows
```bash
# Run the startup script
start-dev.bat
```

### Manual Start (All Platforms)
```bash
# Install dependencies
npm install

# Start the development server
npm run serve
```

---

## Server Details

### Local Access
- **Main URL:** http://localhost:8000
- **Alternative:** http://127.0.0.1:8000

### Trusted Origins (CORS)
The following origins are automatically trusted:
- `http://localhost:8000`
- `http://127.0.0.1:8000`
- `http://localhost`
- `http://127.0.0.1`

### Features

#### 🔒 Security Headers
- **X-Content-Type-Options:** `nosniff` - Prevent MIME sniffing
- **X-Frame-Options:** `SAMEORIGIN` - Prevent clickjacking
- **X-XSS-Protection:** `1; mode=block` - Enable XSS protection
- **Referrer-Policy:** `no-referrer-when-downgrade` - Control referrer info
- **Permissions-Policy:** Restrict microphone, camera, payment APIs to self

#### 🌐 CORS Configuration
- **CORS Enabled:** Yes
- **Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS, HEAD
- **Allowed Headers:** Content-Type, Authorization, X-Requested-With, Accept
- **Credentials:** Allowed (for secure cookies)
- **Max Age:** 86400 seconds (24 hours)

#### ⚡ Performance
- **GZIP Compression:** Enabled
- **Cache Control:** 3600 seconds (1 hour) for static assets
- **Caching:** Public cache for static files

#### 🔄 Routing
- Root path (`/`) automatically serves `index.html`
- Missing routes redirect to `index.html` (Single Page App support)

---

## Configuration Files

### server.js
Custom Node.js HTTP server with:
- Full CORS support for localhost
- Security headers configuration
- MIME type detection
- Graceful error handling
- Pretty console logging

### package.json Scripts
```json
"scripts": {
  "serve": "node server.js",
  "serve:http": "http-server . -p 8000 -c-1 --cors",
  "dev": "concurrently \"npm run serve\" \"npm run test:watch\""
}
```

---

## Troubleshooting

### Port 8000 Already in Use

**macOS / Linux:**
```bash
# Find the process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use the startup script (it handles this automatically)
./start-dev.sh
```

**Windows:**
```bash
# Find the process using port 8000
netstat -anob | find "8000"

# Kill the process
taskkill /PID <PID> /F

# Or use the startup script (it handles this automatically)
start-dev.bat
```

### CORS Errors in Browser Console

If you see CORS errors:
1. Make sure server is running on `localhost:8000`
2. Check the browser is accessing `http://localhost:8000` (not HTTPS)
3. Verify the request origin matches one of the trusted origins
4. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Blank Page or 404 Errors

1. Ensure all files are in the repository root
2. Check that `index.html` exists
3. Restart the server with: `npm run serve`
4. Clear browser cache and reload

### Dependencies Not Installed

```bash
# Install/reinstall dependencies
npm install

# Clear npm cache if needed
npm cache clean --force
npm install
```

---

## Development Workflow

### 1. Start Development Server
```bash
npm run serve
```

### 2. Open in Browser
```
http://localhost:8000
```

### 3. Make Changes
- Edit files in your editor
- Browser will reload with changes (use Ctrl+R / Cmd+R)

### 4. Test Features
- Sign in with Google/GitHub/Guest
- Test video calling
- Test chat system
- Test game loading
- Test virtual PC features

### 5. Debug
Open Browser DevTools:
- **F12** or **Ctrl+Shift+I** (Windows/Linux)
- **Cmd+Option+I** (macOS)

Check:
- Console tab for errors
- Network tab for failed requests
- Application tab for LocalStorage

---

## Ports and Services

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Nebula Gaming | 8000 | http://localhost:8000 | ✅ Trusted |
| WebRTC STUN | - | stun.l.google.com:19302 | ✅ Configured |
| External APIs | - | Various HTTPS endpoints | ✅ CORS Enabled |

---

## Security Notes

### Local Development
- ✅ All traffic is HTTP on localhost (safe for development)
- ✅ CORS properly configured for local requests
- ✅ Security headers prevent common attacks
- ✅ MIME type sniffing disabled
- ✅ Clickjacking protection enabled

### Production Deployment
Before deploying to production:
1. Use HTTPS (update URLs to https://)
2. Update trusted origins to your domain
3. Adjust cache headers based on your needs
4. Enable additional security headers
5. Configure rate limiting
6. Set up error logging

---

## Available npm Scripts

```bash
# Development
npm run serve              # Start development server
npm run serve:http        # Alternative: use http-server
npm run dev              # Start server + watch tests

# Testing
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:debug      # Debug mode
npm run test:headed     # Headed browser testing
npm run test:chrome     # Chrome only
npm run test:firefox    # Firefox only
npm run test:webkit     # Safari/WebKit only

# Code Quality
npm run lint            # Lint and fix issues
npm run format          # Format code
npm run build           # Lint + Test
npm run ci              # CI pipeline (lint, test, all browsers)

# Diagnostics
npm run diagnostics     # Run system diagnostics
```

---

## File Structure

```
/workspaces/Gamefree-inwebbrowser/
├── server.js               # Custom development server
├── start-dev.sh           # macOS/Linux startup script
├── start-dev.bat          # Windows startup script
├── .http-server.conf.json # HTTP server configuration
├── package.json           # NPM scripts and dependencies
├── index.html             # Main HTML file
├── script.js              # Game manager
├── auth.js                # Authentication system
├── chat.js                # Chat system
├── videocall.js           # Video calling
├── styles.css             # Styling
└── ...                    # Other project files
```

---

## Next Steps

1. **Start the server:** `npm run serve`
2. **Open browser:** http://localhost:8000
3. **Test locally:** Try all features
4. **Check console:** F12 to verify no errors
5. **Make changes:** Edit files and refresh
6. **Deploy:** When ready, push to production

---

## Support

For issues or questions:
1. Check browser console (F12)
2. Run diagnostics: `npm run diagnostics`
3. Check CORS settings in server.js
4. Verify trusted origins are configured
5. Clear cache and retry

Happy gaming! 🎮
