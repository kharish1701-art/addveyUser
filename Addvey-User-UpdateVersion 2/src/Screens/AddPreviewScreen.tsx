// govind sir ui

// screens/AddReviewScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  Share,
} from "react-native";
import {
  Ionicons,
  Entypo,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  FontAwesome6,
} from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { EvilIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { Base_URL } from "../services/mutations";
// import { EndPoints } from "../services/EndPoints";
// import { mutationHandler } from "../services/mutations/mutationHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {  } from "../../srcGovindSir/services/mutations";
import { EndPointUser } from "../api/serciveUser/EndPiontUser";
// import  from "../Components/Loader";
import { BaseUrl, IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import LoadingModal from "../Components/Loader";
import { SocialIcon } from "../Components/CommonFunction";
import { EndPoints } from "../services/EndPoints";
import {
  apiHelper,
  getApi,
  PostAPi,
} from "../api/getApi/getApi";
import NearByScreen from "../Components/Category/NearByScreen";
import HomeTypeScreen from "./HomeTypes";
import ProductCard from "../Components/MainHome/ProductCard";
import SimilarProductCard from "../Components/SimilarProductCard";
import InfoReportScreen from "../Components/Chat/InfoReportScreen";
import ReportDetailModal from "../Components/Profile/ReportDetailModal";
import RecentCard from "../Components/MainHome/RecentCard";
import { useFavorites } from "../context/FavoritesContext";

const { width } = Dimensions.get("window");
// Replace with your custom images (local or remote)

const AddReviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const route = useRoute();
  const data = route?.params?.data;
  const from = route?.params?.from;

  if (!data) {
    console.log('in addview data ', data)
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Error: Product data not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, padding: 10, backgroundColor: "#ddd", borderRadius: 5 }}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [reportModat, setReportModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  // Effects
  useEffect(() => {
    handleAddView();
    getToken();
  }, []);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem("authToken");
    setToken(userToken || "");
    setReady(true);
  };

  const handleFavoritePress = async () => {
    console.log("🔥 HEART BUTTON PRESSED! 🔥");
    await toggleFavorite(data?.id);
  };

  const handleReportSubmit = async (text: string) => {
    console.log("User submitted:", text);
    setLoading(true);
    const userToken = await AsyncStorage.getItem("authToken");

    const param = {
      url: EndPoints.addReport,
      body: {
        productId: data?.id,
        reason: "other",
        type: "report",
        description: text,
      },
      token: userToken || "",
    };

    const dd = await PostAPi(param, setLoading);
    if (dd?.success) {
      console.log("<><><><><><", param.body);
      setReportModal(false);
      Alert.alert("Success", "Report submitted successfully");
    }
    setReportModal(false);
  };

  const handleReport = () => {
    setModalVisible(true);
  };

  const reportPress = () => {
    setModalVisible(false);
    setReportModal(true);
  };

  const handleAddView = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem("authToken");
    const url = EndPoints.addViewHistory + data?.id;
    const url1 = EndPoints.viewProdict + `${data?.id}`;

    // Fetch Product Details (includes similarProducts)
    const productRes = await getApi(url1, setLoading, userToken, true);
    if (productRes?.success) {
      setSimilarProducts(productRes?.data?.similarProducts || []);
    }

    await getApi(url, setLoading, userToken);
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

  const getSocialIcon = (platform) => {
    const iconProps = { size: 20, color: "#6C63FF" };
    switch (platform.toLowerCase()) {
      case "twitter": return <FontAwesome6 name="x-twitter" {...iconProps} />;
      case "facebook": return <FontAwesome name="facebook" {...iconProps} />;
      case "instagram": return <FontAwesome name="instagram" {...iconProps} />;
      case "linkedin": return <FontAwesome name="linkedin" {...iconProps} />;
      case "youtube": return <FontAwesome name="youtube" {...iconProps} />;
      case "whatsapp": return <FontAwesome name="whatsapp" {...iconProps} />;
      case "website": return <FontAwesome name="globe" {...iconProps} />;
      case "telegram": return <FontAwesome name="telegram" {...iconProps} />;
      case "tiktok": return <FontAwesome5 name="tiktok" {...iconProps} />;
      case "snapchat": return <FontAwesome5 name="snapchat" {...iconProps} />;
      case "pinterest": return <FontAwesome name="pinterest" {...iconProps} />;
      case "reddit": return <FontAwesome5 name="reddit" {...iconProps} />;
      case "discord": return <FontAwesome5 name="discord" {...iconProps} />;
      case "github": return <FontAwesome name="github" {...iconProps} />;
      case "medium": return <AntDesign name="medium" {...iconProps} />;
      case "spotify": return <FontAwesome5 name="spotify" {...iconProps} />;
      default: return <MaterialIcons name="link" {...iconProps} />;
    }
  };

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str);
  };

  const openDialPad = (phoneNumber: any) => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not provided");
      return;
    }
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open the dial pad");
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ad: ${data?.name} \n Price: ${data?.price} \n Location: ${data?.location?.city}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* {loading && <LoadingModal />} */}
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ marginRight: wp("2%") }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={wp("5%")} color="#333" />
        </TouchableOpacity>

        {/* Title + SimpleText + Promote */}
        <View style={styles.titleWrapper}>
          <View>
            <Text style={styles.topBarTitle}>Ad Preview</Text>
            <Text style={styles.simpleText}>AD ID : {data?.id}</Text>
          </View>

          {/* <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Verification Pending</Text>
          </TouchableOpacity> */}
        </View>

        {/* Right side trash icon */}
        {/* <TouchableOpacity>
          <Ionicons name="trash-outline" size={wp("5%")} color="#FF0303" />
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Subtitle Section (2 lines) */}
        <View style={styles.subtitleSection}>
          {/* Top line: Nanda + icon */}
          <TouchableOpacity
            style={styles.subtitleTop}
            onPress={() =>
              navigation.navigate("ProfileScreenMainYou", { data: data })
            }
          >
            <Text style={styles.subtitleText}>
              {data?.creator?.profile?.name || "User"}
            </Text>
            <Image
              source={require("../../assets/images/save.png")}
              style={styles.saveimage}
            />
          </TouchableOpacity>

          {/* Bottom line: icon + text + icon + text */}
          <View style={styles.subtitleBottom}>
            <Entypo name="location-pin" size={wp("4%")} color="red" />
            <Text style={styles.locationText}>
              {/* 1.2 km away . */}
              {data?.location?.city}
            </Text>

            {/* <Image
              source={require("../../assets/images/save2.png")}
              style={styles.saveimage}
            /> */}
          </View>
        </View>

        {/* Image Slider */}
        <View style={styles.sliderWrapper}>
          <FlatList
            data={data?.images}
            horizontal
            pagingEnabled
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={
                  typeof item === "string"
                    ? { uri: IMAGE_BASE_URL + item }
                    : item
                }
                style={styles.image}
              />
            )}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
          />
          {/* Slider dots */}
          <View style={styles.dotsContainer}>
            {data?.images?.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>

          {/* Top-right icons */}
          <View style={styles.topRightIcons}>
            {/* <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="trash-outline"
                size={wp("4.5%")}
                color="#FF0303"
              />
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.iconButton}>
              <Feather name="camera" size={wp("4.5%")} color="#6C63FF" />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.rowIcon}
              onPress={handleFavoritePress}
            >
              {/* <EvilIcons name="heart" size={24} color="white" /> */}
              <MaterialCommunityIcons
                name={isFavorite(data?.id) ? "cards-heart" : "cards-heart-outline"}
                size={24}
                color={isFavorite(data?.id) ? "red" : "white"}
              />
              <Text style={styles.iconText}>{data?.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowIcon} onPress={handleShare}>
              <Feather
                name="share"
                size={16}
                style={{ marginLeft: wp(3) }}
                color="white"
              />
              <Text style={styles.iconText}>{data?.shares}</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom-right icons with text */}
          <View style={styles.bottomRight}></View>

          {/* Bottom-left views */}
          <View style={styles.bottomLeft}>
            <Ionicons name="eye-outline" size={wp("4%")} color="#fff" />
            <Text style={styles.iconText}>{data?.views}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsCard}>
          {/* Row 1 */}
          <View style={styles.detailRowCustom}>
            <View style={styles.leftBox}>
              <Image
                source={{ uri: IMAGE_BASE_URL + (data?.subsubcategory?.image || "") }}
                style={{ width: wp(5), height: hp(5), objectFit: "contain" }}
              />
              <Text style={styles.detailTextCar}>
                {data?.subsubcategory?.name || "Category"}
              </Text>
            </View>
            <Text style={styles.rightTextCar}>29 JUL 2024</Text>
          </View>

          {/* Row 2 */}
          <View style={styles.detailRowCustom}>
            <View style={styles.leftBox}>
              <Text style={styles.detailText}>{data?.name}</Text>
            </View>
            <Text style={styles.rightText}>₹ {data?.price}</Text>
          </View>
        </View>

        {/* Extra Details Section (UPDATED) */}
        <View style={styles.detailsCard}>
          <View style={styles.sectionTitleRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.sectionTitle}>Details</Text>
              <TouchableOpacity
                onPress={() => navigation.pop(3)}
                style={{ display: from == "home" ? "none" : "flex" }}
              >
                <Image
                  source={require("../../assets/images/save2.png")}
                  style={{
                    width: wp(3),
                    height: hp(3),
                    resizeMode: "contain",
                    marginLeft: wp(2),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {Object.entries(data?.attributes || {}).map(([key, value], index) => {
            // Render two items per row
            if (index % 2 === 0) {
              const next = Object.entries(data?.attributes || {})[index + 1];
              return (
                <View key={key} style={styles.brandRows}>
                  <View style={styles.brandBox}>
                    <Text style={styles.keyText}>{formatKey(key)}</Text>
                    <Text style={styles.valueText}>{String(value)}</Text>
                  </View>
                  {next && (
                    <View style={styles.brandBox}>
                      <Text style={styles.keyText}>{formatKey(next[0])}</Text>
                      <Text style={styles.valueText}>{String(next[1])}</Text>
                    </View>
                  )}
                </View>
              );
            }
            return null;
          })}
          <View style={styles.sectionTitleRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.sectionTitle}>Description</Text>
              <TouchableOpacity
                onPress={() => navigation.pop(1)}
                style={{ display: from == "home" ? "none" : "flex" }}
              >
                <Image
                  source={require("../../assets/images/save2.png")}
                  style={{
                    width: wp(3),
                    height: hp(3),
                    resizeMode: "contain",
                    marginLeft: wp(2),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.textRow}>
            <Text style={styles.valueTextBottom}>{data?.description}</Text>
          </View>

          {/* Bottom full width image */}
        </View>
        {data?.images?.map((item) => (
          <Image
            source={{ uri: IMAGE_BASE_URL + item }}
            style={styles.fullWidthImage}
          />
        ))}
        {data?.supersubcategory?.parent?.parentCategory?.id == 4 &&
          <NearByScreen />
        }
        {
          data?.supersubcategory?.parent?.parentCategory?.id == 5 && <NearByScreen />
        }
        {/* <Image
          source={require("../../assets/images/slidecar.png")}
          style={styles.fullWidthImage}
        /> */}

        <View style={styles.similarheader}>
          <Text style={styles.similartitle}>
            Similar {data?.subsubcategory?.name || "Products"}
          </Text>

         { similarProducts.length > 0 && <TouchableOpacity
            onPress={() =>

              navigation.navigate("SimilarProducts", {
                category: data?.subsubcategory?.name,
                similarProducts
              })
            }
          >
            <Ionicons
              name="arrow-forward"
              style={{
                backgroundColor: "#6C63FF",
                paddingHorizontal: wp(3),
                paddingVertical: hp(0.1),
                borderRadius: 50,
              }}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>}
        </View>

        {/* <FlatList
          data={similarProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
            paddingBottom: hp(2),
            //  maxHeight: hp(12),
          }}
          ItemSeparatorComponent={() => <View style={{ width: wp(4) }} />}
          renderItem={({ item }) => (


                <RecentCard
              key={item.id}
              item={item}
              onFavoritePress={handleFavoritePress}
            />

          )}
          ListEmptyComponent={
            <View
              style={{
                width: width - wp(8),
                alignItems: "center",
                paddingVertical: 20,
              }}
            >
              <Text style={{ color: "#888", fontSize: 14 }}>
                No similar products found.
              </Text>
            </View>
          }
        /> */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: hp(2), paddingBottom: 5, marginHorizontal:hp(1) }}
        >
          {similarProducts && similarProducts.length > 0 ? (
            similarProducts.map((item) => (
              <RecentCard
                key={item.id}
                item={item}
              />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                {similarProducts.length > 0
                  ? "No items in this category"
                  : "No Similar Products items"}
              </Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      <View style={styles.bottomActions}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{}}
        >
          <TouchableOpacity
            style={styles.socialIconButton}
            onPress={() => openDialPad(data?.creator?.phone)}
          >
            <Ionicons name="call" size={20} color="#6C63FF" />
          </TouchableOpacity>

          {data?.creator?.profile?.socialLinks?.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.socialIconButton}
              onPress={() => handleSocialLinkPress(link.url)}
            >
              <SocialIcon platform={link.platform} />
            </TouchableOpacity>
          ))}


        </ScrollView>

        {/* Message Button + Right Icon */}
        <View style={styles.bottomRight}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              navigation.navigate("ChatMessaging", {
                receiverId: data?.creator?.id,
                receiverName: data?.creator?.profile?.name,
                productId: data?.id,
                productName: data?.name,
                productLocation: data?.location?.city ?? "",
                price: data?.price,
              })
            }
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
            onPress={
              () => setModalVisible(true)
              //  navigation.navigate("ReportDetail")
            }
          >
            <AntDesign name="info-circle" size={hp(2.2)} color="#00000075" />
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
        from={"product"}
      />
    </SafeAreaView>
  );
};

