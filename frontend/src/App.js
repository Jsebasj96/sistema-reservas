import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Contexto para la autenticación
import { ReservaProvider } from './context/ReservaContext'; // Contexto para las reservas
import { ServicioProvider } from './context/ServicioContext'; // Contexto para los servicios
import { PagoProvider } from './context/PagoContext'; // Contexto para los pagos
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Lógica para cargar el usuario
      } catch (error) {
        console.error('Error al obtener el usuario', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <AuthProvider value={{ user, setUser }}>
      <ReservaProvider>  {/* Aquí envolvemos con el provider de Reserva */}
        <ServicioProvider> {/* Aquí envolvemos con el provider de Servicios */}
          <PagoProvider> {/* Aquí envolvemos con el provider de Pagos */}
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
          </PagoProvider>
        </ServicioProvider>
      </ReservaProvider>
    </AuthProvider>
  );
}

export default App;
