// src/components/Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HiHome } from 'react-icons/hi2';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/', { state: { message: 'Sesión cerrada exitosamente' } });
  };

  // Formatear fecha y hora: Ej. "11 May 2025, 14:23:45"
  const formatted = now.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <nav className="bg-green-700 p-4 text-white flex items-center">
      {/* Ícono-home */}
      <Link to="/" className="text-6xl">
        <HiHome />
      </Link>

      {/* Fecha y hora centradas */}
      <div className="flex-1 text-center text-sm md:text-base">
        {formatted}
      </div>

      {/* Botón cerrar sesión solo si hay user */}
      {user && (
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100 transition"
        >
          Cerrar sesión
        </button>
      )}
    </nav>
  );
};

export default Navbar;


