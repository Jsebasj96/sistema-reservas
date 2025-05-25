import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HiHome, HiArrowLeft } from 'react-icons/hi2';
import { FaRobot } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/', { state: { message: 'Sesión cerrada exitosamente' } });
  };

  const formatted = now.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleOpenChatbotWindow = () => {
    window.open(
      '/chatbot',
      '_blank',
      'width=400,height=600,resizable=yes,scrollbars=yes'
    );
  };

  return (
    <nav className="bg-green-700 p-4 text-white flex items-center gap-4 relative z-40">
      {location.pathname !== '/' && (
        <button
          onClick={() => navigate(-1)}
          className="hover:text-gray-300 transition"
          title="Volver atrás"
        >
          <HiArrowLeft size={32} />
        </button>
      )}

      <Link to="/" className="hover:text-gray-300 transition">
        <HiHome size={40} />
      </Link>

      <div className="flex-1 text-center text-sm md:text-base">
        {formatted}
      </div>

      <button
        onClick={handleOpenChatbotWindow}
        className="text-white hover:text-gray-300 transition"
        title="Abrir asistente virtual"
      >
        <FaRobot size={30} />
      </button>

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
