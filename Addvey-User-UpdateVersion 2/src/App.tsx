import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import WelcomeScreen from "./Screens/WelcomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import OTPScreen from "./Screens/OTPScreen";
import LanguageScreen from "./Screens/LanguageScreen";
import EnableLocationScreen from "./Screens/EnableLocationScreen";
import LocationManualyScreen from "./Screens/LocationManuallyScreen";
import HomeScreen from "./Screens/HomeScreen";
import BuyandSell from "./Screens/BuyAndSell";
import CategoriesScreen from "./Screens/CatgoeiresScreen";
import CategoryDetailsScreen from "./Screens/CategoryDetailsScreen";
import MainCategoryDetailScreen from "./Screens/MainCategoryDetailScreen";
import AddDetailFirstScreen from "./Screens/AddDetailFirstScreen";
import AddDetailSecondScreen from "./Screens/AddDetailSecondScreen";
import AddDetailThirdScreen from "./Screens/AddDetailThirdScreen";
import AddLinkScreen from "./Screens/AddLinkScreen";
import AddReviewScreen from "./Screens/AddPreviewScreen";
import ProductListtingScreen from "./Screens/ProductListingScreen";
import BottomTabs from "./Screens/BottomtabsScreen";
import NotificationScreen from "./Screens/NotificationScreen";
import NotificationSettingScreen from "./Screens/NotificationSettingsScreen";
import FilterScreen from "./Screens/FilterScreen";
import MainProfileScreen from "./Screens/MainProfileScreen";
import VerificationScreen from "./Screens/VerificationScreen";
import GovernmentIDScreen from "./Screens/GovernmentIDScreen";
import SelfiPhoto from "./Screens/SelfiPhotoScreen";
import VerificationDone from "./Screens/VerificationDone";
import AddwayWalletScreen from "./Screens/AddveyWalletScreen";
import TransactionScreen from "./Screens/TransactionScreen";
import TransactionFilter from "./Screens/TransactionFilter";
import VerifyEmailProfileScreen from "./Screens/VerifyEmailProfileScreen";
import PANCardUploadScreen from "./Screens/PANCardUploadScreen";
import HowToUseAddveyPatnerScreen from "./Screens/HowToUseAddveyPatnerScreen";
import AddveySettingsScreen from "./Screens/AddveySettingsScreen";
import LinkedDeviseScreen from "./Screens/LinkedDeviesScreen";
import BuySellProfileScreen from "./Screens/BuySellProfile";
import QRCodeScreen from "./Screens/QRCodeScreen";
import BuySellProfileSetingsScreen from "./Screens/BuySellProfileSettingsScreen";
import AddFilterScreen from "./Screens/AddFilterScreen";
import BuySellContactUsScreen from "./Screens/BuySellContactUsScreen";
import BuySellContactUsDetailScreen from "./Screens/BuySellContactUsDetailScreen";
import BuySellContactConfirmDetailScreen from "./Screens/BuySellContactUsConfirmDetailScreen";
import ChatMainScreen from "./Screens/Chat/ChatMainScreen";
import ChatFilterScreen from "./Screens/ChatFilter";
import ChatMessagingScreen from "./Screens/Chat/ChatMessagingScreen";
import AddInsightMainScreen from "./Screens/AddInsightsMainScreen";
import AdPerformanceDetailsScreen from "./Screens/AdPerformanceDetailsScreen";
import AnalyticsScreen from "./Screens/AnalyticsScreen";
import ReportDetailsScreen from "./Screens/ReportDetailScreen";
import GrowMainScreen from "./Screens/GrowMainScreen";
import ProductListingPlansScreen from "./Screens/ProductListingPlansScreen";
import PaymentMethodScreen from "./Screens/PaymentMethodScreen";
import FollowingScreen from "./Screens/FollowingScreen";
import ProfileUpdateScreen from "./Screens/ProfileUpdateScreen";
import ShareSuggestScreen from "./Screens/ShareSuggestScreen";
import SocialLinkScreen from "./Screens/SocialLinksScreen";
import TieUpsScreen from "./Screens/TieUpsScreen";
import PolicyScreen from "./Screens/PolicyScreen";
import AboutAddveyScreen from "./Screens/AboutAddveyScreen";
import VersionScreen from "./Screens/VersionScreen";
import TermAndConditionScreen from "./Screens/TermAndConditionScreen";
import TermsOfUseScreen from "./Screens/TermOfUseScreen";
import AddveyPrivacyPolicyScreen from "./Screens/AddveyPrivacyPolicy";
import AboutAppScreen from "./Screens/AboutAppscreen";
import PersonalizationScreen from "./Screens/Personalization";
import OtherIssuesScreen from "./Screens/OtherIssuesScreen";
import ConfirmDetailScreen from "./Screens/ConfirmDetailScreen";
import ReportedPostQueryScreen from "./Screens/ReportedPostQueryScreen";
import ByAndSellStartupScreen from "./Screens/ByAndSellStartupScreen";
import HomeTypeScreen from "./Screens/HomeTypes";
import BuySellSearchScreen from "./Screens/BuySellSearchScreen";
import { LogBox } from "react-native";
import MapscategoriesScreen from "./Screens/MapCategory/MapsCategoriesScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import ListViewScreen from "./Screens/ListViewScreen";
import FavouriteScreen from "./Screens/FavouriteScreen";
import LocationDropdown from "./Screens/Locationlist";
import QRCodeScanner from "./Screens/QRScannerScreen";
import OlaStyleMap from "./Screens/OlaStyleMap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { toastConfig } from "./Components/Toast/Toast";
import { ChatProvider } from "../chatContext";
import LoadingModal from "./Components/Loader";
import MainMapListingScreen from "./Screens/MainMapListingScreen";
import ProfileScreenMainYou from "./Screens/ProfileScreenMainYou";

