import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    StatusBar,
    TextInput,
    ScrollView,
    Modal,
    Linking,
    Platform,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import FloatingSelectInput from "../Components/Category/FloatingSelectInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DetailScreen from "../Components/Category/DetailScreen";
import { useNavigation } from "@react-navigation/native";
import PGHostelScreen from "../Components/Category/PGHostel";
import ExampleModal from "../Components/Category/ExampleModal";

const listTypes = ["Sell", "Rent", "Lease", "Wanted"];

const AddDetailFirstScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [variant, setVariant] = useState("");
    const [year, setYear] = useState("");
    const [price, setPrice] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedListType, setSelectedListType] = useState<string>("Sell");
    const [showPickerModal, setShowPickerModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    // Handle location check and open picker
    const handleImageUpload = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setShowLocationModal(true);
            return;
        }

        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            setShowLocationModal(true);
            return;
        }

        setShowPickerModal(true);
    };

    // Automatically enable location when Allow clicked
    const enableLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === "granted") {
                let locationEnabled = await Location.hasServicesEnabledAsync();

                if (!locationEnabled) {
                    try {
                        await Location.enableNetworkProviderAsync();
                    } catch (e) {
                        console.log("Auto-enable not supported:", e);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    locationEnabled = await Location.hasServicesEnabledAsync();
                }

                // Close location modal if location is enabled
                if (locationEnabled) {
                    setShowLocationModal(false);
                    // Open image picker modal after location is enabled
                    setShowPickerModal(true);
                }
            } else {
                alert("Location permission is required to use camera features.");
                setShowLocationModal(false);
            }
        } catch (error) {
            console.error("Error enabling location:", error);
            setShowLocationModal(false);
        }
    };

    // Remove image from selected images
    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    // Pick image from gallery
    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
        setShowPickerModal(false);
    };

    // Capture image from camera
    const pickFromCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
        setShowPickerModal(false);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Topbar */}
            <View style={styles.topBar}>
                <View style={styles.leftSection}>
                    <Ionicons name="arrow-back" size={wp("4.5%")} color="#000" />
                    <Text style={styles.topTitle}>Ad Details</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={styles.exampleText}>Example Listing</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal Component */}
                <ExampleModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />

                {/* Step progress */}
                <View style={styles.stepWrapper}>
                    <LinearGradient
                        colors={["#6C63FF", "#6C63FF", "#D9D9D9DE", "#D9D9D9DE"]}
                        locations={[0, 0.3, 0.3, 1]}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.stepGradientBorder}
                    >
                        <View style={styles.stepInner}>
                            <Text style={styles.stepText}>1 of 3</Text>
                        </View>
                    </LinearGradient>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Car Card */}
                <TouchableOpacity style={styles.card}>
                    <View style={styles.cardLeft}>
                        <Image
                            source={require("../../assets/images/cars.png")}
                            style={styles.cardIcon}
                        />
                        <Text style={styles.cardText}>Car</Text>
                    </View>
                    <MaterialIcons name="arrow-right" size={26} color="#6C63FF" />
                </TouchableOpacity>

                {/* List Type */}
                <Text style={styles.sectionTitle}>List Type</Text>
                <View style={styles.listTypeWrapper}>
                    {listTypes.map((type) => {
                        const isSelected = selectedListType === type;
                        return (
                            <TouchableOpacity
                                key={type}
                                style={[styles.listTypeButton, isSelected && styles.activeButton]}
                                onPress={() => setSelectedListType(type)}
                            >
                                {isSelected ? (
                                    <>
                                        <Text style={[styles.listTypeText, styles.activeButtonText]}>
                                            {type}
                                        </Text>
                                        <View style={styles.circleWrapper}>
                                            <View style={styles.circleDot} />
                                        </View>
                                    </>
                                ) : (
                                    <Text style={styles.listTypeText}>{type}</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Media Section */}
                <View style={styles.mediaSection}>
                    <View style={styles.uploadBox}>
                        <TouchableOpacity style={styles.uploadContent} onPress={handleImageUpload}>
                            <FontAwesome6 name="camera" size={50} color="#6C63FF" />
                            <Text style={styles.uploadText}>Add images</Text>
                            <Text style={styles.uploadSubText}>jpeg, png or jpg formats up-to 5MB</Text>
                        </TouchableOpacity>

                        {/* Selected Images - Now appears INSIDE the uploadBox below the text */}
                        {images.length > 0 && (
                            <View style={styles.selectedImagesContainer}>
                                <Text style={styles.imageSectionTitle}>Car <Text style={{ color: '#6C63FF' }}> ({images.length}) </Text></Text>
                                <View style={styles.imageGrid}>
                                    {images.map((uri, index) => (
                                        <View key={index} style={styles.imageContainer}>
                                            <Image source={{ uri }} style={styles.selectedImage} />
                                            <TouchableOpacity
                                                style={styles.removeIcon}
                                                onPress={() => removeImage(index)}
                                            >
                                                <Ionicons name="close-circle" size={wp("4%")} color="#ff4444" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    <TouchableOpacity style={styles.plusBox} onPress={handleImageUpload}>
                                        <Text style={styles.plusText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Video Link */}
                    <View style={styles.videoBox}>
                        <TextInput
                            placeholder="Add Video Link (Optional)"
                            placeholderTextColor="#999"
                            style={styles.videoInput}
                        />
                        <FontAwesome5 name="video" size={14} color="#6C63FF" />
                    </View>

                    {/* Info Text */}
                    <Text style={styles.infoText}>
                        Share a link to a video showcasing your product {"\n"}
                        <Text style={{ fontWeight: "600", color: "#000" }}>
                            (e.g., via YouTube, Instagram)
                        </Text>{" "}
                        to help buyers clearly see the item's details and condition
                    </Text>
                </View>

                <FloatingSelectInput
                    label="Brand"
                    options={[
                        "Maruthi Suzuki / Alpha 1.0L Turbo 6 AT hdyd dy dheydbdydye",
                        "Honda City",
                        "Toyota Corolla",
                    ]}
                    value={brand}
                    onSelect={setBrand}
                />

                <FloatingSelectInput
                    label="Model"
                    options={[
                        "Maruthi Suzuki / Alpha 1.0L Turbo 6 AT",
                        "Honda City 2022",
                        "Toyota Corolla GLi",
                    ]}
                    value={model}
                    onSelect={setModel}
                />

                <FloatingSelectInput
                    label="Variant"
                    options={[
                        "Alpha 1.0L Turbo",
                        "ZX CVT Petrol",
                        "Altis Grande",
                    ]}
                    value={variant}
                    onSelect={setVariant}
                />

                {/* Year input (manual text entry example) */}
                <FloatingSelectInput
                    label="Registered Year"
                    value={year}
                    onSelect={setYear}
                    isSelect={false}
                    keyboardType="numeric"
                    rightIcon="calendar-clear-outline"
                />

                {/* Price input with cash icon */}
                <FloatingSelectInput
                    label="Price"
                    value={price}
                    onSelect={setPrice}
                    isSelect={false}
                    keyboardType="numeric"
                    rightIcon="cash-outline"
                />

                {/* Detail Section */}
                <PGHostelScreen />

                <View style={styles.bottomSection}>
                    <View style={styles.bottomLeft}>
                        <Image
                            source={require("../../assets/images/bottombutton.png")}
                            style={styles.bottomImage}
                        />
                        <Text style={styles.bottomText}>
                            I am authorised to make ad edits & responsible for the information shared including ad details & prices
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("AddDetailSecond")}>
                        <Text style={styles.bottomButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>


            {/* Location Modal */}
            <Modal visible={showLocationModal} transparent animationType="fade">
                <View style={styles.modalOverlayCenter}>
                    <View style={styles.locationModal}>
                        <Image
                            source={require("../../assets/images/locationaon.png")}
                            style={{ width: wp("20%"), height: wp("12%"), resizeMode: "contain", marginBottom: hp(0.5) }}
                        />
                        <Text style={styles.modalMessage}>
                            Allow <Text style={styles.modalMessageText}> Addvey </Text> to access your
                            Storage?
                        </Text>

                        <TouchableOpacity style={[styles.modalBtn, { marginBottom: hp(0.8) }]} onPress={enableLocation}>
                            <Text style={styles.modalBtnText}>Allow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#6C63FF" }]} onPress={() => setShowLocationModal(false)}>
                            <Text style={styles.modalBtnText}>Don't Allow</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Picker Modal */}
            <Modal visible={showPickerModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.closeIconTopRight}
                        onPress={() => setShowPickerModal(false)}
                    >
                        <Ionicons name="close" size={20} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.modalContent}>
                        <View style={styles.rowOptions}>
                            <TouchableOpacity style={styles.optionBox} onPress={pickFromCamera}>
                                <FontAwesome6 name="camera" size={38} color="#6C63FF" />
                                <Text style={styles.optionText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionBox} onPress={pickFromGallery}>
                                <Image
                                    source={require("../../assets/images/images.png")}
                                    style={{ width: wp("10%"), height: wp("10%"), resizeMode: "contain", marginBottom: hp(0.5) }}
                                />
                                <Text style={styles.optionText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AddDetailFirstScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: wp(4), paddingVertical: hp(1.5), borderBottomWidth: 1, borderBottomColor: "#eee", marginTop: hp(4) },
    leftSection: { flexDirection: "row", alignItems: "center", gap: wp(2) },
    topTitle: { fontSize: wp("4%"), fontFamily: "Poppins-Medium", color: "#000", marginTop: hp(0.4) },
    exampleText: { fontSize: wp("2.5%"), fontFamily: "Boogaloo-Regular", color: "#6C63FF", marginTop: hp(0.4), marginLeft: wp(0.5) },
    stepWrapper: { alignItems: "flex-end" },
    stepGradientBorder: { borderRadius: 16, padding: 2 },
    stepInner: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: wp(4), alignItems: "center", justifyContent: "center", minHeight: hp(3), paddingTop: hp(0.3) },
    stepText: { fontSize: wp("2.8%"), fontFamily: "Poppins-Medium", color: "#6C63FF", textAlign: "center" },
    scrollContent: { padding: wp(5), paddingBottom: hp(15) },

    card: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#eee", borderRadius: 10, marginBottom: hp(3), backgroundColor: "#fff", paddingVertical: hp(0.7), paddingHorizontal: wp(2) },
    cardLeft: { flexDirection: "row", alignItems: "center", gap: wp(2) },
    cardIcon: { width: wp("9%"), height: wp("9%"), resizeMode: "contain" },
    cardText: { fontSize: wp("4%"), fontFamily: "Poppins-Medium", color: "#000", marginTop: hp(0.5) },

    sectionTitle: { fontSize: wp("4.5%"), fontFamily: "Poppins-Medium", color: "#555555", marginBottom: hp(1) },

    listTypeWrapper: { flexDirection: "row", marginBottom: hp(3) },
    listTypeButton: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, paddingVertical: hp(1.2), paddingHorizontal: wp(3.5), marginRight: wp(2), backgroundColor: "#fff", alignItems: "center", justifyContent: "center", flexDirection: "row" },
    listTypeText: { fontSize: wp("3%"), fontFamily: "Poppins-Medium", color: "#00000099" },
    activeButton: { borderColor: "#6C63FF", backgroundColor: "#fff", flexDirection: "row", paddingHorizontal: wp(4) },
    activeButtonText: { color: "black", fontFamily: "Poppins-Bold", marginTop: hp(0.2) },
    circleWrapper: { width: wp("3%"), height: wp("3%"), borderRadius: wp("2.25%"), borderWidth: 2, borderColor: "#6C63FF", marginLeft: wp(2), alignItems: "center", justifyContent: "center" },
    circleDot: { borderRadius: wp("1%"), backgroundColor: "#6C63FF" },

    mediaSection: { backgroundColor: "#FAFAFA", borderRadius: 12, padding: wp(4), marginBottom: hp(3) },
    uploadBox: { borderWidth: 1.5, borderColor: "#7f79feff", borderStyle: "dashed", borderRadius: 12, backgroundColor: "#F7F7F7" },
    uploadContent: { alignItems: "center", justifyContent: "center", paddingVertical: hp(2) },
    uploadText: { fontSize: wp("3.9%"), fontFamily: "Poppins-Medium", color: "#6C63FF", marginTop: hp(0.5) },
    uploadSubText: { fontSize: wp("2.8%"), fontFamily: "Poppins-Regular", color: "#0000007D", marginTop: hp(0.8) },

    selectedImagesContainer: { paddingHorizontal: wp(3), paddingBottom: hp(2) },
    imageSectionTitle: { fontSize: wp("4%"), fontFamily: "Poppins-Medium", marginBottom: hp(1), color: "#000" },
    imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: wp(2) },
    imageContainer: { position: 'relative' },
    selectedImage: { width: wp("16%"), height: wp("16%"), borderRadius: 10 },
    removeIcon: {
        position: 'absolute',
        top: -wp("1%"),
        right: -wp("1%"),
        backgroundColor: 'white',
        borderRadius: wp("2.5%")
    },
    plusBox: { width: wp("16%"), height: wp("16%"), borderRadius: 10, backgroundColor: "#eee", alignItems: "center", justifyContent: "center" },
    plusText: { fontSize: wp("8%"), color: "#6C63FF" },
    modalMessageText: {
        fontSize: wp(4),
        fontFamily: 'Poppins-Medium'
    },

    videoBox: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#6C63FF", borderStyle: "dashed", borderRadius: 12, paddingHorizontal: wp(3), marginBottom: hp(2), backgroundColor: "#F7F7F7", marginTop: hp(2.5) },
    videoInput: { flex: 1, fontSize: wp("3%"), fontFamily: "Poppins-Regular", color: "#000", paddingVertical: hp(1.2), marginTop: hp(0.2) },
    infoText: { fontSize: wp("3%"), fontFamily: "Poppins-Regular", color: "#00000080", lineHeight: hp(2.2) },

    bottomSection: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#D9D9D959", borderTopWidth: 1, borderTopColor: "#eee", padding: wp(4), borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    bottomLeft: { flexDirection: "row", alignItems: "center", marginBottom: hp(1.5) },
    bottomImage: { width: wp("8%"), height: wp("8%"), resizeMode: "contain", marginRight: wp(2) },
    bottomText: { fontSize: wp("2.8%"), fontFamily: "Poppins-Medium", color: "#6E533F", lineHeight: hp(1.9) },
    bottomButton: { backgroundColor: "#6C63FF", paddingVertical: hp(1.2), borderRadius: 12, alignItems: "center", justifyContent: "center", marginVertical: hp(1.4) },
    bottomButtonText: { color: "#fff", fontSize: wp("3.8%"), fontFamily: "Poppins-Medium" },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modalContent: { backgroundColor: "#fff", padding: wp(0), borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    closeIconTopRight: {
        position: "absolute",
        top: hp(73),
        right: wp(2),
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    rowOptions: { flexDirection: "row", marginTop: hp(5), marginBottom: hp(2), paddingHorizontal: wp(5) },
    optionBox: { paddingVertical: hp(0), paddingHorizontal: wp(5), alignItems: "center", marginBottom: hp(3) },
    optionText: { color: "black", fontSize: wp("3.5%"), marginTop: hp(0.5) },

    modalOverlayCenter: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    locationModal: { backgroundColor: "#fff", paddingHorizontal: wp(6), paddingVertical: hp(3), borderRadius: 15, alignItems: "center", width: "90%" },
    modalMessage: { fontSize: wp("4%"), fontFamily: "Poppins-Regular", color: "#555", textAlign: "center", marginBottom: hp(3) },
    modalBtn: { backgroundColor: "#6C63FF", padding: hp(1), borderRadius: 10, width: "100%", alignItems: "center" },
    modalBtnText: { color: "#fff", fontSize: wp("3.5%"), fontFamily: "Poppins-Bold" },


});