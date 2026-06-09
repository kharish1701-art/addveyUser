import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  Pressable,
  FlatList,
  Animated,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { loginApi } from "../api/authApi/AuthApi";
import SimData from "react-native-sim-data";
import * as Location from "expo-location";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
// @ts-ignore
import { useTruecaller, TruecallerUserProfile } from '@ajitpatel28/react-native-truecaller';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { setSession } from "../services/session";

const logoImg = require("../../assets/images/1.png");
const indiaFlag = require("../../assets/images/ind.png");
const googleLogo = require("../../assets/images/google.png");

const LANGUAGES = [
  { id: "en", label: "Eng", native: "English" },
  { id: "hi", label: "Hind", native: "हिंदी" },
  { id: "te", label: "Tel", native: "తెలుగు" },
];

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [tempLang, setTempLang] = useState("en");
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "1088566305715-oha7333rv5ggslaml48ibmlnak9llpkj.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // console.error("SignOut error", e);
      }
      const userInfo = await GoogleSignin.signIn();
      console.log("Google Login Success:", userInfo);
      setUserInfo(userInfo);
      if (userInfo.data?.idToken) {
        // Alert.alert("Google Login Success", `Token: ${userInfo.data.idToken.substring(0, 20)}...`);

        try {
          const res = await loginApi(
            {
              url: "/auth/google",
              body: {
                token: userInfo.data.idToken,
                name: userInfo.data.user.name || userInfo.data.user.givenName || "User",
                deviceId: 212345,
                deviceName: "Redmi note 10 pro max", // You might want to get this dynamically later
                lastActiveAt: null,
                isSyncing: false,
                status: "online",
              },
            },
            () => { } // Loading state handled globally or ignored for now in this scope
          );

          console.log("Google API Response:", res);

          if (res?.success) {
            // Check if response has token and save it if needed, or navigate
            setSession(res)
            navigation.navigate("Bottomtabs")
            // Alert.alert("Login API Success", "Logged in with Google!");
          } else {
            Alert.alert("Login API Failed", res?.message || "Unknown error");
          }
        } catch (apiError) {
          console.error("Google API Call Error:", apiError);
          Alert.alert("Error", "Failed to call backend API");
        }
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            console.log("User cancelled login");
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            console.log("Sign in in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            console.log("Play services not available");
            Alert.alert("Error", "Google Play Services not available");
            break;
          default:
            // some other error happened
            console.log("Google Login Error:", error);
            Alert.alert("Error", error.message);
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log("Google Login General Error:", error);
        Alert.alert("Error", "An error occurred during Google Sign-In");
      }
    }
  };

  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(hp(40))).current;

  // Swiper animation
  const swiperAnim = useRef(new Animated.Value(hp(100))).current;
  const [swiperVisible, setSwiperVisible] = useState(false);

  // Permission Modal
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  // Checkbox for email
  const [emailSelected, setEmailSelected] = useState(false);
  const [numberToCheck, setNumberToCheck] = useState("");
  const [speechModalVisible, setSpeechModalVisible] = useState(false);
  const [speechListening, setSpeechListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [speechError, setSpeechError] = useState("");

  // Truecaller Hook
  const {
    initializeTruecallerSDK,
    openTruecallerForVerification,
    userProfile,
    error: truecallerError,
  } = useTruecaller({
    androidClientId: 'lgkmllphjqoeconxfydfrawx-bxjeleqxn1mzfcp2og',
    iosAppKey: 'YOUR_IOS_APP_KEY',
    iosAppLink: 'YOUR_IOS_APP_LINK',
    androidSuccessHandler: (profile) => {
      console.log("Truecaller Auto-Login Success (Handler):", profile);
      // Handle profile data here - use phone_number as per API type
      const phoneNum = (profile as any)?.phoneNumber || (profile as any)?.phone_number;
      if (phoneNum) {
        let phone = phoneNum;
        if (phone.startsWith("+91")) {
          phone = phone.replace("+91", "");
        } else if (phone.startsWith("91") && phone.length === 12) {
          phone = phone.substring(2);
        }
        setNumberToCheck(phone);
      }
    }
  });

  // Track SDK initialization state
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);

  const speechLocale =
    selectedLang === "hi" ? "hi-IN" : selectedLang === "te" ? "te-IN" : "en-US";

  const normalizePhoneInput = (rawText: string) => {
    const wordToDigit: Record<string, string> = {
      zero: "0",
      one: "1",
      two: "2",
      three: "3",
      four: "4",
      five: "5",
      six: "6",
      seven: "7",
      eight: "8",
      nine: "9",
    };

    const tokens = rawText
      .toLowerCase()
      .replace(/-/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    let digits = "";
    for (const token of tokens) {
      if (wordToDigit[token]) {
        digits += wordToDigit[token];
        continue;
      }
      const fromNumbers = token.replace(/\D/g, "");
      if (fromNumbers) digits += fromNumbers;
    }

    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      if (/^[6-9]\d{9}$/.test(last10)) return last10;
      return last10;
    }
    return digits;
  };

  const stopListening = async () => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch (e) {
      console.log("SpeechRecognition stop error:", e);
    } finally {
      setSpeechListening(false);
    }
  };

  const closeSpeechModal = async () => {
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch (e) {
      console.log("SpeechRecognition abort error:", e);
    } finally {
      setSpeechListening(false);
    }
    setSpeechModalVisible(false);
    setSpeechError("");
  };

  const handleMicPress = async () => {
    if (speechListening) {
      await stopListening();
      return;
    }
    await startListening();
  };

  const startListening = async () => {
    try {
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        setSpeechError("Speech recognition is not available on this device.");
        setSpeechModalVisible(true);
        setSpeechListening(false);
        return;
      }
    } catch (e) {
      console.log("SpeechRecognition availability error:", e);
    }

    try {
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission?.granted) {
        setSpeechError("Microphone permission denied.");
        setSpeechModalVisible(true);
        return;
      }
    } catch (e: any) {
      setSpeechError(e?.message || "Failed to request permissions.");
      setSpeechModalVisible(true);
      return;
    }

    setSpeechError("");
    setSpeechText("");
    setSpeechModalVisible(true);
    setSpeechListening(true);

    try {
      ExpoSpeechRecognitionModule.start({
        lang: speechLocale,
        interimResults: true,
        maxAlternatives: 1,
        contextualStrings: [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "zero",
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
          "eight",
          "nine",
          "+91",
        ],
      });
    } catch (e: any) {
      setSpeechListening(false);
      setSpeechError(e?.message || "Failed to start listening.");
    }
  };

  useSpeechRecognitionEvent("start", () => {
    setSpeechListening(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setSpeechListening(false);
  });

  useSpeechRecognitionEvent("error", (event) => {
    setSpeechListening(false);
    setSpeechError(event?.message || "Speech recognition error.");
  });

  useSpeechRecognitionEvent("result", (event) => {
    const text = event?.results?.[0]?.transcript || "";
    setSpeechText(text);
    const normalized = normalizePhoneInput(text);
    if (normalized?.length > 0) {
      setNumberToCheck(normalized.slice(-10));
    }

    if (normalized?.length >= 10) {
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch (e) {
        console.log("SpeechRecognition stop error:", e);
      }
      setSpeechModalVisible(false);
      return;
    }

    if (event?.isFinal) {
      setSpeechListening(false);
      setSpeechError("Could not detect a 10-digit number. Please try again.");
    }
  });

  // Effect to sync userProfile to state
  useEffect(() => {
    if (userProfile) {
      console.log("Truecaller Profile Received:", userProfile);
      // Handle both possible property names from the API
      const phoneNum = (userProfile as any)?.phoneNumber || (userProfile as any)?.phone_number;
      if (phoneNum) {
        let phone = phoneNum;
        if (phone.startsWith("+91")) {
          phone = phone.replace("+91", "");
        } else if (phone.startsWith("91") && phone.length === 12) {
          phone = phone.substring(2);
        }
        setNumberToCheck(phone);
        Alert.alert("Truecaller Success", "Phone number verified: " + phone);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    // Only show error if SDK was initialized - ignore pre-init errors
    if (truecallerError && isSdkInitialized) {
      console.log("Truecaller Error State:", truecallerError);
      const errorMessage = typeof truecallerError === 'string' ? truecallerError : (truecallerError as any)?.message || "Unknown error";
      // Don't show alert for common non-critical errors
      if (!errorMessage.includes("not initialized")) {
        Alert.alert("Truecaller Error", errorMessage);
      }
    }
  }, [truecallerError, isSdkInitialized]);

  // Initialize/Auto-Start Truecaller
  useEffect(() => {
    const startTruecaller = async () => {
      if (Platform.OS !== 'android') return;

      try {
        console.log("Initializing Truecaller SDK...");
        const initResult = await initializeTruecallerSDK();
        console.log("Truecaller SDK Initialized:", initResult);
        setIsSdkInitialized(true);
        // Don't auto-open verification - let user tap retry if needed
      } catch (e: any) {
        console.log("Truecaller Init Error:", e);
        setIsSdkInitialized(false);
      }
    };

    startTruecaller();
  }, []);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: -hp("6%"),
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim, {
          toValue: -hp("10%"),
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });



    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);
  //    useEffect(()=>{
  // console.log(getSession(), 'session')
  //     },[])
  const openLangModal = () => {
    setTempLang(selectedLang);
    setLangModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeLangModal = () => {
    Animated.timing(slideAnim, {
      toValue: hp(40),
      duration: 300,
      useNativeDriver: true,
    }).start(() => setLangModalVisible(false));
  };

  const confirmLangSelection = () => {
    setSelectedLang(tempLang);
    closeLangModal();
  };

  // Open swiper automatically on load
  useEffect(() => {
    setSwiperVisible(false);
    Animated.timing(swiperAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const closeSwiper = () => {
    Animated.timing(swiperAnim, {
      toValue: hp(100),
      duration: 400,
      useNativeDriver: true,
    }).start(() => setSwiperVisible(false));
  };

  const handleContinuePress = () => {
    closeSwiper();
    setNumberToCheck(phoneNumber);
    setTimeout(() => {
      setPermissionModalVisible(true);
    }, 300);
  };

  // const handleLogin = async () => {
  //     const res = await PostApi(
  //       {
  //         url: "/auth/login-with-password",
  //         body: {
  //           email "",
  //           password,
  //           deviceId: 12345,
  //           token: "12345dummyoktne",
  //           deviceName: "Redmi note 9 pro max",
  //           lastActiveAt: null,
  //           isSyncing: false,
  //           status: "online",
  //         },
  //       },
  //       setLoading
  //     );

  //     console.log("Login Response:", res);

  //     if (res?.success) {
  //       // ✅ Login success
  //       console.log("Logged in!");
  //       // e.g., navigation.navigate("Home");
  //     } else {
  //       // ❌ Show error
  //       console.log("Login failed:", res?.message || "Something went wrong");
  //     }
  //   };

  // export default function SimNumberScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const getPhoneNumber = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const simInfo = SimData.getSimInfo();
        const number =
          simInfo.phoneNumber0 || simInfo.phoneNumber1 || "Not available";
        console.log(number);
        setPhoneNumber(number);
      } else {
        setPhoneNumber("Permission denied");
      }
    } else {
      setPhoneNumber("Not supported on iOS");
    }
  };

  useEffect(() => {
    getPhoneNumber();
    // request();
  }, []);

  const request = async () => {
    const res = await Location.getCurrentPositionAsync({});
    console.log(res, 'res=================')

  };

  //   return (
  //     <View style={{ padding: 20 }}>
  //       <Text>Phone Number: {phoneNumber}</Text>
  //       <Button title="Retry" onPress={getPhoneNumber} />
  //     </View>
  //   );
  // }

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/; // ✅ Indian mobile format
    return phoneRegex.test(phone);
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //  let numberToCheck = '6305301918'; // Replace with actual number input
  console.log("___numberToCheck", numberToCheck);
  const otpLoginApi = async () => {
    setError(""); // reset
    // ✅ Step 1: Empty check
    if (!numberToCheck) {
      setError("Please enter your mobile number.");
      setTimeout(() => {
        setError(""); // reset
      }, 3000);
      // Alert.alert("Error", "Please enter your mobile number.");
      return;
    }

    // ✅ Step 2: Format check
    if (!validatePhoneNumber(numberToCheck)) {
      setError("Enter a valid 10-digit number.");
      setTimeout(() => {
        setError(""); // reset
      }, 3000);
      // Alert.alert("Invalid Number", "Please enter a valid 10-digit mobile number.");
      return;
    }

    const res = await loginApi(
      {
        url: "/auth/login-with-otp",
        body: {
          //   identifier: "activedeveloper18@gmail.com",
          identifier: `+91${numberToCheck}`,
          deviceId: 212345,
          token: "12345dummytoken",
          deviceName: "Redmi note 10 pro max",
          lastActiveAt: null,
          isSyncing: false,
          status: "online",
          role: 'user'
        },
      },
      setLoading
    );

    console.log("OTP Login Response:", res);

    if (res?.success) {
      // ✅ OTP sent successfully
      navigation.navigate("OTP", { phone: numberToCheck });
      //   Alert.alert("Success", "OTP sent successfully!");
      console.log("OTP sent successfully!");
      // e.g. navigate to OTP verify screen
    } else {
      // ❌ error case
      Alert.alert(res?.message || "Something went wrong")
      console.log("OTP Login failed:", res?.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="black" />

      <TouchableWithoutFeedback onPress={closeSwiper}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {/* Top blue area */}
          <View style={styles.topArea}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: wp("100%"),
              }}
            >
              <TouchableOpacity
                style={[styles.langButton, { left: wp("4%"), right: "auto" }]}
                activeOpacity={0.8}
                onPress={openLangModal}
              >
                <MaterialIcons name="language" size={18} color="#fff" />
                <Text style={styles.langText}>
                  {LANGUAGES.find((l) => l.id === selectedLang)?.label}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.langButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Home")}
              >
                {/* <MaterialIcons name="language" size={18} color="#fff" /> */}
                <Text style={[styles.langText, { paddingHorizontal: 10 }]}>
                  Skip
                </Text>
                {/* <MaterialIcons name="arrow-drop-down" size={18} color="#fff" /> */}
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.logoWrapper,
                { transform: [{ translateY: logoAnim }] },
              ]}
            >
              <Image
                source={logoImg}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Bottom fixed card */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateY: cardAnim }],
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              },
            ]}
          >
            <Text style={styles.heading}>
              One app for Rides, Groceries, Restaurants, Medicines, Services,
              Poojas & more
            </Text>

            <View style={styles.phoneRow}>
              <View style={styles.countryBox}>
                <Image
                  source={indiaFlag}
                  style={styles.flag}
                  resizeMode="contain"
                />
                <Text style={styles.countryCode}>+91</Text>
              </View>
              {/* <View style={styles.inputContainer}>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter Your Mobile Number"
                  placeholderTextColor="#8b8b8b"
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                  value={numberToCheck}
                  onChangeText={setNumberToCheck}
                />
                {numberToCheck.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setNumberToCheck("")}
                  >
                    <Ionicons name="close-circle" size={20} color="#000000" />
                  </TouchableOpacity>
                )}
              </View> */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter Your Mobile Number"
                  placeholderTextColor="#8b8b8b"
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                  value={numberToCheck}
                  onChangeText={setNumberToCheck}
                />
                <TouchableOpacity
                  style={styles.micButton}
                  onPress={() => handleMicPress()}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={speechListening ? "mic" : "mic-outline"}
                    size={18}
                    color="#000000"
                  />
                </TouchableOpacity>
                {numberToCheck.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setNumberToCheck("")}
                  >
                    <Ionicons name="close-circle" size={20} color="#000000" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {error ? (
              <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.otpButton,
                numberToCheck.length > 9 && { backgroundColor: "#6C63FF" },
              ]}
              activeOpacity={0.8}
              // onPress={() => navigation.navigate("OTP")}
              onPress={() => otpLoginApi()}
            >
              <Text style={styles.otpButtonText}>Get OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                console.log("Manual Truecaller Retry - SDK Initialized:", isSdkInitialized);
                try {
                  // Always try to initialize first
                  if (!isSdkInitialized) {
                    console.log("SDK not initialized, initializing now...");
                    await initializeTruecallerSDK();
                    setIsSdkInitialized(true);
                    console.log("SDK initialized successfully");
                  }
                  // Now try to open verification
                  await openTruecallerForVerification();
                  console.log("Truecaller verification opened");
                } catch (e: any) {
                  console.log("Manual retry error:", e);
                  Alert.alert("Truecaller Error", e?.message || "Could not open Truecaller. Make sure Truecaller app is installed.");
                }
              }}
              style={{ marginTop: 10, alignSelf: 'center' }}
            >
              <Text style={{ color: '#0087FF', fontSize: 12 }}>Login with Truecaller</Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.8}
              onPress={signInWithGoogle}
            >
              <Image
                source={googleLogo}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            <Text style={styles.smallText}>
              I accept all the <Text style={styles.linkText}>Terms</Text> and{" "}
              <Text style={styles.linkText}>Privacy policy</Text>
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Swiper Panel with Overlay */}
      {swiperVisible && (
        <View style={styles.swiperOverlay}>
          <Pressable style={styles.overlayTouchable} onPress={closeSwiper} />
          <Animated.View
            style={[
              styles.swiperPanel,
              { transform: [{ translateY: swiperAnim }] },
            ]}
          >
            <View style={styles.swiperRow}>
              <Image
                source={logoImg}
                style={styles.swiperImage}
                resizeMode="contain"
              />
              <View style={styles.swiperTextBox}>
                <Text style={styles.swiperTitle}>Login to Addvey</Text>
                <Text style={styles.swiperSubtitle}>Nanda Kumar</Text>
                <Text style={styles.swiperExtra}>92663838362</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.swiperButton}
              activeOpacity={0.8}
              onPress={handleContinuePress}
            >
              <Text style={styles.swiperButtonText}>
                Continue with {phoneNumber}
              </Text>
            </TouchableOpacity>

            <Text style={styles.swiperSmallText}>USE ANOTHER METHOD</Text>
            <View style={styles.lineSwiper} />

            {/* ✅ Fixed swiperDesc inline links */}
            <Text style={styles.swiperDesc}>
              By continuing you consent to share your{" "}
              <Text style={styles.linkText}>Profile information</Text> with
              Addvey, and agree to the{" "}
              <Text style={styles.linkText}>Terms</Text> and{" "}
              <Text style={styles.linkText}>Privacy policy</Text> of Addvey
            </Text>
          </Animated.View>
        </View>
      )}

      <Modal visible={speechModalVisible} transparent animationType="fade">
        <View style={styles.speechOverlay}>
          <View style={styles.speechCard}>
            <TouchableOpacity
              style={styles.speechClose}
              onPress={() => closeSpeechModal()}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={24} color="#E53935" />
            </TouchableOpacity>

            <View style={styles.speechTextArea}>
              <Text style={styles.speechTitle}>Speak now</Text>
              <Text style={styles.speechSubTitle}>
                {speechText ? speechText : 'Try saying "9876543210"'}
              </Text>
              {!!speechError && (
                <Text style={styles.speechError}>{speechError}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.speechMicButton,
                speechListening && styles.speechMicButtonActive,
              ]}
              onPress={() => (speechListening ? stopListening() : startListening())}
              activeOpacity={0.85}
            >
              <Ionicons name="mic" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Permission Modal */}
      <Modal visible={permissionModalVisible} transparent animationType="slide">
        <View style={styles.permissionOverlay}>
          <View style={styles.permissionCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Top header row */}
              <View style={styles.permissionHeader}>
                <Image
                  source={logoImg}
                  style={{ width: wp(14), height: wp(14), marginRight: wp(3) }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontWeight: "600",
                      color: "#111",
                      fontFamily: "Poppins-Medium",
                    }}
                  >
                    Addvey
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: hp(0.3),
                    }}
                  >
                    <Feather name="mail" size={12} color="gray" />
                    <Text
                      style={{
                        fontSize: hp(1.2),
                        color: "gray",
                        marginLeft: wp(1),
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      support@addvey.com
                    </Text>
                  </View>
                </View>
              </View>

              <Text
                style={{
                  fontSize: hp(1.5),
                  color: "#444",
                  marginVertical: hp(2),
                }}
              >
                Only the following permissions will be shared with Addvey:
              </Text>

              <View style={styles.permissionBoxRow}>
                <View>
                  <Text style={styles.permissionText}>Read Mobile Number</Text>
                  <Text style={styles.permissionSub}>+919392322767</Text>
                </View>
                <Text style={styles.required}>Required</Text>
              </View>

              <View style={styles.permissionBoxRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permissionText}>
                    Read profile information
                  </Text>
                  <Text style={styles.permissionSub}>
                    Name, avatar image, date of birth and gender (if present)
                  </Text>
                </View>
                <Text style={styles.required}>Required</Text>
              </View>

              <TouchableOpacity
                style={styles.permissionBoxRow}
                onPress={() => setEmailSelected(!emailSelected)}
              >
                <View>
                  <Text style={styles.permissionText}>Read email id</Text>
                  <Text style={styles.permissionSub}>
                    Email id (if present)
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    emailSelected && styles.checkboxSelected,
                  ]}
                >
                  {emailSelected && (
                    <MaterialIcons name="check" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.permissionBoxRow}>
                <View>
                  <Text style={styles.permissionText}>Stay Logged In</Text>
                  <Text style={styles.permissionSub}>
                    Remember your identity
                  </Text>
                </View>
                <Text style={styles.required}>Required</Text>
              </View>

              <TouchableOpacity
                style={styles.permissionBtn}
                onPress={() => setPermissionModalVisible(false)}
              >
                <Text style={styles.permissionBtnText}>Ok</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.modalCloseOutside}
            onPress={closeLangModal}
          >
            <MaterialIcons name="close" size={18} color="black" />
          </TouchableOpacity>
          <Pressable style={styles.overlay} onPress={closeLangModal} />
          <Animated.View
            style={[
              styles.langPanel,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.langHeading}>Choose App Language</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.langRow}
                  onPress={() => setTempLang(item.id)}
                >
                  <Text style={styles.langLabel}>
                    {item.label} ({item.native})
                  </Text>
                  <View
                    style={[
                      styles.radioOuter,
                      tempLang === item.id && {
                        borderColor: "#6C63FF",
                        borderWidth: 3,
                      },
                    ]}
                  />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.selectButton}
              activeOpacity={0.8}
              onPress={confirmLangSelection}
            >
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "black" },
  topArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: hp("3%"),
  },
  langButton: {
    position: "absolute",
    top: hp(4),
    right: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
    // paddingVertical: hp("0.6%"),
    borderRadius: wp("6%"),
    borderWidth: 1,
    borderColor: "white",
    height: 30,
  },
  langText: {
    color: "#fff",
    fontSize: hp("1.6%"),
    fontWeight: "bold",
    marginLeft: wp("1%"),
  },
  logoWrapper: {
    marginTop: hp(15),
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: wp(30), height: wp(40) },

  inputContainer: {
    position: "relative",
    width: "72%",
    // justifyContent:'center'
  },
  card: {
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: wp("6%"),
    borderTopRightRadius: wp("6%"),
    paddingVertical: hp("4%"),
    paddingHorizontal: wp("4%"),
    height: hp(52),
  },
  heading: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: hp(2),
    color: "#111",
    marginBottom: hp("3.2%"),
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.5%"),
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e6e6e6",
    borderWidth: 1,
    borderRadius: wp(4),
    paddingHorizontal: wp("3%"),
    marginRight: wp("2%"),
    backgroundColor: "white",
  },
  flag: { width: wp(7), height: hp(5), marginRight: wp("2%") },
  countryCode: { fontSize: hp("1.9%"), fontWeight: "600", color: "#333" },
  //  inputContainer: {
  //     flex: 1, // Take remaining space
  //     position: 'relative',
  //     justifyContent: 'center', // Center vertically
  //   },

  // Update phone input to work with clear button
  phoneInput: {
    borderColor: "#e6e6e6",
    borderWidth: 1,
    borderRadius: wp(4),
    paddingHorizontal: wp("4%"),
    paddingRight: wp("18%"),
    fontSize: hp(1.7),
    height: hp("5.3%"),
    color: "#111",
    backgroundColor: "white",
  },

  micButton: {
    position: "absolute",
    right: wp("10%"),
    height: hp("5.3%"),
    width: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    position: "absolute",
    right: wp("3%"),
    height: hp("5.3%"), // Match input height
    width: wp("6%"), // Fixed width for better touch area
    justifyContent: "center",
    alignItems: "center",
    // Remove top: 0, bottom: 0 as we're using justifyContent: 'center'
  },
  otpButton: {
    marginTop: hp(0.1),
    backgroundColor: "#C9B9FF",
    paddingVertical: hp(1.5),
    borderRadius: wp(4),
    alignItems: "center",
  },
  otpButtonText: { fontSize: hp("1.9%"), fontWeight: "700", color: "#FFF" },

  speechOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  speechCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: wp("6%"),
    paddingVertical: hp("4%"),
    paddingHorizontal: wp("6%"),
    alignItems: "stretch",
  },
  speechClose: {
    position: "absolute",
    top: hp("2%"),
    right: wp("4%"),
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  speechTextArea: {
    paddingTop: hp("2%"),
    minHeight: hp("18%"),
  },
  speechTitle: {
    fontSize: hp("2.2%"),
    fontWeight: "700",
    color: "#111",
    marginTop: hp("1%"),
  },
  speechSubTitle: {
    marginTop: hp("1.2%"),
    fontSize: hp("3.0%"),
    color: "#111",
    textAlign: "left",
  },
  speechError: {
    marginTop: hp("1%"),
    fontSize: hp("1.4%"),
    color: "red",
    textAlign: "left",
  },
  speechMicButton: {
    marginTop: hp("4%"),
    alignSelf: "center",
    height: wp("18%"),
    width: wp("18%"),
    borderRadius: wp("9%"),
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  speechMicButtonActive: {
    backgroundColor: "#4E46E5",
  },

  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2%"),
  },
  line: { flex: 1, height: 1, backgroundColor: "#EDEBEB" },
  orText: { marginHorizontal: wp("3%"), color: "#888", fontSize: hp("1.6%") },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp(4),
    paddingVertical: hp("1.8%"),
    marginBottom: hp("2%"),
    backgroundColor: "white",
  },
  googleIcon: { width: wp("5%"), height: wp("5%") },
  googleText: {
    marginLeft: wp("1.7%"),
    fontSize: hp("1.6%"),
    fontWeight: "600",
    color: "#444",
  },
  smallText: {
    marginTop: hp("1%"),
    fontSize: hp("1.4%"),
    color: "#8b8b8b",
    textAlign: "center",
  },
  linkText: {
    color: "#1877F2",
    fontWeight: "600",
    fontSize: hp("1.4%"),
    textAlignVertical: "center",
  },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  langPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: wp(5),
    maxHeight: hp(45),
  },
  modalCloseOutside: {
    position: "absolute",
    bottom: hp(38),
    right: wp(2),
    zIndex: 20,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 8,
  },
  langHeading: {
    fontSize: hp(2.2),
    fontWeight: "bold",
    marginBottom: hp(2),
    textAlign: "center",
    marginTop: hp(2),
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
  },
  langLabel: { fontSize: hp(1.8), color: "#333" },
  radioOuter: {
    width: wp("4.5%"),
    height: wp("4.5%"),
    borderRadius: wp("3%"),
    borderWidth: 1,
    borderColor: "#0000005E",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: "#6C63FF", borderWidth: 2 },
  radioInner: {
    width: wp("2.5%"),
    height: wp("2.5%"),
    borderRadius: wp("1.5%"),
    backgroundColor: "#6C63FF",
  },
  selectButton: {
    marginTop: hp(2),
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.6),
    borderRadius: wp(3),
    alignItems: "center",
    marginBottom: hp(1),
  },
  selectButtonText: { color: "#fff", fontSize: hp(1.8), fontWeight: "600" },

  // Swiper
  swiperOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  overlayTouchable: { ...StyleSheet.absoluteFillObject },
  swiperPanel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(3),
    paddingVertical: hp(3),
    minHeight: hp(36),
  },
  swiperRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  swiperImage: { width: wp(16), height: wp(16), marginRight: wp(4) },
  swiperTextBox: { flex: 1 },
  swiperTitle: {
    fontSize: hp(1.8),
    fontFamily: "Poppins-Medium",
    color: "#111",
  },
  swiperSubtitle: { fontSize: hp(1.2), color: "gray", marginBottom: hp(0.5) },
  swiperExtra: { fontSize: hp(1.2), color: "#999" },

  swiperButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.8),
    borderRadius: wp(3),
    alignItems: "center",
    width: "100%",
    marginBottom: hp(1.5),
    marginTop: hp(1),
  },
  swiperButtonText: { color: "#fff", fontSize: hp(1.5), fontWeight: "600" },
  swiperSmallText: {
    fontSize: hp(1.2),
    color: "black",
    marginBottom: hp(1.5),
    textAlign: "center",
  },
  swiperDesc: { fontSize: hp(1.6), color: "#666", marginTop: hp(1.5) },
  lineSwiper: { height: 1, backgroundColor: "#ddd" },

  // Permission Modal
  permissionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionCard: {
    width: wp(90),
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(5),
    maxHeight: hp(80),
    borderWidth: 1,
    borderColor: "#ccc",
  },
  permissionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    paddingBottom: hp(1.5),
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    borderRadius: 10,
  },

  permissionBoxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
  },
  permissionText: {
    fontWeight: "600",
    fontSize: hp(1.7),
    color: "#00000085",
    lineHeight: hp(2.2),
  },
  permissionSub: {
    fontSize: hp(1.4),
    color: "black",
    marginTop: hp(0.5),
    lineHeight: hp(2),
  },
  required: { fontSize: hp(1.3), color: "#00000085", lineHeight: hp(2) },

  checkbox: {
    width: wp(5),
    height: wp(5),
    borderWidth: 1.5,
    borderColor: "#666",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },

  permissionBtn: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.6),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(3),
    width: wp(45),
    alignSelf: "center",
  },
  permissionBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.6),
    lineHeight: hp(2.2),
  },
});

