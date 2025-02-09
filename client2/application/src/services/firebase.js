import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';  // ייבוא AsyncStorage

// import {
//     REACT_APP_FIREBASE_API_KEY,
//     REACT_APP_FIREBASE_AUTH_DOMAIN,
//     REACT_APP_FIREBASE_PROJECT_ID,
//     REACT_APP_FIREBASE_STORAGE_BUCKET,
//     REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     REACT_APP_FIREBASE_APP_ID
// } from '@env';

const firebaseConfig = {
    apiKey: "AIzaSyBdmN9_ELgy-Ui-EnLkosq8iE0cpIbh8Q4",
    authDomain: "files-classification.firebaseapp.com",
    projectId: "files-classification",
    storageBucket: "files-classification.appspot.com",
    messagingSenderId: "912043324894",
    appId: "1:912043324894:web:e9b2a26533009f8b8e594f",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
