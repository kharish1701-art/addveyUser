import React, { memo, useState, useCallback } from "react";
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
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../helper/FormatDate";
import { shareProduct, SocialIcon } from "../CommonFunction";
import { styles } from "./AddCardPreviewStyle"; // Import your existing styles
import { PostAPi } from "../../api/getApi/getApi";
import { EndPoints } from "../../services/EndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReportDetailModal from "../Profile/ReportDetailModal";
import InfoReportScreen from "../../Screens/Chat/infoReportScreen";
import {
  buildImageSource,
  NO_IMAGE_PLACEHOLDER,
} from "../../utils/imageFallback";

const { width } = Dimensions.get("window");

export interface Product {
  id: string;
  productId?: string;
  name: string;
  price: number;
  type: string;
  views: number;
  likes?: number | string;
  shares?: number | string;
  isFavorite: boolean;
  createdAt: string;
  images: string[];
  creator: {
    id: string;
    phone?: string;
    profile: {
      name: string;
      image: string;
      socialLinks?: Array<{
        platform: string;
        url: string;
      }>;
    };
  };
  location: {
    city: string;
  };
  supersubcategory: {
    name: string;
    image: string;
  };
}

interface ProductCardProps {
  item: Product;
  onFavoritePress: (item: Product) => void;
  onNavigation: (item: Product) => void;
}

// Memoized Image Item Component
const ImageItem = memo(({ item }: { item?: string | null }) => (
  <View style={{ width: width }}>
    <Image
      source={buildImageSource(item)}
      style={styles.cardImage}
    />
  </View>
));

import { useFavorites } from "../../context/FavoritesContext";

