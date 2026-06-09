// LocationDropdown.tsx
import React, { useEffect, useState, useCallback } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import MapView, { Marker } from "../Components/OlaMaps";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { EndPoints } from "../services/EndPoints";
// import { deleteApi, getApi, PostAPi } from "../api/getApi/getApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { OLA_MAPS_API_KEY } from "../api/authApi/BaseUrl";
import LoadingModal from "../Components/Loader";
import { useLocationContext, LocationData } from "../context/LocationContext";
import { selectLocationById } from "../api/getApi/getApi";
import { setSession } from "../services/session";

const LocationDropdown = () => {
  const {
    recentLocations,
    addRecentLocation,
    updateCurrentLocation,
    removeRecentLocation
  } = useLocationContext();

  const navigation = useNavigation<any>();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([]); // Replaced by recentLocations
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const [region, setRegion] = useState({
    latitude: 17.4933,
    longitude: 78.3997,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // 🚀 Load on mount
  useEffect(() => {
    // getDevice(); // No longer needed
    getCurrentLocation();
  }, []);

  // 📍 Get current location
  const getCurrentLocation = async () => {
    // markLocationSelected()
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));

      reverseGeocode(latitude, longitude);
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  // 🔄 Reverse geocode using Ola Maps
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${OLA_MAPS_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json?.results?.length) return;

      let result = json.results[0];
      setAddress(result?.formatted_address || "");

      let cityComponent = result?.address_components?.find((c) =>
        c.types?.includes("locality")
      );

      setCity(cityComponent?.long_name || "");
    } catch (e) {
      console.log("Reverse geocode error:", e);
    }
  };

  const { onLocationSelect } = (route.params as any) || {};

  const handleConfirm = async (item: LocationData) => {
    // await selectLocationById(item?.id);
    setSession(item)
    if (onLocationSelect) onLocationSelect(item);
    navigation.goBack();
  };

  // ➕ Add Current Location
  const handleCurrentConfirm = async () => {
    const newLocation: LocationData = {
      id: Date.now().toString(),
      city: city || "Unknown",
      fullAddress: address || "Unknown Address",
      lat: region.latitude,
      long: region.longitude,
    };

    await updateCurrentLocation(newLocation);
    await addRecentLocation(newLocation);

    if (onLocationSelect) onLocationSelect(newLocation);
    navigation.goBack();
  };

  // ✏️ Edit Location
  const handleEditLocation = (item: any) => {
    // Keeping navigation but removing getDevice callback dependency if it was used in EditLocationScreen
    navigation.navigate("EditLocationScreen", {
      location: item,
      // onLocationUpdated: getDevice, // No longer needed
    });
  };

  // ❌ Show delete confirmation modal
  const showDeleteConfirmation = (item: any) => {
    setSelectedLocation(item);
    setDeleteModalVisible(true);
  };

  // 🗑️ Delete Location
  const deleteLocationHandle = async () => {
    if (!selectedLocation) return;

    try {
      await removeRecentLocation(selectedLocation.id);
      // Alert.alert("Success", "Location deleted successfully");
      Toast.show({
        type: 'delete',
        text1: `${selectedLocation.city || 'Location'} has been successfully deleted`,
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 150,
      });
    } catch (e) {
      console.log("Delete error:", e);
    } finally {
      setDeleteModalVisible(false);
      setSelectedLocation(null);
    }
  };

  // ❌ Cancel delete
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedLocation(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingModal />}

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Warning Icon */}
            {/* <View style={styles.warningIconContainer}>
              <MaterialIcons name="warning" size={wp("12%")} color="#6C63FF" />
            </View> */}

            {/* Title */}
            <Text style={styles.modalTitle}>Delete Location</Text>

            {/* Message */}
            <Text style={styles.modalMessage} numberOfLines={2}>
              {/* Are you sure you want to delete {selectedLocation?.city} ?{'\n'} */}
              {selectedLocation?.fullAddress}

              {/* This action cannot be undone. */}
            </Text>

            {/* Buttons Container */}
            <View style={styles.modalButtonsContainer}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={deleteLocationHandle}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      {/* Search Box */}
      <TouchableOpacity
        style={styles.searchWrapper}
        onPress={() =>
          navigation.navigate("LocationManually", {
            from: "home",
            // onLocationAdded: getDevice, // Removed as we use Context now
          })
        }
      >
        <Ionicons name="search" size={wp("5%")} color="#999" />
        <TextInput
          placeholder="Search for area, street name..."
          placeholderTextColor="#999"
          editable={false}
          style={styles.searchInput}
        />
      </TouchableOpacity>

      {/* Scroll List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: hp("30%") }}
        showsVerticalScrollIndicator={false}
      >
        {/* Use Current Location */}
        <TouchableOpacity
          style={styles.useLocationContainer}
          onPress={() => {
            if (city) handleCurrentConfirm();
            else getCurrentLocation();
          }}
        >
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <MaterialIcons name="location-on" size={wp("4%")} color="red" />
              {/* <Text style={styles.useCurrentText}>Use current location</Text> */}
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={wp("5%")}
              color="#000"
            />
          </View>
          <Text style={styles.addressSub}>{address}</Text>
        </TouchableOpacity>

        <Text style={styles.recentTitle}>RECENT LOCATIONS</Text>

        {/* Location List */}
        {recentLocations?.map((item, index) => (
          <View key={index} style={styles.recentCard}>
            <TouchableOpacity onPress={() => handleConfirm(item)}>
              <View style={styles.rowCenter}>
                <MaterialIcons name="location-on" size={wp("4%")} color="red" />
                <Text style={styles.placeName}>{item.city}</Text>
              </View>

              <Text style={styles.placeAddress}>{item.fullAddress}</Text>
            </TouchableOpacity>

            <View style={styles.iconsRowNew}>
              <TouchableOpacity
                style={styles.iconBox}
                onPress={() => showDeleteConfirmation(item)}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={wp("4%")}
                  color="#555"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconBox, { marginLeft: wp("3%") }]}
                onPress={() => handleEditLocation(item)}
              >
                <MaterialIcons name="edit" size={wp("4%")} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <MapView style={styles.map} region={region}>
          <Marker coordinate={region} />
        </MapView>

        <TouchableOpacity
          style={styles.locateButton}
          onPress={() =>
            navigation.navigate("LocationManually", {
              from: "home",
              // onLocationAdded: getDevice,
            })
          }
        >
          <MaterialIcons name="location-on" size={wp("5%")} color="red" />
          <Text style={styles.locateText}>Locate on Map</Text>
        </TouchableOpacity>
      </View>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: wp("6%"),
    padding: wp("6%"),
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningIconContainer: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  modalTitle: {
    fontSize: wp("5%"),
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  modalMessage: {
    fontSize: wp("3.8%"),
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: hp("2.5%"),
    marginBottom: hp("3%"),
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: wp("3%"),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  deleteButton: {
    backgroundColor: "#6C63FF",
  },
  cancelButtonText: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "#374151",
  },
  deleteButtonText: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "white",
  },
});