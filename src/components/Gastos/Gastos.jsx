import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase-config';
import { collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import Formulario from '../Formulario/Formulario';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Gastos.css';


const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener los gastos desde Firestore
  useEffect(() => {
    const fetchGastos = () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("Usuario no autenticado");
        return;
      }

      console.log("Usuario autenticado:", user.uid);

      const gastosRef = collection(db, 'usuarios', user.uid, 'gastos');
      const unsubscribe = onSnapshot(
        gastosRef,
        (querySnapshot) => {
          const gastosArray = [];
          querySnapshot.forEach((doc) => {
            gastosArray.push({ id: doc.id, ...doc.data() });
          });
          console.log("Gastos obtenidos:", gastosArray);
          setGastos(gastosArray); // Actualiza el estado con todos los datos
          setLoading(false);
        },
        (error) => {
          console.error("Error al obtener los datos de Firestore:", error);
        }
      );

      return () => unsubscribe();
    };

    fetchGastos();
  }, []);

  return (
    <section className="container-gastos">
      <Formulario />
      <div className="gastos-summary">
        <h3>Total de Gastos: ${gastos.reduce((total, gasto) => total + parseFloat(gasto.valor), 0).toFixed(2)}</h3>
      </div>

      <div className="gastos-list">
        {loading ? (
          <p>Cargando gastos...</p>
        ) : (
          gastos.length > 0 ? (
            <ul>
              {gastos.map((gasto) => (
                <li key={gasto.id}>
                  <strong>{gasto.nombre}</strong>: ${gasto.valor} - {new Date(gasto.fecha.seconds * 1000).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes gastos registrados.</p>
          )
        )}
      </div>

      <ToastContainer />
    </section>
  );
};

export default Gastos;
