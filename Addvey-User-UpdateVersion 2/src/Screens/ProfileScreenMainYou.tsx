// ProfileScreenMainYou.tsx
import React, { useCallback, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  FontAwesome6,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { EndPoints } from "../services/EndPoints";
import AddCardPreview from "../Components/MainHome/AddCardPreview";
import { openWhatsApp } from "../services/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteApi, PostAPi, handleFavorite, handleUnFavorite } from "../api/getApi/getApi";
import { SocialIcon } from "../Components/CommonFunction";
import LoadingModal from "../Components/Loader";

const ProfileScreenMainYou = () => {
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
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      {loading && <LoadingModal />}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={16} color="#FF0303" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate("BuySellSearch")}
        >
          <Ionicons
            name="search"
            size={hp(2)}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search here"
            placeholderTextColor="#999"
            style={styles.searchInput}
            editable={false}
          />
          <Image
            source={require("../../assets/images/mic.png")}
            style={styles.micImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("QRCodeScanner")}>
          <MaterialIcons name="qr-code-scanner" size={wp("7%")} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location Section */}
        <View style={styles.locationContainer}>
          <View style={styles.locationLeft}>
            <Ionicons
              name="location-outline"
              size={hp(1.4)}
              color="#FF0303"
              style={{ marginRight: wp(1) }}
            />
            <Text style={styles.locationText}>
              <Text style={{ color: "#6C63FF" }}>1.2 </Text> km away ·{" "}
              {data?.location?.city}

            </Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={() => openMaps()}>
            <MaterialCommunityIcons
              name="navigation-variant"
              size={18}
              color="#6C63FF"
            />
          </TouchableOpacity>
        </View>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{
              uri: data?.images[0]?.startsWith("http")
                ? data.images[0]
                : IMAGE_BASE_URL + data?.images[0],
            }}
            style={styles.coverImage}
          />

          {/* Stats Overlay */}
          <View style={styles.overlayIcons}>
            <View style={styles.overlayItem}>
              <Ionicons name="people-outline" size={hp(2)} color="#fff" />
              <Text style={styles.overlayText}>{data?.views}</Text>
            </View>
            <TouchableOpacity style={styles.overlayItem} onPress={handleFavoritePress}>
              <Ionicons
                name={isFavorite(data?.id) ? "heart" : "heart-outline"}
                size={hp(2)}
                color={isFavorite(data?.id) ? "red" : "#fff"}
              />
              <Text style={styles.overlayText}>{likesCount}</Text>
            </TouchableOpacity>
            <View style={styles.overlayItem}>
              <Ionicons name="share-outline" size={hp(2)} color="#fff" />
              <Text style={styles.overlayText}>{data?.shares}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.infoIconContainer}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name="information-circle-outline"
              size={hp(3)}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Modal */}
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
              (data?.creator?.profile?.image && !imageError)
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
          {/* Name Row */}
          <View style={styles.nameActionRow}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{data?.creator?.profile?.name}</Text>
              <Image
                source={require("../../assets/images/save.png")}
                style={styles.verifiedIcon}
              />
            </View>
          </View>

          <View style={styles.actionsBelowName}>
            <View style={styles.actionsRight}>
              <TouchableOpacity
                onPress={() => openWhatsApp(data?.creator?.phone, data?.name)}
              >
                <Image
                  source={require("../../assets/images/wts.png")}
                  style={styles.whatsappImage}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => {
                  openDialPad(data?.creator?.phone);
                }}
              >
                <Ionicons name="call" size={hp(1.8)} color="#6C63FF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.unfollowBtn}
                onPress={() => followPress()}
              >
                <Text style={styles.unfollowText}>
                  {isFollow ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.phoneText}>
            Phone no: {data?.creator?.phone}, {data?.creator?.email}
          </Text>

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

          <View style={styles.gallerySection}>
            <Text style={styles.galleryLabel}>Follow us</Text>
            <View style={styles.galleryImages}>
              {data?.creator?.profile?.socialLinks?.map((link, index) => (
                <View style={styles.galleryItem}>
                  <TouchableOpacity
                    key={index}
                    style={styles.socialIconButton}
                    onPress={() => handleSocialLinkPress(link.url)}
                  >
                    <SocialIcon platform={link.platform} />
                    {/* {getSocialIcon(link.platform)} */}
                  </TouchableOpacity>
                  <Text style={styles.galleryText}>{link.platform}</Text>
                </View>
              ))}

              {/* <TouchableOpacity style={styles.galleryItem} onPress={()=>{data?.creator?.profile?.socialLinks?.includes('youtube') && Alert.alert('hiii')}}>
                                <Image
                                    source={require("../../assets/images/youtubeimg.png")}
                                    style={styles.galleryImage}
                                />
                                <Text style={styles.galleryText}>Youtube</Text>
                            </TouchableOpacity>
                            <View style={styles.galleryItem}>
                                <Image
                                    source={require("../../assets/images/facebook.png")}
                                    style={styles.galleryImage}
                                />
                                <Text style={styles.galleryText}>Facebook</Text>
                            </View>
                            <View style={styles.galleryItem}>
                                <Image
                                    source={require("../../assets/images/insta.png")}
                                    style={styles.galleryImage}
                                />
                                <Text style={styles.galleryText}>Instagram</Text>
                            </View> */}
            </View>
          </View>
        </View>
        <ProfileAddScreen id={data?.creator?.id} />
        {/* <AddCardPreview  type={'filter'} EndpointUrl={EndPoints.getProduct}/> */}
        {/* <ProfileAddScreen /> */}
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginTop: hp(1),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    flex: 1,
    marginHorizontal: wp(2),
    borderColor: "#ddd",
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: wp(1),
  },
  micImage: {
    width: hp(2.2),
    height: hp(2.2),
    marginLeft: wp(1),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: "#000",
  },

  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: hp(1.2),
    color: "#6E533F",
    flexShrink: 1,
  },
  shareButton: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: hp(0.5),
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },

  coverContainer: {
    width: "100%",
    height: hp(25),
    marginTop: hp(1),
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "90%",
    borderRadius: wp(2),
  },
  overlayIcons: {
    position: "absolute",
    right: wp(4),
    top: hp(1),
    flexDirection: "row",
    alignItems: "center",
  },
  overlayItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(2),
    backgroundColor: "#00000021",
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.2),
    borderRadius: 10,
  },
  overlayText: {
    color: "#fff",
    marginLeft: wp(0.5),
    fontSize: hp(1.6),
  },
  infoIconContainer: {
    position: "absolute",
    right: wp(3),
    bottom: hp(3.5),
  },
  profileImage: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(10),
    position: "absolute",
    left: wp(5),
    bottom: -hp(1),
  },
  socialIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 5,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 0,
    borderColor: "transparent",
  },
  infoContainer: {
    marginTop: hp(2),
    paddingHorizontal: wp(5),
  },

  nameActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: hp(2),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  verifiedIcon: {
    width: hp(2),
    height: hp(2),
    marginLeft: wp(1),
    resizeMode: "contain",
  },

  actionsBelowName: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: hp(0.5),
  },
  actionsRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  whatsappImage: {
    width: hp(4),
    height: hp(4),
    resizeMode: "contain",
    marginLeft: wp(2),
  },
  iconBtn: {
    padding: hp(0.7),
    borderRadius: wp(10),
    marginLeft: wp(2),
    borderColor: "#6C63FF",
    borderWidth: 1,
  },
  unfollowBtn: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(4),
    borderRadius: wp(5),
    marginLeft: wp(2),
  },
  unfollowText: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: hp(1.5),
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
