// components/ReportModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onOptionSelect: (selected: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  onOptionSelect,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={hp(3)} color="black" />
        </TouchableOpacity>

        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <Ionicons name="warning-outline" size={hp(2)} color="#FF0303" />
            <Text style={styles.headerText}>Report Profile</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              "Inaccurate photos or details",
              "Offensive content",
              "Fraud",
              "Duplicate ad",
              "I have some other issue",
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionContainer}
                onPress={() => {
                  const selectedType = item;
                  onClose();
                  setTimeout(() => onOptionSelect(selectedType), 300);
                }}
              >
                <Text style={styles.optionText}>{item}</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={hp(2)}
                  color="black"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
    padding: wp(5),
    minHeight: hp(38),
  },
  closeButton: {
   alignSelf: "flex-end",
    marginBottom: hp(1),
    marginRight: wp(2),
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(1.5),
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  headerText: {
    fontSize: hp(2),
    color: "#FF0303",
    marginLeft: wp(2),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
  },
  optionText: {
    fontSize: hp(1.5),
    color: "#000000CC",
    fontFamily: "Poppins-Medium",
  },
});
