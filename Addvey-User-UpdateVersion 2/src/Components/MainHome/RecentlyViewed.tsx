import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import RecentCard from "./RecentCard";
import RecentCardSecond from "./RecentCardSecond";
import { useNavigation } from "@react-navigation/native";
import {
  getApi,
  handleFavorite,
  handleUnFavorite,
} from "../../api/getApi/getApi";
import { EndPoints } from "../../services/EndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildImageSource } from "../../utils/imageFallback";

const RecentViewedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    fetchRecentViews();
  }, []);

  // Fetch recent views and generate tabs
  const fetchRecentViews = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const response = await getApi(EndPoints.getViewHistory, setLoading, token, true);

    const dataArray = response?.data?.data || [];

    // Format the data
    const formatted = dataArray.map((item) => ({
      ...(item.product || item),
      id: item.product?.id || item.id,
      superSubCategoryId: item.superSubCategoryId,
      superSubCategoryName: item.product?.supersubcategory?.name,
      image: item.product?.supersubcategory?.image,
      parentCategoryName: item.product?.supersubcategory?.parent?.name,
    }));

    console.log(formatted, "Formatted data");
    setData(formatted);
    setFilteredData(formatted);

    // Generate tabs from the data
    generateTabs(formatted);
  };

  // Generate tabs dynamically from the data
  const generateTabs = (products) => {
    if (!products || !Array.isArray(products)) return;

    // Count products by superSubCategory
    const categoryCounts = {};

    products.forEach((item) => {
      const categoryId = item.superSubCategoryId;
      const categoryName = item.superSubCategoryName || "Unknown";
      const image = item.image;
      if (categoryCounts[categoryId]) {
        categoryCounts[categoryId].count++;
      } else {
        categoryCounts[categoryId] = {
          id: categoryId,
          name: categoryName,
          count: 1,
          image: image,
        };
      }
    });

    // Convert to array and sort by count (descending)
    const generatedTabs = Object.values(categoryCounts)
      .sort((a, b) => b.count - a.count)
      .map((category) => ({
        id: category.id,
        label: category.name,
        count: category.count,
        image: category.image,
      }));

    console.log("Generated tabs:", generatedTabs);
    setTabs(generatedTabs);

    // Set first tab as active if tabs exist
    if (generatedTabs.length > 0 && !activeTab) {
      setActiveTab(generatedTabs[0].id);
    }
  };

  // Get appropriate icon based on category name
  // const getCategoryIcon = (categoryName) => {
  //     const iconMap = {
  //         'Motorcycles': require("../../../assets/images/bike.png"),
  //         'Scooter': require("../../../assets/images/scooter.png"),
  //         'Cars': require("../../../assets/images/cars.png"),
  //         'Apartments': require("../../../assets/images/apart.png"),
  //         'Crops': require("../../../assets/images/crop.png"),
  //         'Dogs': require("../../../assets/images/dog.png"),
  //         'Bikes': require("../../../assets/images/bike.png"),
  //         'Mobile': require("../../../assets/images/mobile.png"),
  //         'Laptop': require("../../../assets/images/laptop.png"),
  //         // Add more mappings as needed
  //     };

  //     return iconMap[categoryName] || require("../../../assets/images/default.png");
  // };

  // Filter data when tab changes
  useEffect(() => {
    if (activeTab && data.length > 0) {
      if (activeTab === "all") {
        setFilteredData(data);
      } else {
        const filtered = data.filter(
          (item) => item.superSubCategoryId === activeTab
        );
        setFilteredData(filtered);
      }
    }
  }, [activeTab, data]);

  // Add "All" tab to show all products
  const allTabs = [
    // {
    //     id: 'all',
    //     label: 'All',
    //     count: data.length,
    //     // icon: require("../../../assets/images/all.png")
    // },
    ...tabs,
  ];

  const handleFavoritePress = async (item) => {
    const wasFavorite = item?.isFavorite;
    console.log(wasFavorite, 'wasFavorite');

    // Optimistic UI update - update both data and filteredData states
    const updateFavoriteStatus = (items) =>
      items.map((p) =>
        p.id === item.id ? { ...p, isFavorite: !wasFavorite } : p
      );

    // Update both states immediately for instant UI feedback
    setData(prev => updateFavoriteStatus(prev));
    setFilteredData(prev => updateFavoriteStatus(prev));

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

        setData(prev => revertFavoriteStatus(prev));
        setFilteredData(prev => revertFavoriteStatus(prev));
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

      setData(prev => revertFavoriteStatus(prev));
      setFilteredData(prev => revertFavoriteStatus(prev));
    }
  };

  if (!loading && data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Recently viewed</Text>
        <TouchableOpacity
          style={styles.viewAllContainer}
          onPress={() => navigation.navigate("Favourite", { type: "viewed" })}
        >
          <Text style={styles.viewAllText}>View all</Text>
          <Feather
            name="arrow-right"
            size={11}
            color="#6C63FF"
            style={{ marginLeft: wp(0.5) }}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs - Only show if we have data */}
      {allTabs.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScrollContainer}
        >
          <View style={styles.tabsMainContainer}>
            {allTabs.map((tab) => (
              <TouchableOpacity
                activeOpacity={1}
                key={tab.id}
                style={styles.tabWrapper}
                onPress={() => setActiveTab(tab.id)}
              >
                <View style={styles.tabInner}>
                  <Image
                    source={buildImageSource(tab?.image)}
                    style={styles.tabIcon}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.id && styles.activeText,
                    ]}
                    numberOfLines={1}
                  >
                    {tab.count} {tab.label}
                  </Text>
                </View>

                {activeTab === tab.id && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Cards Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: hp(2), paddingBottom: 5 }}
      >
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((item) => (
            <RecentCard
              key={item.id}
              item={item}
              onFavoritePress={handleFavoritePress}
            />
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {data.length > 0
                ? "No items in this category"
                : "No  items"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RecentViewedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(3),
  },
  headerTitle: {
    fontSize: wp(4),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: wp(2.8),
    color: "#6C63FF",
    fontFamily: "Poppins-Bold",
    marginTop: hp(0.2),
  },
  tabsScrollContainer: {
    maxHeight: hp(12),
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9DE",
    flex: 1,
  },
  tabsMainContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: "#D9D9D9DE",
    paddingRight: wp(4),
  },
  tabWrapper: {
    alignItems: "center",
    width: wp(22),
    position: "relative",
    paddingBottom: hp(1.2),
    marginRight: wp(2),
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  tabIcon: {
    width: wp(9),
    height: wp(9),
    resizeMode: "contain",
  },
  tabText: {
    fontSize: wp(2.3),
    color: "#888",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    paddingTop: hp(0.5),
    flexWrap: "nowrap",
  },
  activeText: {
    color: "#000",
    fontWeight: "700",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    width: "100%",
    height: 4,
    backgroundColor: "#6C63FF",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
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
