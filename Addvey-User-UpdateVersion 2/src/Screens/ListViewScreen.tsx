// import React, { use, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   FlatList,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import ListViewTypesScreen from "../Components/HomeType/ListViewTypes";
// import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
// import { EndPoints } from "../services/EndPoints";
// import { getApi } from "../api/getApi/getApi";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import LoadingModal from "../Components/Loader";

// interface Item {
//   id: string;
//   title: string;
//   image: any;
// }
// const DATA: Item[] = [
//   { id: "1", title: "1BHK", image: require("../../assets/images/apart.png") },
//   { id: "2", title: "2BHK", image: require("../../assets/images/apart.png") },
//   { id: "3", title: "3BHK", image: require("../../assets/images/apart.png") },
//   { id: "4", title: "4BHK", image: require("../../assets/images/apart.png") },
// ];

// export default function ListViewScreen() {
//   const navigation = useNavigation<any>();
//   const route = useRoute();

//   const { subcategory, category, parentCategory } = route?.params;
//   const [activeId, setActiveId] = useState(subcategory);
//   useEffect(() => {
//     setActiveId(subcategory);
//   }, [subcategory]);
//   console.log(
//     subcategory,
//     "=========================",
//     category,
//     "==============================",
//     parentCategory
//   );
//   const [loading, setLoading] = useState(false);
//   const [subcategories, setSubCategory] = useState([]);
//   useEffect(() => {
//     fetchSubCategories();
//   }, [subcategory]);
//   const fetchSubCategories = async () => {
//     try {
//       const token = await AsyncStorage.getItem("authToken");

//       const res = await getApi(
//         `${EndPoints?.getSubCategories}${subcategory?.id}`,
//         //   "/category-headings/view-all?page=1",
//         setLoading,
//         token
//       );
//       //   console.log("call__sub__category__d__s");
//       if (res?.success) {
//         // console.log("✅ Sub Categories:", res?.data?.data);
//         setSubCategory(res?.data?.data);
//       } else {
//         console.warn("⚠️ Failed to fetch sub-categories:", res.message);
//       }
//     } catch (err) {
//       console.error("Error fetching sub-categories:", err);
//     }
//   };
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {loading && <LoadingModal />}
//       {/* Top Header */}
//       <View style={styles.topBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons
//             name="arrow-back"
//             style={{ marginRight: wp(2) }}
//             size={hp("2%")}
//             color="#000"
//           />
//         </TouchableOpacity>
//         <Text style={styles.topTitle}>{parentCategory?.name}</Text>
//         <View style={{ width: wp("6%") }} />
//       </View>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: hp("4%") }}
//       >
//         {/* Search Section */}
//         {/* <View style={styles.searchSection}>
//                     <View style={styles.searchBox}>
//                         <Ionicons
//                             name="search-outline"
//                             size={hp("2.2%")}
//                             color="#777"
//                             style={styles.searchIcon}
//                         />
//                         <TextInput
//                             placeholder="Search for more"
//                             placeholderTextColor="#999"
//                             style={styles.searchInput}
//                         />
//                         <Image
//                             source={require("../../assets/images/mic.png")}
//                             style={styles.micIcon}
//                         />
//                     </View>
//                     <TouchableOpacity onPress={()=>navigation.navigate('QRCodeScanner')}>
//                         <Image
//                             source={require("../../assets/images/qrcode.png")}
//                             style={styles.qrIcon}
//                         />
//                     </TouchableOpacity>
//                 </View> */}

