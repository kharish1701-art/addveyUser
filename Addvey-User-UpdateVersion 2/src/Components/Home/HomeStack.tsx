import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainHomeScreen from '../../Screens/MainHomeScreen';
import FavouriteScreen from '../../Screens/FavouriteScreen';
import MapscategoriesScreen from '../../Screens/MapCategory/MapsCategoriesScreen';
import ListViewScreen from '../../Screens/ListViewScreen';
import CategoryDetailScreen from '../Category/CategoryDetailScreen';

export type HomeStackParamList = {
    MainHomeScreen: undefined;
    Favourite: undefined;
    MapsCategories: undefined;
    ListView: undefined;
    CategoryDetail: undefined
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainHomeScreen" component={MainHomeScreen} />
            <Stack.Screen name='Favourite' component={FavouriteScreen} />
            <Stack.Screen name='MapsCategories' component={MapscategoriesScreen} />
            <Stack.Screen name='ListView' component={ListViewScreen} />
            <Stack.Screen name='CategoryDetail' component={CategoryDetailScreen} />
        </Stack.Navigator>
    );
};

export default HomeStack;
