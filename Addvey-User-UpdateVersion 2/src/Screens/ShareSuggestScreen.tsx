import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OlaMapsService } from "../services/OlaMapsService";

const MicImage = require("../../assets/images/mic.png");
const UploadImage = require("../../assets/images/camera.png");

const ShareSuggestScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [images, setImages] = useState<string[]>([]);
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [location, setLocation] = useState("Hyderabad");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleLocationChange = async (text: string) => {
        setLocation(text);
        if (text.length > 2) {
            try {
                const results = await OlaMapsService.autocomplete(text);
                setSuggestions(results);
            } catch (error) {
                console.log("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectLocation = (item: any) => {
        setLocation(item.description);
        setSuggestions([]);
    };

    // Upload images to server and get URLs
    const uploadImagesToServer = async (imageUris: string[]) => {
        const token = await AsyncStorage.getItem("authToken");
        const uploadedImageUrls = [];

        for (const uri of imageUris) {
            try {
                const formData = new FormData();

                // Create file object
                const file: any = {
                    uri: uri,
                    type: 'image/jpeg',
                    name: `feedback_${Date.now()}.jpg`,
                };

                formData.append('files', file);

                const response = await fetch('https://api.addvey.com/api/upload/file', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });

                const result = await response.json();

                if (result.success && result.data?.files?.[0]?.path) {
                    const imageUrl = `https://api.addvey.com${result.data.files[0].path}`;
                    uploadedImageUrls.push(imageUrl);
                } else {
                    console.log('Image upload failed:', result.message);
                }
            } catch (error) {
                console.log('Error uploading image:', error);
            }
        }

        return uploadedImageUrls;
    };

    // Submit feedback to API
    const submitFeedback = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert("Error", "Please enter your name");
            return;
        }

        if (!mobileNumber.trim()) {
            Alert.alert("Error", "Please enter your mobile number");
            return;
        }

        if (!comment.trim()) {
            Alert.alert("Error", "Please enter your comments/suggestions");
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("authToken");

            // Upload images if any
            let uploadedImageUrls: string[] = [];
            if (images.length > 0) {
                uploadedImageUrls = await uploadImagesToServer(images);
            }

            // Get coordinates for the location
            let latitude = null;
            let longitude = null;
            if (location) {
                const geoResult = await OlaMapsService.geocode(location);
                if (geoResult) {
                    latitude = geoResult.lat;
                    longitude = geoResult.lng;
                }
            }

            // Prepare the payload
            const payload = {
                messages: comment,
                rating: 5, // You can add a rating system if needed
                name: name.trim(),
                mobileNumber: mobileNumber.trim(),
                comment: comment.trim(),
                images: uploadedImageUrls,
                location: location,
                latitude: latitude,
                longitude: longitude,
                suggestion: comment.trim()
            };

            console.log("Submitting feedback:", payload);

            const response = await fetch("https://api.addvey.com/api/feedback/give-feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert(
                    "Success",
                    "Thank you for your feedback!",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.goBack()
                        }
                    ]
                );

                // Reset form
                setName("");
                setMobileNumber("");
                setComment("");
                setImages([]);
                setLocation("Hyderabad");
            } else {
                Alert.alert("Error", result.message || "Failed to submit feedback");
            }
        } catch (error) {
            console.log("Error submitting feedback:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to your photo library to upload images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            allowsEditing: false,
        });

        if (!result.canceled) {
            const selected = result.assets.map((a) => a.uri);
            setImages((prev) => [...prev, ...selected]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp("5%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Share your suggestions</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Name */}
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                />

                {/* Mobile */}
                <TextInput
                    style={styles.input}
                    placeholder="Mobile number"
                    keyboardType="phone-pad"
                    placeholderTextColor="#999"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    editable={!loading}
                    maxLength={10}
                />

                {/* Location Box */}
                <View style={styles.locationBox}>
                    <Text style={styles.locationLabel}>Your location</Text>
                    <View style={styles.locationRow}>
                        <Entypo name="location-pin" size={wp("4.5%")} style={{ marginTop: hp(2) }} color="red" />
                        <TextInput
                            style={styles.locationText}
                            value={location}
                            onChangeText={handleLocationChange}
                            placeholder="Enter your location"
                            placeholderTextColor="#999"
                            editable={!loading}
                        />
                        <TouchableOpacity
                            style={{ marginLeft: "auto" }}
                            disabled={loading}
                            onPress={() => {
                                setLocation("");
                                setSuggestions([]);
                            }}
                        >
                            <Text style={styles.changeText}>CHANGE</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Suggestions List */}
                    {suggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            {suggestions.map((item) => (
                                <TouchableOpacity
                                    key={item.place_id}
                                    style={styles.suggestionItem}
                                    onPress={() => handleSelectLocation(item)}
                                >
                                    <View style={styles.suggestionRow}>
                                        <Ionicons name="location-outline" size={wp("4%")} color="#666" style={{ marginRight: wp("2%") }} />
                                        <Text style={styles.suggestionText} numberOfLines={1}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Upload Section */}
                <Text style={styles.uploadLabel}>
                    If applicable, please upload related images
                </Text>

                <View style={styles.imageMainContainer}>
                    <View style={styles.imageUploadBox}>
                        <TouchableOpacity
                            style={styles.addImageContainer}
                            onPress={pickImage}
                            disabled={loading}
                        >
                            <Image
                                source={UploadImage}
                                style={styles.uploadIconImage}
                            />
                            <Text style={styles.addImageText}>Add images</Text>
                            <Text style={styles.imageNote}>
                                jpeg, png or jpg formats up to 5MB
                            </Text>
                        </TouchableOpacity>

                        {/* Selected Images */}
                        {images.length > 0 && (
                            <View style={styles.selectedImagesContainer}>
                                <Text style={styles.imageSectionTitle}>
                                    Added{" "}
                                    <Text style={{ color: "#6A5AE0" }}>
                                        ({images.length})
                                    </Text>{" "}
                                    Images
                                </Text>
                                <View style={styles.imageGrid}>
                                    {images.map((uri, index) => (
                                        <View key={index} style={styles.imageContainer}>
                                            <Image
                                                source={{ uri }}
                                                style={styles.selectedImage}
                                            />
                                            <TouchableOpacity
                                                style={styles.removeIcon}
                                                onPress={() => removeImage(index)}
                                                disabled={loading}
                                            >
                                                <Ionicons
                                                    name="close-circle"
                                                    size={wp("4.5%")}
                                                    color="#ff4444"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    {images.length < 10 && (
                                        <TouchableOpacity
                                            style={styles.plusBox}
                                            onPress={pickImage}
                                            disabled={loading}
                                        >
                                            <Text style={styles.plusText}>+</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Comments */}
                <View style={styles.commentContainer}>
                    <View style={styles.commentHeaderInsideBox}>
                        <Text style={styles.commentHeader}>Comments</Text>
                        <Feather name="edit" size={14} color="black" />
                    </View>

                    <View style={styles.commentInputRow}>
                        <TextInput
                            style={styles.commentInput}
                            multiline
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Share your suggestions, feedback, or issues..."
                            placeholderTextColor="#999"
                            editable={!loading}
                        />
                        <TouchableOpacity style={styles.micButton} disabled={loading}>
                            <Image source={MicImage} style={styles.micImage} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitBtn,
                        loading && styles.submitBtnDisabled
                    ]}
                    onPress={submitFeedback}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.submitText}>Submit</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ShareSuggestScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("2%"),
        marginTop: hp(4),
    },
    headerTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        marginLeft: wp(3),
        color: "#000",
    },
    scrollContent: { paddingHorizontal: wp("5%"), paddingBottom: hp("4%") },
    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: wp("2%"),
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1.5%"),
        fontSize: wp("3.5%"),
        color: "#000",
        marginTop: hp("1.5%"),
    },

    locationBox: {
        borderWidth: 1,
        borderColor: "#6C63FF80",
        borderRadius: wp("2%"),
        padding: wp("3.5%"),
        marginTop: hp("1.5%"),
        backgroundColor: '#ffff'
    },
    locationLabel: {
        fontSize: wp("3.4%"),
        color: "#999",
        marginBottom: hp("0.5%"),
    },
    locationRow: { flexDirection: "row", alignItems: "center" },
    locationText: {
        fontSize: wp("3.5%"),
        color: "#6E533F",
        marginLeft: wp("1%"),
        marginTop: hp(2.2),
        fontFamily: 'Poppins-Medium',
        flex: 1,
    },
    changeText: {
        color: "#6C63FF",
        fontSize: wp("3.3%"),
        marginTop: hp(2.6),
        fontFamily: 'Poppins-Medium'
    },

    uploadLabel: {
        fontSize: wp("3.5%"),
        color: "#000",
        marginTop: hp("3%"),
        marginBottom: hp("1.3%"),
        fontWeight: "500",
    },
    imageUploadBox: {
        borderWidth: 1.5,
        borderColor: "#7f79feff",
        borderStyle: "dashed",
        borderRadius: wp("3%"),
        paddingVertical: hp("2%"),
        alignItems: "center",
        backgroundColor: "#F9F9F9",
    },
    addImageContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    uploadIconImage: {
        width: wp("20%"),
        height: wp("20%"),
        resizeMode: "contain",
    },
    addImageText: {
        fontSize: wp("3.5%"),
        color: "#6A5AE0",
        marginTop: hp("1%"),
    },
    imageNote: {
        fontSize: wp("3%"),
        color: "#999",
        marginTop: hp("0.5%"),
        marginBottom: hp(1)
    },

    selectedImagesContainer: {
        width: "100%",
        marginTop: hp("2%"),
        paddingHorizontal: wp("4%"),
    },
    imageMainContainer: {
        backgroundColor: '#D9D9D959',
        paddingVertical: hp(2.5),
        paddingHorizontal: wp(6),
        borderRadius: 12
    },
    imageSectionTitle: {
        fontSize: wp("3.8%"),
        color: "#000",
        fontWeight: "500",
        marginBottom: hp("1%"),
    },
    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: wp("2%"),
    },
    imageContainer: { position: "relative" },
    selectedImage: {
        width: wp("18%"),
        height: wp("18%"),
        borderRadius: wp("2%"),
    },
    removeIcon: {
        position: "absolute",
        top: -wp("1%"),
        right: -wp("1%"),
        backgroundColor: "#fff",
        borderRadius: wp("2%"),
    },
    plusBox: {
        width: wp("18%"),
        height: wp("18%"),
        borderRadius: wp("2%"),
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
    },
    plusText: {
        fontSize: wp("7%"),
        color: "#6A5AE0",
    },

    commentContainer: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: wp("2%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1%"),
        marginTop: hp("2.5%"),
    },
    commentHeaderInsideBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: wp("2%"),
        marginBottom: hp("1%"),
    },
    commentHeader: {
        fontSize: wp("3.8%"),
        fontWeight: "500",
        color: "#000",
    },
    commentInputRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    commentInput: {
        flex: 1,
        fontSize: wp("3.5%"),
        color: "#000",
        minHeight: hp("8%"),
        textAlignVertical: 'top',
    },
    micButton: {
        paddingLeft: wp("2%"),
        paddingTop: hp("1%"),
    },
    micImage: {
        width: wp("5%"),
        height: wp("5%"),
        resizeMode: "contain",
    },

    submitBtn: {
        backgroundColor: "#6C63FF",
        borderRadius: wp("3%"),
        marginTop: hp("3%"),
        paddingVertical: hp("1.5%"),
        alignItems: "center",
    },
    submitBtnDisabled: {
        backgroundColor: "#6C63FF99",
    },
    submitText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
    suggestionsContainer: {
        marginTop: hp("1%"),
        borderTopWidth: 1,
        borderTopColor: "#eee",
        maxHeight: hp("20%"),
    },
    suggestionItem: {
        paddingVertical: hp("1.5%"),
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    suggestionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    suggestionText: {
        fontSize: wp("3.5%"),
        color: "#333",
        flex: 1,
    },
});