// import React, { useEffect, useState, useRef } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     SafeAreaView,
//     Image,
//     TextInput,
//     TouchableOpacity,
//     Platform,
//     KeyboardAvoidingView,
//     Keyboard,
//     Modal,
//     Pressable,
//     FlatList,
//     Animated,
//     StatusBar,
//     TouchableWithoutFeedback,
//     ScrollView
// } from "react-native";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useNavigation } from "@react-navigation/native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Feather } from '@expo/vector-icons';

// const logoImg = require("../../assets/images/1.png");
// const indiaFlag = require("../../assets/images/ind.png");
// const googleLogo = require("../../assets/images/google.png");

// const LANGUAGES = [
//     { id: "en", label: "Eng", native: "English" },
//     { id: "hi", label: "Hind", native: "हिंदी" },
//     { id: "te", label: "Tel", native: "తెలుగు" },
// ];

// const LoginScreen: React.FC = () => {
//     const navigation = useNavigation<any>();
//     const [keyboardVisible, setKeyboardVisible] = useState(false);
//     const [langModalVisible, setLangModalVisible] = useState(false);
//     const [selectedLang, setSelectedLang] = useState("en");
//     const [tempLang, setTempLang] = useState("en");

//     const logoAnim = useRef(new Animated.Value(0)).current;
//     const cardAnim = useRef(new Animated.Value(0)).current;
//     const slideAnim = useRef(new Animated.Value(hp(40))).current;

