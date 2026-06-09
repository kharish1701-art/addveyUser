// screens/ChatMainScreen.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  FlatList,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useChat } from "../../../chatContext";
import { IMAGE_BASE_URL } from "../../api/authApi/BaseUrl";
import { styles } from "./chatMainStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";

const useAutoRefreshChats = (refreshInterval = 30000) => {
  const { getAllUserChats, isConnected, userId } = useChat();
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    if (!isConnected || !userId) return;

    getAllUserChats();

    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing chats...");
      getAllUserChats();
      setLastRefresh(Date.now());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isConnected, userId, refreshInterval]);

  return { lastRefresh };
};

const ChatMainScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Voice Search Hook
  const { isListening, results, startRecognizing, stopRecognizing, resetResults } = useVoiceRecognition();

  // Update search query when voice results change
  useEffect(() => {
    if (results && results?.length > 0) {
      setSearchQuery(String(results[0]));
    }
  }, [results]);

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopRecognizing();
    } else {
      resetResults();
      startRecognizing();
    }
  };

  // Multi-select states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Animation refs
  const selectionAnim = useRef(new Animated.Value(0)).current;

  const {
    chatUsers,
    onlineUsers,
    getUnreadCount,
    loadChatUsers,
    isConnected,
    loadExistingChat,
    getAllUserChats,
    deleteChat,
    userId, // Make sure this is available from useChat
  } = useChat();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getAllUserChats();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load chat users when component mounts
  useEffect(() => {
    getAllUserChats();
  }, []);

  useAutoRefreshChats(30000);

  // Toggle selection mode with animation
  const toggleSelectionMode = (enable: boolean) => {
    if (enable) {
      setIsSelectionMode(true);
      Animated.timing(selectionAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(selectionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsSelectionMode(false);
        setSelectedChats([]);
        setSelectAll(false);
      });
    }
  };

  // Handle chat selection
  const handleChatSelect = (chatId: string) => {
    setSelectedChats(prev => {
      if (prev.includes(chatId)) {
        return prev.filter(id => id !== chatId);
      } else {
        return [...prev, chatId];
      }
    });
  };

  // Handle long press to enter selection mode
  const handleLongPress = (chatId: string) => {
    if (!isSelectionMode) {
      toggleSelectionMode(true);
    }
    handleChatSelect(chatId);
  };

  // Select all chats
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedChats([]);
      setSelectAll(false);
    } else {
      const allChatIds = filteredUsers.map(user => user.partner?.id);
      setSelectedChats(allChatIds);
      setSelectAll(true);
    }
  };

  // Delete selected chats
  const handleDeleteSelected = () => {
    if (selectedChats.length === 0) return;

    Alert.alert(
      "Delete Chats",
      `Are you sure you want to delete ${selectedChats.length} conversation${selectedChats.length > 1 ? 's' : ''}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete each selected chat with proper userId and partnerId
              const id = await AsyncStorage.getItem("user")
              for (const partnerId of selectedChats) {
                const chatToDelete = chatUsers.find(user => user.partner?.id === partnerId);
                console.log(chatToDelete, 'chat delte ============', partnerId)
                if (chatToDelete) {
                  await deleteChat({
                    userId: id, // Current user's ID
                    partnerId: partnerId, // Partner's ID
                    // productId: chatToDelete.product?.id // Optional product ID
                  });
                }
              }

              // Refresh the chat list
              await getAllUserChats();

              // Exit selection mode
              toggleSelectionMode(false);

              Alert.alert("Success", "Conversations deleted successfully");
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete conversations");
            }
          }
        }
      ]
    );
  };

  // Delete single chat
  const handleDeleteSingleChat = (partnerId: string) => {
    const chatToDelete = chatUsers.find(user => user.partner?.id === partnerId);

    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (chatToDelete) {
                await deleteChat({
                  userId: userId,
                  partnerId: partnerId,
                  productId: chatToDelete.product?.id
                });

                await getAllUserChats();
                Alert.alert("Success", "Conversation deleted successfully");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete conversation");
            }
          }
        }
      ]
    );
  };

  const filteredUsers = useMemo(() => {
    return chatUsers?.filter((user) => {
      const partnerName = user?.partner?.name?.toLowerCase() || "";
      const productName = user?.product?.name?.toLowerCase() || "";
      const query = String(searchQuery || "").toLowerCase();

      const matchesSearch =
        query === "" ||
        partnerName.includes(query) ||
        productName.includes(query);

      if (activeTab === "Unread") {
        const unreadCount = getUnreadCount(user.id);
        return matchesSearch && unreadCount > 0;
      }

      return matchesSearch;
    });
  }, [chatUsers, searchQuery, activeTab]);

  // Format date for display
  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    if (isConnected) getAllUserChats();
  }, [isConnected]);

  // Format time for display
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  // Get last message for a user
  const getLastMessage = (userId: string) => {
    const userChats = chatUsers
      .filter((chat) => chat.senderId === userId || chat.receiverId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
      userChats[0] || {
        message: "Start a conversation...",
        timestamp: new Date().toISOString(),
      }
    );
  };

  // Animation styles
  const headerTransform = {
    transform: [{
      translateX: selectionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, wp(0)]
      })
    }]
  };

  const selectionHeaderTransform = {
    transform: [{
      translateX: selectionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [wp(100), 0]
      })
    }]
  };

  /** Single Chat Card Component */
  const ChatCard = ({ user }) => {
    const isOnline = onlineUsers.includes(user.id);
    const unreadCount = getUnreadCount(user.id);
    const lastMessage = getLastMessage(user.id);
    const isSelected = selectedChats.includes(user.partner?.id);
    const [imgError, setImgError] = useState(false);

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          // ... (keep existing onPress logic potentially, or just reference the lines effectively if replace_file_content allowed context matching, but here I must be precise with lines or replace whole block)
          if (isSelectionMode) {
            handleChatSelect(user.partner?.id);
          } else {
            navigation.navigate("ChatMessaging", {
              receiverId: user?.partner?.id,
              receiverName: user?.partner?.name,
              productId: user?.product?.id,
              productName: user?.product?.name,
              productLocation: user?.product?.location?.city,
              price: user?.product?.price,
            });
          }
        }}
        onLongPress={() => handleLongPress(user?.partner?.id)}
        delayLongPress={500}
      >
        {/* Profile Circle with Selection Overlay */}
        <View style={styles.profileCircle}>
          {(user?.partner?.avatar && !imgError) ? (
            <Image
              source={{
                uri: user.partner.avatar.startsWith("http")
                  ? user.partner.avatar
                  : IMAGE_BASE_URL + user.partner.avatar
              }}
              style={styles.profileCircle}
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}

          {/* Online Status Badge */}
          {isOnline && (
            <View style={styles.onlineBadge}>
              <Ionicons name="ellipse" size={hp(1)} color="#4CAF50" />
            </View>
          )}

          {/* Status Dot */}
          <View style={styles.storyBadge}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConnected ? "#4CAF50" : "#f44336" },
              ]}
            />
          </View>

          {/* Unread Badge */}
          {unreadCount > 0 && !isSelectionMode && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}

          {/* Selection Checkbox (Bottom Right) */}
          {isSelectionMode && (
            <View style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              zIndex: 10,
              backgroundColor: isSelected ? '#4CAF50' : '#fff',
              borderColor: '#ddd',
              borderWidth: 1,
              width: 20,
              height: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isSelected && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
          )}
        </View>

        {/* Message Content */}
        <View style={{ flex: 1, marginLeft: wp(3) }}>
          {/* Top row: Name + Date */}
          <View style={styles.rowBetween}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.partner?.name || "Unknown User"}
            </Text>
            <Text style={styles.dateText}>
              {formatDate(lastMessage?.createdAt)}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.userSub} numberOfLines={1}>
              {user.lastMessage || "No product"}
            </Text>
            <Text style={styles.dateText}>
              {lastMessage?.createdAt.split("T")[1]?.slice(0, 5) || ""}
            </Text>
          </View>

          <Text style={styles.userSub} numberOfLines={1}>
            {user?.product?.name || "No product"}
          </Text>

          {/* Bottom row: Message + Time */}
          <View style={styles.rowBetween}>
            <Text
              style={[
                styles.messageText,
                unreadCount > 0 && styles.unreadMessageText,
              ]}
              numberOfLines={1}
            >
              {lastMessage.message}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(lastMessage.timestamp)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /** All Tab Content */
  const renderAllTab = () => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search users or products..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleVoiceSearch}>
            <Ionicons
              name={isListening ? "mic" : "mic-outline"}
              size={20}
              color={isListening ? "#6C63FF" : "#999"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat Cards List */}
      {filteredUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={wp(25)}
            color="#D9D9D9"
          />
          <Text style={styles.emptyStateTitle}>
            {searchQuery ? "No users found" : "No conversations"}
          </Text>
          <Text style={styles.emptyStateText}>
            {searchQuery
              ? "Try searching with different keywords"
              : activeTab === "Unread"
                ? "You have no unread messages"
                : "Start a new conversation by messaging someone"}
          </Text>
        </View>
      ) : (
        filteredUsers.map((user) => <ChatCard key={user.id} user={user} />)
      )}
    </View>
  );

  /** Render content based on active tab */
  const renderTabContent = () => {
    if (activeTab === "All" || activeTab === "Unread") {
      return renderAllTab();
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header with Selection Mode */}
      <View style={styles.header}>
        {/* Normal Header */}
        <Animated.View style={[styles.normalHeader, headerTransform]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={wp(5)} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isSelectionMode ? `${selectedChats.length} Selected` : "Chats"}
            </Text>
          </View>

          <View style={styles.rightIcons}>
            {isSelectionMode ? (
              // Selection mode actions
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity style={styles.menuButton}>
                  <Ionicons name="search" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                  <MaterialIcons name="push-pin" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                  <Ionicons name="notifications-off-outline" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={handleDeleteSelected}
                >
                  <MaterialIcons name="delete-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => toggleSelectionMode(false)}
                >
                  <Ionicons name="close" size={22} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              // Normal mode actions
              <>
                <TouchableOpacity style={styles.menuButton}>
                  <Ionicons name="ellipsis-vertical" size={20} color="black" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Tabs (All / Unread) */}
      <View style={styles.tabs}>
        {["All", "Unread"].map((t, i) => (
          <TouchableOpacity
            key={i}
            style={styles.tabBtn}
            onPress={() => setActiveTab(t)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[styles.tabText, activeTab === t && styles.activeText]}
              >
                {t}
              </Text>
              {t === "Unread" &&
                chatUsers.some((user) => getUnreadCount(user.id) > 0) && (
                  <View style={styles.tabUnreadDot} />
                )}
            </View>
            {activeTab === t && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(3),
          paddingBottom: hp(10),
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

export default ChatMainScreen;