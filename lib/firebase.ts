import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA4Ue85yBnfRNQyjfk55dLJkwdkmYyKms4",
  authDomain: "vadeli.firebaseapp.com",
  projectId: "vadeli",
  storageBucket: "vadeli.firebasestorage.app",
  messagingSenderId: "26545855946",
  appId: "1:26545855946:web:a6f6ef61f89d625915c333"
};

// Uygulama daha önce başlatılmadıysa başlat
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);