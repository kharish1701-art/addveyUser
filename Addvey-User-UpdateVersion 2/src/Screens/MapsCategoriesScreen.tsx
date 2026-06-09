// MapscategoriesScreen.tsx
import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ScrollView,
    Image,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type SubCategory = {
    id: string;
    title: string;
    icon: any;
};

type Category = {
    id: string;
    title: string;
    icon: any;
    subcategories: SubCategory[];
};

const SAMPLE_CATEGORIES: Category[] = [
    {
        id: "apartments",
        title: "Apartments",
        icon: require("../../assets/images/apart.png"),
        subcategories: [
            { id: "1bhk", title: "1 BHK", icon: require("../../assets/images/apart.png") },
            { id: "2bhk", title: "2 BHK", icon: require("../../assets/images/apart.png") },
            { id: "3bhk", title: "3 BHK", icon: require("../../assets/images/apart.png") },
            { id: "4bhk", title: "4 BHK", icon: require("../../assets/images/apart.png") },
            { id: "penthouse", title: "Penthouse", icon: require("../../assets/images/apart.png") },
        ],
    },
    {
        id: "houses",
        title: "Houses",
        icon: require("../../assets/images/cathouse.png"),
        subcategories: [
            { id: "villa", title: "Villa", icon: require("../../assets/images/cathouse.png") },
            { id: "bungalow", title: "Bungalow", icon: require("../../assets/images/cathouse.png") },
            { id: "duplex", title: "Duplex", icon: require("../../assets/images/cathouse.png") },
        ],
    },
    {
        id: "commercial",
        title: "Commercial Properties",
        icon: require("../../assets/images/property.png"),
        subcategories: [
            { id: "office", title: "Office", icon: require("../../assets/images/property.png") },
            { id: "retail", title: "Retail", icon: require("../../assets/images/property.png") },
            { id: "warehouse", title: "Warehouse", icon: require("../../assets/images/property.png") },
        ],
    },
    {
        id: "shared",
        title: "Shared Living",
        icon: require("../../assets/images/living.png"),
        subcategories: [
            { id: "co-living", title: "Co-living", icon: require("../../assets/images/living.png") },
            { id: "hostel", title: "Hostel", icon: require("../../assets/images/living.png") },
        ],
    },
    {
        id: "farmhouses",
        title: "Farmhouses & Villas",
        icon: require("../../assets/images/lasthouse.png"),
        subcategories: [
            { id: "farmhouse", title: "Farmhouse", icon: require("../../assets/images/lasthouse.png") },
            { id: "country-villa", title: "Country Villa", icon: require("../../assets/images/lasthouse.png") },
        ],
    }
];

