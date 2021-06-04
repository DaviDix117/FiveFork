import React, {useState} from 'react';
import { Input, Button} from 'react-native-elements';
import * as firebase from 'firebase';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { reauthenticate } from "../../utils/api";
import { size } from 'lodash';

export default function ChangePasswordForm(props) {
    const { setShowModal, setReloadUserInfo } = props;

    const [formData, setFormData] = useState(defaultValue())
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () =>{
        let isSetError = true;
        let errorsTemp = {};
        setError({});

        if (
            !formData.password || 
            !formData.repeatNewPassword || 
            !formData.newPassword
        ) {
            errorsTemp = {
                password: !formData.password
                    ? "Campo obligatorio"
                    : "",
                newPassword: !formData.repeatNewPassword 
                    ? "Campo obligatorio" 
                    : "",
                repeatNewPassword: !formData.newPassword 
                    ? "Campo obligatorio" 
                    : "",
            }
            // setError({
            //     password: "Todos los campos son obligatorios",
            // })
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            errorsTemp = {
                newPassword: "No coinciden las contraseñas",
            }
        } else if (size(formData.newPassword) < 6 ) {
            errorsTemp = {
                newPassword: "La contrasña debe ser mayor a 6 caracteres "
            }
        } else {
            setIsLoading(true);

            //Espera a que el rauthenticate termite para que el setError del final se ejecute
            await reauthenticate(formData.password).then(async () =>{
                await firebase
                    .auth()
                    .currentUser
                    .updatePassword(formData.newPassword)
                    .then(()=>{
                        isSetError = false;
                        setIsLoading(false);
                        showMessage({
                            message: "Contraseña actualizada correctamente",
                            type: "success",
                            icon: "auto",
                        });
                        setShowModal(false);
                        firebase.auth().signOut();
                    }).catch((err)=>{
                        console.log(err);
                        errorsTemp = {
                            newPassword: "Error al actualizar la contraseña"
                        }
                        setIsLoading(false);
                    })
            }).catch((error)=>{
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);

                setIsLoading(false);

                if (errorCode === "auth/wrong-password") {
                    errorsTemp = {
                        password: "Contraseña incorrecta"
                    }
                } else if (errorCode == "auth/too-many-requests") {
                    errorsTemp = {
                        password: "Demasiados intentos, intente mas tarde"
                    }
                } else {
                    errorsTemp = {
                        password: errorMessage
                    }                
                }
            })
        }

        //Si es true se actualiza
        isSetError && setError(errorsTemp);
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder="Actual contraseña"
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

            <Input 
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                secureTextEntry={true}
                rightIcon={{
                    type: "material-community",
                    name: "eye-outline",
                    color: "#c2c2c2"
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={error.newPassword}
            />

            <Input 
                placeholder="Repetir nueva contraseña"
                containerStyle={styles.input}
                secureTextEntry={true}
                rightIcon={{
                    type: "material-community",
                    name: "eye-outline",
                    color: "#c2c2c2"
                }}
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={error.repeatNewPassword}
            />

            <Button 
                title="Cambiar contraseña"
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
        password: "",
        newPassword: "",
        repeatNewPassword: ""
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
