import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import EmptyCard from "../Home/EmptyCard";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import { Feather, Ionicons } from "@expo/vector-icons";
import { EndPoints } from "../../services/EndPoints";
import {
  apiHelper,
} from "../../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomLoader from "../Loader";
import ProductCard, { Product } from "./ProductCard";
import { useNavigation } from "@react-navigation/native";

type ListItemProps = {
  item: Product;
  index: number;
  type?: string;
  selectedItems?: string[];
  onFavoritePress: (item: Product) => void;
  onNavigation: (item: Product) => void;
  onLongPress?: (item: Product) => void;
  onSelect?: (item: Product) => void;
};

const AnimatedListItem = memo(
  ({
    item,
    index,
    type,
    selectedItems,
    onFavoritePress,
    onNavigation,
    onLongPress,
    onSelect,
  }: ListItemProps) => (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 35, 210))
        .duration(280)
        .springify()
        .damping(18)}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => type === "Favorite" && onLongPress?.(item)}
        onPress={() => type === "Favorite" && onSelect?.(item)}
      >
        {selectedItems?.includes(item.productId || item.id) && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={26} color="#6C63FF" />
          </View>
        )}
        <ProductCard
          item={item}
          onFavoritePress={onFavoritePress}
          onNavigation={onNavigation}
        />
      </TouchableOpacity>
    </Animated.View>
  ),
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.index === next.index &&
    prev.selectedItems === next.selectedItems
);

const CATEGORY_FILTER_ICONS: Record<string, ReturnType<typeof require>> = {
  vehicle: require("../../../assets/images/car.png"),
  vehicles: require("../../../assets/images/car.png"),
  property: require("../../../assets/images/properties.png"),
  properties: require("../../../assets/images/properties.png"),
  electronic: require("../../../assets/images/elec.png"),
  electronics: require("../../../assets/images/elec.png"),
  elec: require("../../../assets/images/elec.png"),
  mobile: require("../../../assets/images/mobile.png"),
  mobiles: require("../../../assets/images/mobile.png"),
  furniture: require("../../../assets/images/furniture.png"),
  pet: require("../../../assets/images/pet.png"),
  pets: require("../../../assets/images/pet.png"),
};

const getCategoryFilterIcon = (category?: string | null) => {
  if (!category || category === "All") return null;
  const key = category.toLowerCase().trim();
  if (CATEGORY_FILTER_ICONS[key]) return CATEGORY_FILTER_ICONS[key];

  const matched = Object.keys(CATEGORY_FILTER_ICONS).find((iconKey) =>
    key.includes(iconKey) || iconKey.includes(key)
  );
  return matched ? CATEGORY_FILTER_ICONS[matched] : null;
};

