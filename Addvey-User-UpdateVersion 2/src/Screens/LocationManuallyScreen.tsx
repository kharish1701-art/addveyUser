import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, { Marker } from "../Components/OlaMaps";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PostAPi } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EndPoints } from "../services/EndPoints";

import LoadingModal from "../Components/Loader";
import { OLA_MAPS_API_KEY } from "../api/authApi/BaseUrl";
import { errorToast } from "../Components/Toast/Toast";
import { useLocationContext, LocationData } from "../context/LocationContext";

const GOOGLE_MAPS_API_KEY = "h58KI3uUYQH9Bh7oX456vQHyXv0fgVqVCfPtbgx6"; // Replace with valid key

const LocationManualyScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const { from } = route.params as { from: string };
  // console.log("Navigated from:", from);

  const [region, setRegion] = useState({
    latitude: 17.4933,
    longitude: 78.3997,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false); // Separate loader for location
  const [locationError, setLocationError] = useState(""); // Error state for location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("")

  // ✅ Get current location & address with proper loader and error handling
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(""); // Clear previous errors

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied. Please enable location services.");
        setLocationLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        // timeout: 15000, // 15 seconds timeout
      });
      console.log(location, 'location============')
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Fetch address and immediately confirm
      const locData = await reverseGeocode(latitude, longitude);

      if (locData) {
        // Auto-confirm logic
        const newLocation: LocationData = {
          id: Date.now().toString(),
          city: locData.city || "Unknown",
          fullAddress: locData.fullAddress,
          lat: latitude,
          long: longitude
        };

        await updateCurrentLocation(newLocation);
        await addRecentLocation(newLocation);

        if (from === 'LanguageScreen') {
          navigation.replace('Home' as never);
        } else {
          navigation.navigate('Home' as never);
        }
      }

    } catch (error) {
      console.error("Error getting current location:", error);
      setLocationError("Failed to get current location. Please try again.");
      Alert.alert("Location Error", "Failed to get current location. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<{ fullAddress: string, city: string } | null> => {
    try {
      const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${OLA_MAPS_API_KEY}`;
      console.log('Request URL:', url);

      const res = await fetch(url);
      const text = await res.text();

      const json = JSON.parse(text);
      console.log('Raw response:', json.results[0]);

      let fullAddress = "";
      let city = "Unknown City";

      if (json.results && json.results.length > 0) {
        fullAddress = json.results[0].formatted_address;
        setAddress(fullAddress);
      } else {
        console.warn('No results array or empty', json);
        setLocationError("Could not fetch address for this location.");
        return null;
      }

      const result = json.results[0];
      const components = result.address_components || [];

      // ✅ Extract city (locality)
      const cityComponent = components.find((c: any) =>
        c.types?.includes('locality')
      );

      city = cityComponent?.long_name || 'Unknown City';
      setCity(city);

      return { fullAddress, city };

    } catch (error) {
      console.error('reverseGeocode error:', error);
      setLocationError("Error fetching address details.");
      return null;
    }
  };

  // 🔍 Fetch autocomplete predictions (Ola Maps or Google)
  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.length < 3) {
      setPredictions([]);
      return;
    }
    setLoading(true);
    const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
      text
    )}&api_key=${GOOGLE_MAPS_API_KEY}&components=country:IN`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.predictions) {
        setPredictions(json.predictions);
      } else {
        setPredictions([]);
      }
    } catch (e) {
      console.error(e);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // 📍 Select place from list
  const handleSelectPlace = async (placeId: string, description: string) => {
    setSearchQuery(description);
    setPredictions([]);
    setLocationLoading(true); // Show loader when selecting place

    const url = `https://api.olamaps.io/places/v1/details?place_id=${placeId}&api_key=${GOOGLE_MAPS_API_KEY}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.result && json.result.geometry && json.result.geometry.location) {
        const { lat, lng } = json.result.geometry.location;
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setAddress(description);
        setLocationError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error(error);
      setLocationError("Failed to load place details.");
    } finally {
      setLocationLoading(false);
    }
  };

  const { updateCurrentLocation, addRecentLocation } = useLocationContext();

  const handleConfirm = async () => {
    // const userToken = await AsyncStorage.getItem("authToken");

    const newLocation: LocationData = {
      id: Date.now().toString(),
      city: city || address.split(',')[0] || "Unknown",
      fullAddress: address,
      lat: region?.latitude,
      long: region?.longitude
    };

    setLoading(true);

    try {
      await updateCurrentLocation(newLocation);
      await addRecentLocation(newLocation);

      if (from === 'LanguageScreen') {
        navigation.replace('Home' as never);
      } else {
        // errorToast("Location Updated Locally"); // Optional feedback
        navigation.navigate('Home' as never);
      }
    } catch (error) {
      console.error("Error saving location locally", error);
      errorToast("Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp("6%")} color="#FF0303" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm your location</Text>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newRegion) => {
            setRegion(newRegion);
            // reverseGeocode(newRegion.latitude, newRegion.longitude);
          }}
          onPress={(e) => {
            const { coordinate } = e.nativeEvent;
            setRegion({
              ...region,
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            });
            // reverseGeocode(coordinate.latitude, coordinate.longitude);
          }}
        >
          <Marker coordinate={region} />
        </MapView>

        {/* Location Loading Overlay */}
        {/* {locationLoading && (
          <LoadingModal />
          // <View style={styles.locationLoaderOverlay}>
          //   <View style={styles.locationLoaderContent}>
          //     <ActivityIndicator size="large" color="#6C63FF" />
          //     <Text style={styles.locationLoaderText}>Getting your location...</Text>
          //   </View>
          // </View>
        )} */}

        {/* Location Error Display */}
        {locationError && !locationLoading && (
          <View style={styles.locationErrorOverlay}>
            <View style={styles.locationErrorContent}>
              <MaterialIcons name="error-outline" size={24} color="#FF6B6B" />
              <Text style={styles.locationErrorText}>{locationError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={getCurrentLocation}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={wp("5%")}
            color="#999"
            style={{ marginRight: wp("2%") }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for area, street name..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {loading && (
            <LoadingModal />
            // <ActivityIndicator size="small" color="#6C63FF" />
          )}
        </View>

        {/* Predictions dropdown */}
        {predictions.length > 0 && (
          <View style={styles.predictionList}>
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.predictionItem}
                  onPress={() =>
                    handleSelectPlace(item.place_id, item.description)
                  }
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color="#555"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: "#333", flex: 1 }}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Current Location Button */}
        <TouchableOpacity
          style={[
            styles.useLocationBtn,
            locationLoading && styles.useLocationBtnDisabled
          ]}
          onPress={getCurrentLocation}
          disabled={locationLoading}
        >
          <MaterialIcons
            name="location-on"
            size={wp("5.5%")}
            color={locationLoading ? "#999" : "red"}
            style={{ marginRight: wp("2%") }}
          />
          <Text style={[
            styles.useLocationText,
            locationLoading && styles.useLocationTextDisabled
          ]}>
            {locationLoading ? "Getting Location..." : "Use current location"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Address Section */}
      <View style={styles.addressCard}>
        <Text style={styles.addressTitle}>
          <MaterialIcons
            name="location-on"
            size={wp("5.5%")}
            color="red"
            style={{ marginRight: wp("1%") }}
          />{" "}
          Selected Address
        </Text>
        <Text numberOfLines={3} style={styles.addressText}>
          {address || (locationLoading ? "Fetching address..." : "No address selected")}
        </Text>
      </View>

      {/* Confirm Button */}
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!address || locationLoading) && styles.confirmButtonDisabled
          ]}
          onPress={handleConfirm}
          disabled={!address || locationLoading}
        >
          <Text style={styles.confirmText}>
            {locationLoading ? 'FETCHING LOCATION...' : (address ? 'Confirm location' : 'SELECT A LOCATION')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Global Loading Modal */}
      {/* <LoadingModal visible={loading} /> */}
    </SafeAreaView>
  );
};

export default LocationManualyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    zIndex: 10,
    marginTop: hp(5),
  },
  headerTitle: {
    fontSize: wp("4.8%"),
    fontWeight: "bold",
    color: "#111",
    marginLeft: wp("3%"),
  },
  mapWrapper: {
    width: "100%",
    height: hp("60%"),
    marginTop: hp(0.5),
    position: 'relative',
  },
  map: { width: "100%", height: "100%", borderRadius: wp("2%") },
  // Location Loader Styles
  locationLoaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  locationLoaderContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  locationLoaderText: {
    marginTop: 10,
    fontSize: wp("3.8%"),
    color: "#333",
  },
  // Location Error Styles
  locationErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  locationErrorContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    marginHorizontal: 20,
  },
  locationErrorText: {
    marginTop: 10,
    fontSize: wp("3.8%"),
    color: "#FF6B6B",
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp("3.8%"),
    fontWeight: '600',
  },
  searchWrapper: {
    position: "absolute",
    top: hp("2%"),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: wp("2%"),
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp(0.5),
    elevation: 3,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: wp("4%"),
    color: "black"
  },
  predictionList: {
    position: "absolute",
    top: hp("7%"),
    width: "90%",
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 8,
    maxHeight: hp("25%"),
    elevation: 3,
    zIndex: 10,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  useLocationBtn: {
    position: "absolute",
    bottom: hp("2%"),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: wp(5),
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("1.2%"),
    elevation: 2,
    zIndex: 10,
  },
  useLocationBtnDisabled: {
    borderColor: "#999",
    backgroundColor: "#f5f5f5",
  },
  useLocationText: {
    fontSize: wp(3.5),
    color: "#4F46E5",
    fontWeight: "400",
  },
  useLocationTextDisabled: {
    color: "#999",
  },
  addressCard: {
    marginTop: hp("2%"),
    marginHorizontal: wp("5%"),
  },
  addressTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "black",
    marginBottom: hp("0.5%"),
  },
  addressText: {
    fontSize: wp("3.8%"),
    color: "#333",
    lineHeight: hp("2.5%")
  },
  bottomButtonWrapper: {
    marginTop: hp("3%"),
    marginHorizontal: wp("5%"),
    marginBottom: hp(3),
  },
  confirmButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.5),
    borderRadius: wp(5),
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});