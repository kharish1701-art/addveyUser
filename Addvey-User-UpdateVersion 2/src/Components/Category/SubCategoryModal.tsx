// import React from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     ScrollView,
//     StyleSheet,
//     Image,
//     Modal,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { IMAGE_BASE_URL } from "../../api/authApi/BaseUrl";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getApi } from "../../api/getApi/getApi";
// import { EndPoints } from "../../services/EndPoints";

// interface SubCategoryModalProps {
//     visible: boolean;
//     onClose: () => void;
//     category: any;
//     subCategories: any[];
//     navigation: any;
// }

// const SubCategoryModal: React.FC<SubCategoryModalProps> = ({
//     visible,
//     onClose,
//     category,
//     subCategories,
//     navigation,
// }) => {
//     const getImageSource = (icon: string | any) => {
//         if (typeof icon === "string") {
//             const imageUrl = icon.startsWith("http")
//                 ? icon
//                 : `${IMAGE_BASE_URL}${icon}`;
//             return { uri: imageUrl };
//         }
//         return icon;
//     };

// //     const fetchSuperSubCategories = async (id) => {
// //     try {
// //       const token = await AsyncStorage.getItem("authToken");
// //       const res = await getApi(
// //         `${EndPoints?.getSuperSubCategories}${id ? id : selectedSubTab?.id}`,
// //         setLoading,
// //         token
// //       );

// //       if (res?.success) {
// //         setSuperSubCategory(res?.data?.data);
// //       } else {
// //         console.warn("⚠️ Failed to fetch super sub-categories:", res.message);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching super sub-categories:", err);
// //     }
// //   };

//     return (
//         <Modal
//             visible={visible}
//             animationType="slide"
//             transparent={true}
//             onRequestClose={onClose}
//         >
//             <View style={styles.backdrop}>
//                 <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} activeOpacity={1} />
//                 <View style={styles.container}>
//                     {/* Header */}
//                     <View style={styles.header}>
//                         <Text style={styles.headerTitle}>
//                             {category?.name || "Subcategories"}
//                         </Text>
//                         <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//                             <Ionicons name="close" size={wp(6)} color="#000" />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Content */}
//                     <ScrollView
//                         showsVerticalScrollIndicator={false}
//                         contentContainerStyle={styles.scrollContent}
//                     >
//                         <View style={styles.gridContainer}>
//                             {subCategories.map((sub: any) => (
//                                 <TouchableOpacity
//                                     key={sub.id || sub._id}
//                                     style={styles.subCategoryItem}
//                                     onPress={() => {
//                                         onClose();
//                                         navigation.navigate("ListView", {
//                                             subcategory: sub,
//                                             category: category,
//                                             parentCategory: category,
//                                         });
//                                     }}
//                                 >
//                                     <View style={styles.subCategoryImg}>
//                                         <Image
//                                             source={getImageSource(sub.image)}
//                                             style={styles.subCategoryIcon}
//                                         />
//                                     </View>
//                                     <Text style={styles.subCategoryText} numberOfLines={2}>
//                                         {sub.name}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     </ScrollView>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     backdrop: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         justifyContent: "flex-end",
//     },
//     backdropTouchable: {
//         flex: 1,
//     },
//     container: {
//         backgroundColor: "#fff",
//         borderTopLeftRadius: wp(5),
//         borderTopRightRadius: wp(5),
//         height: hp(60),
//         width: "100%",
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: wp(4),
//         paddingVertical: hp(2),
//         borderBottomWidth: 1,
//         borderBottomColor: "#f0f0f0",
//     },
//     headerTitle: {
//         fontSize: wp(4.5),
//         fontWeight: "600",
//         color: "#000",
//         fontFamily: "Poppins-Medium",
//     },
//     closeButton: {
//         padding: wp(1),
//         position: "absolute",
//         right: wp(4),
//         top: -40,
//         backgroundColor:"white",
//         borderRadius:40
//     },
//     scrollContent: {
//         padding: wp(4),
//         paddingBottom: hp(5),
//     },
//     gridContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "flex-start",
//     },
//     subCategoryItem: {
//         width: "25%",
//         alignItems: "center",
//         marginBottom: hp(2),
//         paddingHorizontal: 2,
//     },
//     subCategoryImg: {
//         borderColor: "#eee",
//         borderWidth: 1,
//         borderRadius: 12,
//         marginBottom: 8,
//         padding: 8,
//         backgroundColor: "#fff",
//     },
//     subCategoryIcon: {
//         width: wp(10),
//         height: wp(10),
//         resizeMode: "contain",
//     },
//     subCategoryText: {
//         fontSize: wp(2.8),
//         textAlign: "center",
//         color: "#333",
//         fontFamily: "Poppins-Regular",
//     },
// });

// export default SubCategoryModal;


import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LoadingModal from "../../Components/Loader";
import { EndPoints } from "../../services/EndPoints";
import useQueryApi from "../../services/queries/useQueryApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Base_URL } from "../../services/mutations";
import { Ionicons } from "@expo/vector-icons";

interface SubCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  categoryId?: string;
  type?: string;
  categoryData?: any; // Optional: If you want to pass data directly
}

