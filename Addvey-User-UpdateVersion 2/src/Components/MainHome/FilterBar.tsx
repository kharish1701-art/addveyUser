import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useHomeFilter } from "../../context/HomeFilterContext";
import { useNavigation } from "@react-navigation/native";

const buttons = [
  { id: "filter", label: "Filters" },
  { id: "category", label: "Category" },
  { id: "listType", label: "List Type" },
  { id: "distance", label: "Distance" },

  { id: "Language", label: "Language" },
  { id: "QuickResponse", label: "Quick Response" },
];

const FilterBar = ({
  hideFilterIcon = false,
}: {
  hideFilterIcon?: boolean;
}) => {
  const navigation = useNavigation<any>();
  const {
    selected,
    setSelected,
    setShowListTypeModal,
    setShowDistanceModal,
    setShowFilterModal,
    setShowLanguageModal,
    setFilterParams,
    filterParams,
    activeFilterCount,
    setShowCategoryModal,
  } = useHomeFilter();

  //   const handleButtonPress = (id: string) => {
  //     if (id === "listType") {
  //       setShowListTypeModal(true);
  //     } else if (id === "distance") {
  //       setShowDistanceModal(true);
  //     } else if (id === "filter") {
  //       setShowFilterModal(true);
  //     } else if (id === "Language") {
  //       setShowLanguageModal(true);
  //     } else if (id === "category") {
  //       setShowCategoryModal(true);
  //     } else if (id === "recent") {
  //       setFilterParams((prev) => ({
  //         ...prev,
  //         recent: prev.recent === "week" ? "" : "true",
  //       }));
  //       setSelected(id === selected ? id : id);
  //     } else {
  //       setSelected(id === selected ? id : id);
  //     }
  //   };

  const handleButtonPress = (id: string) => {
    switch (id) {
      case "listType":
        setShowListTypeModal(true);
        setSelected('');
        break;

      case "distance":
        setShowDistanceModal(true);
         setSelected('');
        break;

      case "filter":
        setShowFilterModal(true);
         setSelected('');
        break;

      case "Language":
        setShowLanguageModal(true);
         setSelected('');
        break;

      case "category":
        setShowCategoryModal(true);
         setSelected('');
        break;

      case "recent":
        setFilterParams(prev => ({
          ...prev,
          recent: prev.recent ? "" : "true",
        }));
        setSelected(id);
        break;

      case "QuickResponse":
        setFilterParams((prev) => ({
          ...prev,
          quickResponse: prev.quickResponse ? "" : "true",
        }));
        setSelected(id);
        break;

      default:
        setSelected(id);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.scrollView}
    >
      {buttons
        .filter((b) => !(hideFilterIcon && b.id === "filter"))
        .map((button) => (
          <TouchableOpacity
            key={button.id}
            onPress={() => handleButtonPress(button.id)}
            style={[
              styles.button,
              selected === button.id && styles.selectedButton,
              button.id === "filter" && styles.filterButton, // Special style for "Filter"
            ]}
          >
            {button.id === "filter" && (
              <Ionicons
                name="options-outline"
                size={wp(4)}
                color="black"
                style={{ marginRight: wp(1) }}
              />
            )}
            <Text
              style={[
                styles.buttonText,
                selected === button.id && styles.selectedButtonText,
                button.id === "filter" && { color: "black" },
              ]}
            >
              {button.label}
              {button.id === "filter" &&
                activeFilterCount > 0 &&
                ` (${activeFilterCount})`}
            </Text>
            {["category", "listType", "distance", "Language"].includes(
              button.id
            ) && (
                <Ionicons
                  name="chevron-down"
                  size={wp(3.5)}
                  color={selected === button.id ? "white" : "black"}
                  style={{ marginLeft: wp(1) }}
                />
              )}
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: hp(6),
  },
  scrollContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: wp(2),
    backgroundColor: "white",
  },
  selectedButton: {
    backgroundColor: "#E0E0E0",
    borderColor: "#E0E0E0",
  },
  filterButton: {
    backgroundColor: "#E0E0E0",
    borderColor: "#E0E0E0",
  },
  buttonText: {
    fontSize: wp(3),
    color: "#333",
    fontFamily: "Inter-Medium", // Assuming Inter-Medium is used, adjust if needed
  },
  selectedButtonText: {
    color: "white",
  },
});

export default FilterBar;
