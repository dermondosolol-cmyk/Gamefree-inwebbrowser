# Gamefree Browser - Troubleshooting Guide 2026

## Quick Diagnostic Commands

Run these in your browser console (F12 → Console tab):

```javascript
// Full diagnostics
await gameDebugger.runDiagnostics();

// Export report
gameDebugger.exportReport();

// Check specific aspect
gameDebugger.checkNetworkConnectivity();
gameDebugger.checkMixedContent();
gameDebugger.checkPerformanceMetrics();
gameDebugger.checkMemoryStatus();
```

---

## Problem: Game Won't Load

### Symptom
Game loads infinitely, shows blank screen, or error message appears.

### Root Causes & Solutions

#### 1. HTTP vs HTTPS Mismatch
**Error Message:** "This page has insecure content" or mixed content warning

**Why:** Your site uses HTTPS but game URL is HTTP

**Fix:**
```javascript
// In gameSourceConnector.js validate() method or in game launch:
let gameUrl = 'http://example.com/game.html';
gameUrl = gameUrl.replace('http://', 'https://');
```

**Prevention:** All game URLs should be validated:
```javascript
function isValidGameUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}
```

#### 2. CORS (Cross-Origin) Blocking
**Error Message:** "Access to XMLHttpRequest blocked by CORS policy"

**Why:** Game server doesn't allow requests from your domain

**Check:**
```javascript
// Browser Console → Network tab
// Look for failed requests with CORS error
// Red X on network requests means CORS blocked
```

**Solution Options:**
```javascript
// Option A: Use CORS proxy
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const gameUrl = proxyUrl + 'http://game-server.com/game.html';

// Option B: Check Access-Control-Allow-Origin header
// Ask game provider to enable CORS for your domain

// Option C: Host game locally if open source
```

#### 3. Timeout
**Error Message:** "Game load timeout (30000ms)"

**Why:** Game server is slow or unreachable

**Diagnosis:**
```javascript
// In Network tab (F12), check response times
// If > 30 seconds, game is too slow
// If connection refused, server is down
```

**Solutions:**
```javascript
// Increase timeout in responsiveGameFrame.js:
this.loadTimeout = 60000; // 60 seconds instead of 30

// Or check server status
fetch(gameUrl, { mode: 'no-cors' })
    .then(r => console.log('Server responsive'))
    .catch(e => console.log('Server down:', e));
```

#### 4. Canvas Not Rendering
**Symptom:** Black screen, no game content visible

**Diagnosis:**
```javascript
// Check if canvas exists
const canvas = document.querySelector('canvas');
console.log(canvas ? 'Canvas found' : 'No canvas');

// Check canvas size
if (canvas) {
    console.log(`Display: ${canvas.clientWidth}x${canvas.clientHeight}`);
    console.log(`Canvas: ${canvas.width}x${canvas.height}`);
    console.log(`Context: ${canvas.getContext('2d') ? 'OK' : 'Failed'}`);
}
```

**Solution - Canvas Scaling Issue:**
```javascript
// In game frame CSS, ensure container matches canvas aspect ratio:
.game-frame-container {
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

// For different aspect ratios:
// 4:3 = padding-bottom: 75%
// Square = padding-bottom: 100%
```

---

## Problem: Memory Leak / Site Slows Down

### Symptom
Site gets slower after playing multiple games; memory usage increases; browser becomes unresponsive.

### Diagnosis

```javascript
// Open Chrome DevTools → Performance → Memory
// Take heap snapshot before playing games
// Play game, switch games multiple times
// Take another heap snapshot
// Compare: should be similar

// Or use this code:
if (performance.memory) {
    const initial = performance.memory.usedJSHeapSize;
    
    // Play games...
    
    const final = performance.memory.usedJSHeapSize;
    const increase = (final - initial) / 1024 / 1024;
    console.log(`Memory increase: ${increase.toFixed(2)}MB`);
}
```

### Common Causes

#### 1. Iframes Not Cleaned Up
```javascript
// Problem: Old code doesn't destroy iframes
function playGame(game) {
    // Old iframe still in memory
    const iframe = createIframe(game);
    document.body.appendChild(iframe);
    // Never cleaned up!
}

// Fixed: Use ResponsiveGameFrame
function playGame(game) {
    const frame = new ResponsiveGameFrame(game);
    const container = frame.createFrameContainer();
    document.body.appendChild(container);
    
    // On switch/close:
    frame.destroy(); // Properly cleans up
}
```

