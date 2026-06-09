import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons, FontAwesome5 } from "@expo/vector-icons";
import { OLA_MAPS_API_KEY } from "../../api/authApi/BaseUrl";
import { errorToast } from "../Toast/Toast";

// Tabs
const tabs = ["All", "Transportation", "Famous places", "Restaurants"];

// Icons for categories
const getIcon = (category: string) => {
  switch (category) {
    case "Transportation":
      return <Ionicons name="bus-outline" size={16} color="black" />;

    case "Famous places":
      return <SimpleLineIcons name="location-pin" size={16} color="black" />;

    case "Restaurants":
      return <FontAwesome5 name="utensils" size={16} color="black" />;

    default:
      return <Ionicons name="location-outline" size={16} color="black" />;
  }
};

const NearByScreen = ({ route }) => {
  const navigation = useNavigation();
  const { lat, lng } = route?.params || {};

  const [activeTab, setActiveTab] = useState("Transportation");
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);

  const OLA_API_KEY = "YOUR_OLA_MAPS_API_KEY";

  // Fetch nearby places
  // const fetchNearby = async (category: string) => {
  //   setLoading(true);

  //   try {
  //     let type = "establishment";

  //     if (category === "Transportation") type = "bus_station";
  //     if (category === "Restaurants") type = "restaurant";
  //     if (category === "Famous places") type = "tourist_attraction";

  //     const response = await axios.get(
  //       `https://api.olamaps.io/places/v1/nearbysearch`,
  //       {
  //         params: {
  //           lat,
  //           lng,
  //           radius: 5000, // 5 km
  //           type,
  //           key: OLA_MAPS_API_KEY,
  //         },
  //       }
  //     );

  //     const results = response.data.results || [];

  //     const formatted = results.map((place, index) => ({
  //       id: index.toString(),
  //       name: place.name,
  //       distance: place.distance
  //         ? (place.distance / 1000).toFixed(1) + " km"
  //         : "N/A",
  //       lat: place.geometry?.location?.lat,
  //       lng: place.geometry?.location?.lng,
  //       icon: getIcon(category),
  //     }));

  //     console.log('------ formated data ', formatted)

  //     setPlaces(formatted);
  //   } catch (e) {
  //     console.log("Ola Maps Error:", e);
  //   }

  //   setLoading(false);
  // };

  const fetchNearby = async (category: string) => {
  setLoading(true);

  try {
    let type = "establishment";

    if (category === "Transportation") type = "bus_station";
    if (category === "Restaurants") type = "restaurant";
    if (category === "Famous places") type = "tourist_attraction";

    const response = await axios.get(
      "https://api.olamaps.io/places/v1/nearbysearch",
      {
        params: {
          lat,
          lng,
          radius: 5000,
          type,
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OLA_MAPS_API_KEY}`,
        },
      }
    );

    const results = response.data.results || [];

    const formatted = results.map((place, index) => ({
      id: index.toString(),
      name: place.name,
      distance: place.distance
        ? (place.distance / 1000).toFixed(1) + " km"
        : "N/A",
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      icon: getIcon(category),
    }));

    setPlaces(formatted);
  } catch (e) {
    console.log("Ola Maps Error:", e?.response?.data || e);

    if (__DEV__) {
      console.log("Using mock data for development");
    } else {
      errorToast("Unable to fetch nearby places.");
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchNearby(activeTab);
  }, [activeTab]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.left}>
        {item.icon}
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.distance}>{item.distance}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>What's nearby?</Text>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loader */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="black"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={places}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ marginTop: hp("2%") }}
        />
      )}

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => navigation.navigate("NearByMap", { places, initialLat: lat, initialLng: lng })}
      >
        <Text style={styles.mapBtnText}>View on Map</Text>
        <Ionicons name="map-outline" size={18} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NearByScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingTop: hp("3%"),
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: wp("5%"),
    fontWeight: "600",
    marginBottom: hp("2%"),
  },
  tab: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp("3%"),
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tabActive: {
    borderColor: "#6C63FF",
    backgroundColor: "#EEE8FF",
  },
  tabText: {
    fontSize: wp("3.5%"),
    color: "#444",
  },
  tabTextActive: {
    fontWeight: "700",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    width: wp("65%"),
  },
  name: {
    marginLeft: 10,
    fontSize: wp("3.8%"),
  },
  distance: {
    color: "#777",
  },
  mapButton: {
    marginTop: hp("3%"),
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  mapBtnText: {
    marginRight: 10,
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});
