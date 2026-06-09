// PaymentMethodScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
    TextInput,
    TouchableWithoutFeedback,
    StatusBar
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const PaymentMethodScreen = () => {
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <Ionicons
                        name="arrow-back"
                        size={hp("2%")}
                        style={{ marginRight: wp(4) }}
                        color="#000"
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.topTitle}>Select Payment Method</Text>
                    <Text style={styles.subTitle}>Amount to pay : ₹ 50</Text>
                </View>
                <View style={{ width: wp("8%") }} />
            </View>

            {/* Scroll Content */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: hp("12%") }}
                showsVerticalScrollIndicator={false}
            >
                {/* Wallet Balance */}
                <TouchableOpacity style={styles.walletCard}>
                    <View style={styles.row}>
                        <Image
                            source={require("../../assets/images/walet.png")}
                            style={styles.icon}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.walletTitle}>Available balance</Text>
                            <Text style={styles.walletAmount}>₹ 3</Text>
                        </View>
                        <Ionicons
                            name="ellipse-outline"
                            size={hp("2.8%")}
                            color="#6C63FF"
                        />
                    </View>
                </TouchableOpacity>

                {/* UPI Section */}
                <Text style={styles.sectionTitle}>UPI</Text>
                <TouchableOpacity style={styles.listItem}>
                    <Image
                        source={require("../../assets/images/upi.png")}
                        style={styles.listIcon}
                    />
                    <Text style={styles.listText}>PhonePe UPI</Text>
                    <MaterialIcons name="arrow-right" size={18} color="#6C63FF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem}>
                    <Image
                        source={require("../../assets/images/googlepay.png")}
                        style={styles.listIcon}
                    />
                    <Text style={styles.listText}>Google Pay UPI</Text>
                    <MaterialIcons name="arrow-right" size={18} color="#6C63FF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem}>
                    <Image
                        source={require("../../assets/images/paytm.png")}
                        style={styles.listIcon}
                    />
                    <Text style={styles.listText}>Paytm UPI</Text>
                    <MaterialIcons name="arrow-right" size={18} color="#6C63FF" />
                </TouchableOpacity>

                {/* Add new UPI */}
                <TouchableOpacity style={styles.listItem}>
                    <Image
                        source={require("../../assets/images/upid.png")}
                        style={styles.listIcon}
                    />
                    <Text style={styles.listText}>Add new UPI ID</Text>
                    <TouchableOpacity onPress={() => setShowUpiModal(true)}>
                        <Text style={styles.addText}>ADD</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Fixed Cards Section */}
            <View style={styles.bottomCardSection}>
                <Text style={styles.sectionTitle}>CARDS</Text>
                <TouchableOpacity style={styles.listItem}>
                    <Image
                        source={require("../../assets/images/card.png")}
                        style={styles.listIcon}
                    />
                    <Text style={styles.listText}>Add credit or debit cards</Text>
                    <TouchableOpacity onPress={() => setShowCardModal(true)}>
                        <Text style={styles.addText}>ADD</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>

            {/* Modal for Add UPI ID */}
            <Modal
                visible={showUpiModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowUpiModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.closeIconOutside}
                        onPress={() => setShowUpiModal(false)}
                    >
                        <Ionicons name="close" size={hp("3%")} color="black" />
                    </TouchableOpacity>

                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add new UPI</Text>
                        <TextInput
                            placeholder="example@upi"
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Verify and Pay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for Add Card */}
            <Modal
                visible={showCardModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCardModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.closeIconOutsideCard}
                        onPress={() => setShowCardModal(false)}
                    >
                        <Ionicons name="close" size={hp("3%")} color="black" />
                    </TouchableOpacity>

                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add new CARD</Text>

                        {/* Card Number Input with Icon */}
                        <View style={styles.inputWithIcon}>
                            <Ionicons name="card-outline" size={hp("2.2%")} color="#666" style={{ marginRight: wp(2) }} />
                            <TextInput
                                placeholder="Card Number"
                                style={styles.flexInput}
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Row: Expiry + CVV */}
                        <View style={styles.rowInputs}>
                            <TextInput
                                placeholder="MM/YY"
                                style={[styles.flexInputBox, { marginRight: wp(2) }]}
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                            <TextInput
                                placeholder="CVV"
                                style={styles.flexInputBox}
                                placeholderTextColor="#999"
                                secureTextEntry
                                keyboardType="numeric"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setShowCardModal(false);
                                setShowSuccessModal(true);
                            }}
                        >
                            <Text style={styles.buttonText}>Proceed to Pay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowSuccessModal(false)}>
                    <View style={styles.successOverlay}>
                        <View style={styles.successBox}>
                            <Ionicons name="checkmark-circle" size={hp("12%")} color="#32CD32" />
                            <Text style={styles.successTitle}>Payment Successful</Text>
                            <Text style={styles.successSubtitle}>Your plan is now active</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("5%"),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
        marginTop: hp(6),
        paddingBottom: hp(2),
    },
    topTitle: {
        fontSize: hp("1.8%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
    },
    subTitle: { fontSize: hp("1.2%"), color: "#666" },
    scrollContainer: { flex: 1, paddingHorizontal: wp("5%"), paddingTop: hp("2%") },
    walletCard: {
        borderWidth: 1,
        borderColor: "#6C63FF",
        borderRadius: wp("3%"),
        padding: wp("4%"),
        marginBottom: hp("2%"),
        backgroundColor: "#6C63FF0A",
    },
    row: { flexDirection: "row", alignItems: "center" },
    walletTitle: { fontSize: hp("1.6%"), color: "#444" },
    walletAmount: { fontSize: hp("2%"), fontWeight: "700", color: "#000" },
    icon: {
        width: wp("10%"),
        height: wp("10%"),
        marginRight: wp("4%"),
        resizeMode: "contain",
    },
    sectionTitle: {
        fontSize: hp("1.8%"),
        fontWeight: "600",
        color: "#555",
        marginTop: hp("1%"),
        marginBottom: hp("1%"),
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp("2%"),
    },
    listIcon: {
        width: wp("8%"),
        height: wp("8%"),
        resizeMode: "contain",
        marginRight: wp("4%"),
    },
    listText: { flex: 1, fontSize: hp("1.6%"), color: "#000" },
    addText: { fontSize: hp("1.4%"), color: "#6C63FF", fontWeight: "600" },
    bottomCardSection: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("1.5%"),
        backgroundColor: "#fff",
        marginBottom: hp(2),
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: wp("5%"),
        borderTopLeftRadius: wp("5%"),
        borderTopRightRadius: wp("5%"),
    },
    closeIconOutside: {
        position: "absolute",
        top: hp("67%"),
        right: wp("3%"),
        zIndex: 10,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: wp(1),
    },
    closeIconOutsideCard: {
        position: "absolute",
        top: hp("63%"),
        right: wp("3%"),
        zIndex: 10,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: wp(1),
    },
    modalTitle: {
        fontSize: hp("2%"),
        fontWeight: "600",
        marginBottom: hp("2%"),
        color: "#000",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp("3%"),
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1.5%"),
        fontSize: hp("1.6%"),
        marginBottom: hp("2%"),
        color: "#000",
    },
    button: {
        backgroundColor: "#6C63FF",
        borderRadius: wp("4%"),
        paddingVertical: hp("1.2%"),
        alignItems: "center",
        marginTop: hp("1.5%"),
    },
    buttonText: {
        fontSize: hp("1.6%"),
        color: "#fff",
        fontWeight: "600",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.3),
    },
    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp("3%"),
        paddingHorizontal: wp("3%"),
        marginBottom: hp("2%"),
    },
    flexInput: {
        flex: 1,
        fontSize: hp("1.6%"),
        color: "#000",
        paddingVertical: hp("1.2%"),
    },
    rowInputs: { flexDirection: "row", justifyContent: "space-between" },
    flexInputBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp("3%"),
        paddingHorizontal: wp("3%"),
        fontSize: hp("1.6%"),
        color: "#000",
        paddingVertical: hp("1.2%"),
    },

    /** Success Modal Styles */
    successOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    successBox: {
        backgroundColor: "white",
        padding: wp("8%"),
        borderRadius: wp("5%"),
        alignItems: "center",
        width: wp("80%"),
    },
    successTitle: {
        fontSize: hp("2%"),
        color: "#000000",
        marginTop: hp("2%"),
        fontFamily: 'Poppins-Medium'
    },
    successSubtitle: {
        fontSize: hp("1.2%"),
        color: "#000000",
        textAlign: "center",
        fontFamily: 'Poppins-Regular'
    },
});
