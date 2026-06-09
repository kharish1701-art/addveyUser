import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  /**
   * Connect to Socket server
   * @param {string} token - JWT Auth Token
   * @param {string} serverUrl - WebSocket server URL
   */
  connect(token, serverUrl = 'https://api.addvey.com') {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket && this.isConnected) {
          console.log('Socket already connected.');
          return resolve();
        }

        this.socket = io(serverUrl, {
          path: '/addvey/socket.io',
          auth: { token: token },
          transports: ['websocket'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 3,
        });

        this.socket.on('connect', () => {
          console.log('✅ Connected to WebSocket server');
          this.isConnected = true;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('⚠️ Disconnected:', reason);
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error.message);
          this.isConnected = false;
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected manually.');
    }
  }

  // ✅ Event listeners
  onOnlineUser(callback) {
    this.socket?.on('getOnlineUser', callback);
  }

  onAllUserChats(callback) {
    this.socket?.on('getAllUserChats', callback);
  }

  onOfflineUser(callback) {
    this.socket?.on('getOfflineUser', callback);
  }

  onNewChat(callback) {
    this.socket?.on('loadNewChat', callback);
  }

  onChatHistory(callback) {
    this.socket?.on('loadChats', callback);
  }

  onChatDeleted(callback) {
    this.socket?.on('chatDeleted', callback);
  }

  // ✅ Message confirmation events
  onMessageSent(callback) {
    this.socket?.on('messageSent', callback);
  }

  onMessageReceived(callback) {
    this.socket?.on('receiveMessage', callback);
  }

  onMessageError(callback) {
    this.socket?.on('messageError', callback);
  }

  onOnlineUsers(callback) {
    this.socket?.on('onlineUsers', callback);
  }

  onUserStatus(callback) {
    this.socket?.on('userStatus', callback);
  }

  // ✅ Emitters
  sendNewChat(messageData) {
    this.socket?.emit('newChat', messageData);
  }

  requestChatHistory(chatData) {
    this.socket?.emit('existsChat', chatData);
  }

  deleteChat(data) {
    this.socket?.emit("deleteConversation", {
      userId: data?.userId,
      partnerId: data?.partnerId,
      productId: data?.productId
    });
  }

  sendMessage(messageData) {
    this.socket?.emit('sendMessage', messageData);
  }

  // ✅ Request available chat users
  requestChatUsers() {
    this.socket?.emit('getAllUserChats');
  }

  // ✅ Remove all event listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  getAllUserChats(userId) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("Socket not connected");
        return;
      }

      console.log("📡 Requesting all user chats via socket:", userId);

      this.socket.emit("getAllUserChats", { userId });

      // Listen for the response
      const handleResponse = (response) => {
        console.log("✅ Received chat list from server:", response);
        this.socket?.off("loadAllUserChats", handleResponse);
        resolve(response);
      };

      this.socket.on("loadAllUserChats", handleResponse);

      // Handle timeout
      setTimeout(() => {
        this.socket?.off("loadAllUserChats", handleResponse);
        reject("Timeout: no response from server");
      }, 30000);
    });
  }
}

export default new SocketService();