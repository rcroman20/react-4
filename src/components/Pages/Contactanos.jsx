import React, { useState, useEffect } from "react";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { realtimeDb } from "../../../firebase-config"; // Importa la configuración
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import LogoutButton from "../LogoutButton/LogoutButton";

const Contactanos = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [fadeOut, setFadeOut] = useState(false); // Estado para activar la animación
  const navigate = useNavigate(); // Inicializa el hook para redireccionar

  // Verificar si el usuario está autenticado y obtener sus datos
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si el usuario está autenticado, establece su nombre y correo en los estados
        setUser(user);
        setNombre(user.displayName || ""); // Establece el nombre del usuario
        setCorreo(user.email || ""); // Establece el correo del usuario
      } else {
        // Si no está autenticado, limpia los campos
        setUser(null);
        setNombre("");
        setCorreo("");
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Referencia a la base de datos en tiempo real
    const dbRef = ref(realtimeDb, "contactos/" + Date.now()); // Usamos Date.now() para una clave única
    set(dbRef, {
      nombre,
      correo,
      mensaje,
    })
      .then(() => {
        // Mostrar notificación de éxito
        showNotification("Mensaje enviado correctamente", "success");
        setNombre("");
        setCorreo("");
        setMensaje("");

        // Activar la animación de desvanecimiento
        setFadeOut(true);

        // Redirigir a la página principal después de un retraso
        setTimeout(() => {
          navigate("/"); // Redirige a la página principal
        }, 1500); // Retraso de 1.5 segundos para permitir que la animación se vea
      })
      .catch((error) => {
        // Mostrar notificación de error
        showNotification("Hubo un error al enviar el mensaje", "error");
        console.error("Error al enviar el mensaje:", error);
      });
  };

  const showNotification = (message, type) => {
    const notification = document.getElementById("notification");
    notification.textContent = message;

    // Mostrar la notificación con un pequeño retraso
    setTimeout(() => {
      notification.classList.remove("hidden");
      notification.classList.add("show", type); // Añadir "show" para visibilidad y el tipo (success/error)
    }, 100); // Retraso de 100 ms para asegurar que el DOM se actualice

    // Ocultar la notificación después de 4 segundos
    setTimeout(() => {
      notification.classList.add("hidden");
      notification.classList.remove("show", type); // Eliminar "show" y el tipo después de 4 segundos
    }, 4000);
  };

  return (
    <div className={`contact ${fadeOut ? "fade-out" : ""}`}>
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
      </section>

      <h2>Contactanos</h2>
      <p>
        Para más información o cualquier duda puedes escribirnos, déjanos tus
        datos debajo.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>

      {/* Notificación */}
      <div id="notification" className="hidden"></div>
    </div>
  );
};

export default Contactanos;
