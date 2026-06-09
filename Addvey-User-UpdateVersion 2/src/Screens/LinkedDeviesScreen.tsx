// LinkedDeviseScreen.tsx
import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EndPoints } from "../services/EndPoints";
import { deleteApi, getApi } from "../api/getApi/getApi";
import LoadingModal from "../Components/Loader";
import { useNavigation } from "@react-navigation/native";

interface Device {
  id: string;
  name: string;
  status: "syncing" | "online" | "offline";
  lastActive?: string;
}



const LinkedDeviseScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    getDevice();
  }, []);
  const getDevice = async () => {
    const token = await AsyncStorage.getItem("authToken");

    // const param = {
    //   url: EndPoints.getLinkedDevices,
    //   token: token,
    // };
    const dd = await getApi(EndPoints.getLinkedDevices, setLoading, token);
    console.log(dd?.data?.data);
    setData(dd?.data?.data);
  };

  const Logout = async (id) => {
    const token = await AsyncStorage.getItem("authToken");

    const param = {
      url: EndPoints.logoutFromDevice + id,
      token: token,
    };
    const dd = await deleteApi(param, setLoading);
    console.log(dd);
    getDevice();
    // setData(dd?.data?.data);

  }
  const renderStatus = (item: Device) => {
    if (item.status === "syncing") {
      return <Text style={styles.subText}>Syncing</Text>;
    }
    if (item.status === "online") {
      return (
        <Text style={styles.subText}>Last active {item?.lastActiveAt}</Text>
      );
    }
    return <Text style={styles.subText}>Last active {item.lastActive}</Text>;
  };

  const renderItem = ({ item }: { item: Device }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconBox} />

        {/* Device Name + Status Icon on Right */}
        <View style={{ flex: 1 }}>
          <View style={styles.deviceRow}>
            <Text style={styles.deviceName}>{item?.deviceName}</Text>

            {item.status === "syncing" && (
              <View style={[styles.dot, { backgroundColor: "#1FAF38" }]} />
            )}
            {item.status === "online" && (
              <View style={[styles.dot, { backgroundColor: "#1FAF38" }]} />
            )}
            {item.status === "offline" && (
              <View style={styles.offlineRow}>
                <Feather name="wifi-off" size={12} color="gray" />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            )}
          </View>

          {/* Below text (last active etc.) */}
          {renderStatus(item)}
        </View>
      </View>

      {item.status === "offline" ? (
        <TouchableOpacity style={styles.removeBtn} onPress={() => Logout(item?.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.logoutBtn} onPress={() => Logout(item?.id)}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {loading && <LoadingModal />}
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={16} color="black" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Linked Devices</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Linked Devices Info */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <EvilIcons name="link" size={20} color="black" />
          <Text style={styles.headerText}>
            <Text style={{ color: "#4B6EF6", fontWeight: "bold" }}>
              {data?.length}
            </Text>{" "}
            . Linked Devices Status
          </Text>
        </View>
      </View>

      {/* Devices List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default LinkedDeviseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: hp(3.5),
  },
  topBarTitle: {
    fontSize: wp(4.5),
    fontFamily: "Poppins-Medium",
    marginLeft: wp(4),
    marginTop: hp(0.4),
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: hp(4),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerText: {
    fontSize: wp(3.5),
    fontFamily: "Poppins-Medium",
    color: "#00000099",
  },
  card: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 10,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deviceName: {
    fontSize: wp(3.8),
    flex: 1,
    fontFamily: "Poppins-Medium",
  },
  subText: {
    fontSize: wp(2.8),
    color: "gray",
    fontFamily: "Poppins-Regular",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginLeft: 8,
  },
  offlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  offlineText: {
    fontSize: 13,
    color: "gray",
  },
  logoutBtn: {
    marginTop: hp(3),
    borderWidth: 1,
    borderColor: "#FF0303",
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#FF0303",
    fontWeight: "500",
  },
  removeBtn: {
    marginTop: hp(3),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#00000059",
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  removeText: {
    color: "#00000059",
    fontWeight: "500",
  },
});
