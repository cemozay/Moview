// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const FirebaseDB = getFirestore(FirebaseApp);
const FirebaseStorage = getStorage(FirebaseApp);

const FirebaseAuth = initializeAuth(FirebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const FirebaseProvider = new GoogleAuthProvider();

export {
  FirebaseApp,
  FirebaseDB,
  FirebaseAuth,
  FirebaseStorage,
  FirebaseProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
};
