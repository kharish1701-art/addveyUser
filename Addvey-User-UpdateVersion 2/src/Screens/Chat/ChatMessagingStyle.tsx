
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  offlineBar: {
    backgroundColor: "#FF6B6B",
    padding: wp("2%"),
    alignItems: "center",
  },
  offlineText: {
    color: "white",
    fontSize: wp("3%"),
    fontWeight: "500",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginTop: hp(4),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp("3%"),
    flex: 1,
  },
  profilePic: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("7%"),
    backgroundColor: "#ddd",
    marginRight: wp("2%"),
  },
  userName: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    width: wp("50%"),
  },
  userSubText: {
    fontSize: wp("3%"),
    color: "#6E533F",
    marginTop: hp(0.3),
  },
  
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: "flex-end",
  },

  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    padding: wp(3),
    borderRadius: wp(10),
    marginBottom: hp(2),
    marginRight: wp(3),
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: wp(5),
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
  },

  modalTitle: {
    fontSize: wp(5),
    marginBottom: hp(2),
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },

  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    gap: wp(3),
  },

  rowText: {
    width: wp("70%"),
    fontSize: wp(3.4),
    color: "#444",
    fontFamily: "Poppins-Medium",
  },

  modalButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: hp(1.5),
    borderRadius: wp(4),
    marginTop: hp(2),
  },

  modalButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: wp(3.8),
    fontFamily: "Poppins-Medium",
  },

  priceBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceText: {
    fontSize: wp("3.5%"),
    fontWeight: "500",
    color: "black",
  },
  priceValue: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: "#00000099",
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    paddingBottom: hp("2%"),
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: hp("1.5%"),
  },
  dateHeaderText: {
    fontSize: wp("3%"),
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("2%"),
  },
  messageLeft: {
    alignSelf: "flex-start",
    marginVertical: hp("0.5%"),
    maxWidth: wp("80%"),
  },
  messageRight: {
    alignSelf: "flex-end",
    marginVertical: hp("0.5%"),
    maxWidth: wp("80%"),
  },
  textMessage: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderRadius: wp("4%"),
    marginVertical: hp("0.3%"),
  },
  myTextMessage: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: wp("1%"),
  },
  theirTextMessage: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: wp("1%"),
  },
  myMessageText: {
    color: "white",
    fontSize: wp("3.8%"),
  },
  theirMessageText: {
    color: "black",
    fontSize: wp("3.8%"),
  },
  topMessageText: {
    fontSize: wp("2.8%"),
    fontWeight: "500",
    color: "#555555",
    marginBottom: hp("0.3%"),
  },
  timeText: {
    fontSize: wp("2.5%"),
    color: "gray",
    marginTop: hp("0.3%"),
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("20%"),
  },
  emptyStateText: {
    fontSize: wp("4%"),
    color: "#666",
    marginBottom: hp("1%"),
    fontWeight: "500",
  },
  emptyStateSubText: {
    fontSize: wp("3.2%"),
    color: "#999",
    textAlign: "center",
  },
  bottomSection: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: hp("2%"),
    paddingTop: hp("1%"),
  },
  inputContainer: {
    marginHorizontal: wp("3%"),
    flexDirection:'row'
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: wp("6%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    fontSize: wp("3.8%"),
    minHeight: hp("5%"),
    maxHeight: hp("15%"),
    textAlignVertical: "center",
    flex:1
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: hp("1%"),
    paddingHorizontal: wp("1%"),
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: wp("2%"),
    borderRadius: wp("10%"),

  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: wp("3%"),
  },
  temporaryMessage: {
    opacity: 0.7,
  },
  sendingText: {
    fontSize: wp("2.5%"),
    color: '#999',
    fontStyle: 'italic',
    marginTop: hp("0.5%"),
  },
});