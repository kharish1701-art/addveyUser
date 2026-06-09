// screens/TransactionScreen.tsx
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
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TransactionScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [activeFilter, setActiveFilter] = useState("All");

    const transactions = [
        {
            id: "#833AML156015",
            amount: "+₹ 300",
            type: "credit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI"
        },
        {
            id: "#833AML156015",
            amount: "₹ 300",
            type: "debit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI - Addvey Wallet"
        },
        {
            id: "#833AML156015",
            amount: "₹ 300",
            type: "debit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI - Addvey Wallet"
        },
        {
            id: "#833AML156015",
            amount: "+₹ 300",
            type: "credit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI"
        },
        {
            id: "#833AML156015",
            amount: "₹ 300",
            type: "debit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI - Addvey Wallet"
        }
    ];

    // Filtered transactions logic
    const filteredTransactions = transactions.filter((item) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Refunds") return item.method.includes("Wallet");
        if (activeFilter === "Credited") return item.type === "credit";
        if (activeFilter === "Debited") return item.type === "debit";
        return true;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="arrow-back" size={wp("4.5%")} color="black" />
                    <Text style={styles.headerTitle}>All Transactions</Text>
                </View>
            </View>

            {/* Buy/Sell row */}
            <View style={styles.buySellRow}>
                <Text style={styles.buySellText}>Buy/Sell</Text>
                <View style={styles.buySellActiveIndicator} />
            </View>

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

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: wp(4),
                    paddingBottom: hp(10),
                }}
            >
                {/* Filters (Horizontal Scrollable) */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: hp(1) }}
                >
                    <View style={styles.filtersRow}>
                        {/* All Filter with Icon (tumhara original code) */}
                        <TouchableOpacity
                            style={[
                                styles.filterBtn,
                                activeFilter === "All" && styles.activeFilterBtn,
                            ]}
                            onPress={() => {
                                setActiveFilter("All");
                                navigation.navigate("TransctionFilter");
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
                                activeFilter === "Refunds" && styles.activeFilterBtn,
                            ]}
                            onPress={() => setActiveFilter("Refunds")}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === "Refunds" && styles.activeFilterText,
                                ]}
                            >
                                Refunds
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.filterBtn,
                                activeFilter === "Credited" && styles.activeFilterBtn,
                            ]}
                            onPress={() => setActiveFilter("Credited")}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === "Credited" && styles.activeFilterText,
                                ]}
                            >
                                Credited
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.filterBtn,
                                activeFilter === "Debited" && styles.activeFilterBtn,
                            ]}
                            onPress={() => setActiveFilter("Debited")}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === "Debited" && styles.activeFilterText,
                                ]}
                            >
                                Debited
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Recent Transactions Section */}
                <View style={styles.transactionsSection}>
                    {filteredTransactions.map((item, index) => (
                        <View key={index} style={styles.transactionCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.transactionId}>
                                    Placed Order ID {item.id}
                                </Text>
                                <Text style={styles.transactionDate}>{item.date}</Text>
                                <Text style={styles.transactionMethod}>{item.method}</Text>
                            </View>
                            <Text
                                style={[
                                    styles.transactionAmount,
                                    item.type === "credit" ? styles.credit : styles.debit,
                                ]}
                            >
                                {item.amount}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default TransactionScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    /** Header */
    header: {
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("1.5%"),
        marginTop: hp(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    headerTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        marginLeft: wp(3),
        color: "black",
    },

    /** Buy/Sell Row */
    buySellRow: {
        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp(1),
        position: "relative",
    },
    buySellText: {
        fontSize: wp("3.8%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
    },
    buySellActiveIndicator: {
        position: "absolute",
        bottom: 0,
        left: wp("5%"),
        width: wp("15%"),
        height: 3,
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
        marginBottom: hp(0.5),
        marginTop: hp(2),
        marginHorizontal: wp(3.9),
    },
    searchInput: { flex: 1, fontSize: hp(1.8), color: "#000" },

    /** Filters */
    filtersRow: {
        flexDirection: "row",
        marginBottom: hp(2),
        paddingRight: wp(3),
    },
    filterBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(0.6),
        paddingHorizontal: wp(3),
        marginRight: wp(2),
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp(2),
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 2,
        marginTop: hp(1),
    },
    activeFilterBtn: {
        borderColor: "#6A5AE0",
        backgroundColor: "#fff",
    },
    filterText: { marginLeft: 0, fontSize: hp(1.5), color: "#00000099" },
    activeFilterText: { color: "#6A5AE0", fontWeight: "600" },

    /** Transactions */
    transactionsSection: {
        marginTop: hp("0%")
    },
    transactionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp("2%")
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#D9D9D9",
        marginHorizontal: 8
    },
    transactionsTitle: {
        fontSize: wp("4%"),
        fontFamily: "Poppins-Medium",
        textAlign: "center",
    },
    transactionCard: {
        backgroundColor: "#fff",
        padding: wp("4%"),
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: hp("1.8%"),
        borderColor: '#ddd',
        borderWidth: 0.5
    },
    transactionId: {
        fontSize: wp("3.2%"),
        fontFamily: "Poppins-Medium",
        marginBottom: 5,
        color: "#000"
    },
    transactionDate: {
        fontSize: wp("2.8%"),
        color: "#6B7280",
        marginBottom: 5,
        fontFamily: "Poppins-Regular"
    },
    transactionMethod: {
        fontSize: wp("2.8%"),
        color: "#6B7280",
        fontFamily: "Poppins-Regular"
    },
    transactionAmount: {
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Medium"
    },
    credit: {
        color: "#729358",
        fontFamily: 'Poppins-Medium'
    },
    debit: {
        color: "#000"
    },
    seeAllBtn: {
        alignItems: "center",
        marginTop: hp("1%"),
    },
    seeAllText: {
        fontSize: wp("3.8%"),
        color: "#6C63FF",
        fontFamily: "Poppins-Medium"
    },
});
