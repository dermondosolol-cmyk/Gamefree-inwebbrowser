// Game Manager Application
class GameManager {
    constructor() {
        this.games = this.loadGames();
        this.currentTab = 'featured';
        this.initializeElements();
        this.attachEventListeners();
        this.loadPresetGames();
        this.renderAllTabs();
        this.debugLog('GameManager initialized with', this.games.length, 'games');
    }

    debugLog(...args) {
        // Only log in debug mode
        if (localStorage.getItem('debugMode') === 'true') {
            console.log('[GameManager]', ...args);
        }
    }

    // Preset Games from Free GitHub Repositories & Game Distribution Platforms
    getPresetGames() {
        const allGames = [
            // Puzzle Games
            { id: 'puzzle-1', name: '2048', url: 'https://gabrielecirulli.github.io/2048/', category: 'puzzle', preset: true },
            { id: 'puzzle-2', name: 'Tetris', url: 'https://tetris.com/play-tetris', category: 'puzzle', preset: true },
            { id: 'puzzle-3', name: 'Sudoku', url: 'https://www.sudokuonline.io/', category: 'puzzle', preset: true },
            { id: 'puzzle-4', name: 'Memory Game', url: 'https://www.memozor.com/', category: 'puzzle', preset: true },
            { id: 'puzzle-5', name: 'Block Puzzle', url: 'https://www.silvergames.com/en/block-puzzle', category: 'puzzle', preset: true },
            { id: 'puzzle-6', name: 'Jewels', url: 'https://www.silvergames.com/en/jewels', category: 'puzzle', preset: true },
            { id: 'puzzle-7', name: 'Match 3', url: 'https://www.silvergames.com/en/match-three', category: 'puzzle', preset: true },
            { id: 'puzzle-8', name: 'Bubble Shooter', url: 'https://www.silvergames.com/en/bubble-shooter', category: 'puzzle', preset: true },
            { id: 'puzzle-9', name: 'Sokoban', url: 'https://www.silvergames.com/en/sokoban', category: 'puzzle', preset: true },
            { id: 'puzzle-10', name: 'Mahjong', url: 'https://www.silvergames.com/en/mahjong-connect', category: 'puzzle', preset: true },
            { id: 'puzzle-11', name: 'Wood Blocks', url: 'https://www.silvergames.com/en/wood-blocks-puzzle', category: 'puzzle', preset: true },
            { id: 'puzzle-12', name: 'Pipe Flow', url: 'https://www.silvergames.com/en/pipe-flow-puzzle', category: 'puzzle', preset: true },
            { id: 'puzzle-13', name: 'Slider Puzzle', url: 'https://www.silvergames.com/en/slider-puzzle', category: 'puzzle', preset: true },
            { id: 'puzzle-14', name: 'Word Search', url: 'https://www.wordplays.com/', category: 'puzzle', preset: true },
            { id: 'puzzle-15', name: 'Crossword', url: 'https://www.crosswordunlimited.com/', category: 'puzzle', preset: true },
            { id: 'puzzle-16', name: 'Picross', url: 'https://www.silvergames.com/en/nonogram-picross', category: 'puzzle', preset: true },
            { id: 'puzzle-17', name: 'Tangram', url: 'https://www.silvergames.com/en/tangram', category: 'puzzle', preset: true },
            { id: 'puzzle-18', name: 'Cookie Clicker', url: 'https://cookieclicker.info/', category: 'puzzle', preset: true },

            // Arcade Games
            { id: 'arcade-1', name: 'Flappy Bird', url: 'https://playcanvas.com/project/420957/overview', category: 'arcade', preset: true },
            { id: 'arcade-2', name: 'Snake', url: 'https://patorjk.com/games/snake/', category: 'arcade', preset: true },
            { id: 'arcade-3', name: 'Pac-Man', url: 'https://pacman.googlegames.com/', category: 'arcade', preset: true },
            { id: 'arcade-4', name: 'Space Invaders', url: 'https://playcanvas.com/project/416889/overview', category: 'arcade', preset: true },
            { id: 'arcade-5', name: 'Breakout', url: 'https://www.silvergames.com/en/breakout', category: 'arcade', preset: true },
            { id: 'arcade-6', name: 'Asteroids', url: 'https://www.silvergames.com/en/asteroids', category: 'arcade', preset: true },
            { id: 'arcade-7', name: 'Atari Pong', url: 'https://www.silvergames.com/en/atari-pong', category: 'arcade', preset: true },
            { id: 'arcade-8', name: 'Missile Command', url: 'https://www.silvergames.com/en/missile-command', category: 'arcade', preset: true },
            { id: 'arcade-9', name: 'Galaga', url: 'https://www.silvergames.com/en/galaga', category: 'arcade', preset: true },
            { id: 'arcade-10', name: 'Centipede', url: 'https://www.silvergames.com/en/centipede', category: 'arcade', preset: true },
            { id: 'arcade-11', name: 'Dig Dug', url: 'https://www.silvergames.com/en/dig-dug', category: 'arcade', preset: true },
            { id: 'arcade-12', name: 'Doodle Jump', url: 'https://www.silvergames.com/en/doodle-jump', category: 'arcade', preset: true },
            { id: 'arcade-13', name: 'Helicopter', url: 'https://www.silvergames.com/en/helicopter', category: 'arcade', preset: true },
            { id: 'arcade-14', name: 'Chrome Dinosaur', url: 'https://chromedino.com/', category: 'arcade', preset: true },
            { id: 'arcade-15', name: 'Agar.io', url: 'https://agar.io/', category: 'arcade', preset: true },
            { id: 'arcade-16', name: 'Slither.io', url: 'https://slither.io/', category: 'arcade', preset: true },
            { id: 'arcade-17', name: 'Slope', url: 'https://www.crazygames.com/game/slope', category: 'arcade', preset: true },
            { id: 'arcade-18', name: 'Slope 2', url: 'https://www.crazygames.com/game/slope-2', category: 'arcade', preset: true },
            { id: 'arcade-19', name: 'Slope 3', url: 'https://www.crazygames.com/game/slope-3', category: 'arcade', preset: true },
            { id: 'arcade-20', name: 'Getaway Shootout', url: 'https://www.vipgames.com/games/getaway-shootout', category: 'arcade', preset: true },
            { id: 'arcade-21', name: 'Madalin Stunt Cars', url: 'https://www.crazygames.com/game/madalin-stunt-cars-2', category: 'arcade', preset: true },
            { id: 'arcade-22', name: 'Dung Roller', url: 'https://www.crazygames.com/game/dung-roller', category: 'arcade', preset: true },
            { id: 'arcade-23', name: 'Skibidi Toilet', url: 'https://www.crazygames.com/game/skibidi-toilet-incremental', category: 'arcade', preset: true },
            { id: 'arcade-24', name: 'Bounce', url: 'https://www.silvergames.com/en/bounce', category: 'arcade', preset: true },
            { id: 'arcade-25', name: 'Run Runner', url: 'https://www.htmlgames.com/game/run-runner', category: 'arcade', preset: true },
            { id: 'arcade-26', name: 'Clicker Heroes', url: 'https://www.clickerheroes.com/', category: 'arcade', preset: true },
            { id: 'arcade-27', name: 'Idle Empire', url: 'https://www.silvergames.com/en/idle-empire', category: 'arcade', preset: true },
            { id: 'arcade-28', name: 'Incremental Adventure', url: 'https://www.silvergames.com/en/incremental-game', category: 'arcade', preset: true },

            // Strategy Games
            { id: 'strategy-1', name: 'Chess', url: 'https://www.chess.com/play/online', category: 'strategy', preset: true },
            { id: 'strategy-2', name: 'Checkers', url: 'https://cardgames.io/checkers/', category: 'strategy', preset: true },
            { id: 'strategy-3', name: 'Connect 4', url: 'https://connect4.gamesolver.org/', category: 'strategy', preset: true },
            { id: 'strategy-4', name: 'Risk Game', url: 'https://www.gameserv.com/games/risk/', category: 'strategy', preset: true },
            { id: 'strategy-5', name: 'Go Game', url: 'https://cardgames.io/go/', category: 'strategy', preset: true },
            { id: 'strategy-6', name: 'Reversi', url: 'https://cardgames.io/reversi/', category: 'strategy', preset: true },
            { id: 'strategy-7', name: 'Gomoku', url: 'https://cardgames.io/gomoku/', category: 'strategy', preset: true },
            { id: 'strategy-8', name: 'Battleship', url: 'https://www.silvergames.com/en/battleship', category: 'strategy', preset: true },
            { id: 'strategy-9', name: 'Tower Defense', url: 'https://www.silvergames.com/en/tower-defense', category: 'strategy', preset: true },
            { id: 'strategy-10', name: 'Chess Rush', url: 'https://www.silvergames.com/en/chess-rush', category: 'strategy', preset: true },
            { id: 'strategy-11', name: 'Plants vs Zombies', url: 'https://www.silvergames.com/en/plants-vs-zombies', category: 'strategy', preset: true },
            { id: 'strategy-12', name: 'Age of War', url: 'https://www.vipgames.com/games/age-of-war', category: 'strategy', preset: true },
            { id: 'strategy-13', name: 'Bloons Tower Defense', url: 'https://www.crazygames.com/game/bloons-tower-defense-6', category: 'strategy', preset: true },
            { id: 'strategy-14', name: 'Clash of Armies', url: 'https://www.htmlgames.com/game/clash-of-armies', category: 'strategy', preset: true },

            // Card Games
            { id: 'card-1', name: 'Solitaire', url: 'https://cardgames.io/solitaire/', category: 'arcade', preset: true },
            { id: 'card-2', name: 'Hearts', url: 'https://cardgames.io/hearts/', category: 'arcade', preset: true },
            { id: 'card-3', name: 'Spades', url: 'https://cardgames.io/spades/', category: 'arcade', preset: true },
            { id: 'card-4', name: 'Freecell', url: 'https://cardgames.io/freecell/', category: 'arcade', preset: true },
            { id: 'card-5', name: 'Blackjack', url: 'https://www.silvergames.com/en/blackjack', category: 'arcade', preset: true },
            { id: 'card-6', name: 'Poker', url: 'https://www.silvergames.com/en/poker', category: 'arcade', preset: true },
            { id: 'card-7', name: 'Uno', url: 'https://www.silvergames.com/en/uno-online', category: 'arcade', preset: true },
            { id: 'card-8', name: 'Rummy', url: 'https://cardgames.io/rummy/', category: 'arcade', preset: true },

            // Racing & Action
            { id: 'action-1', name: 'Racing Game', url: 'https://www.silvergames.com/en/moto-x3m', category: 'arcade', preset: true },
            { id: 'action-2', name: 'Bike Race', url: 'https://www.silvergames.com/en/bike-race', category: 'arcade', preset: true },
            { id: 'action-3', name: 'Car Parking', url: 'https://www.silvergames.com/en/car-parking-multiplayer', category: 'arcade', preset: true },
            { id: 'action-4', name: 'Traffic Racer', url: 'https://www.silvergames.com/en/traffic-racer', category: 'arcade', preset: true },
            { id: 'action-5', name: 'Stunt Plane', url: 'https://www.silvergames.com/en/stunt-plane', category: 'arcade', preset: true },
            { id: 'action-6', name: 'Car Rush', url: 'https://www.vipgames.com/games/car-rush', category: 'arcade', preset: true },
            { id: 'action-7', name: 'Hill Climb Racing', url: 'https://www.htmlgames.com/game/hill-climb-racing', category: 'arcade', preset: true },
            { id: 'action-8', name: 'Parking Fury', url: 'https://www.silvergames.com/en/parking-fury-3d', category: 'arcade', preset: true },
            { id: 'action-9', name: 'Subway Surfers', url: 'https://www.silvergames.com/en/subway-surfers', category: 'arcade', preset: true },
            { id: 'action-10', name: 'Temple Run', url: 'https://www.silvergames.com/en/temple-run', category: 'arcade', preset: true },

            // Shooting Games
            { id: 'shoot-1', name: 'Zombies', url: 'https://www.silvergames.com/en/zombies', category: 'arcade', preset: true },
            { id: 'shoot-2', name: 'Tower Blast', url: 'https://www.silvergames.com/en/tower-blast', category: 'arcade', preset: true },
            { id: 'shoot-3', name: 'Crossy Road', url: 'https://www.silvergames.com/en/crossy-road', category: 'arcade', preset: true },
            { id: 'shoot-4', name: 'Stick Fighter', url: 'https://www.silvergames.com/en/stick-fighter', category: 'arcade', preset: true },
            { id: 'shoot-5', name: 'Combat Recon', url: 'https://www.silvergames.com/en/combat-recon', category: 'arcade', preset: true },
            { id: 'shoot-6', name: 'Gun Master', url: 'https://www.silvergames.com/en/gun-master', category: 'arcade', preset: true },
            { id: 'shoot-7', name: 'Bullet Force', url: 'https://www.crazygames.com/game/bullet-force', category: 'arcade', preset: true },
            { id: 'shoot-8', name: 'Stick Merge', url: 'https://www.silvergames.com/en/stick-merge-battle', category: 'arcade', preset: true },

            // Sports
            { id: 'sport-1', name: 'Basketball', url: 'https://www.silvergames.com/en/basketball-legends-2020', category: 'arcade', preset: true },
            { id: 'sport-2', name: 'Football', url: 'https://www.silvergames.com/en/football-legends', category: 'arcade', preset: true },
            { id: 'sport-3', name: 'Soccer', url: 'https://www.silvergames.com/en/soccer-skills-euro-cup', category: 'arcade', preset: true },
            { id: 'sport-4', name: 'Tennis', url: 'https://www.silvergames.com/en/tennis-masters', category: 'arcade', preset: true },
            { id: 'sport-5', name: 'Golf', url: 'https://www.silvergames.com/en/mini-golf-club', category: 'arcade', preset: true },
            { id: 'sport-6', name: 'Baseball', url: 'https://www.silvergames.com/en/baseball-legends', category: 'arcade', preset: true },
            { id: 'sport-7', name: 'Volleyball', url: 'https://www.silvergames.com/en/volleyball-legends', category: 'arcade', preset: true },
            { id: 'sport-8', name: 'Hockey', url: 'https://www.silvergames.com/en/hockey-masters', category: 'arcade', preset: true },

            // Adventure & Exploration
            { id: 'adv-1', name: 'Fireboy and Watergirl', url: 'https://www.silvergames.com/en/fireboy-and-watergirl-1-forest-temple', category: 'arcade', preset: true },
            { id: 'adv-2', name: 'Fireboy Watergirl 2', url: 'https://www.silvergames.com/en/fireboy-and-watergirl-2-light-temple', category: 'arcade', preset: true },
            { id: 'adv-3', name: 'Fireboy Watergirl 3', url: 'https://www.silvergames.com/en/fireboy-and-watergirl-3-ice-temple', category: 'arcade', preset: true },
            { id: 'adv-4', name: 'Fireboy Watergirl 4', url: 'https://www.silvergames.com/en/fireboy-and-watergirl-4-crystal-temple', category: 'arcade', preset: true },
            { id: 'adv-5', name: 'Among Us', url: 'https://www.crazygames.com/game/among-us-online', category: 'arcade', preset: true },
            { id: 'adv-6', name: 'Fall Guys', url: 'https://www.silvergames.com/en/fall-guys', category: 'arcade', preset: true },

            // Action Platformers
            { id: 'platform-1', name: 'Geometry Dash', url: 'https://www.silvergames.com/en/geometry-dash', category: 'arcade', preset: true },
            { id: 'platform-2', name: 'Jump Quest', url: 'https://www.silvergames.com/en/jump-quest', category: 'arcade', preset: true },
            { id: 'platform-3', name: 'Bouncing Ball', url: 'https://www.silvergames.com/en/bouncing-ball', category: 'arcade', preset: true },
            { id: 'platform-4', name: 'Paper Io', url: 'https://paper-io.com/', category: 'arcade', preset: true },
            { id: 'platform-5', name: 'Stick Hero', url: 'https://www.silvergames.com/en/stick-hero', category: 'arcade', preset: true },
            { id: 'platform-6', name: 'Jumping Shell', url: 'https://www.silvergames.com/en/jumping-shell', category: 'arcade', preset: true },

            // Casual/Educational from CrazyGames & HTMLGames
            { id: 'casual-1', name: 'Sporcle', url: 'https://www.sporcle.com/', category: 'puzzle', preset: true },
            { id: 'casual-2', name: 'Typeracer', url: 'https://play.typeracer.com/', category: 'puzzle', preset: true },
            { id: 'casual-3', name: 'Onet Connect', url: 'https://www.silvergames.com/en/onet-connect-classic', category: 'puzzle', preset: true },
            { id: 'casual-4', name: 'Mahjong Connect', url: 'https://www.silvergames.com/en/mahjong-connect-classic', category: 'puzzle', preset: true },
            { id: 'casual-5', name: 'Candy Crush Type', url: 'https://www.silvergames.com/en/candy-crush-saga', category: 'arcade', preset: true },
            { id: 'casual-6', name: 'Bejeweled', url: 'https://www.silvergames.com/en/bejeweled-classic', category: 'puzzle', preset: true },
            { id: 'casual-7', name: 'Bonbon Quest', url: 'https://www.silvergames.com/en/bonbon-quest', category: 'arcade', preset: true },

            // VIP Games Exclusive
            { id: 'vip-1', name: 'Raft Wars', url: 'https://www.vipgames.com/games/raft-wars', category: 'arcade', preset: true },
            { id: 'vip-2', name: 'Dino Run', url: 'https://www.vipgames.com/games/dino-run', category: 'arcade', preset: true },
            { id: 'vip-3', name: 'Princesses Fashion Wars', url: 'https://www.vipgames.com/games/princesses-fashion-wars', category: 'arcade', preset: true },
            { id: 'vip-4', name: 'Rooftop Snipers', url: 'https://www.vipgames.com/games/rooftop-snipers', category: 'arcade', preset: true },
            { id: 'vip-5', name: 'Subway Runners', url: 'https://www.vipgames.com/games/subway-runners', category: 'arcade', preset: true },

            // 1v1 & Competitive
            { id: 'comp-1', name: '1v1.LOL', url: 'https://www.1v1.lol/', category: 'arcade', preset: true },
            { id: 'comp-2', name: 'Building Blocks', url: 'https://www.silvergames.com/en/building-blocks', category: 'strategy', preset: true },
        ];

        return {
            featured: allGames.slice(0, 3),
            allgames: allGames,
            puzzle: allGames.filter(g => g.category === 'puzzle'),
            arcade: allGames.filter(g => g.category === 'arcade'),
            strategy: allGames.filter(g => g.category === 'strategy'),
        };
    }

