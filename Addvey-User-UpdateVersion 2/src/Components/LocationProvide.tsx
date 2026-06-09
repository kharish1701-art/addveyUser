// LocationProvider.js
import React, { createContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { Linking, Platform } from "react-native";
import EnableLocationScreen from "../Screens/EnableLocationScreen";
import LocationPermissionModal from "./OffLocationModat";

export const LocationContext = createContext(null);

export default function LocationProvider({ children }) {
  const [isLocationOn, setIsLocationOn] = useState(true);

  const checkLocation = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      setIsLocationOn(false);
      return;
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    setIsLocationOn(servicesEnabled);
  };

  useEffect(() => {
    const interval = setInterval(checkLocation, 2000); // check every 2 sec
    checkLocation();
    return () => clearInterval(interval);
  }, []);

  return (
    <LocationContext.Provider value={{ isLocationOn, setIsLocationOn }}>
      {children}

      {!isLocationOn && (
        <LocationPermissionModal 
        isModalVisible={!isLocationOn} 
        toggleModal={toggleModal} 
      />
        // <EnableLocationScreen
        //   onEnable={() => {
        //     if (Platform.OS === "ios") {
        //       Linking.openURL("app-settings:");
        //     } else {
        //       Linking.openSettings();
        //     }
        //   }}
        // />
      )}
    </LocationContext.Provider>
  );
}
