// screens/PersonalizationScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, Octicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../Components/Loader";

// API Configuration
const API_BASE_URL = "https://api.addvey.com/api/history-preferences";
// Types
interface PreferenceData {
  section: string;
  showHistory: boolean;
  pauseHistory: boolean;
  autoDelete: boolean;
  autoDeleteDuration: string;
}

interface ApiPreference {
  id: number;
  userId: number;
  section: string;
  showHistory: boolean;
  pauseHistory: boolean;
  autoDelete: boolean;
  autoDeleteDuration: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
  data: ApiPreference[];
}

interface TabState {
  showHistory: boolean;
  pauseHistory: boolean;
  autoDelete: boolean;
  autoDeleteDuration: string;
  dontAutoDelete: boolean;
}

const PersonalizationScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [activeTopTab, setActiveTopTab] = useState("Searched");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<ApiPreference[]>([]);

  // State for each tab
  const [tabStates, setTabStates] = useState<Record<string, TabState>>({
    Searched: {
      showHistory: false,
      pauseHistory: false,
      autoDelete: false,
      autoDeleteDuration: "1 month",
      dontAutoDelete: true,
    },
    Viewed: {
      showHistory: false,
      pauseHistory: false,
      autoDelete: false,
      autoDeleteDuration: "1 month",
      dontAutoDelete: true,
    },
    Shared: {
      showHistory: false,
      pauseHistory: false,
      autoDelete: false,
      autoDeleteDuration: "1 month",
      dontAutoDelete: true,
    },
    Comment: {
      showHistory: false,
      pauseHistory: false,
      autoDelete: false,
      autoDeleteDuration: "1 month",
      dontAutoDelete: true,
    },
  });

  // Auto-delete dropdown states
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const topTabs = [
    {
      key: "Searched",
      label: "Searched",
      icon: <Ionicons name="search" size={hp(2)} color="#00000099" />,
      apiSection: "searched_history",
    },
    {
      key: "Viewed",
      label: "Viewed",
      icon: <Octicons name="eye" size={hp(2)} color="#00000099" />,
      apiSection: "viewed_history",
    },
    {
      key: "Shared",
      label: "Shared",
      icon: <Ionicons name="share-outline" size={hp(2)} color="#00000099" />,
      apiSection: "shared_history",
    },
    {
      key: "Chat",
      label: "Chat",
      icon: (
        <MaterialIcons
          name="chat-bubble-outline"
          size={hp(2)}
          color="#00000099"
        />
      ),
      apiSection: "Comment_history",
    },
  ];

  // Get current active tab state
  const currentState = tabStates[activeTopTab];
  const currentTab = topTabs.find((tab) => tab.key === activeTopTab);

  // Convert duration for API
  const convertDurationForAPI = (duration: string): string => {
    const durationMap: Record<string, string> = {
      "1 month": "1_month",
      "2 months": "2_months",
      "3 months": "3_months",
      "4 months": "4_months",
    };
    return durationMap[duration] || "1_month";
  };

  // Convert duration from API
  const convertDurationFromAPI = (duration: string): string => {
    const durationMap: Record<string, string> = {
      "1_month": "1 month",
      "2_months": "2 months",
      "3_months": "3 months",
      "4_months": "4 months",
    };
    return durationMap[duration] || "1 month";
  };

  // Fetch all preferences on component mount
  useEffect(() => {
    fetchAllPreferences();
  }, []);

  const fetchAllPreferences = async () => {
    setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/view-all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const result: ApiResponse = await response.json();
      console.log("Fetched preferences:", result);

      if (response.ok && result.success) {
        setPreferences(result.data);
        updateTabStatesFromApi(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch preferences");
      }
    } catch (error: any) {
      console.error("Error fetching preferences:", error);
      // Alert.alert("Error", "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const updateTabStatesFromApi = (apiData: ApiPreference[]) => {
    const newTabStates: Record<string, TabState> = { ...tabStates };

    topTabs.forEach((tab) => {
      const apiPreference = apiData.find(
        (pref) => pref.section === tab.apiSection,
      );

      if (apiPreference) {
        newTabStates[tab.key] = {
          showHistory: apiPreference.showHistory,
          pauseHistory: apiPreference.pauseHistory,
          autoDelete: apiPreference.autoDelete,
          autoDeleteDuration: convertDurationFromAPI(
            apiPreference.autoDeleteDuration,
          ),
          dontAutoDelete: !apiPreference.autoDelete,
        };
      } else {
        // Set default values if no preference exists
        newTabStates[tab.key] = {
          showHistory: false,
          pauseHistory: false,
          autoDelete: false,
          autoDeleteDuration: "1 month",
          dontAutoDelete: true,
        };
      }
    });

    setTabStates(newTabStates);
  };

  const savePreferences = async () => {
    if (!currentTab) return;

    setSaving(true);
    try {
      const requestBody: PreferenceData = {
        section: currentTab.apiSection,
        showHistory: currentState.showHistory,
        pauseHistory: currentState.pauseHistory,
        autoDelete: !currentState.dontAutoDelete,
        autoDeleteDuration: convertDurationForAPI(
          currentState.autoDeleteDuration,
        ),
      };

      console.log("Saving preferences:", requestBody);
      const userToken = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local state with saved data
        const updatedPreferences = [...preferences];
        const existingIndex = updatedPreferences.findIndex(
          (pref) => pref.section === currentTab.apiSection,
        );

        if (existingIndex !== -1) {
          updatedPreferences[existingIndex] = {
            ...updatedPreferences[existingIndex],
            ...requestBody,
            updatedAt: new Date().toISOString(),
          };
        } else {
          updatedPreferences.push({
            id: Date.now(), // Temporary ID
            userId: 104,
            ...requestBody,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        setPreferences(updatedPreferences);

        // Alert.alert("Success", "Preferences saved successfully!");
        console.log("Save result:", result);
      } else {
        throw new Error(result.message || "Failed to save preferences");
      }
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      // Alert.alert("Error", error.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const updateCurrentTabState = (updates: Partial<TabState>) => {
    setTabStates((prev) => ({
      ...prev,
      [activeTopTab]: {
        ...prev[activeTopTab],
        ...updates,
      },
    }));
  };

  const handleShowHistoryToggle = () => {
    const newShowHistory = !currentState.showHistory;
    updateCurrentTabState({
      showHistory: newShowHistory,
      // If enabling show history, disable pause history
      pauseHistory: newShowHistory ? false : currentState.pauseHistory,
    });

    // Auto-save when toggling
    setTimeout(savePreferences, 300);
  };

  const handlePauseHistoryToggle = () => {
    const newPauseHistory = !currentState.pauseHistory;
    updateCurrentTabState({
      pauseHistory: newPauseHistory,
      // If enabling pause history, disable show history
      showHistory: newPauseHistory ? false : currentState.showHistory,
    });

    // Auto-save when toggling
    setTimeout(savePreferences, 300);
  };

  const handleDontAutoDeleteToggle = () => {
    const newDontAutoDelete = !currentState.dontAutoDelete;
    updateCurrentTabState({
      dontAutoDelete: newDontAutoDelete,
      autoDelete: !newDontAutoDelete,
    });

    // Auto-save when toggling
    setTimeout(savePreferences, 300);
  };

  const handleAutoDeleteDurationChange = (duration: string) => {
    updateCurrentTabState({
      autoDeleteDuration: duration,
      // When selecting a duration, ensure auto-delete is enabled
      dontAutoDelete: false,
      autoDelete: true,
    });
    setIsDropdownVisible(false);

    // Auto-save when changing duration
    setTimeout(savePreferences, 300);
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTopTab(tabKey);
    setIsDropdownVisible(false);
  };

  const getActiveCheckbox = () => {
    if (currentState.showHistory) return "show";
    if (currentState.pauseHistory) return "pause";
    return "none";
  };

  // Check if current tab has existing data
  const hasExistingData =
    currentTab &&
    preferences.some((pref) => pref.section === currentTab.apiSection);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp("4.5%")} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalization</Text>
        {(loading || saving) && <LoadingModal />}
      </View>

      {/* Buy/Sell Row */}
      <View style={styles.buySellRow}>
        <Text style={styles.buySellText}>
          Buy/Sell <Text style={{ color: "#6C63FF" }}> (3) </Text>
        </Text>
        <View style={styles.buySellActiveIndicator} />
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(4),
          paddingBottom: hp(10),
        }}
      >
        {/* Loading Overlay */}
        {loading && <LoadingModal />}

        {/* Data Status Indicator */}
        {!loading && hasExistingData && (
          <View style={styles.dataStatus}>
            <Ionicons name="checkmark-circle" size={hp(2)} color="#4CAF50" />
            <Text style={styles.dataStatusText}>Using saved preferences</Text>
          </View>
        )}

        {/* Top small tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: hp(2) }}
        >
          <View style={{ flexDirection: "row" }}>
            {topTabs.map((t) => {
              const active = activeTopTab === t.key;
              const hasData = preferences.some(
                (pref) => pref.section === t.apiSection,
              );

              return (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.smallTabBtn,
                    active && styles.smallTabBtnActive,
                  ]}
                  onPress={() => handleTabChange(t.key)}
                  disabled={loading || saving}
                >
                  <View style={styles.smallTabLeftIcon}>
                    {React.cloneElement(t.icon, {
                      color: active ? "#6C63FF" : "#00000099",
                    })}
                  </View>
                  <Text
                    style={[
                      styles.smallTabText,
                      active && styles.smallTabTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                  {hasData && <View style={styles.dataIndicator} />}
                  {(loading || saving) && active && <LoadingModal />}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* History Preferences */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>History preferences</Text>

          {/* Show history */}
          <TouchableOpacity
            style={styles.rowCheckbox}
            activeOpacity={0.8}
            onPress={handleShowHistoryToggle}
            disabled={loading || saving}
          >
            <View
              style={[
                styles.checkbox,
                currentState.showHistory && styles.checkboxActive,
              ]}
            >
              {currentState.showHistory && (
                <Ionicons name="checkmark" size={hp(2)} color="#fff" />
              )}
            </View>
            <Text style={styles.rowText}>
              {activeTopTab == "Chat"
                ? `Disappear after seen`
                : `Show ${activeTopTab.toLowerCase()} history`}
            </Text>
          </TouchableOpacity>

          {currentState.showHistory && (
            <View style={styles.infoBox}>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  🕒 Once deleted, {activeTopTab.toLowerCase()} history can't be
                  recovered.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  ⚠️ Good for privacy, reduces stored data will make users feel
                  it's a feature, not a limitation.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  💬 {activeTopTab === "Chat" ? "Comments" : "Items"} will
                  appear in your history for reference.
                </Text>
              </View>
            </View>
          )}

          {/* Pause history */}
          <TouchableOpacity
            style={styles.rowCheckbox}
            activeOpacity={0.8}
            onPress={handlePauseHistoryToggle}
            disabled={loading || saving}
          >
            <View
              style={[
                styles.checkbox,
                currentState.pauseHistory && styles.checkboxActive,
              ]}
            >
              {currentState.pauseHistory && (
                <Ionicons name="checkmark" size={hp(2)} color="#fff" />
              )}
            </View>
            <Text style={styles.rowText}>
              {activeTopTab == "Chat" ? "Show" : "Pause"}{" "}
              {activeTopTab.toLowerCase()} history
            </Text>
          </TouchableOpacity>
        </View>

        {/* Auto-delete Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>
            Auto-delete {activeTopTab.toLowerCase()} history
          </Text>

          {/* Dropdown Box */}
          <View style={styles.dropdownBox}>
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              activeOpacity={0.8}
              disabled={loading || saving || currentState.dontAutoDelete}
            >
              <Text
                style={[
                  styles.dropdownText,
                  (loading || saving || currentState.dontAutoDelete) &&
                    styles.disabledText,
                ]}
              >
                {currentState.autoDeleteDuration}
              </Text>
              <Ionicons
                name={isDropdownVisible ? "chevron-up" : "chevron-down"}
                size={hp(1.8)}
                color={
                  loading || saving || currentState.dontAutoDelete
                    ? "#ccc"
                    : "#6C63FF"
                }
              />
            </TouchableOpacity>

            {isDropdownVisible && (
              <View style={styles.dropdownInsideBox}>
                {(activeTopTab === "Chat"
                  ? ["1 Day", "1 Week", "2 Weeks", "1 Month"]
                  : ["1 Month", "2 Months", "3 Months", "4 Months"]
                ).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.dropdownItem,
                      currentState.autoDeleteDuration === opt &&
                        styles.dropdownItemActive,
                    ]}
                    onPress={() => handleAutoDeleteDurationChange(opt)}
                    disabled={loading || saving}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        currentState.autoDeleteDuration === opt &&
                          styles.dropdownItemTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Don't auto delete history */}
          <TouchableOpacity
            style={[styles.rowCheckbox, { marginTop: hp(1.5) }]}
            activeOpacity={0.8}
            onPress={handleDontAutoDeleteToggle}
            disabled={loading || saving}
          >
            <View
              style={[
                styles.checkbox,
                currentState.dontAutoDelete && styles.checkboxActive,
              ]}
            >
              {currentState.dontAutoDelete && (
                <Ionicons name="checkmark" size={hp(2)} color="#fff" />
              )}
            </View>
            <Text style={styles.rowText}>
              Don't auto delete {activeTopTab.toLowerCase()} history
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (loading || saving) && styles.saveButtonDisabled,
          ]}
          onPress={savePreferences}
          disabled={loading || saving}
        >
          {saving ? (
            <LoadingModal />
          ) : (
            <Text style={styles.saveButtonText}>
              {hasExistingData ? "Update" : "Save"} {activeTopTab} Preferences
            </Text>
          )}
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchAllPreferences}
          disabled={loading}
        >
          <Ionicons name="refresh" size={hp(2)} color="#6C63FF" />
          <Text style={styles.refreshButtonText}>Refresh Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PersonalizationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(Platform.OS === "ios" ? 6 : 5),
    paddingHorizontal: wp(5),
  },
  headerTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#000",
    marginLeft: wp(2),
    flex: 1,
  },
  savingIndicator: {
    marginLeft: wp(2),
  },
  buySellRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    position: "relative",
    marginTop: hp(1.5),
  },
  buySellText: { fontSize: wp(3.8), color: "#000" },
  buySellActiveIndicator: {
    position: "absolute",
    bottom: 0,
    left: wp(5),
    width: wp(19),
    height: 3,
    backgroundColor: "#6A5AE0",
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },
  smallTabBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: wp(2),
    marginRight: wp(2),
    backgroundColor: "#fff",
    marginTop: hp(2),
    minWidth: wp(25),
    position: "relative",
  },
  smallTabBtnActive: {
    borderColor: "#6A5AE0",
    elevation: 2,
    backgroundColor: "#f8f7ff",
  },
  smallTabLeftIcon: { marginRight: wp(2) },
  smallTabText: { fontSize: hp(1.6), color: "#666" },
  smallTabTextActive: { color: "#6C63FF", fontWeight: "600" },
  tabLoader: {
    marginLeft: wp(1),
  },
  dataIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: "#4CAF50",
  },
  sectionBlock: {
    marginBottom: hp(2),
    paddingHorizontal: wp(1),
    opacity: 1,
  },
  sectionHeading: {
    fontSize: wp(3.6),
    fontWeight: "600",
    color: "#000",
    marginBottom: hp(1),
  },
  rowCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(0.8),
    paddingVertical: hp(0.5),
  },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
    backgroundColor: "#fff",
  },
  checkboxActive: {
    backgroundColor: "#6C63FF",
    borderColor: "#6C63FF",
  },
  rowText: {
    fontSize: wp(3.4),
    color: "#000",
    flex: 1,
  },
  infoBox: {
    marginTop: hp(1),
    padding: hp(1.5),
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: wp(2),
    backgroundColor: "#FBFBFB",
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(0.5),
  },
  bulletDot: {
    fontSize: wp(4),
    marginRight: wp(2),
    color: "#000",
  },
  bulletText: {
    fontSize: wp(2.8),
    color: "#6E533F",
    flexShrink: 1,
    flex: 1,
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: wp(2),
    overflow: "hidden",
    marginTop: hp(1),
    backgroundColor: "#fff",
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
  },
  dropdownText: {
    fontSize: wp(3.4),
    color: "#000",
  },
  disabledText: {
    color: "#ccc",
  },
  dropdownInsideBox: {
    borderTopWidth: 1,
    borderColor: "#E6E6E6",
  },
  dropdownItem: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
  },
  dropdownItemActive: {
    backgroundColor: "#f8f7ff",
  },
  dropdownItemText: {
    fontSize: wp(3.4),
    color: "#000",
  },
  dropdownItemTextActive: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    borderRadius: wp(4),
    height: hp(5.5),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
    elevation: 3,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#C8B5FF",
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: hp(1.8),
    color: "#fff",
    fontWeight: "600",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
    marginTop: hp(1),
  },
  refreshButtonText: {
    fontSize: hp(1.6),
    color: "#6C63FF",
    marginLeft: wp(2),
    fontWeight: "500",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: hp(1),
    fontSize: wp(3.2),
    color: "#666",
  },
  dataStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f0",
    padding: hp(1),
    borderRadius: wp(2),
    marginBottom: hp(1),
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  dataStatusText: {
    fontSize: wp(3),
    color: "#2E7D32",
    marginLeft: wp(2),
    fontWeight: "500",
  },
});