    // Load preset games on first visit
    loadPresetGames() {
        const hasPreset = localStorage.getItem('nebula_preset_loaded');
        if (!hasPreset) {
            localStorage.setItem('nebula_preset_loaded', 'true');
        }
    }

    // Initialize DOM Elements
    initializeElements() {
        this.gameUrlInput = document.getElementById('gameUrlInput');
        this.addGameBtn = document.getElementById('addGameBtn');
        this.gamesList = document.getElementById('gamesList');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.gameModal = document.getElementById('gameModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.gameFrame = document.getElementById('gameFrame');
        
        // Tab elements
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
    }

    // Attach Event Listeners
    attachEventListeners() {
        // Add safety checks for all elements
        if (!this.addGameBtn || !this.gameUrlInput || !this.clearAllBtn || !this.refreshBtn || !this.closeModalBtn || !this.gameModal) {
            console.error('GameManager: Required DOM elements not found');
            return;
        }

        this.addGameBtn.addEventListener('click', () => this.addGame());
        this.gameUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addGame();
        });
        this.clearAllBtn.addEventListener('click', () => this.clearAllGames());
        this.refreshBtn.addEventListener('click', () => this.renderAllTabs());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Close modal when clicking outside
        this.gameModal.addEventListener('click', (e) => {
            if (e.target === this.gameModal || e.target.closest('.modal-close')) {
                this.closeModal();
            }
        });
    }

    // Switch Tab
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update active tab button
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update active tab content
        this.tabContents.forEach(content => content.classList.remove('active'));
        const activeContent = document.querySelector(`[data-content="${tabName}"]`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    // Render All Tabs
    renderAllTabs() {
        const preset = this.getPresetGames();
        
        // Render featured games
        this.renderGameList('featuredList', preset.featured);
        
        // Render all games
        this.renderGameList('allGamesList', preset.allgames);
        
        // Render puzzle games
        this.renderGameList('puzzleList', preset.puzzle);
        
        // Render arcade games
        this.renderGameList('arcadeList', preset.arcade);
        
        // Render strategy games
        this.renderGameList('strategyList', preset.strategy);
        
        // Render custom games
        this.renderGames();
    }

    // Render Game List
    renderGameList(elementId, games) {
        const container = document.getElementById(elementId);
        if (!container) {
            console.warn(`Container ${elementId} not found`);
            return;
        }
        
        container.innerHTML = '';

        if (!games || games.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No games in this category yet.</p></div>';
            return;
        }

        games.forEach((game) => {
            const gameCard = this.createGameCard(game);
            if (gameCard) {
                container.appendChild(gameCard);
            }
        });
    }

    // Get game icon based on category
    getGameIcon(category) {
        const icons = {
            'puzzle': '🧩',
            'arcade': '🕹️',
            'strategy': '♟️',
            'custom': '🎮',
            'action': '⚡',
            'shooting': '🎯',
            'sports': '⚽',
            'card': '🃏'
        };
        return icons[category] || '🎮';
    }

    // Get category color
    getCategoryColor(category) {
        const colors = {
            'puzzle': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'arcade': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'strategy': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'custom': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'action': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'shooting': 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
            'sports': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'card': 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
        };
        return colors[category] || 'linear-gradient(135deg, var(--primary), var(--secondary))';
    }

    // Create Game Card
    createGameCard(game) {
        if (!game || !game.name || !game.url) {
            console.warn('Invalid game object', game);
            return null;
        }
        
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        const icon = this.getGameIcon(game.category);
        const gradient = this.getCategoryColor(game.category);
        
        gameCard.innerHTML = `
            <div class="game-thumbnail" style="background: ${gradient};">
                <div class="game-thumbnail-icon">${icon}</div>
            </div>
            <div class="game-name">${this.escapeHtml(game.name)}</div>
            <div class="game-url" title="${this.escapeHtml(game.url)}">${this.escapeHtml(game.url)}</div>
            ${game.addedDate ? `<div style="font-size: 0.75rem; color: var(--text-secondary);">Added: ${game.addedDate}</div>` : ''}
            <div class="game-actions">
                <button class="btn btn-small btn-play" data-id="${game.id}">Play</button>
                ${!game.preset ? `<button class="btn btn-small btn-delete" data-id="${game.id}">Remove</button>` : ''}
            </div>
        `;

        // Play button
        const playBtn = gameCard.querySelector('.btn-play');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playGame(game.url);
            });
        }

        // Delete button (only for custom games)
        const deleteBtn = gameCard.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteGame(game.id);
            });
        }

        return gameCard;
    }

    // Validate URL
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Extract game name from URL
    getGameName(url) {
        try {
            const urlObj = new URL(url);
            let name = urlObj.hostname.replace('www.', '');
            name = name.split('.')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        } catch {
            return 'Unknown Game';
        }
    }

    // Add Game
    addGame() {
        const url = this.gameUrlInput.value.trim();

        if (!url) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showNotification('Please enter a valid URL', 'error');
            return;
        }

        // Check for duplicates
        if (this.games.some(game => game.url === url)) {
            this.showNotification('This game URL is already added!', 'warning');
            return;
        }

        const newGame = {
            id: Date.now(),
            name: this.getGameName(url),
            url: url,
            category: 'custom',
            addedDate: new Date().toLocaleDateString(),
            preset: false
        };

        this.games.push(newGame);
        this.saveGames();
        this.renderGames();
        this.gameUrlInput.value = '';
        this.gameUrlInput.focus();
        this.showNotification('Game added to "My Games" tab!', 'success');
    }

    // Render Custom Games
    renderGames() {
        if (!this.gamesList) {
            console.warn('Games list container not found');
            return;
        }
        
        this.gamesList.innerHTML = '';

        if (!this.games || this.games.length === 0) {
            this.gamesList.innerHTML = '<div class="empty-state"><p>No games added yet. Add a game URL above to get started!</p></div>';
            return;
        }

        this.games.forEach((game) => {
            const gameCard = this.createGameCard(game);
            if (gameCard) {
                this.gamesList.appendChild(gameCard);
            }
        });
    }

    // Play Game
    playGame(url) {
        if (!this.gameFrame || !this.gameModal) {
            console.error('Game modal elements not available');
            return;
        }
        if (!url || typeof url !== 'string' || !this.isValidUrl(url)) {
            console.error('Invalid game URL:', url);
            this.showNotification('Invalid game URL', 'error');
            return;
        }
        this.gameFrame.src = url;
        this.gameModal.classList.add('active');
        this.gameModal.classList.remove('minimized');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }

    // Close Modal
    closeModal() {
        if (!this.gameModal || !this.gameFrame) {
            console.warn('Game modal elements not available');
            return;
        }
        this.gameModal.classList.remove('active');
        this.gameFrame.src = '';
        document.body.style.overflow = 'auto';
    }

    // Delete Game
    deleteGame(id) {
        this.games = this.games.filter(game => game.id !== id);
        this.saveGames();
        this.renderGames();
        this.showNotification('Game removed!', 'info');
    }

    // Clear All Games
    clearAllGames() {
        if (confirm('Are you sure you want to remove all your custom games?')) {
            this.games = [];
            this.saveGames();
            this.renderGames();
            this.showNotification('All custom games cleared!', 'info');
        }
    }

    // Save Games to Local Storage
    saveGames() {
        try {
            localStorage.setItem('nebula_games', JSON.stringify(this.games));
        } catch (e) {
            console.error('Failed to save games to localStorage:', e);
            this.showNotification('Failed to save games', 'error');
        }
    }

    // Load Games from Local Storage
    loadGames() {
        try {
            const saved = localStorage.getItem('nebula_games');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load games from localStorage:', e);
            return [];
        }
    }

    // Show Notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'rgba(0, 102, 255, 0.1)' : type === 'error' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        const borderColor = type === 'success' ? 'rgba(0, 102, 255, 0.3)' : type === 'error' ? 'rgba(255, 71, 87, 0.3)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = type === 'success' ? '#0066ff' : type === 'error' ? '#ff4757' : '#0d0d0d';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${bgColor};
            border: 1px solid ${borderColor};
            color: ${textColor};
            border-radius: 8px;
            z-index: 999;
            animation: slideInDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 300px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            font-family: 'Inter', sans-serif;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInUp 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Virtual PC Class
