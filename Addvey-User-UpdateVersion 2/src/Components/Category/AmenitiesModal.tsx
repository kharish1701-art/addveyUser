import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface Amenity {
    id: string;
    name: string;
    emoji: string;
}

interface AmenitiesModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (selected: string[]) => void;
}

const amenitiesList: Amenity[] = [
    { id: "1", name: "Parking", emoji: "🚗" },
    { id: "2", name: "CCTV", emoji: "📹" },
    { id: "3", name: "Wi-Fi", emoji: "📶" },
    { id: "4", name: "Security Guard", emoji: "🧍‍♂️" },
    { id: "5", name: "Power Backup", emoji: "🔋" },
    { id: "6", name: "Lift/Elevator", emoji: "🛗" },
    { id: "7", name: "Air Conditioning", emoji: "❄️" },
    { id: "8", name: "Water Supply", emoji: "💧" },
    { id: "9", name: "Waste Disposal", emoji: "🚮" },
    { id: "10", name: "Fire Safety", emoji: "🔥" },
    { id: "11", name: "Gym", emoji: "💪" },
    { id: "12", name: "Garden", emoji: "🌳" },
    { id: "13", name: "Swimming Pool", emoji: "🏊‍♂️" },
    { id: "14", name: "Clubhouse", emoji: "🏠" },
    { id: "15", name: "Children's Play Area", emoji: "🧸" },
    { id: "16", name: "Balcony", emoji: "🏞️" },
    { id: "17", name: "Intercom", emoji: "☎️" },
    { id: "18", name: "Pet Friendly", emoji: "🐶" },
    { id: "19", name: "Solar Panels", emoji: "☀️" },
    { id: "20", name: "Laundry", emoji: "🧺" },
];

const AmenitiesModal: React.FC<AmenitiesModalProps> = ({
    visible,
    onClose,
    onConfirm,
}) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.closeArea} onPress={onClose} />
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.heading}>Amenities</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.grid}>
                            {amenitiesList.map((item) => {
                                const isSelected = selected.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.option,
                                            isSelected && styles.selectedOption,
                                        ]}
                                        onPress={() => toggleSelect(item.id)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.optionContent}>
                                            <Text style={styles.emoji}>{item.emoji}</Text>
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    isSelected && styles.selectedText,
                                                ]}
                                            >
                                                {item.name}
                                            </Text>
                                        </View>
                                        {isSelected && (
                                            <View style={styles.selectedCircle} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => onConfirm(selected)}
                    >
                        <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AmenitiesModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    closeArea: {
        flex: 1,
        width: "100%",
    },
    modalContainer: {
        height: hp("85%"),
        backgroundColor: "#fff",
        borderTopLeftRadius: wp("5%"),
        borderTopRightRadius: wp("5%"),
        paddingHorizontal: wp("4%"),
        paddingTop: hp("2%"),
    },
    closeIcon: {
        position: "absolute",
        right: wp("3%"),
        top: hp("-6%"),
        backgroundColor: "#fff",
        borderRadius: wp("6%"),
        padding: wp("1.5%"),
        elevation: 5,
    },
    heading: {
        fontSize: wp("5%"),
        textAlign: "center",
        marginVertical: hp("2%"),
        fontFamily: "Poppins-Bold",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        columnGap: wp("2.5%"),
        rowGap: hp("1.5%"),
    },
    option: {
        width: "47%",
        borderRadius: wp("4%"),
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("2%"),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#ddd",
        borderWidth: 1,
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
    },
    emoji: {
        fontSize: wp("5%"),
        marginRight: wp("2%"),
    },
    optionText: {
        fontSize: wp("3.5%"),
        color: "#000",
        flexShrink: 1,
    },
    selectedOption: {
        borderWidth: 1,
        borderColor: "#6C63FF",
        backgroundColor: "#fff",
    },
    selectedText: {
        color: "#000",
        fontWeight: "600",
    },
    selectedCircle: {
        width: wp("3.5%"),
        height: wp("3.5%"),
        borderRadius: wp("4%"),
        borderWidth: 2,
        borderColor: "#6C63FF",
        backgroundColor: "transparent",
    },
    confirmBtn: {
        backgroundColor: "#6C63FF",
        borderRadius: wp("4%"),
        paddingVertical: hp("1.5%"),
        marginVertical: hp("2%"),
        alignItems: "center",
    },
    confirmText: {
        color: "#fff",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
});
