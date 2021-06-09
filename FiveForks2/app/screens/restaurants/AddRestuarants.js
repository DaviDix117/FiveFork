import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/restaurants/AddRestaurantForm'

export default function AddRestuarants(props) {
    const { navigation } = props;
    
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View>
            <Loading isVisible={isLoading} text="creando resturante" />

            <AddRestaurantForm 
                setIsLoading={setIsLoading}  
                navigation={navigation}
            />
        </View>
    )
}
