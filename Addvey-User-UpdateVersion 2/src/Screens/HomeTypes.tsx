// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     ScrollView,
//     StyleSheet,
//     Modal,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import AddCardPreview from "../Components/MainHome/AddCardPreview";
// import ListTypeModal from "../Components/HomeType/ListTypeModal";
// import Distance from "../Components/HomeType/Distance";
// import LanguageModal from "../Components/HomeType/LanguagesModal";


// interface FilterButton {
//     id: string;
//     label: string;
// }

// const HomeTypeScreen: React.FC = () => {
//     const [selected, setSelected] = useState<string | null>(null);
//     const [showListTypeModal, setShowListTypeModal] = useState<boolean>(false);
//     const [showDistanceModal, setShowDistanceModal] = useState<boolean>(false);
//     const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

//     const buttons: FilterButton[] = [
//         { id: "category", label: "Category" },
//         { id: "listType", label: "List Type" },
//         { id: "distance", label: "Distance" },
//         { id: "recent", label: "Recent" },
//         { id: "Language", label: "Language" },
//     ];

//     const handleButtonPress = (id: string) => {
//         if (id === "listType") {
//             setShowListTypeModal(true);
//         } else if (id === "distance") {
//             setShowDistanceModal(true);
//         } else if (id === "Language") {
//             setShowLanguageModal(true);
//         } else {
//             setSelected(id === selected ? null : id);
//         }
//     };


//     const renderContent = () => {
//         switch (selected) {
//             case "category":
//                 return <Text style={styles.contentText}>Category Component</Text>;
//             case "recent":
//                 return <Text style={styles.contentText}>Recent Component</Text>;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {/* Horizontal Buttons */}
//             {/* <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.scrollContainer}
//             >
//                 {buttons.map((btn) => (
//                     <TouchableOpacity
//                         key={btn.id}
//                         style={[
//                             styles.button,
//                             selected === btn.id && styles.activeButton,
//                         ]}
//                         onPress={() => handleButtonPress(btn.id)}
//                     >
//                         <Text
//                             style={[
//                                 styles.buttonText,
//                                 selected === btn.id && styles.activeButtonText,
//                             ]}
//                         >
//                             {btn.label}
//                         </Text>
//                         <MaterialIcons
//                             name="arrow-drop-down"
//                             size={wp("5%")}
//                             color={selected === btn.id ? "#fff" : "#000"}
//                             style={{ marginLeft: wp("1%") }}
//                         />
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView> */}

//             {/* Post Count Text */}
//             {/* <Text style={styles.postCount}>11 Posts</Text> */}

//             {/* AddCardPreview with horizontal margin */}
//             <View style={styles.cardWrapper}>
//                 <AddCardPreview />
//             </View>

//             {/* Dynamic Content */}
//             <View style={styles.contentContainer}>{renderContent()}</View>

//             {/* List Type Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent
//                 visible={showListTypeModal}
//                 onRequestClose={() => setShowListTypeModal(false)}
//             >
//                 <ListTypeModal onClose={() => setShowListTypeModal(false)} />
//             </Modal>

//             {/* Distance Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent
//                 visible={showDistanceModal}
//                 onRequestClose={() => setShowDistanceModal(false)}
//             >
//                 <Distance onClose={() => setShowDistanceModal(false)} />
//             </Modal>

//             {/* Language Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent
//                 visible={showLanguageModal}
//                 onRequestClose={() => setShowLanguageModal(false)}
//             >
//                 <LanguageModal onClose={() => setShowLanguageModal(false)} />
//             </Modal>
//         </View>
//     );
// };

