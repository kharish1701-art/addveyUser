// // screens/MainHomeScreen.tsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   TextInput,
//   StatusBar,
//   Modal,
//   FlatList,
// } from "react-native";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { Ionicons, Octicons, EvilIcons, Entypo } from "@expo/vector-icons";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getApi, PostAPi } from "../api/getApi/getApi";
// import { EndPoints } from "../services/EndPoints";
// import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
// import Toast from "react-native-toast-message";
// import { SafeAreaView } from "react-native-safe-area-context";

// const NotificationScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const { hideHeaderAndSearch } = route.params || {};
//   const [activeTab, setActiveTab] = useState("All");
//   const [activeFilter, setActiveFilter] = useState("All");

//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [categories, setCategories] = useState([,"All"]);

//   useEffect(() => {
//     getDevice();
//   }, []);

//   const getDevice = async () => {
//     const token = await AsyncStorage.getItem("authToken");
//     console.log(token, "token");
//     console.log(EndPoints.getNotification, "EndPoints.getNotification");
//     const dd = await getApi(EndPoints.getNotification, setLoading, token);
//     console.log(dd?.data?.notifications);
//     const notifications = dd?.data?.notifications || [];
//     console.log(notifications, "notifications");
//     setData(notifications);
//     setFilteredData(notifications);

//     // Extract unique categories from notifications
//     const uniqueCategories = ["Filter","All"];
//     notifications.forEach((notification) => {
//       if (
//         notification.category?.name &&
//         !uniqueCategories.includes(notification.category.name)
//       ) {
//         uniqueCategories.push(notification.category.name);
//       }
//     });
//     setCategories(uniqueCategories);
//   };

//   // Filter data based on search query and category
//   useEffect(() => {
//     let filtered = data;

//     // Filter by search query
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (item) =>
//           item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.location?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Filter by category
//     if (selectedCategory !== "All") {
//       filtered = filtered.filter(
//         (item) => item.category?.name === selectedCategory
//       );
//     }

//     // Filter by tab
//     switch (activeTab) {
//       case "All":
//         // Show all notifications
//         break;
//       case "Reports":
//         filtered = filtered.filter((item) => item.type === "report");
//         break;
//       case "Alerts":
//         filtered = filtered.filter((item) => item.type === "alert");
//         break;
//       case "Promotional":
//         filtered = filtered.filter((item) => item.type === "promo");
//         break;
//       default:
//         break;
//     }

//     setFilteredData(filtered);
//   }, [searchQuery, selectedCategory, activeTab, data]);

//   // Modal visibility state
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [failedImages, setFailedImages] = useState(new Set());

//   const handleNotificationPress = (notification) => {
//     setSelectedNotification(notification);
//     setIsModalVisible(true);
//   };

//   // Bottom Message State
//   const [bottomMessage, setBottomMessage] = useState<{
//     visible: boolean;
//     type: "delete" | "mute";
//     text: string;
//     item: any;
//   }>({
//     visible: false,
//     type: "delete",
//     text: "",
//     item: null,
//   });
//   const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const handleUndo = () => {
//     if (undoTimeoutRef.current) {
//       clearTimeout(undoTimeoutRef.current);
//       undoTimeoutRef.current = null;
//     }

//     if (bottomMessage.type === "delete" && bottomMessage.item) {
//       // Restore the item
//       const itemToRestore = bottomMessage.item;
//       setData((prev: any) => {
//         const newData = [itemToRestore, ...prev];
//         // Optional: Sort by createdAt to ensure correct position
//         return newData.sort((a: any, b: any) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//       });
//     } else if (bottomMessage.type === 'mute') {
//       // Logic to unmute if we implemented muting
//       console.log("Undo mute for:", bottomMessage.item);
//     }

//     setBottomMessage((prev) => ({ ...prev, visible: false }));
//   };

//   const handleDismiss = () => {
//     // Just hide the message. The pending action (timeout) continues.
//     setBottomMessage((prev) => ({ ...prev, visible: false }));
//   };

//   const handleDeleteNotification = () => {
//     const itemToDelete = selectedNotification;
//     setIsModalVisible(false);

//     if (!itemToDelete) return;

//     // Optimistic Update
//     setData((prev: any) => prev.filter((item: any) => item.id !== itemToDelete.id));

//     // Show Toast
//     setBottomMessage({
//       visible: true,
//       type: "delete",
//       text: "Notification deleted",
//       item: itemToDelete,
//     });

