/**
 * Debugging & Troubleshooting Tools - 2026 Standard
 * Comprehensive diagnostics for game loading issues
 */

class GameDebugger {
    constructor() {
        this.diagnosticResults = [];
        this.networkLog = [];
        this.performanceMetrics = [];
        this.enabled = true;
    }

    /**
     * Run comprehensive diagnostics
     */
    async runDiagnostics() {
        console.log(
            '%c🔍 GAMEFREE DIAGNOSTICS STARTED',
            'color: #00d4ff; font-size: 16px; font-weight: bold; background: #1a1a2e; padding: 10px;'
        );

        const results = {};

        // 1. Browser compatibility check
        results.browser = this.checkBrowserCompatibility();

        // 2. Network connectivity
        results.network = await this.checkNetworkConnectivity();

        // 3. HTTPS validation
        results.https = this.checkHTTPSConfiguration();

        // 4. CORS configuration
        results.cors = await this.checkCORSConfiguration();

        // 5. Mixed content detection
        results.mixedContent = this.checkMixedContent();

        // 6. JavaScript errors
        results.jsErrors = this.checkJSErrors();

        // 7. LocalStorage availability
        results.storage = this.checkStorageAvailability();

        // 8. Performance metrics
        results.performance = this.checkPerformanceMetrics();

        // 9. Memory status
        results.memory = this.checkMemoryStatus();

        // 10. Canvas scaling
        results.canvas = this.checkCanvasScaling();

        // Display results
        this.displayResults(results);
        this.diagnosticResults.push({
            timestamp: new Date().toISOString(),
            results
        });

        return results;
    }

    /**
     * Check browser compatibility
     */
    checkBrowserCompatibility() {
        const ua = navigator.userAgent;
        const browser = this.detectBrowser(ua);
        
        const requirements = {
            iframeSupport: typeof HTMLIFrameElement !== 'undefined',
            fetchAPI: typeof fetch !== 'undefined',
            webGL: !!document.createElement('canvas').getContext('webgl'),
            localStorage: typeof Storage !== 'undefined',
            serviceWorker: 'serviceWorker' in navigator,
            webWorker: typeof Worker !== 'undefined',
            indexedDB: !!window.indexedDB
        };

        return {
            browser: browser.name,
            version: browser.version,
            os: this.detectOS(ua),
            requirements,
            score: Object.values(requirements).filter(v => v).length + '/8'
        };
    }

    /**
     * Detect browser from user agent
     */
    detectBrowser(ua) {
        let browserName, browserVersion;

        if (ua.indexOf('Firefox') > -1) {
            browserName = 'Firefox';
            browserVersion = ua.split('Firefox/')[1];
        } else if (ua.indexOf('Chrome') > -1) {
            browserName = 'Chrome';
            browserVersion = ua.split('Chrome/')[1]?.split(' ')[0];
        } else if (ua.indexOf('Safari') > -1) {
            browserName = 'Safari';
            browserVersion = ua.split('Version/')[1]?.split(' ')[0];
        } else if (ua.indexOf('Edg') > -1) {
            browserName = 'Edge';
            browserVersion = ua.split('Edg/')[1];
        } else {
            browserName = 'Unknown';
            browserVersion = 'N/A';
        }

        return { name: browserName, version: browserVersion };
    }

    /**
     * Detect operating system
     */
    detectOS(ua) {
        if (ua.indexOf('Win') > -1) return 'Windows';
        if (ua.indexOf('Mac') > -1) return 'macOS';
        if (ua.indexOf('Linux') > -1) return 'Linux';
        if (ua.indexOf('X11') > -1) return 'Linux';
        if (ua.indexOf('Android') > -1) return 'Android';
        if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
        return 'Unknown';
    }

    /**
     * Check network connectivity
     */
    async checkNetworkConnectivity() {
        try {
            const start = performance.now();
            const response = await Promise.race([
                fetch('https://www.google.com/favicon.ico', { method: 'HEAD' }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                )
            ]);
            const latency = Math.round(performance.now() - start);

            return {
                status: 'Online',
                latency: latency + 'ms',
                bandwidth: navigator.connection?.downlink || 'Unknown'
            };
        } catch (error) {
            return {
                status: 'Offline',
                latency: 'N/A',
                error: error.message
            };
        }
    }

    /**
     * Check HTTPS configuration
     */
    checkHTTPSConfiguration() {
        const siteSecure = window.location.protocol === 'https:';
        const secureCookies = document.cookie.split(';')
            .filter(c => c.toLowerCase().includes('secure'))
            .length > 0;

        return {
            siteSecurity: siteSecure ? 'HTTPS ✓' : 'HTTP ⚠️',
            secureCookies: secureCookies ? 'Yes' : 'No',
            recommendation: siteSecure ? 'Good' : 'Consider using HTTPS for production'
        };
    }

    /**
     * Check CORS configuration
     */
    async checkCORSConfiguration() {
        const testURLs = [
            'https://api.gamezop.com',
            'https://itch.io',
            'https://www.construct.net'
        ];

        const corsResults = {};
        for (const url of testURLs) {
            try {
                const response = await fetch(url, { 
                    method: 'HEAD',
                    mode: 'cors',
                    timeout: 3000
                });
                corsResults[url] = {
                    status: response.ok ? 'OK' : response.status,
                    corsHeaders: response.headers.get('Access-Control-Allow-Origin') || 'Not set'
                };
            } catch (error) {
                corsResults[url] = {
                    status: 'Failed',
                    error: error.message
                };
            }
        }

        return corsResults;
    }

