import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    StatusBar,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import MainHomeCard from "../Components/Home/MainHomeCard";
import { useNavigation } from "@react-navigation/native";

const AddInsightMainScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Custom Topbar with Back Arrow */}
            <View style={styles.topbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.topbarText}>Insights</Text>
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: wp(4),
                    paddingBottom: hp(10),
                }}
            >
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
                        onPress={() => {
                            setActiveFilter("All");
                            navigation.navigate("AddFilterScreen");
                        }}
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
                <TouchableOpacity onPress={() => navigation.navigate('AddPerformanceDetail')}>
                    <MainHomeCard />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default AddInsightMainScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    /** Custom Topbar */
    topbar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("2%"),
        marginTop: hp(3),
    },
    topbarText: {
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "black",
        marginLeft: wp(3),
        fontFamily: "Poppins-Bold",
        marginTop: hp(0.5)
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
        marginTop: hp(0),
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