//     // Schedule Actual API Call
//     // We do NOT clear previous timeout here to allow multiple deletes in sequence.
//     // The ref tracks the LATEST action for Undo purposes.
//     undoTimeoutRef.current = setTimeout(async () => {
//       try {
//         const token = await AsyncStorage.getItem("authToken");
//         const param = {
//           url: EndPoints.deleteNotification,
//           method: "DELETE",
//           token: token,
//           body: {
//             notificationIds: [itemToDelete.id],
//           },
//         };

//         const response = await PostAPi(param);

//         if (!response?.success) {
//           console.log("Background delete failed", response);
//           // Silent fail or toast? Since the item is gone from UI, silent might be confusing if it comes back on refresh.
//           // For now, let's just log. To be robust, we would re-fetch or restore.
//         } else {
//           console.log("Background delete success");
//         }
//       } catch (error) {
//         console.log("Error in background delete notification", error);
//       }
//     }, 4000); // 4 seconds undo window
//   };

//   const handleTurnOffNotificationType = () => {
//     // Implement turn off notification type functionality here
//     // For now, just show the UI as requested
//     console.log("Turn off notification type for:", selectedNotification);
//     setIsModalVisible(false);

//     setBottomMessage({
//       visible: true,
//       type: 'mute',
//       text: "You will no longer recevice notifications like these. You can re-enable them from the settings page",
//       item: selectedNotification
//     });
//   };

//   const formatTime = (createdAt) => {
//     if (!createdAt) return "";

//     const date = new Date(createdAt);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "1d";
//     if (diffDays < 7) return `${diffDays}d`;
//     if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w`;
//     return `${Math.ceil(diffDays / 30)}m`;
//   };

//   const renderNotificationItem = ({ item }) => (
//     <View style={styles.notificationItem}>
//       {/* Category Image */}
//       {/* Category Image */}
//       {item.category?.image && (
//         <Image
//           source={
//             (!failedImages.has(item.id))
//               ? {
//                 uri: item.category.image.startsWith("http")
//                   ? item.category.image
//                   : IMAGE_BASE_URL + item.category.image
//               }
//               : require("../../assets/images/bagwan.png")
//           }
//           style={styles.notificationImage}
//           onError={() => setFailedImages(prev => new Set(prev).add(item.id))}
//         />
//       )}

//       {/* Content */}
//       <View style={styles.notificationContent}>
//         <Text style={styles.notificationTitle} numberOfLines={1}>
//           {item.title}
//         </Text>
//         <Text style={styles.notificationSubtitle} numberOfLines={2}>
//           {item.message}
//         </Text>
//         <View style={styles.notificationMeta}>
//           <Text style={styles.notificationLocation}>{item.location}</Text>
//           <Text style={styles.notificationCategory}>
//             • {item.category?.name}
//           </Text>
//         </View>
//       </View>

//       {/* Right Side */}
//       <View style={styles.notificationRight}>
//         <Text style={styles.notificationTime}>
//           {formatTime(item.createdAt)}
//         </Text>
//         <TouchableOpacity
//           onPress={() => handleNotificationPress(item)}
//           style={styles.dotsButton}
//         >
//           <Entypo name="dots-three-vertical" size={14} color="black" />
//         </TouchableOpacity>

//         {/* Unread indicator */}
//         {!item.isRead && <View style={styles.unreadIndicator} />}
//       </View>
//     </View>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Ionicons name="notifications-off-outline" size={wp(15)} color="#ccc" />
//       <Text style={styles.emptyStateText}>No notifications found</Text>
//       <Text style={styles.emptyStateSubText}>
//         {searchQuery || selectedCategory !== "All"
//           ? "Try changing your search or filter"
//           : "You're all caught up!"}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={wp("4.5%")} color="black" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Notification</Text>
//         </View>

//         <View style={styles.rightIcons}>
//           <TouchableOpacity
//             style={styles.main}
//             onPress={() => navigation.navigate("NotificationSetting")}
//           >
//             <Ionicons name="settings-outline" size={20} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>




//       {!hideHeaderAndSearch && (
//         <>
//           <View style={styles.buySellRow}>
//             <Text style={styles.buySellText}>Buy/Sell ({data.length})</Text>
//             <View style={styles.buySellActiveIndicator} />
//           </View>

