// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reemplaza con tu lógica real
    if (username === 'admin' && password === 'admin123') {
      const fakeToken = '1234567890abcdef';
      localStorage.setItem('token', fakeToken);
      setUser({ username }); // Simula el usuario
      navigate('/dashboard');
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 border border-green-400 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-green-400 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