import EditLocationScreen from "./Screens/EditLocation";
import SocialLinkListScreen from "./Screens/AllSocialLink";
import NearByMapScreen from "./Screens/NearByMapScreen";
import BuySellContactUsSelectScreen from "./Screens/BuySellContactUsSelectScreen";
import SearchResultScreen from "./Screens/SearchMainScreen";
import { CategoryProvider } from "./context/CategoryContext";
import { LocationProvider } from "./context/LocationContext";
import { TabBarScrollProvider } from "./context/TabBarScrollContext";
import SimilarProductsScreen from "./Screens/SimilarProductsSCreen";
import LocationAutoComplete from "./Screens/LocationAutoComplete";
import { HomeFilterProvider } from "./context/HomeFilterContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { navigationRef } from "./NavigationService";
LogBox.ignoreAllLogs();

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  OTP: undefined;
  Language: undefined;
  EnableLocation: undefined;
  LocationManually: undefined;
  Home: undefined;
  BuySell: undefined;
  Categories: undefined;
  categoryDetail: undefined;
  MainCategoryDetail: undefined;
  AddDetailFirst: undefined;
  AddDetailSecond: undefined;
  AddDetailThird: undefined;
  AddLink: undefined;
  AddPreview: undefined;
  ProductListing: undefined;
  Botomtabs: undefined;
  Notification: undefined;
  NotificationSetting: undefined;
  Filter: undefined;
  MainProfile: undefined;
  Verification: undefined;
  GovernmentID: undefined;
  SelfiPhoto: undefined;
  VerificationDone: undefined;
  AddveyWallet: undefined;
  Transaction: undefined;
  TransctionFilter: undefined;
  VerifyEmailProfile: undefined;
  PANCardUplaod: undefined;
  HowTouse: undefined;
  AddveySettings: undefined;
  LinkedDevice: undefined;
  BuySellProfile: undefined;
  QRCode: undefined;
  BuySellSetingsProfile: undefined;
  AddFilterScreen: undefined;
  BuySellContactUs: undefined;
  BuySellContactUsDetail: undefined;
  BuySellContactDetailConfirm: undefined;
  ChatMain: undefined;
  ChatFilter: undefined;
  ChatMessaging: undefined;
  AddInsightMain: undefined;
  AddPerformanceDetail: undefined;
  Analytics: undefined;
  ReportDetail: undefined;
  ProductListingPage: undefined;
  PaymentMethod: undefined;
  Following: undefined;
  ProfileUpdate: undefined;
  ShareSuggestion: undefined;
  SocialLinks: undefined;
  TieUps: undefined;
  Policy: undefined;
  AboutAddvey: undefined;
  Verion: undefined;
  TermAndCondition: undefined;
  TermsOfUse: undefined;
  AddveyPrivacyPolicy: undefined;
  AboutApp: undefined;
  Personalization: undefined;
  OtherIssue: undefined;
  ConfirmDetail: undefined;
  ReportedPostQuery: undefined;
  BuyAndSellStartup: undefined;
  HomeType: undefined;
  BuySellSearch: undefined;
  ProfileScreenMainYou: undefined;
  QRCodeScanner: undefined;
  EditLocationScreen: undefined;
  MainMap: undefined;
  MainMapListing: undefined;
  SocialLinkListScreen: undefined;
  BuySellContactUsSelectScreen: undefined
  ListView: undefined;
  Mapscategories: undefined;
  Favourite: undefined;
  LocationDropdown: undefined;
  SimilarProducts: undefined;
  LocationAutoComplete: undefined;
  NearByMap: { places: any[]; initialLat: number; initialLng: number };
};

