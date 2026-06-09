// navigation/BottomTabs.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Pressable,
  PressableProps,
  Dimensions,
  ScrollView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import HomeStack from "../Components/Home/HomeStack";
import ChatMainScreen from "./Chat/ChatMainScreen";
import MainProfileScreen from "./MainProfileScreen";
import HomeScreen from "./HomeScreen";
import ExampleListingModal from "../Components/MainHome/ExampleListingModal";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTabBarScroll } from "../context/TabBarScrollContext";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import LocationPermissionModal from "../Components/OffLocationModat";
import { useLocationContext } from "../context/LocationContext";

const Tab = createBottomTabNavigator();
const { height } = Dimensions.get("window");
const AnimatedTabBar = (props: BottomTabBarProps) => {
  const { tabBarTranslateY } = useTabBarScroll();

  // Check if the current tab should hide the tab bar
  const focusedRoute = props.state.routes[props.state.index];
  const { options } = props.descriptors[focusedRoute.key];
  // @ts-ignore
  if (options.tabBarStyle?.display === "none") {
    return null;
  }

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        elevation: 20,
        backgroundColor: "#fff",
        borderTopLeftRadius: wp("6%"),
        borderTopRightRadius: wp("6%"),
        transform: [{ translateY: tabBarTranslateY }],
      }}
    >
      <ScrollableTabBar {...props} />
    </Animated.View>
  );
};

const ScrollableTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
        height: TAB_HEIGHT,
      }}
      style={{ flexGrow: 0, overflow: "visible" }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const activeColor = options.tabBarActiveTintColor || "#000000";
        const inactiveColor = options.tabBarInactiveTintColor || "#999";
        const color = isFocused ? activeColor : inactiveColor;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // Icon
        const icon = options.tabBarIcon
          ? options.tabBarIcon({ focused: isFocused, color, size: 22 })
          : null;

        // Label
        const label =
          options.tabBarLabel !== undefined
            ? typeof options.tabBarLabel === "function"
              // @ts-ignore
              ? options.tabBarLabel({
                focused: isFocused,
                color,
                position: "below-icon",
                children: route.name,
              })
              : options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        // Render Button (for custom tab bar buttons)
        if (options.tabBarButton) {
          return options.tabBarButton({
            // @ts-ignore
            ...options,
            onPress,
            onLongPress,
            accessibilityState: { selected: isFocused },
            children: (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: wp(25),
                }}
              >
                {icon}
                {typeof label === "string" ? (
                  <Text style={{ color }}>{label}</Text>
                ) : (
                  label
                )}
              </View>
            ),
          });
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              alignItems: "center",
              justifyContent: "center",
              minWidth: wp(18),
            }}
          >
            {icon}
            {typeof label === "string" ? (
              <Text
                style={{
                  color,
                  fontSize: wp(2.2),
                  fontFamily: "Poppins-Medium",
                }}
              >
                {label}
              </Text>
            ) : (
              label
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const DummyScreen = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text>Dummy Screen</Text>
  </View>
);
const TAB_HEIGHT = 60;

const BottomTabs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [exampleVisible, setExampleVisible] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const {
    isListening,
    results,
    startRecognizing,
    stopRecognizing,
    resetResults,
  } = useVoiceRecognition();
  const { showPermissionModal, toggleModal, isLocationEnabled, currentLocation } = useLocationContext();

  const toggleVoiceSearch = async () => {
    if (isListening) {
      await stopRecognizing();
    } else {
      resetResults();
      await startRecognizing();
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setShowBorder(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setShowBorder(false);
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 230,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }, 50);
  };

  const handleTapHere = async () => {
    closeModal();
    const dd = await AsyncStorage.getItem("IntroQR");
    if (dd) {
      navigation.navigate("QRCodeScanner");
    } else {
      await AsyncStorage.setItem("IntroQR", "true");
      setTimeout(() => setExampleVisible(true), 300);
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(100), 0],
  });
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, }}>
      <Tab.Navigator
        backBehavior="history"
        screenListeners={({ route }) => ({
          tabPress: () => {
            if (route.name !== "SearchScan") {
              if (modalVisible) {
                closeModal();
              }
            }
          },
        })}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            height: TAB_HEIGHT,
            paddingBottom: 10,
            paddingTop: 5,
            borderTopWidth: 0, // Handled by wrapper
            backgroundColor: "transparent", // Let wrapper handle background
            elevation: 0, // Wrapper handles elevation
          },
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#999",
        }}
        tabBar={(props) => <AnimatedTabBar {...props} />}
      >
        {/* Ads */}
        <Tab.Screen
          name="Ads"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarStyle: { display: "none" },
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: "red",
                  fontSize: wp(2.2),
                  fontWeight: focused ? "600" : "400",
                  fontFamily: "Poppins-Medium",
                }}
              >
                Addvery
              </Text>
            ),
            tabBarIcon: () => (
              <Feather name="arrow-left-circle" size={22} color="red" />
            ),
            tabBarButton: (props) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  {...(props as PressableProps)}
                  onPress={() => navigation.navigate("Home")}
                >
                  {props.children}
                </Pressable>
                <View
                  style={{
                    height: 25,
                    width: 1,
                    backgroundColor: "black",
                    marginLeft: -20,
                    marginRight: 10


                  }}
                />
              </View>
            ),
          }}
        />

        {/* Home */}
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: wp(2.2),
                  fontWeight: focused ? "600" : "400",
                  fontFamily: "Poppins-Medium",
                }}
              >
                Buy/Sell
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <Octicons
                name={focused ? "home-fill" : "home"}
                size={22}
                color={color}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // stop default behavior
              navigation.navigate("Home", {
                screen: "MainHomeScreen", // 👈 first screen of HomeStack
              });
            },
          })}
        />

        {/* ⭐ Search / Scan ⭐ */}
        <Tab.Screen
          name="SearchScan"
          component={DummyScreen}
          options={{
            tabBarLabel: ({ focused }) =>
              !modalVisible ? (
                <Text
                  style={{
                    fontSize: wp(2.2),
                    fontWeight: focused ? "600" : "400",
                    fontFamily: "Poppins-Medium",
                  }}
                >
                  Search/Scan
                </Text>
              ) : null,
            tabBarIcon: () => (
              <View style={{ width: 50, alignItems: "center" }}>
                {showBorder && (
                  <View style={styles.searchBorderContainer}>
                    {/* White overlay to hide the navigation border under the circle */}
                    {/*<View style={styles.borderWhiteOverlay} />*/}
                    {/*<View style={styles.searchBorderCircle} />*/}
                  </View>
                )}

                <Feather
                  name="search"
                  size={showBorder ? 30 : 20}
                  color={showBorder ? "#000" : "#00000099"}
                  style={{ alignSelf: "center", zIndex: 1, top: showBorder ? hp(-5) : hp(-0.5) }}
                />
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openModal();
            },
          }}
        />

        {/* Chats */}
        <Tab.Screen
          name="Chats"
          component={ChatMainScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: wp(2.2),
                  fontWeight: focused ? "600" : "400",
                  fontFamily: "Poppins-Medium",
                }}
              >
                Chats
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={focused ? "chat-bubble" : "chat-bubble-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* Profile */}
        <Tab.Screen
          name="You"
          component={MainProfileScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: wp(2.2),
                  fontWeight: focused ? "600" : "400",
                  fontFamily: "Poppins-Medium",
                }}
              >
                You
              </Text>
            ),
            tabBarIcon: ({ color }) => (
              <Octicons name="person" size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* ################ MODAL REPLACEMENT ################ */}
      {modalVisible && (
        <View
          style={[styles.overlay, { top: 0, bottom: TAB_HEIGHT, zIndex: 1000 }]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>

          <Animated.View
            style={[styles.modalContainer, { transform: [{ translateY }] }]}
          >
            <View style={styles.modalContent}>
              <View style={styles.topRow}>
                <Image
                  source={require("../../assets/images/1.png")}
                  style={{ width: wp(8), height: wp(8), marginRight: wp(2) }}
                />
                <Text style={styles.modalTitle}>Addvey</Text>
              </View>

              <View style={styles.qrContainer}>
                <View style={styles.qrBox}>
                  <MaterialIcons
                    name="qr-code-scanner"
                    size={wp("15%")}
                    color="black"
                  />

                  <TouchableOpacity onPress={handleTapHere}>
                    <Text
                      style={{
                        color: "#6385FF",
                        marginTop: hp(1),
                        fontSize: wp(3.2),
                      }}
                    >
                      Tap here to enable your camera
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: wp(80),
                      height: 1,
                      backgroundColor: "#00000018",
                      marginVertical: hp(1.5),
                    }}
                  />

                  <Text
                    onPress={handleTapHere}
                    style={{
                      color: "#000",
                      fontSize: wp(2.8),
                      fontFamily: "Poppins-Medium",
                    }}
                  >
                    Scan Addvey QR code
                  </Text>
                </View>
              </View>

              {/* Search */}
              <View style={styles.searchWrapper}>
                <TouchableOpacity style={styles.searchBar} onPress={() => {
                  closeModal()
                  navigation.navigate("BuySellSearch")
                }}>
                  <Feather
                    name="search"
                    size={18}
                    color="#888"
                    style={{ marginRight: wp(2) }}
                  />
                  <TextInput
                    placeholder="Search nearby"
                    placeholderTextColor="#888"
                    style={{ flex: 1, fontSize: wp(3.5) }}
                    value={results?.[0] ?? ""}
                    editable={false}
                  />
                  <TouchableOpacity style={styles.micIcon} disabled onPress={toggleVoiceSearch}>
                    <Ionicons
                      name={isListening ? "mic" : "mic-outline"}
                      size={20}
                      color={isListening ? "#6C63FF" : "#ff5200"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Show Modal if location services are off or permission denied */}
      {!isLocationEnabled && !currentLocation && (
        <LocationPermissionModal
          isModalVisible={showPermissionModal}
          toggleModal={toggleModal}
        />
      )}

      <ExampleListingModal
        visible={exampleVisible}
        onClose={() => setExampleVisible(false)}
      />
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  searchBorderContainer: {
    width: 70,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderTopWidth: 0,
    marginTop: hp(7),
    // borderTopLeftWidth: 0,
    // borderTopRightWidth: 0,

    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40,
    backgroundColor: "#fff",
    // justifyContent: "center",
    alignItems: "center",
    // elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // height:90
  },
  borderWhiteOverlay: {
    position: "absolute",
    bottom: -16, // Positioned to hide the navigation border under the circle
    left: -2,
    right: -2,
    height: 0, // Height to cover the navigation border
    backgroundColor: "#fff",
    zIndex: 2,
  },
  searchBorderCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    position: "absolute",

    bottom: 100, // 👈 SAME as tab bar height
    width: "100%",
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(1.5),
    marginRight: 10,
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
    paddingBottom: hp(2),
  },
  modalContent: { alignItems: "center" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: wp(5),
    fontFamily: "Poppins-Medium",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: hp(2),
    width: "100%",
  },
  qrBox: {
    width: "100%",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: hp(3),
    backgroundColor: "#eee",
    alignItems: "center",
  },
  searchWrapper: {
    marginTop: hp(3),
    width: "100%",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.2),
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
  },
  micIcon: {
    padding: 4,
  },
});