export default function MapscategoriesScreen() {
    const navigation = useNavigation<any>();
    const [categories] = useState<Category[]>(SAMPLE_CATEGORIES);
    const [activeCategoryId, setActiveCategoryId] = useState<string>(SAMPLE_CATEGORIES[0].id);
    const [search, setSearch] = useState<string>("");

    const activeCategory =
        categories.find((c) => c.id === activeCategoryId) || categories[0];

    const filteredSubcategories = activeCategory.subcategories.filter((s) =>
        s.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <SafeAreaView style={styles.safe}>
            {/* Topbar */}
            <View style={styles.topbar}>
                <View style={styles.topLeft}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" style={{ marginRight: wp(2) }} size={hp("2.2%")} color="#000000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.locationWrap}>
                        <Text style={styles.locationText}>Properties</Text>
                        <Ionicons name="chevron-down" size={hp("2%")} style={{ marginTop: hp(0.7), marginLeft: wp(1) }} color="#6C63FF" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.searchIconBtn}>
                    <Ionicons name="search-outline" size={hp("2.5%")} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={hp("2.4%")}
                    color="#999"
                    style={styles.inputIcon}
                />
                <TextInput
                    placeholder="Search here for more"
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* Main Content */}
            <View style={styles.contentWrap}>
                {/* LEFT SIDEBAR */}
                <View style={styles.leftRail}>
                    <ScrollView
                        contentContainerStyle={styles.leftInner}
                        showsVerticalScrollIndicator={false}
                    >
                        {categories.map((cat, index) => {
                            const isActive = cat.id === activeCategoryId;
                            const prevActive = categories[index - 1]?.id === activeCategoryId;
                            const nextActive = categories[index + 1]?.id === activeCategoryId;

                            const borderStyles: any = {
                                borderRightWidth: isActive ? 0 : 1,
                                borderRightColor: "#e3e3e3",
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                marginVertical: isActive ? hp("1%") : 0,
                            };

                            if (prevActive) {
                                borderStyles.borderTopWidth = 1;
                                borderStyles.borderTopColor = "#e3e3e3";
                                borderStyles.borderTopRightRadius = wp("3%");
                            }

                            if (nextActive) {
                                borderStyles.borderBottomWidth = 1;
                                borderStyles.borderBottomColor = "#e3e3e3";
                                borderStyles.borderBottomRightRadius = wp("3%");
                            }

                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    activeOpacity={0.8}
                                    onPress={() => setActiveCategoryId(cat.id)}
                                    style={[styles.catItem, borderStyles]}
                                >
                                    {isActive && <View style={styles.activeLine} />}

                                    <Image source={cat.icon} style={styles.catIconImg} resizeMode="contain" />
                                    <Text
                                        style={[
                                            styles.catLabel,
                                            isActive ? styles.catLabelActive : undefined,
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {cat.title}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* RIGHT CONTENT */}
                <View style={styles.rightContent}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{activeCategory.title}</Text>
                        <TouchableOpacity style={styles.expandBtn} onPress={() => navigation.navigate('ListView')}>
                            <MaterialIcons name="keyboard-arrow-right" size={hp(2.5)} style={{ marginTop: hp(0.5) }} color="#6C63FF" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={filteredSubcategories}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        contentContainerStyle={styles.subcatList}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.subcatCard} activeOpacity={0.8}>
                                <Image source={item.icon} style={styles.subcatImage} resizeMode="contain" />
                                <Text style={styles.subcatTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const LEFT_RAIL_WIDTH = wp("26%");
const RIGHT_PADDING = wp("3%");

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },

    // Topbar
    topbar: {
        height: hp("8%"),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("3%"),
        borderBottomWidth: 0.6,
        borderBottomColor: "#e3e3e3",
        backgroundColor: "#fff",
        marginTop: hp(3),
    },
    topLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backBtn: {
        marginRight: wp("1%"),
    },
    locationWrap: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: {
        fontSize: hp("2%"),
        color: "#333",
        marginRight: wp("1%"),
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.7),
    },
    searchIconBtn: {
        padding: wp("1%"),
    },

    //Search Bar
    searchContainer: {
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1%"),
        borderBottomWidth: 0.6,
        borderBottomColor: "#f1f1f1",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: wp("5%"),
        zIndex: 1,
    },
    searchInput: {
        height: hp("5.5%"),
        borderRadius: hp("1%"),
        paddingLeft: wp("10%"),
        fontSize: hp("1.9%"),
        borderWidth: 0.6,
        borderColor: "#00000080",
        flex: 1,
    },

    // Main Content
    contentWrap: {
        flex: 1,
        flexDirection: "row",
    },

    // LEFT SIDE
    leftRail: {
        width: LEFT_RAIL_WIDTH,
        backgroundColor: "#fff",
    },
    leftInner: {
        paddingVertical: hp("2%"),
        alignItems: "center",
    },
    catItem: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: hp("2%"),
        marginVertical: hp("0.6%"),
        position: "relative",
        backgroundColor: "#fff",
    },
    activeLine: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: wp("1.2%"),
        backgroundColor: "#6C63FF",
        borderTopRightRadius: wp("4%"),
        borderBottomRightRadius: wp("4%"),
    },
    catIconImg: {
        width: wp("10%"),
        height: wp("10%"),
        marginBottom: hp("0.8%"),
    },
    catLabel: {
        fontSize: hp("1.4%"),
        color: "#444",
        textAlign: "center",
        width: "100%",
        fontFamily: "Poppins-Medium",
    },
    catLabelActive: {
        color: "#000",
        fontWeight: "700",
    },

    // RIGHT SIDE
    rightContent: {
        flex: 1,
        paddingHorizontal: RIGHT_PADDING,
        paddingTop: hp("2%"),
        backgroundColor: "#fff",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1.2%"),
    },
    sectionTitle: {
        fontSize: hp("2%"),
        color: "#111",
        fontFamily: "Poppins-Medium",
        marginTop: hp(1),
    },
    expandBtn: {
        width: wp("8%"),
        alignItems: "flex-end",
    },
    subcatList: {
        paddingBottom: hp("8%"),
    },
    subcatCard: {
        width: (wp("100%") - LEFT_RAIL_WIDTH - RIGHT_PADDING * 2) / 3 - wp("1%"),
        margin: wp("1%"),
        alignItems: "center",
        paddingVertical: hp("1.6%"),
        backgroundColor: "#fff",
    },
    subcatImage: {
        width: wp("14%"),
        height: wp("14%"),
        marginBottom: hp("1%"),
        resizeMode: "contain",
    },
    subcatTitle: {
        fontSize: hp("1.4%"),
        textAlign: "center",
        color: "#333",
        fontFamily: "Poppins-Medium",
    },
});
