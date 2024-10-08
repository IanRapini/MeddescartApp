import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import  AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDYkHNoMrzI6T1G3q73vtEcUoVAGjh7OwA",
  authDomain: "ajacor-cbb99.firebaseapp.com",
  projectId: "ajacor-cbb99",
  storageBucket: "ajacor-cbb99.appspot.com",
  messagingSenderId: "888558581151",
  appId: "1:888558581151:web:bda358ce4f8ce0a1e8f9aa",
  measurementId: "G-2PY1TP69P0"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
export const db = getFirestore(app);