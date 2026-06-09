// VerificationScreen.tsx
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    StatusBar
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const VerificationScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Ionicons name="close" size={wp("7%")} color="red" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Verification</Text>
                <View style={{ width: wp("6%") }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* User Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/very.png')}
                        style={styles.image}
                    />
                    <View style={styles.badge}>
                        <Image
                            source={require('../../assets/images/save.png')}
                            style={styles.veryImg}
                        />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>Add a verification badge</Text>
                <Text style={styles.subtitle}>
                    Verified members get 60% more profile views on average.
                </Text>

                {/* Steps */}
                <View style={styles.card}>
                    {/* Step 1 */}
                    <View style={styles.stepRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="card-outline" size={wp("5.2%")} color="#7A5AF8" />
                            <View style={styles.verticalLine} />
                        </View>
                        <Text style={styles.stepText}>
                            ID Proof{"\n"}
                            <Text style={styles.stepSubText}>Upload your PAN / AADHAAR</Text>
                        </Text>
                    </View>

                    {/* Step 2 */}
                    <View style={styles.stepRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="camera-outline" size={wp("5%")} color="#7A5AF8" />
                            <View style={styles.verticalLine} />
                        </View>
                        <Text style={styles.stepText}>
                            Capture a live selfie{"\n"}
                            <Text style={styles.stepSubText}>Take a live selfie to match your ID</Text>
                        </Text>
                    </View>

                    {/* Step 3 */}
                    <View style={styles.stepRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark-outline" size={wp("5%")} color="#7A5AF8" />
                        </View>
                        <Text style={styles.stepText}>
                            Your profile verified{"\n"}
                            <Text style={styles.stepSubText}>
                                This process may take up to 24 hours. We’ll notify you once your profile verified
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Continue Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GovernmentID')}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>
                    You must be at least 18 years old to complete this process
                </Text>
            </View>
        </View>
    );
};

export default VerificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("2%"),
        marginTop: hp(4)
    },
    headerText: {
        fontSize: wp("5%"),
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.7)
    },
    scrollContainer: {
        alignItems: "center",
        paddingBottom: hp("5%"),
    },
    imageContainer: {
        marginTop: hp("2%"),
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: wp("40%"),
        height: wp("40%"),
        borderRadius: wp("20%"),
        resizeMode: "contain",
    },
    veryImg: {
        width: wp("7%"),
        height: wp("7%"),
        resizeMode: "contain",
    },
    badge: {
        position: "absolute",
        bottom: hp("0%"),
        right: wp("5%"),
        backgroundColor: "#fff",
        borderRadius: wp("5%"),
    },
    title: {
        marginTop: hp("3%"),
        fontSize: wp("4.5%"),
        textAlign: "center",
        fontFamily: 'Poppins-Medium'
    },
    subtitle: {
        fontSize: wp("3.2%"),
        color: "#555",
        textAlign: "center",
        marginHorizontal: wp("12%"),
        fontFamily: 'Poppins-Regular'
    },
    card: {
        width: wp("85%"),
        backgroundColor: "#F9F9F9",
        borderRadius: wp("3%"),
        marginTop: hp("3%"),
        paddingVertical: hp("2%"),
        paddingHorizontal: wp("4%"),
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: hp("1%"),
    },
    iconContainer: {
        width: wp("7%"),
        alignItems: "center",
    },
    verticalLine: {
        width: 1.5,
        flex: 1,
        backgroundColor: "#7A5AF8",
        marginTop: hp(0.5),
        height: hp(3)
    },
    stepText: {
        marginLeft: wp("3%"),
        fontSize: wp("3.8%"),
        color: "#000",
        fontFamily: 'Poppins-Medium',
        flex: 1,
    },
    stepSubText: {
        fontSize: wp("3%"),
        fontWeight: "400",
        color: "#6E533F",
    },
    footer: {
        alignItems: "center",
        paddingVertical: hp("2%"),
    },
    button: {
        width: wp("85%"),
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.5%"),
        borderRadius: wp("4%"),
        alignItems: "center",
        marginBottom: hp("1%"),
    },
    buttonText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
    footerText: {
        fontSize: wp("2.5%"),
        color: "#00000070",
        textAlign: "center",
        fontFamily: 'Poppins-Regular'
    },
});


// // VerificationScreen.tsx
// import React from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     Image,
//     ScrollView,
//     StatusBar
// } from "react-native";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";

// const VerificationScreen: React.FC = () => {
//     const navigation = useNavigation<any>();
//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity>
//                     <Ionicons name="close" size={wp("7%")} color="red" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerText}>Verification</Text>
//                 <View style={{ width: wp("6%") }} />
//             </View>

//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 {/* User Image */}
//                 <View style={styles.imageContainer}>
//                     <Image
//                         source={require('../../assets/images/very.png')}
//                         style={styles.image}
//                     />
//                     <View style={styles.badge}>
//                         <Image
//                             source={require('../../assets/images/save.png')}
//                             style={styles.veryImg}
//                         />
//                     </View>
//                 </View>

