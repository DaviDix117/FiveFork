import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListRestaurants(props) {
    const { restaurants, handleLoadMore, isLoading } = props;

    const navigation = useNavigation();

    return (
        <View>
            {
                size(restaurants) > 0 ? (
                    <FlatList 
                        data={restaurants}
                        renderItem={(restaurant)=> <Restaurant restaurant={restaurant} navigation={navigation}  />}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={<FooterList isLoading={isLoading} />}
                    />
                ) : (
                    <View style={styles.loaderRestaurants}>
                        <ActivityIndicator 
                            size="large"
                            color="#00a680"
                        />
                        <Text>Cargando resturantes</Text>
                    </View>
                )
            }
        </View>
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const { id, images, name, description, addres } = restaurant.item;
    const imageRestaurant = images[0]; // Para validar si viene vacio mas abajo

    const goRestaurant = () =>{
        navigation.navigate("restaurant", {
            id,
            name
        })    
    }

    return (
        <TouchableOpacity
            onPress={goRestaurant}
        >
            <View style={styles.viewResturant}>
                <View style={styles.viewResturantImage}>
                    <Image 
                        resizeMode='cover'
                        PlaceholderContent={<ActivityIndicator color="fff" />}
                        source={
                            imageRestaurant 
                            ? { uri: imageRestaurant }
                            : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imageResturant}
                    />
                </View>

                <View>
                    <Text style={styles.restaurantName}>
                        {name}
                    </Text>
                    <Text style={styles.restaurantAddres}>
                        {addres}
                    </Text>
                    <Text style={styles.restaurantDescription}>
                        {description.substr(0, 60)}...
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList(props) {
    const { isLoading } = props;

    if (isLoading) {
        return(
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator 
                    size="large"
                    color="#00a680"
                />
            </View>
        )
    } else {
        return(
            <View style={styles.notFoundRestaurant}>
                <Text>No quedan restaurantes por cargar</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    viewResturant: {
        flexDirection: "row",
        margin: 10
    },
    viewResturantImage: {
        marginRight: 15
    },
    imageResturant: {
        width: 80,
        height: 80
    },
    restaurantName: {
        fontWeight: "bold"
    },
    restaurantAddres: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: 'grey',
        width: 300
    },
    notFoundRestaurant: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    }
})
