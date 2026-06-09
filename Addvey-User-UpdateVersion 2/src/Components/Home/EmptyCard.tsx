import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
const EmptyCard = ({title}) => {
  const navigation = useNavigation<any>();
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: hp("5%") }}>
      <>
        {/* Mock Ad List */}
        <View style={styles.adCard}>
          <View style={styles.adBox} />
          <View style={styles.adTextContainer}>
            <View style={styles.bigLine} />
            <View style={styles.smallLine} />
          </View>
        </View>

         <View style={styles.adCard}>
          <View style={styles.adBox} />
          <View style={styles.adTextContainer}>
            <View style={styles.bigLine} />
            <View style={styles.smallLine} />
          </View>
        </View>

        <View style={styles.adCard}>
          <View style={styles.adBox} />
          <View style={styles.adTextContainer}>
            <View style={styles.bigLine} />
            <View style={styles.smallLine} />
          </View>
        </View>

    

        {/* Empty Ads Message */}
    <Text style={styles.noAdsText}>No {title ?? "running"} ads</Text>
        <Text style={styles.subText}>
          Want to check performance of your past campaigns?
        </Text>

        {/* View Here with Icon */}
        {/* <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkText}>View here</Text>
          <Ionicons
            name="chevron-forward"
            size={wp("4%")}
            color="#6c63ff"
            style={{ marginTop: hp(0.5) }}
          />
        </TouchableOpacity> */}

        {/* Create Ad Button */}
        <TouchableOpacity style={styles.createAdBtn} onPress={()=>navigation.navigate("Categories")}>
          <Text style={styles.createAdText}>Create Ad</Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

export default EmptyCard;

const styles = StyleSheet.create({
       adCard: {
            width: wp("90%"),
            height: hp("8%"),
            backgroundColor: "white",
            borderRadius: 10,
            marginBottom: hp("1.5%"),
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: wp("3%"),
            borderColor: "#ddd",
            borderWidth: 1,
        },
        adBox: {
            width: wp("12%"),
            height: wp("12%"),
            backgroundColor: "#6E533F4F",
            borderRadius: 6,
        },
        adTextContainer: {
            flex: 1,
            marginLeft: wp("3%"),
            justifyContent: "center",
        },
        bigLine: {
            width: "80%",
            height: hp("0.6%"),
            backgroundColor: "#6E533F4F",
            borderRadius: 4,
            marginBottom: hp("2%"),
        },
        smallLine: {
            width: "50%",
            height: hp("0.6%"),
            backgroundColor: "#6E533F4F",
            borderRadius: 4,
        },
        noAdsText: {
            fontSize: wp("5%"),
            marginTop: hp("3%"),
            fontFamily: "Poppins-Medium",
        },
        subText: {
            fontSize: wp("3.5%"),
            color: "#00000078",
            textAlign: "center",
            marginVertical: hp("1%"),
            width: wp("80%"),
            fontFamily: "Poppins-Regular",
        },
        linkContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: hp("1%"),
        },
        linkText: {
            color: "#6c63ff",
            fontWeight: "500",
            marginRight: wp("1%"),
        },
        createAdBtn: {
            marginTop: hp("4%"),
            width: wp("90%"),
            height: hp("6%"),
            backgroundColor: "#6C63FF",
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
        },
        createAdText: {
            color: "#fff",
            fontSize: wp("4%"),
            fontWeight: "600",
        },
     
});
