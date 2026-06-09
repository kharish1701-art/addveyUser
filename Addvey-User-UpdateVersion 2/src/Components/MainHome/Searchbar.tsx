import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Text,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";

const SearchBar: React.FC<any> = ({ onPress }) => {
  const {
    isListening,
    results,
    partialResults,
    startRecognizing,
    stopRecognizing,
    resetResults,
  } = useVoiceRecognition();
  const navigation = useNavigation<any>();
  const [voiceText, setVoiceText] = useState("");

  const handleOpenSearch = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate("BuySellSearch", {
        initialQuery: String(voiceText || "").trim(),
      });
    }
  };

  useEffect(() => {
    if (results && results.length > 0 && results[0]) {
      const finalText = String(results[0]);
      setVoiceText(finalText);
      if (!onPress) {
        navigation.navigate("BuySellSearch", { initialQuery: finalText });
      }
      resetResults();
    }
  }, [results]);

  useEffect(() => {
    if (partialResults && partialResults.length > 0 && partialResults[0]) {
      setVoiceText(String(partialResults[0]));
    }
  }, [partialResults]);

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopRecognizing();
    } else {
      setVoiceText("");
      resetResults();
      startRecognizing();
    }
  };
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const slideAnim = useState(new Animated.Value(0))[0];

  const placeholderTexts = [
    "Property",
    "Vehicle",
    "Electronics",
    "Furniture",
    "Fashion",
    "Services",
  ];

  useEffect(() => {
    if (!focused && !voiceText && !isListening) {
      const interval = setInterval(() => {
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 260,
          useNativeDriver: true,
        }).start(() => {
          setPlaceholderIndex((prev) =>
            prev === placeholderTexts.length - 1 ? 0 : prev + 1
          );
          slideAnim.setValue(20);
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }).start();
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [focused, voiceText, isListening]);

  const renderAnimatedPlaceholder = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.staticText}>Search nearby </Text>
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.categoryAnimatedText,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        "{placeholderTexts[placeholderIndex]}"
      </Animated.Text>
    </View>
  );

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          marginHorizontal: 10,
        }}
      >
        <View style={styles.searchBox}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleOpenSearch}
            style={styles.searchTapArea}
          >
            <Feather
              name="search"
              size={20}
              color="#aaa"
              style={styles.iconLeft}
            />

            <View style={styles.placeholderContainer}>
              {voiceText ? (
                <Text numberOfLines={1} style={styles.voicePreviewText}>
                  {voiceText}
                </Text>
              ) : isListening ? (
                <Text numberOfLines={1} style={styles.listeningText}>
                  Listening...
                </Text>
              ) : (
                renderAnimatedPlaceholder()
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.rightWrapper}>
            {/* Vertical line added */}
            <View style={styles.verticalLine} />
            <TouchableOpacity onPress={toggleVoiceSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Image
                source={require("../../../assets/images/mic.png")}
                style={styles.rightImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.qrWrapper}
          onPress={() => navigation.navigate("QRCodeScanner")}
        >
          <MaterialIcons name="qr-code-scanner" size={wp("7%")} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    height: hp(5.5),
    width: wp(83),
    borderColor: "#A8A8A8", // Darker border for visibility
    marginTop: 5,
    borderWidth: 1,
  },
  iconLeft: {
    marginRight: wp(2),
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    height: hp(2.2),
    overflow: "hidden",
  },
  searchTapArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  staticText: {
    color: "#aaa",
    fontSize: hp(1.6),
    fontWeight: "500",
  },
  categoryAnimatedText: {
    color: "#8d8b8bff",
    fontSize: hp(1.6),
    fontWeight: "bold",
  },
  voicePreviewText: {
    color: "#444",
    fontSize: hp(1.7),
    fontWeight: "500",
  },
  listeningText: {
    color: "#6C63FF",
    fontSize: hp(1.6),
    fontWeight: "600",
  },
  rightWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  verticalLine: {
    width: 1,
    height: hp(3),
    backgroundColor: "#0000004D",
    marginRight: wp(2),
    alignSelf: "center",
  },
  rightImage: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
  },
  qrWrapper: {
    marginLeft: wp(4),
  },
  qrImage: {
    width: wp(7),
    height: wp(7),
    resizeMode: "contain",
  },
});
