import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

interface FloatingSelectInputProps {
    label: string;
    options?: string[];
    value: string;
    onSelect: (val: string) => void;
    keyboardType?: "default" | "numeric";
    isSelect?: boolean;
    rightIcon?: keyof typeof Ionicons.glyphMap;
}

const FloatingSelectInput: React.FC<FloatingSelectInputProps> = ({
    label,
    options = [],
    value,
    onSelect,
    keyboardType = "default",
    isSelect = true,
    rightIcon,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.container}>
            {/* Floating Label */}
            <View style={styles.labelWrapper}>
                <Text style={styles.label}>{label} *</Text>
            </View>

            {/* Input Field */}
            {isSelect ? (
                <TouchableOpacity
                    style={styles.inputBox}
                    activeOpacity={0.7}
                    onPress={() => options.length > 0 && setOpen(true)}
                >
                    <Text
                        style={[styles.inputText, !value && { color: "#999" }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {value || "Select..."}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#6C63FF" />
                </TouchableOpacity>
            ) : (
                <View style={styles.inputBoxBottom}>
                    <TextInput
                        style={styles.inputText}
                        placeholder={`Enter ${label}`}
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onSelect}
                        keyboardType={keyboardType}
                    />
                    {rightIcon && (
                        <Ionicons name={rightIcon} size={18} color="#555" />
                    )}
                </View>
            )}

            {/* Dropdown Modal */}
            <Modal visible={open} transparent animationType="slide">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.modalBox}>
                        <FlatList
                            data={options}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Text
                                        style={styles.optionText}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default FloatingSelectInput;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: hp(1.2),
    },
    labelWrapper: {
        position: "absolute",
        top: -10,
        left: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 4,
        zIndex: 1,
    },
    label: {
        fontSize: wp(2.5),
        color: "#666",
        marginTop: hp(0.4)
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    inputBoxBottom: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 2,
        paddingHorizontal: 12,
    },
    inputText: {
        fontSize: wp(3.4),
        color: "#000",
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalBox: {
        backgroundColor: "#fff",
        maxHeight: "50%",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    option: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
});
