import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp);// Para el firestore

export default function Restaurants(props) {
    const { navigation } = props;
    
    const [user, setUser] = useState(null); //Guarda la info del usuario
    const [restaurants, setRestaurants] = useState([]);// Guarda los resturantes
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurant, setStartRestaurant] = useState(null)/*Guarda el ultimo restaurante pintado en pantalla,
    para saber por cual restaurante empezar a pintar en pantalla cuando el usuario quiera cargar mas */
    
    const limitRestaurant = 2;

    console.log(restaurants);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) =>{
            setUser(userInfo)
        })
    }, [])

    // Peticion para obtener los restaurantes
    useEffect(() => {
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

    return (
        <View style={styles.viewBody}>

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
