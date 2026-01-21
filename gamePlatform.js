/**
 * Integration Example - Complete Game Loading System
 * Shows how to use all 2026 components together
 * 
 * This demonstrates:
 * 1. Game source connector
 * 2. Responsive frame creation
 * 3. Error handling with debugging
 * 4. Performance monitoring
 * 5. Memory management
 */

class GamePlatform {
    constructor() {
        this.gameConnector = new GameSourceConnector();
        this.currentGame = null;
        this.gameHistory = [];
        this.debugger = window.gameDebugger;
        this.maxConcurrentGames = 3;
        this.activeGames = new Map();
    }

    /**
     * Initialize platform
     */
    async initialize() {
        console.log('%c🎮 Initializing Game Platform', 
            'color: #00d4ff; font-size: 16px; font-weight: bold;');

        // Step 1: Run diagnostics
        console.log('[1/4] Running diagnostics...');
        const diagnostics = await this.debugger.runDiagnostics();
        
        if (diagnostics.network.status !== 'Online') {
            console.warn('⚠️ Network offline - using cached games');
        }

        // Step 2: Load game sources
        console.log('[2/4] Loading game sources...');
        const games = await this.loadGames();
        console.log(`✓ Loaded ${games.length} games`);

        // Step 3: Setup event listeners
        console.log('[3/4] Setting up event listeners...');
        this.setupEventListeners();

        // Step 4: Setup memory monitoring
        console.log('[4/4] Setting up monitoring...');
        this.startMemoryMonitoring();

        console.log('%c✅ Platform Ready', 
            'color: #00d4ff; font-size: 16px; font-weight: bold;');
    }

    /**
     * Load games from all sources
     */
    async loadGames(options = {}) {
        try {
            const games = await this.gameConnector.fetchAllGames({
                limit: options.limit || 1000,
                skipCache: options.skipCache || false
            });

            // Sort by quality
            games.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0));

            // Cache in localStorage
            this.cacheGames(games);

