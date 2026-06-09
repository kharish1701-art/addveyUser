// screens/TermAndConditionScreen.tsx

import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TermAndConditionScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={hp("2%")} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Terms & conditions</Text>
            </View>

            {/* Title Section */}
            <View style={styles.titleRow}>
                <Image
                    source={require('../../assets/images/1.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.titleText}>Addvey Terms and Conditions</Text>
            </View>

            {/* Card Section */}
            <TouchableOpacity onPress={() => navigation.navigate('TermsOfUse')}>
                <View style={styles.card}>
                    {/* Image (replaces icon) */}
                    <View style={styles.iconWrapper}>
                        <Image
                            source={require('../../assets/images/bycir.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Content */}
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Buy/Sell</Text>
                        <Text style={styles.cardDescription}>
                            About Buy/Sell, Your Account and {"\n"}
                            Registration Obligations, Transactions {"\n"}
                            through Addvey Buy/Sell
                        </Text>

                        {/* Arrow Button */}
                        <TouchableOpacity style={styles.arrowButton}>
                            <Ionicons name="arrow-forward" size={hp("2%")} color="#4C52FF" />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Border Highlight */}
                    <View style={styles.bottomLine} />
                </View>
            </TouchableOpacity>

        </ScrollView>
    );
};

export default TermAndConditionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("5%"),
        paddingTop: hp("2%"),
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("2%"),
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
        justifyContent: "flex-start",
        marginBottom: hp("5%"),
        marginTop: hp(1)
    },
    logo: {
        width: wp("7%"),
        height: wp("7%"),
        marginRight: wp("3%"),
    },
    titleText: {
        fontSize: hp("2%"),
        color: "#6C63FF",
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.8)
    },
    card: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: wp("3%"),
        backgroundColor: "#fff",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: hp("2%"),
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: hp("2%"),
    },
    iconImage: {
        width: wp("20%"),
        height: wp("20%"),
        resizeMode: 'contain'
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    cardContent: {
        paddingVertical: hp("2%"),
        paddingHorizontal: wp("4%"),
        position: "relative",
    },
    cardTitle: {
        fontSize: hp("2.2%"),
        color: "#000",
        marginBottom: hp("0.5%"),
        fontFamily: 'Poppins-Medium'
    },
    cardDescription: {
        fontSize: hp("1.4%"),
        color: "#666",
        lineHeight: hp("2.4%"),
    },
    arrowButton: {
        position: "absolute",
        right: wp("4%"),
        bottom: hp("0.8%"),
    },
    bottomLine: {
        height: hp("0.3%"),
        backgroundColor: "#4C52FF",
        borderBottomLeftRadius: wp("3%"),
        borderBottomRightRadius: wp("3%"),
    },
});
