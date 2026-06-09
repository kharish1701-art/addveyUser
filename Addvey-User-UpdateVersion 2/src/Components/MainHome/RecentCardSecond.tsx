import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import { MaterialCommunityIcons, Ionicons, Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

const RecentCardSecond: React.FC = () => {
    const images = [
        require("../../../assets/images/ship.png"),
        require("../../../assets/images/ship.png"),
        require("../../../assets/images/ship.png"),
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    return (
        <View style={styles.card}>
            {/* Image Slider */}
            <View style={styles.imageWrapper}>
                <Animated.FlatList
                    data={images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    keyExtractor={(_, i) => i.toString()}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.floor(
                            e.nativeEvent.contentOffset.x /
                            e.nativeEvent.layoutMeasurement.width
                        );
                        setActiveIndex(index);
                    }}
                    renderItem={({ item }) => (
                        <Image source={item} style={styles.cardImage} />
                    )}
                />

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {images.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                { opacity: i === activeIndex ? 1 : 0.3 },
                            ]}
                        />
                    ))}
                </View>

                {/* Top Left Label */}
                <View style={styles.topLeftTag}>
                    <Text style={styles.sellText}>Like New</Text>
                </View>

                {/* Bottom Left Label */}
                <View style={styles.bottomLeftTagContainer}>
                    <View style={styles.bottomLeftTag}>
                        <Image
                            source={require("../../../assets/images/properties.png")}
                            style={styles.smallLeftIcon}
                        />
                        <Text style={styles.bottomLeftText}>1 BHK . Rent</Text>
                    </View>
                </View>

                {/* Top Right Icons */}
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialCommunityIcons
                            name="heart-outline"
                            size={hp(1.5)}
                            color="white"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconCircle}>
                        <Octicons name="share" size={hp(1.5)} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconCircleSend}>
                        <FontAwesome name="send" size={hp(1.3)} color="#6C63FF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Card Details */}
            <View style={styles.cardContent}>
                <View style={styles.rowBetween}>
                    <Text style={styles.rowTextBottom}>4 BHK Villa</Text>
                    <View style={styles.rightTextBlock}>
                        <Text style={styles.dateText}>09 JUL 2024</Text>
                        <Text style={styles.rowRightTextBottom}>₹ 3,000 / Month</Text>
                    </View>
                </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footerContainer}>
                <View style={styles.footerLeft}>
                    <TouchableOpacity style={styles.chatButton}>
                        <MaterialCommunityIcons
                            name="phone"
                            size={hp(2)}
                            color="#6C63FF"
                        />
                        <Text style={styles.chatText}>Call</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerRight}>
                    <TouchableOpacity style={styles.chatButton}>
                        <MaterialCommunityIcons
                            name="message"
                            size={hp(2)}
                            color="#6C63FF"
                        />
                        <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareOutside}>
                        <AntDesign name="info-circle" size={16} color="#00000075" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default RecentCardSecond;

const styles = StyleSheet.create({
    card: {
        width: wp(65),
        backgroundColor: "#fff",
        borderRadius: wp(5),
        marginRight: wp(4),
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: "hidden",
        marginTop: hp(1)
    },
    imageWrapper: {
        position: "relative",
        width: "100%",
        height: hp(19),
    },
    cardImage: {
        width: width * 0.65,
        height: hp(20),
        resizeMode: "cover",
        borderTopLeftRadius: wp(3),
        borderTopRightRadius: wp(3),
    },
    pagination: {
        position: "absolute",
        bottom: hp(0.8),
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    dot: {
        width: wp(1.2),
        height: wp(1.2),
        borderRadius: wp(1.1),
        backgroundColor: "#fff",
        marginHorizontal: wp(0.6),
    },
    topLeftTag: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#6C63FF",
        borderBottomRightRadius: wp(3),
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.4),
    },
    sellText: {
        fontSize: hp(1),
        color: "#fff",
        fontWeight: "600",
    },
    bottomLeftTagContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    bottomLeftTag: {
        backgroundColor: "#fff",
        borderTopRightRadius: wp(3),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.4),
    },
    smallLeftIcon: {
        width: wp(3.5),
        height: wp(3.5),
        resizeMode: "contain",
        marginRight: wp(1),
    },
    bottomLeftText: {
        fontSize: hp(1),
        fontWeight: "600",
        color: "#000",
    },
    rightIcons: {
        position: "absolute",
        top: hp(1),
        right: wp(3),
        flexDirection: "row",
    },
    iconCircle: {
        width: wp(7),
        height: wp(7),
        borderRadius: wp(4),
        backgroundColor: "rgba(0, 0, 0, 0.29)",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: wp(2),
    },
    iconCircleSend: {
        width: wp(7),
        height: wp(7),
        borderRadius: wp(4),
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: wp(2),
    },
    cardContent: {
        paddingHorizontal: wp(3),
        paddingTop: hp(1.5),
        paddingBottom: hp(0.8),
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    rowTextBottom: {
        fontSize: hp(1.4),
        color: "black",
        flex: 1,
        fontFamily: "Poppins-Regular",
    },
    rightTextBlock: {
        alignItems: "flex-end",
    },
    rowRightTextBottom: {
        fontSize: hp(1.3),
        fontWeight: "600",
        color: "#000",
        top: hp(-0.8),
    },
    dateText: {
        fontSize: hp(1),
        color: "#000",
        marginBottom: hp(0.3),
        top: hp(-1),
    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp(3),
        paddingBottom: hp(1.5),
    },
    footerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    footerIconCircle: {
        width: wp(7),
        height: wp(7),
        borderRadius: wp(4),
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: wp(2),
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3,
    },
    footerIcon: {
        marginRight: wp(3),
    },
    instagramIcon: {
        width: wp(7),
        height: wp(7),
        resizeMode: "contain",
    },
    footerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    chatButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(0.7),
        paddingHorizontal: wp(3),
        borderRadius: wp(5),
        borderColor: "#6C63FF",
        borderWidth: 1,
    },
    chatText: {
        color: "#6C63FF",
        fontSize: hp(1.4),
        marginHorizontal: wp(1),
        fontFamily: "Poppins-Medium",
    },
    shareOutside: {
        marginLeft: wp(3),
    },
});
