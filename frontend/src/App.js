import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Reservas from "./components/Reservas";
import Pago from "./components/Pago"; // Importamos la nueva página
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

// Componente para redirigir si ya está autenticado
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/reservas" /> : children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Sistema de Reservas</h1>
        
        {/* Contenedor de notificaciones */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        
        <Routes>
          {/* Si ya está logueado, redirige directamente a reservas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Página de registro, también redirige si ya tiene sesión */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Página de reservas protegida */}
          <Route
            path="/reservas"
            element={
              <PrivateRoute>
                <Reservas />
              </PrivateRoute>
            }
          />

          {/* Redirige cualquier ruta no existente al login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Rutas protegidas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Sistema de Reservas</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/reservas"
            element={
              <PrivateRoute>
                <Reservas />
              </PrivateRoute>
            }
          />
          <Route
            path="/pago/:id"
            element={
              <PrivateRoute>
                <Pago />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;