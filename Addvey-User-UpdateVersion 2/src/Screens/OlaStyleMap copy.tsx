import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StatusBar,
  Alert,
  PanResponder,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { EndPoints } from '../services/EndPoints';
import { apiHelper } from '../api/getApi/getApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Sample data based on your JSON
const propertiesData = [
  {
    location: {
      lat: 28.6139,
      lng: 77.209,
      city: "New Delhi"
    },
    id: 14,
    name: "Twst",
    price: 2000,
    images: ["1760122282921-628648212.webp"],
    type: "sell",
    superSubCategoryId: 5,
    attributes: {},
    views: 0,
    likes: 0,
    shares: 0,
    inquiries: 0,
    status: "active",
    isBoosted: false,
    isDeleted: false,
    createdBy: 7,
    createdAt: "2025-10-10T18:51:24.105Z",
    updatedAt: "2025-10-10T18:52:04.060Z",
    highlight: {},
    description: null,
    videoLink: null,
    distance: 0
  },
  {
    location: {
      lat: 28.6149,
      lng: 77.219,
      city: "New Delhi"
    },
    id: 6,
    name: "Motorcycles",
    price: 3000,
    images: [
      "1760098222390-424423677.webp",
      "1760098222396-775862078.webp"
    ],
    type: "sell",
    superSubCategoryId: 5,
    attributes: {
      RC: "Available",
      km: "1000",
      age: "Less than 1 year",
      fuel: "Available",
      RCDate: "2025-10-10",
      owners: "1",
      safety: "3+",
      airbags: "2",
      listedBy: "Owner",
      condition: "New – Brand new, no previous owner",
      transmission: "Automatic",
      insuranceDate: "2025-10-10"
    },
    views: 0,
    likes: 0,
    shares: 0,
    inquiries: 0,
    status: "active",
    isBoosted: false,
    isDeleted: false,
    createdBy: 7,
    createdAt: "2025-10-10T12:10:23.468Z",
    updatedAt: "2025-10-10T12:10:23.468Z",
    highlight: {},
    description: null,
    videoLink: null,
    distance: 0
  },
  {
    location: {
      lat: 28.6129,
      lng: 77.199,
      city: "New Delhi"
    },
    id: 7,
    name: "4 BHK Villa",
    price: 8000,
    images: ["villa-image.webp"],
    type: "rent",
    superSubCategoryId: 1,
    attributes: {},
    views: 0,
    likes: 0,
    shares: 0,
    inquiries: 0,
    status: "active",
    isBoosted: false,
    isDeleted: false,
    createdBy: 7,
    createdAt: "2025-10-10T12:10:23.468Z",
    updatedAt: "2025-10-10T12:10:23.468Z",
    highlight: {},
    description: "Luxurious 4 BHK villa with modern amenities",
    videoLink: null,
    distance: 0
  },
  {
    location: {
      lat: 28.6159,
      lng: 77.229,
      city: "New Delhi"
    },
    id: 8,
    name: "3 BHK Villa",
    price: 3000,
    images: ["villa-image2.webp"],
    type: "rent",
    superSubCategoryId: 1,
    attributes: {},
    views: 0,
    likes: 0,
    shares: 0,
    inquiries: 0,
    status: "active",
    isBoosted: false,
    isDeleted: false,
    createdBy: 7,
    createdAt: "2025-10-10T12:10:23.468Z",
    updatedAt: "2025-10-10T12:10:23.468Z",
    highlight: {},
    description: "Beautiful 3 BHK villa in prime location",
    videoLink: null,
    distance: 0
  }
];

