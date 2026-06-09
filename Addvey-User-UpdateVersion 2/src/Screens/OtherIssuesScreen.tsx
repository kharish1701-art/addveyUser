// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     TextInput,
//     Image,
//     ScrollView,
//     StatusBar,
//     Alert,
//     ActivityIndicator,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { EndPoints } from "../services/EndPoints";
// import { errorToast } from "../Components/Toast/Toast";

// const OtherIssuesScreen: React.FC = () => {
//     const navigation = useNavigation<any>();
//     const [images, setImages] = useState<string[]>([]);
//     const [issue, setIssue] = useState("");
//     const [selectedLanguage, setSelectedLanguage] = useState("English");
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [uploading, setUploading] = useState(false);

//     // Language mapping for API
//     const languageMap = {
//         "తెలుగు": "te",
//         "हिंदी": "hi", 
//         "English": "en"
//     };

//     // Language display mapping
//     const languageDisplayMap = {
//         "తెలుగు": "Telugu తెలుగు",
//         "हिंदी": "Hindi हिंदी", 
//         "English": "English"
//     };

//     // Upload images to server
//     const uploadImages = async () => {
//         if (images.length === 0) return [];

//         setUploading(true);
//         const token = await AsyncStorage.getItem("authToken");
//         const uploadedImagePaths = [];

//         try {
//             for (const imageUri of images) {
//                 const formData = new FormData();
                
//                 // Create file object from URI
//                 const file = {
//                     uri: imageUri,
//                     type: 'image/jpeg',
//                     name: `image_${Date.now()}.jpg`
//                 };

//                 formData.append("files", file as any);

//                 const response = await fetch(
//                     `https://api.addvey.com/api${EndPoints.uploadFile}`,
//                     {
//                         method: "POST",
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "multipart/form-data",
//                         },
//                         body: formData,
//                     }
//                 );

//                 const result = await response.json();
//                 console.log("Upload result:", result);

//                 if (result.success && result.data?.files?.[0]?.path) {
//                     uploadedImagePaths.push(result.data.files[0].path);
//                 } else {
//                     console.warn("Upload failed for image:", imageUri);
//                 }
//             }
//         } catch (err) {
//             console.log("Upload error:", err);
//             Alert.alert("Error", "Failed to upload images");
//         } finally {
//             setUploading(false);
//         }

//         return uploadedImagePaths;
//     };

//     // Create report
//     const createReport = async (attachments: string[]) => {
//         setLoading(true);
//         const token = await AsyncStorage.getItem("authToken");

//         try {
//             const requestBody = {
//                 type: "other_issue", // Fixed: using correct type value
//                 reason: "other",
//                 description: issue,
//                 attachments: attachments,
//                 audioMessage: "", // You can add audio recording functionality later
//                 language: languageMap[selectedLanguage],
//                 phoneNumber: `+91${phoneNumber}`,
//                 issue: issue,
//                 "productId": 1,
//             };

//             console.log("Creating report with data:", requestBody);

//             const response = await fetch("https://api.addvey.com/api/reports/create-report", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(requestBody),
//             });

//             const result = await response.json();
//             console.log("Report creation result:", result);

//             if (result.success) {
//                 // Prepare data for confirmation screen
//                 const confirmationData = {
//                     issueDescription: issue,
//                     language: languageDisplayMap[selectedLanguage],
//                     phoneNumber: phoneNumber,
//                     reportId: result.data?.id || Date.now().toString(),
//                     submittedAt: new Date().toLocaleString(),
//                     images: images
//                 };

//                 // Alert.alert("Success", "Your issue has been reported successfully!");
//                 navigation.navigate("ConfirmDetail", { reportData: confirmationData });
//             } else {
//                 errorToast( result.message || "Failed to submit report");
//             }
//         } catch (error) {
//             console.error("Report creation error:", error);
//             errorToast("Something went wrong. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle call me button press
//     const handleCallMe = async () => {
//         if (!issue.trim()) {
//             Alert.alert("Error", "Please describe your issue");
//             return;
//         }

