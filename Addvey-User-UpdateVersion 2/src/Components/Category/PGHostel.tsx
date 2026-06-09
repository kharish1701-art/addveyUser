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
import AmenitiesModal from "./AmenitiesModal";

const PGHostelScreen: React.FC = () => {
    const [listedBy, setListedBy] = useState("");
    const [gender, setGender] = useState("");
    const [roomType, setRoomType] = useState("");
    const [floorNo, setFloorNo] = useState("");
    const [foodAvailable, setFoodAvailable] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [furnished, setFurnished] = useState("");
    const [availability, setAvailability] = useState("");
    const [ageOfProperty, setAgeOfProperty] = useState("");
    const [securityOption, setSecurityOption] = useState("AGREEMENT");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const handleConfirmAmenities = (selected: string[]) => {
        setSelectedAmenities(selected);
        setShowAmenitiesModal(false);
    };


    return (
        <ScrollView style={styles.container}>
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
                            {listedBy === item && <View style={styles.circle} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Gender */}
            <View style={styles.iconRow}>
                <Text style={styles.subTitle}>Gender*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["Boys", "Girls", "Both"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            gender === item && styles.activeBtn,
                        ]}
                        onPress={() => setGender(item)}
                    >
                        <View style={styles.textWithIcon}>
                            <Text
                                style={[
                                    styles.optionText,
                                    gender === item && styles.activeText,
                                ]}
                            >
                                {item}
                            </Text>
                            {gender === item && <View style={styles.circle} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Room Type */}
            <View style={styles.iconRow}>
                <Octicons
                    name="person"
                    size={15}
                    style={{ marginRight: wp(2) }}
                    color="#555"
                />
                <Text style={styles.subTitle}>Room Type*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["Private Room", "2+ Sharing", "4+ Sharing", "5+ Sharing"].map(
                    (item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                roomType === item && styles.activeBtn,
                            ]}
                            onPress={() => setRoomType(item)}
                        >
                            <View style={styles.textWithIcon}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        roomType === item && styles.activeText,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {roomType === item && <View style={styles.circle} />}
                            </View>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Floor No */}
            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>Floor No*</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={floorNo}
                        onChangeText={setFloorNo}
                        placeholder="3"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            {/* Food Available */}
            <View style={styles.iconRow}>
                <MaterialCommunityIcons
                    name="food-takeout-box"
                    size={15}
                    style={{ marginRight: wp(2) }}
                    color="#555"
                />
                <Text style={styles.subTitle}>Food Available*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["Yes", "No"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            foodAvailable === item && styles.activeBtn,
                        ]}
                        onPress={() => setFoodAvailable(item)}
                    >
                        <View style={styles.textWithIcon}>
                            <Text
                                style={[
                                    styles.optionText,
                                    foodAvailable === item && styles.activeText,
                                ]}
                            >
                                {item}
                            </Text>
                            {foodAvailable === item && <View style={styles.circle} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bathrooms */}
            <Text style={styles.subTitle}>Bathrooms*</Text>
            <View style={styles.rowWrap}>
                {["1", "2", "3", "4"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            bathrooms === item && styles.activeBtn,
                        ]}
                        onPress={() => setBathrooms(item)}
                    >
                        <View style={styles.textWithIcon}>
                            <Text
                                style={[
                                    styles.optionText,
                                    bathrooms === item && styles.activeText,
                                ]}
                            >
                                {item}
                            </Text>
                            {bathrooms === item && <View style={styles.circle} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Furnished Status */}
            <Text style={styles.subTitle}>Furnished Status*</Text>
            <View style={styles.rowWrap}>
                {["Unfurnished", "Semi Furnished", "Fully Furnished"].map(
                    (item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                furnished === item && styles.activeBtn,
                            ]}
                            onPress={() => setFurnished(item)}
                        >
                            <View style={styles.textWithIcon}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        furnished === item && styles.activeText,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {furnished === item && <View style={styles.circle} />}
                            </View>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Amenities */}
            <View style={styles.inputBox}>
                <Text style={styles.labelOutside}>Amenities*</Text>
                <TouchableOpacity style={styles.dropdownStatic} onPress={() => setShowAmenitiesModal(true)}>
                    <Text style={styles.placeholderText}>
                        E.g., Fridge, Washing Machine, & more
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={20} color="#6C63FF" />
                </TouchableOpacity>
            </View>

            {/* ✅ Modal Component */}
            <AmenitiesModal
                visible={showAmenitiesModal}
                onClose={() => setShowAmenitiesModal(false)}
                onConfirm={handleConfirmAmenities}
            />

            {/* Availability */}
            <Text style={styles.subTitle}>Availability*</Text>
            <View style={styles.rowWrap}>
                {[
                    "Immediate",
                    "Within 15 Days",
                    "Within 30 Days",
                    "After 30 Days",
                ].map((item) => (
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
                ))}
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
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp(0),
        paddingVertical: hp(3),
    },
    title: {
        fontSize: wp(5),
        marginBottom: hp(1),
        fontFamily: "Poppins-Medium",
    },
    subTitle: {
        fontSize: wp(3.3),
        marginVertical: hp(1),
        fontFamily: "Poppins-Regular",
        color: "#555",
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
        marginRight: wp(2),
        marginBottom: hp(1),
    },
    activeBtn: {
        borderColor: "#6C63FF",
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
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
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

export default PGHostelScreen;
