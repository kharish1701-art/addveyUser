import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    StatusBar
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import MainHomeCard from "../Components/Home/MainHomeCard";
import useQueryApi from "../services/queries/useQueryApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { EndPoints } from "../services/EndPoints";
import { SafeAreaView } from "react-native-safe-area-context";

const MainInsightScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Under review");
    const [activeFilter, setActiveFilter] = useState("All");

    
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false); // 👈 to control when to start query

  useEffect(() => {
    getToken();
  }, []);

  useFocusEffect(
  useCallback(() => {
    getToken(); // 👈 runs every time screen is focused
  }, [])
);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setToken(userToken || "");
    // console.log(token)
    setReady(true); // 👈 only start query when token is ready
  };

  const {
    data: productData,
    isLoading: isproductLoading,
    isError: isproductError,
    error: productError,
    refetch: refetchproduct,
  } = useQueryApi(
    ["getproductdata"],
    `${EndPoints.getProduct}`,
    token,
    {},
    !!token && ready, // 👈 only enable when token is available
    false,
    { lang: "en" }
  );
  console.log(productData?.data?.data)


    /** Tabs Content Components */
    const ActiveTab = () => (
        <View>
            <Text style={styles.sectionTitle}>Active Ads</Text>
            <Text style={{ textAlign: "center", color: "#999" }}>
                No active ads found
            </Text>
        </View>
    );

    const ExpiredTab = () => (
        <View>
            <Text style={styles.sectionTitle}>Expired Ads</Text>
            <Text style={{ textAlign: "center", color: "#999" }}>
                No expired ads
            </Text>
        </View>
    );

    const DeactivatedTab = () => (
        <View>
            <Text style={styles.sectionTitle}>Deactivated Ads</Text>
            <Text style={{ textAlign: "center", color: "#999" }}>
                No deactivated ads
            </Text>
        </View>
    );

    const UnderReviewTab = () => (
        <View>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Ionicons
                    name="search"
                    size={20}
                    color="#999"
                    style={{ marginRight: 6 }}
                />
                <TextInput
                    placeholder="Search ads..."
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
            </View>

            {/* Filters */}
            <View style={styles.filtersRow}>
                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        activeFilter === "All" && styles.activeFilterBtn,
                    ]}
                    onPress={() => setActiveFilter("All")}
                >
                    <Image
                        source={require("../../assets/images/filter.png")}
                        style={{
                            width: wp(3.5),
                            height: hp(2),
                            resizeMode: "contain",
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        activeFilter === "Cars" && styles.activeFilterBtn,
                    ]}
                    onPress={() => setActiveFilter("Cars")}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === "Cars" && styles.activeFilterText,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        activeFilter === "Bikes" && styles.activeFilterBtn,
                    ]}
                    onPress={() => setActiveFilter("Bikes")}
                >
                    <View style={styles.squareBox} />
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === "Bikes" && styles.activeFilterText,
                        ]}
                    >
                        1 Vehicle
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Past three months */}
            <View style={styles.monthsSection}>
                <Text style={styles.monthsText}>Past three months</Text>
            </View>

            {/* Using card component */}
            {productData?.data?.data?.map((item)=>
            
            <MainHomeCard item={item}/>
            
            )}
        </View>
    );

   

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Header */}
           

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: wp(4),
                    paddingBottom: hp(10),
                }}
            >
                {/* Tabs */}
                {/* <View style={styles.tabs}>
                    {["Active", "Expired", "Deactivated", "Under review"].map(
                        (t, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.tabBtn}
                                onPress={() => setActiveTab(t)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === t && styles.activeText,
                                    ]}
                                >
                                    {t}
                                </Text>
                                {activeTab === t && (
                                    <View style={styles.activeIndicator} />
                                )}
                            </TouchableOpacity>
                        )
                    )}
                </View> */}
                {/* <UnderReviewTab /> */}

                {/* Tab Content */}
                {/* {renderTabContent()} */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default MainInsightScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    /** Header */
    header: {
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("1.5%"),
        marginTop: hp(6),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    locationContainer: { flexDirection: "row", alignItems: "center" },
    main: { backgroundColor: "#eee", padding: wp("1%"), borderRadius: wp("5%") },
    location: {
        fontSize: wp("3.5%"),
        fontWeight: "600",
        color: "black",
        marginRight: wp("1%"),
        fontFamily: "Poppins-Bold",
    },
    address: {
        fontSize: wp("2.8%"),
        color: "#6E533F",
        fontFamily: "Poppins-Regular",
    },
    rightIcons: { flexDirection: "row", alignItems: "center" },
    bellContainer: { marginRight: wp("3%") },
    badge: {
        position: "absolute",
        top: -hp("1%"),
        right: -wp("1%"),
        backgroundColor: "#6C63FF",
        borderRadius: wp("5%"),
        padding: 4,
    },
    badgeText: { color: "#fff", fontSize: wp("1.5%"), fontWeight: "700" },
    profileIcon: { width: wp("5%"), height: wp("5%"), borderRadius: wp("4%") },

    /** Tabs */
    tabs: {
        flexDirection: "row",
        marginTop: hp(1),
        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9",
        justifyContent: 'space-between'
    },
    tabBtn: {
        paddingVertical: hp(0.8),
    },
    tabText: {
        fontSize: hp(1.6),
        color: "#666",
    },
    activeText: {
        color: "#000000",
        fontWeight: "600",
    },
    activeIndicator: {
        position: "absolute",
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#6A5AE0",
        borderTopLeftRadius: wp(2),
        borderTopRightRadius: wp(2),
    },

    /** Search bar */
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        marginBottom: hp(2.5),
        marginTop: hp(2.5),
    },
    searchInput: { flex: 1, fontSize: hp(1.8), color: "#000" },

    /** Filters */
    filtersRow: { flexDirection: "row", marginBottom: hp(2) },
    filterBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(0.6),
        paddingHorizontal: wp(3),
        marginRight: wp(3),
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp(2),
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 2,
    },
    activeFilterBtn: {
        borderColor: "#6A5AE0",
        backgroundColor: "#fff",
    },
    filterText: { marginLeft: 0, fontSize: hp(1.5), color: "#00000099" },
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

    /** Section Title */
    sectionTitle: { fontSize: hp(1.8), color: "#666", marginBottom: hp(1) },
});
