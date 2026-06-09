import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type Placement = "top-left" | "bottom-left";
export type SellBadgePart = "full" | "icon" | "label";

export type SellBadgeProps = {
  label?: string;
  iconSource?: ImageSourcePropType;
  backgroundColor?: string;
  onPress?: () => void;
  placement?: Placement;
  inline?: boolean;
  part?: SellBadgePart;
  style?: StyleProp<ViewStyle>;
};

const ICON_BOX = wp(10);
const LOGO_SIZE = wp(6);
const ADDVEY_LOGO = require("../../../assets/images/advey.png");

type BadgeBodyProps = Pick<
  SellBadgeProps,
  "label" | "iconSource" | "backgroundColor" | "part"
>;

const SellBadgeBody = ({
  label = "SELL",
  iconSource,
  backgroundColor = "rgba(72, 72, 72, 0.9)",
  part = "full",
}: BadgeBodyProps) => {
  const showIcon = part === "full" || part === "icon";
  const showLabel = part === "full" || part === "label";

  return (
    <View style={part === "full" ? styles.badgeColumn : undefined}>
      {showIcon && (
        <View style={[styles.iconBox, { backgroundColor }]}>
          <Image
            source={iconSource ?? ADDVEY_LOGO}
            style={styles.logoIcon}
          />
        </View>
      )}
      {showLabel && (
        <View
          style={[
            styles.labelTab,
            part === "label" && styles.labelTabInline,
            part === "full" && styles.labelTabStacked,
          ]}
        >
          <Text style={styles.labelText}>{label.toUpperCase()}</Text>
        </View>
      )}
    </View>
  );
};

const SellBadgeStatic = memo(
  ({
    label,
    iconSource,
    backgroundColor,
    placement = "bottom-left",
    inline = false,
    part = "full",
    style,
  }: SellBadgeProps) => (
    <View
      style={[
        part === "icon" || part === "full"
          ? inline
            ? styles.inlineContainer
            : styles.container
          : styles.labelContainer,
        !inline &&
          part !== "label" &&
          (placement === "top-left" ? styles.topLeft : styles.bottomLeft),
        style,
      ]}
    >
      <SellBadgeBody
        label={label}
        iconSource={iconSource}
        backgroundColor={backgroundColor}
        part={part}
      />
    </View>
  )
);

const SellBadgePressable = memo(
  ({
    label,
    iconSource,
    backgroundColor,
    onPress,
    placement = "bottom-left",
    inline = false,
    part = "full",
    style,
  }: Required<Pick<SellBadgeProps, "onPress">> & SellBadgeProps) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.94, { damping: 16, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 280 });
        }}
        style={[
          part === "icon" || part === "full"
            ? inline
              ? styles.inlineContainer
              : styles.container
            : styles.labelContainer,
          !inline &&
            part !== "label" &&
            (placement === "top-left" ? styles.topLeft : styles.bottomLeft),
          style,
        ]}
      >
        <Animated.View style={animatedStyle}>
          <SellBadgeBody
            label={label}
            iconSource={iconSource}
            backgroundColor={backgroundColor}
            part={part}
          />
        </Animated.View>
      </Pressable>
    );
  }
);

const SellBadge = (props: SellBadgeProps) =>
  props.onPress ? (
    <SellBadgePressable {...props} onPress={props.onPress} />
  ) : (
    <SellBadgeStatic {...props} />
  );

export default memo(SellBadge);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
  },
  inlineContainer: {
    zIndex: 1,
  },
  labelContainer: {},
  topLeft: {
    top: 0,
    left: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  badgeColumn: {
    alignItems: "flex-start",
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderTopLeftRadius: 0,
    borderTopRightRadius: wp(3),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: "contain",
  },
  labelTab: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(5.5),
    paddingVertical: hp(0.55),
    borderTopRightRadius: wp(18),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    minWidth: wp(17),
    alignSelf: "flex-start",
  },
  labelTabStacked: {
    marginTop: 0,
  },
  labelTabInline: {},
  labelText: {
    color: "#2A2A2A",
    fontSize: wp(3.05),
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