//     // Swiper animation
//     const swiperAnim = useRef(new Animated.Value(hp(100))).current;
//     const [swiperVisible, setSwiperVisible] = useState(false);

//     // Permission Modal
//     const [permissionModalVisible, setPermissionModalVisible] = useState(false);

//     // Checkbox for email
//     const [emailSelected, setEmailSelected] = useState(false);

//     useEffect(() => {
//         const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
//             setKeyboardVisible(true);
//             Animated.parallel([
//                 Animated.timing(logoAnim, {
//                     toValue: -hp("6%"),
//                     duration: 300,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(cardAnim, {
//                     toValue: -hp("10%"),
//                     duration: 300,
//                     useNativeDriver: true,
//                 }),
//             ]).start();
//         });

//         const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
//             setKeyboardVisible(false);
//             Animated.parallel([
//                 Animated.timing(logoAnim, {
//                     toValue: 0,
//                     duration: 300,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(cardAnim, {
//                     toValue: 0,
//                     duration: 300,
//                     useNativeDriver: true,
//                 }),
//             ]).start();
//         });

//         return () => {
//             keyboardDidShow.remove();
//             keyboardDidHide.remove();
//         };
//     }, []);

//     const openLangModal = () => {
//         setTempLang(selectedLang);
//         setLangModalVisible(true);
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 300,
//             useNativeDriver: true,
//         }).start();
//     };

