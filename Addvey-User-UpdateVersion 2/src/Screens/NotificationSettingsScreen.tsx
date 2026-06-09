import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Animated,
    StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const CustomSwitch = ({
    value,
    onValueChange,
}: {
    value: boolean;
    onValueChange: (val: boolean) => void;
}) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [wp("1.5%"), wp("6%")],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
            style={[
                styles.switchTrack,
                { backgroundColor: value ? "#6C63FF" : "#ccc" },
            ]}
        >
            <Animated.View
                style={[
                    styles.switchThumb,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </TouchableOpacity>
    );
};

const NotificationSettingScreen = () => {
    const navigation = useNavigation<any>();
    const [adNotifications, setAdNotifications] = useState(true);
    const [alertNotifications, setAlertNotifications] = useState(true);
    const [promoNotifications, setPromoNotifications] = useState(false);

    const [adOptions, setAdOptions] = useState({
        Reports: true,
        Alerts: true,
        Chat: true,
    });

    const toggleOption = (key: keyof typeof adOptions) => {
        setAdOptions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Custom Checkbox Component
    const CustomCheckbox = ({
        value,
        onPress,
    }: {
        value: boolean;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.checkbox, value && styles.checkboxChecked]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {value && <Ionicons name="checkmark" size={hp("2%")} color="#6C63FF" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={hp("2.4%")} color="#000" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Notification Settings</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* AD Notifications */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>AD Notifications</Text>
                        <CustomSwitch
                            value={adNotifications}
                            onValueChange={setAdNotifications}
                        />
                    </View>

                    {Object.keys(adOptions).map((key, index) => (
                        <View key={index} style={styles.optionRow}>
                            <Text style={styles.optionText}>
                                {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                            </Text>
                            <CustomCheckbox
                                value={adOptions[key as keyof typeof adOptions]}
                                onPress={() => toggleOption(key as keyof typeof adOptions)}
                            />
                        </View>
                    ))}
                </View>

                {/* Alert Notifications */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Alert Notifications</Text>
                        <CustomSwitch
                            value={alertNotifications}
                            onValueChange={setAlertNotifications}
                        />
                    </View>
                </View>

                {/* Promotional Notifications */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Promotional Notifications</Text>
                        <CustomSwitch
                            value={promoNotifications}
                            onValueChange={setPromoNotifications}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationSettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("2%"),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginTop: hp(4),
    },
    topBarTitle: {
        fontSize: hp("1.8%"),
        marginLeft: wp("2%"),
        fontFamily: "Poppins-Medium",
        marginTop: hp(0.4),
    },
    scrollContent: {
        paddingHorizontal: wp("6%"),
        marginTop: hp(2),
    },
    section: {
        marginBottom: hp("3%"),
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: hp("1.5%"),
    },
    sectionTitle: {
        fontSize: hp("1.8%"),
        fontWeight: "600",
        fontFamily: "Poppins-Medium",
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: hp("1%"),
        paddingHorizontal: wp(5),
    },
    optionText: {
        fontSize: hp("1.5%"),
        color: "#333",
    },
    checkbox: {
        width: wp("5.5%"),
        height: wp("5.5%"),
        borderWidth: 1.5,
        borderColor: "#00000066",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#fff",
    },

    switchTrack: {
        width: wp("12%"),
        height: hp("3%"),
        borderRadius: hp("3%"),
        justifyContent: "center",
    },
    switchThumb: {
        width: hp("2%"),
        height: hp("2%"),
        borderRadius: hp("2.2%"),
        backgroundColor: "#fff",
        position: "absolute",
    },
});
