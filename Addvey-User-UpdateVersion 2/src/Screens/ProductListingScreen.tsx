// ProductListtingScreen.tsx
import React from "react";
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

const ProductListtingScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={hp(3)} color="black" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Product Listing Plans</Text>
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Heading */}
                <Text style={styles.subHeading}>
                    Pick a plan to post and reach buyers
                </Text>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        🆓 Starter Plan – ₹0/month
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        Best for beginners looking to get started.
                    </Text>

                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>📅 30 Listings per month</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>📸 5 Photos per listing</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>✏️ Unlimited Edits</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>
                            📊 Basic Insights (Ad visits, Reach)
                        </Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>
                            📍 Local + City + Nearby Visibility
                        </Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>📧 Email & Phone Support</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>⚫ No Hidden Charges</Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>✅ Verified Badge</Text>
                    </View>

                    {/* Note */}
                    <Text style={styles.note}>
                        Note: <Text style={styles.noteLight}>
                            Your use of Addvey helps us grow and improve for everyone. Thank
                            you for being a part of this journey! 🙏
                        </Text>
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <TouchableOpacity style={styles.activateButton}>
                <Text style={styles.activateText}>Activate</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProductListtingScreen;

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
        paddingVertical: hp(2),
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        position: "absolute",

        marginTop: hp(4)
    },
    topBarTitle: {
        fontSize: hp(2.2),
        fontWeight: "600",
        marginLeft: wp(3),
        color: "#000",
    },
    scrollContent: {
        paddingTop: hp(10), 
        paddingHorizontal: wp(4),
        paddingBottom: hp(15),
    },
    subHeading: {
        fontSize: hp(2),
        color: "#333",
        marginBottom: hp(2),
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: wp(3),
        padding: wp(4),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: hp(2.2),
        fontWeight: "700",
        marginBottom: hp(1),
    },
    cardSubtitle: {
        fontSize: hp(1.7),
        color: "#666",
        marginBottom: hp(2),
    },
    bulletItem: {
        marginVertical: hp(0.5),
    },
    bullet: {
        fontSize: hp(1.9),
        color: "#000",
    },
    note: {
        marginTop: hp(2),
        fontSize: hp(1.6),
        color: "#444",
    },
    noteLight: {
        color: "#999",
    },
    activateButton: {
        position: "absolute",
        bottom: hp(2),
        left: wp(5),
        right: wp(5),
        backgroundColor: "#6A5AE0",
        paddingVertical: hp(1.8),
        borderRadius: wp(3),
        alignItems: "center",
        justifyContent: "center",
    },
    activateText: {
        color: "#fff",
        fontSize: hp(2),
        fontWeight: "600",
    },
});
