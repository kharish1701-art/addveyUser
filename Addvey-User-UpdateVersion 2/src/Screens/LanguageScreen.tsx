// import React, { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   StatusBar,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import axios from "axios";
// import apiClient, { BaseUrl, OLA_MAPS_API_KEY } from "../api/authApi/BaseUrl";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Location from "expo-location";
// import { EndPoints } from "../services/EndPoints";
// import { PostAPi } from "../api/getApi/getApi";
// import LoadingModal from "../Components/Loader";
// import { getSession } from "../services/session";

// interface Language {
//   id: string;
//   name: string;
//   native_name?: string;
// }

// const LanguageScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
//   const [languages, setLanguages] = useState<Language[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
// const route = useRoute()
// const from = route?.params?.from
//   //  Fetch Languages API
//   const fetchLanguages = async () => {
//     try {
//       setLoading(true);

//       // 🔹 Get token from AsyncStorage
//       const token = await AsyncStorage.getItem("authToken");
//       if (!token) {
//         console.warn("No token found — user might not be logged in");
//         return;
//       } else {
//         console.log("token__save");
//       }

//       // 🔹 Send request with Authorization header
//       const response = await apiClient.get(
//         "/languages/view-languages?target=user",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // <--  attach token here
//           },
//         }
//       );

//       if (response?.data?.success) {
//         const languagesData = response.data.data?.data || [];
//         console.log("✅ Languages fetched successfully:", languagesData);

//         // Remove duplicates based on 'id'
//         const uniqueLanguages = Array.from(
//           new Map(languagesData.map((item: any) => [item.id, item])).values()
//         );

//         setLanguages(uniqueLanguages as Language[]); // Type assertion if needed, or better typing
//       } else {
//         console.warn("⚠️ Unexpected API response:", response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching languages:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadSavedLanguages = async () => {
//     try {
//       const savedLangs = await AsyncStorage.getItem("language");
//       if (savedLangs) {
//         const parsedLangs = savedLangs.split(","); // Assuming comma-separated string based on Save function
//         setSelectedLangs(parsedLangs);
//       }
//     } catch (error) {
//       console.error("Failed to load saved languages", error);
//     }
//   };

//   useEffect(() => {
//     fetchLanguages();
//     loadSavedLanguages();
//   }, []);

//   const toggleLanguage = (id: string) => {
//     setSelectedLangs((prev) =>
//       prev.includes(id) ? prev.filter((lang) => lang !== id) : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     // handleLocationFlow()
//     handleConfirmLocation();
//   }, []);

//   const [region, setRegion] = useState({
//     latitude: 17.4933,
//     longitude: 78.3997,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   });

//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const handleLocationFlow = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status === "granted") {
//         // Permission granted → get location
//         setLoading(true);
//         let location = await Location.getCurrentPositionAsync({});
//         const { latitude, longitude } = location.coords;
//         console.log("User Location:", latitude, longitude);

//         setRegion({
//           latitude,
//           longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         });

//         // Reverse geocode + send to server
//         await reverseGeocode(latitude, longitude);
//       } else {
//         // Permission denied → skip location, just navigate
//         console.warn(
//           "Location permission denied. Navigating without location..."
//         );
//         // navigation.navigate("Language", { data, location: false });
//       }
//     } catch (error) {
//       console.error("Error in handleLocationFlow:", error);
//       // errorToast(error?.message || "Something went wrong");
//       // navigation.navigate("Language", { data, location: false });
//     } finally {
//       // setLoading(false);
//     }
//   };

//   const reverseGeocode = async (lat: number, lng: number) => {
//     try {
//       // setLoading(true)
//       // const url = `https://api.olamaps.io/geocode/reverse-geocoding?latlng=${lat},${lng}&api_key=${GOOGLE_MAPS_API_KEY}`;
//       const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${OLA_MAPS_API_KEY}`;
//       // console.log('Request URL:', url);

//       const res = await fetch(url);
//       const text = await res.text();

//       const json = JSON.parse(text);
//       console.log("Raw response:", json.results[0]);

//       if (json.results && json.results.length > 0) {
//         setAddress(json.results[0].formatted_address);
//       } else {
//         console.warn("No results array or empty", json);
//       }

//       const result = json.results[0];

//       // ✅ Check safely for address_components
//       const components = result.address_components || [];

//       // ✅ Extract city (locality)
//       const cityComponent = components.find((c: any) =>
//         c.types?.includes("locality")
//       );

//       const city = cityComponent?.long_name || "Unknown City";
//       setCity(city);
//       handleConfirmLocation();
//     } catch (error) {
//       console.error("reverseGeocode error:", error);
//       // errorToast(error?.message || "Something went wrong");
//     }
//   };

