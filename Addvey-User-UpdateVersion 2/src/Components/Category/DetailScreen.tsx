import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const DetailScreen: React.FC = () => {
    const [listedBy, setListedBy] = useState("");
    const [fuel, setFuel] = useState("");
    const [transmission, setTransmission] = useState("");
    const [km, setKm] = useState("");
    const [owners, setOwners] = useState("");
    const [airbags, setAirbags] = useState("");
    const [safety, setSafety] = useState("");

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
                            {listedBy === item && (
                                <View style={[styles.circle]} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Fuel */}
            <View style={styles.iconRow}>
                <MaterialCommunityIcons
                    name="fuel"
                    size={18}
                    color="#444"
                    style={{ marginRight: 4 }}
                />
                <Text style={styles.subTitle}>Fuel*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["Petrol", "Diesel", "Electric", "CNG & Hybrid", "LPG"].map(
                    (item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                fuel === item && styles.activeBtn,
                            ]}
                            onPress={() => setFuel(item)}
                        >
                            <View style={styles.textWithIcon}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        fuel === item && styles.activeText,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {fuel === item && <View style={styles.circle} />}
                            </View>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Transmission */}
            <View style={styles.iconRow}>
                <MaterialCommunityIcons
                    name="car-shift-pattern"
                    size={18}
                    color="#444"
                    style={{ marginRight: 4 }}
                />
                <Text style={styles.subTitle}>Transmission*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["Automatic", "Manual"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            transmission === item && styles.activeBtn,
                        ]}
                        onPress={() => setTransmission(item)}
                    >
                        <View style={styles.textWithIcon}>
                            <Text
                                style={[
                                    styles.optionText,
                                    transmission === item && styles.activeText,
                                ]}
                            >
                                {item}
                            </Text>
                            {transmission === item && (
                                <View style={styles.circle} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* KM Driven */}
            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>KM driven*</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={km}
                        onChangeText={setKm}
                        placeholder="Enter KM driven"
                        keyboardType="numeric"
                    />
                    <SimpleLineIcons name="speedometer" size={15} color="#00000080" />
                </View>
            </View>

            {/* Owners */}
            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>No.of Owners*</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={owners}
                        onChangeText={setOwners}
                        placeholder="Enter number of owners"
                        keyboardType="numeric"
                    />
                    <Ionicons name="person" size={16} color="#555" />
                </View>
            </View>

            {/* Airbags */}
            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>No.of Air bags*</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={airbags}
                        onChangeText={setAirbags}
                        placeholder="Enter number of airbags"
                        keyboardType="numeric"
                    />

                </View>
            </View>

            {/* Safety */}
            <View style={styles.iconRow}>
                <MaterialIcons name="star" style={{ marginRight: 4 }} size={14} color="#555555" />
                <Text style={styles.subTitle}>Safety</Text>
            </View>
            <View style={styles.rowWrap}>
                {["1+", "2+", "3+", "4+"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            safety === item && styles.activeBtn,
                        ]}
                        onPress={() => setSafety(item)}
                    >
                        <View style={styles.textWithIcon}>
                            <Ionicons
                                name="star"
                                size={12}
                                color="#CDFF03"
                                style={{ marginRight: wp(1) }}
                            />
                            <Text
                                style={[
                                    styles.optionText,
                                    safety === item && styles.activeText,
                                ]}
                            >
                                {item}
                            </Text>
                            {safety === item && <View style={styles.circle} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>


            <Text style={styles.subTitle}>RC*</Text>
            <View style={styles.rowWrap}>
                {["Available", "Not Available"].map((item) => (
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
                            {listedBy === item && (
                                <View style={[styles.circle]} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>RC Valid*</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={km}
                        onChangeText={setKm}
                        placeholder="Enter Date"
                        keyboardType="numeric"
                    />
                    <SimpleLineIcons name="speedometer" size={15} color="#00000080" />
                </View>
            </View>

            {/* Fuel */}
            <View style={styles.iconRow}>
                <Text style={styles.subTitle}>Insurance*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["Available", "Not Available"].map(
                    (item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.optionBtn,
                                fuel === item && styles.activeBtn,
                            ]}
                            onPress={() => setFuel(item)}
                        >
                            <View style={styles.textWithIcon}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        fuel === item && styles.activeText,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {fuel === item && <View style={styles.circle} />}
                            </View>
                        </TouchableOpacity>
                    )
                )}
            </View>

            <View style={styles.inputBox}>
                <Text style={styles.floatingLabel}>Insurance Valid*</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={km}
                        onChangeText={setKm}
                        placeholder="Enter Date"
                        keyboardType="numeric"
                    />
                    <SimpleLineIcons name="speedometer" size={15} color="#00000080" />
                </View>
            </View>

            {/* Transmission */}
            <View style={styles.iconRow}>
                <Text style={styles.subTitle}>Age of the vehicle*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["Less than 1 year", "Less than 2 years", "More than 3 years"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            transmission === item && styles.activeBtn,
                        ]}
                        onPress={() => setTransmission(item)}
                    >
                        <View style={styles.textWithIcon}>
                            <Text
                                style={[
                                    styles.optionText,
                                    transmission === item && styles.activeText,
                                ]}
                            >
                                {item}
                            </Text>
                            {transmission === item && (
                                <View style={styles.circle} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* KM Driven */}


            {/* Owners */}
            <View style={styles.iconRow}>
                <Text style={styles.subTitle}>Condition*</Text>
            </View>
            <View style={styles.rowWrap}>
                {["New – Brand new, no previous owner", "Like New – no damage", "Moderately Used – Visible wear, functional", "Old –  may need repairs"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.optionBtn,
                            transmission === item && styles.activeBtn,
                        ]}
                        onPress={() => setTransmission(item)}
                    >
                        <View style={styles.textWithIcon}>
                            <Text
                                style={[
                                    styles.optionText,
                                    transmission === item && styles.activeText,
                                ]}
                            >
                                {item}
                            </Text>
                            {transmission === item && (
                                <View style={styles.circle} />
                            )}
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
        borderWidth: 0.8
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

export default DetailScreen;
