import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ChatMessagingScreen = () => {
  const navigation = useNavigation<any>();
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp("5%")} color="black" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.profilePic} />
          <View>
            <Text style={styles.userName}>Nanda • BMW M5</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="location-sharp"
                size={wp("3.5%")}
                color="#FF0303"
                style={{ marginRight: wp("0.5%"), marginTop: hp(0.3) }}
              />
              <Text style={styles.userSubText}>
                1.2 km away . Kphb Bagyanagar Colony
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={() => setVisible(true)}
        >
          <AntDesign name="exclamation-circle" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <AntDesign name="close" size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Tips for a safe deal</Text>

            <View style={styles.modalRow}>
              <Feather name="credit-card" size={18} color="black" />
              <Text style={styles.rowText}>
                Don't enter UPI PIN/OTP, scan unknown QR codes, or click unsafe
                links.
              </Text>
            </View>

            <View style={styles.modalRow}>
              <Feather name="package" size={18} color="black" />
              <Text style={styles.rowText}>
                Never give money or product in advance.
              </Text>
            </View>

            <View style={styles.modalRow}>
              <Feather name="alert-circle" size={18} color="black" />
              <Text style={styles.rowText}>
                Report suspicious users to Addvey.
              </Text>
            </View>

            <View style={styles.modalRow}>
              <Feather name="image" size={18} color="black" />
              <Text style={styles.rowText}>
                Don't share personal details like photos or IDs.
              </Text>
            </View>

            <View style={styles.modalRow}>
              <Feather name="users" size={18} color="black" />
              <Text style={styles.rowText}>
                Be cautious during buyer-seller meetings.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.modalButtonText}>Continue to chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Price Bar */}
      <View style={styles.priceBar}>
        <Text style={styles.priceText}>Price . Rent</Text>
        <Text style={styles.priceValue}>₹20000 / Month</Text>
      </View>

      {/* Chat Section */}
      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={{ paddingBottom: hp("18%") }}
      >
        {/* Buyer Message */}
        <View style={styles.messageLeft}>
          <Text style={styles.topMessageText}>Nanda • Buyer • 10:06 AM</Text>
          <Image
            source={require("../../assets/images/yesterday.png")}
            style={styles.messageImage}
          />
          <Text style={styles.timeRight}>Yesterday</Text>
        </View>

        {/* Your Message */}
        <View style={styles.messageRight}>
          <Text style={styles.topMessageText}>You • 10:06 AM</Text>
          <Image
            source={require("../../assets/images/today.png")}
            style={styles.messageImage}
          />
          <Text style={styles.timeRight}>10:06 AM • Read</Text>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type message"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <View style={styles.iconsRow}>
          <View style={styles.leftIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Entypo name="emoji-happy" size={16} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="camera" size={16} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <EvilIcons name="location" size={18} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require("../../assets/images/mic.png")}
                style={{ width: wp(5), height: hp(2.2), resizeMode: "contain" }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="arrow-up" size={16} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatMessagingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp("3%"),
  },
  profilePic: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("7%"),
    backgroundColor: "#ddd",
    marginRight: wp("2%"),
  },
  userName: {
    fontSize: wp("3%"),
    fontWeight: "600",
  },
  userSubText: {
    fontSize: wp("2.8%"),
    color: "#6E533F",
    marginTop: hp(0.3),
  },

  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: "flex-end",
  },

  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    padding: wp(3),
    borderRadius: wp(10),
    marginBottom: hp(2),
    marginRight: wp(3),
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: wp(5),
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
  },

  modalTitle: {
    fontSize: wp(5),
    marginBottom: hp(2),
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },

  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    gap: wp(3),
  },

  rowText: {
    width: wp("70%"),
    fontSize: wp(3.4),
    color: "#444",
    fontFamily: "Poppins-Medium",
  },

  modalButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.5),
    borderRadius: wp(4),
    marginTop: hp(2),
  },

  modalButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: wp(3.8),
    fontFamily: "Poppins-Medium",
  },

  priceBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
  },
  priceText: {
    fontSize: wp("3%"),
    fontWeight: "500",
    color: "black",
  },
  priceValue: {
    fontSize: wp("3%"),
    fontWeight: "600",
    color: "#00000099",
  },

  chatArea: {
    flex: 1,
    padding: wp("3%"),
  },
  messageLeft: {
    alignSelf: "flex-start",
    marginVertical: hp("1%"),
  },
  messageRight: {
    alignSelf: "flex-end",
    marginVertical: hp("1%"),
  },
  messageImage: {
    width: wp("50%"),
    height: hp("20%"),
    borderRadius: wp("2%"),
  },
  topMessageText: {
    alignSelf: "center",
    fontSize: wp("2.5%"),
    fontWeight: "600",
    color: "#555555",
    marginBottom: hp("0.5%"),
  },
  timeRight: {
    fontSize: wp("3%"),
    color: "gray",
    marginTop: hp("0.5%"),
    textAlign: "right",
  },

  bottomSection: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: hp("1%"),
    borderTopLeftRadius: wp("5%"),
    borderTopRightRadius: wp("5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  inputRow: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
  },
  input: {
    flex: 1,
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
  },

  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  iconButton: {
    backgroundColor: "#fff",
    padding: wp("2.5%"),
    borderRadius: wp("10%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
