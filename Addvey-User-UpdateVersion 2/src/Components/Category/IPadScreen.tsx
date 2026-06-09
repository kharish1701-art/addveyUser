import React, { useState, useEffect } from "react";
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

const IPadScreen: React.FC<{ onDataChange?: (data: any) => void }> = ({
  onDataChange,
}) => {
  const [listedBy, setListedBy] = useState("");
  const [networkSupport, setNetworkSupport] = useState("");
  const [storageROM, setStorageROM] = useState("");
  const [billAvailability, setBillAvailability] = useState("");
  const [boxAvailability, setBoxAvailability] = useState("");
  const [warrantyAvailability, setWarrantyAvailability] = useState("");
  const [insuranceAvailability, setInsuranceAvailability] = useState("");
  const [availability, setAvailability] = useState("");
  const [condition, setCondition] = useState("");
  const [securityOption, setSecurityOption] = useState("AGREEMENT");
  const [showDropdown, setShowDropdown] = useState(false);

  const [warrantyValid, setWarrantyValid] = useState("");
  const [insuranceValid, setInsuranceValid] = useState("");

  const [isWarrantyPickerVisible, setWarrantyPickerVisible] = useState(false);
  const [isInsurancePickerVisible, setInsurancePickerVisible] = useState(false);

  // --- Handle Date Pickers ---
  const handleWarrantyConfirm = (date: Date) => {
    hideWarrantyPicker();
    const formatted = date.toISOString().split("T")[0];
    setWarrantyValid(formatted);
  };
  const hideWarrantyPicker = () => setWarrantyPickerVisible(false);

  const handleInsuranceConfirm = (date: Date) => {
    hideInsurancePicker();
    const formatted = date.toISOString().split("T")[0];
    setInsuranceValid(formatted);
  };
  const hideInsurancePicker = () => setInsurancePickerVisible(false);

  // --- Data Change Effect ---
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        listedBy,
        networkSupport,
        storageROM,
        billAvailability,
        boxAvailability,
        warrantyAvailability,
        warrantyValid,
        insuranceAvailability,
        insuranceValid,
        availability,
        condition,
        securityOption,
      });
    }
  }, [
    listedBy,
    networkSupport,
    storageROM,
    billAvailability,
    boxAvailability,
    warrantyAvailability,
    warrantyValid,
    insuranceAvailability,
    insuranceValid,
    availability,
    condition,
    securityOption,
  ]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp(0),
        paddingVertical: hp(3),
      }}
    >
      <Text style={styles.title}>Details</Text>

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
                style={[
                  styles.optionText,
                  listedBy === item && styles.activeText,
                ]}
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
        <MaterialCommunityIcons
          name="access-point-network"
          size={18}
          color="#444"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.subTitle}>Network Support*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["2G", "3G", "4G", "5G", "Not sure"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, networkSupport === item && styles.activeBtn]}
            onPress={() => setNetworkSupport(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  networkSupport === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {networkSupport === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Storage (ROM) */}
      <View style={styles.iconRow}>
        <MaterialCommunityIcons
          name="memory"
          size={18}
          color="#444"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.subTitle}>Storage (ROM)*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, storageROM === item && styles.activeBtn]}
            onPress={() => setStorageROM(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  storageROM === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {storageROM === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bill */}
      <View style={styles.iconRow}>
        <FontAwesome
          name="file-text"
          size={16}
          style={{ marginRight: wp(2) }}
          color="#444"
        />
        <Text style={styles.subTitle}>Bill*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, billAvailability === item && styles.activeBtn]}
            onPress={() => setBillAvailability(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  billAvailability === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {billAvailability === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Box */}
      <View style={styles.iconRow}>
        <Feather name="box" size={16} color="#444" style={{ marginRight: wp(2) }} />
        <Text style={styles.subTitle}>Box*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, boxAvailability === item && styles.activeBtn]}
            onPress={() => setBoxAvailability(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  boxAvailability === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {boxAvailability === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Warranty */}
      <View style={styles.iconRow}>
        <MaterialIcons
          name="verified-user"
          size={16}
          color="#444"
          style={{ marginRight: wp(2) }}
        />
        <Text style={styles.subTitle}>Warranty*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["Available", "Not Available"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, warrantyAvailability === item && styles.activeBtn]}
            onPress={() => setWarrantyAvailability(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  warrantyAvailability === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {warrantyAvailability === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Warranty Valid */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Warranty Valid*</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setWarrantyPickerVisible(true)}
        >
          <TextInput
            style={styles.input}
            value={warrantyValid}
            placeholder="Select Date"
            editable={false}
          />
          <SimpleLineIcons name="speedometer" size={15} color="#00000080" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isWarrantyPickerVisible}
        mode="date"
        onConfirm={handleWarrantyConfirm}
        onCancel={hideWarrantyPicker}
      />

      {/* Insurance */}
      <View style={styles.iconRow}>
        <MaterialCommunityIcons
          name="shield-check"
          size={16}
          color="#444"
          style={{ marginRight: wp(2) }}
        />
        <Text style={styles.subTitle}>Insurance*</Text>
      </View>
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
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  insuranceAvailability === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {insuranceAvailability === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Insurance Valid */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Insurance Valid*</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setInsurancePickerVisible(true)}
        >
          <TextInput
            style={styles.input}
            value={insuranceValid}
            placeholder="Select Date"
            editable={false}
          />
          <SimpleLineIcons name="speedometer" size={15} color="#00000080" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isInsurancePickerVisible}
        mode="date"
        onConfirm={handleInsuranceConfirm}
        onCancel={hideInsurancePicker}
      />

      {/* Age of Device */}
      <Text style={styles.subTitle}>Age of the Device*</Text>
      <View style={styles.rowWrap}>
        {["Less than 1 year", "Less than 2 years", "More than 3 years"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, availability === item && styles.activeBtn]}
              onPress={() => setAvailability(item)}
            >
              <View style={styles.textWithIcon}>
                <Text
                  style={[
                    styles.optionText,
                    availability === item && styles.activeText,
                  ]}
                >
                  {item}
                </Text>
                {availability === item && <View style={styles.circle} />}
              </View>
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
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  condition === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {condition === item && <View style={styles.circle} />}
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

export default IPadScreen;
