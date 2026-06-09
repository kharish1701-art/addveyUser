import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const faqs = [
  {
    question: "My ad is still pending. can i get a live",
    answer:
      "To post an ad, navigate to the 'Post Ad' section, fill in the details of your item, and publish it.",
  },
  {
    question: "My ad has rejected. When will i get approved ",
    answer:
      "Posting an ad is free for basic listings. Premium ads may incur additional charges.",
  },
  {
    question: "Iam facing an issue with image uploading ",
    answer: "Ads remain active for 30 days unless manually deactivated.",
  },
  {
    question: "Can I remove ad",
    answer:
      "You can edit or delete your ad anytime from the 'My Ads' section in your profile.",
  },
  {
    question: "where is status of my ad",
    answer: "Ads remain active for 30 days unless manually deactivated.",
  },
  {
    question: "My issue not in the list",
    answer:
      "You can edit or delete your ad anytime from the 'My Ads' section in your profile.",
  },
];

const BuySellContactUsDetailScreen: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigation = useNavigation<any>();

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#D9D9D940" />

      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={hp("2%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Contact us</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: hp("4%") }}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <Text style={styles.faqTitle}>
          Frequently asked questions (FAQ’s) ?
        </Text>
        {/* Two Texts with Vertical Divider */}
        <View style={styles.topTextsWrapper}>
          <Text style={styles.topText}>Created on 30/09/25</Text>
          <View style={styles.divider} />
          <Text style={styles.topText}>Expiries on 30/09/25</Text>
        </View>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleAnswer(index)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={openIndex === index ? "chevron-up" : "chevron-down"}
                size={hp("2%")}
                color="#000"
              />
            </TouchableOpacity>
            {openIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BuySellContactUsDetailScreen;

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
    fontSize: hp("2.2%"),
    marginLeft: wp("3%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  topTextsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1.8),
    marginBottom: hp(2),
  },
  topText: {
    fontSize: hp("1.6%"),
    color: "#00000099",
    fontFamily: "Poppins-Medium",
    paddingHorizontal: wp(2),
  },
  divider: {
    width: 1,
    height: hp(2),
    backgroundColor: "#ccc",
    marginHorizontal: wp(2),
  },
  scrollContent: {
    marginTop: hp("1%"),
    paddingHorizontal: wp("4%"),
  },
  faqTitle: {
    fontSize: hp("2%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    color: "#000",
    marginTop: hp(12),
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
});
