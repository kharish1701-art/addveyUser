// screens/VersionScreen.tsx

import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
    Image,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const VersionScreen = () => {
    const navigation = useNavigation<any>();
    const handleLinkPress = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={hp("2%")} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>About Us</Text>
            </View>

            <View style={styles.titleRow}>
                <Image
                    source={require('../../assets/images/1.png')}
                    style={styles.titleImage}
                    resizeMode="contain"
                />
                <Text style={styles.titleText}>About Us</Text>
            </View>

            {/* Version List */}
            <Text style={styles.versionTitle}>All Version List</Text>

            {/* Table */}
            <View style={styles.tableContainer}>
                {/* Header Row */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableHeaderCell, { width: wp("10%") }]}></Text>
                    <Text style={[styles.tableHeaderCell, { width: wp("22%") }]}>
                        Revision ID
                    </Text>
                    <Text style={[styles.tableHeaderCell, { width: wp("25%") }]}>
                        Published Date
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            { width: wp("40%"), borderRightWidth: 0 },
                        ]}
                    >
                        Link
                    </Text>
                </View>

                {/* Data Row */}
                <View style={styles.tableRow}>
                    {/* Center vertically */}
                    <View style={[styles.tableCellCenter, { width: wp("10%") }]}>
                        <Text style={styles.tableText}>1</Text>
                    </View>

                    <View style={[styles.tableCellCenter, { width: wp("22%") }]}>
                        <Text style={styles.tableText}>8590</Text>
                    </View>

                    <View style={[styles.tableCellCenter, { width: wp("25%") }]}>
                        <Text style={styles.tableText}>
                            14/9/2023, {"\n"}9:29:34 am (IST)
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.tableCell,
                            {
                                width: wp("40%"),
                                alignItems: "flex-start",
                                borderRightWidth: 0,
                                paddingHorizontal: wp("2%"),
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                handleLinkPress(
                                    "https://terms-and-conditions.Addvey.com/general/app-aboutus/version/8590"
                                )
                            }
                        >
                            <Text style={styles.linkText}>
                                https://terms-and-conditions.Addvey.com/general/app-aboutus/version/8590
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.addveyText}>Addvey</Text>

                        <TouchableOpacity
                            onPress={() =>
                                handleLinkPress(
                                    "https://terms-and-conditions.Addvey.com/general/app-aboutus/version/8591"
                                )
                            }
                        >
                            <Text style={styles.linkText}>
                                https://terms-and-conditions.Addvey.com/general/app-aboutus/version/8591
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default VersionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("4%"),
        paddingTop: hp("2%"),
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1.5%"),
        marginTop: hp(2.5),
    },
    headerText: {
        fontSize: hp("2%"),
        marginLeft: wp("3%"),
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.5)
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp("3%"),
        marginBottom: hp("4%"),
    },
    titleImage: {
        width: wp("6%"),
        height: wp("6%"),
        marginRight: wp("2%"),
    },
    titleText: {
        fontSize: hp("2.3%"),
        fontWeight: "700",
    },
    versionTitle: {
        color: "#5B3FFF",
        fontSize: hp("1.8%"),
        fontWeight: "600",
        marginBottom: hp("1%"),
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: wp("1%"),
        overflow: "hidden",
    },
    tableRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    tableHeader: {
        borderTopWidth: 0,
    },
    tableHeaderCell: {
        borderRightWidth: 1,
        borderColor: "#ddd",
        textAlign: "left",
        fontWeight: "500",
        fontSize: hp("1.6%"),
        paddingVertical: hp("1%"),
        paddingLeft: wp("2%"),
        color: '#000'
    },
    tableCell: {
        borderRightWidth: 1,
        borderColor: "#ddd",
        paddingVertical: hp("1%"),
    },
    tableCellCenter: {
        borderRightWidth: 1,
        borderColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: hp("2%"),
    },
    tableText: {
        fontSize: hp("1.6%"),
        textAlign: "center",
    },
    linkText: {
        color: "#5B3FFF",
        textDecorationLine: "underline",
        fontSize: hp("1.55%"),
        textAlign: "left",
        width: wp("35%"),
        lineHeight: hp("2%"),
        flexWrap: "wrap",
    },
    addveyText: {
        fontSize: hp("1.6%"),
        color: "black",
        marginVertical: hp("0.5%"),
        textAlign: "left",
        paddingLeft: wp("1%"),
    },
});