//   const handleConfirmLocation = async () => {
//     const token = await AsyncStorage.getItem("authToken");
//     const res = await getSession();
//     console.log(res, "this is location");
//     const param = {
//       url: EndPoints.addLocation,
//       body: {
//         city: res?.village,
//         fullAddress: res?.displayAddress,
//         lat: res?.latitude,
//         long: res?.longitude,
//       },
//       token: token || "",
//     };

//     const dd = await PostAPi(param, setLoading);
//     if (dd?.success) {
//       console.log("<><><><><><", param.body);
//     }
//   };

//   const Save = async () => {
//     if (selectedLangs.length === 0) {
//       Alert.alert("Please select at least one language");
//       return;
//     }
//     try {
//       setLoading(true);
//       await AsyncStorage.setItem("language", selectedLangs.join(","));
//       // console.log("Token saved:", token);
//       setLoading(false);
//       // navigation.replace("Home");
//       if(from == 'profile'){
//         // navigation.navigate('MainProfile')
//         navigation.goBack()
//       }else{
//       if (getSession()) {
//         navigation.replace("Home" as never);
//         // navigation.navigate("You" as never);
//       } else {
//         // navigation.navigate("LocationManually", { from: "LanguageScreen" });
//         navigation.navigate("EnableLocation", { from: "LanguageScreen" });
//       }
//     }
//     } catch (error) {
//       // errorToast(error?.message || "Something went wrong");
//       console.error("Error saving token", error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="arrow-back" size={20} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.heading}>Which languages do you speak?</Text>
//       </View>

//       {/* Loader */}
//       {loading ? (
//         <LoadingModal />
//       ) : (
//         <ScrollView
//           style={styles.scrollArea}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={{ marginBottom: hp(12) }}>
//             {languages.map((lang) => (
//               <TouchableOpacity
//                 key={lang.id}
//                 style={styles.optionRow}
//                 onPress={() => toggleLanguage(lang.id)}
//               >
//                 <Text
//                   style={[
//                     styles.langText,
//                     selectedLangs.includes(lang?.id) && { color: "#6C63FF" },
//                   ]}
//                 >
//                   {lang.name}
//                   {lang.native_name ? ` . ${lang.native_name}` : ""}
//                 </Text>

//                 <View
//                   style={[
//                     styles.radioOuter,
//                     selectedLangs.includes(lang.id) && {
//                       borderColor: "#6C63FF",
//                       borderWidth: 3,
//                     },
//                   ]}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>
//         </ScrollView>
//       )}

//       {/* Bottom Button */}
//       <View style={styles.buttonWrapper}>
//         <TouchableOpacity style={styles.button} onPress={() => Save()}>
//           <Text style={styles.buttonText}>Save & Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default LanguageScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: wp("5%"),
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: hp(6),
//     marginBottom: hp(2),
//   },
//   heading: {
//     fontSize: wp(4.6),
//     fontWeight: "600",
//     color: "#111",
//     marginLeft: wp("3%"),
//   },
//   scrollArea: {
//     flex: 1,
//   },
//   optionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: hp(1.2),
//     paddingHorizontal: wp(5),
//   },
//   langText: {
//     fontSize: wp("4%"),
//     color: "#333",
//   },
//   radioOuter: {
//     width: wp("4%"),
//     height: wp("4%"),
//     borderRadius: wp("4%"),
//     borderWidth: 1.2,
//     borderColor: "#0000005E",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonWrapper: {
//     position: "absolute",
//     bottom: hp(4),
//     left: wp(5),
//     right: wp(5),
//   },
//   button: {
//     backgroundColor: "#6C63FF",
//     paddingVertical: hp(1.5),
//     borderRadius: wp(4),
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: wp("4.5%"),
//     fontWeight: "600",
//   },
// });

import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiClient from "../api/authApi/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EndPoints } from "../services/EndPoints";
import { PostAPi } from "../api/getApi/getApi";
import LoadingModal from "../Components/Loader";
import { getSession } from "../services/session";

