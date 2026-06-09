import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";

const BuySellProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [selectedLang, setSelectedLang] = useState("English");
    const route = useRoute();
    const { data }: any = route.params || {};
    const [imageError, setImageError] = useState(false);
    console.log(data);
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#D9D9D940" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={wp("4.5%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Buy/Sell Profile</Text>
                <View style={styles.topBarRight}>
                    {/* QR Code with white bg */}
                    <TouchableOpacity style={styles.qrWrapper} onPress={() => navigation.navigate('QRCode')}>
                        <Image
                            source={require("../../assets/images/qrcode.png")}
                            style={styles.profileImageTopbar}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("BuySellContactUs")}
                    >
                        <Image
                            source={require("../../assets/images/verify.png")}
                            style={styles.profileImageTopbar}
                        />
                    </TouchableOpacity>
                </View>
            </View>



            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.row}>
                    <Image
                        source={
                            (data?.profile?.image && !imageError)
                                ? {
                                    uri: data.profile.image.startsWith("http")
                                        ? data.profile.image
                                        : IMAGE_BASE_URL + data.profile.image
                                }
                                : require("../../assets/images/bagwan.png")
                        }
                        style={styles.profileImage}
                        onError={() => setImageError(true)}
                    />
                    <View style={styles.profileDetails}>
                        <View style={styles.row}>
                            <Text style={styles.name}>{data?.profile?.name}</Text>
                            <TouchableOpacity
                                style={styles.verifyBadge}
                            // onPress={() => navigation.navigate("Verification")}
                            >
                                <Image
                                    source={require("../../assets/images/save.png")}
                                    style={styles.verifyIcon}
                                />
                                <Text style={styles.verifyText}>Verified</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.phone}>{data?.phone}</Text>
                    </View>
                </View>

                {/* Languages */}
                <View style={styles.detailsBlock}>
                    <Text style={styles.langLabel}>
                        Languages I Know{" "}
                        <Feather name="arrow-right" size={10} color="#6C63FF" />
                    </Text>
                    <Text style={styles.languages}>
                        Telugu • Hindi • English
                    </Text>
                </View>

                {/* Partner ID with border top + image */}
                <View style={styles.partnerIdContainer}>
                    <Text style={styles.partnerId}>
                        Addvey Partner ID :{" "}
                        <Text style={{ fontWeight: "600" }}>{data?.profile?.partnerId}</Text>
                    </Text>
                    <Image
                        source={require("../../assets/images/profilesave.png")}
                        style={styles.partnerIdIcon}
                    />
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.verify}>
                    <View style={styles.topRow}>
                        <Text style={styles.text}>Incomplete details</Text>
                        <Ionicons
                            name="arrow-forward-sharp"
                            size={hp("1.8%")}
                            color="#6C63FF"
                        />
                    </View>

                    {/* Bottom Row */}
                    <View style={styles.bottomRow}>
                        <View>
                            <Text style={styles.title}>Add & verify your Email</Text>
                            <Text style={styles.subtitle}>Add & verify your Email</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("BuySellSetingsProfile")}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomRowBottom}>
                        <View>
                            <Text style={styles.title}>Social media links</Text>
                            <Text style={styles.subtitle}>Get more contacts</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("BuySellSetingsProfile")}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                {/* New Boxes Section */}
                <View style={styles.boxContainer}>
                    <View style={styles.box}>
                        <Ionicons name="eye-outline" size={24} color="#6E533F" />
                        <Text style={styles.boxTextFiger}>100</Text>
                        <Text style={styles.boxText}>Views</Text>
                    </View>
                    <View style={styles.box}>
                        <Ionicons name="heart" size={24} color="red" />
                        <Text style={styles.boxTextFiger}>10000</Text>
                        <Text style={styles.boxText}>Likes</Text>
                    </View>
                    <View style={styles.box}>
                        <Ionicons name="share" size={24} color="#6E533F" />
                        <Text style={styles.boxTextFiger}>1000</Text>
                        <Text style={styles.boxText}>Shares</Text>
                    </View>
                    <View style={styles.box}>
                        <Ionicons name="person-circle-outline" size={24} color="#6E533F" />
                        <Text style={styles.boxTextFiger}>10000</Text>
                        <Text style={styles.boxText}>Followers</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default BuySellProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D9D9D940",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("2%"),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginTop: hp(4),
    },
    topBarTitle: {
        fontSize: wp("4%"),
        flex: 1,
        marginLeft: wp(3),
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.5),
    },
    topBarRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
    },
    qrWrapper: {
        backgroundColor: "#fff",
        padding: wp(1.5),
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        padding: wp("4%"),
        paddingBottom: hp("4%"),
    },
    profileCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: wp("4%"),
        paddingHorizontal: wp(6),
        marginBottom: hp("1%"),
        marginHorizontal: wp(4),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: wp("16%"),
        height: wp("16%"),
        borderRadius: wp("9%"),
        resizeMode: "contain",
    },
    profileDetails: {
        marginLeft: wp("3.2%"),
        justifyContent: "center",
    },
    profileImageTopbar: {
        width: wp("5%"),
        height: wp("5%"),
        resizeMode: "contain",
    },
    name: {
        fontSize: wp("4%"),
        fontWeight: "600",
        marginRight: wp("2%"),
        fontFamily: "Poppins-Medium",
    },
    verifyBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("2%"),
        paddingVertical: hp("0.4%"),
        borderRadius: 14,
        borderColor: "#6C63FFAD",
        borderWidth: 1,
    },
    verifyIcon: {
        width: wp("3%"),
        height: wp("3%"),
        marginRight: wp("1%"),
        resizeMode: "contain",
    },
    verifyText: {
        fontSize: wp("2.5%"),
        color: "#6C63FFAD",
    },
    phone: {
        fontSize: wp("2.8%"),
        color: "#000000",
        marginTop: hp("0.2%"),
    },
    detailsBlock: {
        marginTop: hp("1%"),
        alignItems: "flex-start",
    },
    langLabel: {
        fontSize: wp("3%"),
        color: "#6E533F",
        marginBottom: hp("0.5%"),
    },
    languages: {
        fontSize: wp("3%"),
        marginTop: hp(0.4),
        fontFamily: "Poppins-Medium",
    },
    partnerIdContainer: {
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp("2%"),
        paddingTop: hp("1%"),
    },
    partnerId: {
        fontSize: wp("3.5%"),
        color: "#6E533F",
        textAlign: "center",
    },
    partnerIdIcon: {
        width: wp("5%"),
        height: wp("5%"),
        resizeMode: "contain",
        marginLeft: wp("2%"),
    },
    text: {
        fontSize: wp("3.5%"),
        color: "#333",
        fontFamily: "Poppins-Regular",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bottomRowBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp(6),
    },
    title: {
        fontSize: wp("3.5%"),
        color: "#6C63FF",
        fontFamily: "Poppins-Medium",
    },
    subtitle: {
        fontSize: wp("3.5%"),
        color: "#666",
    },
    button: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("4%"),
        borderRadius: wp("5%"),
    },
    buttonText: {
        color: "#fff",
        fontSize: wp("3%"),
        fontWeight: "600",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: hp("1.5%"),
    },
    verify: {
        width: wp("100%"),
        alignSelf: "center",
        padding: wp("4%"),
        backgroundColor: "#f9f9f9",
        marginBottom: hp("3%"),
    },

    // New Boxes Section
    boxContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: hp(1),
    },
    box: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: wp("4%"),
        marginBottom: hp(2),
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
    },
    boxImage: {
        width: wp(10),
        height: wp(10),
        resizeMode: "contain",
        marginBottom: hp(1),
    },
    boxText: {
        fontSize: wp(3.5),
        fontFamily: "Poppins-Medium",
        color: "#333",
    },
    boxTextFiger: {
        fontSize: wp(4.5),
        fontFamily: "Poppins-Medium",
        color: "#6C63FF",
        marginTop: hp(1)
    }
});
