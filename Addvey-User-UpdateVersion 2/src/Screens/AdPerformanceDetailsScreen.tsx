import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import MainHomeCard from "../Components/Home/MainHomeCard";
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const AdCard = () => {
    return (
        <View style={styles.adCard}>
            <MainHomeCard />
        </View>
    );
};

// Dummy Components for tabs
const Overall = () => (
    <View style={styles.tabContainer}>
        <Text style={styles.tabText}>Overall Performance</Text>
    </View>
);

const ThisWeek = () => (
    <View style={styles.tabContainer}>
        <View style={styles.metricsContainer}>
            {[
                { label: "AD visits", value: "500", icon: "eye" },
                { label: "Reach", value: "1000", icon: "eye" },
                { label: "Contacted", value: "10", icon: "person-add" },
                { label: "Interested", value: "1000", icon: "wifi" },
                { label: "Reports", value: "2", icon: "alert-circle" },
                { label: "Search reach", value: "500", icon: "search" },
                { label: "Map Reach", value: "100", icon: "map" },
            ].map((item, index) => (
                <View style={styles.metricBox} key={index}>
                    <Ionicons
                        name={item.icon as any}
                        size={wp("6%")}
                        color="#6E533F"
                        style={{ marginBottom: hp("1%") }}
                    />
                    <Text style={styles.metricValue}>{item.value}</Text>
                    <Text style={styles.metricLabel}>{item.label}</Text>
                </View>
            ))}
        </View>
    </View>
);

const LastWeek = () => (
    <View style={styles.tabContainer}>
        <Text style={styles.tabText}>Last Week Performance</Text>
    </View>
);

const AdPerformanceDetailsScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<"overall" | "thisWeek" | "lastWeek">("thisWeek");

    const renderTabContent = () => {
        switch (activeTab) {
            case "overall":
                return <Overall />;
            case "thisWeek":
                return <ThisWeek />;
            case "lastWeek":
                return <LastWeek />;
            default:
                return <ThisWeek />;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Fixed Topbar */}
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={wp("5%")} style={{ marginRight: wp(3) }} color="#000" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Ad Performance details</Text>
                <View style={{ width: wp("6%") }} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: hp("5%") }}
                showsVerticalScrollIndicator={false}
            >
                {/* Ad Card Component */}
                <AdCard />

                {/* Texts under AdCard */}
                <View style={styles.cardInfoRow}>
                    <Text style={styles.leftText}>Performance</Text>
                    <Text style={styles.rightText}>Updated on 06 Sep, 1:04 am </Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabsWrapper}>
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            onPress={() => setActiveTab("overall")}
                            style={[
                                styles.tabButton,
                                activeTab === "overall" && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "overall" && styles.activeTabText,
                                ]}
                            >
                                Overall
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab("thisWeek")}
                            style={[
                                styles.tabButton,
                                activeTab === "thisWeek" && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "thisWeek" && styles.activeTabText,
                                ]}
                            >
                                This week
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab("lastWeek")}
                            style={[
                                styles.tabButton,
                                activeTab === "lastWeek" && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "lastWeek" && styles.activeTabText,
                                ]}
                            >
                                Last week
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('AddPerformanceDetail')}>
                        <FontAwesome6 name="arrow-up-from-bracket" size={14} color="#000000" />
                    </TouchableOpacity>
                    {/* Right side Icon */}

                </View>


                {/* Tab Content */}
                {renderTabContent()}
            </ScrollView>
        </View>
    );
};

export default AdPerformanceDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        height: hp("7%"),
        paddingHorizontal: wp("4%"),
        backgroundColor: "#fff",
        marginTop: hp(4)
    },
    topBarTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "#000",
    },
    adCard: {
        marginTop: hp(2),
        borderRadius: wp("3%"),
        marginHorizontal: wp(5)
    },
    cardInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp("4%"),
        marginBottom: hp("4%"),
        marginTop: hp(2)
    },
    leftText: {
        fontSize: wp("3.8%"),
        color: "black",
        fontFamily: 'Poppins-Medium'
    },
    rightText: {
        fontSize: wp("2.8%"),
        color: "#555555",
        fontFamily: 'Poppins-Regular',
        marginTop: hp(0.4)
    },
    tabsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("4%"),
        marginBottom: hp("2%"),
    },
    tabsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    tabButton: {
        marginRight: wp("5%"),
        paddingVertical: hp("0.5%"),
    },
    tabButtonText: {
        fontSize: wp("3.6%"),
        color: "#777",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#6C63FF",
    },
    activeTabText: {
        color: "#000000",
        fontWeight: "600",
    },
    tabContainer: {
        paddingHorizontal: wp("8%"),
    },
    tabText: {
        fontSize: wp("4%"),
        textAlign: "center",
        marginTop: hp("2%"),
    },
    metricsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: hp("1%"),
    },
    metricBox: {
        width: "45%",
        backgroundColor: "#f9f9f9",
        borderRadius: wp("3%"),
        padding: wp("4%"),
        marginBottom: hp("2%"),
    },
    metricValue: {
        fontSize: wp("5%"),
        fontWeight: "bold",
        color: "#6C63FF",
    },
    metricLabel: {
        fontSize: wp("3.5%"),
        color: "#000000",
        marginTop: hp("0.5%"),
    },
});