//         if (!phoneNumber.trim()) {
//             Alert.alert("Error", "Please enter your phone number");
//             return;
//         }

//         if (phoneNumber.length !== 10) {
//             Alert.alert("Error", "Please enter a valid 10-digit phone number");
//             return;
//         }

//         // Upload images first
//         const uploadedAttachments = await uploadImages();
        
//         // Then create report
//         await createReport(uploadedAttachments);
//     };

//     // Image picker function
//     const pickImage = async () => {
//         // Request permissions
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsMultipleSelection: true,
//             quality: 0.8,
//             allowsEditing: false,
//         });

//         if (!result.canceled && result.assets) {
//             const selectedUris = result.assets.map(asset => asset.uri);
            
//             // Check if adding new images would exceed reasonable limit
//             if (images.length + selectedUris.length > 10) {
//                 Alert.alert("Limit Exceeded", "You can upload up to 10 images maximum");
//                 return;
//             }
            
//             setImages(prev => [...prev, ...selectedUris]);
//         }
//     };

//     const removeImage = (index: number) => {
//         const newImages = images.filter((_, i) => i !== index);
//         setImages(newImages);
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="arrow-back" size={hp("2%")} color="#000" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Contact us</Text>
//             </View>

//             <ScrollView
//                 contentContainerStyle={{ paddingBottom: hp("5%") }}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* Section 1: Title */}
//                 <Text style={styles.title}>
//                     <Text style={styles.bold}>Buy/Sell</Text> | Confirm your details so we can call you
//                 </Text>

//                 {/* Section 2: Help with this */}
//                 <Text style={styles.label}>Help you with this</Text>
//                 <TouchableOpacity style={styles.dropdown}>
//                     <Text style={styles.dropdownText}>Other issues</Text>
//                     <Ionicons name="chevron-forward" size={hp("1.8%")} color="#000" />
//                 </TouchableOpacity>

//                 {/* Section 3: Upload Images */}
//                 <Text style={styles.label}>If applicable, Please upload related images</Text>

//                 <View style={styles.imageUploadBox}>
//                     {/* Always show camera icon and text */}
//                     <TouchableOpacity 
//                         onPress={pickImage} 
//                         style={styles.addImageContainer}
//                         disabled={images.length >= 10}
//                     >
//                         <Ionicons 
//                             name="camera-outline" 
//                             size={hp("7%")} 
//                             color={images.length >= 10 ? "#ccc" : "#6C63FF"} 
//                         />
//                         <Text style={[
//                             styles.addImageText,
//                             images.length >= 10 && styles.disabledText
//                         ]}>
//                             Add images
//                         </Text>
//                         <Text style={styles.imageNote}>
//                             {images.length >= 10 
//                                 ? "Maximum 10 images reached" 
//                                 : "jpeg, png or jpg formats up-to 5MB"
//                             }
//                         </Text>
//                         {images.length > 0 && (
//                             <Text style={styles.imageCount}>
//                                 {images.length}/10 images
//                             </Text>
//                         )}
//                     </TouchableOpacity>

//                     {/* Show selected images and plus icon if any */}
//                     {images.length > 0 && (
//                         <View style={{ width: "100%", marginTop: hp("2%") }}>
//                             <View style={styles.selectedImagesContainer}>
//                                 <Text style={styles.imageSectionTitle}>
//                                     Added{" "}
//                                     <Text style={{ color: "#6A5AE0" }}>({images.length})</Text> Images
//                                 </Text>

