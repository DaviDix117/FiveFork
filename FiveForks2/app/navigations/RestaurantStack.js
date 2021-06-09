import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import Restaurants from '../screens/restaurants/Restaurants';
import AddRestuarants from '../screens/restaurants/AddRestuarants';

const Stack = createStackNavigator();

export default function RestaurantStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurantes" }}
            />

            <Stack.Screen 
                name="add-restaurants"
                component={AddRestuarants}
                options={{ title: "Añadir resturante" }}
            />
        </Stack.Navigator>
        
    )
}