//     const closeLangModal = () => {
//         Animated.timing(slideAnim, {
//             toValue: hp(40),
//             duration: 300,
//             useNativeDriver: true,
//         }).start(() => setLangModalVisible(false));
//     };

//     const confirmLangSelection = () => {
//         setSelectedLang(tempLang);
//         closeLangModal();
//     };

//     // Open swiper automatically on load
//     useEffect(() => {
//         setSwiperVisible(true);
//         Animated.timing(swiperAnim, {
//             toValue: 0,
//             duration: 400,
//             useNativeDriver: true,
//         }).start();
//     }, []);

//     const closeSwiper = () => {
//         Animated.timing(swiperAnim, {
//             toValue: hp(100),
//             duration: 400,
//             useNativeDriver: true,
//         }).start(() => setSwiperVisible(false));
//     };

//     const handleContinuePress = () => {
//         closeSwiper();
//         setTimeout(() => {
//             setPermissionModalVisible(true);
//         }, 300);
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <StatusBar barStyle="dark-content" backgroundColor="black" />

//             <TouchableWithoutFeedback onPress={closeSwiper}>
//                 <KeyboardAvoidingView
//                     style={{ flex: 1 }}
//                     behavior={Platform.OS === "ios" ? "padding" : undefined}
//                     keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//                 >
//                     {/* Top blue area */}
//                     <View style={styles.topArea}>
//                         <TouchableOpacity
//                             style={styles.langButton}
//                             activeOpacity={0.8}
//                             onPress={openLangModal}
//                         >
//                             <MaterialIcons name="language" size={18} color="#fff" />
//                             <Text style={styles.langText}>
//                                 {LANGUAGES.find((l) => l.id === selectedLang)?.label}
//                             </Text>
//                             <MaterialIcons name="arrow-drop-down" size={18} color="#fff" />
//                         </TouchableOpacity>