//                                 <View style={styles.imageRow}>
//                                     {/* Image List */}
//                                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                                         <View style={styles.imageGrid}>
//                                             {images.map((uri, index) => (
//                                                 <View key={index} style={styles.imageContainer}>
//                                                     <Image
//                                                         source={{ uri }}
//                                                         style={styles.selectedImage}
//                                                     />
//                                                     <TouchableOpacity
//                                                         style={styles.removeIcon}
//                                                         onPress={() => removeImage(index)}
//                                                     >
//                                                         <Ionicons
//                                                             name="close-circle"
//                                                             size={wp("4.5%")}
//                                                             color="#ff4444"
//                                                         />
//                                                     </TouchableOpacity>
//                                                 </View>
//                                             ))}

//                                             {/* Plus (+) icon to add more if under limit */}
//                                             {images.length < 10 && (
//                                                 <TouchableOpacity
//                                                     onPress={pickImage}
//                                                     style={[
//                                                         styles.addMoreBox,
//                                                         { height: wp("20%"), width: wp("20%") },
//                                                     ]}
//                                                 >
//                                                     <Text style={styles.plusText}>+</Text>
//                                                 </TouchableOpacity>
//                                             )}
//                                         </View>
//                                     </ScrollView>
//                                 </View>
//                             </View>
//                         </View>
//                     )}
//                 </View>

//                 {/* Loading indicator for image upload */}
//                 {uploading && (
//                     <View style={styles.uploadingContainer}>
//                         <ActivityIndicator size="small" color="#6C63FF" />
//                         <Text style={styles.uploadingText}>Uploading images... ({images.length})</Text>
//                     </View>
//                 )}

//                 {/* Describe issue with mic icon */}
//                 <View style={styles.inputWrapper}>
//                     <TextInput
//                         placeholder="Describe your issue in detail"
//                         placeholderTextColor="#999"
//                         value={issue}
//                         onChangeText={setIssue}
//                         style={styles.input}
//                         multiline
//                         numberOfLines={4}
//                     />
//                     <TouchableOpacity style={styles.micIconContainer}>
//                         <Ionicons name="mic-outline" size={hp("2.5%")} color="#6C63FF" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Talk to us in */}
//                 <Text style={styles.talkLabel}>Talk to us in :</Text>
//                 <View style={styles.languageRow}>
//                     {["తెలుగు", "हिंदी", "English"].map((lang) => (
//                         <TouchableOpacity
//                             key={lang}
//                             style={[
//                                 styles.languageButton,
//                                 selectedLanguage === lang && styles.selectedLang,
//                             ]}
//                             onPress={() => setSelectedLanguage(lang)}
//                         >
//                             <Text
//                                 style={[
//                                     styles.languageText,
//                                     selectedLanguage === lang && styles.selectedLangText,
//                                 ]}
//                             >
//                                 {lang}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* Phone Number */}
//                 <Text style={styles.callLabel}>We will call you on this number :</Text>
//                 <View style={styles.phoneContainer}>
//                     <Text style={styles.countryCode}>+91</Text>
//                     <View style={styles.phoneBox}>
//                         <TextInput
//                             style={styles.phoneInput}
//                             keyboardType="numeric"
//                             placeholder="9392322767"
//                             placeholderTextColor="#000"
//                             value={phoneNumber}
//                             onChangeText={setPhoneNumber}
//                             maxLength={10}
//                         />
//                     </View>
//                 </View>

//                 <TouchableOpacity>
//                     <Text style={styles.addAltNumber}>+Add Alternative Phone Number</Text>
//                 </TouchableOpacity>

//                 {/* Call Me Button */}
//                 <TouchableOpacity
//                     style={[styles.callButton, (loading || uploading) && styles.disabledButton]}
//                     onPress={handleCallMe}
//                     disabled={loading || uploading}
//                 >
//                     {loading ? (
//                         <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                         <>
//                             {/* <Ionicons name="call" size={hp("2.2%")} color="#fff" /> */}
//                             <Text style={styles.callButtonText}>
//                                 {uploading ? "Uploading..." : "Call me"}
//                             </Text>
//                         </>
//                     )}
//                 </TouchableOpacity>
//             </ScrollView>
//         </View>
//     );
// };

