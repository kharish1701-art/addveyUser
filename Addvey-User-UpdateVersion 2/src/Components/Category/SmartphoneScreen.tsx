import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SmartphoneDetailScreen: React.FC<{ onDataChange?: (data: any) => void }> = ({
  onDataChange,
}) => {
  const [listedBy, setListedBy] = useState("");
  const [networkSupport, setNetworkSupport] = useState("");
  const [storageROM, setStorageROM] = useState("");
  const [ramOption, setRamOption] = useState("");
  const [billAvailability, setBillAvailability] = useState("");
  const [boxAvailability, setBoxAvailability] = useState("");
  const [warrantyAvailability, setWarrantyAvailability] = useState("");
  const [warrantyValid, setWarrantyValid] = useState("");
  const [insuranceAvailability, setInsuranceAvailability] = useState("");
  const [insuranceValid, setInsuranceValid] = useState("");
  const [deviceAge, setDeviceAge] = useState("");
  const [condition, setCondition] = useState("");
  const [securityOption, setSecurityOption] = useState("AGREEMENT");

  // Date picker controls
  const [isWarrantyPickerVisible, setWarrantyPickerVisibility] = useState(false);
  const [isInsurancePickerVisible, setInsurancePickerVisibility] = useState(false);

  const hideWarrantyPicker = () => setWarrantyPickerVisibility(false);
  const hideInsurancePicker = () => setInsurancePickerVisibility(false);

  const handleWarrantyConfirm = (date: Date) => {
    hideWarrantyPicker();
    setWarrantyValid(date.toISOString().split("T")[0]);
  };
  const handleInsuranceConfirm = (date: Date) => {
    hideInsurancePicker();
    setInsuranceValid(date.toISOString().split("T")[0]);
  };

  // Send live data to parent
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        listedBy,
        networkSupport,
        storageROM,
        ramOption,
        billAvailability,
        boxAvailability,
        warrantyAvailability,
        warrantyValid,
        insuranceAvailability,
        insuranceValid,
        deviceAge,
        condition,
        securityOption,
      });
    }
  }, [
    listedBy,
    networkSupport,
    storageROM,
    ramOption,
    billAvailability,
    boxAvailability,
    warrantyAvailability,
    warrantyValid,
    insuranceAvailability,
    insuranceValid,
    deviceAge,
    condition,
    securityOption,
  ]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp(4),
        paddingVertical: hp(3),
      }}
    >
      <Text style={styles.title}>Smartphone Details</Text>

      {/* Listed By */}
      <Text style={styles.subTitle}>Listed by*</Text>
      <View style={styles.rowWrap}>
        {["Owner", "Dealer"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, listedBy === item && styles.activeBtn]}
            onPress={() => setListedBy(item)}
          >
            <View style={styles.textWithIcon}>
            <Text
              style={[styles.optionText, listedBy === item && styles.activeText]}
            >
              {item}
            </Text>
            {listedBy === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Network Support */}
      <View style={styles.iconRow}>
        <Ionicons name="cellular-outline" size={16} color="#444" style={{ marginRight: 4 }} />
        <Text style={styles.subTitle}>Network Support*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["2G", "3G", "4G", "5G", "Not sure"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, networkSupport === item && styles.activeBtn,  styles.textWithIcon]}
            onPress={() => setNetworkSupport(item)}
          >
            <Text
              style={[
                styles.optionText,
                networkSupport === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {networkSupport === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Storage */}
      <Text style={styles.subTitle}>Storage (ROM)*</Text>
      <View style={styles.rowWrap}>
        {["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, storageROM === item && styles.activeBtn]}
            onPress={() => setStorageROM(item)}
          >
            <Text
              style={[styles.optionText, storageROM === item && styles.activeText]}
            >
              {item}
            </Text>
            {storageROM === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* RAM */}
      <Text style={styles.subTitle}>RAM*</Text>
      <View style={styles.rowWrap}>
        {["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, ramOption === item && styles.activeBtn]}
            onPress={() => setRamOption(item)}
          >
            <Text
              style={[styles.optionText, ramOption === item && styles.activeText]}
            >
              {item}
            </Text>
            {ramOption === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bill */}
      <Text style={styles.subTitle}>Bill*</Text>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, billAvailability === item && styles.activeBtn]}
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

      {/* Box */}
      <Text style={styles.subTitle}>Box*</Text>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, boxAvailability === item && styles.activeBtn]}
            onPress={() => setBoxAvailability(item)}
          >
            <Text
              style={[
                styles.optionText,
                boxAvailability === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {boxAvailability === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Warranty */}
      <Text style={styles.subTitle}>Warranty*</Text>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionBtn,
              warrantyAvailability === item && styles.activeBtn,
            ]}
            onPress={() => setWarrantyAvailability(item)}
          >
            <Text
              style={[
                styles.optionText,
                warrantyAvailability === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {warrantyAvailability === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Warranty Date Picker */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Warranty Valid Till*</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setWarrantyPickerVisibility(true)}
        >
          <TextInput
            style={styles.input}
            value={warrantyValid}
            placeholder="Select date"
            editable={false}
          />
          <SimpleLineIcons name="calendar" size={15} color="#00000080" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isWarrantyPickerVisible}
        mode="date"
        onConfirm={handleWarrantyConfirm}
        onCancel={hideWarrantyPicker}
      />

      {/* Insurance */}
      <Text style={styles.subTitle}>Insurance*</Text>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionBtn,
              insuranceAvailability === item && styles.activeBtn,
            ]}
            onPress={() => setInsuranceAvailability(item)}
          >
            <Text
              style={[
                styles.optionText,
                insuranceAvailability === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
            {insuranceAvailability === item && <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Insurance Date Picker */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Insurance Valid Till*</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setInsurancePickerVisibility(true)}
        >
          <TextInput
            style={styles.input}
            value={insuranceValid}
            placeholder="Select date"
            editable={false}
          />
          <SimpleLineIcons name="calendar" size={15} color="#00000080" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isInsurancePickerVisible}
        mode="date"
        onConfirm={handleInsuranceConfirm}
        onCancel={hideInsurancePicker}
      />

      {/* Age */}
      <Text style={styles.subTitle}>Age of Device*</Text>
      <View style={styles.rowWrap}>
        {["Less than 1 year", "Less than 2 years", "More than 3 years"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, deviceAge === item && styles.activeBtn]}
              onPress={() => setDeviceAge(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  deviceAge === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {deviceAge === item && <View style={styles.circle} />}
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Condition */}
      <Text style={styles.subTitle}>Condition*</Text>
      <View style={styles.rowWrap}>
        {[
          "New – Unused, sealed pack",
          "Like New – Minimal use",
          "Gently Used – Light scratches",
          "Moderately Used – Visible wear",
          "Old – Heavy wear, may need repair",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, condition === item && styles.activeBtn]}
            onPress={() => setCondition(item)}
          >
            <Text
              style={[styles.optionText, condition === item && styles.activeText]}
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
        alignItems: "center",
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

export default SmartphoneDetailScreen;
