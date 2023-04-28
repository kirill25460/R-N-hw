// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDxk5ZrkbOu5EWPLGlf8CpMrUkeFeeC4DA",
  authDomain: "rn-homework-e6444.firebaseapp.com",
  databaseURL: "https://rn-homework-e6444-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rn-homework-e6444",
  storageBucket: "rn-homework-e6444.appspot.com",
  messagingSenderId: "67328071045",
  appId: "1:67328071045:web:e1cddd8265567a0c7fa0ec",
  measurementId: "G-C2Y8M4EQXW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