// ... existing imports ...

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onFavoritePress,
  onNavigation,
}) => {
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites(); // Use context
  const [activeIndex, setActiveIndex] = useState(0);
  const sellBadgeWidth = width - wp(8);
  const sellBadgeHeight = hp(2.8);
  const curveStartX = sellBadgeWidth * 0.17;
  const curveControlX = sellBadgeWidth * 0.205;
  const curveEndX = sellBadgeWidth * 0.24;
  const tailTopY = sellBadgeHeight * 0.92;
  const sellBadgePath = `M0 0 H${curveStartX} Q${curveControlX} 0 ${curveEndX} ${tailTopY} H${sellBadgeWidth} V${sellBadgeHeight} H0 Z`;
  const likesCount = Number(item?.likes ?? 0) || 0;
  const sharesCount = Number(item?.shares ?? 0) || 0;
  const topTypeLabel = String(item?.type || "sell").toLowerCase();
  const productImages =
    Array.isArray(item?.images) && item.images.length > 0 ? item.images : [""];

  const getProfileImage = (image?: string) => {
    if (!image || image.includes("example.com")) {
      return NO_IMAGE_PLACEHOLDER;
    }

    return buildImageSource(image);
  };

  const openDialPad = useCallback((phoneNumber: string) => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not provided");
      return;
    }
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open the dial pad");
    });
  }, []);

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

  const renderImageItem = useCallback(
    ({ item: imageItem }: { item: string }) => <ImageItem item={imageItem} />,
    []
  );

  const handleImageScroll = useCallback((e: any) => {
    const slideIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  }, []);

  const handleCardPress = useCallback(() => {
    onNavigation(item);
  }, [item, onNavigation]);

  const handleFavorite = useCallback(async() => {
// const userToken = await AsyncStorage.getItem("authToken");
// if(userToken == null){
//   navigation.navigate("Login")
// }
    console.log("🔥 ProductCard HEART PRESSED! 🔥 Item:", item?.id);
    toggleFavorite(item.id || item.productId); // Toggle in context (handles API)
    onFavoritePress(item); // Notify parent (for list updates)
  }, [item, onFavoritePress, toggleFavorite]);

  // ... rest of component ...


  const handleShare = useCallback(() => {
    shareProduct(item.id);
  }, [item.id]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate("ProfileScreenMainYou", { data: item });
  }, [item, navigation]);

  const handleChatPress = useCallback(() => {
    navigation.navigate("ChatMessaging", {
      receiverId: item.creator.id,
      receiverName: item.creator.profile.name,
      productId: item.id,
      productName: item.name,
      productLocation: item.location.city ?? "",
      price: item.price,
    });
  }, [item, navigation]);
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

  return (
    <View style={{ marginBottom: hp(3) }}>
      <View style={styles.card}>
        {/* Profile Section */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.profileSection}
          onPress={handleProfilePress}
        >
          <Image
            source={getProfileImage(item?.creator?.profile?.image)}
            style={styles.profileImage}
          />
          <View style={{ flex: 1, marginLeft: wp(2) }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.profileName} numberOfLines={1}>
                {item.creator.profile.name}
              </Text>
              <Text style={styles.profileRole} numberOfLines={1}>
                {item.type}
              </Text>
              <Image
                source={require("../../../assets/images/save.png")}
                style={styles.verifyIcon}
              />
            </View>

            <View style={styles.profileLocationRow}>
              <Ionicons name="location-outline" size={12} color="#FF0303" />
              <Text style={styles.profileLocation} numberOfLines={1}>
                {item.location.city}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            style={styles.navigationButton}
            onPress={openMaps}
          >
            <MaterialCommunityIcons
              name="navigation-variant"
              size={hp(2.2)}
              color="#6C63FF"
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Image Slider */}
        <View style={styles.imageWrapper}>
          <FlatList
            data={productImages}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            renderItem={renderImageItem}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
          />

          <View style={styles.likeNewTag}>
            <Text style={styles.likeNewText}>{topTypeLabel}</Text>
          </View>
          <View style={styles.logoIcon}>
            <Image
              source={require("./../../../assets/images/advey.png")}
              style={{ height: 45, width: 45 }}
            />
          </View>
          <View
            style={[
              styles.sellTag,
              { width: sellBadgeWidth, height: sellBadgeHeight },
            ]}
          >
            <Svg
              width={sellBadgeWidth}
              height={sellBadgeHeight}
              style={styles.sellTagSvg}
            >
              <Path d={sellBadgePath} fill="#FFFFFF" />
            </Svg>
            <View style={styles.sellTagLabel}>
              <Text style={styles.sellText}>{item.type}</Text>
            </View>
          </View>

          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.rightActionBox}>
              <Octicons name="eye" size={hp(1.6)} color="white" />
              <Text style={{ color: "white", fontSize: 12, marginLeft: 2 }}>
                {item.views}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightActionBox}
              onPress={handleFavorite}
            >
              <MaterialCommunityIcons
                name={isFavorite(item.id || item.productId) ? "cards-heart" : "cards-heart-outline"}
                size={hp(1.6)}
                color={isFavorite(item.id || item.productId) ? "red" : "white"}
              />
              {likesCount > 0 && (
                <Text style={styles.rightActionText}>{likesCount}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightActionBox}
              onPress={handleShare}
            >
              <Octicons name="share" size={hp(1.6)} color="white" />
              {sharesCount > 0 && (
                <Text style={styles.rightActionText}>{sharesCount}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.sliderDots}>
            {productImages.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* Card Content */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCardPress}
          style={styles.cardContent}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Image
                source={buildImageSource(item?.supersubcategory?.image)}
                style={styles.smallCarImage}
              />
              <Text style={styles.rowText} numberOfLines={1}>
                {item.supersubcategory.name}
              </Text>
            </View>
            <Text style={styles.rowRightText}>
              {formatDate(item.createdAt)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTextBottom} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.rowRightTextBottom}>₹ {item.price}</Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{}}
          >
            {item.creator.profile.socialLinks.length > 0 ? (
              <TouchableOpacity
                style={styles.socialIconButton}
                onPress={() => openDialPad(item.creator.phone || "")}
              >
                <Ionicons name="call" size={20} color="#6C63FF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.messageButton, { paddingHorizontal: item.creator.profile.socialLinks.length > 0 ? wp(4) : wp(10) }]}

                onPress={() => openDialPad(item.creator.phone || "")}
              >
                <Ionicons name="call" size={20} color="#6C63FF" />

                <Text style={styles.messageText}>Call</Text>
              </TouchableOpacity>
            )}
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

          <View style={styles.bottomRight}>
            <TouchableOpacity
              style={[styles.messageButton, { paddingHorizontal: item.creator.profile.socialLinks?.length > 0 ? wp(4) : wp(10) }]}
              onPress={handleChatPress}
            >
              <MaterialCommunityIcons
                name="message"
                size={hp(2)}
                color="#6C63FF"
              />
              <Text style={styles.messageText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(true)
                // navigation.navigate("ReportDetail")
              }
            >
              <AntDesign name="info-circle" size={hp(2.2)} color="#FF0303" />
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
      </View>



    </View>
  );
};

export default memo(ProductCard);
