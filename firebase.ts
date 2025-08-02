// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALhotyCyMPF3zaaB8oWabhfH1VDV-JLdA",
  authDomain: "ev-battery-intelligence.firebaseapp.com",
  projectId: "ev-battery-intelligence",
  storageBucket: "ev-battery-intelligence.firebasestorage.app",
  messagingSenderId: "354043684573",
  appId: "1:354043684573:web:d9c6b7bc2164ee8ba8dd34"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = firebase.auth();
export default app;