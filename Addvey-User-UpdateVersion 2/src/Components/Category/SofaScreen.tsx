import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SofaScreen: React.FC<{ onDataChange?: (data: any) => void }> = ({
  onDataChange,
}) => {
  const [listedBy, setListedBy] = useState("");
  const [billAvailability, setBillAvailability] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");

  // 🔄 Send data up when changed
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        listedBy,
        billAvailability,
        materialType,
        age,
        condition,
      });
    }
  }, [listedBy, billAvailability, materialType, age, condition]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
      }}
    >
      <Text style={styles.title}>Sofa Details</Text>

      {/* Listed By */}
      <Text style={styles.subTitle}>Listed by*</Text>
      <View style={styles.rowWrap}>
        {["Owner", "Dealer"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, listedBy === item && styles.activeBtn]}
            onPress={() => setListedBy(item)}
          >
            <Text
              style={[
                styles.optionText,
                listedBy === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {listedBy === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bill Availability */}
      <View style={styles.iconRow}>
        <FontAwesome
          name="file-text-o"
          size={16}
          color="#444"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.subTitle}>Bill*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionBtn,
              billAvailability === item && styles.activeBtn,
            ]}
            onPress={() => setBillAvailability(item)}
          >
            <Text
              style={[
                styles.optionText,
                billAvailability === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {billAvailability === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Material Type */}
      <View style={styles.iconRow}>
        <Feather name="box" size={16} color="#444" style={{ marginRight: 4 }} />
        <Text style={styles.subTitle}>Material Type*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["Wood", "Plastic", "Fabric", "Metal", "Glass"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionBtn,
              materialType === item && styles.activeBtn,
            ]}
            onPress={() => setMaterialType(item)}
          >
            <Text
              style={[
                styles.optionText,
                materialType === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {materialType === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Age of Item */}
      <Text style={styles.subTitle}>Age of the Sofa*</Text>
      <View style={styles.rowWrap}>
        {["Less than 1 year", "Less than 2 years", "More than 3 years"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, age === item && styles.activeBtn]}
              onPress={() => setAge(item)}
            >
              <Text
                style={[styles.optionText, age === item && styles.activeText]}
              >
                {item}
              </Text>
              {age === item && <View style={styles.circle} />}
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Condition */}
      <Text style={styles.subTitle}>Condition*</Text>
      <View style={styles.rowWrap}>
        {[
          "New – Unused, sealed pack",
          "Like New – Minimal use, no visible damage",
          "Gently Used – Light scratches, fully functional",
          "Moderately Used – Visible wear, functional",
          "Old – Heavy wear, may need repair",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, condition === item && styles.activeBtn]}
            onPress={() => setCondition(item)}
          >
            <Text
              style={[
                styles.optionText,
                condition === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {condition === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: wp(5),
    marginBottom: hp(1),
    fontFamily: "Poppins-Medium",
  },
  subTitle: {
    fontSize: wp(3.5),
    marginVertical: hp(1),
    fontFamily: "Poppins-Regular",
    color: "#555555",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: hp(1),
  },
  optionBtn: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.8),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    marginRight: wp(2),
    marginBottom: hp(1),
    flexDirection: "row",
  },
  activeBtn: {
    borderColor: "#6C63FF",
    borderWidth: 0.8,
  },
  optionText: {
    fontSize: wp(3),
    color: "#00000099",
  },
  activeText: {
    color: "black",
    fontWeight: "600",
  },
  textWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  inputBox: {
    marginVertical: hp(1.8),
    position: "relative",
  },
  inputBoxBottom: {
    marginBottom: hp(1.8),
    position: "relative",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  floatingLabel: {
    position: "absolute",
    top: -hp(1),
    left: wp(3),
    backgroundColor: "#fff",
    paddingHorizontal: wp(1),
    fontSize: wp(2.8),
    color: "#555",
    zIndex: 1,
  },
  labelOutside: {
    fontSize: wp(3),
    color: "#555",
    marginBottom: hp(0.8),
    fontFamily: "Poppins-Regular",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.3),
  },
  input: {
    flex: 1,
    fontSize: wp(3),
    color: "#000",
  },
  circle: {
    width: 11,
    height: 11,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#6C63FF",
    marginLeft: wp(1.5),
    marginTop: hp(0.2),
  },
  dropdownStatic: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.3),
  },
  dropdownStaticBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.3),
  },
  placeholderText: {
    fontSize: wp(3),
    color: "#777",
    flex: 1,
  },
  dropdownOptions: {
    borderRadius: 8,
    marginTop: hp(0.5),
    backgroundColor: "#fff",
  },
  dropdownItem: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
  },
  dropdownText: {
    fontSize: wp(3),
    color: "#000",
  },
});

export default SofaScreen;
