import React, { useEffect, useState } from "react";
import "./Home.css";
import { auth, provider } from "../../../firebase-config";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { useNavigate } from "react-router-dom";

// Diccionario de errores personalizados
const errorMessages = {
  "auth/email-already-in-use": "El correo electrónico ya está en uso.",
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/user-not-found": "Usuario no encontrado",
  "auth/weak-password": "La contraseña es demasiado débil.",
  "auth/wrong-password": "La contraseña es incorrecta.",
  "auth/invalid-password": "La contraseña es incorrecta",
  "auth/too-many-requests": "Demasiados intentos, vuelve más tarde",
  "auth/popup-closed-by-user": "Cerraste la pestaña de inicio de sesión.",
  "auth/unauthorized-domain": "Dominio no autorizado",
  "auth/user-cancelled": "Cancelaste el inicio de sesión",
  
  default: "Algo anda mal con los datos o con el servidor, refresca la página",
};

const Inicio = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  // Verificar si ya está logueado y redirigir
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      navigate("/Main"); // Redirigir al Dashboard si ya está logueado
    }
  }, [navigate]);

  // Mostrar la notificación
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null); // Ocultar notificación después de 5 segundos
    }, 5000);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario logueado:", user);
      navigate("/Main"); // Redirigir al componente Dashboard después de loguearse
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      const errorMessage = errorMessages[error.code] || errorMessages.default;
      showNotification(errorMessage); // Mostrar mensaje de error
    }
  };

  return (
    <div className="inicio-container">
      {/* Barra de notificación */}
      {notification && (
        <div className="notification-bar">
          <p>{notification}</p>
        </div>
      )}

      <div className="content">
        <img
          src="/assets/save-planner.png"
          alt="Ilustración"
          className="illustration"
        />
        <h1>¡Bienvenido a Save Planner!</h1>
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="google-logo"
          />
          Iniciar Sesión con Google
        </button>
        <p>
          Mantenga sus datos respaldados y sincronizados con su cuenta de 
          Google.
        </p>
      </div>
    </div>
  );
};

export default Inicio;