// export default OtherIssuesScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         paddingHorizontal: wp("5%"),
//     },
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: hp("3.8%"),
//     },
//     headerTitle: {
//         fontSize: hp("2%"),
//         color: "#000",
//         marginLeft: wp("3%"),
//         fontFamily: "Poppins-Medium",
//         marginTop: hp(0.6),
//     },
//     title: {
//         fontSize: hp("1.6%"),
//         color: "#000",
//         marginTop: hp("2.5%"),
//     },
//     bold: { fontFamily: "Poppins-Bold" },
//     label: {
//         fontSize: hp("1.5%"),
//         color: "#00000099",
//         marginTop: hp("3%"),
//         marginBottom: hp("1%"),
//         fontWeight: "500",
//     },
//     dropdown: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 10,
//         paddingVertical: hp("1.4%"),
//         paddingHorizontal: wp("4%"),
//     },
//     dropdownText: { fontSize: hp("1.6%"), color: "#000" },

//     imageUploadBox: {
//         borderWidth: 1.5,
//         borderColor: "#6C63FF",
//         borderStyle: "dashed",
//         borderRadius: wp("3%"),
//         backgroundColor: "#F9F9F9",
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: hp("2%"),
//         marginBottom: hp("2%"),
//         marginTop: hp(1),
//     },
//     addImageContainer: { alignItems: "center", justifyContent: "center" },
//     addImageText: {
//         fontSize: wp("3.5%"),
//         color: "#6A5AE0",
//         marginTop: hp("1%"),
//     },
//     disabledText: {
//         color: "#ccc",
//     },
//     imageNote: {
//         fontSize: wp("3%"),
//         color: "#999",
//         marginTop: hp("1%"),
//         textAlign: "center",
//         marginBottom: hp(1),
//     },
//     imageCount: {
//         fontSize: wp("2.8%"),
//         color: "#6C63FF",
//         fontWeight: "500",
//         marginTop: hp("0.5%"),
//     },
//     addMoreBox: {
//         alignSelf: "center",
//         backgroundColor: "#ECEBFF",
//         borderRadius: wp("2%"),
//         alignItems: "center",
//         justifyContent: "center",
//         marginLeft: wp("2%"),
//     },
//     plusText: { color: "#6A5AE0", fontSize: wp("6%"), fontWeight: "bold" },
//     selectedImagesContainer: { width: "100%", paddingHorizontal: wp("2%") },
//     imageSectionTitle: {
//         fontSize: wp("3.8%"),
//         color: "#000",
//         fontWeight: "500",
//         marginBottom: hp("1%"),
//     },
//     imageRow: { flexDirection: "row", alignItems: "center" },
//     imageGrid: { flexDirection: "row", alignItems: "center" },
//     imageContainer: { position: "relative", marginRight: wp("2%") },
//     selectedImage: {
//         width: wp("20%"),
//         height: wp("20%"),
//         borderRadius: wp("2%"),
//     },
//     removeIcon: {
//         position: "absolute",
//         top: -wp("1%"),
//         right: -wp("1%"),
//         backgroundColor: "#fff",
//         borderRadius: wp("3%"),
//     },

//     // Input with Mic
//     inputWrapper: {
//         position: "relative",
//         marginTop: hp("2%"),
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 10,
//         paddingHorizontal: wp("4%"),
//         paddingVertical: hp("1.4%"),
//         fontSize: hp("1.6%"),
//         color: "#000",
//         textAlignVertical: 'top',
//         minHeight: hp('10%'),
//     },
//     micIconContainer: {
//         position: "absolute",
//         right: wp("3%"),
//         top: hp("1.2%"),
//     },

//     talkLabel: {
//         fontSize: hp("1.8%"),
//         color: "#000",
//         marginTop: hp("3%"),
//         fontWeight: "500",
//     },
//     languageRow: { flexDirection: "row", marginTop: hp("1.5%") },
//     languageButton: {
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 20,
//         paddingVertical: hp("0.8%"),
//         paddingHorizontal: wp("6%"),
//         marginRight: wp("2%"),
//     },
//     selectedLang: { backgroundColor: "#fff", borderColor: "#6C63FF" },
//     languageText: { color: "#000", fontSize: hp("1.6%") },
//     selectedLangText: { color: "#6C63FF" },

