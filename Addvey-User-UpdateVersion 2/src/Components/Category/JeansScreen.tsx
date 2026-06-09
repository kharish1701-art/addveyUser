import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const JeansScreen = ({ onDataChange }) => {
  const [form, setForm] = useState({
    listedBy: "",
    billStatus: "",
    materialType: "",
    condition: "",
  });

  // ✅ Common handler for state update
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Auto trigger parent callback on data change
  useEffect(() => {
    if (onDataChange) {
      onDataChange(form);
    }
  }, [form]);

  return (
    <ScrollView
    //   style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Details</Text>

      {/* Listed By */}
      <Text style={styles.subTitle}>Listed by*</Text>
      <View style={styles.rowWrap}>
        {["Owner", "Dealer"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionBtn,
              form.listedBy === item && styles.activeBtn,
            ]}
            onPress={() => handleChange("listedBy", item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  form.listedBy === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {form.listedBy === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bill */}
      <View style={styles.iconRow}>
        <FontAwesome
          name="arrows-alt"
          size={14}
          style={{ marginRight: wp(2) }}
          color="#444"
        />
        <Text style={styles.subTitle}>Bill*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionBtn,
              form.billStatus === item && styles.activeBtn,
            ]}
            onPress={() => handleChange("billStatus", item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  form.billStatus === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {form.billStatus === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Material Type */}
      <View style={styles.iconRow}>
        <Text style={styles.subTitle}>Material type*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["Silk", "Cotton", "Linen", "Wool", "Jeans"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionBtn,
              form.materialType === item && styles.activeBtn,
            ]}
            onPress={() => handleChange("materialType", item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  form.materialType === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {form.materialType === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
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
            style={[
              styles.optionBtn,
              form.condition === item && styles.activeBtn,
            ]}
            onPress={() => handleChange("condition", item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  form.condition === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {form.condition === item && <View style={styles.circle} />}
            </View>
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
        borderColor: '#ccc',
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

export default JeansScreen;
