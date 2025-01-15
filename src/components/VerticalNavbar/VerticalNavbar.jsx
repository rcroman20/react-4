import React, { useState, useEffect } from 'react';
import { FaHome, FaInfoCircle, FaConciergeBell, FaEnvelope, FaCoins, FaChartPie, FaForumbee, FaPaperclip, FaChartBar } from 'react-icons/fa'; // Importa los íconos
import { ToastContainer, toast } from 'react-toastify'; // Importa Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de Toastify
import { auth, deleteUser } from '../../../firebase-config'; // Asegúrate de que las importaciones son correctas
import './VerticalNavbar.css';
import { BsFileBarGraphFill } from 'react-icons/bs';



const VerticalNavbar = () => {
  // Estado para almacenar la hora y la fecha actual
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })); // Fecha con formato "dd de mes yyyy"

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long',  year: 'numeric' })); // Actualizar la fecha también
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(timer); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

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
      {/* Componente de reloj */}
      <div className="navbar-clock">
        <h1>{currentTime}</h1>
        <p>{currentDate}</p> {/* Muestra la fecha actual en formato "06 de junio 2025" */}
      </div>

      <ul>
        <li>
          <a href="/">
            <FaHome /> Inicio
          </a>
        </li>
        <li>
          <a href="/About">
            <FaInfoCircle /> Acerca de Nosotros
          </a>
        </li>

{/*        <li>
          <a href="/Contactanos">
            <FaEnvelope /> Contáctanos
          </a>
        </li>  */}
         <li>
          <a href="/#resumen"><FaChartPie />Resumen</a>
        </li>
        <li>
          <a href="/#formularios"><FaPaperclip />Formularios</a>
        </li>

        <li>
          <a href="/#ingresos-anuales"><FaChartBar />Resumen Anual</a>
        </li>
      </ul>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default VerticalNavbar;
