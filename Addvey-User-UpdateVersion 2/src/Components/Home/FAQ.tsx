import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    ScrollView,
    SafeAreaView,
    Image,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const faqs = [
    {
        question: "How can I post an ad to sell an item?",
        answer: "Go to the 'Post Ad' section, fill in the details, and publish your ad.",
    },
    {
        question: "What are the fees for posting an ad?",
        answer: "Posting an ad is free, but premium options are available.",
    },
    {
        question: "How long will my ad remain active?",
        answer: "Ads remain active for 30 days, after which you can renew them.",
    },
    {
        question: "How can I edit or delete my ad?",
        answer: "Go to 'My Ads', select the ad, and choose edit or delete.",
    },
    {
        question: "Can I highlight my ad to increase visibility?",
        answer: "Yes, you can purchase premium features to highlight your ad.",
    },
    {
        question: "How do I contact a seller?",
        answer: "You can contact the seller directly via chat or provided phone number.",
    },
];

const FAQScreen: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: hp("2%") }}
                showsVerticalScrollIndicator={false}
            >
                {/* FAQ Section */}
                <Text style={styles.heading}>Frequently asked questions (FAQ’s)?</Text>

                {faqs.map((item, index) => (
                    <View key={index} style={styles.faqItem}>
                        <TouchableOpacity
                            style={styles.faqHeader}
                            onPress={() => toggleFAQ(index)}
                        >
                            <Text style={styles.faqQuestion}>{item.question}</Text>
                            <MaterialIcons
                                name={openIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                size={wp("5%")}
                                color="#000"
                            />
                        </TouchableOpacity>
                        {openIndex === index && (
                            <Text style={styles.faqAnswer}>{item.answer}</Text>
                        )}
                    </View>
                ))}

                {/* Footer Section */}
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>Addvey</Text>
                    <Text style={styles.footerSubtitle}>Partner App</Text>

                    {/* Contact Section */}
                    <Text style={styles.contactTitle}>CONTACT ADDVEY</Text>

                    <TouchableOpacity
                        style={styles.contactBox}
                        onPress={() => Linking.openURL("mailto:support@addvey.com")}
                    >
                        <MaterialIcons name="email" size={wp("5%")} color="#6C63FF" />
                        <Text style={styles.contactText}>support@addvey.com</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.contactBox}
                        onPress={() => Linking.openURL("tel:+919392322767")}
                    >
                        <Ionicons name="call" size={wp("5%")} color="#6C63FF" />
                        <Text style={styles.contactText}>+91 93-92-322-767</Text>
                    </TouchableOpacity>

                    {/* Social / Image Section */}
                    <Text style={styles.socialTitle}>SOCIAL LINKS</Text>
                    <View style={styles.socialRow}>
                        <Image
                            source={require('../../../assets/images/youtube.png')}
                            style={styles.socialIcon}
                        />
                        <Image
                            source={require('../../../assets/images/x.png')}
                            style={styles.socialIcon}
                        />
                        <Image
                            source={require('../../../assets/images/fb.png')}
                            style={styles.socialIcon}
                        />
                        <Image
                            source={require('../../../assets/images/insta.png')}
                            style={styles.socialIcon}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        width: "100%",
        paddingHorizontal: wp(1),
    },
    heading: {
        fontSize: wp("3.9%"),
        marginBottom: hp("2%"),
        color: "#000",
        fontFamily: "Poppins-Bold",
        width: "100%",
        textAlign: "left",
    },
    faqItem: {
        paddingVertical: hp("1.5%"),
        width: "100%",
    },
    faqHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    faqQuestion: {
        fontSize: wp("3%"),
        color: "#000",
        flexShrink: 1,
        flexWrap: "wrap",
        fontFamily: "Poppins-Medium",
        marginRight: wp("2%"),
    },
    faqAnswer: {
        marginTop: hp("1%"),
        fontSize: wp("3%"),
        color: "#555",
        lineHeight: hp("2.5%"),
        flexShrink: 1,
        flexWrap: "wrap",
    },
    footer: {
        width: "100%",
        paddingVertical: hp("5%"),
        backgroundColor: "#D9D9D959",
        alignItems: "center",
        marginTop: hp(4),
        paddingHorizontal: wp(7),
        borderRadius: 10,
    },
    footerTitle: {
        fontSize: wp("5%"),
        color: "#000",
        fontFamily: 'Poppins-Bold',
    },
    footerSubtitle: {
        fontSize: wp("2.1%"),
        color: "#6E533F",
        marginBottom: hp("2%"),
        fontFamily: 'Poppins-Regular',
    },
    contactTitle: {
        fontSize: wp("4%"),
        marginBottom: hp("1%"),
        color: "black",
        alignSelf: "flex-start",
        fontFamily: 'Poppins-Regular',
    },
    contactBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: hp("1.5%"),
        marginBottom: hp("1.5%"),
        width: "100%",
        justifyContent: "flex-start",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#6C63FF33",
        paddingHorizontal: wp("5%"),
    },
    contactText: {
        marginLeft: wp("2%"),
        fontSize: wp("3.5%"),
        color: "#6C63FF",
        fontFamily: 'Poppins-Medium',
    },
    socialTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        marginTop: hp("2%"),
        marginBottom: hp("2%"),
        color: "#000",
        fontFamily: 'Sen-Medium'
    },
    socialRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 15,
        width: "100%",
    },
    socialIcon: {
        width: wp("8%"),
        height: wp("8%"),
        resizeMode: "contain",
    },
});

export default FAQScreen;
