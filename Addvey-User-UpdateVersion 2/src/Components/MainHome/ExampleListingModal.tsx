import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import AddCardPreview from "./ExampleCard";

interface ExampleListingModalProps {
  visible: boolean;
  onClose: () => void;
}

const ExampleListingModal: React.FC<ExampleListingModalProps> = ({
  visible,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(100), 0],
  });

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={22} color="#000" />
        </TouchableOpacity>

        {/* SLIDE-UP CONTAINER */}
        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.introText}>Introducing</Text>
              <Text style={styles.titleText}>Addvey QR Codes</Text>
            </View>

            <View style={styles.qrBox}>
              <Ionicons name="qr-code-outline" size={wp(20)} color="#6C63FF" />
            </View>
          </View>

          {/* CONTENT SCROLL */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.description}>
              Addvey QR Codes make it easy for buyers to access listings
              instantly. When sellers post an ad, a unique QR code is generated.
              Buyers can scan the code using the Addvey app to:
            </Text>

            <View style={styles.pointRow}>
              <Ionicons
                name="search-outline"
                size={14}
                color="#000"
                style={styles.pointIcon}
              />
              <Text style={styles.pointText}>
                Instantly view full ad details
              </Text>
            </View>

            <View style={styles.pointRow}>
              <Ionicons
                name="pricetags-outline"
                size={14}
                color="#FF69B4"
                style={styles.pointIcon}
              />
              <Text style={styles.pointText}>
                See product specifications, pricing, and seller info
              </Text>
            </View>

            <View style={styles.pointRow}>
              <Ionicons
                name="bookmark-outline"
                size={14}
                color="#000"
                style={styles.pointIcon}
              />
              <Text style={styles.pointText}>
                Save or share listings easily
              </Text>
            </View>

            <Text style={styles.sectionTitle}>How Addvey QR Code Works</Text>

            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>
                • Generate Code: A QR Code is created when you post an ad.
              </Text>
              <Text style={styles.bulletPoint}>
                • Scan Code: Buyers can scan the QR Code using the Addvey app.
              </Text>
              <Text style={styles.bulletPoint}>
                • Instant Access: Instantly view product details, contact you,
                and save or share listings.
              </Text>
            </View>

            {/* Example Listing */}
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>Example Listing</Text>
              <View style={styles.exampleLine} />
            </View>

            <AddCardPreview />
          </ScrollView>

          {/* BOTTOM FIXED SECTION */}
          <View style={styles.bottomSection}>
            <View style={styles.bottomContent}>
              <Text style={styles.bottomTitle}>Quick, Easy, and Smart!</Text>
              <Text style={styles.bottomSubtitle}>
                Explore your neighborhood with Addvey QR.
              </Text>

              <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => {
                  onClose();
                  navigation.navigate("QRCodeScanner");
                }}
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

export default ExampleListingModal;

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
    marginBottom: hp(0.2),
    fontFamily: "Poppins-Bold",
  },
  titleText: {
    fontSize: wp(6),
    color: "#000",
    fontFamily: "Poppins-Bold",
  },
  qrBox: {
    borderWidth: 1,
    borderColor: "#6C63FF",
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
