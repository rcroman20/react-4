import React from 'react';
import LogoutButton from '../LogoutButton/LogoutButton';
import './Dashboard.css';
import Gastos from '../Gastos/Gastos'; // Importa el componente Gastos

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
          <LogoutButton />
        </div>
      </div>
      
      {/* Aquí colocamos el componente Gastos debajo del contenido principal */}
      <Gastos />

    </section>
  );
};

export default Dashboard;