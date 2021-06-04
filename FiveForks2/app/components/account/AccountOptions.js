import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { map } from "lodash";

import Modal from '../Modal';

import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function AccountOptions(props) {
    const { userInfo, setReloadUserInfo } = props;
    const [isVisible, setIsVisible] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectdComponent = (key) =>{
        switch (key) {
            case 'displayName':
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setIsVisible}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setIsVisible(true);
                break;

            case 'email':
                setRenderComponent(
                    <ChangeEmailForm 
                        email={userInfo.email}
                        setShowModal={setIsVisible}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setIsVisible(true);
                break;

            case 'password':
                setRenderComponent(
                    <ChangePasswordForm 
                        setShowModal={setIsVisible}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setIsVisible(true);
                break;  

            default:
                setRenderComponent(null);
                break;
        }
    }

    const menuOptions = generateOptions(selectdComponent);

    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem key={index} bottomDivider onPress={menu.onPress}>
                    <Icon type={menu.iconType} name={menu.iconNameLeft}  color={menu.iconColorLeft} />

                    <ListItem.Content>
                        <ListItem.Title>{menu.title}</ListItem.Title>
                    </ListItem.Content>

                    <ListItem.Chevron size={30} />
                </ListItem>
            ))}

            {/*Si no llega nulo se renderiza */}
            {renderComponent && (
                <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
                    {renderComponent}
                </Modal>
            )}

        </View>
    )
}

//No recibe un componente, solo recibe parametros, una funcionsimple. Por eso no son props
function generateOptions(selectdComponent) {
    return [
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            onPress: ()=> selectdComponent("displayName")
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            onPress: ()=> selectdComponent("email")
        },
        {
            title: "Cambair contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            onPress: ()=> selectdComponent("password")
        }
    ]
}

const styles = StyleSheet.create({})
