import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
  Keyboard,
  FlatList,
  InteractionManager,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import CategoryDetailsScreen from "./CategoryDetailsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteApi, getApi, PostAPi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import CategoriesScreen from "./CatgoeiresScreen";
import VoiceRecognitionModal from "../Components/VoiceRecognitionModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BuySellSearchScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { initialQuery } = route.params || {};
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<{ [key: string]: any[] }>({});
  const [subCategoryLoading, setSubCategoryLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const insets = useSafeAreaInsets();
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  const handleVoiceResult = (text: string) => {
    const recognizedText = String(text || "").trim();
    if (!recognizedText) return;
    setSearchQuery(recognizedText);
    setShowSearchResults(true);
    searchProducts(recognizedText);
  };

  const toggleVoiceSearch = () => {
    setVoiceModalVisible(true);
  };

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);

  // Fetch categories and recent searches on component mount
  useEffect(() => {
    getCategories();
    getRecentSearches();
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Search products when searchQuery changes
  useEffect(() => {
    if (String(searchQuery || "").trim()) {
      const delayDebounceFn = setTimeout(() => {
        searchProducts(searchQuery);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [searchQuery]);


  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    // Force focus using InteractionManager to wait for navigation transition
    const focusTask = InteractionManager.runAfterInteractions(() => {
      // Small delay even after interactions can help on some sluggish devices
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    });

    return () => {
      keyboardDidHideListener.remove();
      focusTask.cancel();
    };
  }, [searchQuery]);

  // Search products API
  const searchProducts = async (query: string) => {
    try {
      setSearchLoading(true);
      setShowSearchResults(true);

      const token = await AsyncStorage.getItem("authToken");
      const url = `${EndPoints.getProduct}?name=${encodeURIComponent(query)}`;

      const response = await getApi(url, setSearchLoading, token, true);

      if (response?.data?.data) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Get recent searches from API
  const getRecentSearches = async () => {
    try {
      setLoadingRecent(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const response = await getApi(
        `${EndPoints.showSearchedHistory}`,
        setLoadingRecent,
        token,
        true
      );

      if (response?.data) {
        const searches = response.data.data.map((item) => item.queryText);
        setRecentSearches(searches);
      }
    } catch (error) {
      console.error("Error fetching recent searches:", error);
    } finally {
      setLoadingRecent(false);
    }
  };

  // Add search to history
  const addSearchToHistory = async (query) => {
    try {
      if (!String(query || "").trim()) return;

      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const param = {
        url: EndPoints.addSearchedHistory,
        body: {
          queryText: query?.trim(),
        },
        token: token,
        requireAuth:true
      };

      const response = await PostAPi(param, setLoadingRecent);
      if (response?.success) {
        getRecentSearches();
      }
    } catch (error) {
      console.error("Error adding search to history:", error);
    }
  };

  // Handle keyboard hide (when user presses done or unfocuses)
  const handleKeyboardHide = () => {
    if (String(searchQuery || "").trim()) {
      addSearchToHistory(searchQuery);
    }
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (String(searchQuery || "").trim()) {
      addSearchToHistory(searchQuery);
      searchProducts(searchQuery);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Clear all recent searches
  const clearRecentSearches = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;
      let params ={
        url:`${EndPoints.deleteRecent}`,
        token:token
      }

      const response = await deleteApi(
        params,
        setLoadingRecent,
      );
      console.log('---- clear ', response)
      if (response?.success) {
        setRecentSearches([]);
      }
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  // Handle recent search item press
  const handleRecentSearchPress = (searchText) => {
    setSearchQuery(searchText);
    searchProducts(searchText);
  };

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? id : id));
    openDetails();
  };

  const getCategories = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      setLoading(true);
      const response = await getApi(EndPoints.getCategories, setLoading, token);
      const cats = response.data.data || [];
      setCategories(cats);

      // Immediately fetch subcategories for all main categories
      cats.forEach(cat => {
        fetchSubCategories(cat.id, token);
      });

    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId: string, token: string) => {
    if (subCategories[categoryId]) return; // Already loaded

    setSubCategoryLoading(prev => ({ ...prev, [categoryId]: true }));
    try {
      const response = await getApi(`${EndPoints.getSubCategories}${categoryId}`, () => { }, token, true);
      if (response?.success) {
        setSubCategories(prev => ({ ...prev, [categoryId]: response.data?.data || [] }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setSubCategoryLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };


  const openDetails = () => {
    setDetailsVisible(true);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: hp("80%"),
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
    ]).start(() => setDetailsVisible(false));
  };

  // Render product card
  const renderProductCard = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate("AddPreview", { from: "home", data: item })}>
      {item?.images?.[0] ? <Image
        source={
          { uri: IMAGE_BASE_URL + item.images[0] }

        }
        style={styles.productImage}
        resizeMode="cover"
      />
        :
        <View style={[styles.productImage, { backgroundColor: 'grey' }]}></View>
      }
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item?.name || "Unnamed Product"}
        </Text>
        <Text style={styles.productPrice}>
          ₹{item.price ? item.price.toLocaleString() : "0"}
        </Text>
        <Text style={styles.productLocation} numberOfLines={1}>
          {item?.location?.city || "Location not specified"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render empty state for search results
  const renderEmptySearchResults = () => (
    <View style={styles.emptyResults}>
      <MaterialIcons name="search-off" size={wp("15%")} color="#ccc" />
      <Text style={styles.emptyResultsText}>No products found</Text>
      <Text style={styles.emptyResultsSubText}>
        Try searching with different keywords
      </Text>
    </View>
  );

  const renderSectionIcon = (icon) => {
    if (!icon) {
      return <View style={styles.iconPlaceholder} />;
    }
    return (
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: IMAGE_BASE_URL + icon }}
          style={styles.categoryIcon}
          resizeMode="contain"
        />
      </View>
    )
  }

  const navigateToSubCategory = (subCat, parentCat) => {
    navigation.navigate("ListView", {
      subcategory: subCat,
      category: parentCat,
      parentCategory: parentCat,
    });
  }

  const handleCreatePost = () => {
    // Implement view more logic either expand or navigate to category details
    // For now navigating to CategoriesScreen which seems to be the main explore
    navigation.navigate("CategoriesScreen")
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={wp("6%")} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search for cars, bikes, etc.</Text>
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            ref={searchInputRef}
            autoFocus={true}
            placeholder='Search "cars"'
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            blurOnSubmit={true}
          />
          {searchQuery ? (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={wp("5%")} color="#999" />
              </TouchableOpacity>
              <View style={{ borderColor: "black", borderWidth: 0.5, height: hp("2%"), marginLeft: 10, }} />
              <TouchableOpacity onPress={toggleVoiceSearch} style={{ paddingHorizontal: 5 }}>
                <Ionicons
                  name={"mic-outline"}
                  size={wp("5%")}
                  color={"#999"}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={toggleVoiceSearch} style={{ paddingHorizontal: 5 }}>
              <Ionicons
                name={"mic-outline"}
                size={wp("5%")}
                color={"#999"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* QR Code Icon */}
        <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate("QRCodeScanner")}>
          <MaterialIcons name="qr-code-scanner" size={wp("6%")} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {showSearchResults ? (
        <View style={styles.searchResultsContainer}>
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsTitle}>
              Search Results for "{searchQuery}"
            </Text>
            {searchLoading && (
              <ActivityIndicator size="small" color="#6C63FF" />
            )}
          </View>

          {searchLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
              <Text style={styles.loadingText}>Searching products...</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              //   numColumns={2}
              contentContainerStyle={styles.productsGrid}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptySearchResults}
            />
          )}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp("12%") }}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <View style={styles.recentContainer}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>YOUR RECENT SEARCHES</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchTags}>
                {recentSearches.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleRecentSearchPress(item)}
                  >
                    <MaterialCommunityIcons name="history" size={wp("4%")} color="#999" style={{ marginRight: 6 }} />
                    <Text style={styles.tagText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Categories Divider & Title */}
          {!searchQuery && (
            <View style={styles.categoryHeaderContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.categoryMainTitle}>CATEGORIES</Text>
              <View style={styles.dividerLine} />
            </View>
          )}

          {/* Categories List */}
          {!searchQuery && (
            <View style={styles.categorySection}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#6C63FF" />
                </View>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <View key={category.id} style={styles.mainCategoryBlock}>
                    <Text style={styles.sectionTitle}>{category.name}</Text>

                    <View style={styles.subCategoryGrid}>
                      {subCategoryLoading[category.id] ? (
                        <ActivityIndicator size="small" color="#6C63FF" style={{ alignSelf: 'flex-start', marginLeft: 20 }} />
                      ) : subCategories[category.id] && subCategories[category.id].length > 0 ? (
                        <>
                          {subCategories[category.id].slice(0, 3).map((subCat) => (
                            <TouchableOpacity
                              key={subCat.id}
                              style={styles.subCategoryItem}
                              onPress={() => navigateToSubCategory(subCat, category)}
                            >
                              <View style={styles.subCatIconContainer}>
                                <Image
                                  source={{ uri: IMAGE_BASE_URL + subCat.image }}
                                  style={styles.subCatImage}
                                  resizeMode="contain"
                                />
                              </View>
                              <Text style={styles.subCatName} numberOfLines={2}>{subCat.name}</Text>
                            </TouchableOpacity>
                          ))}
                          {/* View More Button */}
                          <TouchableOpacity style={styles.subCategoryItem} onPress={() => {
                            toggleCategory(category.id);
                          }}>
                            <View style={[styles.subCatIconContainer, styles.viewMoreContainer]}>
                              <Feather name="arrow-down" size={wp("6%")} color="#6C63FF" />
                            </View>
                            <Text style={styles.viewMoreText}>View more</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <Text style={styles.noSubText}>No subcategories</Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No categories available</Text>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Overlay */}
      {detailsVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.overlay,
            { opacity: overlayOpacity },
          ]}
        />
      )}

      {/* Close Icon */}
      {detailsVisible && (
        <TouchableOpacity style={[styles.closeIcon, { top: hp(20) - 25 - insets.top }]} onPress={closeDetails}>
          <Ionicons name="close" size={22} color="#000" />
        </TouchableOpacity>
      )}

      {/* Bottom Sheet: Category Details */}
      <Animated.View style={[styles.bottomSheet, { height: animatedHeight }]}>
        <CategoryDetailsScreen
          id={expandedCategory}
        />
      </Animated.View>

      {/* Floating Image Button (Bottom Right) */}
      <TouchableOpacity style={styles.voiceButton} onPress={toggleVoiceSearch}>
        <Ionicons
          name={"mic-outline"}
          size={wp("8%")}
          color="#fff"
        />
      </TouchableOpacity>

      <VoiceRecognitionModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
        onResult={handleVoiceResult}
      />
    </SafeAreaView>
  );
};

