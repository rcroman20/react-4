import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from '../firebase-config'; 
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js'; // Importar correctamente desde firebase/auth
import { useState, useEffect } from 'react';

import VerticalNavbar from './components/VerticalNavbar/VerticalNavbar';
import Inicio from './components/Inicio/Home';
import Main from './components/Dashboard/Main';
import Gastos from './components/Gastos/Gastos'; // Componente Gastos
import Ingresos from './components/Ingresos/Ingresos';
import About from './components/Pages/About';



import './index.css'


const App = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
      } else {
        setUser(null); 
      }
      setLoading(false); 
    });

    
    return () => unsubscribe();
  }, []);


  if (loading) {
    return <p>Cargando...</p>;
  }
 
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Mostrar la barra de navegación solo si el usuario está autenticado */}
        {user && <VerticalNavbar />}
        <div style={{ marginLeft: user ? '250px' : '0', width: '100%', }}>
          <Routes>
            <Route path="/" element={user ? <Main user={user} /> : <Inicio />} />
            <Route path="/Main" element={<Main user={user} />} />
            <Route path="/Gastos" element={<Gastos />} />
            <Route path="/Ingresos" element={<Ingresos />} />
            <Route path="/About" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
