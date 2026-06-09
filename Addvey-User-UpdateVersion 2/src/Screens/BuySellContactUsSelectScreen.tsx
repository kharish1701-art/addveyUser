import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import LoadingModal from "../Components/Loader";

const BuySellContactUsSelectScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
const route = useRoute()
const item = route?.params?.item
const reportData = route?.params?.reportData
  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [helpData, setHelpData] = useState(null);
  useEffect(() => {
    // getFaq();
    getHelp();
  }, []);

  const getHelp = async () => {
    const token = await AsyncStorage.getItem("authToken");

    // const param = {
    //   url: EndPoints.faq,
    //   token: token,
    // };
    const dd = await getApi(EndPoints.help, setLoading, token, true);
    console.log(dd?.data?.data);
    setHelpData(dd?.data?.data);
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingModal />}
      <StatusBar barStyle="dark-content" backgroundColor="#D9D9D940" />
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={hp("1.8%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Contact us</Text>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: hp("4%") }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={hp("2%")} color="#999" />
          <TextInput
            placeholder="Search here"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* New Section (3 rows) */}
        <Text style={styles.sectionTitle}>How can we help you with this?</Text>
        <View style={styles.linkList}>
          {helpData?.map((item1) => (
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.navigate('BuySellContactDetailConfirm', {item:item, reportData:reportData, type:item1})}
            >
              <Text style={styles.linkText}>{item1?.help_question}</Text>
              <Ionicons name="chevron-forward" size={hp("1.8%")} color="#000" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default BuySellContactUsSelectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    marginTop: hp(3),
  },
  topBarTitle: {
    fontSize: hp("2%"),
    marginLeft: wp("3%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  scrollContent: {
    marginTop: hp("7%"),
    paddingHorizontal: wp("4%"),
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: wp("3%"),
    marginBottom: hp("2%"),
    marginTop: hp(5),
  },
  searchInput: {
    marginLeft: wp("2%"),
    fontSize: hp("1.5%"),
    flex: 1,
    color: "#000",
  },
  sectionTitle: {
    fontSize: hp("2%"),
    marginBottom: hp("2%"),
    color: "#000",
    marginTop: hp(1),
    fontFamily: "Poppins-Medium",
  },
  linkList: {
    marginBottom: hp("3%"),
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1.2%"),
  },
  linkText: {
    fontSize: hp("1.5%"),
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
  faqTitle: {
    fontSize: hp("2%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    color: "#000",
    marginTop: hp(4),
    fontFamily: "Poppins-Medium",
  },
  faqItem: {
    paddingVertical: hp("1.8%"),
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: hp("1.5%"),
    color: "#000",
    flex: 1,
    marginRight: wp("2%"),
  },
  faqAnswer: {
    fontSize: hp("1.5%"),
    color: "#555",
    marginTop: hp("1%"),
  },
  needHelp: {
    fontSize: hp("2%"),
    fontWeight: "600",
    marginVertical: hp("2%"),
    color: "#000",
    marginTop: hp(8),
    fontFamily: "Poppins-Medium",
  },
  helpButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: hp("1.4%"),
    paddingHorizontal: wp("4%"),
    flex: 1,
    marginRight: wp("2%"),
  },
  chatText: {
    fontSize: hp("1.5%"),
    marginLeft: wp("2%"),
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
  talkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    flex: 1,
    marginLeft: wp("2%"),
  },
  talkText: {
    fontSize: hp("1.8%"),
    marginLeft: wp("2%"),
    color: "#6C63FF",
    fontFamily: "Poppins-Regular",
    marginTop: hp(0.3),
  },
});
