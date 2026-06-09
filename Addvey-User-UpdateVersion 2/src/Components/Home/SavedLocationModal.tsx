import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface SavedLocationModalProps {
  visible: boolean;
  onClose: () => void;
  data?: any[];
  onLocationSelect?: (item: any) => void;
  EnableLocation?: () => void;
  onManualLocation?: () => void;
}

const SavedLocationModal = ({ data = [], visible, onClose, onLocationSelect, EnableLocation, onManualLocation }: SavedLocationModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={wp(6)} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBox}>
          <ScrollView style={{ maxHeight: hp(50) }} showsVerticalScrollIndicator={false}>
            <View style={styles.permissionBox}>
              <Image
                source={require("../../../assets/images/locationbottom.png")}
                style={styles.permissionIcon}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.permissionHeading}>
                  Location permission is off
                </Text>
                <Text style={styles.permissionSub}>
                  Enable your location permission for a better
                </Text>
              </View>

              <TouchableOpacity style={styles.enableBtnSmall} onPress={() => EnableLocation && EnableLocation()}>
                <Text style={styles.enableBtnSmallText}>Enable</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Select a saved location</Text>
              <Text style={styles.seeAll}>See all</Text>
            </View>

            {data?.map((item, index) => (
              <TouchableOpacity onPress={() => onLocationSelect && onLocationSelect(item)} key={index} style={styles.locationCard}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="location-sharp"
                    size={wp(4)}
                    color="#FF0303"
                    style={{ marginRight: wp(1) }}
                  />
                  <Text style={styles.locationName}>{item.city}</Text>
                </View>

                <Text style={styles.locationAddress} numberOfLines={2}>{item.fullAddress}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.inputBox} onPress={onManualLocation}>
              <Ionicons
                name="search"
                size={wp(5.5)}
                color="#999"
                style={{ marginRight: wp(2) }}
              />
              <Text style={{ ...styles.input, color: "#999", paddingTop: hp(0.5) }}>
                Enter location manually
              </Text>
              {/* <TextInput
                placeholder="Enter location manually"
                placeholderTextColor="#999"
                style={styles.input}
                editable={false}
              /> */}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  closeContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: wp(2),
    paddingBottom: hp(1),
  },

  closeBtn: {
    backgroundColor: "#fff",
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  modalBox: {
    width: "100%",
    backgroundColor: "#fffffff6",
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
    maxHeight: hp(80),
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
  },

  permissionBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(3),
    alignItems: "center",
    marginTop: hp(1),
  },

  permissionIcon: {
    width: wp(12),
    height: wp(12),
    marginRight: wp(3),
    resizeMode: "contain",
  },

  permissionHeading: {
    fontSize: wp(3.4),
    color: "#000",
    fontFamily: "Poppins-Bold",
  },

  permissionSub: {
    width: "95%",
    fontSize: wp(3),
    color: "#666",
    marginTop: hp(0.5),
    fontFamily: "Poppins-Medium",
  },

  enableBtnSmall: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(4),
    marginLeft: wp(2),
  },

  enableBtnSmallText: {
    color: "#fff",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.3),
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    marginBottom: hp(1),
  },

  sectionTitle: {
    fontSize: wp(4),
    color: "#000",
    fontFamily: "Poppins-Bold",
  },

  seeAll: {
    color: "#6C63FF",
    fontSize: wp(3.3),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.3),
  },

  locationCard: {
    backgroundColor: "#F7F7F7",
    padding: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(1.3),
  },

  locationName: {
    fontSize: wp(3.8),
    color: "#000",
    fontFamily: "Poppins-Bold",
    marginTop: hp(0.3),
  },

  locationAddress: {
    fontSize: wp(3.5),
    color: "#666",
    marginTop: hp(0.5),
    width: "100%",
    fontFamily: "Poppins-Medium",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    marginTop: hp(1.5),
    marginBottom: hp(3),
  },

  input: {
    fontSize: wp(3.5),
    color: "#000",
    flex: 1,
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
  },
});

export default SavedLocationModal;



// import React from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";

// interface SavedLocationModalProps {
//   visible: boolean;
//   onClose: () => void;
//   data: any[];
//   onLocationSelect: (location: any) => void;
//   onManualLocation: () => void;
// }

// const SavedLocationModal = ({ 
//   data = [], 
//   visible, 
//   onClose, 
//   onLocationSelect,
//   onManualLocation 
// }: SavedLocationModalProps) => {
//   return (
//     <Modal transparent visible={visible} animationType="slide">
//       <View style={styles.backdrop}>
//         <View style={styles.closeContainer}>
//           <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
//             <Ionicons name="close" size={wp(6)} color="#000" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.modalBox}>
//           <ScrollView style={{ maxHeight: hp(60) }} showsVerticalScrollIndicator={false}>
//             <View style={styles.permissionBox}>
//               <Image
//                 source={require("../../../assets/images/locationbottom.png")}
//                 style={styles.permissionIcon}
//               />

//               <View style={{ flex: 1 }}>
//                 <Text style={styles.permissionHeading}>
//                   Location permission is off
//                 </Text>
//                 <Text style={styles.permissionSub}>
//                   Enable your location permission for a better experience
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Select a saved location</Text>
//             </View>

//             {data?.map((item, index) => (
//               <TouchableOpacity 
//                 key={index} 
//                 style={styles.locationCard}
//                 onPress={() => onLocationSelect(item)}
//               >
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Ionicons
//                     name="location-sharp"
//                     size={wp(4)}
//                     color="#FF0303"
//                     style={{ marginRight: wp(1) }}
//                   />
//                   <Text style={styles.locationName}>{item.city}</Text>
//                 </View>

//                 <Text style={styles.locationAddress} numberOfLines={2}>
//                   {item.fullAddress}
//                 </Text>
//               </TouchableOpacity>
//             ))}

//             <TouchableOpacity 
//               style={styles.inputBox}
//               onPress={onManualLocation}
//             >
//               <Ionicons
//                 name="search"
//                 size={wp(5.5)}
//                 color="#999"
//                 style={{ marginRight: wp(2) }}
//               />
//               <Text style={styles.inputPlaceholder}>
//                 Enter location manually
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// };
