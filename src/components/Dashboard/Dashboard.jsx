import React from "react";
import LogoutButton from "../LogoutButton/LogoutButton"; // Ya está importado correctamente
import "./Dashboard.css";
import Gastos from "../Gastos/Gastos"; // Importa el componente Gastos
import Ingresos from "../Ingresos/Ingresos";
import ResumenPorEtiqueta from "../Etiquetas/ResumenPorEtiqueta";
import TotalGastosMensuales from "../TotalGastos/TotalGastosMensuales";

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
            titulo={`Foto de ${user.displayName}`}
            className="user-image"
          />
        )}
        <div className="text-content">
          <h1>
            Bienvenido, <br /> {user.displayName}
          </h1>
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
      <div className="form-title" id="formularios">
        {" "}
        <h2>Formularios de Ingresos y Egresos</h2>
      </div>
      <div className="div-hidden">
        <p className="p-hidden">Algunas caracteristicas no estan disponible en la version Movil, te recomendamos usar nuestro sitio web desde un computaodr para mejorar la experiencia</p>
      </div>
      <div className="contenedor-horizontal">
        <Ingresos />
        <Gastos />
      </div>

      <section className="total-dinero">
        <TotalGastosMensuales />
      </section>
    </section>
    
  );
};

export default Dashboard;
