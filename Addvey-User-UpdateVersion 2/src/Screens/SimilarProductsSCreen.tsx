import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiHelper, getApi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import LoadingModal from "../Components/Loader";
import SearchBar from "../Components/MainHome/Searchbar";
import RecentViewedScreen from "../Components/MainHome/RecentlyViewed";
import HomeTypeScreen from "./HomeTypes";
import AddCardPreview from "../Components/MainHome/AddCardPreview";
import FilterBar from "../Components/MainHome/FilterBar";
import { Image } from "react-native";

const SimilarProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { category, similarProducts } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMapButton, setShowMapButton] = useState(true);
  const [loc, setLoc] = useState(null);

  const getSavedLocation = async () => {
    const token = await AsyncStorage.getItem("authToken");
    console.log(' token ', token)
    const location = await getApi(EndPoints.getLocation, setLoading, token);
    if (location?.data?.data?.length > 0) {
      console.log(' location ', location)
      setLoc(location?.data?.data[0]);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getSavedLocation();
    setRefreshing(false);

  }, []);

  useEffect(() => {
        console.log('---similar product ', similarProducts)
    getSavedLocation();
  }, []);

  const endpoint = category
    ? `${EndPoints.getProduct}?superSubCategory=${encodeURIComponent(category)}`
    : undefined;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {loading && <LoadingModal />}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LocationDropdown", { from: "home" })
            }
            style={styles.locationContainer}
          >
            <Text style={styles.location} numberOfLines={1}>
              <MaterialIcons name="location-on" size={wp("4%")} color="red" />{" "}
              {(loc as any)?.fullAddress?.split(",")[0]}
            </Text>
            <Ionicons name="chevron-down" size={wp("3.5%")} color="#FF0303" />
          </TouchableOpacity>
          <Text
            onPress={() =>
              navigation.navigate("LocationDropdown", { from: "home" })
            }
            style={styles.address}
            numberOfLines={1}
          >
            {(loc as any)?.fullAddress?.split(",").slice(1).join(",").trim()}
          </Text>
        </View>

        <View style={styles.rightIcons}>
          <View style={styles.bellContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Favourite")}>
              <FontAwesome name="heart-o" size={20} color="#FF0303" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Feather name="bell" size={21} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          paddingBottom: 0,
          zIndex: 10000,
          elevation: 1,
          marginBottom: 5,
        }}
      >
        <FilterBar hideFilterIcon={false} />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./../../assets/images/carcard.png")}
          style={{ height: 40, width: 70, borderRadius: 8, marginVertical: 10 }}
        />
        <Text style={{ fontSize: 18, marginLeft: 8 }}>Similar Products</Text>
      </View>
      <View style={{ flex: 1 }}>
        <AddCardPreview
          EndpointUrl={endpoint}
          hideFilter={true}
          hidePostCount
          from="similar"
          similarData={similarProducts}
        />
      </View>
    </View>
  );
};

export default SimilarProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal:hp(1)
  },
  header: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    marginTop: hp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "black",
    marginRight: wp("1%"),
    fontFamily: "Poppins-Bold",
    maxWidth: "80%",
  },
  address: {
    fontSize: wp("3.2%"),
    color: "#6E533F",
    fontFamily: "Poppins-Regular",
    maxWidth: "80%",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellContainer: {
    marginRight: wp("3%"),
  },
  scrollViewContent: {
    paddingBottom: hp(10),
  },
  searchBarContainer: {
    marginBottom: 10,
  },
});
