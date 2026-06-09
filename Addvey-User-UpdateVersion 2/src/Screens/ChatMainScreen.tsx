// screens/ChatMainScreen.tsx
import React, { useState, useEffect, use } from "react";
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
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useChat } from "../../chatContext";

const ChatMainScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    chatUsers,
    onlineUsers,
    getUnreadCount,
    loadChatUsers,
    isConnected,
    loadExistingChat,
    getAllUserChats,
  } = useChat();

  // Load chat users when component mounts
  useEffect(() => {
    getAllUserChats();
    // loadExistingChat()
  }, []);

  // Filter users based on active tab and search
  // const filteredUsers = chatUsers.filter(user => {
  //   // Search filter
  //   const matchesSearch = searchQuery === "" ||
  //     user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.productName?.toLowerCase().includes(searchQuery.toLowerCase());

  //   // Tab filter
  //   if (activeTab === "Unread") {
  //     const unreadCount = getUnreadCount(user.id);
  //     return matchesSearch && unreadCount > 0;
  //   }

  //   return matchesSearch;
  // });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  useEffect(() => {
    if (isConnected) getAllUserChats();
  }, [isConnected]);

  // Format time for display
  const formatTime = (dateString) => {
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
  const getLastMessage = (userId) => {
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

  /** Single Chat Card Component */
  const ChatCard = ({ user }) => {
    const isOnline = onlineUsers.includes(user.id);
    const unreadCount = getUnreadCount(user.id);
    const lastMessage = getLastMessage(user.id);
    console.log(user);
    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() =>
          navigation.navigate("ChatMessaging", {
            receiverId: user?.partner?.id,
            receiverName: user?.partner?.name,
            productId: user?.product?.id,
            productName: user?.product?.name,
            productLocation: user?.product?.location?.city,
            price: user?.product?.price,
          })
        }
      >
        {/* Profile Circle */}
        <View style={styles.profileCircle}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>

          {/* Online Status Badge */}
          {isOnline && (
            <View style={styles.onlineBadge}>
              <Ionicons name="ellipse" size={hp(1)} color="#4CAF50" />
            </View>
          )}

          {/* 24hrs Badge */}
          <View style={styles.storyBadge}>
            <Ionicons name="time-outline" size={hp(1.2)} color="black" />
            <Text style={styles.storyText}>24hrs</Text>
          </View>

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
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
              {formatDate(lastMessage.timestamp)}
            </Text>
          </View>

          {/* Sub title (like BMW M5) */}
          <Text style={styles.userSub} numberOfLines={1}>
            {user.lastMessage || "No product"}
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
  const AllTab = () => (
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterBtn]}
          onPress={() => navigation.navigate("ChatFilter")}
        >
          <Image
            source={require("../../assets/images/filter.png")}
            style={{
              width: wp(3),
              height: hp(2),
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            activeFilter === "All" && styles.activeFilterBtn,
          ]}
          onPress={() => setActiveFilter("All")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "All" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            activeFilter === "1 Vehicles" && styles.activeFilterBtn,
          ]}
          onPress={() => setActiveFilter("1 Vehicles")}
        >
          <View style={styles.squareBox} />
          <Text
            style={[
              styles.filterText,
              activeFilter === "1 Vehicles" && styles.activeFilterText,
            ]}
          >
            1 Vehicles
          </Text>
        </TouchableOpacity>

        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? "#4CAF50" : "#f44336" },
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? "Online" : "Offline"}
          </Text>
        </View>
      </View>
      <FlatList
        data={chatUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.message}</Text>}
      />
      {/* Chat Cards List */}
      {chatUsers.length === 0 ? (
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
        chatUsers.map((user) => <ChatCard key={user.id} user={user} />)
      )}
    </View>
  );

  /** Render content based on active tab */
  const renderTabContent = () => {
    if (activeTab === "All" || activeTab === "Unread") {
      return <AllTab />;
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={wp(5)} color="black" />
          <Text style={styles.headerTitle}>Chats</Text>
        </TouchableOpacity>
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
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

export default ChatMainScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /** Header */
  header: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    marginTop: hp(3.6),
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: wp(4.5),
    marginLeft: wp(3),
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },

  /** Tabs */
  tabs: {
    flexDirection: "row",
    marginTop: hp(0),
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    justifyContent: "flex-start",
  },
  tabBtn: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    position: "relative",
  },
  tabText: {
    fontSize: hp(1.6),
    color: "#666",
  },
  activeText: {
    color: "#000000",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -1,
    left: 5,
    right: 0,
    height: 2,
    backgroundColor: "#6A5AE0",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },
  tabUnreadDot: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    backgroundColor: "#FF3B30",
    marginLeft: wp(1),
  },

  /** Search bar */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginBottom: hp(2.5),
    marginTop: hp(2.5),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: "#000",
    paddingVertical: hp(1),
  },

  /** Filters */
  filtersRow: {
    flexDirection: "row",
    marginBottom: hp(2),
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(3),
    marginRight: wp(2),
    marginBottom: hp(0.5),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  activeFilterBtn: {
    borderColor: "#6A5AE0",
    backgroundColor: "#fff",
  },
  filterText: { fontSize: hp(1.5), color: "#00000099" },
  activeFilterText: { color: "#6A5AE0", fontWeight: "600" },

  /** Connection Status */
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(3),
  },
  statusDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    marginRight: wp(1.5),
  },
  statusText: {
    fontSize: hp(1.4),
    color: "#666",
  },

  /** Small Square Box */
  squareBox: {
    width: wp(4),
    height: wp(4),
    backgroundColor: "#D9D9D980",
    marginRight: wp(1.5),
    borderRadius: 4,
  },

  /** Chat Card */
  chatCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(0),
    backgroundColor: "#fff",
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  profileCircle: {
    width: wp(17),
    height: wp(17),
    borderRadius: wp(16) / 2,
    backgroundColor: "#D9D9D980",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#6A5AE0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
  },
  onlineBadge: {
    position: "absolute",
    top: wp(1),
    right: wp(1),
    backgroundColor: "#fff",
    borderRadius: wp(1),
    padding: wp(0.3),
  },
  storyBadge: {
    position: "absolute",
    bottom: -hp(0.8),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: wp(1),
    paddingVertical: hp(0),
    borderRadius: wp(2),
    right: wp(-1),
  },
  unreadBadge: {
    position: "absolute",
    top: -hp(0.5),
    left: wp(1),
    backgroundColor: "#FF3B30",
    borderRadius: wp(10),
    minWidth: wp(4),
    height: wp(4),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(0.5),
  },
  unreadText: {
    color: "#fff",
    fontSize: hp(1),
    fontWeight: "600",
  },
  storyText: {
    color: "black",
    fontSize: hp(0.8),
    marginLeft: wp(1),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: hp(1.6),
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: wp(2),
  },
  userSub: {
    fontSize: hp(1.4),
    color: "#444",
    fontWeight: "500",
    marginBottom: hp(1),
  },
  messageText: {
    fontSize: hp(1.3),
    color: "#555",
    flexShrink: 1,
    flex: 1,
    marginRight: wp(2),
  },
  unreadMessageText: {
    color: "#000",
    fontWeight: "600",
  },
  dateText: {
    fontSize: hp(1),
    color: "#555",
  },
  timeText: {
    fontSize: hp(1),
    color: "#555",
  },

  /** Empty State */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(10),
  },
  emptyStateTitle: {
    fontSize: wp(4),
    color: "#666",
    marginTop: hp(2),
    marginBottom: hp(1),
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  emptyStateText: {
    fontSize: wp(3.2),
    color: "#999",
    textAlign: "center",
    lineHeight: hp(2.5),
    fontFamily: "Poppins-Regular",
  },
});
