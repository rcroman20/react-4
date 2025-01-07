import React, { useEffect } from 'react';
import './Home.css';
import { auth, provider } from '../../../firebase-config';
import { signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/google-icon.png';

const Inicio = () => {
  const navigate = useNavigate();

  // Verificar si ya está logueado y redirigir
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      navigate('/Nueva'); // Redirigir al Dashboard si ya está logueado
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario logueado:", user);
      navigate('/Nueva'); // Redirigir al componente Dashboard después de loguearse
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <div className="inicio-container">
      <div className="content">
        <img
          src="https://projects-2025.web.app/assest/blog/blog-image-2.webp"
          alt="Ilustración"
          className="illustration"
        />
        <h1>Bienvenido a Cashew!</h1>
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img
            src={googleIcon}
            alt="Google"
            className="google-logo"
          />
          Inicie sesión con Google
        </button>
        <p>
          Mantenga sus datos respaldados y sincronizados con Google Drive.
        </p>
      </div>
    </div>
  );
};

export default Inicio;
