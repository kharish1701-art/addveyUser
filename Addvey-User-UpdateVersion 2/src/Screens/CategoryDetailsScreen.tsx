import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LoadingModal from "../Components/Loader";
import { EndPoints } from "../services/EndPoints";
import useQueryApi from "../services/queries/useQueryApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Base_URL } from "../services/mutations";
import { Ionicons } from "@expo/vector-icons";

interface CategoryDetailsScreenProps {
  id?: string;
  type?: string;
  onClose?: () => void;
}

const CategoryDetailsScreen: React.FC<CategoryDetailsScreenProps> = (props) => {
  const route = useRoute<any>();
  const id = props.id || route.params?.id;
  const type = props.type || route.params?.type;
  const onClose = props.onClose;

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

  const validId = id && id !== "undefined" && id !== "null";
  const apiUrl = validId ? `${EndPoints.getSubCategories}${id}&getAllSuperSubCategories=true` : "";
  const queryEnabled = ready && !!token && !!validId;

  const {
    data: subcatgoryData,
    isLoading: isSubLoading,
    isError: isSubError,
    refetch: refetchSubcategories,
  } = useQueryApi(
    ["getSubcategoryDetails", id, token],
    apiUrl,
    token || "",
    {},
    queryEnabled,
    false,
    { lang: "en" }
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemPress = (item: any, subCategory: any) => {
    if (onClose) onClose();

    if (type == "Map") {
      navigation.navigate("MainMap", {
        item: item, // This is the super sub category
        category: subCategory?.parentCategory,
        subCategory: subCategory,
        superSubCategory: subCategory?.superSubCategories
      });
    } else {
      console.log("subCategory", subCategory)
      navigation.navigate("ListView", {
        subcategory: subCategory, // The subcategory (e.g. Bikes)
        category: subCategory?.parentCategory,
        parentCategory: subCategory?.parentCategory,
        subcategories: (subcatgoryData as any)?.data?.data,

      });
    }
  };

  const renderSubCategorySection = (subCategory: any) => {
    const isExpanded = expandedSections[subCategory.id] ?? true;

    // Safety check for superSubCategories
    const items = subCategory.superSubCategories || [];
    if (items.length === 0) return null;

    const visibleItems = isExpanded ? items : items.slice(0, 8); // Show 8 items when collapsed

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

          {/* View Less / More Button */}
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
    <View style={styles.container}>
      {isSubLoading && <LoadingModal />}
      {isSubError && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading details.</Text>
          <TouchableOpacity onPress={() => refetchSubcategories()} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Category Header */}
      {!isSubLoading && !isSubError && subcatgoryData?.data?.data?.length > 0 && (
        <View style={styles.topHeading}>
          <Image
            source={
              subcatgoryData?.data?.data[0].parentCategory?.image
                ? { uri: Base_URL + subcatgoryData?.data?.data[0].parentCategory?.image }
                : require("../../assets/images/car.png")
            }
            style={styles.topIcon}
          />
          <Text style={styles.topHeadingText}>
            {subcatgoryData?.data?.data[0].parentCategory?.name}
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {subcatgoryData?.data?.data?.map((subCategory: any) => renderSubCategorySection(subCategory))}
      </ScrollView>

      {/* Close Button if opened as modal */}
      {/* {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default CategoryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: wp("4%"),
  },
  centerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  errorText: {
    marginBottom: 10,
    fontFamily: "Poppins-Medium",
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontFamily: "Poppins-Medium",
  },
  topHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1.5%"),
    marginBottom: hp("2%"),
  },
  topIcon: {
    width: wp(12),
    height: wp(12),
    resizeMode: "contain",
  },
  topHeadingText: {
    fontSize: wp("5%"),
    marginLeft: 10,
    fontFamily: "Poppins-Bold",
    color: '#000',
  },
  scrollContent: {
    paddingBottom: hp("5%"),
  },
  sectionContainer: {
    marginBottom: hp("3%"),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp("2%"),
  },
  sectionIconWrapper: {
    marginHorizontal: 8,
  },
  sectionIcon: {
    width: wp(6),
    height: wp(6),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontFamily: "Poppins-Bold",
    color: "#000",
  },
  sectionLine: {
    flex: 1,
    height: 1.5, // Thicker line like in image? Or faint? Image looks thin but visible.
    backgroundColor: "#E0E0E0", // Or slightly darker #F0F0F0
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: wp("2%"), // Removed generally to use flex-start with margin logic for perfect 4 columns
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: "25%", // Perfect 4 columns
    marginBottom: hp("3%"),
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  gridIconWrapper: {
    width: wp("15%"),
    height: wp("15%"),
    borderColor: "#E0E0E0",
    borderWidth: 0.4,
    // backgroundColor: "#F5F5F5",
    borderRadius: 14, // Slightly rounder
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridImage: {
    width: "60%",
    height: "60%",
  },
  gridText: {
    fontSize: wp("3%"),
    fontFamily: "Poppins-Medium",
    textAlign: 'center',
    color: "#333",
  },
  viewMoreWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 50, // Circle
  },
  closeButton: {
    position: 'absolute',
    top: hp('1.5%'),
    right: wp('4%'),
    zIndex: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
  },
});
