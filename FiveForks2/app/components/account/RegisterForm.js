import React,{useState} from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from "react-native-elements";
import { size, isEmpty } from "lodash";

import { validateEmail } from "../../utils/validation";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue()); //Guarda Toda la info de los formualrios

    const onSubmit = () => {
      if (
        isEmpty(formData.email) ||
        isEmpty(formData.password) ||
        isEmpty(formData.repeatPassword)
      ) {
        console.log("Obligatorios campos!")
      } else if(!validateEmail(formData.email)) {
        console.log("Email incorrecto")
      } else if(formData.password !== formData.repeatPassword ){
        console.log("Las contraseñas deben de coincidir")
      } else if(size(formData.password) < 6){
        console.log("la contraseña debe tener almenos 6 caracteres")
      } else {
        console.log("Ok")
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
