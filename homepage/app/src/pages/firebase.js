import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCeB7A9sN29bnu1fE4OF6Goosu8eqiMYRM",
    authDomain: "login-samrueduu.firebaseapp.com",
    projectId: "login-samrueduu",
    storageBucket: "login-samrueduu.firebasestorage.app",
    messagingSenderId: "867047659613",
    appId: "1:867047659613:web:a1a83017add303568855b4",
    measurementId: "G-9R3WL8ETX3"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export default firebaseApp;