const AddFavoriteCardPreview = ({
  type,
  EndpointUrl,
  handleLongPress,
  handleSelect,
  selectedItems,
  nestedInScrollView = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [data, setData] = useState<Product[]>([]);
  const [productCart, setProductCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchProductCart();
  }, []);
  const handleFavoritePress = useCallback(
    (item) => {
      // If on Favorite screen, remove the item
      if (type === "Favorite") {
        setData((prev) => prev.filter((p) => p.id !== item.id));
      }
      // No API call needed, handled by Context in ProductCard
    },
    [type]
  );
  const navigation = useNavigation();
  const handleNavigation = useCallback(
    (item: Product) => {
      navigation.navigate("AddPreview", { from: "home", data: item });
    },
    [navigation]
  );

  const renderProductCard = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <AnimatedListItem
        item={item}
        index={index}
        type={type}
        selectedItems={selectedItems}
        onFavoritePress={handleFavoritePress}
        onNavigation={handleNavigation}
        onLongPress={handleLongPress}
        onSelect={handleSelect}
      />
    ),
    [
      type,
      selectedItems,
      handleFavoritePress,
      handleNavigation,
      handleLongPress,
      handleSelect,
    ]
  );

  const keyExtractor = useCallback(
    (item: Product) => item.id.toString(),
    []
  );
  const fetchProductCart = useCallback(async () => {
    console.log("✅ Fetching_fetchProductCart___...");
    setLoading(true);
    try {
      // Use custom EndpointUrl if provided, otherwise build from filters
      const url = EndpointUrl;
      // ? EndpointUrl
      // : urr
      // ? EndPoints.getProduct + urr
      // : buildEndpointUrl();
      const token = await AsyncStorage.getItem("authToken");

      const finalUrl = type && type == "Favorite" ? EndPoints.getFavorite : url;

      console.log("Making API call to:", finalUrl);

      const res = await apiHelper(finalUrl, {
        method: "GET",
        token,
        setLoading,
      });

      console.log("API Response:", res);

      // FIXED: Handle different response structures safely
      if (res?.success) {
        let formatted = [];

        // Handle different response structures
        if (
          type &&
          (type == "Favorite" || type == "Reports" || type == "Viewed")
        ) {
          // For Favorite/Reports/Viewed - data is in res.data?.data array
          const dataArray = res.data?.data || [];
          formatted = dataArray.map((item) => ({
            ...(item.product || item), // Handle both nested product and direct item
            id: item.product?.id || item.id,
            productId: item.product?.id || item.id,
            isFavorite:
              item.isFavorite ||
              item.product?.isFavorite ||
              type === "Favorite",
          }));
        } else {
          // For regular products - data could be in different structures
          const dataArray = res.data?.data || res.data || [];
          formatted = Array.isArray(dataArray) ? dataArray : [];
        }

        console.log("✅ Fetched products:", formatted.length);
        setProductCart(formatted);
        setData(formatted);
      } else {
        console.warn("⚠️ API returned unsuccessful:", res);
        setProductCart([]);
        setData([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      Alert.alert("Error", "Failed to load products. Please try again.");
      setProductCart([]);
      setLoading(false);
    }
  }, [EndpointUrl, type]);
  // ✅ Extract unique categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        data
          ?.map((item) => item.supersubcategory?.parent?.parentCategory?.name)
          .filter(Boolean)
      )
    ) as string[];
    return ["All", ...unique];
  }, [data]);

  // ✅ Filtered data based on search and active category
  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      const matchesCategory =
        activeFilter === "All" ||
        item?.supersubcategory?.parent?.parentCategory?.name === activeFilter;
      const matchesSearch =
        item?.name?.includes(searchQuery) ||
        item?.supersubcategory?.parent?.parentCategory?.name?.includes(
          searchQuery
        );
      return matchesCategory && matchesSearch;
    });
  }, [data, activeFilter, searchQuery]);

  return (
    <>
    {loading && <CustomLoader />}
      <View style={{ paddingHorizontal: wp(1) }}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={17}
            color="#8E8E93"
            style={styles.searchIconLeft}
          />
          <TextInput
            placeholder="Search here for Shared items"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          ) : null}
          <View style={styles.searchDivider} />
          <TouchableOpacity hitSlop={8}>
            <Image
              source={require("../../../assets/images/mic.png")}
              style={styles.micImage}
            />
          </TouchableOpacity>
        </View>

        {/* 🧩 Filters */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={styles.filterIconBtn}
            onPress={() => navigation.navigate("Filter")}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../../assets/images/filter.png")}
              style={styles.filterIconImage}
            />
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {categories.map((category) => {
              const isActive = activeFilter === category;
              const categoryCount =
                category === "All"
                  ? data?.length
                  : data?.filter(
                    (d) =>
                      d?.supersubcategory?.parent?.parentCategory?.name ===
                      category
                  ).length;

              const categoryIcon = getCategoryFilterIcon(category);

              return (
                <TouchableOpacity
                  key={category}
                  style={[styles.filterBtn, isActive && styles.activeFilterBtn]}
                  onPress={() => setActiveFilter(category)}
                >
                  {categoryIcon ? (
                    <Image
                      source={categoryIcon}
                      style={styles.filterCategoryIcon}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.filterText,
                      isActive && styles.activeFilterText,
                    ]}
                  >
                    {category === "All"
                      ? "All"
                      : `${categoryCount} ${category}`}
                  </Text>
                  {category != "All" && isActive && (
                    <Text
                      style={[
                        styles.activeFilterText,
                        { paddingLeft: 7, paddingRight: 0, color: "red" },
                      ]}
                      onPress={() => {
                        setActiveFilter("All");
                      }}
                    >
                      x
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 📆 Section */}
        {/* <View style={styles.monthsSection}>
            <Text style={styles.monthsText}>Past three months</Text>
          </View> */}

        {/* Filtered List */}
        <View style={{ paddingHorizontal: wp(3) }}>
        <Animated.FlatList
          data={filteredData}
          keyExtractor={keyExtractor}
          renderItem={renderProductCard}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!nestedInScrollView}
          nestedScrollEnabled
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={7}
          removeClippedSubviews={false}
          updateCellsBatchingPeriod={32}
          keyboardShouldPersistTaps="handled"
        />

        </View>
       
      </View>
    </>
      
   
  );
};

export default AddFavoriteCardPreview;

// 🧱 Styles
const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.4,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    marginBottom: hp(2),
  },
  searchIconLeft: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.75),
    color: "#000",
    paddingVertical: 0,
    fontFamily: "Poppins-Regular",
  },
  searchDivider: {
    width: 1.3,
    height: 22,
    backgroundColor: "#E0E0E0",
    marginHorizontal: wp(2.5),
  },
  micImage: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  /** Filters */
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  filterIconBtn: {
    width: wp(10.5),
    height: wp(10.5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp(2.2),
    backgroundColor: "#FFFFFF",
    marginRight: wp(2),
  },
  filterIconImage: {
    width: wp(4.5),
    height: wp(4.5),
    resizeMode: "contain",
  },
  filtersScroll: {
    flex: 1,
  },
  filtersScrollContent: {
    alignItems: "center",
    paddingRight: wp(2),
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(2.8),
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp(2.2),
    backgroundColor: "#FFFFFF",
  },
  filterCategoryIcon: {
    width: wp(5.5),
    height: wp(5.5),
    resizeMode: "contain",
    marginRight: wp(1.5),
  },
  activeFilterBtn: {
    borderColor: "#6A5AE0",
    backgroundColor: "#FFFFFF",
  },
  filterText: { fontSize: hp(1.55), color: "#666666" },
  activeFilterText: { color: "#6A5AE0", fontWeight: "600" },
  squareBox: {
    width: wp(3.5),
    height: wp(3.5),
    backgroundColor: "#D9D9D980",
    marginRight: wp(1.5),
    borderRadius: 4,
  },

  /** Months Section */
  monthsSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D9D9D9",
    paddingVertical: hp(1),
    marginBottom: hp(2),
    alignItems: "center",
  },
  monthsText: {
    fontSize: hp(1.6),
    color: "#00000099",
    fontFamily: "Poppins-Medium",
  },
  checkIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 20,
    zIndex: 99999,
  },
});
