// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB88BenBAVb7xDk4E86yxacobYWOV0vxuU",
  authDomain: "moview-7.firebaseapp.com",
  databaseURL:
    "https://moview-7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "moview-7",
  storageBucket: "moview-7.appspot.com",
  messagingSenderId: "93761073008",
  appId: "1:93761073008:web:5dc8e9ad90471bbe2929b5",
  measurementId: "G-MKB8W8Y8ZB",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const FirebaseDB = getFirestore(FirebaseApp);
const FirebaseStorage = getStorage(FirebaseApp);
const FirebaseProvider = new GoogleAuthProvider();

const FirebaseAuth = initializeAuth(FirebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { FirebaseAuth, FirebaseDB, FirebaseStorage, FirebaseProvider };
