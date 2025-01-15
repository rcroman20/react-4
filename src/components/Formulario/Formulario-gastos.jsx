import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase-config";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import "./Formulario.css";

const Formulario = () => {
  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState("");
  const [etiqueta, setEtiqueta] = useState(""); // Cambiado para solo almacenar una etiqueta seleccionada
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Fecha actual
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const predefinidas = [
    "Gastos",
    "diarios",
    "Cuidado personal",
    "Regalos",
    "Transporte",
    "Tecnología",
    "Viajes",
    "Salud",
    "Deudas",
    "Alimentación",
    "Vivienda",
    "Entretenimiento",
    "Otros",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEtiquetaChange = (e) => {
    setEtiqueta(e.target.value); // Cambiado para actualizar una sola etiqueta seleccionada
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !valor || !etiqueta || !fecha) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (!userId) {
      setError("Debe estar autenticado para guardar datos.");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, "usuarios", userId, "gastos"),
        {
          nombre: nombre,
          valor: valor,
          etiquetas: [etiqueta], // Guardamos solo una etiqueta
          fecha: new Date(fecha), // Asegurarse de que la fecha esté en formato Date
        }
      );

      setError("");
      console.log(`Gasto guardado con ID: ${docRef.id}`);

      // Limpiar los campos después de enviar
      setNombre("");
      setValor("");
      setEtiqueta(""); // Restablecer etiqueta
      setFecha(new Date().toISOString().split("T")[0]); // Restablecer la fecha a la actual

      // Ocultar el formulario
      setMostrarFormulario(false);
    } catch (e) {
      setError("Error al guardar los datos en Firestore: " + e.message);
    }
  };

  return (
    <div className="form-container">
      <button
        className="hidden-form"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "Ocultar Formulario" : "Ingresar nuevo gasto"}
      </button>

      {mostrarFormulario && (
        <>
          <h2>Formulario de Gasto</h2>
          {error && <p style={{ color: "black" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                className="form-input"
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nombre del gasto"
              />
            </div>

            <div className="form-group">
              <label htmlFor="valor">Valor:</label>
              <input
                type="number"
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ingrese el monto del gasto sin punto ni coma"
              />
            </div>

            <div className="form-group">
            <label className='label-form' htmlFor="etiqueta">Etiqueta:</label>
            <select
                id="etiquetas"
                value={etiqueta}
                onChange={handleEtiquetaChange}
                className="form-input"
              >
                <option className="form-input" value="">
                  Selecciona una etiqueta
                </option>{" "}
                {/* Opción predeterminada */}
                {predefinidas.map((etiqueta) => (
                  <option key={etiqueta} value={etiqueta}>
                    {etiqueta}
                  </option>
                ))}
              </select>
              <p>
                <strong>Etiqueta seleccionada:</strong> {etiqueta}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="input-fecha"
              />
            </div>

            <button type="submit" className="send-button-form">
              Enviar
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Formulario;