export default BuySellSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("1%"),
    backgroundColor: "#fff",
    marginTop: hp(6),
  },
  backButton: {
    marginRight: wp("3%"),
  },
  headerTitle: {
    fontSize: wp("3.5%"),
    color: "#6E533F", // brownish color from image
    fontFamily: "Poppins-Regular",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2%"),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("2%"),
    flex: 1,
    paddingHorizontal: wp("3%"),
    height: hp("5.5%"),
    borderColor: "#E0E0E0",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  qrButton: {
    marginLeft: wp("3%"),
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    fontSize: wp("3.8%"),
    color: "#000",
    fontFamily: "Poppins-Medium", // Bold search text
  },
  // Recent Searches
  recentContainer: {
    marginTop: hp("1%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2%"),
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  recentTitle: {
    fontSize: wp("3%"),
    color: "#999",
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: wp("3.5%"),
    color: "#ff3b30",
    fontFamily: "Poppins-Medium",
  },
  searchTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("5%"), // Pill shape
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.8%"),
    marginRight: wp("2%"),
    marginBottom: hp("1.2%"),
    borderColor: "#E0E0E0",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  tagText: {
    color: "#555",
    fontSize: wp("3%"),
    fontFamily: "Poppins-Regular",
  },
  // Categories
  categoryHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2%"),
    marginTop: hp("1%"),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  categoryMainTitle: {
    marginHorizontal: wp("4%"),
    fontSize: wp("3.2%"),
    color: "#888",
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
  },
  categorySection: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("10%"),
  },
  mainCategoryBlock: {
    marginBottom: hp("3%"),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontFamily: "Poppins-Bold",
    color: "#000",
    marginBottom: hp("2%"),
  },
  subCategoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subCategoryItem: {
    width: "23%", // 4 items per row roughly with gaps
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  subCatIconContainer: {
    width: wp("15%"),
    height: wp("15%"),
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("0.8%"),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#eee",
    padding: 5
  },
  viewMoreContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("50%"), // Circular
    width: wp("14%"),
    height: wp("14%"),
  },
  subCatImage: {
    width: "100%",
    height: "100%",
  },
  subCatName: {
    fontSize: wp("3%"),
    color: "#000",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    lineHeight: wp("4%"),
  },
  viewMoreText: {
    fontSize: wp("3%"),
    color: "#333",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  noSubText: {
    fontSize: wp("3%"),
    color: "#999",
    fontFamily: "Poppins-Regular",
    marginLeft: wp("2%")
  },
  // Search Results Styles
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: wp("4%"),
    paddingTop: hp("1%"),
  },
  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  searchResultsTitle: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "#333",
  },
  productsGrid: {
    paddingBottom: hp("2%"),
  },
  productCard: {
    width: wp("92%"),
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: wp('2%')
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  productInfo: {
    flex: 1,
    paddingHorizontal: wp("3%"),
    justifyContent: 'center'
  },
  productName: {
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Medium",
    color: "#333",
    marginBottom: hp("0.5%"),
  },
  productPrice: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Bold",
    color: "#6C63FF",
  },
  productLocation: {
    fontSize: wp("2.8%"),
    color: "#999",
    fontFamily: "Poppins-Regular",
    marginTop: hp("0.5%"),
  },
  emptyResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("10%"),
  },
  emptyResultsText: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "#666",
    marginTop: hp("2%"),
  },
  emptyResultsSubText: {
    fontSize: wp("3.2%"),
    color: "#999",
    fontFamily: "Poppins-Regular",
    marginTop: hp("1%"),
    textAlign: "center",
  },
  categoryText: {
    fontSize: wp("3%"),
    color: "#000",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  voiceButton: {
    position: "absolute",
    bottom: hp("5%"),
    right: wp("5%"),
    backgroundColor: "#6C63FF",
    borderRadius: wp("10%"),
    padding: wp("3%"),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 99,
    elevation: 99,
  },
  closeIcon: {
    position: "absolute",

    right: 15,
    alignSelf: 'flex-start',
    zIndex: 101,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 20,
  },
  loadingContainer: {
    paddingVertical: hp("2%"),
    alignItems: "center",
  },
  loadingText: {
    marginTop: hp("1%"),
    color: "#999",
    fontSize: wp("3%"),
  },
  loadingRecentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%')
  },
  loadingRecentText: {
    marginLeft: 10,
    color: '#999',
    fontSize: wp('3%')
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999'
  }
});