export default AddReviewScreen;

const styles = StyleSheet.create({
  similarheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    marginBottom: 12,
    marginTop: 15
  },
  similartitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginTop: hp(4),
  },
  titleWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(1),
  },
  topBarTitle: {
    fontSize: wp("3.5%"),
    color: "#000",
    fontWeight: "600",
    marginRight: wp("2%"),
  },
  simpleText: {
    fontSize: wp("2.2%"),
    color: "#6E533F",
    marginRight: wp("3%"),
  },
  actionButton: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.4%"),
    borderRadius: wp("5%"),
    marginLeft: wp("2%"),
  },
  actionButtonText: {
    fontSize: wp("2.8%"),
    color: "#6C63FF",
    fontWeight: "600",
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
  subtitleSection: {
    paddingHorizontal: wp("4%"),
    marginTop: hp("1.8%"),
    marginVertical: hp(0.8),
  },
  subtitleTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("0.5%"),
  },
  subtitleBottom: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitleText: {
    fontWeight: "600",
    fontSize: wp("3.8%"),
    color: "#000",
  },
  locationText: {
    fontSize: wp("3%"),
    color: "gray",
    marginLeft: wp("1%"),
  },

  sliderWrapper: {
    width: "100%",
    height: hp("25%"),
    marginTop: hp("1.5%"),
  },
  image: {
    width,
    height: hp("28%"),
    resizeMode: "cover",
  },
  dotsContainer: {
    position: "absolute",
    bottom: hp("1.5%"),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: wp("1.3%"),
    height: wp("1.3%"),
    borderRadius: wp("1%"),
    backgroundColor: "white",
    marginHorizontal: wp("1%"),
  },
  activeDot: {
    backgroundColor: "#6C63FF",
    width: wp("1.3%"),
    height: wp("1.3%"),
  },
  topRightIcons: {
    position: "absolute",
    top: hp("1.5%"),
    right: wp("2%"),
    flexDirection: "row",
    zIndex: 999, // Ensure icons are on top and receive touches
  },

  bottomRight: {
    flexDirection: "row",
  },
  rowIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp("3%"),
  },
  bottomLeft: {
    position: "absolute",
    bottom: hp("1%"),
    left: wp("2%"),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(45, 45, 45, 0.5)",
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("3%"),
  },
  bottomLeft1: {
    position: "absolute",
    bottom: hp("1%"),
    left: wp("2%"),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("3%"),
  },
  iconText: {
    color: "#fff",
    fontSize: wp("3%"),
    marginLeft: wp("1%"),
  },

  detailsCard: {
    marginTop: hp("2%"),
    marginHorizontal: wp("4%"),
    backgroundColor: "#fff",
    marginBottom: hp(1),
  },
  detailRowCustom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: wp("3.9%"),
    marginLeft: wp("1.5%"),
    color: "#333",
  },
  rightText: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: "#000",
  },
  detailTextCar: {
    fontSize: wp("2.8%"),
    marginLeft: wp("1.5%"),
    color: "#00000080",
  },
  rightTextCar: {
    fontSize: wp("2.8%"),
    fontWeight: "600",
    color: "#000",
  },
  saveimage: {
    width: wp("6%"),
    height: hp("1.6%"),
    resizeMode: "contain",
    marginTop: wp(1),
  },

  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  sectionTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#000",
  },

  threeColumnRow: {
    flexDirection: "row",
    marginLeft: wp(2),
    paddingVertical: hp(0.5),
    width: "100%",
  },
  threeColumnRowBottom: {
    flexDirection: "row",
    marginBottom: hp(1.5),
    marginLeft: wp(2),
  },
  iconWithTextRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },

  brandRows: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
    paddingHorizontal: wp(3),
    marginTop: hp(1.8),
  },
  brandBox: {
    width: "60%",
  },

  twoColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1%"),
  },
  keyText: {
    fontSize: wp("3.4%"),
    color: "#00000099",
    marginBottom: hp(0.3),
  },
  valueText: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: "#000",
  },
  valueTextBottom: {
    marginBottom: hp(1),
    fontSize: wp(3),
  },
  fullWidthImage: {
    width: "100%",
    height: hp("20%"),
    resizeMode: "cover",
    marginTop: hp(1),
  },
  fullWidthImageBottom: {
    marginBottom: hp(10),
  },
  textRow: {
    marginTop: hp(0.1),
  },

  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: wp(4),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: hp(2),
  },
  bottomLeftButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  bottomImage: {
    width: wp("8%"),
    height: wp("8%"),
    resizeMode: "contain",
    marginRight: wp(2),
  },
  bottomText: {
    fontSize: wp("2.8%"),
    fontFamily: "Poppins-Medium",
    color: "#6E533F",
    lineHeight: hp(1.9),
  },
  bottomButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    marginRight: wp(2),
  },
  editImage: {
    width: wp("4.5%"),
    height: wp("4.5%"),
    resizeMode: "contain",
    marginRight: wp(1.5),
  },
  editButtonText: {
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Medium",
    color: "#6C63FF",
  },
  bottomButton: {
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.2),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(1),
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: wp("3.8%"),
    fontFamily: "Poppins-Medium",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 20,

    // marginBottom: hp(2),
    // height:50,
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
  noDataContainer: {
    width: wp(80),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(4),
  },
  noDataText: {
    fontSize: wp(3.5),
    color: "#888",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
});

