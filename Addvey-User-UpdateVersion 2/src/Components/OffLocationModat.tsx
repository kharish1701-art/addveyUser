


import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useLocationContext, LocationData } from '../context/LocationContext';
import { Linking, Platform, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { markLocationSelected } from '../Screens/HomeScreen';

const LocationPermissionModal = ({ isModalVisible, toggleModal }) => {
  const { recentLocations, updateCurrentLocation } = useLocationContext();
  const navigation = useNavigation<any>();

  const openSettings = () => {
    
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleLocationSelect = async (location: LocationData) => {
    await updateCurrentLocation(location);
    toggleModal();
  };

  const handleManualSearch = () => {
    markLocationSelected()
    toggleModal();
    navigation.navigate("LocationDropdown", { from: "home" });
  };


  const hasSavedLocations = recentLocations && recentLocations.length > 0;

  return (
    <Modal
      transparent={true}
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={toggleModal}
    >
      <View style={styles.swiperModalOverlay}>
        {/* Close Button only if saved locations exist (optional, logic based on design) 
            Actually existing design has close button for both.
        */}
        
        <TouchableOpacity
          style={styles.swiperModalCloseOutside}
          onPress={toggleModal}
        >
          <Ionicons name="close" size={20} color="black" />
        </TouchableOpacity>

        {/* Modal Content */}
        {!hasSavedLocations ? (
          // STATE 1: No Saved Locations
          <View style={styles.swiperModalContent}>
            <TouchableOpacity
              style={styles.swiperModalCloseOutside}
              onPress={toggleModal}
            >
              {/* <Ionicons name="close" size={20} color="black" /> */}
            </TouchableOpacity>
            <Image
              source={require("../../assets/images/locationbottom.png")}
              style={styles.swiperModalImage}
            />
            <Text style={styles.swiperModalTitle}>
              Device location not enabled
            </Text>
            <Text style={styles.swiperModalSubtitle}>
              Enable your device location for a better buying experience.
            </Text>
            <TouchableOpacity style={styles.swiperModalBtn} onPress={openSettings}>
              <Text style={styles.swiperModalBtnText}>
                Enable location permission
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.swiperModalBtn, styles.swiperModalBtnOutline]}
              onPress={handleManualSearch}
            >
              <Text style={[styles.swiperModalBtnText, { color: "#6C63FF" }]}>
                Search location manually
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // STATE 2: With Saved Locations
          <View style={styles.savedLocationsContent}>
            <TouchableOpacity
              style={styles.closeButtonList}
              onPress={toggleModal}
            >
              {/* <Ionicons name="close" size={20} color="#000" /> */}
            </TouchableOpacity>

            {/* Banner */}
            <View style={styles.bannerContainer}>
              <View style={styles.bannerLeft}>
                <View style={styles.bannerIconContainer}>
                  <MaterialIcons name="location-off" size={20} color="#FF0000" />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.bannerTitle}>Location permission if off</Text>
                  <Text style={styles.bannerSubtitle}>Enable your location permission for a better</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bannerBtn} onPress={openSettings}>
                <Text style={styles.bannerBtnText}>Enable</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              <View style={styles.listHeaderRow}>
                <Text style={styles.savedLocationsTitle}>Select a saved location</Text>
                <TouchableOpacity onPress={() => navigation.navigate("LocationDropdown")}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: hp(30) }} showsVerticalScrollIndicator={false}>
                {recentLocations.slice(0, 3).map((loc, index) => (
                  <TouchableOpacity
                    key={loc.id || index}
                    style={styles.locationItem}
                    onPress={() => handleLocationSelect(loc)}
                  >
                    <View style={styles.locationIconContainer}>
                      <MaterialIcons name="location-pin" size={24} color="#FF0000" />
                    </View>
                    <View style={styles.locationTextContainer}>
                      <Text style={styles.locationName} numberOfLines={1}>{loc.city || "Unknown"}</Text>
                      <Text style={styles.locationAddress} numberOfLines={2}>{loc.fullAddress}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Manual Search Input Lookalike */}
            <TouchableOpacity
              style={styles.manualSearchInputContainer}
              onPress={handleManualSearch}
            >
              <Ionicons name="search" size={20} color="#999" />
              <Text style={styles.manualSearchPlaceholder}>Enter location manually</Text>
            </TouchableOpacity>

          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  swiperModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  swiperModalCloseOutside: {
    // position: "absolute",
    // top: hp(44),
    right: wp(3),
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: wp(14),
    padding: 8,
    alignSelf:'flex-end',
    marginBottom:5
  },
  swiperModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: wp(5),
    alignItems: "center",
  },
  swiperModalImage: {
    width: wp(30),
    height: wp(30),
    resizeMode: "contain",
    marginBottom: hp(2),
  },
  swiperModalTitle: {
    fontSize: wp(3.8),
    textAlign: "center",
    marginBottom: hp(0.5),
    fontFamily: "Poppins-Medium",
  },
  swiperModalSubtitle: {
    fontSize: wp(3),
    textAlign: "center",
    marginBottom: hp(3),
    fontFamily: "Poppins-Regular",
    paddingHorizontal: wp(10),
    color: "#00000080",
  },
  swiperModalBtn: {
    width: "100%",
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.8),
    marginBottom: hp(1.5),
    borderRadius: 16,
    alignItems: "center",
  },
  swiperModalBtnText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
  },
  swiperModalBtnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EAEAEA" // Added border for better visibility if needed, per design usually
  },

  // Saved Locations Styles
  savedLocationsContent: {
    backgroundColor: "#F5F5F5", // Light gray bg
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: wp(4),
    paddingBottom: hp(5),
    width: '100%',
  },
  closeButtonList: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    marginBottom: 10,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: wp(3),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIconContainer: {
    // width: 30, height: 30, justifyContent: 'center', alignItems: 'center'
  },
  bannerTitle: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins-Bold'
  },
  bannerSubtitle: {
    fontSize: wp(2.5),
    color: '#666',
    maxWidth: wp(45),
    fontFamily: 'Poppins-Regular'
  },
  bannerBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '600',
    fontFamily: 'Poppins-Medium'
  },
  listContainer: {
    marginBottom: hp(2),
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  savedLocationsTitle: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins-Bold'
  },
  seeAllText: {
    fontSize: wp(3.5),
    color: '#6C63FF',
    fontFamily: 'Poppins-Medium'
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: wp(3),
    marginBottom: hp(1),
  },
  locationIconContainer: {
    marginRight: wp(3),
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
    fontFamily: 'Poppins-Bold'
  },
  locationAddress: {
    fontSize: wp(3),
    color: '#666',
    fontFamily: 'Poppins-Regular'
  },
  manualSearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: wp(3.5),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  manualSearchPlaceholder: {
    marginLeft: wp(2),
    color: '#666',
    fontSize: wp(3.8),
    fontFamily: 'Poppins-Regular'
  }
});

export default LocationPermissionModal;