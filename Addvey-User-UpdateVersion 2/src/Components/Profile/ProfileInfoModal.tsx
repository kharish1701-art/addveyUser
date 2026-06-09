import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, Feather, Octicons, FontAwesome5 } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from '@expo/vector-icons';



interface ProfileInfoModalProps {
    visible: boolean;
    onClose: () => void;
    onReportPress: () => void
}

const ProfileInfoModal: React.FC<ProfileInfoModalProps> = ({
    visible,
    onClose,
    onReportPress
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                {/* Close Button Outside Modal */}
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Ionicons name="close" size={hp(3)} color="#000" />
                </TouchableOpacity>

                <View style={styles.modalContainer}>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: hp(4) }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Fixed Header */}
                        <View style={styles.header}>
                            <View style={styles.headerLeft}>
                                <Image
                                    source={require("../../../assets/images/carcard.png")}
                                    style={styles.profileImage}
                                />
                                <View style={{ marginLeft: wp(2) }}>
                                    <Text style={styles.name}>
                                        Nanda{" "}
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={hp(2)}
                                            color="#6C63FF"
                                        />
                                    </Text>
                                    <View style={styles.locationRow}>
                                        <Ionicons
                                            name="location-outline"
                                            size={hp(1.3)}
                                            color="#FF0303"
                                            style={{ marginRight: wp(1) }}
                                        />
                                        <Text>
                                            <Text style={styles.kmText}>
                                                1.2 km away
                                            </Text>
                                            <Text style={styles.locationText}>
                                                {" "}
                                                · Kphb Bagyanagar Colony
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.headerRight}>
                                <TouchableOpacity style={styles.iconBox}>
                                    <MaterialCommunityIcons name="navigation-variant" size={hp(2)} color="#6C63FF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Cover Image with Icons and Profile ID */}
                        <View style={styles.coverContainer}>
                            <Image
                                source={require("../../../assets/images/bigcar.png")}
                                style={styles.coverImage}
                            />
                            <View style={styles.coverIcons}>
                                <TouchableOpacity style={styles.coverIconBox}>
                                    <Ionicons
                                        name="heart-outline"
                                        size={hp(2)}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.coverIconBox}>
                                    <Feather name="share" size={hp(2)} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileIdBox}>
                                <Text style={styles.profileIdText}>
                                    PROFILE ID : 2134354
                                </Text>
                            </View>
                        </View>

                        {/* Report Section */}
                        

                        <Text style={styles.descText}>
                            Items, Prices, Photos, description are set directly by
                            seller. In case you see any incorrect information, please
                            report it to us.
                        </Text>

                        {/* Instructions Section */}
                        <Text style={styles.sectionTitle}>Instructions :</Text>
                        <View style={styles.instructionRow}>
                            <Octicons name="search" size={hp(1.8)} style={styles.icon} color="black" />
                            <Text style={styles.instructionText}>
                                Inspect the item and test before buying.
                            </Text>
                        </View>

                        <View style={styles.instructionRow}>
                            <FontAwesome5 name="money-check-alt" size={hp(1.6)}
                                color="#000"
                                style={styles.icon} />
                            <Text style={styles.instructionText}>
                                Check ownership documents carefully (if applicable).
                            </Text>
                        </View>

                        <View style={styles.instructionRow}>
                            <MaterialCommunityIcons name="cash" size={hp(2)}
                                color="green"
                                style={styles.icon} />
                            <Text style={styles.instructionText}>
                                Use secure payments; avoid paying upfront.
                            </Text>
                        </View>

                        {/* Disclaimer Section */}
                        <View style={styles.disclaimerContainer}>
                            <Text style={styles.disclaimerText}>
                                Disclaimer: Addvey verifies uploaded profile details, such as
                                contact information and availability preferences, to
                                improve profile accuracy. However, we do not verify the
                                identity, authenticity, or reliability of profile
                                owners. Any interaction or transaction is at your own
                                risk. If you encounter any issues, please contact our
                                customer support.
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.reportButton} onPress={() => {
                            onClose();
                            onReportPress();
                        }}>
                            <Octicons name="alert" style={{ marginRight: wp(1) }} size={hp(1.8)}
                                color="#fff" />
                            <Text style={styles.reportText}>Report Profile</Text>
                            {/* <MaterialIcons name="arrow-forward-ios" style={{ marginLeft: wp(1), marginTop: hp(0.3) }} size={hp(1.8)} color="red" /> */}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ProfileInfoModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    closeBtn: {
   alignSelf: "flex-end",
    marginBottom: hp(1),
    marginRight: wp(2),
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(1.5),
    elevation: 5,
  
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: wp(7),
        borderTopRightRadius: wp(7),
        paddingHorizontal: wp(5),
        paddingTop: hp(2),
        maxHeight: hp(85),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: hp(1),
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: wp(11),
        height: wp(11),
        borderRadius: wp(10),
    },
    name: {
        fontSize: hp(1.8),
        fontWeight: "600",
        color: "#000",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(0.5),
    },
    kmText: {
        color: "red",
        fontSize: hp(1.2),
    },
    locationText: {
        color: "#000",
        fontSize: hp(1.2),
    },
    iconBox: {
        backgroundColor: "#fff",
        borderRadius: wp(5),
        padding: wp(2),
        marginRight: wp(0.5),
        elevation: 2,
    },
    coverContainer: {
        position: "relative",
        marginTop: hp(1),
    },
    coverImage: {
        width: "100%",
        height: hp(19),
        borderRadius: wp(3),
    },
    coverIcons: {
        position: "absolute",
        top: hp(1.5),
        right: wp(2),
        flexDirection: "row",
    },
    coverIconBox: {
        backgroundColor: "rgba(0, 0, 0, 0.18)",
        borderRadius: wp(5),
        padding: wp(2),
        marginLeft: wp(1.5),
        borderColor: '#00000000',
        borderWidth: 1
    },
    profileIdBox: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#D9D9D99E",
        paddingVertical: hp(0.2),
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    profileIdText: {
        textAlign: "center",
        color: "#6E533F",
        fontSize: hp(1.2),
    },
    reportContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(2),
    alignContent:'center',
    padding:hp(2),
    borderRadius:8,
    backgroundColor:'green'
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
    reportText: {
        color: "#fff",
        fontSize: hp(1.6),
        marginLeft: wp(1),
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.5)
    },
    descText: {
        fontSize: hp(1.3),
        color: "#000000",
        marginTop: hp(1),
        lineHeight: hp(2),
        fontFamily: 'Poppins-Medium'
    },
    sectionTitle: {
        fontSize: hp(1.8),
        color: "#000000",
        marginTop: hp(2),
        fontFamily: 'Poppins-Medium'
    },
    instructionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(2),
    },
    icon: {
        marginRight: wp(2),
    },
    instructionText: {
        fontSize: hp(1.4),
        color: "#333",
        flexShrink: 1,
    },
    disclaimerContainer: {
        padding: wp(3),
        borderRadius: wp(2),
        marginTop: hp(2),
        borderColor: '#66666680',
        borderWidth: 1
    },
    disclaimerTitle: {
        fontSize: hp(1.6),
        fontWeight: "700",
        color: "#000",
        marginBottom: hp(0.5),
    },
    disclaimerText: {
        fontSize: hp(1.2),
        color: "#6E533F",
        lineHeight: hp(2),
        fontFamily: 'Poppins-Medium'
    },
});
