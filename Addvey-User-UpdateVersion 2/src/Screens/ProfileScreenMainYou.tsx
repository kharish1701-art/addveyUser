// ProfileScreenMainYou.tsx
import React, { useCallback, useRef, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Share,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import ProfileInfoModal from "../Components/Profile/ProfileInfoModal";
import ReportModal from "../Components/Profile/ReportModal";
import ReportDetailModal from "../Components/Profile/ReportDetailModal";
import ProfileAddScreen from "../Components/Profile/ProfileAddScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { EndPoints } from "../services/EndPoints";
import AddCardPreview from "../Components/MainHome/AddCardPreview";
import { openWhatsApp } from "../services/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteApi, PostAPi, handleFavorite, handleUnFavorite } from "../api/getApi/getApi";
import { SocialIcon } from "../Components/CommonFunction";
import LoadingModal from "../Components/Loader";

const ProfileScreenMainYou = () => {
  const insets = useSafeAreaInsets();
  const scrollContentRef = useRef<View>(null);
  const headerMarkerRef = useRef<View>(null);
  const [stickyThreshold, setStickyThreshold] = useState(0);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportDetailVisible, setReportDetailVisible] = useState(false);
  const route = useRoute();
  const data = route?.params?.data;
  console.log('------data from another screen ', data)
  const navigation = useNavigation();

  // Favorite state handling via Context
  const { isFavorite, toggleFavorite } = useFavorites();
  const [likesCount, setLikesCount] = useState(data?.likes || 0);

  // Toggle favorite handler
  const handleFavoritePress = async () => {
    const currentlyFavorite = isFavorite(data?.id);

    // Optimistic local count update
    setLikesCount((prev: number) => currentlyFavorite ? prev - 1 : prev + 1);

    // Use context to toggle (handles API and global state)
    toggleFavorite(data?.id);
  };
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

  const openMaps = useCallback(() => {
    const city = data?.location?.city;
    console.log(data?.location)
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
  }, [data]);
  const [selectedReport, setSelectedReport] = useState("");

  const handleReportType = (type: string) => {
    console.log("Selected Report Type:", type);
    setSelectedReport(type);

    // Example: if user chose "Inaccurate photos or details"
    // then open details modal
    // if (type === "Inaccurate photos or details") {
    setReportDetailVisible(true);
    // }
  };

  const handleReportSubmit = async (text: string) => {
    console.log("User submitted:", text, selectedReport);
    setLoading(true);
    const userToken = await AsyncStorage.getItem("authToken");
    // \"abuse\"|\"spam\"|\"other\"

    const param = {
      url: EndPoints.addReport,
      body: {
        productId: data?.id,
        reason:
          selectedReport == "Fraud"
            ? "spam"
            : selectedReport == "Duplicate ad"
              ? "spam"
              : selectedReport == "Inaccurate photos or details"
                ? "abuse"
                : selectedReport == "Offensive content"
                  ? "abuse"
                  : "other",

        type: "report",
        description: text,
      },
      token: userToken || "",
    };

    const dd = await PostAPi(param, setLoading);
    if (dd?.success) {
      console.log("<><><><><><", param.body);
      // navigation.goBack()
      setReportDetailVisible(false);
      Alert.alert("Success", "Report submitted successfully");
    }

    setReportDetailVisible(false);
    // 👉 Send to API OR show toast OR store in context
  };

  const handleSocialLinkPress = async (url) => {
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
  };
  const [loading, setLoading] = useState(false);
  const [isFollow, setFollow] = useState(data?.creator?.isFollowed);

  const followPress = async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (isFollow) {
      const param = {
        url: EndPoints.unFollow + data?.creator?.id,
        token: token,
        body: {},
        requireAuth:true
      };
      const dd = await PostAPi(param, setLoading);
      console.log(dd);
      if (dd?.success) {
        setFollow(false);
      } else {
        const param = {
          url: EndPoints.addFollow,
          token: token,
          body: {
            followeeId: data?.creator?.id,
          },
          requireAuth:true
        };
        const dd = await PostAPi(param, setLoading);
        console.log(dd);
        if (dd?.success) {
          setFollow(true);
        }
      }
    } else {
      const param = {
        url: EndPoints.addFollow,
        token: token,
        body: {
          followeeId: data?.creator?.id,
        },
        requireAuth:true
      };
      const dd = await PostAPi(param, setLoading);
      console.log(dd);
      if (dd?.success) {
        setFollow(true);
      } else {
        const param = {
          url: EndPoints.unFollow + data?.creator?.id,
          token: token,
          body: {},
          requireAuth:true
        };
        const dd = await PostAPi(param, setLoading);
        console.log(dd);
        if (dd?.success) {
          setFollow(false);
        }
      }
    }
  };

  // Get social icon based on platform
  // const getSocialIcon = (platform) => {
  //   const iconProps = { size: 20, color: "#6C63FF" };

  //   switch (platform.toLowerCase()) {
  //     case "twitter":
  //       return <FontAwesome6 name="x-twitter" {...iconProps} />;
  //     case "facebook":
  //       return <FontAwesome name="facebook" {...iconProps} />;
  //     case "instagram":
  //       return <FontAwesome name="instagram" {...iconProps} />;
  //     case "linkedin":
  //       return <FontAwesome name="linkedin" {...iconProps} />;
  //     case "youtube":
  //       return <FontAwesome name="youtube" {...iconProps} />;
  //     case "whatsapp":
  //       return <FontAwesome name="whatsapp" {...iconProps} />;
  //     case "website":
  //       return <FontAwesome name="globe" {...iconProps} />;
  //     case "telegram":
  //       return <FontAwesome name="telegram" {...iconProps} />;
  //     case "tiktok":
  //       return <FontAwesome5 name="tiktok" {...iconProps} />;
  //     case "snapchat":
  //       return <FontAwesome5 name="snapchat" {...iconProps} />;
  //     case "pinterest":
  //       return <FontAwesome name="pinterest" {...iconProps} />;
  //     case "reddit":
  //       return <FontAwesome5 name="reddit" {...iconProps} />;
  //     case "discord":
  //       return <FontAwesome5 name="discord" {...iconProps} />;
  //     case "github":
  //       return <FontAwesome name="github" {...iconProps} />;
  //     case "medium":
  //       return <AntDesign name="medium" {...iconProps} />;
  //     case "spotify":
  //       return <FontAwesome5 name="spotify" {...iconProps} />;
  //     default:
  //       return <MaterialIcons name="link" {...iconProps} />;
  //   }
  // };
  const coverUri = data?.images?.[0]
    ? data.images[0].startsWith("http")
      ? data.images[0]
      : IMAGE_BASE_URL + data.images[0]
    : null;

  const distanceLabel =
    data?.distance != null ? `${data.distance}` : "1.2";

  const socialLinks = data?.creator?.profile?.socialLinks ?? [];

  const measureStickyThreshold = useCallback(() => {
    if (!scrollContentRef.current || !headerMarkerRef.current) return;

    headerMarkerRef.current.measureLayout(
      scrollContentRef.current,
      (_x, y) => {
        setStickyThreshold(y);
      },
      () => {}
    );
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      const shouldShow =
        stickyThreshold > 0 && scrollY >= stickyThreshold - insets.top - hp(0.3);
      setShowStickySearch((prev) =>
        prev === shouldShow ? prev : shouldShow
      );
    },
    [stickyThreshold, insets.top]
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${data?.creator?.profile?.name}'s profile on Addvey`,
      });
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Could not share");
    }
  };

  const renderStatAction = (
    key: string,
    icon: React.ReactNode,
    label: string,
    onPress?: () => void,
    labelStyle?: object
  ) => (
    <TouchableOpacity
      key={key}
      style={styles.statActionItem}
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.statActionCircle}>{icon}</View>
      <Text style={[styles.statActionLabel, labelStyle]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {loading && <LoadingModal />}

      {showStickySearch && (
        <View style={[styles.stickySearchBar, { paddingTop: insets.top + hp(0.5) }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={16} color="#FF0303" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.stickySearchInputWrap}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("BuySellSearch")}
          >
            <Ionicons name="search" size={hp(2)} color="#999" />
            <TextInput
              placeholder="Search here"
              placeholderTextColor="#999"
              style={styles.stickySearchInput}
              editable={false}
              pointerEvents="none"
            />
            <Image
              source={require("../../assets/images/mic.png")}
              style={styles.stickyMicImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("QRCodeScanner")}>
            <MaterialIcons name="qr-code-scanner" size={wp("7%")} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View
          ref={scrollContentRef}
          collapsable={false}
          onLayout={measureStickyThreshold}
        >
        {/* Hero cover with floating controls */}
        <View style={styles.heroSection}>
          <Image
            source={
              coverUri
                ? { uri: coverUri }
                : require("../../assets/images/slidbike.jpeg")
            }
            style={styles.coverImage}
          />

          <View style={[styles.heroTopBar, { paddingTop: insets.top + hp(0.8) }]}>
            <TouchableOpacity
              style={styles.heroCircleBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={22} color="#000" />
            </TouchableOpacity>

            <View style={styles.heroTopRight}>
              <TouchableOpacity
                style={[styles.heroCircleBtn, { marginRight: wp(2.5) }]}
                onPress={() => navigation.navigate("QRCodeScanner")}
              >
                <MaterialIcons name="qr-code-scanner" size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroCircleBtn}
                onPress={() => navigation.navigate("BuySellSearch")}
              >
                <Ionicons name="search" size={22} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <ProfileInfoModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onReportPress={() => {
              setModalVisible(false);
              setTimeout(() => setReportModalVisible(true), 300);
            }}
          />

          <ReportModal
            visible={reportModalVisible}
            onClose={() => setReportModalVisible(false)}
            onOptionSelect={handleReportType}
          />

          <ReportDetailModal
            visible={reportDetailVisible}
            onClose={() => setReportDetailVisible(false)}
            onSubmit={handleReportSubmit}
          />

          <Image
            source={
              data?.creator?.profile?.image && !imageError
                ? {
                    uri: data.creator.profile.image.startsWith("http")
                      ? data.creator.profile.image
                      : IMAGE_BASE_URL + data.creator.profile.image,
                  }
                : require("../../assets/images/slidbike.jpeg")
            }
            style={styles.profileImage}
            onError={() => setImageError(true)}
          />
        </View>

        {/* User Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameFollowRow}>
            <View style={styles.nameBlock}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{data?.creator?.profile?.name}</Text>
                <Image
                  source={require("../../assets/images/save.png")}
                  style={styles.verifiedIcon}
                />
              </View>
              <View style={styles.locationRow}>
                <Entypo name="location-pin" size={wp(5)} color="#FF0303" />
                <Text style={styles.locationText}>
                  {distanceLabel} km away . {data?.location?.city}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.unfollowBtn}
              onPress={() => followPress()}
            >
              <Text style={styles.unfollowText}>
                {isFollow ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            ref={headerMarkerRef}
            onLayout={measureStickyThreshold}
            collapsable={false}
            style={styles.headerScrollMarker}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsActionRow}
          >
            {renderStatAction(
              "views",
              <Ionicons name="eye-outline" size={hp(2.2)} color="#000" />,
              String(data?.views ?? 0)
            )}
            {renderStatAction(
              "likes",
              <Ionicons
                name={isFavorite(data?.id) ? "heart" : "heart-outline"}
                size={hp(2.2)}
                color="#FF0303"
              />,
              String(likesCount),
              handleFavoritePress
            )}
            {renderStatAction(
              "shares",
              <Ionicons name="share-social-outline" size={hp(2.2)} color="#6C63FF" />,
              String(data?.shares ?? 0),
              handleShare
            )}
            {renderStatAction(
              "distance",
              <MaterialCommunityIcons
                name="navigation-variant"
                size={hp(2.2)}
                color="#6C63FF"
              />,
              `${distanceLabel} km`,
              openMaps,
              styles.statActionLabelBlue
            )}
            {renderStatAction(
              "report",
              <Ionicons name="warning-outline" size={hp(2.2)} color="#FF0303" />,
              "Report",
              () => setReportModalVisible(true),
              styles.statActionLabelRed
            )}
            {socialLinks.map((link: any, index: number) =>
              renderStatAction(
                `social-${index}`,
                <SocialIcon platform={link.platform} size={hp(2.4)} />,
                link.platform,
                () => handleSocialLinkPress(link.url),
                styles.statActionLabelMuted
              )
            )}
            {renderStatAction(
              "whatsapp",
              <Image
                source={require("../../assets/images/wts.png")}
                style={styles.statWhatsappIcon}
              />,
              "WhatsApp",
              () => openWhatsApp(data?.creator?.phone, data?.name),
              styles.statActionLabelMuted
            )}
            {renderStatAction(
              "call",
              <Ionicons name="call" size={hp(2.2)} color="#6C63FF" />,
              "Call",
              () => openDialPad(data?.creator?.phone),
              styles.statActionLabelBlue
            )}
            {renderStatAction(
              "info",
              <Ionicons
                name="information-circle-outline"
                size={hp(2.2)}
                color="#6C63FF"
              />,
              "Info",
              () => setModalVisible(true),
              styles.statActionLabelBlue
            )}
          </ScrollView>

          {/* <Text style={styles.phoneText}>
            Phone no: {data?.creator?.phone}, {data?.creator?.email}
          </Text> */}

          <View style={styles.row}>
            <MaterialIcons
              name="calendar-today"
              size={hp(1.8)}
              color="#6E533F"
            />
            <Text style={styles.rowText}>
              Joined {data?.creator?.updatedAt?.split("T")[0]}
            </Text>
          </View>

          <View style={styles.row}>
            <AntDesign name="file-add" size={hp(1.8)} color="#555" />
            <Text style={styles.rowText}>
              {data?.creator?.productsCount} Ads
            </Text>
          </View>

          <Text style={styles.languages}>
            Seller Speaks:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {data?.creator?.languages?.join(", ")}
            </Text>
          </Text>

        </View>
        
        <ProfileAddScreen id={data?.creator?.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreenMainYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stickySearchBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingBottom: hp(1),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  stickySearchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    marginHorizontal: wp(2),
    borderColor: "#ddd",
    borderWidth: 1,
    height: hp(5),
  },
  stickySearchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: "#000",
    marginLeft: wp(1),
  },
  stickyMicImage: {
    width: hp(2.2),
    height: hp(2.2),
    marginLeft: wp(1),
  },
  headerScrollMarker: {
    height: 1,
    width: "100%",
  },
  heroSection: {
    width: "100%",
    height: hp(28),
    position: "relative",
    marginBottom: hp(3),
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: wp(5),
    borderBottomRightRadius: wp(5),
  },
  heroTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    zIndex: 10,
  },
  heroTopRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroCircleBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  locationText: {
    fontSize: hp(1.7),
    color: "#6E533F",
    marginLeft: wp(1),
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.4),
  },
  statsActionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: hp(2),
    paddingBottom: hp(0.5),
    paddingRight: wp(2),
  },
  statActionItem: {
    alignItems: "center",
    width: wp(15),
    marginRight: wp(1),
  },
  statActionCircle: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  statActionLabel: {
    fontSize: hp(1.35),
    color: "#000",
    marginTop: hp(0.6),
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    width: "100%",
  },
  statActionLabelBlue: {
    color: "#6C63FF",
  },
  statActionLabelRed: {
    color: "#FF0303",
  },
  statActionLabelMuted: {
    color: "#888",
    textTransform: "lowercase",
  },
  profileImage: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    position: "absolute",
    left: wp(5),
    bottom: -hp(4),
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  socialIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  infoContainer: {
    marginTop: hp(1),
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
  },
  nameFollowRow: {
    flexDirection: "row",
    marginTop: hp(1),
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  nameBlock: {
    flex: 1,
    paddingRight: wp(2),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: hp(2.5),
    color: "#000",
    fontFamily: "Poppins-SemiBold",
    fontWeight: "700",
  },
  verifiedIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginLeft: wp(1.8),
    resizeMode: "contain",
  },
  statWhatsappIcon: {
    width: hp(2.6),
    height: hp(2.6),
    resizeMode: "contain",
  },
  unfollowBtn: {
    borderWidth: 1.5,
    borderColor: "#6C63FF",
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: wp(6),
    backgroundColor: "#fff",
    marginTop: hp(0.2),
  },
  unfollowText: {
    color: "#6C63FF",
    fontWeight: "800",
    fontSize: hp(2),
    fontFamily: "Poppins-Bold",
  },

  phoneText: {
    fontSize: hp(1.4),
    color: "#000000",
    marginTop: hp(2.5),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(2),
  },
  rowText: {
    fontSize: hp(1.4),
    color: "#333",
    marginLeft: wp(2),
    fontWeight: "bold"
  },
  languages: {
    marginTop: hp(1.5),
    fontSize: hp(1.4),
    color: "#333",
  },

  gallerySection: {
    marginTop: hp(4),
  },
  galleryLabel: {
    fontSize: hp(1.8),
    color: "#000",
    fontWeight: "600",
    marginBottom: hp(1),
  },
  galleryImages: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: hp(1),
  },
  galleryItem: {
    alignItems: "center",
    marginRight: wp(5),
  },
  galleryImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
    marginBottom: hp(0.3),
  },
  galleryText: {
    fontSize: hp(1.2),
    color: "#555",
  },
  moreText: {
    fontSize: hp(1.4),
    color: "#6C63FF",
    fontWeight: "500",
    marginTop: hp(1),
  },
});
