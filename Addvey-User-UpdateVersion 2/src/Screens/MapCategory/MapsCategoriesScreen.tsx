// // MapscategoriesScreen.tsx
// import React, { useState } from "react";
// import {
//     SafeAreaView,
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     TextInput,
//     FlatList,
//     ScrollView,
//     Image,
// } from "react-native";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { Ionicons } from "@expo/vector-icons";
// import { Feather } from "@expo/vector-icons";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";

// type SubCategory = {
//     id: string;
//     title: string;
//     icon: any;
// };

// type Category = {
//     id: string;
//     title: string;
//     icon: any;
//     subcategories: SubCategory[];
// };

// const SAMPLE_CATEGORIES: Category[] = [
//     {
//         id: "apartments",
//         title: "Apartments",
//         icon: require("../../assets/images/apart.png"),
//         subcategories: [
//             { id: "1bhk", title: "1 BHK", icon: require("../../assets/images/apart.png") },
//             { id: "2bhk", title: "2 BHK", icon: require("../../assets/images/apart.png") },
//             { id: "3bhk", title: "3 BHK", icon: require("../../assets/images/apart.png") },
//             { id: "4bhk", title: "4 BHK", icon: require("../../assets/images/apart.png") },
//             { id: "penthouse", title: "Penthouse", icon: require("../../assets/images/apart.png") },
//         ],
//     },
//     {
//         id: "houses",
//         title: "Houses",
//         icon: require("../../assets/images/catcar.png"),
//         subcategories: [
//             { id: "villa", title: "Villa", icon: require("../../assets/images/catcar.png") },
//             { id: "bungalow", title: "Bungalow", icon: require("../../assets/images/catcar.png") },
//             { id: "duplex", title: "Duplex", icon: require("../../assets/images/catcar.png") },
//         ],
//     },
//     {
//         id: "commercial",
//         title: "Commercial Properties",
//         icon: require("../../assets/images/catcar.png"),
//         subcategories: [
//             { id: "office", title: "Office", icon: require("../../assets/images/catcar.png") },
//             { id: "retail", title: "Retail", icon: require("../../assets/images/catcar.png") },
//             { id: "warehouse", title: "Warehouse", icon: require("../../assets/images/catcar.png") },
//         ],
//     },
//     {
//         id: "shared",
//         title: "Shared Living",
//         icon: require("../../assets/images/catcar.png"),
//         subcategories: [
//             { id: "co-living", title: "Co-living", icon: require("../../assets/images/catcar.png") },
//             { id: "hostel", title: "Hostel", icon: require("../../assets/images/catcar.png") },
//         ],
//     },
//     {
//         id: "farmhouses",
//         title: "Farmhouses & Villas",
//         icon: require("../../assets/images/catcar.png"),
//         subcategories: [
//             { id: "farmhouse", title: "Farmhouse", icon: require("../../assets/images/catcar.png") },
//             { id: "country-villa", title: "Country Villa", icon: require("../../assets/images/catcar.png") },
//         ],
//     }
// ];

// export default function MapscategoriesScreen() {
//     const navigation = useNavigation<any>();
//     const [categories] = useState<Category[]>(SAMPLE_CATEGORIES);
//     const [activeCategoryId, setActiveCategoryId] = useState<string>(SAMPLE_CATEGORIES[0].id);
//     const [search, setSearch] = useState<string>("");

//     const activeCategory =
//         categories.find((c) => c.id === activeCategoryId) || categories[0];

//     const filteredSubcategories = activeCategory.subcategories.filter((s) =>
//         s.title.toLowerCase().includes(search.trim().toLowerCase())
//     );

//     return (
//         <SafeAreaView style={styles.safe}>
//             {/* Topbar */}
//             <View style={styles.topbar}>
//                 <View style={styles.topLeft}>
//                     <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//                         <Feather name="arrow-left" style={{ marginRight: wp(2) }} size={hp("2.2%")} color="#000000" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.locationWrap}>
//                         <Text style={styles.locationText}>Properties</Text>
//                         <Ionicons name="chevron-down" size={hp("2%")} style={{ marginTop: hp(0.7), marginLeft: wp(1) }} color="#6C63FF" />
//                     </TouchableOpacity>
//                 </View>

