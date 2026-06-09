import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Image,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddveyPrivacyPolicyScreen = () => {
    const navigation = useNavigation();
    const [selectedLang, setSelectedLang] = useState("English");

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp("4.5%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy policy</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Card Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Privacy policy
                    </Text>

                    <View style={styles.refreshIconContainer}>
                        <Image
                            source={require("../../assets/images/1.png")}
                            style={styles.centerImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.updatedTextContainer}>
                        <Text style={styles.updateText}>
                            Updated On: 12th March 2025, 7:52 PM (IST)
                        </Text>
                    </View>
                </View>

                <View style={styles.languageContainer}>
                    {["English", "తెలుగు", "हिंदी"].map((lang) => (
                        <TouchableOpacity
                            key={lang}
                            onPress={() => setSelectedLang(lang)}
                            style={[
                                styles.languageButton,
                                selectedLang === lang && styles.languageActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.languageText,
                                    selectedLang === lang && styles.languageTextActive,
                                ]}
                            >
                                {lang}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Terms Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.sectionTitle}>1. Introduction</Text>
                    <Text style={styles.paragraph}>
                        Welcome to Addvey Buy/Sell. By using our platform, you agree to
                        follow these Terms of Use. Please read them carefully before
                        accessing or using the app.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Eligibility</Text>
                    <Text style={styles.paragraph}>
                        To use Buy/Sell:
                        {"\n"}• You must be at least 18 years old or have parental/guardian
                        consent.
                        {"\n"}• By using the app, you confirm that the information you
                        provide is accurate and that you are legally allowed to enter into
                        a contract.
                    </Text>

                    <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
                    <Text style={styles.paragraph}>
                        You agree to:
                        {"\n"}• Use Addvey Buy/Sell only for lawful purposes.
                        {"\n"}• Provide accurate and up-to-date information in your
                        listings and communications.
                        {"\n"}• Be respectful and avoid any abusive, fraudulent, or
                        misleading behavior.
                        {"\n"}• Report any suspicious activity to Addvey Support.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default AddveyPrivacyPolicyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("4%"),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp("5%"),
        marginBottom: hp("2%"),
    },
    headerTitle: {
        fontSize: wp("4%"),
        marginLeft: wp("3%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.5),
    },
    card: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: wp("2%"),
        paddingVertical: hp("2%"),
        paddingHorizontal: wp("4%"),
        alignItems: "flex-start",
        marginBottom: hp("2%"),
        position: "relative",
        marginTop: hp(2)
    },
    cardTitle: {
        fontSize: wp("5%"),
        color: "#000",
        marginBottom: hp("1%"),
        textAlign: "left",
        width: "100%",
        fontFamily: 'Poppins-Medium'
    },
    refreshIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginVertical: hp("1%"),
    },
    centerImage: {
        width: wp("20%"),
        height: wp("20%"),
        resizeMode: 'contain',
        marginBottom: hp(4.5)
    },
    updatedTextContainer: {
        position: "absolute",
        bottom: hp("2%"),
        right: wp("3%"),
    },
    updateText: {
        fontSize: wp("2.8%"),
        color: "#555",
        textAlign: "right",
    },
    languageContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp("1%"),
        marginBottom: hp("2%"),
    },
    languageButton: {
        borderWidth: 1,
        borderColor: "#0000004D",
        borderRadius: wp("6%"),
        paddingVertical: hp("0.8%"),
        paddingHorizontal: wp("5%"),
        marginHorizontal: wp("1%"),
    },
    languageActive: {
        borderColor: "#6C63FF",
    },
    languageText: {
        fontSize: wp("3.5%"),
        color: "#0000004D",
    },
    languageTextActive: {
        color: "#6C63FF",
    },
    textContainer: {
        marginTop: hp("2%"),
        marginBottom: hp("5%"),
    },
    sectionTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "#000",
        marginTop: hp("2%"),
        marginBottom: hp("0.5%"),
    },
    paragraph: {
        fontSize: wp("3.5%"),
        color: "#333",
        lineHeight: hp("2.5%"),
    },
});
