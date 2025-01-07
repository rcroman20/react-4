import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase-config';  // Importa Firestore y Auth
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';  // Importa Firestore
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js"; // Importa para comprobar el estado de autenticación


const Formulario = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);  // Estado para almacenar el ID de usuario

  // Comprobar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);  // Guardar el ID de usuario autenticado
      } else {
        setUserId(null);  // Si no está autenticado, restablecer el ID de usuario
      }
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir la recarga de la página al enviar el formulario

    if (!nombre || !valor) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    if (!userId) {
      setError('Debe estar autenticado para guardar datos.');
      return;
    }

    // Si no hay errores, guardar los datos en Firestore para el usuario autenticado
    try {
      const docRef = await addDoc(collection(db, 'usuarios', userId, 'gastos'), {
        nombre: nombre,
        valor: valor,
        fecha: new Date(),  // Fecha de cuando se registró el gasto
      });

      setError('');
      console.log(`Gasto guardado con ID: ${docRef.id}`);
      
      // Limpiar los campos después de enviar
      setNombre('');
      setValor('');
    } catch (e) {
      setError('Error al guardar los datos en Firestore: ' + e.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Formulario de Gasto</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
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
            placeholder="Ingrese el valor del gasto"
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Formulario;

