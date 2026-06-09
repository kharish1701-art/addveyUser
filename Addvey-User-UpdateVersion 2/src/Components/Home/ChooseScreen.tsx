import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FAQScreen from "./FAQ";

const ChoosAddveyScreen: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Title with lines */}
            <View style={styles.titleContainer}>
                <View style={styles.line} />
                <View style={styles.titleTextContainer}>
                    <Text style={styles.titleTop}>Why choose</Text>
                    <Text style={styles.titleBottom}>Addvey?</Text>
                </View>
                <View style={styles.line} />
            </View>

            {/* First Box */}
            <View style={styles.itemBox}>
                <Image
                    source={require("../../../assets/images/tik.png")}
                    style={styles.icon}
                    resizeMode="contain"
                />
                <Text style={styles.heading}>Secure</Text>
                <Text style={styles.description}>
                    Secure and easy deals, every time.
                </Text>
            </View>

            {/* Second Box with border for QR */}
            <View style={styles.itemBox}>
                <View style={styles.qrWrapper}>
                    <Image
                        source={require("../../../assets/images/qr.png")}
                        style={styles.qrIcon}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.heading}>QR-Based Listing</Text>
                <Text style={styles.description}>
                    Generate a QR code for your listing to make sharing and
                    selling easier.
                </Text>
            </View>

            <View style={styles.itemBox}>
                <View style={styles.qrWrappertwo}>
                    <Image
                        source={require("../../../assets/images/map.png")}
                        style={styles.qrIcon}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.heading}>Map-Based Discovery</Text>
                <Text style={styles.description}>
                    Show your listings on an interactive map to
                    reach nearby buyers easily
                </Text>
            </View>

            <View style={styles.itemBox}>
                <View style={styles.qrWrapperthree}>
                    <Image
                        source={require("../../../assets/images/deal.png")}
                        style={styles.qrIcon}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.heading}>Direct Deal</Text>
                <Text style={styles.description}>
                    Receive payments directly from buyers —
                    Addvey takes no commission
                </Text>
            </View>

            <View style={styles.itemBox}>
                <View style={styles.qrWrapperfour}>
                    <Image
                        source={require("../../../assets/images/support.png")}
                        style={styles.qrIcon}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.heading}>Hotline support</Text>
                <Text style={styles.description}>
                    On-call support for any issues
                </Text>
            </View>

            <FAQScreen />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: hp("3%"),
        width: '100%'
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("4%"),
        width: "100%",
        justifyContent: "center",
    },
    line: {
        width: wp("28%"),
        height: 1,
        backgroundColor: "#D9D9D9",
    },
    titleTextContainer: {
        alignItems: "center",
        marginHorizontal: wp("3%"),
    },
    titleTop: {
        fontSize: wp("4.5%"),
        color: "#000000",
        fontFamily: "Poppins-Medium",
        lineHeight: hp("3%"),
    },
    titleBottom: {
        fontSize: wp("5%"),
        color: "#000000",
        fontFamily: "Poppins-Medium",
        lineHeight: hp("3%"),
    },
    itemBox: {
        alignItems: "center",
        marginBottom: hp("5%"),
        marginTop: hp(1),
    },
    icon: {
        width: wp("16%"),
        height: wp("16%"),
        marginBottom: hp("1.5%"),
    },
    qrWrapper: {
        borderWidth: 2,
        borderColor: "#6C63FF",
        borderRadius: wp("10%"),
        padding: wp("2%"),
        marginBottom: hp("1.5%"),
    },
    qrWrappertwo: {
        borderWidth: 2,
        backgroundColor: "black",
        borderRadius: wp("10%"),
        padding: wp("2%"),
        marginBottom: hp("1.5%"),
    },
    qrWrapperthree: {
        borderWidth: 2,
        borderColor: "#32CD32",
        borderRadius: wp("10%"),
        padding: wp("2%"),
        marginBottom: hp("1.5%"),
    },
    qrWrapperfour: {
        borderWidth: 2,
        borderColor: "#6C63FF",
        borderRadius: wp("10%"),
        padding: wp("2%"),
        marginBottom: hp("1.5%"),
    },
    qrIcon: {
        width: wp("10%"),
        height: wp("10%"),
    },
    heading: {
        fontSize: wp("4.5%"),
        textAlign: "center",
        fontFamily: "Poppins-Medium",
    },
    description: {
        fontSize: wp("3.5%"),
        color: "#000000",
        textAlign: "center",
        width: wp("80%"),
        fontFamily: "Poppins-Regular",
    },
});

export default ChoosAddveyScreen;
