import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getApi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import CustomLoader from "../Components/Loader";


const SocialLinkListScreen = () => {
    const navigation = useNavigation<any>();
    const [links, setLinks] = useState({
        facebook: "https://www.addvey facebook.com",
        instagram: "https://www.addvey instagram.com",
        linkedin: "https://www.addvey Linkedin.com",
        youtube: "https://www.addvey youtube.com",
        twitter: "https://www.addvey twitter.com",
        whatsapp: "https://www.addvey Website.com",
    });

      const [loading, setLoading] = useState(false);
      const [data, setData] = useState(null);
      useEffect(() => {
        getDevice();
      }, []);
      const getDevice = async () => {
        const token = await AsyncStorage.getItem("authToken");
    
        // const param = {
        //   url: EndPoints.getLinkedDevices,
        //   token: token,
        // };
        const dd = await getApi(EndPoints.getSSLink, setLoading, token, true);
        console.log(dd?.data?.data);
        setData(dd?.data?.data);
      };

    const handleCopy = (text: string) => {
        console.log("Copied:", text);
    };

    const socialData = [
        {
            id: 1,
            label: "Facebook",
            key: "facebook",
            icon: (
                <Ionicons name="logo-facebook" size={hp("2.5%")} color="#3b5998" />
            ),
        },
        {
            id: 2,
            label: "Instagram",
            key: "instagram",
            icon: (
                <View style={styles.iconBox}>
                    <Ionicons name="logo-instagram" size={hp("2.3%")} color="#E1306C" />
                </View>
            ),
        },
        {
            id: 3,
            label: "LinkedIn",
            key: "linkedin",
            icon: (
                <View style={styles.iconBox}>
                    <Ionicons name="logo-linkedin" size={hp("2.3%")} color="#0077B5" />
                </View>
            ),
        },
        {
            id: 4,
            label: "Youtube",
            key: "youtube",
            icon: (
                <View style={styles.iconBox}>
                    <Ionicons name="logo-youtube" size={hp("2.3%")} color="#FF0000" />
                </View>
            ),
        },
        {
            id: 5,
            label: "X ( formally Twitter )",
            key: "twitter",
            icon: (
                <View style={styles.iconBox}>
                    <Ionicons name="logo-twitter" size={hp("2.3%")} color="#1DA1F2" />
                </View>
            ),
        },
        {
            id: 6,
            label: "WhatsApp",
            key: "whatsapp",
            icon: (
                <View style={styles.iconBox}>
                    <Ionicons name="logo-whatsapp" size={hp("2.3%")} color="#25D366" />
                </View>
            ),
        },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            {loading && <CustomLoader/>}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={hp("2%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Social Links</Text>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: hp("10%") }}
                showsVerticalScrollIndicator={false}
            >
                {data?.map((item) => (
                    <View key={item.id} style={styles.section}>
                        <View style={styles.labelRow}>
                            {/* {item.icon && <View style={styles.icon}>{item.icon}</View>} */}
                            <Image source={{uri:IMAGE_BASE_URL + item?.icon}} style={styles.icon}/>
                            <Text style={styles.label}>{item.name}</Text>
                        </View>

                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder={item?.link}
                                placeholderTextColor="#B0B0B0"
                                editable={false}
                            />
                            <TouchableOpacity
                                style={styles.copyButton}
                                onPress={() =>
                                    handleCopy(item?.link)
                                }
                            >
                                <MaterialCommunityIcons name="checkbox-multiple-blank-outline" size={16} color="#000000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Share All Button */}
                <TouchableOpacity style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={hp("2.2%")} color="#6E44FF" />
                    <Text style={styles.shareText}>Share All</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default SocialLinkListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("5%"),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("3%"),
        marginTop: hp(4)
    },
    headerText: {
        fontSize: hp("2%"),
        marginLeft: wp("2%"),
        color: "#000",
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.6)
    },
    section: {
        marginBottom: hp("2.5%"),
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1%"),
    },
    icon: {
        marginRight: wp("2%"),
        height:25,
        width:25
    },
    iconBox: {
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: hp("1.9%"),
        color: "#000",
        fontWeight: "500",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: wp("4%"),
        paddingHorizontal: wp("3%"),
        height: hp("5.8%"),
        justifyContent: "space-between",
    },
    input: {
        flex: 1,
        fontSize: hp("1.5%"),
        color: "#000",
    },
    copyButton: {
        marginLeft: wp("2%"),
    },
    shareBtn: {
        borderWidth: 1,
        borderColor: "#6C63FF3B",
        borderRadius: wp("5%"),
        height: hp("6%"),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp("1%"),
    },
    shareText: {
        color: "#6C63FF",
        fontSize: hp("1.9%"),
        fontWeight: "500",
        marginLeft: wp("1%"),
    },
});