import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import MainHomeCard from "../Components/Home/MainHomeCard";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getApi } from "../api/getApi/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EndPoints } from "../services/EndPoints";
import Slider from "@react-native-community/slider";

// Calculation formulas based on the provided image
const calculateMetrics = (budget: number) => {
  const coreConversion = 20; // 1 currency unit = 20 ad views
  const adViews = budget * coreConversion;
  const adVisits = Math.round(adViews * 0.1); // 10% of ad views
  const contacts = Math.round(adVisits * 0.25); // 25% of ad visits
  const reach = Math.round(adViews * 0.85); // 85% of ad views
  const searchReach = Math.round(adViews * 0.5); // 50% of ad views
  const mapReach = Math.round(adViews * 0.25); // 25% of ad views

  return {
    adViews,
    adVisits,
    contacts,
    reach,
    searchReach,
    mapReach,
  };
};

// Dummy Components for tabs
const Overall = () => (
  <View style={styles.tabContainer}>
    <Text style={styles.tabText}>Overall Performance</Text>
  </View>
);

const ThisWeek = ({ data, budget }: { data: any; budget: number }) => {
  const metrics = calculateMetrics(budget);

  return (
    <View style={styles.tabContainer}>
      <View style={styles.metricsContainer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>
            Performance Summary (₹{budget})
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{metrics.adViews}</Text>
              <Text style={styles.summaryLabel}>Total Views</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{metrics.adVisits}</Text>
              <Text style={styles.summaryLabel}>Visits</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{metrics.contacts}</Text>
              <Text style={styles.summaryLabel}>Leads</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{metrics.reach}</Text>
              <Text style={styles.summaryLabel}>Reach</Text>
            </View>
          </View>
        </View>
        {[
          {
            label: "AD Views (Impressions)",
            value: metrics.adViews,
            icon: "eye",
            description: `₹${budget} × 20 = ${metrics.adViews} views`,
            formula: "Ad Views = Budget × 20",
          },
          {
            label: "AD Visits (Clicks)",
            value: metrics.adVisits,
            icon: "trending-up",
            description: `${metrics.adViews} × 10% = ${metrics.adVisits} visits`,
            formula: "Ad Visits = Ad Views × 0.10",
          },
          {
            label: "Contacts (Leads)",
            value: metrics.contacts,
            icon: "person-add",
            description: `${metrics.adVisits} × 25% = ${metrics.contacts} contacts`,
            formula: "Contacts = Ad Visits × 0.25",
          },
          {
            label: "Reach (Unique Users)",
            value: metrics.reach,
            icon: "people",
            description: `${metrics.adViews} × 85% = ${metrics.reach} users`,
            formula: "Reach = Ad Views × 0.85",
          },
          {
            label: "Search Reach",
            value: metrics.searchReach,
            icon: "search",
            description: `${metrics.adViews} × 50% = ${metrics.searchReach}`,
            formula: "Search Reach = Ad Views × 0.50",
          },
          {
            label: "Map Reach",
            value: metrics.mapReach,
            icon: "map",
            description: `${metrics.adViews} × 25% = ${metrics.mapReach}`,
            formula: "Map Reach = Ad Views × 0.25",
          },
        ].map((item, index) => (
          <View style={styles.metricBox} key={index}>
            <View style={styles.metricHeader}>
              <Ionicons
                name={item.icon as any}
                size={wp("5%")}
                color="#6C63FF"
                style={{ marginRight: wp("2%") }}
              />
              <View style={styles.metricTextContainer}>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
              </View>
            </View>
            <View style={styles.formulaContainer}>
              <Text style={styles.formulaText}>{item.formula}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Core Conversion Info */}
      <View style={styles.conversionContainer}>
        <Text style={styles.conversionTitle}>Core Conversion</Text>
        <Text style={styles.conversionText}>
          ₹1 = 20 Ad Views (Impressions)
        </Text>
        <Text style={styles.conversionSubtext}>
          This means a{" "}
          <Text style={styles.highlight}>
            ₹{budget} boost = {metrics.adViews} ad views
          </Text>{" "}
          (double compared to normal platforms).
        </Text>
      </View>

      {/* Performance Summary */}
    </View>
  );
};

const LastWeek = () => (
  <View style={styles.tabContainer}>
    <Text style={styles.tabText}>Last Week Performance</Text>
  </View>
);

const AdvertisementsDetailsScreen = () => {
  const route = useRoute();
  const { item } = route.params as { item: any };
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<
    "overall" | "thisWeek" | "lastWeek"
  >("thisWeek");
  const [data, setData] = useState({});
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(500);
  const min = 500;
  const max = 2500;

  const renderTabContent = () => {
    return <ThisWeek data={data} budget={value} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Fixed Topbar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={wp("5%")}
            style={{ marginRight: wp(3) }}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Advertisements details</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: hp("5%"),
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Text style={styles.leftText}>Select budget amount</Text>
          <Text style={styles.rightText}>
            Select the amount you want to spend on this ad
          </Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceText}>₹ {value}</Text>
        </View>

        {/* Slider */}
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={100}
          minimumTrackTintColor="#7B61FF"
          maximumTrackTintColor="#E5E5E5"
          thumbTintColor="#7B61FF"
          value={value}
          onValueChange={setValue}
        />

        {/* Min & Max Labels */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>₹ {min}</Text>
          <Text style={styles.label}>₹ {max}</Text>
        </View>

        <View style={styles.cardInfoRow}>
          <Text style={[styles.leftText, { color: "white" }]}>
            Estimated Performance
          </Text>
        </View>

        {/* Tabs */}

        {renderTabContent()}
      </ScrollView>

         <View style={styles.paymentContainer}>
                {/* Left side */}
                <View style={styles.paymentLeft}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.payText}>Pay using</Text>
                    <MaterialIcons name="arrow-drop-down" size={20} color="#6C63FF" />
                  </View>
                  {/* PayPal section below */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: hp("1%"),
                    }}
                  >
                    <Image
                      source={require("../../assets/images/up.png")}
                      style={styles.paymentImage}
                    />
                    <Text style={styles.payOptionText}>PhonePe UPI</Text>
                  </View>
                </View>
      
                {/* Right side button */}
                <TouchableOpacity
                  style={styles.payButton}
                  // onPress={() => navigation.navigate('PaymentMethod')}
                  // onPress={()=>startPayment(data[activeIndex]?.priceInPaise)}
                  // onPress={() => navigation.navigate("Botomtabs")}
                >
                  <Text style={styles.payButtonText}>
                    Pay ₹ {value}
                  </Text>
                </TouchableOpacity>
              </View>
    </View>
  );
};

export default AdvertisementsDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    height: hp("7%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "#fff",
    marginTop: hp(4),
  },
  topBarTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#000",
  },
  adCard: {
    marginTop: hp(2),
    borderRadius: wp("3%"),
    marginHorizontal: wp(5),
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2%"),
    marginTop: hp(4),
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    marginHorizontal: -20,
  },
  leftText: {
    fontSize: wp("3.8%"),
    color: "black",
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },
  rightText: {
    fontSize: wp("2.8%"),
    color: "#555555",
    fontFamily: "Poppins-Regular",
    marginTop: hp(0.4),
    textAlign: "center",
  },
  tabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("2%"),
    marginBottom: hp("2%"),
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabButton: {
    marginRight: wp("5%"),
    paddingVertical: hp("0.5%"),
  },
  tabButtonText: {
    fontSize: wp("3.6%"),
    color: "#777",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#6C63FF",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "600",
  },
  tabContainer: {
    // paddingHorizontal: wp("2%"),
  },
  tabText: {
    fontSize: wp("4%"),
    textAlign: "center",
    marginTop: hp("2%"),
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: hp("1%"),
  },
  metricBox: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    marginVertical: hp("1%"),
    borderLeftWidth: 4,
    borderLeftColor: "#6C63FF",
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  metricTextContainer: {
    flex: 1,
  },
  metricValue: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#6C63FF",
  },
  metricLabel: {
    fontSize: wp("3.5%"),
    color: "#000000",
    marginTop: hp("0.5%"),
    fontWeight: "600",
  },
  formulaContainer: {
    backgroundColor: "#fff",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  formulaText: {
    fontSize: wp("3%"),
    color: "#666",
    fontFamily: "monospace",
    marginBottom: hp("0.5%"),
  },
  descriptionText: {
    fontSize: wp("2.8%"),
    color: "#888",
    fontStyle: "italic",
  },
  conversionContainer: {
    backgroundColor: "#e3f2fd",
    padding: wp("4%"),
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  conversionTitle: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: hp("1%"),
  },
  conversionText: {
    fontSize: wp("3.5%"),
    color: "#333",
    fontWeight: "600",
    marginBottom: hp("0.5%"),
  },
  conversionSubtext: {
    fontSize: wp("3%"),
    color: "#555",
    lineHeight: hp("2.2%"),
  },
  highlight: {
    fontWeight: "bold",
    color: "#1976d2",
  },
  summaryContainer: {
    backgroundColor: "#6C63FF",
    padding: wp("4%"),
    borderRadius: wp("3%"),
    marginBottom: hp("1%"),
  },
  summaryTitle: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  summaryNumber: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#fff",
  },
  summaryLabel: {
    fontSize: wp("3%"),
    color: "#e0e0e0",
    marginTop: hp("0.5%"),
  },
  priceBox: {
    borderWidth: 1,
    borderColor: "#7B61FF",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 30,
    marginBottom: 15,
    alignSelf: "center",
    backgroundColor: "#f3f0ff",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7B61FF",
  },
  slider: {
    width: "90%",
    height: 40,
    alignSelf: "center",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginTop: -5,
  },
  label: {
    color: "#5A4033",
    fontSize: 14,
    fontWeight: "500",
  },
  paymentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  paymentLeft: {
    flexDirection: "column", // now stacked vertically
    alignItems: "flex-start",
  },
  payText: {
    fontSize: wp("3.5%"),
    color: "#00000073",
    fontWeight: "500",
  },
  paymentImage: {
    width: wp("6%"),
    height: wp("6%"),
    resizeMode: "contain",
  },
  payOptionText: {
    fontSize: wp("3.5%"),
    marginLeft: wp("2%"),
    color: "#333",
    fontWeight: "500",
  },
  payButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("6%"),
    borderRadius: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: wp("3.5%"),
    fontWeight: "600",
  },
});
