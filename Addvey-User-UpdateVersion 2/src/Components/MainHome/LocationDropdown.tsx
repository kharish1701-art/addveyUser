import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import MapView, { Marker } from "../../Components/OlaMaps";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLocationContext, LocationData } from "../../context/LocationContext";
import { selectLocationById } from "../../api/getApi/getApi";

const LocationDropdown: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { recentLocations, updateCurrentLocation, removeRecentLocation, loadRecentLocations, currentLocation } = useLocationContext();

  const [region, setRegion] = useState({
    latitude: currentLocation?.lat || 17.4933,
    longitude: currentLocation?.long || 78.3997,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [currentAddress, setCurrentAddress] = useState(
    currentLocation?.fullAddress || "Select a location"
  );

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    loadRecentLocations();
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.lat,
        longitude: currentLocation.long,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setCurrentAddress(currentLocation.fullAddress);
    }
  }, [currentLocation]);


  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    let location = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);

    // Reverse Geocoding to get address
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const address = `${place.name || ''}, ${place.street || ''}, ${place.city || ''}, ${place.region || ''}, ${place.postalCode || ''}, ${place.country || ''}`;
        const fullAddress = address.replace(/, ,/g, ',').replace(/^, /, '');

        const newLocationData: LocationData = {
          id: Math.random().toString(), // Helper ID until saved properly
          lat: location.coords.latitude,
          long: location.coords.longitude,
          fullAddress: fullAddress,
          city: place.city || place.region
        };

        updateCurrentLocation(newLocationData);
        if (route.params?.onLocationSelect) {
          route.params.onLocationSelect(newLocationData);
        }
        navigation.goBack();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openDeleteModal = (item: any) => {
    setSelectedLocation(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedLocation?.id) {
      await removeRecentLocation(selectedLocation.id);
      setDeleteModalVisible(false);
    }
  }

  const handleSelectLocation = async(item: LocationData) => {
    console.log('first')
  await selectLocationById(item?.id);
    if (route.params?.onLocationSelect) {
      route.params.onLocationSelect(item);
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={wp("7%")}
            color="black"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a location</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={wp("5%")}
          color="#999"
          style={{ marginRight: wp("2%") }}
        />
        <TextInput
          placeholder="Search for area, street name..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          onFocus={() => navigation.navigate("LocationAutoComplete")}
        />
      </View>

      {/* Scrollable Section */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: hp("30%") }}
        showsVerticalScrollIndicator={false}
      >
        {/* Use Current Location */}
        <TouchableOpacity
          style={styles.useLocationContainer}
          onPress={getCurrentLocation}
        >
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <MaterialIcons
                name="location-on"
                size={wp("4%")}
                color="red"
                style={{ marginRight: wp("2%") }}
              />
              <Text style={styles.useCurrentText}>Use current location</Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={wp("5%")}
              color="#000000"
            />
          </View>

          <Text style={styles.addressSub}>{currentAddress}</Text>
        </TouchableOpacity>

        <Text style={styles.recentTitle}>RECENT LOCATIONS</Text>

        {/* Recent Locations */}
        {recentLocations.map((item, index) => (
          <TouchableOpacity key={index} style={styles.recentCard} onPress={() => handleSelectLocation(item)}>
            <View style={styles.rowCenter}>
              <MaterialIcons
                name="location-on"
                size={wp("4%")}
                color="red"
                style={{ marginRight: wp("2%") }}
              />
              <Text style={styles.placeName}>{item.city || "Unknown"}</Text>
            </View>

            <Text style={styles.placeAddress} numberOfLines={2}>{item.fullAddress}</Text>

            {/* Icons Row */}
            <View style={styles.iconsRowNew}>
              <TouchableOpacity
                style={styles.iconBox}
                onPress={() => openDeleteModal(item)}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={wp("4%")}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        {recentLocations.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 10 }}>No recent locations found</Text>
        )}
      </ScrollView>

      {/* Map Section */}
      <View style={styles.mapWrapper}>
        <MapView style={styles.map} region={region}>
          <Marker coordinate={region} />
        </MapView>

        <TouchableOpacity
          style={styles.locateButton}
          onPress={() => navigation.navigate("LocationManualyScreen")}
        >
          <MaterialIcons
            name="location-on"
            size={wp("5%")}
            color="red"
            style={{ marginRight: wp("2%") }}
          />
          <Text style={styles.locateText}>Locate on Map</Text>
        </TouchableOpacity>
      </View>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete this address?
            </Text>

            <Text style={styles.modalAddress}>{selectedLocation?.fullAddress}</Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                <Text style={styles.deleteText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LocationDropdown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: wp("4.5%"),
    color: "#111",
    marginLeft: wp("2%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: wp("4%"),
    borderWidth: 1,
    borderColor: "#00000033",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp(0.4),
  },
  searchInput: {
    flex: 1,
    fontSize: wp("3.8%"),
    color: "#00000099",
  },
  useLocationContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: wp("5%"),
    marginHorizontal: wp("4%"),
    marginTop: hp("2%"),
    padding: wp("3%"),
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(0.8),
  },
  useCurrentText: {
    fontSize: wp("3.8%"),
    color: "#6C63FF",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
  },
  addressSub: {
    fontSize: wp("3%"),
    color: "#00000099",
    marginTop: hp("0.3%"),
    marginLeft: wp("1%"),
    fontFamily: "Poppins-Medium",
  },
  recentTitle: {
    fontSize: wp("3.5%"),
    color: "#000000",
    textAlign: "center",
    marginTop: hp("2.5%"),
    marginBottom: hp("2%"),
    fontFamily: "Poppins-Medium",
  },
  recentCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: wp("5%"),
    marginHorizontal: wp("5%"),
    marginBottom: hp("1%"),
    padding: wp("3%"),
  },
  placeName: {
    fontSize: wp("3.8%"),
    color: "black",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
  },
  placeAddress: {
    flex: 1,
    fontSize: wp("2.8%"),
    color: "#00000099",
    marginTop: hp("0.5%"),
    marginLeft: wp("1%"),
    fontFamily: "Poppins-Medium",
    marginRight: wp(20),
  },
  iconsRowNew: {
    flexDirection: "row",
    marginTop: hp("1%"),
    marginLeft: wp("1%"),
  },
  iconBox: {
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: wp("10%"),
    padding: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
  mapWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: hp("18%"),
    borderTopLeftRadius: wp("7%"),
    borderTopRightRadius: wp("7%"),
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locateButton: {
    position: "absolute",
    top: hp("2%"),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: wp(4),
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("0.8%"),
    elevation: 3,
  },
  locateText: {
    fontSize: wp(3.8),
    color: "#4F46E5",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.3),
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    padding: wp("6%"),
    borderRadius: wp("4%"),
    elevation: 5,
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontFamily: "Poppins-Bold",
    color: "#000",
    textAlign: "left",
  },
  modalAddress: {
    fontSize: wp("3.2%"),
    color: "#555",
    textAlign: "left",
    marginTop: hp("0.5%"),
    marginBottom: hp("2%"),
    fontFamily: "Poppins-Medium",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },
  cancelBtn: {
    width: "48%",
    paddingVertical: hp("1%"),
    backgroundColor: "#eee",
    borderRadius: wp("3%"),
    alignItems: "center",
  },
  deleteBtn: {
    width: "48%",
    paddingVertical: hp("1%"),
    backgroundColor: "#6C63FF",
    borderRadius: wp("4%"),
    alignItems: "center",
  },
  cancelText: {
    fontSize: wp("3.5%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.2),
  },
  deleteText: {
    fontSize: wp("3.5%"),
    color: "#fff",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.2),
  },
});
