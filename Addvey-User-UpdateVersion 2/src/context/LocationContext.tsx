import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Alert, Platform, Linking, AppState, AppStateStatus } from "react-native";
import LocationPermissionModal from "../Components/OffLocationModat";
import { getApi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import { markLocationSelected } from "../Screens/HomeScreen";
import { OLA_MAPS_API_KEY } from "../api/authApi/BaseUrl";

// Define the shape of a Location object
export type LocationData = {
  id: string; // or UUID
  city?: string;
  fullAddress: string;
  lat: number;
  long: number;
  // Add other fields as necessary from your API response structure if needed
};

type LocationContextType = {
  currentLocation: LocationData | null;
  recentLocations: LocationData[];
  isLocationEnabled: boolean;
  updateCurrentLocation: (location: LocationData) => Promise<void>;
  addRecentLocation: (location: LocationData) => Promise<void>;
  removeRecentLocation: (id: string) => Promise<void>;
  checkLocationPermission: () => Promise<void>;
  loadRecentLocations: () => Promise<void>;
  showPermissionModal: boolean;
  toggleModal: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [recentLocations, setRecentLocations] = useState<LocationData[]>([]);
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(true); // Default to true to avoid flash
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    loadData();
    checkLocationPermission();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const getCurrentLocation = async () => {
    // markLocationSelected()
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      //   setRegion((prev) => ({
      //     ...prev,
      //     latitude,
      //     longitude,
      //   }));

      //   reverseGeocode(latitude, longitude);
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };
  const loadData = async () => {
    try {
      // Load saved current location
      const currentJson = await AsyncStorage.getItem("currentLocation");
      if (currentJson) {
        const parsedCurrent = JSON.parse(currentJson);
        if (parsedCurrent && typeof parsedCurrent === 'object' && parsedCurrent.lat !== undefined) {
          // setCurrentLocation(parsedCurrent);
        }
      }

      // Load recent locations from API
      await loadRecentLocations();

    } catch (error) {
      console.error("Failed to load location data", error);
    }
  };

  const loadRecentLocations = async () => {

    try {
      // ALWAYS load from local storage first to ensure persistence
      const token = await AsyncStorage.getItem("authToken");
      const recentJson = await getApi(EndPoints.getLocationList, null, token, true)
      // console.log(recentJson,'=================================')
      // await AsyncStorage.getItem("recentLocations");
      if (recentJson) {
        const parsed = recentJson?.data?.data;
        const validRecent = Array.isArray(parsed)
          ? parsed.filter((loc: any) => loc && typeof loc === 'object' && loc.lat !== undefined && loc.long !== undefined)
          : [];
        setRecentLocations(validRecent);
      }

      // Optional: You could fetch from API here and merge/append if desired, 
      // but for "local store" requirement, we prioritize local data.
      // keeping API logic commented out or secondary if needed later.

      /* 
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
           ... API logic ...
      } 
      */
    } catch (error) {
      console.error("Error loading recent locations:", error);
    }
  }

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      markLocationSelected()
      if (status !== "granted") {
        setIsLocationEnabled(false);
        setShowPermissionModal(true);
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      setIsLocationEnabled(servicesEnabled);
      if (!servicesEnabled) {
        setShowPermissionModal(true);
      } else {
        setShowPermissionModal(false);
      }

    } catch (error) {
      console.error("Error checking location permission", error);
    }
  };

  const updateCurrentLocation = async (location: LocationData) => {
    setCurrentLocation(location);
    try {
      await AsyncStorage.setItem("currentLocation", JSON.stringify(location));
    } catch (e) {
      console.error("Failed to save current location", e);
    }
  };

  const addRecentLocation = async (location: LocationData) => {
    // Optimistically update logic specific to API or local
    // Here we just save locally for now, assuming another flow creates it on backend
    // OR distinct logic: If authenticated, add to backend?
    // User request didn't specify ADDING to backend, just 'call from api and get'.
    // We will keep local adding for guest / mixed usage, but primarily API fetches data.

    if (!location || typeof location.lat !== 'number' || typeof location.long !== 'number') return;

    const updatedRecent = [
      location,
      ...recentLocations.filter((loc) => loc && loc.id !== location.id && (loc.lat !== location.lat || loc.long !== location.long)),
    ].slice(0, 5); // Keep only last 5

    setRecentLocations(updatedRecent);
    try {
      await AsyncStorage.setItem("recentLocations", JSON.stringify(updatedRecent));
      // Optionally call API to add location here if required
    } catch (e) {
      console.error("Failed to save recent locations", e);
    }
  };

  const removeRecentLocation = async (id: string) => {
    // Optimistic update
    const updatedRecent = recentLocations.filter((loc) => loc.id !== id);
    setRecentLocations(updatedRecent);

    // TODO: Call API to delete location if authenticated
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // Call delete API
        await getApi(`${EndPoints.deleteLocation}${id}`, null, token);
      }
      await AsyncStorage.setItem("recentLocations", JSON.stringify(updatedRecent));
    } catch (e) {
      console.error("Error removing", e)
    }
  }

  const toggleModal = () => {
    setShowPermissionModal(!showPermissionModal);
    if (!showPermissionModal) {
      checkLocationPermission();
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        recentLocations,
        isLocationEnabled,
        updateCurrentLocation,
        addRecentLocation,
        removeRecentLocation,
        checkLocationPermission,
        loadRecentLocations,
        showPermissionModal,
        toggleModal
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};



export const fetchAddress = async (
  latitude: number,
  longitude: number,
) => {
  try {
    if (latitude == null || longitude == null) return null;

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${encodeURIComponent(
      `${lat},${lng}`,
    )}&api_key=${OLA_MAPS_API_KEY}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('Reverse geocode failed', res.status);
      return null;
    }

    const json = await res.json();
    console.log('reverse-geocode json', json);

    if (
      Array.isArray(json.results) &&
      json.results.length > 0 &&
      Array.isArray(json.results[0].address_components)
    ) {
      return buildFarmerAddress(json.results[0].address_components);
    }

    console.warn('Address components missing');
    return null;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.warn('Reverse geocode timeout');
    } else {
      console.error('Geocoding error', error);
    }
    return null;
  }
};

const buildFarmerAddress = (components: any[]): FarmerAddress | null => {
  if (!components || !components.length) return null;

  const village = getComponent(components, [
    'village',
    'hamlet',
    'sublocality',
    'neighborhood',
    'locality',
  ]);

  const post = getComponent(components, [
    'sublocality_level_1',
    'sublocality',
    'neighborhood',
  ]);

  const teh = getComponent(components, [
    'administrative_area_level_3', // Tehsil
  ]);

  const dist = getComponent(components, [
    'administrative_area_level_2', // District
  ]);

  const state = getComponent(components, ['administrative_area_level_1']);

  const pin = getComponent(components, ['postal_code']);

  // Build formatted address
  const formattedParts = [village, post, teh, dist, state]
    .map(p => p.trim())
    .filter((v, i, a) => v && a.indexOf(v) === i);

  const displayAddress = pin
    ? `${formattedParts.join(', ')} - ${pin}`
    : formattedParts.join(', ');

  return {
    village,
    post,
    teh,
    dist,
    state,
    pin,
    displayAddress,
  };
};

const getComponent = (components: any[] = [], types: string[]): string => {
  const found = components.find(c => types.some(t => c.types?.includes(t)));
  return found?.long_name || '';
};
