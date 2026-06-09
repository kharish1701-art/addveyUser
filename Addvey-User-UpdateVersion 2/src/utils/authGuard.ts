import { Alert } from "react-native";
import { navigate } from "../NavigationService";

export const showLoginAlert = () => {
  Alert.alert(
    "Login Required",
    "You are not logged in. Please login first.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Login",
        onPress: () => navigate("Login"),
      },
    ],
    { cancelable: true }
  );
};