#### 2. Event Listeners Not Removed
```javascript
// Problem: Multiple listeners accumulate
for (let i = 0; i < 10; i++) {
    element.addEventListener('click', handler); // Added 10 times!
}

// Fixed: Check before adding
if (!element._hasListener) {
    element.addEventListener('click', handler);
    element._hasListener = true;
}

// Or remove old listeners
element.removeEventListener('click', oldHandler);
element.addEventListener('click', newHandler);
```

#### 3. Timers/Intervals Not Cleared
```javascript
// Problem: Timers keep running
const interval = setInterval(() => {
    console.log('Still running even after game closed');
}, 1000);

// Fixed: Store and clear
class GameFrame {
    constructor() {
        this.timers = [];
    }
    
    startMonitoring() {
        const interval = setInterval(() => {
            // ...
        }, 1000);
        this.timers.push(interval);
    }
    
    destroy() {
        this.timers.forEach(t => clearInterval(t));
    }
}
```

---

## Problem: Game Crashes / Unresponsive

### Symptom
Game starts but then becomes unresponsive; browser tab crashes; "Page Unresponsive" dialog.

### Diagnosis

```javascript
// Check browser console for errors (F12 → Console)
// Look for red error messages like:
// - "Uncaught TypeError: ..."
// - "Uncaught ReferenceError: ..."
// - "Maximum call stack size exceeded"

// Check memory
if (performance.memory) {
    const percent = (performance.memory.usedJSHeapSize / 
                     performance.memory.jsHeapSizeLimit * 100).toFixed(0);
    console.log(`Memory usage: ${percent}%`);
    if (percent > 90) console.warn('Nearly out of memory!');
}
```

### Solutions

#### 1. Infinite Loop Detection
```javascript
// Wrap game in try-catch to detect
try {
    // Game code
    while (someCondition) { 
        // If condition is always true, infinite loop
    }
} catch (error) {
    console.error('Game error:', error);
    // Show user-friendly message
}
```

#### 2. Sandbox Restrictions
```javascript
// Some browsers limit iframe capabilities
// Make sure sandbox allows necessary permissions:
iframe.setAttribute('sandbox',
    'allow-scripts ' +           // Game needs to run JS
    'allow-same-origin ' +       // Access same-origin resources
    'allow-forms ' +             // Can submit forms
    'allow-popups'               // Can open new windows
);

// But DON'T allow:
// 'allow-top-navigation'        // Can't navigate parent
// 'allow-pointer-lock'          // Disable mouse lock
```

#### 3. WebGL Issues
```javascript
// Check WebGL support
const canvas = document.createElement('canvas');
const webgl = canvas.getContext('webgl') || 
              canvas.getContext('webgl2');

if (!webgl) {
    console.warn('WebGL not supported - game may not render');
    // Show warning to user
}

// If game uses WebGL but it's disabled:
// User may need to enable in browser settings
// Chrome: Settings → Advanced → System → Hardware acceleration
```

---

## Problem: Network Issues

### Symptom
"Connection failed", "Network error", inconsistent failures.

### Diagnosis

```javascript
// Check network status
console.log(navigator.onLine ? 'Online' : 'Offline');

// Check connection speed
if (navigator.connection) {
    console.log('Type:', navigator.connection.effectiveType); // 4g, 3g, 2g
    console.log('Downlink:', navigator.connection.downlink); // Mbps
    console.log('RTT:', navigator.connection.rtt); // Milliseconds
}

// Check specific domain
fetch('https://api.gamezop.com/status')
    .then(r => r.ok ? 'Online' : 'Error: ' + r.status)
    .catch(e => 'Offline: ' + e.message)
    .then(console.log);
```

### Solutions

#### 1. Temporary Network Outage
```javascript
// Implement retry with exponential backoff
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetch(url);
        } catch (error) {
            if (i < retries - 1) {
                const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s...
                await new Promise(r => setTimeout(r, delay));
            } else {
                throw error;
            }
        }
    }
}
```

