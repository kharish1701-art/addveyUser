import React, { useState } from "react";
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
    Octicons,
} from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CommercialPlotScreen: React.FC = () => {
    const [listedBy, setListedBy] = useState("");
    const [facing, setFacing] = useState("");
    const [km, setKm] = useState("");
    const [owners, setOwners] = useState("");
    const [airbags, setAirbags] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [furnished, setFurnished] = useState("");
    const [availability, setAvailability] = useState("");
    const [preferredTenants, setPreferredTenants] = useState<string[]>([]);
    const [ageOfProperty, setAgeOfProperty] = useState("");
    const [securityOption, setSecurityOption] = useState("AGREEMENT");
    const [showDropdown, setShowDropdown] = useState(false);

    // ✅ Toggle multiple selection for tenants
    const toggleTenantSelection = (item: string) => {
        if (preferredTenants.includes(item)) {
            setPreferredTenants(preferredTenants.filter((t) => t !== item));
        } else {
            setPreferredTenants([...preferredTenants, item]);
        }
    };

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
                        style={[
                            styles.optionBtn,
                            listedBy === item && styles.activeBtn,
                        ]}
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
                            {listedBy === item && <View style={[styles.circle]} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Facing */}
            <View style={styles.iconRow}>
                <FontAwesome name="arrows-alt" size={14} style={{ marginRight: wp(2) }} color="#444" />
                <Text style={styles.subTitle}>Facing*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"].map(
                    (item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                facing === item && styles.activeBtn,
                            ]}
                            onPress={() => setFacing(item)}
                        >
                            <View style={styles.textWithIcon}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        facing === item && styles.activeText,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {facing === item && <View style={styles.circle} />}
                            </View>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Square Feet */}
            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>Square feet*</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={km}
                        onChangeText={setKm}
                        placeholder="2000"
                        keyboardType="numeric"
                    />
                    <SimpleLineIcons name="speedometer" size={15} color="#00000080" />
                </View>
            </View>

            {/* Breadth */}
            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>Breadth</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={owners}
                        onChangeText={setOwners}
                        placeholder="50"
                        keyboardType="numeric"
                    />
                    <Octicons name="arrow-both" size={16} color="#555" />
                </View>
            </View>

            {/* Length */}
            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>Length</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={airbags}
                        onChangeText={setAirbags}
                        placeholder="50"
                        keyboardType="numeric"
                    />
                    <MaterialCommunityIcons name="arrow-up-down" size={16} color="#555" />
                </View>
            </View>

            {/* Availability */}
            <Text style={styles.subTitle}>Availability*</Text>
            <View style={styles.rowWrap}>
                {["Immediate", "Within 15 Days", "Within 30 Days", "After 30 Days"].map(
                    (item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                availability === item && styles.activeBtn,
                            ]}
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

            {/* Age of Property */}
            <Text style={styles.subTitle}>Age of the property*</Text>
            <View style={styles.rowWrap}>
                {[
                    "New – Brand new, no previous owner",
                    "Like New – no damage",
                    "Moderately Used – Visible wear, functional",
                    "Old –  may need repairs",
                ].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            ageOfProperty === item && styles.activeBtn,
                        ]}
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

            {/* Additional Security */}
            <Text style={styles.labelOutside}>Additional security (Optional)</Text>
            <View style={styles.inputBoxBottom}>
                <TouchableOpacity
                    style={styles.dropdownStaticBottom}
                    onPress={() => setShowDropdown(!showDropdown)}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.placeholderText, { color: "#6C63FF" }]}>
                        {securityOption}
                    </Text>
                    <MaterialIcons
                        name={showDropdown ? "arrow-drop-up" : "arrow-drop-down"}
                        size={20}
                        color="#6C63FF"
                    />
                </TouchableOpacity>
                {showDropdown && (
                    <View style={styles.dropdownOptions}>
                        {["NOTERY"].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSecurityOption(item);
                                    setShowDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
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

export default CommercialPlotScreen;
