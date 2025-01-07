import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase-config';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import FormularioIngresos from '../Formulario/Formulario-ingresos';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Ingresos.css';

const Ingresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ nombre: '', valor: '', fecha: '', etiquetas: '' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const ingresosRef = collection(db, 'usuarios', user.uid, 'ingresos');
        const unsubscribeSnapshot = onSnapshot(ingresosRef, (querySnapshot) => {
          const ingresosArray = [];
          querySnapshot.forEach((doc) => {
            ingresosArray.push({ id: doc.id, ...doc.data() });
          });
  
          // Aseguramos que la fecha esté correctamente ordenada en formato Timestamp
          ingresosArray.sort((a, b) => {
            if (b.fecha.seconds === a.fecha.seconds) {
              return b.fecha.nanoseconds - a.fecha.nanoseconds;
            }
            return b.fecha.seconds - a.fecha.seconds;
          });
  
          setIngresos(ingresosArray);
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
          <p>¿Estás seguro de que quieres eliminar este ingreso?</p>
          <button
            onClick={() => {
              deleteIngreso(id);
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

  const deleteIngreso = async (id) => {
    try {
      const ingresoRef = doc(db, 'usuarios', auth.currentUser.uid, 'ingresos', id);
      await deleteDoc(ingresoRef);
      toast.success('Ingreso eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el ingreso:', error);
      toast.error('Error al eliminar el ingreso');
    }
  };

  const handleEdit = (id, nombre, valor, fecha, etiquetas) => {
    setEditingId(id);

    const formattedDate = fecha ? new Date(fecha.seconds * 1000).toISOString().split('T')[0] : '';
    setEditValues({ nombre, valor, fecha: formattedDate, etiquetas: etiquetas.join(', ') });
  };

  const handleSaveEdit = async (id) => {
    const ingresoRef = doc(db, 'usuarios', auth.currentUser.uid, 'ingresos', id);

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
      await updateDoc(ingresoRef, {
        nombre,
        valor,
        fecha: fechaFirestore,
        etiquetas: etiquetasArray,
      });
      setEditingId(null);
      toast.success('Ingreso actualizado correctamente');
    } catch (e) {
      console.error('Error al actualizar el ingreso:', e);
      toast.error('Error al actualizar el ingreso');
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
    return ingresos.reduce((total, ingreso) => total + parseFloat(ingreso.valor), 0);
  };

  return (
    <section className="container-ingresos">
      <FormularioIngresos />
      <div className="ingresos-summary">
        <h3>Total de Ingresos: {formatCurrency(calcularTotal())}</h3>
      </div>
      <div className="ingresos-list">
        {loading ? (
          <p>Cargando ingresos...</p>
        ) : (
          ingresos.length > 0 ? (
            <ul>
              {ingresos.map((ingreso) => (
                <li key={ingreso.id}>
                  {editingId === ingreso.id ? (
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
                      <button onClick={() => handleSaveEdit(ingreso.id)}>Guardar</button>
                      <button onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <strong>{ingreso.nombre}</strong>: {formatCurrency(ingreso.valor)} - {new Date(ingreso.fecha.seconds * 1000).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      
                      {ingreso.etiquetas && ingreso.etiquetas.length > 0 && (
                        <div className="etiquetas">
                          <strong>Categoría: </strong> {ingreso.etiquetas.join(', ')}
                        </div>
                      )}

                      <button
                        onClick={() => handleDelete(ingreso.id)}
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
                        onClick={() => handleEdit(ingreso.id, ingreso.nombre, ingreso.valor, ingreso.fecha, ingreso.etiquetas)}
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
            <p>No tienes ingresos registrados.</p>
          )
        )}
      </div>

      <ToastContainer />
    </section>
  );
};

export default Ingresos;
