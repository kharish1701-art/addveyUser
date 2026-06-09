import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AddCardPreview from "../MainHome/AddCardPreview";
import { useNavigation } from "@react-navigation/native";

interface IntroScreen {
  visible: boolean;
  onClose: () => void;
}

const IntroScreen: React.FC<IntroScreen> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(100), 0],
  });

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={22} color="#000" />
        </TouchableOpacity>

        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.introText}>Introducing</Text>
              <Text style={styles.titleText}>Addvey Maps</Text>
            </View>

            <View style={styles.qrBox}>
              <Image
                source={require("../../../assets/images/intro.png")}
                style={{
                  width: wp(20),
                  height: wp(20),
                  resizeMode: "contain",
                }}
              />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>What is Addvey Maps?</Text>
            <Text style={styles.description}>
              Addvey Maps help you discover listings and services near you. With
              real-time location-based search, you can:
            </Text>

            <View style={styles.pointRow}>
              <Entypo
                name="dot-single"
                size={14}
                color="#000"
                style={styles.pointIcon}
              />
              <Text style={styles.pointText}>
                Find products and services nearby
              </Text>
            </View>

            <View style={styles.pointRow}>
              <Entypo
                name="dot-single"
                size={14}
                color="#000"
                style={styles.pointIcon}
              />
              <Text style={styles.pointText}>
                Filter by category, price, and distance
              </Text>
            </View>

            <View style={styles.pointRow}>
              <Entypo
                name="dot-single"
                size={14}
                color="#000"
                style={styles.pointIcon}
              />
              <Text style={styles.pointText}>
                Get directions directly through the app
              </Text>
            </View>

            <Text style={styles.sectionTitle}>How Addvey Maps Works</Text>

            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>
                • Enable Location – Allow location access to use the map.
              </Text>
              <Text style={styles.bulletPoint}>
                • Browse Listings – View available products and services on the
                map.
              </Text>
              <Text style={styles.bulletPoint}>
                • Filter Results – Narrow down by category, price, and distance.
              </Text>
              <Text style={styles.bulletPoint}>
                • Tap to Connect – Tap on a pin to view more details and contact
                the seller.
              </Text>
            </View>

            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>Example Listing</Text>
              <View style={styles.exampleLine} />
            </View>

            <AddCardPreview />
          </ScrollView>

          <View style={styles.bottomSection}>
            <View style={styles.bottomContent}>
              <Text style={styles.bottomTitle}>Quick, Easy, and Smart!</Text>
              <Text style={styles.bottomSubtitle}>
                Explore your neighborhood with Addvey QR.
              </Text>

              <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => navigation.navigate("QrCodeScanner")}
              >
                <Text style={styles.bottomButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  closeButton: {
    position: "absolute",
    top: hp(3.8),
    right: wp(3),
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(2),
    elevation: 3,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
    height: hp(83),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  headerTextContainer: {
    flex: 1,
    marginRight: wp(3),
  },
  introText: {
    fontSize: wp(6),
    color: "#000",
    marginBottom: hp(0),
    fontFamily: "Poppins-Bold",
  },
  titleText: {
    fontSize: wp(6),
    color: "#000",
    fontFamily: "Poppins-Bold",
  },

  qrBox: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
    borderRadius: wp(3),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingBottom: hp(20),
  },
  description: {
    fontSize: wp(3.2),
    color: "#555555",
    lineHeight: hp(2.5),
    marginBottom: hp(2),
    fontFamily: "Poppins-Medium",
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(1),
  },
  pointIcon: {
    marginRight: wp(2),
    marginTop: hp(0.3),
  },
  pointText: {
    fontSize: wp(3),
    color: "#000",
    flex: 1,
  },
  sectionTitle: {
    fontSize: wp(4),
    marginTop: hp(3),
    marginBottom: hp(1),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  listContainer: {
    marginLeft: wp(2),
  },
  bulletPoint: {
    fontSize: wp(3.7),
    color: "#555",
    lineHeight: hp(2.3),
    marginBottom: hp(0.5),
    marginTop: hp(1),
  },
  exampleContainer: {
    alignItems: "center",
    marginTop: hp(3),
    marginBottom: hp(4),
  },
  exampleText: {
    color: "#6C63FF",
    fontSize: wp(5),
    fontFamily: "Boogaloo-Regular",
  },
  exampleLine: {
    width: wp(30),
    height: 2,
    backgroundColor: "#6C63FF",
    marginTop: hp(0.8),
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f9f9ff",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
  },
  bottomContent: {},
  bottomTitle: {
    fontSize: wp(3.2),
    color: "#6E533F",
    fontFamily: "Poppins-Medium",
  },
  bottomSubtitle: {
    fontSize: wp(3.2),
    color: "#6E533F",
    marginBottom: hp(2),
    fontFamily: "Poppins-Medium",
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(8),
    borderRadius: wp(5),
    elevation: 3,
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontFamily: "Poppins-Medium",
  },
});
