import React from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css'; // Asegúrate de que el nombre del archivo sea el correcto

const Home = () => {
  const navigate = useNavigate();

  const acciones = [
    { icon: '🛏️', label: 'Habitaciones', ruta: '/habitaciones' },
    { icon: '🏊', label: 'Pasadía', ruta: '/pasadia' },
    { icon: '🍽️', label: 'Restaurante', ruta: '/restaurante' },
    { icon: '🍹', label: 'Bar', ruta: '/bar' },
    { icon: '📦', label: 'Inventario', ruta: '/inventario' },
    { icon: '📅', label: 'Reservas', ruta: '/reservas' }
  ];

  return (
    <div className="inicio-container">
      <h1>Bienvenido al Club Campestre "La Buena Vida"</h1>
      <div className="auth-buttons">
        <button className="btn" onClick={() => navigate('/login')}>Iniciar Sesión</button>
        <button className="btn" onClick={() => navigate('/register')}>Registrarse</button>
      </div>
      <h2>¿Qué deseas hacer?</h2>
      <div className="acciones-grid">
        {acciones.map((accion, idx) => (
          <div className="accion" key={idx} onClick={() => navigate(accion.ruta)}>
            <i>{accion.icon}</i>
            <span>{accion.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;


