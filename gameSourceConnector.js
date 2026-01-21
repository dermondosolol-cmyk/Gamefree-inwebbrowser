/**
 * Game Source Connector System - 2026 Standard
 * Aggregates games from multiple reputable APIs and sources
 * Handles validation, caching, and fallback mechanisms
 */

class GameSourceConnector {
    constructor() {
        this.sources = {
            gamezop: new GamezopConnector(),
            itchio: new ItchioConnector(),
            construct3: new Construct3Connector(),
            htmlGames: new HTMLGamesConnector(),
            idevgames: new IDevGamesConnector()
        };
        this.cache = new Map();
        this.cacheTimeout = 3600000; // 1 hour
        this.maxRetries = 3;
        this.retryDelay = 1000; // ms
    }

    /**
     * Fetch games from all sources with fallback support
     */
    async fetchAllGames(options = {}) {
        const {
            category = null,
            limit = 100,
            skipCache = false
        } = options;

        // Check cache first
        const cacheKey = `all_games_${category}_${limit}`;
        if (this.cache.has(cacheKey) && !skipCache) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log(`[Cache Hit] Retrieved ${cached.games.length} games from cache`);
                return cached.games;
            }
        }

        const allGames = [];
        const errors = [];

        // Try fetching from each source in parallel
        const sourcePromises = Object.entries(this.sources).map(
            async ([name, connector]) => {
                try {
                    console.log(`[${name}] Fetching games...`);
                    const games = await this.retryFetch(
                        () => connector.fetch(category, limit),
                        name
                    );
                    console.log(`[${name}] Success: Retrieved ${games.length} games`);
                    return { source: name, games, status: 'success' };
                } catch (error) {
                    console.warn(`[${name}] Error: ${error.message}`);
                    errors.push({ source: name, error: error.message });
                    return { source: name, games: [], status: 'failed' };
                }
            }
        );

        const results = await Promise.allSettled(sourcePromises);
        
        results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value.games.length > 0) {
                allGames.push(...result.value.games);
            }
        });

        // Deduplicate games by URL
        const uniqueGames = this.deduplicateGames(allGames);
        
        // Sort by quality score
        uniqueGames.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0));

        // Cache the result
        this.cache.set(cacheKey, {
            games: uniqueGames,
            timestamp: Date.now(),
            sources: errors.length === 0 ? 'all_successful' : 'partial_success',
            errors
        });

        console.log(`[Summary] Total games collected: ${uniqueGames.length}`);
        if (errors.length > 0) {
            console.warn(`[Summary] ${errors.length} sources had errors`, errors);
        }

        return uniqueGames;
    }

    /**
     * Fetch from single source with retry logic
     */
    async retryFetch(fetchFn, sourceName) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await Promise.race([
                    fetchFn(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Fetch timeout')), 10000)
                    )
                ]);
            } catch (error) {
                lastError = error;
                console.warn(
                    `[${sourceName}] Attempt ${attempt}/${this.maxRetries} failed: ${error.message}`
                );
                if (attempt < this.maxRetries) {
                    await new Promise(resolve =>
                        setTimeout(resolve, this.retryDelay * attempt)
                    );
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Remove duplicate games based on URL
     */
    deduplicateGames(games) {
        const seen = new Map();
        const unique = [];

        games.forEach(game => {
            const key = game.embedUrl || game.url;
            if (!seen.has(key)) {
                seen.set(key, true);
                unique.push(game);
            } else {
                console.log(`[Dedup] Removed duplicate: ${game.title}`);
            }
        });

        return unique;
    }

    /**
     * Validate game object before use
     */
    validateGame(game) {
        const required = ['title', 'embedUrl'];
        const missing = required.filter(field => !game[field]);
        
        if (missing.length > 0) {
            console.warn(`[Validation] Game missing fields: ${missing.join(', ')}`, game);
            return false;
        }

        // Validate HTTPS
        if (!game.embedUrl.startsWith('https://')) {
            console.warn(`[Validation] Game URL not HTTPS: ${game.embedUrl}`);
            // Could be converted if http://
            if (game.embedUrl.startsWith('http://')) {
                game.embedUrl = game.embedUrl.replace('http://', 'https://');
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('[Cache] Cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        const stats = {
            size: this.cache.size,
            entries: []
        };

        this.cache.forEach((value, key) => {
            stats.entries.push({
                key,
                gameCount: value.games.length,
                age: Math.round((Date.now() - value.timestamp) / 1000),
                status: value.status
            });
        });

        return stats;
    }
}

/**
 * Gamezop Business Connector
 * Fetches from Gamezop's All Games API
 */
class GamezopConnector {
    async fetch(category = null, limit = 100) {
        const categoryParam = category ? `&category=${category}` : '';
        const url = `https://api.gamezop.com/games?limit=${limit}${categoryParam}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Gamefree-Browser/2026'
                }
            });

            if (!response.ok) {
                throw new Error(`Gamezop API returned ${response.status}`);
            }

            const data = await response.json();
            return data.games.map(game => ({
                title: game.title,
                embedUrl: game.embedUrl || game.url,
                category: game.category || 'Uncategorized',
                thumbnail: game.thumbnail,
                source: 'gamezop',
                qualityScore: 95,
                analytics: true
            }));
        } catch (error) {
            console.error('[Gamezop] Fetch error:', error);
            throw error;
        }
    }
}

/**
 * Itch.io HTML5 Games Connector
 * Searches itch.io for free HTML5 games
 */
class ItchioConnector {
    async fetch(category = null, limit = 100) {
        const categoryParam = category ? `&tag=${category}` : '';
        const url = `https://itch.io/api/1/games/list?limit=${limit}&classification=games&type=html${categoryParam}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Itch.io API returned ${response.status}`);
            }

            const data = await response.json();
            
            return data.games
                .filter(game => game.embed && game.can_be_embedded)
                .map(game => ({
                    title: game.title,
                    embedUrl: game.embed,
                    category: game.tags?.[0] || 'Uncategorized',
                    thumbnail: game.cover_url,
                    description: game.short_description,
                    source: 'itchio',
                    qualityScore: 85,
                    openSource: game.published
                }));
        } catch (error) {
            console.error('[Itch.io] Fetch error:', error);
            throw error;
        }
    }
}

/**
 * Construct 3 Arcade Connector
 * Fetches from Construct 3 Arcade
 */
class Construct3Connector {
    async fetch(category = null, limit = 100) {
        const url = `https://www.construct.net/en/games/latest?limit=${limit}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Construct 3 returned ${response.status}`);
            }

            const html = await response.text();
            const games = this.parseConstruct3HTML(html, limit);
            
            return games.map(game => ({
                title: game.title,
                embedUrl: game.embedUrl,
                category: 'Construct3',
                thumbnail: game.thumbnail,
                source: 'construct3',
                qualityScore: 90
            }));
        } catch (error) {
            console.error('[Construct3] Fetch error:', error);
            throw error;
        }
    }

    parseConstruct3HTML(html, limit) {
        // Simplified parsing - would need proper DOM parsing in real implementation
        const games = [];
        const gameRegex = /data-game-url="([^"]+)"/g;
        let match;
        let count = 0;

        while ((match = gameRegex.exec(html)) && count < limit) {
            games.push({
                title: `Construct Game ${count + 1}`,
                embedUrl: match[1],
                thumbnail: null
            });
            count++;
        }

        return games;
    }
}

