import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase-config';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js';
import './Formulario.css';

const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [valor, setValor] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha actual
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const predefinidas = ['Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud']; // 5 etiquetas predefinidas

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

  const handleEtiquetaChange = (etiqueta) => {
    // Añadir o quitar etiquetas seleccionadas
    setEtiquetas((prev) => {
      if (prev.includes(etiqueta)) {
        return prev.filter((item) => item !== etiqueta); // Quitar etiqueta si ya está seleccionada
      }
      return [...prev, etiqueta]; // Agregar etiqueta si no está seleccionada
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !valor || etiquetas.length === 0 || !fecha) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    if (!userId) {
      setError('Debe estar autenticado para guardar datos.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'usuarios', userId, 'gastos'), {
        nombre: nombre,
        valor: valor,
        etiquetas: etiquetas, // Guardamos las etiquetas como array
        fecha: new Date(fecha), // Asegurarse de que la fecha esté en formato Date
      });

      setError('');
      console.log(`Gasto guardado con ID: ${docRef.id}`);

      // Limpiar los campos después de enviar
      setNombre('');
      setValor('');
      setEtiquetas([]);
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
        {mostrarFormulario ? 'Ocultar Formulario' : 'Ingresar nuevo gasto'}
      </button>

      {mostrarFormulario && (
        <>
          <h2>Formulario de Gasto</h2>
          {error && <p style={{ color: 'black' }}>{error}</p>}
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
              <label htmlFor="etiquetas">Etiquetas:</label>
              <div className="etiquetas-seleccionadas">
                {predefinidas.map((etiqueta) => (
                  <button
                    type="button"
                    key={etiqueta}
                    className={`etiqueta-btn ${etiquetas.includes(etiqueta) ? 'selected' : ''}`}
                    onClick={() => handleEtiquetaChange(etiqueta)}
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
              <p><strong>Etiquetas seleccionadas:</strong> {etiquetas.join(', ')}</p>
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className='input-fecha'
              />
            </div>

            <button type="submit" className='send-button-form'>Enviar</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Formulario;
