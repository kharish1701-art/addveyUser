// SearchResultScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, Keyboard, InteractionManager, Dimensions, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi, PostAPi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import { Animated } from "react-native-maps";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";

export default function SearchResultScreen({ route }) {
  const { keyword } = route.params;
  const searchInputRef = useRef<TextInput>(null);
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState(keyword);
  const images: { [key: string]: any } = {
    buysell: require("../../assets/images/buysell.png"),
    tabAddvey: require("../../assets/images/add.png"),
    tabBuySell: require("../../assets/images/by.png"),
  };
  const [recentSearches, setRecentSearches] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Voice Search Hook
  const { isListening, results, startRecognizing, stopRecognizing, resetResults } = useVoiceRecognition();

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


  // Fetch categories and recent searches on component mount
  useEffect(() => {
    // getCategories();
    getRecentSearches();
  }, []);

  // Search products when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        searchProducts(searchQuery);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Initial focus
  useEffect(() => {
    const focusTask = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    });

    return () => {
      focusTask.cancel();
    };
  }, []);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [searchQuery]);

  // Search products API
  const searchProducts = async (query: string) => {
    try {
      setSearchLoading(true);
      setShowSearchResults(true);

      const token = await AsyncStorage.getItem("authToken");
      const url = `${EndPoints.getProduct}?name=${encodeURIComponent(query)}`;

      const response = await getApi(url, setSearchLoading, token);

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
        token
      );

      if (response?.data) {
        const searches = response.data.data.map((item:any) => item.queryText);
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
      if (!String(query || "")) return;

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
    if (searchQuery) {
      addSearchToHistory(searchQuery);
    }
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (String(searchQuery || "")) {
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
      setRecentSearches([]);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  // Handle recent search item press
  const handleRecentSearchPress = (searchText) => {
    setSearchQuery(searchText);
    searchProducts(searchText);
  };


  const renderProductCard = ({ item }: any) => (
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={wp("5%")} color="#000" />
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
            // onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            blurOnSubmit={true}
          />
          {searchQuery ? (
            <TouchableOpacity
            // onPress={clearSearch}
            >
              <Ionicons name="close-circle" size={wp("5%")} color="#999" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleVoiceSearch}>
              <Ionicons
                name={isListening ? "mic" : "mic-outline"}
                size={wp("5%")}
                color={isListening ? "#6C63FF" : "#999"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* QR Code Icon */}
        <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate("QRCodeScanner")}>
          <MaterialIcons name="qr-code-scanner" size={wp("7%")} color="black" />
        </TouchableOpacity>
      </View>


      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Buy/Sell</Text>
        {/* <Text style={styles.tab}>Services</Text> */}
      </View>

      {/* Results */}
      {/* <View style={styles.listItem}>
        <View style={styles.box} />
        <Text>Split AC</Text>
      </View>

      <View style={styles.listItem}>
        <View style={styles.box} />
        <Text>Window AC</Text>
      </View> */}
      <FlatList
        data={searchResults}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        //   numColumns={2}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptySearchResults}
      />
    
   
        <Pressable style={{
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'space-between', 
          height:50,  bottom:60, position:'absolute', width:wp('100%'),
          borderTopWidth:1,
          borderTopColor:'#D9D9D9DE',
          paddingHorizontal:wp(2) }}
          onPress={()=>{
            if(searchResults.length > 0){
              navigation.navigate("AddPreview", { from: "home", data: searchResults[0] })
            }
          }}
          >
          <Text style={{fontSize:15, color:'#6E533F', }}>Show results for  <Text style={{fontWeight:'700', color:'#000'}}>{searchQuery}</Text>  in Buy/Sell </Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </Pressable>
      <View style={styles.bottomTabsWrapper}>
        
        <View style={styles.bottomTabs}>
          <View
            style={[
              styles.activeLine,
              //   activeTab === "Addvey" ? { left: "25%" } : { left: "75%" },
            ]}
          />

          <TouchableOpacity
            style={styles.tab}
          // onPress={() => setActiveTab("Addvey")}
          >
            <Image source={images.tabAddvey} style={styles.tabIcon} />
            <Text style={styles.tabText}>Addvey</Text>
          </TouchableOpacity>

          <View style={styles.verticalLine} />

          <TouchableOpacity
            style={styles.tab}
            onPress={async () => {
              //   const dd = await AsyncStorage.getItem("IntroBuySell");
              //   if (dd) {
              navigation.navigate("Botomtabs", { screen: "Home" });
              //   } else {
              //     await AsyncStorage.setItem("IntroBuySell", "true");
              // navigation.navigate("BuyAndSellStartup");
              //   }
            }}
          >
            <Image source={images.tabBuySell} style={styles.tabIcon} />
            <Text style={styles.tabText}>Buy/Sell</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9DE'
    // width:150
  },
  activeTab: {
    fontWeight: "700",
    borderBottomWidth: 4,
    // borderColor: "#000",
    paddingBottom: 5,
    marginRight: 20,
    //  height: 4,
    borderColor: "#6C63FF",
    // transform: [{ translateX: -wp("12.5%") }],
    // borderBottomLeftRadius: 3,
    // borderBottomRightRadius: 3,
    width: 80,
    textAlign: 'center'
  },
  //   tab: {
  //     color: "#777",
  //     paddingBottom: 5,
  //   },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  box: {
    width: 60,
    height: 60,
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    marginRight: 15,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    //   marginTop: hp(3.5),
  },
  backButton: {
    marginRight: wp("3%"),
  },
  headerTitle: {
    fontSize: wp("3%"),
    color: "#6E533F",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    marginTop: hp("1.5%"),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("3%"),
    flex: 1,
    paddingHorizontal: wp("2%"),
    height: hp("5.5%"),
    borderColor: "#ddd",
    borderWidth: 1,
  },
  qrButton: {
    marginLeft: wp("3%"),
  },
  searchInput: {
    flex: 1,
    fontSize: wp("3.8%"),
    color: "#000",
  },
  micImage: {
    width: wp("5%"),
    height: wp("5%"),
    resizeMode: "contain",
  },
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
    width: "50%",
    height: 4,
    backgroundColor: "#6C63FF",
    // transform: [{ translateX: -wp("12.5%") }],
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignSelf: 'center'
  },

  // Search Results Styles
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: wp("4%"),
    paddingTop: hp("2%"),
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
    width: wp("99%"),
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
    marginRight: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
    flexDirection: 'row'
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    alignSelf: 'center',
    marginLeft: 10
  },
  productInfo: {
    padding: wp("3%"),
  },
  productName: {
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Medium",
    color: "#333",
    marginBottom: hp("0.5%"),
    lineHeight: wp("4%"),
  },
  productPrice: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Bold",
    color: "#6C63FF",
    marginBottom: hp("0.5%"),
  },
  productLocation: {
    fontSize: wp("2.8%"),
    color: "#666",
    fontFamily: "Poppins-Regular",
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
  // Existing styles remain the same...
  recentContainer: {
    marginTop: hp("3%"),
    paddingHorizontal: wp("5%"),
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  recentTitle: {
    fontSize: wp("3%"),
    color: "#555555AB",
    fontFamily: "Poppins-Medium",
  },
  clearText: {
    fontSize: wp("3.3%"),
    color: "#FF0303",
    fontFamily: "Poppins-Medium",
  },
  searchTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp("1%"),
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("2.5%"),
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.6%"),
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
    borderColor: "#00000033",
    borderWidth: 1,
  },
  tagText: {
    color: "#00000099",
    fontSize: wp("2.8%"),
  },
  categorySection: {
    marginTop: hp("2%"),
    paddingHorizontal: wp("5%"),
  },
  categoryTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("1.5%"),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9D9D9",
    marginHorizontal: wp("2%"),
  },
  categoryHeading: {
    fontSize: wp("3.2%"),
    color: "#777",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  categoryList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  categoryCard: {
    alignItems: "center",
    width: wp("20%"),
    marginBottom: hp("2%"),
  },
  iconPlaceholder: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("3%"),
    backgroundColor: "#f0f0f0",
    marginBottom: hp("1%"),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryText: {
    fontSize: wp("3%"),
    color: "#000",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  voiceButton: {
    position: "absolute",
    bottom: hp("3%"),
    right: wp("5%"),
    backgroundColor: "#fff",
    borderRadius: wp("10%"),
    padding: wp("4%"),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  voiceImage: {
    width: wp("6%"),
    height: wp("6%"),
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
    top: hp(5),
    right: 15,
    zIndex: 101,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("5%"),
  },
  loadingText: {
    marginTop: hp("2%"),
    fontSize: wp("3.5%"),
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("5%"),
  },
  emptyText: {
    fontSize: wp("3.5%"),
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  loadingRecentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: hp("2%"),
  },
  loadingRecentText: {
    marginLeft: wp("2%"),
    fontSize: wp("3%"),
    color: "#666",
    fontFamily: "Poppins-Medium",
  },

});
