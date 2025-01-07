import React from 'react';
import { FaHome, FaInfoCircle, FaConciergeBell, FaEnvelope, FaTrashAlt } from 'react-icons/fa'; // Importa el ícono de eliminar
import { ToastContainer, toast } from 'react-toastify'; // Importa Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de Toastify
import { auth, deleteUser } from '../../../firebase-config'; // Asegúrate de que las importaciones son correctas
import './VerticalNavbar.css';

const VerticalNavbar = () => {

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error('No hay usuario autenticado');
      return;
    }

    const confirmDelete = () => {
      toast.promise(
        deleteUser(user)
          .then(() => {
            toast.success('Cuenta eliminada exitosamente');
            setTimeout(() => {
              window.location.href = '/'; // Redirige al inicio
            }, 2000);
          })
          .catch((error) => {
            if (error.code === 'auth/requires-recent-login') {
              toast.error('Necesitas iniciar sesión nuevamente para eliminar tu cuenta.');
            } else {
              toast.error('Hubo un problema al eliminar la cuenta. Intenta de nuevo.');
            }
          }),
        {
          pending: 'Procesando eliminación...',
          success: 'Cuenta eliminada correctamente 👌',
          error: 'Error al eliminar la cuenta 🤯',
        }
      );
    };

    toast(
      <div>
        <p>¿Estás seguro de que deseas eliminar tu cuenta?</p>
        <button
          onClick={confirmDelete}
          style={{
            margin: '10px 5px 0 0',
            padding: '5px 10px',
            background: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Confirmar
        </button>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <div className="navbar">
      <ul>
        <li>
          <a href="#home">
            <FaHome /> Home
          </a>
        </li>
        <li>
          <a href="#about">
            <FaInfoCircle /> About
          </a>
        </li>
        <li>
          <a href="#services">
            <FaConciergeBell /> Services
          </a>
        </li>
        <li>
          <a href="#contact">
            <FaEnvelope /> Contact
          </a>
        </li>
        <li>
          <a onClick={handleDeleteAccount} className="delete-account-btn">
            <FaTrashAlt /> Delete Account
          </a>
        </li>
      </ul>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default VerticalNavbar;
