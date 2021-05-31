import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import RestaurantStack from '../navigations/RestaurantStack'
import FavoritesStack from '../navigations/FavoritesStack'
import AccountStack from '../navigations/AccountStack'
import SearchStack from '../navigations/SearchStack'
import TopRestaurantsStack from '../navigations/TopRestaurantsStack'

const Tab = createBottomTabNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                tabBarOptions={{
                    inactiveTintColor: "#646464",
                    activeTintColor: "#00a680"
                }}
                screenOptions={({ route }) =>({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                })}
            >
                <Tab.Screen 
                    name='restaurants' 
                    component={RestaurantStack}  
                    options={{ title: "Restaurantes" }}
                />
                <Tab.Screen 
                    name='favorites' 
                    component={FavoritesStack}  
                    options={{ title: "Favoritos" }}
                />
                <Tab.Screen 
                    name='account' 
                    component={AccountStack}  
                    options={{ title: "Cuenta" }}
                />
                <Tab.Screen 
                    name='search' 
                    component={SearchStack}  
                    options={{ title: "Buscar" }}
                />
                <Tab.Screen 
                    name='top-restaurants' 
                    component={TopRestaurantsStack}  
                    options={{ title: "Top 5" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color) {
    let iconName;
    switch (route.name) {
        case 'restaurants':
            iconName= "compass-outline"
            break;
        case 'favorites':
            iconName= "heart-outline"
            break;
        case 'account':
            iconName= "account-circle-outline"
            break;
        case 'search':
            iconName= "magnify"
            break;
        case 'top-restaurants':
            iconName= "star-outline"
            break;
    
        default:
            break;
    }

    return(
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}