// // screens/AddReviewScreen.tsx
// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     Image,
//     SafeAreaView,
//     TouchableOpacity,
//     FlatList,
//     Dimensions,
//     ScrollView,
//     StatusBar,
// } from "react-native";
// import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { EvilIcons } from '@expo/vector-icons';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from "@react-navigation/native";

// const { width } = Dimensions.get("window");

// // Replace with your custom images (local or remote)
// const images = [
//     require("../../assets/images/slidecar.png"),
//     require("../../assets/images/slidecar.png"),
//     require("../../assets/images/slidcar.jpg"),
// ];

// const AddReviewScreen: React.FC = () => {
//     const navigation = useNavigation<any>();
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
//         if (viewableItems.length > 0) {
//             setCurrentIndex(viewableItems[0].index);
//         }
//     }).current;

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//             {/* Top Bar */}
//             <View style={styles.topBar}>
//                 <TouchableOpacity style={{ marginRight: wp("2%") }}>
//                     <Ionicons name="arrow-back" size={wp("5%")} color="#333" />
//                 </TouchableOpacity>

//                 {/* Title + SimpleText + Promote */}
//                 <View style={styles.titleWrapper}>
//                     <View>
//                         <Text style={styles.topBarTitle}>Ad Preview</Text>
//                         <Text style={styles.simpleText}>AD ID : 2134354</Text>
//                     </View>

