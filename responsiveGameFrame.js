/**
 * Responsive Game Frame System - 2026 Standard
 * Handles embedding games with proper container scaling,
 * sandbox attributes, and responsive design
 */

class ResponsiveGameFrame {
    constructor(gameData) {
        this.game = gameData;
        this.frameContainer = null;
        this.iframe = null;
        this.isLoaded = false;
        this.loadTimeout = 30000; // 30 seconds
        this.memoryMonitor = null;
    }

    /**
     * Create responsive iframe container with best practices
     */
    createFrameContainer() {
        const container = document.createElement('div');
        container.className = 'game-frame-wrapper';
        container.setAttribute('data-game', this.game.title);
        
        // Responsive container with aspect ratio preservation
        const outerContainer = document.createElement('div');
        outerContainer.className = 'game-frame-container';
        outerContainer.style.cssText = `
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            border-radius: 8px;
            background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
        `;

        // Create iframe with security attributes
        const iframe = document.createElement('iframe');
        iframe.src = this.game.embedUrl;
        iframe.className = 'game-iframe';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        
        // Security sandbox attributes - 2026 standard
        iframe.setAttribute('sandbox', 
            'allow-scripts ' +
            'allow-same-origin ' +
            'allow-forms ' +
            'allow-popups ' +
            'allow-presentation ' +
            'allow-fullscreen'
        );
        
        // Referrer policy for privacy
        iframe.setAttribute('referrerpolicy', 'no-referrer');
        
        // Permissions policy (Permissions-Policy header)
        iframe.setAttribute('permissions', 'camera=(),microphone=()');

        iframe.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 8px;
        `;

        outerContainer.appendChild(iframe);
        container.appendChild(outerContainer);

        // Add loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'game-loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Loading ${this.game.title}...</p>
        `;
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(15, 52, 96, 0.95);
            color: #00d4ff;
            font-family: 'Space Mono', monospace;
            z-index: 10;
            border-radius: 8px;
        `;
        container.appendChild(loadingIndicator);

        // Add error display
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'game-error-display';
        errorDisplay.style.cssText = `
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 100, 100, 0.1);
            color: #ff6464;
            border: 2px solid #ff6464;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Space Mono', monospace;
            overflow-y: auto;
            z-index: 11;
        `;
        container.appendChild(errorDisplay);

        this.frameContainer = container;
        this.iframe = iframe;
        this.loadingIndicator = loadingIndicator;
        this.errorDisplay = errorDisplay;

        this.attachEventListeners();
        this.setupLoadingTimeout();

        return container;
    }

    /**
     * Attach event listeners for monitoring
     */
    attachEventListeners() {
        // On load success
        this.iframe.addEventListener('load', () => {
            this.isLoaded = true;
            this.onLoadSuccess();
            console.log(`[GameFrame] "${this.game.title}" loaded successfully`);
        });

        // Handle errors
        this.iframe.addEventListener('error', (e) => {
            this.onLoadError(`Failed to load game: ${e.message || 'Unknown error'}`);
            console.error(`[GameFrame] Error loading "${this.game.title}":`, e);
        });

        // Monitor for content security policy violations
        window.addEventListener('securitypolicyviolation', (e) => {
            console.warn(`[CSP Violation] ${e.blockedURI}`, e);
        });

        // Detect if game redirects away
        try {
            this.iframe.contentWindow?.addEventListener('unload', () => {
                console.warn(`[GameFrame] Game attempting to unload or redirect`);
            });
        } catch (e) {
            // Cross-origin - expected, cannot monitor
        }
    }

    /**
     * Setup loading timeout
     */
    setupLoadingTimeout() {
        this.timeoutHandle = setTimeout(() => {
            if (!this.isLoaded) {
                this.onLoadError(
                    `Game load timeout (${this.loadTimeout}ms). ` +
                    `The game server may be unavailable or blocked. ` +
                    `Check browser console (F12) for CORS or content issues.`
                );
            }
        }, this.loadTimeout);
    }

    /**
     * Handle successful load
     */
    onLoadSuccess() {
        clearTimeout(this.timeoutHandle);
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
        if (this.errorDisplay) {
            this.errorDisplay.style.display = 'none';
        }

        // Start memory monitoring for long play sessions
        this.startMemoryMonitoring();

        // Update UI
        if (this.frameContainer) {
            this.frameContainer.classList.add('loaded');
        }
    }

    /**
     * Handle load errors
     */
    onLoadError(message) {
        clearTimeout(this.timeoutHandle);
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }

        const errorHTML = `
            <div style="padding: 20px;">
                <h3 style="margin-top: 0; color: #ff6464;">⚠️ Game Load Error</h3>
                <p><strong>Game:</strong> ${this.game.title}</p>
                <p><strong>Source:</strong> ${this.game.source}</p>
                <p><strong>Error:</strong> ${message}</p>
                <hr style="border-color: #ff6464; opacity: 0.3;">
                <h4>Troubleshooting Steps:</h4>
                <ul style="font-size: 12px; line-height: 1.6;">
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page (F5)</li>
                    <li>Clear browser cache (Ctrl+Shift+Delete)</li>
                    <li>Disable browser extensions</li>
                    <li>Try a different browser</li>
                    <li>Check console (F12 → Console tab) for detailed errors</li>
                    <li>If HTTPS error: Game source must use HTTPS</li>
                    <li>If CORS error: Game's server blocks cross-origin requests</li>
                </ul>
                <button onclick="location.reload()" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #00d4ff;
                    color: #1a1a2e;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-family: 'Space Mono', monospace;
                ">Retry Loading</button>
            </div>
        `;

        if (this.errorDisplay) {
            this.errorDisplay.innerHTML = errorHTML;
            this.errorDisplay.style.display = 'block';
        }

        if (this.frameContainer) {
            this.frameContainer.classList.add('error');
        }
    }

    /**
     * Start monitoring memory usage during gameplay
     */
    startMemoryMonitoring() {
        if (!performance.memory) {
            console.log('[Memory] performance.memory not available in this browser');
            return;
        }

        const initialMemory = performance.memory.usedJSHeapSize;
        const warningThreshold = 100 * 1024 * 1024; // 100MB

        this.memoryMonitor = setInterval(() => {
            const currentMemory = performance.memory.usedJSHeapSize;
            const memoryUsed = (currentMemory - initialMemory) / 1024 / 1024;

            if (memoryUsed > warningThreshold / 1024 / 1024) {
                console.warn(
                    `[Memory] Game heap usage increased by ${memoryUsed.toFixed(2)}MB ` +
                    `(potential memory leak)`
                );
            }

            console.debug(
                `[Memory] Current: ${(currentMemory / 1024 / 1024).toFixed(1)}MB | ` +
                `Delta: ${memoryUsed.toFixed(2)}MB`
            );
        }, 5000); // Check every 5 seconds
    }

    /**
     * Stop monitoring and cleanup
     */
    destroy() {
        clearTimeout(this.timeoutHandle);
        if (this.memoryMonitor) {
            clearInterval(this.memoryMonitor);
        }

        if (this.iframe) {
            this.iframe.src = 'about:blank'; // Clean up iframe
        }

        if (this.frameContainer) {
            this.frameContainer.remove();
        }

        console.log(`[GameFrame] Cleaned up "${this.game.title}"`);
    }

    /**
     * Get iframe element
     */
    getIframe() {
        return this.iframe;
    }

    /**
     * Check if game is loaded
     */
    isGameLoaded() {
        return this.isLoaded;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveGameFrame;
}
