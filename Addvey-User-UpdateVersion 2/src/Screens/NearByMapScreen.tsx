import React, { useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { OlaMapView, Marker } from "../Components/OlaMaps/OlaMapView";
import { RootStackParamList } from "../App";

type NearByMapScreenRouteProp = RouteProp<RootStackParamList, 'NearByMap'>;

interface Place {
    lat?: number;
    lng?: number;
    name?: string;
    distance?: string;
}

const NearByMapScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<NearByMapScreenRouteProp>();
    const { places, initialLat, initialLng } = route.params || {};
    const mapRef = useRef(null);

    useEffect(() => {
        if (places && places.length > 0 && mapRef.current) {
            // Optionally fit to coordinates if needed
        }
    }, [places]);

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header / Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nearby Places</Text>
            </View>

            <OlaMapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: initialLat || 12.9716, // Default to Bangalore if missing
                    longitude: initialLng || 77.5946,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
            >
                {places?.map((place: Place, index: number) => (
                    place.lat && place.lng ? (
                        <Marker
                            key={index}
                            coordinate={{ latitude: place.lat, longitude: place.lng }}
                            title={place.name}
                            description={place.distance}
                            pinColor="red"
                        />
                    ) : null
                ))}
            </OlaMapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        position: 'absolute',
        top: hp('5%'),
        left: wp('5%'),
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    map: {
        flex: 1,
    },
});

export default NearByMapScreen;
