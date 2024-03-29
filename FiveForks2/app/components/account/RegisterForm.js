import React,{useState} from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from "react-native-elements";
import { size, isEmpty } from "lodash";
import { showMessage } from "react-native-flash-message";
import * as firebase from 'firebase';
import { useNavigation } from "@react-navigation/native";

import { validateEmail } from "../../utils/validation";
import Loading from '../Loading';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue()); //Guarda Toda la info de los formualrio
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const onSubmit = () => {
      if (
        isEmpty(formData.email) ||
        isEmpty(formData.password) ||
        isEmpty(formData.repeatPassword)
      ) {
        showMessage({
            message: "Error",
            description: "Todos los campos son obligatorios",
            type: "danger",
            icon: "auto",
        });
      } else if(!validateEmail(formData.email)) {
        showMessage({
            message: "Error",
            description: "Email invalido",
            type: "danger",
            icon: "auto",
        });
      } else if(formData.password !== formData.repeatPassword ){
        showMessage({
            message: "Error",
            description: "Las contraseñas deben de coincidir",
            type: "danger",
            icon: "auto",
        });
      } else if(size(formData.password) < 6){
        showMessage({
            message: "Error",
            description: "la contraseña debe tener almenos 6 caracteres",
            type: "danger",
            icon: "auto",
        });
      } else {
        setLoading(true);
        firebase
            .auth()
            .createUserWithEmailAndPassword(formData.email, formData.password)
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

                if (errorCode == "auth/email-already-in-use") {
                    showMessage({
                        message: "Error",
                        description: "Correo electronico ya utlizado",
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
        // console.log(e.nativeEvent.text);
        // setFormData({ [type]: e.nativeEvent.text });
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

            <Input 
                placeholder="Repetir Contraseña"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "repeatPassword")}
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
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                rightIcon={{ type: 'material-community', name: 'at', color: "#c1c1c1" }}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Creando cuenta" />
        </View>
    )
}

function defaultFormValue() {
    return{
        email: "",
        password: "",
        repeatPassword: "",
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
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680",
    }
})