//           {/* Search Bar */}
//           <View style={{ paddingBottom: 10 }}>
//             <View style={styles.searchBar}>
//               <Ionicons
//                 name="search"
//                 size={20}
//                 color="#999"
//                 style={{ marginRight: 6 }}
//               />
//               <TextInput
//                 placeholder="Search notifications..."
//                 placeholderTextColor="#999"
//                 style={styles.searchInput}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity onPress={() => setSearchQuery("")}>
//                   <Ionicons name="close-circle" size={18} color="#777" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </>
//       )}

//       {/* Fixed Header Section */}
//       <View style={styles.fixedHeader}>
//         {/* Tabs */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.tabsContainer}
//           contentContainerStyle={styles.tabsContent}
//         >
//           {["All", "Reports", "Alerts", "Promotional"].map((tab, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.tabBtn}
//               onPress={() => setActiveTab(tab)}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === tab && styles.activeTabText,
//                 ]}
//               >
//                 {tab}
//               </Text>
//               {activeTab === tab && <View style={styles.activeTabIndicator} />}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Category Filters */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.categoryFilters}
//           contentContainerStyle={styles.categoryFiltersContent}
//         >
//           {categories.map((category, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.categoryFilterBtn,
//                 selectedCategory === category && styles.activeCategoryFilterBtn,
//               ]}
//               onPress={() => {
//                 if(category === "Filter"){
//                   navigation.navigate("Filter")
//                 }else{
//                   setSelectedCategory(category)
//                 }
//               }
//                 }
//             >
//               <Text
//                 style={[
//                   styles.categoryFilterText,
//                   selectedCategory === category &&
//                   styles.activeCategoryFilterText,
//                 ]}
//               >
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Notifications List */}
//       <FlatList
//         data={filteredData}
//         renderItem={renderNotificationItem}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={[
//           styles.notificationsList,
//           filteredData.length === 0 && styles.emptyList,
//         ]}
//         ListEmptyComponent={renderEmptyState}
//         style={styles.notificationsFlatList}
//       />

//       {/* Swipe-up Modal */}
//   <Modal
//   visible={isModalVisible}
//   transparent
//   animationType="slide"
//   onRequestClose={() => setIsModalVisible(false)}
// >
//   <View style={styles.modalOverlay}>
//     {/* Close Icon */}
//     <TouchableOpacity
//       style={styles.outsideCloseBtn}
//       onPress={() => setIsModalVisible(false)}
//     >
//       <Ionicons name="close" size={24} color="black" />
//     </TouchableOpacity>

//     <View style={styles.modalContent}>
//       {/* Center Content */}
//       <View style={styles.modalBody}>
//         <TouchableOpacity
//           style={[styles.modalItem, styles.deleteItem]}
//           onPress={handleDeleteNotification}
//         >
//           <View style={styles.modalIconContainer}>
//             <MaterialCommunityIcons
//               name="delete-outline"
//               size={20}
//               color="#FF0303"
//             />
//           </View>
//           <Text style={styles.modalItemTextDel}>Delete notification</Text>
//         </TouchableOpacity>
        
//         <View style={styles.divider} />
        
//         <TouchableOpacity
//           style={[styles.modalItem, styles.muteItem]}
//           onPress={handleTurnOffNotificationType}
//         >
//           <View style={styles.modalIconContainer}>
//             <Ionicons
//               name="notifications-off-outline"
//               size={20}
//               color="#6E533F"
//             />
//           </View>
//           <Text style={styles.modalItemText}>
//             Turn off this notification type
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

//       {/* Bottom Message / Toast */}
//       {bottomMessage.visible && (
//         <View style={styles.bottomMessageContainer}>
//           <View style={styles.bottomMessageLeft}>
//             {bottomMessage.type === 'delete' ? (
//               <MaterialCommunityIcons name="delete-outline" size={20} color="#FF0303" />
//             ) : (
//               <Ionicons name="notifications-off-outline" size={20} color="#6E533F" />
//             )}
//             <Text style={styles.bottomMessageText} numberOfLines={2}>
//               {bottomMessage.text}
//             </Text>
//           </View>
//           <View style={styles.bottomMessageActions}>
//             <TouchableOpacity onPress={handleDismiss} style={{ marginRight: 15 }}>
//               <Text style={styles.actionTextDismiss}>Dismiss</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleUndo}>
//               <Text style={styles.actionTextUndo}>Undo</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default NotificationScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },

//   /** Header */
//   header: {
//     paddingHorizontal: wp("4%"),
//     paddingVertical: hp("1.5%"),
//     // marginTop: hp(4),
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: wp("4%"),
//     fontWeight: "600",
//     marginLeft: wp(2),
//     color: "black",
//   },
//   main: {},
//   rightIcons: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   /** Buy and Sell text */
//   buySellRow: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#D9D9D9",
//     paddingHorizontal: wp("5%"),
//     paddingVertical: hp(1),
//     position: "relative",
//   },
//   buySellText: {
//     fontSize: wp("3.8%"),
//     color: "#000",
//     fontFamily: "Poppins-Medium",
//   },
//   buySellActiveIndicator: {
//     position: "absolute",
//     bottom: 0,
//     left: wp("5%"),
//     width: wp("15%"),
//     height: 3,
//     backgroundColor: "#6A5AE0",
//     borderTopLeftRadius: wp(2),
//     borderTopRightRadius: wp(2),
//   },

//   /** Search Bar */
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: wp(2),
//     paddingHorizontal: wp(3),
//     marginVertical: hp(1.5),
//     marginHorizontal: wp(4),
//     height: hp(5.5),
//     backgroundColor: "#fff",
//     marginBottom: hp(2),
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: hp(1.8),
//     color: "#000",
//   },

//   /** Fixed Header Section */
//   fixedHeader: {
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     paddingBottom: hp(1),

//   },

//   /** Tabs */
//   tabsContainer: {
//     flexGrow: 0,
//   },
//   tabsContent: {
//     paddingHorizontal: wp(4),
//     borderBottomWidth: 1,
//     flex: 1,
//     borderColor: "#D9D9D9",
//     marginBottom: 10,
//   },
//   tabBtn: {
//     paddingVertical: hp(1),
//     paddingHorizontal: wp(4),
//     position: "relative",
//   },
//   tabText: {
//     fontSize: wp(3.5),
//     color: "#666",
//     fontWeight: "500",
//   },
//   activeTabText: {
//     color: "#000000",
//     fontWeight: "600",
//   },
//   activeTabIndicator: {
//     position: "absolute",
//     bottom: -1,
//     left: wp(1),
//     right: wp(1),
//     height: 3,
//     backgroundColor: "#6C63FF",
//     borderTopLeftRadius: wp(2),
//     borderTopRightRadius: wp(2),
//     // width:40
//   },

//   /** Category Filters */
//   categoryFilters: {
//     flexGrow: 0,
//     marginTop: hp(0.5),
//   },
//   categoryFiltersContent: {
//     paddingHorizontal: wp(4),
//   },
//   categoryFilterBtn: {
//     paddingVertical: hp(0.8),
//     paddingHorizontal: wp(4),
//     marginRight: wp(2),
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: wp(2),
//     backgroundColor: "#fff",
//   },
//   activeCategoryFilterBtn: {
//     borderColor: "#6C63FF",
//     // backgroundColor: "#6C63FF",
//   },
//   categoryFilterText: {
//     fontSize: wp(3.2),
//     color: "#666",
//     fontWeight: "500",
//   },
//   activeCategoryFilterText: {
//     color: "#000",
//     fontWeight: "600",
//   },

