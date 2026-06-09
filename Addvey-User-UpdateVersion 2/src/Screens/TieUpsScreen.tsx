// In TieUpsScreen.js - Update the imports and state
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../Components/Loader";
import { PostAPi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import SocialLinks from "./SocialLinksScreen";

// Add this import

const MicImage = require("../../assets/images/mic.png");

// Common languages for selection
const COMMON_LANGUAGES = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
];

const TieUpsScreen = () => {
  const navigation = useNavigation<any>();
  const [corporateType, setCorporateType] = useState(
    "Social network collaborator"
  );
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Corporate Tie Up"); // initial
  const [dropdownText, setDropdownText] = useState(corporateType);

  // Check if Social Link field should show - case insensitive check
  const showSocialLink = selectedOption.toLowerCase().includes("social");
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    speaks: [] as string[],
    company: "",
    message: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    name: "",
    contact_number: "",
    speaks: "",
    company: "",
    message: "",
    url: "",
  });

  const [loading, setLoading] = useState(false);

  // Language dropdown state
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // URL state
  const [url, setUrl] = useState("");
  const [showSocialLinksScreen, setShowSocialLinksScreen] = useState(false);

  // Function to handle URL save from SocialLinks screen
  const handleSaveUrl = (newUrl: string) => {
    setUrl(newUrl);
    setShowSocialLinksScreen(false);
    console.log("URL saved:", newUrl);
  };

  const handleCancelSocialLinks = () => {
    setShowSocialLinksScreen(false);
  };

  // API Configuration
  const handleCorporateToggle = () => {
    setExpanded(!expanded);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Language selection functions
  const toggleLanguageSelection = (language: string) => {
    setSelectedLanguages((prev) => {
      const isSelected = prev.includes(language);
      let updatedLanguages;

      if (isSelected) {
        updatedLanguages = prev.filter((lang) => lang !== language);
      } else {
        updatedLanguages = [...prev, language];
      }

      // Update form data
      setFormData((prevData) => ({
        ...prevData,
        speaks: updatedLanguages,
      }));

      // Clear language error
      if (errors.speaks) {
        setErrors((prev) => ({
          ...prev,
          speaks: "",
        }));
      }

      return updatedLanguages;
    });
  };

  const openLanguageModal = () => {
    setLanguageModalVisible(true);
  };

  const closeLanguageModal = () => {
    setLanguageModalVisible(false);
  };

  const getDisplayLanguages = () => {
    if (selectedLanguages.length === 0) return "Select languages";
    if (selectedLanguages.length <= 2) return selectedLanguages.join(", ");
    return `${selectedLanguages.slice(0, 2).join(", ")} +${
      selectedLanguages.length - 2
    } more`;
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {
      name: "",
      contact_number: "",
      speaks: "",
      company: "",
      message: "",
      url: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
      isValid = false;
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.contact_number.replace(/\D/g, ""))) {
        newErrors.contact_number = "Please enter a valid 10-digit phone number";
        isValid = false;
      }
    }

    if (selectedLanguages.length === 0) {
      newErrors.speaks = "Please select at least one language";
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    if (!url.trim()) {
      newErrors.url = "Social link is required";
      isValid = false;
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      newErrors.url =
        "Please enter a valid URL starting with http:// or https://";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // API Call function
  const submitTieUp = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fix all errors before submitting."
      );
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      const requestBody = {
        name: formData.name,
        contact_number: formData.contact_number,
        speaks: selectedLanguages,
        company: formData.company,
        message: formData.message,
        social_link: url, // Include the URL in the request
      };

      const param = {
        url: EndPoints.tieup,
        body: requestBody,
        token: token || "",
        method: "POST",
      };

      const dd = await PostAPi(param, setLoading);
      if (dd?.success) {
        console.log("<><><><><><", param.body);
        Alert.alert(
          "Success",
          "Your tie-up request has been submitted successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form
                setFormData({
                  name: "",
                  contact_number: "",
                  speaks: [],
                  company: "",
                  message: "",
                });
                setSelectedLanguages([]);
                setUrl("");
                setErrors({
                  name: "",
                  contact_number: "",
                  speaks: "",
                  company: "",
                  message: "",
                  url: "",
                });
                navigation.goBack();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error submitting tie-up:", error);
      Alert.alert("Error", "Failed to submit tie-up request");
    } finally {
      setLoading(false);
    }
  };

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguages.includes(item) && styles.languageItemSelected,
      ]}
      onPress={() => toggleLanguageSelection(item)}
    >
      <Text
        style={[
          styles.languageText,
          selectedLanguages.includes(item) && styles.languageTextSelected,
        ]}
      >
        {item}
      </Text>
      {selectedLanguages.includes(item) && (
        <Ionicons name="checkmark" size={hp("2%")} color="#fff" />
      )}
    </TouchableOpacity>
  );

  // If SocialLinks screen should be shown, render it
  if (showSocialLinksScreen) {
    return (
      <SocialLinks
        onSave={handleSaveUrl}
        onCancel={handleCancelSocialLinks}
        currentUrl={url}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          {loading && <LoadingModal />}

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={hp("2%")} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tie Up</Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp("5%") }}
          >
            {/* YouTube Section */}
            <View style={styles.videoCard}>
              <Text style={styles.videoText}>
                How do I fill in the details?
              </Text>

              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={{
                    uri: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                  }}
                  style={styles.videoImage}
                />

                <View style={styles.playOverlay}>
                  <Ionicons name="play-circle" size={hp("6%")} color="#fff" />
                </View>

                <Image
                  source={require("../../assets/images/you.png")}
                  style={styles.youtubeLogo}
                />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Corporate Type Dropdown */}
              <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.8}
              >
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownLabel}>{selectedOption}</Text>
                  <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={hp("1.6%")}
                    color="#6C63FF"
                  />
                </View>

                {expanded && (
                  <TouchableOpacity
                    onPress={() => {
                      // Swap selected option with dropdown text
                      const temp = selectedOption;
                      setSelectedOption(dropdownText);
                      setDropdownText(temp);
                      setExpanded(false); // close dropdown
                    }}
                  >
                    <Text style={styles.dropdownValue}>{dropdownText}</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Name */}
              <View>
                <TextInput
                  placeholder="Name *"
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholderTextColor="#00000099"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                />
                {errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>

              {/* Contact Number */}
              <View>
                <TextInput
                  placeholder="Contact number *"
                  keyboardType="phone-pad"
                  style={[
                    styles.input,
                    errors.contact_number && styles.inputError,
                  ]}
                  placeholderTextColor="#00000099"
                  value={formData.contact_number}
                  onChangeText={(value) =>
                    handleInputChange("contact_number", value)
                  }
                  maxLength={10}
                />
                {errors.contact_number ? (
                  <Text style={styles.errorText}>{errors.contact_number}</Text>
                ) : null}
              </View>

              {/* Languages Dropdown */}
              <View>
                <TouchableOpacity
                  style={[
                    styles.languageDropdown,
                    errors.speaks && styles.inputError,
                  ]}
                  onPress={openLanguageModal}
                >
                  <Text
                    style={[
                      styles.languageDropdownText,
                      selectedLanguages.length === 0 && styles.placeholderText,
                    ]}
                  >
                    {getDisplayLanguages()}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={hp("1.8%")}
                    color="#666"
                  />
                </TouchableOpacity>
                {errors.speaks ? (
                  <Text style={styles.errorText}>{errors.speaks}</Text>
                ) : null}
              </View>

              {/* URL Field */}
              {showSocialLink && (
                <View>
                  <TouchableOpacity
                    style={[
                      styles.languageDropdown,
                      errors.url && styles.inputError,
                    ]}
                    onPress={() => setShowSocialLinksScreen(true)}
                  >
                    <Text
                      style={[
                        styles.languageDropdownText,
                        !url && styles.placeholderText,
                      ]}
                    >
                      {url || "Add Social Link *"}
                    </Text>

                    <Ionicons
                      name="chevron-down"
                      size={hp("1.8%")}
                      color="#666"
                    />
                  </TouchableOpacity>

                  {errors.url && (
                    <Text style={styles.errorText}>{errors.url}</Text>
                  )}
                </View>
              )}

              {/* Company */}
              <View>
                <TextInput
                  placeholder="Company *"
                  style={[styles.input, errors.company && styles.inputError]}
                  placeholderTextColor="#00000099"
                  value={formData.company}
                  onChangeText={(value) => handleInputChange("company", value)}
                />
                {errors.company ? (
                  <Text style={styles.errorText}>{errors.company}</Text>
                ) : null}
              </View>

              {/* Comments Section */}
              <View>
                <View
                  style={[
                    styles.commentContainer,
                    errors.message && styles.inputError,
                  ]}
                >
                  <View style={styles.commentHeaderRow}>
                    <Text style={styles.commentHeader}>Comments *</Text>
                    <Feather
                      name="edit"
                      size={hp("1.5%")}
                      style={{ marginLeft: wp("2") }}
                      color="black"
                    />
                  </View>

                  <View style={styles.commentInputRow}>
                    <TextInput
                      style={styles.commentInput}
                      multiline
                      value={formData.message}
                      onChangeText={(value) =>
                        handleInputChange("message", value)
                      }
                      placeholderTextColor="#00000099"
                      numberOfLines={4}
                    />
                    <TouchableOpacity style={styles.micButton}>
                      <Image source={MicImage} style={styles.micImage} />
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.message ? (
                  <Text style={styles.errorText}>{errors.message}</Text>
                ) : null}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={submitTieUp}
                disabled={loading}
              >
                {loading ? (
                  <LoadingModal />
                ) : (
                  <Text style={styles.submitText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Language Selection Modal */}
          <Modal
            visible={languageModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeLanguageModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Languages</Text>
                  <TouchableOpacity onPress={closeLanguageModal}>
                    <Ionicons name="close" size={hp("2.5%")} color="#000" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSubtitle}>
                  Select the languages you speak ({selectedLanguages.length}{" "}
                  selected)
                </Text>

                <FlatList
                  data={COMMON_LANGUAGES}
                  renderItem={renderLanguageItem}
                  keyExtractor={(item) => item}
                  style={styles.languageList}
                  showsVerticalScrollIndicator={false}
                />

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={closeLanguageModal}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default TieUpsScreen;
// ... keep your existing styles the same ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: wp("5%"),
    marginTop: hp(4),
  },
  headerTitle: {
    fontSize: hp("2%"),
    color: "#000",
    marginLeft: wp("3%"),
    marginTop: hp(0.5),
    fontFamily: "Poppins-Medium",
  },
  scrollContainer: {
    marginTop: hp("2%"),
    paddingHorizontal: wp("5%"),
  },
  videoCard: {
    borderRadius: wp("4%"),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00000033",
    marginBottom: hp("2%"),
  },
  videoText: {
    fontSize: hp("1.5%"),
    color: "#00000099",
    textAlign: "center",
    paddingVertical: hp(1),
    fontFamily: "Poppins-Medium",
  },
  videoImage: {
    width: "100%",
    height: hp("20%"),
    borderRadius: wp("4%"),
  },
  playOverlay: {
    position: "absolute",
    top: "40%",
    left: "45%",
  },
  youtubeLogo: {
    width: wp("10%"),
    height: hp("5%"),
    position: "absolute",
    bottom: hp("0.5%"),
    right: wp("2%"),
    resizeMode: "contain",
  },
  formContainer: {
    marginTop: hp("2%"),
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    marginBottom: hp("1.5%"),
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownLabel: {
    fontSize: hp("1.5%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  dropdownValue: {
    marginTop: hp("2%"),
    color: "#666",
    fontSize: hp("1.5%"),
    fontFamily: "Poppins-Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    height: hp("6%"),
    fontSize: hp("1.5%"),
    color: "#000",
    marginBottom: hp("1.5%"),
    fontFamily: "Poppins-Regular",
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: hp("1.3%"),
    marginBottom: hp("2%"),
    marginLeft: wp("1%"),
    fontFamily: "Poppins-Regular",
  },
  languageDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    height: hp("6%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#fff",
  },
  languageDropdownText: {
    color: "#00000099",
    fontSize: hp("1.5%"),
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  placeholderText: {
    color: "#00000099",
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.5%"),
    marginBottom: hp("1%"),
  },
  commentHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  commentHeader: {
    fontSize: hp("1.7%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    fontSize: hp("1.5%"),
    color: "#00000099",
    minHeight: hp("8%"),
    paddingRight: wp("2%"),
    fontFamily: "Poppins-Regular",
    textAlignVertical: "top",
  },
  micButton: {
    justifyContent: "flex-end",
    paddingBottom: hp("0.5%"),
  },
  micImage: {
    width: wp("5%"),
    height: wp("5%"),
    resizeMode: "contain",
  },
  submitBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: wp("4%"),
    height: hp("5.5%"),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: hp("1%"),
  },
  submitBtnDisabled: {
    backgroundColor: "#C8B5FF",
    opacity: 0.7,
  },
  submitText: {
    fontSize: hp("2%"),
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp("5%"),
    borderTopRightRadius: wp("5%"),
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("3%"),
    maxHeight: hp("70%"),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("2%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: hp("2%"),
    color: "#000",
    fontFamily: "Poppins-SemiBold",
  },
  modalSubtitle: {
    fontSize: hp("1.4%"),
    color: "#666",
    marginTop: hp("1%"),
    marginBottom: hp("2%"),
    fontFamily: "Poppins-Regular",
  },
  languageList: {
    marginBottom: hp("2%"),
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languageItemSelected: {
    backgroundColor: "#6C63FF",
    borderRadius: wp("2%"),
    marginVertical: hp("0.5%"),
  },
  languageText: {
    fontSize: hp("1.6%"),
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
  languageTextSelected: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  doneButton: {
    backgroundColor: "#6C63FF",
    borderRadius: wp("4%"),
    height: hp("5.5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: hp("1.8%"),
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
});
