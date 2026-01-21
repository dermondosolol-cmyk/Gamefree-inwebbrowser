// Debug Mode Controller - Session 8
// Allows toggling verbose logging on/off

class DebugModeController {
    constructor() {
        this.enabled = false;
        this.originalLog = console.log;
        this.originalWarn = console.warn;
        this.originalError = console.error;
        this.logs = [];
        
        // Check if debug mode is enabled via URL parameter
        const params = new URLSearchParams(window.location.search);
        this.enabled = params.has('debug') || localStorage.getItem('debugMode') === 'true';
        
        if (this.enabled) {
            this.setupDebugMode();
        } else {
            this.setupProductionMode();
        }
    }

    setupDebugMode() {
        console.log('%c🔍 DEBUG MODE ENABLED', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
        console.log('All console output will be captured and displayed');
        
        // Keep original console functions
        window.DEBUG = {
            logs: this.logs,
            toggle: () => this.toggle(),
            export: () => this.exportLogs()
        };
    }

    setupProductionMode() {
        // Override console functions to suppress non-critical logs
        console.log = (...args) => {
            // Only log errors and warnings in production
            if (typeof args[0] === 'string' && (args[0].includes('Error') || args[0].includes('Failed'))) {
                this.originalLog(...args);
            }
            this.logs.push({ type: 'log', args });
        };

        console.warn = (...args) => {
            this.originalWarn(...args);
            this.logs.push({ type: 'warn', args });
        };

        console.error = (...args) => {
            this.originalError(...args);
            this.logs.push({ type: 'error', args });
        };

        // Provide debug window in production
        window.DEBUG = {
            logs: this.logs,
            toggle: () => this.toggle(),
            export: () => this.exportLogs(),
            enable: () => this.enableDebug(),
            disable: () => this.disableDebug()
        };
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('debugMode', this.enabled ? 'true' : 'false');
        location.reload();
    }

    enableDebug() {
        localStorage.setItem('debugMode', 'true');
        location.reload();
    }

    disableDebug() {
        localStorage.setItem('debugMode', 'false');
        location.reload();
    }

    exportLogs() {
        const logsText = this.logs.map(log => `[${log.type}] ${log.args.join(' ')}`).join('\n');
        const blob = new Blob([logsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-logs-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.debugController = new DebugModeController();
    });
} else {
    window.debugController = new DebugModeController();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DebugModeController;
}
