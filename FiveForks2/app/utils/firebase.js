import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCnlHpmA2ubc3pHxvZWVOJtsGv3IV_UZVA",
    authDomain: "fiveforks-73e8d.firebaseapp.com",
    projectId: "fiveforks-73e8d",
    storageBucket: "fiveforks-73e8d.appspot.com",
    messagingSenderId: "891450461459",
    appId: "1:891450461459:web:4986203ce2c82137df9ee6"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);