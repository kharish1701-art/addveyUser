import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SubCategoryModal from "../Components/Category/SubCategoryModal";
import { apiHelper } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  buildImageSource,
  NO_IMAGE_PLACEHOLDER,
} from "../utils/imageFallback";

// Fallback local images

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  categories: any[];
  activeCategory: any;
  onCategorySelect: (item: any) => void;
  subCategory: any[];
  selectedSubTab: any;
  onSubCategorySelect: (tab: any) => void;
  superSubCategory: any[];
  onSuperSubCategorySelect: (bhk: any) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  categories,
  activeCategory,
  onCategorySelect,
  subCategory: initialSubCategory, // Prop renamed to avoid conflict, though we mostly use fetched ones
  selectedSubTab,
  onSubCategorySelect,
  superSubCategory,
  onSuperSubCategorySelect,
}) => {
  const navigation = useNavigation<any>();

  // Expansion State
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [subCategoriesState, setSubCategoriesState] = useState<{
    [key: string]: any[];
  }>({});
  const [subCategoryLoading, setSubCategoryLoading] = useState<{
    [key: string]: boolean;
  }>({});

  // View More Modal State
  const [viewMoreVisible, setViewMoreVisible] = useState(false);
  const [selectedId, setsetSelectedCatId] = useState("");
  const [selectedViewMoreCategory, setSelectedViewMoreCategory] =
    useState<any>(null);

  const handleViewMore = (category: any) => {
    console.log('------ view more click ', category.id)
    // fetchSubCategories(category.id)
    // return;
    setsetSelectedCatId( category.id)
    setSelectedViewMoreCategory(category);
    setViewMoreVisible(true);
  };

  const getImageSource = (icon: string | any) => {
    if (typeof icon === "string") {
      return buildImageSource(icon);
    } else if (icon && typeof icon === "object") {
      return icon;
    } else {
      return NO_IMAGE_PLACEHOLDER;
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    console.log('----- id ', subCategoriesState[categoryId])
    if (subCategoriesState[categoryId]) return;

    setSubCategoryLoading((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await apiHelper(
        `${EndPoints.getSubCategories}${categoryId}`,
        {
          method: "GET",
          token,
        }
      );

      console.log('--- subcategory ',res.data?.data )

      if (res?.success) {
        setSubCategoriesState((prev) => ({
          ...prev,
          [categoryId]: res.data?.data || [],
        }));
      } else {
        setSubCategoriesState((prev) => ({ ...prev, [categoryId]: [] }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setSubCategoryLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const toggleCategory = (id: string) => {
    const isCurrentlyExpanded = expandedCategory === id;
    setExpandedCategory(isCurrentlyExpanded ? null : id);

    if (!isCurrentlyExpanded) {
      fetchSubCategories(id);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.backdrop}>
        <TouchableOpacity
          style={modalStyles.backdropTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={modalStyles.recentHeader}>
            <Text style={modalStyles.headerTitle}>Categories</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Ionicons name="close" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.scrollContainer}
            contentContainerStyle={{ paddingBottom: hp(5) }}
            showsVerticalScrollIndicator={false}
          >
            {/* Main Categories with Nested Subcategories */}
            <View style={[modalStyles.section, { marginTop: 0 }]}>
              <View style={modalStyles.categoriesList}>
                {categories.map((item) => {
                  const isExpanded = expandedCategory === item.id;

                  return (
                    <View key={item.id} style={modalStyles.categoryWrapper}>
                      <View style={modalStyles.categoryRowContainer}>
                        {/* Left side: Select/Navigate */}
                        <TouchableOpacity
                          style={modalStyles.categoryLeftTouchable}
                          onPress={() => onCategorySelect(item)}
                        >
                          <Image
                            source={getImageSource(item.image)}
                            style={modalStyles.categoryRowImage}
                          />
                          <Text style={modalStyles.categoryRowText}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>

                        {/* Right side: Expand */}
                        <TouchableOpacity
                          style={modalStyles.plusIconContainer}
                          onPress={() => toggleCategory(item.id)}
                        >
                          <Ionicons
                            name={isExpanded ? "remove" : "add"}
                            size={14}
                            color="#6E533F"
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Nested Subcategories */}
                      {isExpanded && (
                        <View style={modalStyles.subCategoryContainer}>
                          {subCategoryLoading[item.id] ? (
                            <View style={modalStyles.loadingContainer}>
                              <ActivityIndicator size="small" color="#6C63FF" />
                              <Text style={modalStyles.loadingText}>
                                Loading...
                              </Text>
                            </View>
                          ) : (
                            <>
                              {(subCategoriesState[item.id] || []).map(
                                (sub: any) => (
                                  <TouchableOpacity
                                    key={sub.id || sub._id}
                                    style={modalStyles.subCategoryItem}
                                    onPress={() => {
                                      onClose(); // Close modal
                                      navigation.navigate("ListView", {
                                        subcategory: sub,
                                        category: item,
                                        parentCategory: item,
                                      });
                                    }}
                                  >
                                    <View style={modalStyles.subCategoryImg}>
                                      <Image
                                        source={getImageSource(sub.image)}
                                        style={modalStyles.subCategoryIcon}
                                      />
                                    </View>
                                    <Text
                                      style={modalStyles.subCategoryText}
                                      numberOfLines={2}
                                    >
                                      {sub.name}
                                    </Text>
                                  </TouchableOpacity>
                                )
                              )}

                              {/* View More - Navigates to full category view */}
                              {(subCategoriesState[item.id] || []).length >
                                0 && (
                                <TouchableOpacity
                                  activeOpacity={0.7}
                                  style={modalStyles.subCategoryItem}
                                  onPress={() => handleViewMore(item)}
                                >
                                  <View
                                    style={modalStyles.subCategoryImgBottom}
                                  >
                                    <FontAwesome5
                                      name="arrow-right"
                                      size={16}
                                      color="#6C63FF"
                                    />
                                  </View>
                                  <Text style={modalStyles.subCategoryText}>
                                    View All
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Super Sub Categories (Types) - Keeping this for compatibility */}
            {/*{superSubCategory && superSubCategory.length > 0 && (*/}
            {/*  <View style={modalStyles.section}>*/}
            {/*    <View style={modalStyles.sectionHeader}>*/}
            {/*      <Text style={modalStyles.sectionTitle}>Types</Text>*/}
            {/*    </View>*/}
            {/*    <ScrollView*/}
            {/*      horizontal*/}
            {/*      showsHorizontalScrollIndicator={false}*/}
            {/*      contentContainerStyle={modalStyles.propertyTabs}*/}
            {/*    >*/}
            {/*      {superSubCategory.map((bhk) => (*/}
            {/*        <TouchableOpacity*/}
            {/*          key={bhk.id}*/}
            {/*          style={modalStyles.bhkItem}*/}
            {/*          onPress={() => onSuperSubCategorySelect(bhk)}*/}
            {/*        >*/}
            {/*          <Image*/}
            {/*            source={{ uri: IMAGE_BASE_URL + bhk.image }}*/}
            {/*            style={modalStyles.bhkImage}*/}
            {/*          />*/}
            {/*          <Text style={modalStyles.bhkText}>{bhk.name}</Text>*/}
            {/*        </TouchableOpacity>*/}
            {/*      ))}*/}
            {/*    </ScrollView>*/}
            {/*  </View>*/}
            {/*)}*/}
          </ScrollView>
        </View>
      </View>
      {/* <SubCategoryModal
        visible={viewMoreVisible}
        onClose={() => setViewMoreVisible(false)}
        category={selectedViewMoreCategory}
        subCategories={
          selectedViewMoreCategory
            ? subCategoriesState[selectedViewMoreCategory.id] || []
            : []
        }
        navigation={navigation}
      /> */}
       <SubCategoryModal
        visible={viewMoreVisible}
        onClose={() => setViewMoreVisible(false)}
        categoryId={selectedId}
        type="ListView" // or "Map"
      />
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdropTouchable: {
    flex: 1,
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    height: hp(75), // Increased height for better view
    width: "100%",
    paddingTop: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    width: 32,
    height: 32,
    position: "absolute",
    top: -40,
    right: wp(3),
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  section: {
    marginVertical: hp(1),
  },
  sectionHeader: {
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
  },
  sectionTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#000",
  },
  categoriesList: {
    paddingHorizontal: wp(4),
  },
  // New Styles
  categoryWrapper: {
    marginBottom: hp(1),
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    paddingBottom: hp(1),
  },
  categoryRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryLeftTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: hp(1),
  },
  categoryRowImage: {
    width: wp(10),
    height: wp(10),
    resizeMode: "contain",
    marginRight: wp(4),
  },
  categoryRowText: {
    fontSize: wp(4),
    color: "#000",
    fontWeight: "500",
    marginRight: wp(2),
  },
  plusIconContainer: {
    width: wp(6), // Slightly larger
    height: wp(6),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  subCategoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp("1%"),
    paddingLeft: wp(2),
  },
  subCategoryItem: {
    width: "25%",
    alignItems: "center",
    marginVertical: hp("1%"),
    paddingHorizontal: 2,
  },
  subCategoryIcon: {
    width: wp("10%"),
    height: wp("10%"),
    resizeMode: "contain",
    marginBottom: hp("0.5%"),
  },
  subCategoryText: {
    fontSize: wp("2.6%"),
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  subCategoryImg: {
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 10,
    marginBottom: 5,
    padding: 5,
  },
  subCategoryImgBottom: {
    borderColor: "transparent",
    borderWidth: 0,
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  loadingContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("2%"),
  },
  loadingText: {
    marginLeft: wp("2%"),
    fontSize: wp("3%"),
    color: "#6C63FF",
    fontFamily: "Poppins-Regular",
  },

  // --- PATCHED STYLES ---
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  recentSection: {
    marginTop: 8,
  },

  // Existing Styles for Super Sub
  propertyTabs: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
  },
  bhkItem: {
    width: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    height: hp(14),
    marginHorizontal: wp(1),
  },
  bhkImage: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(2),
    resizeMode: "contain",
    marginTop: hp(1),
    marginBottom: hp(0.5),
  },
  bhkText: {
    fontSize: wp(3),
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 4,
  },
});

export default CategoryModal;
