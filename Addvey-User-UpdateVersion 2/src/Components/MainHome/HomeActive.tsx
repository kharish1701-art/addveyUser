import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ActiveAdsScreen = () => {
    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Ionicons
                    name="search"
                    size={20}
                    color="#666"
                    style={styles.searchIcon}
                />
                <TextInput
                    placeholder="Search here"
                    placeholderTextColor="#6E533F"
                    style={styles.searchInput}
                />
                <View style={styles.rightImageWrapper}>
                    <Image
                        source={require("../../../assets/images/mic.png")}
                        style={styles.rightImage}
                    />
                </View>
            </View>

            {/* Box + Lines */}
            <View style={styles.centerWrapper}>
                {/* Left Box */}
                <View style={styles.box}></View>

                {/* Right Lines */}
                <View style={styles.linesWrapper}>
                    <View style={styles.longLine} />
                    <View style={styles.shortLine} />
                </View>
            </View>

            {/* Text Below */}
            <Text style={styles.infoText}>No running Ads</Text>

            {/* Button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Create Ad</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ActiveAdsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        marginTop: hp(2),
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 20,
        width: "100%",
        height: 45,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        color: "#000",
        fontSize: wp(3),
        paddingTop: hp(2.2)
    },
    rightImageWrapper: {
        borderLeftWidth: 1,
        borderLeftColor: "#ccc",
        paddingLeft: 8,
    },
    rightImage: {
        width: wp(5),
        height: hp(4),
        resizeMode: "contain",
    },

    // Box + Lines wrapper
    centerWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: "#6E533F4F",
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: hp(15),
    },
    box: {
        width: wp(20),
        height: hp(8),
        borderRadius: 12,
        backgroundColor: "#6E533F4F",
        marginRight: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    linesWrapper: {
        justifyContent: "center",
        alignItems: "flex-start",
    },
    longLine: {
        width: wp(40),
        height: hp(0.4),
        backgroundColor: "#6E533F4F",
        marginBottom: hp(1.5),
        borderRadius: 4,
    },
    shortLine: {
        width: wp(30),
        height: hp(0.4),
        backgroundColor: "#6E533F4F",
        borderRadius: 4,
    },

    // Text + Button
    infoText: {
        fontSize: 16,
        color: "black",
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#6C63FF",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
        width: wp(80),
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