#### 2. Poor Connection Speed
```javascript
// Detect slow connections
if (navigator.connection?.effectiveType === '2g' || 
    navigator.connection?.effectiveType === '3g') {
    console.warn('Slow connection detected');
    // Show user message
    // Increase timeout
    // Reduce quality
}
```

---

## Problem: Performance Issues

### Symptom
Games lag, animations stutter, controls feel unresponsive.

### Diagnosis

```javascript
// Check performance metrics
const perfEntries = performance.getEntriesByType('navigation')[0];
console.log({
    loadTime: perfEntries.loadEventEnd - perfEntries.loadEventStart,
    domReady: perfEntries.domContentLoadedEventEnd - perfEntries.domContentLoadedEventStart,
    firstPaint: performance.getEntriesByType('paint')[0]?.startTime
});

// Check frame rate
let frameCount = 0;
function checkFrameRate() {
    frameCount++;
    if (frameCount % 60 === 0) {
        console.log(`Frame rate: ~${frameCount/60} FPS`);
        frameCount = 0;
    }
    requestAnimationFrame(checkFrameRate);
}
```

### Solutions

#### 1. Too Many Iframes
```javascript
// Limit number of concurrent games
const MAX_CONCURRENT = 3;
const activeGames = new Map();

function playGame(gameId, gameUrl) {
    if (activeGames.size >= MAX_CONCURRENT) {
        const first = activeGames.entries().next();
        closeGame(first.value[0]);
    }
    // Then play new game
}
```

#### 2. CPU Intensive Games
```javascript
// Detect high CPU usage
if (performance.now() - lastFrameTime > 50) { // >50ms per frame
    console.warn('Frame rate dropping - possible CPU overload');
    // Reduce quality or close other games
}
```

#### 3. Unoptimized CSS
```javascript
// Check for expensive CSS operations
// Avoid:
// - Multiple transforms/transitions
// - Box-shadow on animated elements
// - Large filter effects

// Better approach:
.game-frame {
    /* Use GPU acceleration */
    transform: translateZ(0);
    will-change: transform;
}
```

---

## Problem: Video/Audio Not Working

### Symptom
Game plays but no sound; video doesn't load; stuttering audio.

### Diagnosis

```javascript
// Check audio context
if (window.AudioContext || window.webkitAudioContext) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log('Audio Context state:', audioCtx.state);
    // Should be: running, suspended, closed
}

// Check media permissions
if (navigator.permissions) {
    navigator.permissions.query({ name: 'microphone' })
        .then(result => console.log('Microphone:', result.state));
}
```

### Solutions

#### 1. Autoplay Blocked
**Problem:** Browsers now block autoplay audio/video

```javascript
// Solution: User gesture required
button.addEventListener('click', () => {
    // Now audio/video can autoplay
    game.start();
});

// Or add to iframe sandbox:
// 'allow-autoplay' (not standard but helps)
```

#### 2. Media Permissions
```javascript
// Check if user granted permission
if (Notification.permission === 'denied') {
    console.log('Microphone access denied');
}

// Request permission
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        console.log('Microphone access granted');
        stream.getTracks().forEach(t => t.stop());
    })
    .catch(e => console.log('Microphone access denied:', e));
```

---

## Testing Checklist

Before launching, verify:

- [ ] [ ] All games load under 5 seconds
- [ ] [ ] No memory leaks after 10 games played
- [ ] [ ] Responsive on mobile (test at 375px)
- [ ] [ ] Console has no red errors
- [ ] [ ] All sandbox attributes set
- [ ] [ ] HTTPS URLs only
- [ ] [ ] CORS headers verified
- [ ] [ ] Canvas scaling correct
- [ ] [ ] Audio/video working
- [ ] [ ] Offline fallback working

---

## Getting Help

1. **Run Diagnostics:** `await gameDebugger.runDiagnostics()`
2. **Check Console:** F12 → Console tab for errors
3. **Export Report:** `gameDebugger.exportReport()`
4. **Test Locally:** `npm run dev` then open browser console
5. **Run Tests:** `npm test` for automated verification

---

**Last Updated:** January 21, 2026
**Compatibility:** All modern browsers (Chrome, Firefox, Safari, Edge)