export type RootStackNavProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Sen-Medium": require("../assets/fonts/Sen-Medium.ttf"),
    "Sen-Regular": require("../assets/fonts/Sen-Regular.ttf"),
    "Boogaloo-Regular": require("../assets/fonts/Boogaloo-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <LoadingModal />
    );
  }
  // const [userId, setUserId] = useState(null);
  // const [loadingUser, setLoadingUser] = useState(true);
  const SERVER_URL = "https://api.addvey.com/addvey";

  // Load user data on app start and when storage changes


  // if (!fontsLoaded || loadingUser) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#1877F2" />
  //     </View>
  //   );
  // }


  // @ts-ignore
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <Toast config={toastConfig} />
        {/* <Toast config={toastConfig} /> */}
        <ChatProvider serverUrl={SERVER_URL}>
          <NavigationContainer ref={navigationRef}>
            <LocationProvider>
              <CategoryProvider>
                <FavoritesProvider>
                  <HomeFilterProvider>
                    <TabBarScrollProvider>
                      <Stack.Navigator
                        initialRouteName="Welcome"
                        screenOptions={{ headerShown: false }}
                      >
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="OTP" component={OTPScreen} />
                        <Stack.Screen name="Language" component={LanguageScreen} />
                        <Stack.Screen
                          name="EnableLocation"
                          component={EnableLocationScreen}
                        />
                        <Stack.Screen
                          name="SearchResultScreen"
                          component={SearchResultScreen}
                        />
                        <Stack.Screen
                          name="LocationManually"
                          component={LocationManualyScreen}
                        />
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="BuySell" component={BuyandSell} />
                        <Stack.Screen name="Categories" component={CategoriesScreen} />
                        <Stack.Screen
                          name="categoryDetail"
                          component={CategoryDetailsScreen}
                        />
                        <Stack.Screen
                          name="MainCategoryDetail"
                          component={MainCategoryDetailScreen}
                        />
                        <Stack.Screen
                          name="AddDetailFirst"
                          component={AddDetailFirstScreen}
                        />
                        <Stack.Screen
                          name="AddDetailSecond"
                          component={AddDetailSecondScreen}
                        />
                        <Stack.Screen
                          name="AddDetailThird"
                          component={AddDetailThirdScreen}
                        />
                        <Stack.Screen name="AddLink" component={AddLinkScreen} />
                        <Stack.Screen name="EditLocationScreen" component={EditLocationScreen} />
                        <Stack.Screen name="AddPreview" component={AddReviewScreen} />
                        <Stack.Screen
                          name="ProductListing"
                          component={ProductListtingScreen}
                        />
                        <Stack.Screen name="Botomtabs" component={BottomTabs} />
                        <Stack.Screen
                          name="Notification"
                          component={NotificationScreen}
                        />
                        <Stack.Screen
                          name="NotificationSetting"
                          component={NotificationSettingScreen}
                        />
                        <Stack.Screen name="Filter" component={FilterScreen} />
                        <Stack.Screen name="MainProfile" component={MainProfileScreen} />
                        <Stack.Screen
                          name="Verification"
                          component={VerificationScreen}
                        />
                        <Stack.Screen
                          name="GovernmentID"
                          component={GovernmentIDScreen}
                        />
                        <Stack.Screen name="SelfiPhoto" component={SelfiPhoto} />
                        <Stack.Screen
                          name="VerificationDone"
                          component={VerificationDone}
                        />
                        <Stack.Screen
                          name="AddveyWallet"
                          component={AddwayWalletScreen}
                        />
                        <Stack.Screen name="Transaction" component={TransactionScreen} />
                        <Stack.Screen
                          name="TransctionFilter"
                          component={TransactionFilter}
                        />
                        <Stack.Screen
                          name="VerifyEmailProfile"
                          component={VerifyEmailProfileScreen}
                        />
                        <Stack.Screen
                          name="PANCardUplaod"
                          component={PANCardUploadScreen}
                        />
                        <Stack.Screen
                          name="HowTouse"
                          component={HowToUseAddveyPatnerScreen}
                        />
                        <Stack.Screen
                          name="AddveySettings"
                          component={AddveySettingsScreen}
                        />
                        <Stack.Screen
                          name="LinkedDevice"
                          component={LinkedDeviseScreen}
                        />
                        <Stack.Screen
                          name="BuySellProfile"
                          component={BuySellProfileScreen}
                        />
                        <Stack.Screen
                          name="ProfileScreenMainYou"
                          component={ProfileScreenMainYou}
                        />
                        <Stack.Screen name="QRCode" component={QRCodeScreen} />
                        <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
                        <Stack.Screen name="MainMap" component={OlaStyleMap} />
                        <Stack.Screen name="MainMapListing" component={MainMapListingScreen} />
                        <Stack.Screen
                          name="BuySellSetingsProfile"
                          component={BuySellProfileSetingsScreen}
                        />
                        <Stack.Screen
                          name="AddFilterScreen"
                          component={AddFilterScreen}
                        />
                        <Stack.Screen
                          name="BuySellContactUs"
                          component={BuySellContactUsScreen}
                        />
                        <Stack.Screen
                          name="BuySellContactUsDetail"
                          component={BuySellContactUsDetailScreen}
                        />
                        <Stack.Screen
                          name="BuySellContactDetailConfirm"
                          component={BuySellContactConfirmDetailScreen}
                        />
                        <Stack.Screen name="ChatMain" component={ChatMainScreen} />
                        <Stack.Screen name="ChatFilter" component={ChatFilterScreen} />
                        <Stack.Screen
                          name="ChatMessaging"
                          component={ChatMessagingScreen}
                        />
                        <Stack.Screen
                          name="AddInsightMain"
                          component={AddInsightMainScreen}
                        />
                        <Stack.Screen
                          name="AddPerformanceDetail"
                          component={AdPerformanceDetailsScreen}
                        />
                        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
                        <Stack.Screen
                          name="ReportDetail"
                          component={ReportDetailsScreen}
                        />
                        <Stack.Screen
                          name="ProductListingPage"
                          component={ProductListingPlansScreen}
                        />
                        <Stack.Screen
                          name="PaymentMethod"
                          component={PaymentMethodScreen}
                        />
                        <Stack.Screen name="Following" component={FollowingScreen} />
                        <Stack.Screen
                          name="ProfileUpdate"
                          component={ProfileUpdateScreen}
                        />
                        <Stack.Screen
                          name="ShareSuggestion"
                          component={ShareSuggestScreen}
                        />
                        <Stack.Screen name="SocialLinks" component={SocialLinkScreen} />
                        <Stack.Screen name="TieUps" component={TieUpsScreen} />
                        <Stack.Screen name="Policy" component={PolicyScreen} />
                        <Stack.Screen name="AboutAddvey" component={AboutAddveyScreen} />
                        <Stack.Screen name="Verion" component={VersionScreen} />
                        <Stack.Screen
                          name="TermAndCondition"
                          component={TermAndConditionScreen}
                        />
                        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
                        <Stack.Screen
                          name="AddveyPrivacyPolicy"
                          component={AddveyPrivacyPolicyScreen}
                        />
                        <Stack.Screen name="AboutApp" component={AboutAppScreen} />
                        <Stack.Screen
                          name="Personalization"
                          component={PersonalizationScreen}
                        />
                        <Stack.Screen name="OtherIssue" component={OtherIssuesScreen} />
                        <Stack.Screen
                          name="ConfirmDetail"
                          component={ConfirmDetailScreen}
                        />
                        <Stack.Screen
                          name="ReportedPostQuery"
                          component={ReportedPostQueryScreen}
                        />
                        <Stack.Screen
                          name="SocialLinkListScreen"
                          component={SocialLinkListScreen}
                        />
                        <Stack.Screen
                          name="BuySellContactUsSelectScreen"
                          component={BuySellContactUsSelectScreen}
                        />

                        <Stack.Screen
                          name="BuyAndSellStartup"
                          component={ByAndSellStartupScreen}
                        />
                        <Stack.Screen name="HomeType" component={HomeTypeScreen} />
                        <Stack.Screen name="ListView" component={ListViewScreen} />
                        <Stack.Screen
                          name="BuySellSearch"
                          component={BuySellSearchScreen}
                        />
                        <Stack.Screen
                          name="Mapscategories"
                          component={MapscategoriesScreen}
                        />
                        <Stack.Screen name="Favourite" component={FavouriteScreen} />
                        <Stack.Screen
                          name="LocationDropdown"
                          component={LocationDropdown}
                        />
                        <Stack.Screen name="SimilarProducts" component={SimilarProductsScreen} />
                        <Stack.Screen name="LocationAutoComplete" component={LocationAutoComplete} />
                        <Stack.Screen name="NearByMap" component={NearByMapScreen} />
                      </Stack.Navigator>
                    </TabBarScrollProvider>
                  </HomeFilterProvider>
                </FavoritesProvider>
              </CategoryProvider>
            </LocationProvider>
          </NavigationContainer>
        </ChatProvider>

      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
