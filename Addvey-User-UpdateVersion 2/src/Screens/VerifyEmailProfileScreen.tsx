import React, { useEffect, useState, useRef } from "react";
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
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Animated,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import useQueryApi from "../services/queries/useQueryApi";
import { EndPoints } from "../services/EndPoints";
import LoadingModal from "../Components/Loader";
import { mutationHandler } from "../services/mutations/mutationHandler";
import { Base_URL } from "../services/mutations";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Language options
const LANGUAGES = [
  { id: "en", label: "English", native: "English" },
  { id: "hi", label: "Hindi", native: "हिन्दी" },
  { id: "te", label: "Telugu", native: "తెలుగు" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
  { id: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "ml", label: "Malayalam", native: "മലയാളം" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
  { id: "mr", label: "Marathi", native: "मराठी" },
  { id: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { id: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

const VerifyEmailProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [imageUri, setImageUri] = useState<string | null>("");
  const [imageoldUri, setImageoldUri] = useState<string | null>("");
  const [showPickerModal, setShowPickerModal] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [images, setImages] = useState();
  const [loading, setLoading] = useState(false);

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpErrors, setOtpErrors] = useState({ emailOtp: "", phoneOtp: "" });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Language modal states
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [tempLang, setTempLang] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languages, setLanguages] = useState("");
  const slideAnim = useRef(new Animated.Value(300)).current;

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setSelectedDate(date.toLocaleDateString());
    hideDatePicker();
    setDob(date.toISOString().split("T")[0]);
    console.log(date.toISOString().split("T")[0]);
  };

  // Language modal functions
  const openLangModal = () => {
    // Parse current languages string to array - handle undefined case
    if (languages && typeof languages === "string") {
      const currentLangs = languages
        .split(",")
        .map((lang) => lang.trim().toLowerCase()); // lower case for comparison
      const initialIds: string[] = [];

      currentLangs.forEach((langName) => {
        const found = LANGUAGES.find(
          (l) =>
            l.label.toLowerCase() === langName ||
            l.native.toLowerCase() === langName ||
            l.id === langName
        );
        if (found) {
          initialIds.push(found.id);
        }
      });
      // Deduplicate IDs
      setSelectedLanguages([...new Set(initialIds)]);
    } else {
      setSelectedLanguages([]);
    }
    setLangModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeLangModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setLangModalVisible(false);
      setSelectedLanguages([]);
    });
  };

  const toggleLanguageSelection = (langId: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(langId)) {
        return prev.filter((id) => id !== langId);
      } else {
        return [...prev, langId];
      }
    });
  };

  const confirmLangSelection = () => {
    if (selectedLanguages.length === 0) {
      Alert.alert("Please select at least one language");
      return;
    }

    // Convert selected language IDs to language names
    const selectedLangNames = selectedLanguages.map((langId) => {
      const lang = LANGUAGES.find((l) => l.id === langId);
      return lang ? lang.label : langId;
    });

    const languagesString = selectedLangNames.join(", ");
    setLanguages(languagesString);
    closeLangModal();
  };

  const getLanguageLabel = (langId: string) => {
    const lang = LANGUAGES.find((l) => l.id === langId);
    return lang ? lang.label : langId;
  };

  // Function to convert language array to string for display
  const formatLanguagesForDisplay = (languagesArray: string[] | string) => {
    if (!languagesArray) return "";

    if (Array.isArray(languagesArray)) {
      return languagesArray.join(", ");
    }

    // If it's already a string, return as is
    return languagesArray;
  };

  // Function to convert language string to array for selection
  const parseLanguagesToArray = (languagesString: string | string[]) => {
    if (!languagesString) return [];

    if (Array.isArray(languagesString)) {
      return languagesString;
    }

    // If it's a string, split by comma and trim
    return languagesString.split(",").map((lang) => lang.trim());
  };

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem("authToken");
    setToken(userToken || "");
    console.log(userToken);
    setReady(true);
  };

  const { data: profileData, isLoading: isprofileLoading } = useQueryApi(
    ["getProfiledata"],
    `${EndPoints.getProfile}`,
    token,
    {},
    !!token && ready,
    false,
    { lang: "en" }
  );

  useEffect(() => {
    if (profileData?.data) {
      const user = profileData.data;
      setName(user.name || "");
      setGender(user.gender || "");
      setDob(user.dateOfBirth || "");
      setMobile(user.phone || "");
      setEmail(user.email || "");

      // Handle languages data properly
      if (user.languages) {
        const formattedLanguages = formatLanguagesForDisplay(user.languages);
        setLanguages(formattedLanguages);

        // selectedLanguages used for modal, usually re-populated on open,
        // but if we want it ready, we must map, or just leave it empty until open.
        // Better to leave empty here and let openLangModal handle sync.
        setSelectedLanguages([]);
      } else {
        setLanguages("");
        setSelectedLanguages([]);
      }

      setPan(user.pan || "");
      setImageoldUri(user.image || null);
      console.log("User languages:", user.languages);
      console.log(
        "Formatted languages:",
        formatLanguagesForDisplay(user.languages)
      );
    }
  }, [profileData]);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  // Handle Verify button press
  const handleVerifyPress = () => {
    // Validate email before showing OTP modal
    if (!email.trim()) {
      setErrors({ ...errors, email: "Email is required" });
      return;
    }
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      return;
    }

    // Clear any previous errors
    setErrors({ ...errors, email: "" });

    // Send OTP to both email and phone
    sendOtpToBoth();
  };

  // Send OTP to both email and phone
  const sendOtpToBoth = async () => {
    setOtpLoading(true);
    try {
      // Send OTP to phone
      if (mobile) {
        await sendOtp(mobile, "phone");
      }
      // Send OTP to email
      if (email) {
        await sendOtp(email, "email");
      }

      setOtpModalVisible(true);
    } catch (error) {
      console.log("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Send OTP to specific identifier (email or phone)
  const sendOtp = async (identifier: string, type: "email" | "phone") => {
    try {
      const response = await fetch(
        "https://api.addvey.com/api/auth/login-with-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            identifier: identifier,
            type: type,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log(`OTP sent successfully to ${type}:`, identifier);
      } else {
        console.log(`Failed to send OTP to ${type}:`, result.message);
        throw new Error(result.message || `Failed to send OTP to ${type}`);
      }
    } catch (error) {
      console.log(`Error sending OTP to ${type}:`, error);
      throw error;
    }
  };

  // Verify OTP for both email and phone
  const verifyOtp = async () => {
    setOtpModalVisible(false);

    // Validate OTP inputs
    const newOtpErrors = { emailOtp: "", phoneOtp: "" };

    if (!otp1.trim()) {
      newOtpErrors.emailOtp = "Email OTP is required";
    } else if (otp1.length !== 6) {
      newOtpErrors.emailOtp = "OTP must be 6 digits";
    }

    if (!otp2.trim()) {
      newOtpErrors.phoneOtp = "Phone OTP is required";
    } else if (otp2.length !== 6) {
      newOtpErrors.phoneOtp = "OTP must be 6 digits";
    }

    setOtpErrors(newOtpErrors);

    if (newOtpErrors.emailOtp || newOtpErrors.phoneOtp) {
      return;
    }

    setOtpLoading(true);

    try {
      // Verify email OTP
      const emailVerifyResponse = await fetch(
        "https://api.addvey.com/api/auth/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            identifier: email,
            otp: otp1,
          }),
        }
      );

      const emailResult = await emailVerifyResponse.json();

      // Verify phone OTP
      const phoneVerifyResponse = await fetch(
        "https://api.addvey.com/api/auth/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            identifier: mobile,
            otp: otp2,
          }),
        }
      );

      const phoneResult = await phoneVerifyResponse.json();

      if (emailResult.success && phoneResult.success) {
        Alert.alert("Success", "Both email and phone verified successfully!");
        setOtpModalVisible(false);
        setOtp1("");
        setOtp2("");
        // You might want to update the profile data here to reflect verification status
      } else {
        const errorMessage = [];
        if (!emailResult.success)
          errorMessage.push("Email verification failed");
        if (!phoneResult.success)
          errorMessage.push("Phone verification failed");

        Alert.alert("Verification Failed", errorMessage.join(" and "));
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };
const GENDERS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];
const [genderModalVisible, setGenderModalVisible] = useState(false);
const genderSlideAnim = useRef(new Animated.Value(300)).current;