//                 <TouchableOpacity style={styles.searchIconBtn}>
//                     <Ionicons name="search-outline" size={hp("2.5%")} color="#333" />
//                 </TouchableOpacity>
//             </View>

//             {/* Search Bar */}
//             <View style={styles.searchContainer}>
//                 <Ionicons
//                     name="search-outline"
//                     size={hp("2.4%")}
//                     color="#999"
//                     style={styles.inputIcon}
//                 />
//                 <TextInput
//                     placeholder="Search here for more"
//                     placeholderTextColor="#999"
//                     value={search}
//                     onChangeText={setSearch}
//                     style={styles.searchInput}
//                 />
//             </View>

//             {/* Main Content */}
//             <View style={styles.contentWrap}>
//                 {/* LEFT SIDEBAR */}
//                 <View style={styles.leftRail}>
//                     <ScrollView
//                         contentContainerStyle={styles.leftInner}
//                         showsVerticalScrollIndicator={false}
//                     >
//                         {categories.map((cat, index) => {
//                             const isActive = cat.id === activeCategoryId;
//                             const prevActive = categories[index - 1]?.id === activeCategoryId;
//                             const nextActive = categories[index + 1]?.id === activeCategoryId;

//                             const borderStyles: any = {
//                                 borderRightWidth: isActive ? 0 : 1,
//                                 borderRightColor: "#e3e3e3",
//                                 borderTopWidth: 0,
//                                 borderBottomWidth: 0,
//                                 borderTopRightRadius: 0,
//                                 borderBottomRightRadius: 0,
//                                 marginVertical: isActive ? hp("1%") : 0,
//                             };

//                             if (prevActive) {
//                                 borderStyles.borderTopWidth = 1;
//                                 borderStyles.borderTopColor = "#e3e3e3";
//                                 borderStyles.borderTopRightRadius = wp("3%");
//                             }

//                             if (nextActive) {
//                                 borderStyles.borderBottomWidth = 1;
//                                 borderStyles.borderBottomColor = "#e3e3e3";
//                                 borderStyles.borderBottomRightRadius = wp("3%");
//                             }

//                             return (
//                                 <TouchableOpacity
//                                     key={cat.id}
//                                     activeOpacity={0.8}
//                                     onPress={() => setActiveCategoryId(cat.id)}
//                                     style={[styles.catItem, borderStyles]}
//                                 >
//                                     {isActive && <View style={styles.activeLine} />}

//                                     <Image source={cat.icon} style={styles.catIconImg} resizeMode="contain" />
//                                     <Text
//                                         style={[
//                                             styles.catLabel,
//                                             isActive ? styles.catLabelActive : undefined,
//                                         ]}
//                                         numberOfLines={2}
//                                     >
//                                         {cat.title}
//                                     </Text>
//                                 </TouchableOpacity>
//                             );
//                         })}
//                     </ScrollView>
//                 </View>

//                 {/* RIGHT CONTENT */}
//                 <View style={styles.rightContent}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>{activeCategory.title}</Text>
//                         <TouchableOpacity style={styles.expandBtn} onPress={() => navigation.navigate('ListView')}>
//                             <MaterialIcons name="keyboard-arrow-right" size={hp(2.5)} style={{ marginTop: hp(0.5) }} color="#6C63FF" />
//                         </TouchableOpacity>
//                     </View>

//                     <FlatList
//                         data={filteredSubcategories}
//                         keyExtractor={(item) => item.id}
//                         numColumns={3}
//                         contentContainerStyle={styles.subcatList}
//                         showsVerticalScrollIndicator={false}
//                         renderItem={({ item }) => (
//                             <TouchableOpacity style={styles.subcatCard} activeOpacity={0.8}>
//                                 <Image source={item.icon} style={styles.subcatImage} resizeMode="contain" />
//                                 <Text style={styles.subcatTitle}>{item.title}</Text>
//                             </TouchableOpacity>
//                         )}
//                     />
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }

// const LEFT_RAIL_WIDTH = wp("26%");
// const RIGHT_PADDING = wp("3%");

// const styles = StyleSheet.create({
//     safe: {
//         flex: 1,
//         backgroundColor: "#fff",
//     },

//     // Topbar
//     topbar: {
//         height: hp("8%"),
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: wp("3%"),
//         borderBottomWidth: 0.6,
//         borderBottomColor: "#e3e3e3",
//         backgroundColor: "#fff",
//         marginTop: hp(3),
//     },
//     topLeft: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     backBtn: {
//         marginRight: wp("1%"),
//     },
//     locationWrap: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     locationText: {
//         fontSize: hp("2%"),
//         color: "#333",
//         marginRight: wp("1%"),
//         fontFamily: "Poppins-Medium",
//         marginTop: hp(0.7),
//     },
//     searchIconBtn: {
//         padding: wp("1%"),
//     },

//     //Search Bar
//     searchContainer: {
//         paddingHorizontal: wp("3%"),
//         paddingVertical: hp("1%"),
//         borderBottomWidth: 0.6,
//         borderBottomColor: "#f1f1f1",
//         backgroundColor: "#fff",
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     inputIcon: {
//         position: "absolute",
//         left: wp("5%"),
//         zIndex: 1,
//     },
//     searchInput: {
//         height: hp("5.5%"),
//         borderRadius: hp("1%"),
//         paddingLeft: wp("10%"),
//         fontSize: hp("1.9%"),
//         borderWidth: 0.6,
//         borderColor: "#00000080",
//         flex: 1,
//     },

//     // Main Content
//     contentWrap: {
//         flex: 1,
//         flexDirection: "row",
//     },

//     // LEFT SIDE
//     leftRail: {
//         width: LEFT_RAIL_WIDTH,
//         backgroundColor: "#fff",
//     },
//     leftInner: {
//         paddingVertical: hp("2%"),
//         alignItems: "center",
//     },
//     catItem: {
//         width: "100%",
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: hp("2%"),
//         marginVertical: hp("0.6%"),
//         position: "relative",
//         backgroundColor: "#fff",
//     },
//     activeLine: {
//         position: "absolute",
//         left: 0,
//         top: 0,
//         bottom: 0,
//         width: wp("1.2%"),
//         backgroundColor: "#6C63FF",
//         borderTopRightRadius: wp("4%"),
//         borderBottomRightRadius: wp("4%"),
//     },
//     catIconImg: {
//         width: wp("10%"),
//         height: wp("10%"),
//         marginBottom: hp("0.8%"),
//     },
//     catLabel: {
//         fontSize: hp("1.4%"),
//         color: "#444",
//         textAlign: "center",
//         width: "100%",
//         fontFamily: "Poppins-Medium",
//     },
//     catLabelActive: {
//         color: "#000",
//         fontWeight: "700",
//     },

//     // RIGHT SIDE
//     rightContent: {
//         flex: 1,
//         paddingHorizontal: RIGHT_PADDING,
//         paddingTop: hp("2%"),
//         backgroundColor: "#fff",
//     },
//     sectionHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: hp("1.2%"),
//     },
//     sectionTitle: {
//         fontSize: hp("2%"),
//         color: "#111",
//         fontFamily: "Poppins-Medium",
//         marginTop: hp(1),
//     },
//     expandBtn: {
//         width: wp("8%"),
//         alignItems: "flex-end",
//     },
//     subcatList: {
//         paddingBottom: hp("8%"),
//     },
//     subcatCard: {
//         width: (wp("100%") - LEFT_RAIL_WIDTH - RIGHT_PADDING * 2) / 3 - wp("1%"),
//         margin: wp("1%"),
//         alignItems: "center",
//         paddingVertical: hp("1.6%"),
//         backgroundColor: "#fff",
//     },
//     subcatImage: {
//         width: wp("14%"),
//         height: wp("14%"),
//         marginBottom: hp("1%"),
//         resizeMode: "contain",
//     },
//     subcatTitle: {
//         fontSize: hp("1.4%"),
//         textAlign: "center",
//         color: "#333",
//         fontFamily: "Poppins-Medium",
//     },
// });

// MapscategoriesScreen.tsx

// MapscategoriesScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCategories } from "./useMapCategory";
import { BaseUrl, IMAGE_BASE_URL } from "../../api/authApi/BaseUrl";
import CategoryDetailsScreen from "../CategoryDetailsScreen";
import MainCategoryDetailScreen from "../MainCategoryDetailScreen";
import CategoriesScreen from "../CatgoeiresScreen";
import LoadingModal from "../../Components/Loader";

// Fallback local images
const FALLBACK_IMAGES = {
  default: require("../../../assets/images/apart.png"),
  apartments: require("../../../assets/images/apart.png"),
  houses: require("../../../assets/images/catcar.png"),
  commercial: require("../../../assets/images/catcar.png"),
  shared: require("../../../assets/images/catcar.png"),
  farmhouses: require("../../../assets/images/catcar.png"),
};

interface MapscategoriesScreenProps {
  route?: any;
}


// ... imports and other code remains the same until the component ...

export default function MapscategoriesScreen({
  route,
}: MapscategoriesScreenProps) {
  const navigation = useNavigation<any>();
  const navRoute = useRoute();
  const [search, setSearch] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [suggestVisible, setSuggestVisible] = useState(false);
  const [selectedHeading, setSelectedHeading] = useState<string | null>(null);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const animatedSuggestHeight = useRef(new Animated.Value(0)).current;
  const animatedSubHeight = useRef(new Animated.Value(0)).current;

  const item = route?.params?.item || navRoute.params?.item;
  const type = route?.params?.type;

  const {
    categories,
    loading,
    error,
    activeCategoryId,
    activeSubcategoryId,
    subcategoriesLoading,
    subSubcategoriesLoading,
    changeActiveCategory,
    handleSubcategoryPress,
    retry,
  } = useCategories(item?.id);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const openSubCategory = () => {
    setDetailsVisible(true);
    Animated.parallel([
      Animated.timing(animatedSubHeight, {
        toValue: hp("90%"),   // 👈 BIGGER than category
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.5,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const closeSubCategory = () => {
    Animated.parallel([
      Animated.timing(animatedSubHeight, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => setDetailsVisible(false));
  };



  // Get category hierarchy for breadcrumb
  const getCategoryHierarchy = () => {
    if (!activeCategory) return [];

    const hierarchy = [];

    // Add parent category (Computer)
    if (item) {
      hierarchy.push({
        name: item.name || item.title,
        id: item.id
      });
    }

    // Add current category
    hierarchy.push({
      name: activeCategory.title || activeCategory.name,
      id: activeCategory.id
    });

    return hierarchy;
  };

  // Get available headings from active category
  const getAvailableHeadings = () => {
    if (!activeCategory?.groupedSubcategories) return [];

    return Object.keys(activeCategory.groupedSubcategories);
  };

  // Filter and group subcategories based on search and selected heading
  const getFilteredAndGroupedSubcategories = () => {
    if (!activeCategory?.groupedSubcategories) return {};

    const filteredGrouped: { [headingName: string]: SubCategory[] } = {};

    Object.keys(activeCategory.groupedSubcategories).forEach(headingName => {
      // If a specific heading is selected, only show that heading
      if (selectedHeading && selectedHeading !== headingName) {
        return;
      }

      const filtered = activeCategory.groupedSubcategories![headingName].filter(
        (s) =>
          s.title.toLowerCase().includes(search.trim().toLowerCase()) ||
          s.name?.toLowerCase().includes(search.trim().toLowerCase())
      );

      if (filtered.length > 0) {
        filteredGrouped[headingName] = filtered;
      }
    });

    return filteredGrouped;
  };

  const filteredGroupedSubcategories = getFilteredAndGroupedSubcategories();
  const categoryHierarchy = getCategoryHierarchy();
  const availableHeadings = getAvailableHeadings();

  const openDetails = () => {
    setDetailsVisible(true);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: hp("70%"),
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeDetails = () => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setDetailsVisible(false);
      setSelectedHeading(null); // Reset heading filter when closing
    });
  };

  const getImageSource = (icon: string | any, fallbackKey?: string) => {
    if (typeof icon === "string") {
      const imageUrl = icon.startsWith("http")
        ? icon
        : `${IMAGE_BASE_URL}${icon}`;
      return { uri: imageUrl };
    } else if (icon && typeof icon === "object") {
      return icon;
    } else {
      return (
        FALLBACK_IMAGES[fallbackKey as keyof typeof FALLBACK_IMAGES] ||
        FALLBACK_IMAGES.default
      );
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
    openDetails();
  };

  const onSubcategoryPress = async (subcategory: any) => {
    const result = await handleSubcategoryPress(subcategory);
    if (type == "Map") {
      navigation.navigate("MainMap", { item: subcategory, subCategory: activeCategory?.subcategories });
    } else {
      navigation.navigate("ListView", {
        subcategory: result,
        category: activeCategory,
        parentCategory: item,
      });
    }
  };

  const onViewAllPress = () => {
    if (type == "Map") {
      navigation.navigate("MainMap", { item: activeCategory, subCategory: activeCategory?.subcategories });
    } else {
      navigation.navigate("ListView", {
        category: activeCategory,
        parentCategory: item,
      });
    }
  };

  // Handle heading filter selection
  const handleHeadingPress = (headingName: string) => {
    if (selectedHeading === headingName) {
      setSelectedHeading(null); // Deselect if same heading is clicked again
    } else {
      setSelectedHeading(headingName); // Select the heading
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedHeading(null);
    setSearch("");
  };

  // Render category hierarchy breadcrumb
  const renderCategoryBreadcrumb = () => {
    if (categoryHierarchy.length === 0) return null;

    return (
      <View style={[styles.breadcrumbContainer, { display: 'none' }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.breadcrumbContent}
        >
          {categoryHierarchy.map((category, index) => (
            <View key={category.id} style={[styles.breadcrumbItem, { display: 'none' }]}>
              <Text style={styles.breadcrumbText}>
                {category.name}
              </Text>
              {index < categoryHierarchy.length - 1 && (
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={hp(2)}
                  color="#666"
                  style={styles.breadcrumbArrow}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render heading filters
  const renderHeadingFilters = () => {
    if (availableHeadings.length === 0) return null;

    return (
      <View style={styles.headingFiltersContainer}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.headingFiltersContent, { display: availableHeadings[0] == 'Other Categories' ? 'none' : 'flex' }]}
        >
          {availableHeadings.map((headingName) => (
            <TouchableOpacity
              key={headingName}
              style={[
                styles.headingFilterChip,
                selectedHeading === headingName && styles.headingFilterChipActive
              ]}
              activeOpacity={1}
              onPress={() => handleHeadingPress(headingName)}
            >
              <Text style={[
                styles.headingFilterText,
                selectedHeading === headingName && styles.headingFilterTextActive
              ]}>
                {headingName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Clear filters button */}
        {(selectedHeading || search) && (
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render grouped subcategories
  const renderGroupedSubcategories = () => {
    if (!filteredGroupedSubcategories || Object.keys(filteredGroupedSubcategories).length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {search ? "No items found" : "No items available"}
          </Text>
          {!search && (
            <TouchableOpacity style={styles.retryButton} onPress={retry}>
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // If a specific heading is selected, show only that heading without section title
    if (selectedHeading) {
      return (
        <FlatList
          style={{ flex: 1 }}
          key="filtered-view"
          data={filteredGroupedSubcategories[selectedHeading]}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.subcatList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: subItem }) => (
            <TouchableOpacity
              style={[
                styles.subcatCard,
                activeSubcategoryId === subItem.id && styles.activeSubcatCard,
              ]}
              activeOpacity={0.8}
              onPress={() => onSubcategoryPress(subItem)}
            >
              <Image
                source={getImageSource(
                  subItem.icon || subItem.image,
                  activeCategory?.id
                )}
                style={styles.subcatImage}
                resizeMode="contain"
                defaultSource={FALLBACK_IMAGES.default}
              />
              <Text style={styles.subcatTitle}>
                {subItem.title || subItem.name}
              </Text>
              {subSubcategoriesLoading &&
                activeSubcategoryId === subItem.id && <LoadingModal />}
            </TouchableOpacity>
          )}
        />
      );
    }

    // Show all headings with section titles
    return (
      <FlatList
        style={{ flex: 1 }}
        key="grouped-view"
        data={Object.keys(filteredGroupedSubcategories)}
        keyExtractor={(headingName) => headingName}
        contentContainerStyle={styles.subcatList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: headingName }) => (
          <View style={styles.headingSection}>
            {/* Heading Title */}
            {headingName != 'Other Categories' &&

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.headingTitle}>{headingName}</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={hp(2.5)}
                  style={{ marginTop: hp(-1), marginLeft: 5 }}
                  color="#6C63FF"
                />
              </View>
            }
            {/* Subcategories Grid */}
            <View style={styles.subcategoriesGrid}>
              {filteredGroupedSubcategories[headingName].map((subItem) => (
                <TouchableOpacity
                  key={subItem.id}
                  style={[
                    styles.subcatCard,
                    activeSubcategoryId === subItem.id && styles.activeSubcatCard,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onSubcategoryPress(subItem)}
                >
                  <Image
                    source={getImageSource(
                      subItem.icon || subItem.image,
                      activeCategory?.id
                    )}
                    style={styles.subcatImage}
                    resizeMode="contain"
                    defaultSource={FALLBACK_IMAGES.default}
                  />
                  <Text style={styles.subcatTitle}>
                    {subItem.title || subItem.name}
                  </Text>
                  {subSubcategoriesLoading &&
                    activeSubcategoryId === subItem.id && <LoadingModal />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    );
  };

  if (loading && categories.length === 0) {
    return <LoadingModal />;
  }

  if (error && categories.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <View style={styles.topLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather
              name="arrow-left"
              style={{ marginRight: wp(2) }}
              size={hp("2.2%")}
              color="#000000"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationWrap}
            onPress={() => toggleCategory(item?.id)}
          >
            <Text style={styles.locationText}>
              {item?.name || "Categories"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={hp("2%")}
              style={{ marginTop: hp(0.7), marginLeft: wp(1) }}
              color="#6C63FF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchIconBtn} onPress={() => navigation.navigate('BuySellSearch')}>
          <Ionicons name="search-outline" size={hp("2.5%")} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={hp("2.4%")}
          color="#999"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Search here for more"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Category Hierarchy Breadcrumb */}
      {renderCategoryBreadcrumb()}

      {/* Heading Filters */}
      {renderHeadingFilters()}

      {/* Main Content */}
      <View style={styles.contentWrap}>
        {categories.length > 0 && (
          <View style={styles.leftRail}>
            <ScrollView
              contentContainerStyle={styles.leftInner}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={subcategoriesLoading}
                  onRefresh={retry}
                  colors={["#6C63FF"]}
                />
              }
            >
              {categories.map((cat, index) => {
                const isActive = cat.id === activeCategoryId;
                const prevActive = categories[index - 1]?.id === activeCategoryId;
                const nextActive = categories[index + 1]?.id === activeCategoryId;

                const borderStyles: any = {
                  borderRightWidth: isActive ? 0 : 1,
                  borderRightColor: "#e3e3e3",
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  marginVertical: isActive ? hp("1%") : 0,
                };

                if (prevActive) {
                  borderStyles.borderTopWidth = 1;
                  borderStyles.borderTopColor = "#e3e3e3";
                  borderStyles.borderTopRightRadius = wp("3%");
                }

                if (nextActive) {
                  borderStyles.borderBottomWidth = 1;
                  borderStyles.borderBottomColor = "#e3e3e3";
                  borderStyles.borderBottomRightRadius = wp("3%");
                }

                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.8}
                    onPress={() => changeActiveCategory(cat.id)}
                    style={[styles.catItem, borderStyles]}
                  >
                    {isActive && <View style={styles.activeLine} />}

                    <Image
                      source={getImageSource(cat.icon || cat.image, cat.id)}
                      style={styles.catIconImg}
                      resizeMode="contain"
                      defaultSource={FALLBACK_IMAGES.default}
                    />
                    <Text
                      style={[
                        styles.catLabel,
                        isActive ? styles.catLabelActive : undefined,
                      ]}
                      numberOfLines={2}
                    >
                      {cat.title || cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* RIGHT CONTENT - Grouped Subcategories */}
        <View style={styles.rightContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory?.title || activeCategory?.name || "Loading..."}
            </Text>
            {activeCategory?.subcategories &&
              activeCategory.subcategories.length > 0 && (
                <TouchableOpacity style={styles.expandBtn}>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={hp(2.5)}
                    style={{ marginTop: hp(0.5) }}
                    color="#6C63FF"
                  />
                </TouchableOpacity>
              )}
          </View>

          {subSubcategoriesLoading ? (
            <LoadingModal />
          ) : (
            renderGroupedSubcategories()
          )}
        </View>
      </View>

      {/* Bottom Sheet */}
      {detailsVisible && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={closeDetails} />
          <TouchableOpacity
            style={[styles.closeIcon, { zIndex: 99, opacity: 1 }]}
            onPress={closeDetails}
          >
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      )}
      <Animated.View style={[styles.bottomSheet, { height: animatedHeight }]}>
        {expandedCategory && (
          <View style={{ flex: 1 }}>
            <CategoriesScreen type={type ? type : "List"} />
          </View>
        )}

      </Animated.View>

      <Animated.View style={[styles.bottomSheet, { height: animatedSubHeight }]}>
        <CategoryDetailsScreen id={expandedCategory} type={type} />
      </Animated.View>
    </SafeAreaView>
  );
}

// ... previous styles remain the same, add new styles below ...

const LEFT_RAIL_WIDTH = wp("26%");
const RIGHT_PADDING = wp("3%");

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // ... previous styles remain the same until we add new ones ...

  // New styles for breadcrumb and heading filters
  breadcrumbContainer: {
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingVertical: hp("1%"),
  },
  breadcrumbContent: {
    paddingHorizontal: wp("3%"),
    alignItems: "center",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbText: {
    fontSize: hp("1.6%"),
    color: "#6C63FF",
    fontFamily: "Poppins-SemiBold",
  },
  breadcrumbArrow: {
    marginHorizontal: wp("1%"),
  },

  headingFiltersContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    paddingVertical: hp("1.5%"),
    flexDirection: "row",
    alignItems: "center",
  },
  headingFiltersContent: {
    paddingHorizontal: wp("3%"),
    // flex: 1,
  },
  headingFilterChip: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: hp("2%"),
    marginRight: wp("2%"),
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  headingFilterChipActive: {
    backgroundColor: "#6C63FF",
    borderColor: "#6C63FF",
  },
  headingFilterText: {
    fontSize: hp("1.4%"),
    color: "#6c757d",
    fontFamily: "Poppins-Medium",
  },
  headingFilterTextActive: {
    color: "#fff",
  },
  clearFiltersButton: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    marginRight: wp("3%"),
  },
  clearFiltersText: {
    fontSize: hp("1.4%"),
    color: "#6C63FF",
    fontFamily: "Poppins-Medium",
  },

  // ... rest of the previous styles remain the same ...
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 99,
    elevation: 99,
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: hp(1.8),
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  errorText: {
    fontSize: hp(1.8),
    color: "#FF6B6B",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    marginBottom: hp(3),
  },
  retryButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: hp(1),
  },
  retryButtonText: {
    color: "#fff",
    fontSize: hp(1.6),
    fontFamily: "Poppins-Medium",
  },
  loadingSubcategories: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(10),
  },
  loadingSubText: {
    marginTop: hp(2),
    fontSize: hp(1.6),
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(10),
  },
  emptyStateText: {
    fontSize: hp(1.6),
    color: "#999",
    fontFamily: "Poppins-Medium",
    marginBottom: hp(2),
    textAlign: "center",
  },

  // Topbar
  topbar: {
    height: hp("8%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("3%"),
    borderBottomWidth: 0.6,
    borderBottomColor: "#e3e3e3",
    backgroundColor: "#fff",
    marginTop: hp(3),
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: wp("1%"),
  },
  locationWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: hp("2%"),
    color: "#333",
    marginRight: wp("1%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.7),
  },
  searchIconBtn: {
    padding: wp("1%"),
  },

  //Search Bar
  searchContainer: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    borderBottomWidth: 0.6,
    borderBottomColor: "#f1f1f1",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: wp("5%"),
    zIndex: 1,
  },
  searchInput: {
    height: hp("5.5%"),
    borderRadius: hp("1%"),
    paddingLeft: wp("10%"),
    fontSize: hp("1.9%"),
    borderWidth: 0.6,
    borderColor: "#00000080",
    flex: 1,
  },

  // Main Content
  contentWrap: {
    flex: 1,
    flexDirection: "row",
  },

  // LEFT SIDE
  leftRail: {
    width: LEFT_RAIL_WIDTH,
    backgroundColor: "#fff",
  },
  leftInner: {
    paddingVertical: hp("2%"),
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  catItem: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("2%"),
    marginVertical: hp("0.6%"),
    position: "relative",
    backgroundColor: "#fff",
  },
  activeLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: wp("1.2%"),
    backgroundColor: "#6C63FF",
    borderTopRightRadius: wp("4%"),
    borderBottomRightRadius: wp("4%"),
  },
  catIconImg: {
    width: wp("10%"),
    height: wp("10%"),
    marginBottom: hp("0.8%"),
  },
  catLabel: {
    fontSize: hp("1.4%"),
    color: "#444",
    textAlign: "center",
    width: "100%",
    fontFamily: "Poppins-Medium",
  },
  catLabelActive: {
    color: "#000",
    fontWeight: "700",
  },

  // RIGHT SIDE
  rightContent: {
    flex: 1,
    paddingHorizontal: RIGHT_PADDING,
    paddingTop: hp("2%"),
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  sectionTitle: {
    fontSize: hp("2%"),
    color: "#111",
    fontFamily: "Poppins-Medium",
    marginTop: hp(1),
    flex: 1,
  },
  expandBtn: {
    width: wp("8%"),
    alignItems: "flex-end",
  },
  subcatList: {
    paddingBottom: hp("8%"),
  },

  // Styles for grouped subcategories
  headingSection: {
    marginBottom: hp("3%"),
  },
  headingTitle: {
    fontSize: hp("1.8%"),
    color: "#333",
    fontFamily: "Poppins-SemiBold",
    marginBottom: hp("1.5%"),
    paddingLeft: wp("1%"),
    fontWeight: 'bold'
    // borderLeftWidth: 3,
    // borderLeftColor: "#6C63FF",
    // paddingLeft: wp("2%"),
  },
  subcategoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subcatCard: {
    width: (wp("100%") - LEFT_RAIL_WIDTH - RIGHT_PADDING * 2) / 3 - wp("1%"),
    // marginBottom: hp("2%"),
    alignItems: "center",
    paddingVertical: hp("1.6%"),
    backgroundColor: "#fff",
    borderRadius: wp("2%"),

  },
  activeSubcatCard: {
    borderColor: "#6C63FF",
    backgroundColor: "#f8f7ff",
  },
  subcatImage: {
    width: wp("14%"),
    height: wp("14%"),
    marginBottom: hp("1%"),
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  subcatTitle: {
    fontSize: hp("1.4%"),
    textAlign: "center",
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  subcatLoader: {
    marginTop: hp(0.5),
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    zIndex: 100,
    elevation: 100,
  },
  closeIcon: {
    position: "absolute",
    top: hp(22),
    right: 15,
    zIndex: 101,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});
