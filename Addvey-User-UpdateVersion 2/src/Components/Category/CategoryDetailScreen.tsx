// screens/AddReviewScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ScrollView,
    StatusBar,
    TextInput
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { EvilIcons } from '@expo/vector-icons';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const { width } = Dimensions.get("window");

// Replace with your custom images (local or remote)
const images = [
    require("../../../assets/images/slidecar.png"),
    require("../../../assets/images/slidecar.png"),
    require("../../../assets/images/slidcar.jpg"),
];

const CategoryDetailScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                {/* Left arrow */}
                <TouchableOpacity
                    style={{ marginRight: wp("3%") }}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back-ios-new" size={hp(2)} color="#FF0303" />
                </TouchableOpacity>

                {/* Search bar */}
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={wp("4.5%")}
                        color="#888"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder="Search here"
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                    />
                    <Image
                        source={require("../../../assets/images/mic.png")}
                        style={styles.micIcon}
                        resizeMode="contain"
                    />
                </View>

                {/* QR code icon */}
                <TouchableOpacity style={{ marginLeft: wp("3%") }}>
                    <Image
                        source={require("../../../assets/images/qrcode.png")}
                        style={styles.qrIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Subtitle Section (2 lines) */}
                <View style={styles.mainView}>
                    <View style={styles.subtitleSection}>
                        {/* Top line: Nanda + icon */}
                        <View style={styles.subtitleTop}>
                            <Text style={styles.subtitleText}>Nanda</Text>
                            <Image
                                source={require('../../../assets/images/save.png')}
                                style={styles.saveimage}
                            />
                        </View>

                        {/* Bottom line: icon + text + icon + text */}
                        <View style={styles.subtitleBottom}>
                            <Entypo name="location-pin" size={wp("4%")} color="red" />
                            <Text style={styles.locationText}>1.2 km away . Kphb Bagyanagar Colony</Text>

                            <Image
                                source={require('../../../assets/images/save2.png')}
                                style={styles.saveimage}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.shareBtn}>
                        <MaterialCommunityIcons
                            name="navigation-variant"
                            size={hp(2.2)}
                            color="#6C63FF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Image Slider */}
                <View style={styles.sliderWrapper}>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image
                                source={typeof item === "string" ? { uri: item } : item}
                                style={styles.image}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                    />

                    {/* Slider dots */}
                    <View style={styles.dotsContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Bottom-right icons with text */}
                    <View style={styles.bottomRight}>
                        <TouchableOpacity style={styles.rowIcon}>
                            <EvilIcons name="heart" size={24} color="white" />
                            <Text style={styles.iconText}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowIcon}>
                            <Feather name="share" size={16} style={{ marginLeft: wp(3) }} color="white" />
                            <Text style={styles.iconText}>1</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom-left views */}
                    <View style={styles.bottomLeft}>
                        <Ionicons name="eye-outline" size={wp("4%")} color="#fff" />
                        <Text style={styles.iconText}>3</Text>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.detailsCard}>
                    {/* Row 1 */}
                    <View style={styles.detailRowCustom}>
                        <View style={styles.leftBox}>
                            <Image
                                source={require('../../../assets/images/car.png')}
                                style={{ width: wp(5), height: hp(5), objectFit: 'contain' }}
                            />
                            <Text style={styles.detailTextCar}>Car</Text>
                        </View>
                        <Text style={styles.rightTextCar}>29 JUL 2024</Text>
                    </View>

                    {/* Row 2 */}
                    <View style={styles.detailRowCustom}>
                        <View style={styles.leftBox}>
                            <Text style={styles.detailText}>Bugatti</Text>
                        </View>
                        <Text style={styles.rightText}>₹2,30,00,000</Text>
                    </View>
                </View>

                {/* Extra Details Section (UPDATED) */}
                <View style={styles.detailsCard}>
                    {/* Section Title with image */}
                    <View style={styles.sectionTitleRow}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.sectionTitle}>Details</Text>
                            <Image
                                source={require("../../../assets/images/save2.png")}
                                style={{ width: wp(3), height: hp(3), resizeMode: "contain", marginLeft: wp(2) }}
                            />
                        </View>
                    </View>

                    {/* Two rows with 3 items each (icon left + text right) */}
                    <View style={styles.threeColumnRow}>
                        <View style={styles.iconWithTextRow}>
                            <Ionicons name="car-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
                            <Text style={styles.valueText}>Diesel</Text>
                        </View>
                        <View style={styles.iconWithTextRow}>
                            <Ionicons name="speedometer-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
                            <Text style={styles.valueText}>12000.0 km</Text>
                        </View>
                        <View style={styles.iconWithTextRow}>
                            <Ionicons name="color-palette-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
                            <Text style={styles.valueText}>Automatic</Text>
                        </View>
                    </View>

                    <View style={styles.threeColumnRow}>
                        <View style={styles.iconWithTextRow}>
                            <Ionicons name="person" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
                            <Text style={styles.valueText}>2nd Owner</Text>
                        </View>
                        <View style={styles.iconWithTextRow}>
                            <Ionicons name="calendar-outline" size={wp(4)} style={{ marginRight: wp(1) }} color="#00000080" />
                            <Text style={styles.valueText}>2nd Owner</Text>
                        </View>
                        <View style={styles.iconWithTextRow}>
                            <MaterialIcons name="star" size={wp(4)} style={{ marginRight: wp(1) }} color="#CDFF03" />
                            <Text style={styles.valueText}>5 Star</Text>
                        </View>
                    </View>

                    {/* Brand / Model / Variant with title top, subtitle bottom (2 per row) */}
                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Brand</Text>
                            <Text style={styles.valueText}>Bugatti</Text>
                        </View>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Model</Text>
                            <Text style={styles.valueText}>Bugatti chiron</Text>
                        </View>
                    </View>
                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Listing Type</Text>
                            <Text style={styles.valueText}>Sell</Text>
                        </View>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Variant </Text>
                            <Text style={styles.valueText}>Variant </Text>
                        </View>
                    </View>
                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Seats</Text>
                            <Text style={styles.valueText}>4</Text>
                        </View>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Doors</Text>
                            <Text style={styles.valueText}>2</Text>
                        </View>
                    </View>
                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Listing Type</Text>
                            <Text style={styles.valueText}>Sell</Text>
                        </View>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Variant </Text>
                            <Text style={styles.valueText}>Variant </Text>
                        </View>
                    </View>
                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Seats</Text>
                            <Text style={styles.valueText}>4</Text>
                        </View>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Doors</Text>
                            <Text style={styles.valueText}>2</Text>
                        </View>
                    </View>
                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Seats</Text>
                            <Text style={styles.valueText}>4</Text>
                        </View>
                    </View>

                    <View style={styles.sectionTitleRow}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.sectionTitle}>Additional Details</Text>
                            <Image
                                source={require("../../../assets/images/save2.png")}
                                style={{ width: wp(3), height: hp(3), resizeMode: "contain", marginLeft: wp(2) }}
                            />
                        </View>
                    </View>

                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Listed by</Text>
                            <Text style={styles.valueText}>Owner</Text>
                        </View>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Seller Speaks</Text>
                            <Text style={styles.valueText}>English, Telugu, Hindi</Text>
                        </View>
                    </View>
                    <View style={styles.brandRows}>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Additional Security</Text>
                            <Text style={styles.valueText}>Driving License Claimed</Text>
                        </View>
                        <View style={styles.brandBox}>
                            <Text style={styles.keyText}>Respond in</Text>
                            <Text style={styles.valueText}>10 mins</Text>
                        </View>
                    </View>

                    <View style={styles.sectionTitleRow}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Image
                                source={require("../../../assets/images/save2.png")}
                                style={{ width: wp(3), height: hp(3), resizeMode: "contain", marginLeft: wp(2) }}
                            />
                        </View>
                    </View>

                    <View style={styles.textRow}>
                        <Text style={styles.valueTextBottom}>Genuine Apple part</Text>
                    </View>
                    <View style={styles.textRow}>
                        <Text style={styles.valueTextBottom}>1500 nts Brightness, High Touch capcity</Text>
                    </View>

                    {/* Bottom full width image */}

                </View>
                <Image
                    source={require("../../../assets/images/slidecar.png")}
                    style={styles.fullWidthImage}
                />
                <Image
                    source={require("../../../assets/images/slidecar.png")}
                    style={styles.fullWidthImage}
                />

                <View style={styles.bottomSection}>
                    {/* Top Info Row */}
                    <View style={styles.bottomLeftButton}>
                        <Image
                            source={require("../../../assets/images/bottombutton.png")}
                            style={styles.bottomImage}
                        />
                        <Text style={styles.bottomText}>
                            I am authorised to make ad edits & responsible for the information shared including ad details & prices
                        </Text>
                    </View>

                    {/* Buttons Row */}
                    <View style={styles.bottomButtonsRow}>
                        {/* Edit Button */}
                        <TouchableOpacity style={styles.editButton}>
                            <Image
                                source={require("../../../assets/images/save2.png")}
                                style={styles.editImage}
                            />
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>

                        {/* Next Button */}
                        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("Botomtabs")}>
                            <Text style={styles.bottomButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1%"),
        backgroundColor: "#fff",
        marginTop: hp(4)
    },
    shareBtn: {
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: wp("5%"),
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        marginRight: wp("3%"),
        marginTop: hp(2)
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: wp("3%"),
        paddingHorizontal: wp("3%"),
        height: hp("5%"),
        borderColor: "#ddd",
        borderWidth: 1
    },
    searchIcon: {
        marginRight: wp("2%"),
    },
    searchInput: {
        flex: 1,
        fontSize: wp("3.5%"),
        color: "#333",
    },
    micIcon: {
        width: wp("4.5%"),
        height: wp("4.5%"),
    },
    qrIcon: {
        width: wp("6%"),
        height: wp("6%"),
    },
    simpleText: {
        fontSize: wp("2.2%"),
        color: "#6E533F",
        marginRight: wp("3%"),
    },
    actionButton: {
        borderWidth: 1,
        borderColor: "#6C63FF",
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("0.4%"),
        borderRadius: wp("5%"),
        marginLeft: wp("2%"),
    },
    actionButtonText: {
        fontSize: wp("2.8%"),
        color: "#6C63FF",
        fontWeight: "600",
    },

    subtitleSection: {
        paddingHorizontal: wp("4%"),
        marginTop: hp("1.8%"),
        marginVertical: hp(0.8),
    },
    mainView: {
        justifyContent: "space-between",
        flexDirection: 'row'
    },
    subtitleTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("0.5%"),
    },
    subtitleBottom: {
        flexDirection: "row",
        alignItems: "center",
    },
    subtitleText: {
        fontWeight: "600",
        fontSize: wp("3.8%"),
        color: "#000",
    },
    locationText: {
        fontSize: wp("3%"),
        color: "gray",
        marginLeft: wp("1%"),
    },

    sliderWrapper: {
        width: "100%",
        height: hp("25%"),
        marginTop: hp("1.5%"),
    },
    image: {
        width,
        height: hp("28%"),
        resizeMode: "cover",
    },
    dotsContainer: {
        position: "absolute",
        bottom: hp("1.5%"),
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    dot: {
        width: wp("1.3%"),
        height: wp("1.3%"),
        borderRadius: wp("1%"),
        backgroundColor: "white",
        marginHorizontal: wp("1%"),
    },
    activeDot: {
        backgroundColor: "#6C63FF",
        width: wp("1.3%"),
        height: wp("1.3%"),
    },
    topRightIcons: {
        position: "absolute",
        top: hp("1.5%"),
        right: wp("2%"),
        flexDirection: "row",
    },
    iconButton: {
        backgroundColor: "white",
        padding: wp("1.5%"),
        borderRadius: wp("6%"),
        marginLeft: wp("2%"),
    },
    bottomRight: {
        position: "absolute",
        bottom: hp("1%"),
        right: wp("2%"),
        flexDirection: "row",
    },
    rowIcon: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp("3%"),
    },
    bottomLeft: {
        position: "absolute",
        bottom: hp("1%"),
        left: wp("2%"),
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(45, 45, 45, 0.5)",
        paddingHorizontal: wp("2.5%"),
        paddingVertical: hp("0.5%"),
        borderRadius: wp("3%"),
    },
    iconText: {
        color: "#fff",
        fontSize: wp("3%"),
        marginLeft: wp("1%"),
    },

    detailsCard: {
        marginTop: hp("2%"),
        marginHorizontal: wp("4%"),
        backgroundColor: "#fff",
        marginBottom: hp(1)
    },
    detailRowCustom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    detailText: {
        fontSize: wp("3.9%"),
        marginLeft: wp("1.5%"),
        color: "#333",
    },
    rightText: {
        fontSize: wp("3.5%"),
        fontWeight: "600",
        color: "#000",
    },
    detailTextCar: {
        fontSize: wp("2.8%"),
        marginLeft: wp("1.5%"),
        color: "#00000080",
    },
    rightTextCar: {
        fontSize: wp("2.8%"),
        fontWeight: "600",
        color: "#000",
    },
    saveimage: {
        width: wp('6%'),
        height: hp('1.6%'),
        resizeMode: 'contain',
        marginTop: wp(1)
    },

    sectionTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: hp("1%"),
    },
    sectionTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "#000",
    },

    threeColumnRow: {
        flexDirection: "row",
        marginLeft: wp(2),
        paddingVertical: hp(0.5),
        width: '100%',
        marginBottom: hp(2)
    },
    threeColumnRowBottom: {
        flexDirection: "row",
        marginBottom: hp(1.5),
        marginLeft: wp(2),
    },
    iconWithTextRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "30%",
    },

    brandRows: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hp(1.5),
        paddingHorizontal: wp(3),
        marginTop: hp(1.8)
    },
    brandBox: {
        width: "60%",
    },

    twoColumnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hp("1%"),
    },
    keyText: {
        fontSize: wp("3.4%"),
        color: "#00000099",
        marginBottom: hp(0.3)
    },
    valueText: {
        fontSize: wp("3.5%"),
        fontWeight: "600",
        color: "#000",
    },
    valueTextBottom: {
        marginBottom: hp(1),
        fontSize: wp(3)
    },
    fullWidthImage: {
        width: "100%",
        height: hp("20%"),
        resizeMode: "cover",
        marginTop: hp(1),
    },
    fullWidthImageBottom: {
        marginBottom: hp(10)
    },
    textRow: {
        marginTop: hp(0.1)
    },


    bottomSection: {
        position: "relative",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#D9D9D959",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        padding: wp(4),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: hp(2)
    },
    bottomLeftButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(1.5)
    },
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
    bottomButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#6C63FF",
        borderRadius: 12,
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        marginRight: wp(2),
    },
    editImage: {
        width: wp("4.5%"),
        height: wp("4.5%"),
        resizeMode: "contain",
        marginRight: wp(1.5),
    },
    editButtonText: {
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Medium",
        color: "#6C63FF",
    },
    bottomButton: {
        flex: 1,
        backgroundColor: "#6C63FF",
        paddingVertical: hp(1.2),
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: wp(1),
    },
    bottomButtonText: {
        color: "#fff",
        fontSize: wp("3.8%"),
        fontFamily: "Poppins-Medium",
    },

});
