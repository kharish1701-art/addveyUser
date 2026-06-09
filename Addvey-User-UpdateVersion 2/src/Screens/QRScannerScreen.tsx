import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import jsQR from 'jsqr';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi, PostAPi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints"; 
import ReportDetailModal from "../Components/Profile/ReportDetailModal";
import InfoReportScreen from "./Chat/infoReportScreen";

const QRScannerScreen = () => {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<CameraView>(null);

  // All hooks at the top
  const [flash, setFlash] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [facing, setFacing] = useState('back');
  const [expanded, setExpanded] = useState(false);

  const sheetHeight = useRef(new Animated.Value(hp("14%"))).current; // initial height
const [reportModat, setReportModal] = useState(false)
  const [loading ,setLoading] = useState(false)
  const handleReportSubmit = async (text: string) => {
    console.log("User submitted:", text);
    setLoading(true);
    const userToken = await AsyncStorage.getItem("authToken");
    // \"abuse\"|\"spam\"|\"other\"

    const param = {
      url: EndPoints.addReport,
      body: {
        productId: item?.id,
        reason: 'other',
        // selectedReport == "Fraud"
        //   ? "spam"
        //   : selectedReport == "Duplicate ad"
        //   ? "spam"
        //   : selectedReport == "Inaccurate photos or details"
        //   ? "abuse"
        //   : selectedReport == "Offensive content"
        //   ? "abuse"
        //   : "other",

        type: "report",
        description: text,
      },
      token: userToken || "",
    };

    const dd = await PostAPi(param, setLoading);
    if (dd?.success) {
      console.log("<><><><><><", param.body);
      // navigation.goBack()
      setReportModal(false);
      Alert.alert("Success", "Report submitted successfully");
    }

    setReportModal(false);
    // 👉 Send to API OR show toast OR store in context
  };
    const [modalVisible, setModalVisible] = useState(false);

  const handleReport = () => {
    setModalVisible(true);
    // Alert.alert("Report", "Report this user or conversation?");
  };
  const reportPress = () => {
    setModalVisible(false)
    setReportModal(true)
  }
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    requestPermissions();
  }, []);

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0].uri) {
        console.log("Gallery image:", result.assets[0].uri);
        // await scanQRFromImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const scanQRFromImage = async (imageUri: string) => {
    try {
      setIsLoading(true);

      // Read the image file
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create image element to get dimensions
      const image = new Image();
      image.src = `data:image/jpeg;base64,${base64}`;

      image.onload = () => {
        // Create canvas to process image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Decode QR code
        const decoded = jsQR(imageData.data, imageData.width, imageData.height);

        if (decoded) {
          console.log("QR Code found:", decoded.data);
          processScannedData(decoded.data);
        } else {
          Alert.alert("No QR Code", "No QR code found in the selected image");
          setScanned(false);
          setHasScanned(false);
        }
        setIsLoading(false);
      };

      image.onerror = () => {
        setIsLoading(false);
        Alert.alert("Error", "Failed to process image");
      };

    } catch (error) {
      console.error("Error scanning QR from image:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to scan QR code from image");
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,

      onPanResponderMove: (_, gesture) => {
        // swipe up → expand sheet
        if (gesture.dy < -20) {
          Animated.timing(sheetHeight, {
            toValue: hp("37%"),
            duration: 250,
            useNativeDriver: false,
          }).start(() => setExpanded(true));
        }
        // swipe down → collapse sheet
        else if (gesture.dy > 20) {
          Animated.timing(sheetHeight, {
            toValue: hp("14%"),
            duration: 250,
            useNativeDriver: false,
          }).start(() => setExpanded(false));
        }
      },
    })
  ).current;

  const processScannedData = (data: string) => {
    if (scanned || hasScanned) return;

    setScanned(true);
    setHasScanned(true);

    try {
      const parsedData = JSON.parse(data);
      console.log('Scanned QR Data:', parsedData);

      if (parsedData?.type === 'ad') {
        getProductDetails(parsedData?.id);
      } else {
        Alert.alert('Invalid QR', 'This is not a valid Addevy QR code');
        setScanned(false);
        setHasScanned(false);
      }

    } catch (error) {
      console.error('Error parsing QR data:', error);
      Alert.alert('Invalid QR', 'This QR code is not supported');
      setScanned(false);
      setHasScanned(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    processScannedData(data);
  };

  const getProductDetails = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await getApi(EndPoints.getProductDetail + id, setIsLoading, token);

      if (response?.data) {
        navigation.navigate("AddPreview", { from: "scan", data: response.data });
      } else {
        Alert.alert('Error', 'Product not found');
        setScanned(false);
        setHasScanned(false);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert('Error', 'Failed to fetch product details');
      setScanned(false);
      setHasScanned(false);
    }
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false)
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ color: "#fff" }}>Camera permission not granted.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={hp("2.8%")} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Addvey QR Scanner</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={toggleFlash}
            style={{ marginRight: wp("3%") }}
          >
            <MaterialIcons
              name={flash ? "flashlight-on" : "flashlight-off"}
              size={hp("2.6%")}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBlackCircle} onPress={()=>handleReport()}>
            <Ionicons
              name="information-circle-outline"
              size={hp("2.8%")}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        enableTorch={flash}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.fullOverlay} />

        <View style={styles.overlayCenter}>
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </CameraView>

      {/* Camera Flip Button */}
      <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
        <Ionicons name="camera-reverse" size={hp("2.8%")} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={pickFromGallery}
        style={styles.uploadBtn}
        disabled={isLoading}
      >
        <MaterialCommunityIcons
          name="image-outline"
          style={styles.uploadIcon}
          size={19}
          color="black"
        />
        <Text style={styles.uploadText}>
          {isLoading ? "Processing..." : "Upload from gallery"}
        </Text>
      </TouchableOpacity>

      {/* ---------------- BOTTOM SHEET ---------------- */}
      <Animated.View
        style={[styles.bottomSheet, { height: sheetHeight }]}
        {...panResponder.panHandlers}
      >
        {/* Drag line */}
        <View style={styles.dragLine} />

        <View style={styles.sheetContent}>
          <Text style={styles.mainTitle}>Scan Addvey QR code to view</Text>

          <Text style={styles.subTitle}>Buy/Sell</Text>

          {/* Only show this content when expanded */}
          {expanded && (
            <View style={styles.centerColumn}>
              <Image
                source={require("../../assets/images/scan.png")}
                style={styles.centerIcon}
              />
              <View style={styles.textRow}>
                <Text style={styles.centerTextTitle}>Scan Addvey QR code</Text>
              </View>
              <View style={styles.textRow}>
                <Text style={styles.centerTextDesc}>
                  Position your phone to make sure the Addvey QR code within the frame for ( Buy & Sell )
                </Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
      <ReportDetailModal
        visible={reportModat}
        onClose={() => setReportModal(false)}
        onSubmit={handleReportSubmit}
      />
         <InfoReportScreen
          onClose={() => setModalVisible(false)}
          visible={modalVisible}
          reportPress={reportPress}
          from ={'product'}
        />

    </View>
  );
};

