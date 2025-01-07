import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase-config';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import Formulario from '../Formulario/Formulario-gastos';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Gastos.css';

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ nombre: '', valor: '', fecha: '', etiquetas: '' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const gastosRef = collection(db, 'usuarios', user.uid, 'gastos');
        const unsubscribeSnapshot = onSnapshot(gastosRef, (querySnapshot) => {
          const gastosArray = [];
          querySnapshot.forEach((doc) => {
            gastosArray.push({ id: doc.id, ...doc.data() });
          });
  
          // Aseguramos que la fecha esté correctamente ordenada en formato Timestamp
          gastosArray.sort((a, b) => {
            if (b.fecha.seconds === a.fecha.seconds) {
              return b.fecha.nanoseconds - a.fecha.nanoseconds;
            }
            return b.fecha.seconds - a.fecha.seconds;
          });
  
          setGastos(gastosArray);
          setLoading(false);
        });
  
        return () => unsubscribeSnapshot();
      }
    });
  
    return () => unsubscribe();  // Cleanup en el retorno de useEffect
  }, []);  // Solo ejecutamos una vez cuando el componente se monta
  
  const handleDelete = (id) => {
    const idToast = toast.info(
      ({ closeToast }) => (
        <div>
          <p>¿Estás seguro de que quieres eliminar este gasto?</p>
          <button
            onClick={() => {
              deleteGasto(id);
              closeToast();
            }}
            style={{
              marginTop: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Confirmar
          </button>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const deleteGasto = async (id) => {
    try {
      const gastoRef = doc(db, 'usuarios', auth.currentUser.uid, 'gastos', id);
      await deleteDoc(gastoRef);
      toast.success('Gasto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
      toast.error('Error al eliminar el gasto');
    }
  };

  const handleEdit = (id, nombre, valor, fecha, etiquetas) => {
    setEditingId(id);

    const formattedDate = fecha ? new Date(fecha.seconds * 1000).toISOString().split('T')[0] : '';
    setEditValues({ nombre, valor, fecha: formattedDate, etiquetas: etiquetas.join(', ') });
  };

  const handleSaveEdit = async (id) => {
    const gastoRef = doc(db, 'usuarios', auth.currentUser.uid, 'gastos', id);

    const { nombre, valor, fecha, etiquetas } = editValues;
    const fechaTimestamp = new Date(fecha);

    if (isNaN(fechaTimestamp.getTime())) {
      toast.error('Fecha inválida');
      return;
    }

    const adjustedDate = new Date(
      fechaTimestamp.getUTCFullYear(),
      fechaTimestamp.getUTCMonth(),
      fechaTimestamp.getUTCDate(),
      12,
      0,
      0
    );

    const fechaFirestore = Timestamp.fromDate(adjustedDate);

    const etiquetasArray = etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    try {
      await updateDoc(gastoRef, {
        nombre,
        valor,
        fecha: fechaFirestore,
        etiquetas: etiquetasArray,
      });
      setEditingId(null);
      toast.success('Gasto actualizado correctamente');
    } catch (e) {
      console.error('Error al actualizar el gasto:', e);
      toast.error('Error al actualizar el gasto');
    }
  };

  const formatCurrency = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const calcularTotal = () => {
    return gastos.reduce((total, gasto) => total + parseFloat(gasto.valor), 0);
  };

  return (
    <section className="container-gastos">
      <Formulario />
      <div className="gastos-summary">
        <h3>Total de Gastos: {formatCurrency(calcularTotal())}</h3>
      </div>
      <div className="gastos-list">
        {loading ? (
          <p>Cargando gastos...</p>
        ) : (
          gastos.length > 0 ? (
            <ul>
              {gastos.map((gasto) => (
                <li key={gasto.id}>
                  {editingId === gasto.id ? (
                    <div className="edit-form-inline">
                      <input
                        type="text"
                        value={editValues.nombre}
                        onChange={(e) => setEditValues({ ...editValues, nombre: e.target.value })}
                      />
                      <input
                        type="number"
                        value={editValues.valor}
                        onChange={(e) => setEditValues({ ...editValues, valor: e.target.value })}
                      />
                      <input
                        type="date"
                        value={editValues.fecha}
                        onChange={(e) => setEditValues({ ...editValues, fecha: e.target.value })}
                      />
                      <input
                        type="text"
                        value={editValues.etiquetas}
                        onChange={(e) => setEditValues({ ...editValues, etiquetas: e.target.value })}
                        placeholder="Etiquetas separadas por coma"
                      />
                      <button onClick={() => handleSaveEdit(gasto.id)}>Guardar</button>
                      <button onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <strong>{gasto.nombre}</strong>: {formatCurrency(gasto.valor)} - {new Date(gasto.fecha.seconds * 1000).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      
                      {gasto.etiquetas && gasto.etiquetas.length > 0 && (
                        <div className="etiquetas">
                          <strong>Categorías: </strong> {gasto.etiquetas.join(', ')}
                        </div>
                      )}

                      <button
                        onClick={() => handleDelete(gasto.id)}
                        style={{
                          marginLeft: '10px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <i className="fas fa-trash-alt" style={{ color: 'red', fontSize: '16px' }}></i>
                      </button>
                      <button
                        onClick={() => handleEdit(gasto.id, gasto.nombre, gasto.valor, gasto.fecha, gasto.etiquetas)}
                        style={{
                          marginLeft: '10px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <i className="fas fa-edit" style={{ color: 'blue', fontSize: '16px' }}></i>
                      </button>
                    </>
                  )}
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
