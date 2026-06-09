// screens/FollowingScreen.tsx
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, EvilIcons, MaterialIcons, Entypo, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { getApi, PostAPi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../Components/Loader";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { Linking } from "react-native";

const userData = [
  {
    id: 1,
    name: "Nani",
    verified: true,
    distance: "1.2 km away",
    location: "Khpb Bagyanagar Colony",
    ads: "5 Ads",
    image: require("../../assets/images/bagwan.png"),
  },
  {
    id: 2,
    name: "Kumar",
    verified: false,
    distance: "1.2 km away",
    location: "Khpb Bagyanagar Colony",
    ads: "5 Ads",
    image: require("../../assets/images/bagwan.png"),
  },
  {
    id: 3,
    name: "Krishna",
    verified: true,
    distance: "1.2 km away",
    location: "Khpb Bagyanagar Colony",
    ads: "5 Ads",
    image: require("../../assets/images/bagwan.png"),
  },
];

const FollowingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [failedImages, setFailedImages] = useState(new Set());
  useEffect(() => {
    getDevice();
  }, []);
  const getDevice = async () => {
    const token = await AsyncStorage.getItem("authToken");
    // const param = {
    //   url: EndPoints.getLinkedDevices,
    //   token: token,
    // };
    const dd = await getApi(EndPoints.getfollow, setLoading, token);
    console.log(dd?.data?.data);
    setData(dd?.data?.data);
  };


  const followPress = async (id: any, name: any) => {
    const token = await AsyncStorage.getItem("authToken");

    const param = {
      url: EndPoints.unFollow + id,
      token: token,
      body: {},
      requireAuth:true
    };
    const dd = await PostAPi(param, setLoading);
    console.log(dd);
    if (dd?.success) {
      getDevice();
      // setFollow(!isFollow);
      Toast.show({
        type: 'delete',
        text1: `${name || 'User'} has been successfully deleted`,
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 40,
      });
    }

  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={wp("5%")} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Following: {data?.length || 0}</Text>
        </View>

        {/* <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <EvilIcons name="search" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color="black" />
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Buy/Sell Row */}
      <View style={styles.buySellRow}>
        <Text style={styles.buySellText}>Buy/Sell</Text>
        <View style={styles.buySellActiveIndicator} />
      </View>

      {/* ScrollView Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {loading && <LoadingModal />}


        {data?.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Top Row (Image + Follow button) */}
            <View style={styles.topRow}>
              <Image
                source={
                  (item?.followeeProfile?.image && !failedImages.has(item.id))
                    ? {
                      uri: item.followeeProfile.image.startsWith("http")
                        ? item.followeeProfile.image
                        : IMAGE_BASE_URL + item.followeeProfile.image
                    }
                    : require("../../assets/images/bagwan.png")
                }
                style={styles.avatar}
                onError={() => setFailedImages(prev => new Set(prev).add(item.id))}
              />
              <TouchableOpacity style={styles.followBtn} onPress={() => followPress(item?.followeeId, item?.followeeProfile?.name)}>
                <Text style={styles.followText}>Unfollow</Text>
              </TouchableOpacity>
            </View>

            {/* Info + Send button Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item?.followeeProfile?.name}</Text>
                  {item.verified && (
                    <MaterialIcons
                      name="verified"
                      size={wp("4%")}
                      color="#2A5AF9"
                      style={{ marginLeft: wp("1%") }}
                    />
                  )}
                </View>

                <View style={styles.locationRow}>
                  <Entypo name="location-pin" size={wp("3.5%")} color="red" />
                  <Text style={styles.locationText}>{item?.followeeProfile?.location?.city}</Text>
                </View>
              </View>

              {/* Navigation/Location Button */}
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={() => {
                  const lat = item?.followeeProfile?.location?.coordinates?.[1];
                  const lng = item?.followeeProfile?.location?.coordinates?.[0];
                  if (lat && lng) {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                    Linking.openURL(url);
                  } else {
                    // Fallback or alert if no coordinates
                    console.log("No coordinates available");
                  }
                }}
              >
                <FontAwesome
                  name="send"
                  size={13}
                  style={{ marginRight: wp(0.4) }}
                  color="#6C63FF"
                />
              </TouchableOpacity>
            </View>

            {/* Dashed Divider */}
            <View style={styles.dashedDivider} />

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <View style={styles.adsRow}>
                <Ionicons
                  name="document-text-outline"
                  size={wp("4%")}
                  color="black"
                />
                <Text style={styles.adsText}>{item.productCount} ads</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("ProfileScreenMainYou", { data: item })}>
                <Ionicons
                  name="arrow-forward-outline"
                  size={wp("4.2%")}
                  color="#6C63FF"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FollowingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /** Header */
  header: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    marginTop: hp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginLeft: wp(2),
    color: "black",
  },
  rightIcons: { flexDirection: "row", alignItems: "center" },
  iconBtn: { marginLeft: wp("3%") },

  /** Buy/Sell Row */
  buySellRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp(1),
    position: "relative",
  },
  buySellText: {
    fontSize: wp("3.8%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  buySellActiveIndicator: {
    position: "absolute",
    bottom: 0,
    left: wp("5%"),
    width: wp("15%"),
    height: 3,
    backgroundColor: "#6A5AE0",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },

  /** Cards */
  scrollContainer: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("3%"),
    paddingTop: hp("1%"),
    marginTop: hp(2),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    borderColor: "#ddd",
    borderWidth: 1,
  },

  /** Top Row (Image + Follow) */
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("7.5%"),
  },
  followBtn: {
    paddingVertical: hp("0.8%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    top: hp(-2),
    borderColor: "#6C63FF",
    borderWidth: 1,
  },
  followText: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: wp("3.5%"),
  },

  /** Info + Send */
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  infoLeft: { flexDirection: "column", alignItems: "flex-start" },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
    color: "#000",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("0.3%"),
  },
  locationText: {
    fontSize: wp("3%"),
    color: "#6B6B6B",
    marginLeft: wp("1%"),
  },
  sendBtn: {
    backgroundColor: "#fff",
    borderRadius: wp("6%"),
    padding: wp("2.5%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },

  /** Divider & Bottom Row */
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E5E5",
    marginVertical: hp("1%"),
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adsRow: { flexDirection: "row", alignItems: "center" },
  adsText: {
    fontSize: wp("3.3%"),
    color: "#000",
    marginLeft: wp("1.5%"),
  },
});
