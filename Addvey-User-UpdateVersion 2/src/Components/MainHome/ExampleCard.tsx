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
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from '@expo/vector-icons';


const { width } = Dimensions.get("window");

const IMAGES = [
    require("../../../assets/images/carcard.png"),
    require("../../../assets/images/carcard.png"),
    require("../../../assets/images/carcard.png"),
];

const AddCardPreview = () => {
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
                        source={require("../../../assets/images/pandit.png")}
                        style={styles.profileImage}
                    />
                    <View style={{ flex: 1, marginLeft: wp(2) }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.profileName}>Nanda</Text>
                            <Text style={styles.profileRole}>Dealer</Text>
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

                    {/* Like New Tag */}
                    <View style={styles.likeNewTag}>
                        <Text style={styles.likeNewText}>Like New</Text>
                    </View>

                    {/* Sell Tag */}
                    <View style={styles.sellTag}>
                        <Text style={styles.sellText}>Sell</Text>
                        <View style={styles.sellTagTriangle} />
                    </View>

                    {/* Right Actions */}
                    <View style={styles.rightActions}>
                        <TouchableOpacity style={styles.rightActionBox}>
                            <MaterialCommunityIcons
                                name="cards-heart-outline"
                                size={hp(1.6)}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightActionBox}>
                            <Octicons name="share" size={hp(1.6)} color="white" />
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
                        <Text style={styles.rowRightTextBottom}>₹ 2,30,00,000</Text>
                    </View>
                </View>

                {/* Bottom Actions */}
                <View style={styles.bottomActions}>
                    <View style={styles.bottomLeft}>
                        {/* Call Icon */}
                        <TouchableOpacity style={styles.callIconContainer}>
                            <Ionicons name="call" size={hp(1.5)} color="#6C63FF" />
                        </TouchableOpacity>

                        {/* Instagram and WhatsApp */}
                        <Image
                            source={require("../../../assets/images/instagram.png")}
                            style={styles.socialIcon}
                        />
                        <Image
                            source={require("../../../assets/images/wts.png")}
                            style={styles.socialIcon}
                        />
                    </View>

                    {/* Message Button + Right Icon */}
                    <View style={styles.bottomRight}>
                        <TouchableOpacity style={styles.messageButton}>
                            <MaterialCommunityIcons name="message" size={hp(2)} color="#6C63FF" />
                            <Text style={styles.messageText}>Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton}>
                            <AntDesign name="info-circle" size={hp(2.2)} color="#00000075" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AddCardPreview;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: wp(3),
        marginBottom: hp(1),
        overflow: "hidden",
        borderColor: "#eee",
        borderWidth: 1,
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
        borderColor: "#ddd",
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
        borderBottomRightRadius: wp(4),
        overflow: "hidden",
    },
    cardImage: {
        width: width,
        height: hp(22),
        resizeMode: "cover",
    },
    likeNewTag: {
        position: "absolute",
        top: hp(0),
        left: wp(-1),
        backgroundColor: "#6C63FF",
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.4),
        borderBottomRightRadius: wp(10),
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    likeNewText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: hp(1),
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
        right: wp(15),
        flexDirection: "row",
        alignItems: "center",
    },
    rightActionBox: {
        backgroundColor: "rgba(0, 0, 0, 0.13)",
        borderRadius: wp(20),
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.8),
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

    /** 🔹 NEW BOTTOM ACTION BAR */
    bottomActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    bottomLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    callIconContainer: {
        backgroundColor: "#fff",
        borderRadius: wp(6),
        padding: wp(2),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginRight: wp(2),
    },
    socialIcon: {
        width: wp(7),
        height: wp(7),
        resizeMode: "contain",
        marginHorizontal: wp(1),
    },
    bottomRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    messageButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(4),
        borderRadius: wp(6),
        marginRight: wp(1),
        borderColor: '#6C63FF',
        borderWidth: 1
    },
    messageText: {
        color: "#6C63FF",
        fontSize: hp(1.4),
        marginLeft: wp(1),
        fontFamily: 'Poppins-Medium'
    },
    iconButton: {
        padding: wp(2),
    },
});