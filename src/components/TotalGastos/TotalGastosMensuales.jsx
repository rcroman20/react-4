import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase-config";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import "./Total.css";

// Registrar componentes de ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TotalMensuales = () => {
  const [gastosMensuales, setGastosMensuales] = useState(new Array(12).fill(0));
  const [ingresosMensuales, setIngresosMensuales] = useState(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Colección de gastos
        const gastosRef = collection(db, "usuarios", user.uid, "gastos");
        const ingresosRef = collection(db, "usuarios", user.uid, "ingresos"); // Nueva colección para ingresos

        // Leer gastos
        const unsubscribeGastos = onSnapshot(gastosRef, (querySnapshot) => {
          const gastosPorMes = new Array(12).fill(0);
          querySnapshot.forEach((doc) => {
            const gasto = doc.data();
            const fecha = gasto.fecha;
            const gastoDate = new Date(fecha.seconds * 1000);
            const mes = gastoDate.getMonth();
            gastosPorMes[mes] += parseFloat(gasto.valor);
          });
          setGastosMensuales(gastosPorMes);
        });

        // Leer ingresos
        const unsubscribeIngresos = onSnapshot(ingresosRef, (querySnapshot) => {
          const ingresosPorMes = new Array(12).fill(0);
          querySnapshot.forEach((doc) => {
            const ingreso = doc.data();
            const fecha = ingreso.fecha;
            const ingresoDate = new Date(fecha.seconds * 1000);
            const mes = ingresoDate.getMonth();
            ingresosPorMes[mes] += parseFloat(ingreso.valor);
          });
          setIngresosMensuales(ingresosPorMes);
        });

        setLoading(false);

        return () => {
          unsubscribeGastos();
          unsubscribeIngresos();
        };
      }
    });

    return () => unsubscribe();
  }, []);

  // Configuración de la gráfica
  const data = {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    datasets: [
      {
        label: "Gastos Mensuales (COP)",
        data: gastosMensuales,
        backgroundColor: "#ff0000",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Ingresos Mensuales (COP)",
        data: ingresosMensuales,
        backgroundColor: "#229756",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 18, 
            family: 'Lato, sans-serif',
          },
          color: "#000",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#000",
        bodyColor: "#fff",
        bodyFont: {
          size: 16, 
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#ccc",
          borderColor: "#ccc", // Color del borde del gráfico
        },
        ticks: {
          font: {
            size: 12,  // Cambia el tamaño de la fuente de las etiquetas en el eje X
            family: 'Lato, sans-serif',
          },
          color: "#000",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#ccc",
          borderColor: "#ccc",
        },
        ticks: {
          font: {
            size: 12,  // Cambia el tamaño de la fuente de las etiquetas en el eje Y
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
    <div className="total-mensuales" id="ingresos-anuales">
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <h3>Ingresos y Gastos Mensuales (Enero - Diciembre)</h3>
          
          <Bar data={data} options={options} height={window.innerHeight * 0.3} style={{ width: "100%", height: "300px" }}/>
          </>
      )}
    </div>
  );
};

export default TotalMensuales;
