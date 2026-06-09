import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<Props> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Logout</Text>

          <Text style={styles.message}>
            Are you sure you want to logout from your account?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#000",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 22,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    backgroundColor: "#E5E5E5",
    width: "48%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutBtn: {
    backgroundColor: "#6C63FF",
    width: "48%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
