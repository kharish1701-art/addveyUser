import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'

const DeleteProductModal = ({deleteModalVisible, setDeleteModalVisible, DeleteProduct}:any) => {
  return (
     <Modal
           visible={deleteModalVisible}
           transparent
           animationType="fade"
           onRequestClose={() => setDeleteModalVisible(false)}
         >
           <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
             <View style={styles.modalOverlay}>
               <View style={styles.modalBox}>
                 <Text style={styles.modalTitle}>Your AD</Text>
                 <Text style={styles.modalMessage}>
                   Delete cannot be undone. Please confirm carefully
                 </Text>
   
                 <View style={styles.modalButtons}>
                   <TouchableOpacity
                     style={[styles.button]}
                     onPress={() => DeleteProduct()}
                   >
                     <Text style={{ color: "red", fontWeight: "bold" }}>
                       Delete
                     </Text>
                   </TouchableOpacity>
                   <View
                     style={{
                       height: 2,
                       width: "100%",
                       backgroundColor: "#00000033",
                     }}
                   ></View>
                   <TouchableOpacity
                     style={[styles.button, {}]}
                     onPress={() => setDeleteModalVisible(false)}
                   >
                     <Text>Cancel</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             </View>
           </TouchableWithoutFeedback>
         </Modal>
  )
}

export default DeleteProductModal

const styles = StyleSheet.create({
     modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    width: "60%",
  },
  button: {
    // flex: 1,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
})