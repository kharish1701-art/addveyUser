import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Slider from "@react-native-community/slider";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
    // State for filters
    const [selectedCategory, setSelectedCategory] = useState("Car");
    const [budget, setBudget] = useState([0, 3]); // 0 to 5 Lakhs+? Using simple range for now.
    const [selectedBrand, setSelectedBrand] = useState<string[]>(["TATA"]);
    const [selectedYear, setSelectedYear] = useState<string[]>(["Under 5 years"]);
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
    const [selectedTransmission, setSelectedTransmission] = useState<string[]>(["Manual"]);
    const [selectedFuel, setSelectedFuel] = useState<string[]>(["Electric"]);
    const [selectedKm, setSelectedKm] = useState<string[]>(["25,000 KM - 50,000 KM"]);
    const [selectedOthers, setSelectedOthers] = useState<string[]>(["Verified"]);

    const categories = ["Car", "Bike", "Commercial vehicles"];
    const brands = ["TATA", "MARUTI SUZUKI", "TOYOTA", "HYUNDAI"];
    const years = ["Under 3 Years", "Under 5 years", "Under 7 Years +"];
    const owners = ["1st", "2nd", "3rd", "4+"];
    const transmission = ["Automatic", "Manual"];
    const fuel = ["Electric", "Diesel", "Petrol", "CNG & Hybrids", "LPG"];
    const kmDriven = ["< 25,000 KM", "25,000 KM - 50,000 KM", "50,000 KM - 75,000 KM"];
    const others = ["Verified", "Without EMI", "On EMI", "With Insurance"];


    const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const renderChip = (label: string, isSelected: boolean, onPress: () => void) => (
        <TouchableOpacity
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={onPress}
        >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {label}
            </Text>
            {isSelected && (
                <Ionicons name="close" size={12} color="#FF0303" style={{ marginLeft: 4 }} />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Filter</Text>
                    <TouchableOpacity onPress={() => {
                        setSelectedBrand([]);
                        setSelectedYear([]);
                        setSelectedOwners([]);
                        setSelectedTransmission([]);
                        setSelectedFuel([]);
                        setSelectedKm([]);
                        setSelectedOthers([]);
                    }}>
                        <Text style={styles.clearAll}>Clear All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Categories */}
                    <View style={styles.section}>
                        <View style={styles.chipRow}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.catChip, selectedCategory === cat && styles.catChipSelected]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextSelected]}>{cat}</Text>
                                    {selectedCategory === cat && <Ionicons name="close" size={14} color="#FF5200" style={{ marginLeft: 4 }} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Budget Slider */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>By Budget</Text>
                        <View style={styles.sliderContainer}>
                            {/* Placeholder for dual slider using simple slider for demo or library */}
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={0}
                                maximumValue={10}
                                minimumTrackTintColor="#6C63FF"
                                maximumTrackTintColor="#000000"
                                thumbTintColor="#000"
                                step={1}
                            />
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>₹ 0 k</Text>
                                <Text style={styles.sliderLabel}>₹ 3.0 L+</Text>
                            </View>
                        </View>
                    </View>

                    {/* By Brand */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>By Brand</Text>
                        <View style={styles.chipRow}>
                            {brands.map((brand) => (
                                renderChip(brand, selectedBrand.includes(brand), () => toggleSelection(brand, selectedBrand, setSelectedBrand))
                            ))}
                        </View>
                    </View>

                    {/* By Year */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>By Year</Text>
                        <View style={styles.chipRow}>
                            {years.map((year) => (
                                renderChip(year, selectedYear.includes(year), () => toggleSelection(year, selectedYear, setSelectedYear))
                            ))}
                        </View>
                    </View>

                    {/* By No. of Owners */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>By No. of Owners</Text>
                        <View style={styles.chipRow}>
                            {owners.map((owner) => (
                                renderChip(owner, selectedOwners.includes(owner), () => toggleSelection(owner, selectedOwners, setSelectedOwners))
                            ))}
                        </View>
                    </View>

                    {/* By Transmission */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>By Transmission</Text>
                        <View style={styles.chipRow}>
                            {transmission.map((t) => (
                                renderChip(t, selectedTransmission.includes(t), () => toggleSelection(t, selectedTransmission, setSelectedTransmission))
                            ))}
                        </View>
                    </View>

                    {/* By Fuel */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>By Fuel</Text>
                        <View style={styles.chipRow}>
                            {fuel.map((f) => (
                                renderChip(f, selectedFuel.includes(f), () => toggleSelection(f, selectedFuel, setSelectedFuel))
                            ))}
                        </View>
                    </View>

                    {/* By KM Driven */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>By KM Driven</Text>
                        <View style={styles.chipRow}>
                            {kmDriven.map((km) => (
                                renderChip(km, selectedKm.includes(km), () => toggleSelection(km, selectedKm, setSelectedKm))
                            ))}
                        </View>
                    </View>

                    {/* Others */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Others</Text>
                        <View style={styles.chipRow}>
                            {others.map((o) => (
                                renderChip(o, selectedOthers.includes(o), () => toggleSelection(o, selectedOthers, setSelectedOthers))
                            ))}
                        </View>
                    </View>

                    <View style={{ height: 100 }} />

                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    {/* Summary Chips if needed */}
                    <View style={styles.footerSummary}>
                        {/* <ScrollView horizontal>
                            {selectedBrand.map(b => <View key={b} style={styles.miniChip}><Text style={styles.miniChipText}>{b}</Text><Ionicons name="close" size={10} color="red"/></View>)}
                         </ScrollView> */}
                    </View>
                    <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                        <Text style={styles.applyButtonText}>Show 10,000+ results</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: hp(5), // Full screen but slightly down? Or just full. Image shows somewhat full but maybe generic modal.
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: wp(4.5),
        fontWeight: "bold",
        fontFamily: 'Poppins-Bold'
    },
    clearAll: {
        color: "#FF0303",
        fontSize: wp(3.5),
        fontFamily: 'Poppins-Medium',
        marginRight: wp(20) // Push it left? "Filter" "Clear All" "X"
    },
    closeButton: {
        padding: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 20
    },
    scrollContent: {
        flex: 1,
        padding: wp(4),
    },
    section: {
        marginBottom: hp(2.5),
    },
    sectionTitle: {
        fontSize: wp(3.5),
        fontWeight: "600",
        marginBottom: hp(1.5),
        fontFamily: 'Poppins-Medium',
        color: '#000'
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chip: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.8),
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginRight: wp(2),
        marginBottom: hp(1),
        flexDirection: "row",
        alignItems: "center",
    },
    chipSelected: {
        borderColor: "#FF5200", // Or partial? Image has some X indicators
        backgroundColor: "#FFF0EB",
    },
    chipText: {
        fontSize: wp(3),
        color: "#333",
        fontFamily: 'Poppins-Regular'
    },
    chipTextSelected: {
        color: "#000",
        fontWeight: '500'
    },
    catChip: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.8),
        borderRadius: 20,
        marginRight: wp(2),
        marginBottom: hp(1),
        flexDirection: "row",
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee'
    },
    catChipSelected: {
        backgroundColor: '#fff',
        borderColor: '#FF5200'
    },
    catChipText: {
        fontSize: wp(3.2),
        color: '#888',
        fontFamily: 'Poppins-Medium'
    },
    catChipTextSelected: {
        color: '#FF5200',
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center'
    },
    sliderLabels: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    sliderLabel: {
        fontSize: wp(3),
        color: '#666'
    },
    footer: {
        padding: wp(4),
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff'
    },
    footerSummary: {
        flexDirection: 'row',
        marginBottom: 10
    },
    applyButton: {
        backgroundColor: '#6C63FF',
        borderRadius: 12,
        paddingVertical: hp(1.8),
        alignItems: 'center'
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: wp(4),
        fontFamily: 'Poppins-Medium'
    }
});
