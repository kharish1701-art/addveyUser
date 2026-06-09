// screens/PolicyScreen.tsx
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from "react-native";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { SimpleLineIcons } from '@expo/vector-icons';

const AddveyLogo = require("../../assets/images/1.png");

const PolicyScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={hp(2)} style={{ marginRight: wp(3) }} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Policies</Text>
                <View style={{ width: wp(6) }} />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Scrollable Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* About Addvey (with image) */}
                <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => navigation.navigate('AboutAddvey')}
                >
                    <View style={styles.itemLeft}>
                        <View style={styles.iconBox}>
                            <Image source={AddveyLogo} style={styles.imageIcon} />
                        </View>
                        <Text style={styles.itemText}>About Addvey</Text>
                    </View>
                    <Entypo name="chevron-right" size={hp(2)} color="#000" />
                </TouchableOpacity>

                {/* Terms & Conditions */}
                <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => navigation.navigate('TermAndCondition')}
                >
                    <View style={styles.itemLeft}>
                        <View style={styles.iconBox}>
                            <Ionicons
                                name="information-circle-outline"
                                size={hp(2.4)}
                                color="#000"
                            />
                        </View>
                        <Text style={styles.itemText}>Terms & Conditions</Text>
                    </View>
                    <Entypo name="chevron-right" size={hp(2)} color="#000" />
                </TouchableOpacity>

                {/* Privacy Policy */}
                <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => navigation.navigate('AddveyPrivacyPolicy')}
                >
                    <View style={styles.itemLeft}>
                        <View style={styles.iconBox}>
                            <Feather name="file-text" size={hp(2.4)} color="#000" />
                        </View>
                        <Text style={styles.itemText}>Privacy Policy</Text>
                    </View>
                    <Entypo name="chevron-right" size={hp(2)} color="#000" />
                </TouchableOpacity>

                {/* About App */}
                <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => navigation.navigate('AboutApp')}
                >
                    <View style={styles.itemLeft}>
                        <View style={styles.iconBox}>
                            <SimpleLineIcons name="screen-smartphone" size={hp(2.4)} color="black" />
                        </View>
                        <Text style={styles.itemText}>About App</Text>
                    </View>
                    <Entypo name="chevron-right" size={hp(2)} color="#000" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default PolicyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        backgroundColor: "#fff",
        marginTop: hp(3)
    },
    headerText: {
        fontSize: hp(1.8),
        color: "#000",
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.5)
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#E5E5E5",
    },
    scrollContent: {
        paddingVertical: hp(1),
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconBox: {
        width: wp(8.5),
        height: wp(8.5),
        borderRadius: wp(2),
        alignItems: "center",
        justifyContent: "center",
        marginRight: wp(3),
    },
    imageIcon: {
        width: wp(5),
        height: wp(5),
        resizeMode: "contain",
    },
    itemText: {
        fontSize: hp(1.5),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
});
