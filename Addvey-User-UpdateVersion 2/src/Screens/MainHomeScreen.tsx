import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ScrollView,
  RefreshControl, // Added for pull-to-refresh
  Animated, // Added for animations
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import RecentViewedScreen from "../Components/MainHome/RecentlyViewed";
import HomeTypeScreen from "./HomeTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiHelper, getApi, PostAPi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import MapViewButton from "../Components/MapViewButton";
import LoadingModal from "../Components/Loader";
import SearchBar from "../Components/MainHome/Searchbar";
import { useLocationContext } from "../context/LocationContext";
import { HomeFilterProvider, useHomeFilter } from "../context/HomeFilterContext";
import { useTabBarScroll } from "../context/TabBarScrollContext";
import FilterBar from "../Components/MainHome/FilterBar";
import CategoryModal from "./CategoryModal";
import { getSession } from "../services/session";
import {
  buildImageSource,
  NO_IMAGE_PLACEHOLDER,
} from "../utils/imageFallback";

const MainHomeScreen = () => {
  interface Category {
    _id: string;
    name: string;
    image: string;
  }

  interface Slider {
    _id: string;
    imagesUrl: string;
  }

  const { currentLocation } = useLocationContext();
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const [showMapButton, setShowMapButton] = useState(true); // Control map button visibility
  const [recentViews, setRecentViews] = useState([]);
  const [failedSliderImages, setFailedSliderImages] = useState<Record<number, boolean>>({});
  const { showCategoryModal, setShowCategoryModal } = useHomeFilter();
  const { showTabBar, hideTabBar } = useTabBarScroll();

  // Refs for scroll logic
  const lastContentOffset = useRef(0);
  const isTabBarHidden = useRef(false);



  // Sticky Filter State Removed


  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Start animations when component mounts
  useEffect(() => {
    setFailedSliderImages({});
    if (sliders.length > 0) {
      startAnimations();
    }
  }, [sliders])

  useEffect(() => {
    console.log('--- modela. check ', showCategoryModal)
  }, [showCategoryModal])
  

  const startAnimations = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);

    // Parallel animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchSliders = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await apiHelper(EndPoints.getSliders, {
        method: "GET",
        token: token || "",
      });

      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setSliders(res.data || []);
      } else {
        setSliders([]);
      }
    } catch (error) {
      setSliders([]);
      console.warn("Failed to fetch sliders", error);
    }
  };

  const fetchMainCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await apiHelper(EndPoints.getCategories, {
        method: "GET",
        token: token || "",
      });

      if (res?.success && Array.isArray(res.data?.data)) {
        setCategories(res.data?.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);
      console.warn("Failed to fetch categories", error);
    }
  };

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Restart animations
    startAnimations();

    // Fetch all data again
    await Promise.all([
      fetchSliders(),
      fetchMainCategories(),
      // getSavedLocation(), // Removed as handled by context
    ]);

    setRefreshing(false);
  }, []);

  // Scroll handler to hide/show map button
  // Scroll handler to hide/show map button and bottom tab bar
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Existing Map Button Logic
    // Hide map button when scrolling down considerable amount (absolute check)
    if (scrollY > 100 && showMapButton) {
      setShowMapButton(false);
    } else if (scrollY <= 100 && !showMapButton) {
      setShowMapButton(true);
    }

    // New Bottom Tab Bar Logic (Direction-based)
    const diff = scrollY - lastContentOffset.current;

    // Threshold to avoid jitter
    if (Math.abs(diff) > 20) {
      if (diff > 0 && scrollY > 50 && !isTabBarHidden.current) {
        // Scrolling Down -> Hide Tab Bar
        hideTabBar();
        isTabBarHidden.current = true;
      } else if (diff < 0 && isTabBarHidden.current) {
        // Scrolling Up -> Show Tab Bar
        showTabBar();
        isTabBarHidden.current = false;
      }
    }

    lastContentOffset.current = scrollY;
  };

  useFocusEffect(
    useCallback(() => {
      fetchSliders();
      fetchMainCategories();
    }, [])
  );


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {loading && <LoadingModal />}

      {/* Header with animation */}
      <View style={styles.header}>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LocationDropdown", { from: "home" })
            }
            style={styles.locationContainer}
          >
            <View style={styles.locationRow}>
              <View style={styles.locationMarkerIconWrap}>
                <Image
                  source={require("../../assets/images/Vector.png")}
                  style={styles.locationMarkerCustomIcon}
                />
              </View>
              <Text style={styles.location} numberOfLines={1}>
                {
                // currentLocation?.city || currentLocation?.fullAddress?.split(",")[0]
               getSession()?.village || getSession()?.city || "Select Location"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#FF0303" />
          </TouchableOpacity>
          <Text
            onPress={() =>
              navigation.navigate("LocationDropdown", { from: "home" })
            }
            style={styles.address}
            numberOfLines={1}
          >
            {
            // currentLocation?.fullAddress?.split(",").slice(1).join(",").trim()
             getSession()?.displayAddress  || getSession()?.fullAddress || "Tap to select location"}
          </Text>
        </View>

        <View style={styles.rightIcons}>
          <View style={styles.bellContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Favourite")}>
              <FontAwesome name="heart-o" size={20} color="#FF0303" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Notification",
            { hideHeaderAndSearch: true }

          )}>
            <Feather name="bell" size={21} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar with animation */}
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View style={styles.searchBottomShadow} />

      {/* Content with pull-to-refresh */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF0303"]} // Android
            tintColor="#FF0303" // iOS
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        stickyHeaderIndices={[3]}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >


        {/* Slider with animation */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.sliderContainer}>
            {sliders.length > 0 ? (
              <Swiper
                autoplay
                loop
                autoplayTimeout={3.5}
                showsPagination
                loadMinimal
                loadMinimalSize={2}
                paginationStyle={{ bottom: 10 }}
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
              >
                {sliders.map((img, index) => (
                  <Image
                    key={index}
                    source={
                      failedSliderImages[index]
                        ? NO_IMAGE_PLACEHOLDER
                        : buildImageSource(img?.imagesUrl)
                    }
                    style={styles.sliderImage}
                    onError={() =>
                      setFailedSliderImages((prev) =>
                        prev[index] ? prev : { ...prev, [index]: true }
                      )
                    }
                  />
                ))}
              </Swiper>
            ) : (
              <Image
                source={NO_IMAGE_PLACEHOLDER}
                style={styles.sliderImage}
              />
            )}
          </View>
        </Animated.View>

        {/* Categories with staggered animation */}
        <Animated.View
          style={[
            styles.categoriesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("MapsCategories", { item: item })
              }
            >
              <View style={styles.categoryIconContainer}>
                <Image
                  source={buildImageSource(item?.image)}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryText}>{item?.name}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>


        <RecentViewedScreen />

        {/* Sticky Filter Bar */}
        <View style={styles.filterBarWrapper}>
          <FilterBar hideFilterIcon={true} />
        </View>

        {/* Wrapper */}
     
          <HomeTypeScreen />
        
      </ScrollView>

      {/* Animated Map Button - hides on scroll */}
      {/* {showMapButton && ( */}
      <View style={styles.mapButtonContainer}>
        <MapViewButton
          title={"Map"}
          onPress={() => {
            navigation.navigate("MainMapListing");
          }}
        />
      </View>
      {/* )} */}

      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        activeCategory={null}
        onCategorySelect={(category) => {
          setShowCategoryModal(false);
          navigation.navigate("MapsCategories", { item: category });
        }}
        subCategory={[]}
        selectedSubTab={null}
        onSubCategorySelect={() => { }}
        superSubCategory={[]}
        onSuperSubCategorySelect={() => { }}
      />
    </View>
  );
};

