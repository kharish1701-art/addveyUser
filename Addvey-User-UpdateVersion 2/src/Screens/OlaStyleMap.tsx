import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// Replaced react-native-maps with Ola Maps
import MapView, { Marker, PROVIDER_DEFAULT } from "../Components/OlaMaps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EndPoints } from "../services/EndPoints";
import { apiHelper, handleFavorite, handleUnFavorite } from "../api/getApi/getApi";
import RecentCard from "../Components/MainHome/RecentCard";
import MapViewButton from "../Components/MapViewButton";
import LoadingModal from "../Components/Loader";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import FilterModal, { FilterState } from "../Components/HomeType/FilterModal";
import ListTypeModal from "../Components/HomeType/ListTypeModal";
import Distance from "../Components/HomeType/Distance";
import LanguageModal from "../Components/HomeType/LanguagesModal";
import CategoryModal from "./CategoryModal";

const { width, height } = Dimensions.get("window");

export default function ListViewScreen() {
  const navigation = useNavigation();
  const [mapRegion, setMapRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [productCart, setProductCart] = useState([]);
  const [token, setToken] = useState("");
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const route = useRoute();
  const item = route?.params?.item;
  const category = route?.params?.category;
  const subCategory = route?.params?.subCategory;
  const [categories, setCategories] = useState()
  const [superSubCategory, setSuperSubCategory] = useState()
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedSubTab, setSelectedSubTab] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter and modal states
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const slideAnim = useRef(new Animated.Value(0)).current;




  const [showCategoryModal, setShowCategoryModal] = useState(false); // Set to true to open by default
  const categoryModalAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Add this useEffect to handle the initial animation
  useEffect(() => {
    if (showCategoryModal) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(categoryModalAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCategoryModal]);

  // Add category modal close function
  const closeCategoryModal = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(categoryModalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCategoryModal(false);
    });
  };

  // Add category selection handlers
  const handleCategorySelect = (category) => {
    // setActiveCategory(category);
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubTab(subCategory);
    closeCategoryModal(); // Close modal after selection
  };

  const handleSuperSubCategorySelect = (superSubCategory) => {
    console.log("Super sub category selected:", superSubCategory);
    closeCategoryModal(); // Close modal after selection
  };

  // Add animation styles
  const backdropStyle = {
    opacity: backdropAnim,
  };

  const categoryModalStyle = {
    transform: [
      {
        translateY: categoryModalAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [height, 0],
        }),
      },
    ],
  };





  // Modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showListTypeModal, setShowListTypeModal] = useState(false);
  const [showDistanceModal, setShowDistanceModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Filter states
  const [filterParams, setFilterParams] = useState({
    category: "",
    listType: "",
    distance: "",
    recent: "",
    language: "",
    search: "",
  });

  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    vehicleType: [],
    budget: { min: 0, max: 30 },
    brands: [],
    years: [],
    transmission: [],
    fuel: [],
    others: [],
    attributes: {},
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Filter buttons
  const filterButtons = [
    // { id: "filter", label: "Filter" },
    { id: "listType", label: "List Type" },
    { id: "distance", label: "Distance" },
    { id: "recent", label: "Recent" },
    { id: "language", label: "Language" },
  ];

  const [selectedFilter, setSelectedFilter] = useState(null);

  // 🟢 Load token
  useEffect(() => {
    const init = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) setToken(storedToken);
    };
    init();
  }, []);

  // 🟢 Build API URL with filters

  const handleFavoritePress = async (item) => {
    const wasFavorite = item?.isFavorite;
    console.log(wasFavorite, 'wasFavorite');

    // Optimistic UI update - update both data and filteredData states
    const updateFavoriteStatus = (items) =>
      items.map((p) =>
        p.id === item.id ? { ...p, isFavorite: !wasFavorite } : p
      );

    // Update both states immediately for instant UI feedback
    setProductCart(prev => updateFavoriteStatus(prev));
    setFilteredProducts(prev => updateFavoriteStatus(prev));

    try {
      let success = false;

      if (wasFavorite) {
        success = await handleUnFavorite([item.productId || item.id]);
      } else {
        success = await handleFavorite(item.id);
      }

      if (!success) {
        // Revert on failure
        const revertFavoriteStatus = (items) =>
          items.map((p) =>
            p.id === item.id ? { ...p, isFavorite: wasFavorite } : p
          );

        setProductCart(prev => revertFavoriteStatus(prev));
        setFilteredProducts(prev => revertFavoriteStatus(prev));
      }

      // Optional: Refresh data from server to ensure consistency
      // if (success) {
      //   fetchRecentViews(); // Uncomment if you want to sync with server
      // }

    } catch (error) {
      console.error("Error updating favorite:", error);
      // Revert on error
      const revertFavoriteStatus = (items) =>
        items.map((p) =>
          p.id === item.id ? { ...p, isFavorite: wasFavorite } : p
        );

      setProductCart(prev => revertFavoriteStatus(prev));
      setFilteredProducts(prev => revertFavoriteStatus(prev));
    }
  };


  const buildApiUrl = useCallback(() => {
    let url = EndPoints.getProduct;
    const params = [];
    // console.log(item)
    // Handle subcategory - use only ONE parameter
    if (selectedSubTab?.id) {
      // Use superSubCategory parameter (not superSubCategoryId)
      params.push(`superSubCategory=${selectedSubTab.id}`);
    } else if (item?.id) {
      // Fallback to parent category if no subcategory selected
      params.push(`superSubCategory=${item.id}`);
    }

    // Add search query
    if (searchQuery) {
      params.push(`name=${encodeURIComponent(searchQuery)}`);
    }

    // Add other filter params...
    if (filterParams.listType) {
      params.push(
        `type=${encodeURIComponent(filterParams.listType.toLowerCase())}`
      );
    }

    if (filterParams.distance) {
      if (filterParams.distance === "Distance") {
        params.push(`sortBy=${encodeURIComponent("relevance")}`);
      } else if (filterParams.distance === "From Low to High") {
        params.push(`sortBy=${encodeURIComponent("lowToHigh")}`);
      } else if (filterParams.distance === "From High to Low") {
        params.push(`sortBy=${encodeURIComponent("highToLow")}`);
      }
    }

    if (filterParams.recent) {
      params.push(`recent=${encodeURIComponent(filterParams.recent)}`);
    }

    // Add FilterModal filters...
    if (currentFilters.vehicleType.length > 0) {
      params.push(
        `type=${currentFilters.vehicleType
          .map((v) => v.toLowerCase())
          .join(",")}`
      );
    }

    if (currentFilters.budget.min > 0 || currentFilters.budget.max < 30) {
      params.push(`minPrice=${Math.round(currentFilters.budget.min * 1000)}`);
      params.push(`maxPrice=${Math.round(currentFilters.budget.max * 100000)}`);
    }

    // Build final URL
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    console.log("Final API URL:", url);
    return url;
  }, [item, selectedSubTab, searchQuery, filterParams, currentFilters]);
  // 🟢 Fetch Product Data with filters

  const fetchProductCart = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const url = buildApiUrl();

      const res = await apiHelper(url, { method: "GET", token });

      // Handle different response structures safely
      if (res?.success) {
        const products = res.data?.data || res.data || [];
        setProductCart(Array.isArray(products) ? products : []);
        setFilteredProducts(Array.isArray(products) ? products : []);

        // Fit markers only if we have valid products with locations
        const productsWithLocation = products.filter(
          (product) => product?.location?.lat && product?.location?.lng
        );

        if (productsWithLocation.length > 0 && mapRef.current) {
          setTimeout(() => {
            fitToMarkers(productsWithLocation);
          }, 1000);
        }
      } else {
        console.log("API returned unsuccessful:", res);
        setProductCart([]);
        setFilteredProducts([]);
      }
    } catch (e) {
      console.log("Fetch error:", e);
      Alert.alert("Error", "Failed to load products");
      setProductCart([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token, buildApiUrl]);
  // Add this useEffect
  useEffect(() => {
    console.log("🔄 Subcategory changed to:", selectedSubTab);
    if (token) {
      fetchProductCart();
    }
  }, [selectedSubTab, token]);

  // Also add for initial load
  useEffect(() => {
    if (token && item) {
      console.log("🔄 Initial load with item:", item);
      fetchProductCart();
      console.log(category);
    }
  }, [token, item]);
  // Fit map to show all markers
  const fitToMarkers = (products) => {
    if (!products || !Array.isArray(products)) return;

    const markers = products
      .filter((product) => product?.location?.lat && product?.location?.lng)
      .map((product) => ({
        latitude: product?.location?.lat,
        longitude: product?.location?.lng,
      }));

    if (markers.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (token) fetchProductCart();
  }, [token, fetchProductCart]);

  // 🟢 Get Current Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required for this app"
        );
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  // Calculate active filter count
  useEffect(() => {
    let count = 0;

    // Count existing filter params
    count += Object.values(filterParams).filter(
      (param) => param !== "" && param !== "All"
    ).length;

    // Count FilterModal filters
    count += currentFilters.vehicleType?.length || 0;
    count += currentFilters.brands?.length || 0;
    count += currentFilters.years?.length || 0;
    count += currentFilters.transmission?.length || 0;
    count += currentFilters.fuel?.length || 0;
    count += currentFilters.others?.length || 0;
    if (currentFilters.budget?.min > 0 || currentFilters.budget?.max < 30)
      count++;

    setActiveFilterCount(count);
  }, [filterParams, currentFilters]);

  // Handle filter button press
  const handleFilterPress = (filterId: string) => {
    if (filterId === "listType") {
      setShowListTypeModal(true);
    } else if (filterId === "distance") {
      setShowDistanceModal(true);
    } else if (filterId === "filter") {
      setShowFilterModal(true);
    } else if (filterId === "language") {
      setShowLanguageModal(true);
    } else if (filterId === "recent") {
      setFilterParams((prev) => ({
        ...prev,
        recent: prev.recent === "week" ? "" : "true",
      }));
    }
    setSelectedFilter(filterId === selectedFilter ? null : filterId);
  };

  // Handle modal selections
  const handleListTypeSelect = (value: string) => {
    setFilterParams((prev) => ({ ...prev, listType: value }));
    setShowListTypeModal(false);
  };

  const handleDistanceSelect = (value: string) => {
    setFilterParams((prev) => ({ ...prev, distance: value }));
    setShowDistanceModal(false);
  };

  const handleLanguageSelect = (value: string) => {
    setFilterParams((prev) => ({ ...prev, language: value }));
    setShowLanguageModal(false);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setCurrentFilters(filters);
    setShowFilterModal(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterParams({
      category: "",
      listType: "",
      distance: "",
      recent: "",
      language: "",
      search: "",
    });
    setCurrentFilters({
      vehicleType: [],
      budget: { min: 0, max: 30 },
      brands: [],
      years: [],
      transmission: [],
      fuel: [],
      others: [],
      attributes: {},
    });
    setSearchQuery("");
    setSelectedSubTab(null);
  };

  // Scroll to selected item in the list
  useEffect(() => {
    if (selectedMarker && scrollViewRef.current && showList) {
      const selectedIndex = filteredProducts.findIndex(
        (item) => item.id === selectedMarker.id
      );
      if (selectedIndex !== -1) {
        const cardWidth = wp(80);
        const scrollPosition = selectedIndex * cardWidth;

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: scrollPosition,
            animated: true,
          });
        }, 100);
      }
    }
  }, [selectedMarker, filteredProducts, showList]);

  const lastPressTime = useRef(0);

  // Show list with animation
  const showListWithAnimation = () => {
    if (!showList) {
      setShowList(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Hide list with animation
  const hideListWithAnimation = () => {
    if (showList) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowList(false);
      });
    }
  };

  // 🟢 Dynamic Marker Renderer
  const renderMarker = (property, index) => {
    if (
      !property?.location?.lat ||
      !property?.location?.lng
    ) {
      return null;
    }

    const isSelected = selectedMarker?.id === property.id;

    const handleMarkerTap = () => {
      const now = Date.now();
      const lastTime = lastPressTime.current;

      if (now - lastTime < 500) {
        return;
      }

      if (!isSelected) {
        setSelectedMarker(property);
        showListWithAnimation();
      }

      lastPressTime.current = now;
    };

    return (
      <Marker
        key={property.id || index}
        coordinate={{
          latitude: property?.location?.lat,
          longitude: property?.location?.lng,
        }}
        onPress={handleMarkerTap}
      >
        <View style={styles.markerContainer}>
          <Ionicons
            name="location"
            size={isSelected ? 28 : 24}
            color={isSelected ? "#007AFF" : "#7B61FF"}
          />
        </View>
      </Marker>
    );
  };

  const handleCardPress = (item) => {
    setSelectedMarker(item);
    showListWithAnimation();

    if (item.location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: item?.location?.lat,
          longitude: item?.location?.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const focusOnUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  // Clear selection and hide list when map is pressed
  const handleMapPress = () => {
    setSelectedMarker(null);
    hideListWithAnimation();
  };

  // Calculate bottom container transform for animation
  const bottomContainerTransform = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [200, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {mapRegion ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            toolbarEnabled={false}
            onMapReady={handleMapReady}
            onPress={handleMapPress}
          >
            {/* Property Markers */}
            {/* {productCart.map((product, index) => renderMarker(product, index))} */}
            {productCart?.map((product, index) =>
              renderMarker(product, index)
            ) || []}
          </MapView>

          🟣 Overlay UI
          <View style={styles.overlayContainer}>
            Top Header
            <View>
              <View style={styles.topBar}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.topTitle}>Map View</Text>
                </View>
                <TouchableOpacity onPress={focusOnUserLocation}>
                  <Ionicons name="locate" size={22} color="#7B61FF" />
                </TouchableOpacity>
              </View>

              Search Section
              <View style={styles.searchSection}>
                <View style={styles.searchBox}>
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color="#777"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    placeholder="Search for products..."
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={18} color="#777" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate('QRCodeScanner')}>
                  <MaterialIcons name="qr-code-scanner" size={wp("6%")} color="black" />
                </TouchableOpacity>
              </View>

              Filter Buttons
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterButtonsContainer}
              >
                {filterButtons.map((btn) => (
                  <TouchableOpacity
                    key={btn.id}
                    style={[
                      styles.filterButton,
                      selectedFilter === btn.id && styles.activeFilterButton,
                    ]}
                    onPress={() => handleFilterPress(btn.id)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === btn.id &&
                        styles.activeFilterButtonText,
                      ]}
                    >
                      {btn.label}
                      {btn.id === "filter" &&
                        activeFilterCount > 0 &&
                        ` (${activeFilterCount})`}
                    </Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={wp("5%")}
                      color={selectedFilter === btn.id ? "#fff" : "#000"}
                      style={{ marginLeft: wp("1%") }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              Active Filters Display
              {activeFilterCount > 0 && (
                <View style={styles.activeFiltersContainer}>
                  <Text style={styles.activeFiltersText}>
                    {activeFilterCount} active filter
                    {activeFilterCount > 1 ? "s" : ""}
                  </Text>
                  <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={clearAllFilters}
                  >
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
              )}

              Sub Categories
              {subCategory && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.propertyTabs}
                >
                  // In your subcategory mapping
                  {subCategory?.map((tab) => (
                    <TouchableOpacity
                      key={tab.id}
                      style={[
                        styles.propertyTab,
                        selectedSubTab?.id === tab.id &&
                        styles.activePropertyTab,
                      ]}
                      onPress={() => {
                        // Toggle selection - if already selected, clear it
                        if (selectedSubTab?.id === tab.id) {
                          setSelectedSubTab(null);
                        } else {
                          setSelectedSubTab(tab);
                        }
                      }}
                    >
                      <Image
                        source={{ uri: IMAGE_BASE_URL + tab.image }}
                        style={styles.propertyTabImage}
                      />
                      <Text
                        style={[
                          styles.propertyTabText,
                          selectedSubTab?.id === tab.id &&
                          styles.activePropertyTabText,
                        ]}
                      >
                        {tab.name}
                      </Text>
                      {selectedSubTab?.id === tab.id && (
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
              )}
            </View>

            Bottom Card - Only show when a marker is selected
            {showList && (
              <Animated.View
                style={[styles.bottomContainer, bottomContainerTransform]}
              >
                Cards List with scroll to selected
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardsContainer}
                >
                  {filteredProducts?.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleCardPress(item)}
                    >
                      <RecentCard
                        item={item}
                        onFavoritePress={handleFavoritePress}
                        selectedBorderColor="#007AFF"
                        isSelected={selectedMarker?.id === item.id}

                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>


              </Animated.View>
            )}
            <MapViewButton
              title="List View"
              onPress={() => {
                navigation.navigate("ListView", {
                  subcategory: item,
                  category: { subCategories: subCategory },
                  parentCategory: item?.parent?.parentCategory,
                });
              }}
            />
          </View>
        </>
      ) : (
        <LoadingModal />
      )}

      {/* Filter Modals */}
      <Modal
        animationType="slide"
        transparent
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={currentFilters}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={showListTypeModal}
        onRequestClose={() => setShowListTypeModal(false)}
      >
        <ListTypeModal
          onClose={() => setShowListTypeModal(false)}
          onSelect={handleListTypeSelect}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={showDistanceModal}
        onRequestClose={() => setShowDistanceModal(false)}
      >
        <Distance
          onClose={() => setShowDistanceModal(false)}
          onSelect={handleDistanceSelect}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <LanguageModal
          onClose={() => setShowLanguageModal(false)}
          onSelect={handleLanguageSelect}
        />
      </Modal>


      {showCategoryModal && (
        <>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <TouchableOpacity
              style={styles.backdropTouchable}
              onPress={closeCategoryModal}
            />
          </Animated.View>

          <Animated.View style={[styles.categoryModalContainer, categoryModalStyle]}>
            {/* <CategoryModal
        visible={showCategoryModal}
        onClose={closeCategoryModal}
        categories={categories}
        activeCategory={item}
        onCategorySelect={handleCategorySelect}
        subCategory={subCategory}
        selectedSubTab={selectedSubTab}
        onSubCategorySelect={handleSubCategorySelect}
        superSubCategory={superSubCategory}
        onSuperSubCategorySelect={handleSuperSubCategorySelect}
      /> */}
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1, marginTop: 45 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.8%"),
    marginTop: hp(3),
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  categoryModalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
  },
  topTitle: {
    fontSize: hp("1.7%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
    textAlign: "left",
    marginLeft: 10,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    paddingTop: 10,
    justifyContent: "space-between",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    marginTop: hp("0.5%"),
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    height: hp(5),
    flex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    marginRight: wp(3),
  },
  searchIcon: { marginRight: wp("2%") },
  searchInput: {
    flex: 1,
    fontSize: hp("1.8%"),
    color: "#000",
    paddingVertical: 0,
  },
  qrButton: {
    marginLeft: wp("3%"),
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: hp("1%"),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  qrIcon: {
    width: wp("6%"),
    height: wp("6%"),
    resizeMode: "contain",
  },
  // Filter buttons
  filterButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },
  filterButton: {
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
  activeFilterButton: {
    borderColor: "#6C63FF",
    backgroundColor: "#6C63FF",
  },
  filterButtonText: {
    fontSize: wp(3.5),
    color: "#555",
  },
  activeFilterButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Active filters
  activeFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    backgroundColor: "#f8f8f8",
    marginHorizontal: wp("2%"),
    borderRadius: wp(2),
    marginTop: hp(1),

  },
  activeFiltersText: {
    fontSize: wp("3.2%"),
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  clearAllButton: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
  },
  clearAllText: {
    fontSize: wp("3.2%"),
    color: "#FF0303",
    fontFamily: "Poppins-Medium",
  },
  // Bottom container
  bottomContainer: {
    marginBottom: 20,
  },
  cardsContainer: {
    paddingHorizontal: 8,
    marginBottom: 60,
  },
  // Marker styles
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  propertyTabs: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1),
    paddingHorizontal: wp(2),
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
  activePropertyTabText: { color: "#000", fontWeight: "600" },
});
