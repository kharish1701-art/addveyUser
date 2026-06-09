import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const IMAGES = [
    require("../../../assets/images/carcard.png"),
    require("../../../assets/images/carcard.png"),
    require("../../../assets/images/carcard.png"),
];

const ChatCardScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const renderImageItem = ({ item }: { item: any }) => (
        <View style={{ width: width }}>
            <Image source={item} style={styles.cardImage} />
        </View>
    );

    const renderDot = (_: any, i: number) => (
        <View key={i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
    );

    return (
        <View style={{ marginBottom: hp(3) }}>

            <View style={styles.card}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={require("../../../assets/images/1.png")}
                        style={styles.profileImage}
                    />
                    <View style={{ flex: 1, marginLeft: wp(2) }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.profileName}>Nanda</Text>
                            <Text style={styles.profileRole}> Dealer</Text>
                            <Image
                                source={require("../../../assets/images/save.png")}
                                style={styles.verifyIcon}
                            />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: hp(0.3) }}>
                            <Ionicons name="location-outline" size={12} color="#FF0303" />
                            <Text style={styles.profileLocation}>
                                1.2 km away · Kphb Bagyanagar Colony
                            </Text>
                        </View>
                    </View>

                    {/* Navigation Icon with Shadow */}
                    <TouchableOpacity style={styles.navigationButton}>
                        <MaterialCommunityIcons
                            name="navigation-variant"
                            size={hp(2.2)}
                            color="#6C63FF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Image Slider */}
                <View style={styles.imageWrapper}>
                    <FlatList
                        data={IMAGES}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const slideIndex = Math.round(
                                e.nativeEvent.contentOffset.x / width
                            );
                            setActiveIndex(slideIndex);
                        }}
                        renderItem={renderImageItem}
                    />

                    {/* Sell Tag */}
                    <View style={styles.sellTag}>
                        <Text style={styles.sellText}>Sell</Text>
                        <View style={styles.sellTagTriangle} />
                    </View>

                    {/* Right Actions */}
                    <View style={styles.rightActions}>
                        <TouchableOpacity style={styles.rightActionBox}>
                            <MaterialCommunityIcons
                                name="eye-outline"
                                size={hp(1.6)}
                                color="white"
                            />
                            <Text style={styles.rightActionText}>1k+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightActionBox}>
                            <MaterialCommunityIcons
                                name="cards-heart-outline"
                                size={hp(1.6)}
                                color="white"
                            />
                            <Text style={styles.rightActionText}>50</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightActionBox}>
                            <Octicons name="share" size={hp(1.6)} color="white" />
                            <Text style={styles.rightActionText}>30</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Slider Dots */}
                    <View style={styles.sliderDots}>{IMAGES.map(renderDot)}</View>
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Image
                                source={require("../../../assets/images/car.png")}
                                style={styles.smallCarImage}
                            />
                            <Text style={styles.rowText}>Car</Text>
                        </View>
                        <Text style={styles.rowRightText}>29 JUL 2024</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.rowTextBottom}>
                            Bentley Continental GT
                        </Text>
                        <Text style={styles.rowRightTextBottom}>₹ 300 / Hour</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footerContainer}>
                    <Text style={styles.cardFooter}>AD ID : 2134354</Text>
                </View>
            </View>
        </View>
    );
};

export default ChatCardScreen;

const styles = StyleSheet.create({
    topText: {
        fontSize: hp(2),
        fontWeight: "600",
        color: "#000",
        marginBottom: hp(1),
        paddingHorizontal: wp(4),
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: wp(3),
        marginBottom: hp(1),
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: "hidden",
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
    },
    profileImage: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
    },
    profileName: {
        fontSize: hp(1.8),
        fontWeight: "700",
        color: "#000",
    },
    profileRole: {
        fontSize: hp(1.4),
        color: "#555",
        marginLeft: wp(1),
    },
    verifyIcon: {
        width: wp(3),
        height: wp(3),
        resizeMode: "contain",
        marginLeft: wp(1),
    },
    profileLocation: {
        fontSize: hp(1.3),
        color: "#6E533F",
    },
    navigationButton: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        padding: 5,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    imageWrapper: {
        position: "relative",
        width: width,
    },
    cardImage: {
        width: width,
        height: hp(22),
        resizeMode: "cover",
    },
    sellTag: {
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "white",
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.2),
        flexDirection: "row",
        alignItems: "center",
    },
    sellTagTriangle: {
        position: "absolute",
        right: -wp(5),
        top: 0,
        width: 0,
        height: 0,
        borderTopWidth: hp(3),
        borderBottomWidth: hp(3),
        borderLeftWidth: wp(5),
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: "white",
    },
    sellText: {
        color: "#00000099",
        fontSize: hp(1.4),
        fontWeight: "600",
    },
    rightActions: {
        position: "absolute",
        top: hp(1),
        right: wp(10),
        flexDirection: "row",
        alignItems: "center",
    },
    rightActionBox: {
        backgroundColor: "rgba(0, 0, 0, 0.13)",
        borderRadius: wp(10),
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.5),
        marginLeft: wp(2),
        flexDirection: "row",
        alignItems: "center",
    },
    rightActionText: {
        fontSize: hp(1.4),
        fontWeight: "500",
        color: "white",
        marginLeft: wp(0.5),
    },
    sliderDots: {
        position: "absolute",
        bottom: hp(1),
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    dot: {
        width: wp(1),
        height: wp(1),
        borderRadius: wp(1),
        backgroundColor: "#D9D9D9",
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: "#6A5AE0",
    },
    cardContent: {
        padding: wp(4),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: hp(0.5),
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    smallCarImage: {
        width: wp(8),
        height: wp(8),
        resizeMode: "contain",
        marginRight: wp(2),
    },
    rowText: {
        fontSize: hp(1.5),
        color: "#333",
    },
    rowTextBottom: {
        fontSize: hp(1.6),
        color: "black",
        fontWeight: "600",
    },
    rowRightText: {
        fontSize: hp(1.3),
        color: "#444",
    },
    rowRightTextBottom: {
        fontSize: hp(1.7),
        fontWeight: "600",
        color: "black",
    },
    footerContainer: {
        alignItems: "center",
        backgroundColor: "#D9D9D97D",
    },
    cardFooter: {
        fontSize: hp(1.2),
        color: "#6E533F",
        textAlign: "center",
        paddingVertical: hp(0.3),
        fontFamily: 'Poppins-Bold'
    },
    bottomTextContainer: {
        alignItems: "center",
        marginTop: hp(3),
    },
    bottomText: {
        fontSize: hp(1.7),
        color: "#6C63FF",
        fontFamily: 'Poppins-Medium'
    },
});
