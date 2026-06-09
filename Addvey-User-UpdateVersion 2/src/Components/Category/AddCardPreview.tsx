import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleUnFavorite, handleFavorite, PostAPi } from "../../api/getApi/getApi"; // Adjust path as needed
import InfoReportScreen from "../Chat/InfoReportScreen";
import ReportDetailModal from "../Profile/ReportDetailModal";
import { EndPoints } from "../../services/EndPoints";

const { width } = Dimensions.get("window");

const IMAGES = [
  require("../../../assets/images/carcard.png"),
  require("../../../assets/images/carcard.png"),
  require("../../../assets/images/carcard.png"),
];

const AddCardPreview = ({ item, onFavoriteUpdate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(item?.isFavorite || false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const topTypeLabel = String(item?.type || "sell").toLowerCase();

    const [reportModat, setReportModal] = useState(false)
  const [visible, setVisible] = useState(false)
   const [modalVisible, setModalVisible] = useState(false);
  
    const handleReport = () => {
      setModalVisible(true);
      // Alert.alert("Report", "Report this user or conversation?");
    };
    
const [loading, setLoading] = useState(false)
    const handleReportSubmit = async (text: string) => {
    console.log("User submitted:", text);
    setLoading(true);
    const userToken = await AsyncStorage.getItem("authToken");
    // \"abuse\"|\"spam\"|\"other\"

    const param = {
      url: EndPoints.addReport,
      body: {
        productId: item?.id,
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
 
  const reportPress = () => {
    setModalVisible(false)
    setReportModal(true)
  }

  const renderImageItem = ({ item }: { item: any }) => (
    <View style={{ width: width }}>
      <Image source={item} style={styles.cardImage} />
    </View>
  );

  const renderDot = (_: any, i: number) => (
    <View key={i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
  );

  // Handle favorite/unfavorite
  const handleFavoritePress = async () => {
    if (isLoading) return;
  
    const userToken = await AsyncStorage.getItem("authToken");
  
    if(userToken == null){
        return navigation.navigate("Login")
    }

    setIsLoading(true);
    const previousState = isFavorite;
    
    // Optimistic UI update
    setIsFavorite(!isFavorite);
    
    try {
      let success;
      
      if (previousState) {
        // Remove from favorites - pass as array
        success = await handleUnFavorite([item.id]);
      } else {
        // Add to favorites
        success = await handleFavorite(item.id);
      }
      
      if (!success) {
        // Revert if API call failed
        setIsFavorite(previousState);
        Alert.alert("Error", "Failed to update favorites");
      } else {
        // Notify parent component if needed
        if (onFavoriteUpdate) {
          onFavoriteUpdate(item.id, !previousState);
        }
      }
    } catch (error) {
      console.log("Favorite error:", error);
      setIsFavorite(previousState);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      // Your share logic here
      Alert.alert("Share", "Share functionality would go here");
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  // Handle call functionality
  const handleCall = () => {
    const phoneNumber = item?.creator?.phone;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert("Error", "Phone number not available");
    }
  };

  // Handle social links
  const handleSocialLink = (url) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "Could not open link");
      });
    }
  };

  // Handle chat navigation
  const handleChat = () => {
    navigation.navigate("ChatMessaging", {
      receiverId: item?.creator?.id,
      receiverName: item?.creator?.profile?.name,
      productId: item?.id,
      productName: item?.name,
      productLocation: item?.location?.city || "",
      price: item?.price,
    });
  };

  return (
    <View style={{ marginBottom: hp(3) }}>
      <View style={styles.card}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={
              item?.creator?.profile?.image 
                ? { uri: `https://api.addvey.com${item.creator.profile.image}` }
                : require("../../../assets/images/pandit.png")
            }
            style={styles.profileImage}
          />
          <View style={{ flex: 1, marginLeft: wp(2) }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.profileName}>
                {item?.creator?.profile?.name || "Nanda"}
              </Text>
              <Text style={styles.profileRole}>
                {item?.creator?.role || "Dealer"}
              </Text>
              <Image
                source={require("../../../assets/images/save.png")}
                style={styles.verifyIcon}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: hp(0.3),
              }}
            >
              <Ionicons name="location-outline" size={12} color="#FF0303" />
              <Text style={styles.profileLocation}>
                {item?.location?.city ? `${item.location.city} · ` : ""}
                {item?.location?.address || "Kphb Bagyanagar Colony"}
              </Text>
            </View>
          </View>

          {/* Navigation Icon with Shadow */}
          <TouchableOpacity style={styles.navigationButton}>
            <MaterialCommunityIcons
              name="navigation-variant"
              size={hp(2.2)}
              color="#6C63FF"
            />
          </TouchableOpacity>
        </View>

        {/* Image Slider */}
        <View style={styles.imageWrapper}>
          <FlatList
            data={item?.images?.length > 0 ? item.images.map(img => ({ uri: `https://api.addvey.com${img}` })) : IMAGES}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slideIndex = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(slideIndex);
            }}
            renderItem={renderImageItem}
          />

          {/* Like New Tag */}
          <View style={styles.likeNewTag}>
            <Text style={styles.likeNewText}>{topTypeLabel}</Text>
          </View>

          {/* Sell Tag */}
          <View style={styles.sellTag}>
            <Text style={styles.sellText}>{item?.type || "Sell"}</Text>
            <View style={styles.sellTagTriangle} />
          </View>

          {/* Right Actions */}
          <View style={styles.rightActions}>
            <TouchableOpacity 
              style={styles.rightActionBox}
              onPress={handleFavoritePress}
              disabled={isLoading}
            >
              <MaterialCommunityIcons
                name={isFavorite ? "cards-heart" : "cards-heart-outline"}
                size={hp(1.6)}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.rightActionBox}
              onPress={handleShare}
            >
              <Octicons name="share" size={hp(1.6)} color="white" />
            </TouchableOpacity>
          </View>

          {/* Slider Dots */}
          <View style={styles.sliderDots}>
            {(item?.images?.length > 0 ? item.images : IMAGES).map(renderDot)}
          </View>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Image
                source={
                  item?.supersubcategory?.image
                    ? { uri: `https://api.addvey.com${item.supersubcategory.image}` }
                    : require("../../../assets/images/car.png")
                }
                style={styles.smallCarImage}
              />
              <Text style={styles.rowText}>
                {item?.supersubcategory?.name || "Car"}
              </Text>
            </View>
            <Text style={styles.rowRightText}>
              {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "29 JUL 2024"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTextBottom}>
              {item?.name || "Bentley Continental GT"}
            </Text>
            <Text style={styles.rowRightTextBottom}>
              ₹ {item?.price ? item.price.toLocaleString() : "2,30,00,000"}
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <View style={styles.bottomLeft}>
            {/* Call Icon */}
            <TouchableOpacity 
              style={styles.callIconContainer}
              onPress={handleCall}
            >
              <Ionicons name="call" size={hp(1.5)} color="#6C63FF" />
            </TouchableOpacity>

            {/* Social Icons */}
            {item?.creator?.profile?.socialLinks?.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSocialLink(link.url)}
              >
                <Image
                  source={
                    link.platform === 'instagram' 
                      ? require("../../../assets/images/instagram.png")
                      : link.platform === 'whatsapp'
                      ? require("../../../assets/images/wts.png")
                      : require("../../../assets/images/default-social.png")
                  }
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Message Button + Right Icon */}
          <View style={styles.bottomRight}>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleChat}
            >
              <MaterialCommunityIcons
                name="message"
                size={hp(2)}
                color="#6C63FF"
              />
              <Text style={styles.messageText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <AntDesign name="info-circle" size={hp(2.2)} color="#00000075" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
        <InfoReportScreen
          onClose={() => setModalVisible(false)}
          visible={modalVisible}
          reportPress={reportPress}
        />
         <ReportDetailModal
        visible={reportModat}
        onClose={() => setReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </View>
  );
};

