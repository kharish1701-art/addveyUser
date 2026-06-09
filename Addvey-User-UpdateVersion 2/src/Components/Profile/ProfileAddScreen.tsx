import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProfileCard from "./ProfileCard";
import AddCardPreview from "../MainHome/AddCardPreview";
import { EndPoints } from "../../services/EndPoints";
import AddFavoriteCardPreview from "../MainHome/AddFavoriteCardPreview";

const ProfileAddScreen: React.FC = ({id}) => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.buySellRow}>
        <Text style={styles.buySellText}>Ads</Text>
        <View style={styles.buySellActiveIndicator} />
      </View>

      {/* Search Bar */}
      {/* <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#999" style={{ marginRight: 6 }} />
                <TextInput
                    placeholder="Search ads..."
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
                <Image
                    source={require("../../../assets/images/mic.png")}
                    style={styles.micIcon}
                />
            </View> */}

      {/* Filters */}
      {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersRow}
            >
                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        activeFilter === "All" && styles.activeFilterBtn,
                    ]}
                    onPress={() => {
                        setActiveFilter("All");
                        navigation.navigate("Filter");
                    }}
                >
                    <Image
                        source={require("../../../assets/images/filter.png")}
                        style={{
                            width: wp(3.5),
                            height: hp(2),
                            resizeMode: "contain",
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        activeFilter === "Cars" && styles.activeFilterBtn,
                    ]}
                    onPress={() => setActiveFilter("Cars")}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === "Cars" && styles.activeFilterText,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        activeFilter === "Bikes" && styles.activeFilterBtn,
                    ]}
                    onPress={() => setActiveFilter("Bikes")}
                >
                    <View style={styles.squareBox} />
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === "Bikes" && styles.activeFilterText,
                        ]}
                    >
                        1 Vehicle
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        activeFilter === "Properties" && styles.activeFilterBtn,
                    ]}
                    onPress={() => setActiveFilter("Properties")}
                >
                    <View style={styles.squareBox} />
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === "Properties" && styles.activeFilterText,
                        ]}
                    >
                        1 Property
                    </Text>
                </TouchableOpacity>
            </ScrollView> */}

      {/* Profile Card with side margins */}
      <View style={styles.profileCardWrapper}>
        {/* <ProfileCard /> */}
        <AddFavoriteCardPreview type="Profile" EndpointUrl={`${EndPoints.getProduct}?vendorId=${id}`} />
      </View>
    </View>
  );
};

export default ProfileAddScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /** Header */
  buySellRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp(1),
    position: "relative",
    marginTop: hp(3),
  },
  buySellText: {
    fontSize: wp("3.8%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  buySellActiveIndicator: {
    position: "absolute",
    bottom: 0,
    left: wp("3.5%"),
    width: wp("10%"),
    height: 3,
    backgroundColor: "#6A5AE0",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },

  /** Search Bar */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginVertical: hp(1.5),
    marginHorizontal: wp(3.9),
  },
  searchInput: { flex: 1, fontSize: hp(1.8), color: "#000" },
  micIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
    marginLeft: wp(1),
  },

  /** Filters */
  filtersRow: {
    flexDirection: "row",
    marginBottom: hp(2),
    paddingHorizontal: wp(3.9),
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
  filterText: { marginLeft: 0, fontSize: hp(1.5), color: "#00000099" },
  activeFilterText: { color: "#6A5AE0", fontWeight: "600" },
  squareBox: {
    width: wp(5),
    height: wp(5),
    backgroundColor: "#D9D9D980",
    marginRight: wp(1.5),
    borderRadius: 4,
  },

  /** Profile Card Wrapper */
  profileCardWrapper: {
    marginHorizontal: wp(1),
    marginBottom: hp(2),
    marginTop:15
  },

  /** Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  outsideCloseBtn: {
    position: "absolute",
    top: hp(75),
    right: wp(3),
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 3,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2.5),
  },
  modalItemText: {
    marginLeft: wp(1),
    fontSize: wp(3.5),
    color: "#000000",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  modalItemTextDel: {
    marginLeft: wp(1),
    fontSize: wp(3.8),
    color: "#FF0303",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
});
