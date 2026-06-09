import React, { memo, useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Linking,
    Alert,
    ScrollView,
} from "react-native";
import {
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
    Octicons,
    AntDesign,
    Feather,
} from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { shareProduct, SocialIcon } from "./CommonFunction";
import { EndPoints } from "../services/EndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoReportScreen from "../Screens/Chat/infoReportScreen";
import ReportDetailModal from "./Profile/ReportDetailModal";
import { handleFavorite, handleUnFavorite, PostAPi } from "../api/getApi/getApi";
import { useFavorites } from "../context/FavoritesContext";

const { width } = Dimensions.get("window");

export interface Product {
    id: string;
    productId?: string;
    name: string;
    price: number;
    type: string;
    views: number;
    isFavorite: boolean;
    createdAt: string;
    likes?: number;
    shares?: number;
    images: string[];
    creator: {
        id: string;
        phone?: string;
        profile: {
            name: string;
            image: string;
            socialLinks?: Array<{
                platform: string;
                url: string;
            }>;
        };
    };
    location: {
        city: string;
    };
    supersubcategory: {
        name: string;
        image: string;
    };
}

interface SimilarProductCardProps {
    item: Product;
    onPress: (item: Product) => void;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({ item, onPress }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const navigation = useNavigation<any>();
    const [reportModat, setReportModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleReportSubmit = async (text: string) => {
        console.log("User submitted:", text);
        setLoading(true);
        const userToken = await AsyncStorage.getItem("authToken");
        // \"abuse\"|\"spam\"|\"other\"

        const param = {
            url: EndPoints.addReport,
            body: {
                productId: item?.id,
                reason: 'other',
                // selectedReport == "Fraud"
                //   ? "spam"
                //   : selectedReport == "Duplicate ad"
                //   ? "spam"
                //   : selectedReport == "Inaccurate photos or details"
                //   ? "abuse"
                //   : selectedReport == "Offensive content"
                //   ? "abuse"
                //   : "other",

                type: "report",
                description: text,
            },
            token: userToken || "",
            requireAuth:true
        };

        const dd = await PostAPi(param, setLoading);
        if (dd?.success) {
            console.log("<><><><><><", param.body);
            // navigation.goBack()
            setReportModal(false);
            Alert.alert("Success", "Report submitted successfully");
        }

        setReportModal(false);
        // 👉 Send to API OR show toast OR store in context
    };

    // ... report logic ...
    const [modalVisible, setModalVisible] = useState(false);

    const handleReport = () => {
        setModalVisible(true);
        // Alert.alert("Report", "Report this user or conversation?");
    };
    const reportPress = () => {
        setModalVisible(false)
        setReportModal(true)
    }

    const openMaps = useCallback(() => {
        const city = item?.location?.city;
        console.log(item)
        if (city) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                city
            )}`;
            Linking.openURL(url).catch((err) =>
                console.error("An error occurred", err)
            );
        } else {
            Alert.alert("Error", "Location not available");
        }
    }, [item]);

    const openDialPad = (phoneNumber: string) => {
        if (!phoneNumber) {
            Alert.alert("Error", "Phone number not provided");
            return;
        }
        const url = `tel:${phoneNumber}`;
        Linking.openURL(url).catch(() => {
            Alert.alert("Error", "Could not open the dial pad");
        });
    };

    const handleSocialLinkPress = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Error", `Cannot open URL: ${url}`);
            }
        } catch (error) {
            console.error("Error opening URL:", error);
            Alert.alert("Error", "Failed to open link");
        }
    };

    // Refactored to use Context - no local API calls
    const handleFavoritePress = () => {
        toggleFavorite(item.id || item.productId);
    };

    // Handle share
    const handleShare = () => {
        shareProduct(item.id);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress(item)}
            style={styles.cardContainer}
        >
            {/* Header: User Info */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                        {item?.creator?.profile?.name || "User"}
                    </Text>
                    <Text style={styles.ownerBadge}>Owner</Text>
                    <Image
                        source={require("../../assets/images/save.png")}
                        style={styles.verifyIcon}
                    />
                </View>

                {/* Distance / Location */}
                <View style={styles.locationContainer}>
                    <Ionicons name="location-sharp" size={14} color="red" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {item?.location?.city || "Location"}
                    </Text>
                </View>

                {/* Direction Button (using a placeholder icon as in screenshot) */}
                <TouchableOpacity style={styles.directionBtn} onPress={() => openMaps()}>
                    <Ionicons name="navigate" size={18} color="#6C63FF" />
                </TouchableOpacity>
            </View>

            {/* Main Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.images?.length > 0 ? IMAGE_BASE_URL + item.images[0] : "https://via.placeholder.com/300" }}
                    style={styles.productImage}
                    resizeMode="cover"
                />

                {/* Overlay Actions */}
                <View style={styles.overlayActions}>
                    <TouchableOpacity style={styles.overlayBtn} onPress={handleFavoritePress}>
                        <MaterialCommunityIcons
                            name={isFavorite(item.id || item.productId) ? "cards-heart" : "cards-heart-outline"}
                            size={18}
                            color={isFavorite(item.id || item.productId) ? "red" : "#000"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.overlayBtn} onPress={handleShare}>
                        <Feather name="share-2" size={18} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Categories/Tags (Optional, based on 'Similar Nursery lands' text in screenshot header, keeping it minimal for now) */}
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
                {/* Social Links Row */}
                <View style={styles.socialRow}>
                    {/* Call Button */}
                    <TouchableOpacity
                        style={styles.circularBtn}
                        onPress={() => openDialPad(item?.creator?.phone || "")}
                    >
                        <Ionicons name="call" size={20} color="#6C63FF" />
                    </TouchableOpacity>

                    {/* Dynamic Social Links */}
                    {item?.creator?.profile?.socialLinks?.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.circularBtn} // Using same style for consistency
                            onPress={() => handleSocialLinkPress(link.url)}
                        >
                            <SocialIcon platform={link.platform} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Chat Button */}
                <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => navigation.navigate("ChatMessaging", {
                        receiverId: item?.creator?.id,
                        receiverName: item?.creator?.profile?.name,
                        productId: item?.id,
                        productName: item?.name,
                        productLocation: item?.location?.city ?? "",
                        price: item?.price,
                    })}
                >
                    <Ionicons name="chatbubble-ellipses" size={20} color="#6C63FF" style={{ marginRight: 6 }} />
                    <Text style={styles.chatBtnText}>Chat</Text>
                </TouchableOpacity>

                {/* Info Button */}
                <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisible(true)}>
                    <AntDesign name="info-circle" size={22} color="#888" />
                </TouchableOpacity>
            </View>
            <ReportDetailModal
                visible={reportModat}
                onClose={() => setReportModal(false)}
                onSubmit={handleReportSubmit}
            />
            <InfoReportScreen
                onClose={() => setModalVisible(false)}
                visible={modalVisible}
                reportPress={reportPress}
                from={'product'}
            />

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#f0f0f0"
    },
    header: {
        marginBottom: 10,
        position: 'relative'
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginRight: 6,
    },
    ownerBadge: {
        fontSize: 12,
        color: "#666",
        marginRight: 4,
    },
    verifyIcon: {
        width: 14,
        height: 14,
        resizeMode: 'contain'
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    directionBtn: {
        position: 'absolute',
        right: 0,
        top: 5,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: '#eee'
    },
    imageContainer: {
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
        height: hp(20), // Adjust as needed
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    overlayActions: {
        position: "absolute",
        bottom: 10,
        right: 10,
        flexDirection: "row",
        gap: 8,
    },
    overlayBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    socialRow: {
        flexDirection: "row",
        gap: 10,
    },
    circularBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1
    },
    chatBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#6C63FF",
        backgroundColor: "#fff",
    },
    chatBtnText: {
        color: "#6C63FF",
        fontWeight: "600",
        fontSize: 14,
    },
    infoBtn: {
        padding: 4
    }
});

export default memo(SimilarProductCard);
