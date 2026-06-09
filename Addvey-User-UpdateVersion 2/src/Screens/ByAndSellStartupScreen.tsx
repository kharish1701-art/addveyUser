import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { goPlayStore } from "../Components/CommonFunction";

const ByAndSellStartupScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.topSection}>
                <Text style={styles.title}>I Want to Sell/Rent/Lease</Text>
                <Text style={styles.subtitle}>
                    Agriculture, Pets, Vehicles, Mobiles, Properties, & more
                </Text>

                <View style={styles.greenBox}>
                    <Ionicons
                        name="shield-checkmark"
                        size={wp("5%")}
                        color="#1DB954"
                    />
                    <Text style={styles.greenBoxText}>
                        Secure and easy deals, every time
                    </Text>
                </View>

                <View style={styles.appCard}>
                    <View style={styles.appIconContainer}>
                        <Image
                            source={require('../../assets/images/bysell.png')}
                            style={styles.appIcon}
                        />
                    </View>
                    <View style={styles.appInfo}>
                        <Text style={styles.appName}>Addvey Partner App</Text>
                        <Text style={styles.appDetails}>
                            Property • Online marketplace
                        </Text>
                    </View>
                    <TouchableOpacity onPress={()=>goPlayStore()} style={styles.installButton}>
                        <Text style={styles.installText}>Install</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottomSection}>
                <Text style={styles.exploreTitle}>Explore</Text>
                <Text style={styles.exploreSubtitle}>
                    Agriculture, Pets, Vehicles, Mobiles, Properties, & more
                </Text>

                <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate("Botomtabs", { screen: "Home" })}>
                    <Ionicons name="arrow-forward" size={wp("7%")} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ByAndSellStartupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6",
        justifyContent: "space-between",
    },
    topSection: {
        backgroundColor: "#fff",
        alignItems: "center",
        paddingVertical: hp("3%"),
        borderBottomLeftRadius: wp("8%"),
        borderBottomRightRadius: wp("8%"),
        paddingTop: hp(8)
    },
    title: {
        fontSize: wp("5%"),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    subtitle: {
        fontSize: wp("3%"),
        color: "#444444B2",
        textAlign: "center",
        marginTop: hp("0.5%"),
        width: wp("100%"),
        fontFamily: 'Poppins-Regular'
    },
    greenBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#CAB23F1A",
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("3%"),
        borderRadius: wp("3%"),
        marginTop: hp("2%"),
    },
    greenBoxText: {
        fontSize: wp("3.2%"),
        color: "#32CD32",
        marginLeft: wp("2%"),
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.2)
    },
    appCard: {
        flexDirection: "row",
        alignItems: "center",
        width: wp("90%"),
        borderRadius: wp("4%"),
        marginTop: hp("5%"),
    },
    appIconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    appIcon: {
        width: wp("18%"),
        height: wp("18%"),
        resizeMode: "contain",
    },
    appInfo: {
        flex: 1,
        marginLeft: wp("3%"),
    },
    appName: {
        fontSize: wp("3.8%"),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    appDetails: {
        fontSize: wp("2.8%"),
        color: "#666",
        marginTop: hp("0.3%"),
        fontFamily: 'Poppins-Regular'
    },
    installButton: {
        backgroundColor: "#6C63FF",
        borderRadius: wp("6%"),
        paddingVertical: hp("1.2%"),
        paddingHorizontal: wp("4%"),
    },
    installText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: wp("3.2%"),
    },

    bottomSection: {
        backgroundColor: "#fff",
        borderTopLeftRadius: wp("10%"),
        borderTopRightRadius: wp("10%"),
        alignItems: "center",
        paddingTop: hp("3%"),
        paddingBottom: hp("5%"),
    },
    exploreTitle: {
        fontSize: wp("5%"),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    exploreSubtitle: {
        fontSize: wp("3.5%"),
        color: "#888",
        textAlign: "center",
        marginTop: hp("0.5%"),
        width: wp("80%"),
        fontFamily: 'Poppins-Regular'
    },
    arrowButton: {
        backgroundColor: "#6C63FF",
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: wp("10%"),
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp("3%"),
    },
});