//                         <Animated.View
//                             style={[styles.logoWrapper, { transform: [{ translateY: logoAnim }] }]}
//                         >
//                             <Image source={logoImg} style={styles.logo} resizeMode="contain" />
//                         </Animated.View>
//                     </View>

//                     {/* Bottom fixed card */}
//                     <Animated.View
//                         style={[
//                             styles.card,
//                             { transform: [{ translateY: cardAnim }], position: "absolute", bottom: 0, left: 0, right: 0 },
//                         ]}
//                     >
//                         <Text style={styles.heading}>
//                             Partner Anna with Addvey: Rides, Restaurants, Stores, Services, Poojas & more
//                         </Text>

//                         <View style={styles.phoneRow}>
//                             <View style={styles.countryBox}>
//                                 <Image source={indiaFlag} style={styles.flag} resizeMode="contain" />
//                                 <Text style={styles.countryCode}>+91</Text>
//                             </View>

//                             <TextInput
//                                 style={styles.phoneInput}
//                                 placeholder="Enter Your Mobile Number"
//                                 placeholderTextColor="#8b8b8b"
//                                 keyboardType="phone-pad"
//                                 maxLength={15}
//                                 returnKeyType="done"
//                             />
//                         </View>

//                         <TouchableOpacity
//                             style={styles.otpButton}
//                             activeOpacity={0.8}
//                             onPress={() => navigation.navigate("OTP")}
//                         >
//                             <Text style={styles.otpButtonText}>Get OTP</Text>
//                         </TouchableOpacity>

