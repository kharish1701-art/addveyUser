// ChatMessagingScreen.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useChat } from "../../../chatContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./ChatMessagingStyle";
import LoadingModal from "../../Components/Loader";
import InfoReportScreen from "./infoReportScreen";
import ReportDetailModal from "../../Components/Profile/ReportDetailModal";
import { PostAPi } from "../../api/getApi/getApi";
import { EndPoints } from "../../services/EndPoints";

const ChatMessagingScreen = ({ route, navigation }) => {
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, sendMessage, chats, loadChatHistory, onlineUsers } =
    useChat();
  const [reportModat, setReportModal] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    getStatus()

  }, []);
  const handleReportSubmit = async (text: string) => {
    console.log("User submitted:", text);
    setLoading(true);
    const userToken = await AsyncStorage.getItem("authToken");
    // \"abuse\"|\"spam\"|\"other\"

    const param = {
      url: EndPoints.addReport,
      body: {
        productId: productId,
        reason: 'other',
        // selectedReport == "Fraud"
        //   ? "spam"
        //   : selectedReport == "Duplicate ad"
        //   ? "spam"
        //   : selectedReport == "Inaccurate photos or details"
        //   ? "abuse"
        //   : selectedReport == "Offensive content"
        //   ? "abuse"
        //   : "other",

        type: "report",
        description: text,
      },
      token: userToken || "",
    };

    const dd = await PostAPi(param, setLoading);
    if (dd?.success) {
      console.log("<><><><><><", param.body);
      // navigation.goBack()
      setReportModal(false);
      Alert.alert("Success", "Report submitted successfully");
    }

    setReportModal(false);
    // 👉 Send to API OR show toast OR store in context
  };
    const [modalVisible, setModalVisible] = useState(false);

  const handleReport = () => {
    setModalVisible(true);
    // Alert.alert("Report", "Report this user or conversation?");
  };
  const reportPress = () => {
    setModalVisible(false)
    setReportModal(true)
  }
  const getStatus = async () => {
    const status = await AsyncStorage.getItem("chatIntroShown");
    if (!status) {
      setVisible(true);
      await AsyncStorage.setItem("chatIntroShown", "true");
    }
  }
  // Extract parameters from navigation
  const {
    receiverId,
    receiverName,
    productId,
    productName,
    productLocation,
    price,
  } = route?.params || {};

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const id = await AsyncStorage.getItem("user");
        console.log("Current User ID:", id);
        setCurrentUserId(id);

        if (id && receiverId && productId) {
          // Load chat history with correct IDs
          await loadChatHistory(receiverId, productId);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        setLoading(false);
      }
    };

    initializeChat();
  }, []);
  // }, [receiverId, productId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && chats.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chats]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const tempId = Date.now().toString();

    const messageData = {
      tempId, // 🔥 unique id per message
      receiverId,
      message: message.trim(),
      productId,
      productLocation,
    };

    sendMessage(messageData);
    setMessage("");
  };



  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";

      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      // Today - show time only
      if (date.toDateString() === now.toDateString()) {
        if (diffInMinutes < 1) {
          return "now";
        } else if (diffInMinutes < 60) {
          return `${diffInMinutes}m ago`;
        } else {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      // Yesterday
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      }

      // Within last 7 days - show day name
      if (diffInDays < 7) {
        return date.toLocaleDateString([], { weekday: "short" });
      }

      // This year - show date without year
      if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
      }

      // Different year - show full date
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  const formatDate = (timestamp) => {
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

  const renderStatusIcon = (chat) => {
    if (chat.isTemporary) {
      return <Ionicons name="time-outline" size={14} color="#999" style={{ marginLeft: 4 }} />;
    }
    // Assuming 'isRead' or similar property exists, or default to sent/delivered
    // If chat has explicit status:
    if (chat.status === 'read' || chat.isRead) {
      return <Ionicons name="checkmark-done" size={16} color="#34B7F1" style={{ marginLeft: 4 }} />;
    }
    if (chat.status === 'delivered') { // Placeholder if supported
      return <Ionicons name="checkmark-done" size={16} color="#999" style={{ marginLeft: 4 }} />;
    }
    return <Ionicons name="checkmark" size={16} color="#999" style={{ marginLeft: 4 }} />;
  };

  const renderMessage = (chat, index) => {
    if (!currentUserId) return null;
    const isMyMessage = chat.senderId?.toString() === currentUserId;

    return (
      <View
        key={chat.id || `chat-${index}-${Date.now()}`}
        style={isMyMessage ? styles.messageRight : styles.messageLeft}
      >
        <Text style={styles.topMessageText}>
          {isMyMessage ? "You" : receiverName} •{" "}
          {chat.isTemporary ? "Now" : formatTimestamp(chat.createdAt)}
        </Text>

        <View
          style={[
            styles.textMessage,
            isMyMessage ? styles.myTextMessage : styles.theirTextMessage,
          ]}
        >
          <Text
            style={isMyMessage ? styles.myMessageText : styles.theirMessageText}
          >
            {chat.message}
          </Text>
        </View>

        <View style={[styles.timeText, { flexDirection: 'row', alignItems: 'center', justifyContent: isMyMessage ? 'flex-end' : 'flex-start' }]}>
          <Text style={{ fontSize: 10, color: '#999' }}>
            {formatTimestamp(chat.timestamp)}
          </Text>
          {isMyMessage && renderStatusIcon(chat)}
        </View>
      </View>
    );
  };

  const shouldShowDateHeader = (currentChat, previousChat) => {
    if (!previousChat) return true;

    const currentDate = currentChat.timestamp
      ? new Date(currentChat.timestamp).toDateString()
      : "";
    const previousDate = previousChat.timestamp
      ? new Date(previousChat.timestamp).toDateString()
      : "";

    return currentDate !== previousDate;
  };

  const renderDateHeader = (timestamp) => {
    if (!timestamp) return null;

    return (
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderText}>{formatDate(timestamp)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {loading && <LoadingModal />}
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Connection Status Indicator */}
      {!isConnected && (
        <View style={styles.offlineBar}>
          <Text style={styles.offlineText}>Offline - Connecting...</Text>
        </View>
      )}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp("5%")} color="black" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.profilePic} />
          <View>
            <Text style={styles.userName} numberOfLines={1}>
              {receiverName} • {productName}
              {onlineUsers.includes(receiverId?.toString()) && " 🟢"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="location-sharp"
                size={wp("3.5%")}
                color="#FF0303"
                style={{ marginRight: wp("0.5%"), marginTop: hp(0.3) }}
              />
              <Text style={styles.userSubText}>{productLocation}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={{ marginLeft: "auto" }} onPress={handleReport}>
          <AntDesign name="exclamation-circle" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {/* Rent Price Section */}
      <View style={styles.priceBar}>
        <Text style={styles.priceText}>Price •</Text>
        <Text style={styles.priceValue}>{price}</Text>
      </View>

      {/* Chat Section */}
      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic messages from context */}
        {chats
          .filter((chat) => !chat.isDeleted)
          .map((chat, index, filteredChats) => {
            const previousChat = index > 0 ? filteredChats[index - 1] : null;
            const showDateHeader = shouldShowDateHeader(chat, previousChat);

            return (
              <View key={chat.id || `chat-${index}-${Date.now()}`}>
                {/* {showDateHeader && renderDateHeader(chat.timestamp)} */}
                {renderMessage(chat, index)}
              </View>
            );
          })}

        {/* Empty state */}
        {chats.filter((chat) => !chat.isDeleted).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No messages yet</Text>
            <Text style={styles.emptyStateSubText}>
              Start a conversation by sending a message!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Input Section */}
      <View style={styles.bottomSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.iconButton, styles.sendButton]}
            onPress={handleSendMessage}
            disabled={!message.trim() || !isConnected}
          >
            <Feather name="send" size={22} color="white" />
          </TouchableOpacity>
          <View>
            {/* <View style={styles.leftIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Entypo name="emoji-happy" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="camera" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <EvilIcons name="location" size={24} color="#666" />
              </TouchableOpacity>
            </View> */}

            {/* Right Side Icons */}
            {/* <View style={styles.rightIcons}>
              {message.trim() ? (
                <TouchableOpacity
                  style={[styles.iconButton, styles.sendButton]}
                  onPress={handleSendMessage}
                  disabled={!message.trim() || !isConnected}
                >
                  <Feather
                    name="arrow-up"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.iconButton}>
                  <Image
                    source={require("../../assets/images/mic.png")}
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              )}
            </View> */}
          </View>
        </View>
        <InfoReportScreen
          onClose={() => setModalVisible(false)}
          visible={modalVisible}
          reportPress={reportPress}
        />


        <Modal visible={visible} transparent animationType="slide">
          <View style={styles.modalWrapper}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <AntDesign name="close" size={20} color="#000" />
            </TouchableOpacity>

            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Tips for a safe deal</Text>

              <View style={styles.modalRow}>
                <Feather name="credit-card" size={18} color="black" />
                <Text style={styles.rowText}>
                  Don't enter UPI PIN/OTP, scan unknown QR codes, or click unsafe
                  links.
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Feather name="package" size={18} color="black" />
                <Text style={styles.rowText}>
                  Never give money or product in advance.
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Feather name="alert-circle" size={18} color="black" />
                <Text style={styles.rowText}>
                  Report suspicious users to Addvey.
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Feather name="image" size={18} color="black" />
                <Text style={styles.rowText}>
                  Don't share personal details like photos or IDs.
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Feather name="users" size={18} color="black" />
                <Text style={styles.rowText}>
                  Be cautious during buyer-seller meetings.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.modalButtonText}>Continue to chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <ReportDetailModal
        visible={reportModat}
        onClose={() => setReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatMessagingScreen;
