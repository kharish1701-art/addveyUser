import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import RazorpayCheckout from "react-native-razorpay";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const RazorPay = () => {

    const navigation = useNavigation<any>();
   const startPayment = (amount) => {
       const options = {
         description: "Payment for order #123",
         image: "https://picsum.photos/200/300",
         currency: "INR",
         key: "rzp_test_SOf9hA2iahUUyu", // Replace with your Razorpay Key ID
         amount: parseInt(amount), // Amount in paise = ₹500
         name: "Addvey Vender App",
         prefill: {
           email: "customer@example.com",
           contact: "9999999999",
           name: "Govind Singh",
         },
         theme: { color: "#F37254" },
       };
   
       RazorpayCheckout.open(options)
         .then((data) => {
           Alert.alert(
             "Payment Success",
             `Payment ID: ${data.razorpay_payment_id}`
           );
         })
         .catch((error) => {
           Alert.alert("Payment Failed", `${error.code} | ${error.description}`);
         });
     };
  return (
    <View>
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
            onPress={()=>startPayment(data[activeIndex]?.priceInPaise)}
            // onPress={() => navigation.navigate("Botomtabs")}
          >
            <Text style={styles.payButtonText}>
              Pay ₹ {data[activeIndex]?.priceInPaise}
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default RazorPay

const styles = StyleSheet.create({

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
})