// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     SafeAreaView,
//     TouchableOpacity,
//     ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useNavigation } from "@react-navigation/native";

// const FilterScreen = () => {
//     const navigation = useNavigation<any>();
//     const [selectedFilter, setSelectedFilter] = useState<string>("Last 30 days");

//     const filters = ["This week", "Last 30 days", "Last three months", "2024"];

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Top Bar Fixed */}
//             <View style={styles.topBar}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="arrow-back" size={hp("2.4%")} color="#000" />
//                 </TouchableOpacity>
//                 <Text style={styles.topBarTitle}>Filters</Text>
//             </View>

//             {/* Scrollable Content */}
//             <ScrollView
//                 style={styles.scrollArea}
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <Text style={styles.sectionTitle}>Filter by Notification time</Text>

//                 {filters.map((filter, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={styles.optionRow}
//                         onPress={() => setSelectedFilter(filter)}
//                         activeOpacity={0.7}
//                     >
//                         {/* Radio Button */}
//                         <View
//                             style={[
//                                 styles.radioOuter,
//                                 selectedFilter === filter && styles.radioOuterActive,
//                             ]}
//                         />
//                         <Text
//                             style={[
//                                 styles.optionText,
//                                 selectedFilter === filter && styles.selectedOptionText,
//                             ]}
//                         >
//                             {filter}
//                         </Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>

//             {/* Bottom Fixed Buttons */}
//             <View style={styles.bottomBar}>
//                 <TouchableOpacity activeOpacity={0.8}>
//                     <Text style={styles.clearBtn}>Clear All</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
//                     <Text style={styles.applyBtnText}>Apply Filters</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// export default FilterScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//     },
//     topBar: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: wp("4%"),
//         paddingVertical: hp("2%"),
//         borderBottomWidth: 1,
//         borderBottomColor: "#eee",
//         marginTop: hp(4),
//     },
//     topBarTitle: {
//         fontSize: hp("1.9%"),
//         marginLeft: wp("2%"),
//         fontFamily: "Poppins-Medium",
//         marginTop: hp(0.5),
//     },

//     scrollArea: {
//         flex: 1,
//     },
//     scrollContent: {
//         paddingHorizontal: wp("6%"),
//         paddingBottom: hp("10%"),
//     },
//     sectionTitle: {
//         fontSize: hp("1.7%"),
//         fontFamily: "Poppins-Regular",
//         marginBottom: hp("2%"),
//         color: "#000000",
//         marginTop: hp(2),
//         paddingHorizontal: wp(2)
//     },
//     optionRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: hp("2%"),
//         paddingHorizontal: wp(2)
//     },
//     radioOuter: {
//         width: wp("5%"),
//         height: wp("5%"),
//         borderRadius: wp("3%"),
//         borderWidth: 1,
//         borderColor: "#999",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: wp("3%"),
//     },
//     radioOuterActive: {
//         borderColor: "#6C63FF",
//         borderWidth: 4,
//     },
//     optionText: {
//         fontSize: hp("1.5%"),
//         color: "#444",
//     },
//     selectedOptionText: {
//         color: "#000",
//         fontFamily: 'Poppins-Medium',
//         marginTop: hp(0.3)
//     },

//     bottomBar: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: wp("9%"),
//         paddingVertical: hp("1.2%"),
//         borderTopWidth: 1,
//         borderTopColor: "#eee",
//     },
//     clearBtn: {
//         fontSize: hp("1.8%"),
//         color: "#FF0303",
//         fontFamily: "Poppins-Medium",
//         marginLeft: wp(2)
//     },
//     applyBtn: {
//         backgroundColor: "#6C63FF",
//         paddingVertical: hp("1%"),
//         paddingHorizontal: wp("10%"),
//         borderRadius: hp("1%"),
//     },
//     applyBtnText: {
//         color: "#fff",
//         fontSize: hp("1.7%"),
//         fontFamily: "Poppins-Medium",
//     },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";

const FilterScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Get the selected filter from params if available
  const { selectedFilter: initialFilter, onApplyFilter } = route.params || {};
  
  const [selectedFilter, setSelectedFilter] = useState<string>(
    initialFilter || "Last 30 days"
  );

  const filters = ["This week", "Last 30 days", "Last three months", "2024"];

  const handleApplyFilter = () => {
    if (onApplyFilter) {
      onApplyFilter(selectedFilter);
    }
    navigation.goBack();
  };

  const handleClearAll = () => {
    setSelectedFilter("Last 30 days");
    if (onApplyFilter) {
      onApplyFilter("Last 30 days");
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar Fixed */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={hp("2.4%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Filters</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Filter by Notification time</Text>

        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionRow}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.7}
          >
            {/* Radio Button */}
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  selectedFilter === filter && styles.radioOuterActive,
                ]}
              >
                {selectedFilter === filter && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>
            <Text
              style={[
                styles.optionText,
                selectedFilter === filter && styles.selectedOptionText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Fixed Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          onPress={handleClearAll} 
          activeOpacity={0.8}
        >
          <Text style={styles.clearBtn}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.applyBtn} 
          onPress={handleApplyFilter}
          activeOpacity={0.8}
        >
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FilterScreen;

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
    fontSize: hp("1.9%"),
    marginLeft: wp("2%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp("6%"),
    paddingBottom: hp("10%"),
  },
  sectionTitle: {
    fontSize: hp("1.7%"),
    fontFamily: "Poppins-Regular",
    marginBottom: hp("2%"),
    color: "#000000",
    marginTop: hp(2),
    paddingHorizontal: wp(2),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
    paddingHorizontal: wp(2),
  },
  radioContainer: {
    marginRight: wp("3%"),
  },
  radioOuter: {
    width: wp("6%"),
    height: wp("6%"),
    borderRadius: wp("3%"),
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterActive: {
    borderColor: "#6C63FF",
  },
  radioInner: {
    width: wp("3%"),
    height: wp("3%"),
    borderRadius: wp("1.5%"),
    backgroundColor: "#6C63FF",
  },
  optionText: {
    fontSize: hp("1.5%"),
    color: "#444",
    fontFamily: 'Poppins-Regular',
  },
  selectedOptionText: {
    color: "#000",
    fontFamily: 'Poppins-Medium',
    marginTop: hp(0.3),
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("9%"),
    paddingVertical: hp("1.2%"),
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  clearBtn: {
    fontSize: hp("1.8%"),
    color: "#FF0303",
    fontFamily: "Poppins-Medium",
    marginLeft: wp(2),
  },
  applyBtn: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("10%"),
    borderRadius: hp("1%"),
  },
  applyBtnText: {
    color: "#fff",
    fontSize: hp("1.7%"),
    fontFamily: "Poppins-Medium",
  },
});