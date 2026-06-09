// BuyandSell.tsx
import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    ImageSourcePropType,
    StatusBar
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import ChoosAddveyScreen from "../Components/Home/ChooseScreen";
import { useNavigation } from "@react-navigation/native";

const categories: {
    name: string;
    image: ImageSourcePropType | string;
    subCategories: { name: string; image: ImageSourcePropType | string }[];
}[] = [
        {
            name: "Vehicles",
            image: require("../../assets/images/car.png"),
            subCategories: [
                { name: "Bikes", image: require("../../assets/images/moter.png") },
                { name: "Cars", image: require("../../assets/images/cars.png") },
                {
                    name: "Commercial Vehicles",
                    image: require("../../assets/images/rish.png"),
                },
            ],
        },
        {
            name: "Properties",
            image: require("../../assets/images/house.png"),
            subCategories: [
                { name: "Bikes", image: require("../../assets/images/moter.png") },
                { name: "Cars", image: require("../../assets/images/cars.png") },
                {
                    name: "Commercial Vehicles",
                    image: require("../../assets/images/rish.png"),
                },
            ],
        },
        {
            name: "Mobiles",
            image: require("../../assets/images/mobile.png"),
            subCategories: [
                { name: "Bikes", image: require("../../assets/images/moter.png") },
                { name: "Cars", image: require("../../assets/images/cars.png") },
                {
                    name: "Commercial Vehicles",
                    image: require("../../assets/images/rish.png"),
                },
            ],
        },
        {
            name: "Electronics",
            image: require("../../assets/images/laptop.png"),
            subCategories: [
                { name: "Bikes", image: require("../../assets/images/moter.png") },
                { name: "Cars", image: require("../../assets/images/cars.png") },
                {
                    name: "Commercial Vehicles",
                    image: require("../../assets/images/rish.png"),
                },
            ],
        },
        {
            name: "Appliances",
            image: require("../../assets/images/acc.png"),
            subCategories: [
                { name: "Bikes", image: require("../../assets/images/moter.png") },
                { name: "Cars", image: require("../../assets/images/cars.png") },
                {
                    name: "Commercial Vehicles",
                    image: require("../../assets/images/rish.png"),
                },
            ],
        },
    ];

