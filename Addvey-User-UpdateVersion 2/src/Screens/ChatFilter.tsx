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
import { Ionicons } from "@expo/vector-icons";

const ChatFilterScreen = () => {
    const [selectedPayment, setSelectedPayment] = useState<string | null>("Addvey Wallet");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const statusOptions = ["Today", "This week", "Last 30 days", "Last three months", "2024"];

    const clearAll = () => {
        setSelectedPayment(null);
        setSelectedStatus(null);
        setSelectedTime(null);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={wp("6%")} color="black" />
                <Text style={styles.headerTitle}>Chat Filters</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: hp("5%") }}>


                {/* Filter by Status */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Filter by time</Text>
                    {statusOptions.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.optionRow}
                            onPress={() => setSelectedStatus(item)}
                        >
                            <View
                                style={[
                                    styles.radioOuter,
                                    selectedStatus === item && styles.radioOuterActive,
                                ]}
                            >
                                {selectedStatus === item && <View style={styles.radioInner} />}
                            </View>
                            <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={clearAll}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn}>
                    <Text style={styles.applyText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatFilterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("5%"),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp("2%"),
        marginTop: hp(4)
    },
    headerTitle: {
        fontSize: wp("5%"),
        fontWeight: "600",
        marginLeft: wp("3%"),
    },
    section: {
        marginTop: hp("2%"),
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        paddingBottom: hp("2%"),
    },
    sectionTitle: {
        fontSize: wp("4%"),
        marginBottom: hp("1.5%"),
        fontFamily: 'Poppins-Medium'
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("2%"),
    },
    radioOuter: {
        width: wp("4.5%"),
        height: wp("4.5%"),
        borderRadius: wp("3%"),
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        marginRight: wp("3%"),
    },
    radioOuterActive: {
        borderColor: "#6C63FF",
        borderWidth: 3.5,
    },
    radioInner: {
        borderRadius: wp("1.5%"),
        backgroundColor: "#6C63FF",
    },
    optionText: {
        fontSize: wp("3.2s%"),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: hp("2%"),
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    clearText: {
        fontSize: wp("4.2%"),
        color: "#FF0303",
        fontWeight: "500",
        marginTop: hp(1.2),
        marginLeft: wp(5.5),
        fontFamily: 'Poppins-Regular'
    },
    applyBtn: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("14%"),
        borderRadius: wp("5%"),
    },
    applyText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
});
