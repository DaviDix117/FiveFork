import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from "react-native-elements";
import * as firebase from 'firebase';

import InfoUser from '../../components/account/InfoUser';
import Loading from '../../components/Loading';
import AccountOptions from '../../components/account/AccountOptions';


export default function UsserLogged() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [reloadUserInfo, setReloadUserInfo] = useState(false);

    useEffect(() => {
        (async  () =>{
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })()
        setReloadUserInfo(false);
    }, [reloadUserInfo])

    //Salir de la session de usuario
    const logOut = () =>{
        firebase.auth().signOut().then(() => {
            console.log("Saliste")
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={styles.viewUserInfo}>

            {/*Si tiene valor se muestra. Validacion*/}
            {userInfo && <InfoUser 
                userInfo={userInfo} 
                setLoading={setLoading} 
                setLoadingText={setLoadingText}  
            />}
            
            <AccountOptions userInfo={userInfo} setReloadUserInfo={setReloadUserInfo} />

            <Button 
                title="Salir"
                onPress={logOut}
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
            />

            <Loading text={loadingText} isVisible={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: "#00a680"
    }
})
