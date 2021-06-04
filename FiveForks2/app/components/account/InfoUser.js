import React from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { Avatar, Accessory } from "react-native-elements";
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from "react-native-flash-message";

LogBox.ignoreLogs(["Setting a timer"]);

export default function InfoUser(props) {
    const { userInfo: {displayName, email, photoURL, uid }, 
            setLoadingText, setLoading} = props;

    //Funcion para cambair el avatar
    const changeAvatar = async () =>{
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if(permissionResult.status === 'denied') {
            showMessage({
                message: "Error",
                description: "Es necesario aceptar los permisos de la galeria",
                type: "danger",
                icon: "auto",
            });
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (result.cancelled) {
                showMessage({
                    description: "cerraste la seleccion de imagenes",
                    type: "warning",
                    icon: "auto",
                });
            } else {
                uploadImage(result.uri).then(() =>{
                    updatePhotoUrl();
                    showMessage({
                        message: "Imagen actualizada",
                        type: "success",
                        icon: "auto",
                    });
                }).catch((err)=>{
                    showMessage({
                        message: "Error",
                        description: "Error al subir la imagen",
                        type: "danger",
                        icon: "auto",
                    });
                    console.log(err)
                })
            }
        }

    }

    //Funcion para subir la imagen a Firebase
    const uploadImage = async (uri) =>{
        setLoadingText("actualizando avatar");
        setLoading(true);
        
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref().child(`avatar/${uid}`)
        return ref.put(blob);
    }

    //Funcion para actualizar el estado del usuario actual(currentUser)
    const updatePhotoUrl = () =>{
        firebase
        .storage()
        .ref(`avatar/${uid}`)
        .getDownloadURL()
        .then(async (response) => {
          const update = {
            photoURL: response,
          };
          await firebase.auth().currentUser.updateProfile(update);
          setLoading(false);
        })
        .catch(() => {
            showMessage({
                message: "Error",
                description: "Error al actualizar la imagen",
                type: "danger",
                icon: "auto",
            });
        });
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded 
                size="large"
                containerStyle={styles.userInfoAvatar}
                source={
                    photoURL
                        ? { uri: photoURL }
                        : require("../../../assets/img/avatar-default.jpg")
                }
            >
                <Accessory onPress={changeAvatar} size="20" style={styles.accessory} />
            </Avatar>

            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anonimo"}
                </Text>

                <Text>{email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userInfoAvatar: {
        marginRight: 20,
    },
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
    accessory: {
        borderRadius: 50,
        width: "30%",
        height: "30%",
        backgroundColor: "#00a680",
    },
})
