import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PANCardUploadScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [panNumber, setPanNumber] = useState("DFFGH687U6");

    return (
        <View style={styles.container}>
            {/* Fixed Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={hp("2%")} color="black" />
                <Text style={styles.headerText}>PAN Card</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={{ paddingBottom: hp("5%") }}
                showsVerticalScrollIndicator={false}
            >
                {/* PAN Card Front */}
                <Text style={styles.label}>PAN Card Front</Text>
                <View style={styles.imageWrapper}>
                    <Image
                        source={require("../../assets/images/bigcar.png")}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.uploadWrapper}>
                        <TouchableOpacity style={styles.uploadBtn}>
                            <Ionicons name="camera" size={hp("2.2%")} color="#6C63FF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* PAN Card Back */}
                <Text style={styles.label}>PAN Card Back</Text>
                <View style={styles.imageWrapper}>
                    <Image
                        source={require("../../assets/images/bigcar.png")}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.uploadWrapper}>
                        <TouchableOpacity style={styles.uploadBtn}>
                            <Ionicons name="camera" size={hp("2.2%")} color="#6C63FF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* PAN Number Input */}
                <Text style={styles.labelbottom}>Enter PAN Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter PAN Number"
                    value={panNumber}
                    onChangeText={setPanNumber}
                    placeholderTextColor="#999"
                />

                {/* Re-upload Button */}
                <TouchableOpacity style={styles.reuploadBtn} onPress={() => navigation.navigate('HowTouse')}>
                    <Text style={styles.reuploadText}>Re-upload</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("1.8%"),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
        marginTop: hp(3),
    },
    scrollContent: {
        paddingHorizontal: wp("5%"),
        marginTop: hp("1%"),
    },
    headerText: {
        fontSize: hp("2%"),
        marginLeft: wp("3%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.5),
    },
    label: {
        fontSize: hp("1.8%"),
        fontWeight: "500",
        color: "#000",
        marginBottom: hp("1%"),
        marginTop: hp("2%"),
        fontFamily: 'Poppins-Medium'
    },
    labelbottom: {
        fontSize: hp("1.8%"),
        fontWeight: "500",
        color: "#00000099",
        marginBottom: hp("1%"),
        marginTop: hp("2%"),
        fontFamily: 'Poppins-Medium'
    },
    imageWrapper: {
        marginBottom: hp("0%"),
    },
    image: {
        width: "100%",
        height: hp("20%"),
        borderRadius: wp("2%"),
    },
    uploadWrapper: {
        alignItems: "flex-end",
        marginTop: hp("-2%"),
    },
    uploadBtn: {
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: hp("0.9%"),
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp("2%"),
        paddingVertical: hp("1.2%"),
        paddingHorizontal: wp("3%"),
        fontSize: hp("1.5%"),
        marginBottom: hp("3%"),
        color: "#000",
    },
    reuploadBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.8%"),
        borderRadius: wp("5%"),
        marginTop: hp(3)
    },
    reuploadText: {
        color: "#fff",
        fontSize: hp("1.8%"),
        fontWeight: "600",
        marginLeft: wp("2%"),
    },
});

export default PANCardUploadScreen;