// export default HomeTypeScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         paddingVertical: hp("2%"),
//     },
//     scrollContainer: {
//         paddingHorizontal: wp("3%"),
//         alignItems: "center",
//     },
//     button: {
//         flexDirection: "row",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: wp("3%"),
//         paddingVertical: hp("0.8%"),
//         paddingHorizontal: wp("3%"),
//         marginRight: wp("3%"),
//         backgroundColor: "#fff",
//     },
//     activeButton: {
//         backgroundColor: "#000",
//         borderColor: "#000",
//     },
//     buttonText: {
//         fontSize: wp("2.8%"),
//         color: "#000",
//         fontFamily: "Poppins-Medium",
//         marginTop: hp(0.2),
//     },
//     activeButtonText: {
//         color: "#fff",
//     },
//     postCount: {
//         textAlign: "center",
//         fontSize: wp("3.5%"),
//         color: "#00000099",
//         marginTop: hp("2%"),
//         fontFamily: "Poppins-Medium",
//     },
//     cardWrapper: {
//         marginHorizontal: wp("4%"),
//         marginTop: hp("2%"),
//     },
//     contentContainer: {
//         marginTop: hp("3%"),
//         alignItems: "center",
//         justifyContent: "center",
//         paddingHorizontal: wp("4%"),
//     },
//     contentText: {
//         fontSize: wp("4%"),
//         color: "#333",
//         fontWeight: "600",
//         textAlign: "center",
//     },
// });


import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AddCardPreview from "../Components/MainHome/AddCardPreview";
import ListTypeModal from "../Components/HomeType/ListTypeModal";
import Distance from "../Components/HomeType/Distance";
import LanguageModal from "../Components/HomeType/LanguagesModal";
import { EndPoints } from "../services/EndPoints";
import { getApi } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image, FlatList } from "react-native";
import { buildImageSource } from "../utils/imageFallback";


interface FilterButton {
    id: string;
    label: string;
}

