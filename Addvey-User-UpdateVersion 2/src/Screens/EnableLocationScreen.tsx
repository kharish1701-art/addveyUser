// EnableLocationScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { PostAPi } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OLA_MAPS_API_KEY } from "../api/authApi/BaseUrl";
import { EndPoints } from "../services/EndPoints";
import CustomLoader from "../Components/Loader";
import { setSession } from "../services/session";
import { fetchAddress } from "../context/LocationContext";

const EnableLocationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [region, setRegion] = useState({
    latitude: 17.4933,
    longitude: 78.3997,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loading, setLoading] = useState<boolean>(false);


  const [address, setAddress] = useState("");
  const [city, setCity] = useState("")
  // const enableLocation = async () => {
  //     try {
  //         // Request foreground permissions
  //         let { status } = await Location.requestForegroundPermissionsAsync();
  //         if (status !== "granted") {
  //             return;
  //         }

  //         await Location.getCurrentPositionAsync({});
  //     } catch (error) {
  //         console.log("Location error:", error);
  //     }
  // };

  const fetchAndSetLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return;

    const res = await Location.getCurrentPositionAsync({});
    if (!res?.coords?.latitude) return;

    const address = await fetchAddress(
      res.coords.latitude,
      res.coords.longitude
    );

    if (address) {
      setSession({
        ...address,
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
      });
      handleConfirmLocation({
        ...address,
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
      })

      // address?.village, address?.displayAddress )
    }
  };
  const handleLocationFlow = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        // Permission granted → get location

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log("User Location:", latitude, longitude);
        setLoading(true)
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Reverse geocode + send to server
        await reverseGeocode(latitude, longitude);
      } else {
        // Permission denied → skip location, just navigate
        console.warn("Location permission denied. Navigating without location...");
        // navigation.navigate("Language", { data, location: false });
      }
    } catch (error) {
      console.error("Error in handleLocationFlow:", error);
      // errorToast(error?.message || "Something went wrong");
      // navigation.navigate("Language", { data, location: false });
    } finally {
      // setLoading(false);
    }
  };


  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // setLoading(true)
      // const url = `https://api.olamaps.io/geocode/reverse-geocoding?latlng=${lat},${lng}&api_key=${GOOGLE_MAPS_API_KEY}`;
      const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${OLA_MAPS_API_KEY}`
      console.log('Request URL:', url);

      const res = await fetch(url);
      const text = await res.text();

      const json = JSON.parse(text);
      console.log('Raw response:', json.results[0]);

      if (json.results && json.results.length > 0) {
        setAddress(json.results[0].formatted_address);

      } else {
        console.warn('No results array or empty', json);
      }

      const result = json.results[0];

      // ✅ Check safely for address_components
      const components = result.address_components || [];

      // ✅ Extract city (locality)
      const cityComponent = components.find((c: any) =>
        c.types?.includes('locality')
      );

      const city = cityComponent?.long_name || 'Unknown City';
      setCity(city);
      handleConfirmLocation(city, json.results[0].formatted_address)

    } catch (error) {
      console.error('reverseGeocode error:', error);
      // errorToast(error?.message || "Something went wrong");
    }
  };

  const handleConfirmLocation = async (address) => {
    const token = await AsyncStorage.getItem("authToken");

    const param = {
      url: EndPoints.addLocation,
      body: {
        "city": address?.village,
        "fullAddress": address?.displayAddress,
        "lat": address?.latitude,
        "long": address?.longitude
      },
      token: token || ""
    }

    const dd = await PostAPi(param, setLoading)
    if (dd?.success) {
      console.log("<><><><><><", param.body);

      // navigation.navigate("Language", { data: data, location: true });
      // if(from === 'LanguageScreen'){
      navigation.replace('Home' as never);
      // }else{
      //   navigation.goBack()
      // }
    }
    else {
      fetchAndSetLocation()
    }

  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingHorizontal: wp("6%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading && <CustomLoader />}
        {/* Heading */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Set your location to start</Text>
          <Text style={styles.subText}>
            Rides, Groceries, Services, Poojas, jobs & more exploring near you
          </Text>
        </View>

        {/* Illustration Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/location.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            // onPress={enableLocation}
            onPress={fetchAndSetLocation}
          >
            <Text style={styles.primaryText}>Enable Device Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            // onPress={() => navigation.navigate("LocationManually")}
            onPress={() => { navigation.navigate("LocationManually", { from: "LanguageScreen" }); }}
          >
            <Text style={styles.secondaryText}>
              Enter Your Location Manually
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EnableLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textContainer: {
    marginTop: hp("3%"),
    alignItems: "center",
  },
  heading: {
    fontSize: wp(3.9),
    color: "black",
    marginBottom: hp(0),
    textAlign: "center",
    marginTop: hp(4),
    fontFamily: "Poppins-Regular",
  },
  subText: {
    fontSize: wp(3.9),
    color: "black",
    textAlign: "center",
    lineHeight: hp("2.8%"),
    width: wp("100%"),
    fontFamily: "Poppins-Regular",
  },
  imageContainer: {
    marginTop: hp(7),
    marginBottom: hp("5%"),
    width: wp("96%"),
    height: hp("50%"),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: "auto",
    marginBottom: hp("5%"),
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.8),
    borderRadius: wp(5),
    alignItems: "center",
    marginBottom: hp("2%"),
    width: "100%",
  },
  primaryText: {
    color: "#fff",
    fontSize: wp("3.8%"),
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4F46E5",
    paddingVertical: hp(1.5),
    borderRadius: wp(5),
    alignItems: "center",
    width: "100%",
  },
  secondaryText: {
    color: "#4F46E5",
    fontSize: wp("3.8%"),
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
});
