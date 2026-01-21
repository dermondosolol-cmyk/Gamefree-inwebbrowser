// Authentication System
class AuthManager {
    constructor() {
        this.user = this.loadUser();
        this.initializeAuth();
    }

    initializeAuth() {
        const authPanel = document.getElementById('authPanel');
        const userInfo = document.getElementById('userInfo');
        const authButtons = document.querySelector('.auth-buttons');
        const googleBtn = document.getElementById('googleAuthBtn');
        const githubBtn = document.getElementById('githubAuthBtn');
        const guestBtn = document.getElementById('guestAuthBtn');
        const signOutBtn = document.getElementById('signOutBtn');

        if (!authPanel) {
            console.warn('AuthManager: authPanel element not found');
            return;
        }

        if (this.user) {
            if (authButtons) authButtons.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'flex';
                this.updateUserDisplay();
            }
        }

        if (googleBtn) googleBtn.addEventListener('click', () => this.signInWithGoogle());
        if (githubBtn) githubBtn.addEventListener('click', () => this.signInWithGitHub());
        if (guestBtn) guestBtn.addEventListener('click', () => this.signInAsGuest());
        if (signOutBtn) signOutBtn.addEventListener('click', () => this.signOut());
    }

    signInWithGoogle() {
        // Simulate Google OAuth - in production, use actual Google OAuth library
        const user = {
            id: 'google_' + Date.now(),
            name: 'Google User',
            email: 'user@gmail.com',
            avatar: '🔵',
            provider: 'google',
            timestamp: Date.now()
        };
        this.setUser(user);
    }

    signInWithGitHub() {
        // Simulate GitHub OAuth - in production, use actual GitHub OAuth
        const user = {
            id: 'github_' + Date.now(),
            name: 'GitHub User',
            email: 'user@github.com',
            avatar: '⬛',
            provider: 'github',
            timestamp: Date.now()
        };
        this.setUser(user);
    }

    signInAsGuest() {
        const user = {
            id: 'guest_' + Math.random().toString(36).substr(2, 9),
            name: 'Guest_' + Math.floor(Math.random() * 9000 + 1000),
            email: 'guest@nebula.local',
            avatar: '👤',
            provider: 'guest',
            timestamp: Date.now()
        };
        this.setUser(user);
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem('nebula_user', JSON.stringify(user));
        
        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.getElementById('userInfo');
        
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            this.updateUserDisplay();
        }

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('userSignedIn', { detail: user }));

        // Enable chat and video call features
        this.enableFeatures();
    }

    updateUserDisplay() {
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName && this.user) {
            userName.textContent = this.user.name + ' (' + this.user.provider + ')';
        }
        if (userAvatar && this.user) {
            userAvatar.textContent = this.user.avatar;
        }
    }

    signOut() {
        this.user = null;
        localStorage.removeItem('nebula_user');
        
        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.getElementById('userInfo');
        
        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';

        // Disable features
        this.disableFeatures();

        window.dispatchEvent(new CustomEvent('userSignedOut'));
    }

    loadUser() {
        const userData = localStorage.getItem('nebula_user');
        return userData ? JSON.parse(userData) : null;
    }

    isAuthenticated() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }

    enableFeatures() {
        const videoAuthRequired = document.getElementById('videoAuthRequired');
        const videoCallContent = document.getElementById('videoCallContent');
        const chatAuthRequired = document.getElementById('chatAuthRequired');
        const chatContent = document.getElementById('chatContent');

        if (videoAuthRequired) videoAuthRequired.style.display = 'none';
        if (videoCallContent) videoCallContent.style.display = 'flex';
        if (chatAuthRequired) chatAuthRequired.style.display = 'none';
        if (chatContent) chatContent.style.display = 'flex';
    }

    disableFeatures() {
        const videoAuthRequired = document.getElementById('videoAuthRequired');
        const videoCallContent = document.getElementById('videoCallContent');
        const chatAuthRequired = document.getElementById('chatAuthRequired');
        const chatContent = document.getElementById('chatContent');

        if (videoAuthRequired) videoAuthRequired.style.display = 'block';
        if (videoCallContent) videoCallContent.style.display = 'none';
        if (chatAuthRequired) chatAuthRequired.style.display = 'block';
        if (chatContent) chatContent.style.display = 'none';
    }
}

// Initialize auth manager when DOM is ready
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    if (!authManager) {
        authManager = new AuthManager();
    }
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!authManager) authManager = new AuthManager();
    });
} else {
    authManager = new AuthManager();
}
