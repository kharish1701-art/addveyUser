import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Modal,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

const ProfileUpdateScreen = () => {
    const navigation = useNavigation<any>();
    const [name, setName] = useState("Nanda kumar");
    const [gender, setGender] = useState("Male");
    const [dob, setDob] = useState("30 Sep 2002");
    const [mobile, setMobile] = useState("+91 9392322767");
    const [email, setEmail] = useState("nk9392322@gmail.com");
    const [languages, setLanguages] = useState("English, Telugu, Tamil");
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otp1, setOtp1] = useState("");
    const [otp2, setOtp2] = useState("");

    // Open Camera
    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Camera permission is required!");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={16} color="black" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: hp("15%") }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Image */}
                <View style={styles.profileContainer}>
                    <View style={styles.profileCircle}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons name="person" size={70} color="#00000099" />
                        )}

                        {/* Camera Icon with Dashed Border */}
                        <TouchableOpacity
                            style={styles.cameraIconWrapper}
                            onPress={openCamera}
                        >
                            <Svg
                                height={wp("9%")}
                                width={wp("9%")}
                                style={StyleSheet.absoluteFill}
                            >
                                <Circle
                                    cx="50%"
                                    cy="50%"
                                    r={wp("4.5%") - 1.5}
                                    stroke="#6C63FF"
                                    strokeWidth="1"
                                    strokeDasharray="2,3"
                                    fill="none"
                                />
                            </Svg>
                            <MaterialCommunityIcons
                                name="camera-outline"
                                size={18}
                                color="#6C63FF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                    {/* Name */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Name*</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Gender */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Gender</Text>
                        <TextInput
                            style={styles.input}
                            value={gender}
                            onChangeText={setGender}
                        />
                        <Ionicons
                            name="male-female"
                            size={16}
                            color="gray"
                            style={styles.inputIcon}
                        />
                    </View>

                    {/* DOB */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            value={dob}
                            onChangeText={setDob}
                        />
                        <Ionicons
                            name="calendar-outline"
                            size={16}
                            color="gray"
                            style={styles.inputIcon}
                        />
                    </View>

                    {/* Mobile */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.labelIconRow}>
                            <Ionicons
                                name="call-outline"
                                size={12}
                                color="gray"
                                style={{ marginRight: 4 }}
                            />
                            <Text style={styles.labelText}>Mobile</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={mobile}
                            onChangeText={setMobile}
                        />
                        <TouchableOpacity style={styles.verifyBtnMobile}>
                            <Image
                                source={require("../../assets/images/verifygreen.png")}
                                style={{
                                    marginRight: 4,
                                    width: wp(3),
                                    height: hp(2),
                                    resizeMode: "contain",
                                    marginTop: hp(0.7),
                                }}
                            />
                            <Text
                                style={{
                                    color: "#32CD32",
                                    fontWeight: "600",
                                    fontSize: wp("2.8%"),
                                    marginTop: hp(0.7),
                                }}
                            >
                                Verified
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Email */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.labelIconRow}>
                            <Ionicons
                                name="mail-outline"
                                size={12}
                                color="gray"
                                style={{ marginRight: 4 }}
                            />
                            <Text style={styles.labelText}>Email</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TouchableOpacity
                            style={styles.verifyBtn}
                            onPress={() => setOtpModalVisible(true)}
                        >
                            <Text
                                style={{
                                    color: "#6C63FF",
                                    fontWeight: "600",
                                    fontSize: wp("2.8%"),
                                }}
                            >
                                Verify
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Languages */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.labelIconRow}>
                            <Ionicons
                                name="language"
                                size={12}
                                color="gray"
                                style={{ marginRight: 4 }}
                            />
                            <Text style={styles.labelText}>Languages</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={languages}
                            onChangeText={setLanguages}
                        />
                        <Ionicons
                            name="create-outline"
                            size={14}
                            color="#6B4EFF"
                            style={styles.inputIcon}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Update Button */}
            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity
                    style={styles.updateBtn}
                    onPress={() => {

                        navigation.navigate("PANCardUplaod")
                    }}
                >
                    <Text style={styles.updateText}>Update Profile</Text>
                </TouchableOpacity>
            </View>

            {/* OTP Modal */}
            <Modal
                transparent={true}
                visible={otpModalVisible}
                animationType="slide"
                onRequestClose={() => setOtpModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>OTP Verification</Text>

                        <Text style={styles.otpSubText}>
                            Enter OTP sent to
                        </Text>
                        <Text style={styles.otpToText}>{mobile}</Text>

                        <View style={styles.otpInputWrapper}>
                            <TextInput
                                style={styles.otpInput}
                                placeholder="OTP"
                                value={otp1}
                                onChangeText={setOtp1}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity>
                                <Text style={styles.resendText}>Resend</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.otpSubText, { marginTop: hp(2) }]}>
                            Enter OTP sent to {" "} <Text style={styles.otpToText}>addvey.app@gmail.com</Text>
                        </Text>


                        <View style={styles.otpInputWrapper}>
                            <TextInput
                                style={styles.otpInput}
                                placeholder="OTP"
                                value={otp2}
                                onChangeText={setOtp2}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity>
                                <Text style={styles.resendText}>Resend</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setOtpModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Verify</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProfileUpdateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D9D9D94D",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("5%"),
        paddingTop: hp("4%"),
        paddingBottom: hp("1%"),
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        marginTop: hp(1),
    },
    titleContainer: {
        flex: 1,
        marginLeft: wp("3%"),
    },
    headerTitle: {
        fontSize: wp("4%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.3),
    },
    profileContainer: {
        alignItems: "center",
        marginTop: hp("10%"),
    },
    profileCircle: {
        width: wp("35%"),
        height: wp("35%"),
        borderRadius: wp("18%"),
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: wp("15%"),
    },
    cameraIconWrapper: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: wp("9%"),
        height: wp("9%"),
        borderRadius: wp("4.5%"),
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        marginTop: hp("5%"),
        paddingHorizontal: wp("5%"),
    },
    inputWrapper: {
        marginBottom: hp("3%"),
        position: "relative",
    },
    label: {
        position: "absolute",
        top: -hp("1%"),
        left: wp("5%"),
        fontSize: wp("2.8%"),
        color: "#00000099",
        fontWeight: "600",
        zIndex: 1,
    },
    labelIconRow: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: -hp("1%"),
        left: wp("3%"),
        paddingHorizontal: wp("1%"),
        zIndex: 2,
    },
    labelText: {
        fontSize: wp("2.8%"),
        color: "#00000099",
        fontWeight: "600",
    },
    input: {
        borderRadius: 8,
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("3%"),
        fontSize: wp("3.5%"),
        backgroundColor: "#fff",
    },
    inputIcon: {
        position: "absolute",
        right: wp("3%"),
        top: "30%",
    },
    verifyBtn: {
        position: "absolute",
        right: wp("3%"),
        top: "30%",
        flexDirection: "row",
        alignItems: "center",
    },
    verifyBtnMobile: {
        position: "absolute",
        right: wp("3%"),
        top: "18%",
        flexDirection: "row",
        alignItems: "center",
    },
    fixedButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingVertical: hp("3%"),
        paddingHorizontal: wp("5%"),
        borderTopWidth: 1,
        borderColor: "#eee",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    updateBtn: {
        backgroundColor: "#6B4EFF",
        borderRadius: 20,
        paddingVertical: hp("1.8%"),
        alignItems: "center",
    },
    updateText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: wp("5%"),
    },
    modalTitle: {
        fontSize: wp("4.2%"),
        color: "#000",
        marginBottom: hp("1%"),
        textAlign: "left",
        fontFamily: 'Poppins-Medium'
    },
    otpSubText: {
        fontSize: wp("3%"),
        color: "#00000099",
        marginBottom: hp("1%"),
    },
    otpToText: {
        fontSize: wp("3.2%"),
        fontWeight: "600",
        color: "#000",
        marginBottom: hp("1%"),
    },
    otpInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: hp("1%"),
    },
    otpInput: {
        flex: 1,
        paddingVertical: hp("0.8%"),
        fontSize: wp("3.5%"),
    },
    resendText: {
        color: "#6C63FF",
        fontWeight: "600",
        fontSize: wp("3%"),
        marginLeft: wp("2%"),
    },
    modalButton: {
        backgroundColor: "#6B4EFF",
        paddingVertical: hp("1.4%"),
        borderRadius: 12,
        marginTop: hp("2%"),
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: wp("3.8%"),
        fontWeight: "600",
    },
});
