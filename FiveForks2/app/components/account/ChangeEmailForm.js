import React, {useState} from 'react';
import { Input, Button} from 'react-native-elements';
import * as firebase from 'firebase';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { validateEmail } from "../../utils/validation";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props) {
    const { email, setShowModal, setReloadUserInfo } = props;

    const [formData, setFormData] = useState(defaultValue())
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        setError({});

        if (!formData.email || email === formData.email) {
            setError({
                email: "El email no a cambiado",
            })
        } else if (!validateEmail(formData.email)) {
            setError({
                email: "Email invalido"
            })
        }else if (!formData.password) {
            setError({
                password: "La contraña no puede estar vacia"
            })
        }else{
            setIsLoading(true);

            reauthenticate(formData.password).then(response =>{
                firebase
                    .auth()
                    .currentUser
                    .updateEmail(formData.email)
                    .then(()=>{
                        setIsLoading(false);
                        setReloadUserInfo(true);

                        showMessage({
                            message: "Email actualizado correctamente",
                            type: "success",
                            icon: "auto",
                        });

                        setShowModal(false);
                    }).catch((err)=>{
                        var errorCode = err.code;
                        console.log(err)
                        
                        if (errorCode === "auth/email-already-in-use") {
                            setError({email: 'El email ya esta en uso'})
                        } else {
                            setError({email: 'Error al actualizar el email'})
                        }
                        setIsLoading(false);
                    })
            }).catch((error)=>{
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);

                setIsLoading(false);

                if (errorCode === "auth/wrong-password") {
                    setError({password: 'Contraseña incorrecta'})
                } else if (errorCode == "auth/too-many-requests") {
                    setError({password: 'Demasiados intentos, intente mas tarde'})
                } else {
                    setError({email: errorMessage, password: errorMessage})
                }

            })
        }

    };

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder="Correo electronico"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                defaultValue={email || ""}
                onChange={(e) => onChange(e, "email")}
                errorMessage={error.email}
            />
            <Input 
                placeholder="Verificar contraseña"
                containerStyle={styles.input}
                secureTextEntry={true}
                rightIcon={{
                    type: "material-community",
                    name: "eye-outline",
                    color: "#c2c2c2"
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={error.password}
            />

            <Button 
                title="Cambiar Email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />

        </View>
    )
}

function defaultValue() {
    return{
        email: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer :{
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})
