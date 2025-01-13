import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase-config";
import {
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { Pie } from "react-chartjs-2"; // Importamos Pie para gráficos circulares
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; 
import "./ResumenPorEtiqueta.css";

// Registramos los componentes de Chart.js que usaremos
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const ResumenPorEtiqueta = () => {
  const [ingresosPorEtiqueta, setIngresosPorEtiqueta] = useState([]);
  const [gastosPorEtiqueta, setGastosPorEtiqueta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Referencia a los ingresos
        const ingresosRef = collection(db, "usuarios", user.uid, "ingresos");
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
          const resumenIngresos = Object.keys(ingresosAgrupados).map(
            (etiqueta) => ({
              etiqueta,
              total: ingresosAgrupados[etiqueta],
            })
          );

          setIngresosPorEtiqueta(resumenIngresos);
        });

        // Referencia a los gastos
        const gastosRef = collection(db, "usuarios", user.uid, "gastos");
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
          const resumenGastos = Object.keys(gastosAgrupados).map(
            (etiqueta) => ({
              etiqueta,
              total: gastosAgrupados[etiqueta],
            })
          );

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
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
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
        label: "Ingresos por Etiqueta",
        data: ingresosData,
        backgroundColor: ["rgba(40, 167, 69, 0.6)", "rgba(40, 167, 69, 0.8)", "rgba(40, 167, 69, 1)"], // Colores personalizados para cada segmento
      },
    ],
  };

  const gastosChartData = {
    labels: gastosLabels,
    datasets: [
      {
        label: "Gastos por Etiqueta",
        data: gastosData,
        backgroundColor: ["rgba(220, 53, 69, 0.6)", "rgba(220, 53, 69, 0.8)", "rgba(220, 53, 69, 1)"], // Colores personalizados para cada segmento
      },
    ],
  };

  // Comparar ingresos y gastos en un solo gráfico
  const etiquetasComparacion = [...new Set([...ingresosLabels, ...gastosLabels])];
  
  const ingresosComparacionData = etiquetasComparacion.map((etiqueta) => {
    const ingreso = ingresosPorEtiqueta.find((item) => item.etiqueta === etiqueta);
    return ingreso ? ingreso.total : 0;
  });

  const gastosComparacionData = etiquetasComparacion.map((etiqueta) => {
    const gasto = gastosPorEtiqueta.find((item) => item.etiqueta === etiqueta);
    return gasto ? gasto.total : 0;
  });

  const comparativoChartData = {
    labels: etiquetasComparacion,
    datasets: [
      {
        label: "Ingresos",
        data: ingresosComparacionData,
        backgroundColor: "rgba(40, 167, 69, 0.6)", 
      },
      {
        label: "Gastos",
        data: gastosComparacionData,
        backgroundColor: "rgba(220, 53, 69, 0.6)", 
      },
    ],
  };

  return (
    <>
      {loading ? (
        <p>Cargando resumen...</p>
      ) : ingresosPorEtiqueta.length > 0 && gastosPorEtiqueta.length > 0 ? (
        <section className="resumen" id="resumen">
          <h2>Resumen por Etiquetas</h2>
          <div className="resumen-contenedor">
            <div className="resumen-seccion">
              <h3>Ingresos</h3>
              <Pie data={ingresosChartData} options={{ responsive: true }} />
              <ul>
                {ingresosPorEtiqueta.map((item) => (
                  <li key={item.etiqueta}>
                    <strong>{item.etiqueta}:</strong> {formatCurrency(item.total)} |
                  </li>
                ))}
              </ul>
            </div>
  
            <div className="resumen-seccion">
              <h3>Gastos</h3>
              <Pie data={gastosChartData} options={{ responsive: true }} />
              <ul>
                {gastosPorEtiqueta.map((item) => (
                  <li key={item.etiqueta}>
                    <strong>{item.etiqueta}:</strong> {formatCurrency(item.total)} |
                  </li>
                ))}
              </ul>
            </div>

            <div className="resumen-seccion">
              <h3>Comparativa Ingresos vs Gastos</h3>
              <Pie data={comparativoChartData} options={{ responsive: true }} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default ResumenPorEtiqueta;
