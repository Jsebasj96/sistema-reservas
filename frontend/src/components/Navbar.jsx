// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 p-4 text-white flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">Club "La Buena Vida"</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="hidden sm:inline">Bienvenido, {user.username}</span>
            <button onClick={handleLogout} className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
            <Link to="/register" className="hover:underline">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

