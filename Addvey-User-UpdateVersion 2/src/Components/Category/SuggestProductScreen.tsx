// SuggestScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { EndPoints } from "../../services/EndPoints";
import { PostAPi } from "../../api/getApi/getApi";
import LoadingModal from "../Loader";

const SuggestScreen: React.FC = () => {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const Submit = async () => {
    // Handle the submission logic here
    console.log("Suggested Product:", suggestion);
    // Clear the input field after submission
    if (suggestion !== "") {
      const userToken = await AsyncStorage.getItem("authToken");

      const param = {
        url: EndPoints.addSuggestion,
        body: {
          "description": suggestion
        },
        token: userToken || "",
      }

      const dd = await PostAPi(param, setLoading)
      if (dd?.success) {
        console.log("Response:", dd);
        //  navigation.goBack() 
        setSuggestion("");
        Alert.alert("Success", "Thank you for your suggestion!");
      } else {
        console.log("Suggest API Failed:", dd);
        Alert.alert("Error", dd?.message || "Failed to submit suggestion");
      }
    }
  }
  return (
    <View style={styles.container}>
      {loading && <LoadingModal />}
      <Text style={styles.heading}>Suggest a Product</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Didn’t find what you are looking for? Please suggest the products
      </Text>

      {/* Textarea */}
      <TextInput
        style={styles.textarea}
        placeholder="Enter the name of products you would like to see on Addvey"
        value={suggestion}
        onChangeText={setSuggestion}
        multiline
        textAlignVertical="top"
      />

      {/* Button */}
      <TouchableOpacity style={styles.submitButton} onPress={() => Submit()}>
        <Text style={styles.submitText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuggestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: wp("4.8%"),
    fontFamily: "Poppins-Medium",
    marginBottom: hp(0.5),
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: wp("3.2%"),
    fontFamily: "Poppins-Regular",
    color: "#555555",
    textAlign: "center",
    marginBottom: hp(4.5),
    lineHeight: hp(2.5),
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#e1e1e1ff",
    borderRadius: 10,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Regular",
    marginBottom: hp(4),
    minHeight: hp(19),
    color: "#555555",
  },
  submitButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.4),
    borderRadius: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
  },
});
