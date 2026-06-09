import React, { createContext, useContext, useRef, ReactNode } from "react";
import { Animated } from "react-native";

interface TabBarScrollContextType {
    tabBarTranslateY: Animated.Value;
    showTabBar: () => void;
    hideTabBar: () => void;
}

const TabBarScrollContext = createContext<TabBarScrollContextType | undefined>(undefined);

export const TabBarScrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const tabBarTranslateY = useRef(new Animated.Value(0)).current;

    const showTabBar = () => {
        Animated.timing(tabBarTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideTabBar = () => {
        Animated.timing(tabBarTranslateY, {
            toValue: 100, // Adjust based on tab bar height
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TabBarScrollContext.Provider value={{ tabBarTranslateY, showTabBar, hideTabBar }}>
            {children}
        </TabBarScrollContext.Provider>
    );
};

export const useTabBarScroll = () => {
    const context = useContext(TabBarScrollContext);
    if (!context) {
        throw new Error("useTabBarScroll must be used within a TabBarScrollProvider");
    }
    return context;
};
