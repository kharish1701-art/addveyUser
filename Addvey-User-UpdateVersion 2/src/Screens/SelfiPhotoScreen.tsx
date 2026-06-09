import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const SelfiPhoto: React.FC = () => {
    const navigation = useNavigation<any>();

    // Open Camera
    // const openCamera = async () => {
    //     try {
    //         const result = await launchCamera({
    //             mediaType: "photo",
    //             cameraType: "front",
    //             saveToPhotos: true,
    //         });

    //         if (result.didCancel) {
    //             console.log("User cancelled camera");
    //         } else if (result.assets && result.assets.length > 0) {
    //             console.log("Photo captured:", result.assets[0].uri);
    //             // Yahan ap photo ko setState karke preview bhi dikha sakte ho
    //         }
    //     } catch (error) {
    //         console.log("Error opening camera:", error);
    //     }
    // };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp("6%")} color="black" />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.title}>Click selfie photo</Text>
            <Text style={styles.subTitle}>
                Take a live selfie for Addvey to match with your ID
            </Text>

            {/* Selfie Preview Circle */}
            <View style={styles.selfieWrapper}>
                <Image
                    source={require("../../assets/images/very.png")}
                    style={styles.selfieImage}
                />
            </View>

            {/* Camera Button Wrapper */}
            <View style={styles.cameraWrapper}>
                <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('VerificationDone')}>
                    <Ionicons name="camera" size={hp("4%")} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SelfiPhoto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    header: {
        width: "100%",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("2%"),
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(4),
    },
    title: {
        fontSize: wp("5.5%"),
        marginTop: hp("1%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
    },
    subTitle: {
        fontSize: wp("3.2%"),
        color: "#555555",
        marginTop: hp("0.5%"),
        textAlign: "center",
        marginHorizontal: wp("8%"),
        fontFamily: "Poppins-Regular",
    },
    selfieWrapper: {
        marginTop: hp("7%"),
        width: wp("80%"),
        height: wp("80%"),
        borderRadius: wp("40%"),
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    selfieImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    cameraWrapper: {
        position: "absolute",
        bottom: hp("8%"),
        borderWidth: 1,
        borderColor: "#6C63FF",
        borderRadius: wp("18%"),
        padding: 3,
    },
    cameraButton: {
        width: wp("18%"),
        height: wp("18%"),
        borderRadius: wp("9%"),
        backgroundColor: "#6C63FF",
        justifyContent: "center",
        alignItems: "center",
    },
});