//     callLabel: {
//         fontSize: hp("1.6%"),
//         color: "#00000099",
//         marginTop: hp("3%"),
//         fontWeight: "500",
//     },

//     phoneContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: hp("1%"),
//     },
//     countryCode: {
//         fontSize: hp("1.8%"),
//         color: "#000",
//         fontWeight: "600",
//         marginRight: wp("2%"),
//     },
//     phoneBox: {
//         flex: 0,
//         borderWidth: 1,
//         borderColor: "#ccc",
//         borderRadius: 10,
//         paddingHorizontal: wp("3%"),
//     },
//     phoneInput: {
//         fontSize: hp("1.7%"),
//         color: "#00000099",
//         paddingVertical: hp("1%"),
//         width: wp('40%'),
//     },
//     addAltNumber: {
//         color: "#6C63FFCC",
//         fontSize: hp("1.5%"),
//         marginTop: hp("1%"),
//     },
//     callButton: {
//         backgroundColor: "#6C63FF",
//         borderRadius: 15,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: hp("1%"),
//         marginTop: hp("4%"),
//     },
//     disabledButton: {
//         backgroundColor: "#6C63FF80",
//     },
//     callButtonText: {
//         color: "#fff",
//         fontSize: hp("1.8%"),
//         marginLeft: wp("2%"),
//         fontFamily: "Poppins-Medium",
//         marginTop: hp(0.3),
//     },
//     uploadingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: hp('2%'),
//     },
//     uploadingText: {
//         fontSize: hp('1.5%'),
//         color: '#6C63FF',
//         marginLeft: wp('2%'),
//     },
// });

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EndPoints } from "../services/EndPoints";
import { errorToast } from "../Components/Toast/Toast";

const OtherIssuesScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [images, setImages] = useState<string[]>([]);
    const [issue, setIssue] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Language mapping for API
    const languageMap = {
        "తెలుగు": "te",
        "हिंदी": "hi", 
        "English": "en"
    };

    // Language display mapping
    const languageDisplayMap = {
        "తెలుగు": "Telugu తెలుగు",
        "हिंदी": "Hindi हिंदी", 
        "English": "English"
    };

    // Upload images to server
    const uploadImages = async () => {
        if (images.length === 0) return [];

        setUploading(true);
        const token = await AsyncStorage.getItem("authToken");
        const uploadedImagePaths = [];

        try {
            for (const imageUri of images) {
                const formData = new FormData();
                
                // Create file object from URI
                const file = {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: `image_${Date.now()}.jpg`
                };

                formData.append("files", file as any);

                const response = await fetch(
                    `https://api.addvey.com/api${EndPoints.uploadFile}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                        body: formData,
                    }
                );

                const result = await response.json();
                console.log("Upload result:", result);

                if (result.success && result.data?.files?.[0]?.path) {
                    uploadedImagePaths.push(result.data.files[0].path);
                } else {
                    console.warn("Upload failed for image:", imageUri);
                }
            }
        } catch (err) {
            console.log("Upload error:", err);
            Alert.alert("Error", "Failed to upload images");
        } finally {
            setUploading(false);
        }

        return uploadedImagePaths;
    };

    // Create report
    const createReport = async (attachments: string[]) => {
        setLoading(true);
        const token = await AsyncStorage.getItem("authToken");

        try {
            const requestBody = {
                type: "other_issue", // Fixed: using correct type value
                reason: "other",
                description: issue,
                attachments: attachments,
                audioMessage: "", // You can add audio recording functionality later
                language: languageMap[selectedLanguage],
                phoneNumber: `+91${phoneNumber}`,
                issue: issue,
                // "productId": 1,
            };

            console.log("Creating report with data:", requestBody);

            const response = await fetch("https://api.addvey.com/api/reports/create-report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            console.log("Report creation result:", result);

            if (result.success) {
                // Prepare data for confirmation screen
                const confirmationData = {
                    issueDescription: issue,
                    language: languageDisplayMap[selectedLanguage],
                    phoneNumber: phoneNumber,
                    reportId: result.data?.id || Date.now().toString(),
                    submittedAt: new Date().toLocaleString(),
                    images: images
                };

                // Alert.alert("Success", "Your issue has been reported successfully!");
                navigation.navigate("ConfirmDetail", { reportData: confirmationData });
            } else {
                errorToast( result.message || "Failed to submit report");
            }
        } catch (error) {
            console.error("Report creation error:", error);
            errorToast("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle call me button press
    const handleCallMe = async () => {
        if (!issue.trim()) {
            Alert.alert("Error", "Please describe your issue");
            return;
        }

        if (!phoneNumber.trim()) {
            Alert.alert("Error", "Please enter your phone number");
            return;
        }

        if (phoneNumber.length !== 10) {
            Alert.alert("Error", "Please enter a valid 10-digit phone number");
            return;
        }

        // Upload images first
        const uploadedAttachments = await uploadImages();
        
        // Then create report
        await createReport(uploadedAttachments);
    };

    // Image picker function
    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            allowsEditing: false,
        });

        if (!result.canceled && result.assets) {
            const selectedUris = result.assets.map(asset => asset.uri);
            
            // Check if adding new images would exceed reasonable limit
            if (images.length + selectedUris.length > 10) {
                Alert.alert("Limit Exceeded", "You can upload up to 10 images maximum");
                return;
            }
            
            setImages(prev => [...prev, ...selectedUris]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    // Dismiss keyboard function
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={hp("2%")} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Contact us</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Section 1: Title */}
                    <Text style={styles.title}>
                        <Text style={styles.bold}>Buy/Sell</Text> | Confirm your details so we can call you
                    </Text>

                    {/* Section 2: Help with this */}
                    <Text style={styles.label}>Help you with this</Text>
                    <TouchableOpacity style={styles.dropdown}>
                        <Text style={styles.dropdownText}>Other issues</Text>
                        <Ionicons name="chevron-forward" size={hp("1.8%")} color="#000" />
                    </TouchableOpacity>

                    {/* Section 3: Upload Images */}
                    <Text style={styles.label}>If applicable, Please upload related images</Text>

                    <View style={styles.imageUploadBox}>
                        {/* Always show camera icon and text */}
                        <TouchableOpacity 
                            onPress={pickImage} 
                            style={styles.addImageContainer}
                            disabled={images.length >= 10}
                        >
                            <Ionicons 
                                name="camera-outline" 
                                size={hp("7%")} 
                                color={images.length >= 10 ? "#ccc" : "#6C63FF"} 
                            />
                            <Text style={[
                                styles.addImageText,
                                images.length >= 10 && styles.disabledText
                            ]}>
                                Add images
                            </Text>
                            <Text style={styles.imageNote}>
                                {images.length >= 10 
                                    ? "Maximum 10 images reached" 
                                    : "jpeg, png or jpg formats up-to 5MB"
                                }
                            </Text>
                            {images.length > 0 && (
                                <Text style={styles.imageCount}>
                                    {images.length}/10 images
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Show selected images and plus icon if any */}
                        {images.length > 0 && (
                            <View style={{ width: "100%", marginTop: hp("2%") }}>
                                <View style={styles.selectedImagesContainer}>
                                    <Text style={styles.imageSectionTitle}>
                                        Added{" "}
                                        <Text style={{ color: "#6A5AE0" }}>({images.length})</Text> Images
                                    </Text>

                                    <View style={styles.imageRow}>
                                        {/* Image List */}
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                                                        >
                                                            <Ionicons
                                                                name="close-circle"
                                                                size={wp("4.5%")}
                                                                color="#ff4444"
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}

                                                {/* Plus (+) icon to add more if under limit */}
                                                {images.length < 10 && (
                                                    <TouchableOpacity
                                                        onPress={pickImage}
                                                        style={[
                                                            styles.addMoreBox,
                                                            { height: wp("20%"), width: wp("20%") },
                                                        ]}
                                                    >
                                                        <Text style={styles.plusText}>+</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Loading indicator for image upload */}
                    {uploading && (
                        <View style={styles.uploadingContainer}>
                            <ActivityIndicator size="small" color="#6C63FF" />
                            <Text style={styles.uploadingText}>Uploading images... ({images.length})</Text>
                        </View>
                    )}

                    {/* Describe issue with mic icon */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Describe your issue in detail"
                            placeholderTextColor="#999"
                            value={issue}
                            onChangeText={setIssue}
                            style={styles.input}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={dismissKeyboard}
                        />
                        <TouchableOpacity style={styles.micIconContainer}>
                            <Ionicons name="mic-outline" size={hp("2.5%")} color="#6C63FF" />
                        </TouchableOpacity>
                    </View>

                    {/* Talk to us in */}
                    <Text style={styles.talkLabel}>Talk to us in :</Text>
                    <View style={styles.languageRow}>
                        {["తెలుగు", "हिंदी", "English"].map((lang) => (
                            <TouchableOpacity
                                key={lang}
                                style={[
                                    styles.languageButton,
                                    selectedLanguage === lang && styles.selectedLang,
                                ]}
                                onPress={() => setSelectedLanguage(lang)}
                            >
                                <Text
                                    style={[
                                        styles.languageText,
                                        selectedLanguage === lang && styles.selectedLangText,
                                    ]}
                                >
                                    {lang}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Phone Number */}
                    <Text style={styles.callLabel}>We will call you on this number :</Text>
                    <View style={styles.phoneContainer}>
                        <Text style={styles.countryCode}>+91</Text>
                        <View style={styles.phoneBox}>
                            <TextInput
                                style={styles.phoneInput}
                                keyboardType="numeric"
                                placeholder="9392322767"
                                placeholderTextColor="#000"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={10}
                                returnKeyType="done"
                                blurOnSubmit={true}
                                onSubmitEditing={dismissKeyboard}
                            />
                        </View>
                    </View>

                    <TouchableOpacity>
                        <Text style={styles.addAltNumber}>+Add Alternative Phone Number</Text>
                    </TouchableOpacity>

                    {/* Call Me Button */}
                    <TouchableOpacity
                        style={[styles.callButton, (loading || uploading) && styles.disabledButton]}
                        onPress={handleCallMe}
                        disabled={loading || uploading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.callButtonText}>
                                    {uploading ? "Uploading..." : "Call me"}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default OtherIssuesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp("5%"),
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: hp("8%"),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp("3.8%"),
    },
    headerTitle: {
        fontSize: hp("2%"),
        color: "#000",
        marginLeft: wp("3%"),
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.6),
    },
    title: {
        fontSize: hp("1.6%"),
        color: "#000",
        marginTop: hp("2.5%"),
    },
    bold: { fontFamily: "Poppins-Bold" },
    label: {
        fontSize: hp("1.5%"),
        color: "#00000099",
        marginTop: hp("3%"),
        marginBottom: hp("1%"),
        fontWeight: "500",
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingVertical: hp("1.4%"),
        paddingHorizontal: wp("4%"),
    },
    dropdownText: { fontSize: hp("1.6%"), color: "#000" },

    imageUploadBox: {
        borderWidth: 1.5,
        borderColor: "#6C63FF",
        borderStyle: "dashed",
        borderRadius: wp("3%"),
        backgroundColor: "#F9F9F9",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: hp("2%"),
        marginBottom: hp("2%"),
        marginTop: hp(1),
    },
    addImageContainer: { alignItems: "center", justifyContent: "center" },
    addImageText: {
        fontSize: wp("3.5%"),
        color: "#6A5AE0",
        marginTop: hp("1%"),
    },
    disabledText: {
        color: "#ccc",
    },
    imageNote: {
        fontSize: wp("3%"),
        color: "#999",
        marginTop: hp("1%"),
        textAlign: "center",
        marginBottom: hp(1),
    },
    imageCount: {
        fontSize: wp("2.8%"),
        color: "#6C63FF",
        fontWeight: "500",
        marginTop: hp("0.5%"),
    },
    addMoreBox: {
        alignSelf: "center",
        backgroundColor: "#ECEBFF",
        borderRadius: wp("2%"),
        alignItems: "center",
        justifyContent: "center",
        marginLeft: wp("2%"),
    },
    plusText: { color: "#6A5AE0", fontSize: wp("6%"), fontWeight: "bold" },
    selectedImagesContainer: { width: "100%", paddingHorizontal: wp("2%") },
    imageSectionTitle: {
        fontSize: wp("3.8%"),
        color: "#000",
        fontWeight: "500",
        marginBottom: hp("1%"),
    },
    imageRow: { flexDirection: "row", alignItems: "center" },
    imageGrid: { flexDirection: "row", alignItems: "center" },
    imageContainer: { position: "relative", marginRight: wp("2%") },
    selectedImage: {
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: wp("2%"),
    },
    removeIcon: {
        position: "absolute",
        top: -wp("1%"),
        right: -wp("1%"),
        backgroundColor: "#fff",
        borderRadius: wp("3%"),
    },

    // Input with Mic
    inputWrapper: {
        position: "relative",
        marginTop: hp("2%"),
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1.4%"),
        fontSize: hp("1.6%"),
        color: "#000",
        textAlignVertical: 'top',
        minHeight: hp('12%'),
        maxHeight: hp('20%'),
    },
    micIconContainer: {
        position: "absolute",
        right: wp("3%"),
        top: hp("1.2%"),
    },

    talkLabel: {
        fontSize: hp("1.8%"),
        color: "#000",
        marginTop: hp("3%"),
        fontWeight: "500",
    },
    languageRow: { flexDirection: "row", marginTop: hp("1.5%") },
    languageButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingVertical: hp("0.8%"),
        paddingHorizontal: wp("6%"),
        marginRight: wp("2%"),
    },
    selectedLang: { backgroundColor: "#fff", borderColor: "#6C63FF" },
    languageText: { color: "#000", fontSize: hp("1.6%") },
    selectedLangText: { color: "#6C63FF" },

    callLabel: {
        fontSize: hp("1.6%"),
        color: "#00000099",
        marginTop: hp("3%"),
        fontWeight: "500",
    },

    phoneContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp("1%"),
    },
    countryCode: {
        fontSize: hp("1.8%"),
        color: "#000",
        fontWeight: "600",
        marginRight: wp("2%"),
    },
    phoneBox: {
        flex: 0,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: wp("3%"),
    },
    phoneInput: {
        fontSize: hp("1.7%"),
        color: "#00000099",
        paddingVertical: hp("1%"),
        width: wp('40%'),
        height: hp('4%'),
    },
    addAltNumber: {
        color: "#6C63FFCC",
        fontSize: hp("1.5%"),
        marginTop: hp("1%"),
    },
    callButton: {
        backgroundColor: "#6C63FF",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: hp("1%"),
        marginTop: hp("4%"),
        marginBottom: hp("2%"),
    },
    disabledButton: {
        backgroundColor: "#6C63FF80",
    },
    callButtonText: {
        color: "#fff",
        fontSize: hp("1.8%"),
        marginLeft: wp("2%"),
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.3),
    },
    uploadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('2%'),
    },
    uploadingText: {
        fontSize: hp('1.5%'),
        color: '#6C63FF',
        marginLeft: wp('2%'),
    },
});