//                     <TouchableOpacity style={styles.actionButton}>
//                         <Text style={styles.actionButtonText}>Verification Pending</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Right side trash icon */}
//                 <TouchableOpacity>
//                     <Ionicons name="trash-outline" size={wp("5%")} color="#FF0303" />
//                 </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//                 {/* Subtitle Section (2 lines) */}
//                 <View style={styles.subtitleSection}>
//                     {/* Top line: Nanda + icon */}
//                     <View style={styles.subtitleTop}>
//                         <Text style={styles.subtitleText}>Nanda</Text>
//                         <Image
//                             source={require('../../assets/images/save.png')}
//                             style={styles.saveimage}
//                         />
//                     </View>

//                     {/* Bottom line: icon + text + icon + text */}
//                     <View style={styles.subtitleBottom}>
//                         <Entypo name="location-pin" size={wp("4%")} color="red" />
//                         <Text style={styles.locationText}>1.2 km away . Kphb Bagyanagar Colony</Text>

//                         <Image
//                             source={require('../../assets/images/save2.png')}
//                             style={styles.saveimage}
//                         />
//                     </View>
//                 </View>

//                 {/* Image Slider */}
//                 <View style={styles.sliderWrapper}>
//                     <FlatList
//                         data={images}
//                         horizontal
//                         pagingEnabled
//                         keyExtractor={(_, index) => index.toString()}
//                         renderItem={({ item }) => (
//                             <Image
//                                 source={typeof item === "string" ? { uri: item } : item}
//                                 style={styles.image}
//                             />
//                         )}
//                         showsHorizontalScrollIndicator={false}
//                         onViewableItemsChanged={onViewableItemsChanged}
//                     />