    /**
     * Check for mixed content
     */
    checkMixedContent() {
        const iframes = document.querySelectorAll('iframe');
        const mixedContent = [];

        iframes.forEach(iframe => {
            if (window.location.protocol === 'https:' && 
                iframe.src && iframe.src.startsWith('http://')) {
                mixedContent.push({
                    src: iframe.src,
                    issue: 'HTTPS site loading HTTP iframe'
                });
            }
        });

        return {
            iframesFound: iframes.length,
            mixedContentIssues: mixedContent.length,
            issues: mixedContent,
            recommendation: mixedContent.length > 0 ? 
                'Convert HTTP URLs to HTTPS' : 
                'No mixed content issues detected'
        };
    }

    /**
     * Check for JavaScript errors
     */
    checkJSErrors() {
        const errors = window.__DEBUG_ERRORS__ || [];
        
        // Capture future errors
        window.__DEBUG_ERRORS__ = [];
        window.addEventListener('error', (e) => {
            window.__DEBUG_ERRORS__.push({
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                timestamp: new Date().toISOString()
            });
        });

        return {
            previousErrors: errors.length,
            tracking: 'Active',
            errors: errors.slice(-10) // Last 10
        };
    }

    /**
     * Check storage availability
     */
    checkStorageAvailability() {
        const checks = {};

        // LocalStorage
        try {
            localStorage.setItem('__test__', 'test');
            localStorage.removeItem('__test__');
            checks.localStorage = 'Available';
        } catch {
            checks.localStorage = 'Not available (quota exceeded or disabled)';
        }

        // SessionStorage
        try {
            sessionStorage.setItem('__test__', 'test');
            sessionStorage.removeItem('__test__');
            checks.sessionStorage = 'Available';
        } catch {
            checks.sessionStorage = 'Not available';
        }

        // IndexedDB
        checks.indexedDB = window.indexedDB ? 'Available' : 'Not available';

        // Cookies
        checks.cookies = navigator.cookieEnabled ? 'Enabled' : 'Disabled';

        return checks;
    }

    /**
     * Check performance metrics
     */
    checkPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const metrics = {
            domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
            loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
            firstContentfulPaint: null,
            largestContentfulPaint: null
        };

        // Get Web Vitals if available
        performance.getEntriesByType('paint').forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
                metrics.firstContentfulPaint = Math.round(entry.startTime);
            }
        });

        return metrics;
    }

    /**
     * Check memory status
     */
    checkMemoryStatus() {
        if (!performance.memory) {
            return { status: 'Not available in this browser' };
        }

        const memory = performance.memory;
        const used = memory.usedJSHeapSize / 1024 / 1024;
        const limit = memory.jsHeapSizeLimit / 1024 / 1024;
        const percentage = ((used / limit) * 100).toFixed(1);

        return {
            usedMB: used.toFixed(1),
            limitMB: limit.toFixed(1),
            percentage: percentage + '%',
            status: percentage > 80 ? '⚠️ High memory usage' : '✓ Normal'
        };
    }

    /**
     * Check canvas scaling
     */
    checkCanvasScaling() {
        const canvases = document.querySelectorAll('canvas');
        const scalingIssues = [];

        canvases.forEach((canvas, idx) => {
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            if (displayWidth !== canvasWidth || displayHeight !== canvasHeight) {
                scalingIssues.push({
                    index: idx,
                    displaySize: `${displayWidth}x${displayHeight}`,
                    canvasSize: `${canvasWidth}x${canvasHeight}`,
                    issue: 'Canvas size mismatch (may appear blurry)'
                });
            }
        });

        return {
            canvasesFound: canvases.length,
            scalingIssues: scalingIssues.length,
            issues: scalingIssues,
            recommendation: scalingIssues.length > 0 ?
                'Canvas display size should match canvas width/height' :
                'All canvases properly scaled'
        };
    }

    /**
     * Display results in console
     */
    displayResults(results) {
        console.group('%c📊 DIAGNOSTIC RESULTS', 
            'color: #00d4ff; font-size: 14px; font-weight: bold;');

        Object.entries(results).forEach(([category, data]) => {
            console.group(`%c${category.toUpperCase()}`, 
                'color: #00d4ff; font-weight: bold;');
            console.table(data);
            console.groupEnd();
        });

        console.groupEnd();
        console.log(
            '%c✅ DIAGNOSTICS COMPLETE',
            'color: #00d4ff; font-size: 14px; font-weight: bold; background: #1a1a2e; padding: 10px;'
        );
    }

    /**
     * Export diagnostic report
     */
    exportReport(filename = 'gamefree-diagnostic-report.json') {
        const report = {
            generated: new Date().toISOString(),
            url: window.location.href,
            results: this.diagnosticResults
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        console.log(`[Export] Diagnostic report saved as ${filename}`);
    }
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gameDebugger = new GameDebugger();
        console.log(
            '%cGamefree Debugger Ready. Run: gameDebugger.runDiagnostics()',
            'color: #00d4ff; font-weight: bold;'
        );
    });
} else {
    window.gameDebugger = new GameDebugger();
    console.log(
        '%cGamefree Debugger Ready. Run: gameDebugger.runDiagnostics()',
        'color: #00d4ff; font-weight: bold;'
    );
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameDebugger;
}
