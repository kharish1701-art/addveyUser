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
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ApartmentDetailScreen: React.FC<{ onDataChange?: (data: any) => void }> = ({
  onDataChange,
}) => {
  const [listedBy, setListedBy] = useState("");
  const [facing, setFacing] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [breadth, setBreadth] = useState("");
  const [length, setLength] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [furnished, setFurnished] = useState("");
  const [amenities, setAmenities] = useState("");
  const [availability, setAvailability] = useState("");
  const [preferredTenants, setPreferredTenants] = useState<string[]>([]);
  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [securityOption, setSecurityOption] = useState("AGREEMENT");
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleTenantSelection = (item: string) => {
    if (preferredTenants.includes(item)) {
      setPreferredTenants(preferredTenants.filter((t) => t !== item));
    } else {
      setPreferredTenants([...preferredTenants, item]);
    }
  };

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        listedBy,
        facing,
        squareFeet,
        breadth,
        length,
        floorNo,
        maintenance,
        bathrooms,
        furnished,
        amenities,
        availability,
        preferredTenants,
        ageOfProperty,
        securityOption,
      });
    }
  }, [
    listedBy,
    facing,
    squareFeet,
    breadth,
    length,
    floorNo,
    maintenance,
    bathrooms,
    furnished,
    amenities,
    availability,
    preferredTenants,
    ageOfProperty,
    securityOption,
  ]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
      }}
    >
      <Text style={styles.title}>Apartment Details</Text>

      {/* Listed By */}
      <Text style={styles.subTitle}>Listed By*</Text>
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

      {/* Facing */}
      <View style={styles.iconRow}>
        <FontAwesome name="arrows-alt" size={14} color="#444" style={{ marginRight: 5 }} />
        <Text style={styles.subTitle}>Facing*</Text>
      </View>
      <View style={styles.rowWrap}>
        {["East", "West", "North", "South", "North-East", "South-East"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, facing === item && styles.activeBtn]}
            onPress={() => setFacing(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[styles.optionText, facing === item && styles.activeText]}
              >
                {item}
              </Text>
              {facing === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Square Feet */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Square Feet*</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={squareFeet}
            onChangeText={setSquareFeet}
            placeholder="Enter area in sq.ft"
            keyboardType="numeric"
          />
          <SimpleLineIcons name="size-fullscreen" size={15} color="#777" />
        </View>
      </View>

      {/* Breadth */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Breadth (ft)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={breadth}
            onChangeText={setBreadth}
            placeholder="Enter breadth"
            keyboardType="numeric"
          />
          <Octicons name="arrow-both" size={16} color="#555" />
        </View>
      </View>

      {/* Length */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Length (ft)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={length}
            onChangeText={setLength}
            placeholder="Enter length"
            keyboardType="numeric"
          />
          <MaterialCommunityIcons name="arrow-up-down" size={16} color="#555" />
        </View>
      </View>

      {/* Floor No */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Floor No*</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={floorNo}
            onChangeText={setFloorNo}
            placeholder="Enter floor number"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Monthly Maintenance */}
      <View style={styles.inputBox}>
        <Text style={styles.floatingLabel}>Monthly Maintenance (₹)*</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={maintenance}
            onChangeText={setMaintenance}
            placeholder="e.g. 3000"
            keyboardType="numeric"
          />
          <MaterialIcons name="currency-rupee" size={16} color="#555" />
        </View>
      </View>

      {/* Bathrooms */}
      <Text style={styles.subTitle}>Bathrooms*</Text>
      <View style={styles.rowWrap}>
        {["1", "2", "3", "4+"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, bathrooms === item && styles.activeBtn]}
            onPress={() => setBathrooms(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[styles.optionText, bathrooms === item && styles.activeText]}
              >
                {item}
              </Text>
              {bathrooms === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Furnished */}
      <Text style={styles.subTitle}>Furnished Status*</Text>
      <View style={styles.rowWrap}>
        {["Unfurnished", "Semi Furnished", "Fully Furnished"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, furnished === item && styles.activeBtn]}
            onPress={() => setFurnished(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[styles.optionText, furnished === item && styles.activeText]}
              >
                {item}
              </Text>
              {furnished === item && <View style={styles.circle} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Availability */}
      <Text style={styles.subTitle}>Availability*</Text>
      <View style={styles.rowWrap}>
        {["Immediate", "Within 15 Days", "Within 30 Days", "After 30 Days"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, availability === item && styles.activeBtn]}
              onPress={() => setAvailability(item)}
            >
              <View style={styles.textWithIcon}>
                <Text
                  style={[styles.optionText, availability === item && styles.activeText]}
                >
                  {item}
                </Text>
                {availability === item && <View style={styles.circle} />}
              </View>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Preferred Tenants */}
      <Text style={styles.subTitle}>Preferred Tenants*</Text>
      <View style={styles.rowWrap}>
        {["Family", "Men Bachelors", "Women Bachelors", "Company"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionBtn,
                preferredTenants.includes(item) && styles.activeBtn,
              ]}
              onPress={() => toggleTenantSelection(item)}
            >
              <View style={styles.textWithIcon}>
                <Text
                  style={[
                    styles.optionText,
                    preferredTenants.includes(item) && styles.activeText,
                  ]}
                >
                  {item}
                </Text>
                {preferredTenants.includes(item) && <View style={styles.circle} />}
              </View>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Age of Property */}
      <Text style={styles.subTitle}>Age of Property*</Text>
      <View style={styles.rowWrap}>
        {[
          "New – Brand new, no previous owner",
          "Like New – no damage",
          "Moderately Used – some wear, functional",
          "Old – may need repairs",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionBtn, ageOfProperty === item && styles.activeBtn]}
            onPress={() => setAgeOfProperty(item)}
          >
            <View style={styles.textWithIcon}>
              <Text
                style={[
                  styles.optionText,
                  ageOfProperty === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
              {ageOfProperty === item && <View style={styles.circle} />}
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
    fontSize: wp(3.3),
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
  
});

export default ApartmentDetailScreen;
