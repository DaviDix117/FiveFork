import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter } from "lodash";
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import uuid from 'react-native-uuid';

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

import Modal from '../Modal';

const db = firebase.firestore(firebaseApp);
const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
    const { setIsLoading, navigation  } = props;


    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imageSelected, setImageSelected] = useState([]); 
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () =>{
        if (!restaurantName || !restaurantAddress || !restaurantDescription) {
            showMessage({
                message: "Error",
                description: "Todos los campos del formulario son obligatorios",
                type: "danger",
                icon: "auto",
            });
        } else if (size(imageSelected) === 0) {
            showMessage({
                message: "Error",
                description: "El restaurante debe tener como minimo una imagen",
                type: "danger",
                icon: "auto",
            });
        } else if (!locationRestaurant) {
            showMessage({
                message: "Error",
                description: "Tienes que  localizarl el restaurante",
                type: "danger",
                icon: "auto",
            });
        } else {
            setIsLoading(true)
            uploadImage().then((response)=>{

                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        addres: restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    })
                    .then(()=>{
                        setIsLoading(false);
                        showMessage({
                            message: "Correcto",
                            description: `Se a creado el restaurante ${restaurantName}`,
                            type: "success",
                            icon: "auto",
                        });

                        navigation.navigate("restaurants");
                    }).catch((err) =>{
                        setIsLoading(false);
                        console.log(err)
                        showMessage({
                            message: "Error",
                            description: "Ah ocurrido un error, vuelve a intentarlo",
                            type: "danger",
                            icon: "auto",
                        });
                    })
            })
        }
    }

    const uploadImage = async () =>{
        const imageBlob = [];

        await Promise.all(
            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid.v4());
                await ref.put(blob).then(async (result) => {
                    await firebase.storage()
                        .ref(`restaurants/${result.metadata.name}`)
                        .getDownloadURL()
                        .then(photoUrl => {
                            imageBlob.push(photoUrl);
                        });
                });
            })
        );
        

        return imageBlob;
    }

    return (
        <ScrollView style={styles.scrollview}>
            <ImageResturant imagenRestaurant={imageSelected[0]} />
            <FormAdd 
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />

            <UploadImage 
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}
            />

            <Button 
                title="Crear resturante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddResturant}
            />
            <Map 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationRestaurant={setLocationRestaurant}
            />
        </ScrollView>
    )
}

function ImageResturant(props) {
    const { imagenRestaurant } = props;

    return(
        <View style={styles.viewPhoto}>
            <Image 
                source={imagenRestaurant 
                    ? { uri: imagenRestaurant } 
                    : require("../../../assets/img/no-image.png") }
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )
}

function FormAdd(props) {
    const {
      setRestaurantName,
      setRestaurantAddress,
      setRestaurantDescription,
      setIsVisibleMap,
      locationRestaurant
    } = props;

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurnte"
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={e => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    size: 40,
                    color: !locationRestaurant ? "#c2c2c2" : "#00a680" ,
                    onPress: () => setIsVisibleMap(true),
                }}
            />
            <Input 
                placeholder="Descripcion del Restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                containerStyle={styles.input}
                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant } = props;
    const [location, setLocation] = useState(null); //Guarda las corrdenadas

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
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const confirmLocation = () =>{
        setLocationRestaurant(location);
        setIsVisibleMap(false);
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap} >
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button 
                        title="Guardar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave} 
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}

                    />
                    <Button 
                        title="cancelar" 
                        containerStyle={styles.viewMapBtnContainercancel} 
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function UploadImage(props) {
    const { setImageSelected, imageSelected } = props;

    const imageSelect = async () =>{
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
                    message: "Cerraste la seleccion de imagenes",
                    type: "warning",
                    icon: "auto",
                });
            } else {
                setImageSelected([...imageSelected, result.uri]);
            }
        }

    }

    const removeImage = (image) =>{
        Alert.alert(
            "Eliminar imagen",
            "Quieres eliminar esta imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imageSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ]
        )
    }

    return(
        <View style={styles.viewUploadImage}>
            {size(imageSelected) < 5 && (
                <Icon 
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imageSelected, (imageRestaurant, index) => (
                <Avatar 
                    key={index}
                    style={styles.minuatureStyle}
                    source={{ uri: imageRestaurant }}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollview: {
        height: "100%",    
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddResturant: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewUploadImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 0
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    minuatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 5
    },
    viewMapBtnContainercancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})
