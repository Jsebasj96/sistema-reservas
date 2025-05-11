// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Servicios from './pages/Servicios';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ReservaProvider>
        <ServicioProvider>
          <PagoProvider>
            <Router>
              <Navbar />
              <Routes>
                {/* Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protegidas para usuario normal */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reserva"
                  element={
                    <PrivateRoute>
                      <Reserva />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/pasadias"
                  element={
                    <PrivateRoute>
                      <Pasadias />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/servicios"
                  element={
                    <PrivateRoute>
                      <Servicios />
                    </PrivateRoute>
                  }
                />

                {/* Protegida para admin */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                {/* Ruta 404 */}
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