//                     {/* Slider dots */}
//                     <View style={styles.dotsContainer}>
//                         {images.map((_, index) => (
//                             <View
//                                 key={index}
//                                 style={[
//                                     styles.dot,
//                                     currentIndex === index && styles.activeDot,
//                                 ]}
//                             />
//                         ))}
//                     </View>

//                     {/* Top-right icons */}
//                     <View style={styles.topRightIcons}>
//                         <TouchableOpacity style={styles.iconButton}>
//                             <Ionicons name="trash-outline" size={wp("4.5%")} color="#FF0303" />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.iconButton}>
//                             <Feather name="camera" size={wp('4.5%')} color="#6C63FF" />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Bottom-right icons with text */}
//                     <View style={styles.bottomRight}>
//                         <TouchableOpacity style={styles.rowIcon}>
//                             <EvilIcons name="heart" size={24} color="white" />
//                             <Text style={styles.iconText}>1</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.rowIcon}>
//                             <Feather name="share" size={16} style={{ marginLeft: wp(3) }} color="white" />
//                             <Text style={styles.iconText}>1</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Bottom-left views */}
//                     <View style={styles.bottomLeft}>
//                         <Ionicons name="eye-outline" size={wp("4%")} color="#fff" />
//                         <Text style={styles.iconText}>3</Text>
//                     </View>
//                 </View>

//                 {/* Details Section */}
//                 <View style={styles.detailsCard}>
//                     {/* Row 1 */}
//                     <View style={styles.detailRowCustom}>
//                         <View style={styles.leftBox}>
//                             <Image
//                                 source={require('../../assets/images/car.png')}
//                                 style={{ width: wp(5), height: hp(5), objectFit: 'contain' }}
//                             />
//                             <Text style={styles.detailTextCar}>Car</Text>
//                         </View>
//                         <Text style={styles.rightTextCar}>29 JUL 2024</Text>
//                     </View>

