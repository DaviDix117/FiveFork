import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { Overlay } from "react-native-elements";

export default function Loading(props) {
    const { isVisible, text } = props;
    return (
        <Overlay 
            isVisible={isVisible}
            overlayStyle={styles.overlay}
        >
            <View style={styles.view}>
                <ActivityIndicator
                    size ="large" 
                    color="#00a680"
                />
                {text &&<Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay:{
        height: 100,
        width: 200,
        borderColor: "#00a680",
        borderWidth: 2,
        borderRadius: 10,
    },
    text: {
        color: "#00a680",
        textTransform: "uppercase",
        marginTop: 10
    },
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})
