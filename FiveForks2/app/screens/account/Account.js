import React, {useState, useEffect} from 'react'
import * as firebase from 'firebase'

import Loading from '../../components/Loading'

import UserGuest from './UserGuest'
import UsserLogged from './UsserLogged'

export default function Account() {
    const [login, setLogin] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) =>{
            //si el usuario no tiene contenido
            !user ? setLogin(false) : setLogin(true)
        })
        
    }, [])

    if(login === null) return <Loading isVisible={true} text={"Cargando n.n"} />;

    return login ? <UsserLogged /> : <UserGuest />
}
