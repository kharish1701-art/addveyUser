import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type CloseButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "plain";
  color?: string;
  size?: number;
};

const CloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  style,
  variant = "default",
  color = "#000",
  size,
}) => {
  const iconSize = size ?? wp(6);

  if (variant === "plain") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={style}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="close" size={iconSize} color={color} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Ionicons name="close" size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: wp(8),
    height: wp(8),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: wp(6),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default CloseButton;
