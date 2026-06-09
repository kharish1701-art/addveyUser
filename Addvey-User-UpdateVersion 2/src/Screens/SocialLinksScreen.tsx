// AddLinkScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EndPoints } from "../services/EndPoints";
import { mutationHandler } from "../services/mutations/mutationHandler";
import { PostAPi } from "../api/getApi/getApi";
import LoadingModal from "../Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LinkItem {
  platform: string;
  url: string;
}

const AddLinkScreen: React.FC = ({ onSave, onCancel, currentUrl = "" }) => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRoute();
  const data = route?.params?.data;
  const [links, setLinks] = useState<LinkItem[]>(route?.params?.data ?? []);

  const handleAddLink = () => {
    if (platform.trim() && url.trim()) {
      setLinks([...links, { platform, url }]);
      setPlatform("");
      setUrl("");
      setModalVisible(false);
    }
  };

  // 📤 Submit
  const handleSubmit = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem("authToken");

    const param = {
      url: EndPoints.createProfile,
      body: {
        socialLinks: links,
      },
      token: userToken || "",
    };
    const allUrls = links.map((link) => link.url).join(", ");
    onSave(allUrls);
    const dd = await PostAPi(param, setLoading)
    if (dd?.success) {
        console.log("<><><><><><", param.body);
        // navigation.goBack()
    }
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingModal />}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={wp(5)} color="#000" />
          <Text style={styles.topTitle}>Links</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* ScrollView for saved links */}
      <ScrollView
        style={styles.linksContainer}
        contentContainerStyle={{
          paddingBottom: hp(12),
          flexGrow: 1,
          justifyContent: links.length === 0 ? "center" : "flex-start",
        }}
        showsVerticalScrollIndicator={false}
      >
        {links.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.centerText}>Create links</Text>
          </View>
        ) : (
          links.map((item, index) => (
            <View key={index} style={styles.linkBox}>
              {/* Title */}
              <Text style={styles.linkTitle}>{item.platform}</Text>
              <View style={styles.linkDivider} />

              {/* URL Label */}
              <Text style={styles.urlLabel}>URL</Text>

              {/* URL Row */}
              <View style={styles.linkRow}>
                <Text style={styles.linkUrl}>{item.url}</Text>
                <FontAwesome name="pencil-square-o" size={16} color="#6E533F" />
              </View>

              {/* Divider below URL */}
              <View style={styles.linkDivider} />
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Add Link</Text>

              {/* Title Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  value={platform}
                  onChangeText={(text: string) => setPlatform(text)}
                  placeholder="Enter title"
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>

              {/* URL Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  value={url}
                  onChangeText={(text: string) => setUrl(text)}
                  placeholder="Enter URL"
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Done Button */}
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleAddLink}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default AddLinkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Top Bar
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: hp(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
    marginTop: hp(4),
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  topTitle: {
    fontSize: wp(4),
    fontFamily: "Poppins-Medium",
    marginLeft: wp(2),
    color: "#000",
    marginTop: hp(0.3),
  },
  saveButton: {
    backgroundColor: "#6C63FFB8",
    paddingHorizontal: wp(6),
    paddingVertical: hp(0.4),
    borderRadius: 20,
    paddingTop: hp(0.7),
  },
  saveButtonText: {
    fontSize: wp(3.5),
    color: "#fff",
    fontFamily: "Poppins-Medium",
  },

  // ScrollView Links
  linksContainer: {
    flex: 1,
    marginTop: hp(12),
    paddingHorizontal: wp(4),
  },
  linkBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: hp(2),
    elevation: 2,
    marginTop: hp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },
  linkTitle: {
    fontSize: wp(4),
    fontFamily: "Poppins-Medium",
    color: "#000",
    marginBottom: hp(0.5),
  },
  linkDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: hp(0.5),
  },
  urlLabel: {
    fontSize: wp(3.2),
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: hp(0.3),
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkUrl: {
    fontSize: wp(3.5),
    color: "#333",
    flex: 1,
    marginRight: wp(2),
  },

  // Center Content
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    fontSize: wp(4.5),
    fontFamily: "Poppins-Regular",
    color: "#000",
  },

  // Bottom Button
  bottomContainer: {
    position: "absolute",
    bottom: hp(3.5),
    left: wp(2.5),
    right: wp(2.5),
  },
  addButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.4),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontFamily: "Poppins-Medium",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: wp(85),
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: wp(5),
    elevation: 5,
  },
  modalTitle: {
    fontSize: wp(4.5),
    fontFamily: "Poppins-Medium",
    color: "#000",
    marginBottom: hp(2),
    paddingHorizontal: wp(0.8),
  },
  inputContainer: {
    marginBottom: hp(1.5),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.6),
    fontSize: wp(3.5),
    color: "#000",
  },
  doneButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(0.8),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.2),
  },
  doneButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontFamily: "Poppins-Medium",
  },
});

