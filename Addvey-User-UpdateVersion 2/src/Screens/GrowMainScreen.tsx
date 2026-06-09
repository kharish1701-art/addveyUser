import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const GrowMainScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Fixed Topbar */}
            <View style={styles.topBar}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={18} style={{ marginRight: wp(3) }} color="#000" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Grow</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* Fixed Banner */}
            <View style={styles.banner}>
                <Text style={styles.bannerText}>Grow your ad visibility</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Improve ad */}
                <View style={styles.rowItemTop}>
                    <Ionicons name="document-text" size={19} color="#6C63FF" />
                    <View style={styles.rowTextWrapper}>
                        <Text style={styles.rowTitle}>Improve ad</Text>
                        <Text style={styles.rowSubtitle}>
                            Add images, descriptions and tags
                        </Text>
                    </View>
                </View>

                {/* Improve your response */}
                <View style={styles.rowItem}>
                    <Ionicons name="star" size={19} color="#CDFF03" />
                    <View style={styles.rowTextWrapper}>
                        <Text style={styles.rowTitle}>Improve your response</Text>
                        <Text style={styles.rowSubtitle}>
                            Quick responses build customer loyalty
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('ProductListingPage')}>
                    {/* Product Listing Plans card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons
                                name="document-text"
                                size={19}
                                color="#6C63FF"
                                style={{ marginRight: 8 }}
                            />
                            <Text style={styles.cardTitle}>Product Listing Plans</Text>
                        </View>
                        <Text style={styles.cardDesc}>
                            Buy one of these plans to upload more products. Start selling now!
                        </Text>
                        <Text style={styles.activeText}>1 active plan</Text>
                        <Ionicons name="chevron-forward" size={15} color="#6C63FF" style={styles.cardArrow} />
                    </View>
                </TouchableOpacity>


                {/* Create Ads card */}
                <TouchableOpacity onPress={() => navigation.navigate('AdvertiesmentMain')}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons
                                name="megaphone"
                                size={19}
                                color="#6C63FF"
                                style={{ marginRight: 8 }}
                            />
                            <Text style={styles.cardTitle}>Create Ads</Text>
                        </View>
                        <Text style={styles.cardDesc}>
                            Get seen by more customers on <Text style={{ fontWeight: "600" }}>Addvey app</Text> and get more orders
                        </Text>
                        <Text style={styles.activeText}>1 active offers</Text>
                        <Ionicons name="chevron-forward" size={15} color="#6C63FF" style={styles.cardArrow} />
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default GrowMainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        height: 55,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        marginTop: hp(3)
    },
    topBarTitle: {
        fontSize: wp(4.8),
        color: "#000",
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.6)
    },
    banner: {
        backgroundColor: "#6C63FF",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    bannerText: {
        color: "#fff",
        fontSize: wp(4.8),
        fontFamily: 'Poppins-Medium'
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    rowItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    rowItemTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
        marginTop: hp(3)
    },
    rowTextWrapper: {
        marginLeft: 10,
        flex: 1,
    },
    rowTitle: {
        fontSize: wp(3.8),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    rowSubtitle: {
        fontSize: wp(3),
        color: "#555",
        marginTop: 2,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        position: "relative",
        borderColor: '#eee',
        borderWidth: 1
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: wp(3.8),
        fontWeight: "600",
        color: "#000",
    },
    cardDesc: {
        fontSize: wp(2.8),
        color: "#444",
        marginBottom: 8,
        marginRight: wp(30)
    },
    activeText: {
        fontSize: wp(3),
        fontWeight: "600",
        color: "#8BC34A",
        marginTop: hp(1)
    },
    cardArrow: {
        position: "absolute",
        right: 12,
        top: "55%",
    },
});