//                 {/* Title */}
//                 <Text style={styles.title}>Add a verification badge</Text>
//                 <Text style={styles.subtitle}>
//                     Verified members get 60% more profile views on average.
//                 </Text>

//                 {/* Steps */}
//                 <View style={styles.card}>
//                     {/* Step 1 */}
//                     <View style={styles.stepRow}>
//                         <View style={styles.iconContainer}>
//                             <Ionicons name="card-outline" size={wp("5.2%")} color="#7A5AF8" />
//                             <View style={styles.verticalLine} />
//                         </View>
//                         <Text style={styles.stepText}>
//                             ID Proof{"\n"}
//                             <Text style={styles.stepSubText}>Upload your PAN / AADHAAR</Text>
//                         </Text>
//                     </View>

//                     {/* Step 2 */}
//                     <View style={styles.stepRow}>
//                         <View style={styles.iconContainer}>
//                             <Ionicons name="camera-outline" size={wp("5%")} color="#7A5AF8" />
//                             <View style={styles.verticalLine} />
//                         </View>
//                         <Text style={styles.stepText}>
//                             Capture a live selfie{"\n"}
//                             <Text style={styles.stepSubText}>Take a live selfie to match your ID</Text>
//                         </Text>
//                     </View>

//                     {/* Step 3 */}
//                     <View style={styles.stepRow}>
//                         <View style={styles.iconContainer}>
//                             <Ionicons name="shield-checkmark-outline" size={wp("5%")} color="#7A5AF8" />
//                         </View>
//                         <Text style={styles.stepText}>
//                             Your profile verified{"\n"}
//                             <Text style={styles.stepSubText}>
//                                 This process may take up to 24 hours. We’ll notify you once your profile verified
//                             </Text>
//                         </Text>
//                     </View>
//                 </View>
//             </ScrollView>

//             {/* Continue Button */}
//             <View style={styles.footer}>
//                 <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GovernmentID')}>
//                     <Text style={styles.buttonText}>Continue</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.footerText}>
//                     You must be at least 18 years old to complete this process
//                 </Text>
//             </View>
//         </View>
//     );
// };

// export default VerificationScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//     },
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: wp("5%"),
//         paddingVertical: hp("2%"),
//         marginTop: hp(4)
//     },
//     headerText: {
//         fontSize: wp("5%"),
//         fontFamily: 'Poppins-Medium',
//         marginTop: hp(0.7)
//     },
//     scrollContainer: {
//         alignItems: "center",
//         paddingBottom: hp("5%"),
//     },
//     imageContainer: {
//         marginTop: hp("2%"),
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     image: {
//         width: wp("40%"),
//         height: wp("40%"),
//         borderRadius: wp("20%"),
//         resizeMode: "contain",
//     },
//     veryImg: {
//         width: wp("7%"),
//         height: wp("7%"),
//         resizeMode: "contain",
//     },
//     badge: {
//         position: "absolute",
//         bottom: hp("0%"),
//         right: wp("5%"),
//         backgroundColor: "#fff",
//         borderRadius: wp("5%"),
//     },
//     title: {
//         marginTop: hp("3%"),
//         fontSize: wp("4.5%"),
//         textAlign: "center",
//         fontFamily: 'Poppins-Medium'
//     },
//     subtitle: {
//         fontSize: wp("3.2%"),
//         color: "#555",
//         textAlign: "center",
//         marginHorizontal: wp("12%"),
//         fontFamily: 'Poppins-Regular'
//     },
//     card: {
//         width: wp("85%"),
//         backgroundColor: "#F9F9F9",
//         borderRadius: wp("3%"),
//         marginTop: hp("3%"),
//         paddingVertical: hp("2%"),
//         paddingHorizontal: wp("4%"),
//     },
//     stepRow: {
//         flexDirection: "row",
//         alignItems: "flex-start",
//         marginBottom: hp("1%"),
//     },
//     iconContainer: {
//         width: wp("7%"),
//         alignItems: "center",
//     },
//     verticalLine: {
//         width: 1.5,
//         flex: 1,
//         backgroundColor: "#7A5AF8",
//         marginTop: hp(0.5),
//         height: hp(3)
//     },
//     stepText: {
//         marginLeft: wp("3%"),
//         fontSize: wp("3.8%"),
//         color: "#000",
//         fontFamily: 'Poppins-Medium',
//         flex: 1,
//     },
//     stepSubText: {
//         fontSize: wp("3%"),
//         fontWeight: "400",
//         color: "#6E533F",
//     },
//     footer: {
//         alignItems: "center",
//         paddingVertical: hp("2%"),
//     },
//     button: {
//         width: wp("85%"),
//         backgroundColor: "#6C63FF",
//         paddingVertical: hp("1.5%"),
//         borderRadius: wp("4%"),
//         alignItems: "center",
//         marginBottom: hp("1%"),
//     },
//     buttonText: {
//         color: "#fff",
//         fontSize: wp("4%"),
//         fontWeight: "600",
//     },
//     footerText: {
//         fontSize: wp("2.5%"),
//         color: "#00000070",
//         textAlign: "center",
//         fontFamily: 'Poppins-Regular'
//     },
// });
