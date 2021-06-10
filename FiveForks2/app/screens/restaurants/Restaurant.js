import React, { useState, useEffect} from 'react'
import { StyleSheet, Text, View, LogBox, ScrollView, Dimensions } from 'react-native'
import { Rating, ListItem, Icon } from "react-native-elements";
import { map } from 'lodash'

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

import Map from '../../components/Map'
import Loading from '../../components/Loading'
import CarouselImages from '../../components/CarouselImages';
import ListReviews from '../../components/restaurants/ListReviews';

LogBox.ignoreLogs(["Cannot update"]);
const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    navigation.setOptions({ title: name })
    
    const [restaurant, setRestaurant] = useState(null); //gauarda los datos de restaurante
    const [rating, setRating] = useState(0);

    useEffect(() => {
        db.collection("restaurants")
        .doc(id)
        .get()
        .then((response)=>{
            const data = response.data()
            data.id =response.id
            setRestaurant(data);
            //↑ tre los datos del restaurante y le agrega el id al mismo

            setRating(data.rating);
        })
    }, [])

    if (!restaurant) return <Loading isVisible={true} text={"cargando"} />

    return (
        <ScrollView vertical style={styles.viewbody}>
            <CarouselImages 
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />

            <TitleRestaurant 
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />

            <RestaurantInfo 
                name={restaurant.name}
                location={restaurant.location}
                addres={restaurant.addres}
            />

            <ListReviews 
                navigation={navigation}
                idRestaurant={restaurant.id}
                setRating={setRating}
            />
        </ScrollView>
    )
}

function TitleRestaurant(props) {
    const { name, description, rating } = props;

    return(
        <View style={styles.viewRestaurantTittle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
            </View>

            <Rating 
                style={styles.rating}
                imageSize={20}
                readonly
                startingValue={parseFloat(rating)}
            />

            <Text style={styles.description}>
                {description}
            </Text>
        </View>
    )
}

function RestaurantInfo(props) {
    const { location, name, addres } = props;

    const listInfo = [
        {
            text: addres,
            iconType: "material-community",
            iconName: "map-marker",
            iconColor: "#00a680",
            action: null,
        }
    ]

    return(
        <View style={styles.viewrestaurantInfo}>
            <Text style={styles.restaurantInfoTittle}>
                Informacion del restaurante
            </Text>

            <Map 
                location={location}
                name={name}
                height={100}
            />

            {map(listInfo, (tiem, index) =>(
                <ListItem key={index} bottomDivider>
                    <Icon type={tiem.iconType} name={tiem.iconName} color={tiem.iconColor} />

                    <ListItem.Content>
                        <ListItem.Title>{tiem.text}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}

        </View>
    )
    
}

const styles = StyleSheet.create({
    viewbody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewRestaurantTittle: {
        padding: 15,

    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold"
    },
    description: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    viewrestaurantInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTittle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    }
})