//         {/* Category List */}
//         <View style={styles.listWrapper}>
//           <FlatList
//             data={
//               category?.subCategories ||
//               category?.subcategories ||
//               category ||
//               subcategories
//             }
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={{
//               justifyContent: "space-between",
//               // width: wp("100%"),
//               paddingHorizontal: wp("4%"),
//             }}
//             style={{ flex: 1 }}
//             renderItem={({ item }) => {
//               console.log('govind', item?.id)
//               const isActive = item.id === activeId.id;
//               return (
//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   onPress={() => setActiveId(item)}
//                   style={[
//                     styles.cardContainer,
//                     isActive && styles.activeCardContainer,
//                   ]}
//                 >
//                   <View
//                     style={[
//                       styles.imageWrapper,
//                       {
//                         borderWidth: isActive ? 0 : 0,
//                         borderColor: isActive ? "transparent" : "transparent",
//                         borderRadius: wp("8.5%"),
//                       },
//                     ]}
//                   >
//                     <Image
//                       source={{ uri: IMAGE_BASE_URL + item.image }}
//                       style={styles.image}
//                       resizeMode="cover"
//                     />
//                   </View>
//                   <Text
//                     style={[styles.cardText, isActive && styles.activeCardText]}
//                   >
//                     {item.title || item.name}
//                   </Text>

//                   {isActive && <View style={styles.activeBottomLine} />}
//                 </TouchableOpacity>
//               );
//             }}
//           />
//         </View>

//         <ListViewTypesScreen subCategory={activeId} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   topBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: wp("4%"),
//     paddingVertical: hp("1.8%"),
//     borderBottomColor: "#ddd",
//     marginTop: hp(3),
//   },
//   topTitle: {
//     fontSize: hp("1.7%"),
//     color: "#000",
//     fontFamily: "Poppins-Medium",
//     marginTop: hp(0.4),
//   },
//   searchSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: wp("4%"),
//     marginTop: hp("0.5%"),
//   },
//   searchBox: {
//     flex: 1,
//     height: hp("5%"),
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: hp("1%"),
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: wp("3%"),
//     backgroundColor: "#fff",
//   },
//   searchIcon: {
//     marginRight: wp("2%"),
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: hp("1.8%"),
//     color: "#000",
//     paddingVertical: 0,
//   },
//   micIcon: {
//     width: wp("5%"),
//     height: wp("5%"),
//     resizeMode: "contain",
//   },
//   qrIcon: {
//     width: wp("7%"),
//     height: wp("7%"),
//     resizeMode: "contain",
//     marginLeft: wp("3%"),
//   },
//   listWrapper: {
//     marginTop: hp("2%"),
//     position: "relative",
//     paddingBottom: hp("0.3%"),
//   },
//   cardContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingBottom: hp("1%"),
//     backgroundColor: "#fff",
//     position: "relative",
//     paddingHorizontal: 10,
//   },
//   activeCardContainer: {
//     backgroundColor: "#fff",
//     elevation: 2,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     borderWidth: 2,
//     borderColor: "#eee",
//   },
//   imageWrapper: {
//     width: wp("17%"),
//     height: wp("17%"),
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },
//   image: {
//     width: "85%",
//     height: "85%",
//     borderRadius: wp("8.5%"),
//   },
//   cardText: {
//     marginTop: hp("0.8%"),
//     fontSize: hp("1.4%"),
//     color: "#555",
//     fontFamily: "Poppins-Medium",
//   },
//   activeCardText: {
//     color: "#000",
//     fontWeight: "600",
//   },
//   activeBottomLine: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: hp("0.5%"),
//     backgroundColor: "#6C63FF",
//     borderTopLeftRadius: hp("2%"),
//     borderTopRightRadius: hp("2%"),
//   },
// });



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import ListViewTypesScreen from "../Components/HomeType/ListViewTypes";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { EndPoints } from "../services/EndPoints";
import { getApi } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../Components/Loader";
import SearchBar from "../Components/MainHome/Searchbar";
import FilterBar from "../Components/MainHome/FilterBar";

const { width } = Dimensions.get("window");

export default function ListViewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const { subcategory, category, parentCategory } = (route?.params || {}) as any;
  const [activeId, setActiveId] = useState(subcategory);
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubCategory] = useState([]);


  const targetId = subcategory?.id || subcategory?._id;

  useEffect(() => {
    if (targetId) {
      setActiveId(subcategory);
    }
  }, [subcategory]);

  console.log(
    "Subcategory:", subcategory,
    "Target ID:", targetId,
    "Category:", category,
    "Parent Category:", parentCategory
  );

  useEffect(() => {
    if (targetId) {
      fetchSubCategories();
    }
  }, [subcategory]);

  const fetchSubCategories = async () => {
    if (!targetId) return;
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await getApi(
        `${EndPoints?.getSubCategories}${targetId}`,
        setLoading,
        token
      );

      console.log("Subcategories API Response:", res);

      if (res?.success) {
        console.log("✅ Sub Categories Data:", res?.data?.data);
        setSubCategory(res?.data?.data || []);
      } else {
        console.warn("⚠️ Failed to fetch sub-categories:", res.message);
        setSubCategory([]);
      }
    } catch (err) {
      console.error("Error fetching sub-categories:", err);
      setSubCategory([]);
    }
  };

  // Determine which data to use for the horizontal list
  const getListData = () => {
    // Priority order for data source

    // 1. Check for explicitly passed subcategories (new fix)
    if (route?.params?.subcategories && route.params.subcategories.length > 0) {
      console.log("Using passed subcategories data:", route.params.subcategories);
      return route.params.subcategories;
    }

    if (category?.subCategories && category.subCategories.length > 0) {
      console.log("Using category.subCategories data:", category.subCategories);
      return category.subCategories;
    }
    if (category?.subcategories && category.subcategories.length > 0) {
      console.log("Using category.subcategories data:", category.subcategories);
      return category.subcategories;
    }
    if (subcategories && subcategories.length > 0) {
      console.log("Using subcategories data:", subcategories);
      return subcategories;
    }
    if (category && category.length > 0) {
      // Check if category is an array itself
      if (Array.isArray(category)) {
        console.log("Using category array data:", category);
        return category;
      }
    }
    console.log("No data available for horizontal list");
    return [];
  };

  const listData = getListData();

  const renderItem = ({ item }) => {
    console.log('Rendering item:', item?.id, item?.name || item?.title);

    const itemID = item.id || item._id;
    const isActive = itemID === (activeId?.id || activeId?._id);
    const imageUrl = item.image ? `${IMAGE_BASE_URL}${item.image}` : null;
    const title = item.title || item.name || "Unknown";

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setActiveId(item)}
        style={[
          styles.cardContainer,
          isActive && styles.activeCardContainer,
        ]}
      >
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, { elevation: isActive ? 3 : 0, backgroundColor: 'white' }]}
              resizeMode="cover"
              onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.cardText, isActive && styles.activeCardText]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {isActive && <View style={styles.activeBottomLine} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading && <LoadingModal />}

      {/* Debug Info - Remove in production */}
      {/* <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Data Count: {listData.length} | Active ID: {activeId?.id || activeId?._id}
        </Text>
      </View> */}

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <Ionicons
            name="arrow-back"
            style={{ marginRight: wp(2) }}
            size={hp("2%")}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={styles.topTitle}>{parentCategory?.name}</Text>
        <View style={{ width: wp("6%") }} />
      </View>
      <SearchBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp("4%") }}
        stickyHeaderIndices={[1]}
      >
        {/* Category List */}
        {listData.length > 0 ? (
          <View style={styles.listWrapper}>
            <FlatList
              data={listData}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => (item?.id || item?._id || index).toString()}
              contentContainerStyle={styles.listContent}
              renderItem={renderItem}
              initialNumToRender={5}
              getItemLayout={(data, index) => ({
                length: wp('25%'),
                offset: wp('25%') * index,
                index,
              })}
            />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No categories available</Text>
          </View>
        )}

        {/* Sticky Filter Bar */}
        <View style={{ backgroundColor: '#fff', paddingBottom: 5 }}>
          <FilterBar />
        </View>

        {/* Main Content */}
        <ListViewTypesScreen subCategory={activeId} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.8%"),
    borderBottomColor: "#ddd",
    marginTop: hp(3),
  },
  topTitle: {
    fontSize: hp("1.7%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    marginTop: hp("0.5%"),
  },
  searchBox: {
    flex: 1,
    height: hp("5%"),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: hp("1%"),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("3%"),
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginRight: wp("2%"),
  },
  searchInput: {
    flex: 1,
    fontSize: hp("1.8%"),
    color: "#000",
    paddingVertical: 0,
  },
  micIcon: {
    width: wp("5%"),
    height: wp("5%"),
    resizeMode: "contain",
  },
  qrIcon: {
    width: wp("7%"),
    height: wp("7%"),
    resizeMode: "contain",
    marginLeft: wp("3%"),
  },
  listWrapper: {
    marginTop: hp("2%"),
    position: "relative",
    // paddingBottom: hp("0.3%"),
    paddingHorizontal: 10,
    borderBottomWidth: 1.5,
    borderColor: '#D9D9D9',
    paddingBottom: hp(1),
  },
  listContent: {
    paddingRight: 20
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: hp("1%"),
    backgroundColor: "#fff",
    position: "relative",
    paddingHorizontal: 10,
    width: wp("25%"),
    marginBottom: -2,
    zIndex: 9999

  },
  activeCardContainer: {
    backgroundColor: "white",
    elevation: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 2,
    borderColor: "#eee",
  },
  imageWrapper: {
    width: wp("17%"),
    height: wp("17%"),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "85%",
    height: "85%",
    borderRadius: wp("8.5%"),
  },
  cardText: {
    marginTop: hp("0.8%"),
    fontSize: hp("1.4%"),
    color: "#555",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  activeCardText: {
    color: "#000",
    fontWeight: "600",
  },
  activeBottomLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: hp("0.5%"),
    backgroundColor: "#6C63FF",
    borderTopLeftRadius: hp("2%"),
    borderTopRightRadius: hp("2%"),
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
