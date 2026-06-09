import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const AddveyLogo = require("../../assets/images/1.png");

const AboutAddveyScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={hp(2.4)}
                        color="#000"
                        style={{ marginRight: wp(3) }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>About Addvey</Text>
                <View style={{ width: wp(6) }} />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* About Section */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <View style={styles.headerRow}>
                        <Image source={AddveyLogo} style={styles.logo} />
                        <Text style={styles.sectionTitle}>About US</Text>
                    </View>

                    <Text style={styles.description}>
                        Addvey is a next-generation hyperlocal super app designed to simplify daily
                        life by combining multiple essential services into one seamless platform.
                        Whether you need to book a ride, order food, find jobs, or access local
                        services — Addvey makes it fast, simple, and affordable.
                    </Text>

                    <Text style={styles.description}>
                        Our mission is to empower users, vendors, and service providers by creating
                        a fair, transparent and commission-free ecosystem. Addvey’s zero-commission
                        model ensures that vendors and drivers receive 100% of their earnings,
                        leading to better service availability and competitive pricing for users.
                    </Text>

                    <Text style={styles.description}>
                        Addvey is operated by Addveynow Solutions Private Limited and is registered
                        with the Ministry of Corporate Affairs, Government of India.
                        {"\n"}Corporate Identity Number (CIN):{"\n"}U58191TS2024PTC182747
                    </Text>

                    <View style={styles.bottomInfo}>
                        <Text style={styles.updateText}>
                            Updated On: 12th March 2025, 7:52 PM
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Verion')}>
                            <Text style={styles.linkText}>All Versions</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AboutAddveyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        backgroundColor: "#fff",
        marginTop: hp(3),
    },
    headerText: {
        textAlign: "center",
        fontSize: hp(1.8),
        color: "#000",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.5),
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#E5E5E5",
    },
    scrollContent: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(5),
    },
    section: {
        backgroundColor: "#fff",
        paddingBottom: hp(4),
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp(2),
    },
    logo: {
        width: wp(7),
        height: wp(7),
        resizeMode: "contain",
        marginRight: wp(2.5),
    },
    sectionTitle: {
        fontSize: hp(2.5),
        color: "#000",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.5)
    },
    description: {
        fontSize: hp(1.55),
        color: "#444",
        fontFamily: "Poppins-Regular",
        lineHeight: hp(2.4),
        textAlign: "justify",
        marginBottom: hp(1.8),
    },
    bottomInfo: {
        alignItems: "flex-end",
        marginTop: hp(2),
    },
    updateText: {
        fontSize: hp(1.4),
        color: "#666",
        fontFamily: "Poppins-Regular",
    },
    linkText: {
        fontSize: hp(1.4),
        color: "#6C63FF",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.5),
        textDecorationLine: 'underline'
    },
});
