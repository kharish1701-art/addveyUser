// VerificationDone.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const VerificationDone = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Top Circle with Tick Icon */}
            <View style={styles.iconWrapper}>
                <Ionicons name="checkmark" size={wp("20%")} color="#fff" />
            </View>

            {/* Title */}
            <Text style={styles.title}>Your verification request has been
                submitted successfully </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                This process may take up to 24 hours. we’ll notify you
                once your profile verified
            </Text>

            {/* Fixed Bottom Button */}
            <View style={styles.bottomButtonWrapper}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default VerificationDone;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingHorizontal: wp("6%"),
    },
    iconWrapper: {
        width: wp("28%"),
        height: wp("28%"),
        borderRadius: wp("14%"),
        backgroundColor: "#32CD32",
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp("20%"),
    },
    title: {
        fontSize: wp("5%"),
        color: "#222",
        textAlign: "center",
        marginTop: hp("3%"),
        fontFamily: 'Poppins-Medium'
    },
    subtitle: {
        fontSize: wp("3%"),
        color: "#666",
        textAlign: "center",
        marginTop: hp("2%"),
        lineHeight: hp("2%"),
        paddingHorizontal: wp("2%"),
    },
    bottomButtonWrapper: {
        position: "absolute",
        bottom: hp("4%"),
        width: "100%",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.5%"),
        width: wp("85%"),
        borderRadius: wp("4%"),
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
});
