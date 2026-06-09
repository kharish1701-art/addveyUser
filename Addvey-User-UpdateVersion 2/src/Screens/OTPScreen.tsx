import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EndPoints } from "../services/EndPoints";
import LoadingModal from "../Components/Loader";
import { mutationHandler } from "../services/mutations/mutationHandler";
import { PostAPi } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { errorToast, toastConfig } from "../Components/Toast/Toast";

const OTPScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const route = useRoute();
  const { phone, from } = route.params as { phone: string, from: string };
  const [loading, setLoading] = useState(false);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onSuccess = async (res: any) => {
    console.log("><><><><><><><><>", res);
    if (res?.success) {
      await AsyncStorage.setItem("authToken", res?.data?.token);
      await AsyncStorage.setItem("user", res?.data?.user?.id.toString() || "");
      navigation.navigate("Language", {token: res?.data?.token});
    }
    setLoading(false);
    setTimeout(() => { }, 1000);
    reset();
  };

  const onError = (err: any) => {
    console.log("<><><><><", err);
    setLoading(false);
    errorToast(err?.message || "Something went wrong");
    reset();
  };

  const { mutate, isPending, reset } = mutationHandler(
    EndPoints.VerifyOtp,
    null,
    onSuccess,
    onError
  );

  const handleVerifyOtp = () => {
    setLoading(true);
    const payload = {
      identifier: phone,
      otp: otp.join(""),
    };
    console.log("<><><><><><", payload);

    mutate(payload);
  };

  // Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text || "";
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const Resend = async () => {
    const param = {
      url: EndPoints?.resendOtp,
      body: {
        "identifier": phone
      },
      token: null
    }

    await PostAPi(param, setLoading)
    setTimer(30)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContainer,
            isKeyboardVisible && styles.scrollContainerKeyboard
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          
          {/* Header */}
          {loading && <LoadingModal />}
 
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.title}>OTP Verification</Text>
            </View>
            <Text style={styles.subtitle}>
              We have sent a verification code to
            </Text>
            <View style={styles.phoneRow}>
              <Text style={styles.phone}>+91 {phone}</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("../../assets/images/phone.png")}
                  style={styles.phoneImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* OTP Boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={[styles.input, otp[index] !== "" && styles.filledInput]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>Check text messages for your OTP</Text>

          {/* Resend Section */}
          <View style={styles.resendRow}>
            <Text style={styles.normalText}>Didn't get the OTP?</Text>
            <Text> </Text>
            {timer > 0 ? (
              <Text style={styles.resendText}>Resend SMS in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={() => Resend()}>
                <Text style={[styles.resendText, { color: "#6C63FF" }]}>
                  Resend SMS
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Spacer to push content up when keyboard is visible */}
          {isKeyboardVisible && <View style={styles.keyboardSpacer} />}
        </ScrollView>

        {/* Verify Button - Position based on keyboard state */}
        <View style={[
          styles.verifyButtonContainer,
          isKeyboardVisible ? styles.verifyButtonKeyboard : styles.verifyButtonNormal
        ]}>
          <TouchableOpacity
            style={[
              styles.verifyBtn,
              otp.join("").length < 6 && { backgroundColor: "#bba8f2" },
            ]}
            disabled={otp.join("").length < 6}
            onPress={() => handleVerifyOtp()}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: wp("5%"),
    paddingBottom: hp("12%"),
  },
  scrollContainerKeyboard: {
    paddingBottom: hp("2%"),
  },
  header: {
    width: "100%",
    marginBottom: hp("3%"),
    marginTop: hp(4),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  title: {
    fontSize: wp(5),
    fontWeight: "400",
    marginLeft: wp("3%"),
    fontFamily: "Poppins-Regular",
    marginTop: hp(0.6),
  },
  subtitle: {
    fontSize: wp("4%"),
    color: "black",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(3),
  },
  phone: {
    fontSize: wp(4),
    fontWeight: "bold",
    marginRight: wp("2%"),
    fontFamily: "Poppins-Bold",
  },
  phoneImage: {
    width: wp(4),
    height: wp(4),
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: hp("0%"),
  },
  input: {
    width: wp("12%"),
    height: hp("6%"),
    borderWidth: 1,
    borderColor: "#00000017",
    borderRadius: 8,
    textAlign: "center",
    fontSize: wp("5%"),
    color: "#000",
    backgroundColor: "#fff",
    shadowColor: "#00000017",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  filledInput: {
    borderColor: "#6C63FF",
    borderWidth: 0.9,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoText: {
    color: "#6C63FF",
    marginBottom: hp("2%"),
    fontSize: wp("2.8%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(2.5),
  },
  resendRow: {
    flexDirection: "row",
    marginBottom: hp("5%"),
    alignItems: "center",
  },
  normalText: {
    fontSize: wp("3.5%"),
    color: "black",
  },
  resendText: {
    fontSize: wp("3.5%"),
    color: "red",
    fontWeight: "500",
  },
  keyboardSpacer: {
    height: hp("10%"),
  },
  verifyButtonContainer: {
    width: "100%",
    paddingHorizontal: wp("5%"),
    backgroundColor: "#fff",
  },
  verifyButtonNormal: {
    position: "absolute",
    bottom: 20,
  },
  verifyButtonKeyboard: {
    paddingVertical: hp("2%"),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  verifyBtn: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp("1.5%"),
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
  },
  verifyText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});

export default OTPScreen;