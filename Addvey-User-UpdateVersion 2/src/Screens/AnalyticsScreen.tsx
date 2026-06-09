import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import { VictoryChart, VictoryBar, VictoryLine, VictoryAxis, VictoryTheme } from "victory";
import { G } from "react-native-svg";

// Dummy dropdown options
const DROPDOWN_OPTIONS = ["Last 7 days", "Last 30 days", "This month"];

// Dummy data
const reachData = [
    { day: "1st", value: 30 },
    { day: "2nd", value: 50 },
    { day: "3rd", value: 10 },
    { day: "4th", value: 80 },
    { day: "5th", value: 45 },
    { day: "6th", value: 0 },
    { day: "Today", value: 0 },
];

const ADVisits = () => (
    <View style={styles.chartWrapper}>
        <Text style={styles.placeholder}>AD Visits Chart</Text>
    </View>
);

const Reach = () => (
    <View>
        {/* Bar Chart */}
        <View style={styles.chartWrapper}>
            <VictoryChart
                height={hp("35%")}
                width={wp("90%")}
                theme={VictoryTheme.material}
                domainPadding={{ x: 25 }}
            >
                <VictoryAxis
                    dependentAxis
                    tickValues={[0, 20, 40, 60, 80, 100]}
                    style={{
                        tickLabels: { fontSize: wp("3%") },
                    }}
                />
                <VictoryAxis
                    tickValues={reachData.map((d) => d.day)}
                    style={{
                        tickLabels: { fontSize: wp("3%") },
                    }}
                />
                <VictoryBar
                    data={reachData}
                    x="day"
                    y="value"
                    style={{ data: { fill: "#4C6EF5", width: wp("5%") } }}
                />
            </VictoryChart>
        </View>

        {/* Line Chart */}
        <View style={styles.chartWrapper}>
            <VictoryChart
                height={hp("35%")}
                width={wp("90%")}
                theme={VictoryTheme.material}
            >
                <VictoryAxis
                    dependentAxis
                    tickValues={[0, 20, 40, 60, 80, 100]}
                    style={{
                        tickLabels: { fontSize: wp("3%") },
                    }}
                />
                <VictoryAxis
                    tickValues={reachData.map((d) => d.day)}
                    style={{
                        tickLabels: { fontSize: wp("3%") },
                    }}
                />
                <VictoryLine
                    data={reachData}
                    x="day"
                    y="value"
                    groupComponent={<G />}
                    style={{
                        data: { stroke: "#4C6EF5", strokeWidth: 2 },
                    }}
                />
            </VictoryChart>
        </View>
    </View>
);

const Contacted = () => (
    <View style={styles.chartWrapper}>
        <Text style={styles.placeholder}>Contacted Chart</Text>
    </View>
);

const Reports = () => (
    <View style={styles.chartWrapper}>
        <Text style={styles.placeholder}>Reports Chart</Text>
    </View>
);

const Search = () => (
    <View style={styles.chartWrapper}>
        <Text style={styles.placeholder}>Search Chart</Text>
    </View>
);

const AnalyticsScreen = () => {
    const [selectedOption, setSelectedOption] = useState("Last 7 days");
    const [activeTab, setActiveTab] = useState<
        "ADVisits" | "Reach" | "Contacted" | "Reports" | "Search"
    >("Reach");

    const renderTabContent = () => {
        switch (activeTab) {
            case "ADVisits":
                return <ADVisits />;
            case "Reach":
                return <Reach />;
            case "Contacted":
                return <Contacted />;
            case "Reports":
                return <Reports />;
            case "Search":
                return <Search />;
            default:
                return <Reach />;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>View trends</Text>
                <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{selectedOption}</Text>
                    <Ionicons name="chevron-down" size={wp("4.5%")} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
                {["ADVisits", "Reach", "Contacted", "Reports", "Search"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab as any)}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab === "ADVisits" ? "AD visits" : tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: hp("5%") }}
                showsVerticalScrollIndicator={false}
            >
                {renderTabContent()}
            </ScrollView>
        </View>
    );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
        paddingTop: hp("2%"),
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp("4%"),
        marginBottom: hp("2%"),
    },
    headerTitle: {
        fontSize: wp("4.5%"),
        fontWeight: "600",
        color: "#000",
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: wp("2%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("0.8%"),
        backgroundColor: "#fff",
    },
    dropdownText: {
        fontSize: wp("3.5%"),
        marginRight: wp("1%"),
        color: "#000",
    },
    tabsRow: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#eee",
        marginBottom: hp("2%"),
        paddingHorizontal: wp("2%"),
    },
    tabButton: {
        marginRight: wp("5%"),
        paddingBottom: hp("0.8%"),
    },
    tabText: {
        fontSize: wp("3.8%"),
        color: "#777",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#4C6EF5",
    },
    activeTabText: {
        color: "#4C6EF5",
        fontWeight: "600",
    },
    chartWrapper: {
        backgroundColor: "#fff",
        borderRadius: wp("3%"),
        paddingVertical: hp("1%"),
        alignItems: "center",
        marginBottom: hp("2%"),
        marginHorizontal: wp("4%"),
        elevation: 2,
    },
    placeholder: {
        fontSize: wp("4%"),
        color: "#999",
        paddingVertical: hp("10%"),
    },
});