interface Language {
  id: string;
  name: string;
  native_name?: string;
}

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const from = route?.params?.from;

  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 FIXED ISSUE: You were saving only language IDs to AsyncStorage
  // but the MainProfileScreen expects full language objects in "selectedLanguages"
  // This is why languages weren't appearing in the profile

  // Fetch Languages API - memoized to prevent unnecessary re-renders
  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        console.warn("No token found — user might not be logged in");
        // If no token, still allow language selection for guest users
        return;
      }

      const response = await apiClient.get(
        "/languages/view-languages?target=user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        const languagesData = response.data.data?.data || [];
        
        // Remove duplicates based on 'id' more efficiently
        const uniqueLanguages = languagesData.filter(
          (lang: Language, index: number, self: Language[]) =>
            index === self.findIndex((l) => l.id === lang.id)
        );

        setLanguages(uniqueLanguages);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load saved languages from AsyncStorage - FIXED VERSION
  const loadSavedLanguages = useCallback(async () => {
    try {
      // 🔹 FIX: Check both possible storage keys
      const savedLangsJson = await AsyncStorage.getItem("selectedLanguages");
      const savedLangIds = await AsyncStorage.getItem("language");
      
      if (savedLangsJson) {
        // If we have full language objects saved (from MainProfileScreen)
        const parsedLangs = JSON.parse(savedLangsJson);
        if (Array.isArray(parsedLangs)) {
          // Extract just the IDs for selection
          const ids = parsedLangs.map((lang: any) => lang.id || lang.language_id || "").filter(Boolean);
          setSelectedLangs(ids);
        }
      } else if (savedLangIds) {
        // If we have comma-separated IDs saved (from this screen)
        const parsedIds = savedLangIds.split(",").filter(Boolean);
        setSelectedLangs(parsedIds);
      }
    } catch (error) {
      console.error("Failed to load saved languages", error);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
    loadSavedLanguages();
  }, [fetchLanguages, loadSavedLanguages]);

  // Optimized toggle function
  const toggleLanguage = useCallback((id: string) => {
    setSelectedLangs((prev) =>
      prev.includes(id) 
        ? prev.filter((lang) => lang !== id) 
        : [...prev, id]
    );
  }, []);

  // Save languages with proper format for MainProfileScreen
  const Save = useCallback(async () => {
    if (selectedLangs.length === 0) {
      Alert.alert("Please select at least one language");
      return;
    }

    try {
      setLoading(true);
      
      // 🔹 FIXED: Save in two formats to ensure compatibility
      // 1. Save as comma-separated IDs (for this screen's loading)
      await AsyncStorage.setItem("language", selectedLangs.join(","));
      
      // 2. Save as full objects (for MainProfileScreen)
      const selectedLanguageObjects = languages
        .filter((lang) => selectedLangs.includes(lang.id))
        .map((lang) => ({
          id: lang.id,
          name: lang.name,
          native_name: lang.native_name || lang.name,
          label: lang.name, // Add label for compatibility
          native: lang.native_name || lang.name, // Add native for compatibility
        }));
      
      await AsyncStorage.setItem(
        "selectedLanguages", 
        JSON.stringify(selectedLanguageObjects)
      );

      console.log("Languages saved successfully:", selectedLanguageObjects);
      
      // Handle navigation based on where we came from
      if (from === 'profile') {
        navigation.goBack();
      } else {
        const session = getSession();
        if (session) {
          navigation.replace("Home");
        } else {
          navigation.navigate("EnableLocation", { from: "LanguageScreen" });
        }
      }
    } catch (error) {
      console.error("Error saving languages", error);
      Alert.alert("Error", "Failed to save languages");
    } finally {
      setLoading(false);
    }
  }, [selectedLangs, languages, from, navigation]);

  // Handle confirm location - moved to separate useEffect if needed
  const handleConfirmLocation = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const session = await getSession();
      
      if (!session) return;
      
      const param = {
        url: EndPoints.addLocation,
        body: {
          city: session?.village,
          fullAddress: session?.displayAddress,
          lat: session?.latitude,
          long: session?.longitude,
        },
        token: token || "",
      };

      await PostAPi(param, setLoading);
    } catch (error) {
      console.error("Error confirming location:", error);
    }
  }, []);

  useEffect(() => {
    handleConfirmLocation();
  }, [handleConfirmLocation]);

  // Memoized language list rendering
  const renderLanguageList = () => (
    <ScrollView
      style={styles.scrollArea}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {languages.map((lang) => {
        const isSelected = selectedLangs.includes(lang.id);
        return (
          <TouchableOpacity
            key={lang.id}
            style={styles.optionRow}
            onPress={() => toggleLanguage(lang.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.langText, isSelected && styles.selectedText]}>
              {lang.name}
              {lang.native_name ? ` • ${lang.native_name}` : ""}
            </Text>

            <View style={[styles.radioOuter, isSelected && styles.selectedRadio]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons name="arrow-back" size={wp(5)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>Which languages do you speak?</Text>
      </View>

      {/* Content */}
      {loading ? (
        <LoadingModal />
      ) : (
        renderLanguageList()
      )}

      {/* Bottom Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity 
          style={[styles.button, selectedLangs.length === 0 && styles.buttonDisabled]} 
          onPress={Save}
          disabled={loading || selectedLangs.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save & Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  heading: {
    fontSize: wp(4.6),
    fontWeight: "600",
    color: "#111",
    marginLeft: wp(3),
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(15), // Extra padding for bottom button
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.6),
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  langText: {
    fontSize: wp(4),
    color: "#333",
    flex: 1,
  },
  selectedText: {
    color: "#6C63FF",
    fontWeight: "500",
  },
  radioOuter: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: "#6C63FF",
    backgroundColor: "#6C63FF10",
  },
  radioInner: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: "#6C63FF",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: hp(4),
    left: wp(5),
    right: wp(5),
    backgroundColor: "#fff",
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.8),
    borderRadius: wp(4),
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: wp(4.5),
    fontWeight: "600",
  },
});