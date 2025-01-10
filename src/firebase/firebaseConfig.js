import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAv2F7W501DoSwLQL7-wTXiHMFeUpwpmhI",
    authDomain: "toystore-ct553.firebaseapp.com",
    projectId: "toystore-ct553",
    storageBucket: "toystore-ct553.firebasestorage.app",
    messagingSenderId: "116657966822",
    appId: "1:116657966822:web:fad0196eb4f2d1d364b527", 
    measurementId: "G-E439ZN8VLC" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider, signInWithPopup };