//                         <View style={styles.separator}>
//                             <View style={styles.line} />
//                             <Text style={styles.orText}>or</Text>
//                             <View style={styles.line} />
//                         </View>

//                         <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
//                             <Image source={googleLogo} style={styles.googleIcon} resizeMode="contain" />
//                             <Text style={styles.googleText}>Continue with Google</Text>
//                         </TouchableOpacity>

//                         <Text style={styles.smallText}>
//                             I accept all the <Text style={styles.linkText}>Terms</Text> and{" "}
//                             <Text style={styles.linkText}>Privacy policy</Text>
//                         </Text>
//                     </Animated.View>
//                 </KeyboardAvoidingView>
//             </TouchableWithoutFeedback>

//             {/* Swiper Panel with Overlay */}
//             {swiperVisible && (
//                 <View style={styles.swiperOverlay}>
//                     <Pressable style={styles.overlayTouchable} onPress={closeSwiper} />
//                     <Animated.View style={[styles.swiperPanel, { transform: [{ translateY: swiperAnim }] }]}>
//                         <View style={styles.swiperRow}>
//                             <Image source={logoImg} style={styles.swiperImage} resizeMode="contain" />
//                             <View style={styles.swiperTextBox}>
//                                 <Text style={styles.swiperTitle}>Login to Addvey</Text>
//                                 <Text style={styles.swiperSubtitle}>Nanda Kumar</Text>
//                                 <Text style={styles.swiperExtra}>92663838362</Text>
//                             </View>
//                         </View>