export default QRScannerScreen;

const cornerSize = hp("4.5%");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    paddingTop: hp("4%"),
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("1%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
    position: "absolute",
    top: 0,
  },
  iconBlackCircle: {
    borderRadius: wp("10%"),
    backgroundColor: "#000000ED",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(5),
  },
  headerTitle: {
    color: "#fff",
    fontSize: hp("2.4%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.7),
  },
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayCenter: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: hp("10%"),
  },
  scanBox: {
    width: wp("70%"),
    height: hp("32%"),
    borderRadius: 12,
    backgroundColor: "transparent",
    padding: wp("3%"),
    marginTop: hp("5%"),
  },
  corner: {
    width: cornerSize,
    height: cornerSize,
    position: "absolute",
    borderWidth: 4,
    borderColor: "transparent",
  },
  topLeft: {
    top: wp("3%"),
    left: wp("3%"),
    borderTopColor: "red",
    borderLeftColor: "red",
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: wp("3%"),
    right: wp("3%"),
    borderTopColor: "orange",
    borderRightColor: "orange",
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: wp("3%"),
    left: wp("3%"),
    borderBottomColor: "blue",
    borderLeftColor: "blue",
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: wp("3%"),
    right: wp("3%"),
    borderBottomColor: "green",
    borderRightColor: "green",
    borderBottomRightRadius: 12,
  },
  flipButton: {
    position: "absolute",
    top: hp("55%"),
    right: wp("10%"),
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: wp("3%"),
    borderRadius: 50,
  },
  uploadBtn: {
    position: "absolute",
    top: hp("49%"),
    alignSelf: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: wp("3.8%"),
    paddingVertical: hp("0.8%"),
    borderRadius: 50,
    alignItems: "center",
    opacity: 1,
  },
  uploadIcon: { marginRight: wp("2%") },
  uploadText: {
    fontSize: hp("1.6%"),
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: wp("5%"),
    paddingTop: hp("1.5%"),
  },
  dragLine: {
    width: wp("13%"),
    height: hp("0.6%"),
    backgroundColor: "#fff",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: hp("1%"),
  },
  sheetContent: {
    alignItems: "center",
  },
  mainTitle: {
    color: "#fff",
    fontSize: hp("2.3%"),
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  subTitle: {
    color: "#fff",
    marginTop: hp("0.8%"),
    fontSize: hp("2.0%"),
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
  },
  centerColumn: {
    marginVertical: hp("3%"),
    justifyContent: "center",
    alignItems: "center",
  },
  textRow: {
    flexDirection: "row",
    marginTop: hp("0.5%"),
    justifyContent: "center",
    width: wp("100%"),
    paddingHorizontal: wp(1),
  },
  centerIcon: {
    width: wp("22%"),
    height: wp("22%"),
    marginBottom: hp("1%"),
    resizeMode: "contain",
  },
  centerTextTitle: {
    color: "#fff",
    fontSize: hp("1.8%"),
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    marginBottom: hp("0.5%"),
  },
  centerTextDesc: {
    color: "#ccc",
    fontSize: hp("1.5%"),
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    paddingHorizontal: wp("8%"),
    lineHeight: hp("2.4%"),
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