const OlaStyleMap = () => {
  const [location, setLocation] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState(propertiesData);
  const [mapRegion, setMapRegion] = useState(null);
  const [sheetPosition, setSheetPosition] = useState('collapsed'); // collapsed, partial, expanded
  const [isSheetDragging, setIsSheetDragging] = useState(false);

  const mapRef = useRef(null);
  const sheetAnimation = useRef(new Animated.Value(0)).current;
  const sheetHeight = useRef(new Animated.Value(100)).current;

  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [productCart, setProductCart] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const init = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) setToken(storedToken);
    };

    init();
  }, []);

  const fetchProductCart = async () => {
    console.log("✅ Fetching_fetchProductCart___...");

    const url = EndPoints.getProduct
    const res = await apiHelper(url, {
      method: "GET",
      token,
    });

    // console.log(res, "✅_fetchProductCart___");

    if (res?.success) {

      setProductCart(res.data?.data)

      // {
      //     res.data?.data.map((item, index) => (
      //         console.log(item.name, 'ceck_fasfdffdsf__item_dta')
      //     ))
      // }
    } else {
      console.warn("⚠️ Failed to fetch:", res.message);
    }
  };

  useEffect(() => {
    fetchProductCart()
  }, [token])



  // Sheet positions
  const SHEET_POSITIONS = {
    COLLAPSED: 100,    // Just show handle and header
    PARTIAL: height * 0.5, // Half screen
    EXPANDED: height * 0.85 // Almost full screen
  };

  // Pan responder for sheet dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        setIsSheetDragging(true);
        const newHeight = Math.max(
          SHEET_POSITIONS.COLLAPSED,
          Math.min(SHEET_POSITIONS.EXPANDED, SHEET_POSITIONS.PARTIAL - gestureState.dy)
        );
        sheetHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsSheetDragging(false);
        const { dy, vy } = gestureState;

        let targetPosition;
        if (Math.abs(dy) < 5 && Math.abs(vy) < 0.5) {
          // Tap - toggle between partial and expanded
          targetPosition = sheetPosition === 'partial' ? 'expanded' : 'partial';
        } else {
          // Swipe - determine target based on velocity and position
          if (vy < -0.5 || (vy < 0 && dy < -50)) {
            targetPosition = 'expanded';
          } else if (vy > 0.5 || (vy > 0 && dy > 50)) {
            targetPosition = 'collapsed';
          } else {
            // Determine based on current position
            const currentHeight = sheetHeight._value;
            const collapsedDist = Math.abs(currentHeight - SHEET_POSITIONS.COLLAPSED);
            const partialDist = Math.abs(currentHeight - SHEET_POSITIONS.PARTIAL);
            const expandedDist = Math.abs(currentHeight - SHEET_POSITIONS.EXPANDED);

            const minDist = Math.min(collapsedDist, partialDist, expandedDist);
            targetPosition =
              minDist === collapsedDist ? 'collapsed' :
                minDist === partialDist ? 'partial' : 'expanded';
          }
        }

        animateSheetToPosition(targetPosition);
      },
    })
  ).current;

  // Animate sheet to specific position
  const animateSheetToPosition = (position) => {
    setSheetPosition(position);
    const targetHeight = SHEET_POSITIONS[position.toUpperCase()];

    Animated.spring(sheetHeight, {
      toValue: targetHeight,
      damping: 15,
      mass: 1,
      stiffness: 150,
      useNativeDriver: false,
    }).start();
  };

  // Toggle sheet position
  const toggleSheet = () => {
    const nextPosition =
      sheetPosition === 'collapsed' ? 'partial' :
        sheetPosition === 'partial' ? 'expanded' : 'collapsed';
    animateSheetToPosition(nextPosition);
  };

  // Request location permission
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for this app');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  // Handle property selection
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);

    // Animate map to selected property
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: property?.location?.lat,
        longitude: property?.location?.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }

    // Expand sheet to partial view
    if (sheetPosition === 'collapsed') {
      animateSheetToPosition('partial');
    }
  };

  // Handle marker press
  const handleMarkerPress = (property) => {
    handlePropertySelect(property);
  };

  // Render property item
  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.propertyItem,
        selectedProperty?.id === item.id && styles.selectedPropertyItem
      ]}
      onPress={() => handlePropertySelect(item)}
    >
      <Image
        source={{
          uri: `https://picsum.photos/200/150?random=${item.id}`
        }}
        style={styles.propertyImage}
      />

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyName}>{item.name}</Text>
        <Text style={styles.propertyPrice}>₹{item.price.toLocaleString()}</Text>
        <Text style={styles.propertyType}>
          {item.type === 'sell' ? 'For Sale' : 'For Rent'} • {item.location.city}
        </Text>

        {item.description && (
          <Text style={styles.propertyDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.propertyFeatures}>
          {item.attributes.km && (
            <Text style={styles.featureText}>{item.attributes.km} km</Text>
          )}
          {item.attributes.fuel && (
            <Text style={styles.featureText}>{item.attributes.fuel}</Text>
          )}
          {item.attributes.transmission && (
            <Text style={styles.featureText}>{item.attributes.transmission}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.likeButton}>
        <Ionicons name="heart-outline" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render custom marker
  const renderMarker = (property) => (
    <Marker
      key={property.id}
      coordinate={{
        latitude: property?.location?.lat,
        longitude: property?.location?.lng,
      }}
      onPress={() => handleMarkerPress(property)}
    >
      <View style={[
        styles.marker,
        selectedProperty?.id === property.id && styles.selectedMarker
      ]}>
        <Text style={styles.markerText}>₹{property.price}</Text>
      </View>
    </Marker>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} />
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchText}>Search...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      {mapRegion && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          toolbarEnabled={false}
        >
          {/* User Location Marker */}
          {location && (
            <Marker coordinate={location} title="Your Location">
              <View style={styles.userLocationMarker}>
                <View style={styles.userLocationPulse} />
                <Ionicons name="location" size={16} color="#fff" />
              </View>
            </Marker>
          )}

          {/* Property Markers */}
          {productCart.map((item) => item?.location?.lat && item?.location?.lng ? renderMarker(item) : null)}
        </MapView>
      )}

      {/* Custom Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { height: sheetHeight }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Sheet Handle */}
        <View style={styles.sheetHandleContainer}>
          <View style={styles.sheetHandle} />
        </View>

        {/* Sheet Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>
            {properties.length} Properties Found
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort</Text>
            <Ionicons name="chevron-down" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Properties List */}
        {sheetPosition !== 'collapsed' && (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPropertyItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.propertiesList}
            style={styles.propertiesFlatList}
          />
        )}

        {/* Collapsed View */}
        {sheetPosition === 'collapsed' && (
          <View style={styles.collapsedContent}>
            <Text style={styles.collapsedText}>
              {properties.length} properties nearby • Pull up to view
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            if (mapRef.current && location) {
              mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }, 1000);
            }
          }}
        >
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="layers" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={toggleSheet}
        >
          <Ionicons
            name={sheetPosition === 'collapsed' ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      {/* Selected Property Card (floating above sheet) */}
      {selectedProperty && sheetPosition === 'collapsed' && (
        <TouchableOpacity
          style={styles.selectedPropertyCard}
          onPress={() => animateSheetToPosition('partial')}
        >
          <Image
            source={{ uri: `https://picsum.photos/300/200?random=${selectedProperty.id}` }}
            style={styles.selectedPropertyImage}
          />
          <View style={styles.selectedPropertyContent}>
            <Text style={styles.selectedPropertyName}>{selectedProperty.name}</Text>
            <Text style={styles.selectedPropertyPrice}>
              ₹{selectedProperty.price.toLocaleString()}
            </Text>
            <Text style={styles.selectedPropertyLocation}>
              {selectedProperty.location.city}
            </Text>
          </View>
          <Ionicons name="chevron-up" size={20} color="#007AFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    // top: StatusBar.currentHeight + 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 1000,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // Marker Styles
  marker: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedMarker: {
    backgroundColor: '#FF9500',
    transform: [{ scale: 1.2 }],
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userLocationPulse: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    opacity: 0.4,
    transform: [{ scale: 1.5 }],
  },
  // Custom Bottom Sheet Styles
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  sheetHandleContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e5e5',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
  },
  sortButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 4,
  },
  propertiesList: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  propertiesFlatList: {
    flex: 1,
  },
  collapsedContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  collapsedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Property Item Styles
  propertyItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedPropertyItem: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#f8f9ff',
  },
  propertyImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  propertyType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  propertyDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  propertyFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  likeButton: {
    padding: 4,
  },
  // Floating Buttons
  floatingButtons: {
    position: 'absolute',
    right: 15,
    bottom: 120,
    zIndex: 1000,
  },
  floatingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Selected Property Card
  selectedPropertyCard: {
    position: 'absolute',
    bottom: 120,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  selectedPropertyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  selectedPropertyContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  selectedPropertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  selectedPropertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  selectedPropertyLocation: {
    fontSize: 12,
    color: '#666',
  },
});

export default OlaStyleMap;