const HomeTypeScreen: React.FC = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [showListTypeModal, setShowListTypeModal] = useState<boolean>(false);
    const [showDistanceModal, setShowDistanceModal] = useState<boolean>(false);
    const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const res = await getApi(
                EndPoints.getCategories,
                setLoading,
                token
            );
            console.log("res",JSON.stringify(res))
            if (res?.success) {
                setCategories(res?.data?.data || []);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };


    const buttons: FilterButton[] = [
        { id: "category", label: "Category" },
        { id: "listType", label: "List Type" },
        { id: "distance", label: "Distance" },
        { id: "recent", label: "Recent" },
        { id: "Language", label: "Language" },
    ];

    const handleButtonPress = (id: string) => {
        if (id === "listType") {
            setShowListTypeModal(true);
        } else if (id === "distance") {
            setShowDistanceModal(true);
        } else if (id === "Language") {
            setShowLanguageModal(true);
        } else {
            const newValue = id === selected ? null : id;
            setSelected(newValue as any);
        }
    };

    const renderContent = () => {
        switch (selected) {
            case "category":
                return (
                    <View style={styles.listWrapper}>
                        <FlatList
                            data={categories}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{
                                paddingHorizontal: wp("2%"),
                            }}
                            renderItem={({ item }) => {
                                const isActive = false; // Add selection logic if needed
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            // Handle navigate or selection
                                            navigation.navigate("ListView", {
                                                category: item,
                                                parentCategory: { name: "Category" },
                                            });
                                        }}
                                        style={[
                                            styles.cardContainer,
                                            isActive && styles.activeCardContainer,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.imageWrapper,
                                                {
                                                    borderWidth: isActive ? 0 : 0,
                                                    borderColor: isActive ? "transparent" : "transparent",
                                                    borderRadius: wp("8.5%"),
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={buildImageSource(item?.image)}
                                                style={styles.image}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <Text
                                            style={[styles.cardText, isActive && styles.activeCardText]}
                                            numberOfLines={1}
                                        >
                                            {item.name}
                                        </Text>

                                        {isActive && <View style={styles.activeBottomLine} />}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                );
            case "recent":
                return <Text style={styles.contentText}>Recent Component</Text>;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Horizontal Buttons */}
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {buttons.map((btn) => (
                    <TouchableOpacity
                        key={btn.id}
                        style={[
                            styles.button,
                            selected === btn.id && styles.activeButton,
                        ]}
                        onPress={() => handleButtonPress(btn.id)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selected === btn.id && styles.activeButtonText,
                            ]}
                        >
                            {btn.label}
                        </Text>
                        <MaterialIcons
                            name="arrow-drop-down"
                            size={wp("5%")}
                            color={selected === btn.id ? "#fff" : "#000"}
                            style={{ marginLeft: wp("1%") }}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView> */}

            {/* Post Count Text */}
            {/* <Text style={styles.postCount}>11 Posts</Text> */}

            {/* AddCardPreview with horizontal margin */}
            <View style={styles.cardWrapper}>
                <AddCardPreview 
                hideFilter={true} 
                disableListScroll={true}
                />
            </View>

            {/* Dynamic Content */}
            {/* <View style={styles.contentContainer}>{renderContent()}</View> */}

            <Modal
                animationType="slide"
                transparent
                visible={showListTypeModal}
                onRequestClose={() => setShowListTypeModal(false)}
            >
                <ListTypeModal onClose={() => setShowListTypeModal(false)} onSelect={(val) => console.log(val)} />
            </Modal>

            {/* Distance Modal */}
            <Modal
                animationType="slide"
                transparent
                visible={showDistanceModal}
                onRequestClose={() => setShowDistanceModal(false)}
            >
                <Distance onClose={() => setShowDistanceModal(false)} onSelect={(val) => console.log(val)} />
            </Modal>

            {/* Language Modal */}
            <Modal
                animationType="slide"
                transparent
                visible={showLanguageModal}
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <LanguageModal onClose={() => setShowLanguageModal(false)} />
            </Modal>
        </View>
    );
};

export default HomeTypeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // paddingVertical: hp("2%"),
    },
    scrollContainer: {
        paddingHorizontal: wp("3%"),
        alignItems: "center",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: wp("3%"),
        paddingVertical: hp("0.8%"),
        paddingHorizontal: wp("3%"),
        marginRight: wp("3%"),
        backgroundColor: "#fff",
    },
    activeButton: {
        backgroundColor: "#000",
        borderColor: "#000",
    },
    buttonText: {
        fontSize: wp("2.8%"),
        color: "#000",
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.2),
    },
    activeButtonText: {
        color: "#fff",
    },
    postCount: {
        textAlign: "center",
        fontSize: wp("3.5%"),
        color: "#00000099",
        marginTop: hp("2%"),
        fontFamily: "Poppins-Medium",
    },
    cardWrapper: {
        marginHorizontal: wp("4%"),
        marginTop: hp("2%"),
    },
    contentContainer: {
        marginTop: hp("3%"),
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: wp("4%"),
    },
    contentText: {
        fontSize: wp("4%"),
        color: "#333",
        fontWeight: "600",
        textAlign: "center",
    },
    listWrapper: {
        marginTop: hp("2%"),
        height: hp("15%"), // Adjust height as needed
    },
    cardContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: hp("1%"),
        backgroundColor: "#fff",
        position: "relative",
        paddingHorizontal: 10,
        width: wp("25%"),
        marginRight: wp("2%"),
    },
    activeCardContainer: {
        backgroundColor: "#fff",
        elevation: 2,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 2,
        borderColor: "#eee",
    },
    imageWrapper: {
        width: wp("17%"),
        height: wp("17%"),
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    image: {
        width: "85%",
        height: "85%",
        borderRadius: wp("8.5%"),
    },
    cardText: {
        marginTop: hp("0.8%"),
        fontSize: hp("1.4%"),
        color: "#555",
        fontFamily: "Poppins-Medium",
        textAlign: "center",
    },
    activeCardText: {
        color: "#000",
        fontWeight: "600",
    },
    activeBottomLine: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: hp("0.5%"),
        backgroundColor: "#6C63FF",
        borderTopLeftRadius: hp("2%"),
        borderTopRightRadius: hp("2%"),
    },
});
