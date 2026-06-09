import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AddCardPreview from "../MainHome/AddCardPreview";

interface ExampleModalProps {
    visible: boolean;
    onClose: () => void;
}

const ExampleModal: React.FC<ExampleModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Tap outside to close */}
                <TouchableOpacity style={styles.backdrop} onPress={onClose} />

                {/* Modal Content */}
                <View style={styles.modalContainer}>
                    {/* Close icon (floating outside) */}
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>

                    {/* Heading Section */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.heading}>Example Listing</Text>
                        <View style={styles.underline} />
                    </View>

                    {/* Body Content */}
                    <View style={styles.bodyContent}>
                        {/* Wrapper added to ensure left-right space */}
                        <View style={styles.cardWrapper}>
                            <AddCardPreview />
                        </View>
                    </View>

                    {/* Fixed Bottom Button Section */}
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.confirmBtn} onPress={onClose}>
                            <Text style={styles.confirmText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ExampleModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    backdrop: {
        flex: 1,
        width: "100%",
    },
    modalContainer: {
        height: hp("70%"),
        backgroundColor: "#fff",
        borderTopLeftRadius: wp("5%"),
        borderTopRightRadius: wp("5%"),
        paddingHorizontal: wp("5%"),
        paddingTop: hp("3%"),
        position: "relative",
    },
    closeIcon: {
        position: "absolute",
        top: hp("-6%"),
        right: wp("4%"),
        backgroundColor: "#fff",
        borderRadius: wp("5%"),
        padding: wp("1.5%"),
        elevation: 4,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: hp("2%"),
    },
    heading: {
        fontSize: wp("6%"),
        color: "#6C63FF",
        fontFamily: "Boogaloo-Regular",
    },
    underline: {
        height: 1,
        width: "25%",
        backgroundColor: "#6C63FF",
        marginTop: hp("0.8%"),
        borderRadius: wp("1%"),
    },
    bodyContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cardWrapper: {
        width: "100%",
        paddingHorizontal: wp("1%"),
        paddingTop: hp(2)
    },
    bottomContainer: {
        backgroundColor: "#fff",
        paddingVertical: hp("2%"),
    },
    confirmBtn: {
        backgroundColor: "#6C63FF",
        borderRadius: wp("4%"),
        paddingVertical: hp("1.5%"),
        alignItems: "center",
        marginHorizontal: wp("3%"),
    },
    confirmText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
});
