import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import Restaurants from '../screens/restaurants/Restaurants';
import AddRestuarants from '../screens/restaurants/AddRestuarants';
import Restaurant from '../screens/restaurants/Restaurant';
import AddReviewRestaurants from '../screens/restaurants/AddReviewRestaurants';

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

            <Stack.Screen 
                name="restaurant"
                component={Restaurant}
            />

            <Stack.Screen 
                name="add-review-restaurants"
                component={AddReviewRestaurants}
                options={{ title: "Nuevo comentario" }}
            />          
        </Stack.Navigator>
        
    )
}