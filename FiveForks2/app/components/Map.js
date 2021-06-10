import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';
import * as Location from 'expo-location';
import { showMessage } from 'react-native-flash-message';

export default function Map(props) {
    const { location, name, height } = props;

    const [actualLocation, setActualLocation] = useState(null);//Guarda posicion actual

    //Obtener posicion actual
    useEffect(() => {
        (async () => {
            const resultPermissions = await Location.requestForegroundPermissionsAsync();
            if(resultPermissions.status === 'denied') {
                showMessage({
                    message: "Error",
                    description: "Es necesario aceptar los permisos de la galeria",
                    type: "danger",
                    icon: "auto",
                });
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setActualLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const openAppMap = () =>{
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
            query: name,
            start: `${actualLocation.latitude} ${actualLocation.longitude}`,
            end: `${location.latitude} ${location.longitude}`,
            travelType: "drive"
        })
    }

    return (
        <MapView 
            style={{ height: height, width: "100%" }}
            initialRegion={location}
            onPress={openAppMap}
        >
            <MapView.Marker 
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}
