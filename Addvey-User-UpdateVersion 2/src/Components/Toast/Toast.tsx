// ToastConfig.js
import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      borderLeftColor="#F44336"
      contentContainerStyle={{ paddingHorizontal: 15, backgroundColor: '#fdecea', zIndex: 1000 }}
      text1Style={{ fontSize: 16 }}
      text2Style={{ fontSize: 14 }}
    />
  ),
  delete: ({ text1 }) => (
    <View style={{
      height: 50,
      width: '90%',
      backgroundColor: '#1A1A1A',
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      alignSelf: 'center',
      marginBottom: 40, // Adjust for bottom position
    }}>
      <Ionicons name="trash" size={24} color="#FF4D4D" />
      <Text style={{
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 10,
        flex: 1
      }}>
        {text1}
      </Text>
    </View>
  ),
};

export const errorToast = (message, time = 2000,position = 'top') => {
  Toast.show({
    type: 'error',
    text1: message,
    position: position,
    visibilityTime: time,
    topOffset: 50,
  });
};
