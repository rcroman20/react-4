import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase-config'; // Importa Firestore y Auth
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js'; // Importa Firestore
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js'; // Importa para comprobar el estado de autenticación
import './Formulario.css';

const FormularioIngresos = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [valor, setValor] = useState('');
  const [etiqueta, setEtiqueta] = useState(''); // Solo una etiqueta seleccionada
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha actual
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Etiquetas predefinidas
  const predefinidas = ['Salario', 'Inversión', 'Venta', 'Freelance', 'Extra', 'Nómina', 'Otros',];

  // Comprobar si el usuario está autenticado
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

  // Función que maneja el cambio en la selección de etiquetas
  const handleEtiquetaChange = (e) => {
    setEtiqueta(e.target.value); // Cambiar a una sola etiqueta seleccionada
  };

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !valor || !etiqueta || !fecha) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    if (!userId) {
      setError('Debe estar autenticado para guardar datos.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'usuarios', userId, 'ingresos'), {
        nombre: nombre,
        valor: parseFloat(valor),
        etiquetas: [etiqueta], // Solo una etiqueta en lugar de un arreglo
        fecha: new Date(fecha), // Asegurarse de que la fecha esté en formato Date
      });

      setError('');
      console.log(`Ingreso guardado con ID: ${docRef.id}`);

      // Limpiar los campos después de enviar
      setNombre('');
      setValor('');
      setEtiqueta(''); // Restablecer etiqueta
      setFecha(new Date().toISOString().split('T')[0]); // Restablecer la fecha a la actual

      // Ocultar el formulario
      setMostrarFormulario(false);
    } catch (e) {
      setError('Error al guardar los datos en Firestore: ' + e.message);
    }
  };

  return (
    <div className="form-container">
      <button className='hidden-form' onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? 'Ocultar Formulario' : 'Ingresar nuevo ingreso'}
      </button>

      {mostrarFormulario && (
        <>
          <h2>Formulario de Ingreso</h2>
          {error && <p style={{ color: 'black' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className='label-form' htmlFor="nombre">Fuente de Ingreso:</label>
              <input
                className="form-input"
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese la fuente del ingreso"
              />
            </div>

            <div className="form-group">
              <label className='label-form' htmlFor="valor">Monto:</label>
              <input
                type="number"
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ingrese el monto del ingreso sin punto ni coma"
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
                <option    className="form-input" value="">Selecciona una etiqueta</option> {/* Opción predeterminada */}
                {predefinidas.map((etiqueta) => (
                  <option key={etiqueta} value={etiqueta}>
                    {etiqueta}
                  </option>
                ))}
              </select>
              <p><strong>Etiqueta seleccionada:</strong> {etiqueta}</p>
            </div>

            <div className="form-group">
              <label className='label-form' htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className='input-fecha'
              />
            </div>

            <button type="submit" className='send-button-form'>Registrar Ingreso</button>
          </form>
        </>
      )}
    </div>
  );
};

export default FormularioIngresos;
