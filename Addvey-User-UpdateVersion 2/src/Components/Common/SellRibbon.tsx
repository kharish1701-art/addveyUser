import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Image,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const RIBBON_WIDTH = 75;
export const RIBBON_HEIGHT = 30;

export type SellRibbonProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const SellRibbonComponent = ({
  label = "SELL",
  style,
  onPress,
}: SellRibbonProps) => {
  const content = (
    <>
      <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
    <View style={{width: 35, height: 46, backgroundColor: "white",
       position: "absolute", left: 50, bottom: -20,borderTopRightRadius: 40,
       overflow: "hidden",
       }}/>
    </>
      
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }

  return content;
};

export const SellRibbon = memo(SellRibbonComponent);
export default SellRibbon;

const styles = StyleSheet.create({
  pressable: {
    alignSelf: "flex-start",
    backgroundColor:"red"
  },
  wrapper: {
    position: "absolute",
    // top: 0,
    left: 0,
    bottom:0,
    zIndex: 10,
    width: RIBBON_WIDTH,
    height: RIBBON_HEIGHT,
    backgroundColor: "#FFFFFF",
    paddingVertical: wp(2),
    borderTopRightRadius: wp(6),
    // borderTopLeftRadius: 0,
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
    overflow: "hidden",
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: wp(4),
  },
  label: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    fontFamily: "Poppins-Bold",
  },
  bottomView:{
    position: "absolute",
    // top: 0,
    left: 0,
    bottom:0,
    zIndex: 10,
    width: RIBBON_WIDTH,
    height: RIBBON_HEIGHT,
    backgroundColor: "#ffffff",
    borderTopRightRadius: wp(16),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
   

  }
  ,tail: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 30,
    height: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
  },
});
