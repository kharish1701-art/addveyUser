import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface ReportDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (details: string) => void;
  initialValue?: string;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValue = "",
}) => {
  const [details, setDetails] = useState(initialValue);

  useEffect(() => {
    setDetails(initialValue);
  }, [initialValue, visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : 'padding'}
        keyboardVerticalOffset={Platform.OS === "ios" ? hp(8) : -40}
        
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            {/* Close icon */}
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={onClose}
            >
              <Ionicons name="close" size={hp(3)} color="black" />
            </TouchableOpacity>

            <View style={styles.modalContainer}>
              <Text style={styles.heading}>
                Inaccurate photos or details
              </Text>

              <Text style={styles.subHeading}>
                Share more details about the issue
              </Text>

              <Text style={styles.description}>
                We will get them fixed as soon as possible
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Start typing here..."
                placeholderTextColor="#aaa"
                multiline
                textAlignVertical="top" // 🔥 IMPORTANT for Android
                value={details}
                onChangeText={setDetails}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  Keyboard.dismiss();
                  onSubmit(details);
                }}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
 

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  closeIconContainer: {
   alignSelf: "flex-end",
    marginBottom: hp(1),
    marginRight: wp(2),
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(1.5),
    elevation: 5,

  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
    paddingBottom: hp(4),
  },
  heading: {
    fontSize: hp(2),
    marginBottom: hp(3),
    color: "black",
    fontFamily: "Poppins-Medium",
  },
  subHeading: {
    fontSize: hp(1.8),
    color: "black",
    marginBottom: hp(0.5),
    fontFamily: "Poppins-Medium",
  },
  description: {
    fontSize: hp(1.4),
    color: "#666",
    marginBottom: hp(2),
    fontFamily: "Poppins-Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(5),
    padding: wp(3),
    minHeight: hp(15),
    textAlignVertical: "top",
    fontSize: hp(1.6),
    color: "#00000099",
    fontFamily: "Poppins-Medium",
  },
  submitButton: {
    backgroundColor: "#6C63FF",
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.4),
    marginTop: hp(3),
  },
  submitText: {
    color: "#fff",
    fontSize: hp(1.8),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.3),
  },
});

export default ReportDetailModal;
