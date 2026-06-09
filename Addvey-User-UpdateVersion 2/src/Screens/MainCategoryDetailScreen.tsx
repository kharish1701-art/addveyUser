import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    StatusBar
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const categories = [
    { title: "Motorcycles", icon: require("../../assets/images/Bikes.png") },
    { title: "Scooter", icon: require("../../assets/images/Bikes.png") },
    { title: "Electric Bikes", icon: require("../../assets/images/Bikes.png") },
    { title: "Bicycles", icon: require("../../assets/images/Bikes.png") },
    { title: "Spare Parts", icon: require("../../assets/images/Bikes.png") },
    { title: "Accessories", icon: require("../../assets/images/Bikes.png") },
];

const bikeSubCategories = [
    { title: "Sports Bike", icon: require("../../assets/images/subscooter.png") },
    { title: "Cruiser Bike", icon: require("../../assets/images/subscooter.png") },
    { title: "Touring Bike", icon: require("../../assets/images/subscooter.png") },
    { title: "Dirt Bike", icon: require("../../assets/images/subscooter.png") },
];

const carSubCategories = [
    { title: "Sedan", icon: require("../../assets/images/car.png") },
    { title: "SUV", icon: require("../../assets/images/car.png") },
    { title: "Hatchback", icon: require("../../assets/images/car.png") },
    { title: "Convertible", icon: require("../../assets/images/car.png") },
];

const MainCategoryDetailScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [isBikeExpanded, setIsBikeExpanded] = useState(false);
    const [isCarExpanded, setIsCarExpanded] = useState(false);
    const [selectedSubSub, setSelectedSubSub] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Topbar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp("4%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.topTitle}>Select vehicle sub category</Text>
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Category Heading */}
                <View style={styles.categoryHeader}>
                    <Image
                        source={require("../../assets/images/car.png")}
                        style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryText}>Vehicle</Text>
                </View>

                {/* Subtitle */}
                <Text style={styles.subHeading}>Select sub category</Text>
                <Text style={styles.subText}>
                    Your ad will appear in searches for these categories
                </Text>

                {/* Search Box */}
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={wp("4%")} color="#00000099" />
                    <TextInput
                        placeholder="Search for categories"
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                    />
                </View>

                {/* Bike Expandable Section */}
                <TouchableOpacity
                    style={styles.expandableHeader}
                    onPress={() => setIsBikeExpanded(!isBikeExpanded)}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image
                            source={require("../../assets/images/Bikes.png")}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryLabel}>Bikes</Text>
                    </View>
                    <Ionicons
                        name={isBikeExpanded ? "chevron-up" : "chevron-down"}
                        size={wp("4.5%")}
                        color="#6C63FF"
                    />
                </TouchableOpacity>

                {isBikeExpanded && (
                    <View style={styles.categoryList}>
                        {bikeSubCategories.map((cat, index) => {
                            const isSelected = selectedSubSub === cat.title;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.categoryItem,
                                        isSelected && {
                                            borderColor: "#6C63FF",
                                            backgroundColor: "#F7F7F7",
                                        },
                                    ]}
                                    onPress={() => setSelectedSubSub(cat.title)}
                                >
                                    <Image source={cat.icon} style={styles.subCategoryImage} />
                                    <Text style={styles.subCategoryLabel}>{cat.title}</Text>
                                    {isSelected && (
                                        <View style={styles.selectedCircle} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Car Expandable Section */}
                <TouchableOpacity
                    style={styles.expandableHeader}
                    onPress={() => setIsCarExpanded(!isCarExpanded)}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image
                            source={require("../../assets/images/catcar.png")}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryLabel}>Cars</Text>
                    </View>
                    <Ionicons
                        name={isCarExpanded ? "chevron-up" : "chevron-down"}
                        size={wp("4.5%")}
                        color="#6C63FF"
                    />
                </TouchableOpacity>

                {isCarExpanded && (
                    <View style={styles.categoryList}>
                        {carSubCategories.map((cat, index) => {
                            const isSelected = selectedSubSub === cat.title;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.categoryItem,
                                        isSelected && {
                                            borderColor: "#6C63FF",
                                            backgroundColor: "#F7F7F7",
                                        },
                                    ]}
                                    onPress={() => setSelectedSubSub(cat.title)}
                                >
                                    <Image source={cat.icon} style={styles.subCategoryImage} />
                                    <Text style={styles.subCategoryLabel}>{cat.title}</Text>
                                    {isSelected && (
                                        <View style={styles.selectedCircle} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomWrapper}>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("AddDetailFirst")}>
                    <Text style={styles.bottomButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default MainCategoryDetailScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff'
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginTop: hp(4),
        gap: 8,
    },
    topTitle: {
        fontSize: wp("4.2%"),
        fontFamily: "Poppins-Medium",
        color: "#000",
        marginTop: 2,
    },
    scrollContent: {
        paddingHorizontal: wp(5),
        paddingBottom: hp(12),
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(2),
    },
    categoryIcon: {
        width: wp("11%"),
        height: wp("11%"),
        resizeMode: "contain",
        marginRight: wp(2.5),
    },
    categoryText: {
        fontSize: wp("4.2%"),
        fontFamily: "Poppins-Medium",
        color: "#000",
        marginTop: hp(0.5),
    },
    subHeading: {
        marginTop: hp(3),
        fontSize: wp("4%"),
        fontFamily: "Poppins-Medium",
        color: "#000",
    },
    subText: {
        fontSize: wp("2.8%"),
        color: "#666",
        marginBottom: hp(2),
        fontFamily: "Poppins-Regular",
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: wp(3),
        marginBottom: hp(1.5),
    },
    searchInput: {
        flex: 1,
        marginLeft: wp(2),
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Regular",
        color: "#000",
        marginTop: hp(0.5),
    },
    expandableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        padding: wp(3),
        marginBottom: hp(1),
    },
    categoryList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    categoryItem: {
        width: "47%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: hp(2),
        backgroundColor: "#fff",
        position: "relative",
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.2),
    },
    categoryImage: {
        width: wp("10%"),
        height: wp("10%"),
        resizeMode: "contain",
        marginRight: wp(2),
    },
    subCategoryImage: {
        width: wp("6%"),
        height: wp("6%"),
        resizeMode: "contain",
        marginRight: wp(1),
    },
    categoryLabel: {
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Medium",
        color: "#000",
    },
    subCategoryLabel: {
        fontSize: wp("2.7%"),
        fontFamily: "Poppins-Medium",
        color: "#000",
        paddingLeft: wp(1),
        marginTop: hp(0.3),
    },
    selectedCircle: {
        position: "absolute",
        right: wp(2),
        width: wp(3.5),
        height: wp(3.5),
        borderRadius: wp(3.5) / 2,
        borderWidth: 3,
        borderColor: "#6C63FF",
        marginRight: wp(2),
    },
    bottomWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: wp(4),
    },
    bottomButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp(1.3),
        borderRadius: 12,
        alignItems: "center",
        marginBottom: hp(1),
    },
    bottomButtonText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontFamily: "Poppins-Medium",
    },
});
