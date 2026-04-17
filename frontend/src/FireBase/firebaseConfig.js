// Importa las funciones que necesito para firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// En este archivo se inicializa firebase y se exportan las instancias de firestore y auth

const firebaseConfig = {
  apiKey: "AIzaSyCGwt3VF0N78pqcOSPeyE2oPVboBwbL7o0",
  authDomain: "proyectarquitectserv.firebaseapp.com",
  projectId: "proyectarquitectserv",
  storageBucket: "proyectarquitectserv.firebasestorage.app",
  messagingSenderId: "950013565141",
  appId: "1:950013565141:web:617f88ae3fe9c4eada6a5c",
  measurementId: "G-BHT67TGZC7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };