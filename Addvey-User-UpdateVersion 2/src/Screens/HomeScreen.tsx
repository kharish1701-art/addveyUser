import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import AppCard from "../Components/Home/AppCard";
import SearchBar from "../Components/MainHome/Searchbar";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EndPoints } from "../services/EndPoints";
import { getApi, PostAPi } from "../api/getApi/getApi";
import axios from "axios";
import { goPlayStore } from "../Components/CommonFunction";
import { BaseUrl } from "../api/authApi/BaseUrl";
import SavedLocationModal from "../Components/Home/SavedLocationModal";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import { useLocationContext, LocationData, fetchAddress } from "../context/LocationContext";
import { getSession, setSession } from "../services/session";
import CustomLoader from "../Components/Loader";
import {
  buildImageSource,
  NO_IMAGE_PLACEHOLDER,
} from "../utils/imageFallback";

const images: { [key: string]: any } = {
  buysell: require("../../assets/images/buysell.png"),
  bike: require("../../assets/images/bike.png"),
  near: require("../../assets/images/near.png"),
  Services: require("../../assets/images/Services.png"),
  jobs: require("../../assets/images/jobs.png"),
  Puja: require("../../assets/images/Puja.png"),
  bolt: require("../../assets/images/bolt.png"),
  globe: require("../../assets/images/globe.png"),
  bulb: require("../../assets/images/bulb.png"),
  img1: require("../../assets/images/1.png"),
  img2: require("../../assets/images/2.png"),
  img3: require("../../assets/images/3.png"),
  tabAddvey: require("../../assets/images/add.png"),
  tabBuySell: require("../../assets/images/by.png"),
  profile: require("../../assets/images/profile.png"),
  slide1: require("../../assets/images/1.png"),
  slide2: require("../../assets/images/2.png"),
  slide3: require("../../assets/images/3.png"),
  slide4: require("../../assets/images/bike.png"),
  slide5: require("../../assets/images/buysell.png"),
  slide6: require("../../assets/images/jobs.png"),
};

// Global variable to track if location was selected in current session

export let locationSelectedInSession = false;

export const markLocationSelected = () => {
  locationSelectedInSession = true;
};

const HomeScreen: React.FC = () => {
  const {
    currentLocation,
    recentLocations, updateCurrentLocation, isLocationEnabled, checkLocationPermission: checkContextPermission } = useLocationContext();

  const lastContentOffset = React.useRef(0);
  const isTabBarHidden = React.useRef(false);
  const tabBarTranslateY = React.useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const diff = scrollY - lastContentOffset.current;

    // Threshold to avoid jitter
    if (Math.abs(diff) > 20) {
      if (diff > 0 && scrollY > 50 && !isTabBarHidden.current) {
        // Scrolling Down -> Hide Tab Bar
        Animated.timing(tabBarTranslateY, {
          toValue: 100, // Adjust height as needed
          duration: 300,
          useNativeDriver: true,
        }).start();
        isTabBarHidden.current = true;
      } else if (diff < 0 && isTabBarHidden.current) {
        // Scrolling Up -> Show Tab Bar
        Animated.timing(tabBarTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        isTabBarHidden.current = false;
      }
    }
    lastContentOffset.current = scrollY;
  };

  const [activeTab, setActiveTab] = useState("Addvey");
  const navigation = useNavigation<any>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEnableLocationModal, setEnableLocationModal] = useState(false);
  const [savedLocationVisible, setSavedLocationVisible] = useState(false);
  const [slider, setSlider] = useState([]);
  const [failedSliderImages, setFailedSliderImages] = useState<Record<number, boolean>>({});
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const getRecentSearches = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("token", token)
      console.log("Serach", `${BaseUrl}/user-search-history/show-searched-history?page=1&limit=5`)
      const res = await axios.get(
        `${BaseUrl}/user-search-history/show-searched-history?page=1&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Home Search res", res.data);
      if (res.data?.success) {
        setRecentSearches(res.data.data.data);
      }
    } catch (error) {
      console.log("Recent search error", JSON.stringify(error));
    }
  };
  useEffect(() => {
    getRecentSearches();
  }, []);

  const onSubmitSearch = (ss) => {
    if (ss) {
      console.log(ss)

      setSearchModal(false);
      Keyboard.dismiss();
      navigation.navigate("SearchResultScreen", { keyword: ss });
    }
    else if (String(search || "").trim().length === 0) return;

    setSearchModal(false);
    Keyboard.dismiss();

    navigation.navigate("SearchResultScreen", { keyword: search });
  };

  const { isListening, results, startRecognizing, stopRecognizing, resetResults } = useVoiceRecognition();

  // Update search when voice results come in
  useEffect(() => {
    if (results && results?.length > 0) {
      setSearch(String(results[0]));
    }
  }, [results]);

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopRecognizing();
    } else {
      resetResults();
      startRecognizing();
    }
  };

  // Function to mark location as selected in current session
  const markLocationSelected = () => {
    locationSelectedInSession = true;
  };

  // Check if we should show location modal
  const shouldShowLocationModal = () => {
    return !locationSelectedInSession && !currentLocation;
  };

  const enableDeviceLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return;

    const res = await Location.getCurrentPositionAsync({});
    if (!res?.coords?.latitude) return;
    setLoading(true)
    const address = await fetchAddress(
      res.coords.latitude,
      res.coords.longitude
    );
    console.log(address, 'address')
    setSavedLocationVisible(false)
    setModalVisible(false)
    setLoading(false)
    if (address) {
      setSession({
        ...address,
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
      });
    }

  }
  // const enableDeviceLocation = async () => {
  //   try {
  //     await checkContextPermission();

  //     const { status } = await Location.getForegroundPermissionsAsync();
  //     const servicesEnabled = await Location.hasServicesEnabledAsync();

  //     if (status === "granted" && servicesEnabled) {
  //       setLoading(true);
  //       const location = await Location.getCurrentPositionAsync({});
  //       const regionName = await Location.reverseGeocodeAsync({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //       });

  //       if (regionName && regionName.length > 0) {
  //         const address = regionName[0];
  //         const formattedAddress = `${address.name || ''}, ${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${address.postalCode || ''}, ${address.country || ''}`
  //           .replace(/, ,/g, ',')
  //           .replace(/^, /, '')
  //           .replace(/,$/, '');

  //         const newLoc: LocationData = {
  //           id: Math.random().toString(),
  //           lat: location.coords.latitude,
  //           long: location.coords.longitude,
  //           fullAddress: formattedAddress,
  //           city: address.city || address.region || undefined
  //         };

  //         await updateCurrentLocation(newLoc);
  //         markLocationSelected();
  //       }
  //       setLoading(false);
  //     }

  //     // If successful, context will update location
  //     setModalVisible(false);
  //     setSavedLocationVisible(false);
  //   } catch (err) {
  //     console.log("Enable device location error:", err);
  //     setLoading(false);
  //   }
  // };

  const handleConfirm = async (item: LocationData) => {
    // await updateCurrentLocation(item);
    setSession(item)
    markLocationSelected();
    setModalVisible(false);
    setSavedLocationVisible(false);
  };

  /* Location permission check logic */
  useEffect(() => {
    // Logic to show modal if location not selected
    const initLocationCheck = async () => {
      if (shouldShowLocationModal()) {
        if (recentLocations && recentLocations.length > 0) {
          setSavedLocationVisible(true);
        } else {
          if (!isLocationEnabled && !currentLocation) {
            const hasAsked = await AsyncStorage.getItem("hasAskedLocationPermission");
            if (!hasAsked) {
              setModalVisible(true);
              await AsyncStorage.setItem("hasAskedLocationPermission", "true");
            }
          }
        }
      }
    }
    initLocationCheck();
  }, [recentLocations, isLocationEnabled, currentLocation]);

  // Removed getSavedLocation as data comes from context now

  // Initialize on component mount
  // useEffect(() => {
  //   (async () => {
  //     if (!locationSelectedInSession) {
  //       // getSavedLocation(); // Replaced by context handling
  //     }
  //   })();
  // }, []);

  // Fetch profile data
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const response = await getApi(EndPoints.getProfile, setLoading, token);
        if (response?.success) {
          setProfileData(response.data);
        }
      };
      fetchProfile();
    }, [])
  );



  const toggleModal = () => {
    // Don't allow opening modal if location was already selected in this session
    if (!shouldShowLocationModal()) {
      console.log("Location already selected, modal disabled");
      return;
    }

    if (recentLocations?.length > 0) {
      setSavedLocationVisible(!savedLocationVisible);
    } else {
      setModalVisible(!isModalVisible);
    }
  };
  useEffect(() => {
    // Sync current location to session if available and session is empty
    if (!getSession() && currentLocation) {
      setSession(currentLocation);
      markLocationSelected();
    }

    if (shouldShowLocationModal()) {
      if (recentLocations?.length > 0) {
        setSavedLocationVisible(true);
      } else {
        setModalVisible(true);
      }
    }
  }, [currentLocation, recentLocations]);
  const fetchSlider = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const response = await getApi(EndPoints.getSliders, setLoading, token);
    if (response?.success) {
      setSlider(response.data);
    }
  };

  const gridItems = [
    { id: 1, title: "Buy/Sell", img: "buysell", comingSoon: false },
    { id: 2, title: "Bike", img: "bike", comingSoon: true },
    { id: 3, title: "Near Us", img: "near", comingSoon: true },
    { id: 4, title: "Services", img: "Services", comingSoon: true },
    { id: 5, title: "Jobs", img: "jobs", comingSoon: true },
    { id: 6, title: "Pooja", img: "Puja", comingSoon: true },
  ];

  // Handle manual location selection from LocationDropdown
  const handleManualLocationSelect = () => {
    markLocationSelected();
    setModalVisible(false);
    setSavedLocationVisible(false);
  };

  useEffect(() => {
    fetchSlider();
  }, []);
  useEffect(() => {
    setFailedSliderImages({});
  }, [slider]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Fixed Header */}
      {loading && <CustomLoader />}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal}>
          <View>
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={() =>
                navigation.navigate("LocationDropdown", {
                  from: "home",
                  onLocationSelect: handleManualLocationSelect,
                })
              }
            >
              <Text style={styles.location} numberOfLines={1}>
                <MaterialIcons name="location-on" size={wp("4%")} color="red" />{" "}
                {getSession()?.village || getSession()?.city || getSession()?.fullAddress?.split(",")[0] || currentLocation?.city || currentLocation?.fullAddress?.split(",")[0] || "Select Location"}
              </Text>
              <Ionicons name="chevron-down" size={wp("3.5%")} color="#FF0303" />
            </TouchableOpacity>
            <Text
              onPress={() =>
                navigation.navigate("LocationDropdown", {
                  from: "home",
                  onLocationSelect: handleManualLocationSelect,
                })
              }
              style={styles.address}
              numberOfLines={1}
            >
              {
                // currentLocation?.fullAddress?.split(",").slice(1).join(",").trim() ||
                getSession()?.displayAddress || getSession()?.fullAddress || currentLocation?.displayAddress || currentLocation?.fullAddress || "Tap to select location"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Slide Modal - Only show if location not selected in this session */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View style={styles.swiperModalOverlay}>
            <TouchableOpacity
              style={styles.swiperModalCloseOutside}
              onPress={toggleModal}
            >
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>

            <View style={styles.swiperModalContent}>
              <Image
                source={require("../../assets/images/locationbottom.png")}
                style={styles.swiperModalImage}
              />

              <Text style={styles.swiperModalTitle}>
                {isLocationEnabled ? "Select your location" : "Device location not enabled"}
              </Text>

              <Text style={styles.swiperModalSubtitle}>
                {isLocationEnabled
                  ? "We need your location to show you relevant products and services."
                  : "Enable your device location for a better buying experience."}
              </Text>

              <TouchableOpacity
                style={styles.swiperModalBtn}
                onPress={enableDeviceLocation}
              >
                <Text style={styles.swiperModalBtnText}>
                  {isLocationEnabled ? "Use Current Location" : "Enable location permission"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.swiperModalBtn, styles.swiperModalBtnOutline]}
                onPress={() => {
                  navigation.navigate("LocationDropdown", {
                    from: "home",
                    onLocationSelect: handleManualLocationSelect,
                  });
                }}
              >
                <Text
                  style={[styles.swiperModalBtnText, { color: "#6C63FF" }]}
                >
                  Search location manually
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* Right Side (Bell + Profile) */}
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification",
            //  { hideHeaderAndSearch: true }
          )}>
            <View style={styles.bellContainer}>
              <Octicons name="bell" size={24} color="black" />
              {/* <View style={styles.badge}>
                <Text style={styles.badgeText}>12</Text>
              </View> */}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.main}
            onPress={() => navigation.navigate("MainProfile")}
          >
            <Image
              source={
                profileData?.image
                  ? buildImageSource(profileData?.image)
                  : NO_IMAGE_PLACEHOLDER
              }
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchSection}>
        <TouchableOpacity activeOpacity={1}>
          <SearchBar onPress={() => setSearchModal(true)} />
        </TouchableOpacity>
      </View>

      {/* Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View style={styles.sliderContainer}>
          {slider?.length > 0 ? (
            <Swiper
              autoplay
              autoplayTimeout={3}
              showsPagination
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
            >
              {slider?.map((item, index) => (
                <Image
                  key={index}
                  source={
                    failedSliderImages[index]
                      ? NO_IMAGE_PLACEHOLDER
                      : buildImageSource(item?.imagesUrl)
                  }
                  style={styles.slideImage}
                  onError={() =>
                    setFailedSliderImages((prev) =>
                      prev[index] ? prev : { ...prev, [index]: true }
                    )
                  }
                />
              ))}
            </Swiper>
          ) : (
            <Image source={NO_IMAGE_PLACEHOLDER} style={styles.slideImage} />
          )}
        </View>

        {/* Grid Section */}
        <View style={styles.grid}>
          {gridItems.map((item) =>
            item.id === 1 ? (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={async () => {
                  const dd = await AsyncStorage.getItem("IntroBuySell");
                  if (dd) {
                    navigation.navigate("Botomtabs", { screen: "Home" });
                  } else {
                    await AsyncStorage.setItem("IntroBuySell", "true");
                    navigation.navigate("BuyAndSellStartup");
                  }
                }}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={images[item.img]}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  {item.comingSoon && (
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>Coming Soon</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.gridText, { color: "black" }]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ) : (
              <View key={item.id} style={styles.gridItem}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={images[item.img]}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  {item.comingSoon && (
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>Coming Soon</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.gridText, { color: "#00000061" }]}>
                  {item.title}
                </Text>
              </View>
            )
          )}
        </View>

        {/* Get Started */}
        <View style={styles.section}>
          <Text style={styles.getStarted}>Get started</Text>
          <View style={styles.underline} />

          <View style={styles.bulletRow}>
            <Image
              source={images.bolt}
              style={styles.bulletIcon}
              resizeMode="contain"
            />
            <Text style={styles.bulletText}>START WHERE YOU ARE</Text>
          </View>
          <View style={styles.bulletRow}>
            <Image
              source={images.globe}
              style={styles.bulletIcon}
              resizeMode="contain"
            />
            <Text style={styles.bulletText}>USE WHAT YOU HAVE</Text>
          </View>
          <View style={styles.bulletRow}>
            <Image
              source={images.bulb}
              style={styles.bulletIcon}
              resizeMode="contain"
            />
            <Text style={styles.bulletText}>DO WHAT YOU CAN</Text>
          </View>
        </View>

        <AppCard
          heading="Addvey User App"
          image={require("../../assets/images/blackvend.png")}
          title="Addvey"
          subtitle="Online marketplace"
          category="Property"
          buttonText="Install"
          showDivider={true}
          onPress={() => goPlayStore()}
        />

        <AppCard
          heading="Delivery Support Partner"
          image={require("../../assets/images/redend.png")}
          title="Addvey Delivery Partner app"
          subtitle="Delivery"
          category="Business"
          buttonText="Install"
          comingSoon={true}
          disabled={true}
        />

        {/* The perfect place section */}
        <View style={styles.sectionBottomPerfect}>
          <Text style={styles.title}>The perfect</Text>
          <Text style={styles.subtitle}>place for your needs!</Text>

          <Text style={styles.footerText}>Crafted with ❤️ love in India.</Text>

          <View style={styles.imageRow}>
            <Image source={images.img1} style={styles.rowImage} />
            <Image source={images.img2} style={styles.rowImage} />
            <Image source={images.img3} style={styles.rowImage} />
          </View>
        </View>

        {/* Slogan */}
        <View style={styles.sectionBottom}>
          <Text style={styles.addveyText}>
            <Text
              style={{
                color: "black",
                fontWeight: "600",
                fontFamily: "Poppins-Bold",
              }}
            >
              Addvey
            </Text>{" "}
            <Text
              style={{
                color: "gray",
                fontFamily: "Poppins-Medium",
              }}
            >
              - Adding multiple ways
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Tabs with active indicator */}
      <Animated.View
        style={[
          styles.bottomTabsWrapper,
          { transform: [{ translateY: tabBarTranslateY }] },
        ]}
      >
        <View style={styles.bottomTabs}>
          <View
            style={[
              styles.activeLine,
              activeTab === "Addvey" ? { left: "25%" } : { left: "75%" },
            ]}
          />

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("Addvey")}
          >
            <Image source={images.tabAddvey} style={styles.tabIcon} />
            <Text style={styles.tabText}>Addvey</Text>
          </TouchableOpacity>

          <View style={styles.verticalLine} />

          <TouchableOpacity
            style={styles.tab}
            onPress={async () => {
              const dd = await AsyncStorage.getItem("IntroBuySell");
              if (dd) {
                navigation.navigate("Botomtabs", { screen: "Home" });
              } else {
                await AsyncStorage.setItem("IntroBuySell", "true");
                navigation.navigate("BuyAndSellStartup");
              }
            }}
          >
            <Image source={images.tabBuySell} style={styles.tabIcon} />
            <Text style={styles.tabText}>Buy/Sell</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Saved Location Modal - Only show if location not selected in this session */}
      {savedLocationVisible && (
        <SavedLocationModal
          data={recentLocations}
          visible={savedLocationVisible}
          onClose={() => setSavedLocationVisible(false)}
          onLocationSelect={handleConfirm}
          EnableLocation={enableDeviceLocation}
          onManualLocation={() => {
            setSavedLocationVisible(false);
            navigation.navigate("LocationManually" as never);
          }}
        />
      )}
      <Modal visible={searchModal} animationType="fade"
        transparent={true} // Transparent background for overlay
        onRequestClose={() => setSearchModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSearchModal(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header: Back + Title */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSearchModal(false)} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#3d4152" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Search for stores, pets, PG, & more</Text>
              </View>

              {/* Search Row: Input + Mic + External QR */}
              <View style={styles.modalSearchRow}>
                <View style={styles.modalSearchInputContainer}>
                  <TextInput
                    autoFocus
                    value={search}
                    placeholder="Search for stores, pets, PG & more"
                    placeholderTextColor="#686b78"
                    onChangeText={setSearch}
                    onSubmitEditing={onSubmitSearch}
                    returnKeyType="search"
                    style={styles.modalInput}
                  />

                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch("")} style={styles.clearIcon}>
                      <Ionicons name="close-circle" size={18} color="#686b78" />
                    </TouchableOpacity>
                  )}

                  <View style={styles.verticalDivider} />

                  <TouchableOpacity style={styles.micIcon} onPress={toggleVoiceSearch}>
                    <Ionicons
                      name={isListening ? "mic" : "mic-outline"}
                      size={20}
                      color={isListening ? "#6C63FF" : "#ff5200"}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.externalQrButton}
                  onPress={() => {
                    setSearchModal(false);
                    navigation.navigate("QRCodeScanner");
                  }}
                >
                  <MaterialIcons name="qr-code-scanner" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* External QR Button */}




              {recentSearches.length > 0 && (
                <View style={styles.recentSection}>
                  <Text style={styles.recentHeader}>RECENTLY SEARCHED</Text>
                  <View style={styles.recentChipsContainer}>
                    {recentSearches.map(item => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.recentChip}
                        onPress={() => onSubmitSearch(item.queryText)}
                      >
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color="#686b78"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.recentChipText}>
                          {item.queryText}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView >
  );
};

export default HomeScreen;

// Your styles remain exactly the same...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: hp("12%") },
  header: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    marginTop: hp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  locationContainer: { flexDirection: "row", alignItems: "center" },
  searchSection: {
    backgroundColor: "#fff",
    paddingBottom: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  main: {
    backgroundColor: "#eee",
    borderRadius: wp("5%"),
  },
  location: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "black",
    marginRight: wp("1%"),
    fontFamily: "Poppins-Bold",
    maxWidth: wp(60),
  },
  address: {
    fontSize: wp("3.2%"),
    color: "#6E533F",
    fontFamily: "Poppins-Regular",
    width: wp(60),
  },
  rightIcons: { flexDirection: "row", alignItems: "center" },
  bellContainer: { marginRight: wp("4%") },
  badge: {
    position: "absolute",
    top: -hp("0.5%"),
    right: -wp("0.3%"),
    backgroundColor: "#6C63FF",
    borderRadius: wp("10%"),
    padding: 3,
  },
  badgeText: { color: "#fff", fontSize: wp("1.8%"), fontWeight: "700" },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 50,
    resizeMode: "contain",
  },
  sliderContainer: {
    height: hp("20%"),
    width: "100%",
    marginTop: 15,
  },
  slideImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  dot: {
    backgroundColor: "#fff",
    width: 5,
    height: 5,
    borderRadius: 4,
    margin: 0,
  },
  activeDot: {
    backgroundColor: "#6C63FF",
    width: 5,
    height: 5,
    borderRadius: 5,
    margin: 0,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: hp("2%"),
  },
  gridItem: {
    width: wp("28%"),
    height: hp("14%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp("1%"),
  },
  icon: {
    width: wp("15%"),
    height: wp("15%"),
    marginBottom: hp("1%"),
  },
  gridText: {
    fontSize: wp("3%"),
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  overlay: {
    position: "absolute",
    top: "42%",
    left: "35%",
    transform: [{ translateX: -wp("10%") }, { translateY: -hp("1%") }],
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: wp("1%"),
    paddingVertical: hp("0.2%"),
  },
  overlayText: {
    color: "#007AFF",
    fontSize: wp("2.1%"),
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  section: {
    marginTop: hp("1%"),
    paddingHorizontal: wp("6%"),
    marginBottom: hp(4),
  },
  sectionBottomPerfect: { marginTop: hp("4%"), paddingHorizontal: wp("6%") },
  sectionBottom: { paddingHorizontal: wp("6%") },
  getStarted: {
    fontSize: wp("6%"),
    textAlign: "center",
    marginBottom: hp("1%"),
    marginTop: hp(3),
    fontFamily: "Boogaloo-Regular",
  },
  underline: {
    alignSelf: "center",
    width: wp("60%"),
    height: 0.5,
    backgroundColor: "#D9D9D9DE",
    marginBottom: hp(4),
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
    marginLeft: wp(2),
  },
  bulletIcon: {
    width: wp("4%"),
    height: wp("4%"),
    marginRight: wp(1),
  },
  bulletText: {
    fontSize: wp("3.2%"),
    marginLeft: wp("2%"),
    color: "#00000080",
  },
  title: {
    fontSize: wp("7%"),
    fontWeight: "700",
    textAlign: "left",
    color: "#00000099",
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: wp("7%"),
    fontWeight: "700",
    marginBottom: hp("2%"),
    color: "#00000099",
    fontFamily: "Poppins-Bold",
  },
  imageRow: { flexDirection: "row", marginTop: hp("2%") },
  rowImage: {
    width: wp("10%"),
    height: hp("8%"),
    borderRadius: 10,
    resizeMode: "contain",
    marginRight: wp(2),
  },
  footerText: {
    color: "black",
    fontSize: wp("3.5%"),
    marginTop: hp(1.8),
    fontFamily: "Poppins-Regular",
  },
  addveyText: { fontSize: wp("4%"), fontWeight: "600" },
  bottomTabsWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: wp("6%"),
    borderTopRightRadius: wp("6%"),
    overflow: "hidden",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#0000000D",
    elevation: 10, // optional shadow for Android
    shadowColor: "#000", // optional shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  bottomTabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp("0.5%"),
    width: "100%",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: hp(1),
    marginBottom: 6,
  },
  tabIcon: {
    width: wp("6.5%"),
    height: wp("6.5%"),
    resizeMode: "contain",
    marginRight: wp(3),
  },
  tabText: {
    fontSize: wp("4%"),
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  verticalLine: { width: 1, backgroundColor: "#ccc", height: hp("2.8%") },
  activeLine: {
    position: "absolute",
    top: 0,
    width: "28%",
    height: 4,
    backgroundColor: "#6C63FF",
    transform: [{ translateX: -wp("12.5%") }],
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  swiperModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  swiperModalCloseOutside: {
    alignSelf: "flex-end",
    marginBottom: hp(1),
    marginRight: 10,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: wp(14),
    padding: 8,
  },
  swiperModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: wp(5),
    alignItems: "center",
  },
  swiperModalImage: {
    width: wp(30),
    height: wp(30),
    resizeMode: "contain",
    marginBottom: hp(2),
  },
  swiperModalTitle: {
    fontSize: wp(3.8),
    textAlign: "center",
    marginBottom: hp(0.5),
    fontFamily: "Poppins-Medium",
  },
  swiperModalSubtitle: {
    fontSize: wp(3),
    textAlign: "center",
    marginBottom: hp(3),
    fontFamily: "Poppins-Regular",
    paddingHorizontal: wp(10),
    color: "#00000080",
  },
  swiperModalBtn: {
    width: "100%",
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.8),
    marginBottom: hp(1.5),
    borderRadius: 16,
    alignItems: "center",
  },
  swiperModalBtnText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
  },
  swiperModalBtnOutline: {
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 5,
    backgroundColor: "#fff",
  },
  backBtn: {
    paddingRight: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  iconRight: {
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dimmed background
    justifyContent: 'flex-start', // Align content to top
  },
  modalContent: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    paddingBottom: 30,
    paddingTop: hp(6), // Add padding for status bar
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 16,
    color: "#3d4152",
    fontFamily: "Poppins-Medium", // Assuming font family availability
  },
  modalSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalSearchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 10,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: "#3d4152",
    height: "100%",
  },
  clearIcon: {
    padding: 4,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#d4d5d9",
    marginHorizontal: 8,
  },
  micIcon: {
    padding: 4,
  },
  externalQrButton: {
    padding: 4,
  },
  recentSection: {
    padding: 20,
  },
  recentHeader: {
    fontSize: 13,
    color: "#686b78", // Muted text color
    fontWeight: "600",
    marginBottom: 15,
    letterSpacing: 1, // Uppercase spacing usually
    fontFamily: "Poppins-Medium",
  },
  recentChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  recentChipText: {
    fontSize: 14,
    color: "#3d4152",
    fontFamily: "Poppins-Regular",
  },
});
