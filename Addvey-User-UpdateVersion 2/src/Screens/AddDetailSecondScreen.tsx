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
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const AddDetailSecondScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [title, setTitle] = useState("");
    const [highlight, setHighlight] = useState("");
    const [description, setDescription] = useState("");

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Topbar */}
            <View style={styles.topBar}>
                <View style={styles.leftSection}>
                    <Ionicons name="arrow-back" size={wp("4.5%")} color="#000" />
                    <Text style={styles.topTitle}>Ad Highlights & Description</Text>
                </View>

                {/* Step progress */}
                <View style={styles.stepWrapper}>
                    <LinearGradient
                        colors={["#6C63FF", "#6C63FF", "#D9D9D9DE", "#D9D9D9DE"]}
                        locations={[0, 0.3, 0.3, 1]}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 2 }}
                        style={styles.stepGradientBorder}
                    >
                        <View style={styles.stepInner}>
                            <Text style={styles.stepText}>2 of 3</Text>
                        </View>
                    </LinearGradient>
                </View>
            </View>

           
            <View style={styles.adIdBox}>
                <Text style={styles.adIdText}>AD ID : 2134354</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Section */}
                <View style={styles.formSection}>
                  
                    <View style={styles.inputWrapper}>
                        <Text style={styles.floatingLabel}>Title *</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Title"
                            placeholderTextColor="#999"
                            style={styles.input}
                            maxLength={100}
                        />
                    </View>

                    {/* Divider Top */}
                    <View style={styles.divider} />

                    {/* Highlights */}
                    <View style={styles.rowBetween}>
                        <Text style={styles.label}>Highlights</Text>
                        <Text style={styles.example}>Example</Text>
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={highlight}
                            onChangeText={setHighlight}
                            placeholder="E.g. 0 to 100 in 60sec (optional)"
                            placeholderTextColor="#999"
                            style={styles.input}
                            maxLength={100}
                        />
                        {/* Counter Right */}
                        <Text style={styles.counterRight}>10/100</Text>
                    </View>
                    <TouchableOpacity style={styles.addMoreBtn}>
                        <Ionicons name="add-circle-outline" size={wp("4.5%")} color="#6C63FF" />
                        <Text style={styles.addMoreText}>Add more</Text>
                    </TouchableOpacity>

                    {/* Divider Bottom */}
                    <View style={styles.divider} />

                    {/* Section Title */}
                    <Text style={styles.sectionTitle}>Description</Text>

                    
                    <View style={styles.inputWrapper}>
                        <Text style={styles.floatingLabel}>Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe about listing"
                            placeholderTextColor="#999"
                            style={[styles.input, { height: hp(15), textAlignVertical: "top" }]}
                            multiline
                            maxLength={1000}
                        />
                        {/* Counter Bottom Right */}
                        <Text style={styles.counterBottom}>
                            {description.length}/1000
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <View style={styles.bottomLeft}>
                    <Image
                        source={require("../../assets/images/bottombutton.png")}
                        style={styles.bottomImage}
                    />
                    <Text style={styles.bottomText}>
                        I am authorised to make ad edits & responsible for the information shared including ad details & prices
                    </Text>
                </View>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("AddDetailThird")}>
                    <Text style={styles.bottomButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AddDetailSecondScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
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
        fontSize: wp("4%"),
        fontFamily: "Poppins-Medium",
        color: "#000",
        marginTop: hp(0.4),
    },
    stepWrapper: { alignItems: "flex-end" },
    stepGradientBorder: { borderRadius: 16, padding: 2 },
    stepInner: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: wp(4),
        alignItems: "center",
        justifyContent: "center",
        minHeight: hp(3),
        paddingTop: hp(0.3),
    },
    stepText: {
        fontSize: wp("2.8%"),
        fontFamily: "Poppins-Medium",
        color: "#6C63FF",
        textAlign: "center",
    },

    // AD ID Box
    adIdBox: {
        backgroundColor: "#D9D9D959",
        paddingVertical: hp(0.2),
        paddingHorizontal: wp(4),
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    adIdText: {
        textAlign: "center",
        fontSize: wp("2.4%"),
        fontFamily: "Poppins-Medium",
        color: "#6E533F",
    },

    scrollContent: { padding: wp(5), paddingBottom: hp(15) },

    formSection: { marginTop: hp(2) },
    inputWrapper: { marginBottom: hp(2), position: "relative", marginTop: hp(1) },
    floatingLabel: {
        position: "absolute",
        top: -hp(1),
        left: wp(3),
        backgroundColor: "#fff",
        paddingHorizontal: wp(1),
        fontSize: wp("2.8%"),
        fontFamily: "Poppins-Medium",
        color: "#00000099",
        zIndex: 1,
    },
    label: {
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Medium",
        color: "#000000",
        marginBottom: hp(0.5),
    },
    sectionTitle: {
        fontSize: wp("3.6%"),
        fontFamily: "Poppins-Bold",
        color: "#000",
        marginTop: hp(1.5),
        marginBottom: hp(1),
        paddingHorizontal: wp(1.3)
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.2),
        fontSize: wp("3%"),
        fontFamily: "Poppins-Regular",
        color: "#000",
    },
    counterRight: {
        position: "absolute",
        right: wp(3),
        top: "50%",
        transform: [{ translateY: -hp(1.2) }],
        fontSize: wp("3%"),
        fontFamily: "Poppins-Regular",
        color: "#666",
    },
    counterBottom: {
        position: "absolute",
        right: wp(3),
        bottom: hp(0.5),
        fontSize: wp("3%"),
        fontFamily: "Poppins-Regular",
        color: "#666",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp(1),
        marginBottom: hp(1.4),
        paddingHorizontal: wp(1.2)
    },
    example: {
        fontSize: wp("3.2%"),
        fontFamily: "Poppins-Medium",
        color: "#6C63FF",
    },
    addMoreBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.5,
        borderColor: "#6C63FF",
        borderRadius: 20,
        paddingVertical: hp(1),
        marginTop: hp(1),
        marginBottom: hp(2),
    },
    addMoreText: {
        fontSize: wp("3.4%"),
        fontFamily: "Poppins-Medium",
        color: "#6C63FF",
        marginLeft: wp(2),
        marginTop: hp(0.3),
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: hp(2),
    },

    bottomSection: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#D9D9D959",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        padding: wp(4),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomLeft: { flexDirection: "row", alignItems: "center", marginBottom: hp(1.5) },
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
    bottomButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp(1.2),
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: hp(1.4),
    },
    bottomButtonText: {
        color: "#fff",
        fontSize: wp("3.8%"),
        fontFamily: "Poppins-Medium",
    },
});
