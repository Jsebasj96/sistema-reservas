import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ReservaContext } from './context/ReservaContext';
import { ServicioContext } from './context/ServicioContext';
import { PagoContext } from './context/PagoContext';
import { authService } from './services/authService';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reserva from './pages/Reserva';
import Pasadias from './pages/Pasadias';
import Servicios from './pages/Servicios';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [pago, setPago] = useState({});

  // Cargar datos del usuario logueado al iniciar la aplicación
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.me();
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener el usuario', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ReservaContext.Provider value={{ reservas, setReservas }}>
        <ServicioContext.Provider value={{ servicios, setServicios }}>
          <PagoContext.Provider value={{ pago, setPago }}>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reserva" element={<Reserva />} />
                <Route path="/pasadias" element={<Pasadias />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </PagoContext.Provider>
        </ServicioContext.Provider>
      </ReservaContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