//                     {/* Row 2 */}
//                     <View style={styles.detailRowCustom}>
//                         <View style={styles.leftBox}>
//                             <Text style={styles.detailText}>Bugatti</Text>
//                         </View>
//                         <Text style={styles.rightText}>₹2,30,00,000</Text>
//                     </View>
//                 </View>

//                 {/* Extra Details Section (UPDATED) */}
//                 <View style={styles.detailsCard}>
//                     {/* Section Title with image */}
//                     <View style={styles.sectionTitleRow}>
//                         <View style={{ flexDirection: "row", alignItems: "center" }}>
//                             <Text style={styles.sectionTitle}>Details</Text>
//                             <Image
//                                 source={require("../../assets/images/save2.png")}
//                                 style={{ width: wp(3), height: hp(3), resizeMode: "contain", marginLeft: wp(2) }}
//                             />
//                         </View>
//                     </View>

//                     {/* Two rows with 3 items each (icon left + text right) */}
//                     <View style={styles.threeColumnRow}>
//                         <View style={styles.iconWithTextRow}>
//                             <Ionicons name="car-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
//                             <Text style={styles.valueText}>Diesel</Text>
//                         </View>
//                         <View style={styles.iconWithTextRow}>
//                             <Ionicons name="speedometer-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
//                             <Text style={styles.valueText}>12000.0 km</Text>
//                         </View>
//                         <View style={styles.iconWithTextRow}>
//                             <Ionicons name="color-palette-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
//                             <Text style={styles.valueText}>Automatic</Text>
//                         </View>
//                     </View>

//                     <View style={styles.threeColumnRow}>
//                         <View style={styles.iconWithTextRow}>
//                             <Ionicons name="person" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
//                             <Text style={styles.valueText}>2nd Owner</Text>
//                         </View>
//                         <View style={styles.iconWithTextRow}>
//                             <Ionicons name="calendar-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
//                             <Text style={styles.valueText}>2nd Owner</Text>
//                         </View>
//                         <View style={styles.iconWithTextRow}>
//                             <MaterialIcons name="star" size={wp(4)} style={{ marginRight: wp(1) }} color="#CDFF03" />
//                             <Text style={styles.valueText}>5 Star</Text>
//                         </View>
//                     </View>

//                     {/* Brand / Model / Variant with title top, subtitle bottom (2 per row) */}
//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Brand</Text>
//                             <Text style={styles.valueText}>Bugatti</Text>
//                         </View>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Model</Text>
//                             <Text style={styles.valueText}>Bugatti chiron</Text>
//                         </View>
//                     </View>
//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Listing Type</Text>
//                             <Text style={styles.valueText}>Sell</Text>
//                         </View>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Variant </Text>
//                             <Text style={styles.valueText}>Variant </Text>
//                         </View>
//                     </View>
//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Seats</Text>
//                             <Text style={styles.valueText}>4</Text>
//                         </View>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Doors</Text>
//                             <Text style={styles.valueText}>2</Text>
//                         </View>
//                     </View>
//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Listing Type</Text>
//                             <Text style={styles.valueText}>Sell</Text>
//                         </View>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Variant </Text>
//                             <Text style={styles.valueText}>Variant </Text>
//                         </View>
//                     </View>
//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Seats</Text>
//                             <Text style={styles.valueText}>4</Text>
//                         </View>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Doors</Text>
//                             <Text style={styles.valueText}>2</Text>
//                         </View>
//                     </View>
//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Seats</Text>
//                             <Text style={styles.valueText}>4</Text>
//                         </View>
//                     </View>

//                     <View style={styles.sectionTitleRow}>
//                         <View style={{ flexDirection: "row", alignItems: "center" }}>
//                             <Text style={styles.sectionTitle}>Additional Details</Text>
//                             <Image
//                                 source={require("../../assets/images/save2.png")}
//                                 style={{ width: wp(3), height: hp(3), resizeMode: "contain", marginLeft: wp(2) }}
//                             />
//                         </View>
//                     </View>

//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Listed by</Text>
//                             <Text style={styles.valueText}>Owner</Text>
//                         </View>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Seller Speaks</Text>
//                             <Text style={styles.valueText}>English, Telugu, Hindi</Text>
//                         </View>
//                     </View>
//                     <View style={styles.brandRows}>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Additional Security</Text>
//                             <Text style={styles.valueText}>Driving License Claimed</Text>
//                         </View>
//                         <View style={styles.brandBox}>
//                             <Text style={styles.keyText}>Respond in</Text>
//                             <Text style={styles.valueText}>10 mins</Text>
//                         </View>
//                     </View>

