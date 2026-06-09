import React, { createContext, useState, useContext, useEffect } from 'react';
import SocketService from './socketService';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children, userId1, serverUrl }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [chats, setChats] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userId, setUserId] = useState(null);

  // Track temporary messages to avoid duplicates
  const [tempMessages, setTempMessages] = useState(new Set());

  useEffect(() => {
    initializeSocket();

    return () => {
      SocketService.disconnect();
    };
  }, [userId, serverUrl]);

  const initializeSocket = async () => {
    try {
      const id = await AsyncStorage.getItem("user");
      console.log("📱 Loaded user data:", id);
      setUserId(id);
      await SocketService.connect(userId, serverUrl);
      setIsConnected(true);
      setupEventListeners();
      getAllUserChats();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  };

  const setupEventListeners = () => {
    // Connection events
    SocketService.socket?.on('connect', () => {
      console.log('✅ Connected in context');
      setIsConnected(true);
    });

    SocketService.socket?.on('disconnect', () => {
      console.log('❌ Disconnected in context');
      setIsConnected(false);
    });

    // Online/Offline users
    SocketService.onOnlineUser((onlineUsersList) => {
      console.log('🟢 Online users:', onlineUsersList);
      if (Array.isArray(onlineUsersList)) {
        setOnlineUsers(new Set(onlineUsersList));
      }
    });

    SocketService.onOfflineUser((offlineUser) => {
      console.log('🔴 User went offline:', offlineUser);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(offlineUser.userId || offlineUser);
        return newSet;
      });
    });

    // Listen for available chat users
    SocketService.onAllUserChats((users) => {
      console.log('👥 Available chat users:', users);
      if (Array.isArray(users)) {
        setChatUsers(users);
      }
    });

    // Listen for user status updates
    SocketService.onUserStatus((userStatus) => {
      console.log('🔄 User status update:', userStatus);
      setChatUsers(prev => prev.map(user =>
        user.id === userStatus.userId ? { ...user, isOnline: userStatus.isOnline } : user
      ));
    });

    // FIXED: Incoming messages - Handle duplicate prevention
    SocketService.onNewChat((newMessage) => {
      console.log('📩 Received new message:', newMessage);

      // Check if this is a duplicate temporary message
      if (newMessage.tempId && tempMessages.has(newMessage.tempId)) {
        console.log('🔄 Removing temporary message and replacing with server message');
        setTempMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(newMessage.tempId);
          return newSet;
        });

        // Replace temporary message with server message
        setChats(prev => {
          const filtered = prev.filter(chat =>
            !chat.isTemporary || chat.id !== `temp-${newMessage.tempId}`
          );

          const exists = filtered.some(chat => chat.id === newMessage.id);
          if (!exists) {
            return [...filtered, { ...newMessage, isTemporary: false }];
          }
          return filtered;
        });
      } else {
        // Regular new message or potential duplicate
        setChats(prev => {
          // 1. Strict ID Match
          if (prev.some(chat => chat.id == newMessage.id)) {
            return prev;
          }

          // 2. If it's MY message (senderId matches), be very aggressive about duplication
          // even if IDs don't match (e.g. temp-ID vs server-ID)
          if (newMessage.senderId == userId) {
            // Find any recent message (last 60 seconds) with same content from me
            // We use loose equality for senderId in case of string/number mismatch
            const duplicateCandidate = prev.find(chat =>
              (chat.isTemporary || chat.senderId == userId) &&
              chat.message === newMessage.message &&
              Math.abs(new Date(chat.createdAt || chat.timestamp).getTime() - new Date(newMessage.createdAt || newMessage.timestamp).getTime()) < 60000
            );

            if (duplicateCandidate) {
              // If we found a temp counterpart, replace it
              if (duplicateCandidate.isTemporary) {
                return prev.map(chat => chat === duplicateCandidate ? { ...newMessage, isTemporary: false } : chat);
              }
              // If we found a non-temp counterpart (maybe added by onMessageSent already), ignore this one
              return prev;
            }
          }

          // 3. Fallback: Generic content/timestamp match for others (less aggressive)
          const exists = prev.some(chat =>
            (chat.tempId && chat.tempId == newMessage.tempId) ||
            (chat.message === newMessage.message && chat.senderId == newMessage.senderId && Math.abs(new Date(chat.timestamp) - new Date(newMessage.timestamp)) < 2000)
          );

          if (exists) {
            const exactTempMatch = prev.find(chat => chat.isTemporary && chat.message === newMessage.message && chat.senderId == newMessage.senderId);
            if (exactTempMatch) {
              return prev.map(chat => chat === exactTempMatch ? newMessage : chat);
            }
            return prev;
          }

          return [...prev, newMessage];
        });
      }

      // Update unread count if message is not from current user
      if (newMessage.senderId !== userId) {
        setUnreadCounts(prev => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
        }));
      }
    });

    // Message sent confirmation
    SocketService.onMessageSent((confirmedMessage) => {
      console.log('✅ Message sent confirmation:', confirmedMessage);

      // Replace temporary message with confirmed message
      if (confirmedMessage.tempId) {
        setTempMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(confirmedMessage.tempId);
          return newSet;
        });

        setChats(prev => {
          const filtered = prev.filter(chat =>
            !chat.isTemporary || chat.id !== `temp-${confirmedMessage.tempId}`
          );

          const exists = filtered.some(chat => chat.id === confirmedMessage.id);
          if (!exists) {
            return [...filtered, { ...confirmedMessage, isTemporary: false }];
          }
          return filtered;
        });
      }
    });

    // Chat history
    SocketService.onChatHistory((chatHistory) => {
      console.log('📖 Chat history loaded:', chatHistory);
      if (chatHistory && Array.isArray(chatHistory.chats)) {
        setChats(chatHistory.chats);
      } else if (Array.isArray(chatHistory)) {
        setChats(chatHistory);
      }
    });

    // Chat deletion
    SocketService.onChatDeleted((deletedChat) => {
      console.log('🗑️ Chat deleted:', deletedChat);
      setChats(prev => prev.map(chat =>
        chat.id === deletedChat.id ? { ...chat, isDeleted: true } : chat
      ));
    });

    // Connection error handling
    SocketService.socket?.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    });
  };

  // Load available chat users
  const loadChatUsers = () => {
    if (!isConnected) {
      console.log('Not connected, cannot load chat users');
      return;
    }
    console.log('👥 Requesting chat users...');
    SocketService.requestChatUsers();
  };

  const getAllUserChats = async () => {
    try {
      console.log("📡 Fetching all user chats for:", userId);
      const response = await SocketService.getAllUserChats(Number(userId));

      if (response?.chats) {
        setChatUsers(response.chats);
        console.log("✅ Chats loaded:", response.chats.length);
      } else {
        console.warn("⚠️ No chat data in response");
        setChatUsers([]);
      }
    } catch (err) {
      console.error("❌ Error in getAllUserChats:", err);
    }
  };

  // Mark messages as read for a specific user
  const markAsRead = (senderId) => {
    setUnreadCounts(prev => ({
      ...prev,
      [senderId]: 0
    }));
  };

  // Get unread count for a specific user
  const getUnreadCount = (userId) => {
    return unreadCounts[userId] || 0;
  };

  // Start new chat with user
  const startNewChat = (receiverId, productId = null, productName = '') => {
    if (!isConnected) {
      Alert.alert('Offline', 'Cannot start chat while offline');
      return false;
    }

    // Check if user already exists in chat users, if not add temporarily
    const userExists = chatUsers.find(user => user.id === receiverId);
    if (!userExists) {
      setChatUsers(prev => [...prev, {
        id: receiverId,
        name: 'Unknown User',
        isOnline: onlineUsers.has(receiverId),
        lastSeen: new Date().toISOString(),
        productId: productId,
        productName: productName
      }]);
    }

    return true;
  };

  // FIXED: Send message with proper temporary message handling
  const sendMessage = (messageData) => {
    if (!isConnected) {
      Alert.alert('Offline', 'Cannot send message while offline');
      return false;
    }

    const tempMessage = {
      id: `temp-${messageData.tempId}`,
      senderId: userId,
      receiverId: messageData.receiverId,
      message: messageData.message,
      productId: messageData.productId,
      productLocation: messageData.productLocation,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isTemporary: true,
      status: 'sending'
    };

    // Add to temporary messages tracking
    setTempMessages(prev => new Set(prev).add(messageData.tempId));

    // Add temporary message to chats
    setChats(prev => [...prev, tempMessage]);

    const payload = {
      senderId: userId,
      receiverId: messageData.receiverId,
      message: messageData.message,
      tempId: messageData.tempId, // Send tempId to match with response
      ...(messageData.productId && { productId: messageData.productId }),
      ...(messageData.productLocation && { productLocation: messageData.productLocation })
    };

    console.log('📤 Sending message with tempId:', payload);
    SocketService.sendNewChat(payload);

    return true;
  };

  const loadChatHistory = (receiverId, productId = null) => {
    if (!isConnected) {
      console.log('Not connected, cannot load chat history');
      return;
    }

    const payload = {
      senderId: userId,
      receiverId: receiverId,
      ...(productId && { productId })
    };

    console.log('📖 Requesting chat history:', payload);
    SocketService.requestChatHistory(payload);

    // Mark messages as read when loading chat history
    markAsRead(receiverId);
  };

  const deleteMessage = (chatId) => {
    if (!isConnected) return;
    console.log('🗑️ Deleting chat:', chatId);
    SocketService.deleteChat(chatId);
  };

  const deleteChat = (chatId) => {
    if (!isConnected) return;
    console.log('🗑️ Deleting chat:', chatId);
    SocketService.deleteChat(chatId);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const value = {
    isConnected,
    onlineUsers: Array.from(onlineUsers),
    chats,
    chatUsers,
    currentChat,
    setCurrentChat,
    sendMessage,
    loadChatHistory,
    deleteMessage,
    deleteChat,
    isUserOnline,
    loadChatUsers,
    markAsRead,
    getUnreadCount,
    startNewChat,
    getAllUserChats,
    userId
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};