// import React, { useState } from "react";
// import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

// const GOOGLE_API_KEY = "AIzaSyDgFGS91BvviXh_f-nmvtE";

// export default function GoogleAutocomplete() {
//   const [query, setQuery] = useState("");
//   const [places, setPlaces] = useState([]);

//   const fetchPlaces = async (text) => {
//     setQuery(text);
//     if (text.length < 2) {
//       setPlaces([]);
//       return;
//     }

//     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
//       text
//     )}&key=${GOOGLE_API_KEY}&language=en`;

//     try {
//       const res = await fetch(url);
//       const json = await res.json();
//       setPlaces(json.predictions || []);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSelect = async (placeId, description) => {
//     console.log("Selected:", description);

//     // Optional: Fetch details (lat/lng)
//     const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
//     const res = await fetch(detailUrl);
//     const json = await res.json();

//     const location = json.result?.geometry?.location;
//     console.log("Coordinates:", location);

//     // You can set the selected location state here
//     setPlaces([]);
//     setQuery(description);
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Search places..."
//         value={query}
//         onChangeText={fetchPlaces}
//         style={styles.input}
//       />

//       {places.length > 0 && (
//         <FlatList
//           data={places}
//           keyExtractor={(item) => item.place_id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.item}
//               onPress={() => handleSelect(item.place_id, item.description)}
//             >
//               <Text>{item.description}</Text>
//             </TouchableOpacity>
//           )}
//           style={styles.list}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     marginTop: 50,
//   },
//   input: {
//     height: 45,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//   },
//   list: {
//     marginTop: 8,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     maxHeight: 250,
//   },
//   item: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
// });


// LocationManualyScreen.tsx
import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
} from "react-native";
import MapView, { Marker } from "../Components/OlaMaps";
import * as Location from "expo-location";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const LocationManualyScreen: React.FC = () => {
    const navigation = useNavigation();

    const [region, setRegion] = useState({
        latitude: 17.4933,
        longitude: 78.3997,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [address, setAddress] = useState(
        "Phase 1, 3rd Block\nKPHB, bagayanagar colony phase 2\nTelangana, 500081, India ( near hotel )"
    );

    // Get Current Location
    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

    const handleConfirm = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 🔹 Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp("6%")} color="#FF0303" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm your location</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: hp("4%") }}
                showsVerticalScrollIndicator={false}
            >
                {/* Map with overlays */}
                <View style={styles.mapWrapper}>
                    <MapView style={styles.map} region={region}>
                        <Marker coordinate={region}>
                            <Text style={styles.markerLabel}>
                                Bagayanagar 1st street
                            </Text>
                        </Marker>
                    </MapView>

                    {/* Overlay Search Bar */}
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
                        />
                    </View>

                    {/* Overlay Current Location Button */}
                    <TouchableOpacity
                        style={styles.useLocationBtn}
                        onPress={getCurrentLocation}
                    >
                        <MaterialIcons
                            name="location-on"
                            size={wp("5.5%")}
                            color="red"
                            style={{ marginRight: wp("2%") }}
                        />
                        <Text style={styles.useLocationText}>Use current location</Text>
                    </TouchableOpacity>
                </View>

                {/* Address Card */}
                <View style={styles.addressCard}>
                    <Text style={styles.addressTitle}>
                        <MaterialIcons
                            name="location-on"
                            size={wp("5.5%")}
                            color="red"
                            style={{ marginRight: wp("0%") }}
                        />{" "}
                        Phase 1, 3rd Block
                    </Text>
                    <Text style={styles.addressText}>{address}</Text>
                    <Text style={styles.currentLocationText}>Current Location</Text>
                </View>

                {/* Confirm Button */}
                <View style={styles.bottomButtonWrapper}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmText}>Confirm location</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default LocationManualyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("1.5%"),
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
        zIndex: 10,
        marginTop: hp(5)
    },
    headerTitle: {
        fontSize: wp("4.8%"),
        fontWeight: "bold",
        color: "#111",
        marginLeft: wp("3%"),
        fontFamily: "Poppins-Bold",
    },
    mapWrapper: {
        width: "100%",
        height: hp("65%"),
        marginTop: hp(0.5),
    },
    map: {
        width: "100%",
        height: "100%",
        borderRadius: wp("2%"),
    },
    markerLabel: {
        backgroundColor: "black",
        color: "white",
        padding: 3,
        borderRadius: 4,
        fontSize: wp("3.2%"),
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
    },
    searchInput: {
        flex: 1,
        fontSize: wp("4%"),
        color: "black",
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
    },
    useLocationText: {
        fontSize: wp(3.5),
        color: "#4F46E5",
        fontWeight: "400",
        fontFamily: "Poppins-Regular",
        marginTop: hp(0.2),
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
        fontFamily: "Poppins-Bold",
    },
    addressText: {
        fontSize: wp("3.8%"),
        color: "#333",
        lineHeight: hp("2.5%"),
    },
    currentLocationText: {
        marginTop: hp("1%"),
        fontSize: wp("3.5%"),
        color: "#4F46E5",
        fontWeight: "500",
        fontFamily: "Poppins-Medium",
    },
    bottomButtonWrapper: {
        marginTop: hp("3%"),
        marginHorizontal: wp("5%"),
    },
    confirmButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp(1.8),
        borderRadius: wp(5),
        alignItems: "center",
    },
    confirmText: {
        color: "#fff",
        fontSize: wp("4.5%"),
        fontWeight: "600",
    },
});
