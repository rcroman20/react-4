import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, deleteUser, signInWithEmailAndPassword, reauthenticateWithPopup } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";  // Solo Firestore
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"; // Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyDJrgV_QEuQvmRQJvErpSscXZ_80t5sVys",
  authDomain: "save-planner.firebaseapp.com",
  databaseURL: "https://save-planner-default-rtdb.firebaseio.com",
  projectId: "save-planner",
  storageBucket: "save-planner.firebasestorage.app",
  messagingSenderId: "437015374672",
  appId: "1:437015374672:web:b2bbd5de2d1871c856da55"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar la autenticación de Firebase
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Inicializar Firestore y Realtime Database
const db = getFirestore(app);  
const realtimeDb = getDatabase(app); // Inicializar la base de datos en tiempo real

export { auth, provider, db, deleteUser, signInWithEmailAndPassword, reauthenticateWithPopup, realtimeDb };  // Exporta las funciones necesarias