import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from '@expo/vector-icons';
import ChatCardScreen from "../../Components/Chat/ChatCard";


interface InfoReportScreenProps {
    visible: boolean;
    onClose: () => void;
}

const InfoReportScreen: React.FC<InfoReportScreenProps> = ({
    visible,
    onClose,
    reportPress
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                {/* Close button outside modal */}
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Ionicons name="close-circle" size={hp(5.2)} color="white" />
                </TouchableOpacity>

                {/* Modal content */}
                <View style={styles.modalContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <ChatCardScreen />

                        {/* <Text onPress={()=>reportPress()} style={styles.title}><Feather name="alert-triangle" size={16} color="#FF0303" /> Report Ad</Text> */}
                        <Text style={styles.subtitle}>
                            Items, Prices, Photos, description are set directly by seller. In
                            case you see any incorrect information, please report it to us.
                        </Text>

                        <Text style={styles.sectionTitle}>Instructions :</Text>

                        <View style={styles.instructionItem}>
                            <FontAwesome5 name="search" size={14} color="black" />
                            <Text style={styles.instructionText}>
                                Inspect the item and test before buying.
                            </Text>
                        </View>

                        <View style={styles.instructionItem}>
                            <MaterialIcons name="description" size={14} color="black" />
                            <Text style={styles.instructionText}>
                                Check ownership documents carefully (if applicable).
                            </Text>
                        </View>

                        <View style={styles.instructionItem}>
                            <Ionicons name="card-outline" size={14} color="black" />
                            <Text style={styles.instructionText}>
                                Use secure payments; avoid paying upfront.
                            </Text>
                        </View>

                        <View style={styles.disclaimerBox}>
                            <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
                            <Text style={styles.disclaimerText}>
                                Advey only verifies basic ad details, such as category, location,
                                and contact information, to improve listing accuracy. However, we
                                do not verify the authenticity, quality, or performance of the
                                products and services listed. Any transaction made is at your own
                                risk. If you face any issues with a listing, you can contact our
                                customer support for assistance.
                            </Text>
                        </View>

                    </ScrollView>
                    <TouchableOpacity style={styles.reportButton} onPress={reportPress}>
                        <Feather name="alert-triangle" size={18} color="#fff" />
                        <Text style={styles.reportButtonText}>Report Ad</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalContainer: {
        width: wp("100%"),
        backgroundColor: "#fff",
        borderTopLeftRadius: wp("5%"),
        borderTopRightRadius: wp("5%"),
        padding: wp("5%"),
        maxHeight: hp("75%"),
    },
    closeBtn: {
        alignSelf: 'flex-end',
        zIndex: 10,
    },
    title: {
        fontSize: wp("4.5%"),
        marginBottom: wp("2%"),
        color: "#FF0303",
        fontFamily: 'Poppins-Medium'
    },
    subtitle: {
        fontSize: wp("2.9%"),
        color: "#000000",
        marginBottom: wp("3%"),
        fontFamily: 'Poppins-Medium'
    },
    sectionTitle: {
        fontSize: wp("4%"),
        marginBottom: wp("4%"),
        fontFamily: 'Poppins-Medium',
    },
    instructionItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: wp("2%"),
    },
    instructionText: {
        fontSize: wp("3%"),
        marginLeft: wp("2%"),
        color: "#000000",
        flexShrink: 1,
        fontFamily: 'Poppins-Medium'
    },
    disclaimerBox: {
        marginTop: wp("4%"),
        backgroundColor: "#f7f7f7",
        borderRadius: wp("2%"),
        padding: wp("3%"),
        borderColor: '#66666680',
        borderWidth: 1
    },
    disclaimerTitle: {
        fontWeight: "bold",
        fontSize: wp("3.7%"),
        marginBottom: wp("1%"),
        color: "#6E533F",
        fontFamily: 'Poppins-Medium'
    },
    disclaimerText: {
        fontSize: wp("2.5%"),
        color: "#6E533F",
        fontFamily: 'Poppins-Medium'
    },
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0303',
        paddingVertical: hp(1.8),
        borderRadius: wp(3),
        marginTop: hp(2),
        gap: wp(2),
    },
    reportButtonText: {
        color: '#fff',
        fontSize: wp(4),
        fontFamily: 'Poppins-Medium',
    },
});

export default InfoReportScreen;