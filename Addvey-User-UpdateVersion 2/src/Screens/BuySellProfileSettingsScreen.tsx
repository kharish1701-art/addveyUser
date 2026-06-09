import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const BuySellProfileSetingsScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("Nanda kumar");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("30 Sep 2002");
  const [mobile, setMobile] = useState("+91 9392322767");
  const [email, setEmail] = useState("nk9392322@gmail.com");
  const [languages, setLanguages] = useState("English, Telugu, Tamil");
  const [selectedOption, setSelectedOption] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={20} color="black" />

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Buy/Sell Profile</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.headerSubtitle}> ID: 2134354</Text>
            <Image
              source={require("../../assets/images/profilesave.png")}
              style={styles.smallImage}
            />
          </View>
        </View>

        {/* Right Section with Icon + Text */}
        <TouchableOpacity style={styles.rightSection}>
          <Image
            source={require("../../assets/images/1.png")}
            style={styles.smallImage}
          />
          <Text style={styles.rightSectionText}>View on Addvey</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: hp("4%") }}>
        {/* Add Images Section */}
        <TouchableOpacity style={styles.addImageBox}>
          <Ionicons name="camera-outline" size={28} color="#6C63FF" />
          <Text style={styles.addImageText}>Add images</Text>
          <Text style={styles.addImageSubText}>
            jpeg, png or jpg formats up-to 5MB
          </Text>

          {/* Small circular camera button bottom-left */}
          <View style={styles.cameraCircle}>
            <Ionicons name="camera-outline" size={18} color="#6C63FF" />
          </View>
        </TouchableOpacity>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          {/* Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Gender */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              value={gender}
              onChangeText={setGender}
            />
            <Ionicons
              name="male-female"
              size={16}
              color="gray"
              style={styles.inputIcon}
            />
          </View>

          {/* DOB */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput style={styles.input} value={dob} onChangeText={setDob} />
            <Ionicons
              name="calendar-outline"
              size={16}
              color="gray"
              style={styles.inputIcon}
            />
          </View>

          {/* Mobile */}
          <View style={styles.inputWrapper}>
            <View style={styles.labelIconRow}>
              <Ionicons
                name="call-outline"
                size={12}
                color="gray"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.labelText}>Mobile</Text>
            </View>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
            />
            <TouchableOpacity style={styles.verifyBtnMobile}>
              <Image
                source={require("../../assets/images/verifygreen.png")}
                style={{
                  marginRight: 4,
                  width: wp(4),
                  height: hp(2),
                  resizeMode: "contain",
                }}
              />
              <Text
                style={{
                  color: "#32CD32",
                  fontWeight: "600",
                  fontSize: wp("2.8%"),
                }}
              >
                Verified
              </Text>
            </TouchableOpacity>

            {/* Select Option Row under Mobile */}
            <TouchableOpacity
              style={styles.selectRow}
              onPress={() => setSelectedOption(!selectedOption)}
            >
              {selectedOption ? (
                <Ionicons name="checkmark-circle" size={18} color="#6C63FF" />
              ) : (
                <Ionicons name="ellipse-outline" size={18} color="gray" />
              )}
              <Text style={styles.selectText}>
                {selectedOption
                  ? "Hide mobile number in Addvey profile (Buyer)"
                  : "Hide mobile number in Addvey profile (Buyer)"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <View style={styles.labelIconRow}>
              <Ionicons
                name="mail-outline"
                size={12}
                color="gray"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.labelText}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.verifyBtn}>
              <Text
                style={{
                  color: "#6C63FF",
                  fontWeight: "600",
                  fontSize: wp("2.8%"),
                }}
              >
                Verify
              </Text>
            </TouchableOpacity>
          </View>

          {/* Languages */}
          <View style={styles.inputWrapper}>
            <View style={styles.labelIconRow}>
              <Ionicons
                name="language"
                size={12}
                color="gray"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.labelText}>Languages</Text>
            </View>
            <TextInput
              style={styles.input}
              value={languages}
              onChangeText={setLanguages}
            />
            <Ionicons
              name="create-outline"
              size={14}
              color="#6B4EFF"
              style={styles.inputIcon}
            />
          </View>

          {/* Replaced PAN with Link Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Link</Text>
              <MaterialIcons name="arrow-right" size={20} color="#6C63FF" />
            </View>
            <Text style={styles.helperText}>
              Would you like to add your links to your profile? Customers can
              contact them from the Addvey
            </Text>
          </View>
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => navigation.navigate("PANCardUplaod")}
        >
          <Text style={styles.updateText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BuySellProfileSetingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("4%"),
    paddingBottom: hp("1%"),
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    marginTop: hp(1),
  },
  titleContainer: {
    flex: 1,
    marginLeft: wp("3%"),
  },
  headerTitle: {
    fontSize: wp("4%"),
    color: "#000",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: wp("2.8%"),
    color: "#6E533F",
    marginRight: wp("2%"),
  },
  smallImage: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: 8,
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
  },
  rightSectionText: {
    fontSize: wp("2.8%"),
    marginLeft: wp("1%"),
    color: "#000000",
    fontWeight: "600",
  },
  addImageBox: {
    marginTop: hp("15%"),
    marginHorizontal: wp("5%"),
    borderWidth: 1,
    borderColor: "#B9B9FF",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#F9F9FF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("5%"),
    position: "relative",
  },
  addImageText: {
    fontSize: wp("4%"),
    color: "#6C63FF",
    fontWeight: "600",
    marginTop: hp("1%"),
  },
  addImageSubText: {
    fontSize: wp("3%"),
    color: "#888",
    marginTop: hp("0.5%"),
  },
  cameraCircle: {
    position: "absolute",
    bottom: -hp("2%"),
    left: wp("2%"),
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#fff",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#B9B9FF",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginTop: hp("5%"),
    paddingHorizontal: wp("5%"),
  },
  inputWrapper: {
    marginBottom: hp("3%"),
    position: "relative",
  },
  label: {
    position: "absolute",
    top: -hp("1%"),
    left: wp("5%"),
    backgroundColor: "#fff",
    paddingHorizontal: wp("1%"),
    fontSize: wp("2.8%"),
    color: "#00000099",
    fontWeight: "600",
    zIndex: 1,
  },
  labelIconRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: -hp("1%"),
    left: wp("3%"),
    backgroundColor: "#fff",
    paddingHorizontal: wp("1%"),
    zIndex: 2,
  },
  labelText: {
    fontSize: wp("2.8%"),
    color: "#00000099",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
  },
  inputIcon: {
    position: "absolute",
    right: wp("3%"),
    top: "30%",
  },
  verifyBtn: {
    position: "absolute",
    right: wp("3%"),
    top: "30%",
    flexDirection: "row",
    alignItems: "center",
  },
  verifyBtnMobile: {
    position: "absolute",
    right: wp("3%"),
    top: "18%",
    flexDirection: "row",
    alignItems: "center",
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },
  selectText: {
    marginLeft: wp("2%"),
    fontSize: wp("3.2%"),
    color: "#6C63FF",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
  },
  linkText: {
    fontSize: wp("3.5%"),
    color: "#333",
  },
  helperText: {
    fontSize: wp("2.8%"),
    color: "#888",
    marginBottom: hp("2%"),
    marginLeft: wp("1%"),
    marginTop: hp(1),
  },
  updateBtn: {
    backgroundColor: "#6B4EFF",
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    marginTop: hp("2%"),
    alignItems: "center",
    marginHorizontal: wp("5%"),
  },
  updateText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});
