import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const AboutAppScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp("5%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About App</Text>
            </View>

            {/* Center Content */}
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../assets/images/1.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.appText}>App version</Text>
                <Text style={styles.versionText}>V25.02.12.0.2545698845</Text>
            </View>
        </View>
    );
};

export default AboutAppScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("5%"),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp("5%"),
    },
    headerTitle: {
        fontSize: wp("4%"),
        fontWeight: "500",
        color: "#000",
        marginLeft: wp("3%"),
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        width: wp("22%"),
        height: wp("22%"),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: hp("2%"),
    },
    logo: {
        width: wp("28%"),
        height: wp("28%"),
    },
    appText: {
        fontSize: wp("3.5%"),
        color: "#888",
        marginTop: hp("1%"),
    },
    versionText: {
        fontSize: wp("3.5%"),
        color: "#000",
        marginTop: hp("1%"),
    },
});
