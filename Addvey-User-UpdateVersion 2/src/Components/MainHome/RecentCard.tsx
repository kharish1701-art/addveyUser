import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, Ionicons, Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { shareProduct, SocialIcon } from "../CommonFunction";
import ReportDetailModal from "../Profile/ReportDetailModal";
import { PostAPi } from "../../api/getApi/getApi";
import { EndPoints } from "../../services/EndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoReportScreen from "../../Screens/Chat/infoReportScreen";
import { buildImageSource } from "../../utils/imageFallback";

import { useFavorites } from "../../context/FavoritesContext";

const { width } = Dimensions.get("window");

const RecentCard: React.FC = ({
  item,
  onFavoritePress,
  onNavigation,
  isSelected,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [reportModat, setReportModal] = useState(false)
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
  const [modalVisible, setModalVisible] = useState(false);

  const handleReport = () => {
    setModalVisible(true);
    // Alert.alert("Report", "Report this user or conversation?");
  };
  const reportPress = () => {
    setModalVisible(false)
    setReportModal(true)
  }
  const cardImages =
    Array.isArray(item?.images) && item.images.length > 0
      ? item.images
      : Array.isArray(item?.product?.images) && item.product.images.length > 0
        ? item.product.images
        : [""];

  const openMaps = useCallback(() => {
    const city = item?.location?.city;
    console.log(item)
    if (city) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        city
      )}`;
      Linking.openURL(url).catch((err) =>
        console.error("An error occurred", err)
      );
    } else {
      Alert.alert("Error", "Location not available");
    }
  }, [item]);


  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );
  // console.log(item);
  const navigation = useNavigation();
  const openDialPad = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not provided");
      return;
    }

    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open the dial pad");
    });
  };

  const handleSocialLinkPress = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "Failed to open link");
    }
  }, []);
  const handleFavorite = useCallback(() => {
    onFavoritePress(item);
  }, [item, onFavoritePress]);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        styles.card,
        //  {borderColor:isSelected ? '#007AFF':'transparent', borderWidth:1}
      ]}
      onPress={() =>
        navigation.navigate("AddPreview", { from: "home", data: item })
      }
    >
      {/* Image Slider */}
      <View style={styles.imageWrapper}>
        <Animated.FlatList
          data={cardImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(_, i) => i.toString()}
          onScroll={handleScroll}
          onMomentumScrollEnd={(e) => {
            const index = Math.floor(
              e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width
            );
            setActiveIndex(index);
          }}
          renderItem={({ item: imageItem }) => (
            <Image
              source={buildImageSource(imageItem)}
              style={styles.cardImage}
            />
          )}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {cardImages.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { opacity: i === activeIndex ? 1 : 0.3 }]}
            />
          ))}
        </View>

        {/* Top Left Label */}
        <View style={styles.topLeftTag}>
          <Text style={styles.sellText}>{item?.type}</Text>
        </View>

        {/* Bottom Left Label */}
        <View style={styles.bottomLeftTagContainer}>
          <View style={styles.bottomLeftTag}>
            <Image
              source={buildImageSource(
                item?.supersubcategory?.image || item?.product?.supersubcategory?.image
              )}
              style={styles.smallLeftIcon}
            />
            <Text style={styles.bottomLeftText}>
              {item?.supersubcategory?.name}. {item?.type}
            </Text>
          </View>
        </View>

        {/* Top Right Icons */}
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => toggleFavorite(item.id || item.productId)}
          >
            <MaterialCommunityIcons
              name={isFavorite(item.id || item.productId) ? "cards-heart" : "cards-heart-outline"}
              size={hp(1.5)}
              color={isFavorite(item.id || item.productId) ? "red" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => shareProduct(item?.id)}
          >
            <Octicons name="share" size={hp(1.5)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircleSend} onPress={() => openMaps()}>
            <FontAwesome name="send" size={hp(1.3)} color="#6C63FF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Details */}
      <View style={styles.cardContent}>
        <View style={styles.rowBetween}>
          <Text style={styles.rowTextBottom}>{item?.name}</Text>
          <View style={styles.rightTextBlock}>
            <Text style={styles.dateText}>
              {item?.createdAt?.split("T")[0]}
            </Text>
            <Text style={styles.rowRightTextBottom}>₹ {item?.price}</Text>
          </View>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footerContainer}>
        <View style={styles.footerLeft}>
          <ScrollView horizontal style={{ flex: 1 }}>
            {/* Circular white call icon with shadow */}

            {item.creator.profile.socialLinks.length > 0 ? (
              <TouchableOpacity
                style={styles.footerIconCircle}
                onPress={() => openDialPad(item?.creator?.phone)}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={hp(2.2)}
                  color="#6C63FF"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.chatButton, { paddingHorizontal: item.creator.profile.socialLinks.length > 0 ? wp(3) : wp(5) }]}
                onPress={() => openDialPad(item?.creator?.phone)}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={hp(2.2)}
                  color="#6C63FF"
                />
                <Text style={styles.chatText}>Call</Text>
              </TouchableOpacity>
            )}
            {/* Instagram icon */}
            {/* <TouchableOpacity style={styles.footerIcon}>
            <Image
              source={require("../../../assets/images/instagram.png")}
              style={styles.instagramIcon}
            />
          </TouchableOpacity> */}
            {/* <SocialIcon /> */}
            {item.creator.profile.socialLinks?.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialIconButton}
                onPress={() => handleSocialLinkPress(link.url)}
              >
                <SocialIcon platform={link.platform} />
              </TouchableOpacity>
            ))}
            {item.creator.profile.socialLinks?.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialIconButton}
                onPress={() => handleSocialLinkPress(link.url)}
              >
                <SocialIcon platform={link.platform} />
              </TouchableOpacity>
            ))}


          </ScrollView>
        </View>

        <View style={styles.footerRight}>
          <TouchableOpacity
            style={[styles.chatButton, { paddingHorizontal: item.creator.profile.socialLinks.length > 0 ? wp(3) : wp(5) }]}
            onPress={() =>
              navigation.navigate("ChatMessaging", {
                receiverId: item?.creator?.id,
                receiverName: item?.creator?.profile?.name,
                productId: item?.id,
                productName: item?.name,
                productLocation: item?.location?.city ?? "",
                price: item?.price,
              })
            }
          >
            <MaterialCommunityIcons
              name="message"
              size={hp(2)}
              color="#6C63FF"
            />
            <Text style={styles.chatText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOutside} onPress={() => {
            // navigation.navigate("ReportDetail")
            setModalVisible(true)
          }}>
            <AntDesign name="info-circle" size={16} color="#00000075" />
          </TouchableOpacity>
        </View>
      </View>
      <ReportDetailModal
        visible={reportModat}
        onClose={() => setReportModal(false)}
        onSubmit={handleReportSubmit}
      />
      <InfoReportScreen
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        reportPress={reportPress}
        from={'product'}
      />

    </TouchableOpacity>
  );
};

export default RecentCard;

const styles = StyleSheet.create({
  card: {
    width: wp(65),
    backgroundColor: "#fff",
    borderRadius: wp(5),
    marginRight: wp(4),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: "hidden",
    marginTop: hp(1),
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: hp(15),
  },
  cardImage: {
    width: width * 0.65,
    height: hp(20),
    resizeMode: "cover",
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
  },
  pagination: {
    position: "absolute",
    bottom: hp(0.8),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: wp(1.2),
    height: wp(1.2),
    borderRadius: wp(1.1),
    backgroundColor: "#fff",
    marginHorizontal: wp(0.6),
  },
  topLeftTag: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#6C63FF",
    borderBottomRightRadius: wp(6),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
  },
  sellText: {
    fontSize: hp(1),
    color: "#fff",
    fontWeight: "600",
  },
  bottomLeftTagContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bottomLeftTag: {
    backgroundColor: "#fff",
    borderTopRightRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
  },
  smallLeftIcon: {
    width: wp(3.5),
    height: wp(3.5),
    resizeMode: "contain",
    marginRight: wp(1),
  },
  bottomLeftText: {
    fontSize: hp(1),
    fontWeight: "600",
    color: "#000",
  },
  rightIcons: {
    position: "absolute",
    top: hp(1),
    right: wp(3),
    flexDirection: "row",
  },
  iconCircle: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    backgroundColor: "rgba(0, 0, 0, 0.29)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp(2),
  },
  iconCircleSend: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp(2),
  },
  cardContent: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1.5),
    paddingBottom: hp(0.8),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rowTextBottom: {
    fontSize: hp(1.4),
    color: "black",
    flex: 1,
    fontFamily: "Poppins-Regular",
  },
  rightTextBlock: {
    alignItems: "flex-end",
  },
  rowRightTextBottom: {
    fontSize: hp(1.3),
    fontWeight: "600",
    color: "#000",
    top: hp(-0.8),
  },
  dateText: {
    fontSize: hp(1),
    color: "#000",
    marginBottom: hp(0.3),
    top: hp(-1),
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    paddingBottom: hp(1.5),
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
  },
  footerIconCircle: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(2),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  footerIcon: {
    marginRight: wp(3),
  },
  instagramIcon: {
    width: wp(7),
    height: wp(7),
    resizeMode: "contain",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    borderColor: "#6C63FF",
    borderWidth: 1,
  },
  chatText: {
    color: "#6C63FF",
    fontSize: hp(1.4),
    marginHorizontal: wp(1),
    fontFamily: "Poppins-Medium",
  },
  shareOutside: {
    marginLeft: wp(3),
  },
});
