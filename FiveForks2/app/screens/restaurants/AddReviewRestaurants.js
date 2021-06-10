import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from "react-native-elements";
import { showMessage } from 'react-native-flash-message';
import Loading from '../../components/Loading';

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurants(props) {
    const { navigation, route } = props;
    const { idRestaurant } = route.params;
    
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState(null);
    const [isLoading, setisLoading] = useState(false);


    const addReview = () =>{
        var description = ""
        if (!rating) {
            description="No haz dado ninguna puntuación"
            mensaje(description);
        } else if (!title) {
            description="El titulo es obligatorio"
            mensaje(description);
        }else if (!review) {
            description="El comentario es obligatorio"
            mensaje(description);
        }else{
            setisLoading(true);
            const user = firebase.auth().currentUser;
            const payLoad ={
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date(),
            }

            db.collection("reviews")
                .add(payLoad)
                .then(()=>{
                    setisLoading(false);
                }).catch((err)=>{
                    console.log(err)

                    description="Ah ocurrido un error al enviar, intente de nuevo"
                    mensaje(description);
                })

        }
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating 
                    count={5}
                    reviews={["Pésimo", "Deficiente", "Normal", "Muy bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value)=> {setRating(value)}}
                />
            </View>
            <View style={styles.formReview}>
                <Input 
                    placeholder="Título"
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input 
                    placeholder="Comentario.."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button 
                    title="Enviar comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Loading isVisible={isLoading} text="Enviando comentario" />
        </View>
    )
}

function mensaje(description) {
    showMessage({
        message: "Error",
        description: description,
        type: "danger",
        icon: "auto",
    });
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})
