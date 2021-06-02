import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Accessory } from "react-native-elements";

export default function InfoUser(props) {
    const { userInfo: {displayName, email, photoURL } } = props;
    console.log("22222222222222222222222222222222");

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
                <Accessory style={styles.accessory} />
            </Avatar>

            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anonimo"}
                </Text>

                <Text>{email}</Text>
            </View>

            <Text>Prueba</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    userInfoAvatar: {
        marginRight: 20,
        backgroundColor: "black"
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
