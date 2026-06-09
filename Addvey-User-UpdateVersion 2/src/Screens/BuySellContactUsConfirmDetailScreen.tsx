// BuySellContactConfirmDetailScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import MainHomeCard from "../Components/Home/MainHomeCard";
import { useRoute, useNavigation } from "@react-navigation/native";
import MainReportCard from "../Components/Home/MainReportCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BuySellContactConfirmDetailScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("తెలుగు"); // Default language

  const route = useRoute();
  const navigation = useNavigation();
  const item = route?.params?.item;
  const reportData = route?.params?.reportData;
  const type = route?.params?.type;

  // Function to handle API call
  const handleCallMe = async () => {
    try {
      // Validate phone number
      if (!phone || phone.length < 10) {
        Alert.alert("Error", "Please enter a valid phone number");
        return;
      }

      setLoading(true);

      // Get auth token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Error", "Please login again");
        navigation.goBack();
        return;
      }

      // Prepare request body
      const requestBody = {
        productId: item?.id,
        type: "report",
        reason: "other", // Use the reason from type or default
        // reason: type?.reason || "general_help", // Use the reason from type or default
        description: type?.description || "Need help with this product",
        attachments: [],
        audioMessage: "",
        language: getLanguageCode(selectedLanguage),
        phoneNumber: `+92${phone}`, // Assuming Pakistan code, adjust as needed
        issue: type?.help_question || "General inquiry",
      };

      console.log("API Request:", requestBody);

      const response = await fetch(
        "https://api.addvey.com/api/reports/create-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);
      navigation.navigate("ConfirmDetail", { reportData: null });
      if (result.success) {
        Alert.alert(
          "Success",
          "Your request has been submitted successfully! We will call you soon.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to submit your request. Please try again."
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "Error",
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert language name to code
  const getLanguageCode = (language) => {
    const languageMap = {
      తెలుగు: "te", // Telugu
      हिंदी: "hi", // Hindi
      English: "en", // English
    };
    return languageMap[language] || "en";
  };

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <View style={styles.container}>
      {/* Topbar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={16} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Contact us hello</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: hp("12%") }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.sectionTitle}>
          <Text style={{ fontFamily: "Poppins-Bold" }}>Buy/Sell </Text>| Confirm
          your details so we can call you
        </Text>

        {/* AD ID Section */}
        <TouchableOpacity
          style={styles.adRow}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.adId}>AD ID : {item?.id}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#6C63FF"
          />
        </TouchableOpacity>

        {/* Expandable content */}
        {expanded && (
          <View style={styles.expandBox}>
            <MainReportCard item={item} reportData={reportData} from={true} />
          </View>
        )}

        {/* Help you with this */}
        <View style={{ marginTop: hp("2%") }}>
          <Text style={styles.subHeading}>Help you with this</Text>
          <TouchableOpacity style={styles.helpBox}>
            <Text style={styles.helpText}>{type?.help_question}</Text>
            <Ionicons name="chevron-forward" size={14} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Talk to us in */}
        <View style={{ marginTop: hp("4%") }}>
          <Text style={styles.subHeading}>Talk to us in :</Text>
          <View style={styles.languageRow}>
            <TouchableOpacity
              style={[
                styles.langBtn,
                selectedLanguage === "తెలుగు" ? { borderColor: "#6C63FF" } : {},
              ]}
              onPress={() => handleLanguageSelect("తెలుగు")}
            >
              <Text
                style={[
                  styles.langText,
                  selectedLanguage === "తెలుగు" ? { color: "#6C63FF" } : {},
                ]}
              >
                తెలుగు
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langBtn,
                selectedLanguage === "हिंदी" ? { borderColor: "#6C63FF" } : {},
              ]}
              onPress={() => handleLanguageSelect("हिंदी")}
            >
              <Text
                style={[
                  styles.langText,
                  selectedLanguage === "हिंदी" ? { color: "#6C63FF" } : {},
                ]}
              >
                हिंदी
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langBtn,
                selectedLanguage === "English"
                  ? { borderColor: "#6C63FF" }
                  : {},
              ]}
              onPress={() => handleLanguageSelect("English")}
            >
              <Text
                style={[
                  styles.langText,
                  selectedLanguage === "English" ? { color: "#6C63FF" } : {},
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Call number info */}
        <View style={{ marginTop: hp("3%") }}>
          <Text style={styles.subHeadingBottom}>
            We will call you on this number :
          </Text>
          <Text style={styles.phoneMain}>+92-888992494</Text>

          {/* Editable input with separate borders */}
          <View style={styles.inputRow}>
            {/* Left side box with image + +92 */}
            <View style={styles.codeBox}>
              <Image
                source={require("../../assets/images/ind.png")}
                style={styles.flagIcon}
              />
              <Text style={styles.countryCode}>+91</Text>
            </View>

            {/* Right side input */}
            <View style={styles.numberBox}>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="number-pad"
                placeholder="Enter number"
                maxLength={10}
              />
            </View>
          </View>
        </View>

        {/* Call button fixed bottom */}
        <TouchableOpacity
          style={[styles.callBtn, loading && styles.callBtnDisabled]}
          onPress={handleCallMe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.callBtnText}>Call me</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BuySellContactConfirmDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginTop: hp(3.8),
  },
  topTitle: {
    fontSize: wp("4%"),
    marginLeft: wp("3%"),
    fontWeight: "600",
    color: "#000",
  },
  sectionTitle: {
    fontSize: wp("3%"),
    color: "#333",
    paddingHorizontal: wp("4%"),
    marginTop: hp("2%"),
    fontFamily: "Poppins-Medium",
  },
  adRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    marginTop: hp("2%"),
  },
  adId: {
    fontSize: wp("3.2%"),
    color: "#6C63FF",
    fontWeight: "500",
  },
  expandBox: {
    marginHorizontal: wp("2%"),
    marginTop: hp("1%"),
    padding: wp("3%"),
    borderRadius: 6,
  },
  expandText: {
    fontSize: wp("3.2%"),
    color: "#333",
  },
  subHeading: {
    fontSize: wp("3%"),
    color: "#444",
    marginBottom: hp("1%"),
    paddingHorizontal: wp("4%"),
    fontFamily: "Poppins-Medium",
  },
  subHeadingBottom: {
    fontSize: wp("3%"),
    color: "#444",
    paddingHorizontal: wp("4%"),
    fontFamily: "Poppins-Medium",
  },
  helpBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp("4%"),
    padding: wp("3%"),
    borderRadius: 6,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  helpText: {
    fontSize: wp("3.2%"),
    color: "#333",
  },
  languageRow: {
    flexDirection: "row",
    paddingHorizontal: wp("4%"),
    gap: wp("3%"),
  },
  langBtn: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("5.5%"),
  },
  langText: {
    fontSize: wp("3.2%"),
    color: "#555",
  },
  phoneMain: {
    fontSize: wp("3%"),
    fontWeight: "700",
    color: "#000",
    paddingHorizontal: wp("4%"),
    marginTop: hp("0%"),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp("4%"),
    marginTop: hp("3%"),
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    marginRight: wp("2%"),
  },
  flagIcon: {
    width: wp("6%"),
    height: wp("6%"),
    marginRight: wp("2%"),
    resizeMode: "contain",
  },
  countryCode: {
    fontSize: wp("3.5%"),
    fontWeight: "500",
    color: "#000",
  },
  numberBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0%"),
  },
  input: {
    fontSize: wp("3.5%"),
  },
  callBtn: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    marginHorizontal: wp(5),
    borderRadius: 16,
    marginTop: hp(6),
  },
  callBtnDisabled: {
    backgroundColor: "#C9B9FF",
  },
  callBtnText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "600",
    marginLeft: wp("2%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
  },
});
