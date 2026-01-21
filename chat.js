// Chat System Manager
class ChatManager {
    constructor() {
        this.currentUser = null;
        this.selectedUser = null;
        this.onlineUsers = new Map();
        this.conversations = new Map();
        this.messages = [];
        this.presenceInterval = null;
        this.initializeChatEventListeners();
        this.startPresenceSystem();
    }

    initializeChatEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessageBtn');

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Listen for user sign-in
        window.addEventListener('userSignedIn', (e) => {
            this.currentUser = e.detail;
            this.loadConversations();
            this.announcePresence();
        });

        window.addEventListener('userSignedOut', () => {
            this.currentUser = null;
            this.onlineUsers.clear();
            this.selectedUser = null;
            this.clearChatUI();
        });
    }

    startPresenceSystem() {
        // Simulate online users
        this.presenceInterval = setInterval(() => {
            if (this.currentUser) {
                this.broadcastPresence();
                this.updateUserList();
            }
        }, 3000);
    }

    announcePresence() {
        if (!this.currentUser) return;

        this.onlineUsers.set(this.currentUser.id, {
            ...this.currentUser,
            lastSeen: Date.now(),
            status: 'online'
        });

        this.updateUserList();
    }

    broadcastPresence() {
        if (this.currentUser) {
            // Simulate receiving other users
            const sampleUsers = [
                { 
                    id: 'user_1', 
                    name: 'Alice', 
                    avatar: '👩‍💻', 
                    provider: 'google',
                    lastSeen: Date.now() - Math.random() * 60000
                },
                { 
                    id: 'user_2', 
                    name: 'Bob', 
                    avatar: '👨‍💻', 
                    provider: 'github',
                    lastSeen: Date.now() - Math.random() * 60000
                },
                { 
                    id: 'user_3', 
                    name: 'Charlie', 
                    avatar: '👤', 
                    provider: 'guest',
                    lastSeen: Date.now() - Math.random() * 60000
                }
            ];

            sampleUsers.forEach(user => {
                if (!this.onlineUsers.has(user.id)) {
                    this.onlineUsers.set(user.id, { ...user, status: 'online' });
                }
            });
        }
    }

    updateUserList() {
        const userList = document.getElementById('userList');
        const userCount = document.getElementById('userCount');

        if (!userList || !this.currentUser) return;

        userList.innerHTML = '';
        let count = 0;

        this.onlineUsers.forEach((user, userId) => {
            if (userId !== this.currentUser.id) {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                if (this.selectedUser && this.selectedUser.id === userId) {
                    userItem.classList.add('active');
                }
                userItem.innerHTML = `${user.avatar} ${user.name}`;
                userItem.addEventListener('click', () => this.selectUser(user));
                userList.appendChild(userItem);
                count++;
            }
        });

        if (userCount) userCount.textContent = `(${count})`;
    }

    selectUser(user) {
        this.selectedUser = user;
        this.updateUserList();
        this.displayConversation(user.id);
        this.enableMessageInput();
        this.updateChatHeader();
    }

    updateChatHeader() {
        const chatTitle = document.getElementById('chatTitle');
        const chatStatus = document.getElementById('chatStatus');

        if (chatTitle && this.selectedUser) {
            chatTitle.textContent = this.selectedUser.name + ' (' + this.selectedUser.provider + ')';
        }

        if (chatStatus && this.selectedUser) {
            chatStatus.textContent = '🟢 Online';
        }
    }

    displayConversation(userId) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        chatMessages.innerHTML = '';

        const convKey = this.getConversationKey(userId);
        const messages = this.conversations.get(convKey) || [];

        if (messages.length === 0) {
            chatMessages.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 40px 20px;">No messages yet. Start a conversation!</div>';
            return;
        }

        messages.forEach(msg => {
            this.displayMessage(msg, chatMessages);
        });

        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    displayMessage(msg, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + (msg.senderId === this.currentUser.id ? 'own' : 'other');

        const time = new Date(msg.timestamp).toLocaleTimeString();
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(msg.text)}</div>
            <div class="message-time">${time}</div>
        `;

        container.appendChild(messageDiv);
    }

    sendMessage() {
        if (!this.selectedUser || !this.currentUser) {
            alert('Please select a user to chat with');
            return;
        }

        const messageInput = document.getElementById('messageInput');
        if (!messageInput) return;
        const text = messageInput.value.trim();

        if (!text) return;

        const message = {
            id: 'msg_' + Date.now(),
            senderId: this.currentUser.id,
            recipientId: this.selectedUser.id,
            text: text,
            timestamp: Date.now()
        };

        // Add to conversation
        const convKey = this.getConversationKey(this.selectedUser.id);
        if (!convKey) return;
        if (!this.conversations.has(convKey)) {
            this.conversations.set(convKey, []);
        }
        this.conversations.get(convKey).push(message);

        // Save to localStorage
        this.saveConversations();

        // Display message
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            this.displayMessage(message, chatMessages);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        messageInput.value = '';
        messageInput.focus();

        // Simulate receiving a response
        setTimeout(() => this.simulateResponse(), 1000 + Math.random() * 2000);
    }

    simulateResponse() {
        if (!this.selectedUser || !this.currentUser) return;

        const responses = [
            'That\'s great!',
            'I agree with you',
            'Looks good to me',
            'Thanks for sharing',
            'Let me think about that',
            'Absolutely',
            'No problem',
            'Sounds interesting'
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];

        if (!this.selectedUser || !this.currentUser) return;
        const message = {
            id: 'msg_' + Date.now(),
            senderId: this.selectedUser.id,
            recipientId: this.currentUser.id,
            text: response,
            timestamp: Date.now()
        };

        const convKey = this.getConversationKey(this.selectedUser.id);
        if (!convKey) return;
        if (!this.conversations.has(convKey)) {
            this.conversations.set(convKey, []);
        }
        this.conversations.get(convKey).push(message);
        this.saveConversations();

        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            this.displayMessage(message, chatMessages);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    getConversationKey(userId) {
        if (!this.currentUser) return '';
        return [this.currentUser.id, userId].sort().join('_');
    }

    enableMessageInput() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessageBtn');

        if (messageInput) messageInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
    }

    disableMessageInput() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessageBtn');

        if (messageInput) messageInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
    }

    clearChatUI() {
        const chatMessages = document.getElementById('chatMessages');
        const chatTitle = document.getElementById('chatTitle');
        const userList = document.getElementById('userList');

        if (chatMessages) chatMessages.innerHTML = '';
        if (chatTitle) chatTitle.textContent = 'Select a user to chat';
        if (userList) userList.innerHTML = '';

        this.disableMessageInput();
    }

    cleanup() {
        if (this.presenceInterval) {
            clearInterval(this.presenceInterval);
            this.presenceInterval = null;
        }
    }

    saveConversations() {
        const data = {};
        this.conversations.forEach((msgs, key) => {
            data[key] = msgs;
        });
        localStorage.setItem('nebula_conversations', JSON.stringify(data));
    }

    loadConversations() {
        const data = localStorage.getItem('nebula_conversations');
        if (data) {
            const parsed = JSON.parse(data);
            this.conversations.clear();
            Object.entries(parsed).forEach(([key, msgs]) => {
                this.conversations.set(key, msgs);
            });
        }
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

// Initialize chat manager
let chatManager = null;

window.addEventListener('userSignedIn', () => {
    if (!chatManager) {
        chatManager = new ChatManager();
    }
});