//                     <View style={styles.sectionTitleRow}>
//                         <View style={{ flexDirection: "row", alignItems: "center" }}>
//                             <Text style={styles.sectionTitle}>Description</Text>
//                             <Image
//                                 source={require("../../assets/images/save2.png")}
//                                 style={{ width: wp(3), height: hp(3), resizeMode: "contain", marginLeft: wp(2) }}
//                             />
//                         </View>
//                     </View>

//                     <View style={styles.textRow}>
//                         <Text style={styles.valueTextBottom}>Genuine Apple part</Text>
//                     </View>
//                     <View style={styles.textRow}>
//                         <Text style={styles.valueTextBottom}>1500 nts Brightness, High Touch capcity</Text>
//                     </View>

//                     {/* Bottom full width image */}

//                 </View>
//                 <Image
//                     source={require("../../assets/images/slidecar.png")}
//                     style={styles.fullWidthImage}
//                 />
//                 <Image
//                     source={require("../../assets/images/slidecar.png")}
//                     style={styles.fullWidthImage}
//                 />

//                 <View style={styles.bottomSection}>
//                     {/* Top Info Row */}
//                     <View style={styles.bottomLeftButton}>
//                         <Image
//                             source={require("../../assets/images/bottombutton.png")}
//                             style={styles.bottomImage}
//                         />
//                         <Text style={styles.bottomText}>
//                             I am authorised to make ad edits & responsible for the information shared including ad details & prices
//                         </Text>
//                     </View>

//                     {/* Buttons Row */}
//                     <View style={styles.bottomButtonsRow}>
//                         {/* Edit Button */}
//                         <TouchableOpacity style={styles.editButton}>
//                             <Image
//                                 source={require("../../assets/images/save2.png")}
//                                 style={styles.editImage}
//                             />
//                             <Text style={styles.editButtonText}>Edit</Text>
//                         </TouchableOpacity>

//                         {/* Next Button */}
//                         <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("Botomtabs")}>
//                             <Text style={styles.bottomButtonText}>Next</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </ScrollView>
//         </SafeAreaView >
//     );
// };

// export default AddReviewScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#fff" },
//     topBar: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: wp("4%"),
//         paddingVertical: hp("1.5%"),
//         borderBottomWidth: 0.5,
//         borderColor: "#ddd",
//         backgroundColor: "#fff",
//         marginTop: hp(4),
//     },
//     titleWrapper: {
//         flex: 1,
//         flexDirection: "row",
//         alignItems: "center",
//         marginLeft: wp(1),
//     },
//     topBarTitle: {
//         fontSize: wp("3.5%"),
//         color: "#000",
//         fontWeight: "600",
//         marginRight: wp("2%"),
//     },
//     simpleText: {
//         fontSize: wp("2.2%"),
//         color: "#6E533F",
//         marginRight: wp("3%"),
//     },
//     actionButton: {
//         borderWidth: 1,
//         borderColor: "#6C63FF",
//         paddingHorizontal: wp("3%"),
//         paddingVertical: hp("0.4%"),
//         borderRadius: wp("5%"),
//         marginLeft: wp("2%"),
//     },
//     actionButtonText: {
//         fontSize: wp("2.8%"),
//         color: "#6C63FF",
//         fontWeight: "600",
//     },

//     subtitleSection: {
//         paddingHorizontal: wp("4%"),
//         marginTop: hp("1.8%"),
//         marginVertical: hp(0.8)
//     },
//     subtitleTop: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: hp("0.5%"),
//     },
//     subtitleBottom: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     subtitleText: {
//         fontWeight: "600",
//         fontSize: wp("3.8%"),
//         color: "#000",
//     },
//     locationText: {
//         fontSize: wp("3%"),
//         color: "gray",
//         marginLeft: wp("1%"),
//     },

//     sliderWrapper: {
//         width: "100%",
//         height: hp("25%"),
//         marginTop: hp("1.5%"),
//     },
//     image: {
//         width,
//         height: hp("28%"),
//         resizeMode: "cover",
//     },
//     dotsContainer: {
//         position: "absolute",
//         bottom: hp("1.5%"),
//         left: 0,
//         right: 0,
//         flexDirection: "row",
//         justifyContent: "center",
//     },
//     dot: {
//         width: wp("1.3%"),
//         height: wp("1.3%"),
//         borderRadius: wp("1%"),
//         backgroundColor: "white",
//         marginHorizontal: wp("1%"),
//     },
//     activeDot: {
//         backgroundColor: "#6C63FF",
//         width: wp("1.3%"),
//         height: wp("1.3%"),
//     },
//     topRightIcons: {
//         position: "absolute",
//         top: hp("1.5%"),
//         right: wp("2%"),
//         flexDirection: "row",
//     },
//     iconButton: {
//         backgroundColor: "white",
//         padding: wp("1.5%"),
//         borderRadius: wp("6%"),
//         marginLeft: wp("2%"),
//     },
//     bottomRight: {
//         position: "absolute",
//         bottom: hp("1%"),
//         right: wp("2%"),
//         flexDirection: "row",
//     },
//     rowIcon: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginLeft: wp("3%"),
//     },
//     bottomLeft: {
//         position: "absolute",
//         bottom: hp("1%"),
//         left: wp("2%"),
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "rgba(45, 45, 45, 0.5)",
//         paddingHorizontal: wp("2.5%"),
//         paddingVertical: hp("0.5%"),
//         borderRadius: wp("3%"),
//     },
//     iconText: {
//         color: "#fff",
//         fontSize: wp("3%"),
//         marginLeft: wp("1%"),
//     },

