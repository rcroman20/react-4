import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase-config';
import { collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import { Bar } from 'react-chartjs-2'; // Importamos solo el gráfico de barras
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Importamos los elementos de Chart.js necesarios

import './ResumenPorEtiqueta.css';

// Registramos los componentes de Chart.js que usaremos
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResumenPorEtiqueta = () => {
  const [ingresosPorEtiqueta, setIngresosPorEtiqueta] = useState([]);
  const [gastosPorEtiqueta, setGastosPorEtiqueta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Referencia a los ingresos
        const ingresosRef = collection(db, 'usuarios', user.uid, 'ingresos');
        const unsubscribeIngresos = onSnapshot(ingresosRef, (querySnapshot) => {
          const ingresosArray = [];
          querySnapshot.forEach((doc) => {
            ingresosArray.push({ id: doc.id, ...doc.data() });
          });

          // Agrupar los ingresos por etiqueta
          const ingresosAgrupados = {};
          ingresosArray.forEach((ingreso) => {
            ingreso.etiquetas.forEach((etiqueta) => {
              if (!ingresosAgrupados[etiqueta]) {
                ingresosAgrupados[etiqueta] = 0;
              }
              ingresosAgrupados[etiqueta] += parseFloat(ingreso.valor);
            });
          });

          // Convertir el objeto de agrupación a un array para renderizar
          const resumenIngresos = Object.keys(ingresosAgrupados).map((etiqueta) => ({
            etiqueta,
            total: ingresosAgrupados[etiqueta],
          }));

          setIngresosPorEtiqueta(resumenIngresos);
        });

        // Referencia a los gastos
        const gastosRef = collection(db, 'usuarios', user.uid, 'gastos');
        const unsubscribeGastos = onSnapshot(gastosRef, (querySnapshot) => {
          const gastosArray = [];
          querySnapshot.forEach((doc) => {
            gastosArray.push({ id: doc.id, ...doc.data() });
          });

          // Agrupar los gastos por etiqueta
          const gastosAgrupados = {};
          gastosArray.forEach((gasto) => {
            gasto.etiquetas.forEach((etiqueta) => {
              if (!gastosAgrupados[etiqueta]) {
                gastosAgrupados[etiqueta] = 0;
              }
              gastosAgrupados[etiqueta] += parseFloat(gasto.valor);
            });
          });

          // Convertir el objeto de agrupación a un array para renderizar
          const resumenGastos = Object.keys(gastosAgrupados).map((etiqueta) => ({
            etiqueta,
            total: gastosAgrupados[etiqueta],
          }));

          setGastosPorEtiqueta(resumenGastos);
          setLoading(false);
        });

        return () => {
          unsubscribeIngresos();
          unsubscribeGastos();
        };
      }
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // Preparar datos para los gráficos
  const ingresosLabels = ingresosPorEtiqueta.map((item) => item.etiqueta);
  const ingresosData = ingresosPorEtiqueta.map((item) => item.total);

  const gastosLabels = gastosPorEtiqueta.map((item) => item.etiqueta);
  const gastosData = gastosPorEtiqueta.map((item) => item.total);

  const ingresosChartData = {
    labels: ingresosLabels,
    datasets: [
      {
        label: 'Ingresos por Etiqueta',
        data: ingresosData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const gastosChartData = {
    labels: gastosLabels,
    datasets: [
      {
        label: 'Gastos por Etiqueta',
        data: gastosData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="resumen">
      <h2>Resumen por Etiqueta</h2>
      {loading ? (
        <p>Cargando resumen...</p>
      ) : (
        <div className="resumen-contenedor">
          <div className="resumen-seccion">
            <h3>Ingresos</h3>
            <Bar data={ingresosChartData} options={{ responsive: true }} />
            {ingresosPorEtiqueta.length > 0 ? (
              <ul>
                {ingresosPorEtiqueta.map((item) => (
                  <li key={item.etiqueta}>
                    <strong>{item.etiqueta}:</strong> {formatCurrency(item.total)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes ingresos registrados con etiquetas.</p>
            )}
          </div>

          <div className="resumen-seccion">
            <h3>Gastos</h3>
            <Bar data={gastosChartData} options={{ responsive: true }} />
            {gastosPorEtiqueta.length > 0 ? (
              <ul>
                {gastosPorEtiqueta.map((item) => (
                  <li key={item.etiqueta}>
                    <strong>{item.etiqueta}:</strong> {formatCurrency(item.total)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes gastos registrados con etiquetas.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ResumenPorEtiqueta;