export default MainHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /** Header */
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationMarkerIconWrap: {
    width: 16,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    overflow: "visible",
  },
  locationMarkerCustomIcon: {
    width: 16,
    height: 24,
    resizeMode: "contain",
  },
  location: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: "black",
    marginRight: 4,
    fontFamily: "Poppins-Bold",
    maxWidth: wp(44),
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6E533F",
    fontFamily: "Poppins-Regular",
    maxWidth: wp(62),
    marginLeft: 22,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellContainer: {
    marginRight: wp("3%"),
  },

  /** ScrollView Content */
  scrollViewContent: {
    paddingBottom: hp(10),
  },

  /** Search Section */
  searchBarContainer: {
    marginBottom: 0,
    zIndex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: hp(0.8),
  },
  searchBottomShadow: {
    height: 1,
    backgroundColor: "#ECECEC",
  },
  // ... (keep existing styles)
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3.5),
    marginTop: hp(0),
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    height: hp(5.2),
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: "#000",
  },
  micIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
  },
  qrContainer: {
    marginLeft: wp(3),
  },
  qrIcon: {
    width: wp(7.5),
    height: wp(7.5),
    resizeMode: "contain",
  },

  /** Slider Section */
  sliderWrapper: {
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: hp(1.5),
  },
  sliderContainer: {
    width: wp(100),
    height: hp(20),
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
    elevation: 0,
    backgroundColor: "#fff",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dot: {
    backgroundColor: "#fff",
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(2),
    marginHorizontal: wp(1),
  },
  activeDot: {
    backgroundColor: "#6C63FF",
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(2),
    marginHorizontal: wp(1),
  },

  /** Categories */
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignSelf: "center",
    width: wp(95),
    marginTop: hp(3),
  },
  categoryItem: {
    width: wp(17),
    alignItems: "center",
    marginBottom: hp(3.5),
  },
  categoryIconContainer: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(3),
    borderWidth: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(1),
  },
  categoryIcon: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  categoryText: {
    fontSize: hp(1.2),
    color: "#000",
    textAlign: "center",
    marginTop: hp(0.5),
    fontFamily: "Poppins-Regular",
  },

  filterBarWrapper: {
    backgroundColor: "#fff",
    paddingBottom: 0,
    zIndex: 1000,
  },

  /** Map Button Container */
  mapButtonContainer: {
    position: "absolute",
    bottom: hp(8),
    right: wp(48),
    zIndex: 1000,
  },

  /** Sticky Filter */
  stickyFilterContainer: {
    position: "absolute",
    top: hp(4) + hp(1.5) * 2 + hp(5.2) + 20, // Approximate header + search bar + margins. Better to use onLayout but hardcode for now.
    // Actually, I placed it relative to the container which starts at top.
    // Header is hp(4) margin top + padding.
    // Let's refine the specific top value or just place it in layout.
    // But since I used absolute positioning, let's try to infer it.
    // Or just put left: 0, right: 0.
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  }
});