//   /** Notifications List */
//   notificationsFlatList: {
//     flex: 1,
//   },
//   notificationsList: {
//     paddingHorizontal: wp(4),
//     paddingTop: hp(1),
//     paddingBottom: hp(2),
//   },
//   emptyList: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   notificationItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingVertical: hp(1.5),
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   notificationContent: {
//     flex: 1,
//     marginLeft: wp(3),
//   },
//   notificationImage: {
//     width: wp(12),
//     height: wp(12),
//     borderRadius: wp(2),
//     resizeMode: "cover",
//   },
//   notificationTitle: {
//     fontSize: wp(3.8),
//     color: "#000",
//     fontWeight: "600",
//     marginBottom: hp(0.3),
//   },
//   notificationSubtitle: {
//     fontSize: wp(3.2),
//     color: "#666",
//     marginBottom: hp(0.5),
//     lineHeight: hp(2),
//   },
//   notificationMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   notificationLocation: {
//     fontSize: wp(2.8),
//     color: "#999",
//   },
//   notificationCategory: {
//     fontSize: wp(2.8),
//     color: "#6C63FF",
//     fontWeight: "500",
//   },
//   notificationRight: {
//     alignItems: "flex-end",
//     marginLeft: wp(2),
//     minWidth: wp(12),
//   },
//   notificationTime: {
//     fontSize: wp(2.5),
//     color: "#999",
//     marginBottom: hp(0.5),
//   },
//   dotsButton: {
//     padding: wp(1),
//   },
//   unreadIndicator: {
//     width: wp(1.5),
//     height: wp(1.5),
//     borderRadius: wp(0.75),
//     backgroundColor: "#6C63FF",
//     marginTop: hp(0.5),
//   },

//   /** Empty State */
//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: hp(10),
//   },
//   emptyStateText: {
//     fontSize: wp(4),
//     color: "#666",
//     marginTop: hp(2),
//     fontWeight: "600",
//   },
//   emptyStateSubText: {
//     fontSize: wp(3.2),
//     color: "#999",
//     marginTop: hp(1),
//     textAlign: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0,0,0,0.4)",
//   },
//   outsideCloseBtn: {
//     position: "absolute",
//     top: hp(4),
//     right: wp(4),
//     zIndex: 2,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 8,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: wp(6),
//     paddingTop: hp(4),
//     paddingBottom: hp(6),
//     minHeight: hp(25),
//   },
//   modalBody: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     overflow: 'hidden',
//   },
//   modalItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: hp(2),
//     paddingHorizontal: wp(4),
//     backgroundColor: "#fff",
//   },
//   deleteItem: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   muteItem: {},
//   modalIconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#F8F8F8",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: wp(3),
//   },
//   modalItemText: {
//     fontSize: wp(3.8),
//     color: "#000000",
//     fontFamily: "Poppins-Medium",
//     flex: 1,
//   },
//   modalItemTextDel: {
//     fontSize: wp(3.8),
//     color: "#FF0303",
//     fontFamily: "Poppins-Medium",
//     flex: 1,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#f0f0f0",
//     marginHorizontal: wp(4),
//   },

//   /** Bottom Message Styles - Updated to match screenshot */
//   bottomMessageContainer: {
//     position: 'absolute',
//     bottom: hp(2),
//     left: wp(4),
//     right: wp(4),
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: wp(4),
//     paddingVertical: hp(1.5),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 3.84,
//     elevation: 5,
//     borderLeftWidth: 4,
//     borderLeftColor: '#6C63FF',
//   },
//   bottomMessageLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginRight: 10,
//   },
//   bottomMessageText: {
//     fontSize: wp(3.2),
//     color: '#000',
//     marginLeft: 12,
//     flexShrink: 1,
//     fontFamily: "Poppins-Regular",
//     lineHeight: hp(2.2),
//   },
//   bottomMessageActions: {
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//   },
//   actionTextDismiss: {
//     fontSize: wp(3.2),
//     color: '#FF0303',
//     fontFamily: "Poppins-Medium",
//     marginBottom: hp(0.5),
//   },
//   actionTextUndo: {
//     fontSize: wp(3.2),
//     color: '#6C63FF',
//     fontFamily: "Poppins-Medium",
//   },

// });

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  Modal,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, Octicons, EvilIcons, Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi, PostAPi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { hideHeaderAndSearch } = route.params || {};
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["Filter","All"]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Last 30 days");
  const [filterDuration, setFilterDuration] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      getDevice(filterDuration);
    }, [filterDuration])
  );

  const getDevice = async (duration?: string) => {
    const token = await AsyncStorage.getItem("authToken");
    console.log(token, "token");
    
    let url = EndPoints.getNotification;
    
    // Add duration parameter if provided
    if (duration && duration !== "") {
      const durationMap: Record<string, string> = {
        "thisweek": "thisweek",
        "last30days": "last30days",
        "last3months": "last3months",
        "2024": "2024"
      };
      
      // Use the duration directly if it's already mapped, otherwise use as is
      const durationParam = durationMap[duration] || duration;
      url = `${EndPoints.getNotification}?duration=${durationParam}&page=1&limit=20`;
    }
    
    console.log(url, "API URL");
    
    const dd = await getApi(url, setLoading, token);
    // console.log(dd?.data?.notifications);
    const notifications = dd?.data?.notifications || [];
    // console.log(notifications, "notifications");
    setData(notifications);
    setFilteredData(notifications);

    // Extract unique categories from notifications
    const uniqueCategories = ["Filter", "All"];
    notifications.forEach((notification:any) => {
      if (
        notification.category?.name &&
        !uniqueCategories.includes(notification.category.name)
      ) {
        uniqueCategories.push(notification.category.name);
      }
    });
    setCategories(uniqueCategories);
  };

  // Filter data based on search query and category
  useEffect(() => {
    let filtered = data;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (item) => item.category?.name === selectedCategory
      );
    }

    // Filter by tab
    switch (activeTab) {
      case "All":
        // Show all notifications
        break;
      case "Reports":
        filtered = filtered.filter((item) => item.type === "report");
        break;
      case "Alerts":
        filtered = filtered.filter((item) => item.type === "alert");
        break;
      case "Promotional":
        filtered = filtered.filter((item) => item.type === "promo");
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedCategory, activeTab, data]);

  // Modal visibility state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

  // Bottom Message State
  const [bottomMessage, setBottomMessage] = useState<{
    visible: boolean;
    type: "delete" | "mute";
    text: string;
    item: any;
  }>({
    visible: false,
    type: "delete",
    text: "",
    item: null,
  });
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUndo = () => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    if (bottomMessage.type === "delete" && bottomMessage.item) {
      // Restore the item
      const itemToRestore = bottomMessage.item;
      setData((prev: any) => {
        const newData = [itemToRestore, ...prev];
        // Optional: Sort by createdAt to ensure correct position
        return newData.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    } else if (bottomMessage.type === 'mute') {
      // Logic to unmute if we implemented muting
      console.log("Undo mute for:", bottomMessage.item);
    }

    setBottomMessage((prev) => ({ ...prev, visible: false }));
  };

  const handleDismiss = () => {
    // Just hide the message. The pending action (timeout) continues.
    setBottomMessage((prev) => ({ ...prev, visible: false }));
  };

  const handleDeleteNotification = () => {
    const itemToDelete = selectedNotification;
    setIsModalVisible(false);

    if (!itemToDelete) return;

    // Optimistic Update
    setData((prev: any) => prev.filter((item: any) => item.id !== itemToDelete.id));

    // Show Toast
    setBottomMessage({
      visible: true,
      type: "delete",
      text: "Notification deleted",
      item: itemToDelete,
    });

    // Schedule Actual API Call
    // We do NOT clear previous timeout here to allow multiple deletes in sequence.
    // The ref tracks the LATEST action for Undo purposes.
    undoTimeoutRef.current = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const param = {
          url: EndPoints.deleteNotification,
          method: "DELETE",
          token: token,
          body: {
            notificationIds: [itemToDelete.id],
          },
          requireAuth:true
        };

        const response = await PostAPi(param);

        if (!response?.success) {
          console.log("Background delete failed", response);
          // Silent fail or toast? Since the item is gone from UI, silent might be confusing if it comes back on refresh.
          // For now, let's just log. To be robust, we would re-fetch or restore.
        } else {
          console.log("Background delete success");
        }
      } catch (error) {
        console.log("Error in background delete notification", error);
      }
    }, 4000); // 4 seconds undo window
  };

  const handleTurnOffNotificationType = () => {
    // Implement turn off notification type functionality here
    // For now, just show the UI as requested
    console.log("Turn off notification type for:", selectedNotification);
    setIsModalVisible(false);

    setBottomMessage({
      visible: true,
      type: 'mute',
      text: "You will no longer recevice notifications like these. You can re-enable them from the settings page",
      item: selectedNotification
    });
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return "";

    const date = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1d";
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w`;
    return `${Math.ceil(diffDays / 30)}m`;
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      {/* Category Image */}
      {item.category?.image && (
        <Image
          source={
            (!failedImages.has(item.id))
              ? {
                uri: item.category.image.startsWith("http")
                  ? item.category.image
                  : IMAGE_BASE_URL + item.category.image
              }
              : require("../../assets/images/bagwan.png")
          }
          style={styles.notificationImage}
          onError={() => setFailedImages(prev => new Set(prev).add(item.id))}
        />
      )}

      {/* Content */}
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.notificationSubtitle} numberOfLines={2}>
          {item.message}
        </Text>
        <View style={styles.notificationMeta}>
          <Text style={styles.notificationLocation}>{item.location}</Text>
          <Text style={styles.notificationCategory}>
            • {item.category?.name}
          </Text>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.notificationRight}>
        <Text style={styles.notificationTime}>
          {formatTime(item.createdAt)}
        </Text>
        <TouchableOpacity
          onPress={() => handleNotificationPress(item)}
          style={styles.dotsButton}
        >
          <Entypo name="dots-three-vertical" size={14} color="black" />
        </TouchableOpacity>

        {/* Unread indicator */}
        {!item.isRead && <View style={styles.unreadIndicator} />}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off-outline" size={wp(15)} color="#ccc" />
      <Text style={styles.emptyStateText}>No notifications found</Text>
      <Text style={styles.emptyStateSubText}>
        {searchQuery || selectedCategory !== "All" || filterDuration
          ? "Try changing your search or filter"
          : "You're all caught up!"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={wp("4.5%")} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
        </View>

        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.main}
            onPress={() => navigation.navigate("NotificationSetting")}
          >
            <Ionicons name="settings-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {!hideHeaderAndSearch && (
        <>
          <View style={styles.buySellRow}>
            <Text style={styles.buySellText}>Buy/Sell ({data.length})</Text>
            <View style={styles.buySellActiveIndicator} />
          </View>

          {/* Search Bar */}
          <View style={{ paddingBottom: 10 }}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={20}
                color="#999"
                style={{ marginRight: 6 }}
              />
              <TextInput
                placeholder="Search notifications..."
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#777" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}

      {/* Filter Indicator */}
      {filterDuration && filterDuration !== "" && (
        <View style={styles.activeFilterIndicator}>
          <Text style={styles.activeFilterText}>
            Filter: {selectedFilter}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              setSelectedFilter("Last 30 days");
              setFilterDuration("");
            }}
            style={styles.clearFilterBtn}
          >
            <Ionicons name="close-circle" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {["All", "Reports", "Alerts", "Promotional"].map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilters}
          contentContainerStyle={styles.categoryFiltersContent}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryFilterBtn,
                selectedCategory === category && styles.activeCategoryFilterBtn,
              ]}
              onPress={() => {
                if(category === "Filter"){
                  navigation.navigate("Filter", {
                    selectedFilter: selectedFilter,
                    onApplyFilter: (filter: string) => {
                      setSelectedFilter(filter);
                      // Map display text to API parameter
                      const filterMap: Record<string, string> = {
                        "This week": "thisweek",
                        "Last 30 days": "last30days",
                        "Last three months": "last3months",
                        "2024": "2024"
                      };
                      setFilterDuration(filterMap[filter] || filter.toLowerCase().replace(/\s+/g, ''));
                    }
                  });
                }else{
                  setSelectedCategory(category);
                }
              }}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  selectedCategory === category &&
                  styles.activeCategoryFilterText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredData}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.notificationsList,
          filteredData.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyState}
        style={styles.notificationsFlatList}
      />

      {/* Swipe-up Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Close Icon */}
          <TouchableOpacity
            style={styles.outsideCloseBtn}
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.modalContent}>
            {/* Center Content */}
            <View style={styles.modalBody}>
              <TouchableOpacity
                style={[styles.modalItem, styles.deleteItem]}
                onPress={handleDeleteNotification}
              >
                <View style={styles.modalIconContainer}>
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={20}
                    color="#FF0303"
                  />
                </View>
                <Text style={styles.modalItemTextDel}>Delete notification</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity
                style={[styles.modalItem, styles.muteItem]}
                onPress={handleTurnOffNotificationType}
              >
                <View style={styles.modalIconContainer}>
                  <Ionicons
                    name="notifications-off-outline"
                    size={20}
                    color="#6E533F"
                  />
                </View>
                <Text style={styles.modalItemText}>
                  Turn off this notification type
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Message / Toast */}
      {bottomMessage.visible && (
        <View style={styles.bottomMessageContainer}>
          <View style={styles.bottomMessageLeft}>
            {bottomMessage.type === 'delete' ? (
              <MaterialCommunityIcons name="delete-outline" size={20} color="#FF0303" />
            ) : (
              <Ionicons name="notifications-off-outline" size={20} color="#6E533F" />
            )}
            <Text style={styles.bottomMessageText} numberOfLines={2}>
              {bottomMessage.text}
            </Text>
          </View>
          <View style={styles.bottomMessageActions}>
            <TouchableOpacity onPress={handleDismiss} style={{ marginRight: 15 }}>
              <Text style={styles.actionTextDismiss}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUndo}>
              <Text style={styles.actionTextUndo}>Undo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /** Header */
  header: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    // marginTop: hp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginLeft: wp(2),
    color: "black",
  },
  main: {},
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  /** Buy and Sell text */
  buySellRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp(1),
    position: "relative",
  },
  buySellText: {
    fontSize: wp("3.8%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
  },
  buySellActiveIndicator: {
    position: "absolute",
    bottom: 0,
    left: wp("5%"),
    width: wp("15%"),
    height: 3,
    backgroundColor: "#6A5AE0",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },

  /** Search Bar */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginVertical: hp(1.5),
    marginHorizontal: wp(4),
    height: hp(5.5),
    backgroundColor: "#fff",
    marginBottom: hp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: "#000",
  },

  /** Active Filter Indicator */
  activeFilterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    marginHorizontal: wp(4),
    marginTop: hp(0.5),
    marginBottom: hp(0.5),
    borderRadius: wp(2),
  },
  activeFilterText: {
    fontSize: wp(3),
    color: '#666',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  clearFilterBtn: {
    padding: wp(1),
  },

  /** Fixed Header Section */
  fixedHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: hp(1),
  },

  /** Tabs */
  tabsContainer: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    flex: 1,
    borderColor: "#D9D9D9",
    marginBottom: 10,
  },
  tabBtn: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    position: "relative",
  },
  tabText: {
    fontSize: wp(3.5),
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "600",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: wp(1),
    right: wp(1),
    height: 3,
    backgroundColor: "#6C63FF",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },

  /** Category Filters */
  categoryFilters: {
    flexGrow: 0,
    marginTop: hp(0.5),
  },
  categoryFiltersContent: {
    paddingHorizontal: wp(4),
  },
  categoryFilterBtn: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    backgroundColor: "#fff",
  },
  activeCategoryFilterBtn: {
    borderColor: "#6C63FF",
  },
  categoryFilterText: {
    fontSize: wp(3.2),
    color: "#666",
    fontWeight: "500",
  },
  activeCategoryFilterText: {
    color: "#000",
    fontWeight: "600",
  },

  /** Notifications List */
  notificationsFlatList: {
    flex: 1,
  },
  notificationsList: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationContent: {
    flex: 1,
    marginLeft: wp(3),
  },
  notificationImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(2),
    resizeMode: "cover",
  },
  notificationTitle: {
    fontSize: wp(3.8),
    color: "#000",
    fontWeight: "600",
    marginBottom: hp(0.3),
  },
  notificationSubtitle: {
    fontSize: wp(3.2),
    color: "#666",
    marginBottom: hp(0.5),
    lineHeight: hp(2),
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationLocation: {
    fontSize: wp(2.8),
    color: "#999",
  },
  notificationCategory: {
    fontSize: wp(2.8),
    color: "#6C63FF",
    fontWeight: "500",
  },
  notificationRight: {
    alignItems: "flex-end",
    marginLeft: wp(2),
    minWidth: wp(12),
  },
  notificationTime: {
    fontSize: wp(2.5),
    color: "#999",
    marginBottom: hp(0.5),
  },
  dotsButton: {
    padding: wp(1),
  },
  unreadIndicator: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    backgroundColor: "#6C63FF",
    marginTop: hp(0.5),
  },

  /** Empty State */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(10),
  },
  emptyStateText: {
    fontSize: wp(4),
    color: "#666",
    marginTop: hp(2),
    fontWeight: "600",
  },
  emptyStateSubText: {
    fontSize: wp(3.2),
    color: "#999",
    marginTop: hp(1),
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  outsideCloseBtn: {
    position: "absolute",
    bottom: hp(26),
    right: wp(4),
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    paddingBottom: hp(6),
    minHeight: hp(25),
  },
  modalBody: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: "#fff",
  },
  deleteItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  muteItem: {},
  modalIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  modalItemText: {
    fontSize: wp(3.8),
    color: "#000000",
    fontFamily: "Poppins-Medium",
    flex: 1,
  },
  modalItemTextDel: {
    fontSize: wp(3.8),
    color: "#FF0303",
    fontFamily: "Poppins-Medium",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: wp(4),
  },

  /** Bottom Message Styles - Updated to match screenshot */
  bottomMessageContainer: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(4),
    right: wp(4),
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  bottomMessageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  bottomMessageText: {
    fontSize: wp(3.2),
    color: '#000',
    marginLeft: 12,
    flexShrink: 1,
    fontFamily: "Poppins-Regular",
    lineHeight: hp(2.2),
  },
  bottomMessageActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  actionTextDismiss: {
    fontSize: wp(3.2),
    color: '#FF0303',
    fontFamily: "Poppins-Medium",
    marginBottom: hp(0.5),
  },
  actionTextUndo: {
    fontSize: wp(3.2),
    color: '#6C63FF',
    fontFamily: "Poppins-Medium",
  },
});