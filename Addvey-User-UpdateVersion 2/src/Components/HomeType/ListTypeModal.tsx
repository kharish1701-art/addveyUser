import React, { useState } from "react";
import {
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

interface ListTypeModalProps {
    onClose: () => void;
    onSelect: (type: string[]) => void;
    selectedValues?: string[];
}

const ListTypeModal: React.FC<ListTypeModalProps> = ({ onClose, onSelect, selectedValues }) => {
    // Initialize with prop or empty
    const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValues || []);

    // Sync state if prop changes
    React.useEffect(() => {
        if (selectedValues) {
            setSelectedOptions(selectedValues);
        }
    }, [selectedValues]);

    const options = [
        "Sell",
        "Rent",
        "Lease",
        "Wanted",
    ];

    const toggleSelection = (item: string) => {
        setSelectedOptions(prev => {
            if (prev.includes(item)) {
                return prev.filter(i => i !== item);
            } else {
                return [...prev, item];
            }
        });
    };

    return (
        <View style={styles.overlay}>
            {/* Close Icon Outside Modal */}
            <TouchableOpacity style={styles.closeIconContainer} onPress={onClose}>
                <Ionicons name="close" size={wp("6.5%")} color="#000" />
            </TouchableOpacity>

            {/* Modal Content */}
            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>List type</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Options */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {options.map((item) => {
                        const isSelected = selectedOptions.includes(item);
                        return (
                            <TouchableOpacity
                                key={item}
                                style={styles.optionRow}
                                onPress={() => toggleSelection(item)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                                <View
                                    style={[
                                        styles.radioCircle,
                                        isSelected && styles.radioSelected,
                                    ]}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => setSelectedOptions([])}>
                        <Text style={styles.clearAll}>Clear All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyBtn} onPress={() => {
                        // Pass joined string or array. The interface says (type: string). 
                        // Let's change the interface in a separate step or just join here if callers expect string.
                        // Actually I should update the interface first.
                        // But for now, to avoid breaking callers immediately, I will join them?
                        // No, better to update callers.
                        // For this tool call, I'll pass ANY to skip TS check temporarily or update call signature in same file.
                        onSelect(selectedOptions as any);
                        onClose()
                    }}>
                        <Text style={styles.applyText}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
};

export default ListTypeModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    closeIconContainer: {
        // position: "absolute",
        // top: hp("32%"),
        // right: wp("3%"),
        alignSelf: "flex-end",
        marginRight: 10,
        marginBottom: 5,
        zIndex: 999,
        backgroundColor: "#fff",
        borderRadius: wp("10%"),
        padding: wp("2%"),
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: wp("5%"),
        borderTopRightRadius: wp("5%"),
        paddingHorizontal: wp("5%"),
        paddingTop: hp("2%"),
        paddingBottom: hp("3%"),
        maxHeight: hp("80%"),
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: hp("1.5%"),
    },
    headerTitle: {
        fontSize: wp("5%"),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginBottom: hp("1%"),
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp(3)
    },
    optionText: {
        fontSize: wp("3.5%"),
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    optionTextSelected: {
        fontWeight: "bold",
    },
    radioCircle: {
        width: wp("4%"),
        height: wp("4%"),
        borderRadius: wp("2%"),
        borderWidth: 1,
        borderColor: "#999",
    },
    radioSelected: {
        borderColor: "#7E5FFF",
        borderWidth: 3,
        backgroundColor: "#fff",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp("2%"),
        paddingHorizontal: wp(3)
    },
    clearAll: {
        color: "#FF0303",
        fontSize: wp("3.8%"),
        fontFamily: 'Poppins-Medium'
    },
    applyBtn: {
        backgroundColor: "#6C63FF",
        borderRadius: wp("4%"),
        paddingVertical: hp("1.2%"),
        paddingHorizontal: wp("8%"),
    },
    applyText: {
        color: "#fff",
        fontFamily: 'Poppins-Medium',
        fontSize: wp("3.5%"),
    },
});
