import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import {
  apiHelper,
} from "../../api/getApi/getApi";
import { EndPoints } from "../../services/EndPoints";
import LoadingModal from "../Loader";
import LanguageModal from "../HomeType/LanguagesModal";
import Distance from "../HomeType/Distance";
import ListTypeModal from "../HomeType/ListTypeModal";
import FilterModal, { FilterState } from "../HomeType/FilterModal";
import ProductCard, { Product } from "./ProductCard";
import { styles } from "./AddCardPreviewStyle";
import FilterBar from "./FilterBar";
import { useHomeFilter } from "../../context/HomeFilterContext";
interface AnimatedProductCardProps {
  item: Product;
  index: number;
  onFavoritePress: (item: Product) => void;
  onNavigation: (item: Product) => void;
}

const AnimatedProductCard = React.memo(
  ({ item, index, onFavoritePress, onNavigation }: AnimatedProductCardProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 0],
    });

    useEffect(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        delay: Math.min(index, 6) * 60,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim, index, item?.id]);

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <ProductCard
          item={item}
          onFavoritePress={onFavoritePress}
          onNavigation={onNavigation}
        />
      </Animated.View>
    );
  }
);

const AddCardPreview = ({
  type,
  EndpointUrl,
  hidePostCount = false,
  setCount,
  hideFilter = false,
  from="",
  similarData=null,
  disableListScroll = false,
}: {
  type?: string;
  EndpointUrl?: string;
  hidePostCount?: boolean;
  setCount?: (count: number) => void;
  hideFilter?: boolean;
  from?:string,
  similarData?:any,
  disableListScroll?: boolean;
}) => {
  const navigation = useNavigation();
  const [productCart, setProductCart] = useState<Product[]>([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [visibleProductIds, setVisibleProductIds] = useState<string[]>([]);

  // Access Context
  const {
    selected,
    setSelected,
    showListTypeModal,
    setShowListTypeModal,
    showDistanceModal,
    setShowDistanceModal,
    showFilterModal,
    setShowFilterModal,
    showLanguageModal,
    setShowLanguageModal,
    filterParams,
    setFilterParams,
    currentFilters,
    setCurrentFilters,
    activeFilterCount,
    setActiveFilterCount,
  } = useHomeFilter();

  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setTokenLoaded(true);
      }
    };
    if(from == 'similar'){
      console.log('------ in addcardview ', similarData)
      setProductCart(similarData);
    }else{
      init();
    }
  }, []);

  // Build endpoint URL based on filter parameters
  const buildEndpointUrl = useCallback(() => {
    let baseUrl = "/product/view-products";
    const params = [];

    // Add existing filter params
    if (filterParams.category && filterParams.category !== "All") {
      params.push(
        `superSubCategory=${encodeURIComponent(filterParams.category)}`
      );
    }

    // Handle listType - give priority to FilterModal vehicleType over listType
    if (currentFilters.vehicleType.length > 0) {
      params.push(
        `type=${currentFilters.vehicleType
          .map((v) => v.toLowerCase())
          .join(",")}`
      );
    } else if (filterParams.listType) {
      params.push(
        `type=${encodeURIComponent(filterParams.listType.toLowerCase())}`
      );
    }

    if (filterParams.distance) {
      if (filterParams.distance == "Distance") {
        params.push(`sortBy=${encodeURIComponent("relevance")}`);
      } else if (filterParams.distance == "From Low to High") {
        params.push(`sortBy=${encodeURIComponent("lowToHigh")}`);
      } else if (filterParams.distance == "From High to Low") {
        params.push(`sortBy=${encodeURIComponent("highToLow")}`);
      }
    }

    if (filterParams.recent) {
      params.push(`recent=${encodeURIComponent(filterParams.recent)}`);
    }

    if (filterParams.language) {
      params.push(
        `creatorLanguage=${encodeURIComponent(
          filterParams.language.toLowerCase()
        )}`
      );
    }

    if (filterParams.quickResponse) {
      params.push(`QuickResponse=${encodeURIComponent(filterParams.quickResponse)}`);
    }

    // Add FilterModal filters (excluding vehicleType which is handled above)
    if (currentFilters.budget.min > 0 || currentFilters.budget.max < 30) {
      params.push(`minPrice=${Math.round(currentFilters.budget.min * 1000)}`);
      params.push(`maxPrice=${Math.round(currentFilters.budget.max * 100000)}`);
    }

    if (currentFilters.brands.length > 0) {
      params.push(
        `attributes[brand]=${encodeURIComponent(
          currentFilters.brands.join(", ")
        )}`
      );
    }

    if (currentFilters.years.length > 0) {
      params.push(
        `attributes[year]=${encodeURIComponent(
          currentFilters.years.join(", ")
        )}`
      );
    }

    if (currentFilters.transmission.length > 0) {
      params.push(
        `attributes[transmission]=${encodeURIComponent(
          currentFilters.transmission.join(", ")
        )}`
      );
    }

    if (currentFilters.fuel.length > 0) {
      params.push(
        `attributes[fuel]=${encodeURIComponent(currentFilters.fuel.join(", "))}`
      );
    }

    if (currentFilters.others.length > 0) {
      params.push(
        `attributes[features]=${encodeURIComponent(
          currentFilters.others.join(", ")
        )}`
      );
    }

    const finalUrl =
      params.length > 0 ? `${baseUrl}?${params.join("&")}` : baseUrl;
    console.log("Final API URL:", finalUrl);
    return finalUrl;
  }, [filterParams, currentFilters]);

  const fetchProductCart = useCallback(
    async (urr?: string) => {
      console.log("✅ Fetching_fetchProductCart___...");

      try {
        // Use custom EndpointUrl if provided, otherwise build from filters
        const url = EndpointUrl
          ? EndpointUrl
          : urr
            ? EndPoints.getProduct + urr
            : buildEndpointUrl();

        const finalUrl =
          type && type == "Favorite" ? EndPoints.getFavorite : url;

        console.log("Making API call to:", finalUrl);

        const res = await apiHelper(finalUrl, {
          method: "GET",
          token,
          setLoading,
        });

        if (res?.success) {
          let formatted: Product[] = [];

          if (
            type &&
            (type == "Favorite" || type == "Reports" || type == "Viewed")
          ) {
            const dataArray = res.data?.data || [];
            formatted = dataArray.map((item: any) => ({
              ...(item.product || item),
              id: item.id || item.product?.id,
              productId: item.product?.id || item.id,
              isFavorite: item.isFavorite ?? type === "Favorite",
            }));
          } else {
            const dataArray = res.data?.data || res.data || [];
            formatted = Array.isArray(dataArray) ? dataArray : [];
          }

          console.log("✅ Fetched products:", formatted.length);
          setProductCart(formatted);
          if (setCount) {
            setCount(formatted?.length);
          }
        } else {
          console.warn("⚠️ API returned unsuccessful:", res);
          setProductCart([]);
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        Alert.alert("Error", "Failed to load products. Please try again.");
        setProductCart([]);
      }
    },
    [EndpointUrl, type, token, buildEndpointUrl]
  );

  // Initial fetch when token is loaded
  useEffect(() => {
    if (tokenLoaded) {
      console.log("🔄 Initial fetch (token loaded, token exists:", !!token, ")");
      fetchProductCart();
    }
  }, [tokenLoaded, EndpointUrl]);

  // Refetch when filter params change
  useEffect(() => {
    if ( from=="" && tokenLoaded) {
      console.log("🔄 Refetching due to filter changes");
      fetchProductCart();
    }
  }, [filterParams, currentFilters, tokenLoaded]);

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


  // Handle modal selections
  const handleListTypeSelect = (value: string[]) => {
    console.log("List type selected:", value);
    const joinedValue = value.join(",");
    setFilterParams((prev) => ({ ...prev, listType: joinedValue }));
    setShowListTypeModal(false);
  };

  const handleDistanceSelect = (value: string) => {
    console.log("Distance selected:", value);
    setFilterParams((prev) => ({ ...prev, distance: value }));
    setShowDistanceModal(false);
  };

  const handleLanguageSelect = (value: string) => {
    console.log("Language selected:", value);
    setFilterParams((prev) => ({ ...prev, language: value }));
    setShowLanguageModal(false);
  };

  // Handle FilterModal apply
  const handleApplyFilters = (filters: Partial<FilterState>) => {
    console.log("🔄 Applying filters:", filters);
    setCurrentFilters((prev) => ({ ...prev, ...filters })); // Correctly merge or replace
    setShowFilterModal(false);
  };

  // Handle favorite press
  const handleFavoritePress = useCallback(
    (item: Product) => {
      // If on Favorite screen, remove the item from the list when unfavorited
      if (type === "Favorite") {
        setProductCart((prev) => prev.filter((p) => p.id !== item.id));
      }
      // No API call needed, handled by Context in ProductCard
    },
    [type]
  );

  const handleNavigation = useCallback(
    (item: Product) => {
      // Use push to ensure a new screen is added to the stack, especially when navigating from Similar Products
      (navigation as any).push("AddPreview", { from: "home", data: item });
    },
    [navigation]
  );

  const renderProductCard = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <AnimatedProductCard
        item={item}
        index={index}
        onFavoritePress={handleFavoritePress}
        onNavigation={handleNavigation}
      />
    ),
    [handleFavoritePress, handleNavigation]
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
    waitForInteraction: true,
    minimumViewTime: 500,
  });

  const onViewRef = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length === 0) return;
    const focused = viewableItems[0]?.item;
    setVisibleProductIds([focused?.id]);
  });

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {activeFilterCount > 0
            ? "No ads found matching your criteria"
            : "No ads available"}
        </Text>
        {loading && (
          <Text style={styles.loadingText}>Loading products...</Text>
        )}
      </View>
    ),
    [activeFilterCount, loading]
  );

  return (
    <View style={styles.container}>
      {/* Filter Buttons using FilterBar */}
      {!hideFilter && <FilterBar />}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
          </Text>
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={() => {
              setFilterParams({
                category: "",
                listType: "",
                distance: "",
                recent: "",
                language: "",
                search: "",
                quickResponse: "",
              });
              setCurrentFilters({
                category: [],
                vehicleType: [],
                budget: { min: 0, max: 30 },
                brands: [],
                years: [],
                transmission: [],
                fuel: [],
                others: [],
                attributes: {},
              });
            }}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
      {!hidePostCount && (
        <Text
          style={{ textAlign: "center", marginBottom: 15, color: "#00000099" }}
        >
          {productCart?.length} Post
        </Text>
      )}
      {/* Product List */}
      {disableListScroll ? (
        <View style={styles.listContainer}>
          {productCart.length > 0 ? (
            productCart.map((item, index) => (
              <AnimatedProductCard
                key={`${item.id || item.productId || index}-${index}`}
                item={item}
                index={index}
                onFavoritePress={handleFavoritePress}
                onNavigation={handleNavigation}
              />
            ))
          ) : (
            renderEmptyState()
          )}
        </View>
      ) : (
        <FlatList
          data={productCart}
          keyExtractor={keyExtractor}
          renderItem={renderProductCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          initialNumToRender={5}
          maxToRenderPerBatch={8}
          windowSize={10}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          nestedScrollEnabled={true}
          ListEmptyComponent={renderEmptyState}
        />
      )}

      {/* Modals */}
      <Modal
        animationType="slide"
        transparent
        visible={showListTypeModal}
        onRequestClose={() => setShowListTypeModal(false)}
      >
        <ListTypeModal
          onClose={() => setShowListTypeModal(false)}
          onSelect={handleListTypeSelect}
          selectedValues={filterParams.listType ? filterParams.listType.split(",") : []}
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

      {loading && <LoadingModal />}
    </View>
  );
};

export default AddCardPreview;
