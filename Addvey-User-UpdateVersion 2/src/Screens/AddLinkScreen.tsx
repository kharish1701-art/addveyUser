// AddLinkScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Modal,
    TextInput,
    ScrollView,
    TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { EndPoints } from "../services/EndPoints";
import { mutationHandler } from "../services/mutations/mutationHandler";
import { PostAPi } from "../api/getApi/getApi";
import LoadingModal from "../Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LinkItem {
    platform: string;
    url: string;
}

const AddLinkScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [platform, setPlatform] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const route = useRoute()
    const data = route?.params?.data
    const [links, setLinks] = useState<LinkItem[]>(route?.params?.data ?? []);

    const handleAddLink = () => {
        if (platform.trim() && url.trim()) {
            setLinks([...links, { platform, url }]);
            setPlatform("");
            setUrl("");
            setModalVisible(false);
        }
    };

    // 📤 Submit
    const handleSubmit = async () => {
        setLoading(true);
        const userToken = await AsyncStorage.getItem("authToken");

        const param = {
            url: EndPoints.createProfile,
            body: {
                "socialLinks": links
            },
            token: userToken || ""
        }

        const dd = await PostAPi(param, setLoading)
        if (dd?.success) {
            console.log("<><><><><><", param.body);
            navigation.goBack()
        }

    };

    return (
        <View style={styles.container}>
            {loading && <LoadingModal />}
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.topLeft} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp(5)} color="#000" />
                    <Text style={styles.topTitle}>Links</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            {/* ScrollView for saved links */}
            <ScrollView
                style={styles.linksContainer}
                contentContainerStyle={{
                    paddingBottom: hp(12),
                    flexGrow: 1,
                    justifyContent: links?.length === 0 ? "center" : "flex-start",
                }}
                showsVerticalScrollIndicator={false}
            >
                {links?.length === 0 ? (
                    <View style={styles.centerContent}>
                        <Text style={styles.centerText}>Create links</Text>
                    </View>
                ) : (
                    links?.map((item, index) => (
                        <View key={index} style={styles.linkBox}>
                            {/* Title */}
                            <Text style={styles.linkTitle}>{item.platform}</Text>
                            <View style={styles.linkDivider} />

                            {/* URL Label */}
                            <Text style={styles.urlLabel}>URL</Text>

                            {/* URL Row */}
                            <View style={styles.linkRow}>
                                <Text style={styles.linkUrl}>{item.url}</Text>
                                <FontAwesome name="pencil-square-o" size={16} color="#6E533F" />
                            </View>

                            {/* Divider below URL */}
                            <View style={styles.linkDivider} />
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>

                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Add Link</Text>

                            {/* Title Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={platform}
                                    onChangeText={(text: string) => setPlatform(text)}
                                    placeholder="Enter title"
                                    style={styles.input}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* URL Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={url}
                                    onChangeText={(text: string) => setUrl(text)}
                                    placeholder="Enter URL"
                                    style={styles.input}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Done Button */}
                            <TouchableOpacity
                                style={styles.doneButton}
                                onPress={handleAddLink}
                            >
                                <Text style={styles.doneButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default AddLinkScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    // Top Bar
    topBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: hp(8),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp(4),
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        zIndex: 10,
        marginTop: hp(4),
    },
    topLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    topTitle: {
        fontSize: wp(4),
        fontFamily: "Poppins-Medium",
        marginLeft: wp(2),
        color: "#000",
        marginTop: hp(0.3),
    },
    saveButton: {
        backgroundColor: "#6C63FFB8",
        paddingHorizontal: wp(6),
        paddingVertical: hp(0.4),
        borderRadius: 20,
        paddingTop: hp(0.7),
    },
    saveButtonText: {
        fontSize: wp(3.5),
        color: "#fff",
        fontFamily: "Poppins-Medium",
    },

    // ScrollView Links
    linksContainer: {
        flex: 1,
        marginTop: hp(12),
        paddingHorizontal: wp(4),
    },
    linkBox: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginBottom: hp(2),
        elevation: 2,
        marginTop: hp(5),
        paddingVertical: hp(2),
        paddingHorizontal: wp(5)
    },
    linkTitle: {
        fontSize: wp(4),
        fontFamily: "Poppins-Medium",
        color: "#000",
        marginBottom: hp(0.5),
    },
    linkDivider: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginVertical: hp(0.5),
    },
    urlLabel: {
        fontSize: wp(3.2),
        fontFamily: "Poppins-Regular",
        color: "#666",
        marginBottom: hp(0.3),
    },
    linkRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    linkUrl: {
        fontSize: wp(3.5),
        color: "#333",
        flex: 1,
        marginRight: wp(2),
    },

    // Center Content
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    centerText: {
        fontSize: wp(4.5),
        fontFamily: "Poppins-Regular",
        color: "#000",
    },

    // Bottom Button
    bottomContainer: {
        position: "absolute",
        bottom: hp(3.5),
        left: wp(2.5),
        right: wp(2.5),
    },
    addButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp(1.4),
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    addButtonText: {
        color: "#fff",
        fontSize: wp(4),
        fontFamily: "Poppins-Medium",
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: wp(85),
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: wp(5),
        elevation: 5,
    },
    modalTitle: {
        fontSize: wp(4.5),
        fontFamily: "Poppins-Medium",
        color: "#000",
        marginBottom: hp(2),
        paddingHorizontal: wp(0.8),
    },
    inputContainer: {
        marginBottom: hp(1.5),
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.6),
        fontSize: wp(3.5),
        color: "#000",
    },
    doneButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp(0.8),
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp(0.2),
    },
    doneButtonText: {
        color: "#fff",
        fontSize: wp(4),
        fontFamily: "Poppins-Medium",
    },
});
