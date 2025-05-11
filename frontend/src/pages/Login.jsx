// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const { user, loading, login } = useContext(AuthContext);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirige al home
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLocalError(null);

    try {
      await login(email, password);
      // La redirección la hará el useEffect al actualizar `user`
    } catch (err) {
      console.error('Login error detalle:', err.response || err);
      // Extrae el mensaje del backend, o usa un genérico
      const msg = err.response?.data?.message || 'Error en el inicio de sesión';
      setLocalError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 border border-green-400 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 border border-green-400 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
        {/* Muestra el mensaje de error del backend */}
        {localError && (
          <p className="text-red-600 mt-2 text-center">{localError}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
