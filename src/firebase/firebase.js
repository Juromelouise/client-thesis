// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnMKCiVBjjY8QgmoPVb5eOrGDwOPBlNPY",
  authDomain: "thesis-434709.firebaseapp.com",
  projectId: "thesis-434709",
  storageBucket: "thesis-434709.firebasestorage.app",
  messagingSenderId: "642593357289",
  appId: "1:642593357289:web:59baf0bda3f7edccd39f78",
  measurementId: "G-ZTLQWR9C8B",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
