import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Reservas from "./components/Reservas";
import "./App.css";

// Componente para proteger rutas
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
          {/* Página de Login */}
          <Route path="/" element={<Login />} />

          {/* Página protegida de Reservas */}
          <Route
            path="/reservas"
            element={
              <PrivateRoute>
                <Reservas />
              </PrivateRoute>
            }
          />

          {/* Si la ruta no existe, redirige al login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;