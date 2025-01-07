import React from 'react';
import LogoutButton from '../LogoutButton/LogoutButton';  // Ya está importado correctamente
import './Dashboard.css';
import Gastos from '../Gastos/Gastos'; // Importa el componente Gastos
import Ingresos from '../Ingresos/Ingresos';
import ResumenPorEtiqueta from '../Etiquetas/ResumenPorEtiqueta';

const Dashboard = ({ user }) => {
  console.log("Datos del usuario:", user);

  if (!user) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <section className="container-dashboard">
      <div className="dashboard-content">
        {/* Si no hay foto, no renderizarla */}
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={`Foto de ${user.displayName}`}
            className="user-image"
          />
        )}
        <div className="text-content">
          <h1>Bienvenido, <br /> {user.displayName}</h1>
          <p>Estás conectado como {user.email}</p>
        </div>
      </div>
      
      {/* Coloca LogoutButton aquí */}
      <div className="logout-container">
        <LogoutButton />
      </div>
      
      {/* Centrado solo para ResumenPorEtiqueta */}
      <div className="resumen-por-etiqueta-container">
        <ResumenPorEtiqueta />
      </div>

      {/* Aquí colocamos el componente Gastos debajo del contenido principal */}
      <div className="contenedor-horizontal">
        <Ingresos />
        <Gastos />
      </div>

    </section>
  );
};

export default Dashboard;