// Keep the same styles object as before...
const styles = StyleSheet.create({
  // ... your existing styles remain exactly the same
  card: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    marginBottom: hp(1),
    overflow: "hidden",
    borderColor: "#eee",
    borderWidth: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
  profileName: {
    fontSize: hp(1.8),
    fontWeight: "700",
    color: "#000",
  },
  profileRole: {
    fontSize: hp(1.4),
    color: "#555",
    marginLeft: wp(1),
  },
  verifyIcon: {
    width: wp(3),
    height: wp(3),
    resizeMode: "contain",
    marginLeft: wp(1),
  },
  profileLocation: {
    fontSize: hp(1.3),
    color: "#6E533F",
  },
  navigationButton: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  imageWrapper: {
    position: "relative",
    width: width,
    borderBottomRightRadius: wp(4),
    overflow: "hidden",
  },
  cardImage: {
    width: width,
    height: hp(22),
    resizeMode: "cover",
  },
  likeNewTag: {
    position: "absolute",
    top: hp(0),
    left: wp(-1),
    backgroundColor: "#6C63FF",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderBottomRightRadius: wp(10),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  likeNewText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1),
  },
  sellTag: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.2),
    flexDirection: "row",
    alignItems: "center",
  },
  sellTagTriangle: {
    position: "absolute",
    right: -wp(5),
    top: 0,
    width: 0,
    height: 0,
    borderTopWidth: hp(3),
    borderBottomWidth: hp(3),
    borderLeftWidth: wp(5),
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "white",
  },
  sellText: {
    color: "#00000099",
    fontSize: hp(1.4),
    fontWeight: "600",
  },
  rightActions: {
    position: "absolute",
    top: hp(1),
    right: wp(15),
    flexDirection: "row",
    alignItems: "center",
  },
  rightActionBox: {
    backgroundColor: "rgba(0, 0, 0, 0.13)",
    borderRadius: wp(20),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.8),
    marginLeft: wp(2),
    flexDirection: "row",
    alignItems: "center",
  },
  rightActionText: {
    fontSize: hp(1.4),
    fontWeight: "500",
    color: "white",
    marginLeft: wp(0.5),
  },
  sliderDots: {
    position: "absolute",
    bottom: hp(1),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: wp(1),
    height: wp(1),
    borderRadius: wp(1),
    backgroundColor: "#D9D9D9",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#6A5AE0",
  },
  cardContent: {
    padding: wp(4),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallCarImage: {
    width: wp(8),
    height: wp(8),
    resizeMode: "contain",
    marginRight: wp(2),
  },
  rowText: {
    fontSize: hp(1.5),
    color: "#333",
  },
  rowTextBottom: {
    fontSize: hp(1.6),
    color: "black",
    fontWeight: "600",
  },
  rowRightText: {
    fontSize: hp(1.3),
    color: "#444",
  },
  rowRightTextBottom: {
    fontSize: hp(1.7),
    fontWeight: "600",
    color: "black",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bottomLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  callIconContainer: {
    backgroundColor: "#fff",
    borderRadius: wp(6),
    padding: wp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginRight: wp(2),
  },
  socialIcon: {
    width: wp(7),
    height: wp(7),
    resizeMode: "contain",
    marginHorizontal: wp(1),
  },
  bottomRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: wp(6),
    marginRight: wp(1),
    borderColor: "#6C63FF",
    borderWidth: 1,
  },
  messageText: {
    color: "#6C63FF",
    fontSize: hp(1.4),
    marginLeft: wp(1),
    fontFamily: "Poppins-Medium",
  },
  iconButton: {
    padding: wp(2),
  },
});

export default AddCardPreview;