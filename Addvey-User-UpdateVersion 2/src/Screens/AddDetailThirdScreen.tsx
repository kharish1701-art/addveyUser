import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    Switch,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const AddDetailThirdScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [selected, setSelected] = useState<string>("Respond in");
    const [phone] = useState("9392322767"); // read-only
    const [viaWhatsapp, setViaWhatsapp] = useState(true);
    const [timeValue, setTimeValue] = useState("1");
    const [phoneSelected, setPhoneSelected] = useState(false);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Topbar */}
            <View style={styles.topBar}>
                <View style={styles.leftSection}>
                    <Ionicons name="arrow-back" size={wp("4.5%")} color="#000" />
                    <Text style={styles.topTitle}>Contact Details</Text>
                </View>

                {/* Step progress */}
                <View style={styles.stepWrapper}>
                    <View style={styles.stepInner}>
                        <Text style={styles.stepText}>3 of 3</Text>
                    </View>
                </View>
            </View>

            {/* Ad ID */}
            <View style={styles.adIdBox}>
                <Text style={styles.adIdText}>AD ID : 2134354</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ---------------- Response Time ---------------- */}
                <Text style={styles.sectionTitle}>Response Time</Text>
                <View style={styles.section}>
                    {/* Option 1 */}
                    <TouchableOpacity
                        style={styles.optionRow}
                        onPress={() => setSelected("Respond Immediately")}
                    >
                        <Text style={styles.optionText}>Respond Immediately</Text>
                        <View
                            style={[
                                styles.radioOuter,
                                selected === "Respond Immediately" && styles.radioOuterSelected,
                            ]}
                        >
                            {selected === "Respond Immediately" && (
                                <View style={styles.radioInner} />
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Option 2 */}
                    <TouchableOpacity
                        style={[
                            styles.optionRow,
                            { borderTopWidth: 1, borderTopColor: "#f0f0f0" },
                        ]}
                        onPress={() => setSelected("Respond in")}
                    >
                        <Text style={styles.optionText}>Respond in</Text>
                        <View
                            style={[
                                styles.radioOuter,
                                selected === "Respond in" && styles.radioOuterSelected,
                            ]}
                        >
                            {selected === "Respond in" && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {selected === "Respond in" && (
                        <View style={styles.respondInBox}>
                            <Text style={styles.subText}>
                                We recommend 5 minutes for best results.
                            </Text>

                            {/* Input + Dropdown */}
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.inputBox}
                                    value={timeValue}
                                    onChangeText={setTimeValue}
                                    keyboardType="numeric"
                                />
                                <View style={styles.dropdownBox}>
                                    <Text style={styles.dropdownValue}>Hour</Text>
                                    <MaterialIcons
                                        name="arrow-drop-down"
                                        size={20}
                                        color="#6C63FF"
                                        style={{ marginLeft: wp(1) }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Option 3 */}
                    <TouchableOpacity
                        style={[
                            styles.optionRow,
                            { borderTopWidth: 1, borderTopColor: "#f0f0f0" },
                        ]}
                        onPress={() => setSelected("Custom date & time")}
                    >
                        <Text style={styles.optionText}>
                            Custom date & time (upto 7 days)
                        </Text>
                        <View
                            style={[
                                styles.radioOuter,
                                selected === "Custom date & time" &&
                                styles.radioOuterSelected,
                            ]}
                        >
                            {selected === "Custom date & time" && (
                                <View style={styles.radioInner} />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ---------------- Phone Number ---------------- */}
                <View style={styles.phoneHeaderRow}>
                    {/* Circular Select */}
                    <TouchableOpacity
                        style={[
                            styles.circleSelect,
                            phoneSelected && styles.circleSelected,
                        ]}
                        onPress={() => setPhoneSelected(!phoneSelected)}
                    >
                        {phoneSelected && (
                            <Ionicons name="checkmark" size={wp(3)} color="#fff" />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.sectionTitleInline}>Hide this number from customers on Addvey</Text>
                </View>

                <View style={styles.phoneRowBox}>
                    {/* Flag + Code */}
                    <View style={styles.flagBoxOuter}>
                        <Image
                            source={require("../../assets/images/ind.png")}
                            style={styles.flagIcon}
                        />
                        <Text style={styles.countryCode}>+91</Text>
                    </View>

                    {/* Number + Verified */}
                    <View style={styles.phoneBoxOuter}>
                        <TextInput
                            style={styles.phoneInput}
                            value={phone}
                            editable={false}
                        />
                        <View style={styles.verifiedBox}>
                            <MaterialCommunityIcons name="check-decagram-outline" size={16} color="#32CD32" />
                            <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                    </View>
                </View>

                {/* ---------------- WhatsApp ---------------- */}
                <View style={styles.whatsappRow}>
                    <Text style={styles.optionText}>Contact via WhatsApp</Text>
                    <Switch
                        value={viaWhatsapp}
                        onValueChange={setViaWhatsapp}
                        trackColor={{ false: "#E0E0E0", true: "#6C63FF7D" }}
                        thumbColor={viaWhatsapp ? "#6C63FF" : "#f4f3f4"}
                        ios_backgroundColor="#E0E0E0"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                </View>

                {/* WhatsApp Title + Subtitle */}
                <View style={{ marginTop: hp(1.2), marginBottom: hp(2), paddingHorizontal: wp(1) }}>
                    <Text style={styles.subTitle}>Primary contact number</Text>
                    <Text style={styles.subText}>
                        Customers, and Addvey may call on this number for support
                    </Text>
                </View>

                {/* ---------------- Links ---------------- */}
                <View style={styles.linksWrapper}>
                    <View style={styles.linksCard}>
                        <TouchableOpacity style={styles.linksRow} onPress={() => navigation.navigate("AddLink")}>
                            <Text style={styles.optionText}>Links</Text>
                            <MaterialIcons name="arrow-right" size={22} color="#6C63FF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.subText}>
                        Would you like to add your links to your profile? Customers can
                        contact them from the Addvey.
                    </Text>
                </View>
            </ScrollView>

            {/* ---------------- Fixed Bottom Section ---------------- */}
            <View style={styles.bottomSection}>
                <View style={styles.bottomLeft}>
                    <Image
                        source={require("../../assets/images/bottombutton.png")}
                        style={styles.bottomImage}
                    />
                    <Text style={styles.bottomText}>
                        I am authorised to make ad edits & responsible for the
                        information shared including ad details & prices
                    </Text>
                </View>

                {/* Button wrapper with tooltip */}
                <View style={styles.buttonWrapper}>
                    {/* Tooltip Bubble */}
                    <View style={styles.bubbleContainer}>
                        <Text style={styles.bubbleText}>
                            <Text style={styles.emoji}>😍</Text> Last Step!
                        </Text>
                        <Text style={styles.bubbleSubText}>You are almost there</Text>
                        <View style={styles.bubbleArrow} />
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity style={styles.bottomButton}>
                        <Text style={styles.bottomButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AddDetailThirdScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },

    // Topbar
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginTop: hp(4),
    },
    leftSection: { flexDirection: "row", alignItems: "center", gap: wp(2) },
    topTitle: {
        fontSize: wp("4%"), fontFamily: "Poppins-Medium", color: "#000",
        marginTop: hp(0.4),
    },

    stepWrapper: { alignItems: "flex-end" },
    stepInner: {
        backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: wp(4),
        alignItems: "center", justifyContent: "center", minHeight: hp(3.2),
        paddingTop: hp(0.3), borderColor: "#6C63FF", borderWidth: 2,
    },
    stepText: {
        fontSize: wp("2.8%"), fontFamily: "Poppins-Medium", color: "#6C63FF",
        textAlign: "center",
    },

    // AD ID Box
    adIdBox: {
        backgroundColor: "#D9D9D959", paddingVertical: hp(0.2),
        paddingHorizontal: wp(4), width: "100%",
        borderBottomWidth: 1, borderBottomColor: "#eee",
    },
    adIdText: {
        textAlign: "center", fontSize: wp("2.4%"),
        fontFamily: "Poppins-Medium", color: "#6E533F",
    },

    scrollContent: { paddingHorizontal: wp(3.5), paddingVertical: hp(4), paddingBottom: hp(12) },

    // Sections
    section: {
        backgroundColor: "#fff", borderRadius: 12, padding: wp(4),
        borderWidth: 1, borderColor: "#eee", marginBottom: hp(2),
    },
    sectionTitle: {
        fontSize: wp("4.5%"), fontFamily: "Poppins-Medium",
        color: "#000", marginBottom: hp(2), paddingHorizontal: wp(1),
    },
    sectionTitleInline: {
        fontSize: wp("2.8%"), fontFamily: "Poppins-Medium", color: "#000",
        marginLeft: wp(2),
    },
    optionRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", paddingVertical: hp(1.5),
    },
    optionText: {
        fontSize: wp("3.8%"), fontFamily: "Poppins-Medium", color: "#000",
    },
    subText: {
        fontSize: wp("2.5%"), fontFamily: "Poppins-Regular", color: "#666",
    },
    subTitle: {
        fontSize: wp("3.6%"), fontFamily: "Poppins-Medium", color: "#000",
        marginBottom: hp(0.3),
    },

    // Respond In
    inputRow: {
        flexDirection: "row", alignItems: "center",
        marginTop: hp(1.7), borderWidth: 1, borderColor: "#ccc",
        borderRadius: 6, overflow: "hidden", width: "100%",
    },
    inputBox: {
        flex: 1, paddingVertical: hp(1.2), paddingHorizontal: wp(4),
        fontSize: wp("3.4%"), fontFamily: "Poppins-Medium", color: "#000",
        textAlign: "left",
    },
    dropdownBox: {
        flexDirection: "row", alignItems: "center",
        paddingVertical: hp(1.2), paddingHorizontal: wp(5),
        borderLeftWidth: 1, borderLeftColor: "#ccc",
    },
    dropdownValue: {
        fontSize: wp("3.4%"), fontFamily: "Poppins-Medium", color: "#6C63FF",
    },
    radioOuter: {
        width: wp(4), height: wp(4), borderRadius: wp(3),
        borderWidth: 1, borderColor: "#00000080",
        alignItems: "center", justifyContent: "center",
    },
    radioOuterSelected: { borderColor: "#6C63FF", borderWidth: 3 },
    radioInner: {
        borderRadius: wp(2), backgroundColor: "#6C63FF",
    },
    respondInBox: {
        marginVertical: hp(1.5), backgroundColor: "#fff", borderRadius: 8,
        paddingBottom: hp(1),
    },

    // Phone Section
    phoneHeaderRow: {
        flexDirection: "row", alignItems: "center",
        marginBottom: hp(2.5),
        marginTop: hp(1.8),
        paddingHorizontal: wp(1)
    },
    circleSelect: {
        width: wp(5), height: wp(5), borderRadius: wp(3),
        alignItems: "center", justifyContent: "center",
        backgroundColor: '#D9D9D97D'
    },
    circleSelected: { backgroundColor: "#6C63FF" },
    phoneRowBox: {
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", marginBottom: hp(0.8), paddingHorizontal: wp(1)
    },
    flagBoxOuter: {
        flexDirection: "row", alignItems: "center",
        borderWidth: 1, borderColor: "#ccc",
        borderRadius: 8, paddingHorizontal: wp(3), paddingVertical: hp(1.2),
        marginRight: wp(2),
    },
    flagIcon: {
        width: wp("6%"), height: wp("6%"), resizeMode: "contain",
        marginRight: wp(1),
    },
    countryCode: {
        fontSize: wp("3.4%"), fontFamily: "Poppins-Medium", color: "#000", marginTop: hp(0.4), marginLeft: wp(0.8)
    },
    phoneBoxOuter: {
        flex: 1, flexDirection: "row", alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
        paddingHorizontal: wp(3),
    },
    phoneInput: {
        fontSize: wp("3.4%"),
        fontFamily: "Poppins-Regular", color: "#000",
        marginTop: hp(0.2)
    },
    verifiedBox: { flexDirection: "row", alignItems: "center" },
    verifiedText: {
        marginLeft: wp(1), fontSize: wp("3%"), fontFamily: "Poppins-Medium",
        color: "#32CD32",
    },

    whatsappRow: {
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", paddingHorizontal: wp(1)
    },

    // Links
    linksWrapper: { marginTop: hp(1), marginBottom: hp(0), paddingHorizontal: wp(1) },
    linksCard: {
        backgroundColor: "#fff", borderRadius: 8,
        borderWidth: 1, borderColor: "#eee", paddingVertical: hp(1.2), paddingHorizontal: wp(4), marginBottom: hp(1.6)
    },
    linksRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center",
    },

    // Bottom
    bottomSection: {
        backgroundColor: "#D9D9D959",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        padding: wp(4),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomLeft: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(1.5),
    },
    bottomImage: {
        width: wp("8%"),
        height: wp("8%"),
        resizeMode: "contain",
        marginRight: wp(2),
    },
    bottomText: {
        fontSize: wp("2.8%"),
        fontFamily: "Poppins-Medium",
        color: "#6E533F",
        lineHeight: hp(1.9),
    },

    buttonWrapper: {
        position: "relative",
        alignItems: "flex-end", // bubble right side
        justifyContent: "center",
    },

    bottomButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp(1.2),
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: hp(1.4),
        width: "100%", // full width button
    },
    bottomButtonText: {
        color: "#fff",
        fontSize: wp("3.8%"),
        fontFamily: "Poppins-Medium",
    },

    // Tooltip styles
    bubbleContainer: {
        backgroundColor: "#000",
        borderRadius: 8,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.8),
        position: "absolute",
        bottom: "90%", // button ke upar
        right: 0, // right side
        alignItems: "center",
    },
    bubbleText: {
        color: "#fff",
        fontFamily: "Poppins-SemiBold",
        fontSize: wp("3.4%"),
    },
    emoji: {
        fontSize: wp("3.6%"),
    },
    bubbleSubText: {
        color: "#fff",
        fontFamily: "Poppins-Regular",
        fontSize: wp("2.8%"),
    },
    bubbleArrow: {
        position: "absolute",
        bottom: -9,
        right: 55, // arrow right side
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
    },
});
