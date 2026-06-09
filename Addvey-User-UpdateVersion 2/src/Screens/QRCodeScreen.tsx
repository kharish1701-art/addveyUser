import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";

const QRCodeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>QR Code</Text>
        <TouchableOpacity style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#FF0303" />
        </TouchableOpacity>
      </View>

      {/* Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <Text style={styles.userName}>Nanda</Text>
            <Image
              source={require("../../assets/images/save.png")}
              style={styles.userImage}
            />
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="red" />
            <Text style={styles.locationText}>
              1.2 km away · Kphb Bagyanagar Colony
            </Text>
          </View>
        </View>

        {/* QR Image Centered */}
        <View style={styles.qrWrapper}>
          <View style={styles.qrContainer}>
            <Image
              source={require("../../assets/images/qrcode.png")}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.scanText}>
          Boost Your Profile Visits with a Single Scan!
        </Text>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📢 <Text style={styles.bold}>Share Anywhere</Text> – Promote your
            listings on social media, WhatsApp, or even business cards.
          </Text>
          <Text style={styles.infoText}>
            📍 <Text style={styles.bold}>Strategic Placement</Text> – Display QR
            codes on product tags, vehicle tags, property banners, and receipts
            for instant access.
          </Text>
          <Text style={styles.infoText}>
            🚀 <Text style={styles.bold}>Easy Access</Text> – Let customers scan
            and explore your listings for vehicles, properties, and more — in
            seconds!
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-outline" size={16} color="#6C63FF" />
          <Text style={styles.shareBtnText}>Share QR code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadBtn}>
          <Feather name="arrow-down" size={16} color="#6C63FF" />
          <Text style={styles.downloadBtnText}>Download QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: hp("8%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    backgroundColor: "#fff",
    marginTop: hp(3.5),
  },
  topBarTitle: {
    fontSize: wp("5%"),
    fontFamily: "Poppins-Medium",
    color: "#000",
    marginTop: hp(0.4),
  },
  closeBtn: {},
  scrollContainer: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("12%"),
  },
  userInfo: {
    marginTop: hp("0%"),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontFamily: "Poppins-Medium",
    fontSize: wp("4.5%"),
    color: "#000",
  },
  userImage: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(4),
    marginLeft: wp(1),
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  locationText: {
    fontSize: wp("2.5%"),
    color: "#555",
    marginLeft: wp("1%"),
  },
  qrWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp("3%"),
  },
  qrContainer: {
    width: wp("50%"),
    height: wp("50%"),
    borderRadius: 16,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  qrImage: {
    width: wp(60),
    height: hp(23),
  },
  scanText: {
    fontSize: wp("3.8%"),
    color: "#000",
    textAlign: "center",
    marginVertical: hp("2%"),
    fontFamily: "Poppins-Medium",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: wp("4%"),
    marginTop: hp("1%"),
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
  },
  infoText: {
    fontSize: wp("3%"),
    color: "#555555",
    marginBottom: hp("1.5%"),
  },
  bold: {
    fontSize: wp(3),
    color: "black",
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp("4%"),
    backgroundColor: "#D9D9D940",
    paddingBottom: hp(3),
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.8%"),
    marginBottom: hp("2%"),
    backgroundColor: "white",
    borderRadius: wp(10),
  },
  shareBtnText: {
    marginLeft: wp("2%"),
    fontSize: wp("3.5%"),
    fontWeight: "500",
    color: "#6C63FF",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.8%"),
    backgroundColor: "white",
    borderRadius: wp(10),
  },
  downloadBtnText: {
    marginLeft: wp("2%"),
    fontSize: wp("3.8%"),
    fontWeight: "500",
    color: "#6C63FF",
  },
});

export default QRCodeScreen;