            return games;
        } catch (error) {
            console.error('[GamePlatform] Failed to load games:', error);
            
            // Fallback to cached games
            const cached = this.getCachedGames();
            if (cached.length > 0) {
                console.log(`[GamePlatform] Using ${cached.length} cached games`);
                return cached;
            }

            return [];
        }
    }

    /**
     * Cache games to localStorage
     */
    cacheGames(games) {
        try {
            const cache = {
                games: games.slice(0, 500), // Store first 500
                timestamp: Date.now()
            };
            localStorage.setItem('gamefree_cache', JSON.stringify(cache));
            console.log(`[Cache] Saved ${cache.games.length} games`);
        } catch (error) {
            console.warn('[Cache] Failed to save:', error);
        }
    }

    /**
     * Get cached games
     */
    getCachedGames() {
        try {
            const cache = JSON.parse(localStorage.getItem('gamefree_cache') || '{}');
            
            // Check if cache is fresh (< 24 hours)
            const age = Date.now() - cache.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (age < maxAge && cache.games?.length > 0) {
                console.log(`[Cache] Using cached games (age: ${(age / 60000).toFixed(1)}m)`);
                return cache.games;
            }
        } catch (error) {
            console.warn('[Cache] Failed to read:', error);
        }
        return [];
    }

    /**
     * Launch a game
     */
    async launchGame(gameData) {
        console.log(`🚀 Launching: ${gameData.title}`);

        // Check concurrent limit
        if (this.activeGames.size >= this.maxConcurrentGames) {
            console.warn(`⚠️ Max concurrent games (${this.maxConcurrentGames}) reached`);
            const oldest = this.activeGames.entries().next().value;
            this.closeGame(oldest[0]);
        }

        // Validate game
        if (!this.gameConnector.validateGame(gameData)) {
            this.showError(
                `Invalid game data for "${gameData.title}". ` +
                `Missing required fields or invalid URL.`
            );
            return;
        }

        try {
            // Create responsive frame
            const gameFrame = new ResponsiveGameFrame(gameData);
            const container = gameFrame.createFrameContainer();

            // Add to DOM
            const gameContainer = document.getElementById('game-container') || 
                                 this.createGameContainer();
            gameContainer.innerHTML = '';
            gameContainer.appendChild(container);

            // Track active game
            const gameId = `game_${Date.now()}_${Math.random()}`;
            this.activeGames.set(gameId, {
                frame: gameFrame,
                data: gameData,
                startTime: Date.now(),
                container
            });

            // Track in history
            this.gameHistory.push({
                title: gameData.title,
                launchedAt: new Date().toISOString(),
                source: gameData.source
            });

            // Monitor game
            this.monitorGame(gameId);

            console.log(`✅ Game launched: ${gameData.title} (ID: ${gameId})`);

        } catch (error) {
            console.error('[GamePlatform] Launch error:', error);
            this.showError(`Failed to launch game: ${error.message}`);
        }
    }

    /**
     * Monitor active game for issues
     */
    monitorGame(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game) return;

        const monitoring = setInterval(() => {
            const runtime = (Date.now() - game.startTime) / 1000;

            // Check if frame still loaded
            if (!game.frame.isGameLoaded()) {
                console.warn(`[Monitor] Game ${gameId} not loaded after ${runtime}s`);
            }

            // Memory check
            if (performance.memory && runtime > 60) {
                const used = performance.memory.usedJSHeapSize / 1024 / 1024;
                if (used > 200) {
                    console.warn(`[Monitor] High memory usage: ${used.toFixed(0)}MB`);
                }
            }

            // Stop after 1 hour of monitoring
            if (runtime > 3600) {
                clearInterval(monitoring);
            }
        }, 5000); // Check every 5 seconds

        game.monitoringInterval = monitoring;
    }

    /**
     * Close a game
     */
    closeGame(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game) return;

        console.log(`🔌 Closing game: ${game.data.title}`);

        // Stop monitoring
        if (game.monitoringInterval) {
            clearInterval(game.monitoringInterval);
        }

        // Cleanup frame
        game.frame.destroy();

        // Remove from map
        this.activeGames.delete(gameId);

        console.log(`✅ Game closed: ${game.data.title}`);
    }

    /**
     * Close all games
     */
    closeAllGames() {
        console.log('Closing all games...');
        const gameIds = Array.from(this.activeGames.keys());
        gameIds.forEach(id => this.closeGame(id));
        console.log('All games closed');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close games on page unload
        window.addEventListener('beforeunload', () => {
            this.closeAllGames();
        });

        // Monitor visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('[Platform] Page hidden - pausing games');
                // Could pause animations
            } else {
                console.log('[Platform] Page visible - resuming');
                // Could resume
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.closeAllGames();
        });
    }

    /**
     * Start memory monitoring
     */
    startMemoryMonitoring() {
        if (!performance.memory) {
            console.log('[Memory] performance.memory not available');
            return;
        }

        this.memoryInterval = setInterval(() => {
            const memory = performance.memory;
            const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            const limit = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(0);
            const percent = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(0);

            // Alert if memory usage is high
            if (percent > 85) {
                console.warn(
                    `⚠️ High memory: ${used}MB / ${limit}MB (${percent}%)`
                );
            }

            // Debug logging
            console.debug(`[Memory] ${used}MB / ${limit}MB (${percent}%)`);
        }, 10000); // Every 10 seconds
    }

    /**
     * Create game container
     */
    createGameContainer() {
        const container = document.createElement('div');
        container.id = 'game-container';
        container.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
            border-radius: 8px;
            overflow: hidden;
        `;
        document.body.appendChild(container);
        return container;
    }

    /**
     * Show error to user
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div style="
                padding: 20px;
                background: rgba(255, 100, 100, 0.1);
                border: 2px solid #ff6464;
                border-radius: 8px;
                color: #ff6464;
                font-family: 'Space Mono', monospace;
                margin: 20px;
            ">
                <strong>⚠️ Error:</strong> ${message}
                <button onclick="this.parentElement.remove()" style="
                    display: block;
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #ff6464;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Dismiss</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    /**
     * Get platform stats
     */
    getStats() {
        return {
            activeGames: this.activeGames.size,
            totalGamesPlayed: this.gameHistory.length,
            cacheSize: localStorage.getItem('gamefree_cache')?.length || 0,
            memory: performance.memory ? {
                used: `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB`,
                limit: `${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(0)}MB`
            } : null,
            uptime: `${(performance.now() / 1000 / 60).toFixed(1)}m`
        };
    }

    /**
     * Generate report
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.getStats(),
            history: this.gameHistory.slice(-20), // Last 20
            cacheInfo: this.gameConnector.getCacheStats()
        };

        console.table(report);
        return report;
    }
}

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gamePlatform = new GamePlatform();
        window.gamePlatform.initialize().catch(console.error);
    });
} else {
    window.gamePlatform = new GamePlatform();
    window.gamePlatform.initialize().catch(console.error);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamePlatform;
}