const openGenderModal = () => {
  setGenderModalVisible(true);
  Animated.timing(genderSlideAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start();
};

const closeGenderModal = () => {
  Animated.timing(genderSlideAnim, {
    toValue: 300,
    duration: 300,
    useNativeDriver: true,
  }).start(() => setGenderModalVisible(false));
};


const selectGender = (value: string) => {
  setGender(value);
  closeGenderModal();
};

  const pickFromCamera = async () => {
    try {
      setShowPickerModal(false);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);

        const file: any = {
          uri: asset.uri,
          type: "image/jpeg",
          name: asset.fileName || "photo.jpg",
        };
        setImages(file);
      }
    } catch (error) {
      console.log("Camera error:", error);
    }
  };

  const pickFromGallery = async () => {
    try {
      setShowPickerModal(false);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);

        const file: any = {
          uri: asset.uri,
          type: "image/jpeg",
          name: asset.fileName || "photo.jpg",
        };
        setImages(file);
      }
    } catch (error) {
      console.log("Gallery error:", error);
    }
  };

  const uploadMedia = async () => {
    if (!images) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("files", images);
    console.log(images);
    try {
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
      console.log("Upload result:", result.data?.files?.[0].path);

      if (result.success) {
        return result.data?.files?.[0].path;
      } else {
        Alert.alert("Error", result.message || "Upload failed");
        return null;
      }
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Error", "Something went wrong while uploading.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!gender.trim()) newErrors.gender = "Gender is required";
    if (!dob.trim()) newErrors.dob = "Date of birth is required";
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\+?\d{10,15}$/.test(mobile))
      newErrors.mobile = "Enter valid mobile number";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSuccess = async (res: any) => {
    console.log("><><><><><><><><>", res);
    setLoading(false);
    setTimeout(() => {
      navigation.goBack()
    }, 1000);
    reset();
  };

  const onError = (err: any) => {
    console.log("<><><><><", err);
    setLoading(false);
    reset();
  };

  const { mutate, isPending, reset } = mutationHandler(
    EndPoints.createProfile,
    token,
    onSuccess,
    onError
  );

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const img = await uploadMedia();

    // Convert languages string back to array for API
    const languagesArray = languages.split(",").map((lang) => lang.trim());

    const payload = {
      name: name,
      dateOfBirth: dob,
      gender: gender.toLowerCase(),
      image: img,
      phone: mobile,
      email: email,
      languages: languagesArray, // Include languages in the payload
    };
    console.log("<><><><><><", payload);

    mutate(payload);
  };

  useEffect(() => {
    (async () => {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (
        cameraPermission.status !== "granted" ||
        mediaPermission.status !== "granted"
      ) {
        Alert.alert(
          "Permission required",
          "Please allow camera and gallery access."
        );
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {(isprofileLoading || isSubmitting || otpLoading) && <LoadingModal />}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {loading && <LoadingModal />}

      {/* Fixed Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={20}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.subtitleRow}>
            {/* <Image
              source={require("../../assets/images/profilesave.png")}
              style={styles.smallImage}
            /> */}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("BuySellContactUs")}
        >
          <Image
            source={require("../../assets/images/verify.png")}
            style={styles.rightImage}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#D9D9D94D" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ paddingBottom: hp("4%") }}>
            {/* Profile Image */}
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowPickerModal(true);
                }}
              >
                <Image
                  source={
                    imageUri
                      ? { uri: imageUri }
                      : imageoldUri
                      ? { uri: Base_URL + imageoldUri }
                      : require("../../assets/images/very.png")
                  }
                  style={styles.profileImage}
                />
                <View style={styles.cameraCenter}>
                  <Ionicons
                    name="camera"
                    style={{
                      backgroundColor: "#fff",
                      paddingHorizontal: wp(1.2),
                      paddingVertical: hp(0.4),
                      borderRadius: 20,
                    }}
                    size={16}
                    color="#6E533F"
                  />
                </View>
              </TouchableOpacity>
              <Image
                source={require("../../assets/images/save.png")}
                style={styles.verifyBadge}
              />
            </View>

            {/* All Inputs */}
            <View style={styles.inputContainer}>
              {/* Name */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Name*</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Gender */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Gender</Text>
                {/* <TextInput
                  style={styles.input}
                  value={gender}
                  onChangeText={setGender}
                /> */}

                <View style={styles.inputWrapper}>
  <Text style={styles.label}>Gender*</Text>

  <TouchableOpacity onPress={openGenderModal} activeOpacity={0.7}>
    <TextInput
      style={styles.input}
      value={gender}
      editable={false}
      placeholder="Select gender"
      placeholderTextColor="#999"
    />
  </TouchableOpacity>

  <Ionicons
    name="chevron-down"
    size={16}
    color="#6B4EFF"
    style={styles.inputIcon}
  />

  {errors.gender && (
    <Text style={styles.errorText}>{errors.gender}</Text>
  )}
</View>

                <Ionicons
                  name="male-female"
                  size={16}
                  color="gray"
                  style={styles.inputIcon}
                />
                {errors.gender && (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                )}
              </View>

              {/* DOB */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Date of Birth</Text>
                <Text
                  style={styles.input}
                  onPress={() => setDatePickerVisibility(true)}
                >
                  {dob}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="gray"
                  style={styles.inputIcon}
                />
                {errors.dob && (
                  <Text style={styles.errorText}>{errors.dob}</Text>
                )}
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

              {/* Mobile */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelIconRow}>
                  <Ionicons
                    name="call-outline"
                    size={12}
                    color="gray"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.labelText}>Mobile</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={mobile}
                  onChangeText={setMobile}
                  editable={false}
                />
                <TouchableOpacity style={styles.verifyBtn} activeOpacity={1}>
                  <Image
                    source={require("../../assets/images/verifygreen.png")}
                    style={{
                      marginRight: 4,
                      width: wp(4),
                      height: hp(2),
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color: "#32CD32",
                      fontWeight: "600",
                      fontSize: wp("2.8%"),
                    }}
                  >
                    Verified
                  </Text>
                </TouchableOpacity>
                {errors.mobile && (
                  <Text style={styles.errorText}>{errors.mobile}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelIconRow}>
                  <Ionicons
                    name="mail-outline"
                    size={12}
                    color="gray"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.labelText}>Email</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {profileData?.data?.isEmailVerified ? (
                  <TouchableOpacity style={styles.verifyBtn} activeOpacity={1}>
                    <Image
                      source={require("../../assets/images/verifygreen.png")}
                      style={{
                        marginRight: 4,
                        width: wp(4),
                        height: hp(2),
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: "#32CD32",
                        fontWeight: "600",
                        fontSize: wp("2.8%"),
                      }}
                    >
                      Verified
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.verifyBtn}
                    onPress={handleVerifyPress}
                    disabled={otpLoading}
                  >
                    <Text
                      style={{
                        color: "#6C63FF",
                        fontWeight: "600",
                        fontSize: wp("2.8%"),
                      }}
                    >
                      {otpLoading ? "Sending..." : "Verify"}
                    </Text>
                  </TouchableOpacity>
                )}
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Languages */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelIconRow}>
                  <Ionicons
                    name="language"
                    size={12}
                    color="gray"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.labelText}>Languages</Text>
                </View>
                <TouchableOpacity onPress={openLangModal}>
                  <TextInput
                    style={styles.input}
                    value={languages}
                    editable={false}
                    placeholder="Select languages"
                    placeholderTextColor="#999"
                  />
                </TouchableOpacity>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#6B4EFF"
                  style={styles.inputIcon}
                />
                {errors.languages && (
                  <Text style={styles.errorText}>{errors.languages}</Text>
                )}
              </View>

              {/* PAN */}
              {/* <TouchableOpacity
                onPress={() => navigation?.navigate("PANCardUplaod")}
                style={styles.inputWrapper}
              >
                <Text style={styles.label}>PAN</Text>
                <TextInput
                  style={styles.input}
                  value={pan}
                  onChangeText={setPan}
                  editable={false}
                />
                {errors.pan && (
                  <Text style={styles.errorText}>{errors.pan}</Text>
                )}
              </TouchableOpacity> */}
            </View>

            <TouchableOpacity style={styles.updateBtn} onPress={handleSubmit}>
              <Text style={styles.updateText}>Update Profile</Text>
            </TouchableOpacity>

            {/* OTP Verification Modal */}
            <Modal
              transparent={true}
              visible={otpModalVisible}
              animationType="slide"
              onRequestClose={() => setOtpModalVisible(false)}
            >
              <View style={styles.modalOverlay1}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>OTP Verification</Text>

                  <Text style={styles.otpSubText}>
                    Enter OTP sent to your phone
                  </Text>
                  <Text style={styles.otpToText}>{mobile}</Text>

                  <View style={styles.otpInputWrapper}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="Enter 6-digit OTP"
                      value={otp1}
                      onChangeText={setOtp1}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                    {otpErrors.phoneOtp && (
                      <Text style={styles.otpErrorText}>
                        {otpErrors.phoneOtp}
                      </Text>
                    )}
                    <TouchableOpacity onPress={() => sendOtp(mobile, "phone")}>
                      <Text style={styles.resendText}>Resend</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.otpSubText, { marginTop: hp(2) }]}>
                    Enter OTP sent to your email
                  </Text>
                  <Text style={styles.otpToText}>{email}</Text>

                  <View style={styles.otpInputWrapper}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder="Enter 6-digit OTP"
                      value={otp2}
                      onChangeText={setOtp2}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                    {otpErrors.emailOtp && (
                      <Text style={styles.otpErrorText}>
                        {otpErrors.emailOtp}
                      </Text>
                    )}
                    <TouchableOpacity onPress={() => sendOtp(email, "email")}>
                      <Text style={styles.resendText}>Resend</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      otpLoading && styles.modalButtonDisabled,
                    ]}
                    onPress={verifyOtp}
                    disabled={otpLoading}
                  >
                    <Text style={styles.modalButtonText}>
                      {otpLoading ? "Verifying..." : "Verify"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Image Picker Modal */}
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
                    <TouchableOpacity
                      style={styles.optionBox}
                      onPress={() => {
                        setShowPickerModal(false);
                        pickFromCamera();
                      }}
                    >
                      <FontAwesome6 name="camera" size={38} color="#6C63FF" />
                      <Text style={styles.optionText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.optionBox}
                      onPress={pickFromGallery}
                    >
                      <Image
                        source={require("../../assets/images/images.png")}
                        style={{
                          width: wp("10%"),
                          height: wp("10%"),
                          resizeMode: "contain",
                          marginBottom: hp(0.5),
                        }}
                      />
                      <Text style={styles.optionText}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Language Selection Modal */}
            <Modal
              visible={langModalVisible}
              transparent
              animationType="none"
              statusBarTranslucent
              onRequestClose={closeLangModal}
            >
              <View style={styles.langModalContainer}>
                <Pressable style={styles.overlay} onPress={closeLangModal} />

                <Animated.View
                  style={[
                    styles.langPanel,
                    { transform: [{ translateY: slideAnim }] },
                  ]}
                >
                  <Text style={styles.langHeading}>Choose Languages</Text>
                  <Text style={styles.langSubtitle}>
                    Select all languages you speak
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCloseOutside}
                    onPress={closeLangModal}
                  >
                    <MaterialIcons name="close" size={18} color="black" />
                  </TouchableOpacity>
                  <FlatList
                    data={LANGUAGES}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.langRow}
                        onPress={() => toggleLanguageSelection(item.id)}
                      >
                        <View style={styles.langTextContainer}>
                          <Text style={styles.langLabel}>{item.label}</Text>
                          <Text style={styles.langNative}>({item.native})</Text>
                        </View>
                        <View
                          style={[
                            styles.radioOuter,
                            selectedLanguages.includes(item.id) &&
                              styles.radioSelected,
                          ]}
                        >
                          {selectedLanguages.includes(item.id) && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                    style={styles.langList}
                  />

                  <View style={styles.langFooter}>
                    <Text style={styles.selectedCount}>
                      {selectedLanguages.length} language
                      {selectedLanguages.length !== 1 ? "s" : ""} selected
                    </Text>
                    <TouchableOpacity
                      style={styles.selectButton}
                      activeOpacity={0.8}
                      onPress={confirmLangSelection}
                    >
                      <Text style={styles.selectButtonText}>
                        Select Languages
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </Modal>
            <Modal
  visible={genderModalVisible}
  transparent
  animationType="none"
  onRequestClose={closeGenderModal}
>
  <View style={styles.langModalContainer}>
    <Pressable style={styles.overlay} onPress={closeGenderModal} />

    <Animated.View
      style={[
        styles.langPanel,
        { transform: [{ translateY: genderSlideAnim }] },
      ]}
    >
      <Text style={styles.langHeading}>Select Gender</Text>

      <TouchableOpacity
        style={styles.modalCloseOutside}
        onPress={closeGenderModal}
      >
        <MaterialIcons name="close" size={18} color="black" />
      </TouchableOpacity>

      {GENDERS.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.langRow}
          onPress={() => selectGender(item.label)}
        >
          <Text style={styles.langLabel}>{item.label}</Text>

          <View
            style={[
              styles.radioOuter,
              gender === item.label && styles.radioSelected,
            ]}
          >
            {gender === item.label && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  </View>
</Modal>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmailProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D94D",
  },
  modalOverlay1: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("4%"),
    paddingBottom: hp("1%"),
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  titleContainer: {
    flex: 1,
    marginLeft: wp("3%"),
  },
  headerTitle: {
    fontSize: wp("4%"),
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: wp("2.8%"),
    color: "#6E533F",
    marginRight: wp("2%"),
  },
  smallImage: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
  },
  rightImage: {
    width: wp("6%"),
    height: wp("6%"),
    borderRadius: wp("3%"),
  },
  profileContainer: {
    alignItems: "center",
    marginTop: hp("15%"),
    marginBottom: hp(3),
  },
  profileImage: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    borderWidth: 2,
    borderColor: "#6B4EFF",
  },
  cameraCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
  },
  verifyBadge: {
    position: "absolute",
    bottom: hp("0.5%"),
    right: wp("37%"),
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
  },
  inputContainer: {
    marginTop: hp("2%"),
    paddingHorizontal: wp("5%"),
  },
  inputWrapper: {
    marginBottom: hp("3%"),
    position: "relative",
  },
  label: {
    position: "absolute",
    top: -hp("1%"),
    left: wp("5%"),
    backgroundColor: "#fff",
    paddingHorizontal: wp("1%"),
    fontSize: wp("2.8%"),
    color: "#00000099",
    fontWeight: "600",
    zIndex: 1,
    borderTopLeftRadius:5,
    borderTopRightRadius:5
  },
  labelIconRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: -hp("1%"),
    left: wp("3%"),
    backgroundColor: "#fff",
    paddingHorizontal: wp("1%"),
    zIndex: 2,
     borderTopLeftRadius:5,
    borderTopRightRadius:5
  },
  labelText: {
    fontSize: wp("2.8%"),
    color: "#00000099",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
    backgroundColor:'#fff'
  },
  inputIcon: {
    position: "absolute",
    right: wp("3%"),
    top: "30%",
  },
  verifyBtn: {
    position: "absolute",
    right: wp("3%"),
    top: "28%",
    flexDirection: "row",
    alignItems: "center",
  },
  updateBtn: {
    backgroundColor: "#6B4EFF",
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    marginTop: hp("2%"),
    alignItems: "center",
    marginHorizontal: wp("5%"),
  },
  updateText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: wp("2.8%"),
    marginTop: hp("0.5%"),
    marginLeft: wp("2%"),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: wp(0),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeIconTopRight: {
    position: "absolute",
    top: hp(73),
    right: wp(2),
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rowOptions: {
    flexDirection: "row",
    marginTop: hp(5),
    marginBottom: hp(2),
    paddingHorizontal: wp(5),
  },
  optionBox: {
    paddingVertical: hp(0),
    paddingHorizontal: wp(5),
    alignItems: "center",
    marginBottom: hp(3),
  },
  optionText: { color: "black", fontSize: wp("3.5%"), marginTop: hp(0.5) },

  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: wp("5%"),
  },
  modalTitle: {
    fontSize: wp("4.2%"),
    color: "#000",
    marginBottom: hp("1%"),
    textAlign: "left",
    fontFamily: "Poppins-Medium",
  },
  otpSubText: {
    fontSize: wp("3%"),
    color: "#00000099",
    marginBottom: hp("1%"),
  },
  otpToText: {
    fontSize: wp("3.2%"),
    fontWeight: "600",
    color: "#000",
    marginBottom: hp("1%"),
  },
  otpInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: hp("1%"),
  },
  otpInput: {
    flex: 1,
    paddingVertical: hp("0.8%"),
    fontSize: wp("3.5%"),
  },
  otpErrorText: {
    color: "red",
    fontSize: wp("2.5%"),
    marginTop: hp("0.5%"),
  },
  resendText: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: wp("3%"),
    marginLeft: wp("2%"),
  },
  modalButton: {
    backgroundColor: "#6B4EFF",
    paddingVertical: hp("1.4%"),
    borderRadius: 12,
    marginTop: hp("2%"),
    alignItems: "center",
  },
  modalButtonDisabled: {
    backgroundColor: "#ccc",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: wp("3.8%"),
    fontWeight: "600",
  },
  // Language Modal Styles
  langModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlay: {
    flex: 1,
  },
  modalCloseOutside: {
    position: "absolute",
    top: -40,
    right: wp(4),
    zIndex: 20,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 8,
    elevation: 5,
    alignSelf: "flex-end",
  },
  langPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    maxHeight: hp(70),
  },
  langHeading: {
    fontSize: hp(2.2),
    fontWeight: "bold",
    marginBottom: hp(0.5),
    textAlign: "center",
    color: "#000",
  },
  langSubtitle: {
    fontSize: hp(1.6),
    color: "#666",
    textAlign: "center",
    marginBottom: hp(2),
  },
  langList: {
    maxHeight: hp(40),
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  langTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  langLabel: {
    fontSize: hp(1.8),
    color: "#333",
    marginRight: wp(2),
  },
  langNative: {
    fontSize: hp(1.6),
    color: "#666",
  },
  radioOuter: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#6C63FF",
    backgroundColor: "#6C63FF",
  },
  radioInner: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: "white",
  },
  langFooter: {
    marginTop: hp(2),
    paddingBottom: hp(2),
  },
  selectedCount: {
    fontSize: hp(1.6),
    color: "#666",
    textAlign: "center",
    marginBottom: hp(1),
  },
  selectButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.6),
    borderRadius: wp(3),
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontSize: hp(1.8),
    fontWeight: "600",
  },
});
