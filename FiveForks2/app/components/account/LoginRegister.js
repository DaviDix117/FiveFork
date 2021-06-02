import React,{useState} from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty } from "lodash";
import { showMessage } from "react-native-flash-message";
import * as firebase from 'firebase';
import { useNavigation } from "@react-navigation/native";

import Loading from '../Loading';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue()); //Guarda Toda la info de los formualrio
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const onSubmit = () => {
      if (
        isEmpty(formData.email) ||
        isEmpty(formData.password)
      ) {
        showMessage({
            message: "Error",
            description: "Todos los campos son obligatorios",
            type: "danger",
            icon: "auto",
        });
      } else {
        setLoading(true);
        firebase
            .auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                showMessage({
                    message: "Correcto",
                    type: "success",
                    icon: "auto",
                });

                setLoading(false);

                navigation.navigate("account");

            }).catch((error) => {

                setLoading(false);

                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == "auth/wrong-password") {
                    showMessage({
                        message: "Error",
                        description: "Contraseña incorrecta",
                        type: "danger",
                        icon: "auto",
                    });
                } else if (errorCode == "auth/user-not-found") {    
                    showMessage({
                        message: "Error",
                        description: "Correo electronico no encontrado",
                        type: "danger",
                        icon: "auto",
                    });
                } else {
                    showMessage({
                        message: "Error",
                        description: errorMessage,
                        type: "danger",
                        icon: "auto",
                    });
                }

            });
      }
    };

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input 
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
                autoCompleteType='email'
                rightIcon={
                    <Icon
                        type='material-community'
                        name='at'
                        color='#c1c1c1'
                    />
                }
                
            />

            <Input 
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "password")}
                secureTextEntry={showPassword ? false : true }
                autoCompleteType='password'
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        color='#c1c1c1'
                        onPress={()=> setShowPassword(!showPassword)}
                    />
                }
            />

            <Button 
                title="Iniciar sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                rightIcon={{ type: 'material-community', name: 'at', color: "#c1c1c1" }}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Iniciando sesión" />
        </View>
    )
}

function defaultFormValue() {
    return{
        email: "",
        password: "",
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: "#00a680",
    }
})
