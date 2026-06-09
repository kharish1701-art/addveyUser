// ProductListingPlansScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Image,
    StatusBar
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

interface Plan {
    id: number;
    title: string;
    price: string;
    features: string[];
    expiry: string;
    isActive?: boolean;
}

const plans: Plan[] = [
    {
        id: 1,
        title: "Starter Plan",
        price: "₹0/month",
        expiry: "30/09/25",
        features: [
            "📱 30 Listings per month",
            "📸 5 Photos per listing",
            "🛠 Unlimited Edits",
            "📊 Basic Insights (Ad visits, Reach)",
            "📍 Local + City + Nearby Visibility",
            "📧 Email & Phone Support",
            "✅ No Hidden Charges",
            "✔ Verified Badge",
        ],
        isActive: true,
    },
    {
        id: 2,
        title: "Basic Plan",
        price: "₹499/month",
        expiry: "30/10/25",
        features: [
            "📱 60 Listings per month",
            "📸 10 Photos per listing",
            "🛠 Unlimited Edits",
            "📊 Advanced Insights",
            "📍 Wide Visibility",
            "📧 Priority Support",
            "✅ No Hidden Charges",
            "✔ Verified Badge",
        ],
    },
    {
        id: 3,
        title: "Standard Plan",
        price: "₹999/month",
        expiry: "30/11/25",
        features: [
            "📱 100 Listings per month",
            "📸 15 Photos per listing",
            "🛠 Unlimited Edits",
            "📊 Detailed Insights",
            "📍 State Visibility",
            "📧 Priority Support",
            "✅ No Hidden Charges",
            "✔ Verified Badge",
        ],
    },
    {
        id: 4,
        title: "Premium Plan",
        price: "₹1999/month",
        expiry: "30/12/25",
        features: [
            "📱 200 Listings per month",
            "📸 20 Photos per listing",
            "🛠 Unlimited Edits",
            "📊 Pro Insights",
            "📍 National Visibility",
            "📧 Premium Support",
            "✅ No Hidden Charges",
            "✔ Verified Badge",
        ],
    },
    {
        id: 5,
        title: "Enterprise Plan",
        price: "₹2999/month",
        expiry: "30/01/26",
        features: [
            "📱 500 Listings per month",
            "📸 50 Photos per listing",
            "🛠 Unlimited Edits",
            "📊 Full Analytics",
            "📍 Global Visibility",
            "📧 Dedicated Manager",
            "✅ No Hidden Charges",
            "✔ Verified Badge",
        ],
    },
];

const ProductListingPlansScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showPayment, setShowPayment] = useState(false);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / wp("90%"));
        setActiveIndex(index);
    };

    const activePlan = plans[activeIndex];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Fixed Top Bar */}
            <View style={styles.topBar}>
                <Ionicons name="arrow-back" size={18} color="#000" />
                <Text style={styles.topBarText}>Product Listing Plans</Text>
            </View>

            {/* Horizontal Scroll Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={wp("90%")}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingLeft: wp("5%"),
                    paddingRight: wp("5%"),
                }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                pagingEnabled
            >
                {plans.map((plan) => (
                    <View key={plan.id} style={styles.card}>
                        {/* Expiry tag fixed top-right */}
                        <View style={styles.expiryTag}>
                            <Text style={styles.expiryText}>
                                Expires on {plan.expiry}
                            </Text>
                        </View>

                        <Text style={styles.planTitle}>
                            {plan.title} – {plan.price}
                        </Text>
                        <Text style={styles.subText}>
                            Best for beginners looking to get started.
                        </Text>

                        {plan.features.map((feature, index) => (
                            <Text key={index} style={styles.feature}>
                                • {feature}
                            </Text>
                        ))}

                        {/* Note section full width attached bottom */}
                        <View style={styles.noteContainer}>
                            <Text style={styles.noteText}>
                                Note: Your use of Addvey helps us grow and improve for everyone. Thank you for being a
                                part of this journey! 🙏
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Fixed Bottom Section */}
            {!showPayment ? (
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            activePlan?.isActive ? styles.activeBtn : styles.normalBtn,
                        ]}
                        onPress={() => setShowPayment(true)}
                    >
                        <Text
                            style={[
                                styles.btnText,
                                activePlan?.isActive
                                    ? styles.activeBtnText
                                    : styles.normalBtnText,
                            ]}
                        >
                            {activePlan?.isActive ? "Activated Plan" : "Activate"}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.paymentContainer}>
                    {/* Left side */}
                    <View style={styles.paymentLeft}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.payText}>Pay using</Text>
                            <MaterialIcons name="arrow-drop-down" size={20} color="#6C63FF" />
                        </View>
                        {/* PayPal section below */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: hp("1%") }}>
                            <Image
                                source={require("../../assets/images/up.png")}
                                style={styles.paymentImage}
                            />
                            <Text style={styles.payOptionText}>PhonePe UPI</Text>
                        </View>
                    </View>

                    {/* Right side button */}
                    <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate('PaymentMethod')}>
                        <Text style={styles.payButtonText}>Pay ₹ 3</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("5%"),
        marginBottom: hp("2%"),
        marginTop: hp(5.8),
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: hp(1),
    },
    topBarText: {
        fontSize: wp("4%"),
        fontWeight: "600",
        marginLeft: wp("3%"),
    },
    card: {
        width: wp("80%"),
        marginHorizontal: wp("5%"),
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: wp("4%"),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        borderColor: "#ddd",
        borderWidth: 1,
        marginTop: hp(4),
        height: hp("65%"),
        position: "relative",
        overflow: "hidden",
    },
    expiryTag: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#32CD32",
        paddingVertical: hp("0.8%"),
        paddingHorizontal: wp("3%"),
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 12,
    },
    expiryText: {
        color: "#fff",
        fontSize: wp("2.5%"),
        fontWeight: "600",
    },
    planTitle: {
        fontSize: wp("4.5%"),
        fontWeight: "700",
        color: "#6C63FF",
        marginBottom: hp("1%"),
        marginTop: hp("4%"),
    },
    subText: {
        fontSize: wp("3%"),
        color: "#666",
        marginBottom: hp("1%"),
    },
    feature: {
        fontSize: wp("3.6%"),
        marginVertical: hp(1.5),
        color: "black",
    },
    noteContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#D9D9D959",
        padding: wp("3%"),
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
    },
    noteText: {
        fontSize: wp("2.8%"),
        color: "#6E533F",
        lineHeight: hp("2.5%"),
    },
    bottomSection: {
        position: "absolute",
        bottom: hp("7%"),
        left: 0,
        right: 0,
        alignItems: "center",
    },
    button: {
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("10%"),
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    normalBtn: {
        borderWidth: 1,
        borderColor: "#6C63FF",
        width: "60%",
        borderRadius: 25,
    },
    activeBtn: {
        borderWidth: 1,
        borderColor: "#6C63FF",
        width: "60%",
        borderRadius: 25,
    },
    btnText: {
        fontSize: wp("4%"),
        fontWeight: "600",
    },
    normalBtnText: {
        color: "#6C63FF",
    },
    activeBtnText: {
        color: "#6C63FF",
    },
    paymentContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: hp("2%"),
        paddingHorizontal: wp("5%"),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    paymentLeft: {
        flexDirection: "column", // now stacked vertically
        alignItems: "flex-start",
    },
    payText: {
        fontSize: wp("3.5%"),
        color: "#00000073",
        fontWeight: "500",
    },
    paymentImage: {
        width: wp("6%"),
        height: wp("6%"),
        resizeMode: "contain",
    },
    payOptionText: {
        fontSize: wp("3.5%"),
        marginLeft: wp("2%"),
        color: "#333",
        fontWeight: "500",
    },
    payButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.2%"),
        paddingHorizontal: wp("6%"),
        borderRadius: 10,
    },
    payButtonText: {
        color: "#fff",
        fontSize: wp("3.5%"),
        fontWeight: "600",
    },
});

export default ProductListingPlansScreen;
