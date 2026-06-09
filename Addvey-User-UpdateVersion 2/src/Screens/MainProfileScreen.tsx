import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Linking,
  Platform,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import SuggestScreen from "../Components/Category/SuggestProductScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi } from "../api/getApi/getApi";
import apiClient, { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";
import { EndPoints } from "../services/EndPoints";
import { goPlayStore, shareApp } from "../Components/CommonFunction";

const MainProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedLangIds, setSelectedLangIds] = useState<string[]>([]); // Store language IDs
  const [selectedLangNames, setSelectedLangNames] = useState<string[]>([]); // Store language names for display
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [suggestVisible, setSuggestVisible] = useState(false);
  const [token, setToken] = useState("");
  const [profileData, setProfileData] = useState<any>({});
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const animatedSuggestHeight = useRef(new Animated.Value(0)).current;
  const [showAll, setShowAll] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);

  // Available languages from API
  const [availableLanguages, setAvailableLanguages] = useState<
    { id: string; name: string; native_name?: string }[]
  >([]);

  const [displayChips, setDisplayChips] = useState<
    { label: string; native: string; id: string }[]
  >([]);

  // Helper function to parse languages
  const parseLanguagesToArray = (
    languagesData: string | string[] | undefined | null
  ) => {
    if (!languagesData) return [];

    let langs: string[] = [];
    if (Array.isArray(languagesData)) {
      langs = languagesData;
    } else if (typeof languagesData === "string") {
      langs = languagesData
        .split(",")
        .map((lang) => lang.trim())
        .filter((lang) => lang.length > 0);
    }

    const uniqueLangs = new Set();
    const result: string[] = [];
    langs.forEach((lang) => {
      const lower = lang.toLowerCase();
      if (!uniqueLangs.has(lower)) {
        uniqueLangs.add(lower);
        result.push(lang);
      }
    });
    return result;
  };

  // Load saved languages from AsyncStorage and map to names
  const loadSavedLanguages = useCallback(async () => {
    try {
      // Load saved language IDs
      const savedLangIds = await AsyncStorage.getItem("language");
      if (savedLangIds) {
        const parsedLangIds = savedLangIds.split(",").filter(Boolean);
        console.log('------ saved Language IDs:', parsedLangIds);
        setSelectedLangIds(parsedLangIds);
        
        // If we have available languages, map IDs to names
        if (availableLanguages.length > 0) {
          const langNames = parsedLangIds.map(id => {
            const lang = availableLanguages.find(l => l.id === id);
            return lang ? lang.name : id; // Return name if found, otherwise ID
          }).filter(Boolean);
          
          console.log('------ mapped Language Names:', langNames);
          setSelectedLangNames(langNames);
        }
      }
      
      // Also try to load from selectedLanguages (full objects format)
      const savedLangsJson = await AsyncStorage.getItem("selectedLanguages");
      if (savedLangsJson) {
        try {
          const savedLangs = JSON.parse(savedLangsJson);
          if (Array.isArray(savedLangs) && savedLangs.length > 0) {
            const langNamesFromObjects = savedLangs.map((lang: any) => 
              lang.name || lang.label || ""
            ).filter(Boolean);
            
            if (langNamesFromObjects.length > 0) {
              console.log('------ loaded from selectedLanguages:', langNamesFromObjects);
              setSelectedLangNames(langNamesFromObjects);
              
              // Also extract IDs
              const idsFromObjects = savedLangs.map((lang: any) => 
                lang.id || ""
              ).filter(Boolean);
              
              if (idsFromObjects.length > 0) {
                setSelectedLangIds(idsFromObjects);
              }
            }
          }
        } catch (e) {
          console.error("Error parsing selectedLanguages:", e);
        }
      }
    } catch (error) {
      console.error("Failed to load saved languages", error);
    }
  }, [availableLanguages]);

  // languages from profile data (backup)
  const languagesFromProfile = parseLanguagesToArray(profileData?.languages);

  // Fetch available languages from API
  const fetchAvailableLanguages = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (!storedToken) return;

      const response = await apiClient.get("/languages/view-languages?target=user", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response?.data?.success) {
        const languagesData = response.data.data?.data || [];
        console.log("✅ Available languages fetched:", languagesData);

        // Remove duplicates based on 'id'
        const uniqueLanguages = Array.from(
          new Map(languagesData.map((item: any) => [item.id, item])).values()
        );
        setAvailableLanguages(uniqueLanguages as { id: string; name: string; native_name?: string }[]);
        
        // After setting available languages, load saved ones
        await loadSavedLanguages();
      }
    } catch (error) {
      console.error("Error fetching available languages:", error);
    }
  };

  // Fetch available languages on mount
  useEffect(() => {
    fetchAvailableLanguages();
  }, []);

  // When availableLanguages change, update selected language names
  useEffect(() => {
    if (availableLanguages.length > 0 && selectedLangIds.length > 0) {
      // Map selected language IDs to names
      const langNames = selectedLangIds.map(id => {
        const lang = availableLanguages.find(l => l.id === id);
        return lang ? lang.name : id;
      }).filter(Boolean);
      
      setSelectedLangNames(langNames);
    }
  }, [availableLanguages, selectedLangIds]);

  // Map available languages to chip objects for display
  useEffect(() => {
    if (availableLanguages.length > 0) {
      // If user has selected languages, show those first
      let chipsToDisplay = [];
      
      if (selectedLangIds.length > 0) {
        // Show user's selected languages as chips
        const selectedChips = selectedLangIds
          .map(id => {
            const lang = availableLanguages.find(l => l.id === id);
            return lang ? {
              id: lang.id,
              label: lang.name,
              native: lang.native_name || lang.name,
            } : null;
          })
          .filter(Boolean)
          .slice(0, 3); // Show max 3 selected languages
          
        chipsToDisplay = selectedChips as { label: string; native: string; id: string }[];
        
        // If we have less than 3 selected languages, add some from available languages
        if (chipsToDisplay.length < 3) {
          const remainingSlots = 3 - chipsToDisplay.length;
          const availableIds = chipsToDisplay.map(chip => chip.id);
          const additionalChips = availableLanguages
            .filter(lang => !availableIds.includes(lang.id))
            .slice(0, remainingSlots)
            .map(lang => ({
              id: lang.id,
              label: lang.name,
              native: lang.native_name || lang.name,
            }));
          
          chipsToDisplay = [...chipsToDisplay, ...additionalChips];
        }
      } else {
        // No selected languages, show first 3 available languages
        chipsToDisplay = availableLanguages.slice(0, 3).map((lang) => ({
          id: lang.id,
          label: lang.name,
          native: lang.native_name || lang.name,
        }));
      }
      
      setDisplayChips(chipsToDisplay);

      // Default to first selected language or first chip
      if (!selectedLanguageId) {
        if (chipsToDisplay.length > 0) {
          setSelectedLanguageId(chipsToDisplay[0].id);
        }
      }
    }
  }, [availableLanguages, selectedLangIds]);

  // Priority: selectedLangNames > languagesFromProfile
  const displayLanguages = selectedLangNames.length > 0 ? selectedLangNames : languagesFromProfile;
  const visibleLanguages = showAll ? displayLanguages : displayLanguages.slice(0, 3);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) setToken(storedToken);
    };
    init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Token:", token);

        const response = await getApi(EndPoints.getProfile, setLoading, token);
        console.log(response);
        if (response?.success) {
          setIsLoggedIn(true);
          setProfileData(response.data);
          console.log(response, "get__api__from__you");
          
          // Reload saved languages when profile data is fetched
          await loadSavedLanguages();
        }
      };
      fetchProfile();
    }, [loadSavedLanguages])
  );

  const Logout = async () => {
    await AsyncStorage.clear().then(async (res) => {
      // Clear all states
      setSelectedLangIds([]);
      setSelectedLangNames([]);
      setDisplayChips([]);
      setSelectedLanguageId(null);
      setIsLoggedIn(false);
      setProfileData({});
      
      navigation.replace("Login");
    });
  };

  const openSuggest = () => {
    setSuggestVisible(true);
    Animated.timing(animatedSuggestHeight, {
      toValue: hp("50%"),
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const closeSuggest = () => {
    Animated.timing(animatedSuggestHeight, {
      toValue: 0,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => setSuggestVisible(false));
  };

  // Show logout confirmation modal
  const showLogoutConfirmation = () => {
    setLogoutModalVisible(true);
  };

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    Logout();
  };

  // Cancel logout
  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#D9D9D940" />

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={handleLogoutCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleLogoutCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogoutConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp("4.5%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>You</Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("BuySellContactUs")}
          >
            <Image
              source={require("../../assets/images/verify.png")}
              style={styles.profileImageTopbar}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddveySettings")}
          >
            <Image
              source={require("../../assets/images/setting.png")}
              style={styles.profileImageTopbar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Section */}
      {!isLoggedIn && (
        <View style={styles.loginCard}>
          <View>
            <Text style={styles.loginTitle}>Account</Text>
            <Text style={styles.loginSubtitle}>
              Login to access nearby services,{"\n"}store & more...
            </Text>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Card (after login) */}
      {isLoggedIn && (
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate("VerifyEmailProfile")}
        >
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigation.navigate("VerifyEmailProfile")}
            >
              <Image
                source={
                  profileData?.image && !imageError
                    ? {
                      uri: profileData.image.startsWith("http")
                        ? profileData.image
                        : IMAGE_BASE_URL + profileData.image,
                    }
                    : require("../../assets/images/bagwan.png")
                }
                style={styles.profileImage}
                onError={() => setImageError(true)}
              />
            </TouchableOpacity>
            <View style={styles.profileDetails}>
              <View style={styles.row}>
                <Text style={styles.name}>{profileData?.name}</Text>
              </View>
              <Text style={styles.phone}>{profileData?.phone}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Following")}>
            <View style={styles.followRow}>
              <Text style={styles.followText}>Following</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={16}
                color="#6C63FF"
                style={{ marginLeft: 0.5, marginTop: hp(0.5) }}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.detailsBlock}>
            <Text style={styles.langLabel}>
              Languages I Know{" "}
              <Feather name="arrow-right" size={10} color="#6C63FF" />
            </Text>

            {/* --- Languages Text --- */}
            {visibleLanguages.length > 0 ? (
              <>
                <Text style={styles.languages}>
                  {visibleLanguages.map((item, index) =>
                    index === 0
                      ? item.charAt(0).toUpperCase() + item.slice(1)
                      : " • " + item.charAt(0).toUpperCase() + item.slice(1)
                  )}
                </Text>

                {/* --- More / Less Button --- */}
                {displayLanguages.length > 3 && (
                  <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                    <Text style={styles.moreTextLang}>
                      {showAll ? "Show Less" : "More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.noLanguagesText}>
                No languages selected yet
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Incomplete Details Section */}
        {(!profileData?.email || !profileData?.emailVerified) && (
          <View style={styles.cardLanguage}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("VerifyEmailProfile")}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.sectionTitle}>Incomplete details</Text>
                <Feather name="arrow-right" size={20} color="#6C63FF" />
              </View>

              <Text style={{ color: "#6C63FF", fontFamily: "Poppins-Medium", marginTop: hp(1), fontSize: wp(3.5) }}>
                Add & verify your Email
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp(1) }}>
                <Text style={{ color: '#666', fontSize: wp(3), fontFamily: "Poppins-Regular", flex: 1, paddingRight: wp(2) }}>
                  Get latest updates of your buyings
                </Text>
                <TouchableOpacity
                  style={{ backgroundColor: '#6C63FF', paddingHorizontal: wp(5), paddingVertical: hp(0.8), borderRadius: 20 }}
                  onPress={() => navigation.navigate("VerifyEmailProfile")}
                >
                  <Text style={{ color: '#fff', fontSize: wp(3), fontFamily: 'Poppins-Medium' }}>Continue</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Language Section */}
        <View style={styles.cardLanguage}>
          <View style={styles.row}>
            <View style={styles.shortLeftBorder} />
            <Text style={styles.sectionTitle}>Try Addvey in your language</Text>
          </View>
          <View style={styles.langRow}>
            {displayChips.length > 0 ? (
              displayChips.map((chip) => {
                // const isSelected = chip.id === selectedLanguageId;
                const isUserSelected = selectedLangIds.includes(chip.id);
                
                return (
                  <TouchableOpacity
                    key={chip.id}
                    style={[
                      styles.langChip,
                      isUserSelected && styles.activeLangChip,
                      // isUserSelected && styles.userSelectedChip, // Highlight user's selected languages
                    ]}
                    onPress={() => setSelectedLanguageId(chip.id)}
                  >
                    <Text
                      style={[
                        styles.langText,
                        isUserSelected && styles.activeLangText,
                        // isUserSelected && styles.userSelectedText,
                      ]}
                    >
                      {chip.native || chip.label}
                      {/* {isUserSelected} */}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noLanguagesTextChip}>
                Loading languages...
              </Text>
            )}
            <TouchableOpacity onPress={() => navigation.navigate("Language", { from: 'profile' })}>
              <Text style={styles.moreText}>more+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rest of your code remains the same... */}
        {/* How to use */}
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => navigation.navigate("HowTouse")}
        >
          <View style={styles.row}>
            <SimpleLineIcons
              name="question"
              style={{ marginRight: wp(2) }}
              size={18}
              color="black"
            />
            <Text style={styles.sectionTitle}>How to use Addvey</Text>
          </View>
          <Feather name="arrow-right" size={20} color="black" />
        </TouchableOpacity>

        {/* Start selling */}
        <View style={styles.cardLanguage}>
          <View style={styles.row}>
            <View style={styles.shortLeftBorder} />
            <Text style={styles.sectionTitle}>Start selling for free</Text>
          </View>
          <TouchableOpacity
            style={styles.cardRowPostAdd}
            onPress={() => goPlayStore()}
          >
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/3.png")}
                style={styles.leftIcon}
              />
              <Text style={styles.sectionTitle}>Addvey</Text>
            </View>
            <Image
              source={require("../../assets/images/share.png")}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Feedback */}
        <View style={styles.cardLanguage}>
          <View style={styles.row}>
            <View style={styles.shortLeftBorder} />
            <Text style={styles.sectionTitle}>FEEDBACK</Text>
          </View>
          <TouchableOpacity
            style={styles.cardRowPostAdd}
            onPress={() => navigation.navigate("ShareSuggestion")}
          >
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/edit.png")}
                style={styles.leftIcon}
              />
              <Text style={styles.sectionTitle}>Share Your Suggestions </Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={22}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardRowPostAdd}
            onPress={() => goPlayStore()}
          >
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/star.png")}
                style={styles.leftIcon}
              />
              <Text style={styles.sectionTitle}>Rate Us</Text>
            </View>
            <Image
              source={require("../../assets/images/share.png")}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Others */}
        <View style={styles.cardLanguage}>
          <View style={styles.row}>
            <View style={styles.shortLeftBorder} />
            <Text style={styles.sectionTitle}>OTHERS</Text>
          </View>
          <TouchableOpacity
            style={styles.cardRowPostAdd}
            onPress={() => goPlayStore()}
          >
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/plus.png")}
                style={styles.leftIcon}
              />
              <Text style={styles.sectionTitle}>What's New</Text>
            </View>
            <Image
              source={require("../../assets/images/share.png")}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardRowPostAdd}
            onPress={() =>
              navigation.navigate(
                "SocialLinkListScreen"
              )
            }
          >
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/link.png")}
                style={styles.leftIcon}
              />
              <Text style={styles.sectionTitle}>Social Links</Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={22}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardRowPostAdd}
            onPress={() => navigation.navigate("TieUps")}
          >
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/tie.png")}
                style={styles.leftIcon}
              />
              <Text style={styles.sectionTitle}>Tie-ups</Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={22}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardRowPostAdd} onPress={openSuggest}>
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/starplus.png")}
                style={styles.leftIcon}
              />
              <Text style={styles.sectionTitle}>Suggest a Product</Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={22}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* About */}
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => navigation.navigate("Policy")}
        >
          <View style={styles.row}>
            <Image
              source={require("../../assets/images/tablet.png")}
              style={styles.leftIcon}
            />
            <Text style={styles.sectionTitle}>About Addvey</Text>
          </View>
          <Ionicons name="chevron-forward" size={wp("4%")} color="#000" />
        </TouchableOpacity>

        {/* Share app */}
        <TouchableOpacity
          style={styles.Bottombutton}
          onPress={() => shareApp()}
        >
          <View style={styles.row}>
            <Feather
              name="share"
              size={18}
              style={{ marginRight: wp(2) }}
              color="black"
            />
            <Text style={styles.sectionTitle}>Share the app</Text>
          </View>
        </TouchableOpacity>

        {/* Logout / Login */}
        <TouchableOpacity
          style={styles.BottombuttonLogin}
          onPress={isLoggedIn ? showLogoutConfirmation : () => navigation.replace("Login")}
        >
          <View style={styles.row}>
            {isLoggedIn ? (
              <Image
                source={require("../../assets/images/logout.png")}
                style={styles.leftIcon}
              />
            ) : (
              <MaterialIcons
                name="login"
                size={wp("5%")}
                color="#FF0303"
                style={{ marginRight: wp("2%") }}
              />
            )}
            <Text style={styles.sectionTitleLogin}>
              {isLoggedIn ? "Log out" : "Log in"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Suggest Modal with Overlay */}
      {suggestVisible && (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.suggestCloseIcon}
            onPress={closeSuggest}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          <Animated.View
            style={[styles.bottomSheet, { height: animatedSuggestHeight }]}
          >
            <SuggestScreen />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default MainProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D9D9D940" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: hp(4),
  },
  topBarTitle: {
    fontSize: wp("4%"),
    flex: 1,
    marginLeft: wp(3),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.5),
  },
  topBarRight: { flexDirection: "row", alignItems: "center", gap: 13 },
  scrollContent: { padding: wp("4%"), paddingBottom: hp("4%") },

  // Login Card
  loginCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: wp("4%"),
    paddingHorizontal: wp(6),
    marginBottom: hp("1%"),
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loginTitle: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "#000",
  },
  loginSubtitle: {
    fontSize: wp("3%"),
    color: "#666",
    marginTop: hp(0.5),
    fontFamily: "Poppins-Regular",
  },
  loginButton: {
    paddingVertical: hp("0.8%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 12,
    borderColor: "#6C63FF",
    borderWidth: 1,
  },
  loginButtonText: {
    color: "#6C63FF",
    fontFamily: "Poppins-Medium",
    fontSize: wp(3.2),
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: wp("4%"),
    paddingHorizontal: wp(6),
    marginBottom: hp("1%"),
    marginHorizontal: wp(4),
  },
  row: { flexDirection: "row", alignItems: "center" },
  profileImage: {
    width: wp("16%"),
    height: wp("16%"),
    borderRadius: wp("9%"),
    resizeMode: "contain",
  },
  profileDetails: { marginLeft: wp("3.2%"), justifyContent: "center" },
  profileImageTopbar: {
    width: wp("5.8%"),
    height: wp("5.8%"),
    resizeMode: "contain",
  },
  name: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginRight: wp("2%"),
    fontFamily: "Poppins-Medium",
  },
  phone: { fontSize: wp("2.8%"), color: "#000000", marginTop: hp("0.2%") },
  detailsBlock: { marginTop: hp("1%"), alignItems: "flex-start" },
  langLabel: { fontSize: wp("3%"), color: "#6E533F", marginBottom: hp("0.5%") },
  followRow: { flexDirection: "row", alignItems: "center", marginTop: hp(1) },
  followText: { fontSize: hp(1.6), color: "#6C63FF" },
  languages: {
    fontSize: wp("3%"),
    marginTop: hp(0.4),
    fontFamily: "Poppins-Medium",
  },
  noLanguagesText: {
    fontSize: wp("3%"),
    marginTop: hp(0.4),
    fontFamily: "Poppins-Regular",
    color: "#666",
    fontStyle: "italic",
  },
  noLanguagesTextChip: {
    fontSize: wp("3%"),
    fontFamily: "Poppins-Regular",
    color: "#666",
    fontStyle: "italic",
    marginRight: wp(2),
  },
  partnerIdContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
    paddingTop: hp("1%"),
  },
  partnerId: { fontSize: wp("3.5%"), color: "#6E533F", textAlign: "center" },
  partnerIdIcon: {
    width: wp("5%"),
    height: wp("5%"),
    resizeMode: "contain",
    marginLeft: wp("2%"),
  },

  cardLanguage: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: wp("4%"),
    paddingHorizontal: wp(3.2),
    marginBottom: hp("2%"),
  },
  sectionTitle: {
    fontSize: wp("3.8%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
  },
  sectionTitleLogin: {
    fontSize: wp("3.8%"),
    fontFamily: "Poppins-Medium",
    marginTop: hp(0.4),
    color: "#FF0303",
  },
  leftIcon: {
    width: wp("5%"),
    height: wp("5%"),
    marginRight: wp("2%"),
    resizeMode: "contain",
  },

  langRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp("1%"),
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
    alignItems: "center",
  },
  langChip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("0.8%"),
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  activeLangChip: { 
    borderColor: "#6C63FF",
    backgroundColor: "#6C63FF10",
  },
  userSelectedChip: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  langText: { 
    fontSize: wp(3), 
    color: "#444" 
  },
  activeLangText: { 
    color: "#6C63FF", 
    fontFamily: "Poppins-Medium" 
  },
  userSelectedText: {
    color: "#2E7D32",
    fontFamily: "Poppins-Medium",
  },
  moreText: {
    color: "#6C63FF",
    alignSelf: "center",
    marginLeft: wp("2%"),
    marginTop: hp(0.5),
    fontFamily: "Poppins-Medium",
    fontSize: wp(3.8),
  },
  moreTextLang: {
    color: "#6C63FF",
    alignSelf: "center",
    marginLeft: wp("0%"),
    marginTop: hp(0.5),
    fontFamily: "Poppins-Medium",
    fontSize: wp(3),
  },
  cardRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: wp("4%"),
    marginBottom: hp("2%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Bottombutton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: wp("4%"),
    marginBottom: hp("2%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#6C63FF33",
    borderWidth: 1,
  },
  BottombuttonLogin: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: wp("4%"),
    marginBottom: hp("2%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FF030333",
    borderWidth: 1,
  },
  cardRowPostAdd: {
    marginTop: hp("1%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
    marginBottom: hp(0.6),
  },
  shortLeftBorder: {
    width: 3,
    height: hp("3.2%"),
    backgroundColor: "black",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    left: "-3.6%",
  },

  // Overlay background
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  suggestCloseIcon: {
    zIndex: 101,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 10,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    zIndex: 100,
    elevation: 100,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: wp("6%"),
    padding: wp("6%"),
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: wp("5%"),
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  modalMessage: {
    fontSize: wp("3.8%"),
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: hp("2.5%"),
    marginBottom: hp("3%"),
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: wp("3%"),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  logoutButton: {
    backgroundColor: "#6C63FF",
  },
  cancelButtonText: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "#374151",
  },
  logoutButtonText: {
    fontSize: wp("4%"),
    fontFamily: "Poppins-Medium",
    color: "white",
  },
});
