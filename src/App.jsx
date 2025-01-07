import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from '../firebase-config'; 
import { onAuthStateChanged } from 'firebase/auth'; // Importar correctamente desde firebase/auth
import { useState, useEffect } from 'react';

import VerticalNavbar from './components/VerticalNavbar/VerticalNavbar';
import Inicio from './components/Inicio/Home';
import Nueva from './components/Dashboard/Nueva';
import Gastos from './components/Gastos/Gastos'; // Componente Gastos
import Ingresos from './components/Ingresos/Ingresos';
import './index.css'


const App = () => {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando el estado de autenticación

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Si hay un usuario, actualizar el estado
      } else {
        setUser(null); // Si no hay usuario, actualizar el estado a null
      }
      setLoading(false); // Cambiar el estado de carga una vez que se haya evaluado la autenticación
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Mostrar mensaje de carga mientras se obtiene el estado de autenticación
  if (loading) {
    return <p>Cargando...</p>;
  }
 
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Mostrar la barra de navegación solo si el usuario está autenticado */}
        {user && <VerticalNavbar />}
        <div style={{ marginLeft: user ? '250px' : '0', width: '100%', border: '1px solid red' }}>
          <Routes>
            <Route path="/" element={user ? <Nueva user={user} /> : <Inicio />} />
            <Route path="/Nueva" element={<Nueva user={user} />} />
            <Route path="/Gastos" element={<Gastos />} />
            <Route path="/Ingresos" element={<Ingresos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
