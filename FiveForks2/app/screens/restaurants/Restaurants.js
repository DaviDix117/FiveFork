import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import 'firebase/firestore';

import ListRestaurants from '../../components/restaurants/ListRestaurants'

const db = firebase.firestore(firebaseApp);// Para el firestore

export default function Restaurants(props) {
    const { navigation } = props;
    
    const [user, setUser] = useState(null); //Guarda la info del usuario
    const [restaurants, setRestaurants] = useState([]);// Guarda los resturantes
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurant, setStartRestaurant] = useState(null)/*Guarda el ultimo restaurante pintado en pantalla,
    para saber por cual restaurante empezar a pintar en pantalla cuando el usuario quiera cargar mas */
    const [isLoading, setIsLoading] = useState(false);//Verifica si tiene que cargar mas resturantes
    
    const limitRestaurant = 2;

    //Comprobar login
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) =>{
            setUser(userInfo)
        })
    }, [])

    // Peticion para obtener los restaurantes, y se recarga automaticamente
    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants").get().then((snap)=>{
                setTotalRestaurants(snap.size)
            });
    
            const resultRestaurant = [];
    
            db.collection("restaurants")
                .orderBy("createAt", "desc")
                .limit(limitRestaurant)
                .get()
                .then((response)=>{
                    setStartRestaurant(response.docs[response.docs.length - 1]);
    
                    response.forEach((doc)=> {
                        const restaurant = doc.data();
                        restaurant.id = doc.id;
                        resultRestaurant.push(restaurant);
                    });
    
                    setRestaurants(resultRestaurant);
                });
        }, [])
    )

    const handleLoadMore = () =>{
        const resultRestaurants = [];
        restaurants.length < totalRestaurants && setIsLoading(true);
    
        db.collection("restaurants")
          .orderBy("createAt", "desc")
          .startAfter(startRestaurant.data().createAt)
          .limit(limitRestaurant)
          .get()
          .then((response) => {
            if (response.docs.length > 0) {
              setStartRestaurant(response.docs[response.docs.length - 1]);
            } else {
              setIsLoading(false);
            }
    
            response.forEach((doc) => {
              const restaurant = doc.data();
              restaurant.id = doc.id;
              resultRestaurants.push(restaurant);
            });
    
            setRestaurants([...restaurants, ...resultRestaurants]);
          });
    }

    return (
        <View style={styles.viewBody}>
            <ListRestaurants 
                restaurants={restaurants}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />

            {user && (
                <Icon 
                    reverse
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    containerStyle={styles.btnContainer}
                    onPress={()=> navigation.navigate("add-restaurants")}
                />
            )}


        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        
    }
})