// Virtual PC Class
class VirtualPC {
    constructor() {
        this.terminal = null;
        this.terminalInput = null;
        this.terminalContent = null;
        this.games = this.getGamesList();
        this.init();
    }

    init() {
        // Get references
        this.desktop = document.querySelector('.virtualpc-desktop');
        this.startBtn = document.getElementById('startBtn');
        this.startMenu = document.getElementById('startMenu');
        this.terminalContent = document.getElementById('terminalContent');
        this.terminalInput = null;

        // Event listeners
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.toggleStartMenu());
        }

        // Window close buttons
        document.querySelectorAll('.window-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeWindow(e));
        });

        // Start menu actions
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleMenuAction(e));
        });

        // Browser load button
        const browserLoadBtn = document.getElementById('browserLoadBtn');
        if (browserLoadBtn) {
            browserLoadBtn.addEventListener('click', () => this.loadBrowserUrl());
        }

        // Virtual search
        const virtualSearch = document.getElementById('virtualSearch');
        if (virtualSearch) {
            virtualSearch.addEventListener('input', (e) => this.searchGames(e.target.value));
        }

        // Search result items click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-result-item')) {
                this.loadSearchResult(e.target);
            }
        });

        // Make windows draggable
        document.querySelectorAll('.desktop-window').forEach(w => this.makeWindowDraggable(w));

        // Start clock
        this.startClock();

        // Initialize terminal
        this.initTerminal();
    }

    getGamesList() {
        // Get games from the global GameManager instance
        if (window.gameManager && window.gameManager.games) {
            return window.gameManager.games;
        }
        // Fallback to empty array if GameManager not yet initialized
        return [];
    }

    toggleStartMenu() {
        if (this.startMenu) {
            this.startMenu.style.display = this.startMenu.style.display === 'none' ? 'block' : 'none';
        }
    }

    handleMenuAction(e) {
        const action = e.target ? e.target.getAttribute('data-action') : null;
        if (!action) return;
        if (this.startMenu) this.startMenu.style.display = 'none';

        switch(action) {
            case 'search':
                this.focusWindow('searchWindow');
                break;
            case 'browser':
                this.focusWindow('browserWindow');
                break;
            case 'terminal':
                this.focusWindow('terminalWindow');
                break;
            default:
                break;
        }
    }

    focusWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        if (windowElement) {
            windowElement.classList.remove('minimized');
            windowElement.style.zIndex = 300;
            
            // Auto-focus search input
            if (windowId === 'searchWindow') {
                const input = document.getElementById('virtualSearch');
                if (input) input.focus();
            }
            
            // Auto-focus URL bar
            if (windowId === 'browserWindow') {
                const input = document.getElementById('browserUrl');
                if (input) input.focus();
            }

            // Auto-focus terminal
            if (windowId === 'terminalWindow') {
                const input = document.getElementById('terminalInput');
                if (input) input.focus();
            }
        }
    }

    searchGames(query) {
        const resultsContainer = document.getElementById('virtualSearchResults');
        if (!resultsContainer) return;

        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Search in all games (from GameManager, with fallback)
        let allGames = [];
        if (window.gameManager && window.gameManager.games) {
            allGames = window.gameManager.games;
        }
        
        if (allGames.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state">No games available. Make sure to load games first.</div>';
            return;
        }

        const filtered = allGames.filter(game => 
            game.name.toLowerCase().includes(query.toLowerCase())
        );

        resultsContainer.innerHTML = filtered.map(game => 
            `<div class="search-result-item" data-url="${this.escapeHtml(game.url)}" title="${this.escapeHtml(game.name)}">
                🎮 ${game.name}
            </div>`
        ).join('');
    }

    loadSearchResult(element) {
        const url = element.getAttribute('data-url');
        const browserFrame = document.getElementById('virtualBrowser');
        if (browserFrame && url) {
            try {
                new URL(url);
                browserFrame.src = url;
                this.addTerminalLine(`Launching: ${element.textContent.trim()}`, 'success');
                this.focusWindow('browserWindow');
            } catch (e) {
                this.addTerminalLine('Invalid URL', 'error');
            }
        }
    }

    loadBrowserUrl() {
        const urlInput = document.getElementById('browserUrl');
        const browserFrame = document.getElementById('virtualBrowser');
        if (urlInput && browserFrame) {
            let url = urlInput.value.trim();
            if (!url) return;

            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            try {
                new URL(url);
                browserFrame.src = url;
                this.addTerminalLine(`Loading: ${url}`, 'success');
            } catch (e) {
                this.addTerminalLine('Invalid URL format', 'error');
            }
        }
    }

    closeWindow(e) {
        const window = e.target.closest('.desktop-window');
        if (window) {
            window.classList.add('minimized');
        }
    }

    initTerminal() {
        this.terminalInput = document.getElementById('terminalInput');
        
        if (!this.terminalInput) {
            // Retry terminal initialization
            setTimeout(() => this.initTerminal(), 150);
            return;
        }

        // Only add listener if not already added
        if (!this.terminalInput._listenerAdded) {
            this.terminalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = e.target.value;
                    e.target.value = '';
                    this.executeCommand(command);
                }
            });
            this.terminalInput._listenerAdded = true;
        }

        this.addTerminalLine('Virtual Gaming PC v1.0');
        this.addTerminalLine('Type "help" for commands');
    }

    executeCommand(cmd) {
        const trimmed = cmd.trim().toLowerCase();
        this.addTerminalLine(`C:\\Games> ${cmd}`);

        if (!trimmed) return;

        switch(trimmed) {
            case 'help':
                this.addTerminalLine('Available commands:', 'info');
                this.addTerminalLine('  help       - Show this help message');
                this.addTerminalLine('  games      - List all games');
                this.addTerminalLine('  search     - Open game search');
                this.addTerminalLine('  browser    - Open browser');
                this.addTerminalLine('  system     - Show system info');
                this.addTerminalLine('  cls        - Clear screen');
                this.addTerminalLine('  exit       - Minimize terminal');
                break;
            
            case 'games':
                this.addTerminalLine(`Total games available: ${window.gameManager ? window.gameManager.games.length : 0}`, 'success');
                break;
            
            case 'search':
                this.focusWindow('searchWindow');
                this.addTerminalLine('Opening game search...', 'success');
                break;
            
            case 'browser':
                this.focusWindow('browserWindow');
                this.addTerminalLine('Opening browser...', 'success');
                break;
            
            case 'system':
                this.addTerminalLine('System Information:', 'info');
                this.addTerminalLine('  CPU: Gaming Processor');
                this.addTerminalLine('  RAM: 8GB');
                this.addTerminalLine('  Storage: 512GB');
                this.addTerminalLine('  Resolution: 1920x1080');
                break;
            
            case 'cls':
            case 'clear':
                this.terminalContent.innerHTML = '';
                const inputLine = document.createElement('div');
                inputLine.className = 'terminal-input-line';
                inputLine.innerHTML = 'C:\\Games> <input type="text" class="terminal-input" autocomplete="off">';
                this.terminalContent.appendChild(inputLine);
                this.terminalInput = inputLine.querySelector('.terminal-input');
                if (this.terminalInput) {
                    this.terminalInput._listenerAdded = false;
                    this.terminalInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            const command = e.target.value;
                            e.target.value = '';
                            this.executeCommand(command);
                        }
                    });
                    this.terminalInput._listenerAdded = true;
                    this.terminalInput.focus();
                }
                break;
            
            case 'exit':
                document.getElementById('terminalWindow').classList.add('minimized');
                break;
            
            default:
                this.addTerminalLine(`Command not found: ${trimmed}`, 'error');
                this.addTerminalLine('Type "help" for available commands');
        }

        // Scroll to bottom
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
    }

    addTerminalLine(text, type = '') {
        if (!this.terminalContent) return;
        const line = document.createElement('div');
        line.className = `terminal-line${type ? ' ' + type : ''}`;
        line.textContent = text;
        this.terminalContent.appendChild(line);
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
            const timeEl = document.getElementById('systemTime');
            if (timeEl) {
                timeEl.textContent = time;
            }
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    makeWindowDraggable(windowElement) {
        if (!windowElement) return;
        
        const header = windowElement.querySelector('.window-header');
        if (!header) return;
        
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target !== header && e.target.closest('.window-close')) return;
            
            isDragging = true;
            initialX = e.clientX - windowElement.offsetLeft;
            initialY = e.clientY - windowElement.offsetTop;
            windowElement.style.zIndex = 300;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && windowElement) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                windowElement.style.left = Math.max(0, currentX) + 'px';
                windowElement.style.top = Math.max(0, currentY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Global reference for onclick handlers
let virtualPC;
let gameManager;
document.addEventListener('DOMContentLoaded', () => {
    try {
        gameManager = new GameManager();
        window.gameManager = gameManager;
        console.log('✅ GameManager initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize GameManager:', error);
        // Show error to user
        document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: Arial;">
            <h1>Error Initializing Application</h1>
            <p>${error.message}</p>
            <p>Please refresh the page or contact support.</p>
        </div>`;
        return;
    }

    try {
        virtualPC = new VirtualPC();
        console.log('✅ VirtualPC initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize VirtualPC:', error);
        // VirtualPC is optional, don't crash the app
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('gameModal');
            if (modal && modal.classList.contains('active')) {
                const closeBtn = document.getElementById('closeModalBtn');
                if (closeBtn) closeBtn.click();
            }
            // Also close start menu
            const startMenu = document.getElementById('startMenu');
            if (startMenu) startMenu.style.display = 'none';
        }
    });
});
