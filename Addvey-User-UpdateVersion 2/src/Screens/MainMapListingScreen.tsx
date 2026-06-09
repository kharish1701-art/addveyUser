import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Modal,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "../Components/OlaMaps";

import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, Octicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { apiHelper, getApi } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import LoadingModal from "../Components/Loader";
import { EndPoints } from "../services/EndPoints";
import { SafeAreaView } from "react-native-safe-area-context";
import ExampleListingModalMap from "../Components/MainHome/ExampleListingModalMap";

import ListTypeModal from "../Components/HomeType/ListTypeModal";
import Distance from "../Components/HomeType/Distance";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import FilterModal from "../Components/FilterModal";

const MainMapListingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [region, setRegion] = useState({
    latitude: 17.4933,
    longitude: 78.3997,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [introVisible, setInroVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [selectedSubTab, setSelectedSubTab] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef<any>(null);

  // Voice Search Hook
  const { isListening, results, startRecognizing, stopRecognizing, resetResults } = useVoiceRecognition();
  const [searchQuery, setSearchQuery] = useState("");

  // Update search query when voice results change
  useEffect(() => {
    if (results && results?.length > 0 && results[0]) {
      setSearchQuery(String(results[0]));
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

  const [subCategory, setSubCategory] = useState<any>();
  const [superSubCategory, setSuperSubCategory] = useState<any>();

  // 🟢 List Type Modal State
  const [showListTypeModal, setShowListTypeModal] = useState(false);
  const [selectedListType, setSelectedListType] = useState<string[]>([]);
  // 🟢 Distance Modal State
  const [showDistanceModal, setShowDistanceModal] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<string>("");
  // 🟢 Other Filters State
  const [isRecentActive, setIsRecentActive] = useState(false);
  const [isQuickResponseActive, setIsQuickResponseActive] = useState(false);


  // Height settings
  const MIN_HEIGHT = hp(25);  // Minimum height when collapsed
  const MAX_HEIGHT = hp(55);  // Maximum height when expanded

  // Drag animation states
  const bottomSheetHeight = useRef(new Animated.Value(MAX_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(true);

  // Track the starting height for smooth drag
  const startHeight = useRef(MIN_HEIGHT);

  // Pan responder for drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        // Store the current height when drag starts
        startHeight.current = bottomSheetHeight._value;
      },
      onPanResponderMove: (_, gestureState) => {
        // Calculate new height based on drag distance
        const newHeight = startHeight.current - gestureState.dy;

        // Clamp the height between MIN and MAX
        const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));

        bottomSheetHeight.setValue(clampedHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentHeight = bottomSheetHeight._value;
        const midPoint = (MIN_HEIGHT + MAX_HEIGHT) / 2;

        // Determine target state based on current position and velocity
        let targetExpanded;

        if (Math.abs(gestureState.vy) > 0.2) {
          // If there's significant velocity, follow it
          targetExpanded = gestureState.vy < 0;
        } else {
          // Otherwise, go to nearest state
          targetExpanded = currentHeight > midPoint;
        }

        // Animate to target state
        if (targetExpanded) {
          expandBottomSheet();
        } else {
          collapseBottomSheet();
        }
      },
    })
  ).current;

  // Expand bottom sheet to max height
  const expandBottomSheet = () => {
    Animated.spring(bottomSheetHeight, {
      toValue: MAX_HEIGHT,
      useNativeDriver: false,
      damping: 20,
      stiffness: 90,
      mass: 0.8,
    }).start();
    setIsExpanded(true);
  };

  // Collapse bottom sheet to min height
  const collapseBottomSheet = () => {
    Animated.spring(bottomSheetHeight, {
      toValue: MIN_HEIGHT,
      useNativeDriver: false,
      damping: 20,
      stiffness: 90,
      mass: 0.8,
    }).start();
    setIsExpanded(false);
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      expandBottomSheet(); // Or collapseBottomSheet() depending on preference, expanding is safer default
      setIsFullScreen(false);
    } else {
      Animated.spring(bottomSheetHeight, {
        toValue: 0,
        useNativeDriver: false,
        damping: 20,
        stiffness: 90,
        mass: 0.8,
      }).start();
      setIsFullScreen(true);
      setIsExpanded(false);
    }
  };

  // Fetch main categories
  const fetchMainCategories = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const res = await apiHelper(EndPoints.getCategories, {
      method: "GET",
      token,
    });

    if (res?.success) {
      setCategories(res.data?.data);
      if (res?.data?.data.length > 0) {
        setActiveCategory(res.data?.data[0]);
        fetchSubCategories(res.data?.data[0]?.id);
        // Focus camera on first category products
        setTimeout(() => {
          focusCameraOnProducts(res.data?.data[0]?.id, 'mainCategory');
        }, 1500);
      }
    } else {
      console.warn("⚠️ Failed to fetch:", res.message);
    }
  };

  // Fetch sub categories
  const fetchSubCategories = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await getApi(
        `${EndPoints?.getSubCategories}${id ? id : activeCategory?.id}`,
        setLoading,
        token
      );

      if (res?.success) {
        setSubCategory(res?.data?.data);
        if (res?.data?.data.length > 0) {
          setSelectedSubTab(res?.data?.data[0]);
          fetchSuperSubCategories(res?.data?.data[0]?.id);
        }
      } else {
        console.warn("⚠️ Failed to fetch sub-categories:", res.message);
      }
    } catch (err) {
      console.error("Error fetching sub-categories:", err);
    }
  };

  // Fetch super sub categories
  const fetchSuperSubCategories = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await getApi(
        `${EndPoints?.getSuperSubCategories}${id ? id : selectedSubTab?.id}`,
        setLoading,
        token
      );

      if (res?.success) {
        setSuperSubCategory(res?.data?.data);
      } else {
        console.warn("⚠️ Failed to fetch super sub-categories:", res.message);
      }
    } catch (err) {
      console.error("Error fetching super sub-categories:", err);
    }
  };

  // Focus camera on products based on category
  const focusCameraOnProducts = async (categoryId, categoryType = 'superSubCategory') => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      let url = EndPoints.getProduct;

      // Build URL based on category type
      const params = [];
      if (categoryType === 'superSubCategory' && categoryId) {
        params.push(`superSubCategory=${categoryId}`);
      } else if (categoryType === 'subCategory' && categoryId) {
        params.push(`subCategory=${categoryId}`);
      } else if (categoryType === 'mainCategory' && categoryId) {
        params.push(`category=${categoryId}`);
      }

      // Add listing type filter if selected
      if (selectedListType && selectedListType.length > 0) {
        params.push(`type=${selectedListType.join(",").toLowerCase()}`);
      }

      // Add distance filter if selected
      if (selectedDistance) {
        params.push(`distance=${selectedDistance.toLowerCase()}`);
      }

      // Add recent filter
      if (isRecentActive) {
        params.push(`sort=recent`);
      }

      // Add quick response filter
      if (isQuickResponseActive) {
        params.push(`quickResponse=true`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      console.log("🔄 Fetching products for camera focus:", url);

      const res = await apiHelper(url, { method: "GET", token });

      if (res?.success) {
        const productsData = res.data?.data || res.data || [];
        console.log("📍 Products found for camera:", productsData.length);

        // Focus camera on products
        if (productsData.length > 0 && mapRef.current) {
          setTimeout(() => {
            adjustCameraToProducts(productsData);
          }, 500);
        } else {
          // If no products, focus on user location
          getCurrentLocation();
        }
      }
    } catch (error) {
      console.log("❌ Error focusing camera:", error);
      // Fallback to user location
      getCurrentLocation();
    }
  };

  // Adjust camera to show products
  const adjustCameraToProducts = (productsData) => {
    if (!productsData || !Array.isArray(productsData) || !mapRef.current) return;

    const productsWithLocation = productsData.filter(
      product => product?.location?.lat && product?.location?.lng
    );

    console.log("📍 Products with valid locations:", productsWithLocation.length);

    if (productsWithLocation.length === 0) {
      // No products with location, focus on user
      getCurrentLocation();
      return;
    }

    if (productsWithLocation.length === 1) {
      // Single product - focus on it with close zoom
      const product = productsWithLocation[0];
      mapRef.current.animateToRegion({
        latitude: parseFloat(product?.location?.lat),
        longitude: parseFloat(product?.location?.lng),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } else {
      // Multiple products - calculate bounds to fit all
      const coordinates = productsWithLocation.map(product => ({
        latitude: parseFloat(product?.location?.lat),
        longitude: parseFloat(product?.location?.lng),
      }));

      // Fit all products on screen
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 150, left: 50 },
        animated: true,
      });
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);

      if (mapRef.current) {
        // @ts-ignore
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  // Handle main category selection
  const handleMainCategorySelect = (item) => {
    setActiveCategory(item);
    fetchSubCategories(item?.id);
    focusCameraOnProducts(item?.id, 'mainCategory');
  };

  // Handle sub category selection
  const handleSubCategorySelect = (tab) => {
    const newSelection = selectedSubTab?.name === tab.name ? null : tab;
    setSelectedSubTab(newSelection);

    if (newSelection) {
      fetchSuperSubCategories(tab?.id);
      focusCameraOnProducts(tab?.id, 'subCategory');
    } else {
      // If deselected, focus on main category
      focusCameraOnProducts(activeCategory?.id, 'mainCategory');
    }
  };

  // Handle super sub category selection
  const handleSuperSubCategorySelect = (bhk) => {
    navigation.navigate("MainMap", {
      item: bhk,
      category: subCategory,
      subCategory: superSubCategory
    });
    focusCameraOnProducts(bhk?.id, 'superSubCategory');
  };

  useEffect(() => {
    getStatus()
    fetchMainCategories();
  }, []);

  const getStatus = async () => {
    const status = await AsyncStorage.getItem("mapIntroShown");
    if (!status) {
      setInroVisible(true);
      await AsyncStorage.setItem("mapIntroShown", "true");
    }
  }

  const filters = [
    // "Listing Type", // Manually handled
    "Distance",
    "Recent",
    "Quick Response",
  ];

  // Group BHK items into rows of 4 with proper distribution
  const groupBHKIntoRows = (items, itemsPerRow = 4) => {
    if (!items) return [];

    const rows = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const bhkRows = groupBHKIntoRows(superSubCategory);

  // Handle list type selection
  const handleListTypeSelect = (type: string[]) => {
    setSelectedListType(type);
    setShowListTypeModal(false);
    // Refetch logic handled by useEffect below
  };

  // Handle distance selection
  const handleDistanceSelect = (distance: string) => {
    setSelectedDistance(distance);
    setShowDistanceModal(false);
  };

  // Refetch when list type, distance, or other filters change
  useEffect(() => {
    if (activeCategory?.id) {
      // Trigger refetch
      if (superSubCategory) {
        focusCameraOnProducts(superSubCategory[0]?.id, 'superSubCategory');
      } else if (selectedSubTab) {
        focusCameraOnProducts(selectedSubTab.id, 'subCategory');
      } else {
        focusCameraOnProducts(activeCategory.id, 'mainCategory');
      }
    }
  }, [selectedListType, selectedDistance, isRecentActive, isQuickResponseActive]);


  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingModal />}

      {/* Top Bar - Fixed at top */}
      <View style={styles.topbar}>
        <TouchableOpacity
          style={styles.topbarLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={wp(5)} color="#000" />
          <Text style={styles.topbarText}>Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Map Container - Takes remaining space */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          ref={mapRef}
          onMapReady={() => {
            if (activeCategory?.id) {
              setTimeout(() => {
                focusCameraOnProducts(activeCategory?.id, 'mainCategory');
              }, 1000);
            }
          }}
        />

        {/* Filters Overlay */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >


            {/* 1. Listing Type Button (Always visible) */}
            <TouchableOpacity
              style={[
                styles.filterBtn,
              ]}
              onPress={() => setShowListTypeModal(true)}
            >
              <Text style={styles.filterText}>Listing Type</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#555" />
            </TouchableOpacity>

            {/* 2. Selected List Type Chips */}
            {selectedListType.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.filterBtn, styles.activeFilter]}
                onPress={() => {
                  setSelectedListType(prev => prev.filter(t => t !== type));
                }}
              >
                <Text style={[styles.filterText, styles.activeFilterText]}>
                  {type}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedListType(prev => prev.filter(t => t !== type));
                  }}
                  style={{ marginLeft: wp(1) }}
                >
                  <Ionicons name="close" size={wp(4)} color="#FF0303" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* 3. Other Filters */}
            {filters.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterBtn,
                  (
                    (item === "Distance" && selectedDistance) ||
                    (item === "Recent" && isRecentActive) ||
                    (item === "Quick Response" && isQuickResponseActive)
                  ) && styles.activeFilter,
                ]}
                onPress={() => {
                  if (item === "Distance") {
                    setShowDistanceModal(true);
                  } else if (item === "Recent") {
                    setIsRecentActive(!isRecentActive);
                  } else if (item === "Quick Response") {
                    setIsQuickResponseActive(!isQuickResponseActive);
                  }
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    (
                      (item === "Distance" && selectedDistance) ||
                      (item === "Recent" && isRecentActive) ||
                      (item === "Quick Response" && isQuickResponseActive)
                    ) && styles.activeFilterText,
                  ]}
                >
                  {item === "Distance" && selectedDistance ? selectedDistance : item}
                </Text>
                {(
                  (item === "Distance" && selectedDistance) ||
                  (item === "Recent" && isRecentActive) ||
                  (item === "Quick Response" && isQuickResponseActive)
                ) ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (item === "Distance") {
                        setSelectedDistance("");
                      } else if (item === "Recent") {
                        setIsRecentActive(false);
                      } else if (item === "Quick Response") {
                        setIsQuickResponseActive(false);
                      }
                    }}
                    style={{ marginLeft: wp(1) }}
                  >
                    <Ionicons
                      name="close"
                      size={wp(4)}
                      color="#FF0303"
                    />
                  </TouchableOpacity>
                ) : (
                  (item === "Distance") && <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#555" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>






      {/* Draggable Bottom Section  */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            height: bottomSheetHeight,
          }
        ]}
      >
        {/* Drag Handle */}
        <View
          style={styles.dragHandle}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragLine} />
        </View>

        {/* Bottom Section Icons */}
        <View style={styles.bottomIcons}>
          <TouchableOpacity
            style={styles.zoomBtnBottom}
            onPress={toggleFullScreen}
          >
            <Octicons name={isFullScreen ? "screen-normal" : "screen-full"} size={wp(6)} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locateBtnBottom}
            onPress={getCurrentLocation}
          >
            <MaterialIcons name="my-location" size={wp(6)} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.bottomContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>

            <TouchableOpacity style={styles.moreWrapper} onPress={() =>
              navigation.navigate("Botomtabs", {
                screen: "Home",
                params: {
                  screen: "MapsCategories",
                  params: { item: activeCategory, type: 'Map' }
                }
              })
            }>
              <Text style={styles.moreText}>More</Text>
              <Feather
                name="arrow-right"
                size={wp(3.5)}
                color="#6C63FF"
                style={{ marginLeft: wp(0.5), marginTop: hp(0.3) }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryItem,
                  // activeCategory?.id === item.id && styles.activeCategoryItem
                ]}
                onPress={() => handleMainCategorySelect(item)}
              >
                <View style={styles.iconCircle}>
                  <Image
                    source={{ uri: IMAGE_BASE_URL + item.image }}
                    style={styles.categoryIcon}
                  />
                </View>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.propertyTabs}
          >
            {subCategory?.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.propertyTab,
                  selectedSubTab?.name === tab.name && styles.activePropertyTab,
                ]}
                onPress={() => handleSubCategorySelect(tab)}
              >
                <Image
                  source={{ uri: IMAGE_BASE_URL + tab.image }}
                  style={styles.propertyTabImage}
                />
                <Text
                  style={[
                    styles.propertyTabText,
                    selectedSubTab?.name === tab.name && styles.activePropertyTabText,
                  ]}
                >
                  {tab.name}
                </Text>

                {selectedSubTab?.name === tab.name && (
                  <Ionicons
                    name="close"
                    size={wp(4)}
                    color="#FF0303"
                    style={{ marginLeft: wp(1) }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* BHK Section */}
          <View style={styles.bhkSection}>
            <Text style={styles.bhkSectionTitle}>Properties</Text>
            <View style={styles.bhkRowsContainer}>
              {bhkRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.bhkRow}>
                  {row.map((bhk, index) => (
                    <TouchableOpacity
                      key={bhk.id}
                      style={[
                        styles.bhkItem,
                        // Add margin right to all except the last item in row
                        index < row.length - 1 && styles.bhkItemWithMargin
                      ]}
                      onPress={() => handleSuperSubCategorySelect(bhk)}
                    >
                      <Image
                        source={{ uri: IMAGE_BASE_URL + bhk.image }}
                        style={styles.bhkImage}
                      />
                      <Text style={styles.bhkText} numberOfLines={2}>{bhk.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {/* Add empty items to fill the row if less than 4 */}
                  {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, index) => (
                    <View key={`empty-${index}`} style={styles.emptyBhkItem} />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <ExampleListingModalMap visible={introVisible} onClose={() => { setInroVisible(false) }} />

      {/* 🟢 List Type Modal */}
      <Modal
        visible={showListTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowListTypeModal(false)}
      >
        <ListTypeModal
          onClose={() => setShowListTypeModal(false)}
          onSelect={handleListTypeSelect}
          selectedValues={selectedListType}
        />
      </Modal>

      {/* 🟢 Distance Modal */}
      <Modal
        visible={showDistanceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDistanceModal(false)}
      >
        <Distance
          onClose={() => setShowDistanceModal(false)}
          onSelect={handleDistanceSelect}
          selectedValue={selectedDistance}
        />
      </Modal>

      {/* 🟢 Main Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      // Add props if needed by FilterModal implementation
      />
    </SafeAreaView >
  );
};

export default MainMapListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: hp(6),
    paddingHorizontal: wp(4),
    zIndex: 10,
  },
  topbarLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  topbarText: {
    fontSize: wp(4.5),
    color: "#000",
    marginLeft: wp(2)
  },

  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1
  },
  searchOverlay: {
    position: "absolute",
    top: hp(1),
    width: "100%",
    alignItems: "center",
    zIndex: 5,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(95),
    justifyContent: "space-between",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    height: hp(6),
    flex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    marginRight: wp(3),
  },
  searchInput: {
    flex: 1,
    fontSize: wp(3.8),
    color: "#000",
    marginHorizontal: wp(2),
  },
  qrWrapper: {
    backgroundColor: "#fff",
    borderRadius: wp(2),
    padding: wp(2.5),
    elevation: 3,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: wp(2),
    marginTop: hp(1.5),
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2.8),
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.6),
    marginRight: wp(2),
    backgroundColor: "#fff",
  },
  activeFilter: { borderColor: "#6C63FF" },
  filterText: { fontSize: wp(3.5), color: "#555" },
  activeFilterText: { color: "#000", fontWeight: "600" },

  // Map controls inside map
  zoomBtn: {
    position: "absolute",
    bottom: hp(20),
    left: wp(4),
    backgroundColor: "#fff",
    borderRadius: wp(6),
    padding: wp(2.5),
    elevation: 3,
    zIndex: 5,
  },
  locateBtn: {
    position: "absolute",
    bottom: hp(20),
    right: wp(4),
    backgroundColor: "#fff",
    borderRadius: wp(6),
    padding: wp(2.5),
    elevation: 3,
    zIndex: 5,
  },

  // Bottom Section Styles
  bottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 10,
    // minHeight: hp(25), // Removed to allow full hide
  },
  dragHandle: {
    paddingTop: hp(1),
    paddingBottom: hp(1.5),
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    backgroundColor: "#FFFFFF",
  },
  dragLine: {
    width: wp(18),
    height: hp(0.6),
    backgroundColor: "#C9C9C9",
    borderRadius: wp(3),
  },
  // Bottom icons that stay on top of bottom section
  bottomIcons: {
    position: "absolute",
    top: -hp(8),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    zIndex: 15,
  },
  zoomBtnBottom: {
    backgroundColor: "#fff",
    borderRadius: wp(6),
    padding: wp(2.5),
    elevation: 3,
  },
  filterBtnBottom: {
    backgroundColor: "#fff",
    borderRadius: wp(6),
    padding: wp(2.5),
    elevation: 3,
  },
  locateBtnBottom: {
    backgroundColor: "#fff",
    borderRadius: wp(6),
    padding: wp(2.5),
    elevation: 3,
  },
  bottomContent: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  sectionTitle: {
    fontSize: wp(4),
    fontFamily: "Poppins-Medium"
  },
  moreWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  moreText: {
    fontSize: wp(3.5),
    color: "#000",
    fontWeight: 'bold'
  },
  categoriesRow: {
    flexDirection: "row",
    paddingBottom: hp(1),
  },
  categoryItem: {
    alignItems: "center",
    paddingBottom: hp(0.5),
    borderBottomWidth: 2,
    borderColor: "transparent",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
    width: wp(22),
    marginRight: wp(2),
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2.5,
    width: "100%",
    height: 4.5,
    backgroundColor: "#6C63FF",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },
  categoryImage: {
    width: wp(12),
    height: wp(12),
    resizeMode: "contain",
    borderRadius: wp(2),
    padding: 8,
    elevation: 2,
  },
  categoryText: {
    marginTop: hp(0.5),
    fontSize: wp(3.2),
    color: "#000"
  },
  propertyTabs: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1),
  },
  propertyTab: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(3),
    marginRight: wp(3),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.8),
    backgroundColor: "#fff",
  },
  activePropertyTab: { borderColor: "#6C63FF" },
  propertyTabImage: {
    width: wp(6),
    height: wp(6),
    resizeMode: "contain",
    marginRight: wp(2),
  },
  propertyTabText: { fontSize: wp(3.6), color: "#555" },
  activePropertyTabText: { color: "#000", fontWeight: "bold" },

  // BHK Section Styles
  bhkSection: {
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  bhkSectionTitle: {
    fontSize: wp(4),
    fontFamily: "Poppins-Medium",
    marginBottom: hp(1.5),
    color: "#000",
  },
  bhkRowsContainer: {
    flexDirection: "column",
  },
  bhkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(2),
    width: "100%",
  },
  bhkItem: {
    width: wp(21),
    alignItems: "center",
  },
  bhkItemWithMargin: {
    marginRight: wp(1.5),
  },
  emptyBhkItem: {
    width: wp(21),
  },
  bhkImage: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(2),
    resizeMode: "contain",
    marginBottom: hp(0.5),
  },
  bhkText: {
    fontSize: wp(3),
    color: "#000",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  iconCircle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#eee",
  },
  categoryIcon: {
    width: wp(10),
    height: wp(10),
    resizeMode: "contain",
  },
});
