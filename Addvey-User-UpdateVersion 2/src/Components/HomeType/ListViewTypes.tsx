// ListViewTypesScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AddCardPreview from "../MainHome/AddCardPreview";
import { useNavigation } from "@react-navigation/native";
import { EndPoints } from "../../services/EndPoints";
import { shareProduct } from "../CommonFunction";

export default function ListViewTypesScreen({ subCategory }) {
    const navigation = useNavigation<any>();
    const [count, setCount] = useState(0)
    // console.log(subCategory?.id)
    return (
        <SafeAreaView style={styles.container}>
            {/* 🔹 Top Header */}
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <Text style={styles.title}>{count} {subCategory?.name}</Text>
                </View>
                <TouchableOpacity onPress={() => shareProduct(subCategory?.id)}>
                    <Feather
                        name="share"
                        size={hp("2%")}
                        color="#000"
                        style={{ marginRight: wp("1%") }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: '#D9D9D9', marginBottom: 10, marginHorizontal: -15 }} />
            {/* <View style={styles.filtersSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    <TouchableOpacity style={styles.filterButton}>
                        <Image
                            source={require("../../../assets/images/catcar.png")}
                            style={styles.filterImage}
                        />
                        <Text style={styles.filterText}>Filters</Text>
                        <MaterialIcons
                            name="arrow-drop-down"
                            size={hp("2.5%")}
                            color="#000"
                            style={{ marginLeft: wp("0.5%") }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Recent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>List Type</Text>
                        <MaterialIcons
                            name="arrow-drop-down"
                            size={hp("2.5%")}
                            color="#000"
                            style={{ marginLeft: wp("0.5%") }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Distance</Text>
                        <MaterialIcons
                            name="arrow-drop-down"
                            size={hp("2.5%")}
                            color="#000"
                            style={{ marginLeft: wp("0.5%") }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Quick Filters</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View> */}
            <AddCardPreview type={'list'} EndpointUrl={EndPoints.getProduct + `?superSubCategory=${subCategory?.id || subCategory?._id}`} hidePostCount={true} setCount={setCount} hideFilter={true} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("4%"),
        paddingTop: hp("3%"),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: hp("1.5%"),
    },
    leftHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: hp("1.5%"),
        color: "#6B4423",
        fontFamily: "Poppins-Medium",
    },
    filtersSection: {
        marginTop: hp("0.5%"),
    },
    filtersContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: wp("3%"),
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#00000033",
        borderRadius: hp("1%"),
        paddingVertical: hp("0.8%"),
        paddingHorizontal: wp("2.5%"),
        marginRight: wp("3%"),
        backgroundColor: "#fff",
        marginBottom: hp(2)
    },
    filterText: {
        fontSize: hp("1.4%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
    },
    filterImage: {
        width: wp("4.5%"),
        height: wp("4.5%"),
        resizeMode: "contain",
        marginRight: wp("2%"),
        marginTop: hp(0.5)
    },
});
