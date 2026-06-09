// import React, { useEffect } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Platform,
//   PermissionsAndroid,
// } from "react-native";

// import * as Location from "expo-location";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetchAddress } from "../context/LocationContext";
// import { getSession, setSession } from "../services/session";

// export default function WelcomeScreen() {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       // requestPhoneNumberPermission()


//       await AsyncStorage.removeItem("manual_location_set");
//       const token = await AsyncStorage.getItem("authToken");
//       if (token) {
//         navigation.navigate("Botomtabs" as never);
//       } else {
//         navigation.navigate("Login" as never);
//       }
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [navigation]);
//   useEffect(() => {
//     request();
//   }, []);

//   const request = async () => {
//     const res = await Location.getCurrentPositionAsync({});

//     if (res?.coords?.latitude) {
//       //    console.log(res,'res=================')
//       const address = await fetchAddress(
//         res?.coords?.latitude,
//         res?.coords?.longitude
//       );
//       // console.log(address, 'address')
//       if (address) {
//         setSession({
//           ...address,
//           latitude: res?.coords?.latitude,
//           longitude: res?.coords?.longitude,
//         });
//       }
//       // console.log(getSession())
//     }
//   };
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.container}>
//           <Image
//             source={require("../../assets/images/login.png")}
//             style={styles.image}
//             resizeMode="contain"
//           />
//           <Text style={styles.title}>Addvey</Text>
//           <Text style={styles.subtitle}>ADDING MULTIPLE WAYS</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }



import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAddress } from "../context/LocationContext";
import { setSession } from "../services/session";

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // Clear manual location flag
      await AsyncStorage.removeItem("manual_location_set");

      // 1️⃣ Fetch location & set session
      await fetchAndSetLocation();

      // 2️⃣ Check auth token
      const token = await AsyncStorage.getItem("authToken");

      // 3️⃣ Navigate AFTER everything is done
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Botomtabs" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    } catch (error) {
      console.log("Init error:", error);
      const token = await AsyncStorage.getItem("authToken");

      // 3️⃣ Navigate AFTER everything is done
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Botomtabs" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    }
  };

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
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/login.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Addvey</Text>
          <Text style={styles.subtitle}>ADDING MULTIPLE WAYS</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp(50),
    height: hp(14),
    marginBottom: hp(0),
  },
  title: {
    fontSize: hp(2.8),
    color: "white",
    marginBottom: hp(0),
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: hp(1),
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});