const BuyandSell: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState("Vehicles");
    const navigation = useNavigation<any>();

    const currentSubCategories =
        categories.find((cat) => cat.name === activeCategory)?.subCategories || [];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.topLeftRow}>
                    <Ionicons name="arrow-back" size={wp("4%")} color="black" />
                    <Image
                        source={require("../../assets/images/login.png")}
                        style={styles.topImage}
                    />

                    <View style={styles.logoRow}>
                        <View>
                            <Text style={styles.appName}>Addvey</Text>
                            <Text style={styles.partnerText}>Partner App</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.languageBtn}>
                    <Ionicons name="globe-outline" size={wp("4.5%")} color="#6E533F" />
                    <Text style={styles.languageText}>English</Text>
                </TouchableOpacity>
            </View>

            {/* Scrollable Center Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Categories */}
                <View>
                    <View style={styles.sectionHeader}>
                        <Image
                            source={require("../../assets/images/bycir.png")}
                            style={styles.sectionImage}
                        />
                        <Text style={styles.sectionTitle}>
                            Buy/Sell: <Text style={{ fontWeight: "400" }}>Categories</Text>
                        </Text>
                    </View>

                    {/* Category Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.categoryRow}>
                            {categories.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.categoryItem,
                                        activeCategory === item.name && styles.activeCategory,
                                    ]}
                                    onPress={() => setActiveCategory(item.name)}
                                >
                                    <Image
                                        source={
                                            typeof item.image === "string"
                                                ? { uri: item.image }
                                                : item.image
                                        }
                                        style={styles.categoryImage}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            activeCategory === item.name &&
                                            styles.activeCategoryText,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>


                    {/* Subcategories */}
                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.subCategoryRow}>
                            {currentSubCategories.map((sub, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.subCategoryItem}
                                >
                                    <Image
                                        source={
                                            typeof sub.image === "string"
                                                ? { uri: sub.image }
                                                : sub.image
                                        }
                                        style={styles.subCategoryImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.subCategoryText}>{sub.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView> */}
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeBox}>
                    <Text style={styles.welcomeText}>Welcome to Addvey</Text>
                    <Text style={styles.sellText}>I Want to Sell/Rent/Lease</Text>
                    <View style={styles.secureBox}>
                        <Image
                            source={require("../../assets/images/tik.png")}
                            style={styles.tikImg}
                        />
                        <Text style={styles.secureText}>
                            Secure and easy deals, every time
                        </Text>
                    </View>

                    {/* Image Banner */}
                    <View style={styles.bannerBox}>
                        <Image
                            source={require('../../assets/images/bigcar.png')}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />

                        {/* Play Button wrapper with background */}
                        <View style={styles.playButtonWrapper}>
                            <TouchableOpacity style={styles.playButton}>
                                <Entypo
                                    name="controller-play"
                                    size={wp("10%")}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Text below image */}
                        <Text style={styles.bannerText}>Get started - It only takes 3
                            minutes</Text>
                    </View>
                </View>
                <ChoosAddveyScreen />
            </ScrollView>

            {/* Fixed Bottom Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("Categories")}>
                    <Text style={styles.startButtonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default BuyandSell;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1.5%"),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginTop: hp(5),
    },
    topLeftRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    topImage: {
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: wp("4%"),
        marginLeft: wp("2%"),
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp("2%"),
    },
    appName: {
        fontSize: wp("3.5%"),
        fontWeight: "600",
        color: "#000",
    },
    partnerText: {
        fontSize: wp("2%"),
        color: "#6E533F",
    },
    languageBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: wp("6%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("0.5%"),
    },
    languageText: {
        marginLeft: wp("1%"),
        fontSize: wp("2.8%"),
        color: "#000",
    },
    scrollContent: {
        paddingHorizontal: wp("4%"),
        paddingBottom: hp("12%"),
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1%"),
        paddingVertical: hp(2),
    },
    sectionImage: {
        width: wp("8%"),
        height: wp("8%"),
        marginRight: wp("1%"),
    },
    tikImg: {
        width: wp("7%"),
        height: wp("7%"),
        marginRight: wp("1%"),
    },
    sectionTitle: {
        fontSize: wp("4.5%"),
        fontWeight: "600",
    },
    categoryRow: {
        flexDirection: "row",
        marginBottom: hp("2%"),
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    categoryItem: {
        alignItems: "center",
        marginRight: wp("3%"),
        paddingBottom: hp("1%"),
        width: wp("16%"),
    },
    activeCategory: {
        borderBottomWidth: 3,
        borderBottomColor: "#6C63FF",
        marginBottom: -3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },
    categoryImage: {
        width: wp("11%"),
        height: wp("11%"),
        marginBottom: hp("0.5%"),
    },
    categoryText: {
        fontSize: wp("2.9%"),
        color: "#000",
    },
    activeCategoryText: {
        color: "black",
        fontWeight: "700",
    },
    subCategoryRow: {
        flexDirection: "row",
        marginBottom: hp("2%"),
    },
    subCategoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("2%"),
        paddingVertical: hp("0.8%"),
        borderWidth: 1,
        borderColor: "#00000033",
        borderRadius: wp("2%"),
        marginRight: wp("2%"),
    },
    subCategoryImage: {
        width: wp("5%"),
        height: wp("5%"),
        marginRight: wp("1%"),
    },
    subCategoryText: {
        fontSize: wp("3%"),
        color: "#000",
    },
    welcomeBox: {
        alignItems: "center",
        marginTop: hp("4%"),
    },
    welcomeText: {
        fontSize: wp("4.5%"),
        color: "gray",
        marginBottom: hp("0.5%"),
        fontFamily: 'Poppins-Regular'
    },
    sellText: {
        fontSize: wp("6%"),
        fontWeight: "700",
        color: "#000",
        marginBottom: hp("2%"),
        fontFamily: 'Poppins-medium'
    },
    secureBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#CAB23F1A",
        borderRadius: wp("2%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("0.5%"),
        marginBottom: hp("2%"),
    },
    secureText: {
        fontSize: wp("3.5%"),
        color: "#32CD32",
        marginLeft: wp("1%"),
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.3)
    },
    bannerBox: {
        width: "100%",
        borderRadius: wp("3%"),
        overflow: "hidden",
        position: "relative",
        borderColor: '#00000033',
        borderWidth: 1,
        padding: '4%',
        marginTop: hp(4)
    },
    bannerImage: {
        width: "100%",
        height: hp("25%"),
        borderRadius: wp("3%"),
    },
    playButtonWrapper: {
        position: "absolute",
        top: "40%",
        left: "45%",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: wp("2%"),
        borderRadius: wp("10%"),
    },

    playButton: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: wp("10%"),
        padding: wp("0%"),
        alignItems: "center",
        justifyContent: "center",
    },

    bannerText: {
        marginTop: hp("1.5%"),
        fontSize: wp("6%"),
        color: "#333",
        fontFamily: 'Poppins-Bold'
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: wp("4%"),
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#0000000D",
        borderTopLeftRadius: (5),
        borderTopRightRadius: (5),
    },
    startButton: {
        backgroundColor: "#6C63FF",
        borderRadius: wp("4%"),
        paddingVertical: hp("1.5%"),
        alignItems: "center",
    },
    startButtonText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontFamily: 'Poppins-Medium'
    },
});
