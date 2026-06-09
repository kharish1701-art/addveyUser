import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GrowMainScreen from "./GrowMainScreen";
import Advertisements from "./Advertisements";

export type GrowStackParamList = {
    GrowMain: undefined;
    GrowDetail: undefined;
    GrowProfile: undefined;
    AdvertiesmentMain: undefined;
};

const Stack = createNativeStackNavigator<GrowStackParamList>();

const GrowNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="GrowMain" component={GrowMainScreen} />
            <Stack.Screen name="AdvertiesmentMain" component={Advertisements} />
        </Stack.Navigator>
    );
};

export default GrowNavigator;