//                         <TouchableOpacity style={styles.swiperButton} activeOpacity={0.8} onPress={handleContinuePress}>
//                             <Text style={styles.swiperButtonText}>Continue with 9392322767</Text>
//                         </TouchableOpacity>

//                         <Text style={styles.swiperSmallText}>USE ANOTHER METHOD</Text>
//                         <View style={styles.lineSwiper} />

//                         {/* ✅ Fixed swiperDesc inline links */}
//                         <Text style={styles.swiperDesc}>
//                             By continuing you consent to share your{" "}
//                             <Text style={styles.linkText}>Profile information</Text> with Addvey, and agree to the{" "}
//                             <Text style={styles.linkText}>Terms</Text> and{" "}
//                             <Text style={styles.linkText}>Privacy policy</Text> of Addvey
//                         </Text>
//                     </Animated.View>
//                 </View>
//             )}

//             {/* Permission Modal */}
//             <Modal visible={permissionModalVisible} transparent animationType="slide">
//                 <View style={styles.permissionOverlay}>
//                     <View style={styles.permissionCard}>
//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {/* Top header row */}
//                             <View style={styles.permissionHeader}>
//                                 <Image source={logoImg} style={{ width: wp(14), height: wp(14), marginRight: wp(3) }} />
//                                 <View style={{ flex: 1 }}>
//                                     <Text style={{ fontSize: hp(2), fontWeight: "600", color: "#111", fontFamily: 'Poppins-Medium' }}>Addvey</Text>
//                                     <View style={{ flexDirection: "row", alignItems: "center", marginTop: hp(0.3) }}>
//                                         <Feather name="mail" size={12} color="gray" />
//                                         <Text style={{ fontSize: hp(1.2), color: "gray", marginLeft: wp(1), fontFamily: 'Poppins-Regular' }}>support@addvey.com</Text>
//                                     </View>
//                                 </View>
//                             </View>

//                             <Text style={{ fontSize: hp(1.5), color: "#444", marginVertical: hp(2) }}>
//                                 Only the following permissions will be shared with Addvey:
//                             </Text>

//                             <View style={styles.permissionBoxRow}>
//                                 <View>
//                                     <Text style={styles.permissionText}>Read Mobile Number</Text>
//                                     <Text style={styles.permissionSub}>+919392322767</Text>
//                                 </View>
//                                 <Text style={styles.required}>Required</Text>
//                             </View>

//                             <View style={styles.permissionBoxRow}>
//                                 <View style={{ flex: 1 }}>
//                                     <Text style={styles.permissionText}>Read profile information</Text>
//                                     <Text style={styles.permissionSub}>Name, avatar image, date of birth and gender (if present)</Text>
//                                 </View>
//                                 <Text style={styles.required}>Required</Text>
//                             </View>

//                             <TouchableOpacity style={styles.permissionBoxRow} onPress={() => setEmailSelected(!emailSelected)}>
//                                 <View>
//                                     <Text style={styles.permissionText}>Read email id</Text>
//                                     <Text style={styles.permissionSub}>Email id (if present)</Text>
//                                 </View>
//                                 <View style={[styles.checkbox, emailSelected && styles.checkboxSelected]}>
//                                     {emailSelected && <MaterialIcons name="check" size={16} color="white" />}
//                                 </View>
//                             </TouchableOpacity>

//                             <View style={styles.permissionBoxRow}>
//                                 <View>
//                                     <Text style={styles.permissionText}>Stay Logged In</Text>
//                                     <Text style={styles.permissionSub}>Remember your identity</Text>
//                                 </View>
//                                 <Text style={styles.required}>Required</Text>
//                             </View>

//                             <TouchableOpacity style={styles.permissionBtn} onPress={() => setPermissionModalVisible(false)}>
//                                 <Text style={styles.permissionBtnText}>Ok</Text>
//                             </TouchableOpacity>
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>

//             {/* Language Modal */}
//             <Modal visible={langModalVisible} transparent animationType="none" statusBarTranslucent>
//                 <View style={{ flex: 1 }}>
//                     <TouchableOpacity style={styles.modalCloseOutside} onPress={closeLangModal}>
//                         <MaterialIcons name="close" size={18} color="black" />
//                     </TouchableOpacity>
//                     <Pressable style={styles.overlay} onPress={closeLangModal} />
//                     <Animated.View style={[styles.langPanel, { transform: [{ translateY: slideAnim }] }]}>
//                         <Text style={styles.langHeading}>Choose App Language</Text>
//                         <FlatList
//                             data={LANGUAGES}
//                             keyExtractor={(item) => item.id}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity style={styles.langRow} onPress={() => setTempLang(item.id)}>
//                                     <Text style={styles.langLabel}>{item.label} ({item.native})</Text>
//                                     <View
//                                         style={[
//                                             styles.radioOuter,
//                                             tempLang === item.id && { borderColor: "#6C63FF", borderWidth: 3 },
//                                         ]}
//                                     />
//                                 </TouchableOpacity>
//                             )}
//                         />
//                         <TouchableOpacity style={styles.selectButton} activeOpacity={0.8} onPress={confirmLangSelection}>
//                             <Text style={styles.selectButtonText}>Select</Text>
//                         </TouchableOpacity>
//                     </Animated.View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: "black" },
//     topArea: { flex: 1, alignItems: "center", justifyContent: "flex-start", paddingTop: hp("3%") },
//     langButton: { position: "absolute", top: hp(6), right: wp("4%"), flexDirection: "row", alignItems: "center", paddingHorizontal: wp("2%"), paddingVertical: hp("0.6%"), borderRadius: wp("6%"), borderWidth: 1, borderColor: "white" },
//     langText: { color: "#fff", fontSize: hp("1.6%"), fontWeight: "bold", marginLeft: wp("1%") },
//     logoWrapper: { marginTop: hp(15), justifyContent: "center", alignItems: "center" },
//     logo: { width: wp(30), height: wp(40) },

//     card: { backgroundColor: "#FAFAFA", borderTopLeftRadius: wp("6%"), borderTopRightRadius: wp("6%"), paddingVertical: hp("4%"), paddingHorizontal: wp("4%"), height: hp(52) },
//     heading: { textAlign: "center", fontWeight: "bold", fontSize: hp(2), color: "#111", marginBottom: hp("3.2%") },