/**
 * HTML Games for Your Site Connector
 * Provides classic games with ready-to-use embed codes
 */
class HTMLGamesConnector {
    async fetch(category = null, limit = 100) {
        const games = [
            {
                title: 'Minesweeper Classic',
                embedUrl: 'https://games.htmlgames.com/minesweeper/index.html',
                category: 'Puzzle',
                source: 'htmlgames',
                qualityScore: 88
            },
            {
                title: 'Mahjong Solitaire',
                embedUrl: 'https://games.htmlgames.com/mahjong/index.html',
                category: 'Strategy',
                source: 'htmlgames',
                qualityScore: 87
            },
            {
                title: 'Solitaire',
                embedUrl: 'https://games.htmlgames.com/solitaire/index.html',
                category: 'Card',
                source: 'htmlgames',
                qualityScore: 86
            },
            {
                title: 'Checkers',
                embedUrl: 'https://games.htmlgames.com/checkers/index.html',
                category: 'Strategy',
                source: 'htmlgames',
                qualityScore: 85
            },
            {
                title: 'Chess',
                embedUrl: 'https://games.htmlgames.com/chess/index.html',
                category: 'Strategy',
                source: 'htmlgames',
                qualityScore: 89
            }
        ];

        return category
            ? games.filter(g => g.category.toLowerCase() === category.toLowerCase()).slice(0, limit)
            : games.slice(0, limit);
    }
}

/**
 * iDev.Games Connector
 * Dedicated portal for free web-based games
 */
class IDevGamesConnector {
    async fetch(category = null, limit = 100) {
        const url = `https://api.idev.games/games?limit=${limit}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`iDev.Games returned ${response.status}`);
            }

            const data = await response.json();
            return data.games.map(game => ({
                title: game.name,
                embedUrl: game.embed_url,
                category: game.category || 'Uncategorized',
                thumbnail: game.thumbnail,
                source: 'idevgames',
                qualityScore: 82
            }));
        } catch (error) {
            console.error('[iDev.Games] Fetch error:', error);
            throw error;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSourceConnector;
}
