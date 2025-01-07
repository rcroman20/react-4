import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";  // Solo Firestore

const firebaseConfig = {
  apiKey: "API-KEY",
  authDomain: "API-KEY",
  databaseURL: "API-KEY",
  projectId: "API-KEY",
  storageBucket: "API-KEY",
  messagingSenderId: "API-KEY",
  appId: "API-KEY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar la autenticación de Firebase
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Inicializar Firestore
const db = getFirestore(app);  // Asegúrate de inicializar Firestore

export { auth, provider, db };  // Exporta Firestore
