// GovernmentIDScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    StatusBar,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const GovernmentIDScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [selectedID, setSelectedID] = useState("PAN CARD");
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [panNumber, setPanNumber] = useState("");

    const openCamera = async (type: "front" | "back") => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            alert("Camera permission is required");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            if (type === "front") {
                setFrontImage(result.assets[0].uri);
            } else {
                setBackImage(result.assets[0].uri);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Topbar */}
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={wp("6%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Your Government ID</Text>
                <View style={{ width: wp("6%") }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Select ID */}
                <Text style={styles.label}>Select ID</Text>
                <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{selectedID}</Text>
                    <Ionicons name="chevron-down" size={wp("4%")} color="#6C63FF" />
                </TouchableOpacity>
                <Text style={styles.hint}>Only one ID required</Text>

                {/* Upload Images */}
                <Text style={styles.uploadLabel}>Upload Pan card Images</Text>
                <View style={styles.uploadContainer}>
                    {/* Front */}
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={() => openCamera("front")}
                    >
                        {frontImage ? (
                            <Image source={{ uri: frontImage }} style={styles.previewImage} />
                        ) : (
                            <>
                                <Image source={require('../../assets/images/camera.png')} style={styles.cameraImg} />
                                <Text style={styles.uploadText}>Front</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Back */}
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={() => openCamera("back")}
                    >
                        {backImage ? (
                            <Image source={{ uri: backImage }} style={styles.previewImage} />
                        ) : (
                            <>
                                <Image source={require('../../assets/images/camera.png')} style={styles.cameraImg} />
                                <Text style={styles.uploadText}>Back</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Enter PAN Number */}
                <Text style={styles.label}>Enter Pan Number</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={panNumber}
                    onChangeText={setPanNumber}
                />
                <Text style={styles.hintPan}>Eg: Pan number KA12345586968590</Text>
            </ScrollView>

            {/* Confirm Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SelfiPhoto')}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GovernmentIDScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1.5%"),
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
        marginTop: hp(4)
    },
    topBarTitle: {
        fontSize: wp("4.5%"),
        color: "#000",
        marginLeft: wp(3),
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.1)
    },
    scrollContent: {
        paddingHorizontal: wp("6%"),
        paddingVertical: hp("2%"),
        paddingBottom: hp("8%"),
    },
    label: {
        fontSize: wp("4%"),
        fontWeight: "600",
        marginBottom: hp("1%"),
        color: "#00000099",
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: wp("2%"),
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("3%"),
        marginBottom: hp("1%"),
    },
    dropdownText: {
        fontSize: wp("3.8%"),
        color: "#6C63FF",
        fontWeight: "600",
    },
    hint: {
        fontSize: wp("3.5%"),
        color: "#0000005E",
        marginBottom: hp("2%"),
    },
    hintPan: {
        fontSize: wp("3%"),
        color: "#0000005E",
    },
    uploadLabel: {
        fontSize: wp("5%"),
        fontWeight: "700",
        color: "#6E533F",
        marginBottom: hp("2%"),
        marginTop: hp(2)
    },
    cameraImg: {
        width: wp(16),
        height: hp(8),
        objectFit: 'contain'
    },
    uploadContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hp("3%"),
    },
    uploadBox: {
        width: wp("42%"),
        height: wp("35%"),
        borderWidth: 1,
        borderColor: "#6C63FF",
        borderStyle: "dashed",
        borderRadius: wp("2%"),
        alignItems: "center",
        justifyContent: "center",
    },
    uploadText: {
        fontSize: wp("3.5%"),
        fontWeight: "600",
        marginTop: hp("0.5%"),
        color: "#6C63FF",
    },
    previewImage: {
        width: "100%",
        height: "100%",
        borderRadius: wp("2%"),
        resizeMode: "cover",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: wp("2%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1.2%"),
        fontSize: wp("3.5%"),
        color: "#000",
        marginBottom: hp("1%"),
    },
    footer: {
        position: "absolute",
        bottom: 5,
        left: 0,
        right: 0,
        padding: wp("4%"),
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.8%"),
        borderRadius: wp("4%"),
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
});