// SocialLinks.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";

// const SocialLinks = ({ onSave, onCancel, currentUrl = "" }) => {
//   const [inputUrl, setInputUrl] = useState(currentUrl);

//   const handleSave = () => {
//     if (!inputUrl.trim()) {
//       Alert.alert("Error", "Please enter a valid URL");
//       return;
//     }

//     // Validate URL format
//     if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
//       Alert.alert("Error", "Please enter a valid URL starting with http:// or https://");
//       return;
//     }

//     // Call parent's save function
//     onSave(inputUrl);
//   };

//   const handleCancel = () => {
//     onCancel();
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.container}>
//           <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={handleCancel}>
//               <Ionicons name="arrow-back" size={hp("2.5%")} color="#000" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>Add Social Link</Text>
//             <View style={{ width: 24 }} /> {/* Spacer for alignment */}
//           </View>

//           {/* Content */}
//           <ScrollView
//             style={styles.scrollContainer}
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.content}>
//               <Text style={styles.label}>Enter Social Media URL *</Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="https://example.com/profile"
//                 placeholderTextColor="#999"
//                 value={inputUrl}
//                 onChangeText={setInputUrl}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 keyboardType="url"
//                 autoFocus={true}
//               />

//               <Text style={styles.note}>
//                 Please enter a valid URL including http:// or https://
//               </Text>

//               <View style={styles.exampleContainer}>
//                 <Text style={styles.exampleTitle}>Examples:</Text>
//                 <Text style={styles.exampleText}>• https://linkedin.com/in/yourname</Text>
//                 <Text style={styles.exampleText}>• https://twitter.com/yourname</Text>
//                 <Text style={styles.exampleText}>• https://facebook.com/yourname</Text>
//                 <Text style={styles.exampleText}>• https://instagram.com/yourname</Text>
//               </View>
//             </View>
//           </ScrollView>

//           {/* Bottom Button */}
//           <View style={styles.bottomContainer}>
//             <TouchableOpacity
//               style={styles.saveButton}
//               onPress={handleSave}
//             >
//               <Text style={styles.saveButtonText}>Save URL</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: wp("5%"),
//     paddingVertical: hp("2%"),
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//     marginTop: hp(4),
//   },
//   headerTitle: {
//     fontSize: hp("2%"),
//     color: "#000",
//     fontFamily: "Poppins-SemiBold",
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: hp("10%"),
//   },
//   content: {
//     paddingHorizontal: wp("5%"),
//     paddingTop: hp("4%"),
//   },
//   label: {
//     fontSize: hp("1.8%"),
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: hp("2%"),
//     fontFamily: "Poppins-Medium",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: wp("2%"),
//     padding: wp("4%"),
//     fontSize: hp("1.7%"),
//     marginBottom: hp("2%"),
//     fontFamily: "Poppins-Regular",
//     backgroundColor: "#f9f9f9",
//   },
//   note: {
//     fontSize: hp("1.4%"),
//     color: "#666",
//     marginBottom: hp("4%"),
//     fontStyle: "italic",
//     fontFamily: "Poppins-Regular",
//     lineHeight: hp("2%"),
//   },
//   exampleContainer: {
//     backgroundColor: "#f5f5f5",
//     padding: wp("4%"),
//     borderRadius: wp("2%"),
//     marginTop: hp("2%"),
//   },
//   exampleTitle: {
//     fontSize: hp("1.6%"),
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: hp("1%"),
//     fontFamily: "Poppins-SemiBold",
//   },
//   exampleText: {
//     fontSize: hp("1.4%"),
//     color: "#666",
//     marginBottom: hp("0.5%"),
//     fontFamily: "Poppins-Regular",
//   },
//   bottomContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     paddingHorizontal: wp("5%"),
//     paddingVertical: hp("2%"),
//     borderTopWidth: 1,
//     borderTopColor: "#E0E0E0",
//   },
//   saveButton: {
//     backgroundColor: "#6C63FF",
//     padding: hp("1.8%"),
//     borderRadius: wp("2%"),
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: hp("1.8%"),
//     fontWeight: "600",
//     fontFamily: "Poppins-SemiBold",
//   },
// });

// export default SocialLinks;
