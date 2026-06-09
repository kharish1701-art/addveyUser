// screens/Advertisements.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import MainHomeCard from "../Components/Home/MainHomeCard";

const Advertisements: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"create" | "track">("create");

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <Ionicons name="arrow-back" size={wp("5%")} color="#000" />
                    <Text style={styles.topBarText}>Advertisements</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "create" && styles.activeTab]}
                    onPress={() => setActiveTab("create")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "create" && styles.activeTabText,
                        ]}
                    >
                        Create Ad
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === "track" && styles.activeTab]}
                    onPress={() => setActiveTab("track")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "track" && styles.activeTabText,
                        ]}
                    >
                        Track Performance
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === "create" ? (
                    <>
                        {/* Mock Ad List */}
                        <View style={styles.adCard}>
                            <View style={styles.adBox} />
                            <View style={styles.adTextContainer}>
                                <View style={styles.bigLine} />
                                <View style={styles.smallLine} />
                            </View>
                        </View>

                        <View style={styles.adCard}>
                            <View style={styles.adBox} />
                            <View style={styles.adTextContainer}>
                                <View style={styles.bigLine} />
                                <View style={styles.smallLine} />
                            </View>
                        </View>

                        <View style={styles.adCard}>
                            <View style={styles.adBox} />
                            <View style={styles.adTextContainer}>
                                <View style={styles.bigLine} />
                                <View style={styles.smallLine} />
                            </View>
                        </View>

                        {/* Empty Ads Message */}
                        <Text style={styles.noAdsText}>No running ads</Text>
                        <Text style={styles.subText}>
                            Want to check performance of your past campaigns?
                        </Text>

                        {/* View Here with Icon */}
                        <TouchableOpacity style={styles.linkContainer}>
                            <Text style={styles.linkText}>View here</Text>
                            <Ionicons
                                name="chevron-forward"
                                size={wp("4%")}
                                color="#6c63ff"
                                style={{ marginTop: hp(0.5) }}
                            />
                        </TouchableOpacity>

                        {/* Create Ad Button */}
                        <TouchableOpacity style={styles.createAdBtn}>
                            <Text style={styles.createAdText}>Create Ad</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.trackContainer}>
                        {/* MainHomeCard wrapped with margin */}
                        <View style={styles.homeCardWrapper}>
                            <MainHomeCard />
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Advertisements;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    topBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1.5%"),
    },
    topBarLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    topBarText: {
        fontSize: wp("4.5%"),
        marginLeft: wp("2%"),
        color: "#000",
    },
    topBarTitle: {
        fontSize: wp("5%"),
        fontWeight: "600",
        color: "#000",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingHorizontal: wp(4),
    },
    tab: {
        paddingVertical: hp("1.5%"),
        width: "50%",
        alignItems: "center",
    },
    tabText: {
        fontSize: wp("4%"),
        color: "#999",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#6C63FF",
        width: "50%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    activeTabText: {
        color: "black",
        fontWeight: "600",
    },
    content: {
        flexGrow: 1,
        alignItems: "center",
        paddingTop: hp("6%"),
    },
    adCard: {
        width: wp("90%"),
        height: hp("8%"),
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: hp("1.5%"),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("3%"),
        borderColor: "#ddd",
        borderWidth: 1,
    },
    adBox: {
        width: wp("12%"),
        height: wp("12%"),
        backgroundColor: "#6E533F4F",
        borderRadius: 6,
    },
    adTextContainer: {
        flex: 1,
        marginLeft: wp("3%"),
        justifyContent: "center",
    },
    bigLine: {
        width: "80%",
        height: hp("0.6%"),
        backgroundColor: "#6E533F4F",
        borderRadius: 4,
        marginBottom: hp("2%"),
    },
    smallLine: {
        width: "50%",
        height: hp("0.6%"),
        backgroundColor: "#6E533F4F",
        borderRadius: 4,
    },
    noAdsText: {
        fontSize: wp("5%"),
        marginTop: hp("3%"),
        fontFamily: "Poppins-Medium",
    },
    subText: {
        fontSize: wp("3.5%"),
        color: "#00000078",
        textAlign: "center",
        marginVertical: hp("1%"),
        width: wp("80%"),
        fontFamily: "Poppins-Regular",
    },
    linkContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp("1%"),
    },
    linkText: {
        color: "#6c63ff",
        fontWeight: "500",
        marginRight: wp("1%"),
    },
    createAdBtn: {
        marginTop: hp("4%"),
        width: wp("90%"),
        height: hp("6%"),
        backgroundColor: "#6C63FF",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    createAdText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
    trackContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    trackText: {
        fontSize: wp("4.5%"),
        color: "#333",
    },
    homeCardWrapper: {
        width: wp("92%"),
        marginHorizontal: wp("4%"),
    },
});
