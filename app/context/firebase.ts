// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4Ue85yBnfRNQyjfk55dLJkwdkmYyKms4",
  authDomain: "vadeli.firebaseapp.com",
  projectId: "vadeli",
  storageBucket: "vadeli.firebasestorage.app",
  messagingSenderId: "26545855946",
  appId: "1:26545855946:web:a6f6ef61f89d625915c333"
};

// Initialize Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
