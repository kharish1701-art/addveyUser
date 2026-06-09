import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  RefreshControl, // Add this import
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, EvilIcons, Entypo, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AddCardPreview from "../Components/MainHome/AddCardPreview";
import { EndPoints } from "../services/EndPoints";
import AddFilterCardPreview from "../Components/MainHome/AddFavoriteCardPreview";
import { handleUnFavorite } from "../api/getApi/getApi";

const FavouriteScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Favorite");
  const [activeFilter, setActiveFilter] = useState("All");
  const route = useRoute();
  const type = route?.params?.type;
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  // Add refresh state
  const [refreshing, setRefreshing] = useState(false);
  const handleLongPress = (item) => {
    setSelectionMode(true);
    setSelectedItems([item.productId]);
  };
  const handleSelect = (item) => {
    if (!selectionMode) return; // Normal tap when not selecting

    setSelectedItems((prev) => {
      if (prev.includes(item.productId)) {
        const updated = prev.filter((id) => id !== item.productId);

        // If no items left → exit selection mode
        if (updated.length === 0) setSelectionMode(false);

        return updated;
      }

      // Add new item
      return [...prev, item.productId];
    });
  };
  const handleDelete = () => {
    Alert.alert(
      "Delete Items",
      "Are you sure you want to delete selected items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            console.log(selectedItems)
            await handleUnFavorite(selectedItems);
            Alert.alert("Success", "Items deleted successfully");
            // handleUnFavorite()
            // const newList = data.filter(
            //   (item) => !selectedItems.includes(item.id)
            // );
            // set(newList);

            // Reset
            setSelectedItems([]);
            setSelectionMode(false);
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (type && type == "viewed") {
      setActiveTab("Viewed");
    }
  }, []);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);

    // Simulate API call or refresh data
    try {
      // You can add your refresh logic here
      // For example, refetch data from your AddCardPreview component
      // Or trigger a refresh in child components

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If AddCardPreview has a refresh method, you can call it here
      // Otherwise, the refresh will happen when the component re-renders
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /** Tabs Content Components */
  const ActiveTab = () => (
    <View>
      {/* Your existing filter code remains here */}

      <View style={{ marginTop: hp(2), paddingHorizontal: wp(4) }}>
        <AddFilterCardPreview
          type={activeTab}
          EndpointUrl={
            activeTab == "Shares"
              ? EndPoints.getshareHistory
              : activeTab == "Viewed"
                ? EndPoints.getViewHistory
                : EndPoints?.getFavorite
          }
          // Pass refresh state if AddCardPreview supports it
          handleLongPress={handleLongPress}
          handleSelect={handleSelect}
          selectedItems={selectedItems}
          isRefreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </View>
  );

  const ExpiredTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Expired Ads</Text>
      <Text style={{ textAlign: "center", color: "#999" }}>No expired ads</Text>
    </View>
  );

  const DeactivatedTab = () => (
    <View style={styles.centeredView}>
      <Text style={styles.centerText}>Turn on Viewed History ?</Text>
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Turn on</Text>
      </TouchableOpacity>
    </View>
  );

  const UnderReviewTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Under review</Text>
      <Text style={{ textAlign: "center", color: "#999" }}>No expired ads</Text>
    </View>
  );

  const tabs = [
    {
      label: "Favorite",
      activeIcon: <Ionicons name="heart" size={hp(1.6)} color="#FF0303" />,
      inactiveIcon: (
        <Ionicons name="heart-outline" size={hp(1.6)} color="#666" />
      ),
    },
    {
      label: "Shares",
      activeIcon: <Feather name="share" size={hp(1.6)} color="black" />,
      inactiveIcon: <Feather name="share" size={hp(1.6)} color="#00000099" />,
    },
    {
      label: "Viewed",
      activeIcon: <Feather name="eye" size={hp(1.6)} color="black" />,
      inactiveIcon: <Feather name="eye" size={hp(1.6)} color="#00000099" />,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={wp("4.5%")} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.rightIcons}>
          <View style={styles.bellContainer}>
            <EvilIcons name="search" size={24} color="black" />
          </View>
          {/* <TouchableOpacity
            style={styles.main}
            onPress={() => navigation.navigate("NotificationSetting")}
          >
            <Entypo name="dots-three-vertical" size={14} color="black" />
          </TouchableOpacity> */}
          {selectionMode ? (
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              {/* <Ionicons name="share-outline" size={24} /> */}
              <Entypo name="dots-three-vertical" size={14} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content with Pull to Refresh */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(10) }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6A5AE0"]} // Android
            tintColor="#6A5AE0" // iOS
            title="Pull to refresh"
            titleColor="#666"
          />
        }
      >
        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: hp(1) }}
        >
          <View style={styles.tabs}>
            {tabs.map((t, i) => {
              const isActive = activeTab === t.label;
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.tabBtn}
                  onPress={() => setActiveTab(t.label)}
                >
                  <View style={styles.tabIconText}>
                    {isActive ? t.activeIcon : t.inactiveIcon}
                    <Text
                      style={[styles.tabText, isActive && styles.activeText]}
                    >
                      {t.label}
                    </Text>
                  </View>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Search Bar */}
        {/* <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={16}
            color="#999"
            style={{ marginRight: 6 }}
          />
          <TextInput
            placeholder="Search here"
            placeholderTextColor="#6E533F"
            style={styles.searchInput}
          />
        </View> */}

        {/* Tab Content */}
        <ActiveTab />
      </ScrollView>
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    marginTop: hp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  main: {},
  rightIcons: { flexDirection: "row", alignItems: "center" },
  bellContainer: { marginRight: wp("2%") },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
  },
  tabBtn: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
  },
  tabIconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    fontSize: hp(1.6),
    color: "#666",
    marginLeft: wp(1),
  },
  activeText: {
    color: "#000000",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#6A5AE0",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginBottom: hp(0.5),
    marginVertical: hp(1),
    marginHorizontal: wp(3.9),
  },
  searchInput: { flex: 1, fontSize: hp(1.5), color: "#000" },
  filtersRow: {
    flexDirection: "row",
    marginBottom: hp(2),
    marginLeft: wp(4),
    marginRight: wp(4),
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(3),
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    marginTop: hp(1),
  },
  activeFilterBtn: {
    borderColor: "#6A5AE0",
    backgroundColor: "#fff",
  },
  filterText: { fontSize: hp(1.5), color: "#00000099" },
  activeFilterText: { color: "#6A5AE0", fontWeight: "600" },
  squareBox: {
    width: wp(5),
    height: wp(5),
    backgroundColor: "#D9D9D980",
    marginRight: wp(1.5),
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: hp(1.8),
    color: "#666",
    marginBottom: hp(1),
    paddingHorizontal: wp(4),
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(20),
  },
  centerText: {
    fontSize: hp(2),
    color: "#444",
    marginBottom: hp(2),
    fontFamily: "Poppins-Medium",
  },
  exploreButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: hp(1.6),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.2),
  },
});