//     detailsCard: {
//         marginTop: hp("2%"),
//         marginHorizontal: wp("4%"),
//         backgroundColor: "#fff",
//         marginBottom: hp(1)
//     },
//     detailRowCustom: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     leftBox: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     detailText: {
//         fontSize: wp("3.9%"),
//         marginLeft: wp("1.5%"),
//         color: "#333",
//     },
//     rightText: {
//         fontSize: wp("3.5%"),
//         fontWeight: "600",
//         color: "#000",
//     },
//     detailTextCar: {
//         fontSize: wp("2.8%"),
//         marginLeft: wp("1.5%"),
//         color: "#00000080",
//     },
//     rightTextCar: {
//         fontSize: wp("2.8%"),
//         fontWeight: "600",
//         color: "#000",
//     },
//     saveimage: {
//         width: wp('6%'),
//         height: hp('1.6%'),
//         resizeMode: 'contain',
//         marginTop: wp(1)
//     },

//     sectionTitleRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: hp("1%"),
//     },
//     sectionTitle: {
//         fontSize: wp("4%"),
//         fontWeight: "600",
//         color: "#000",
//     },

//     threeColumnRow: {
//         flexDirection: "row",
//         marginLeft: wp(2),
//         paddingVertical: hp(0.5),
//         width: '100%'
//     },
//     threeColumnRowBottom: {
//         flexDirection: "row",
//         marginBottom: hp(1.5),
//         marginLeft: wp(2),
//     },
//     iconWithTextRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         width: "30%",
//     },

//     brandRows: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: hp(1.5),
//         paddingHorizontal: wp(3),
//         marginTop: hp(1.8)
//     },
//     brandBox: {
//         width: "60%",
//     },

//     twoColumnRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: hp("1%"),
//     },
//     keyText: {
//         fontSize: wp("3.4%"),
//         color: "#00000099",
//         marginBottom: hp(0.3)
//     },
//     valueText: {
//         fontSize: wp("3.5%"),
//         fontWeight: "600",
//         color: "#000",
//     },
//     valueTextBottom: {
//         marginBottom: hp(1),
//         fontSize: wp(3)
//     },
//     fullWidthImage: {
//         width: "100%",
//         height: hp("20%"),
//         resizeMode: "cover",
//         marginTop: hp(1),
//     },
//     fullWidthImageBottom: {
//         marginBottom: hp(10)
//     },
//     textRow: {
//         marginTop: hp(0.1)
//     },

//     bottomSection: {
//         position: "relative",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: "#D9D9D959",
//         borderTopWidth: 1,
//         borderTopColor: "#eee",
//         padding: wp(4),
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         marginTop: hp(2)
//     },
//     bottomLeftButton: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: hp(1.5)
//     },
//     bottomImage: {
//         width: wp("8%"),
//         height: wp("8%"),
//         resizeMode: "contain",
//         marginRight: wp(2),
//     },
//     bottomText: {
//         fontSize: wp("2.8%"),
//         fontFamily: "Poppins-Medium",
//         color: "#6E533F",
//         lineHeight: hp(1.9),
//     },
//     bottomButtonsRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     editButton: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         borderWidth: 1,
//         borderColor: "#6C63FF",
//         borderRadius: 12,
//         paddingVertical: hp(1),
//         paddingHorizontal: wp(4),
//         marginRight: wp(2),
//     },
//     editImage: {
//         width: wp("4.5%"),
//         height: wp("4.5%"),
//         resizeMode: "contain",
//         marginRight: wp(1.5),
//     },
//     editButtonText: {
//         fontSize: wp("3.5%"),
//         fontFamily: "Poppins-Medium",
//         color: "#6C63FF",
//     },
//     bottomButton: {
//         flex: 1,
//         backgroundColor: "#6C63FF",
//         paddingVertical: hp(1.2),
//         borderRadius: 12,
//         alignItems: "center",
//         justifyContent: "center",
//         marginLeft: wp(1),
//     },
//     bottomButtonText: {
//         color: "#fff",
//         fontSize: wp("3.8%"),
//         fontFamily: "Poppins-Medium",
//     },

// });