const SubCategoryModal: React.FC<SubCategoryModalProps> = ({
  visible,
  onClose,
  categoryId,
  type,
  categoryData
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const navigation = useNavigation<any>();

  const getToken = useCallback(async () => {
    try {
      const userToken = await AsyncStorage.getItem("authToken");
      setToken(userToken || "");
      setReady(true);
    } catch (error) {
      console.error("Error getting token:", error);
      setToken("");
      setReady(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        getToken();
      }
    }, [getToken, token])
  );

  const validId = categoryId && categoryId !== "undefined" && categoryId !== "null";
  const apiUrl = validId ? `${EndPoints.getSubCategories}${categoryId}&getAllSuperSubCategories=true` : "";
  const queryEnabled = ready && !!token && !!validId;

  const {
    data: subcategoryData,
    isLoading: isSubLoading,
    isError: isSubError,
    refetch: refetchSubcategories,
  } = useQueryApi(
    ["getSubcategoryDetails", categoryId, token],
    apiUrl,
    token || "",
    {},
    queryEnabled,
    false,
    { lang: "en" }
  );

  // Use passed data or fetched data
  const dataToUse = categoryData || subcategoryData?.data?.data;
  const parentCategory = dataToUse?.[0]?.parentCategory;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemPress = (item: any, subCategory: any) => {
    onClose(); // Close modal first

    if (type === "Map") {
      navigation.navigate("MainMap", {
        item: item,
        category: subCategory?.parentCategory,
        subCategory: subCategory,
        superSubCategory: subCategory?.superSubCategories
      });
    } else {
      navigation.navigate("ListView", {
        subcategory: subCategory,
        category: subCategory?.parentCategory,
        parentCategory: subCategory?.parentCategory,
        subcategories: dataToUse,
      });
    }
  };

  const renderSubCategorySection = (subCategory: any) => {
    const isExpanded = expandedSections[subCategory.id] ?? true;
    const items = subCategory.superSubCategories || [];
    if (items.length === 0) return null;

    const visibleItems = isExpanded ? items : items.slice(0, 8);

    return (
      <View key={subCategory.id} style={styles.sectionContainer}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <View style={styles.sectionIconWrapper}>
            <Image
              source={{ uri: Base_URL + subCategory?.image }}
              style={styles.sectionIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.sectionTitle}>{subCategory.name}</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* Grid Items */}
        <View style={styles.gridContainer}>
          {visibleItems.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => handleItemPress(item, subCategory)}
            >
              <View style={styles.gridIconWrapper}>
                <Image
                  source={{ uri: Base_URL + item?.image }}
                  style={styles.gridImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.gridText} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          ))}

          {/* View Less/More Button */}
          {items.length > 8 && (
            <TouchableOpacity
              onPress={() => toggleSection(subCategory.id)}
              style={styles.gridItem}
            >
              <View style={[styles.gridIconWrapper, styles.viewMoreWrapper]}>
                <Ionicons
                  name={isExpanded ? "arrow-up" : "arrow-down"}
                  size={20}
                  color="#6C63FF"
                />
              </View>
              <Text style={styles.gridText}>{isExpanded ? "View less" : "View more"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sub Categories</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Modal Content */}
          <View style={styles.modalContent}>
            {isSubLoading && !categoryData && <LoadingModal />}
            
            {isSubError && !categoryData && (
              <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error loading subcategories.</Text>
                <TouchableOpacity onPress={() => refetchSubcategories()} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Main Category Header */}
            {parentCategory && (
              <View style={styles.categoryHeader}>
                <Image
                  source={
                    parentCategory?.image
                      ? { uri: Base_URL + parentCategory.image }
                      : require("../../../assets/images/car.png")
                  }
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryTitle}>{parentCategory.name}</Text>
              </View>
            )}

            {/* Sub Categories List */}
            {dataToUse && dataToUse.length > 0 ? (
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {dataToUse.map((subCategory: any) => renderSubCategorySection(subCategory))}
              </ScrollView>
            ) : (
              !isSubLoading && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="folder-open-outline" size={60} color="#ccc" />
                  <Text style={styles.emptyText}>No subcategories found</Text>
                </View>
              )
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SubCategoryModal;

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: Dimensions.get('window').height * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  },

  // Content Styles
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  errorText: {
    fontSize: wp('4%'),
    fontFamily: "Poppins-Medium",
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontFamily: "Poppins-Medium",
    fontSize: wp('3.5%'),
  },

  // Category Header
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  categoryIcon: {
    width: wp(10),
    height: wp(10),
    resizeMode: "contain",
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: wp('5%'),
    fontFamily: "Poppins-Bold",
    color: '#000',
    flex: 1,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('10%'),
  },

  // Section Styles
  sectionContainer: {
    marginBottom: hp('4%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionIconWrapper: {
    marginHorizontal: 10,
    padding: 5,
  },
  sectionIcon: {
    width: wp(6),
    height: wp(6),
  },
  sectionTitle: {
    fontSize: wp('4.2%'),
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginHorizontal: 5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },

  // Grid Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23%',
    marginBottom: hp('2.5%'),
    alignItems: 'center',
  },
  gridIconWrapper: {
    width: wp('14%'),
    height: wp('14%'),
    borderColor: "#E0E0E0",
    borderWidth: 0.8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  gridImage: {
    width: "65%",
    height: "65%",
  },
  gridText: {
    fontSize: wp('3%'),
    fontFamily: "Poppins-Medium",
    textAlign: 'center',
    color: "#444",
    lineHeight: 16,
  },
  viewMoreWrapper: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontFamily: "Poppins-Medium",
    color: '#999',
    marginTop: 15,
  },
});