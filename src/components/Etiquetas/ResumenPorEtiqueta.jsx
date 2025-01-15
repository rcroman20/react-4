import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase-config";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { Pie, Bar } from "react-chartjs-2"; 
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"; 
import "./ResumenPorEtiqueta.css";


// Registramos los componentes de Chart.js que usaremos
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ResumenPorEtiqueta = () => {
  const [ingresosPorEtiqueta, setIngresosPorEtiqueta] = useState([]);
  const [gastosPorEtiqueta, setGastosPorEtiqueta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad

  // Obtener el mes y año actual
  const currentMonth = new Date().getMonth();  // Mes actual (0-11)
  const currentYear = new Date().getFullYear();  // Año actual

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Referencia a los ingresos
        const ingresosRef = collection(db, "usuarios", user.uid, "ingresos");
        const unsubscribeIngresos = onSnapshot(ingresosRef, (querySnapshot) => {
          const ingresosArray = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const fecha = data.fecha.toDate(); // Suponiendo que 'fecha' está en formato Timestamp
            if (fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear) {
              ingresosArray.push({ id: doc.id, ...data });
            }
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
        const gastosRef = collection(db, "usuarios", user.uid, "gastos");
        const unsubscribeGastos = onSnapshot(gastosRef, (querySnapshot) => {
          const gastosArray = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const fecha = data.fecha.toDate(); // Suponiendo que 'fecha' está en formato Timestamp
            if (fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear) {
              gastosArray.push({ id: doc.id, ...data });
            }
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
  }, [currentMonth, currentYear]);

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
  
  // Opciones para los gráficos
  const optionsPie = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14, 
            family: 'Lato, sans-serif',
          },
          color: "#000",
        },
      },
    },
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 12, 
            family: 'Lato, sans-serif',
          },
          color: "#000",
        },

      },
      
    },
    
    scales: {
      x: {
        grid: {
          color: "#ccc", 
        },
        ticks: {
          font: {
            size: 12, 
            family: 'Lato, sans-serif', 
          },
          color: "#000", 
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#ccc", 
        },
        ticks: {
          font: {
            size: 12, 
            family: 'Lato, sans-serif', 
          },
          color: "#000", 
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 5, // Bordes redondeados en las barras
      },
    },
  };

  return (
    <>

      {/* Sección de resumen solo visible si isVisible es true */}
      {isVisible && !loading && ingresosPorEtiqueta.length > 0 && gastosPorEtiqueta.length > 0 && (
        
        <section className="resumen" id="resumen">

          <h2>Resumen por Etiquetas</h2>
          <div className="resumen-contenedor">
            <div className="resumen-seccion">
              <h3>Ingresos</h3>
              <div className="pie-chart-container">
                <Pie 
                  data={ingresosChartData} 
                  options={optionsPie} 
                />
              </div>
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
              <div className="pie-chart-container">
                <Pie 
                  data={gastosChartData} 
                  options={optionsPie} 
                />
              </div>
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
              
              <Bar data={comparativoChartData} options={optionsBar}  />
            </div>
          </div>

          <button className='hidden-form2' onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Ocultar Gráficas" : "Mostrar Gráficas"}
      </button>
      
        </section>
      )}
    </>
  );
};

export default ResumenPorEtiqueta;
