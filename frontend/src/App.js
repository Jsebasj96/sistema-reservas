import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReservaProvider } from './context/ReservaContext';
import { ServicioProvider } from './context/ServicioContext';
import { PagoProvider } from './context/PagoContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Reserva from './pages/Reserva';
import Pasadias from './pages/Pasadias';
import Eventos from './pages/Eventos';
import Servicios from './pages/Servicios';
import ServicioDetalle from './pages/servicio/ServicioDetalle';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Promociones from './pages/Promociones';
import ChatbotModal from './components/ChatbotModal'; // Aquí sí importamos
import './styles/tailwind.css';
function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AuthProvider>
      <ReservaProvider>
        <ServicioProvider>
          <PagoProvider>
            <Router>
              {/* Navbar recibe el handler del chatbot */}
              <Navbar onToggleChatbot={() => setChatOpen(prev => !prev)} />

              {/* Rutas */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute><Dashboard /></PrivateRoute>}
                />
                <Route
                  path="/reserva"
                  element={<PrivateRoute><Reserva /></PrivateRoute>}
                />
                <Route
                  path="/pasadias"
                  element={<PrivateRoute><Pasadias /></PrivateRoute>}
                />
                <Route
                  path="/eventos"
                  element={<PrivateRoute><Eventos /></PrivateRoute>}
                />
                <Route
                  path="/servicios"
                  element={<PrivateRoute><Servicios /></PrivateRoute>}
                />
                <Route
                  path="/promociones"
                  element={<PrivateRoute><Promociones /></PrivateRoute>}
                />
                <Route
                  path="/servicios/:tipo"
                  element={<PrivateRoute><ServicioDetalle /></PrivateRoute>}
                />
                <Route
                  path="/admin"
                  element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Renderizar chatbot fuera del flujo de rutas */}
              {chatOpen && <ChatbotModal onClose={() => setChatOpen(false)} />}
            </Router>
          </PagoProvider>
        </ServicioProvider>
      </ReservaProvider>
    </AuthProvider>
  );
}

export default App;

