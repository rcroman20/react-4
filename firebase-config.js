import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";  // Solo Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAzIeivflovvsTTea6MMHlQx2ty0xLtFA4",
  authDomain: "tracker-budget.firebaseapp.com",
  databaseURL: "https://tracker-budget-default-rtdb.firebaseio.com", // Este URL ya no es necesario para Firestore
  projectId: "tracker-budget",
  storageBucket: "tracker-budget.appspot.com",
  messagingSenderId: "187543858368",
  appId: "1:187543858368:web:11747767a5263f69ed5125"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar la autenticación de Firebase
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Inicializar Firestore
const db = getFirestore(app);  // Asegúrate de inicializar Firestore

export { auth, provider, db };  // Exporta Firestore
