// src/components/LogoutButton/LogoutButton.jsx
import React from 'react';
import { auth } from '../../../firebase-config'; // Corrige la ruta e incluye las comillas finales
import { signOut } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css'; // Asegúrate de que este archivo exista si es necesario


const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
      navigate('/'); // Redirige al inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button className='logoutButton' onClick={handleLogout} >
      Cerrar Sesión
    </button>
  );
};


export default LogoutButton;
