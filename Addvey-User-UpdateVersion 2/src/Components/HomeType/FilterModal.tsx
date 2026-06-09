import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface FilterModalProps {
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterState>) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  category: string[];
  vehicleType: string[];
  budget: { min: number; max: number };
  brands: string[];
  years: string[];
  transmission: string[];
  fuel: string[];
  others: string[];
  attributes: {
    [key: string]: string;
  };
  superSubCategory?: string;
  type?: string;
  languages?: string[];
  vendorId?: string;
}

// Dynamic filter configuration
const FILTER_CONFIG = {
  category: {
    title: "Category",
    key: "category",
    options: [
      "Vehicles",
      "Properties",
      "Mobiles",
      "Electronics",
      "Appliances",
      "Furniture",
      "Fashion",
      "Hobbies & More",
      "Farming",
      "Pets",
    ],
    urlBuilder: (values: string[]) => values.join(","),
  },
  vehicleType: {
    title: "List Type",
    key: "type",
    options: ['sell', 'rent', 'lease', 'wanted'],
    urlBuilder: (values: string[]) => values.join(","),
  },
  budget: {
    title: "By Budget",
    key: "price",
    isRange: true,
  },
};

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 30 });

  // Initialize with existing filters
  useEffect(() => {
    console.log("Initial filters:", initialFilters);
    if (initialFilters) {
      const newSelected: { [key: string]: boolean } = {};

      // Initialize category filters
      if (initialFilters.category) {
        initialFilters.category.forEach((value) => {
          newSelected[value] = true;
        });
      }

      // Initialize vehicleType filters
      if (initialFilters.vehicleType) {
        initialFilters.vehicleType.forEach((value) => {
          newSelected[value] = true;
        });
      }

      setSelected(newSelected);

      if (initialFilters.budget) {
        setBudgetRange(initialFilters.budget);
      }
    }
  }, [initialFilters]);

  const toggleSelection = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearAll = () => {
    setSelected({});
    setBudgetRange({ min: 0, max: 30 });
  };

  const buildFilterUrl = (): string => {
    const params: string[] = [];

    // Build URL parameters from selected filters
    Object.entries(FILTER_CONFIG).forEach(([category, config]) => {
      // Type guard to check if config has options
      const hasOptions = 'options' in config;
      if (hasOptions) {
        // Safe to access config.options and config.urlBuilder because we checked options exists
        // However, TS inference on union is tricky. We can cast config.
        const listConfig = config as { key: string; options: string[]; urlBuilder: (val: string[]) => string };
        const selectedValues = listConfig.options.filter((opt) => selected[opt]);
        if (selectedValues.length > 0 && listConfig.urlBuilder) {
          const paramValue = listConfig.urlBuilder(selectedValues);
          params.push(`${listConfig.key}=${encodeURIComponent(paramValue)}`);
        }
      } else if (category === "budget") {
        if (budgetRange.min > 0 || budgetRange.max < 30) {
          params.push(`minPrice=${budgetRange.min * 1000}`);
          params.push(`maxPrice=${budgetRange.max * 100000}`);
        }
      }
    });

    return params.length > 0 ? `?${params.join("&")}` : "";
  };

  const handleApplyFilters = () => {
    // Construct FilterState from selected options
    const newFilters: Partial<FilterState> = {};

    // Process categories
    const selectedCategories = FILTER_CONFIG.category.options.filter(opt => selected[opt]);
    if (selectedCategories.length > 0) {
      newFilters.category = selectedCategories;
    } else {
      newFilters.category = [];
    }

    // Process vehicleType (List Type)
    const selectedTypes = FILTER_CONFIG.vehicleType.options.filter(opt => selected[opt]);
    if (selectedTypes.length > 0) {
      newFilters.vehicleType = selectedTypes;
    } else {
      newFilters.vehicleType = [];
    }

    // Process budget
    newFilters.budget = budgetRange;

    console.log("Applying filters:", newFilters);
    onApplyFilters(newFilters);
  };

  const getSelectedCount = (): number => {
    let count = Object.values(selected).filter(Boolean).length;
    if (budgetRange.min > 0 || budgetRange.max < 30) count++;
    return count;
  };

  const renderOption = (
    title: string,
    options: string[],
    hideTitle?: boolean
  ) => (
    <View style={styles.section}>
      {!hideTitle && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionBox, selected[opt] && styles.optionBoxActive]}
            onPress={() => toggleSelection(opt)}
          >
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionText,
                  selected[opt] && styles.optionTextActive,
                ]}
              >
                {opt}
              </Text>
              {selected[opt] && (
                <Ionicons
                  name="close"
                  size={wp("3.5%")}
                  color="#FF0303"
                  style={{ marginLeft: wp("1.5%") }}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBudgetSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>By Budget</Text>

      <View style={styles.budgetSliderContainer}>
        <Text style={styles.budgetLabel}>
          Budget Range: ₹ {budgetRange.min}K - ₹ {budgetRange.max}L
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={30}
          step={1}
          minimumTrackTintColor="#4A46FE"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#4A46FE"
          value={budgetRange.max}
          onValueChange={(value) =>
            setBudgetRange((prev) => ({ ...prev, max: value }))
          }
        />
      </View>

      <View style={styles.budgetRow}>
        <Text style={styles.budgetText}>₹ {budgetRange.min}K</Text>
        <Text style={styles.budgetText}>₹ {budgetRange.max}L</Text>
      </View>
    </View>
  );

  // Get selected filters for display
  const getSelectedFilters = () => {
    const selectedFilters = [];

    Object.entries(FILTER_CONFIG).forEach(([category, config]) => {
      const hasOptions = 'options' in config;
      if (hasOptions) {
        const listConfig = config as { title: string; options: string[] };
        const selectedValues = listConfig.options.filter((opt) => selected[opt]);
        if (selectedValues.length > 0) {
          selectedFilters.push({
            category: listConfig.title,
            values: selectedValues
          });
        }
      }
    });

    if (budgetRange.min > 0 || budgetRange.max < 30) {
      selectedFilters.push({
        category: "Budget",
        values: [`₹ ${budgetRange.min}K - ₹ ${budgetRange.max}L`]
      });
    }

    return selectedFilters;
  };

  const selectedFilters = getSelectedFilters();

  return (
    <View style={styles.modalContainer}>
      {/* Close Icon Outside */}
      <TouchableOpacity style={styles.outsideCloseIcon} onPress={onClose}>
        <Ionicons name="close" size={wp("6%")} color="#000" />
      </TouchableOpacity>

      {/* Modal Content */}
      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filter</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Filters Summary */}
        {selectedFilters.length > 0 && (
          <View style={styles.selectedFiltersContainer}>
            <Text style={styles.selectedFiltersTitle}>Selected Filters:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.selectedFiltersRow}>
                {selectedFilters.map((filterGroup, index) =>
                  filterGroup.values.map((value, valueIndex) => (
                    <View key={`${index}-${valueIndex}`} style={styles.selectedFilterChip}>
                      <Text style={styles.selectedFilterText}>{value}</Text>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Category */}
          {renderOption("Select Category", FILTER_CONFIG.category.options)}

          {/* List Type */}
          {renderOption("List Type", FILTER_CONFIG.vehicleType.options)}

          {/* Budget Section */}
          {renderBudgetSection()}

          {/* Results Button */}
          <TouchableOpacity
            style={styles.resultsButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.resultsText}>
              {getSelectedCount() > 0
                ? `Apply ${getSelectedCount()} Filter${getSelectedCount() > 1 ? 's' : ''}`
                : "Show All Results"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  outsideCloseIcon: {
    alignSelf: 'flex-end',
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: wp(10),
    padding: 5,
    marginRight: 10,
    marginBottom: 10
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp("5%"),
    borderTopRightRadius: wp("5%"),
    maxHeight: hp("85%"),
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("3%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  title: {
    fontSize: wp("4%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  clearText: {
    fontSize: wp("3.5%"),
    color: "#FF0303CC",
    fontFamily: "Poppins-Medium",
  },
  selectedFiltersContainer: {
    backgroundColor: "#f8f8f8",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    marginBottom: hp("2%"),
  },
  selectedFiltersTitle: {
    fontSize: wp("3.2%"),
    color: "#666",
    fontFamily: "Poppins-Medium",
    marginBottom: hp("1%"),
  },
  selectedFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("2%"),
  },
  selectedFilterChip: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("2%"),
  },
  selectedFilterText: {
    color: "#fff",
    fontSize: wp("2.8%"),
    fontFamily: "Poppins-Medium",
  },
  section: {
    marginTop: hp("2%"),
  },
  sectionTitle: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "#000",
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("2%"),
  },
  optionBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp("3%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("3%"),
    backgroundColor: "#fff",
    marginBottom: wp("1%"),
  },
  optionBoxActive: {
    borderColor: "#4A46FE",
    backgroundColor: "#f0f0ff",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: wp("2.8%"),
    color: "#555",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
  },
  optionTextActive: {
    color: "#4A46FE",
    fontWeight: "600",
  },
  budgetSliderContainer: {
    marginBottom: hp("1%"),
  },
  budgetLabel: {
    fontSize: wp("3.5%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginBottom: hp("0.5%"),
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: hp("4%"),
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp("0.5%"),
  },
  budgetText: {
    fontSize: wp("3.8%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  resultsButton: {
    backgroundColor: "#6C63FF",
    borderRadius: wp("5%"),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.5%"),
    marginTop: hp("3%"),
  },
  resultsText: {
    fontSize: wp("3.5%"),
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
});

export default FilterModal;