//     phoneRow: { flexDirection: "row", alignItems: "center", marginBottom: hp("2.5%") },
//     countryBox: { flexDirection: "row", alignItems: "center", borderColor: "#e6e6e6", borderWidth: 1, borderRadius: wp(4), paddingHorizontal: wp("3%"), marginRight: wp("2%"), backgroundColor: "white" },
//     flag: { width: wp(7), height: hp(5), marginRight: wp("2%") },
//     countryCode: { fontSize: hp("1.9%"), fontWeight: "600", color: "#333" },
//     phoneInput: { flex: 1, borderColor: "#e6e6e6", borderWidth: 1, borderRadius: wp(4), paddingHorizontal: wp("4%"), fontSize: hp(1.7), height: hp("5.3%"), color: "#111", backgroundColor: "white" },

//     otpButton: { marginTop: hp(0.1), backgroundColor: "#C9B9FF", paddingVertical: hp(1.5), borderRadius: wp(4), alignItems: "center" },
//     otpButtonText: { fontSize: hp("1.9%"), fontWeight: "700", color: "#FFF" },

//     separator: { flexDirection: "row", alignItems: "center", marginVertical: hp("2%") },
//     line: { flex: 1, height: 1, backgroundColor: "#EDEBEB" },
//     orText: { marginHorizontal: wp("3%"), color: "#888", fontSize: hp("1.6%") },

//     googleButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: wp(4), paddingVertical: hp("1.8%"), marginBottom: hp("2%"), backgroundColor: "white" },
//     googleIcon: { width: wp("5%"), height: wp("5%") },
//     googleText: { marginLeft: wp("1.7%"), fontSize: hp("1.6%"), fontWeight: "600", color: "#444" },
//     smallText: { marginTop: hp("1%"), fontSize: hp("1.4%"), color: "#8b8b8b", textAlign: "center" },
//     linkText: { color: "#1877F2", fontWeight: "600", fontSize: hp("1.4%"), textAlignVertical: "center" },

//     overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
//     langPanel: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: wp(6), borderTopRightRadius: wp(6), padding: wp(5), maxHeight: hp(45) },
//     modalCloseOutside: { position: "absolute", bottom: hp(38), right: wp(2), zIndex: 20, backgroundColor: 'white', borderRadius: 50, padding: 8 },
//     langHeading: { fontSize: hp(2.2), fontWeight: "bold", marginBottom: hp(2), textAlign: "center", marginTop: hp(2) },
//     langRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: hp(1.5) },
//     langLabel: { fontSize: hp(1.8), color: "#333" },
//     radioOuter: { width: wp("4.5%"), height: wp("4.5%"), borderRadius: wp("3%"), borderWidth: 1, borderColor: "#0000005E", alignItems: "center", justifyContent: "center" },
//     radioSelected: { borderColor: "#6C63FF", borderWidth: 2 },
//     radioInner: { width: wp("2.5%"), height: wp("2.5%"), borderRadius: wp("1.5%"), backgroundColor: "#6C63FF" },
//     selectButton: { marginTop: hp(2), backgroundColor: "#6C63FF", paddingVertical: hp(1.6), borderRadius: wp(3), alignItems: "center", marginBottom: hp(1) },
//     selectButtonText: { color: "#fff", fontSize: hp(1.8), fontWeight: "600" },

//     // Swiper
//     swiperOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
//     overlayTouchable: { ...StyleSheet.absoluteFillObject },
//     swiperPanel: { backgroundColor: "#fff", borderTopLeftRadius: wp(6), borderTopRightRadius: wp(6), paddingHorizontal: wp(3), paddingVertical: hp(3), minHeight: hp(36) },
//     swiperRow: { flexDirection: "row", alignItems: "center", marginBottom: hp(2) },
//     swiperImage: { width: wp(16), height: wp(16), marginRight: wp(4) },
//     swiperTextBox: { flex: 1 },
//     swiperTitle: { fontSize: hp(1.8), fontFamily: 'Poppins-Medium', color: "#111" },
//     swiperSubtitle: { fontSize: hp(1.2), color: "gray", marginBottom: hp(0.5) },
//     swiperExtra: { fontSize: hp(1.2), color: "#999" },

//     swiperButton: { backgroundColor: "#6C63FF", paddingVertical: hp(1.8), borderRadius: wp(3), alignItems: "center", width: "100%", marginBottom: hp(1.5), marginTop: hp(1) },
//     swiperButtonText: { color: "#fff", fontSize: hp(1.5), fontWeight: "600", },
//     swiperSmallText: { fontSize: hp(1.2), color: "black", marginBottom: hp(1.5), textAlign: "center" },
//     swiperDesc: { fontSize: hp(1.6), color: "#666", marginTop: hp(1.5) },
//     lineSwiper: { height: 1, backgroundColor: '#ddd', },

//     // Permission Modal
//     permissionOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
//     permissionCard: { width: wp(90), backgroundColor: "#fff", borderRadius: wp(5), padding: wp(5), maxHeight: hp(80), borderWidth: 1, borderColor: "#ccc" },
//     permissionHeader: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#eee", paddingBottom: hp(1.5), paddingHorizontal: wp(2), paddingVertical: hp(2), borderRadius: 10 },

//     permissionBoxRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: hp(1.5), paddingHorizontal: wp(3) },
//     permissionText: { fontWeight: "600", fontSize: hp(1.7), color: "#00000085", lineHeight: hp(2.2) },
//     permissionSub: { fontSize: hp(1.4), color: "black", marginTop: hp(0.5), lineHeight: hp(2) },
//     required: { fontSize: hp(1.3), color: "#00000085", lineHeight: hp(2) },

//     checkbox: { width: wp(5), height: wp(5), borderWidth: 1.5, borderColor: "#666", borderRadius: 4, alignItems: "center", justifyContent: "center" },
//     checkboxSelected: { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },

//     permissionBtn: { backgroundColor: "#6C63FF", paddingVertical: hp(1.6), borderRadius: wp(3), alignItems: "center", justifyContent: 'center', marginTop: hp(3), width: wp(45), alignSelf: "center" },
//     permissionBtnText: { color: "#fff", fontWeight: "600", fontSize: hp(1.6), lineHeight: hp(2.2) }
// });
