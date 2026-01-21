// Video Call Manager using WebRTC
class VideoCallManager {
    constructor() {
        this.localStream = null;
        this.peerConnection = null;
        this.peerId = this.generatePeerId();
        this.remotePeerId = null;
        this.callActive = false;
        this.signalingServer = 'wss://echo.websocket.org'; // Using echo server for demo
        this.initializeEventListeners();
        this.displayPeerId();
    }

    generatePeerId() {
        return 'peer_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    initializeEventListeners() {
        const copyBtn = document.getElementById('copyPeerIdBtn');
        const callBtn = document.getElementById('callBtn');
        const hangupBtn = document.getElementById('hangupBtn');
        const peerId = document.getElementById('peerId');

        if (copyBtn) copyBtn.addEventListener('click', () => this.copyPeerId());
        if (callBtn) callBtn.addEventListener('click', () => this.initiateCall());
        if (hangupBtn) hangupBtn.addEventListener('click', () => this.endCall());
        if (peerId) peerId.addEventListener('input', (e) => this.remotePeerId = e.target.value);
    }

    displayPeerId() {
        const peerIdInput = document.getElementById('peerId');
        if (peerIdInput) {
            peerIdInput.value = this.peerId;
        }
    }

    copyPeerId() {
        const peerIdInput = document.getElementById('peerId');
        if (peerIdInput) {
            peerIdInput.select();
            document.execCommand('copy');
            alert('Your Peer ID copied: ' + this.peerId);
        }
    }

    async initiateCall() {
        const messageInput = document.getElementById('peerId');
        if (!messageInput) {
            alert('Peer ID input not found');
            return;
        }
        const remotePeerId = messageInput.value.trim();

        if (!remotePeerId) {
            alert('Please enter a peer ID to call');
            return;
        }

        if (!authManager.isAuthenticated()) {
            alert('Please sign in first');
            return;
        }

        try {
            await this.startLocalStream();
            await this.createPeerConnection();
            await this.createAndSendOffer();
            this.updateCallStatus('Calling ' + remotePeerId + '...');
        } catch (error) {
            console.error('Error initiating call:', error);
            alert('Error starting call: ' + error.message);
        }
    }

    async startLocalStream() {
        try {
            const constraints = {
                audio: true,
                video: { width: 1280, height: 720 }
            };
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                localVideo.srcObject = this.localStream;
            }
            this.updateCallUI(true);
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw new Error('Camera/Microphone access denied');
        }
    }

    async createPeerConnection() {
        const configuration = {
            iceServers: [
                { urls: ['stun:stun.l.google.com:19302'] },
                { urls: ['stun:stun1.l.google.com:19302'] }
            ]
        };

        this.peerConnection = new RTCPeerConnection(configuration);

        // Add local stream tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
        }

        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            console.log('Remote stream received');
            const remoteVideo = document.getElementById('remoteVideo');
            if (remoteVideo && event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendSignalingMessage({
                    type: 'candidate',
                    candidate: event.candidate,
                    from: this.peerId,
                    to: this.remotePeerId
                });
            }
        };

        this.peerConnection.onconnectionstatechange = () => {
            this.updateCallStatus('Connection: ' + this.peerConnection.connectionState);
            if (this.peerConnection.connectionState === 'disconnected' || 
                this.peerConnection.connectionState === 'failed') {
                this.endCall();
            }
        };
    }

    async createAndSendOffer() {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.sendSignalingMessage({
            type: 'offer',
            offer: offer,
            from: this.peerId,
            to: this.remotePeerId
        });
    }

    sendSignalingMessage(message) {
        // In a real application, send through WebSocket or HTTP
        console.log('Signaling message:', message);
        // Simulate sending via WebSocket
        try {
            const ws = new WebSocket(this.signalingServer);
            ws.onopen = () => {
                ws.send(JSON.stringify(message));
                ws.close();
            };
        } catch (error) {
            console.error('Error sending signaling message:', error);
        }
    }

    async handleOffer(offer, remotePeerId) {
        this.remotePeerId = remotePeerId;
        if (!this.localStream) {
            await this.startLocalStream();
        }
        if (!this.peerConnection) {
            await this.createPeerConnection();
        }

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.sendSignalingMessage({
            type: 'answer',
            answer: answer,
            from: this.peerId,
            to: this.remotePeerId
        });
    }

    async handleAnswer(answer) {
        if (this.peerConnection) {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

    async handleCandidate(candidate) {
        if (this.peerConnection) {
            try {
                await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        }
    }

    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');
        if (localVideo) localVideo.srcObject = null;
        if (remoteVideo) remoteVideo.srcObject = null;

        this.callActive = false;
        this.updateCallUI(false);
        this.updateCallStatus('Call ended');
    }

    updateCallUI(calling) {
        const callBtn = document.getElementById('callBtn');
        const hangupBtn = document.getElementById('hangupBtn');

        if (callBtn && hangupBtn) {
            if (calling) {
                callBtn.style.display = 'none';
                hangupBtn.style.display = 'block';
                this.callActive = true;
            } else {
                callBtn.style.display = 'block';
                hangupBtn.style.display = 'none';
                this.callActive = false;
            }
        }
    }

    updateCallStatus(message) {
        const callInfo = document.getElementById('callInfo');
        if (callInfo) {
            callInfo.textContent = message;
        }
    }
}

// Initialize video call manager
let videoCallManager = null;

window.addEventListener('userSignedIn', () => {
    if (!videoCallManager) {
        videoCallManager = new VideoCallManager();
    }
});
