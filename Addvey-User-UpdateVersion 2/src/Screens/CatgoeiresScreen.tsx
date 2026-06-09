// CategoriesScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Image,
    Animated,
    Easing,
    StatusBar,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import CategoryDetailsScreen from "./CategoryDetailsScreen";
import LoadingModal from "../Components/Loader";
import { Category, SubCategory, useCategory } from "../context/CategoryContext";
import SuggestScreen from "../Components/Category/SuggestProductScreen";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { apiHelper } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { EndPoints } from "../services/EndPoints";

// Fallback local images
const FALLBACK_IMAGES = {
    default: require("../../assets/images/apart.png"),
    apartments: require("../../assets/images/apart.png"),
    houses: require("../../assets/images/catcar.png"),
    commercial: require("../../assets/images/catcar.png"),
    shared: require("../../assets/images/catcar.png"),
    farmhouses: require("../../assets/images/catcar.png"),
};

const CategoriesScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [detailSubVisible, setDetailsSubVisible] = useState(false);
    const [suggestVisible, setSuggestVisible] = useState(false);
    // const { loading } = useCategory();
    const [loading, setLoading] = useState(false);
    const [subCategories, setSubCategories] = useState<{ [key: string]: any[] }>({});
    const [subCategoryLoading, setSubCategoryLoading] = useState<{ [key: string]: boolean }>({});

    const fetchMainCategories = async () => {
        console.log("✅ Fetching categories...");
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem("authToken");

            const res = await apiHelper(
                "/main-categories/view-all?page=1&limit=100&isActive=true",
                {
                    method: "GET",
                    token,
                }
            );

            console.log("✅ API response", res);

            if (res?.success) {
                console.log("✅ Categories:", JSON.stringify(res.data?.data));
                setCategories(res.data?.data);
            } else {
                console.warn("⚠️ Failed to fetch:", res.message);
            }
            setLoading(false);
        } catch (error) {
            console.error("❌ Error fetching categories:", JSON.stringify(error));
            setLoading(false);
        }

    };

    useFocusEffect(
        React.useCallback(() => {
            fetchMainCategories();
        }, [])
    );

    // Fetch subcategories for a specific category
    const fetchSubCategories = async (categoryId: string) => {
        // console.log("✅ Fetching subcategories for category:", categoryId);

        // If already loaded, don't fetch again
        if (subCategories[categoryId]) {
            // console.log("✅ Subcategories already loaded for:", categoryId);
            return;
        }

        setSubCategoryLoading(prev => ({ ...prev, [categoryId]: true }));

        const token = await AsyncStorage.getItem("authToken");

        const res = await apiHelper(
            `${EndPoints.getSubCategories}${categoryId}`,
            {
                method: "GET",
                token,
            }
        );

        // console.log(res, "✅ Subcategories API response");

        if (res?.success) {
            // console.log("✅ Subcategories:", JSON.stringify(res.data?.data));
            setSubCategories(prev => ({ ...prev, [categoryId]: res.data?.data || [] }));
        } else {
            // console.warn("⚠️ Failed to fetch subcategories:", res.message);
            setSubCategories(prev => ({ ...prev, [categoryId]: [] }));
        }
        setSubCategoryLoading(prev => ({ ...prev, [categoryId]: false }));
    };

    // console.log("categories",categories)
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const animatedSuggestHeight = useRef(new Animated.Value(0)).current;

    const toggleCategory = (id: string) => {
        const isCurrentlyExpanded = expandedCategory === id;
        setExpandedCategory(isCurrentlyExpanded ? null : id);

        // Fetch subcategories when expanding (not collapsing)
        if (!isCurrentlyExpanded) {
            fetchSubCategories(id);
        }
    };

    const openDetails = () => {
        console.log("OPEN DETAILS CLICKED. ExpandedCategory:", expandedCategory);
        closeDetails()
        setDetailsSubVisible(true)
        Animated.parallel([
            Animated.timing(animatedHeight, {
                toValue: hp("57%"),
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

    const closeSubDetails = () => {
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
        ]).start(() => setDetailsSubVisible(false));
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

    const openSuggest = () => {
        setSuggestVisible(true);
        Animated.parallel([
            Animated.timing(animatedSuggestHeight, {
                toValue: hp("50%"),
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
    const closeSuggest = () => {
        Animated.parallel([
            Animated.timing(animatedSuggestHeight, {
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
        ]).start(() => setSuggestVisible(false));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Topbar */}
            <View style={styles.topBar}>

                <View>
                    <Text style={styles.topBarTitle}>Categories</Text>
                    {/* <Text style={styles.topBarSubtitle}>Partner App</Text> */}
                </View>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: hp("12%"), marginTop: hp(5) }}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchMainCategories} colors={["#6C63FF"]} />
                }
            >
                {/* <Text style={styles.heading}>Select category</Text> */}

                {loading && <LoadingModal />}
                {categories?.length > 0 && categories?.map((category) => {
                    const isExpanded = expandedCategory === category.id;

                    return (
                        <View key={category.id} style={styles.categoryContainer}>
                            {/* Category Row */}
                            <TouchableOpacity
                                style={[
                                    styles.categoryRow,
                                    isExpanded && styles.activeCategoryRow,
                                ]}
                                onPress={() => {
                                    toggleCategory(category.id)
                                    console.log("category.id", category.id)
                                }}
                            >
                                <View style={styles.categoryIconWrapper}>
                                    <Image source={getImageSource(category.image)} style={styles.categoryIcon} />
                                </View>
                                <Text style={styles.categoryText}>{category.name}</Text>

                                <View style={styles.plusMinusContainer}>
                                    <Ionicons
                                        name={isExpanded ? "remove" : "add"}
                                        size={14}
                                        color="#6E533F"
                                    />
                                </View>

                                <View
                                    style={[
                                        styles.circularIndicator,
                                        isExpanded && styles.circularActive,
                                    ]}
                                />
                            </TouchableOpacity>

                            {/* Subcategories */}
                            {isExpanded && (
                                <View style={styles.subCategoryContainer}>
                                    {subCategoryLoading[category.id] ? (
                                        <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="small" color="#6C63FF" />
                                            <Text style={styles.loadingText}>Loading subcategories...</Text>
                                        </View>
                                    ) : (
                                        <>
                                            {(subCategories[category.id] || []).map((sub: any) => (
                                                <TouchableOpacity
                                                    key={sub.id || sub._id}
                                                    style={styles.subCategoryItem}
                                                    onPress={() => {
                                                        navigation.navigate("ListView", {
                                                            subcategory: sub,
                                                            category: category,
                                                            parentCategory: category,
                                                            subcategories: subCategories[category.id]
                                                        });

                                                    }}
                                                >
                                                    <View style={styles.subCategoryImg}>
                                                        <Image
                                                            source={getImageSource(sub.image)}
                                                            style={styles.subCategoryIcon}
                                                        />
                                                    </View>
                                                    <Text style={styles.subCategoryText}>{sub.name}</Text>
                                                </TouchableOpacity>
                                            ))}

                                            {/* View More Item */}
                                            {(subCategories[category.id] || []).length > 0 && (
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={styles.subCategoryItem}
                                                    onPress={openDetails}
                                                >
                                                    <View style={styles.subCategoryImgBottom}>
                                                        <FontAwesome5 name="arrow-up" size={20} color="#6C63FF" />
                                                    </View>
                                                    <Text style={styles.subCategoryText}>View More</Text>
                                                </TouchableOpacity>
                                            )}
                                        </>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}

                {/* Suggest Section */}

            </ScrollView>

            {/* Bottom Fixed Button */}


            {/* Overlay */}
            {(detailsVisible || suggestVisible || detailSubVisible) && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        styles.overlay,
                        { opacity: overlayOpacity },
                    ]}
                />
            )}

            {/* Close Icon */}
            {/* {detailsVisible && (
                <TouchableOpacity style={styles.closeIcon} onPress={closeDetails}>
                    <Ionicons name="close" size={22} color="#000" />
                </TouchableOpacity>
            )} */}
            {suggestVisible && (
                <TouchableOpacity style={styles.suggestCloseIcon} onPress={closeSuggest}>
                    <Ionicons name="close" size={22} color="#000" />
                </TouchableOpacity>
            )}


            {/* Bottom Sheet: Category Details */}


            {/* Bottom Sheet: Suggest Screen */}
            <Animated.View style={[styles.bottomSheet, { height: animatedSuggestHeight }]}>
                <SuggestScreen />
            </Animated.View>

            {detailSubVisible && <TouchableOpacity style={styles.closeIconSub} onPress={closeSubDetails}>
                <Ionicons name="close" size={22} color="#000" />
            </TouchableOpacity>}
            {detailSubVisible && (
                <View>

                    <Animated.View style={{
                        height: animatedHeight,
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
                    }}>


                        {/* DEBUG LOG */}
                        <CategoryDetailsScreen id={expandedCategory || undefined} onClose={closeSubDetails} />
                    </Animated.View>
                </View>
            )}

        </SafeAreaView>
    );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp("2%"),
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: wp(4),
        // marginTop: hp(2),
    },
    topBarImage: {
        width: wp(10),
        height: wp(10),
        resizeMode: "contain",
        marginHorizontal: wp(2),
    },
    topBarTitle: { fontSize: wp("4.2%"), fontFamily: "Poppins-Medium" },
    topBarSubtitle: {
        fontSize: wp("2.2%"),
        color: "#6E533F",
        fontFamily: "Poppins-Regular",
    },
    scrollContainer: { marginTop: hp("5%") },
    heading: {
        fontSize: wp("5%"),
        marginBottom: hp("2%"),
        paddingHorizontal: wp(6),
        color: "#000000",
        fontFamily: "Poppins-Medium",
    },
    categoryContainer: { marginBottom: hp("2%"), paddingHorizontal: wp(6) },
    categoryRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp("1%"),
    },
    activeCategoryRow: { borderColor: "#6C63FF" },
    categoryIconWrapper: {
        width: wp("11%"),
        height: wp("11%"),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
        marginRight: wp("3%"),
        padding: 5,
        backgroundColor: "#fff"
    },
    categoryIcon: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    categoryText: {
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Medium",
        color: "#000000",
    },
    plusMinusContainer: {
        backgroundColor: "white",
        borderColor: "#eee",
        borderWidth: 1,
        borderRadius: 10,
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: wp(3),
    },
    circularIndicator: {
        width: wp(4),
        height: wp(4),
        borderRadius: wp(3),
        borderWidth: 1,
        borderColor: "#0000008A",
        marginLeft: "auto",
    },
    circularActive: {
        borderColor: "#6C63FF",
        borderWidth: 4,
    },
    subCategoryContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: hp("1%") },
    subCategoryItem: { width: "25%", alignItems: "center", marginVertical: hp("1%") },
    subCategoryIcon: {
        width: wp("12%"),
        height: wp("12%"),
        resizeMode: "contain",
        marginBottom: hp("0.5%"),
    },
    subCategoryText: {
        fontSize: wp("2.6%"),
        textAlign: "center",
        fontFamily: "Poppins-Regular",
    },
    subCategoryImg: {
        borderColor: "#eee",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
    },
    subCategoryImgBottom: {
        borderColor: "#eee",
        borderWidth: 1,
        width: wp("12%"),
        height: wp("12%"),
        borderRadius: wp("6%"),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    sectionContainer: {
        backgroundColor: "#D9D9D940",
        paddingVertical: hp("3%"),
        paddingHorizontal: wp("5%"),
        borderRadius: 12,
        marginVertical: hp("10%"),
    },
    title: {
        fontSize: wp("6%"),
        fontFamily: "Poppins-Bold",
        color: "#00000099",
        flexWrap: "wrap",
    },
    inlineIcon: { width: wp("6%"), height: wp("6%"), resizeMode: "contain" },
    subTitle: {
        fontSize: wp("3.3%"),
        fontFamily: "Poppins-Regular",
        color: "#555555",
        marginVertical: hp("1%"),
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: "#6C63FF",
        borderRadius: 14,
        paddingVertical: hp("1.5%"),
        width: "50%",
        alignItems: "center",
        marginTop: hp(1),
    },
    outlineButtonText: {
        color: "#6C63FF",
        fontSize: wp("3.8%"),
        fontFamily: "Poppins-Medium",
    },
    bottomButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: wp("4%"),
        backgroundColor: "#fff",
        zIndex: 20,
    },
    confirmButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.5%"),
        borderRadius: 15,
        alignItems: "center",
    },
    confirmButtonText: { color: "#fff", fontSize: wp("4%"), fontFamily: "Poppins-Medium" },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "black",
        zIndex: 99,
        elevation: 99,
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
        top: hp(4),
        right: 15,
        zIndex: 101,
        padding: 5,
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    closeIconSub: {
        position: "absolute",
        top: hp(8),
        right: 15,
        zIndex: 101,
        padding: 5,
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    suggestCloseIcon: {
        position: "absolute",
        top: hp(44),
        right: 10,
        zIndex: 101,
        padding: 6,
        backgroundColor: "#fff",
        borderRadius: 20,
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
});
